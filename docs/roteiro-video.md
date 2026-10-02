# Roteiro — Vídeo de Apresentação do EstoqueFácil

> Tempo estimado: **7 a 8 minutos**. As marcações `[MOSTRAR]` indicam o que deve
> estar na tela enquanto você fala. Leia com calma, pausando para as ações — o
> texto foi escrito para soar natural na fala, então adapte alguma palavra se
> achar melhor.

**Antes de gravar, deixe preparado:**
1. Terminal 1 rodando `npm run api` (JSON Server) e o site em `http://localhost:5500`
   (Live Server ou `python -m http.server 5500`) — o rodapé vai mostrar "dados: json server".
2. Uma aba com o site publicado: `https://marlonjose.github.io/si202-web-framework-css/`
3. Uma aba com o repositório no GitHub (README aberto).
4. DevTools do navegador com o modo responsivo (ícone de celular) à mão.

---

## Bloco 1 — Abertura (±40s)

[MOSTRAR: página de Produtos rodando local, com a tabela preenchida]

> Olá, professor! Meu nome é Marlon, e este é o **EstoqueFácil**, o meu projeto
> da disciplina de Desenvolvimento de Páginas Web com Framework e CSS.
>
> É um painel administrativo para controle de estoque de um pequeno comércio: o
> usuário cadastra produtos com preço, categoria e quantidade, acompanda o status
> do inventário — se está em estoque, com estoque baixo ou esgotado — e pode
> importar produtos reais de uma API pública para enriquecer o catálogo.
>
> A aplicação tem três páginas responsivas, feitas com **Bootstrap**, **Sass**,
> **JavaScript** e **jQuery**, e trabalha com duas APIs: uma *fake*, com JSON
> Server, para persistir os dados, e a API pública **DummyJSON**, que fornece
> produtos e categorias reais. Vou mostrar tudo isso agora.

---

## Bloco 2 — Tela de Produtos (±1min30)

[MOSTRAR: cards de estatísticas no topo]

> Essa é a página principal. Logo no começo eu tenho quatro cards de resumo:
> total de produtos, quantos estão em estoque, com estoque baixo e esgotados.
> Esses cards eu fiz com **CSS Grid puro**, usando `auto-fit` com `minmax` —
> ou seja, sem nenhuma classe do Bootstrap aqui — justamente pra demonstrar o
> uso de grid do próprio CSS, além do grid do framework.
>
> Eles se ajustam sozinhos: em telas menores caem para duas colunas, depois uma.

[MOSTRAR: campo de busca e o select de categoria — digite "teclado" e apague; selecione "Áudio"]

> Acima da tabela tenho a **busca**, que filtra por nome, marca ou SKU enquanto
> eu digito, e o **filtro por categoria**. Os contadores aqui embaixo atualizam
> em tempo real.

[MOSTRAR: percorrer a tabela com o mouse, parando numa linha de cada tipo]

> Na tabela, cada produto mostra a miniatura, o nome com a marca, a categoria,
> o preço formatado em reais e o **status do estoque**. O status segue uma regra
> de negócio que documentei no PRD: quantidade zero é *Esgotado*, em vermelho;
> até dez unidades é *Estoque baixo*, em âmbar; acima disso, *Em estoque*, em
> verde. Preços, SKUs e quantidades usam a fonte monoespaçada, JetBrains Mono,
> pra manter o alinhamento dos números — isso vem do meu Design System.
>
> Detalhe: esse produto aqui está **Inativo** — a situação é um campo do
> cadastro — então ele ganha um selo cinza adicional, sem esconder o status real
> do estoque.

---

## Bloco 3 — Cadastro, edição e exclusão (±2min30)

[MOSTRAR: clicar em "Novo Produto"]

> Indo para o cadastro... o formulário já vem com um **SKU gerado
> automaticamente**, no padrão que eu defini: duas letras e quatro números. Se o
> usuário quiser, pode gerar outro com esse botão de atualizar.

