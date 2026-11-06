# LU.RICOS — loja de relógios

Site da loja de relógios LU.RICOS em **HTML, CSS e JavaScript puros** (sem frameworks, sem build), com estética
editorial monocromática: tipografia grotesca apertada, fios finos, etiquetas em caixa alta, códigos
monoespaçados e animações de scroll.

**Ver online:** https://luciocosta1302.github.io/Lu.Ricos/

**Deploy:** a cada push na `main`, o GitHub Actions (`.github/workflows/pages.yml`) publica o site na branch `gh-pages`, que o GitHub Pages serve.

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

## Catálogo atual

| Código | Modelo | Pulseira | Preço |
| --- | --- | --- | --- |
| LR-01 | Technos Riviera | Aço bicolor | R$ 799,99 |
| LR-02 | Pablo Raez Colmeia | Aço | R$ 159,99 |
| LR-03 | Pablo Raez Clássico | Aço | R$ 159,99 |
| LR-04 | Pablo Raez Rosa dos Ventos | Couro | R$ 129,99 |
| LR-05 | Pablo Raez Romano | Couro | R$ 129,99 |

## Como personalizar

Tudo que é conteúdo fica em **`assets/data.js`**:

- `LR.brand`: nome, WhatsApp (só números, com 55 + DDD), e-mail, Instagram, cidade, horário
- `LR.products`: relógios, com nome, preço, fotos, descrição e especificações. Para marcar um modelo como vendido, troque `status` para `'esgotado'`
- `LR.hero`: fotos que passam no topo da home, cada uma ligada a um relógio
- `LR.collections` e `LR.articles`: coleções e textos do jornal

**Fotos:** ficam em `assets/img/relogios/`, em JPEG com até 1000 px de largura. Para um modelo novo, coloque as fotos
nessa pasta e acrescente um item em `LR.products`.

**Cores e fontes:** variáveis em `:root` no começo de `assets/styles.css`.

## Rodar localmente

```bash
python3 -m http.server 8000
# abra http://localhost:8000
```
