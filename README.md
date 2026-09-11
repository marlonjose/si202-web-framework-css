# SI202 — Desenvolvimento de Páginas Web com Framework e CSS

Projeto da disciplina: painel administrativo de controle de estoque de produtos (catálogo, preços, status de inventário e operações de CRUD), desenvolvido com HTML, CSS e JavaScript.

**Repositório:** https://github.com/marlonjose/si202-web-framework-css

**Integrante:** Marlon (@marlonjose) — trabalho individual

## Atividade 05 — Escolha do Framework CSS e API Pública

### Decisões

| Item | Escolha | Versão exata |
| --- | --- | --- |
| Framework CSS | **Bootstrap** | **5.3.8** |
| API Pública | **DummyJSON** (endpoint `/products`) | API em produção, sem versionamento |

### Justificativa comercial/visual — Bootstrap 5.3.8

O produto é um painel administrativo de estoque denso em dados: tabelas com ordenação e seleção em lote, modais de CRUD, formulários com prefixo monetário e badges de status. O Bootstrap 5.3 entrega exatamente esses componentes prontos e acessíveis (tables, modals, forms com validação, badges, dropdowns), reduzindo o tempo de desenvolvimento das telas principais e o risco de inconsistência visual entre módulos.

O grid responsivo de 12 colunas com breakpoints móveis accompanha a anatomia desktop-first definida no `DESIGN.md` (sidebar fixa de 240px + conteúdo fluido) e leva o painel a tablets e celulares sem CSS adicional. A customização via variáveis CSS permite alinhar o tema ao design system do projeto — índigo `#4338CA` como cor primária, estados emerald/amber/red — sem conflitar com o framework. Por fim, é o framework de maior adoção do mercado, com documentação extensa e estável, o que significa curva de aprendizado baixa, contratação fácil e manutenção barata no longo prazo.

### Justificativa comercial — DummyJSON `/products`

A API enriquece o catálogo com **dados reais de produtos que espelham o modelo do painel**: título, marca, categoria, preço, desconto, **estoque**, **SKU**, código de barras, imagens e avaliações. Isso permite popular a tabela de inventário, os filtros por categoria e os cards de produto com conteúdo realista desde o primeiro dia, em vez de dados fictícios escritos à mão.

Ela também simula operações de escrita (`POST/PUT/PATCH/DELETE`), permitindo implementar "Novo Produto", "Editar" e "Excluir" contra uma API verdadeira durante o desenvolvimento. É gratuita, **não exige chave de API** e tem **CORS liberado** — funciona direto do navegador, o que combina com um front-end estático hospedado no GitHub Pages. Os recursos nativos de busca (`/products/search?q=`), paginação (`limit`/`skip`) e ordenação (`sortBy`/`order`) mapeiam diretamente para os requisitos de filtragem e ordenação da tabela do painel.

### Critérios de avaliação considerados

| Critério | Bootstrap 5.3.8 | Materialize 2.x | Bulma 1.x |
| --- | --- | --- | --- |
| Responsividade | Grid 12 colunas + 6 breakpoints | Grid 12 colunas | Grid flexbox |
| Documentação | Extensa, com exemplos executáveis | Boa | Boa |
| Componentes para admin (tabelas, modais, forms) | Completos e acessíveis | Parciais | Parciais |
| Curva de aprendizado | Baixa (padrão de mercado) | Baixa | Baixa |
| Manutenção / comunidade | Ativo, ampla adoção | Ativo | Ativo |
| Integração (CDN + npm) | Sim | Sim | Sim |
| Customização de tema | Variáveis CSS nativas | Sass | Sass |

> A versão exata de cada tecnologia e o contrato da API estão registrados em [`docs/spec.md`](docs/spec.md).

## Checklist da Atividade 06 — Fundamentos de Ecossistema (Node, NPM e Git)

- [x] Configurei minha identidade no Git (`user.name` e `user.email`)
- [x] Criei o repositório do meu projeto no GitHub
- [x] Inicializei o NPM no projeto (`npm init` → `package.json`)
- [x] Criei o `.gitignore` ignorando `node_modules` e `.env`
- [x] Instalei `jquery` e `uuid` como dependências de produção
- [x] Instalei `gh-pages` como dependência de desenvolvimento
- [x] Fiz commit e push para a branch `main`

## Estrutura do projeto

```
.
├── DESIGN.md        # Sistema de design (cores, tipografia, componentes)
├── code.html        # Protótipo da página de administração de estoque
├── screen.png       # Pré-visualização do design
├── docs/spec.md     # Especificação técnica: versões exatas e contrato da API
├── package.json     # Dependências e scripts do NPM
└── .gitignore       # Arquivos ignorados pelo Git
```

## Dependências

| Pacote | Tipo | Função |
| --- | --- | --- |
| `bootstrap` | produção | Framework CSS (grid, componentes e tema customizado) |
| `jquery` | produção | Manipulação de DOM e requisições AJAX |
| `uuid` | produção | Geração de identificadores únicos |
| `gh-pages` | desenvolvimento | Publicação do site no GitHub Pages |

Para instalar as dependências localmente (a pasta `node_modules` é gerada aqui e **não** é versionada):

```bash
npm install
```
