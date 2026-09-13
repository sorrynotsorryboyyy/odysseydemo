import { cn } from '@/lib/cn';

/**
 * Emplacement réservé à une image de produit.
 *
 * Assumé comme vide plutôt que rempli d'un visuel de substitution : une
 * illustration approximative dégrade la page davantage qu'un cadre honnête,
 * parce qu'elle se lit comme du contenu bâclé.
 *
 * Remplacer par une `<img>` ou `next/image` dès que les vraies couvertures
 * sont disponibles — les ratios ci-dessous correspondent à ce qui est
 * attendu à chaque emplacement.
 */

const ratios = {
  /** Couverture de livre, format A5 portrait. */
  book: 'aspect-[3/4]',
  square: 'aspect-square',
  wide: 'aspect-[3/2]',
} as const;

export function ImageSlot({
  ratio = 'book',
  label,
  className,
}: {
  ratio?: keyof typeof ratios;
  /** Ce que l'image montrera, une fois disponible. */
  label?: string;
  className?: string;
}) {
  return (
    <div
      role="presentation"
      className={cn(
        'flex items-center justify-center border border-dashed border-ink/20 bg-cream-50',
        ratios[ratio],
        className,
      )}
    >
      {label ? (
        <span className="px-4 text-center text-xs uppercase tracking-[0.12em] text-ink-soft">
          {label}
        </span>
      ) : null}
    </div>
  );
}
