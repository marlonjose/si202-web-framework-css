// =====================================================================
// EstoqueFácil — configuração global (endpoints e chaves de armazenamento)
// =====================================================================

const APP = {
  apiFake: 'http://localhost:3000', // JSON Server (npm run api)
  apiPublica: 'https://dummyjson.com', // API pública real
  storageProdutos: 'estoquefacil:produtos',
  storageSessao: 'estoquefacil:ultimaVisita',
  // Cloudinary: CDN que entrega as imagens já otimizadas (ID 10)
  // conta "pfzrd6uo"; as fotos ficam na pasta estoquefacil/ da Media Library
  cloudinary: 'https://res.cloudinary.com/pfzrd6uo/image',
};

// Categorias padrão do catálogo (fallback quando a API fake está offline)
// capa = Public ID da foto de capa no Cloudinary
const CATEGORIAS_PADRAO = [
  {
    slug: 'perifericos',
    nome: 'Periféricos',
    icone: 'keyboard',
    capa: 'estoquefacil/categorias/perifericos',
  },
  {
    slug: 'mobiliario',
    nome: 'Mobiliário',
    icone: 'chair',
    capa: 'estoquefacil/categorias/mobiliario',
  },
  { slug: 'audio', nome: 'Áudio', icone: 'headphones', capa: 'estoquefacil/categorias/audio' },
  {
    slug: 'monitores',
    nome: 'Monitores',
    icone: 'monitor',
    capa: 'estoquefacil/categorias/monitores',
  },
  {
    slug: 'alimentos',
    nome: 'Alimentos',
    icone: 'local_cafe',
    capa: 'estoquefacil/categorias/alimentos',
  },
  {
    slug: 'acessorios',
    nome: 'Acessórios',
    icone: 'mouse',
    capa: 'estoquefacil/categorias/acessorios',
  },
];

// Ícone padrão para categorias vindas da API pública
const ICONE_PADRAO_CATEGORIA = 'category';
