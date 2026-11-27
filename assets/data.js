/* ============================================================
   LU.RICOS — catálogo
   Troque aqui nomes, preços, fotos e textos. Todas as páginas
   leem deste arquivo (vitrine, produto, coleções, home).
   Fotos: assets/img/relogios/
   ============================================================ */

window.LR = window.LR || {};

LR.brand = {
  name: 'LU.RICOS',
  tagline: 'Relógios selecionados, com fotos reais.',
  city: 'Marabá — PA',
  whatsapp: '5594981371647',           // só números: 55 + DDD + número
  instagram: 'https://instagram.com/lu.ricos',
  email: 'luciohrcosta@gmail.com',
  address: 'Atendimento online',      // ou o endereço da loja física
  hours: 'Seg–Sáb · 10h–19h',
  currency: 'BRL',
  entrega: 'Entrega em Marabá em até 2 dias úteis',
  pagamento: 'Pix ou cartão de crédito, com opção de parcelar',
  site: 'https://storeluricos.netlify.app', // endereço oficial (troque se tiver domínio próprio)
};

const IMG = 'assets/img/relogios/';

LR.collections = [
  {
    slug: 'technos',
    name: 'Technos Riviera',
    code: 'COL. 01',
    season: 'Destaque',
    cover: IMG + 'riviera-02.jpg',
    intro: 'Mostrador azul, luneta dourada e pulseira bicolor. O modelo mais completo da vitrine, com dia da semana e data.',
  },
  {
    slug: 'aco',
    name: 'Pulseira de aço',
    code: 'COL. 02',
    season: 'Dia a dia',
    cover: IMG + 'colmeia-04.jpg',
    intro: 'Pulseira prateada em elos de aço. Para usar todos os dias, do trabalho ao fim de semana.',
  },
  {
    slug: 'couro',
    name: 'Pulseira de couro',
    code: 'COL. 03',
    season: 'Pablo Raez',
    cover: IMG + 'rosa-04.jpg',
    intro: 'Couro com textura croco e caixa prateada. Leves, confortáveis e com ar clássico.',
  },
];

