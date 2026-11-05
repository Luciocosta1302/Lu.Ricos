/* ============================================================
   LU.RICOS — catálogo
   Troque aqui nomes, preços, imagens e textos. Todas as páginas
   leem deste arquivo (loja, produto, coleções, home).
   Imagens: coloque suas fotos em assets/img/ e aponte os caminhos.
   ============================================================ */

window.LR = window.LR || {};

LR.brand = {
  name: 'LU.RICOS',
  tagline: 'Peças essenciais, feitas para durar.',
  city: 'São Paulo — BR',
  founded: '2024',
  whatsapp: '5511999999999',           // só números, com DDI + DDD
  instagram: 'https://instagram.com/lu.ricos',
  email: 'ola@luricos.com.br',
  address: 'Rua Exemplo, 123 — Pinheiros, São Paulo',
  hours: 'Seg–Sáb · 10h–19h',
  currency: 'BRL',
};

LR.collections = [
  {
    slug: 'essenciais',
    name: 'Essenciais',
    code: 'COL. 01',
    season: 'Permanente',
    cover: 'assets/img/scene-01.svg',
    intro: 'A base de tudo. Peças sem época, pensadas para serem usadas todos os dias e durarem anos.',
  },
  {
    slug: 'edicoes',
    name: 'Edições Limitadas',
    code: 'COL. 02',
    season: 'Numeradas',
    cover: 'assets/img/scene-06.svg',
    intro: 'Tiragens pequenas, numeradas uma a uma. Quando acabam, não voltam.',
  },
  {
    slug: 'acessorios',
    name: 'Acessórios',
    code: 'COL. 03',
    season: 'Permanente',
    cover: 'assets/img/scene-03.svg',
    intro: 'Complementos com o mesmo rigor das peças principais: material honesto, acabamento limpo.',
  },
];

