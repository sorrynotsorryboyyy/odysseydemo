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
        // La structure vient du trait et de l'ombre portee, jamais du flou.
        'border-2 border-ink bg-white p-6 shadow-ink-sm',
        interactive &&
          'transition-[transform,box-shadow] duration-150 hover:-translate-x-px hover:-translate-y-px hover:shadow-ink',
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
  const tones = {
    accent: 'bg-accent-200 text-ink border-ink',
    warm: 'bg-warm-200 text-ink border-ink',
    neutral: 'bg-cream-200 text-ink border-ink',
  } as const;

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-md border-2 px-2.5 py-1 text-xs font-bold uppercase tracking-[0.1em]',
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
