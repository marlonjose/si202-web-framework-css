# Especificação Técnica — Painel de Estoque (SI202)

> Documento de referência para o desenvolvimento do projeto (e para agentes de IA).
> As versões abaixo são **exatas** e devem ser respeitadas para evitar regressões.

## 1. Visão geral do projeto

Painel administrativo de controle de estoque (catálogo de produtos, preços, status de
inventário e operações de CRUD). Front-end **estático** — HTML + CSS + JavaScript puros,
**sem build step** — publicado no GitHub Pages. Design system definido em
[`design-tokens.md`](design-tokens.md).

## 2. Stack e versões exatas

| Tecnologia | Versão exata | Papel no projeto |
| --- | --- | --- |
| Node.js | v22.12.0 (LTS) | Runtime das ferramentas de desenvolvimento |
| npm | 10.9.0 | Gerenciador de pacotes |
| **Bootstrap** | **5.3.8** (`^5.3.8` no `package.json`) | **Framework CSS: grid, componentes e utilitários** |
| jQuery | 4.0.0 (`^4.0.0`) | Manipulação de DOM e requisições AJAX |
| uuid | 14.0.2 (`^14.0.2`) | Geração de identificadores únicos de produtos |
| gh-pages | 6.3.0 (`^6.3.0`, devDependency) | Publicação no GitHub Pages |

### Como carregar as bibliotecas

- `node_modules` **não é versionado** (ver `.gitignore`), portanto as páginas HTML devem
  carregar Bootstrap e as demais bibliotecas via **CDN oficial** nas versões acima:
  - CSS: `https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css`
  - JS (bundle, opcional se não usar componentes interativos):
    `https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/js/bootstrap.bundle.min.js`
- Para desenvolvimento local com as dependências instaladas (`npm install`), os mesmos
  arquivos podem ser referenciados a partir de `node_modules/`.
- **Nunca** alterar manualmente `package-lock.json`; sempre usar `npm install <pacote>`.

### Regras de tema (design tokens)

- Cor primária: índigo `#4338CA` (hover `#3730A3`); mapear para as variáveis CSS do
  Bootstrap (`--bs-primary` e derivados) na folha de estilo customizada.
- Estados de estoque: emerald `#059669` (Em Estoque), amber `#D97706` (Estoque Baixo),
  red `#DC2626` (Esgotado / destrutivo), slate `#64748B` (Inativo).
- Tipografia: **Inter** (interface) e **JetBrains Mono** (SKUs, moeda R$, datas, contagens).
- Espaçamento em base 4px (`space-xs` 4px → `space-2xl` 48px); raio de cantos 4px
  (controles) / 8px (cards e tabelas) / 12px (modais).

## 3. API Pública — DummyJSON (produtos)

- **Base URL:** `https://dummyjson.com`
- **Autenticação:** nenhuma (endpoint público, sem chave de API)
- **CORS:** liberado — pode ser consumido diretamente do navegador
- **Escrita:** simulada (as respostas de POST/PUT/PATCH/DELETE são retornadas, mas nada
  persiste no servidor — adequado para desenvolvimento do CRUD)

### Endpoints utilizados

| Endpoint | Uso no painel |
| --- | --- |
| `GET /products?limit={n}&skip={n}` | Paginação da tabela de inventário |
| `GET /products/{id}` | Detalhe/edição de um produto |
| `GET /products/search?q={termo}` | Busca por título/marca/descrição |
| `GET /products/categories` | Filtro por categoria (dropdown) |
| `GET /products/category/{slug}` | Listagem por categoria |
| `GET /products?sortBy={campo}&order=asc\|desc` | Ordenação das colunas |
| `POST /products/add` · `PUT /products/{id}` · `DELETE /products/{id}` | Operações de CRUD (simuladas) |

### Mapeamento do modelo de produto (API → tela)

| Campo da API | Uso na interface |
| --- | --- |
| `id`, `sku` | Identificação e coluna SKU (JetBrains Mono) |
| `title`, `brand`, `description` | Nome do produto, marca e detalhes |
| `category` | Tag/filtro de categoria |
| `price`, `discountPercentage` | Coluna de preço (formato BRL `R$`) |
| `stock`, `availabilityStatus` | Coluna de estoque e badge de status |
| `meta.barcode` | Código de barras (detalhe do produto) |
| `thumbnail`, `images[]` | Imagem do produto na tabela e no modal |
| `rating` | Avaliação média (estrelas) |
| `returnPolicy`, `shippingInformation`, `warrantyInformation` | Aba de informações no detalhe |

### Regras de status de estoque (badges)

| Condição (`stock`) | Badge | Classes visuais |
| --- | --- | --- |
| `> 10` e `availabilityStatus != "Low Stock"` | Em Estoque | fundo `#ECFDF5`, texto `#065F46`, dot `#059669` |
| `1–10` ou `availabilityStatus == "Low Stock"` | Estoque Baixo | fundo `#FFFBEB`, texto `#92400E`, dot `#D97706` |
| `0` ou `availabilityStatus == "Out of Stock"` | Esgotado | fundo `#FEF2F2`, texto `#991B1B`, dot `#DC2626` |

## 4. Convenções de desenvolvimento

- Localidade: **pt-BR**; moeda formatada como BRL (`Intl.NumberFormat('pt-BR', ...)`).
- Números, SKUs e datas sempre em `JetBrains Mono` (alinhamento tabular).
- Exclusão de produto exige modal de confirmação ("Esta ação não pode ser desfeita").
- Tabelas: cabeçalho fixo, linhas com 12px de padding vertical (modo compacto: 8px).
- IDs internos gerados com `uuid` quando o produto é criado localmente.
- Responsividade: grid Bootstrap; sidebar colapsa em < 992px (breakpoint `lg`).
