/* ============================================================
   Servidor local: site estático + POST /api/chat (mesmo código
   da Netlify Function). Uso:
     npm run dev                      -> modo demonstração (sem IA)
     ANTHROPIC_API_KEY=... npm run dev -> com o Claude de verdade
   Abra http://localhost:8888
   ============================================================ */
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { handleChat } from '../netlify/lib/http.mjs';
import { loadCatalog, searchProducts } from '../netlify/lib/catalog.mjs';
import { createRateLimiter } from '../netlify/lib/agent.mjs';
import { getProvider, classifyError } from '../netlify/lib/providers/index.mjs';

const root = path.resolve(import.meta.dirname, '..');
const PORT = Number(process.env.PORT || 8888);
const TYPES = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.jpg': 'image/jpeg', '.png': 'image/png', '.svg': 'image/svg+xml' };

/* Provedor de demonstração: usa as ferramentas reais, sem IA, para testar a interface */
const demoProvider = {
  name: 'demo',
  async run({ history, executeTool }) {
    const q = history[history.length - 1].content;
    if (/atendente|humano|pessoa|desconto/i.test(q)) { executeTool('atendimento_humano', {}); return { text: '(modo demonstração) Vou te passar para um atendente no WhatsApp.' }; }
    const max = Number((q.match(/R\$\s*(\d+)/) || [])[1]) || undefined;
    let r = executeTool('buscar_produtos', { texto: max ? '' : q, preco_max: max, incluir_esgotados: true });
    if (!r.total) r = executeTool('buscar_produtos', {});
    executeTool('mostrar_produtos', { ids: r.produtos.slice(0, 3).map(p => p.id) });
    return { text: `(modo demonstração, sem IA) Encontrei ${r.total} modelo(s) no catálogo.` };
  },
};
const provider = getProvider(process.env) || demoProvider;
const rateLimit = createRateLimiter({ perMinute: 30, perDay: 1000 });

http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://localhost:${PORT}`);
  if (url.pathname === '/api/chat') {
    const chunks = []; for await (const c of req) chunks.push(c);
    const request = new Request(url, { method: req.method, headers: req.headers, body: req.method === 'POST' ? Buffer.concat(chunks) : undefined });
    const out = await handleChat(request, { ip: req.socket.remoteAddress, provider, loadCatalog, rateLimit, classifyError });
    res.writeHead(out.status, Object.fromEntries(out.headers)); res.end(await out.text()); return;
  }
  let file = path.normalize(path.join(root, decodeURIComponent(url.pathname === '/' ? '/index.html' : url.pathname)));
  const isPublic = file.startsWith(path.join(root, 'assets')) || (path.dirname(file) === root && file.endsWith('.html'));
  if (!isPublic || !fs.existsSync(file)) { res.writeHead(404, { 'content-type': TYPES['.html'] }); fs.createReadStream(path.join(root, '404.html')).pipe(res); return; }
  res.writeHead(200, { 'content-type': TYPES[path.extname(file)] || 'application/octet-stream' });
  fs.createReadStream(file).pipe(res);
}).listen(PORT, () => console.log(`LU.RICOS em http://localhost:${PORT} · assistente: ${provider.name}${provider.model ? ' (' + provider.model + ')' : ''}`));
