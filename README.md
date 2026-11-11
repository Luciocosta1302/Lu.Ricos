# LU.RICOS — loja de relógios

Site da loja de relógios LU.RICOS em **HTML, CSS e JavaScript puros** (sem frameworks, sem build), com estética
editorial monocromática: tipografia grotesca apertada, fios finos, etiquetas em caixa alta, códigos
monoespaçados e animações de scroll.

**Ver online:** https://storeluricos.netlify.app/ (site oficial, com o assistente de IA)
· cópia estática sem o assistente: https://luciocosta1302.github.io/Lu.Ricos/

**Deploy:** o Netlify publica a `main` automaticamente (veja [Assistente de vendas com IA](#assistente-de-vendas-com-ia)).
O GitHub Actions (`.github/workflows/pages.yml`) continua publicando uma cópia estática no GitHub Pages; lá o assistente
não funciona (não há servidor) e mostra o botão do WhatsApp.

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
npm install
npm run dev          # site + assistente em modo demonstração (sem IA, sem custo)
# abra http://localhost:8888
```

Para conversar com o Claude de verdade localmente (gera custo na API):

```bash
ANTHROPIC_API_KEY=sk-ant-... npm run dev
```

Só o site estático, sem o assistente: `python3 -m http.server 8000`.

## Assistente de vendas com IA

Um widget flutuante (canto inferior direito, em todas as páginas) conversa com o cliente, consulta o catálogo
real, recomenda relógios, compara modelos e oferece **Ver** / **Adicionar ao carrinho**. A compra continua
sendo finalizada pelo carrinho do site → **Finalizar pelo WhatsApp**.

### Arquitetura

```
navegador                                   Netlify Function (servidor)                 Anthropic
assets/chat.js ── POST /api/chat ─────────▶ netlify/functions/chat.mjs ──── SDK ───────▶ Claude
   │  (só texto da conversa)                  │ validação, limite por IP, origem
   │                                          │ netlify/lib/agent.mjs   (prompt + ferramentas)
   │                                          │ netlify/lib/catalog.mjs (lê assets/data.js)
   ◀── { reply, products[ids], handoff } ─────┘
   │
   └─ cards montados com LR.products (data.js da página) → LR.cart.add() (carrinho do site)
```

| Arquivo | Função |
| --- | --- |
| `assets/chat.js` / `assets/chat.css` | Widget: botão, janela, sugestões, cards, digitando, erros |
| `netlify/functions/chat.mjs` | Endpoint `POST /api/chat` (única parte que roda no Netlify) |
| `netlify/lib/http.mjs` | Método, origem, tamanho, validação, limite de uso, erros |
| `netlify/lib/agent.mjs` | Prompt de sistema, ferramentas, validação do histórico, rate limit |
| `netlify/lib/catalog.mjs` | Carrega `assets/data.js` e faz buscas/filtros (somente leitura) |
| `netlify/lib/providers/` | Provedor de IA (`anthropic.mjs`); trocar por OpenAI = novo arquivo com a mesma função `run()` |
| `scripts/build.mjs` | Copia só os arquivos públicos para `_site/` (pasta publicada) |
| `scripts/dev-server.mjs` | Servidor local (site + `/api/chat`) |

### Integração com o catálogo

Não existe segunda base de produtos. O servidor executa o próprio **`assets/data.js`** (o mesmo arquivo que as
páginas carregam) e guarda o resultado por 60 segundos. Mudou preço ou `status` no `data.js` e publicou? O
assistente passa a usar o valor novo.

A IA só obtém informação por **ferramentas de leitura**: `buscar_produtos` (texto, faixa de preço, pulseira, marca),
`detalhes_produto`, `comparar_produtos`, `mostrar_produtos` (cards) e `atendimento_humano` (botão do WhatsApp).
Ids inventados são descartados no servidor e de novo no navegador.

**Disponibilidade:** o catálogo não tem quantidade em estoque, só `status`. O assistente diz "disponível para
pedido" e que a confirmação é feita no WhatsApp; esgotados aparecem com **Avise-me**, sem botão de compra.

### Integração com o carrinho

O botão **Adicionar** do card chama `LR.cart.add(id, cor, tamanho)`, a mesma função dos botões da vitrine e da
página de produto. O carrinho continua calculando o subtotal a partir de `data.js` e montando a mensagem do
WhatsApp como antes. A IA não adiciona nada sozinha, não altera preço e não toca no subtotal: só o clique do
cliente adiciona.

### Segurança

- A chave da API fica só no servidor (variável de ambiente do Netlify); o navegador nunca a recebe.
- Entrada validada: só papéis `user`/`assistant`, até 600 caracteres por mensagem, 16 mensagens, 32 KB.
- Limite por IP: 8 mensagens/minuto e 120/dia (memória da função; é um freio, não uma garantia absoluta).
- Só aceita chamadas vindas do próprio site (cabeçalho `Origin`).
- Prompt com regras fixas contra descontos/cupons/prazos inventados e contra "ignore suas regras"; mensagens do
  cliente são tratadas como dados. As ferramentas não têm nenhuma ação de escrita.
- Nenhum dado pessoal é pedido nem armazenado. A conversa fica só no `sessionStorage` do navegador (some ao fechar
  a aba); o servidor não grava conversas.
- Se a IA cair, expirar ou recusar, o widget mostra uma mensagem e o botão do WhatsApp; o site segue normal.

### Configuração (variáveis de ambiente)

No Netlify: **Site configuration → Environment variables**.

| Variável | Obrigatória | Padrão | Descrição |
| --- | --- | --- | --- |
| `ANTHROPIC_API_KEY` | sim | — | Chave criada em console.anthropic.com. **Nunca** coloque no código |
| `AI_MODEL` | não | `claude-opus-5-5` | Modelo do Claude |
| `AI_EFFORT` | não | `low` | Profundidade de raciocínio (`low`, `medium`, `high`); mais alto = mais lento e caro |
| `AI_PROVIDER` | não | `anthropic` | Reservado para trocar de provedor no futuro |
| `ALLOWED_ORIGINS` | não | — | Outras origens permitidas, separadas por vírgula (ex.: domínio próprio) |

Sem `ANTHROPIC_API_KEY` o site funciona normalmente e o assistente responde "em manutenção" com o WhatsApp.

### Testes

```bash
npm test             # 18 testes automáticos, sem IA e sem custo
npm run test:live    # 8 cenários com o Claude de verdade (precisa de ANTHROPIC_API_KEY; gera custo)
```

`npm test` cobre: produto existente e inexistente, preço, orçamento, comparação, esgotado, ids inventados,
desconto inventado (o card sempre mostra o preço do catálogo), mudança de preço/status, IA fora do ar, falta de
chave, validação, origem e limite de uso. Roteiro manual no navegador (`npm run dev`):

1. Abrir o assistente → sugestões aparecem.
2. "Quais modelos vocês têm até R$ 250?" → cards só até R$ 250.
3. **Adicionar** num card → chat fecha, carrinho abre com o item e o subtotal certo.
4. **Finalizar pelo WhatsApp** → mensagem com o item e o subtotal.
5. Perguntar pelo "Clássico" → card "Esgotado" com **Avise-me**, sem **Adicionar**.
6. "Quero falar com um atendente" → botão do WhatsApp.
7. Vitrine, página de produto, menu e carrinho continuam funcionando como antes.

### Publicar a atualização

1. No Netlify, cadastre `ANTHROPIC_API_KEY` (Environment variables) **antes** do deploy.
2. Faça merge do branch `feature/assistente-ia` na `main` (ou abra um Pull Request no GitHub: o Netlify gera um
   *Deploy Preview* com link próprio para testar antes).
3. O Netlify roda `npm run build`, publica `_site/` e cria a função `/api/chat` (configuração em `netlify.toml`).

Custos: cada mensagem do cliente gera de 1 a 3 chamadas à API da Anthropic. Acompanhe o gasto no painel da
Anthropic e defina um limite mensal lá.