// status: 'disponivel' | 'esgotado' | 'encomenda'
// stock: unidades que você tem. 1 mostra "Peça única", 2 ou 3 mostram "Últimas N unidades".
//        Quando vender, diminua aqui; em 0, troque o status para 'esgotado'.
// escolha: frase que aparece no carrinho ("Boa escolha: …") para confirmar a decisão.
LR.products = [
  {
    id: 'technos-riviera', stock: 1, escolha: 'o mostrador azul muda de tom com a luz, e ele ainda mostra dia e data.', code: 'LR-01', brand: 'Technos',
    name: 'Technos Riviera', subtitle: 'Azul e dourado · pulseira bicolor',
    collection: 'technos', category: 'Aço', price: 799.99, status: 'disponivel', badge: 'Destaque',
    images: [IMG + 'riviera-02.jpg', IMG + 'riviera-01.jpg', IMG + 'riviera-03.jpg'],
    colors: ['Azul'], sizes: ['Único'],
    desc: 'Mostrador azul com acabamento solar, que muda de tom conforme a luz. Índices e ponteiros dourados, luneta canelada dourada e pulseira em aço bicolor, prata e dourado. Mostra o dia da semana e a data.',
    specs: { 'Marca': 'Technos', 'Linha': 'Riviera', 'Mostrador': 'Azul solar, índices dourados', 'Luneta': 'Canelada, dourada', 'Funções': 'Horas, minutos, segundos, dia da semana e data', 'Máquina': 'Japonesa', 'Resistência à água': '50 m', 'Pulseira': 'Aço bicolor, prata e dourado' },
  },
  {
    id: 'pablo-raez-colmeia', stock: 2, escolha: 'o relevo em colmeia aparece a cada reflexo do mostrador.', code: 'LR-02', brand: 'Pablo Raez',
    name: 'Pablo Raez Colmeia', subtitle: 'Azul gelo · pulseira de aço',
    collection: 'aco', category: 'Aço', price: 159.99, status: 'disponivel', badge: '',
    images: [IMG + 'colmeia-01.jpg', IMG + 'colmeia-02.jpg', IMG + 'colmeia-03.jpg', IMG + 'colmeia-04.jpg'],
    colors: ['Azul gelo'], sizes: ['Único'],
    desc: 'Mostrador azul gelo com relevo em colmeia que aparece em cada reflexo. Algarismos aplicados no 12, 6 e 9, luneta trabalhada em relevo e pulseira de aço prateada. Tem data às 3 horas.',
    specs: { 'Marca': 'Pablo Raez', 'Mostrador': 'Azul gelo, relevo em colmeia', 'Luneta': 'Prateada, trabalhada em relevo', 'Funções': 'Horas, minutos, segundos e data', 'Movimento': 'Quartzo', 'Resistência à água': 'Water resistant (respingos)', 'Pulseira': 'Aço prateado' },
  },
  {
    id: 'pablo-raez-colmeia-branco', stock: 2, escolha: 'o branco com relevo em colmeia combina com qualquer roupa.', code: 'LR-08', brand: 'Pablo Raez',
    name: 'Pablo Raez Colmeia', subtitle: 'Branco · pulseira de aço',
    collection: 'aco', category: 'Aço', price: 159.99, status: 'disponivel', badge: 'Novidade',
    images: [IMG + 'colmeia-branco-01.jpg', IMG + 'colmeia-branco-02.jpg', IMG + 'colmeia-branco-03.jpg', IMG + 'colmeia-branco-04.jpg'],
    colors: ['Branco'], sizes: ['Único'],
    desc: 'Mesmo relevo em colmeia, agora em branco. Algarismos aplicados no 12, 6 e 9, luneta trabalhada em relevo e pulseira de aço prateada. Tem data às 3 horas.',
    specs: { 'Marca': 'Pablo Raez', 'Mostrador': 'Branco, relevo em colmeia', 'Luneta': 'Prateada, trabalhada em relevo', 'Funções': 'Horas, minutos, segundos e data', 'Movimento': 'Quartzo', 'Resistência à água': 'Water resistant (respingos)', 'Pulseira': 'Aço prateado' },
  },
  {
    id: 'pablo-raez-classico', stock: 0, escolha: 'limpo, com pulseira de aço, combina com tudo.', code: 'LR-03', brand: 'Pablo Raez',
    name: 'Pablo Raez Clássico', subtitle: 'Branco · pulseira de aço',
    collection: 'aco', category: 'Aço', price: 159.99, status: 'esgotado', badge: '',
    images: [IMG + 'classico-01.jpg', IMG + 'classico-02.jpg', IMG + 'classico-03.jpg', IMG + 'classico-04.jpg', IMG + 'classico-05.jpg'],
    colors: ['Branco'], sizes: ['Único'],
    desc: 'Mostrador branco com textura em linhas verticais, índices em bastão e minuteria numerada de 5 em 5. Caixa polida e pulseira de aço prateada. Um relógio limpo, que combina com tudo. Tem data às 3 horas.',
    specs: { 'Marca': 'Pablo Raez', 'Mostrador': 'Branco, textura vertical', 'Índices': 'Bastão, com minuteria numerada', 'Funções': 'Horas, minutos, segundos e data', 'Pulseira': 'Aço prateado' },
  },
  {
    id: 'pablo-raez-rosa-dos-ventos', stock: 1, escolha: 'a rosa dos ventos em relevo e o couro croco chamam atenção sem exagero.', code: 'LR-04', brand: 'Pablo Raez',
    name: 'Pablo Raez Rosa dos Ventos', subtitle: 'Branco · couro marrom',
    collection: 'couro', category: 'Couro', price: 129.99, status: 'disponivel', badge: '',
    images: [IMG + 'rosa-01.jpg', IMG + 'rosa-02.jpg', IMG + 'rosa-03.jpg', IMG + 'rosa-04.jpg', IMG + 'rosa-06.jpg', IMG + 'rosa-05.jpg'],
    colors: ['Branco'], sizes: ['Único'],
    desc: 'Mostrador branco com uma rosa dos ventos em relevo no centro, escala de 24 horas e algarismos romanos. Caixa prateada e pulseira de couro marrom com textura croco e a marca gravada por dentro. Tem data às 3 horas.',
    specs: { 'Marca': 'Pablo Raez', 'Mostrador': 'Branco, rosa dos ventos em relevo', 'Escalas': 'Algarismos romanos e 24 horas', 'Funções': 'Horas, minutos, segundos e data', 'Movimento': 'Quartzo', 'Fundo': 'Aço inoxidável', 'Pulseira': 'Couro marrom, textura croco' },
  },
  {
    id: 'pablo-raez-romano', stock: 2, escolha: 'vai do trabalho ao casamento sem trocar de relógio.', code: 'LR-05', brand: 'Pablo Raez',
    name: 'Pablo Raez Romano', subtitle: 'Preto · couro preto',
    collection: 'couro', category: 'Couro', price: 129.99, status: 'disponivel', badge: '',
    images: [IMG + 'romano-01.jpg'],
    colors: ['Preto'], sizes: ['Único'],
    desc: 'Mostrador preto com textura quadriculada e algarismos romanos prateados. Caixa polida e pulseira de couro preto com textura croco. Discreto e elegante, bom para o dia a dia e para ocasiões formais. Tem data às 3 horas.',
    specs: { 'Marca': 'Pablo Raez', 'Mostrador': 'Preto, textura quadriculada', 'Escalas': 'Algarismos romanos', 'Funções': 'Horas, minutos, segundos e data', 'Movimento': 'Quartzo', 'Pulseira': 'Couro preto, textura croco' },
  },
  {
    id: 'pablo-raez-esmeralda', stock: 2, escolha: 'o verde com efeito solar muda de tom conforme a luz.', code: 'LR-06', brand: 'Pablo Raez',
    name: 'Pablo Raez Esmeralda', subtitle: 'Verde · pulseira integrada',
    collection: 'aco', category: 'Aço', price: 159.99, status: 'disponivel', badge: 'Novidade',
    images: [IMG + 'verde-01.jpg', IMG + 'verde-02.jpg', IMG + 'verde-03.jpg', IMG + 'verde-04.jpg'],
    colors: ['Verde'], sizes: ['Único'],
    desc: 'Mostrador verde degradê com efeito solar, índices e ponteiros prateados. Caixa de aço com pulseira integrada, estilo esportivo-elegante. Mostra o dia da semana e a data.',
    specs: { 'Marca': 'Pablo Raez', 'Mostrador': 'Verde degradê, efeito solar', 'Caixa': 'Aço, pulseira integrada', 'Funções': 'Horas, minutos, segundos, dia da semana e data', 'Movimento': 'Quartzo', 'Resistência à água': 'Water resistant 50 m', 'Pulseira': 'Aço, integrada à caixa' },
  },
  {
    id: 'sunlifex-cronografo', stock: 2, escolha: 'visual de cronógrafo, robusto, com data em janela própria.', code: 'LR-07', brand: 'Sunlifex',
    name: 'Sunlifex Cronógrafo', subtitle: 'Prata · visual cronógrafo',
    collection: 'aco', category: 'Aço', price: 199.99, status: 'disponivel', badge: 'Novidade',
    images: [IMG + 'sunlifex-01.jpg', IMG + 'sunlifex-02.jpg', IMG + 'sunlifex-03.jpg', IMG + 'sunlifex-04.jpg'],
    colors: ['Prata'], sizes: ['Único'],
    desc: 'Mostrador prata com três sub-mostradores em estilo cronógrafo e escala na luneta. Caixa e pulseira de aço prateado, com data em janela própria. Visual técnico, para quem gosta de um relógio mais robusto.',
    specs: { 'Marca': 'Sunlifex', 'Mostrador': 'Prata, com 3 sub-mostradores decorativos', 'Luneta': 'Prateada, com escala', 'Funções': 'Horas, minutos, segundos e data', 'Movimento': 'Quartzo', 'Pulseira': 'Aço prateado' },
  },
];

