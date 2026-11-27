---
name: cartaz-cinco-estilos
description: Use ao criar cartaz, post de feed, story ou anúncio a partir de uma foto, quando o pedido citar ou pedir um estilo (bold, minimal, minimalista, brutalista, cinematográfico, editorial), "texto atrás do relógio/da pessoa", "várias versões do mesmo post" ou "deixa mais com cara de design". Ensina as 5 regras curtas para transformar a mesma imagem em 5 cartazes diferentes, o truque do texto atrás do assunto e como aplicar isso na identidade da LU.RICOS.
metadata:
  version: 1.0.0
  origem: vídeo curto de @ayzz.thedesigner (Instagram), enviado pelo dono da loja em 25/11/2026, mais pesquisa de referências
---

# Cartaz em 5 estilos

A mesma foto vira 5 cartazes diferentes mudando só **cor, escala, quantidade de texto e camadas**. Cada estilo tem uma regra de uma frase. Use a regra como ponto de partida e não misture estilos no mesmo cartaz.

## As 5 regras (do vídeo)

| Estilo | Regra | Em uma palavra |
| --- | --- | --- |
| **Bold** | Cores em contraste e escala exagerada. | Grito |
| **Minimal** | Texto bem menor e muito mais respiro em volta de cada elemento. | Silêncio |
| **Brutalista** | Foto em preto e branco, títulos pesados numa cor só e formas soltas. | Atrito |
| **Cinematográfico** | Foto escura e todo o resto numa cor clara e forte. | Filme |
| **Editorial** | Serifa combinada com fonte de display, e o texto atrás do assunto. | Revista |

Diagnóstico rápido: se o cartaz "não está bold", "não está minimal" etc., aplique a regra daquele estilo, não um enfeite novo.

## Como fazer cada um

### Bold
- **Fundo:** uma cor chapada e saturada (na LU.RICOS, o Vermelho Estojo).
- **Título:** sans muito pesada, enorme, encostando nas margens; duas linhas curtas. Uma segunda palavra ou número gigante em cor oposta (grafite) na base.
- **Camadas:** o assunto na frente de parte do título; as letras continuam legíveis porque aparecem dos dois lados do assunto.
- **Apoio:** legenda curta em mono pequena e o @ num canto.
- **Evitar:** título que não cabe na largura, assunto tão largo que esconde a palavra inteira.

### Minimal
- **Fundo:** claro e liso (aço ou branco); o assunto menor, com a base sumindo no fundo (degradê).
- **Texto:** pequeno. Uma frase curta no alto, duas palavras médias separadas dos dois lados do assunto, rótulos minúsculos nos cantos.
- **Espaço:** pelo menos metade do cartaz vazia; alinhamento por grade (Estilo Suíço): espaço em branco é elemento ativo.
- **Evitar:** título grande, mais de 2 tamanhos de letra, preencher os cantos.

### Brutalista
- **Foto:** preto e branco com contraste alto.
- **Título:** sans condensada e pesadíssima, numa cor só, grande o bastante para ser cortada pela margem ou pelo assunto; repetir a palavra funciona.
- **Formas:** uma forma bruta (estrela, explosão, bloco) atrás do assunto e sinais soltos (+, cruzes, números).
- **Cor:** preto, branco e cinza, com um único estouro de cor.
- **Evitar:** degradês, sombras, cantos arredondados, organização "bonitinha".

### Cinematográfico
- **Foto:** escurecida (brilho bem baixo, contraste alto) com degradê escuro em cima e embaixo.
- **Cor:** todo o texto numa cor clara e forte só.
- **Título:** condensado, dividido em duas partes (uma no alto à esquerda, outra mais abaixo à direita).
- **Convenções de pôster de filme:** fileira de "créditos" no topo, ano, "apresenta", e o bloco de créditos (billing block) em letra condensada bem pequena na base.
- **Evitar:** foto clara, mais de uma cor de texto.

### Editorial
- **Fundo:** papel (creme ou aço) com granulação leve.
- **Tipografia:** um título de display com serifa pesada (didone) atrás do assunto e uma linha em itálico de serifa, inclinada, por cima do título, sem esconder as letras dele.
- **Camadas:** é o "efeito capa de revista": o título fica entre o fundo e o assunto.
- **Apoio:** rótulos pequenos nos cantos ("Edição 2026") e uma frase curta em itálico.
- **Evitar:** o itálico em cima das letras do título; título tão coberto que não se lê.

## Peças que se repetem nos 5

- **Texto atrás do assunto:** recorte o assunto da foto e monte em 4 camadas: fundo → texto de trás → assunto recortado → texto da frente. Para legibilidade, deixe letras visíveis dos dois lados do assunto e abra espaço entre as letras que passam atrás dele.
- **Selo redondo:** o nome girando em círculo com uma cruz no centro. Pequeno, num canto ou ao lado do assunto.
- **Rótulos de canto:** textos minúsculos em mono (marca, cidade, ano, @).
- **Uma ideia por cartaz:** uma palavra ou duas no título.

## Na LU.RICOS

