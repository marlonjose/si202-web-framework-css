# PRD — EstoqueFácil (Product Requirements Document)

**Projeto da disciplina:** SI202 — Desenvolvimento de Páginas Web com Framework e CSS
**Autor:** Marlon (GitHub: @marlonjose)

---

## 1. Visão do produto

O **EstoqueFácil** é um painel administrativo web responsivo para controle de estoque
de um pequeno comércio: cadastro de produtos, consulta rápida do catálogo, controle
de preços e acompanhamento do status de inventário (em estoque, estoque baixo,
esgotado). O objetivo é substituir planilhas manuais por uma interface simples,
rápida e agradável de usar no computador e no celular.

## 2. Escopo

**Dentro do escopo (v1):**

- Listagem de produtos em tabela com busca por nome/SKU/marca, filtro por categoria
  e cards de resumo (total, em estoque, estoque baixo, esgotados).
- Cadastro e edição de produtos por formulário validado (campos obrigatórios,
  Regex, máscaras de moeda e telefone).
- Exclusão de produtos com modal de confirmação.
- Importação de produtos reais de uma API pública (DummyJSON) para enriquecer o
  catálogo.
- Página de categorias: categorias do catálogo com contagem de produtos por categoria.
- Persistência em API fake (JSON Server) com fallback automático para Web Storage
  quando a API não está disponível (comportamento padrão na versão publicada no
  GitHub Pages).

**Fora do escopo (v1):** autenticação de usuários, múltiplos usuários/lojas,
baixa de estoque por venda, relatórios em PDF, backend próprio.

## 3. Público-alvo

- Pequenos comerciantes e vendedores autônomos que controlam estoque em planilha.
- Estudantes/profissionais usando o app como demonstração de técnicas de
  desenvolvimento web front-end.

## 4. User Stories

| # | Como... | Eu quero... | Para...
| --- | --- | --- | --- |
| US-01 | comerciante | cadastrar um produto com preço, estoque e fornecedor | manter o catálogo atualizado |
| US-02 | comerciante | buscar produtos por nome, marca ou SKU | encontrar itens rapidamente |
| US-03 | comerciante | filtrar produtos por categoria | revisar um grupo de itens de cada vez |
| US-04 | comerciante | ver de um golpe quantos itens estão com estoque baixo ou esgotados | priorizar compras/reposição |
| US-05 | comerciante | editar os dados de um produto | corrigir preço ou quantidade sem recadastrar |
| US-06 | comerciante | excluir produtos com confirmação | evitar exclusão acidental |
| US-07 | comerciante | importar produtos reais de uma API pública | popular/demonstrar o catálogo com dados realistas |
| US-08 | visitante | usar o painel pelo celular | consultar o estoque fora do balcão |

## 5. Regras de negócio

| ID | Regra |
| --- | --- |
| RN-01 | Todo produto possui SKU no formato `SKU-XX-0000` (2 letras + 4 números), único no catálogo. |
| RN-02 | Preço é obrigatório, em reais (BRL), com máscara `#.##0,00` e validação Regex. |
| RN-03 | Status do estoque derivado da quantidade: **Esgotado** (0), **Estoque baixo** (1–10), **Em estoque** (> 10). |
| RN-04 | Produtos podem estar **Ativos** ou **Inativos** (situação); inativos recebem selo cinza adicional na listagem. |
| RN-05 | Estoque é um inteiro entre 0 e 99.999. |
| RN-06 | E-mail do fornecedor deve ser válido (Regex); telefone no formato `(00) 00000-0000` (máscara). |
| RN-07 | A exclusão exige confirmação explícita em modal ("Esta ação não pode ser desfeita"). |
| RN-08 | Importação da API pública nunca sobrescreve o catálogo: apenas adiciona produtos. |
| RN-09 | Sem a API fake disponível, os dados continuam persistindo localmente (Web Storage) e a interface indica o modo local. |

## 6. Critérios de aceite

1. As três páginas (Produtos, Novo/Editar Produto, Categorias) carregam e são
   utilizáveis em telas de celular e desktop.
2. Formulário bloqueia envio com dados inválidos, destacando cada campo com
   mensagem específica em português.
3. Criar, editar e excluir produto refletem imediatamente na listagem e nas
   estatísticas.
4. Com o JSON Server ativo, os dados persistem entre recarregamentos; sem ele,
   a aplicação segue funcional em modo local.
5. O botão "Importar da API pública" adiciona produtos reais (com foto) ao catálogo
   e informa o resultado por toast; falhas de rede são tratadas com mensagem.
