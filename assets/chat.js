/* ============================================================
   LU.RICOS — assistente de vendas (widget)
   - Conversa com /api/chat (Netlify Function; a chave da IA
     nunca vem para o navegador).
   - Cards usam os dados de LR.products desta página (data.js):
     preço e status exibidos são sempre os do site.
   - "Adicionar ao carrinho" chama LR.cart.add(), o mesmo
     carrinho, subtotal e checkout pelo WhatsApp do site.
   Carregar DEPOIS de data.js e app.js.
   ============================================================ */
(() => {
  'use strict';
  if (!window.LR || !LR.products || window.__lrChat) return;
  window.__lrChat = true;

  const ENDPOINT = (LR.chat && LR.chat.endpoint) || '/api/chat';
  const STORE_KEY = 'lr_chat';
  const MAX_HISTORY = 14;
  const B = LR.brand;
  const html = document.documentElement;
  const esc = s => String(s).replace(/[&<>"']/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]));
  const wa = text => `https://wa.me/${B.whatsapp}?text=${encodeURIComponent(text)}`;
  const price = n => (LR.format && LR.format.price ? LR.format.price(n) : n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }));
  const store = {
    get() { try { return JSON.parse(sessionStorage.getItem(STORE_KEY)) || []; } catch { return []; } },
    set(v) { try { sessionStorage.setItem(STORE_KEY, JSON.stringify(v.slice(-40))); } catch {} },
  };

  const forSale = LR.products.filter(p => p.status !== 'esgotado').length;
  const GREETING = `Oi, sou o LU.BOT. Conheço os ${forSale} relógios à venda na vitrine, com preço e estoque de hoje. É para você ou para presente?`;
  const SUGGESTIONS = [
    'Relógios até R$ 200',
    'Um presente para homem',
    'Aço ou couro: qual escolher?',
    'Qual mostra a data e o dia da semana?',
  ];
  const STATUS = { disponivel: 'Disponível', encomenda: 'Sob encomenda', esgotado: 'Esgotado' };

  /* Conversa: { role: 'user'|'assistant', content, products?: [id], handoff?: bool, error?: bool } */
  let thread = store.get();
  let busy = false;


  /* ---------- Botão: cabeça de relógio de pulso ----------
     Caixa de aço com alças, luneta canelada dourada, mostrador azul
     com reflexo solar, índices em bastão, data do dia e coroa.
     Centro do mostrador em (40, 46) num viewBox de 80 x 92. */
  function watchSVG() {
    const C = [40, 46], rot = (a) => `rotate(${a} ${C[0]} ${C[1]})`;
    const flutes = Array.from({ length: 90 }, (_, i) => `<line x1="40" y1="23.2" x2="40" y2="26.2" stroke="${i % 2 ? '#7c5d22' : '#fbe7ae'}" stroke-opacity="${i % 2 ? .55 : .75}" stroke-width=".55" transform="${rot(i * 4)}"/>`).join('');
    const rays = Array.from({ length: 36 }, (_, i) => `<line x1="40" y1="46" x2="40" y2="25" stroke="#ffffff" stroke-opacity="${i % 2 ? .05 : .11}" stroke-width="2.4" transform="${rot(i * 10)}"/>`).join('');
    const idx = Array.from({ length: 12 }, (_, i) => i === 3 ? '' : i === 0
      ? `<g transform="${rot(0)}"><rect x="37.6" y="26" width="1.7" height="6" rx=".4" fill="#f1f1ec"/><rect x="40.7" y="26" width="1.7" height="6" rx=".4" fill="#f1f1ec"/></g>`
      : `<rect x="39.15" y="26.2" width="1.7" height="${i % 3 ? 4 : 5.4}" rx=".4" fill="#f1f1ec" transform="${rot(i * 30)}"/>`).join('');
    const day = new Date().toLocaleDateString('pt-BR', { timeZone: 'America/Sao_Paulo', day: 'numeric' });
    return `<svg viewBox="0 9 80 74" focusable="false">
  <defs>
    <radialGradient id="lrc-dial-g" cx="40%" cy="34%" r="72%"><stop offset="0" stop-color="#3a68d8"/><stop offset=".45" stop-color="#1f3e8a"/><stop offset="1" stop-color="#0a1230"/></radialGradient>
    <linearGradient id="lrc-steel" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#f2f3f4"/><stop offset=".45" stop-color="#9ea2a8"/><stop offset=".7" stop-color="#d9dbde"/><stop offset="1" stop-color="#5d6167"/></linearGradient>
    <linearGradient id="lrc-gold" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#f6e2a6"/><stop offset=".5" stop-color="#b88a3a"/><stop offset="1" stop-color="#6e5220"/></linearGradient>
    <linearGradient id="lrc-glass" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".34"/><stop offset=".38" stop-color="#fff" stop-opacity="0"/></linearGradient>
    <clipPath id="lrc-dial-clip"><circle cx="40" cy="46" r="19.3"/></clipPath>
  </defs>
  <!-- alças da pulseira -->
  <path d="M28.5 25 L30.5 11 H49.5 L51.5 25 Z" fill="url(#lrc-steel)"/>
  <path d="M28.5 67 L30.5 81 H49.5 L51.5 67 Z" fill="url(#lrc-steel)"/>
  <path d="M30.6 12.4 H49.4 M30.6 79.6 H49.4" stroke="#2c2f33" stroke-opacity=".5" stroke-width=".9"/>
  <!-- coroa serrilhada -->
  <rect x="63.4" y="41.6" width="5.4" height="8.8" rx="1.3" fill="url(#lrc-steel)"/>
  <path d="M64.4 42.6 V49.4 M65.7 42.6 V49.4 M67 42.6 V49.4 M68.2 42.6 V49.4" stroke="#3c3f44" stroke-opacity=".55" stroke-width=".55"/>
  <!-- caixa e luneta canelada -->
  <circle cx="40" cy="46" r="25.6" fill="url(#lrc-steel)"/>
  <circle cx="40" cy="46" r="24.1" fill="#2c2f33"/>
  <circle cx="40" cy="46" r="23.6" fill="url(#lrc-gold)"/>
  ${flutes}
  <circle cx="40" cy="46" r="20.1" fill="#5c451b"/>
  <circle cx="40" cy="46" r="19.6" fill="#0a1230"/>
  <!-- mostrador azul com reflexo solar -->
  <g clip-path="url(#lrc-dial-clip)"><circle cx="40" cy="46" r="19.3" fill="url(#lrc-dial-g)"/>${rays}</g>
  ${idx}
  <!-- janela da data, às 3 horas -->
  <rect x="51.2" y="43.3" width="6.4" height="5.4" rx=".6" fill="#f4f4f0" stroke="#b88a3a" stroke-width=".6"/>
  <text x="54.4" y="47.6" text-anchor="middle" font-family="Archivo, Arial, sans-serif" font-size="4.1" font-weight="700" fill="#111214">${day}</text>
  <text x="40" y="36.6" text-anchor="middle" font-family="Archivo, Arial, sans-serif" font-stretch="125%" font-size="3.3" font-weight="700" letter-spacing=".15" fill="#f1f1ec">LU.BOT</text>
  <!-- ponteiros -->
  <path class="lrc-h" d="M40 46 L38.8 44.5 L40 34 L41.2 44.5 Z" fill="#f1f1ec" stroke="#0a1230" stroke-width=".3"/>
  <path class="lrc-m" d="M40 46 L39.1 44.2 L40 28.2 L40.9 44.2 Z" fill="#f1f1ec" stroke="#0a1230" stroke-width=".3"/>
  <g class="lrc-sec"><line x1="40" y1="50" x2="40" y2="28" stroke="#e0b252" stroke-width=".7" stroke-linecap="round"/><circle cx="40" cy="46" r="1.4" fill="#e0b252"/></g>
  <circle cx="40" cy="46" r=".55" fill="#0a1230"/>
  <!-- vidro: reflexo que passa -->
  <g clip-path="url(#lrc-dial-clip)"><circle cx="40" cy="46" r="19.3" fill="url(#lrc-glass)"/></g>
</svg>`;
  }

  /* ---------- DOM ---------- */
  const root = document.createElement('div');
  root.className = 'lrc';
  root.innerHTML = `
<button class="lrc-launcher" type="button" aria-haspopup="dialog" aria-expanded="false" aria-controls="lrc-panel" aria-label="Abrir o LU.BOT, assistente com IA (arraste para mover)" title="LU.BOT · assistente com IA — clique para conversar, arraste para mover">
  <span class="lrc-dial" aria-hidden="true">${watchSVG()}</span>
  <span class="lrc-cap"><span class="lrc-cap-hole" aria-hidden="true"></span><span class="lrc-cap-roll"><span class="lrc-cap-text">LU.BOT</span><span class="lrc-cap-hint">Pergunte</span></span></span>
</button>
<section class="lrc-panel" id="lrc-panel" role="dialog" aria-modal="false" aria-label="Assistente da loja" aria-hidden="true">
  <header class="lrc-head">
    <span class="lrc-bezel" aria-hidden="true"></span>
    <div class="lrc-head-row">
      <div class="lrc-id">
        <div class="lrc-title">LU<span class="lr-dot">.</span>BOT</div>
        <div class="lrc-sub"><i aria-hidden="true"></i>Consultor de relógios · com IA</div>
      </div>
      <div class="lrc-head-actions">
        <button class="lrc-icon-btn" type="button" data-lrc-reset title="Nova conversa" aria-label="Nova conversa"><svg viewBox="0 0 20 20" aria-hidden="true"><path d="M4.5 10a5.5 5.5 0 1 0 1.7-4" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><path d="M4 3.5v3.2h3.2" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg></button>
        <button class="lrc-icon-btn" type="button" data-lrc-close aria-label="Fechar assistente"><svg viewBox="0 0 20 20" aria-hidden="true"><path d="M5.5 5.5l9 9M14.5 5.5l-9 9" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg></button>
      </div>
    </div>
    <p class="lrc-hours">Atendimento humano · ${esc(B.hours)}</p>
  </header>
  <div class="lrc-body" data-lrc-body data-scroll-native></div>
  <p class="sr-only" aria-live="polite" data-lrc-live></p>
  <footer class="lrc-foot">
    <form class="lrc-form" data-lrc-form>
      <label class="sr-only" for="lrc-input">Sua mensagem</label>
      <textarea class="lrc-input" id="lrc-input" rows="1" maxlength="600" placeholder="Pergunte sobre nossos relógios…" autocomplete="off"></textarea>
      <button class="lrc-send" type="submit" aria-label="Enviar mensagem" disabled><span class="lrc-crown" aria-hidden="true"></span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M6 12h12M13 7l5 5-5 5"/></svg></button>
    </form>
    <div class="lrc-foot-row">
      <p class="lrc-note">Respostas com IA. Preço e estoque confirmados no atendimento.</p>
      <a class="lrc-human" href="${wa('Olá! Vim pelo assistente do site e quero falar com um atendente.')}" target="_blank" rel="noopener">Falar com uma pessoa</a>
    </div>
  </footer>
</section>`;
  document.body.appendChild(root);

  const $ = s => root.querySelector(s);
  const launcher = $('.lrc-launcher'), panel = $('.lrc-panel'), body = $('[data-lrc-body]');
  const form = $('[data-lrc-form]'), input = $('#lrc-input'), send = $('.lrc-send');

  /* ---------- Abrir / fechar ---------- */
  let isOpen = false;
  function open() {
    if (isOpen) return; isOpen = true;
    html.classList.add('lrc-open'); panel.setAttribute('aria-hidden', 'false'); launcher.setAttribute('aria-expanded', 'true');
    render(); setTimeout(() => input.focus({ preventScroll: true }), 50);
  }
  function close() {
    if (!isOpen) return; isOpen = false;
    html.classList.remove('lrc-open'); panel.setAttribute('aria-hidden', 'true'); launcher.setAttribute('aria-expanded', 'false');
    if (panel.contains(document.activeElement)) launcher.focus({ preventScroll: true });
  }
  /* ---------- Mostrador: hora real ---------- */
  const handH = $('.lrc-h'), handM = $('.lrc-m'), handS = $('.lrc-sec');
  function tick() {
    const d = new Date(), m = d.getMinutes() + d.getSeconds() / 60, h = (d.getHours() % 12) + m / 60;
    handH.setAttribute('transform', `rotate(${h * 30} 40 46)`);
    handM.setAttribute('transform', `rotate(${m * 6} 40 46)`);
  }
  const d0 = new Date();
  handS.style.setProperty('--sec-delay', `-${d0.getSeconds() + d0.getMilliseconds() / 1000}s`);
  tick(); setInterval(tick, 15_000);

  const hhmm = d => d.toLocaleTimeString('pt-BR', { timeZone: 'America/Sao_Paulo', hour: '2-digit', minute: '2-digit' });

  /* ---------- Botão arrastável (mouse e toque) ---------- */
  const POS_KEY = 'lr_chat_pos';
  const MARGIN = 10;
  const topLimit = () => (parseFloat(getComputedStyle(html).getPropertyValue('--header-h')) || 64) + MARGIN; // não cobre o cabeçalho
  let pos = null;
  try { const p = JSON.parse(localStorage.getItem(POS_KEY)); if (p && Number.isFinite(p.x) && Number.isFinite(p.y)) pos = p; } catch {}
  function clamp(p) {
    const w = launcher.offsetWidth, h = launcher.offsetHeight;
    return { x: Math.min(Math.max(MARGIN, p.x), innerWidth - w - MARGIN), y: Math.min(Math.max(topLimit(), p.y), innerHeight - h - MARGIN) };
  }
  function place() {
    // Padrão: lado direito, acima do canto (onde fica o selo do Netlify)
    if (!pos) pos = { x: innerWidth - launcher.offsetWidth - 18, y: innerHeight - launcher.offsetHeight - Math.min(130, innerHeight * .16) };
    pos = clamp(pos);
    launcher.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0)`;
    html.classList.toggle('lrc-left', pos.x + launcher.offsetWidth / 2 < innerWidth / 2);
  }
  place(); launcher.classList.add('is-ready');
  addEventListener('resize', place);

  let drag = null, suppressClick = false;
  launcher.addEventListener('pointerdown', e => {
    if (e.button !== 0) return;
    drag = { id: e.pointerId, sx: e.clientX, sy: e.clientY, x: pos.x, y: pos.y, moved: false };
    launcher.setPointerCapture(e.pointerId);
  });
  launcher.addEventListener('pointermove', e => {
    if (!drag || e.pointerId !== drag.id) return;
    const dx = e.clientX - drag.sx, dy = e.clientY - drag.sy;
    if (!drag.moved && Math.hypot(dx, dy) < 6) return; // toque curto = clique
    drag.moved = true; launcher.classList.add('is-dragging');
    pos = { x: drag.x + dx, y: drag.y + dy }; place();
  });
  const endDrag = e => {
    if (!drag || e.pointerId !== drag.id) return;
    const moved = drag.moved;
    launcher.classList.remove('is-dragging'); drag = null;
    if (moved) {
      // Foi arraste: salva a posição e ignora o "click" que o navegador pode disparar em seguida
      suppressClick = true; setTimeout(() => { suppressClick = false; }, 350);
      try { localStorage.setItem(POS_KEY, JSON.stringify(pos)); } catch {}
    } else if (e.type === 'pointerup') {
      open(); // toque/clique curto (no celular o navegador nem sempre dispara "click" após o toque)
    }
  };
  launcher.addEventListener('pointerup', endDrag);
  launcher.addEventListener('pointercancel', endDrag);
  // Teclado (Enter/Espaço) e leitores de tela chegam por aqui
  launcher.addEventListener('click', e => { if (suppressClick) { e.preventDefault(); return; } open(); });
  $('[data-lrc-close]').addEventListener('click', close);
  $('[data-lrc-reset]').addEventListener('click', () => { if (busy) return; thread = []; store.set(thread); render(); input.focus(); });
  addEventListener('keydown', e => { if (e.key === 'Escape' && isOpen) close(); });
  // Menu ou carrinho do site abriram (travam a página): o chat sai da frente
  new MutationObserver(() => { if (html.classList.contains('is-locked')) close(); }).observe(html, { attributes: true, attributeFilter: ['class'] });

  /* ---------- Renderização ---------- */
  // Formatação mínima e segura: escapa tudo, depois aplica **negrito**
  const fmtText = s => esc(s).replace(/\*\*([^*\n]{1,120})\*\*/g, '<strong>$1</strong>');

  function cardHTML(p) {
    const out = p.status === 'esgotado';
    const actions = out
      ? `<a class="lrc-link" href="produto.html?id=${encodeURIComponent(p.id)}">Ver detalhes</a><a class="lrc-add" href="${wa(`Olá! Quero ser avisado quando ${p.code} ${p.name} voltar.`)}" target="_blank" rel="noopener">Avise-me</a>`
      : `<a class="lrc-link" href="produto.html?id=${encodeURIComponent(p.id)}">Ver detalhes</a><button class="lrc-add" type="button" data-lrc-add="${esc(p.id)}">Adicionar ao carrinho</button>`;
    return `<article class="lrc-card">
  <span class="lrc-tag-hole" aria-hidden="true"></span>
  <a class="lrc-card-img" href="produto.html?id=${encodeURIComponent(p.id)}" tabindex="-1"><img src="${esc(/assets\/img\/relogios\/[^/]+\.jpg$/.test(p.images[0]) ? p.images[0].replace(/\.jpg$/, '-600.jpg') : p.images[0])}" alt="${esc(p.name)}" loading="lazy"></a>
  <div class="lrc-card-info">
    <span class="lrc-card-code">${esc(p.code)} · ${esc(p.brand || p.category)}</span>
    <span class="lrc-card-name">${esc(p.name)}</span>
    <span class="lrc-card-sub">${esc(p.subtitle)}</span>
    <div class="lrc-card-row"><span class="lrc-card-price">${price(p.price)}</span><span class="lrc-card-status${out ? ' is-out' : ''}">${STATUS[p.status] || ''}</span></div>
  </div>
  <div class="lrc-card-actions">${actions}</div>
</article>`;
  }

  const stamp = (who, t) => `<span class="lrc-stamp">${who}${t ? ` · ${hhmm(new Date(t))}` : ''}</span>`;
  function render() {
    const parts = [`<div class="lrc-msg is-bot">${stamp('LU.BOT', thread[0] ? thread[0].t : Date.now())}<div class="lrc-text">${fmtText(GREETING)}</div></div>`];
    for (const m of thread) {
      const user = m.role === 'user';
      parts.push(`<div class="lrc-msg ${user ? 'is-user' : 'is-bot'}${m.error ? ' is-error' : ''}">${stamp(user ? 'Você' : 'LU.BOT', m.t)}<div class="lrc-text">${fmtText(m.content)}</div></div>`);
      // Só exibe produtos que existem NESTE catálogo (data.js da página), com preço e status atuais
      const prods = (m.products || []).map(id => LR.byId(id)).filter(Boolean);
      if (prods.length) parts.push(`<div class="lrc-cards">${prods.map(cardHTML).join('')}</div>`);
      if (m.handoff) parts.push(`<div class="lrc-handoff"><a class="lrc-add" href="${wa('Olá! Vim pelo assistente do site e quero falar com um atendente.')}" target="_blank" rel="noopener">Continuar no WhatsApp</a></div>`);
    }
    if (!thread.length) parts.push(`<div class="lrc-suggest"><span class="lrc-suggest-label">Comece por uma pergunta</span>${SUGGESTIONS.map(s => `<button type="button" class="lrc-chip" data-lrc-suggest>${esc(s)}</button>`).join('')}</div>`);
    if (busy) parts.push('<div class="lrc-typing" role="status"><svg viewBox="0 0 20 20" aria-hidden="true"><circle cx="10" cy="10" r="8.6" fill="none" stroke="currentColor" stroke-width="1.2"/><line class="lrc-typing-hand" x1="10" y1="11.5" x2="10" y2="3.6" stroke="var(--signal)" stroke-width="1.3" stroke-linecap="round"/><circle cx="10" cy="10" r="1.3" fill="currentColor"/></svg>Consultando o catálogo…</div>');
    body.innerHTML = parts.join('');
    body.scrollTop = body.scrollHeight;
  }

  /* ---------- Envio ---------- */
  function autosize() { input.style.height = 'auto'; input.style.height = Math.min(input.scrollHeight, 110) + 'px'; send.disabled = busy || !input.value.trim(); }
  input.addEventListener('input', autosize);
  input.addEventListener('keydown', e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); form.requestSubmit(); } });
  form.addEventListener('submit', e => { e.preventDefault(); ask(input.value); });

  body.addEventListener('click', e => {
    const s = e.target.closest('[data-lrc-suggest]'); if (s) { ask(s.textContent); return; }
    const add = e.target.closest('[data-lrc-add]');
    if (add) {
      // Ação explícita do cliente → carrinho existente do site (mesmas regras de preço e estoque)
      const p = LR.byId(add.dataset.lrcAdd);
      if (!p || p.status === 'esgotado' || !LR.cart) return;
      close();
      LR.cart.add(p.id, p.colors[0], p.sizes[0]);
    }
  });

  async function ask(text) {
    text = String(text || '').trim().slice(0, 600);
    if (!text || busy) return;
    thread.push({ role: 'user', content: text, t: Date.now() });
    input.value = ''; busy = true; autosize(); store.set(thread); render();

    const history = thread.filter(m => !m.error).slice(-MAX_HISTORY).map(m => ({ role: m.role, content: m.content }));
    let reply;
    try {
      const ctrl = new AbortController();
      const timer = setTimeout(() => ctrl.abort(), 35_000);
      const res = await fetch(ENDPOINT, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ messages: history }), signal: ctrl.signal });
      clearTimeout(timer);
      const data = await res.json().catch(() => ({}));
      if (res.ok && typeof data.reply === 'string') {
        reply = { role: 'assistant', content: data.reply, products: (data.products || []).map(p => p && p.id).filter(id => typeof id === 'string' && LR.byId(id)).slice(0, 4), handoff: !!data.handoff };
      } else {
        reply = { role: 'assistant', error: true, handoff: data.handoff !== false, content: data.message || 'O assistente está indisponível agora. Você pode falar com a gente pelo WhatsApp.' };
      }
    } catch {
      reply = { role: 'assistant', error: true, handoff: true, content: 'Não consegui conectar ao assistente. Você pode falar com a gente pelo WhatsApp.' };
    }
    reply.t = Date.now(); thread.push(reply); busy = false;
    const live = $('[data-lrc-live]'); if (live) live.textContent = 'LU.BOT: ' + reply.content; store.set(thread); render(); autosize();
  }

  if (location.hash === '#assistente') open();
})();
