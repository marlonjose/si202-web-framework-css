# SDD — EstoqueFácil (Software Design Document / architecture.md)

Manual técnico da arquitetura. Versões exatas das tecnologias em
[`spec.md`](spec.md); requisitos de produto em [`prd.md`](prd.md).

---

## 1. Visão geral

Front-end **estático** (HTML5 + CSS3 + JavaScript ES6+), **sem build step**,
hospedado no GitHub Pages. A lógica roda 100% no navegador:

```
┌──────────────────────────── Navegador ────────────────────────────┐
│  app/index.html · app/pages/{produto,categorias}/index.html       │
│        │  carregam localmente (assets/libraries):                 │
│        │  Bootstrap 5.3.8, jQuery 4, Mask                        │
│        ▼                                                           │
│  app/config.js → app/model/produto.js → app/util/formatter.js     │
│        → app/service/api.service.js → app/util/ui.js              │
│        → app/util/shell.js → <js da página>                        │
│        │                                                           │
│        ▼                                                           │
│  Repositório (api.service.js)   ApiPublica (api.service.js)       │
│   ├─ JSON Server (fake)         └─ DummyJSON (real, CORS ok)      │
│   └─ fallback: Web Storage                                         │
└───────────────────────────────────────────────────────────────────┘
```

**Decisão central — degradação graciosa:** o `Repositorio` tenta a API fake
(JSON Server em `http://localhost:3000`) com *timeout*; se ela não responde
(como no GitHub Pages), alterna automaticamente para `localStorage`, exibindo o
selo **"Modo local · Web Storage"**. A API pública (DummyJSON) é consumida
direto do navegador pois possui CORS liberado — funciona igual em local e em
produção.

## 2. Estrutura de arquivos (organização modular — ID 18)

Seguindo o padrão de exemplo da disciplina (páginas autocontidas em
`app/pages/<nome>/` com CSS/JS locais, camadas `model/`, `service/` e `util/`,
bibliotecas em `assets/libraries` e recursos em `assets/resources`):

```
.
├── app/                        # Aplicação (frontend)
│   ├── index.html              # Listagem: busca, filtro, estatísticas, CRUD, importação
│   ├── index.js / index.css    # Lógica e estilos da listagem (compilado de scss/home.scss)
│   ├── style.css               # CSS global compilado (commitado) a partir do SCSS
│   ├── menu.html / footer.html # Partiais compartilhadas (injetadas pelo util/shell.js)
│   ├── config.js               # Endpoints e chaves de armazenamento
│   ├── model/
│   │   └── produto.js          # Entidade Produto: Regex, status do estoque, SKU, id
│   ├── service/
│   │   └── api.service.js      # fetchTimeout, WebStorage, Repositorio, ApiPublica
│   ├── util/
│   │   ├── formatter.js        # formatarBRL, parsePrecoBR, slugify, capitalizar, escaparHTML
│   │   ├── ui.js               # Toast (jQuery), miniaturas, selo de modo local
│   │   └── shell.js            # Injeção do menu/rodapé + link ativo
│   └── pages/
│       ├── produto/            # index.html + produto.js + produto.css (formulário/edição)
│       └── categorias/         # index.html + categorias.js + categorias.css
├── assets/
│   ├── libraries/              # Bootstrap, jQuery e Mask (copiados do node_modules — ID 15)
│   └── resources/images/       # Placeholders WebP (96/192, usados com srcset)
├── scss/                       # Fonte do Design System: _tokens.scss + global + por página
├── scripts/                    # copy-libs.js (node_modules → assets/libraries) e build-dist.js
├── db/db.json                  # Seed do JSON Server (entidades: produtos, categorias)
└── docs/                       # prd.md, architecture.md (este), spec.md, design-tokens.md, telas/
```

## 3. Design Tokens (resumo)

Definidos em `scss/_tokens.scss` (fonte de verdade visual: [`design-tokens.md`](design-tokens.md)).

