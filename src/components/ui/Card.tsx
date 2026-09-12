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
        'rounded-2xl bg-white p-6 shadow-soft ring-1 ring-ink/5',
        interactive && 'transition-shadow duration-200 hover:shadow-lift',
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
    accent: 'bg-accent-100 text-accent-800',
    warm: 'bg-warm-100 text-warm-800',
    neutral: 'bg-ink/5 text-ink-muted',
  } as const;

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide',
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
