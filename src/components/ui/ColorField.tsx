import { cn } from '@/lib/cn';

/**
 * Champ coloré continu, posé derrière toute une page.
 *
 * Un halo par section serait coupé net à chaque frontière — c'est ce que
 * produisait une version précédente, avec une ligne horizontale visible là
 * où deux `overflow-hidden` se touchaient. Le champ est donc unique, en
 * `fixed`, et ne connaît pas le découpage en sections.
 *
 * `fixed` plutôt qu'`absolute` : la couleur reste stable pendant qu'on fait
 * défiler, au lieu de défiler avec le contenu. C'est aussi ce qui évite de
 * peindre une zone aussi haute que la page entière.
 *
 * La base n'est pas blanche mais crème très légèrement teintée : un blanc
 * pur entre deux halos crée des zones mortes, et c'est ce qui donnait
 * l'impression de vide. Les halos sont assez larges pour se recouvrir —
 * il ne doit jamais rester de trou entre deux.
 *
 * Purement décoratif, donc `aria-hidden` et hors du flux. Le contraste du
 * texte est calculé sur le fond réel, halo compris : voir
 * `scripts/check-contrast.mjs`.
 */

const palettes = {
  /** Corail dominant, sarcelle et jaune en contrepoint. */
  warm: [
    { tone: 'bg-warm-300/55', at: '-left-[15%] -top-[10%] h-[50rem] w-[50rem]', drift: 'animate-drift' },
    { tone: 'bg-sun-200/50', at: '-right-[10%] top-[5%] h-[42rem] w-[42rem]', drift: 'animate-drift-slow' },
    { tone: 'bg-accent-200/45', at: 'left-[20%] top-[35%] h-[45rem] w-[45rem]', drift: 'animate-drift' },
    { tone: 'bg-warm-200/60', at: '-right-[12%] bottom-[10%] h-[44rem] w-[44rem]', drift: 'animate-drift-slow' },
    { tone: 'bg-sun-100/60', at: '-left-[10%] -bottom-[12%] h-[40rem] w-[40rem]', drift: 'animate-drift' },
  ],
  /** Plus sobre : pages de lecture dense, formulaires. */
  quiet: [
    { tone: 'bg-warm-200/40', at: '-left-[12%] -top-[8%] h-[42rem] w-[42rem]', drift: 'animate-drift' },
    { tone: 'bg-sun-100/45', at: '-right-[10%] top-[30%] h-[38rem] w-[38rem]', drift: 'animate-drift-slow' },
    { tone: 'bg-warm-100/60', at: 'left-[25%] -bottom-[10%] h-[40rem] w-[40rem]', drift: 'animate-drift' },
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
        'pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-warm-25',
        className,
      )}
    >
      {palettes[palette].map((blob, index) => (
        <span
          key={index}
          className={cn(
            'absolute rounded-full blur-[110px] will-change-transform',
            blob.tone,
            blob.at,
            blob.drift,
          )}
        />
      ))}
    </div>
  );
}
