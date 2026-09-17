/**
 * Monta a pasta dist/ que é publicada no GitHub Pages pelo script deploy.
 *
 * O deploy não pode publicar direto da raiz: pastas ignoradas pelo .gitignore
 * (como vendor/, gerada a partir do node_modules) ficariam de fora e o site
 * perderia o Bootstrap. Por isso montamos um dist/ com apenas os arquivos
 * estáticos do site, incluindo a vendor/.
 *
 * Rode via npm run deploy (o predeploy chama este script na ordem certa)
 * ou manualmente com npm run build:dist.
 */
const fs = require('node:fs');
const path = require('node:path');

const raiz = path.resolve(__dirname, '..');
const dist = path.join(raiz, 'dist');

fs.rmSync(dist, { force: true, recursive: true });

// Arquivos e pastas que compõem o site publicado (nada de node_modules,
// scss/, scripts/, configs de lint ou arquivos de pacote).
const itens = [
  'index.html',
  'produto.html',
  'categorias.html',
  'code.html',
  'screen.png',
  'README.md',
  'DESIGN.md',
  'css',
  'js',
  'img',
  'db',
  'docs',
  'vendor',
];

for (const item of itens) {
  const de = path.join(raiz, item);
  if (!fs.existsSync(de)) {
    console.error(`✗ não encontrado: ${item} — rode "npm run copy-libs" antes (se for vendor/).`);
    process.exitCode = 1;
    continue;
  }
  fs.cpSync(de, path.join(dist, item), { recursive: true });
  console.log(`✓ ${item}`);
}
