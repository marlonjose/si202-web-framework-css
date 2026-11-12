// =====================================================================
// EstoqueFácil — página Novo/Editar Produto (app/pages/produto/index.html)
// Validação HTML5 + Regex (ID 11/12) + máscaras jQuery (ID 21)
// =====================================================================
$(async function () {
  await Repositorio.verificarApiFake();
  UI.atualizarBadgeModo(Repositorio.modoLocal);

  let produtoEmEdicao = null; // null = cadastro novo

  // ----- categorias (select) -----
  const categorias = await Repositorio.listarCategorias();
  $.each(categorias, function (i, cat) {
    $('#select-categoria').append($('<option>', { value: cat.nome, text: cat.nome }));
  });

  // ----- modo edição (?id=) -----
  const id = new URLSearchParams(location.search).get('id');
  if (id) {
    produtoEmEdicao = await Repositorio.buscarProduto(id);
    if (produtoEmEdicao) {
      $('#h1-form-titulo').text('Editar Produto');
      $('#li-breadcrumb-atual').text('Editar');
      $('#p-form-subtitulo').text(
        'Altere os campos desejados. Os marcados com * são obrigatórios.'
      );
      $('#input-nome').val(produtoEmEdicao.nome);
      $('#input-sku').val(produtoEmEdicao.sku).prop('readonly', true);
      $('#select-categoria').val(produtoEmEdicao.categoria);
      $('#input-marca').val(produtoEmEdicao.marca || '');
      $('#input-preco').val(formatarInputPreco(produtoEmEdicao.preco));
      $('#input-estoque').val(produtoEmEdicao.estoque);
      $('input[name="situacao"][value="' + produtoEmEdicao.situacao + '"]').prop('checked', true);
      $('#input-destaque').prop('checked', !!produtoEmEdicao.destaque);
      $('#input-email-fornecedor').val(produtoEmEdicao.emailFornecedor || '');
      $('#input-telefone-fornecedor').val(produtoEmEdicao.telefoneFornecedor || '');
      $('#textarea-descricao').val(produtoEmEdicao.descricao || '');
    }
  } else {
    $('#input-sku').val(gerarSKU());
  }

  // Número vindo do banco (489.9) para o formato mascarado (489,90)
  function formatarInputPreco(numero) {
    return new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 2 }).format(numero || 0);
  }

  // ----- máscaras (plugin jQuery Mask) -----
  $('#input-preco').mask('#.##0,00', { reverse: true });
  $('#input-telefone-fornecedor').mask('(00) 00000-0000');

  // ----- utilidades de tela -----
  $('#button-gerar-sku').on('click', function () {
    $('#input-sku').val(gerarSKU()).trigger('input');
  });

  // trigger: atualiza o contador já com a descrição carregada na edição
  $('#textarea-descricao')
    .on('input', function () {
      $('#span-contador-descricao').text(this.value.length);
    })
    .trigger('input');

  // Valida um campo e aplica o estado visual do Bootstrap (is-invalid/is-valid)
  function validarCampo($campo, valido) {
    $campo.removeClass('is-invalid is-valid').addClass(valido ? 'is-valid' : 'is-invalid');
    return valido;
  }

  // ----- validações customizadas (Regex — ID 12) -----
  function validarFormulario() {
    let formularioOk = true;

    // Nome: obrigatório e tamanho mínimo (validação nativa — ID 11)
    formularioOk =
      validarCampo($('#input-nome'), $('#input-nome')[0].checkValidity()) && formularioOk;

    // SKU: Regex próprio
    const skuOk = REGEX.sku.test($('#input-sku').val().trim().toUpperCase());
    formularioOk = validarCampo($('#input-sku'), skuOk) && formularioOk;

    // Categoria: obrigatório (select)
    formularioOk =
      validarCampo($('#select-categoria'), !!$('#select-categoria').val()) && formularioOk;

    // Preço: máscara + Regex de moeda brasileira
    const precoOk = REGEX.preco.test($('#input-preco').val().trim());
    formularioOk = validarCampo($('#input-preco'), precoOk) && formularioOk;

    // Estoque: nativo (min 0, max 99999)
    formularioOk =
      validarCampo($('#input-estoque'), $('#input-estoque')[0].checkValidity()) && formularioOk;

    // E-mail: tipo nativo + Regex
    const email = $('#input-email-fornecedor').val().trim();
    const emailOk = REGEX.email.test(email);
    formularioOk = validarCampo($('#input-email-fornecedor'), emailOk) && formularioOk;

    // Telefone: máscara + Regex
    const telefoneOk = REGEX.telefone.test($('#input-telefone-fornecedor').val().trim());
    formularioOk = validarCampo($('#input-telefone-fornecedor'), telefoneOk) && formularioOk;

    return formularioOk;
  }

  // Remove o estado de erro assim que o usuário corrige o campo
  $('#form-produto input, #form-produto select, #form-produto textarea').on(
    'input change',
    function () {
      $(this).removeClass('is-invalid is-valid');
    }
  );

  // ----- envio -----
  $('#form-produto').on('submit', async function (evento) {
    evento.preventDefault();
    $('#input-sku').val($('#input-sku').val().trim().toUpperCase());

    if (!validarFormulario()) {
      UI.toast('Verifique os campos destacados em vermelho.', 'alerta');
      $('.is-invalid').first().trigger('focus');
      return;
    }

    const botaoSalvar = $(this).find('button[type="submit"]').prop('disabled', true);
    const categoria = $('#select-categoria').val();

    const produto = {
      id: produtoEmEdicao ? produtoEmEdicao.id : undefined,
      sku: $('#input-sku').val(),
      nome: $('#input-nome').val().trim(),
      marca: $('#input-marca').val().trim(),
      categoria: categoria,
      categoriaSlug: slugify(categoria),
      preco: parsePrecoBR($('#input-preco').val()),
      estoque: parseInt($('#input-estoque').val(), 10) || 0,
      situacao: $('input[name="situacao"]:checked').val(),
      destaque: $('#input-destaque').is(':checked'),
      emailFornecedor: $('#input-email-fornecedor').val().trim(),
      telefoneFornecedor: $('#input-telefone-fornecedor').val().trim(),
      descricao: $('#textarea-descricao').val().trim(),
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
      location.href = '../../index.html';
    } catch (erro) {
      console.error(erro);
      botaoSalvar.prop('disabled', false);
      UI.toast('Erro ao salvar: ' + erro.message, 'erro');
    }
  });
});
