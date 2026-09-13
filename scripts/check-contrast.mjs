/**
 * Vérifie le contraste WCAG des couples texte/fond réellement employés.
 *
 * Seuls les couples qui existent dans les pages sont listés : un ratio
 * calculé sur une combinaison jamais affichée ne prouve rien.
 *
 * Usage : node scripts/check-contrast.mjs
 */

/** Tokens de tailwind.config.ts, tenus à jour manuellement. */
const C = {
  cream: '#faf8f0',
  'cream-50': '#fdfcf8',
  'cream-100': '#faf8f0',
  'cream-200': '#f3eede',
  white: '#ffffff',
  paper: '#f4f1e6',
  ink: '#1a1a1a',
  'ink-muted': '#52525b',
  'ink-soft': '#6b6b74',
  'accent-200': '#99f6e4',
  'accent-500': '#14b8a6',
  'accent-600': '#0d9488',
  'accent-700': '#0f766e',
  'warm-200': '#fbc7ba',
  'warm-700': '#b23a1c',
  'sun-200': '#fde68a',
  'danger-700': '#b91c1c',
};

/** Couples effectivement rendus : [texte, fond, où]. */
const PAIRS = [
  ['ink', 'cream', 'texte courant sur crème'],
  ['ink', 'white', 'texte sur carte'],
  ['ink', 'paper', 'texte sur section papier'],
  ['ink-muted', 'cream', 'texte secondaire sur crème'],
  ['ink-muted', 'white', 'texte secondaire sur carte'],
  ['ink-soft', 'white', 'placeholder de champ'],
  ['accent-700', 'cream', 'sur-titre sur crème'],
  ['accent-700', 'white', 'sur-titre sur carte'],
  ['warm-700', 'cream', 'accent chaud sur crème'],
  ['ink', 'accent-500', 'bouton primaire'],
  ['ink', 'accent-200', 'aplat sarcelle « en 3 étapes »'],
  ['ink', 'warm-200', 'aplat corail « galerie de styles »'],
  ['ink', 'sun-200', 'aplat jaune'],
  ['ink', 'cream-200', 'badge neutre'],
  ['cream', 'ink', 'texte sur aplat encre'],
  ['cream', 'danger-700', 'bouton destructif'],
  ['ink', 'cream-50', 'bloc de liste sur /pack'],
];

/** Seuil AA : 4.5 pour le texte courant, 3.0 pour le grand texte. */
const AA = 4.5;

function luminance(hex) {
  const channels = [1, 3, 5].map((i) => {
    const v = parseInt(hex.slice(i, i + 2), 16) / 255;
    return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
}

function ratio(a, b) {
  const [x, y] = [luminance(a), luminance(b)].sort((m, n) => n - m);
  return (x + 0.05) / (y + 0.05);
}

let failures = 0;
const rows = PAIRS.map(([fg, bg, where]) => {
  if (!C[fg] || !C[bg]) {
    console.error('Token inconnu : %s ou %s', fg, bg);
    process.exit(1);
  }
  const value = ratio(C[fg], C[bg]);
  const pass = value >= AA;
  if (!pass) failures += 1;
  return { fg, bg, where, value, pass };
});

for (const r of rows.sort((a, b) => a.value - b.value)) {
  console.log(
    '  %s %s  %s sur %s — %s',
    r.pass ? 'OK  ' : 'ECHEC',
    r.value.toFixed(2).padStart(5),
    r.fg.padEnd(10),
    r.bg.padEnd(11),
    r.where,
  );
}

console.log(
  '\n%d couples vérifiés, seuil AA %s.%s',
  rows.length,
  AA,
  failures ? ` ${failures} EN ECHEC.` : ' Tous conformes.',
);

process.exit(failures ? 1 : 0);
