// =====================================================================
// EstoqueFácil — página Produtos (index.html)
// Listagem, filtros, estatísticas, exclusão e importação da API pública
// =====================================================================
$(async function () {
  // Inicializa a camada de dados e o selo de modo offline
  await Repositorio.verificarApiFake();
  UI.atualizarBadgeModo(Repositorio.modoLocal);

  let produtos = [];
  let produtoParaExcluir = null;
  let modalExcluir = null;

  // ----- carregamento inicial -----
  async function carregarTudo() {
    produtos = await Repositorio.listarProdutos();
    montarFiltroCategorias();
    renderizar();
  }

  function montarFiltroCategorias() {
    const $filtro = $('#filtroCategoria');
    const selecionado = $filtro.val() || '';
    const categorias = {};
    $.each(produtos, function (i, p) {
      const slug = p.categoriaSlug || slugify(p.categoria);
      if (slug && !categorias[slug]) categorias[slug] = p.categoria;
    });
    $filtro.find('option:not(:first)').remove();
    $.each(categorias, function (slug, nome) {
      $filtro.append($('<option>', { value: slug, text: nome }));
    });
    if (selecionado) $filtro.val(selecionado);
  }

  // ----- estatísticas (cards em CSS Grid puro) -----
  function renderizarEstatisticas() {
    const contagem = { ok: 0, baixo: 0, esgotado: 0 };
    $.each(produtos, function (i, p) {
      contagem[statusEstoque(p.estoque)]++;
    });
    $('#statTotal').text(produtos.length);
    $('#statOk').text(contagem.ok);
    $('#statBaixo').text(contagem.baixo);
    $('#statEsgotado').text(contagem.esgotado);
  }

  // ----- tabela de produtos -----
  function produtosFiltrados() {
    const termo = $('#campoBusca').val().trim().toLowerCase();
    const categoria = $('#filtroCategoria').val();

    return produtos.filter(function (p) {
      const slug = p.categoriaSlug || slugify(p.categoria);
      const casaBusca =
        !termo ||
        p.nome.toLowerCase().indexOf(termo) >= 0 ||
        (p.sku || '').toLowerCase().indexOf(termo) >= 0 ||
        (p.marca || '').toLowerCase().indexOf(termo) >= 0;
      const casaCategoria = !categoria || slug === categoria;
      return casaBusca && casaCategoria;
    });
  }

  function renderizar() {
    renderizarEstatisticas();
    const lista = produtosFiltrados();
    const $corpo = $('#corpoTabela').empty();

    if (lista.length === 0) {
      $corpo.append(
        '<tr><td colspan="6" class="estado-vazio">' +
          '<span class="material-symbols-outlined" style="font-size:34px;color:#c7c4d7">inventory_2</span>' +
          '<p class="mb-0 mt-2">Nenhum produto encontrado.</p></td></tr>'
      );
    }

    $.each(lista, function (i, p) {
      // O badge de estoque reflete sempre a quantidade (consistente com as
      // estatisticas); produtos inativos ganham um selo cinza adicional.
      const status = statusEstoque(p.estoque);
      const seloInativo =
        p.situacao === 'Inativo'
          ? '<span class="badge-estoque-inativo me-1">' + ROTULO_STATUS.inativo + '</span>'
          : '';
      const linha =
        '<tr data-id="' +
        escaparHTML(p.id) +
        '">' +
        '  <td class="mono small text-muted-app">' +
        escaparHTML(p.sku) +
        '</td>' +
        '  <td><div class="d-flex align-items-center gap-2">' +
        '    <div class="thumb">' +
        UI.miniatura(p) +
        '</div>' +
        '    <div><div class="fw-medium">' +
        escaparHTML(p.nome) +
        '</div>' +
        (p.marca ? '<div class="small text-muted-app">' + escaparHTML(p.marca) + '</div>' : '') +
        '    </div></div></td>' +
        '  <td><span class="badge-categoria">' +
        escaparHTML(p.categoria) +
        '</span></td>' +
        '  <td class="mono fw-medium">' +
        formatarBRL(p.preco) +
        '</td>' +
        '  <td><span class="badge-estoque-' +
        status +
        '">' +
        ROTULO_STATUS[status] +
        ' · ' +
        (p.estoque || 0) +
        ' un.</span>' +
        seloInativo +
        '</td>' +
        '  <td class="text-end text-nowrap">' +
        '    <a class="btn btn-sm btn-outline-primary py-1" href="produto.html?id=' +
        encodeURIComponent(p.id) +
        '" title="Editar produto">' +
        '      <span class="material-symbols-outlined" style="font-size:16px">edit</span> Editar</a> ' +
        '    <button type="button" class="btn btn-sm btn-outline-danger py-1 btn-excluir" title="Excluir produto">' +
        '      <span class="material-symbols-outlined" style="font-size:16px">delete</span></button>' +
        '  </td>' +
        '</tr>';
      $corpo.append(linha);
    });

    // Contadores
    $('#contagemVisivel').text(lista.length);
    $('#contagemTotal').text(produtos.length);
    $('#textoContador').text(
      lista.length + (lista.length === 1 ? ' produto exibido' : ' produtos exibidos')
    );
    $('#origemDados').text(Repositorio.modoLocal ? 'dados: web storage' : 'dados: json server');
  }

  // ----- eventos -----
  $('#campoBusca').on('input', renderizar);
  $('#filtroCategoria').on('change', renderizar);

  // Excluir: abre modal de confirmação do Bootstrap (ID 04)
  $('#corpoTabela').on('click', '.btn-excluir', function () {
    const id = $(this).closest('tr').data('id');
    produtoParaExcluir = produtos.find(function (p) {
      return String(p.id) === String(id);
    });
    if (!produtoParaExcluir) return;
    $('#nomeExcluir').text(produtoParaExcluir.nome);
    $('#skuExcluir').text(produtoParaExcluir.sku || '');
    modalExcluir = bootstrap.Modal.getOrCreateInstance(document.getElementById('modalExcluir'));
    modalExcluir.show();
  });

  $('#btnConfirmarExcluir').on('click', async function () {
    if (!produtoParaExcluir) return;
    await Repositorio.excluirProduto(produtoParaExcluir.id);
    modalExcluir.hide();
    produtoParaExcluir = null;
    await carregarTudo();
    UI.toast('Produto excluído do catálogo.', 'sucesso');
  });

  // Importar produtos reais da API pública (ID 24)
  $('#btnImportar').on('click', async function () {
    const $botao = $(this).prop('disabled', true);
    $botao.find('span:last').text('Importando...');
    try {
      const lote = await ApiPublica.produtos(6, Math.floor(Math.random() * 180));
      for (const item of lote) {
        await Repositorio.salvarProduto(item);
      }
      await carregarTudo();
      UI.toast(lote.length + ' produtos reais importados da DummyJSON.', 'sucesso');
    } catch (erro) {
      console.error(erro);
      UI.toast('Falha ao contatar a API pública: ' + erro.message, 'erro');
    } finally {
      $botao.prop('disabled', false).find('span:last').text('Importar da API pública');
    }
  });

  // Filtro inicial via querystring (?categoria=slug vem da página Categorias)
  const categoriaInicial = new URLSearchParams(location.search).get('categoria');
  if (categoriaInicial) $('#filtroCategoria').val(categoriaInicial);

  // Toast pendente gravado pelo formulário (SessionStorage — ID 14)
  const toastPendente = sessionStorage.getItem(APP.storageSessao);
  if (toastPendente) {
    sessionStorage.removeItem(APP.storageSessao);
    UI.toast(toastPendente, 'sucesso');
  }

  await carregarTudo();
});
