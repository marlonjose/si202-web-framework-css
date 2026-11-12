// =====================================================================
// EstoqueFácil — componentes de interface reutilizáveis (jQuery)
// =====================================================================

const UI = {
  // Toast animado com jQuery (fadeIn/fadeOut — ID 20)
  toast(mensagem, tipo) {
    const $toast = $('#div-toast');
    const $icone = $('#span-toast-icone');
    const cores = {
      sucesso: { icone: 'check_circle', cor: '#68dba9' },
      erro: { icone: 'error', cor: '#ff8a80' },
      alerta: { icone: 'warning', cor: '#ffcc80' },
    };
    const cfg = cores[tipo] || cores.sucesso;
    $icone.text(cfg.icone).css('color', cfg.cor);
    $('#span-toast-msg').text(mensagem);
    $toast.stop(true, true).fadeIn(200);
    clearTimeout(UI._timerToast);
    UI._timerToast = setTimeout(function () {
      $toast.fadeOut(300);
    }, 3200);
  },

  // Exibe/esconde o selo de modo local (Web Storage)
  atualizarBadgeModo(modoLocal) {
    if (modoLocal) $('#span-badge-modo').removeClass('d-none');
    else $('#span-badge-modo').addClass('d-none');
  },

  // Monta a URL de uma imagem no Cloudinary (ID 10)
  // - Public ID (ex.: 'estoquefacil/produtos/teclado-mecanico'): entrega "upload",
  //   a foto está guardada na conta do Cloudinary
  // - URL externa (ex.: miniatura da DummyJSON): entrega "fetch", o Cloudinary
  //   busca a foto nesse endereço, otimiza e guarda em cache na CDN dele
  // transformacoes: parâmetros do Cloudinary separados por vírgula
  //   w_ = largura, h_ = altura, ar_ = proporção, c_fill = recorta sem distorcer,
  //   f_webp = converte para WebP, q_auto = compressão automática
  urlCloudinary(origem, transformacoes) {
    const tipo = /^https?:\/\//.test(origem) ? 'fetch' : 'upload';
    return `${APP.cloudinary}/${tipo}/${transformacoes}/${origem}`;
  },

  // Miniatura do produto (ID 09/10)
  // Foto vinda do Cloudinary em WebP, no tamanho exato da miniatura (36px)
  // e com srcset 1x/2x: telas comuns baixam 36px, telas de alta densidade 72px
  miniatura(produto) {
    if (produto && produto.imagem) {
      const url = (px) => UI.urlCloudinary(produto.imagem, `w_${px},h_${px},c_fill,f_webp,q_auto`);
      return (
        `<img src="${escaparHTML(url(36))}" ` +
        `srcset="${escaparHTML(url(36))} 1x, ${escaparHTML(url(72))} 2x" ` +
        `alt="${escaparHTML(produto.nome)}" width="36" height="36" loading="lazy" />`
      );
    }
    // Produto sem foto: placeholder local em WebP com srcset 1x/2x
    return (
      '<img src="../assets/resources/images/placeholder-96.webp" ' +
      'srcset="../assets/resources/images/placeholder-96.webp 1x, ../assets/resources/images/placeholder-192.webp 2x" ' +
      'alt="Sem imagem" width="36" height="36" loading="lazy" />'
    );
  },
};
