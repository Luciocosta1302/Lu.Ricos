/* ============================================================
   LU.RICOS — SEO e visibilidade em buscas com IA
   Gera, a partir do mesmo catálogo do site (assets/data.js):
   - relogio-<id>.html: uma página por relógio, com o conteúdo já no
     HTML (o Google e os robôs de IA leem sem executar JavaScript)
   - artigo-<slug>.html: uma página por artigo do jornal
   - dados estruturados (JSON-LD): a loja, o site, a lista da vitrine,
     cada produto com preço e disponibilidade, artigos, FAQ e trilhas
   - vitrines já montadas na home e na loja (links para os relógios)
   - sitemap.xml, robots.txt (libera os robôs de IA) e llms.txt
   Rodar depois de mudar o catálogo:  npm run seo
   O app.js continua montando as páginas no navegador por cima disso.
   ============================================================ */
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

const root = path.resolve(import.meta.dirname, '..');
const read = f => fs.readFileSync(path.join(root, f), 'utf8');
const write = (f, s) => fs.writeFileSync(path.join(root, f), s);

/* ---------- catálogo ---------- */
const ctx = {}; ctx.window = ctx; vm.createContext(ctx);
vm.runInContext(read('assets/data.js'), ctx);
const LR = ctx.LR, B = LR.brand, SITE = B.site.replace(/\/$/, '');
const abs = p => `${SITE}/${p}`;
const esc = s => String(s).replace(/[&<>"']/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]));
const price = n => n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
const wa = t => `https://wa.me/${B.whatsapp}?text=${encodeURIComponent(t)}`;
const today = new Date().toISOString().slice(0, 10);

const forSale = LR.products.filter(p => p.status !== 'esgotado');
const prices = LR.products.map(p => p.price);
const RANGE = `${price(Math.min(...prices))} a ${price(Math.max(...prices))}`;
const BRANDS = [...new Set(LR.products.map(p => p.brand))];
const brandList = BRANDS.length > 1 ? `${BRANDS.slice(0, -1).join(', ')} e ${BRANDS.at(-1)}` : BRANDS[0];
const [cityName, region] = B.city.split(/\s*[—-]\s*/);
const phone = (() => { const d = B.whatsapp.replace(/\D/g, ''); return `+${d.slice(0, 2)} ${d.slice(2, 4)} ${d.slice(4, -4)}-${d.slice(-4)}`; })();
const hours = (() => { const m = B.hours.match(/(\d{1,2})h\D+(\d{1,2})h/); return m ? [m[1].padStart(2, '0') + ':00', m[2].padStart(2, '0') + ':00'] : null; })();
const AVAIL = { disponivel: 'https://schema.org/InStock', encomenda: 'https://schema.org/BackOrder', esgotado: 'https://schema.org/OutOfStock' };
const STATUS = { disponivel: 'Disponível', encomenda: 'Sob encomenda', esgotado: 'Esgotado' };
const LOGO = 'assets/img/logo-lu-ricos.png';
const SHARE = 'assets/img/relogios/hero-riviera.jpg';

/* ---------- dados estruturados ---------- */
const store = {
  '@type': 'OnlineStore', '@id': `${SITE}/#loja`, name: B.name, alternateName: B.name.replace('.', ' '),
  url: `${SITE}/`, logo: abs(LOGO), image: abs(SHARE),
  description: `Loja de relógios ${brandList} em ${cityName}-${region}, com fotos reais de cada peça e preço na vitrine. Atendimento e compra pelo WhatsApp.`,
  email: B.email, telephone: phone,
  address: { '@type': 'PostalAddress', addressLocality: cityName, addressRegion: region, addressCountry: 'BR' },
  areaServed: { '@type': 'City', name: cityName },
  sameAs: [B.instagram],
  contactPoint: { '@type': 'ContactPoint', contactType: 'sales', telephone: phone, url: `https://wa.me/${B.whatsapp}`, availableLanguage: 'pt-BR' },
  ...(hours ? { openingHoursSpecification: { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'], opens: hours[0], closes: hours[1] } } : {}),
  priceRange: RANGE.replace(' a ', ' – '), currenciesAccepted: 'BRL',
};
const website = { '@type': 'WebSite', '@id': `${SITE}/#site`, url: `${SITE}/`, name: B.name, inLanguage: 'pt-BR', publisher: { '@id': `${SITE}/#loja` } };
const itemList = list => ({ '@type': 'ItemList', name: `Relógios ${B.name}`, numberOfItems: list.length,
  itemListElement: list.map((p, i) => ({ '@type': 'ListItem', position: i + 1, url: abs(LR.url.product(p)), name: p.name })) });
const crumbs = items => ({ '@type': 'BreadcrumbList', itemListElement: items.map(([name, url], i) => ({ '@type': 'ListItem', position: i + 1, name, item: abs(url) })) });
const product = p => ({
  '@type': 'Product', '@id': `${abs(LR.url.product(p))}#produto`, name: p.name, sku: p.code, mpn: p.code,
  description: p.desc, image: p.images.map(abs), url: abs(LR.url.product(p)),
  brand: { '@type': 'Brand', name: p.brand }, category: `Relógios > Pulseira de ${p.category.toLowerCase()}`, color: p.colors.join(', '),
  additionalProperty: Object.entries(p.specs || {}).map(([name, value]) => ({ '@type': 'PropertyValue', name, value })),
  offers: { '@type': 'Offer', url: abs(LR.url.product(p)), price: p.price.toFixed(2), priceCurrency: B.currency, availability: AVAIL[p.status] || AVAIL.disponivel, seller: { '@id': `${SITE}/#loja` } },
});
const ld = (...nodes) => `<script type="application/ld+json">${JSON.stringify({ '@context': 'https://schema.org', '@graph': nodes }).replace(/</g, '\\u003c')}</script>`;

/* ---------- cabeçalho de cada página ---------- */
function head(html, { title, description, url, image = SHARE, type = 'website', jsonld = '', noindex = false }) {
  const set = (re, val) => { if (!re.test(html)) throw new Error('não achei ' + re); html = html.replace(re, val); };
  if (title) {
    set(/<title>[^<]*<\/title>/, `<title>${esc(title)}</title>`);
    set(/<meta property="og:title" content="[^"]*">/, `<meta property="og:title" content="${esc(title)}">`);
  }
  if (description) {
    set(/<meta name="description" content="[^"]*">/, `<meta name="description" content="${esc(description)}">`);
    set(/<meta property="og:description" content="[^"]*">/, `<meta property="og:description" content="${esc(description)}">`);
  }
  set(/<meta property="og:type" content="[^"]*">/, `<meta property="og:type" content="${type}">`);
  html = html.replace(/\n?  <!--seo:start-->[\s\S]*?<!--seo:end-->/, '');
  const block = [
    noindex ? '<meta name="robots" content="noindex, follow">' : `<link rel="canonical" href="${url}">`,
    url ? `<meta property="og:url" content="${url}">` : '',
    `<meta property="og:image" content="${abs(image)}">`,
    `<meta property="og:site_name" content="${B.name}">`, '<meta property="og:locale" content="pt_BR">',
    '<meta name="twitter:card" content="summary_large_image">', jsonld,
    // sem JavaScript: some a tela de carregamento e o conteúdo aparece
    '<noscript><style>.preloader,.transition{display:none}[data-reveal],.split .word>span,.split .line>span{opacity:1!important;transform:none!important}.img-reveal img{transform:none!important}</style></noscript>',
  ].filter(Boolean).join('\n  ');
  return html.replace('</head>', `  <!--seo:start-->\n  ${block}\n  <!--seo:end-->\n</head>`);
}

/* conteúdo já montado dentro de um contêiner vazio (o app.js substitui no navegador) */
function fill(html, openTag, closeTag, content) {
  const i = html.indexOf(openTag); if (i < 0) throw new Error('não achei ' + openTag);
  const start = i + openTag.length;
  const end = html.startsWith('<!--pre-->', start) ? html.indexOf('<!--/pre-->', start) + '<!--/pre-->'.length : start;
  if (!html.startsWith(closeTag, end)) throw new Error('contêiner inesperado: ' + openTag);
  return html.slice(0, start) + `<!--pre-->${content}<!--/pre-->` + html.slice(end);
}

/* ---------- card (o mesmo desenho do app.js) ---------- */
const rel = s => /assets\/img\/relogios\/[^/]+\.jpg$/.test(s) && !/-600\.jpg$/.test(s);
const pic = (s, sizes) => rel(s) ? `src="${s}" srcset="${s.replace(/\.jpg$/, '-600.jpg')} 600w, ${s} 1200w" sizes="${sizes}"` : `src="${s}"`;
const CARD_SIZES = '(max-width: 520px) 50vw, (max-width: 860px) 50vw, (max-width: 1100px) 33vw, 25vw';
const badgeClass = p => p.status === 'esgotado' ? 'is-out' : /destaque|novidade|edição|encomenda/i.test(p.badge) ? 'is-signal' : '';
const card = (p, i) => `
<article class="pcard ${p.status === 'esgotado' ? 'is-out' : ''}" data-id="${p.id}">
  <a class="pcard-link" href="${LR.url.product(p)}" aria-label="${esc(p.name)} — ${esc(p.subtitle)}"></a>
  <div class="pcard-media">
    <img class="main" ${pic(p.images[0], CARD_SIZES)} alt="${esc(p.name)}" loading="${i < 3 ? 'eager' : 'lazy'}">
    ${p.badge ? `<span class="pcard-badge ${badgeClass(p)}">${esc(p.badge)}</span>` : ''}
  </div>
  <div class="pcard-info">
    <div><h3 class="pcard-name">${esc(p.name)}</h3><p class="pcard-sub">${esc(p.code)} · ${esc(p.subtitle)}</p></div>
    <div class="pcard-price num">${price(p.price)}</div>
  </div>
</article>`;

/* ---------- páginas de produto ---------- */
const produtoTpl = read('produto.html');
const written = [];
for (const p of LR.products) {
  const col = LR.collection(p.collection);
  const url = abs(LR.url.product(p));
  const desc = `${p.name} (${p.subtitle.replace(' · ', ', ')}) por ${price(p.price)}. ${p.desc}`.slice(0, 158).replace(/\s+\S*$/, '…');
  let html = head(produtoTpl, {
    title: `${p.name} — ${price(p.price)} · ${B.name}`, description: desc, url, image: p.images[0], type: 'product',
    jsonld: ld(product(p), crumbs([['Início', ''], ['Vitrine', 'loja.html'], [p.name, LR.url.product(p)]])),
  });
  html = html.replace('<body data-page="produto">', `<body data-page="produto" data-product="${p.id}">`);
  html = fill(html, '<section class="pdp wrap" data-pdp>', '</section>', `
<div class="pdp-gallery">${p.images.map((s, i) => `<figure><img ${pic(s, '(max-width: 860px) 100vw, 58vw')} alt="${esc(p.name)} — vista ${i + 1}" loading="${i ? 'lazy' : 'eager'}"></figure>`).join('')}</div>
<div class="pdp-info">
  <div class="crumbs"><a class="label" href="loja.html">Vitrine</a><span class="label">/</span><a class="label" href="colecoes.html#${col.slug}">${esc(col.name)}</a><span class="label">/</span><span class="label label-ink">${esc(p.code)}</span></div>
  <div><div class="pdp-top"><span class="label">${esc(p.code)}${p.badge ? ` · ${esc(p.badge)}` : ''}</span><span class="pdp-price num">${price(p.price)}</span></div>
  <h1 class="display pdp-title">${esc(p.name)}</h1><p class="muted">${esc(p.subtitle)}</p></div>
  <p class="pdp-desc">${esc(p.desc)}</p>
  <ul class="spec-list">${Object.entries(p.specs || {}).map(([k, v]) => `<li><span>${esc(k)}</span><span>${esc(v)}</span></li>`).join('')}</ul>
  <p class="pdp-desc">${STATUS[p.status]}. Compra pelo WhatsApp, com frete e pagamento combinados no atendimento. <a href="${wa(`Olá! Tenho interesse no ${p.code} ${p.name}.`)}">Falar no WhatsApp</a></p>
</div>`);
  const related = LR.products.filter(x => x.id !== p.id && (x.collection === p.collection || x.category === p.category)).slice(0, 4);
  html = fill(html, '<div class="products" data-grid="related">', '</div>', (related.length ? related : LR.products.slice(0, 4)).map(card).join(''));
  write(LR.url.product(p), html); written.push(LR.url.product(p));
}
// o molde genérico não entra no Google (cada relógio tem a sua página)
write('produto.html', head(produtoTpl, { noindex: true }));

/* ---------- páginas de artigo ---------- */
const artigoTpl = read('artigo.html');
const fmtDate = iso => new Date(iso + 'T12:00:00').toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' }).replace('.', '');
for (const a of LR.articles) {
  const url = abs(LR.url.article(a));
  let html = head(artigoTpl, {
    title: `${a.title} · Jornal · ${B.name}`, description: a.excerpt, url, image: a.cover, type: 'article',
    jsonld: ld({ '@type': 'BlogPosting', headline: a.title, description: a.excerpt, datePublished: a.date, dateModified: a.date, image: abs(a.cover), url, inLanguage: 'pt-BR', author: { '@id': `${SITE}/#loja` }, publisher: { '@id': `${SITE}/#loja` } },
      crumbs([['Início', ''], ['Jornal', 'jornal.html'], [a.title, LR.url.article(a)]])),
  });
  html = html.replace('<body data-page="artigo">', `<body data-page="artigo" data-slug="${a.slug}">`);
  html = fill(html, '<article class="article wrap" data-article>', '</article>', `
<div class="article-head"><span class="label">${esc(a.kicker)}<br>${fmtDate(a.date)}</span><h1 class="display display-l">${esc(a.title)}</h1></div>
<figure class="article-cover"><img ${pic(a.cover, '100vw')} alt=""></figure>
<div class="article-body"><aside class="aside"><a class="link" href="jornal.html">Todos os artigos</a></aside><div class="prose">${a.body.map(t => `<p>${esc(t)}</p>`).join('')}</div></div>`);
  write(LR.url.article(a), html); written.push(LR.url.article(a));
}
write('artigo.html', head(artigoTpl, { noindex: true }));

/* ---------- páginas fixas ---------- */
const desc = {
  home: `Relógios ${brandList} com fotos reais de cada peça e preço na vitrine, de ${RANGE}. Atendimento e compra pelo WhatsApp, em ${cityName}-${region}.`,
  loja: `Todos os relógios da ${B.name} com fotos reais e preço: ${LR.products.map(p => p.name).slice(0, 4).join(', ')} e mais. De ${RANGE}.`,
};
let home = head(read('index.html'), {
  title: `Relógios em ${cityName}-${region} com fotos reais · ${B.name}`, description: desc.home, url: `${SITE}/`,
  jsonld: ld(store, website, itemList(forSale)),
});
home = fill(home, '<div class="products cols-3" data-grid="novidades">', '</div>', forSale.map(card).join(''));
write('index.html', home);

let loja = head(read('loja.html'), {
  title: `Vitrine de relógios com preço e fotos reais · ${B.name}`, description: desc.loja, url: abs('loja.html'),
  jsonld: ld(itemList(LR.products), crumbs([['Início', ''], ['Vitrine', 'loja.html']])),
});
loja = fill(loja, '<div class="products cols-3" data-grid="loja">', '</div>', LR.products.map(card).join(''));
write('loja.html', loja);

// contato: a loja e as perguntas frequentes (lidas do próprio HTML)
let contato = read('contato.html');
const faq = [...contato.matchAll(/<button class="acc-btn"[^>]*>([^<]+?)\s*<i><\/i><\/button><div class="acc-panel"><div><div class="inner">([\s\S]*?)<\/div><\/div><\/div>/g)]
  .map(m => ({ '@type': 'Question', name: m[1].trim(), acceptedAnswer: { '@type': 'Answer', text: m[2].replace(/<[^>]+>/g, '').trim() } }));
write('contato.html', head(contato, { url: abs('contato.html'), jsonld: ld(store, { '@type': 'FAQPage', mainEntity: faq }) }));
for (const f of ['colecoes.html', 'sobre.html', 'jornal.html']) write(f, head(read(f), { url: abs(f), jsonld: ld(crumbs([['Início', ''], [read(f).match(/<title>([^·<]+)/)[1].trim(), f]])) }));
write('404.html', head(read('404.html'), { noindex: true }));

/* ---------- logo para os buscadores ---------- */
fs.copyFileSync(path.join(root, 'brand/logo-lu-ricos-grafite.png'), path.join(root, LOGO));

/* ---------- sitemap.xml ---------- */
const pages = ['', 'loja.html', 'colecoes.html', 'sobre.html', 'jornal.html', 'contato.html', ...written];
write('sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages.map(p => `  <url><loc>${abs(p)}</loc><lastmod>${today}</lastmod></url>`).join('\n')}
</urlset>
`);

/* ---------- robots.txt (buscadores e robôs de IA liberados) ---------- */
const bots = ['Googlebot', 'Google-Extended', 'Bingbot', 'GPTBot', 'OAI-SearchBot', 'ChatGPT-User', 'ClaudeBot', 'Claude-SearchBot', 'PerplexityBot', 'Applebot-Extended'];
write('robots.txt', `# ${B.name}: buscadores e assistentes de IA podem ler o site
User-agent: *
Allow: /
Disallow: /api/

${bots.map(b => `User-agent: ${b}\nAllow: /\nDisallow: /api/`).join('\n\n')}

Sitemap: ${abs('sitemap.xml')}
`);

/* ---------- llms.txt (resumo da loja para IAs) ---------- */
write('llms.txt', `# ${B.name}

> Loja de relógios em ${cityName}-${region}. Vende ${brandList}, com fotos reais de cada peça e preço na vitrine (${RANGE}). A compra é fechada pelo WhatsApp.

- Atendimento: ${B.address.toLowerCase()}, ${B.hours.replace(' · ', ', ')}
- WhatsApp: ${phone} (https://wa.me/${B.whatsapp})
- Instagram: ${B.instagram}
- Como comprar: escolha o relógio no site, adicione ao carrinho e finalize pelo WhatsApp; frete, prazo e pagamento são combinados no atendimento.

## Relógios

${LR.products.map(p => `- [${p.name}](${abs(LR.url.product(p))}): ${p.subtitle}. ${price(p.price)}. ${STATUS[p.status]}.`).join('\n')}

## Páginas

- [Vitrine](${abs('loja.html')}): todos os relógios com foto, preço e filtros por pulseira.
- [Coleções](${abs('colecoes.html')}): ${LR.collections.map(c => c.name).join(', ')}.
- [Sobre](${abs('sobre.html')}): quem é a loja e como funciona a compra.
- [Contato e perguntas frequentes](${abs('contato.html')}): atendimento, compra, cuidados e uso na água.

## Optional

${LR.articles.map(a => `- [${a.title}](${abs(LR.url.article(a))}): ${a.excerpt}`).join('\n')}
`);

console.log(`SEO: ${LR.products.length} relógios, ${LR.articles.length} artigos, ${pages.length} URLs no sitemap.`);
