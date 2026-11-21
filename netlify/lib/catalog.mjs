/* ============================================================
   Catálogo — lê a MESMA fonte do site: assets/data.js
   Nada de base duplicada: o arquivo é executado num contexto
   isolado e devolve o objeto LR (brand, products, collections).
   ============================================================ */
import vm from 'node:vm';
import fs from 'node:fs/promises';
import path from 'node:path';

const CACHE_MS = 60_000;
let cache = null; // { at, catalog }

/** Executa o conteúdo de assets/data.js e devolve { brand, products, collections }. */
export function parseCatalog(source) {
  const ctx = {};
  ctx.window = ctx; // data.js usa window.LR e LR como global, igual ao navegador
  vm.createContext(ctx);
  vm.runInContext(source, ctx, { timeout: 1000, filename: 'data.js' });
  const LR = ctx.LR;
  if (!LR || !Array.isArray(LR.products)) throw new Error('assets/data.js não definiu LR.products');
  // Cópia "pura" (JSON) para não carregar funções nem protótipos do contexto isolado
  return JSON.parse(JSON.stringify({ brand: LR.brand || {}, products: LR.products, collections: LR.collections || [] }));
}

/**
 * Carrega o catálogo publicado. Ordem:
 * 1) arquivo incluído no bundle da função (netlify.toml → included_files)
 * 2) o próprio site publicado (origin + /assets/data.js)
 * Cache curto (60 s) para refletir mudanças de preço/status sem novo deploy da função.
 */
export async function loadCatalog({ origin, now = Date.now() } = {}) {
  if (cache && now - cache.at < CACHE_MS) return cache.catalog;
  let source = null;
  for (const p of [path.resolve(process.cwd(), 'assets/data.js'), path.resolve(process.cwd(), '../assets/data.js')]) {
    try { source = await fs.readFile(p, 'utf8'); break; } catch { /* tenta o próximo */ }
  }
  if (!source && origin) {
    const res = await fetch(new URL('/assets/data.js', origin), { signal: AbortSignal.timeout(5000) });
    if (!res.ok) throw new Error(`Falha ao baixar o catálogo (${res.status})`);
    source = await res.text();
  }
  if (!source) throw new Error('Catálogo indisponível');
  const catalog = parseCatalog(source);
  cache = { at: now, catalog };
  return catalog;
}

export function _resetCatalogCache() { cache = null; }

/* ---------- Funções de consulta (somente leitura) ---------- */

const norm = s => String(s ?? '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
const STOP = new Set(['de', 'da', 'do', 'das', 'dos', 'e', 'com', 'para', 'pra', 'um', 'uma', 'o', 'a', 'os', 'as', 'em', 'no', 'na', 'relogio', 'relogios', 'modelo', 'modelos', 'quero', 'tem', 'voces']);

const fmt = n => n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

export const STATUS_TEXT = {
  disponivel: 'Disponível para pedido. A loja não informa quantidade em estoque; a confirmação final é feita no atendimento pelo WhatsApp.',
  encomenda: 'Sob encomenda. Prazo combinado no atendimento pelo WhatsApp.',
  esgotado: 'Esgotado. Não pode ser adicionado ao carrinho; o cliente pode pedir aviso de reposição pelo WhatsApp.',
};

const url = p => `produto.html?id=${encodeURIComponent(p.id)}`;

/** Resumo enviado ao modelo e usado nos cards (preço e status sempre do catálogo). */
export function summary(p) {
  return {
    id: p.id, codigo: p.code, nome: p.name, descricao_curta: p.subtitle, marca: p.brand,
    pulseira: p.category, cores: p.colors, preco: p.price, preco_formatado: fmt(p.price),
    status: p.status, disponibilidade: STATUS_TEXT[p.status] || 'Consultar no atendimento.',
    pode_adicionar_ao_carrinho: p.status !== 'esgotado', url: url(p),
  };
}

export function details(p) {
  return { ...summary(p), descricao: p.desc, especificacoes: p.specs, tamanhos: p.sizes, imagem: p.images?.[0] || null, total_fotos: p.images?.length || 0 };
}

export function findById(catalog, id) {
  if (typeof id !== 'string') return null;
  return catalog.products.find(p => p.id === id || norm(p.code) === norm(id)) || null;
}

function haystack(p) {
  return norm([p.name, p.subtitle, p.brand, p.category, p.code, p.desc, ...(p.colors || []), ...Object.entries(p.specs || {}).flat()].join(' '));
}

/**
 * Busca com filtros. Todos os parâmetros são opcionais.
 * texto: palavras livres (nome, cor, material, característica)
 */
export function searchProducts(catalog, { texto, preco_min, preco_max, pulseira, marca, incluir_esgotados = true, ordenar } = {}) {
  let list = catalog.products.slice();
  if (Number.isFinite(preco_min)) list = list.filter(p => p.price >= preco_min);
  if (Number.isFinite(preco_max)) list = list.filter(p => p.price <= preco_max);
  if (pulseira) list = list.filter(p => norm(p.category) === norm(pulseira));
  if (marca) list = list.filter(p => norm(p.brand).includes(norm(marca)));
  if (!incluir_esgotados) list = list.filter(p => p.status !== 'esgotado');

  const tokens = norm(texto).split(/[^a-z0-9]+/).filter(t => t.length > 1 && !STOP.has(t));
  if (tokens.length) {
    const scored = list.map(p => { const h = haystack(p); return { p, score: tokens.filter(t => h.includes(t)).length }; }).filter(x => x.score > 0);
    scored.sort((a, b) => b.score - a.score);
    list = scored.map(x => x.p);
  }
  if (ordenar === 'menor_preco') list.sort((a, b) => a.price - b.price);
  if (ordenar === 'maior_preco') list.sort((a, b) => b.price - a.price);
  return list;
}

export function storeInfo(catalog) {
  const b = catalog.brand;
  return { nome: b.name, cidade: b.city, atendimento: b.address, horario: b.hours, instagram: b.instagram };
}
