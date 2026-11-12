// =====================================================================
// EstoqueFácil — casca da aplicação (menu e rodapé compartilhados)
//   Cada página declara <body data-base="..." data-pagina="..."> e tem
//   os contêineres #div-app-menu e #div-app-footer, preenchidos aqui via jQuery.
// =====================================================================
$(function () {
  const base = document.body.dataset.base || '';
  const pagina = document.body.dataset.pagina || '';

  $('#div-app-menu').load(base + 'menu.html', function () {
    // Ajusta os links do menu à profundidade da página atual
    $('#div-app-menu [data-destino]').each(function () {
      this.setAttribute('href', base + this.dataset.destino);
    });
    // Destaque do link da página ativa
    $('#div-app-menu .nav-link[data-chave="' + pagina + '"]').addClass('active');
    // Reaplica o selo de modo local (a página pode tê-lo atualizado
    // antes do menu terminar de carregar)
    UI.atualizarBadgeModo(Repositorio.modoLocal);
  });

  $('#div-app-footer').load(base + 'footer.html');
});
