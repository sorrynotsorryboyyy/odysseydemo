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
  tone?: 'transparent' | 'white' | 'paper' | 'sun' | 'teal' | 'coral' | 'ink' | 'night';
}) {
  // Les sections se distinguent par un aplat et un filet, pas par un
  // degrade : la rupture doit etre nette, comme un changement de cahier.
  /**
   * Aplats de section. La couleur remplace les images absentes : elle donne
   * le rythme de la page et distingue les moments du parcours.
   *
   * Contrastes vérifiés avec le texte qu'ils portent — encre sur les fonds
   * clairs, crème sur le bleu nuit.
   */
  const tones = {
    transparent: '',
    white: 'bg-white',
    paper: 'bg-paper',
    sun: 'bg-sun-100',
    teal: 'bg-accent-50',
    coral: 'bg-warm-50',
    ink: 'bg-ink text-cream',
    night: 'bg-night-900 text-cream',
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
  onDark = false,
}: {
  id?: string;
  eyebrow?: string;
  title: string;
  intro?: string;
  centered?: boolean;
  as?: 'h1' | 'h2' | 'h3';
  /** Inverse les couleurs de texte pour les sections à fond sombre. */
  onDark?: boolean;
}) {
  return (
    <div className={cn('mb-10 sm:mb-14', centered && 'text-center')}>
      {eyebrow ? (
        <p
          className={cn(
            'mb-4 flex items-center gap-3 text-xs font-bold uppercase tracking-[0.2em]',
            onDark ? 'text-sun-300' : 'text-accent-700',
            centered ? 'justify-center' : 'justify-start',
          )}
        >
          {centered ? (
            <span
              aria-hidden="true"
              className={cn('h-px w-8', onDark ? 'bg-sun-300/50' : 'bg-accent-700/40')}
            />
          ) : null}
          {eyebrow}
          <span
            aria-hidden="true"
            className={cn('h-px w-8', onDark ? 'bg-sun-300/50' : 'bg-accent-700/40')}
          />
        </p>
      ) : null}

      <Heading
        id={id}
        className={cn(
          'font-display font-bold',
          onDark ? 'text-cream' : 'text-ink',
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
            'mt-4 text-lg text-pretty',
            onDark ? 'text-cream/80' : 'text-ink-muted',
            centered && 'mx-auto max-w-2xl',
          )}
        >
          {intro}
        </p>
      ) : null}
    </div>
  );
}
