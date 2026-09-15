// =====================================================================
// EstoqueFácil — componentes de interface reutilizáveis (jQuery)
// =====================================================================

const UI = {
  // Toast animado com jQuery (fadeIn/fadeOut — ID 20)
  toast(mensagem, tipo) {
    const $toast = $('#toast');
    const $icone = $('#toastIcon');
    const cores = {
      sucesso: { icone: 'check_circle', cor: '#68dba9' },
      erro: { icone: 'error', cor: '#ff8a80' },
      alerta: { icone: 'warning', cor: '#ffcc80' },
    };
    const cfg = cores[tipo] || cores.sucesso;
    $icone.text(cfg.icone).css('color', cfg.cor);
    $('#toastMsg').text(mensagem);
    $toast.stop(true, true).fadeIn(200);
    clearTimeout(UI._timerToast);
    UI._timerToast = setTimeout(function () {
      $toast.fadeOut(300);
    }, 3200);
  },

  // Exibe/esconde o selo de modo local (Web Storage)
  atualizarBadgeModo(modoLocal) {
    if (modoLocal) $('#badgeModo').removeClass('d-none');
    else $('#badgeModo').addClass('d-none');
  },

  // Miniatura do produto: imagem remota ou placeholder WebP com srcset (ID 09/10)
  miniatura(produto) {
    if (produto && produto.imagem) {
      return (
        '<img src="' +
        escaparHTML(produto.imagem) +
        '" alt="' +
        escaparHTML(produto.nome) +
        '" loading="lazy" />'
      );
    }
    // Imagem em formato moderno (WebP) com carregamento adaptativo (srcset 1x/2x)
    return (
      '<img src="img/placeholder-96.webp" ' +
      'srcset="img/placeholder-96.webp 1x, img/placeholder-192.webp 2x" ' +
      'alt="Sem imagem" width="36" height="36" loading="lazy" />'
    );
  },
};
