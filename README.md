# LU.RICOS — site da loja

Site completo de loja em **HTML, CSS e JavaScript puros** (sem frameworks, sem build), com estética
editorial monocromática: tipografia grotesca apertada, fios finos, etiquetas em caixa alta, códigos
monoespaçados e animações de scroll.

**Deploy:** GitHub Pages via Actions (`.github/workflows/pages.yml`) a cada push na `main`.

## Páginas

| Arquivo | O que é |
| --- | --- |
| `index.html` | Home: hero com wordmark e peça em destaque, ticker, novidades, processo (imagem fixa), manifesto, galeria horizontal, coleções, jornal, newsletter |
| `loja.html` | Catálogo com filtros por categoria, ordenação, 3/4 colunas e filtro por coleção (`?col=slug`) |
| `produto.html?id=lr-001` | Página de produto: galeria, cor/tamanho, especificações, prazos, relacionados, anterior/próximo |
| `colecoes.html` | Linhas da marca, com peças de cada uma |
| `sobre.html` | A casa: contadores, princípios, linha do tempo, equipe |
| `jornal.html` / `artigo.html?slug=…` | Textos sobre processo, materiais e cuidado |
| `contato.html` | Loja física, formulário (abre o WhatsApp), mapa, perguntas frequentes |
| `404.html` | Página não encontrada |

## Funções

- **Preloader** com contador (só na primeira visita da sessão) e **transição** de cortina entre páginas
- **Scroll suave** (desktop), reveals por palavra, imagens com zoom de entrada, parallax, manifesto que acende por palavra
- **Galeria horizontal** presa no scroll (desktop) / arrastável (mobile)
- **Menu** em tela cheia, **cursor** personalizado com rótulo, botões magnéticos
- **Carrinho** lateral salvo no navegador, com finalização pelo **WhatsApp** (mensagem com os itens)
- Cabeçalho que some ao rolar para baixo e volta ao rolar para cima; relógio local no rodapé
- Respeita `prefers-reduced-motion`; responsivo até 360px

## Como personalizar

Tudo que é conteúdo fica em **`assets/data.js`**:

- `LR.brand` — nome, WhatsApp (só números, com 55 + DDD), e-mail, Instagram, endereço, horário
- `LR.collections` — linhas da loja (nome, código, capa, texto)
- `LR.products` — peças: nome, código, categoria, preço, status (`disponivel`, `esgotado`, `encomenda`),
  selo, imagens, cores, tamanhos, descrição e especificações
- `LR.articles` — textos do jornal

**Fotos:** as imagens em `assets/img/` são placeholders em SVG. Coloque suas fotos na mesma pasta
(proporção 4:5 para produtos, 3:2 para cenas) e troque os caminhos em `assets/data.js` e nas páginas.

**Cores e fontes:** variáveis em `:root` no começo de `assets/styles.css`.

## Rodar localmente

```bash
python3 -m http.server 8000
# abra http://localhost:8000
```
