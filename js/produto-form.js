// =====================================================================
// EstoqueFácil — página Novo/Editar Produto (produto.html)
// Validação HTML5 + Regex (ID 11/12) + máscaras jQuery (ID 21)
// =====================================================================
$(async function () {
  await Repositorio.verificarApiFake();
  UI.atualizarBadgeModo(Repositorio.modoLocal);

  let produtoEmEdicao = null; // null = cadastro novo

  // ----- categorias (select) -----
  const categorias = await Repositorio.listarCategorias();
  $.each(categorias, function (i, cat) {
    $('#categoria').append($('<option>', { value: cat.nome, text: cat.nome }));
  });

  // ----- modo edição (?id=) -----
  const id = new URLSearchParams(location.search).get('id');
  if (id) {
    produtoEmEdicao = await Repositorio.buscarProduto(id);
    if (produtoEmEdicao) {
      $('#formTitulo').text('Editar Produto');
      $('#breadcrumbAtual').text('Editar');
      $('#formSubtitulo').text('Altere os campos desejados. Os marcados com * são obrigatórios.');
      $('#nome').val(produtoEmEdicao.nome);
      $('#sku').val(produtoEmEdicao.sku).prop('readonly', true);
      $('#categoria').val(produtoEmEdicao.categoria);
      $('#marca').val(produtoEmEdicao.marca || '');
      $('#preco').val(formatarInputPreco(produtoEmEdicao.preco));
      $('#estoque').val(produtoEmEdicao.estoque);
      $('input[name="situacao"][value="' + produtoEmEdicao.situacao + '"]').prop('checked', true);
      $('#destaque').prop('checked', !!produtoEmEdicao.destaque);
      $('#emailFornecedor').val(produtoEmEdicao.emailFornecedor || '');
      $('#telefoneFornecedor').val(produtoEmEdicao.telefoneFornecedor || '');
      $('#descricao')
        .val(produtoEmEdicao.descricao || '')
        .trigger('input');
    }
  } else {
    $('#sku').val(gerarSKU());
  }

  // Número vindo do banco (489.9) para o formato mascarado (489,90)
  function formatarInputPreco(numero) {
    return new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 2 }).format(numero || 0);
  }

  // ----- máscaras (plugin jQuery Mask) -----
  $('#preco').mask('#.##0,00', { reverse: true });
  $('#telefoneFornecedor').mask('(00) 00000-0000');

  // ----- utilidades de tela -----
  $('#btnGerarSku').on('click', function () {
    $('#sku').val(gerarSKU()).trigger('input');
  });

  $('#descricao').on('input', function () {
    $('#contadorDescricao').text(this.value.length);
  });

  // Valida um campo e aplica o estado visual do Bootstrap (is-invalid/is-valid)
  function validarCampo($campo, valido) {
    $campo.removeClass('is-invalid is-valid').addClass(valido ? 'is-valid' : 'is-invalid');
    return valido;
  }

  // ----- validações customizadas (Regex — ID 12) -----
  function validarFormulario() {
    let formularioOk = true;

    // Nome: obrigatório e tamanho mínimo (validação nativa — ID 11)
    formularioOk = validarCampo($('#nome'), $('#nome')[0].checkValidity()) && formularioOk;

    // SKU: Regex próprio
    const skuOk = REGEX.sku.test($('#sku').val().trim().toUpperCase());
    formularioOk = validarCampo($('#sku'), skuOk) && formularioOk;

    // Categoria: obrigatório (select)
    formularioOk = validarCampo($('#categoria'), !!$('#categoria').val()) && formularioOk;

    // Preço: máscara + Regex de moeda brasileira
    const precoOk = REGEX.preco.test($('#preco').val().trim());
    formularioOk = validarCampo($('#preco'), precoOk) && formularioOk;

    // Estoque: nativo (min 0, max 99999)
    formularioOk = validarCampo($('#estoque'), $('#estoque')[0].checkValidity()) && formularioOk;

    // E-mail: tipo nativo + Regex
    const email = $('#emailFornecedor').val().trim();
    const emailOk = REGEX.email.test(email);
    formularioOk = validarCampo($('#emailFornecedor'), emailOk) && formularioOk;

    // Telefone: máscara + Regex
    const telefoneOk = REGEX.telefone.test($('#telefoneFornecedor').val().trim());
    formularioOk = validarCampo($('#telefoneFornecedor'), telefoneOk) && formularioOk;

    return formularioOk;
  }

  // Remove o estado de erro assim que o usuário corrige o campo
  $('#formProduto input, #formProduto select, #formProduto textarea').on(
    'input change',
    function () {
      $(this).removeClass('is-invalid is-valid');
    }
  );

  // ----- envio -----
  $('#formProduto').on('submit', async function (evento) {
    evento.preventDefault();
    $('#sku').val($('#sku').val().trim().toUpperCase());

    if (!validarFormulario()) {
      UI.toast('Verifique os campos destacados em vermelho.', 'alerta');
      $('.is-invalid').first().trigger('focus');
      return;
    }

    const botaoSalvar = $(this).find('button[type="submit"]').prop('disabled', true);
    const categoria = $('#categoria').val();

    const produto = {
      id: produtoEmEdicao ? produtoEmEdicao.id : undefined,
      sku: $('#sku').val(),
      nome: $('#nome').val().trim(),
      marca: $('#marca').val().trim(),
      categoria: categoria,
      categoriaSlug: slugify(categoria),
      preco: parsePrecoBR($('#preco').val()),
      estoque: parseInt($('#estoque').val(), 10) || 0,
      situacao: $('input[name="situacao"]:checked').val(),
      destaque: $('#destaque').is(':checked'),
      emailFornecedor: $('#emailFornecedor').val().trim(),
      telefoneFornecedor: $('#telefoneFornecedor').val().trim(),
      descricao: $('#descricao').val().trim(),
      imagem: produtoEmEdicao ? produtoEmEdicao.imagem || '' : '',
      origem: produtoEmEdicao ? produtoEmEdicao.origem || 'manual' : 'manual',
    };

    try {
      await Repositorio.salvarProduto(produto);
      // Feedback na página seguinte via SessionStorage (ID 14)
      sessionStorage.setItem(
        APP.storageSessao,
        produtoEmEdicao ? 'Produto atualizado com sucesso!' : 'Produto cadastrado com sucesso!'
      );
      location.href = 'index.html';
    } catch (erro) {
      console.error(erro);
      botaoSalvar.prop('disabled', false);
      UI.toast('Erro ao salvar: ' + erro.message, 'erro');
    }
  });
});
