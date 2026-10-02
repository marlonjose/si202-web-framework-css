// =====================================================================
// EstoqueFácil — página Categorias (app/pages/categorias/index.html)
// Cards com categorias locais + categorias reais da DummyJSON (ID 24)
// =====================================================================
$(async function () {
  await Repositorio.verificarApiFake();
  UI.atualizarBadgeModo(Repositorio.modoLocal);

  const $grade = $('#gradeCategorias').empty();

  // Contagem local de produtos por categoria
  const produtos = await Repositorio.listarProdutos();
  const contagem = {};
  produtos.forEach(function (p) {
    const slug = p.categoriaSlug || slugify(p.categoria);
    contagem[slug] = (contagem[slug] || 0) + 1;
  });

  // Categoria local sempre aparece; a pública é mesclada pelo slug
  const categorias = {}; // slug -> { nome, icone, origem }
  (await Repositorio.listarCategorias()).forEach(function (cat) {
    categorias[cat.slug] = {
      nome: cat.nome,
      icone: cat.icone || ICONE_PADRAO_CATEGORIA,
      publica: false,
    };
  });

  let apiFalhou = false;
  try {
    const publicas = await ApiPublica.categorias();
    publicas.forEach(function (slug) {
      if (!categorias[slug])
        categorias[slug] = {
          nome: capitalizar(slug),
          icone: ICONE_PADRAO_CATEGORIA,
          publica: true,
        };
    });
  } catch (erro) {
    console.error(erro);
    apiFalhou = true;
  }

  // Tratamento de erro exibido ao usuário (ID 24)
  if (apiFalhou) $('#alertaApi').removeClass('d-none');

  // Montagem dos cards com criação de elementos via DOM (manipulação dinâmica)
  Object.keys(categorias)
    .sort()
    .forEach(function (slug) {
      const cat = categorias[slug];
      const total = contagem[slug] || 0;

      const $col = $('<div>', { class: 'col' });
      const $card = $('<div>', { class: 'card-categoria p-3 h-100' });

      const $cabecalho = $('<div>', { class: 'd-flex align-items-center gap-3 mb-2' });
      const $icone = $('<div>', { class: 'cat-icon' }).append(
        $('<span>', { class: 'material-symbols-outlined' }).text(cat.icone)
      );
      const $titulo = $('<h2>', { class: 'h6 fw-bold mb-0 flex-grow-1' }).text(cat.nome);
      if (cat.publica) {
        $titulo.append(
          ' ',
          $('<span>', {
            class: 'badge-categoria',
            title: 'Categoria vinda da API pública DummyJSON',
          }).text('API')
        );
      }
      $cabecalho.append($icone, $titulo);

      const $info = $('<p>', { class: 'small text-muted-app mb-3' }).text(
        total === 1 ? '1 produto no catálogo local' : total + ' produtos no catálogo local'
      );

      const $botao = $('<a>', {
        class: 'btn btn-sm btn-outline-primary stretched-link',
        href: '../../index.html?categoria=' + encodeURIComponent(slug),
      }).text('Ver produtos');

      $card.append($cabecalho, $info, $botao);
      $col.append($card);
      $grade.append($col);
    });

  // Efeito de entrada suave nos cards (animação jQuery — ID 20)
  $grade.hide().fadeIn(250);
});