// ---------- Natal ----------
// ativo: true mostra a seção de Natal na home; depois do Natal, troque para false.
// chegando: relógios comprados que ainda não chegaram. Ficam só na seção de Natal, sem preço
// e sem página própria, com a foto do fornecedor. Quando a peça chegar, tire a foto, defina o
// preço e mova o relógio para LR.products.
// para: 'ele' ou 'ela', usado no filtro "Para ele / Para ela".
LR.natal = {
  ativo: true,
  ano: 2026,
  // último dia para pedir e receber em Marabá antes do Natal (2 dias úteis antes do dia 24).
  // A frase "Pedindo até …" some sozinha depois dessa data.
  ultimoDia: '2026-12-22',
  // Campanha "Tempo de presentear" (assets/natal.js e assets/natal.css). Cada parte pode ser desligada
  // apagando a linha dela; com ativo: false, o site volta inteiro ao visual de sempre.
  campanha: 'Natal 2026',
  hero: { id: 'technos-riviera', recorte: 'assets/img/natal/recortes/riviera.webp',
          titulo: ['Tempo de', 'presentear'], texto: 'Presentes que marcam momentos.' },
  // guia de presentes: um relógio real para cada tipo de pessoa
  guia: [
    { titulo: 'Para quem gosta do clássico', id: 'pablo-raez-rosa-dos-ventos', texto: 'Algarismos romanos, rosa dos ventos em relevo e couro croco marrom.' },
    { titulo: 'Para quem gosta de elegância', id: 'technos-riviera', texto: 'Azul solar, luneta dourada e pulseira bicolor.' },
    { titulo: 'Para quem prefere o casual', id: 'pablo-raez-colmeia', texto: 'Aço prateado e relevo em colmeia, para usar todo dia.' },
    { titulo: 'Para surpreender alguém especial', id: 'pablo-raez-esmeralda', texto: 'Verde com efeito solar, que muda de tom com a luz.' },
  ],
  // seleção de Natal: relógios recortados sobre pedestais
  selecao: [
    { id: 'pablo-raez-colmeia-branco', recorte: 'assets/img/natal/recortes/colmeia-branco.webp' },
    { id: 'pablo-raez-romano', recorte: 'assets/img/natal/recortes/romano.webp' },
    { id: 'sunlifex-cronografo', recorte: 'assets/img/natal/recortes/sunlifex.webp' },
    { id: 'pablo-raez-esmeralda', recorte: 'assets/img/natal/recortes/esmeralda.webp' },
  ],
  chegando: [
    { id: 'pablo-raez-retangular', name: 'Pablo Raez Retangular', subtitle: 'Branco · couro preto · algarismos romanos', para: 'ele', img: IMG + 'natal/retangular.jpg' },
    { id: 'pablo-raez-integrado', name: 'Pablo Raez Integrado', subtitle: 'Branco · pulseira integrada · dia e data', para: 'ele', img: IMG + 'natal/integrado-branco.jpg' },
    { id: 'pablo-raez-canelado', name: 'Pablo Raez Canelado', subtitle: 'Branco · luneta canelada · pulseira de aço', para: 'ele', img: IMG + 'natal/canelado.jpg' },
    { id: 'saint-germain-classico', name: 'Saint Germain Clássico', subtitle: 'Creme · dourado · couro croco caramelo', para: 'ela', img: IMG + 'natal/sg-classico-couro.jpg' },
    { id: 'saint-germain-quadrado-dourado', name: 'Saint Germain Quadrado', subtitle: 'Branco · dourado · pulseira de aço', para: 'ela', img: IMG + 'natal/sg-quadrado-dourado.jpg' },
    { id: 'saint-germain-quadrado-prata', name: 'Saint Germain Quadrado', subtitle: 'Branco · prateado · pulseira de aço', para: 'ela', img: IMG + 'natal/sg-quadrado-prata.jpg' },
    { id: 'saint-germain-bicolor', name: 'Saint Germain Bicolor', subtitle: 'Branco · dourado e prata', para: 'ela', img: IMG + 'natal/sg-bicolor.jpg' },
  ],
};

