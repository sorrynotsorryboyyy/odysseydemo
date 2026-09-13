import Image from 'next/image';

import { ImageSlot } from './ImageSlot';

/**
 * Illustration d'un style, avec repli.
 *
 * Les visuels arrivent par vagues : tant qu'un style n'a pas le sien, on
 * affiche l'emplacement vide plutôt qu'une image de substitution. La liste
 * ci-dessous est la seule chose à compléter quand un fichier est ajouté
 * dans `public/images/`.
 *
 * `next/image` sert du WebP redimensionné : les sources font quelques Mo,
 * le navigateur ne reçoit que ce dont il a besoin.
 */
const available: Record<string, string> = {
  aquarelle: '/images/style-aquarelle.png',
  'ligne-claire': '/images/style-ligne-claire.png',
  'papier-decoupe': '/images/style-papier-decoupe.png',
};

/** Un style a-t-il son illustration ? Sert à ordonner la galerie. */
export function hasStyleImage(style: string): boolean {
  return style in available;
}

export function StyleImage({ style, label }: { style: string; label: string }) {
  const source = available[style];

  if (!source) return <ImageSlot ratio="wide" label={label} />;

  return (
    <div className="relative aspect-[3/2] overflow-hidden rounded-lg border border-warm-100">
      <Image
        src={source}
        // Décoratif : la légende voisine porte déjà le nom du style.
        alt=""
        fill
        // Deux colonnes sous `md`, trois au-delà : le navigateur choisit
        // la taille utile plutôt que de charger la source entière.
        sizes="(max-width: 768px) 50vw, 33vw"
        className="object-cover"
      />
    </div>
  );
}
