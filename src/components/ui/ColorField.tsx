import { cn } from '@/lib/cn';

/**
 * Fond coloré vivant : deux ou trois halos qui dérivent lentement.
 *
 * Purement décoratif, donc `aria-hidden` et jamais dans le flux. Les halos
 * sont des `radial-gradient` en opacité faible : sur un fond blanc ils
 * donnent une couleur d'ambiance sans jamais concurrencer le texte, et le
 * contraste des couples texte/fond reste celui du fond de base.
 *
 * Les durées sont très longues (26 à 38 s) — un mouvement de fond doit se
 * sentir sans se regarder. `prefers-reduced-motion` les fige globalement
 * depuis `globals.css`.
 */

const palettes = {
  /** Corail dominant : accueil, pages produit. */
  warm: [
    'bg-warm-200/55',
    'bg-warm-100/70',
    'bg-sun-200/40',
  ],
  /** Corail et sarcelle : sections de découverte. */
  duo: [
    'bg-warm-200/50',
    'bg-accent-200/40',
    'bg-sun-200/35',
  ],
  /** Très discret : pages de lecture dense. */
  quiet: ['bg-warm-100/60', 'bg-warm-50/80'],
} as const;

export function ColorField({
  palette = 'warm',
  className,
}: {
  palette?: keyof typeof palettes;
  className?: string;
}) {
  const blobs = palettes[palette];

  // Positions et tailles fixes : une disposition aléatoire changerait à
  // chaque rendu et empêcherait de juger la composition.
  const layout = [
    'left-[-12%] top-[-18%] h-[34rem] w-[34rem] animate-drift',
    'right-[-14%] top-[8%] h-[28rem] w-[28rem] animate-drift-slow',
    'bottom-[-20%] left-[28%] h-[26rem] w-[26rem] animate-drift',
  ];

  return (
    <div
      aria-hidden="true"
      className={cn('pointer-events-none absolute inset-0 overflow-hidden', className)}
    >
      {blobs.map((tone, index) => (
        <span
          key={index}
          className={cn(
            'absolute rounded-full blur-3xl will-change-transform',
            tone,
            layout[index],
          )}
        />
      ))}
    </div>
  );
}