// Fotos que passam no topo da home, de ponta a ponta. Cada uma leva ao produto indicado.
// wide: foto deitada para o computador (ideal 2400 px de largura, proporção perto de 16:9 ou 2:1),
//       com uma versão de 1200 px ao lado (nome-1200.jpg).
// img:  foto vertical usada no celular.
// pos:  ponto da foto que fica sempre visível ao cortar (opcional, padrão '50% 50%').
LR.hero = [
  { wide: IMG + 'hero-colmeia.jpg', img: IMG + 'colmeia-02.jpg', id: 'pablo-raez-colmeia', pos: '40% 50%' },
  { wide: IMG + 'hero-riviera.jpg', img: IMG + 'riviera-02.jpg', id: 'technos-riviera', pos: '62% 45%' },
  { wide: IMG + 'hero-rosa.jpg', img: IMG + 'rosa-06.jpg', id: 'pablo-raez-rosa-dos-ventos', pos: '60% 50%' },
  { wide: IMG + 'hero-romano.jpg', img: IMG + 'romano-01.jpg', id: 'pablo-raez-romano', pos: '50% 50%' },
];

LR.articles = [
  { slug: 'aco-ou-couro', title: 'Aço ou couro?', kicker: 'Guia', date: '2026-11-06', cover: IMG + 'rosa-05.jpg', excerpt: 'As duas pulseiras têm vantagens. O que muda é o seu dia a dia.', body: [
    'A pulseira de aço é a mais resistente. Aguenta suor, respingos e uso diário sem marcar, e combina tanto com roupa social quanto com camiseta. É um pouco mais pesada no pulso, e o ajuste é feito tirando ou colocando elos.',
    'A pulseira de couro é mais leve e confortável, e dá ao relógio um ar mais clássico. Ela pede um pouco mais de cuidado: evite molhar e não passe perfume ou creme direto nela. Com o tempo, o couro amacia e se molda ao pulso.',
    'Se você vai usar todo dia e quer esquecer que está de relógio, vá de aço. Se quer algo mais leve e elegante, para trabalho e ocasiões especiais, o couro é a escolha.',
  ] },
  { slug: 'como-cuidar', title: 'Como cuidar do seu relógio', kicker: 'Cuidado', date: '2026-11-06', cover: IMG + 'rosa-04.jpg', excerpt: 'Alguns hábitos simples fazem o relógio durar muitos anos com cara de novo.', body: [
    'Limpe com um pano macio e seco. No aço, um pano levemente úmido tira a sujeira entre os elos; seque bem em seguida. No couro, só pano seco.',
    'Resistência à água não é o mesmo que poder mergulhar. Relógios marcados como water resistant aguentam respingos e chuva. Os de 50 metros aguentam lavar as mãos e chuva forte, mas não são feitos para piscina ou mar.',
    'Evite acertar a data entre 21h e 3h, quando o mecanismo está trocando o dia. E, se o relógio for de quartzo, troque a bateria assim que ele começar a atrasar.',
  ] },
  { slug: 'por-que-quartzo', title: 'Por que quartzo', kicker: 'Mecanismo', date: '2026-11-06', cover: IMG + 'colmeia-04.jpg', excerpt: 'Preciso, prático e quase sem manutenção. Entenda o mecanismo dos relógios da vitrine.', body: [
    'Um relógio de quartzo usa uma bateria e um pequeno cristal que vibra numa frequência constante. É isso que faz ele marcar a hora com tanta precisão, sem precisar dar corda.',
    'Na prática, você coloca no pulso e esquece. A manutenção se resume à troca da bateria a cada poucos anos, que qualquer relojoaria faz em minutos.',
  ] },
  { slug: 'presente-de-natal', title: 'Como escolher um relógio para presentear no Natal', kicker: 'Natal', date: '2026-11-27', cover: IMG + 'riviera-01.jpg', excerpt: 'Cinco perguntas que ajudam a acertar o relógio de quem você ama.', body: [
    'Comece pelo jeito da pessoa, não pelo relógio. Quem usa roupa social no trabalho costuma combinar com um mostrador limpo e pulseira de aço ou de couro preto. Quem vive de camiseta e tênis prefere algo mais robusto, como um modelo com visual de cronógrafo. E quem gosta de chamar atenção aproveita bem um mostrador colorido, verde ou azul.',
    'Depois, escolha a pulseira. A de aço é a mais resistente e aguenta o dia a dia sem marcar. A de couro é mais leve e tem um ar mais clássico, mas pede cuidado com água. Se você não sabe a medida do pulso de quem vai ganhar, a pulseira de aço é a escolha mais segura: ela é ajustada tirando elos, em poucos minutos.',
    'Olhe também as funções. Data e dia da semana são úteis para quem tem rotina cheia. Algarismos romanos dão um ar tradicional; índices em bastão deixam o relógio mais moderno.',
    'Pense no orçamento sem vergonha de dizer. Um relógio de R$ 129,99 bem escolhido faz mais efeito do que um caro que não combina com a pessoa. Se ficar em dúvida entre dois, mande os dois no WhatsApp com uma frase sobre quem vai ganhar, que a gente ajuda a decidir.',
    'Por fim, não deixe para a última hora. Em Marabá, entregamos em até 2 dias úteis: pedindo até 22 de dezembro, o presente chega antes do Natal. Avise no pedido que é presente.',
  ] },
];

