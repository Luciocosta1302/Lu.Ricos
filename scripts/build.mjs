/* Copia apenas os arquivos públicos do site para _site/ (pasta publicada pelo Netlify).
   Assim node_modules, testes e o código do servidor não ficam acessíveis pela web. */
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const out = path.join(root, '_site');
fs.rmSync(out, { recursive: true, force: true });
fs.mkdirSync(out);
for (const f of fs.readdirSync(root)) {
  if (f.endsWith('.html') || f === '.nojekyll') fs.copyFileSync(path.join(root, f), path.join(out, f));
}
fs.cpSync(path.join(root, 'assets'), path.join(out, 'assets'), { recursive: true });
console.log('Site copiado para _site/');
