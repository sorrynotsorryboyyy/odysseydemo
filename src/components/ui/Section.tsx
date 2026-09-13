import type { ReactNode } from 'react';

import { Container } from './Container';
import { cn } from '@/lib/cn';

/** Rythme vertical homogène entre les sections de page. */
export function Section({
  children,
  className,
  containerClassName,
  size = 'default',
  labelledBy,
  tone = 'transparent',
}: {
  children: ReactNode;
  className?: string;
  containerClassName?: string;
  size?: 'default' | 'narrow' | 'wide';
  labelledBy?: string;
  tone?: 'transparent' | 'white' | 'ink' | 'accent' | 'paper';
}) {
  // Les sections se distinguent par un aplat et un filet, pas par un
  // degrade : la rupture doit etre nette, comme un changement de cahier.
  const tones = {
    transparent: '',
    white: 'border-y border-ink/10 bg-white',
    ink: 'border-y border-ink bg-ink text-cream',
    accent: 'border-y border-accent-700/20 bg-accent-50',
    paper: 'border-y border-ink/10 bg-paper',
  } as const;

  return (
    <section
      aria-labelledby={labelledBy}
      className={cn('py-14 sm:py-20', tones[tone], className)}
    >
      <Container size={size} className={containerClassName}>
        {children}
      </Container>
    </section>
  );
}

/** En-tête de section : sur-titre optionnel, titre, chapô. */
export function SectionHeading({
  id,
  eyebrow,
  title,
  intro,
  centered = true,
  as: Heading = 'h2',
}: {
  id?: string;
  eyebrow?: string;
  title: string;
  intro?: string;
  centered?: boolean;
  as?: 'h1' | 'h2' | 'h3';
}) {
  return (
    <div className={cn('mb-10 sm:mb-14', centered && 'text-center')}>
      {eyebrow ? (
        <p
          className={cn(
            'mb-4 flex items-center gap-3 text-xs font-bold uppercase tracking-[0.2em] text-accent-700',
            centered ? 'justify-center' : 'justify-start',
          )}
        >
          {centered ? <span aria-hidden="true" className="h-px w-8 bg-accent-700/40" /> : null}
          {eyebrow}
          <span aria-hidden="true" className="h-px w-8 bg-accent-700/40" />
        </p>
      ) : null}

      <Heading
        id={id}
        className={cn(
          'font-display font-bold text-ink',
          Heading === 'h1'
            ? 'text-4xl sm:text-5xl lg:text-6xl'
            : 'text-3xl sm:text-4xl',
        )}
      >
        {title}
      </Heading>

      {intro ? (
        <p
          className={cn(
            'mt-4 text-lg text-ink-muted text-pretty',
            centered && 'mx-auto max-w-2xl',
          )}
        >
          {intro}
        </p>
      ) : null}
    </div>
  );
}
