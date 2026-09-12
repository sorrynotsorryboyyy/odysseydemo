import { cn } from '@/lib/cn';

/**
 * Emplacement visuel en attendant les vraies illustrations.
 *
 * Chaque bloc respecte le ratio final et se remplace par une <Image> sans
 * toucher à la mise en page. La graine dérive la teinte du libellé, pour que
 * deux tuiles voisines ne soient jamais identiques.
 */
const palettes = [
  'from-accent-200 via-accent-100 to-cream-200',
  'from-warm-200 via-warm-100 to-cream-200',
  'from-accent-100 via-cream-200 to-warm-200',
  'from-cream-300 via-accent-100 to-accent-200',
  'from-warm-100 via-cream-200 to-accent-100',
  'from-accent-300 via-accent-100 to-warm-100',
] as const;

function paletteFor(seed: string): string {
  let hash = 0;
  for (let i = 0; i < seed.length; i += 1) {
    hash = (hash * 31 + seed.charCodeAt(i)) % 9973;
  }
  return palettes[hash % palettes.length];
}

export function Placeholder({
  seed = 'taletto',
  ratio = 'square',
  className,
  label,
  rounded = 'rounded-2xl',
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

  return (
    <div
      // Décoratif : le sens est porté par le texte voisin.
      role="presentation"
      className={cn(
        'relative overflow-hidden bg-gradient-to-br',
        paletteFor(seed),
        ratios[ratio],
        rounded,
        className,
      )}
    >
      {/* Formes douces, pour éviter un aplat plat. */}
      <span className="absolute -right-6 -top-8 h-24 w-24 rounded-full bg-white/40 blur-xl" />
      <span className="absolute bottom-[-2rem] left-[-1rem] h-28 w-28 rounded-full bg-white/30 blur-2xl" />

      {label ? (
        <span className="absolute inset-x-0 bottom-0 p-3 text-center text-xs font-medium text-ink/70">
          {label}
        </span>
      ) : null}
    </div>
  );
}

/** Pastille ronde pour les avatars de témoignage. */
export function AvatarPlaceholder({
  seed,
  initial,
  className,
}: {
  seed: string;
  initial: string;
  className?: string;
}) {
  return (
    <span
      role="presentation"
      className={cn(
        'inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br font-display text-lg font-bold text-ink/70',
        paletteFor(seed),
        className,
      )}
    >
      {initial}
    </span>
  );
}
