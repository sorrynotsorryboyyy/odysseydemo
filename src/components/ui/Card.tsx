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
        'border border-ink/15 bg-white p-6 shadow-print',
        interactive &&
          'transition-[transform,box-shadow] duration-150 hover:-translate-x-px hover:-translate-y-px hover:shadow-lifteded',
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
    accent: 'bg-accent-100 text-accent-800 border-accent-800/25',
    warm: 'bg-warm-100 text-warm-800 border-warm-800/25',
    neutral: 'bg-ink/5 text-ink-muted border-ink/20',
  } as const;

  return (
    <span
      className={cn(
        'inline-flex items-center border px-2.5 py-1 text-xs font-semibold uppercase tracking-[0.12em]',
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