[MOSTRAR: campo de preço — digite "1234,5" devagar e deixe a máscara formatar]

> O preço e o telefone usam o **jQuery Mask Plugin**. Quando eu digito, a
> máscara formata na hora: moeda em formato brasileiro com separador de milhar,
> e telefone no padrão com DDD.

[MOSTRAR: preencha algo inválido — nome "ab", e-mail sem dominio — e clique em Salvar]

> Agora a parte importante: a **validação**. Se eu tentar salvar com dados
> inválidos, o formulário bloqueia o envio e destaca cada campo com a mensagem
> específica em português. Aqui eu combino dois níveis: a **validação nativa do
> HTML**, com `required`, `minlength` e `min` — como no nome curto e na
> quantidade — e **expressões regulares** para as regras próprias: o padrão do
> SKU, o formato de moeda, o e-mail e o telefone. O foco ainda salta para o
> primeiro campo com erro.
>
> Assim que eu corrijo um campo, o estado de erro sai — o feedback é imediato.

[MOSTRAR: corrija os campos e clique em Salvar; o app volta para a lista com o toast]

> Com tudo válido, o produto é enviado por **POST** para a API fake, e a
> aplicação volta para a listagem mostrando a notificação de sucesso. Repare
> que o produto novo já aparece na tabela e nas estatísticas — tudo dinâmico,
> via JavaScript.

[MOSTRAR: clicar em "Editar" num produto]

> Na **edição**, os dados vêm pré-preenchidos e o SKU fica somente leitura,
> porque ele é o identificador do produto — não faz sentido deixar mudar.

[MOSTRAR: clicar no botão de excluir de algum produto]

> Para **excluir**, eu usei o modal de confirmação do próprio Bootstrap — que é
> um componente JavaScript do framework — avisando que a ação não pode ser
> desfeita. Confirmado, o produto é removido com um DELETE na API e a lista é
> recarregada.

---

## Bloco 4 — Categorias e API pública real (±1min)

[MOSTRAR: página de Categorias]

> A terceira página mostra as **categorias**. Os primeiros cards são as
> categorias do meu catálogo local, que ficam na API fake, cada uma com o
> contador de produtos. Os demais vêm **ao vivo da DummyJSON** — por isso o selo
> "API" — uma requisição `fetch` assim que a página abre. Cada card leva para a
> listagem já filtrada pela categoria.
>
> Se a API pública estiver fora do ar, a página não quebra: aparece um alerta e
> eu só exibo as categorias locais — tratamento de erro com `try/catch`.

[MOSTRAR: voltar à listagem e clicar em "Importar da API pública"]

> Voltando à listagem... esse botão **importa produtos reais** da DummyJSON:
> título, marca, preço, estoque, SKU e até a foto, que é um WebP servido pela
> própria API. Eu mapeio o modelo deles para a minha entidade e salvo cada um
> via POST na API fake. Em poucos segundos o catálogo cresce com dados reais —
> isso demonstra a integração com API pública exigida no RA5.

---

## Bloco 5 — Tecnologias e decisões (±1min30)

[MOSTRAR: repositório no GitHub — README, depois a pasta scss/ aberta no VS Code se preferir]

> Sobre as decisões técnicas: eu escolhi o **Bootstrap na versão 5.3.8** porque
> o painel é denso em dados — tabela, modal, formulário, badges — e o framework
> traz exatamente esses componentes prontos e acessíveis, com a maior base de
> documentação e comunidade, o que facilita manutenção. A escolha está
> justificada no README com tabela comparativa de critérios.
>
> Mas eu não usei o Bootstrap "cru": o meu **Design System** — documentado no
> `docs/design-tokens.md` — foi implementado em **Sass**, num arquivo de tokens
> compartilhado: variáveis de cor, tipografia e espaçamento, uma **função** que
> converte pixel para rem, **mixins** de cartão e de foco, e um mapa de status
> com `@each` que gera as classes dos badges. Esses tokens são injetados no
> Bootstrap sobrescrevendo as variáveis CSS dele, e a tipografia dos títulos usa
> `clamp()` para ficar fluida.
>
> No JavaScript, o **jQuery** cuida da manipulação de DOM, eventos e animações
> — os toasts, por exemplo, entram com `fadeIn` e saem com `fadeOut` — e as
> requisições usam **fetch com async/await**. A qualidade de código está com
> **ESLint** e **Prettier** configurados, rodando por script no npm.

