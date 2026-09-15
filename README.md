# EstoqueFácil

> Painel administrativo web responsivo para controle de estoque: catálogo de
> produtos com preços, categorias, status de inventário e operações de CRUD.

## Identificação / Autor

**Marlon** — GitHub: [@marlonjose](https://github.com/marlonjose) — projeto
individual da disciplina **SI202 — Desenvolvimento de Páginas Web com Framework e CSS**.

## Descrição do projeto

O EstoqueFácil é um sistema de gestão de estoque de uso simples, voltado a
pequenos comerciantes. O escopo completo (user stories e regras de negócio) está
em [`docs/prd.md`](docs/prd.md) e a arquitetura técnica em
[`docs/architecture.md`](docs/architecture.md).

O app consome **duas fontes de dados**:

- **API fake (JSON Server)** — persiste os produtos cadastrados pelo formulário
  (entidades `produtos` e `categorias`), executando localmente via `npm run api`;
  quando indisponível, a aplicação degrada automaticamente para **Web Storage**
  (localStorage), que é o modo padrão da versão publicada.
- **API pública real (DummyJSON)** — produtos e categorias reais (com fotos,
  SKU, preço e estoque) exibidos na página Categorias e importáveis ao catálogo
  com um clique.

## Prototipação no Figma

- Protótipo navegável gerado por IA (Stitch): [`code.html`](code.html) +
  [`screen.png`](screen.png)
- Link do Figma: _(em atualização)_

## Design System

Documentado em [`DESIGN.md`](DESIGN.md) e implementado como tokens SCSS em
[`scss/style.scss`](scss/style.scss) (cores, tipografia Inter + JetBrains Mono,
espaçamento em base 4px, raios e elevações), aplicados sobre o Bootstrap via
variáveis CSS.

## Framework CSS

**Bootstrap 5.3.8** (via CDN) — grid responsivo, navbar com colapso, tabela,
formulários, cards, modal de confirmação e badges. Complementado por **Sass**
para o Design System customizado.

## Dependências

| Pacote | Versão | Tipo | Função |
| --- | --- | --- | --- |
| `bootstrap` | 5.3.8 | produção | Framework CSS (grid, componentes) |
| `jquery` | 4.0.0 | produção | Manipulação de DOM, eventos, animações |
| `jquery-mask-plugin` | 1.14.16 | produção | Máscaras de moeda e telefone |
| `uuid` | 14.0.2 | produção | Identificadores únicos (modo local) |
| `gh-pages` | 6.3.0 | dev | Deploy no GitHub Pages |
| `sass` | 1.104.1 | dev | Compilação do SCSS |
| `json-server` | 0.17.4 | dev | API fake local |
| `eslint` / `prettier` | 9.x / 3.x | dev | Qualidade e padronização de código |

> Nas páginas HTML as bibliotecas são carregadas via **CDN** (versões idênticas
> às do `package.json`) para funcionar no GitHub Pages sem build.

## Site em produção

**https://marlonjose.github.io/si202-web-framework-css/**

> Nesta versão publicada a API fake não roda (hospedagem estática): o app opera
> em **Modo local (Web Storage)** — CRUD completo persistindo no navegador — e a
> integração com a API pública real funciona normalmente.

## Checklist de Funcionalidades (IDs dos Resultados de Aprendizagem)

### RA1 — Frameworks CSS e layouts responsivos

- [x] **ID 01** — Protótipo adaptável mobile/desktop (Stitch: `code.html` / `screen.png`)
- [x] **ID 02** — Layout responsivo com grid do Bootstrap (navbar, `row-cols-*`, `table-responsive`)
- [x] **ID 03** — Layout com CSS puro: cards de estatísticas em **CSS Grid** (`auto-fit` + `minmax`)
- [x] **ID 04** — Componentes do Bootstrap: navbar, cards, tabela, formulários e **modal** (JS do framework)
- [x] **ID 05** — Unidades relativas (`rem`, `em`, `%`, `vw`) via função SCSS `rem()` e `min-vh-100`
- [x] **ID 06** — Design System consistente (tokens SCSS aplicados ao Bootstrap em todas as páginas)
- [x] **ID 07** — **Sass**: variáveis de token, `@function rem()`, `@mixin card-surface/focus-ring`, mapa `$status-cores` + `@each`
- [x] **ID 08** — Tipografia fluida com `clamp()` (`.page-title`)
- [x] **ID 09** — Imagens responsivas com `object-fit: cover` (miniaturas da tabela)
- [x] **ID 10** — Formato moderno **WebP** + `srcset` 1x/2x (`img/placeholder-*.webp`)

### RA2 — Formulários e validações no cliente

- [x] **ID 11** — Validação HTML nativa (`required`, `minlength`, `pattern`, `min/max`) com mensagens em português
- [x] **ID 12** — Regex customizadas: SKU, preço (moeda BR), e-mail e telefone
- [x] **ID 13** — `select` (categoria), `radio` (situação), `checkbox`/switch (destaque)
- [x] **ID 14** — **Web Storage**: `localStorage` (fallback de persistência) e `sessionStorage` (toast pós-salvamento)

### RA3 — Ferramentas de otimização do desenvolvimento

- [x] **ID 15** — Ambiente Node.js + NPM com dependências de produção e desenvolvimento
- [x] **ID 16** — Boas práticas Git/GitHub: branch `main`, `.gitignore` (node_modules/.env), commits semânticos
- [x] **ID 17** — README padronizado com checklist preenchido
- [x] **ID 18** — Organização modular: `js/`, `scss/`+`css/`, `img/`, `db/`, `docs/`
- [x] **ID 19** — **ESLint 9** + **Prettier** configurados (`npm run lint` / `npm run format`)

### RA4 — Bibliotecas JavaScript

- [x] **ID 20** — jQuery: eventos, renderização da tabela, animações (`fadeIn`/`fadeOut` do toast)
- [x] **ID 21** — Plugin **jQuery Mask Plugin** (moeda `#.##0,00` reversa e telefone `(00) 00000-0000`)

### RA5 — Requisições assíncronas e APIs

- [x] **ID 22** — `fetch`/`async-await` **persistindo** dados do formulário na API fake (`POST/PUT /produtos`)
- [x] **ID 23** — `fetch`/`async-await` **exibindo** dados da API fake na tabela (`GET /produtos`)
- [x] **ID 24** — API pública real (**DummyJSON**) com exibição de dados e **tratamento de erros** (timeout, toast/alerta)

## Instruções de Execução

```bash
# 1. Instalar as dependências (uma vez)
npm install

# 2. Subir a API fake (JSON Server na porta 3000)
npm run api

# 3. Servir as páginas (em outro terminal, escolha uma opção)
npx http-server -p 5500 .        # opção A
python -m http.server 5500        # opção B
# ou simplesmente abra index.html com a extensão Live Server do VS Code

# 4. Acessar
# http://localhost:5500
```

Scripts auxiliares: `npm run sass` (compila CSS), `npm run sass:watch`,
`npm run lint`, `npm run format`, `npm run deploy` (GitHub Pages).

> Sem a API fake o app continua funcional: o selo **"Modo local · Web Storage"**
> aparece no topo e os dados persistem no navegador.

## Telas da Aplicação

### Produtos (listagem, estatísticas, busca e importação da API pública)

![Tela de produtos com importação da API DummyJSON](docs/telas/produtos.png)

### Formulário com validação (Regex + máscaras + estados de erro do Bootstrap)

![Formulário de produto com validações](docs/telas/produto-validacao.png)

### Categorias (locais + reais da API pública)

![Página de categorias](docs/telas/categorias.png)

---

## Registros das atividades da disciplina

### Atividade 05 — Escolha do Framework CSS e API Pública

| Item | Escolha | Versão exata |
| --- | --- | --- |
| Framework CSS | **Bootstrap** | **5.3.8** |
| API Pública | **DummyJSON** (endpoint `/products`) | API em produção |

**Justificativa comercial/visual (resumo):** o painel é denso em dados (tabelas,
modais de CRUD, formulários, badges) e o Bootstrap entrega exatamente esses
componentes prontos e acessíveis, com grid responsivo compatível com a anatomia
desktop-first do `DESIGN.md` e customização por variáveis CSS alinhada ao
design system (índigo `#4338CA`). A DummyJSON espelha o modelo de dados do
inventário (título, marca, categoria, preço, **estoque**, **SKU**, imagens),
é gratuita, sem chave de API, com CORS liberado e simula operações de escrita —
tabela comparativa completa de critérios no histórico de commits.

### Checklist da Atividade 06 — Fundamentos de Ecossistema (Node, NPM e Git)

- [x] Configurei minha identidade no Git (`user.name` e `user.email`)
- [x] Criei o repositório do meu projeto no GitHub
- [x] Inicializei o NPM no projeto (`npm init` → `package.json`)
- [x] Criei o `.gitignore` ignorando `node_modules` e `.env`
- [x] Instalei `jquery` e `uuid` como dependências de produção
- [x] Instalei `gh-pages` como dependência de desenvolvimento
- [x] Fiz commit e push para a branch `main`