- **Cores:** grafite `#111214`, aço `#e9eae6`, Vermelho Estojo `#cc2744` como único destaque (o ponto de LU.RICOS é sempre vermelho e quadrado). No cinematográfico, a "cor clara e forte" é o vermelho; no editorial, use creme `#efe8da`.
- **Fontes:** Archivo (sans; larga em 125% ou condensada em 62%), Martian Mono (rótulos), Instrument Sans (texto), Bodoni Moda itálico e Gloock (serifa do editorial).
- **Fotos:** sempre as fotos reais das peças. Recorte com `rembg` e o modelo `isnet-general-use`; confira se o recorte não vazou pelo mostrador (mostrador escuro às vezes vira "fundo").
- **Textos:** simples e próprios da peça (ex.: "Verde solar.", "o tempo, VERDE"). Sem preço nos anúncios e sem frases genéricas ("fotos reais da peça", "qualidade garantida"). Preferência do dono da loja.
- **Formatos:** feed 1080 × 1350; story 1080 × 1920 com o texto fora dos 220 px de cima e dos 300 px de baixo.

## Modelo pronto

`modelo-cartazes.html`, nesta pasta, monta os 5 estilos com um relógio recortado. Troque `CUT` (PNG recortado) e `FOTO` (foto original, usada no cinematográfico) e gere as imagens com Playwright:

```js
await page.setViewportSize({ width: 1080, height: 1350 });
await page.goto(`file://${caminho}/modelo-cartazes.html?s=bold`); // bold | minimal | brutal | cine | edit
await page.evaluate(() => document.fonts.ready);
await page.screenshot({ path: 'cartaz-bold.png' });
```

Exemplos aplicados ao Pablo Raez Esmeralda: `brand/cartazes/`.

## Estilo extra: Faixas diagonais (anúncio de produto)

Estilo de que o dono da loja gosta (referência enviada em 27/11/2026: anúncio "Time wears better"). Regra: **duas cores em faixas inclinadas, título enorme em duas cores, relógio grande deitado na diagonal e uma fileira de fatos com ícones.**

- **Fundo:** uma cor escura da peça e um creme. A parte de cima é escura (com um pouco de luz no canto de cima à direita). Depois vêm uma faixa creme, uma faixa escura e creme até embaixo. As faixas sobem para a direita, com inclinação de 0,36. No canto de baixo à esquerda fica um triângulo escuro, onde vai a marca.
- **Título:** Archivo 900, de 140 a 168 px, duas linhas curtas. A 1ª linha é creme e a 2ª vai numa cor de destaque tirada da peça (ouro, verde, vermelho da marca). Tem que caber na largura, senão diminua o tamanho.
- **Relógio:** o recorte real, girado de −38° a −50°, com a coroa para cima à direita, atravessando as faixas, com sombra longa para baixo à direita. As pontas da pulseira somem em degradê. Se a parte de baixo do recorte tiver névoa, corte a imagem antes.
- **Frase:** uma frase da peça, concreta (o que ela tem), na faixa creme à direita, em texto escuro, com o nome da peça embaixo em mono.
- **Fatos:** "Na LU.RICOS" e 4 itens com ícones de linha, só com fatos reais:
  - Entrega em Marabá em 2 dias úteis
  - Pix ou cartão parcelado
  - 7 dias para devolver
  - O estoque ("Peça única" / "Últimas 2 peças")

  Sem preço.
- **Paleta por peça:**
  - Riviera: azul-marinho `#1c2943` + creme `#dccab0` + ouro `#c9a462`
  - Esmeralda: verde `#12302a` + `#d8d2c1` + `#8fc3a8`
  - Romano: grafite `#17181b` + `#d9d6ce` + vermelho `#cc2744`
  - Sunlifex: vinho `#4a0d16` + `#e2d5c1` + ouro `#d3a95e`
- **Modelo:** `modelo-faixas.html?w=riviera&f=feed` (ou `f=story`), com o recorte em PNG ao lado (`riviera.png`, `esmeralda.png`, `romano.png`, `sunlifex.png`). O story é o mesmo layout descido 285 px. Exemplos em `brand/anuncios-faixas/`.

## Conferência antes de entregar

1. O cartaz segue a regra do seu estilo e só ela?
2. O título se lê com o assunto na frente?
3. Só um destaque de cor além do grafite e do aço?
4. Funciona pequeno, na grade do perfil?
5. Nada encostado ou cortado sem querer nas margens?

## Referências

- Brutalismo: tipografia pesada como estrutura, preto, branco e cinza com um estouro de cor, formas geométricas e fotos cruas ([Playbook](https://playbook.com/blog/brutalism-in-graphic-design), [Linearity](https://www.linearity.io/blog/brutalist-graphic-design/), [Envato Tuts+](https://design.tutsplus.com/articles/rebellious-design-brutalism-meets-90s-graphic-design--cms-42086)).
- Pôster de filme: o título é expressivo, o texto de apoio é limpo e sistemático, e o bloco de créditos fica pequeno e condensado na base ([PRINT](https://www.printmag.com/article/typography-movie-poster-design/), [StudioBinder](https://studiobinder.com/blog/movie-poster-credits-template)).
- Texto atrás do assunto: "stolen letter" ou "efeito Sports Illustrated", em que o título fica entre o fundo e a pessoa ([CreativePro](https://creativepro.com/how-to-create-a-stolen-letter-effect-in-photoshop/), [CreativePro: sandwiching](https://creativepro.com/sandwiching-text-or-logos-inside-an-image/)).
- Minimal e Estilo Suíço: grade, alinhamento à esquerda, sans-serif e espaço em branco como elemento ativo ([MasterClass](https://www.masterclass.com/articles/swiss-design), [Biblioteca Nacional Suíça](https://www.nb.admin.ch/snl/en/home/publications-research/dossiers/swiss-poster/international-style.html)).
