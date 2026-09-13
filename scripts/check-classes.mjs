/**
 * Vérifie que chaque classe utilitaire écrite dans le source existe bien
 * dans le CSS produit par le build.
 *
 * Tailwind ignore silencieusement une classe inconnue : ni `tsc` ni ESLint
 * ne voient la faute, parce qu'une `className` reste une chaîne valide.
 * Une coquille comme `shadow-lifteded` se traduit alors par une absence
 * d'ombre en production, sans le moindre avertissement — d'où ce contrôle.
 *
 * Usage : npm run build && node scripts/check-classes.mjs
 */
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const CSS_DIR = '.next/static/css';

/**
 * Familles surveillées : celles qui portent le registre visuel.
 *
 * Les valeurs arbitraires entre crochets sont exclues — leur contenu peut
 * renfermer virgules et espaces (`transition-[transform,box-shadow]`), ce
 * qu'un découpage sur les mots tronquerait en faux positifs.
 */
const PATTERN =
  /(?:[a-z-]+:)*(?:shadow|border|bg|text|ring)-(?!\[)[a-z0-9/-]+/g;

/**
 * Classes sans déclaration CSS propre, absentes par construction : Tailwind
 * les rend via des variables portées par une autre classe, ou ne génère la
 * variante que si elle est réellement employée seule.
 */
const EXPECTED_ABSENT = new Set(['border-transparent', 'shadow-none', 'border-0']);

function walk(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    return entry.isDirectory() ? walk(path) : path.endsWith('.tsx') ? [path] : [];
  });
}

const sheets = readdirSync(CSS_DIR).filter((file) => file.endsWith('.css'));
if (sheets.length === 0) {
  console.error('Aucune feuille dans %s — lancer `npm run build` d’abord.', CSS_DIR);
  process.exit(1);
}
const css = sheets.map((file) => readFileSync(join(CSS_DIR, file), 'utf8')).join('\n');

/**
 * Les valeurs arbitraires sont retirées avant le scan : leur contenu cite des
 * propriétés CSS (`transition-[…,border-color]`) que le motif prendrait
 * autrement pour des classes.
 */
const stripArbitrary = (source) => source.replace(/\[[^\]]*\]/g, '[]');

const used = new Set();
for (const file of walk('src')) {
  const source = stripArbitrary(readFileSync(file, 'utf8'));
  for (const cls of source.match(PATTERN) ?? []) used.add(cls);
}

// Dans le CSS, Tailwind échappe « : », « / », « [ » et « ] » d'un antislash.
const BACKSLASH = String.fromCharCode(92);
const escape = (cls) => '.' + cls.replace(/[:/[\]]/g, (ch) => BACKSLASH + ch);

const dead = [...used]
  .filter((cls) => {
    const bare = cls.replace(/^[a-z-]+:/, '');
    return !EXPECTED_ABSENT.has(bare) && !css.includes(escape(cls));
  })
  .sort();

if (dead.length > 0) {
  console.error('Classes absentes du CSS généré :');
  for (const cls of dead) console.error('  %s', cls);
  console.error(
    '\nSoit la classe est mal orthographiée, soit le token manque dans tailwind.config.ts.',
  );
  process.exit(1);
}

console.log('%d classes utilitaires vérifiées, toutes présentes.', used.size);
