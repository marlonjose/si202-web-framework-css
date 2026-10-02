// =====================================================================
// EstoqueFácil — configuração global (endpoints e chaves de armazenamento)
// =====================================================================

const APP = {
  apiFake: 'http://localhost:3000', // JSON Server (npm run api)
  apiPublica: 'https://dummyjson.com', // API pública real
  storageProdutos: 'estoquefacil:produtos',
  storageSessao: 'estoquefacil:ultimaVisita',
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
