/* ============================================================
   LU.RICOS — motor de interface
   Preloader · transições · scroll suave · reveals · cursor ·
   menu · carrinho · parallax · scroll horizontal · páginas
   Sem dependências.
   ============================================================ */
(() => {
  'use strict';
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const html = document.documentElement;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
  const isDesktop = () => innerWidth > 860;
  const B = LR.brand;
  const page = document.body.dataset.page || '';
  const ss = { get: k => { try { return sessionStorage.getItem(k); } catch { return null; } }, set: (k, v) => { try { sessionStorage.setItem(k, v); } catch {} } };
  const ls = { get: (k, d) => { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch { return d; } }, set: (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} } };
  const wa = text => `https://wa.me/${B.whatsapp}?text=${encodeURIComponent(text)}`;
  const esc = s => String(s).replace(/[&<>"']/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]));
  const pad = n => String(n).padStart(2, '0');
  /* o ponto do nome da marca sempre em vermelho */
  const dotName = n => esc(n).replace('.', '<span class="lr-dot">.</span>');
  /* fotos responsivas: cada foto tem uma versão de 600 px ao lado (foto-600.jpg);
     o navegador escolhe pelo tamanho em que a foto aparece (sizes) */
  const rel = src => /assets\/img\/relogios\/[^/]+\.jpg$/.test(src) && !/-600\.jpg$/.test(src);
  const pic = (src, sizes) => rel(src) ? `src="${src}" srcset="${src.replace(/\.jpg$/, '-600.jpg')} 600w, ${src} 1200w" sizes="${sizes}"` : `src="${src}"`;

  /* ---------- Molas ----------
     Modelo do guia de física da skill react-spring-physics (tensão, atrito,
     massa), sem React: Euler semi-implícito, roda só enquanto há movimento. */
  function spring(value, { tension = 170, friction = 26, mass = 1 } = {}) {
    return { value, target: value, v: 0, step(dt) {
      const f = -tension * (this.value - this.target) - friction * this.v;
      this.v += (f / mass) * dt; this.value += this.v * dt;
      return Math.abs(this.v) > .01 || Math.abs(this.value - this.target) > .01;
    } };
  }
  function springLoop(update) {
    let raf = 0, last = 0;
    const frame = now => { const dt = Math.min(.05, last ? (now - last) / 1000 : .016); last = now; if (update(dt)) raf = requestAnimationFrame(frame); else { raf = 0; last = 0; } };
    return () => { if (!raf) raf = requestAnimationFrame(frame); };
  }

  /* GSAP + ScrollTrigger (skill gsap-scrolltrigger), se carregaram */
  const G = window.gsap && window.ScrollTrigger ? (window.gsap.registerPlugin(window.ScrollTrigger), window.gsap) : null;
  if (G && !reduced) html.classList.add('has-gsap');
  let refreshT;
  const refreshScroll = () => { if (!G) return; clearTimeout(refreshT); refreshT = setTimeout(() => window.ScrollTrigger.refresh(), 120); };

  /* traços de mostrador em SVG (viewBox 200): 60 marcas, a cada 5 mais longas */
  function dialTicks({ r = 98, minor = 5, major = 10, numerals = 0 } = {}) {
    let out = '';
    for (let i = 0; i < 60; i++) {
      const a = (i * 6 - 90) * Math.PI / 180, five = i % 5 === 0, len = five ? major : minor;
      const x1 = 100 + Math.cos(a) * (r - len), y1 = 100 + Math.sin(a) * (r - len), x2 = 100 + Math.cos(a) * r, y2 = 100 + Math.sin(a) * r;
      out += `<line class="${five ? 'is-five' : ''}" x1="${x1.toFixed(2)}" y1="${y1.toFixed(2)}" x2="${x2.toFixed(2)}" y2="${y2.toFixed(2)}"/>`;
      if (numerals && five) { const n = i || 60; out += `<text x="${(100 + Math.cos(a) * numerals).toFixed(2)}" y="${(100 + Math.sin(a) * numerals + 1.4).toFixed(2)}" text-anchor="middle">${pad(n)}</text>`; }
    }
    return out;
  }
  const spNow = () => new Date(new Date().toLocaleString('en-US', { timeZone: 'America/Sao_Paulo' }));

  /* ---------- Chrome compartilhado (header, menu, carrinho, footer) ---------- */
  const NAV = [
    ['index.html', 'Início', 'Home'],
    ['loja.html', 'Vitrine', 'Todos os relógios'],
    ['colecoes.html', 'Coleções', 'Aço, couro e Technos'],
    ['jornal.html', 'Jornal', 'Guias e cuidados'],
    ['sobre.html', 'Sobre', 'A loja'],
    ['contato.html', 'Contato', 'Atendimento e dúvidas'],
  ];
  const current = location.pathname.split('/').pop() || 'index.html';
  const isActive = href => href === current || (current === '' && href === 'index.html') || (href === 'jornal.html' && current === 'artigo.html') || (href === 'loja.html' && current === 'produto.html');

  function mountChrome() {
    const header = $('#site-header');
    if (header) header.outerHTML = `
<header class="header" id="site-header">
  <a class="brand" href="index.html" aria-label="${esc(B.name)} — início"><span>${dotName(B.name)}</span><small>®</small></a>
  <nav class="nav" aria-label="Principal">
    ${NAV.slice(1, 5).map(([h, l]) => `<a href="${h}" class="${isActive(h) ? 'is-active' : ''}">${l}</a>`).join('')}
  </nav>
  <div class="header-right">
    <button class="cart-btn" type="button" aria-haspopup="dialog" aria-controls="cart">Carrinho <span class="cart-count num" data-cart-count>(0)</span></button>
    <button class="menu-btn" type="button" aria-expanded="false" aria-controls="menu"><span class="burger" aria-hidden="true"></span><span>Menu</span></button>
  </div>
</header>
<nav class="menu" id="menu" aria-label="Menu completo" aria-hidden="true">
  <div class="menu-links">
    ${NAV.map(([h, l, d], i) => `<a href="${h}"><span>${l}</span><small>${d}</small></a>`).join('')}
  </div>
  <div class="menu-foot">
    <div><span class="label">Atendimento</span><a href="${wa('Olá! Vim pelo site.')}" target="_blank" rel="noopener">WhatsApp</a><a href="mailto:${B.email}">${B.email}</a></div>
    <div><span class="label">Social</span><a href="${B.instagram}" target="_blank" rel="noopener">Instagram</a></div>
    <div><span class="label">Loja</span><span class="mono">${esc(B.address)}</span><span class="mono">${esc(B.hours)}</span></div>
    <div><span class="label">Local</span><span class="mono">${esc(B.city)}</span><span class="mono footer-clock" data-clock>--:--:--</span></div>
  </div>
</nav>
<div class="cart-backdrop" data-cart-close></div>
<aside class="cart" id="cart" role="dialog" aria-modal="true" aria-label="Carrinho" aria-hidden="true">
  <div class="cart-head"><span class="label label-ink">Carrinho <span data-cart-count>(0)</span></span><button class="cart-close" type="button" data-cart-close>Fechar ×</button></div>
  <div class="cart-body" data-cart-body data-scroll-native></div>
  <div class="cart-foot">
    <div class="cart-total"><span class="label">Subtotal</span><strong class="num" data-cart-total>R$ 0,00</strong></div>
    <p class="cart-note">Frete, prazo e forma de pagamento são combinados no atendimento pelo WhatsApp.</p>
    <a class="btn btn-block" data-cart-checkout href="#" target="_blank" rel="noopener">Finalizar pelo WhatsApp <span class="arrow">→</span></a>
  </div>
</aside>
<div class="toast" data-toast role="status" aria-live="polite"></div>`;

    const footer = $('#site-footer');
    if (footer) footer.outerHTML = `
<footer class="footer" id="site-footer">
  <div class="footer-top">
    <div class="footer-col"><span class="label">Navegar</span>${NAV.map(([h, l]) => `<a href="${h}">${l}</a>`).join('')}</div>
    <div class="footer-col"><span class="label">Ajuda</span><a href="contato.html#faq">Perguntas frequentes</a><a href="sobre.html#como-comprar">Como comprar</a><a href="artigo.html?slug=como-cuidar">Cuidados com o relógio</a><a href="artigo.html?slug=aco-ou-couro">Aço ou couro?</a></div>
    <div class="footer-col"><span class="label">Social</span><a href="${B.instagram}" target="_blank" rel="noopener">Instagram</a><a href="${wa('Olá! Vim pelo site.')}" target="_blank" rel="noopener">WhatsApp</a></div>
    <div class="footer-col"><span class="label">Loja</span><p class="addr">${esc(B.address)}<br>${esc(B.hours)}<br><a href="mailto:${B.email}">${B.email}</a></p></div>
  </div>
  <div class="footer-word" aria-hidden="true" data-footer-word>${B.name.split('').map(c => `<span${c === '.' ? ' class="lr-dot"' : ''}>${c}</span>`).join('')}</div>
  <div class="footer-bottom">
    <span class="label">© ${new Date().getFullYear()} ${esc(B.name)} — Todos os direitos reservados</span>
    <span class="label">${esc(B.city)} · <span class="footer-clock num" data-clock>--:--:--</span></span>
    <button class="to-top" type="button" data-to-top>Voltar ao topo ↑</button>
  </div>
</footer>`;
  }

  /* ---------- Preloader ---------- */
  function preloader() {
    const el = $('.preloader');
    const done = () => { html.classList.add('is-ready'); el && el.classList.add('is-done'); ss.set('lr_seen', '1'); setTimeout(() => el && el.remove(), 1300); };
    if (!el || html.classList.contains('no-preloader') || reduced) { el && el.remove(); html.classList.add('is-ready'); return Promise.resolve(); }
    return new Promise(res => {
      const num = $('.preloader-count', el), bar = $('.preloader-bar i', el), g = $('[data-pre-ticks]', el), tm = $('[data-pre-time]', el);
      ss.set('lr_seen', '1');
      const now = spNow();
      if (tm) tm.textContent = `${pad(now.getHours())}:${pad(now.getMinutes())}`;
      /* skill animejs: traços desenhados em cascata (stagger), ponteiros com
         easing de mola até a hora real de São Paulo, contador num objeto JS */
      if (window.anime && g) {
        g.innerHTML = dialTicks({ r: 96, minor: 5, major: 11 });
        const lines = $$('line', g), counter = { v: 0 };
        anime.timeline({ easing: 'easeOutExpo',
          update: () => { if (num) num.textContent = counter.v; if (bar) bar.style.width = counter.v + '%'; },
          complete: () => setTimeout(() => { done(); res(); }, 180) })
          .add({ targets: lines, strokeDashoffset: [anime.setDashoffset, 0], duration: 600, delay: anime.stagger(12) })
          .add({ targets: $('.pre-h', el), rotate: [0, (now.getHours() % 12 + now.getMinutes() / 60) * 30], easing: 'spring(1, 70, 11, 0)' }, 250)
          .add({ targets: $('.pre-m', el), rotate: [0, (now.getMinutes() + now.getSeconds() / 60) * 6], easing: 'spring(1, 70, 11, 0)' }, 320)
          .add({ targets: counter, v: 100, round: 1, duration: 1300, easing: 'easeInOutQuart' }, 0);
        return;
      }
      const t0 = performance.now(), T = 1100;
      const tick = now => {
        const p = Math.min(1, (now - t0) / T);
        const e = 1 - Math.pow(1 - p, 3);
        const v = Math.round(e * 100);
        if (num) num.textContent = v;
        if (bar) bar.style.width = v + '%';
        if (p < 1) requestAnimationFrame(tick); else setTimeout(() => { done(); res(); }, 250);
      };
      requestAnimationFrame(tick);
    });
  }

  /* ---------- Transições de página ---------- */
  function transitions() {
    const el = $('.transition');
    if (!el) return;
    if (html.classList.contains('from-transition')) {
      ss.set('lr_nav', '');
      requestAnimationFrame(() => requestAnimationFrame(() => { el.classList.add('is-out'); setTimeout(() => { el.classList.remove('is-out'); html.classList.remove('from-transition'); }, 900); }));
    }
    document.addEventListener('click', e => {
      const a = e.target.closest('a[href]');
      if (!a || e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || a.target === '_blank' || a.hasAttribute('download')) return;
      const url = new URL(a.href, location.href);
      if (url.origin !== location.origin) return;
      if (url.pathname === location.pathname && url.hash) return; // âncora na mesma página
      if (reduced) return;
      e.preventDefault();
      const label = $('.transition-label', el);
      if (label) label.textContent = (a.dataset.transitionLabel || a.textContent || '').trim().slice(0, 40) || B.name;
      closeMenu(); closeCart();
      ss.set('lr_nav', '1');
      el.classList.add('is-in');
      setTimeout(() => { location.href = url.href; }, 800);
    });
    addEventListener('pageshow', e => { if (e.persisted) { el.classList.remove('is-in'); } });
  }

  /* ---------- Scroll suave (lenis-lite) ---------- */
  const scroll = { y: scrollY, target: scrollY, active: false };
  function smoothScroll() {
    if (reduced || !fine) return;
    scroll.active = true;
    let raf = null;
    const max = () => document.documentElement.scrollHeight - innerHeight;
    const loop = () => {
      scroll.y += (scroll.target - scroll.y) * 0.09;
      if (Math.abs(scroll.target - scroll.y) < .3) { scroll.y = scroll.target; raf = null; } else raf = requestAnimationFrame(loop);
      window.scrollTo(0, scroll.y);
    };
    addEventListener('wheel', e => {
      if (e.ctrlKey || e.target.closest('[data-scroll-native]') || html.classList.contains('is-locked')) return;
      e.preventDefault();
      const d = e.deltaMode === 1 ? e.deltaY * 20 : e.deltaY;
      if (!raf) scroll.target = scrollY;
      scroll.target = Math.max(0, Math.min(max(), scroll.target + d));
      if (!raf) raf = requestAnimationFrame(loop);
    }, { passive: false });
    // resincroniza quando o scroll acontece por outros meios (teclado, barra, âncoras)
    addEventListener('scroll', () => { if (!raf) { scroll.y = scroll.target = scrollY; } }, { passive: true });
  }
  function scrollTo(y) {
    if (reduced) { window.scrollTo(0, y); return; }
    const start = scrollY, dist = y - start, T = Math.min(1400, 500 + Math.abs(dist) * .3), t0 = performance.now();
    const step = now => { const p = Math.min(1, (now - t0) / T), e = 1 - Math.pow(1 - p, 4); window.scrollTo(0, start + dist * e); scroll.y = scroll.target = scrollY; if (p < 1) requestAnimationFrame(step); };
    requestAnimationFrame(step);
  }

  /* ---------- Header ---------- */
  function header() {
    const h = $('.header'); if (!h) return;
    let last = scrollY;
    addEventListener('scroll', () => {
      const y = scrollY;
      h.classList.toggle('is-hidden', y > last && y > 200 && !html.classList.contains('is-locked'));
      last = y;
    }, { passive: true });
  }

  /* ---------- Menu ---------- */
  let menuOpen = false;
  function lock(on) { html.classList.toggle('is-locked', on); }
  function openMenu() { const m = $('.menu'), b = $('.menu-btn'); if (!m) return; menuOpen = true; m.classList.add('is-open'); m.setAttribute('aria-hidden', 'false'); b.setAttribute('aria-expanded', 'true'); lock(true); }
  function closeMenu() { const m = $('.menu'), b = $('.menu-btn'); if (!m || !menuOpen) return; menuOpen = false; m.classList.remove('is-open'); m.setAttribute('aria-hidden', 'true'); b.setAttribute('aria-expanded', 'false'); if (!cartOpen) lock(false); }
  function menu() {
    const b = $('.menu-btn'); if (!b) return;
    b.addEventListener('click', () => menuOpen ? closeMenu() : openMenu());
    addEventListener('keydown', e => { if (e.key === 'Escape') { closeMenu(); closeCart(); } });
  }

  /* ---------- Carrinho ---------- */
  let cartOpen = false;
  const cart = {
    items: ls.get('lr_cart', []),
    save() { ls.set('lr_cart', this.items); this.render(); },
    key: (id, color, size) => `${id}|${color}|${size}`,
    add(id, color, size, qty = 1) {
      const p = LR.byId(id); if (!p || p.status === 'esgotado') return;
      const k = this.key(id, color, size);
      const it = this.items.find(i => i.key === k);
      if (it) it.qty += qty; else this.items.push({ key: k, id, color, size, qty });
      this.save(); toast(`${p.name} adicionado`);
      if (LR.life && LR.life.fly && LR.life.fly()) setTimeout(openCart, 760); else openCart();
    },
    setQty(k, q) { const it = this.items.find(i => i.key === k); if (!it) return; it.qty = q; if (it.qty <= 0) this.items = this.items.filter(i => i.key !== k); this.save(); },
    count() { return this.items.reduce((a, i) => a + i.qty, 0); },
    total() { return this.items.reduce((a, i) => a + i.qty * (LR.byId(i.id)?.price || 0), 0); },
    render() {
      $$('[data-cart-count]').forEach(el => el.textContent = `(${this.count()})`);
      const body = $('[data-cart-body]'); if (!body) return;
      if (!this.items.length) body.innerHTML = `<div class="cart-empty"><p class="label">Seu carrinho está vazio</p><p style="margin-top:1rem"><a class="link" href="loja.html">Ver a vitrine <span class="arrow">→</span></a></p></div>`;
      else body.innerHTML = this.items.map(i => { const p = LR.byId(i.id); if (!p) return ''; return `
<div class="cart-item" data-key="${esc(i.key)}">
  <a href="produto.html?id=${p.id}"><img ${pic(p.images[0], '88px')} alt="${esc(p.name)}" loading="lazy"></a>
  <div>
    <div class="cart-name">${esc(p.name)}</div>
    <div class="label">${esc(p.code)} · ${esc(i.color)}${i.size !== 'Único' ? ' · ' + esc(i.size) : ''}</div>
    <div class="qty"><button type="button" data-qty="-1" aria-label="Diminuir">−</button><span class="num">${i.qty}</span><button type="button" data-qty="1" aria-label="Aumentar">+</button></div>
    <button type="button" class="cart-remove" data-remove>Remover</button>
  </div>
  <div class="cart-price num">${LR.format.price(p.price * i.qty)}</div>
</div>`; }).join('');
      $('[data-cart-total]').textContent = LR.format.price(this.total());
      const co = $('[data-cart-checkout]');
      if (co) {
        const lines = this.items.map(i => { const p = LR.byId(i.id); return `• ${p.code} ${p.name} — ${i.color}${i.size !== 'Único' ? ' / ' + i.size : ''} × ${i.qty} = ${LR.format.price(p.price * i.qty)}`; });
        co.href = wa(`Olá! Quero finalizar meu pedido na ${B.name}:\n\n${lines.join('\n')}\n\nSubtotal: ${LR.format.price(this.total())}`);
        co.classList.toggle('is-disabled', !this.items.length);
        co.toggleAttribute('disabled', !this.items.length);
      }
    },
  };
  function openCart() { const c = $('.cart'); if (!c) return; cartOpen = true; c.classList.add('is-open'); c.setAttribute('aria-hidden', 'false'); $('.cart-backdrop').classList.add('is-open'); lock(true); }
  function closeCart() { const c = $('.cart'); if (!c || !cartOpen) return; cartOpen = false; c.classList.remove('is-open'); c.setAttribute('aria-hidden', 'true'); $('.cart-backdrop').classList.remove('is-open'); if (!menuOpen) lock(false); }
  function cartUI() {
    cart.render();
    document.addEventListener('click', e => {
      if (e.target.closest('.cart-btn')) { closeMenu(); openCart(); }
      if (e.target.closest('[data-cart-close]')) closeCart();
      const add = e.target.closest('[data-add]');
      if (add) { e.preventDefault(); const p = LR.byId(add.dataset.add); if (p) cart.add(p.id, add.dataset.color || p.colors[0], add.dataset.size || p.sizes[0]); }
      const q = e.target.closest('[data-qty]'); if (q) { const k = q.closest('.cart-item').dataset.key; const it = cart.items.find(i => i.key === k); cart.setQty(k, it.qty + +q.dataset.qty); }
      const r = e.target.closest('[data-remove]'); if (r) cart.setQty(r.closest('.cart-item').dataset.key, 0);
    });
  }
  let toastT;
  function toast(msg) { const t = $('[data-toast]'); if (!t) return; t.textContent = msg; t.classList.add('is-on'); clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove('is-on'), 2200); }

  /* ---------- Split text ---------- */
  function splitWords(el) {
    if (el.dataset.splitDone) return;
    el.dataset.splitDone = '1';
    const walk = node => {
      [...node.childNodes].forEach(n => {
        if (n.nodeType === 3) {
          const frag = document.createDocumentFragment();
          n.textContent.split(/(\s+)/).forEach(part => {
            if (!part) return;
            if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(' ')); return; }
            const w = document.createElement('span'); w.className = 'word'; const i = document.createElement('span'); i.textContent = part; w.appendChild(i); frag.appendChild(w);
          });
          node.replaceChild(frag, n);
        } else if (n.nodeType === 1 && !n.classList.contains('word')) walk(n);
      });
    };
    walk(el);
    // escalona
    $$('.word > span', el).forEach((s, i) => s.style.transitionDelay = `${Math.min(i * 0.035, 1.2)}s`);
  }

  /* ---------- Reveals ---------- */
  function reveals() {
    $$('.split').forEach(splitWords);
    const els = $$('[data-reveal], .split, .img-reveal');
    if (reduced || !('IntersectionObserver' in window)) { els.forEach(e => e.classList.add('is-in')); return; }
    const io = new IntersectionObserver(entries => entries.forEach(en => { if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); } }), { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    els.forEach(e => io.observe(e));
  }
  // reveal imediato para elementos acima da dobra (após preloader)
  function revealAboveFold() { $$('[data-reveal], .split, .img-reveal').forEach(e => { const r = e.getBoundingClientRect(); if (r.top < innerHeight * .9) e.classList.add('is-in'); }); }

  /* ---------- Lupa: zoom circular que segue o mouse sobre a foto ---------- */
  function magnify(figures, { zoom = 1.4, radius = 85 } = {}) {
    if (!fine || reduced || !figures.length) return;
    figures.forEach(fig => {
      const img = fig.querySelector('img');
      if (!img) return;
      let lens = null;
      const move = e => {
        const r = fig.getBoundingClientRect();
        const x = Math.min(Math.max(e.clientX - r.left, 0), r.width);
        const y = Math.min(Math.max(e.clientY - r.top, 0), r.height);
        if (!lens) {
          lens = img.cloneNode(true);
          lens.classList.add('magnify-lens');
          lens.alt = '';
          lens.setAttribute('aria-hidden', 'true');
          fig.appendChild(lens);
        }
        lens.style.transformOrigin = `${x}px ${y}px`;
        lens.style.transform = `scale(${zoom})`;
        lens.style.clipPath = `circle(${radius}px at ${x}px ${y}px)`;
        lens.style.opacity = '1';
      };
      fig.addEventListener('mouseenter', move);
      fig.addEventListener('mousemove', move);
      fig.addEventListener('mouseleave', () => { if (lens) lens.style.opacity = '0'; });
    });
  }

  /* ---------- Rolagem com GSAP ScrollTrigger (skill gsap-scrolltrigger) ---------- */
  function scrollFx() {
    if (reduced) return;
    if (!G) return scrollFxLegacy();
    const ST = window.ScrollTrigger;
    // parallax: cada imagem se move em relação ao próprio quadro
    $$('[data-parallax]').forEach(el => {
      const sp = parseFloat(el.dataset.parallax) || .15;
      G.fromTo(el, { yPercent: -sp * 40, scale: 1 + sp * .6 }, { yPercent: sp * 40, scale: 1 + sp * .6, ease: 'none',
        scrollTrigger: { trigger: el.parentElement, start: 'top bottom', end: 'bottom top', scrub: true } });
    });
    // manifesto: palavras acendem conforme a leitura
    $$('.manifesto p.split').forEach(p => {
      const words = $$('.word', p);
      ST.create({ trigger: p, start: 'top 85%', end: 'bottom 55%', scrub: true,
        onUpdate: self => { const n = Math.round(self.progress * words.length); words.forEach((w, i) => w.classList.toggle('is-lit', i < n)); } });
    });
    // galeria horizontal: a seção fica presa pelo CSS (position: sticky, sem salto de layout)
    // e o GSAP move o trilho de lado conforme a rolagem, só no desktop
    const mm = G.matchMedia();
    mm.add('(min-width: 861px)', () => {
      $$('.hscroll').forEach(sec => {
        const track = $('.hscroll-track', sec), bar = $('.hscroll-progress i', sec), cnt = $('[data-hs-count]', sec);
        const items = $$('.hscroll-item', sec).length, dist = () => Math.max(0, track.scrollWidth + parseFloat(getComputedStyle(track).paddingRight) - innerWidth);
        G.to(track, { x: () => -dist(), ease: 'none', scrollTrigger: { trigger: sec, start: 'top top', end: 'bottom bottom', scrub: .8, invalidateOnRefresh: true,
          onUpdate: self => { if (bar) bar.style.width = (self.progress * 100) + '%'; if (cnt) cnt.textContent = `${pad(Math.min(items, Math.floor(self.progress * items) + 1))} / ${pad(items)}`; } } });
      });
    });
    // rodapé: letras do nome sobem em cascata
    const fw = $('[data-footer-word]');
    if (fw) G.fromTo($$('span', fw), { yPercent: 70, opacity: 0 }, { yPercent: 0, opacity: 1, ease: 'none', stagger: .08,
      scrollTrigger: { trigger: fw, start: 'top bottom', end: 'bottom bottom', scrub: .6 } });
    if (document.fonts) document.fonts.ready.then(refreshScroll);
    addEventListener('load', refreshScroll);
  }

  /* reserva sem GSAP: a mesma ideia num único rAF */
  function scrollFxLegacy() {
    const par = $$('[data-parallax]');
    const mani = $$('.manifesto p.split');
    const hs = $$('.hscroll');
    const fw = $('[data-footer-word]');
    if (reduced) return;
    let ticking = false;
    const update = () => {
      ticking = false;
      const vh = innerHeight;
      par.forEach(el => {
        const r = el.parentElement.getBoundingClientRect();
        if (r.bottom < -200 || r.top > vh + 200) return;
        const sp = parseFloat(el.dataset.parallax) || .15;
        const c = (r.top + r.height / 2 - vh / 2) / vh;
        el.style.transform = `translate3d(0, ${(-c * sp * 100).toFixed(2)}%, 0) scale(${1 + Math.abs(sp) * .6})`;
      });
      mani.forEach(p => {
        const r = p.getBoundingClientRect();
        const prog = Math.max(0, Math.min(1, (vh * .85 - r.top) / (r.height + vh * .25)));
        const words = $$('.word', p), n = Math.floor(prog * words.length);
        words.forEach((w, i) => w.classList.toggle('is-lit', i < n));
      });
      if (isDesktop()) hs.forEach(sec => {
        const r = sec.getBoundingClientRect();
        const prog = Math.max(0, Math.min(1, -r.top / (r.height - vh)));
        const track = $('.hscroll-track', sec);
        const dist = track.scrollWidth - innerWidth;
        track.style.transform = `translate3d(${(-dist * prog).toFixed(1)}px, 0, 0)`;
        const bar = $('.hscroll-progress i', sec); if (bar) bar.style.width = (prog * 100) + '%';
        const cnt = $('[data-hs-count]', sec); if (cnt) { const items = $$('.hscroll-item', sec).length; cnt.textContent = `${pad(Math.min(items, Math.floor(prog * items) + 1))} / ${pad(items)}`; }
      });
      if (fw) {
        const r = fw.getBoundingClientRect();
        const prog = Math.max(0, Math.min(1, (vh - r.top) / (r.height * 1.05)));
        $$('span', fw).forEach((s, i, a) => { const d = i / a.length; s.style.transform = `translateY(${(1 - Math.min(1, Math.max(0, (prog - d * .4) / .6))) * 60}%)`; s.style.opacity = Math.min(1, Math.max(0, (prog - d * .4) / .5)); });
      }
    };
    const onScroll = () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } };
    addEventListener('scroll', onScroll, { passive: true });
    addEventListener('resize', onScroll);
    update();
  }

  /* ---------- Cursor + magnético ---------- */
  function cursor() {
    if (!fine || reduced) return;
    const c = document.createElement('div');
    c.className = 'cursor'; c.innerHTML = '<div class="cursor-dot"></div><div class="cursor-ring"><span class="cursor-label"></span></div>';
    document.body.appendChild(c); html.classList.add('has-cursor');
    const dot = $('.cursor-dot', c), ring = $('.cursor-ring', c), lab = $('.cursor-label', c);
    // anel segue o mouse com mola (rígida e bem amortecida)
    const rx = spring(innerWidth / 2, { tension: 420, friction: 34 }), ry = spring(innerHeight / 2, { tension: 420, friction: 34 });
    const kickRing = springLoop(dt => { const a = rx.step(dt), b = ry.step(dt); ring.style.left = rx.value + 'px'; ring.style.top = ry.value + 'px'; return a || b; });
    addEventListener('mousemove', e => { c.classList.add('is-on'); rx.target = e.clientX; ry.target = e.clientY; dot.style.left = e.clientX + 'px'; dot.style.top = e.clientY + 'px'; kickRing(); });
    document.addEventListener('mouseover', e => {
      const t = e.target.closest('[data-cursor]');
      const h = e.target.closest('a, button, [role="button"], input, select, textarea, label');
      c.classList.toggle('is-label', !!t); c.classList.toggle('is-hover', !!(t || h));
      if (t) lab.textContent = t.dataset.cursor;
    });
    document.addEventListener('mouseleave', () => c.classList.remove('is-on'));
    document.addEventListener('mouseenter', () => c.classList.add('is-on'));
    // magnético
    // magnético: o botão é puxado pelo mouse e volta com uma mola levemente elástica
    $$('.btn').forEach(b => {
      const sx = spring(0, { tension: 220, friction: 13 }), sy = spring(0, { tension: 220, friction: 13 });
      b.style.transition = 'color .5s var(--ease), border-color .5s var(--ease), scale .2s var(--ease-out)';
      const kick = springLoop(dt => { const a = sx.step(dt), d = sy.step(dt); b.style.transform = (a || d) ? `translate(${sx.value.toFixed(2)}px, ${sy.value.toFixed(2)}px)` : ''; return a || d; });
      b.addEventListener('mousemove', e => { const r = b.getBoundingClientRect(); sx.target = (e.clientX - r.left - r.width / 2) * .22; sy.target = (e.clientY - r.top - r.height / 2) * .35; kick(); });
      b.addEventListener('mouseleave', () => { sx.target = 0; sy.target = 0; kick(); });
    });
  }

  /* ---------- Relógio, topo, acordeões, campos ---------- */
  function misc() {
    const clocks = $$('[data-clock]');
    const tick = () => { const d = new Date(); const s = d.toLocaleTimeString('pt-BR', { timeZone: 'America/Sao_Paulo', hour12: false }); clocks.forEach(c => c.textContent = s); };
    if (clocks.length) { tick(); setInterval(tick, 1000); }
    document.addEventListener('click', e => {
      if (e.target.closest('[data-to-top]')) scrollTo(0);
      const ab = e.target.closest('.acc-btn');
      if (ab) { const item = ab.closest('.acc-item'); const open = item.classList.toggle('is-open'); ab.setAttribute('aria-expanded', open); }
      const an = e.target.closest('a[href^="#"]');
      if (an && an.getAttribute('href').length > 1) { const t = $(an.getAttribute('href')); if (t) { e.preventDefault(); scrollTo(t.getBoundingClientRect().top + scrollY - 70); if (t.matches('a, button, input, select, textarea, [tabindex]')) t.focus({ preventScroll: true }); } }
    });
    $$('.field input, .field textarea').forEach(i => { const f = () => i.closest('.field').classList.toggle('is-filled', !!i.value); i.addEventListener('input', f); f(); });
    // formulário newsletter
    $$('form[data-newsletter]').forEach(f => f.addEventListener('submit', e => {
      e.preventDefault(); const em = f.querySelector('input[type=email]'); const msg = f.querySelector('.form-msg') || f.parentElement.querySelector('.form-msg');
      if (!em.checkValidity()) { msg.textContent = 'Digite um e-mail válido.'; return; }
      const list = ls.get('lr_news', []); list.push({ email: em.value, at: Date.now() }); ls.set('lr_news', list);
      msg.textContent = 'Inscrição recebida. Até breve.'; em.value = ''; em.closest('.field').classList.remove('is-filled'); toast('Inscrição confirmada');
    }));
    // formulário de contato → WhatsApp
    $$('form[data-contact]').forEach(f => f.addEventListener('submit', e => {
      e.preventDefault(); if (!f.checkValidity()) { f.reportValidity(); return; }
      const d = Object.fromEntries(new FormData(f).entries());
      const text = `Olá! Meu nome é ${d.nome}.\nAssunto: ${d.assunto}\n\n${d.mensagem}\n\nE-mail: ${d.email}`;
      window.open(wa(text), '_blank', 'noopener'); f.querySelector('.form-msg').textContent = 'Abrindo o WhatsApp com sua mensagem…';
    }));
  }

  /* ---------- Componentes ---------- */
  const CARD_SIZES = '(max-width: 520px) 50vw, (max-width: 860px) 50vw, (max-width: 1100px) 33vw, 25vw';
  const ui = {
    badgeClass: p => p.status === 'esgotado' ? 'is-out' : /destaque|novidade|edição|encomenda/i.test(p.badge) ? 'is-signal' : '',
    card(p, i, opts = {}) {
      const label = p.status === 'esgotado' ? 'Esgotado' : p.status === 'encomenda' ? 'Encomendar' : 'Adicionar';
      return `
<article class="pcard ${p.status === 'esgotado' ? 'is-out' : ''}" data-reveal style="--d:${(i % 4) * .08}s" data-id="${p.id}">
  <a class="pcard-link" href="produto.html?id=${p.id}" aria-label="${esc(p.name)} — ${esc(p.subtitle)}" data-cursor="Ver"></a>
  <div class="pcard-media">
    <img class="main" ${pic(p.images[0], CARD_SIZES)} alt="${esc(p.name)}" loading="${opts.eager && i < 3 ? 'eager' : 'lazy'}">
    ${p.images[1] ? `<img class="alt" ${pic(p.images[1], CARD_SIZES)} alt="" loading="lazy" aria-hidden="true">` : ''}
    ${p.badge ? `<span class="pcard-badge ${this.badgeClass(p)}">${esc(p.badge)}</span>` : ''}
    <div class="pcard-quick">${p.status === 'esgotado' ? `<a class="btn btn-ghost" style="width:100%" href="${wa(`Olá! Quero ser avisado quando ${p.code} ${p.name} voltar.`)}" target="_blank" rel="noopener">Avise-me</a>` : `<button class="btn" type="button" data-add="${p.id}">${label} <span class="arrow">+</span></button>`}</div>
  </div>
  <div class="pcard-info">
    <div><h3 class="pcard-name">${esc(p.name)}</h3><p class="pcard-sub">${esc(p.code)} · ${esc(p.subtitle)}</p></div>
    <div class="pcard-price num">${LR.format.price(p.price)}</div>
  </div>
</article>`;
    },
    grid(list, el, opts) { el.innerHTML = list.map((p, i) => this.card(p, i, opts)).join(''); reveals(); setTimeout(revealAboveFold, 50); refreshScroll(); },
  };

  /* ---------- Páginas ---------- */
  const pages = {
    home() {
      const novidades = LR.products.filter(p => p.status !== 'esgotado');
      ui.grid(novidades, $('[data-grid="novidades"]'), { eager: true });
      const avail = $('[data-avail]');
      if (avail) avail.textContent = pad(LR.products.filter(p => p.status === 'disponivel').length);
      heroPhoto();
      const cols = $('[data-collections-rows]');
      if (cols) cols.innerHTML = LR.collections.map(c => `
<a class="col-row" href="colecoes.html#${c.slug}" data-reveal="fade">
  <span class="label">${c.code} · ${esc(c.season)}</span>
  <span class="display display-m">${esc(c.name)}</span>
  <span class="col-intro">${esc(c.intro)}</span>
  <span class="arrow">→</span>
  <img class="col-thumb" ${pic(c.cover, '180px')} alt="" aria-hidden="true" loading="lazy">
</a>`).join('');
      const j = $('[data-journal-grid]');
      if (j) j.innerHTML = LR.articles.slice(0, 3).map((a, i) => `
<a class="jcard" href="artigo.html?slug=${a.slug}" data-reveal style="--d:${i * .1}s" data-cursor="Ler">
  <figure class="img-reveal"><img ${pic(a.cover, '(max-width: 860px) 100vw, 33vw')} alt="" loading="lazy"></figure>
  <div class="jcard-meta"><span class="label">${esc(a.kicker)}</span><span class="label">${LR.format.date(a.date)}</span></div>
  <h3>${esc(a.title)}</h3><p>${esc(a.excerpt)}</p>
</a>`).join('');
    },

    loja() {
      const grid = $('[data-grid="loja"]'), chips = $('[data-chips]'), sort = $('[data-sort]'), count = $('[data-count]'), empty = $('[data-empty]');
      const params = new URLSearchParams(location.search);
      let cat = params.get('cat') || 'todos', col = params.get('col') || '';
      const cats = ['todos', ...new Set(LR.products.map(p => p.category))];
      chips.innerHTML = cats.map(c => `<button class="chip ${c === cat ? 'is-active' : ''}" type="button" data-cat="${esc(c)}">${c === 'todos' ? 'Tudo' : esc(c)}</button>`).join('');
      const apply = () => {
        let list = LR.products.filter(p => (cat === 'todos' || p.category === cat) && (!col || p.collection === col));
        const s = sort.value;
        if (s === 'menor') list = [...list].sort((a, b) => a.price - b.price);
        if (s === 'maior') list = [...list].sort((a, b) => b.price - a.price);
        if (s === 'nome') list = [...list].sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'));
        count.textContent = `${pad(list.length)} ${list.length === 1 ? 'relógio' : 'relógios'}`;
        empty.hidden = list.length > 0;
        grid.style.opacity = 0;
        setTimeout(() => { ui.grid(list, grid); grid.style.opacity = 1; }, 180);
        const u = new URL(location.href); cat === 'todos' ? u.searchParams.delete('cat') : u.searchParams.set('cat', cat); history.replaceState(null, '', u);
      };
      grid.style.transition = 'opacity .25s';
      chips.addEventListener('click', e => { const b = e.target.closest('[data-cat]'); if (!b) return; cat = b.dataset.cat; $$('.chip', chips).forEach(c => c.classList.toggle('is-active', c === b)); apply(); });
      sort.addEventListener('change', apply);
      const colClear = $('[data-col-filter]');
      if (col && colClear) { const c = LR.collection(col); colClear.hidden = false; colClear.innerHTML = `Coleção: ${esc(c?.name || col)} <span aria-hidden="true">×</span>`; colClear.addEventListener('click', () => { col = ''; colClear.hidden = true; const u = new URL(location.href); u.searchParams.delete('col'); history.replaceState(null, '', u); apply(); }); }
      $$('[data-view]').forEach(b => b.addEventListener('click', () => { $$('[data-view]').forEach(x => x.classList.toggle('is-active', x === b)); grid.classList.toggle('cols-3', b.dataset.view === '3'); }));
      apply();
    },

    produto() {
      const id = new URLSearchParams(location.search).get('id');
      const p = LR.byId(id) || LR.products[0];
      document.title = `${p.name} — ${p.code} · ${B.name}`;
      const col = LR.collection(p.collection);
      let color = p.colors[0], size = p.sizes[0];
      const root = $('[data-pdp]');
      root.innerHTML = `
<div class="pdp-gallery" data-scroll-native-ignore>
  ${p.images.map((src, i) => `<figure class="img-reveal" data-cursor="Zoom"><img ${pic(src, i ? '(max-width: 860px) 50vw, 58vw' : '(max-width: 860px) 100vw, 58vw')} alt="${esc(p.name)} — vista ${i + 1}" loading="${i ? 'lazy' : 'eager'}"${i ? '' : ' fetchpriority="high"'}></figure>`).join('')}
</div>
<div class="pdp-info">
  <div class="crumbs"><a class="label" href="loja.html">Vitrine</a><span class="label">/</span><a class="label" href="colecoes.html#${col.slug}">${esc(col.name)}</a><span class="label">/</span><span class="label label-ink">${esc(p.code)}</span></div>
  <div>
    <div class="pdp-top"><span class="label">${esc(p.code)} ${p.badge ? `· <span style="color:${p.status === 'esgotado' ? 'inherit' : 'var(--signal)'}">${esc(p.badge)}</span>` : ''}</span><span class="pdp-price num">${LR.format.price(p.price)}</span></div>
    <h1 class="display pdp-title split" style="margin-top:.6rem">${esc(p.name)}</h1>
    <p class="muted" style="margin-top:.6rem">${esc(p.subtitle)}</p>
  </div>
  <p class="pdp-desc" data-reveal>${esc(p.desc)}</p>
  <div class="opt-group" data-reveal>
    <div class="opt-head"><span class="label">Mostrador</span><span class="label label-ink" data-color-label>${esc(color)}</span></div>
    <div class="opts" data-colors>${p.colors.map((c, i) => `<button class="opt ${i === 0 ? 'is-active' : ''}" type="button" data-color="${esc(c)}">${esc(c)}</button>`).join('')}</div>
  </div>
  ${p.sizes.length > 1 ? `<div class="opt-group" data-reveal>
    <div class="opt-head"><span class="label">Tamanho</span></div>
    <div class="opts" data-sizes>${p.sizes.map((s, i) => `<button class="opt ${i === 0 ? 'is-active' : ''}" type="button" data-size="${esc(s)}">${esc(s)}</button>`).join('')}</div>
  </div>` : ''}
  <div class="pdp-actions" data-reveal>
    ${p.status === 'esgotado'
      ? `<button class="btn" type="button" disabled>Esgotado</button><a class="btn btn-ghost" href="${wa(`Olá! Quero ser avisado quando ${p.code} ${p.name} voltar.`)}" target="_blank" rel="noopener">Avise-me quando voltar</a>`
      : `<button class="btn" type="button" data-pdp-add>${p.status === 'encomenda' ? 'Encomendar' : 'Adicionar ao carrinho'} — <span data-pdp-price>${LR.format.price(p.price)}</span></button>
         <a class="btn btn-ghost" href="${wa(`Olá! Tenho uma dúvida sobre ${p.code} ${p.name}.`)}" target="_blank" rel="noopener">Tirar dúvida no WhatsApp</a>`}
  </div>
  <div class="acc" data-reveal>
    <div class="acc-item is-open"><button class="acc-btn" type="button" aria-expanded="true">Especificações <i></i></button><div class="acc-panel"><div><div class="inner"><ul class="spec-list">${Object.entries(p.specs).map(([k, v]) => `<li><span>${esc(k)}</span><span>${esc(v)}</span></li>`).join('')}</ul></div></div></div></div>
    <div class="acc-item"><button class="acc-btn" type="button" aria-expanded="false">Envio e pagamento <i></i></button><div class="acc-panel"><div><div class="inner">Frete, prazo e forma de pagamento são combinados direto com a gente pelo WhatsApp, de acordo com o seu CEP. Adicione o relógio ao carrinho e finalize por lá.</div></div></div></div>
    <div class="acc-item"><button class="acc-btn" type="button" aria-expanded="false">Cuidados <i></i></button><div class="acc-panel"><div><div class="inner">Limpe com pano macio e seco. Evite piscina e mar, e não acerte a data entre 21h e 3h. <a href="artigo.html?slug=como-cuidar" style="text-decoration:underline">Leia o guia completo</a>.</div></div></div></div>
  </div>
  <div class="pdp-meta"><span class="label">Coleção: ${esc(col.name)}</span><span class="label">Pulseira: ${esc(p.category)}</span><span class="label">Marca: ${esc(p.brand || '')}</span></div>
</div>`;
      root.addEventListener('click', e => {
        const c = e.target.closest('[data-color]'); if (c) { color = c.dataset.color; $$('[data-color]', root).forEach(x => x.classList.toggle('is-active', x === c)); $('[data-color-label]', root).textContent = color; }
        const s = e.target.closest('[data-size]'); if (s) { size = s.dataset.size; $$('[data-size]', root).forEach(x => x.classList.toggle('is-active', x === s)); }
        if (e.target.closest('[data-pdp-add]')) cart.add(p.id, color, size);
      });
      const rel = LR.products.filter(x => x.id !== p.id && (x.collection === p.collection || x.category === p.category)).slice(0, 4);
      const relEl = $('[data-grid="related"]'); if (relEl) ui.grid(rel.length ? rel : LR.products.slice(0, 4), relEl);
      const nav = $('[data-pdp-nav]');
      if (nav) { const i = LR.products.indexOf(p); const prev = LR.products[(i - 1 + LR.products.length) % LR.products.length], next = LR.products[(i + 1) % LR.products.length]; nav.innerHTML = `<a href="produto.html?id=${prev.id}"><span class="label">← Anterior</span><span class="display display-s">${esc(prev.name)}</span></a><a href="produto.html?id=${next.id}"><span class="label">Próximo →</span><span class="display display-s">${esc(next.name)}</span></a>`; }
      const idx = $('[data-pdp-index]'); if (idx) idx.textContent = `${pad(LR.products.indexOf(p) + 1)} / ${pad(LR.products.length)}`;
      magnify($$('.pdp-gallery figure', root));
    },

    colecoes() {
      const el = $('[data-col-list]');
      el.innerHTML = LR.collections.map((c, i) => { const items = LR.products.filter(p => p.collection === c.slug); return `
<section class="col-block" id="${c.slug}">
  <figure class="col-media img-reveal parallax-wrap" data-cursor="Ver"><img ${pic(c.cover, '(max-width: 860px) 100vw, 50vw')} alt="${esc(c.name)}" data-parallax=".12" loading="${i ? 'lazy' : 'eager'}"></figure>
  <div class="col-text">
    <span class="label" data-reveal>${c.code} · ${esc(c.season)} · ${pad(items.length)} ${items.length === 1 ? 'relógio' : 'relógios'}</span>
    <h2 class="display display-l split">${esc(c.name)}</h2>
    <p class="body-l" data-reveal>${esc(c.intro)}</p>
    <div class="col-mini" data-reveal>${items.slice(0, 3).map(p => `<a href="produto.html?id=${p.id}" data-cursor="Ver"><img ${pic(p.images[0], '(max-width: 860px) 33vw, 15vw')} alt="${esc(p.name)}" loading="lazy"><span>${esc(p.code)} — ${esc(p.name)}</span></a>`).join('')}</div>
    <div data-reveal><a class="btn" href="loja.html?col=${c.slug}">Ver coleção completa <span class="arrow">→</span></a></div>
  </div>
</section>`; }).join('');
      if (location.hash) setTimeout(() => { const t = $(location.hash); if (t) scrollTo(t.getBoundingClientRect().top + scrollY - 60); }, 900);
    },

    jornal() {
      const [first, ...rest] = LR.articles;
      const f = $('[data-jfeature]');
      if (f) f.innerHTML = `
<figure class="img-reveal parallax-wrap" data-cursor="Ler"><a href="artigo.html?slug=${first.slug}"><img ${pic(first.cover, '(max-width: 860px) 100vw, 58vw')} alt="" data-parallax=".1" fetchpriority="high"></a></figure>
<div class="jtext">
  <span class="label" data-reveal>Último · ${esc(first.kicker)} · ${LR.format.date(first.date)}</span>
  <h2 class="display display-l split"><a href="artigo.html?slug=${first.slug}">${esc(first.title)}</a></h2>
  <p class="body-l muted" data-reveal>${esc(first.excerpt)}</p>
  <div data-reveal><a class="link" href="artigo.html?slug=${first.slug}">Ler artigo <span class="arrow">→</span></a></div>
</div>`;
      const l = $('[data-jlist]');
      if (l) l.innerHTML = rest.map((a, i) => `
<a class="jrow" href="artigo.html?slug=${a.slug}" data-reveal="fade" style="--d:${i * .08}s">
  <span class="label">${pad(i + 2)} · ${esc(a.kicker)}<br>${LR.format.date(a.date)}</span>
  <h3>${esc(a.title)}</h3>
  <p>${esc(a.excerpt)}</p>
  <span class="arrow">→</span>
  <img class="jthumb" ${pic(a.cover, '220px')} alt="" aria-hidden="true" loading="lazy">
</a>`).join('');
    },

    artigo() {
      const slug = new URLSearchParams(location.search).get('slug');
      const i = Math.max(0, LR.articles.findIndex(a => a.slug === slug));
      const a = LR.articles[i], prev = LR.articles[i - 1], next = LR.articles[i + 1];
      document.title = `${a.title} · Jornal · ${B.name}`;
      $('[data-article]').innerHTML = `
<div class="article-head">
  <span class="label" data-reveal>${esc(a.kicker)}<br>${LR.format.date(a.date)}</span>
  <h1 class="display display-l split">${esc(a.title)}</h1>
</div>
<figure class="article-cover img-reveal parallax-wrap"><img ${pic(a.cover, '100vw')} alt="" data-parallax=".12" fetchpriority="high"></figure>
<div class="article-body">
  <aside class="aside">
    <span class="label">Leitura · ${Math.max(1, Math.round(a.body.join(' ').split(' ').length / 180))} min</span>
    <span class="label">Por ${esc(B.name)}</span>
    <a class="link" style="margin-top:1rem" href="jornal.html">← Todos os artigos</a>
  </aside>
  <div class="prose">${a.body.map(p => `<p data-reveal>${esc(p)}</p>`).join('')}</div>
</div>
<nav class="article-nav" aria-label="Outros artigos">
  ${prev ? `<a href="artigo.html?slug=${prev.slug}"><span class="label">← Anterior</span><span class="display display-s">${esc(prev.title)}</span></a>` : '<a></a>'}
  ${next ? `<a href="artigo.html?slug=${next.slug}"><span class="label">Próximo →</span><span class="display display-s">${esc(next.title)}</span></a>` : `<a href="jornal.html"><span class="label">Voltar →</span><span class="display display-s">Jornal</span></a>`}
</nav>`;
    },

    sobre() {
      // contadores
      const stats = $$('[data-count-to]');
      if (!stats.length) return;
      const io = new IntersectionObserver(es => es.forEach(en => { if (!en.isIntersecting) return; io.unobserve(en.target); const el = en.target, to = +el.dataset.countTo, suf = el.dataset.suffix || '', t0 = performance.now(); const step = now => { const p = Math.min(1, (now - t0) / 1600), e = 1 - Math.pow(1 - p, 3); el.textContent = Math.round(to * e) + suf; if (p < 1) requestAnimationFrame(step); }; requestAnimationFrame(step); }), { threshold: .4 });
      stats.forEach(s => io.observe(s));
    },

    contato() {},
  };

  /* ---------- Vitrine do topo: fotos reais que se alternam ---------- */
  function heroPhoto() {
    const slides = $('[data-hero-slides]');
    if (!slides || !LR.hero || !LR.hero.length) return;
    // enquanto o cabeçalho está sobre a foto, o texto dele fica branco
    const head = $('.header'), fig = $('.hero-figure');
    if (head && fig) {
      const onDark = () => head.classList.toggle('on-photo', fig.getBoundingClientRect().bottom > head.offsetHeight);
      addEventListener('scroll', onDark, { passive: true }); onDark();
    }
    // foto larga de ponta a ponta no computador; no celular, a vertical
    slides.innerHTML = LR.hero.map((h, i) => {
      const p = LR.byId(h.id), wide = h.wide || h.img;
      const wideSet = h.wide ? `${wide.replace(/\.jpg$/, '-1200.jpg')} 1200w, ${wide} 2400w` : wide;
      const mob = rel(h.img) ? `${h.img.replace(/\.jpg$/, '-600.jpg')} 600w, ${h.img} 1200w` : h.img;
      return `<picture class="${i ? '' : 'is-active'}"><source media="(max-width: 860px)" srcset="${mob}" sizes="100vw"><img src="${wide}" srcset="${wideSet}" sizes="100vw" alt="${esc(p ? p.name : '')}" style="object-position:${h.pos || '50% 50%'}" loading="${i ? 'lazy' : 'eager'}"${i ? '' : ' fetchpriority="high"'}></picture>`;
    }).join('');
    const imgs = $$('picture', slides), code = $('[data-hero-code]'), link = $('[data-hero-link]'), count = $('[data-hero-count]');
    let cur = 0;
    const show = i => {
      imgs[cur].classList.toggle('is-active', false); cur = i; imgs[cur].classList.toggle('is-active', true);
      const p = LR.byId(LR.hero[cur].id);
      if (p) { if (code) code.textContent = `${p.code} — ${p.name}`; if (link) link.href = `produto.html?id=${p.id}`; }
      if (count) count.textContent = `${pad(cur + 1)} / ${pad(imgs.length)}`;
    };
    show(0);
    if (!reduced && imgs.length > 1) setInterval(() => { if (!document.hidden) show((cur + 1) % imgs.length); }, 6000);
  }

  /* ---------- Boot ---------- */
  mountChrome();
  $$('.nav a').forEach(a => a.classList.toggle('is-active', isActive(a.getAttribute('href'))));
  if (pages[page]) pages[page]();
  cartUI(); menu(); header(); misc(); transitions();
  reveals();
  preloader().then(() => { const m = $('main'); if (m) { m.classList.add('page-enter'); m.addEventListener('animationend', () => m.classList.remove('page-enter'), { once: true }); } revealAboveFold(); smoothScroll(); scrollFx(); cursor(); });
  if (html.classList.contains('no-preloader') || reduced) { /* preloader resolve imediato — nada a fazer */ }

  LR.ui = ui; LR.cart = cart; LR.toast = toast;
})();
