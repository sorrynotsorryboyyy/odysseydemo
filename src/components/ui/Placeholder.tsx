import { cn } from '@/lib/cn';

/**
 * Emplacement visuel en attendant les vraies illustrations.
 *
 * Motifs imprimés — trames, hachures, quadrillages — plutôt que dégradés :
 * un aplat tramé se lit comme une réserve d'imprimeur, pas comme une image
 * ratée. Chaque bloc respecte le ratio final et se remplace par une
 * `<Image>` sans toucher à la mise en page.
 */

/** Teintes d'encre, en aplat franc. */
const inks = [
  { fill: '#0f766e', tint: '#ccfbf1' },
  { fill: '#b23a1c', tint: '#fde3dc' },
  { fill: '#115e59', tint: '#f0fdfa' },
  { fill: '#8f2f16', tint: '#fbc7ba' },
] as const;

type PatternKind = 'dots' | 'lines' | 'grid' | 'rings';
const patterns: PatternKind[] = ['dots', 'lines', 'grid', 'rings'];

/** Dérive un index stable à partir d'une graine textuelle. */
function hash(seed: string): number {
  let value = 0;
  for (let index = 0; index < seed.length; index += 1) {
    value = (value * 31 + seed.charCodeAt(index)) % 9973;
  }
  return value;
}

/** Motif SVG encodé en URI, utilisable comme fond CSS. */
function patternUrl(kind: PatternKind, color: string): string {
  const shapes: Record<PatternKind, string> = {
    dots: `<circle cx="8" cy="8" r="2.2" fill="${color}"/>`,
    lines: `<path d="M0 16 L16 0" stroke="${color}" stroke-width="2"/>`,
    grid: `<path d="M0 0 H16 M0 0 V16" stroke="${color}" stroke-width="1.2" fill="none"/>`,
    rings: `<circle cx="8" cy="8" r="5.5" stroke="${color}" stroke-width="1.6" fill="none"/>`,
  };

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16">${shapes[kind]}</svg>`;
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
}

export function Placeholder({
  seed = 'taletto',
  ratio = 'square',
  className,
  label,
  rounded = '',
}: {
  seed?: string;
  ratio?: 'square' | 'book' | 'wide' | 'portrait';
  className?: string;
  label?: string;
  rounded?: string;
}) {
  const ratios = {
    square: 'aspect-square',
    book: 'aspect-[3/4]',
    wide: 'aspect-[16/10]',
    portrait: 'aspect-[4/5]',
  } as const;

  const index = hash(seed);
  const ink = inks[index % inks.length]!;
  const pattern = patterns[Math.floor(index / 7) % patterns.length]!;

  return (
    <div
      // Décoratif : le sens est porté par le texte voisin.
      role="presentation"
      className={cn(
        'relative overflow-hidden border-2 border-ink',
        ratios[ratio],
        rounded,
        className,
      )}
      style={{ backgroundColor: ink.tint }}
    >
      <span
        aria-hidden="true"
        className="absolute inset-0"
        style={{ backgroundImage: patternUrl(pattern, ink.fill), opacity: 0.55 }}
      />

      {/* Filet intérieur : cadre de composition, comme une maquette. */}
      <span
        aria-hidden="true"
        className="absolute inset-3 border border-dashed"
        style={{ borderColor: `${ink.fill}44` }}
      />

      {label ? (
        <span className="absolute inset-x-0 bottom-0 bg-white/85 px-3 py-2 text-center text-xs font-medium uppercase tracking-[0.1em] text-ink">
          {label}
        </span>
      ) : null}
    </div>
  );
}

/** Pastille ronde pour les avatars — le cercle a ici un sens. */
export function AvatarPlaceholder({
  seed,
  initial,
  className,
}: {
  seed: string;
  initial: string;
  className?: string;
}) {
  const ink = inks[hash(seed) % inks.length]!;

  return (
    <span
      role="presentation"
      className={cn(
        'inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border font-display text-base font-bold',
        className,
      )}
      style={{ backgroundColor: ink.tint, borderColor: ink.fill, color: ink.fill }}
    >
      {initial}
    </span>
  );
}
