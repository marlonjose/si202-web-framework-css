// ESLint (flat config) — qualidade e padronização do JavaScript (ID 19)
//
// O projeto usa JavaScript clássico carregado por <script> (sem bundler),
// portanto os módulos compartilham globals: APP, Repositorio, UI etc.
// São declarados abaixo para o ESLint entender a arquitetura.
export default [
  {
    files: ['app/**/*.js', 'scripts/**/*.js'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'script',
      globals: {
        // Bibliotecas carregadas localmente (assets/libraries)
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
    // Scripts de build do Node (CommonJS), fora da página web
    files: ['scripts/**/*.js'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'commonjs',
      globals: {
        require: 'readonly',
        module: 'readonly',
        process: 'readonly',
        __dirname: 'readonly',
        console: 'readonly',
      },
    },
    rules: {
      'no-undef': 'error',
    },
  },
  {
    // Módulos de definição: as globals declaradas acima são DEFINIDAS aqui
    // e consumidas pelos scripts das páginas.
    files: [
      'app/config.js',
      'app/model/produto.js',
      'app/util/formatter.js',
      'app/service/api.service.js',
      'app/util/ui.js',
    ],
    rules: {
      'no-unused-vars': 'off',
      'no-redeclare': 'off',
    },
  },
];
