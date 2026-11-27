/* Símbolos LU.RICOS. Cada função devolve um SVG 1080x1080 (centro em 540,540).
   Cores fixas da marca: grafite, aço e Vermelho Estojo. */
(function () {
  const INK = '#111214', ACO = '#e9eae6', RED = '#cc2744';
  const font = `font-family="Archivo, 'Helvetica Neue', Arial, sans-serif" font-weight="800"`;
  const wrap = (inner, bg) => `<svg class="mk" viewBox="0 0 1080 1080" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">${bg ? `<rect width="1080" height="1080" fill="${bg}"/>` : ''}<g transform="translate(540 540)">${inner}</g></svg>`;

  // A · Coroa: a caixa do relógio vista de cima; a coroa (o botão de acertar a hora) é o ponto vermelho
  const coroa = ({ bg = INK, fg = ACO, scale = 1 } = {}) => wrap(`<g transform="scale(${scale}) translate(-48 0)">
      <circle class="co-ring" r="330" fill="none" stroke="${fg}" stroke-width="62" pathLength="1"/>
      <rect class="co-crown" x="374" y="-42" width="84" height="84" fill="${RED}"/>
      <text class="co-lr" x="0" y="8" text-anchor="middle" dominant-baseline="central" ${font} font-size="250" style="font-stretch:125%" letter-spacing="-6" fill="${fg}">LR</text>
    </g>`, bg);

  // B · Etiqueta: a etiqueta de preço da loja; o furo do barbante é o ponto vermelho
  const etiqueta = ({ bg = INK, fg = ACO, ink = INK, scale = 1 } = {}) => wrap(`<g transform="scale(${scale}) translate(-26 -34)">
      <g class="et-tag">
        <polygon points="-220,-200 -110,-310 110,-310 220,-200 220,310 -220,310" fill="${fg}"/>
        <rect x="-38" y="-243" width="76" height="76" fill="${RED}"/>
        <text x="0" y="95" text-anchor="middle" dominant-baseline="central" ${font} font-size="188" style="font-stretch:125%" letter-spacing="-5" fill="${ink}">LR</text>
      </g>
    </g>`, bg);

  // C · Monograma: o R apoiado no pé do L; o ponto vermelho fecha a linha
  const monograma = ({ bg = INK, fg = ACO, scale = 1 } = {}) => wrap(`<g transform="scale(${scale}) translate(19 10)">
      <rect class="mo-stem" x="-290" y="-250" width="86" height="480" fill="${fg}"/>
      <rect class="mo-foot" x="-290" y="144" width="440" height="86" fill="${fg}"/>
      <text class="mo-r" x="-182" y="144" ${font} font-size="470" style="font-stretch:100%" fill="${fg}">R</text>
      <rect class="mo-dot" x="166" y="144" width="86" height="86" fill="${RED}"/>
    </g>`, bg);

  window.LRMARK = { coroa, etiqueta, monograma, INK, ACO, RED };
})();
