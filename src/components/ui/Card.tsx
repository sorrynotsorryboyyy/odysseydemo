import type { ElementType, ReactNode } from 'react';

import { cn } from '@/lib/cn';

/** Surface blanche arrondie, base de toutes les grilles de contenu. */
export function Card({
  children,
  className,
  as: Tag = 'div',
  interactive = false,
  labelledBy,
}: {
  children: ReactNode;
  className?: string;
  as?: ElementType;
  interactive?: boolean;
  labelledBy?: string;
}) {
  return (
    <Tag
      aria-labelledby={labelledBy}
      className={cn(
        // La carte se détache par l'ombre, pas par un cerne : sur fond pâle
        // le blanc suffit à la séparer du fond.
        'rounded-xl bg-white/80 p-6 shadow-card',
        interactive &&
          'transition-[transform,box-shadow] duration-200 hover:-translate-y-1 hover:shadow-card-hover',
        className,
      )}
    >
      {children}
    </Tag>
  );
}

export function Badge({
  children,
  tone = 'accent',
  className,
}: {
  children: ReactNode;
  tone?: 'accent' | 'warm' | 'neutral';
  className?: string;
}) {
  // Pastille pleine, sans cerne : la couleur seule porte la distinction.
  const tones = {
    accent: 'bg-accent-100 text-accent-900',
    warm: 'bg-warm-100 text-warm-900',
    neutral: 'bg-cream-200 text-ink',
  } as const;

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-pill px-3 py-1 text-xs font-bold uppercase tracking-[0.1em]',
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