[MOSTRAR: rodapé com "dados: json server" na versão local]

> Uma decisão de arquitetura que eu destaco: a persistência. Com o JSON Server
> rodando, os dados vêm da API fake — o rodapé indica "dados: json server". Mas
> se a API cair, ou no site publicado — que é uma hospedagem estática, sem
> backend — o app faz **degradação graciosa**: passa a gravar no `localStorage`,
> mostra o selo "Modo local" e continua funcionando com o CRUD completo. Isso
> também garante que a nota não dependa de um servidor ligado na hora da
> avaliação.

---

## Bloco 6 — Site publicado e encerramento (±1min)

[MOSTRAR: site publicado no GitHub Pages, com o selo "Modo local · Web Storage" visível]

> Essa é a versão **em produção**, publicada no GitHub Pages pelo `gh-pages`,
> com as bibliotecas carregadas via CDN. Aqui o app opera em modo local, com o
> Web Storage, e a DummyJSON continua sendo consumida normalmente, direto do
> navegador, porque ela libera CORS.

[MOSTRAR: DevTools em modo responsivo, largura de celular, rolando a página]

> E a **responsividade**: em telas de celular o menu vira hambúrguer, os cards
> reorganizam e a tabela ganha rolagem própria sem quebrar o layout — sem
> scroll horizontal na página.

[MOSTRAR: README no GitHub com o checklist]

> Para fechar: no repositório estão o **README padronizado** com o checklist dos
> indicadores de desempenho, o **PRD** com as user stories e regras de negócio,
> o documento de **arquitetura** com as entidades e os contratos das APIs, a
> especificação de versões e as telas do sistema.
>
> Era isso, professor! O EstoqueFácil está no ar, o repositório está completo, e
> eu fico à disposição para a defesa. Obrigado!

---

## Cola rápida — prováveis perguntas da defesa

| Pergunta | Resposta em uma frase |
| --- | --- |
| Por que Bootstrap e não Materialize/Bulma? | Painel admin precisa de tabela, modal, formulário e badges prontos; Bootstrap tem o conjunto mais completo, a melhor documentação e customização via variáveis CSS. |
| Onde está o Sass no projeto? | `scss/_tokens.scss` (tokens compartilhados) + um SCSS por página, compilados para `app/` com `npm run sass`; tem variáveis de token, a função `rem()`, mixins e o `@each` que gera os badges de status. |
| Como funciona o fallback? | `app/service/api.service.js`: cada operação tenta o JSON Server com timeout; se falhar, o repositório grava/lê no `localStorage` e ativa o selo de modo local. |
| O que acontece se a DummyJSON cair? | `try/catch` com timeout: o botão de importar mostra toast de erro e a página de categorias exibe alerta e só as categorias locais. |
| Onde estão as Regex? | `app/model/produto.js` (objeto `REGEX`: SKU, moeda, e-mail, telefone) aplicadas no `app/pages/produto/produto.js`. |
| Por que jQuery e JavaScript puro juntos? | RA4 pede jQuery para DOM/eventos/animações (e o plugin de máscara); as requisições usam `fetch`/async-await, que é o padrão atual do RA5. |
| Duas entidades na API fake? | `produtos` e `categorias` no `db/db.json`, servidas pelo JSON Server. |
| O site publicado não tem API fake? | Hospedagem estática não roda servidor; o app detecta e opera em Web Storage — decisão documentada no architecture.md. |