LR.format = {
  price(n) { return n.toLocaleString('pt-BR', { style: 'currency', currency: LR.brand.currency }); },
  date(iso) { const d = new Date(iso + 'T12:00:00'); return d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' }).replace('.', ''); },
};
LR.byId = id => LR.products.find(p => p.id === id);
// estoque verdadeiro: só aparece quando é 1, 2 ou 3 unidades
LR.stockLabel = (p, longo) => {
  if (!p || p.status === 'esgotado' || !p.stock || p.stock > 3) return '';
  if (p.stock === 1) return longo ? 'Peça única · não perca' : 'Peça única';
  return longo ? `Últimas ${p.stock} unidades` : `Últimas ${p.stock}`;
};
// prazo de Natal: devolve a data (dd/mm) enquanto ainda dá tempo, senão ''
LR.natalPrazo = () => {
  const N = LR.natal; if (!N || !N.ativo || !N.ultimoDia) return '';
  const hoje = new Date(), lim = new Date(N.ultimoDia + 'T23:59:59');
  return hoje <= lim ? N.ultimoDia.slice(8, 10) + '/' + N.ultimoDia.slice(5, 7) : '';
};
// Cada relógio e cada artigo tem uma página própria, já com o conteúdo no HTML
// (gerada por scripts/seo.mjs), para o Google e as IAs lerem sem JavaScript.
LR.url = {
  product: p => `relogio-${p.id}.html`,
  article: a => `artigo-${a.slug}.html`,
};
LR.collection = slug => LR.collections.find(c => c.slug === slug);
