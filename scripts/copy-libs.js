/**
 * Copia os arquivos de distribuição das dependências instaladas via NPM
 * (node_modules) para a pasta vendor/, referenciada pelas páginas HTML.
 *
 * Rode após instalar/atualizar dependências:
 *   npm i            (dispara via postinstall)
 *   npm run copy-libs
 */
const fs = require('node:fs');
const path = require('node:path');

const raiz = path.resolve(__dirname, '..');

// [origem dentro de node_modules, destino dentro de vendor/]
const arquivos = [
  ['bootstrap/dist/css/bootstrap.min.css', 'bootstrap/bootstrap.min.css'],
  ['bootstrap/dist/js/bootstrap.bundle.min.js', 'bootstrap/bootstrap.bundle.min.js'],
  ['jquery/dist/jquery.min.js', 'jquery/jquery.min.js'],
  ['jquery-mask-plugin/dist/jquery.mask.min.js', 'jquery/jquery.mask.min.js'],
];

for (const [origem, destino] of arquivos) {
  const de = path.join(raiz, 'node_modules', origem);
  const para = path.join(raiz, 'vendor', destino);

  if (!fs.existsSync(de)) {
    console.error(`✗ não encontrado: ${origem} — rode "npm i" antes.`);
    process.exitCode = 1;
    continue;
  }

  fs.mkdirSync(path.dirname(para), { recursive: true });
  fs.copyFileSync(de, para);
  console.log(`✓ ${origem} → vendor/${destino}`);
}
