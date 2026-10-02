// =====================================================================
// EstoqueFácil — modelo de domínio: Produto
//   Regras de negócio, validações (Regex — ID 12) e identificadores
// =====================================================================

// Validações customizadas com Regex (ID 12)
const REGEX = {
  sku: /^SKU-[A-Z]{2}-\d{4}$/,
  preco: /^\d{1,3}(\.\d{3})*,\d{2}$/,
  email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  telefone: /^\(\d{2}\) \d{5}-\d{4}$/,
};

// Regra de negócio: status do estoque pela quantidade (docs/prd.md RN-03)
function statusEstoque(quantidade) {
  if (!quantidade || quantidade <= 0) return 'esgotado';
  if (quantidade <= 10) return 'baixo';
  return 'ok';
}

const ROTULO_STATUS = {
  ok: 'Em estoque',
  baixo: 'Estoque baixo',
  esgotado: 'Esgotado',
  inativo: 'Inativo',
};

// Gera um SKU aleatório no padrão SKU-XX-0000
function gerarSKU() {
  const letras = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const parteLetras =
    letras.charAt(Math.floor(Math.random() * 26)) + letras.charAt(Math.floor(Math.random() * 26));
  const parteNumeros = String(Math.floor(1000 + Math.random() * 9000));
  return 'SKU-' + parteLetras + '-' + parteNumeros;
}

// Gera identificador único (biblioteca uuid quando disponível, com fallback nativo)
function gerarId() {
  if (window.uuid && typeof window.uuid.v4 === 'function') return window.uuid.v4();
  return window.crypto && crypto.randomUUID ? crypto.randomUUID() : 'id-' + Date.now();
}
