---
name: escala-e-texturas
description: Use ao definir tamanhos de texto (títulos, subtítulos, corpo) em cartaz, post, story, anúncio ou página do site, e ao escolher fundos. Também quando o pedido disser "design chapado", "sem graça", "texto no olho", "hierarquia", "proporção áurea", "escala tipográfica", "textura" ou "fundo". Ensina a escala por proporção (1,618 / 1,414 / 1,333 / 1,25 / 1,2), os 22 tipos de fundo com textura e como a LU.RICOS aplica os dois.
metadata:
  version: 1.0.0
  origem: dois vídeos enviados pelo dono da loja em 27/11/2026 (@aevyvideoschool, "pare de chutar o tamanho do texto"; @isaquelev1, "22 backgrounds pra deixar seu design menos chapado")
---

# Escala de texto e fundos com textura

Duas regras que tiram o "jeito de amador" de qualquer peça:

1. **Os tamanhos de texto não são chutados.** Saem de uma proporção fixa.
2. **O fundo não é uma cor lisa.** Ganha uma textura leve.

## 1. Escala por proporção

Escolha o tamanho maior (ou o do texto corrido) e divida (ou multiplique) sempre pelo mesmo número.
Exemplo do vídeo: título de 200 pt → próximo nível 200 ÷ 1,618 = **123,6 pt** → 76,4 → 47,2 …

| Proporção | Número | Sensação | Melhor para |
| --- | --- | --- | --- |
| Áurea | 1,618 | Sofisticada, elegância natural | Logos, marca de luxo, topo de página |
| Prata | 1,414 | Moderna, geométrica, minimalista | Grades de interface, tecnologia |
| Quarta justa | 1,333 | Amigável, equilibrada, estável | Títulos H1–H2, cartazes |
| Quinta justa | 1,25 | Suave, calma | Botões, texto corrido, espaçamento |
| Terça menor | 1,2 | Revista, editorial | Revistas, layouts de leitura |

Como usar:
- **Até 5 ou 6 níveis.** Ex.: palavra gigante, título, subtítulo, frase, rótulo.
- **Cada nível tem um papel.** A palavra gigante prende o olho; o rótulo pequeno dá contexto (data, cidade, edição).
- **Arredonde só no fim**, e nunca invente um tamanho fora da escala para "caber". Se não cabe, desça um nível.
- **Contraste vem da escala, não de mais cores.** Uma cor de destaque basta.

### Na LU.RICOS
- **Site (computador):** proporção áurea a partir de 16 px: **16 · 25,9 · 41,9 · 67,8 · 109,7 · 177,5** (`.lead`, `.display-s`, `.display-m`, `.display-l`, `.display-xl` em `assets/styles.css`).
- **Site (celular):** 1,333 a partir de 16 px: **21,3 · 28,4 · 37,9 · 50,5 · 67,3** (os mínimos de cada `clamp`).
- **Coluna estreita:** o título desce um nível (ex.: `.col-text`, `.splitsec` usam o tamanho de `.display-m`).
- **Artes (1080 px):** áurea a partir de 300: **300 · 185 · 115 · 71 · 44 · 27**. Ex.: `brand/natal-2026/feed-rosa-dos-ventos.jpg` — palavra 300, itálico 71, nome 44, rótulos 27.

## 2. Fundos que não ficam chapados

Os 22 do vídeo: textura de feltro · vidro canelado · gradiente térmico · ondulações de água · grafite salpicado · paisagem de uma cor só · grade de projetos · meio-tom · gradiente granulado · textura de grama · imagem pontilhada · textura de papel · linhas de contorno · céu de nuvens · mosaico de pixels · distorção de lente · gradiente pontilhado · grade de pontos · foto desfocada · formas iridescentes · pintura impressionista · ASCII sobre pixels.

### Os que combinam com a LU.RICOS
Relojoaria pede material, não efeito digital:
- **Textura de papel** — fundos claros (aço/creme). Vitrine "Seleção de Natal", posts editoriais.
- **Gradiente granulado / grão** — faixas vermelhas e bordô, rodapé, faixa do topo.
- **Feltro** — imita o forro da caixa do relógio; bom para fundo de produto.
- **Foto desfocada** — fundo de story feito com a própria foto (já usado nos stories de Natal).
- **Vidro canelado** e **meio-tom** — com moderação, em uma peça de campanha.
- **Evitar:** grafite, pixels, ASCII, iridescente, grama — brigam com a elegância da marca.

### Como fazer no site (sem imagem externa)
Textura em SVG com `feTurbulence`, como camada de `background` sobre a cor:
```css
background: url("data:image/svg+xml,…feTurbulence baseFrequency='.85'…feColorMatrix … 0 0 0 .09 0…"), var(--x-red);
```
- **Grão claro em fundo escuro:** cor branca, opacidade em torno de 0,09.
- **Papel em fundo claro:** cor marrom-acinzentada, opacidade em torno de 0,07–0,10.
- **Sempre leve:** a textura se sente, não se vê de longe. Os blocos prontos estão no fim de `assets/natal.css`.

## Conferência
1. Todos os tamanhos saem da mesma proporção?
2. Há no máximo 5–6 níveis, cada um com um papel?
3. Nenhum título estoura a coluna (no celular também)? Se estoura, desce um nível.
4. O fundo tem textura leve e combina com a marca (papel, grão, feltro)?
5. Continua um destaque de cor só (o vermelho)?
