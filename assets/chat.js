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

  const GREETING = 'Olá! Eu sou o LU.BOT, assistente da ' + B.name + '. Posso te ajudar a encontrar o relógio ideal. Está procurando algo para você ou para presentear?';
  const SUGGESTIONS = [
    'Qual relógio combina comigo?',
    'Quais modelos vocês têm até R$ 250?',
    'Quero um relógio para presentear.',
    'Vocês têm relógios de aço inoxidável?',
    'Qual a diferença entre esses modelos?',
  ];
  const STATUS = { disponivel: 'Disponível', encomenda: 'Sob encomenda', esgotado: 'Esgotado' };

  /* Conversa: { role: 'user'|'assistant', content, products?: [id], handoff?: bool, error?: bool } */
  let thread = store.get();
  let busy = false;

  /* ---------- DOM ---------- */
  const root = document.createElement('div');
  root.className = 'lrc';
  root.innerHTML = `
<button class="lrc-launcher" type="button" aria-haspopup="dialog" aria-expanded="false" aria-controls="lrc-panel" aria-label="Abrir o LU.BOT, assistente com IA (arraste para mover)" title="LU.BOT · assistente com IA — clique para conversar, arraste para mover" data-cursor="Chat">
  <span class="lrc-dial" aria-hidden="true"><svg viewBox="0 0 64 64">
    <rect x="59" y="28.5" width="4.5" height="7" rx="1.2" fill="var(--ink)"/>
    <circle cx="32" cy="32" r="29" fill="var(--ink)"/>
    <circle cx="32" cy="32" r="25.5" fill="var(--paper)"/>
    <g stroke="var(--ink)" stroke-linecap="round">${Array.from({ length: 12 }, (_, i) => `<line x1="32" y1="${i % 3 ? 9.5 : 8.5}" x2="32" y2="${i % 3 ? 11.5 : 13}" stroke-width="${i % 3 ? 1 : 1.8}" transform="rotate(${i * 30} 32 32)"/>`).join('')}</g>
    <text x="32" y="22.5" text-anchor="middle" font-family="Inter Tight, Arial, sans-serif" font-size="5.2" font-weight="600" letter-spacing="-.2" fill="var(--ink)">LR</text>
    <line class="lrc-h" x1="32" y1="32" x2="32" y2="19.5" stroke="var(--ink)" stroke-width="2.6" stroke-linecap="round"/>
    <line class="lrc-m" x1="32" y1="32" x2="32" y2="12.5" stroke="var(--ink)" stroke-width="1.7" stroke-linecap="round"/>
    <line class="lrc-sec" x1="32" y1="36" x2="32" y2="11" stroke="var(--signal)" stroke-width=".9" stroke-linecap="round"/>
    <circle cx="32" cy="32" r="2" fill="var(--signal)"/>
  </svg></span>
  <span class="lrc-cap"><i aria-hidden="true"></i>LU.BOT <b>IA</b></span>
</button>
<section class="lrc-panel" id="lrc-panel" role="dialog" aria-modal="false" aria-label="Assistente da loja" aria-hidden="true">
  <header class="lrc-head">
    <div><div class="lrc-title">LU.BOT</div><div class="lrc-sub"><i aria-hidden="true"></i>Assistente com IA · ${esc(B.name)}</div></div>
    <div class="lrc-head-actions">
      <a class="lrc-icon-btn" href="${wa('Olá! Vim pelo assistente do site e quero falar com um atendente.')}" target="_blank" rel="noopener" title="Falar com um atendente no WhatsApp">Atendente</a>
      <button class="lrc-icon-btn" type="button" data-lrc-reset title="Nova conversa" aria-label="Nova conversa">↺</button>
      <button class="lrc-icon-btn" type="button" data-lrc-close aria-label="Fechar assistente">×</button>
    </div>
  </header>
  <div class="lrc-body" data-lrc-body data-scroll-native aria-live="polite"></div>
  <footer class="lrc-foot">
    <form class="lrc-form" data-lrc-form>
      <label class="sr-only" for="lrc-input">Sua mensagem</label>
      <textarea class="lrc-input" id="lrc-input" rows="1" maxlength="600" placeholder="Pergunte sobre nossos relógios…" autocomplete="off"></textarea>
      <button class="lrc-send" type="submit" aria-label="Enviar" disabled><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg></button>
    </form>
    <p class="lrc-note">Respostas com IA · preços e estoque confirmados no WhatsApp</p>
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
    handH.setAttribute('transform', `rotate(${h * 30} 32 32)`);
    handM.setAttribute('transform', `rotate(${m * 6} 32 32)`);
  }
  const d0 = new Date();
  handS.style.setProperty('--sec-delay', `-${d0.getSeconds() + d0.getMilliseconds() / 1000}s`);
  tick(); setInterval(tick, 15_000);

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
      ? `<a class="btn btn-ghost" href="produto.html?id=${encodeURIComponent(p.id)}">Ver</a><a class="btn btn-ghost" href="${wa(`Olá! Quero ser avisado quando ${p.code} ${p.name} voltar.`)}" target="_blank" rel="noopener">Avise-me</a>`
      : `<a class="btn btn-ghost" href="produto.html?id=${encodeURIComponent(p.id)}">Ver</a><button class="btn" type="button" data-lrc-add="${esc(p.id)}">Adicionar</button>`;
    return `<article class="lrc-card">
  <a href="produto.html?id=${encodeURIComponent(p.id)}" tabindex="-1"><img src="${esc(p.images[0])}" alt="${esc(p.name)}" loading="lazy"></a>
  <div class="lrc-card-info">
    <span class="lrc-card-code">${esc(p.code)} · ${esc(p.category)}</span>
    <span class="lrc-card-name">${esc(p.name)}</span>
    <span class="lrc-card-sub">${esc(p.subtitle)}</span>
    <div class="lrc-card-row"><span class="lrc-card-price">${price(p.price)}</span><span class="lrc-card-status${out ? ' is-out' : ''}">${STATUS[p.status] || ''}</span></div>
    <div class="lrc-card-actions">${actions}</div>
  </div>
</article>`;
  }

  function render() {
    const parts = [`<div class="lrc-msg is-bot">${fmtText(GREETING)}</div>`];
    for (const m of thread) {
      parts.push(`<div class="lrc-msg ${m.role === 'user' ? 'is-user' : 'is-bot'}${m.error ? ' is-error' : ''}">${fmtText(m.content)}</div>`);
      // Só exibe produtos que existem NESTE catálogo (data.js da página), com preço e status atuais
      const prods = (m.products || []).map(id => LR.byId(id)).filter(Boolean);
      if (prods.length) parts.push(`<div class="lrc-cards">${prods.map(cardHTML).join('')}</div>`);
      if (m.handoff) parts.push(`<div class="lrc-handoff"><a class="btn btn-sm" href="${wa('Olá! Vim pelo assistente do site e quero falar com um atendente.')}" target="_blank" rel="noopener">Falar no WhatsApp <span class="arrow">→</span></a></div>`);
    }
    if (!thread.length) parts.push(`<div class="lrc-suggest">${SUGGESTIONS.map(s => `<button type="button" class="lrc-chip" data-lrc-suggest>${esc(s)}</button>`).join('')}</div>`);
    if (busy) parts.push('<div class="lrc-typing" aria-label="Digitando"><i></i><i></i><i></i></div>');
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
    thread.push({ role: 'user', content: text });
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
    thread.push(reply); busy = false; store.set(thread); render(); autosize();
  }

  if (location.hash === '#assistente') open();
})();
