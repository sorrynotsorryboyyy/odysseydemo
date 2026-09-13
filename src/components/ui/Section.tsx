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
  tone?: 'transparent' | 'white' | 'paper' | 'soft' | 'coral' | 'ink';
}) {
  /**
   * Toutes les surfaces sont translucides : le champ coloré posé derrière la
   * page se voit au travers, sans que chaque section le redécoupe.
   *
   * Aucun ton n'est complètement transparent. Sur deux halos empilés le fond
   * atteint #fbc9bc, où `warm-700` tombe à 4.03 — sous le seuil AA. Un voile
   * blanc, même léger, ramène les sur-titres au-dessus de 4.5 tout en
   * laissant passer la couleur.
   *
   * `coral` est l'aplat soutenu, réservé à un seul moment par page : au-delà
   * il cesse d'être un accent. Le texte y reste encre.
   */
  const tones = {
    transparent: 'bg-white/35',
    white: 'bg-white/70',
    paper: 'bg-white/45',
    soft: 'bg-warm-50/55',
    coral: 'bg-warm-200/65',
    ink: 'bg-ink text-cream',
  } as const;

  return (
    <section
      aria-labelledby={labelledBy}
      className={cn(
        'py-12 sm:py-16',
        tones[tone],
        className,
      )}
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
  onColor = false,
}: {
  id?: string;
  eyebrow?: string;
  title: string;
  intro?: string;
  centered?: boolean;
  as?: 'h1' | 'h2' | 'h3';
  /** Inverse les couleurs de texte pour les sections à fond sombre. */
  onDark?: boolean;
  /**
   * Sur un aplat coloré moyen, le sur-titre passe en encre : la sarcelle
   * y tombe sous le seuil AA (3.64 sur corail, 4.34 sur sarcelle clair).
   */
  onColor?: boolean;
}) {
  return (
    <div className={cn('mb-8 sm:mb-10', centered && 'text-center')}>
      {eyebrow ? (
        <p
          className={cn(
            'mb-4 flex items-center gap-3 text-xs font-bold uppercase tracking-[0.2em]',
            onDark ? 'text-warm-300' : onColor ? 'text-ink' : 'text-warm-700',
            centered ? 'justify-center' : 'justify-start',
          )}
        >
          {centered ? (
            <span
              aria-hidden="true"
              className={cn(
                'h-0.5 w-8',
                onDark ? 'bg-warm-300/60' : onColor ? 'bg-ink' : 'bg-warm-700/40',
              )}
            />
          ) : null}
          {eyebrow}
          <span
            aria-hidden="true"
            className={cn(
              'h-0.5 w-8',
              onDark ? 'bg-warm-300/60' : onColor ? 'bg-ink' : 'bg-warm-700/40',
            )}
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
