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
  white: '#ffffff',
  'warm-25': '#fffaf8',
  'warm-50': '#fef3f0',
  'warm-100': '#fde3dc',
  'warm-200': '#fbc7ba',
  'warm-700': '#b23a1c',
  'warm-800': '#8f2f16',
  'warm-900': '#701f0c',
  cream: '#faf8f0',
  'cream-200': '#f3eede',
  ink: '#1a1a1a',
  'ink-muted': '#52525b',
  'ink-soft': '#6b6b74',
  'accent-50': '#f0fdfa',
  'accent-100': '#ccfbf1',
  'accent-900': '#134e4a',
  'danger-50': '#fef2f2',
  'danger-700': '#b91c1c',
  'danger-900': '#7f1d1d',
};

/** Couples effectivement rendus : [texte, fond, où]. */
const PAIRS = [
  ['ink', 'white', 'texte courant sur blanc'],
  ['ink', 'warm-25', 'texte sur section pâle'],
  ['ink', 'warm-50', 'texte sur bloc pâle'],
  ['ink', 'warm-200', 'texte sur aplat corail'],
  ['ink-muted', 'white', 'texte secondaire sur blanc'],
  ['ink-muted', 'warm-25', 'texte secondaire sur section pâle'],
  ['ink-soft', 'white', 'placeholder de champ'],
  ['warm-700', 'white', 'sur-titre et lien corail'],
  ['warm-700', 'warm-25', 'sur-titre sur section pâle'],
  ['warm-700', 'warm-50', "libellé d'emplacement vide"],
  ['white', 'warm-700', 'bouton principal'],
  ['white', 'warm-800', 'bouton principal au survol'],
  ['white', 'danger-700', 'bouton destructif'],
  ['warm-900', 'warm-100', 'badge corail'],
  ['accent-900', 'accent-100', 'badge sarcelle'],
  ['accent-900', 'accent-50', "message d'information"],
  ['danger-900', 'danger-50', "message d'erreur"],
  ['ink', 'cream-200', 'badge neutre'],
  ['cream', 'ink', 'texte sur aplat encre'],
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
