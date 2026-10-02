// =====================================================================
// EstoqueFácil — casca da aplicação (menu e rodapé compartilhados)
//   Cada página declara <body data-base="..." data-pagina="..."> e tem
//   os contêineres #appMenu e #appFooter, preenchidos aqui via jQuery.
// =====================================================================
$(function () {
  const base = document.body.dataset.base || '';
  const pagina = document.body.dataset.pagina || '';

  $('#appMenu').load(base + 'menu.html', function () {
    // Ajusta os links do menu à profundidade da página atual
    $('#appMenu [data-destino]').each(function () {
      this.setAttribute('href', base + this.dataset.destino);
    });
    // Destaque do link da página ativa
    $('#appMenu .nav-link[data-chave="' + pagina + '"]').addClass('active');
    // Reaplica o selo de modo local (a página pode tê-lo atualizado
    // antes do menu terminar de carregar)
    if (window.Repositorio && window.UI) UI.atualizarBadgeModo(Repositorio.modoLocal);
  });

  $('#appFooter').load(base + 'footer.html');
});