// status: 'disponivel' | 'esgotado' | 'encomenda'
LR.products = [
  { id: 'lr-001', code: 'LR-001', name: 'Modelo Um', subtitle: 'Camiseta oversized · algodão 240g', collection: 'essenciais', category: 'Vestuário', price: 189, status: 'disponivel', badge: 'Novo', images: ['assets/img/p01-a.svg','assets/img/p01-b.svg'], colors: ['Preto','Off-white','Cinza'], sizes: ['P','M','G','GG'], desc: 'Nossa camiseta de referência. Malha penteada de 240g/m², ombro caído e gola reforçada com fita interna. Pré-lavada para não encolher.', specs: { 'Material': 'Algodão penteado 240g/m²', 'Modelagem': 'Oversized', 'Origem': 'Feito no Brasil', 'Cuidado': 'Lavar a frio, secar à sombra' } },
  { id: 'lr-002', code: 'LR-002', name: 'Modelo Dois', subtitle: 'Moletom pesado · 380g', collection: 'essenciais', category: 'Vestuário', price: 349, status: 'disponivel', badge: '', images: ['assets/img/p02-a.svg','assets/img/p02-b.svg'], colors: ['Preto','Cinza mescla'], sizes: ['P','M','G','GG'], desc: 'Moletom de 380g com felpa interna e punhos canelados em dupla camada. Costuras francesas nas laterais e capuz forrado.', specs: { 'Material': 'Algodão 80% / Poliéster 20%', 'Gramatura': '380g/m²', 'Origem': 'Feito no Brasil', 'Cuidado': 'Lavar a frio, não usar secadora' } },
  { id: 'lr-003', code: 'LR-003', name: 'Modelo Três', subtitle: 'Calça reta · sarja', collection: 'essenciais', category: 'Vestuário', price: 329, status: 'disponivel', badge: '', images: ['assets/img/p03-a.svg','assets/img/p03-b.svg'], colors: ['Preto','Areia'], sizes: ['38','40','42','44','46'], desc: 'Corte reto, cós médio e barra limpa. Sarja de algodão com toque macio e caimento firme.', specs: { 'Material': 'Sarja 100% algodão', 'Modelagem': 'Reta', 'Origem': 'Feito no Brasil', 'Cuidado': 'Lavar a frio' } },
  { id: 'lr-004', code: 'LR-004', name: 'Modelo Quatro', subtitle: 'Boné 6 gomos · brim', collection: 'acessorios', category: 'Acessórios', price: 129, status: 'disponivel', badge: '', images: ['assets/img/p04-a.svg','assets/img/p04-b.svg'], colors: ['Preto','Off-white'], sizes: ['Único'], desc: 'Seis gomos, aba curva e fecho em fivela metálica. Bordado tonal com a marca na frente.', specs: { 'Material': 'Brim 100% algodão', 'Ajuste': 'Fivela metálica', 'Origem': 'Feito no Brasil' } },
  { id: 'lr-005', code: 'LR-005', name: 'Modelo Cinco', subtitle: 'Bolsa tote · lona 16oz', collection: 'acessorios', category: 'Acessórios', price: 219, status: 'disponivel', badge: 'Mais vendido', images: ['assets/img/p05-a.svg','assets/img/p05-b.svg'], colors: ['Natural','Preto'], sizes: ['Único'], desc: 'Lona pesada de 16oz, alças reforçadas com costura em X e bolso interno. Feita para carregar o dia inteiro.', specs: { 'Material': 'Lona de algodão 16oz', 'Dimensões': '40 × 38 × 12 cm', 'Origem': 'Feito no Brasil' } },
  { id: 'lr-006', code: 'LR-006', name: 'Modelo Seis', subtitle: 'Jaqueta trucker · sarja', collection: 'edicoes', category: 'Edições', price: 589, status: 'disponivel', badge: 'Edição de 100', images: ['assets/img/p06-a.svg','assets/img/p06-b.svg'], colors: ['Preto'], sizes: ['P','M','G'], desc: 'Edição numerada de 100 peças. Corte trucker clássico, botões em metal escovado e etiqueta interna com número da unidade.', specs: { 'Material': 'Sarja 100% algodão', 'Tiragem': '100 unidades numeradas', 'Origem': 'Feito no Brasil' } },
  { id: 'lr-007', code: 'LR-007', name: 'Modelo Sete', subtitle: 'Meias · pack de 3', collection: 'acessorios', category: 'Acessórios', price: 89, status: 'disponivel', badge: '', images: ['assets/img/p07-a.svg','assets/img/p07-b.svg'], colors: ['Preto','Branco','Cinza'], sizes: ['35–38','39–43'], desc: 'Cano médio, reforço no calcanhar e punho que não aperta. Três pares.', specs: { 'Material': 'Algodão 75% / Poliamida 22% / Elastano 3%', 'Origem': 'Feito no Brasil' } },
  { id: 'lr-008', code: 'LR-008', name: 'Modelo Oito', subtitle: 'Carteira slim · couro', collection: 'acessorios', category: 'Acessórios', price: 159, status: 'esgotado', badge: 'Esgotado', images: ['assets/img/p08-a.svg','assets/img/p08-b.svg'], colors: ['Preto','Conhaque'], sizes: ['Único'], desc: 'Couro curtido ao vegetal, quatro compartimentos e espessura mínima. Envelhece bem.', specs: { 'Material': 'Couro curtido ao vegetal', 'Dimensões': '10 × 7 cm', 'Origem': 'Feito no Brasil' } },
  { id: 'lr-009', code: 'LR-009', name: 'Modelo Nove', subtitle: 'Camisa overshirt · flanela', collection: 'edicoes', category: 'Edições', price: 449, status: 'encomenda', badge: 'Sob encomenda', images: ['assets/img/p09-a.svg','assets/img/p09-b.svg'], colors: ['Grafite'], sizes: ['P','M','G','GG'], desc: 'Produzida sob encomenda em até 15 dias. Flanela escovada, dois bolsos frontais e botões de coco.', specs: { 'Material': 'Flanela 100% algodão', 'Prazo': 'Até 15 dias úteis', 'Origem': 'Feito no Brasil' } },
  { id: 'lr-010', code: 'LR-010', name: 'Modelo Dez', subtitle: 'Bermuda · sarja leve', collection: 'essenciais', category: 'Vestuário', price: 229, status: 'disponivel', badge: '', images: ['assets/img/p10-a.svg','assets/img/p10-b.svg'], colors: ['Preto','Areia','Oliva'], sizes: ['38','40','42','44'], desc: 'Comprimento acima do joelho, cós com elástico interno e bolsos profundos.', specs: { 'Material': 'Sarja leve 100% algodão', 'Origem': 'Feito no Brasil' } },
  { id: 'lr-011', code: 'LR-011', name: 'Modelo Onze', subtitle: 'Gorro · tricô canelado', collection: 'acessorios', category: 'Acessórios', price: 99, status: 'disponivel', badge: 'Novo', images: ['assets/img/p11-a.svg','assets/img/p11-b.svg'], colors: ['Preto','Cinza','Off-white'], sizes: ['Único'], desc: 'Tricô canelado com dobra dupla. Etiqueta tecida discreta na frente.', specs: { 'Material': 'Acrílico 50% / Lã 50%', 'Origem': 'Feito no Brasil' } },
  { id: 'lr-012', code: 'LR-012', name: 'Modelo Doze', subtitle: 'Kit presente · caixa numerada', collection: 'edicoes', category: 'Edições', price: 399, status: 'disponivel', badge: 'Edição de 50', images: ['assets/img/p12-a.svg','assets/img/p12-b.svg'], colors: ['Preto'], sizes: ['P','M','G'], desc: 'Camiseta Modelo Um, gorro Modelo Onze e meias Modelo Sete em caixa rígida numerada. 50 unidades.', specs: { 'Conteúdo': 'Camiseta + gorro + pack de meias', 'Tiragem': '50 caixas numeradas', 'Origem': 'Feito no Brasil' } },
];

