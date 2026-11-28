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

  // fotos dos enfeites (recortadas, fundo transparente): assets/img/natal/elementos
  const EL = 'assets/img/natal/elementos/';
  const elImg = (name, cls, w, h) => `<img class="${cls}" src="${EL}${name}.webp" alt="" width="${w}" height="${h}" loading="lazy" decoding="async" draggable="false">`;

  // bola de Natal: foto da bola de glitter vermelha ("gold" usa outra bola da mesma foto, para não repetir)
  function ball(tone = 'red') { return elImg(tone === 'gold' ? 'bola-b' : 'bola-a', 'k-ball', 170, 207); }

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

  // gorro de Papai Noel (foto), para pousar no canto de um título (sem espaços: o split de palavras não mexe nele)
  function hat() { return elImg('gorro', 'k-hat-img', 260, 186); }

  /* ---------- Vitrine com cúpula (HolidayWatchDisplay = ChristmasPedestal + relógio + GlassDome) ----------
     Um SVG por relógio, com as camadas na ordem certa:
     sombra de contato → plataforma → parede de trás do vidro → relógio → sombra dele na base → vidro da frente → reflexos. */
  function watchDisplay(src, alt) {
    const k = id('d'), sh = `${k}s`, bf = `${k}bf`, bt = `${k}bt`, bl = `${k}bl`, ws = `${k}ws`, gl = `${k}gl`, rim = `${k}rm`, sheen = `${k}sn`, cau = `${k}ca`, fr = `${k}fr`;
    const DOME = 'M46 360 V152 A104 104 0 0 1 254 152 V360';
    // pontos de luz atrás da redoma: o vidro de trás desfoca e dobra esses pontos (é aí que o vidro "aparece")
    const BOKEH = [[40, 150, 9, .55], [258, 196, 12, .5], [52, 262, 6, .6], [250, 300, 8, .5], [236, 120, 5, .7], [62, 330, 10, .4], [150, 70, 7, .4],
      [92, 120, 11, .55], [206, 150, 9, .5], [84, 232, 13, .45], [218, 262, 12, .45], [118, 186, 6, .6], [190, 214, 7, .55], [100, 318, 9, .45], [204, 326, 8, .45]];
    // 1) ambiente atrás de tudo: luz quente (vinda do alto à esquerda), pontos de luz, sombra no chão, plataforma, aro de trás
    const back = `<svg class="hd-svg hd-back-svg" viewBox="0 0 300 470" role="img" aria-label="${alt}"><defs>
      <filter id="${bl}" x="-30%" y="-80%" width="160%" height="260%"><feGaussianBlur stdDeviation="7"/></filter>
      <radialGradient id="${gl}" cx="44%" cy="44%" r="50%"><stop offset="0" stop-color="#fff0d6" stop-opacity=".78"/><stop offset=".26" stop-color="#ffc48c" stop-opacity=".42"/><stop offset=".6" stop-color="#ff6a50" stop-opacity=".12"/><stop offset="1" stop-color="#ff6a50" stop-opacity="0"/></radialGradient>
      <radialGradient id="${sh}" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="#1a0205" stop-opacity=".75"/><stop offset="1" stop-color="#1a0205" stop-opacity="0"/></radialGradient>
      <linearGradient id="${bf}" x1="0" x2="1"><stop offset="0" stop-color="#4a0912"/><stop offset=".14" stop-color="#8a1120"/><stop offset=".36" stop-color="#bd2236"/><stop offset=".5" stop-color="#ad1a2e"/><stop offset=".76" stop-color="#7a0e1b"/><stop offset="1" stop-color="#2e050b"/></linearGradient>
      <radialGradient id="${bt}" cx="40%" cy="35%" r="70%"><stop offset="0" stop-color="#d93348"/><stop offset=".7" stop-color="#9c1527"/><stop offset="1" stop-color="#6e0d1a"/></radialGradient>
    </defs>
    <ellipse class="hd-glow" cx="140" cy="215" rx="240" ry="255" fill="url(#${gl})"/>
    <g class="hd-bokeh">${BOKEH.map(([cx, cy, r, o]) => `<circle cx="${cx}" cy="${cy}" r="${r}" fill="#ffdcaa" opacity="${o}"/>`).join('')}</g>
    <ellipse class="hd-contact" cx="160" cy="447" rx="134" ry="16" fill="url(#${sh})" filter="url(#${bl})"/>
    <g class="hd-base">
      <path d="M28 360 V430 A122 20 0 0 0 272 430 V360 Z" fill="url(#${bf})"/>
      <path d="M28 404 V430 A122 20 0 0 0 272 430 V404 A122 20 0 0 1 28 404Z" fill="#000" opacity=".16"/>
      <ellipse cx="150" cy="360" rx="122" ry="20" fill="url(#${bt})"/>
      <path d="M28 360 A122 20 0 0 1 272 360" fill="none" stroke="#fff" stroke-opacity=".35"/>
      <ellipse cx="150" cy="361" rx="106" ry="17" fill="#4a0711" opacity=".35"/>
    </g>
    <path d="M46 360 A104 17 0 0 1 254 360" fill="none" stroke="#fff" stroke-opacity=".3"/></svg>`;
    // 2) parede de trás da redoma: vidro (biblioteca liquid-glass) que desfoca, dobra nas bordas e separa as cores.
    //    Fica atrás do relógio, então só o ambiente é desfocado; o relógio continua nítido.
    // no celular a refração (filtro SVG sobre o fundo) pesa demais ao rolar: lá o vidro fica no modo fosco, que é leve
    const lite = matchMedia('(max-width: 860px), (pointer: coarse)').matches;
    const glass = `<span class="hd-glass" aria-hidden="true"><span class="glass hd-lg" data-glass-appearance="dark" data-glass-refraction="34" data-glass-bezel="24" data-glass-dispersion="0.18"${lite ? ' data-glass-mode="fallback"' : ''}></span></span>`;
    // 3) o relógio, a sombra dele e a luz que atravessa o vidro e cai na base (cáustica)
    const mid = `<svg class="hd-svg hd-mid-svg" viewBox="0 0 300 470" aria-hidden="true" focusable="false"><defs>
      <filter id="${ws}" x="-30%" y="-200%" width="160%" height="500%"><feGaussianBlur stdDeviation="4"/></filter>
      <radialGradient id="${cau}" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="#ffe9c9" stop-opacity=".55"/><stop offset="1" stop-color="#ffe9c9" stop-opacity="0"/></radialGradient></defs>
      <ellipse class="hd-caustic" cx="104" cy="362" rx="44" ry="7" fill="url(#${cau})"/>
      <ellipse class="hd-wshadow" cx="160" cy="355" rx="54" ry="7" fill="#1a0205" opacity=".55" filter="url(#${ws})"/>
      <image class="hd-watch" href="${src}" x="68" y="124" width="164" height="232" preserveAspectRatio="xMidYMax meet"/></svg>`;
    // 4) parede da frente: borda clara do lado da luz e escura do outro, brilho estreito, ponto de luz, faíscas e o aro
    const spark = (x, y, s, d) => `<path class="hd-spark" style="--d:${d}s" transform="translate(${x} ${y}) scale(${s})" d="M0 -10 L2 -2 L10 0 L2 2 L0 10 L-2 2 L-10 0 L-2 -2Z" fill="#fff"/>`;
    const front = `<svg class="hd-svg hd-front-svg" viewBox="0 0 300 470" aria-hidden="true" focusable="false"><defs>
      <linearGradient id="${rim}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".95"/><stop offset=".45" stop-color="#fff" stop-opacity=".55"/><stop offset="1" stop-color="#fff" stop-opacity=".18"/></linearGradient>
      <linearGradient id="${sheen}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".95"/><stop offset=".5" stop-color="#fff" stop-opacity=".35"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>
      <linearGradient id="${fr}" x1="0" x2="1"><stop offset="0" stop-color="#fff" stop-opacity=".95"/><stop offset=".55" stop-color="#fff" stop-opacity=".55"/><stop offset="1" stop-color="#fff" stop-opacity=".2"/></linearGradient>
      <clipPath id="${k}cl"><path d="${DOME} Z"/></clipPath>
      <linearGradient id="${k}vx" x1="0" x2="1"><stop offset="0" stop-color="#fff" stop-opacity=".26"/><stop offset=".18" stop-color="#fff" stop-opacity=".09"/><stop offset=".5" stop-color="#fff" stop-opacity=".05"/><stop offset=".82" stop-color="#fff" stop-opacity=".08"/><stop offset="1" stop-color="#fff" stop-opacity=".2"/></linearGradient>
      <linearGradient id="${k}vy" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".14"/><stop offset=".4" stop-color="#fff" stop-opacity="0"/><stop offset=".85" stop-color="#fff" stop-opacity=".03"/><stop offset="1" stop-color="#fff" stop-opacity=".12"/></linearGradient>
      <filter id="${k}rb" x="-50%" y="-20%" width="200%" height="140%"><feGaussianBlur stdDeviation="6"/></filter></defs>
      <path class="hd-film" d="${DOME} Z" fill="url(#${k}vx)"/><path class="hd-film" d="${DOME} Z" fill="url(#${k}vy)"/>
      <g clip-path="url(#${k}cl)"><path class="hd-reflex" d="M86 100 L132 86 L176 360 L128 360Z" fill="#fff" opacity=".1" filter="url(#${k}rb)"/></g>
      <path d="${DOME}" fill="none" stroke="url(#${rim})" stroke-width="1.6"/>
      <path d="M50 360 V152 A100 100 0 0 1 250 152 V360" fill="none" stroke="#fff" stroke-opacity=".12"/>
      <path d="M60 332 V158 A90 90 0 0 1 112 76" fill="none" stroke="url(#${sheen})" stroke-width="5" stroke-linecap="round" opacity=".7"/>
      <path d="M71 300 V172" fill="none" stroke="#fff" stroke-opacity=".28" stroke-width="1.4" stroke-linecap="round"/>
      <path d="M242 312 V170 A90 90 0 0 0 228 116" fill="none" stroke="#fff" stroke-opacity=".22" stroke-width="2" stroke-linecap="round"/>
      <ellipse cx="118" cy="79" rx="16" ry="5" transform="rotate(-36 118 79)" fill="#fff" opacity=".9"/>
      ${spark(126, 72, .9, 0)}${spark(62, 214, .55, 1.3)}${spark(240, 150, .45, 2.4)}
      <g clip-path="url(#${k}cl)"><rect class="hd-glint" x="-120" y="20" width="44" height="380" fill="#fff" opacity=".18" transform="skewX(-18)"/></g>
      <path d="M46 360 A104 17 0 0 0 254 360" fill="none" stroke="url(#${fr})" stroke-width="1.8"/>
      <path d="M68 371 A104 17 0 0 0 148 377" fill="none" stroke="#fff" stroke-opacity=".95" stroke-width="2.2" stroke-linecap="round"/></svg>`;
    // 5) véu da parede da frente, sobre o relógio: um pouco de branco (mais nas bordas) e menos contraste,
    //    para o relógio parecer dentro do vidro sem perder a nitidez
    const veil = `<span class="hd-veil" aria-hidden="true"></span>`;
    return back + glass + mid + veil + front;
  }

  // floco de neve de 6 pontas
  const flake = () => '<svg viewBox="-12 -12 24 24" aria-hidden="true" focusable="false"><g stroke="#fff" stroke-width="1.3" stroke-linecap="round" fill="none">' +
    [0, 60, 120].map(r => `<g transform="rotate(${r})"><path d="M0 -10V10"/><path d="M-3 -7L0 -4.5L3 -7M-3 7L0 4.5L3 7"/></g>`).join('') + '</g></svg>';
  // camada de neve: flocos atrás das vitrines; na frente, só poucos e nas laterais
  function snowLayer(front) {
    const r = rand(front ? 91 : 37), n = front ? 6 : 26, out = [];
    for (let i = 0; i < n; i++) {
      const x = front ? (r() < .5 ? 1 + r() * 9 : 90 + r() * 9) : r() * 100;
      const size = front ? 6 + r() * 6 : 8 + r() * 18, dur = 16 + r() * 18;
      out.push(`<i style="left:${x.toFixed(1)}%;--s:${size.toFixed(1)}px;--d:${dur.toFixed(1)}s;--o:${(-r() * dur).toFixed(1)}s;--a:${(front ? .5 : .25 + r() * .5).toFixed(2)};--b:${front ? 0 : (r() * 1.6).toFixed(1)}px">${front ? '' : flake()}</i>`);
    }
    return `<div class="hd-snow ${front ? 'is-front' : 'is-back'}" aria-hidden="true">${out.join('')}</div>`;
  }
  // pinheiros desfocados no fundo
  const blurTree = (cls) => `<svg class="hd-tree ${cls}" viewBox="0 0 100 160" aria-hidden="true" focusable="false"><path d="M50 4 L80 60 H66 L90 104 H72 L98 150 H2 L28 104 H10 L34 60 H20Z" fill="#c22a40"/><rect x="45" y="148" width="10" height="12" fill="#5a0c16"/></svg>`;

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
    const camp = (src, sizes) => `src="${src}" srcset="${src.replace(/\.jpg$/, '-600.webp')} 480w, ${src.replace(/\.jpg$/, '.webp')} 960w" sizes="${sizes}"`;

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
      <span class="natal-mini-gift">${elImg('caixas-p', 'k-gift-img', 200, 140)}</span>
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
      const els = $$('.xh, .xb, .xs, .natal-foot, .natal-cols, .natal-thanks'); if (!els.length || !('IntersectionObserver' in window)) return;
      const on = new Set();
      const io = new IntersectionObserver(es => { es.forEach(e => e.isIntersecting ? on.add(e.target) : on.delete(e.target)); document.documentElement.classList.toggle('k-dark-top', on.size > 0); },
        { rootMargin: `0px 0px -${Math.max(0, innerHeight - 70)}px 0px` });
      els.forEach(el => io.observe(el));
    };
    setTimeout(darkTop, 0);
    // desempenho: animações de Natal fora da tela ficam pausadas (neve, luzes, faíscas, brilho das redomas)
    const pauseOffscreen = () => {
      if (!('IntersectionObserver' in window)) return;
      const io = new IntersectionObserver(es => es.forEach(e => e.target.classList.toggle('k-paused', !e.isIntersecting)), { rootMargin: '120px 0px' });
      $$('.xh, .xg, .xs, .xb, .natal-foot, .natal-cols, .natal-thanks, [data-natal], .k-headdeco').forEach(el => io.observe(el));
    };
    setTimeout(pauseOffscreen, 0);
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

      // Seleção de Natal: cada relógio numa mini vitrine (plataforma vermelha + cúpula de vidro)
      const S = (N.selecao || []).map(s => ({ ...s, p: LR.byId(s.id) })).filter(s => s.p && s.p.status !== 'esgotado');
      const selecao = S.length ? `<section class="section xs" aria-labelledby="xs-title">
        <div class="xs-bd" aria-hidden="true">${blurTree('t1')}${blurTree('t2')}${blurTree('t3')}${blurTree('t4')}</div>
        ${snowLayer(false)}
        <div class="wrap xs-in">
        <header class="sec-head"><span class="label" data-reveal><span class="xs-tag"><i class="k-mini-star"></i> Seleção de Natal</span></span>
          <h2 class="display display-m" id="xs-title">Escolhidos para<br>presentear.</h2>
          <a class="link sec-link" href="loja.html" data-reveal>Toda a vitrine <span class="arrow">→</span></a></header>
        <div class="xs-row">
          ${S.map((s, i) => `<a class="hd-item" href="${LR.url.product(s.p)}" style="--i:${i}">
            <span class="hd-scene">${watchDisplay(s.recorte, esc(s.p.name))}</span>
            <span class="xs-info"><b>${esc(s.p.name)}</b><span class="num">${esc(price(s.p))}</span>${LR.stockLabel(s.p) ? `<span class="xs-stock">${esc(LR.stockLabel(s.p))}</span>` : ''}</span></a>`).join('')}
        </div></div>${snowLayer(true)}</section>` : '';

      // Banner: "Não deixe para a última hora", com o prazo real
      // a arte só aparece se o relógio dela estiver à venda; senão, ficam as caixas de presente desenhadas
      const BA = N.bannerArte, bap0 = BA && LR.byId(BA.id), bap = bap0 && bap0.status !== 'esgotado' ? bap0 : null;
      const banner = `<section class="xb" aria-labelledby="xb-title"><div class="wrap xb-in">
        <div class="xb-copy"><span class="label"><i class="k-mini-star"></i> ${esc(N.campanha)}</span>
          <h2 class="xb-title" id="xb-title">Não deixe para<br>a última hora.</h2>
          <p class="xb-text">Escolha o presente de Natal de quem você ama.</p>
          ${prazoTxt ? `<p class="xb-fact">${esc(prazoTxt)} ${esc(B.entrega)}.</p>` : ''}
          <a class="btn xb-btn" href="#presentes">Encontre seu presente <span class="arrow">→</span></a></div>
        ${BA && bap ? `<a class="xb-photo" href="${LR.url.product(bap)}" aria-label="${esc(bap.name)}">
          <img ${camp(BA.imagem, '(max-width: 860px) 90vw, 40vw')} alt="${esc(bap.name)}" loading="lazy"><span class="xg-art">Arte de campanha</span>
          <span class="xb-g xb-g3" aria-hidden="true">${elImg('caixas-p', 'k-gift-img', 200, 140)}</span>
          <span class="k-float xb-s1" aria-hidden="true">${star()}</span><span class="k-float xb-s2" aria-hidden="true">${star()}</span></a>` : `<div class="xb-art" aria-hidden="true">
          <span class="xb-g xb-saco">${elImg('saco', 'k-gift-img', 420, 584)}</span>
          <span class="xb-g xb-caixas">${elImg('caixas', 'k-gift-img', 560, 392)}</span>
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
      if (!$('.k-bolas', sec)) sec.insertAdjacentHTML('afterbegin', `<div class="k-bolas" aria-hidden="true">${elImg('bolas', 'k-bolas-img', 240, 587)}</div>`);
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

  LR.Natal = { init, kit: { pine, ball, star, bow, ribbon, lights, hat } };
})();
