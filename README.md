# SI202 — Desenvolvimento de Páginas Web com Framework e CSS

Projeto da disciplina: painel administrativo de controle de estoque de produtos (catálogo, preços, status de inventário e operações de CRUD), desenvolvido com HTML, CSS e JavaScript.

**Repositório:** https://github.com/marlonjose/si202-web-framework-css

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
├── package.json     # Dependências e scripts do NPM
└── .gitignore       # Arquivos ignorados pelo Git
```

## Dependências

| Pacote | Tipo | Função |
| --- | --- | --- |
| `jquery` | produção | Manipulação de DOM e requisições AJAX |
| `uuid` | produção | Geração de identificadores únicos |
| `gh-pages` | desenvolvimento | Publicação do site no GitHub Pages |

Para instalar as dependências localmente (a pasta `node_modules` é gerada aqui e **não** é versionada):

```bash
npm install
```
