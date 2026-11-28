/* ============================================================
   LU.RICOS — vida no site
   Animações com motivo de marca (o ponto vermelho, o relógio):
   - linha de leitura no topo (ponteiro de segundos da página)
   - preço que rola como a roda de data
   - ponto vermelho que voa até o carrinho
   - miniaturas que seguem o cursor nas listas
   - faixa de texto que acelera com a rolagem
   - topo da home que responde ao mouse
   Carregar DEPOIS de app.js. Tudo respeita "reduzir movimento".
   ============================================================ */
(() => {
  'use strict';
  if (!window.LR) return;
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
  const html = document.documentElement;
  const life = (LR.life = {});

  /* ---------- 1. Linha de leitura (não é movimento decorativo: mostra o progresso) ---------- */
  const bar = document.createElement('div');
  bar.className = 'read-line'; bar.setAttribute('aria-hidden', 'true');
  document.body.appendChild(bar);
  let ticking = false;
  const setBar = () => {
    ticking = false;
    const max = document.documentElement.scrollHeight - innerHeight;
    bar.style.transform = `scaleX(${max > 0 ? Math.min(1, scrollY / max) : 0})`;
  };
  addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(setBar); } }, { passive: true });
  addEventListener('resize', setBar); setBar();

  if (reduced) { life.fly = () => false; return; }

  /* ---------- 2. Preço que rola como a roda de data ---------- */
  // Cada dígito vira uma coluna 0–9 que gira até o valor, em cascata.
  function roll(el, delay = 0) {
    if (!el || el.dataset.rolled) return;
    el.dataset.rolled = '1';
    const text = el.textContent;
    // o valor fica legível para leitores de tela; as colunas são só visuais
    el.innerHTML = `<span class="sr-only">${text}</span>` + [...text].map((ch, i) => /\d/.test(ch)
      ? `<span class="roll" aria-hidden="true"><span class="roll-col" style="--n:${ch};--d:${delay + i * 45}ms">${'0123456789'.split('').map(d => `<span>${d}</span>`).join('')}</span></span>`
      : `<span class="roll" aria-hidden="true">${ch === ' ' || ch === ' ' ? '&nbsp;' : ch}</span>`).join('');
    requestAnimationFrame(() => requestAnimationFrame(() => el.classList.add('is-rolled')));
  }
  life.roll = roll;
  const io = 'IntersectionObserver' in window ? new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { roll(e.target); io.unobserve(e.target); } }), { threshold: .6 }) : null;
  const watchPrices = () => $$('.pdp-price:not([data-rolled])').forEach(el => io ? io.observe(el) : roll(el));
  watchPrices();
  const pdp = $('[data-pdp]'); if (pdp) new MutationObserver(watchPrices).observe(pdp, { childList: true });
  // o subtotal do carrinho rola de novo a cada mudança
  const total = $('[data-cart-total]');
  if (total) new MutationObserver(() => {
    if (total.querySelector('.roll')) return;
    delete total.dataset.rolled; total.classList.remove('is-rolled'); roll(total);
  }).observe(total, { childList: true });

  /* ---------- 3. Ponto vermelho que voa até o carrinho ---------- */
  let origin = null, originAt = 0;
  document.addEventListener('pointerdown', e => {
    const b = e.target.closest('[data-add], [data-pdp-add], [data-lrc-add]');
    if (b) { origin = b.getBoundingClientRect(); originAt = performance.now(); }
  }, true);
  life.fly = () => {
    const target = $('.header .cart-btn');
    if (!origin || performance.now() - originAt > 1500 || !target) return false;
    const t = target.getBoundingClientRect();
    const sx = origin.left + origin.width / 2, sy = origin.top + origin.height / 2;
    const ex = t.left + t.width - 14, ey = t.top + t.height / 2;
    origin = null;
    const dot = document.createElement('i');
    dot.className = 'fly-dot'; dot.setAttribute('aria-hidden', 'true');
    document.body.appendChild(dot);
    // arco: sobe primeiro e cai no carrinho
    const peak = Math.min(sy, ey) - 120;
    const anim = dot.animate([
      { transform: `translate(${sx}px, ${sy}px) scale(.6)`, opacity: 0 },
      { transform: `translate(${(sx + ex) / 2}px, ${peak}px) scale(1.4)`, opacity: 1, offset: .45 },
      { transform: `translate(${ex}px, ${ey}px) scale(.8)`, opacity: 1 },
    ], { duration: 650, easing: 'cubic-bezier(.5, 0, .3, 1)' });
    anim.onfinish = () => {
      dot.remove();
      target.classList.remove('is-bump'); void target.offsetWidth; target.classList.add('is-bump');
    };
    $('.header')?.classList.remove('is-hidden');
    return true;
  };

  /* ---------- 4. Miniaturas que seguem o cursor (coleções e jornal) ---------- */
  function follow() {
    if (!fine) return;
    $$('.col-row:not([data-follow]), .jrow:not([data-follow])').forEach(row => {
      row.dataset.follow = '1';
      const thumb = $('.col-thumb, .jthumb', row); if (!thumb) return;
      let lastX = 0;
      row.addEventListener('mousemove', e => {
        const r = row.getBoundingClientRect();
        const tilt = Math.max(-7, Math.min(7, (e.clientX - lastX) * .6)); lastX = e.clientX;
        thumb.style.setProperty('--tx', (e.clientX - r.left) + 'px');
        thumb.style.setProperty('--ty', (e.clientY - r.top) + 'px');
        thumb.style.setProperty('--rot', tilt + 'deg');
      });
    });
  }
  follow();
  $$('[data-collections-rows], [data-jlist]').forEach(l => new MutationObserver(follow).observe(l, { childList: true }));

  /* ---------- 5. Faixa de texto que acelera com a rolagem ---------- */
  const tracks = $$('.ticker-track');
  if (tracks.length && tracks[0].getAnimations) {
    let lastY = scrollY, speed = 1, raf = 0;
    const loop = () => {
      const v = Math.abs(scrollY - lastY); lastY = scrollY;
      const want = 1 + Math.min(5, v * .12);
      speed += (want - speed) * .12;
      tracks.forEach(t => t.getAnimations().forEach(a => { a.playbackRate = speed; }));
      raf = Math.abs(speed - 1) > .01 ? requestAnimationFrame(loop) : 0;
    };
    addEventListener('scroll', () => { if (!raf) raf = requestAnimationFrame(loop); }, { passive: true });
  }

  /* ---------- 6. Topo da home responde ao mouse ---------- */
  const hero = $('.hero');
  if (hero && fine) {
    const title = $('.hero-title', hero), photo = $('.hero-figure .img-reveal', hero);
    let tx = 0, ty = 0, cx = 0, cy = 0, raf = 0;
    const loop = () => {
      cx += (tx - cx) * .08; cy += (ty - cy) * .08;
      if (title) title.style.translate = `${(-cx * 14).toFixed(2)}px ${(-cy * 8).toFixed(2)}px`;
      if (photo) photo.style.translate = `${(cx * 18).toFixed(2)}px ${(cy * 12).toFixed(2)}px`;
      raf = Math.abs(tx - cx) + Math.abs(ty - cy) > .001 ? requestAnimationFrame(loop) : 0;
    };
    hero.addEventListener('mousemove', e => {
      const r = hero.getBoundingClientRect();
      tx = (e.clientX - r.left) / r.width - .5; ty = (e.clientY - r.top) / r.height - .5;
      if (!raf) raf = requestAnimationFrame(loop);
    });
    hero.addEventListener('mouseleave', () => { tx = 0; ty = 0; if (!raf) raf = requestAnimationFrame(loop); });
  }

  /* ---------- 7. Logo: o ponto pula quando o mouse passa ---------- */
  $$('.brand').forEach(b => b.addEventListener('mouseenter', () => {
    const d = $('.lr-dot', b); if (!d) return;
    d.classList.remove('is-hop'); void d.offsetWidth; d.classList.add('is-hop');
  }));
  html.classList.add('has-life');
})();
