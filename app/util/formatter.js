// =====================================================================
// EstoqueFácil — utilitários de formatação e texto
// =====================================================================

// Formata número como moeda brasileira
function formatarBRL(valor) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor || 0);
}

// Converte "1.234,56" (texto mascarado) para Number
function parsePrecoBR(texto) {
  if (typeof texto === 'number') return texto;
  if (!texto) return 0;
  return parseFloat(String(texto).replace(/\./g, '').replace(',', '.')) || 0;
}

// Converte texto para slug (identificador de categoria)
function slugify(texto) {
  return String(texto || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

// Capitaliza cada palavra ("smartphones" → "Smartphones")
function capitalizar(texto) {
  return String(texto)
    .split(/[\s-]/)
    .map(function (parte) {
      return parte.charAt(0).toUpperCase() + parte.slice(1);
    })
    .join(' ');
}

// Escapa HTML para montagem segura de linhas da tabela
function escaparHTML(texto) {
  return String(texto || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
