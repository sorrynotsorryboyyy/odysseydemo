import Image from 'next/image';

import { cn } from '@/lib/cn';

/**
 * Emplacement d'image produit : l'image si elle existe, un cadre vide sinon.
 *
 * Le cadre vide est assumé plutôt que rempli d'un visuel de substitution —
 * une image approximative dégrade la page davantage qu'un cadre honnête,
 * parce qu'elle se lit comme du contenu bâclé. C'est aussi pourquoi `src`
 * ne doit recevoir qu'une image qui montre réellement ce que le libellé
 * annonce : une scène d'illustration à la place d'un cahier d'activités
 * ferait passer un visuel pour un produit qu'il n'est pas.
 *
 * `next/image` sert du WebP redimensionné : les sources font quelques Mo,
 * le navigateur ne reçoit que ce dont il a besoin.
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
  src,
  sizes = '(max-width: 768px) 90vw, 45vw',
  priority = false,
}: {
  ratio?: keyof typeof ratios;
  /** Ce que l'image montre, ou montrera une fois disponible. */
  label?: string;
  className?: string;
  /** Chemin sous `public/`. Sans lui, le cadre reste vide. */
  src?: string;
  sizes?: string;
  priority?: boolean;
}) {
  if (src) {
    return (
      <div
        className={cn(
          'relative overflow-hidden rounded-xl shadow-card',
          ratios[ratio],
          className,
        )}
      >
        <Image
          src={src}
          // Décoratif : le texte voisin porte déjà l'information.
          alt=""
          fill
          sizes={sizes}
          className="object-cover"
          priority={priority}
        />
      </div>
    );
  }

  return (
    <div
      role="presentation"
      className={cn(
        'flex items-center justify-center rounded-xl border-2 border-dashed border-warm-200 bg-warm-25',
        ratios[ratio],
        className,
      )}
    >
      {label ? (
        <span className="px-4 text-center text-xs uppercase tracking-[0.12em] text-warm-700">
          {label}
        </span>
      ) : null}
    </div>
  );
}