LR.articles = [
  { slug: 'por-que-240g', title: 'Por que 240 gramas', kicker: 'Materiais', date: '2026-10-12', cover: 'assets/img/scene-03.svg', excerpt: 'A gramatura certa não é a mais pesada nem a mais leve. É a que segura a forma depois de cinquenta lavagens.', body: [
    'Gramatura é o peso do tecido por metro quadrado. Parece um detalhe técnico, mas é o que decide se uma camiseta vai parecer nova depois de um ano ou se vai virar pano de chão em três meses.',
    'Testamos malhas de 180 a 300 gramas. As mais leves caem bem no primeiro dia e perdem a estrutura rápido. As mais pesadas duram, mas esquentam demais no verão brasileiro. Em 240 gramas, com fio penteado, encontramos o ponto em que a peça respira e ainda segura o ombro no lugar.',
    'Todas as nossas camisetas passam por pré-lavagem industrial. Isso tira a tensão do fio e garante que a peça que você experimenta é a peça que você vai ter depois de lavar em casa.',
  ] },
  { slug: 'numeradas-uma-a-uma', title: 'Numeradas, uma a uma', kicker: 'Edições', date: '2026-09-28', cover: 'assets/img/scene-06.svg', excerpt: 'Como funcionam as edições limitadas da casa, e por que não fazemos reposição.', body: [
    'Uma edição limitada só faz sentido se for limitada de verdade. Por isso cada peça das nossas edições recebe um número bordado na etiqueta interna, e a tiragem é anunciada antes do lançamento.',
    'Quando acaba, acaba. Não refazemos a mesma peça nas mesmas cores. Pode voltar uma ideia parecida, em outro material ou em outra edição, mas o número que você tem continua sendo só seu.',
  ] },
  { slug: 'o-ateliê', title: 'O ateliê', kicker: 'Processo', date: '2026-08-15', cover: 'assets/img/scene-01.svg', excerpt: 'Onde as peças nascem: um galpão de 120 metros em Pinheiros, duas máquinas de corte e muita mesa.', body: [
    'Trabalhamos com uma oficina de costura parceira há três anos. São oito pessoas, horário fixo e produção pequena. Visitamos toda semana, aprovamos cada lote peça a peça.',
    'Fazer pouco é uma escolha. Permite corrigir modelagem no meio da produção, trocar um fio que não gostamos, e manter preço justo para quem costura e para quem compra.',
  ] },
  { slug: 'como-cuidar', title: 'Como cuidar', kicker: 'Cuidado', date: '2026-07-02', cover: 'assets/img/scene-02.svg', excerpt: 'Instruções simples para suas peças durarem o quanto foram feitas para durar.', body: [
    'Lave a frio, do avesso, com peças de cor parecida. Evite amaciante: ele encapa o fio e, com o tempo, deixa o tecido com aspecto gasto.',
    'Seque à sombra, de preferência na horizontal para moletons e tricôs. A secadora encurta a vida de qualquer malha.',
    'Peças de couro: passe um pano levemente úmido e deixe secar naturalmente. Uma vez por ano, hidrate com cera neutra.',
  ] },
];

LR.format = {
  price(n) { return n.toLocaleString('pt-BR', { style: 'currency', currency: LR.brand.currency }); },
  date(iso) { const d = new Date(iso + 'T12:00:00'); return d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' }).replace('.', ''); },
};
LR.byId = id => LR.products.find(p => p.id === id);
LR.collection = slug => LR.collections.find(c => c.slug === slug);
