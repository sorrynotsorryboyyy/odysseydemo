import { cn } from '@/lib/cn';

/**
 * Jeu d'icônes SVG inline : aucune dépendance, aucun appel réseau.
 * Décoratives par défaut — le sens est porté par le texte voisin.
 */
export type IconName =
  | 'check'
  | 'download'
  | 'sparkle'
  | 'book'
  | 'printer'
  | 'palette'
  | 'heart'
  | 'shield'
  | 'clock'
  | 'infinity'
  | 'arrow-right'
  | 'x'
  | 'menu'
  | 'star';

const paths: Record<IconName, string> = {
  check: 'M4 12.5l5 5L20 6.5',
  download: 'M12 3v12m0 0l-4-4m4 4l4-4M4 17v2a2 2 0 002 2h12a2 2 0 002-2v-2',
  sparkle: 'M12 3l2.2 5.8L20 11l-5.8 2.2L12 19l-2.2-5.8L4 11l5.8-2.2L12 3z',
  book: 'M4 5a2 2 0 012-2h12v18H6a2 2 0 01-2-2V5zm4 0v14',
  printer: 'M7 8V4h10v4M7 16H5a2 2 0 01-2-2v-3a2 2 0 012-2h14a2 2 0 012 2v3a2 2 0 01-2 2h-2m-10 0v5h10v-5',
  palette:
    'M12 21a9 9 0 110-18c4.97 0 9 3.58 9 8 0 2.2-1.8 4-4 4h-1.5a1.5 1.5 0 00-1.06 2.56A1.5 1.5 0 0112 21z',
  heart: 'M12 20s-7-4.6-7-9.4A4.1 4.1 0 0112 8a4.1 4.1 0 017 2.6C19 15.4 12 20 12 20z',
  shield: 'M12 3l8 3v6c0 4.5-3.2 7.9-8 9-4.8-1.1-8-4.5-8-9V6l8-3z',
  clock: 'M12 7v5l3 2M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
  infinity:
    'M7 12c0-2 1.4-3 3-3s2.5 1.5 4 3 2.4 3 4 3 3-1 3-3-1.4-3-3-3-2.5 1.5-4 3-2.4 3-4 3-3-1-3-3z',
  'arrow-right': 'M5 12h14m0 0l-6-6m6 6l-6 6',
  x: 'M6 6l12 12M18 6L6 18',
  menu: 'M4 7h16M4 12h16M4 17h16',
  star: 'M12 3.5l2.6 5.6 6 .8-4.4 4.2 1.1 6-5.3-2.9-5.3 2.9 1.1-6L3.4 9.9l6-.8L12 3.5z',
};

export function Icon({
  name,
  className,
  filled = false,
}: {
  name: IconName;
  className?: string;
  filled?: boolean;
}) {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      viewBox="0 0 24 24"
      fill={filled ? 'currentColor' : 'none'}
      stroke={filled ? 'none' : 'currentColor'}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn('h-5 w-5 shrink-0', className)}
    >
      <path d={paths[name]} />
    </svg>
  );
}

/** Icône dans une pastille colorée, pour les grilles de bénéfices. */
export function IconBubble({
  name,
  tone = 'accent',
  className,
}: {
  name: IconName;
  tone?: 'accent' | 'warm' | 'ink';
  className?: string;
}) {
  const tones = {
    accent: 'bg-accent-100 text-accent-700',
    warm: 'bg-warm-100 text-warm-700',
    ink: 'bg-ink/5 text-ink',
  } as const;

  return (
    <span
      className={cn(
        'inline-flex h-12 w-12 items-center justify-center rounded-2xl',
        tones[tone],
        className,
      )}
    >
      <Icon name={name} className="h-6 w-6" />
    </span>
  );
}
