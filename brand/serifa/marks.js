/* LU.RICOS · Serifa. Nome em Bodoni Moda com o ponto vermelho quadrado; símbolo: os ponteiros às 3 horas formam o L.
   O L do símbolo segue o contraste da Bodoni: haste vertical grossa, pé fino. */
(function () {
  const INK = '#111214', ACO = '#e9eae6', RED = '#cc2744';
  const svg = (inner, bg) => `<svg class="mk" viewBox="0 0 1080 1080" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">${bg ? `<rect width="1080" height="1080" fill="${bg}"/>` : ''}${inner}</svg>`;
  const ticks = (fg) => Array.from({ length: 12 }, (_, i) =>
    `<rect class="pt-tick" x="537" y="88" width="6" height="${i % 3 ? 34 : 58}" fill="${fg}" opacity="${i % 3 ? .45 : .8}" transform="rotate(${i * 30} 540 540)"/>`).join('');

  // símbolo: ponteiros às 3 horas
  const ponteiros = ({ bg = INK, fg = ACO, scale = 1 } = {}) => svg(`<g transform="translate(540 540) scale(${scale}) translate(-540 -540)">
      <g class="pt-ticks">${ticks(fg)}</g>
      <rect class="pt-min" x="508" y="196" width="64" height="344" fill="${fg}"/>
      <rect class="pt-hour" x="540" y="531" width="262" height="18" fill="${fg}"/>
      <rect class="pt-dot" x="486" y="486" width="108" height="108" fill="${RED}"/>
    </g>`, bg);

  // monograma em serifa (alternativa para o perfil)
  const lr = ({ bg = INK, fg = ACO, scale = 1 } = {}) => svg(`<g transform="translate(540 540) scale(${scale}) translate(-540 -540)">
      <text x="505" y="676" text-anchor="middle" font-family="'Bodoni Moda', Didot, serif" font-weight="500" font-size="400" style="font-variation-settings:'opsz' 96" letter-spacing="8" fill="${fg}">LR</text>
      <rect x="822" y="620" width="56" height="56" fill="${RED}"/>
    </g>`, bg);

  // nome: cada letra num span, para a animação entrar letra por letra
  const wordmark = (tag = true) => `<div class="wm"><span class="wm-name">${'LU'.split('').map(c => `<span class="ch">${c}</span>`).join('')}<i class="dot"></i>${'RICOS'.split('').map(c => `<span class="ch">${c}</span>`).join('')}</span>${tag ? '<span class="wm-tag">Relógios · Marabá</span>' : ''}</div>`;

  window.LRS = { ponteiros, lr, wordmark, INK, ACO, RED };
})();
