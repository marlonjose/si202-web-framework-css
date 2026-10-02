/**
 * Monta a pasta dist/ que é publicada no GitHub Pages pelo script deploy.
 *
 * O deploy não pode publicar direto da raiz: pastas ignoradas pelo .gitignore
 * (como assets/libraries/, gerada a partir do node_modules) ficariam de fora
 * e o site perderia o Bootstrap. Por isso montamos um dist/ com o site
 * completo, mantendo a mesma estrutura de pastas do repositório.
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
const itens = ['app', 'assets', 'db', 'docs', 'README.md'];

for (const item of itens) {
  const de = path.join(raiz, item);
  if (!fs.existsSync(de)) {
    console.error(`✗ não encontrado: ${item} — rode "npm run copy-libs" e "npm run sass" antes.`);
    process.exitCode = 1;
    continue;
  }
  fs.cpSync(de, path.join(dist, item), { recursive: true });
  console.log(`✓ ${item}`);
}

// O GitHub Pages serve a raiz do site: redireciona para dentro de app/
const redirecionamento =
  '<!DOCTYPE html>\n' +
  '<html lang="pt-BR">\n' +
  '<head>\n' +
  '  <meta charset="utf-8" />\n' +
  '  <meta http-equiv="refresh" content="0; url=app/index.html" />\n' +
  '  <title>EstoqueFácil</title>\n' +
  '</head>\n' +
  '<body>\n' +
  '  <a href="app/index.html">Abrir o EstoqueFácil</a>\n' +
  '</body>\n' +
  '</html>\n';
fs.writeFileSync(path.join(dist, 'index.html'), redirecionamento);
console.log('✓ index.html (redirecionamento para app/)');
