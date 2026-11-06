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
  city: 'São Paulo — BR',            // troque pela sua cidade
  whatsapp: '5511999999999',           // só números: 55 + DDD + número
  instagram: 'https://instagram.com/lu.ricos',
  email: 'ola@luricos.com.br',        // troque pelo seu e-mail
  address: 'Atendimento online',      // ou o endereço da loja física
  hours: 'Seg–Sáb · 10h–19h',
  currency: 'BRL',
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
    season: 'Pablo Raez',
    cover: IMG + 'colmeia-05.jpg',
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
LR.products = [
  {
    id: 'technos-riviera', code: 'LR-01', brand: 'Technos',
    name: 'Technos Riviera', subtitle: 'Azul e dourado · pulseira bicolor',
    collection: 'technos', category: 'Aço', price: 799.99, status: 'disponivel', badge: 'Destaque',
    images: [IMG + 'riviera-02.jpg', IMG + 'riviera-01.jpg', IMG + 'riviera-03.jpg'],
    colors: ['Azul'], sizes: ['Único'],
    desc: 'Mostrador azul com acabamento solar, que muda de tom conforme a luz. Índices e ponteiros dourados, luneta canelada dourada e pulseira em aço bicolor, prata e dourado. Mostra o dia da semana e a data.',
    specs: { 'Marca': 'Technos', 'Linha': 'Riviera', 'Mostrador': 'Azul solar, índices dourados', 'Luneta': 'Canelada, dourada', 'Funções': 'Horas, minutos, segundos, dia da semana e data', 'Máquina': 'Japonesa', 'Resistência à água': '50 m', 'Pulseira': 'Aço bicolor, prata e dourado' },
  },
  {
    id: 'pablo-raez-colmeia', code: 'LR-02', brand: 'Pablo Raez',
    name: 'Pablo Raez Colmeia', subtitle: 'Azul gelo · pulseira de aço',
    collection: 'aco', category: 'Aço', price: 159.99, status: 'disponivel', badge: '',
    images: [IMG + 'colmeia-01.jpg', IMG + 'colmeia-05.jpg', IMG + 'colmeia-04.jpg', IMG + 'colmeia-03.jpg', IMG + 'colmeia-02.jpg'],
    colors: ['Azul gelo'], sizes: ['Único'],
    desc: 'Mostrador azul gelo com relevo em colmeia que aparece em cada reflexo. Algarismos aplicados no 12, 6 e 9, luneta trabalhada em relevo e pulseira de aço prateada. Tem data às 3 horas.',
    specs: { 'Marca': 'Pablo Raez', 'Mostrador': 'Azul gelo, relevo em colmeia', 'Luneta': 'Prateada, trabalhada em relevo', 'Funções': 'Horas, minutos, segundos e data', 'Movimento': 'Quartzo', 'Resistência à água': 'Water resistant (respingos)', 'Pulseira': 'Aço prateado' },
  },
  {
    id: 'pablo-raez-classico', code: 'LR-03', brand: 'Pablo Raez',
    name: 'Pablo Raez Clássico', subtitle: 'Branco · pulseira de aço',
    collection: 'aco', category: 'Aço', price: 159.99, status: 'disponivel', badge: '',
    images: [IMG + 'classico-01.jpg'],
    colors: ['Branco'], sizes: ['Único'],
    desc: 'Mostrador branco com textura em linhas verticais, índices em bastão e minuteria numerada de 5 em 5. Caixa polida e pulseira de aço prateada. Um relógio limpo, que combina com tudo. Tem data às 3 horas.',
    specs: { 'Marca': 'Pablo Raez', 'Mostrador': 'Branco, textura vertical', 'Índices': 'Bastão, com minuteria numerada', 'Funções': 'Horas, minutos, segundos e data', 'Pulseira': 'Aço prateado' },
  },
  {
    id: 'pablo-raez-rosa-dos-ventos', code: 'LR-04', brand: 'Pablo Raez',
    name: 'Pablo Raez Rosa dos Ventos', subtitle: 'Branco · couro marrom',
    collection: 'couro', category: 'Couro', price: 129.99, status: 'disponivel', badge: '',
    images: [IMG + 'rosa-01.jpg', IMG + 'rosa-02.jpg', IMG + 'rosa-03.jpg', IMG + 'rosa-04.jpg', IMG + 'rosa-06.jpg', IMG + 'rosa-05.jpg'],
    colors: ['Branco'], sizes: ['Único'],
    desc: 'Mostrador branco com uma rosa dos ventos em relevo no centro, escala de 24 horas e algarismos romanos. Caixa prateada e pulseira de couro marrom com textura croco e a marca gravada por dentro. Tem data às 3 horas.',
    specs: { 'Marca': 'Pablo Raez', 'Mostrador': 'Branco, rosa dos ventos em relevo', 'Escalas': 'Algarismos romanos e 24 horas', 'Funções': 'Horas, minutos, segundos e data', 'Movimento': 'Quartzo', 'Fundo': 'Aço inoxidável', 'Pulseira': 'Couro marrom, textura croco' },
  },
  {
    id: 'pablo-raez-romano', code: 'LR-05', brand: 'Pablo Raez',
    name: 'Pablo Raez Romano', subtitle: 'Preto · couro preto',
    collection: 'couro', category: 'Couro', price: 129.99, status: 'disponivel', badge: '',
    images: [IMG + 'romano-01.jpg', IMG + 'romano-02.jpg'],
    colors: ['Preto'], sizes: ['Único'],
    desc: 'Mostrador preto com textura quadriculada e algarismos romanos prateados. Caixa polida e pulseira de couro preto com textura croco. Discreto e elegante, bom para o dia a dia e para ocasiões formais. Tem data às 3 horas.',
    specs: { 'Marca': 'Pablo Raez', 'Mostrador': 'Preto, textura quadriculada', 'Escalas': 'Algarismos romanos', 'Funções': 'Horas, minutos, segundos e data', 'Movimento': 'Quartzo', 'Pulseira': 'Couro preto, textura croco' },
  },
];

// Fotos que passam no topo da home (vitrine). Cada uma leva ao produto indicado.
LR.hero = [
  { img: IMG + 'colmeia-02.jpg', id: 'pablo-raez-colmeia' },
  { img: IMG + 'riviera-03.jpg', id: 'technos-riviera' },
  { img: IMG + 'rosa-06.jpg', id: 'pablo-raez-rosa-dos-ventos' },
  { img: IMG + 'romano-01.jpg', id: 'pablo-raez-romano' },
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
  { slug: 'por-que-quartzo', title: 'Por que quartzo', kicker: 'Mecanismo', date: '2026-11-06', cover: IMG + 'colmeia-05.jpg', excerpt: 'Preciso, prático e quase sem manutenção. Entenda o mecanismo dos relógios da vitrine.', body: [
    'Um relógio de quartzo usa uma bateria e um pequeno cristal que vibra numa frequência constante. É isso que faz ele marcar a hora com tanta precisão, sem precisar dar corda.',
    'Na prática, você coloca no pulso e esquece. A manutenção se resume à troca da bateria a cada poucos anos, que qualquer relojoaria faz em minutos.',
  ] },
];

LR.format = {
  price(n) { return n.toLocaleString('pt-BR', { style: 'currency', currency: LR.brand.currency }); },
  date(iso) { const d = new Date(iso + 'T12:00:00'); return d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' }).replace('.', ''); },
};
LR.byId = id => LR.products.find(p => p.id === id);
LR.collection = slug => LR.collections.find(c => c.slug === slug);