| Token | Valor | Uso |
| --- | --- | --- |
| `$primary` | `#4338ca` (índigo) | Ações principais, links, foco |
| `$success` | `#059669` (emerald) | Em estoque |
| `$warning` | `#d97706` (amber) | Estoque baixo |
| `$danger` | `#dc2626` (red) | Esgotado / destrutivo |
| `$text` / `$text-muted` | `#131b2e` / `#464554` | Texto principal / secundário |
| `$surface` família | `#faf8ff` … `#e2e7ff` | Fundos e cartões |
| `$font-ui` | Inter | Interface geral |
| `$font-mono` | JetBrains Mono | SKU, preços, contagens (alinhamento tabular) |
| `$radius-*` | 4/8/12px | Controles / cartões / modais |
| `@function rem($px)` | — | Conversão px→rem (unidades relativas) |
| `clamp()` | `.page-title` | Tipografia fluida |

Os tokens são injetados no Bootstrap sobrescrevendo suas **variáveis CSS**
(`--bs-primary`, `--bs-btn-bg` etc.), mantendo o framework sem compilação
própria. O mapa `$status-cores` + `@each` gera as classes `.badge-estoque-*`.

## 4. Entidades

### Produto (`db/produtos`)

| Campo | Tipo | Observações |
| --- | --- | --- |
| `id` | number \| string | Atribuído pela API fake ou `uuid`/`crypto` no modo local |
| `sku` | string | `SKU-XX-0000` (Regex validado) |
| `nome` | string | Obrigatório, 3–80 caracteres |
| `marca` | string | Opcional |
| `categoria` / `categoriaSlug` | string | Denormalizados para listagem/filtro |
| `preco` | number | BRL; formulário recebe `#.##0,00` e converte para number |
| `estoque` | number | 0–99.999; deriva o status (RN-03) |
| `situacao` | `Ativo` \| `Inativo` | Radio no formulário |
| `destaque` | boolean | Checkbox/switch |
| `emailFornecedor` | string | Regex de e-mail |
| `telefoneFornecedor` | string | Máscara `(00) 00000-0000` + Regex |
| `descricao` | string | ≤ 200 caracteres com contador |
| `imagem` | string (URL) | Vazia → placeholder WebP com `srcset` |
| `origem` | `manual` \| `dummyjson` | Rastreabilidade da importação |

### Categoria (`db/categorias`)

`{ id, slug, nome, icone }` — exibidas na página Categorias com a contagem de
produtos de cada uma (categorias presentes apenas em produtos importados
também aparecem).

## 5. Contratos de API

### API fake — JSON Server (`npm run api` → `http://localhost:3000`)

| Operação | Endpoint |
| --- | --- |
| Listar produtos | `GET /produtos` |
| Buscar produto | `GET /produtos/:id` |
| Criar produto | `POST /produtos` |
| Atualizar produto | `PUT /produtos/:id` |
| Excluir produto | `DELETE /produtos/:id` |
| Categorias | `GET /categorias` |

### API pública real — DummyJSON (`https://dummyjson.com`)

| Operação | Endpoint | Uso |
| --- | --- | --- |
| Importar produtos | `GET /products?limit&skip&select=...` | Botão "Importar da API pública" |

Falhas de rede são capturadas (`try/catch` + *timeout*) e reportadas por toast
na página (ID 24).

## 6. Fluxos de tela

- **app/index.html** — carrega → injeta menu/rodapé (`shell.js`) → `verificarApiFake()`
  (selo de modo) → lista produtos → estatísticas → busca/filtro no cliente →
  excluir (modal Bootstrap) → importar (API pública → POST em lote).
- **app/pages/produto/index.html** — popula categorias → modo edição via `?id=` →
  máscaras → validação (nativa + Regex) com `is-invalid`/`is-valid` → salva →
  toast via `sessionStorage` → redireciona.
- **app/pages/categorias/index.html** — categorias do catálogo + contagem de
  produtos → cards (Bootstrap `row-cols-*`) com link
  `../../index.html?categoria=slug`.

## 7. Ferramentas de desenvolvimento

| Ferramenta | Uso |
| --- | --- |
| `npm run sass` / `sass:watch` | Compila o SCSS: global + estilos por página → `app/` |
| `npm run api` | Sobe o JSON Server com `db/db.json` |
| `npm run copy-libs` | Copia Bootstrap/jQuery/Mask do `node_modules` para `assets/libraries/` (via `postinstall` no `npm i`) |
| `npm run lint` / `format` | ESLint 9 + Prettier (qualidade/padrão — ID 19) |
| `npm run build:dist` | Monta o `dist/` publicado (app + assets + docs + redirect) |
| `npm run deploy` | Publica no GitHub Pages via `gh-pages` |
