/* ============================================================
   LU.RICOS — campanha de Natal ("Tempo de presentear")
   Tudo o que é do Natal mora aqui e em natal.css. Liga e desliga
   em assets/data.js, em LR.natal.ativo. Desligado, este arquivo
   não faz nada e o site volta ao visual de sempre.

   Componentes (cada um é uma função):
   Kit (SVG desenhado em código): pinheiro, bola, estrela, laço,
   fita, caixa de presente, cordão de luzes.
   Hero, Guia de presentes, Seleção, Banner, Chegando (relógios a
   caminho), Faixa do topo, Rodapé, Partículas e os detalhes de
   cada página interna.
   ============================================================ */
(function () {
  const N = window.LR && LR.natal;
  if (!N || !N.ativo) return;
  document.documentElement.classList.add('is-natal');

  /* ---------- Kit de enfeites em SVG ---------- */
  let uid = 0;
  const id = p => `${p}${++uid}`;
  const rand = seed => { let s = seed % 2147483647 || 1; return () => (s = s * 16807 % 2147483647) / 2147483647; };
  const GREENS = ['#173022', '#1d3a28', '#24492f', '#2e5b3a', '#355f40'];

  // ramo de pinheiro: um galho com agulhas desenhadas uma a uma, alguns galhos laterais e pontas com neve
  function pine(seed = 7, len = 420) {
    const r = rand(seed), parts = [], all = [];
    const branch = (x, y, a, L, depth) => {
      const steps = Math.max(6, Math.round(L / 6)), pts = [];
      let d = `M${x.toFixed(1)} ${y.toFixed(1)}`;
      for (let i = 0; i < steps; i++) { a += (r() - .5) * .05; x += Math.cos(a) * 6; y += Math.sin(a) * 6; d += ` L${x.toFixed(1)} ${y.toFixed(1)}`; pts.push([x, y, a, i / steps]); all.push([x, y]); }
      parts.push(`<path d="${d}" stroke="#3a2a1e" stroke-width="${depth ? 2 : 3.6}" fill="none" stroke-linecap="round"/>`);
      pts.forEach(([px, py, pa, t]) => {
        const nl = (depth ? 17 : 25) * (1 - t * .5) * (.8 + r() * .4);
        for (const side of [-1, 1]) {
          const na = pa + side * (.8 + r() * .3) - .2, ex = px + Math.cos(na) * nl, ey = py + Math.sin(na) * nl;
          parts.push(`<line x1="${px.toFixed(1)}" y1="${py.toFixed(1)}" x2="${ex.toFixed(1)}" y2="${ey.toFixed(1)}" stroke="${GREENS[Math.floor(r() * GREENS.length)]}" stroke-width="2.3" stroke-linecap="round"/>`);
          all.push([ex, ey]);
          if (r() < .07) parts.push(`<circle cx="${ex.toFixed(1)}" cy="${ey.toFixed(1)}" r="${(1.8 + r() * 1.6).toFixed(1)}" fill="#f4f1ea" opacity=".92"/>`);
        }
      });
      return pts;
    };
    const main = branch(0, 0, .1, len, 0);
    for (const k of [.16, .34, .52, .7]) { const p = main[Math.floor(k * main.length)]; branch(p[0], p[1], p[2] + (r() < .5 ? -.65 : .65), len * (.34 - k * .14), 1); }
    const xs = all.map(p => p[0]), ys = all.map(p => p[1]);
    const x0 = Math.min(...xs) - 6, y0 = Math.min(...ys) - 6, w = Math.max(...xs) - x0 + 6, h = Math.max(...ys) - y0 + 6;
    return `<svg class="k-pine" viewBox="${x0.toFixed(0)} ${y0.toFixed(0)} ${w.toFixed(0)} ${h.toFixed(0)}" aria-hidden="true" focusable="false">${parts.join('')}</svg>`;
  }

  // bola de Natal: vermelha ou dourada, com reflexo
  function ball(tone = 'red') {
    const g = id('b'), c = id('c');
    const stops = tone === 'gold' ? ['#f6e2b4', '#C5A16B', '#6d5127'] : ['#e8475b', '#C51D32', '#460C13'];
    return `<svg class="k-ball" viewBox="0 0 100 124" aria-hidden="true" focusable="false"><defs>
      <radialGradient id="${g}" cx="36%" cy="34%" r="70%"><stop offset="0" stop-color="${stops[0]}"/><stop offset=".45" stop-color="${stops[1]}"/><stop offset="1" stop-color="${stops[2]}"/></radialGradient>
      <linearGradient id="${c}" x1="0" x2="1"><stop offset="0" stop-color="#8a6a3a"/><stop offset=".5" stop-color="#f0d9a5"/><stop offset="1" stop-color="#8a6a3a"/></linearGradient></defs>
      <circle cx="50" cy="8" r="5" fill="none" stroke="#C5A16B" stroke-width="2.4"/>
      <rect x="38" y="11" width="24" height="15" rx="2" fill="url(#${c})"/>
      <circle cx="50" cy="74" r="48" fill="url(#${g})"/>
      <ellipse cx="34" cy="56" rx="11" ry="17" fill="#fff" opacity=".28" transform="rotate(28 34 56)"/></svg>`;
  }

  // estrela metálica de 8 pontas, com faces claras e escuras como as das referências
  function star(tone = 'gold') {
    const L = tone === 'gold' ? ['#f7e3b2', '#a8824b'] : ['#f2f1ec', '#9fa3a8'];
    const C = 50, pts = [];
    for (let k = 0; k < 8; k++) { const a = -Math.PI / 2 + k * Math.PI / 4, R = k % 2 ? 24 : 49; pts.push([C + Math.cos(a) * R, C + Math.sin(a) * R]); }
    const inner = k => { const a = -Math.PI / 2 + (k + .5) * Math.PI / 4; return [C + Math.cos(a) * 9, C + Math.sin(a) * 9]; };
    let tri = '';
    for (let k = 0; k < 8; k++) {
      const T = pts[k], A = inner((k + 7) % 8), B = inner(k);
      tri += `<polygon points="${C},${C} ${A[0].toFixed(1)},${A[1].toFixed(1)} ${T[0].toFixed(1)},${T[1].toFixed(1)}" fill="${L[0]}"/><polygon points="${C},${C} ${T[0].toFixed(1)},${T[1].toFixed(1)} ${B[0].toFixed(1)},${B[1].toFixed(1)}" fill="${L[1]}"/>`;
    }
    return `<svg class="k-star" viewBox="0 0 100 100" aria-hidden="true" focusable="false">${tri}</svg>`;
  }

  // laço de cetim
  function bow(tone = 'red') {
    const g = id('w'), col = tone === 'gold' ? ['#f3dca6', '#C5A16B', '#7c5d2e'] : ['#e04a5d', '#C51D32', '#5e0f19'];
    return `<svg class="k-bow" viewBox="0 0 160 110" aria-hidden="true" focusable="false"><defs><linearGradient id="${g}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${col[0]}"/><stop offset=".5" stop-color="${col[1]}"/><stop offset="1" stop-color="${col[2]}"/></linearGradient></defs>
      <path d="M80 50 C60 10 12 8 14 38 C16 62 58 60 80 50Z" fill="url(#${g})"/><path d="M80 50 C100 10 148 8 146 38 C144 62 102 60 80 50Z" fill="url(#${g})"/>
      <path d="M76 54 L52 104 L64 98 L70 108 L82 56Z" fill="${col[2]}"/><path d="M84 54 L108 104 L96 98 L90 108 L78 56Z" fill="${col[1]}"/>
      <rect x="70" y="40" width="20" height="20" rx="5" fill="${col[1]}"/><path d="M26 36 C36 26 58 30 74 46" stroke="#fff" stroke-opacity=".25" stroke-width="3" fill="none"/></svg>`;
  }

  // caixa de presente vista de frente: corpo, tampa, fita cruzada e laço
  function gift({ body = '#8C101D', dark = '#460C13', band = '#C5A16B', w = 200, h = 170 } = {}) {
    const g = id('g'), lidH = Math.round(h * .2);
    return `<svg class="k-gift" viewBox="0 0 ${w} ${h + 46}" aria-hidden="true" focusable="false"><defs><linearGradient id="${g}" x1="0" x2="1"><stop offset="0" stop-color="${body}"/><stop offset=".7" stop-color="${body}"/><stop offset="1" stop-color="${dark}"/></linearGradient></defs>
      <g transform="translate(0 46)"><rect x="${w * .05}" y="${lidH}" width="${w * .9}" height="${h - lidH}" fill="url(#${g})"/>
      <rect x="0" y="0" width="${w}" height="${lidH}" fill="${body}"/><rect x="0" y="${lidH - 4}" width="${w}" height="5" fill="${dark}" opacity=".45"/>
      <rect x="${w / 2 - w * .07}" y="0" width="${w * .14}" height="${h}" fill="${band}"/><rect x="${w / 2 - w * .07}" y="0" width="${w * .035}" height="${h}" fill="#fff" opacity=".18"/></g>
      <g transform="translate(${w / 2 - 55} 0) scale(.69)">${bow(band === '#C5A16B' ? 'gold' : 'red').replace('<svg class="k-bow" viewBox="0 0 160 110"', '<svg viewBox="0 0 160 110" width="160" height="110"')}</g></svg>`;
  }

  // fita de cetim solta, em curva
  function ribbon(variant = 1) {
    const g = id('r');
    const d = variant === 1 ? 'M-20 150 C120 40 240 230 380 120 S600 60 720 160' : 'M-20 60 C140 160 300 -10 460 90 S700 150 780 40';
    return `<svg class="k-ribbon" viewBox="0 0 760 220" preserveAspectRatio="none" aria-hidden="true" focusable="false"><defs><linearGradient id="${g}" x1="0" x2="1"><stop offset="0" stop-color="#5e0f19"/><stop offset=".3" stop-color="#C51D32"/><stop offset=".55" stop-color="#e65468"/><stop offset=".75" stop-color="#C51D32"/><stop offset="1" stop-color="#5e0f19"/></linearGradient></defs>
      <path d="${d}" stroke="url(#${g})" stroke-width="34" fill="none" stroke-linecap="round"/><path d="${d}" stroke="#fff" stroke-opacity=".16" stroke-width="5" fill="none" transform="translate(0 -9)"/></svg>`;
  }

  // cordão de luzes quentes que pendura de um lado ao outro
  function lights(n = 18, w = 1000, sag = 70) {
    let bulbs = '';
    for (let i = 1; i < n; i++) {
      const t = i / n, x = t * w, y = 10 + 4 * sag * t * (1 - t);
      bulbs += `<g class="k-bulb" style="--i:${i % 6}"><circle cx="${x.toFixed(1)}" cy="${(y + 7).toFixed(1)}" r="11" class="k-halo"/><circle cx="${x.toFixed(1)}" cy="${(y + 7).toFixed(1)}" r="3.6" class="k-core"/></g>`;
    }
    return `<svg class="k-lights" viewBox="0 0 ${w} ${sag + 40}" preserveAspectRatio="none" aria-hidden="true" focusable="false"><path d="M0 10 Q${w / 2} ${10 + 2 * sag} ${w} 10" stroke="#2a1a12" stroke-width="2" fill="none"/>${bulbs}</svg>`;
  }

  // gorro de Papai Noel, para pousar no canto de um título (sem espaços entre as tags: o split de palavras não mexe nele)
  function hat() {
    const g = id('h'), f = id('f');
    return `<svg class="k-hat-svg" viewBox="0 0 130 112" aria-hidden="true" focusable="false"><defs><linearGradient id="${g}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#e2384d"/><stop offset=".55" stop-color="#C51D32"/><stop offset="1" stop-color="#7a0f1c"/></linearGradient><linearGradient id="${f}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffffff"/><stop offset="1" stop-color="#d9d6cf"/></linearGradient></defs><path d="M16 80C18 46 44 14 82 12C104 11 118 26 114 48C112 58 108 64 102 66L96 56C100 44 94 34 84 36C66 40 62 60 66 82Z" fill="url(#${g})"/><path d="M30 70C36 46 54 26 76 20" stroke="#fff" stroke-opacity=".18" stroke-width="5" fill="none" stroke-linecap="round"/><rect x="6" y="72" width="78" height="24" rx="12" fill="url(#${f})"/><circle cx="102" cy="68" r="13" fill="url(#${f})"/></svg>`;
  }

  // enfeite pendurado: fio + bola ou estrela, balançando
  const hang = (thing, cls, len) => `<span class="k-hang ${cls}" style="--len:${len}" aria-hidden="true"><i class="k-string"></i>${thing}</span>`;

  /* ---------- Partículas: neve leve, luzes desfocadas e brilho dourado, só dentro da seção ---------- */
  function particles(el, { luzes = 12, neve = 70, ouro = true } = {}, reduced) {
    if (reduced || !el || el.querySelector(':scope > .k-sky')) return;
    const cv = document.createElement('canvas'); cv.className = 'k-sky'; cv.setAttribute('aria-hidden', 'true'); el.appendChild(cv);
    const ctx = cv.getContext('2d'); let W = 0, H = 0, flakes = [], glows = [], on = true, raf, t = 0;
    const size = () => { const r = el.getBoundingClientRect(), d = Math.min(devicePixelRatio || 1, 2); W = r.width; H = r.height; cv.width = W * d; cv.height = H * d; ctx.setTransform(d, 0, 0, d, 0, 0);
      const n = Math.min(neve, Math.round(W / 18));
      flakes = Array.from({ length: n }, (_, i) => ({ x: Math.random() * W, y: Math.random() * H, r: .7 + Math.random() * 1.7, v: .2 + Math.random() * .55, s: Math.random() * 6.28, a: .3 + Math.random() * .5, gold: ouro && i % 7 === 0 }));
      glows = Array.from({ length: luzes }, () => ({ x: Math.random() * W, y: Math.random() * H * .8, r: 16 + Math.random() * 44, ph: Math.random() * 6.28, sp: .006 + Math.random() * .01 })); };
    const tick = () => { if (!on) return; t++; ctx.clearRect(0, 0, W, H);
      ctx.globalCompositeOperation = 'lighter';
      for (const l of glows) { const a = .07 + .07 * Math.sin(l.ph + t * l.sp); const g = ctx.createRadialGradient(l.x, l.y, 0, l.x, l.y, l.r);
        g.addColorStop(0, `rgba(255,210,150,${a + .06})`); g.addColorStop(1, 'rgba(255,210,150,0)'); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(l.x, l.y, l.r, 0, 6.283); ctx.fill(); }
      ctx.globalCompositeOperation = 'source-over';
      for (const f of flakes) { f.y += f.v; f.s += .01; f.x += Math.sin(f.s) * .3; if (f.y > H + 4) { f.y = -4; f.x = Math.random() * W; }
        ctx.globalAlpha = f.gold ? .5 + .4 * Math.sin(t * .05 + f.s) : f.a; ctx.fillStyle = f.gold ? '#e3c58d' : '#f4f1ea';
        ctx.beginPath(); ctx.arc(f.x, f.y, f.gold ? f.r * .8 : f.r, 0, 6.283); ctx.fill(); }
      ctx.globalAlpha = 1; raf = requestAnimationFrame(tick); };
    size(); addEventListener('resize', size);
    const io = new IntersectionObserver(([e]) => { const vis = e.isIntersecting && !document.hidden; if (vis && !on) { on = true; tick(); } else if (!vis) { on = false; cancelAnimationFrame(raf); } });
    io.observe(el);
    document.addEventListener('visibilitychange', () => { if (document.hidden) { on = false; cancelAnimationFrame(raf); } });
    tick();
  }

  /* ---------- Componentes ---------- */
  function init(api) {
    const { $, $$, esc, wa, pic, pad, card, CARD_SIZES, B, page, reduced } = api;
    const prazo = LR.natalPrazo();
    const prazoTxt = prazo ? `Em Marabá, pedindo até ${prazo}, chega antes do Natal.` : '';
    const price = p => LR.format.price(p.price);
    // arte de campanha: versão de 600 px ao lado (nome-600.jpg)
    const camp = (src, sizes) => `src="${src}" srcset="${src.replace(/\.jpg$/, '-600.jpg')} 480w, ${src} 960w" sizes="${sizes}"`;

    // Faixa do topo: vermelho natalino, estrelas douradas, mensagens reais
    (function strip() {
      if ($('.natal-strip')) return;
      const itens = [...new Set([`LU.RICOS · ${N.campanha}`, prazo ? `Pedindo até ${prazo}, chega antes do Natal em Marabá` : 'Tempo de presentear', B.entrega, 'Presentes para ele e para ela', B.pagamento])];
      const linha = itens.map(t => `${esc(t)} <i class="k-mini-star"></i>`).join(' ');
      document.body.insertAdjacentHTML('afterbegin', `<div class="natal-strip" role="note"><span class="sr-only">${esc(itens.join('. '))}.</span>
        <div class="natal-strip-track" aria-hidden="true"><span>${linha}</span><span>${linha}</span></div></div>`);
    })();

    // Carrinho: mensagem natalina com o prazo, e um laço no topo
    (function cart() {
      const note = $('.cart-note'); if (!note || $('.cart-natal')) return;
      note.insertAdjacentHTML('beforebegin', `<div class="cart-natal"><span class="cart-natal-bow">${bow()}</span><p><b>Presente de Natal?</b> ${prazoTxt ? esc(prazoTxt) + ' ' : ''}Conte no pedido que é presente.</p></div>`);
    })();

    // Rodapé: faixa bordô com pinheiros, luzes, estrelas e a mensagem de fim de ano
    (function footer() {
      const f = $('.footer'); if (!f || $('.natal-foot')) return;
      f.insertAdjacentHTML('beforebegin', `<section class="natal-foot" aria-label="Boas festas">
        <div class="k-lights-row">${lights(22, 1400, 50)}</div>
        <span class="k-corner k-tl">${pine(11, 360)}</span><span class="k-corner k-tr">${pine(23, 360)}</span>
        <div class="natal-foot-in"><span class="label"><i class="k-mini-star"></i> ${esc(N.campanha)}</span>
          <p class="natal-foot-title">Que o seu Natal<br>seja atemporal.</p>
          <p class="natal-foot-sign">Boas festas. LU<i class="dot"></i>RICOS.</p></div>
        <span class="k-float k-f1">${star()}</span><span class="k-float k-f2">${star()}</span><span class="k-float k-f3">${star('silver')}</span></section>`);
    })();

    // enfeites pendurados no cabeçalho das páginas internas
    const headDeco = el => { if (!el || $('.k-headdeco', el)) return;
      el.insertAdjacentHTML('afterbegin', `<div class="k-headdeco" aria-hidden="true"><span class="k-corner k-tr">${pine(5, 300)}</span>
        ${hang(ball('red'), 'h1', '56px')}${hang(star(), 'h2', '96px')}${hang(ball('gold'), 'h3', '40px')}</div>`); };

    // faixa curta de campanha para as páginas internas
    const miniBanner = (texto, link, label) => `<aside class="natal-mini" aria-label="Natal">
      <span class="natal-mini-gift">${gift({ w: 120, h: 96 })}</span>
      <div><span class="label"><i class="k-mini-star"></i> ${esc(N.campanha)} · Tempo de presentear</span><p>${texto}</p></div>
      ${link ? `<a class="link" href="${link}">${label} <span class="arrow">→</span></a>` : ''}</aside>`;

    if (page === 'home') home();
    // gorros de Papai Noel em alguns títulos (poucos por página)
    const HATS = {
      home: ['#presentes h2', '#vitrine h2', '#jornal h2'],
      loja: ['main > .page-head h1'], colecoes: ['main > .page-head h1'], jornal: ['main > .page-head h1'],
      contato: ['main > .page-head h1'],
    };
    // nos títulos grandes das páginas, o gorro vai no fim da palavra (à esquerda fica a navegação "Início / …")
    (HATS[page] || []).forEach(sel => { const h = $(sel); if (!h || $('.k-hat', h)) return; const big = h.tagName === 'H1';
      h.classList.add('has-hat'); if (big) h.classList.add('hat-r');
      h.insertAdjacentHTML(big ? 'beforeend' : 'afterbegin', `<span class="k-hat" aria-hidden="true">${hat()}</span>`); });
    // sobre as áreas vermelhas, o menu deixa de inverter as cores (natal.css: .k-dark-top)
    const darkTop = () => {
      const els = $$('.xh, .xb, .natal-foot, .natal-cols, .natal-thanks'); if (!els.length || !('IntersectionObserver' in window)) return;
      const on = new Set();
      const io = new IntersectionObserver(es => { es.forEach(e => e.isIntersecting ? on.add(e.target) : on.delete(e.target)); document.documentElement.classList.toggle('k-dark-top', on.size > 0); },
        { rootMargin: `0px 0px -${Math.max(0, innerHeight - 70)}px 0px` });
      els.forEach(el => io.observe(el));
    };
    setTimeout(darkTop, 0);
    if (page === 'loja') { headDeco($('main > .page-head')); $('main > .page-head').insertAdjacentHTML('afterend', `<div class="wrap natal-mini-wrap">${miniBanner(`Os relógios da vitrine para dar de presente. ${prazoTxt}`, 'index.html#presentes', 'Ver o guia de presentes')}</div>`); }
    if (page === 'colecoes') colecoes();
    if (page === 'produto') produto();
    if (page === 'sobre') sobre();
    if (page === 'jornal') jornal();
    if (page === 'contato') contato();
    if (page === '404') headDeco($('main > .notfound'));
    if (page === 'artigo') { const art = $('main > .article'); if (art && !$('.k-headdeco', art)) { art.style.position = 'relative'; art.insertAdjacentHTML('afterbegin', `<div class="k-headdeco is-article" aria-hidden="true">${hang(ball('red'), 'h1', '50px')}${hang(star(), 'h2', '86px')}${hang(ball('gold'), 'h3', '34px')}</div>`); } }

    /* ---------- Home ---------- */
    function home() {
      const old = $('main > .hero');
      // Hero: fundo bordô, relógio real recortado dentro de uma caixa de presente aberta
      const H = N.hero, hp = H && LR.byId(H.id);
      if (H && hp && old && !$('.xh')) {
        old.insertAdjacentHTML('beforebegin', `<section class="xh" aria-labelledby="xh-title">
          <div class="xh-deco" aria-hidden="true">
            <div class="k-lights-row xh-lights">${lights(20, 1400, 60)}</div>
            <span class="k-corner k-tl">${pine(3, 440)}</span><span class="k-corner k-tr">${pine(17, 520)}</span>
            ${hang(ball('red'), 'xh-h1', 'clamp(70px, 12vh, 150px)')}${hang(star(), 'xh-h2', 'clamp(110px, 20vh, 230px)')}${hang(ball('gold'), 'xh-h3', 'clamp(50px, 8vh, 100px)')}
          </div>
          <div class="xh-in wrap">
            <div class="xh-copy" data-enter>
              <span class="label xh-eyebrow"><i class="k-mini-star"></i> LU.RICOS — ${esc(N.campanha)}</span>
              <h1 class="xh-title" id="xh-title"><span>${esc(H.titulo[0])}</span><span>${esc(H.titulo[1])}<i class="dot"></i></span></h1>
              <p class="xh-lead">${esc(H.texto)}</p>
              ${prazoTxt ? `<p class="xh-fact"><i class="k-mini-star"></i> ${esc(prazoTxt)}</p>` : ''}
              <div class="xh-cta"><a class="btn xh-btn" href="#presentes">Ver presentes <span class="arrow">→</span></a><a class="btn btn-ghost xh-btn2" href="loja.html">Explorar vitrine <span class="arrow">→</span></a></div>
            </div>
            <a class="xh-stage" href="${LR.url.product(hp)}" aria-label="${esc(hp.name)}, ${esc(price(hp))}">
              <span class="xh-lid"></span><span class="xh-back"></span><span class="xh-cushion"></span>
              <img class="xh-watch" src="${H.recorte}" alt="${esc(hp.name)}" width="627" height="973" fetchpriority="high">
              <span class="xh-front"><span class="xh-band"></span></span>
              <span class="xh-bow">${bow()}</span>
              <span class="xh-rib">${ribbon(1)}</span>
              <span class="xh-tag"><b>${esc(hp.name)}</b><span>${esc(price(hp))}${LR.stockLabel(hp) ? ' · ' + esc(LR.stockLabel(hp)) : ''}</span></span>
            </a>
          </div>
        </section>`);
        particles($('.xh'), { luzes: 14, neve: 80 }, reduced);
      }

      const ticker = $('main > .ticker:not(.ticker-big)');
      const after = ticker || $('.xh');
      if (!after || $('.xg')) return chegando();

      // Guia de presentes
      const G = (N.guia || []).map(g => ({ ...g, p: LR.byId(g.id) })).filter(g => g.p);
      const guia = G.length ? `<section class="section wrap xg" id="presentes" aria-labelledby="xg-title">
        <header class="sec-head"><span class="label" data-reveal><i class="k-mini-star"></i> Guia de presentes · ${esc(N.campanha)}</span>
          <h2 class="display display-m" id="xg-title">O presente<br>certo.</h2>
          <a class="link sec-link" href="loja.html" data-reveal>Ver a vitrine <span class="arrow">→</span></a></header>
        <p class="xg-sub" data-reveal>Para cada pessoa, existe um relógio que combina.</p>
        <div class="xg-grid">${G.map((g, i) => `<a class="xg-card" href="${LR.url.product(g.p)}" data-reveal style="--d:${i * .08}s">
          <span class="xg-media"><img ${g.imagem ? camp(g.imagem, '(max-width: 700px) 50vw, 25vw') : pic(g.p.images[0], '(max-width: 700px) 50vw, 25vw')} alt="${esc(g.p.name)}" loading="lazy">${g.imagem ? '<span class="xg-art">Arte de campanha</span>' : ''}<span class="xg-ribbon" aria-hidden="true"></span><span class="xg-bow" aria-hidden="true">${bow()}</span></span>
          <span class="xg-body"><span class="label">${esc(g.titulo)}</span><b class="xg-name">${esc(g.p.name)}</b><span class="xg-text">${esc(g.texto)}</span>
          <span class="xg-foot"><span class="num">${esc(price(g.p))}</span><span class="xg-go">Ver <span class="arrow">→</span></span></span></span></a>`).join('')}</div>
      </section>` : '';

      // Seleção de Natal: relógios recortados sobre pedestais vermelhos, como numa vitrine de loja
      const S = (N.selecao || []).map(s => ({ ...s, p: LR.byId(s.id) })).filter(s => s.p && s.p.status !== 'esgotado');
      const selecao = S.length ? `<section class="section xs" aria-labelledby="xs-title"><div class="wrap">
        <header class="sec-head"><span class="label" data-reveal><span class="xs-tag"><i class="k-mini-star"></i> Seleção de Natal</span></span>
          <h2 class="display display-m" id="xs-title">Escolhidos para<br>presentear.</h2>
          <a class="link sec-link" href="loja.html" data-reveal>Toda a vitrine <span class="arrow">→</span></a></header>
        <div class="xs-stage">
          <span class="xs-rib" aria-hidden="true">${ribbon(2)}</span>
          <span class="k-float xs-s1" aria-hidden="true">${star()}</span><span class="k-float xs-s2" aria-hidden="true">${star('silver')}</span><span class="k-float xs-s3" aria-hidden="true">${star()}</span>
          <span class="xs-gift xs-g1" aria-hidden="true">${gift({ body: '#E9E7E2', dark: '#bdb9b0', band: '#C51D32', w: 150, h: 120 })}</span>
          <span class="xs-gift xs-g2" aria-hidden="true">${gift({ w: 120, h: 100 })}</span>
          ${S.map((s, i) => `<a class="xs-item" href="${LR.url.product(s.p)}" style="--h:${[.62, .82, .52, .72][i % 4]}" data-reveal>
            <span class="xs-watch"><img src="${s.recorte}" alt="${esc(s.p.name)}" loading="lazy"></span>
            <span class="xs-ped" aria-hidden="true"><i></i></span>
            <span class="xs-info"><b>${esc(s.p.name)}</b><span class="num">${esc(price(s.p))}</span>${LR.stockLabel(s.p) ? `<span class="xs-stock">${esc(LR.stockLabel(s.p))}</span>` : ''}</span></a>`).join('')}
        </div></div></section>` : '';

      // Banner: "Não deixe para a última hora", com o prazo real
      const BA = N.bannerArte, bap = BA && LR.byId(BA.id);
      const banner = `<section class="xb" aria-labelledby="xb-title"><div class="wrap xb-in">
        <div class="xb-copy"><span class="label"><i class="k-mini-star"></i> ${esc(N.campanha)}</span>
          <h2 class="xb-title" id="xb-title">Não deixe para<br>a última hora.</h2>
          <p class="xb-text">Escolha o presente de Natal de quem você ama.</p>
          ${prazoTxt ? `<p class="xb-fact">${esc(prazoTxt)} ${esc(B.entrega)}.</p>` : ''}
          <a class="btn xb-btn" href="#presentes">Encontre seu presente <span class="arrow">→</span></a></div>
        ${BA && bap ? `<a class="xb-photo" href="${LR.url.product(bap)}" aria-label="${esc(bap.name)}">
          <img ${camp(BA.imagem, '(max-width: 860px) 90vw, 40vw')} alt="${esc(bap.name)}" loading="lazy"><span class="xg-art">Arte de campanha</span>
          <span class="xb-g xb-g3" aria-hidden="true">${gift({ body: '#141414', dark: '#000', band: '#C5A16B', w: 130, h: 110 })}</span>
          <span class="k-float xb-s1" aria-hidden="true">${star()}</span><span class="k-float xb-s2" aria-hidden="true">${star()}</span></a>` : `<div class="xb-art" aria-hidden="true">
          <span class="xb-g xb-g1">${gift({ body: '#C51D32', dark: '#7a0f1c', w: 220, h: 190 })}</span>
          <span class="xb-g xb-g2">${gift({ body: '#E9E7E2', dark: '#bdb9b0', band: '#C51D32', w: 170, h: 140 })}</span>
          <span class="xb-g xb-g3">${gift({ body: '#141414', dark: '#000', band: '#C5A16B', w: 130, h: 110 })}</span>
          <span class="xb-rib">${ribbon(1)}</span>
          <span class="k-float xb-s1">${star()}</span><span class="k-float xb-s2">${star()}</span><span class="k-float xb-s3">${star('silver')}</span>
        </div>`}</div></section>`;

      after.insertAdjacentHTML('afterend', guia + selecao + banner);
      particles($('.xb'), { luzes: 8, neve: 40 }, reduced);
      chegando();
    }

    // Relógios comprados que ainda estão a caminho (seção que já existia na home)
    function chegando() {
      const sec = $('[data-natal]'); if (!sec || !N.chegando) return;
      sec.hidden = false;
      const ano = $('[data-natal-ano]', sec); if (ano) ano.textContent = N.ano || '';
      const cnt = $('[data-natal-count]', sec); if (cnt) cnt.textContent = pad(N.chegando.length);
      const pz = $('[data-natal-prazo]', sec); if (pz && prazo) pz.innerHTML = `<b>Em Marabá, peça até ${prazo} para receber antes do Natal</b> · `;
      if (!$('.k-headdeco', sec)) sec.insertAdjacentHTML('afterbegin', `<div class="k-headdeco" aria-hidden="true">${hang(ball('red'), 'h1', '50px')}${hang(star(), 'h2', '84px')}${hang(ball('gold'), 'h3', '36px')}</div>`);
      const venda = LR.products.filter(p => p.status !== 'esgotado');
      const tile = (c, i) => `<article class="pcard is-chegando" data-reveal style="--d:${(i % 4) * .08}s">
        <div class="pcard-media"><img class="main" ${pic(c.img, CARD_SIZES)} alt="${esc(c.name)}" loading="lazy">
          <span class="pcard-badge is-signal">Chega para o Natal</span><span class="pcard-note">Foto do fornecedor</span>
          <div class="pcard-quick"><a class="btn" href="${wa(`Olá! Quero reservar o ${c.name} (${c.subtitle}) para o Natal.`)}" target="_blank" rel="noopener">Reservar <span class="arrow">→</span></a></div></div>
        <div class="pcard-info"><div><h3 class="pcard-name">${esc(c.name)}</h3><p class="pcard-sub">${esc(c.subtitle)}</p></div><div class="pcard-price">Preço em breve</div></div></article>`;
      const F = [
        { k: 'chegando', t: 'Chegando', list: () => N.chegando.map(c => ({ c })) },
        { k: 'ele', t: 'Para ele', list: () => [...N.chegando.filter(c => c.para === 'ele').map(c => ({ c })), ...venda.map(p => ({ p }))] },
        { k: 'ela', t: 'Para ela', list: () => N.chegando.filter(c => c.para === 'ela').map(c => ({ c })) },
        { k: 'ate160', t: 'Até R$ 160', list: () => venda.filter(p => p.price <= 160).map(p => ({ p })) },
      ];
      const chips = $('[data-natal-chips]', sec), grid = $('[data-natal-grid]', sec);
      let cur = 'chegando';
      chips.innerHTML = F.map(f => `<button class="chip ${f.k === cur ? 'is-active' : ''}" type="button" aria-pressed="${f.k === cur}" data-natal-f="${f.k}">${f.t} <span class="num">${pad(f.list().length)}</span></button>`).join('');
      const show = () => {
        const items = F.find(f => f.k === cur).list();
        grid.innerHTML = items.map((it, i) => it.c ? tile(it.c, i) : card(it.p, i)).join('')
          + (cur === 'chegando' ? `<a class="natal-more" href="#vitrine" data-reveal><span class="label">Já à venda</span><b>${pad(venda.length)} relógios<br>à venda</b><span class="link">Ver agora <span class="arrow">→</span></span></a>` : '');
        api.reveals(); setTimeout(api.revealAboveFold, 50); api.refreshScroll();
      };
      chips.addEventListener('click', e => { const b = e.target.closest('[data-natal-f]'); if (!b) return; cur = b.dataset.natalF;
        $$('.chip', chips).forEach(c => { const on = c === b; c.classList.toggle('is-active', on); c.setAttribute('aria-pressed', on); });
        grid.style.opacity = 0; setTimeout(() => { show(); grid.style.opacity = 1; }, 180); });
      grid.style.transition = 'opacity .25s';
      show();
    }

    /* ---------- Páginas internas ---------- */
    function colecoes() {
      const head = $('main > .page-head'); headDeco(head);
      if (!head || $('.natal-cols')) return;
      const cols = LR.collections.map(c => ({ c, quem: { technos: 'Para surpreender', aco: 'Para o dia a dia', couro: 'Para quem gosta do clássico' }[c.slug] || '' }));
      head.insertAdjacentHTML('afterend', `<section class="natal-cols" aria-label="Coleções de Natal"><div class="wrap natal-cols-in">
        <div class="natal-cols-copy"><span class="label"><i class="k-mini-star"></i> ${esc(N.campanha)}</span><p class="natal-cols-title">Uma coleção<br>para cada presente.</p>${prazoTxt ? `<p class="natal-cols-fact">${esc(prazoTxt)}</p>` : ''}</div>
        <ul class="natal-cols-list">${cols.map(({ c, quem }) => `<li><a href="#${c.slug}"><span class="label">${esc(quem)}</span><b>${esc(c.name)}</b><span class="arrow">→</span></a></li>`).join('')}</ul>
        <span class="natal-cols-bow" aria-hidden="true">${bow('gold')}</span></div></section>`);
    }

    function produto() {
      const actions = $('.pdp-actions'); const p = LR.byId(document.body.dataset.product || new URLSearchParams(location.search).get('id'));
      if (!actions || !p || p.status === 'esgotado' || $('.natal-gift')) return;
      actions.insertAdjacentHTML('afterend', `<div class="natal-gift"><span class="natal-gift-bow" aria-hidden="true">${bow()}</span>
        <div><span class="label"><i class="k-mini-star"></i> Presente de Natal</span>
        <p>Um presente que dura muito depois do Natal${p.stock === 1 ? ', e é peça única' : ''}.</p>
        <p class="natal-gift-small">${prazoTxt ? esc(prazoTxt) + ' ' : ''}Conte no pedido que é presente.</p></div></div>`);
    }

    function sobre() {
      const head = $('main > .about-hero'); headDeco(head);
      if (!head || $('.natal-thanks')) return;
      head.insertAdjacentHTML('afterend', `<section class="natal-thanks" aria-label="Mensagem de fim de ano"><div class="wrap natal-thanks-in">
        <span class="label"><i class="k-mini-star"></i> Fim de ano</span>
        <p class="natal-thanks-title">Obrigado a quem escolheu<br>um relógio com a gente.</p>
        <p>Cada peça da vitrine foi escolhida e fotografada por nós, e cada venda foi uma conversa. Boas festas, e até o ano que vem.</p>
        <span class="k-corner k-tr">${pine(31, 340)}</span></div></section>`);
    }

    function jornal() {
      const head = $('main > .page-head'); headDeco(head);
      const a = LR.articles.find(x => x.slug === 'presente-de-natal');
      if (!head || !a || $('.natal-journal')) return;
      head.insertAdjacentHTML('afterend', `<section class="natal-journal" aria-label="Especial de Natal"><div class="wrap">
        <a class="natal-journal-card" href="${LR.url.article(a)}">
          <span class="natal-journal-media"><img ${pic(a.cover, '(max-width: 860px) 100vw, 50vw')} alt="" loading="lazy"><span class="k-hang-wrap" aria-hidden="true">${hang(ball('red'), 'h1', '44px')}${hang(star(), 'h2', '78px')}</span></span>
          <span class="natal-journal-copy"><span class="label"><i class="k-mini-star"></i> Especial de Natal</span><b>${esc(a.title)}</b><span>${esc(a.excerpt)}</span><span class="link">Ler o guia <span class="arrow">→</span></span></span>
        </a></div></section>`);
    }

    function contato() {
      const head = $('main > .page-head'); headDeco(head);
      if (!head || $('.natal-mini-wrap')) return;
      head.insertAdjacentHTML('afterend', `<div class="wrap natal-mini-wrap">${miniBanner('Na dúvida sobre o presente? Mande no WhatsApp para quem é e o estilo da pessoa, que a gente sugere opções com foto real.', wa('Olá! Estou procurando um relógio para dar de presente de Natal.'), 'Pedir sugestão')}</div>`);
      const a = $('.natal-mini-wrap a.link'); if (a) { a.target = '_blank'; a.rel = 'noopener'; }
    }
  }

  LR.Natal = { init, kit: { pine, ball, star, bow, gift, ribbon, lights, hat } };
})();
