// =====================================================================
// EstoqueFácil — configuração global, expressões regulares e utilitários
// =====================================================================

// Endpoints e chaves de armazenamento
const APP = {
  apiFake: 'http://localhost:3000', // JSON Server (npm run api)
  apiPublica: 'https://dummyjson.com', // API pública real
  storageProdutos: 'estoquefacil:produtos',
  storageSessao: 'estoquefacil:ultimaVisita',
};

// Validações customizadas com Regex (ID 12)
const REGEX = {
  sku: /^SKU-[A-Z]{2}-\d{4}$/,
  preco: /^\d{1,3}(\.\d{3})*,\d{2}$/,
  email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  telefone: /^\(\d{2}\) \d{5}-\d{4}$/,
};

// Categorias padrão do catálogo (fallback quando a API fake está offline)
const CATEGORIAS_PADRAO = [
  { slug: 'perifericos', nome: 'Periféricos', icone: 'keyboard' },
  { slug: 'mobiliario', nome: 'Mobiliário', icone: 'chair' },
  { slug: 'audio', nome: 'Áudio', icone: 'headphones' },
  { slug: 'monitores', nome: 'Monitores', icone: 'monitor' },
  { slug: 'alimentos', nome: 'Alimentos', icone: 'local_cafe' },
  { slug: 'acessorios', nome: 'Acessórios', icone: 'mouse' },
];

// Ícone padrão para categorias vindas da API pública
const ICONE_PADRAO_CATEGORIA = 'category';

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

// Gera um SKU aleatório no padrão SKU-XX-0000
function gerarSKU() {
  const letras = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const parteLetras =
    letras.charAt(Math.floor(Math.random() * 26)) + letras.charAt(Math.floor(Math.random() * 26));
  const parteNumeros = String(Math.floor(1000 + Math.random() * 9000));
  return 'SKU-' + parteLetras + '-' + parteNumeros;
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

// Escapa HTML para montagem segura de linhas da tabela
function escaparHTML(texto) {
  return String(texto || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// Gera identificador único (biblioteca uuid via CDN, com fallback nativo)
function gerarId() {
  if (window.uuid && typeof window.uuid.v4 === 'function') return window.uuid.v4();
  return window.crypto && crypto.randomUUID ? crypto.randomUUID() : 'id-' + Date.now();
}
