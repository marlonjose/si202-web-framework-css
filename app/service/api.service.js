// =====================================================================
// EstoqueFácil — camada de dados (service)
//   - Repositorio: API fake (JSON Server) com fallback para Web Storage
//   - ApiPublica:  dados reais da DummyJSON (ID 22 a 24)
// =====================================================================

// fetch com timeout via AbortController
async function fetchTimeout(url, opcoes = {}, ms = 3000) {
  const controle = new AbortController();
  const timer = setTimeout(() => controle.abort(), ms);
  try {
    return await fetch(url, { ...opcoes, signal: controle.signal });
  } finally {
    clearTimeout(timer);
  }
}

// ------------------------------ Web Storage (ID 14) ------------------------------
const WebStorage = {
  ler(chave, padrao) {
    try {
      const bruto = localStorage.getItem(chave);
      return bruto ? JSON.parse(bruto) : padrao;
    } catch (e) {
      console.warn('Falha ao ler Web Storage:', e);
      return padrao;
    }
  },
  gravar(chave, valor) {
    localStorage.setItem(chave, JSON.stringify(valor));
  },
};

// ------------------------------ Repositório (API fake + fallback) ------------------------------
const Repositorio = (function () {
  let modoLocal = false; // true = usando Web Storage (API fake offline)

  async function verificarApiFake() {
    try {
      const resposta = await fetchTimeout(`${APP.apiFake}/produtos?_limit=1`, {}, 2000);
      modoLocal = !resposta.ok;
    } catch (e) {
      modoLocal = true;
    }
    return modoLocal;
  }

  // --- Produtos ---
  async function listarProdutos() {
    if (!modoLocal) {
      try {
        const resposta = await fetchTimeout(`${APP.apiFake}/produtos`);
        if (resposta.ok) return await resposta.json();
        modoLocal = true;
      } catch (e) {
        modoLocal = true; // API caiu no meio da sessão: muda para Web Storage
      }
    }
    return WebStorage.ler(APP.storageProdutos, []);
  }

  async function buscarProduto(id) {
    const produtos = await listarProdutos();
    return produtos.find(function (p) {
      return String(p.id) === String(id);
    });
  }

  async function salvarProduto(produto) {
    // Edição (tem id) ou criação
    if (!modoLocal) {
      try {
        const editando = produto.id && produto.idOrigem !== 'novo';
        const url = editando ? `${APP.apiFake}/produtos/${produto.id}` : `${APP.apiFake}/produtos`;
        const metodo = editando ? 'PUT' : 'POST';
        const resposta = await fetchTimeout(url, {
          method: metodo,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(produto),
        });
        if (resposta.ok) return await resposta.json();
        throw new Error('API fake recusou a operação');
      } catch (e) {
        modoLocal = true; // cai para o Web Storage
      }
    }
    // Persistência local (localStorage)
    const produtos = WebStorage.ler(APP.storageProdutos, []);
    if (produto.id) {
      const indice = produtos.findIndex(function (p) {
        return String(p.id) === String(produto.id);
      });
      if (indice >= 0) produtos[indice] = produto;
      else produtos.push(produto);
    } else {
      produto.id = gerarId();
      produtos.push(produto);
    }
    WebStorage.gravar(APP.storageProdutos, produtos);
    return produto;
  }

  async function excluirProduto(id) {
    if (!modoLocal) {
      try {
        const resposta = await fetchTimeout(`${APP.apiFake}/produtos/${id}`, { method: 'DELETE' });
        if (resposta.ok) return true;
      } catch (e) {
        modoLocal = true;
      }
    }
    const produtos = WebStorage.ler(APP.storageProdutos, []).filter(function (p) {
      return String(p.id) !== String(id);
    });
    WebStorage.gravar(APP.storageProdutos, produtos);
    return true;
  }

  // --- Categorias ---
  async function listarCategorias() {
    if (!modoLocal) {
      try {
        const resposta = await fetchTimeout(`${APP.apiFake}/categorias`);
        if (resposta.ok) return await resposta.json();
      } catch (e) {
        /* usa o padrão */
      }
    }
    return CATEGORIAS_PADRAO;
  }

  return {
    verificarApiFake: verificarApiFake,
    listarProdutos: listarProdutos,
    buscarProduto: buscarProduto,
    salvarProduto: salvarProduto,
    excluirProduto: excluirProduto,
    listarCategorias: listarCategorias,
    get modoLocal() {
      return modoLocal;
    },
  };
})();

// ------------------------------ API pública real (DummyJSON) ------------------------------
const ApiPublica = {
  // Busca produtos reais para importação no catálogo
  async produtos(limit, skip) {
    const resposta = await fetchTimeout(
      `${APP.apiPublica}/products?limit=${limit}&skip=${skip}&select=title,brand,category,price,stock,sku,thumbnail`,
      {},
      6000
    );
    if (!resposta.ok) throw new Error('DummyJSON respondeu ' + resposta.status);
    const dados = await resposta.json();
    // Mapeia o modelo da API para a entidade local (docs/architecture.md)
    return dados.products.map(function (item) {
      return {
        sku: item.sku || gerarSKU(),
        nome: item.title,
        marca: item.brand || '',
        categoria: item.category ? capitalizar(item.category) : 'Sem categoria',
        categoriaSlug: slugify(item.category || 'sem-categoria'),
        preco: Number(item.price) || 0,
        estoque: Number(item.stock) || 0,
        situacao: 'Ativo',
        destaque: false,
        emailFornecedor: 'importado@dummyjson.com',
        telefoneFornecedor: '(00) 00000-0000',
        descricao: 'Produto importado da API pública DummyJSON.',
        imagem: item.thumbnail || '',
        origem: 'dummyjson',
      };
    });
  },

  // Lista de categorias reais da DummyJSON
  async categorias() {
    const resposta = await fetchTimeout(`${APP.apiPublica}/products/category-list`, {}, 6000);
    if (!resposta.ok) throw new Error('DummyJSON respondeu ' + resposta.status);
    return await resposta.json(); // array de slugs
  },
};
