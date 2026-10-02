// =====================================================================
// EstoqueFácil — página Categorias (app/pages/categorias/index.html)
// Cards com as categorias do catálogo (JSON Server) e contagem de
// produtos por categoria
// =====================================================================
$(async function () {
  await Repositorio.verificarApiFake();
  UI.atualizarBadgeModo(Repositorio.modoLocal);

  const $grade = $('#gradeCategorias').empty();

  // Produtos do catálogo (JSON Server com fallback para Web Storage)
  const produtos = await Repositorio.listarProdutos();

  // Contagem de produtos por categoria
  const contagem = {};
  produtos.forEach(function (p) {
    const slug = p.categoriaSlug || slugify(p.categoria);
    contagem[slug] = (contagem[slug] || 0) + 1;
  });

  // Categorias cadastradas (entidade /categorias da API fake)
  const categorias = {}; // slug -> { nome, icone }
  (await Repositorio.listarCategorias()).forEach(function (cat) {
    categorias[cat.slug] = {
      nome: cat.nome,
      icone: cat.icone || ICONE_PADRAO_CATEGORIA,
    };
  });

  // Categorias que só existem em produtos (ex.: importados), para a
  // página refletir exatamente o que o catálogo tem
  produtos.forEach(function (p) {
    const slug = p.categoriaSlug || slugify(p.categoria);
    if (!categorias[slug]) {
      categorias[slug] = { nome: p.categoria, icone: ICONE_PADRAO_CATEGORIA };
    }
  });

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
      $cabecalho.append($icone, $titulo);

      const $info = $('<p>', { class: 'small text-muted-app mb-3' }).text(
        total === 1 ? '1 produto no catálogo' : total + ' produtos no catálogo'
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
