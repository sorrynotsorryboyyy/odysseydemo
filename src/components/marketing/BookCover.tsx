import Image from 'next/image';

import { Icon } from '@/components/ui';

/**
 * Livre en perspective, qui s'ouvre au survol.
 *
 * CSS pur, aucune bibliothèque : la couverture pivote sur sa reliure grâce
 * à `transform-origin` et `rotateY`. L'objet reste donc parfaitement
 * lisible sans JavaScript.
 *
 * Trois points qui font ou défont l'illusion :
 *
 * - Au repos le livre est *fermé*. Une couverture déjà entrouverte laisse
 *   dépasser la page intérieure, qu'on lit alors comme un rectangle blanc
 *   collé derrière l'objet.
 * - Les pages sont légèrement plus petites que la couverture (`inset-y-2`,
 *   décalées à droite) : dans un vrai livre la couverture déborde sur la
 *   tranche. À taille égale elles dépassent, d'autant plus que le bloc est
 *   incliné.
 * - La couverture porte `backface-visibility: hidden` — sans quoi on verrait
 *   son dos en miroir une fois passé 90°.
 *
 * `prefers-reduced-motion` est déjà neutralisé globalement dans
 * `globals.css` : le livre s'affiche alors fermé et immobile.
 */

/**
 * Couverture réelle d'un livre produit. Le dos rouge y est déjà peint, d'où
 * l'absence de tranche CSS : en ajouter une donnerait deux reliures.
 */
const COVER_SRC = '/images/coverhero.png';

export function BookCover({
  pagesLabel,
  insideTitle,
  insideBody,
}: {
  pagesLabel: string;
  insideTitle: string;
  insideBody: string;
}) {
  return (
    <div className="relative mx-auto w-full max-w-[22rem]">
      <div
        className="group [perspective:1800px]"
        // `aria-hidden` : l'objet est décoratif, le titre du hero porte
        // déjà l'information.
        aria-hidden="true"
      >
        {/* Le bloc entier s'incline un peu plus au survol : le livre se
            tourne vers le lecteur pendant qu'il s'ouvre. */}
        <div className="relative aspect-[3/4] [transform-style:preserve-3d] transition-transform duration-[900ms] [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] [transform:rotateY(-16deg)_rotateX(5deg)] group-hover:[transform:rotateY(-26deg)_rotateX(2deg)]">
          {/* --- Page intérieure, révélée à l'ouverture ---
              Calée sous la couverture : plus courte en hauteur et décalée
              vers la reliure, comme les pages d'un livre relié. */}
          <div className="absolute inset-y-2 left-[5%] right-[2%] overflow-hidden rounded-r-lg rounded-l-sm bg-gradient-to-r from-warm-50 to-white shadow-[inset_8px_0_14px_-10px_rgb(26_26_26/0.35)]">
            <div className="flex h-full flex-col items-center justify-center px-6 text-center">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-warm-100">
                <Icon name="sparkle" filled className="h-6 w-6 text-warm-700" />
              </span>

              <p className="mt-4 font-display text-2xl font-bold leading-tight text-ink">
                {insideTitle}
              </p>

              <p className="mt-3 text-sm leading-relaxed text-ink-muted text-pretty">
                {insideBody}
              </p>

              <span
                aria-hidden="true"
                className="mt-5 block h-0.5 w-10 rounded-pill bg-warm-300"
              />

              <p className="mt-5 text-[0.7rem] font-bold uppercase tracking-[0.16em] text-warm-700">
                {pagesLabel}
              </p>
            </div>
          </div>

          {/* --- Couverture, pivotant sur la reliure ---
              Fermée au repos, ouverte à 118° au survol : au-delà de 90° on
              voit qu'elle a bien tourné, sans qu'elle sorte du cadre. */}
          <div className="absolute inset-0 [transform-origin:4%_50%] [transform-style:preserve-3d] transition-transform duration-[900ms] [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] group-hover:[transform:rotateY(-118deg)]">
            <div className="relative h-full w-full overflow-hidden rounded-r-lg rounded-l-sm shadow-float [backface-visibility:hidden]">
              <Image
                src={COVER_SRC}
                alt=""
                fill
                sizes="(max-width: 768px) 80vw, 22rem"
                className="object-cover"
                priority
              />

              {/* Ombre de reliure : la lumière ne tombe pas à plat sur une
                  couverture, elle s'assombrit près du dos. */}
              <span className="pointer-events-none absolute inset-y-0 left-0 w-[14%] bg-gradient-to-r from-ink/30 to-transparent" />
            </div>
          </div>
        </div>

        {/* Ombre portée au sol : ancre l'objet. Elle s'élargit et s'adoucit
            à l'ouverture, comme si le livre prenait de la place. */}
        <span className="mx-auto mt-6 block h-2 w-3/4 rounded-pill bg-ink/10 blur-sm transition-all duration-[900ms] group-hover:w-[92%] group-hover:bg-ink/15" />
      </div>
    </div>
  );
}
