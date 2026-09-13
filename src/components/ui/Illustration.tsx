import { cn } from '@/lib/cn';

/**
 * Illustration de section.
 *
 * Chaque visuel est un fichier autonome de `public/illustrations/`. Pour le
 * remplacer, il suffit d'écraser le fichier par le sien — même nom, même
 * ratio — sans toucher au code.
 *
 * Volontairement une balise `<img>` et non `next/image` : ces SVG pèsent
 * environ 1 Ko, l'optimisation d'image n'aurait rien à optimiser et
 * ajouterait un aller-retour serveur.
 */

const ratios = {
  hero: 'aspect-[4/3]',
  square: 'aspect-square',
  wide: 'aspect-[3/2]',
  book: 'aspect-[3/4]',
} as const;

export function Illustration({
  name,
  alt,
  ratio = 'square',
  className,
  priority = false,
}: {
  /** Nom du fichier sans extension, ex. `hero` ou `age-3-5`. */
  name: string;
  /**
   * Texte alternatif. Vide pour un visuel décoratif dont le sens est déjà
   * porté par le texte voisin — un lecteur d'écran le passera alors.
   */
  alt: string;
  ratio?: keyof typeof ratios;
  className?: string;
  priority?: boolean;
}) {
  return (
    /* eslint-disable-next-line @next/next/no-img-element --
       SVG de ~1 Ko : `next/image` n'aurait rien à optimiser et ajouterait
       un aller-retour serveur pour rien. */
    <img
      src={`/illustrations/${name}.svg`}
      alt={alt}
      // `alt` vide : l'image est décorative, on la retire de l'arbre
      // d'accessibilité plutôt que de laisser un nœud sans nom.
      aria-hidden={alt === '' ? true : undefined}
      loading={priority ? 'eager' : 'lazy'}
      decoding="async"
      className={cn('w-full object-cover', ratios[ratio], className)}
    />
  );
}
