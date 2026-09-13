import { cn } from '@/lib/cn';

/**
 * Champ coloré continu, posé derrière toute une page.
 *
 * Un halo par section serait coupé net à chaque frontière — c'est ce que
 * produisait la version précédente, avec une ligne horizontale visible là où
 * deux `overflow-hidden` se touchaient. Le champ est donc unique, en
 * `fixed`, et ne connaît pas le découpage en sections.
 *
 * `fixed` plutôt qu'`absolute` : la couleur reste stable pendant qu'on fait
 * défiler, au lieu de défiler avec le contenu. C'est aussi ce qui évite de
 * peindre une zone aussi haute que la page entière.
 *
 * Purement décoratif, donc `aria-hidden` et hors du flux. Les halos sont
 * très dilués : sur le blanc ils donnent une ambiance sans jamais changer
 * le contraste du texte, qui reste celui du fond de base.
 */

const palettes = {
  /** Corail dominant, une pointe de sarcelle : registre par défaut. */
  warm: [
    { tone: 'bg-warm-200/40', at: 'left-[-20%] top-[-10%] h-[45rem] w-[45rem]', drift: 'animate-drift' },
    { tone: 'bg-sun-200/30', at: 'right-[-15%] top-[20%] h-[38rem] w-[38rem]', drift: 'animate-drift-slow' },
    { tone: 'bg-accent-200/25', at: 'bottom-[-15%] left-[15%] h-[40rem] w-[40rem]', drift: 'animate-drift' },
    { tone: 'bg-warm-100/50', at: 'bottom-[5%] right-[5%] h-[32rem] w-[32rem]', drift: 'animate-drift-slow' },
  ],
  /** Très discret : pages de lecture dense, formulaires. */
  quiet: [
    { tone: 'bg-warm-100/45', at: 'left-[-15%] top-[-5%] h-[38rem] w-[38rem]', drift: 'animate-drift' },
    { tone: 'bg-warm-50/60', at: 'bottom-[-10%] right-[-10%] h-[34rem] w-[34rem]', drift: 'animate-drift-slow' },
  ],
} as const;

export function ColorField({
  palette = 'warm',
  className,
}: {
  palette?: keyof typeof palettes;
  className?: string;
}) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        'pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-white',
        className,
      )}
    >
      {palettes[palette].map((blob, index) => (
        <span
          key={index}
          className={cn(
            'absolute rounded-full blur-[100px] will-change-transform',
            blob.tone,
            blob.at,
            blob.drift,
          )}
        />
      ))}
    </div>
  );
}
