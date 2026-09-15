// ESLint (flat config) — qualidade e padronização do JavaScript (ID 19)
//
// O projeto usa JavaScript clássico carregado por <script> (sem bundler),
// portanto os módulos compartilham globals: APP, Repositorio, UI etc.
// São declarados abaixo para o ESLint entender a arquitetura.
export default [
  {
    files: ['js/**/*.js'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'script',
      globals: {
        // Bibliotecas carregadas via CDN
        $: 'readonly',
        jQuery: 'readonly',
        bootstrap: 'readonly',
        uuid: 'readonly',
        // APIs do navegador
        window: 'readonly',
        document: 'readonly',
        location: 'readonly',
        localStorage: 'readonly',
        sessionStorage: 'readonly',
        fetch: 'readonly',
        console: 'readonly',
        setTimeout: 'readonly',
        clearTimeout: 'readonly',
        AbortController: 'readonly',
        URLSearchParams: 'readonly',
        URL: 'readonly',
        Intl: 'readonly',
        crypto: 'readonly',
        // Globals definidos pelos próprios módulos do projeto
        APP: 'readonly',
        REGEX: 'readonly',
        CATEGORIAS_PADRAO: 'readonly',
        ICONE_PADRAO_CATEGORIA: 'readonly',
        ROTULO_STATUS: 'readonly',
        statusEstoque: 'readonly',
        formatarBRL: 'readonly',
        parsePrecoBR: 'readonly',
        gerarSKU: 'readonly',
        slugify: 'readonly',
        escaparHTML: 'readonly',
        gerarId: 'readonly',
        fetchTimeout: 'readonly',
        WebStorage: 'readonly',
        Repositorio: 'readonly',
        ApiPublica: 'readonly',
        capitalizar: 'readonly',
        UI: 'readonly',
      },
    },
    rules: {
      'no-undef': 'error',
      'no-unused-vars': ['warn', { args: 'none', caughtErrors: 'none' }],
      eqeqeq: ['warn', 'smart'],
      'no-var': 'warn',
      'no-redeclare': 'error',
    },
  },
  {
    // Módulos de definição: as globals declaradas acima são DEFINIDAS aqui
    // e consumidas pelos scripts das páginas.
    files: ['js/config.js', 'js/api.js', 'js/ui.js'],
    rules: {
      'no-unused-vars': 'off',
      'no-redeclare': 'off',
    },
  },
];
