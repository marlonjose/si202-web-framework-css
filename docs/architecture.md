# SDD — EstoqueFácil (Software Design Document / architecture.md)

Manual técnico da arquitetura. Versões exatas das tecnologias em
[`spec.md`](spec.md); requisitos de produto em [`prd.md`](prd.md).

---

## 1. Visão geral

Front-end **estático** (HTML5 + CSS3 + JavaScript ES6+), **sem build step**,
hospedado no GitHub Pages. A lógica roda 100% no navegador:

```
┌──────────────────────────── Navegador ────────────────────────────┐
│  index.html / produto.html / categorias.html                      │
│        │  carregam via CDN: Bootstrap 5.3.8, jQuery 4, Mask       │
│        ▼                                                           │
│  js/config.js → js/api.js → js/ui.js → js/<página>.js             │
│        │                            │                              │
│        ▼                            ▼                              │
│  Repositório (js/api.js)      ApiPublica (js/api.js)              │
│   ├─ JSON Server (fake)        └─ DummyJSON (real, CORS ok)       │
│   └─ fallback: Web Storage                                        │
└───────────────────────────────────────────────────────────────────┘
```

**Decisão central — degradação graciosa:** o `Repositorio` tenta a API fake
(JSON Server em `http://localhost:3000`) com *timeout*; se ela não responde
(como no GitHub Pages), alterna automaticamente para `localStorage`, exibindo o
selo **"Modo local · Web Storage"**. A API pública (DummyJSON) é consumida
direto do navegador pois possui CORS liberado — funciona igual em local e em
produção.

## 2. Estrutura de arquivos (organização modular — ID 18)

```
.
├── index.html          # Listagem: busca, filtro, estatísticas, CRUD, importação
├── produto.html        # Formulário de cadastro/edição (?id= para editar)
├── categorias.html     # Cards: categorias locais + categorias da API pública
├── css/style.css       # CSS compilado (commitado) a partir do SCSS
├── scss/style.scss     # Fonte do Design System (variáveis, mixins, função)
├── js/
│   ├── config.js       # Constantes, Regex, utilitários puros
│   ├── api.js          # fetchTimeout, WebStorage, Repositorio, ApiPublica
│   ├── ui.js           # Toast (jQuery), miniaturas, selo de modo local
│   ├── produtos.js     # Lógica da listagem (index)
│   ├── produto-form.js # Lógica do formulário + validações
│   └── categorias.js   # Lógica da página de categorias
├── img/                # Placeholders WebP (96/192, usados com srcset)
├── db/db.json          # Seed do JSON Server (entidades: produtos, categorias)
└── docs/               # prd.md, architecture.md (este), spec.md, telas/
```

## 3. Design Tokens (resumo)

Definidos em `scss/style.scss` (fonte de verdade visual: [`DESIGN.md`](../DESIGN.md)).

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

`{ id, slug, nome, icone }` — as categorias da API pública são mescladas pelo
`slug` na página Categorias (selo "API").

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
| Categorias reais | `GET /products/category-list` | Página Categorias |

Falhas de rede são capturadas (`try/catch` + *timeout*) e reportadas por toast
ou alerta na página (ID 24).

## 6. Fluxos de tela

- **index.html** — carrega → `verificarApiFake()` (selo de modo) → lista produtos
  → estatísticas → busca/filtro no cliente → excluir (modal Bootstrap) →
  importar (API pública → POST em lote).
- **produto.html** — popula categorias → modo edição via `?id=` → máscaras →
  validação (nativa + Regex) com `is-invalid`/`is-valid` → salva → toast via
  `sessionStorage` → redireciona.
- **categorias.html** — categorias locais + contagem de produtos → mescla
  categorias da API pública → cards (Bootstrap `row-cols-*`) com link
  `index.html?categoria=slug`.

## 7. Ferramentas de desenvolvimento

| Ferramenta | Uso |
| --- | --- |
| `npm run sass` / `sass:watch` | Compila `scss/style.scss` → `css/style.css` |
| `npm run api` | Sobe o JSON Server com `db/db.json` |
| `npm run lint` / `format` | ESLint 9 + Prettier (qualidade/padrão — ID 19) |
| `npm run deploy` | Publica no GitHub Pages via `gh-pages` |
