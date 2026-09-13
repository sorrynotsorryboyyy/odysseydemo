import Image from 'next/image';

/**
 * Livre en perspective, qui s'ouvre au survol.
 *
 * CSS pur, aucune bibliothèque : la couverture pivote sur sa reliure grâce
 * à `transform-origin: left` et `rotateY`. L'objet reste donc parfaitement
 * lisible sans JavaScript.
 *
 * La transition ne porte que sur `transform` — la propriété la moins
 * coûteuse à animer, la seule qui reste fluide sur mobile.
 *
 * `prefers-reduced-motion` est déjà neutralisé globalement dans
 * `globals.css` : le livre s'affiche alors immobile, sans disparaître.
 */

/**
 * Couverture réelle d'un livre produit. Le dos rouge y est déjà peint, d'où
 * l'absence de tranche CSS : en ajouter une donnerait deux reliures.
 */
const COVER_SRC = '/images/coverhero.png';

export function BookCover({ pagesLabel }: { pagesLabel: string }) {
  return (
    <div className="relative mx-auto w-full max-w-[22rem]">
      {/* Le groupe pilote l'ouverture ; la perspective donne la profondeur. */}
      <div
        className="group [perspective:1600px]"
        // `aria-hidden` : l'objet est décoratif, le titre du hero porte
        // déjà l'information.
        aria-hidden="true"
      >
        <div className="relative aspect-[3/4] [transform-style:preserve-3d] transition-transform duration-700 ease-out [transform:rotateY(-14deg)_rotateX(4deg)] group-hover:[transform:rotateY(-22deg)_rotateX(2deg)]">
          {/* --- Pages intérieures, révélées à l'ouverture --- */}
          <div className="absolute inset-0 border-2 border-ink bg-cream-50 p-6">
            <div className="flex h-full flex-col justify-between">
              <div className="space-y-2.5">
                {/* Lignes de texte simulées : le rythme d'une page, sans
                    prétendre montrer un contenu qui n'existe pas encore. */}
                {[92, 100, 86, 96, 74].map((width, index) => (
                  <span
                    key={index}
                    className="block h-1.5 bg-ink/10"
                    style={{ width: `${width}%` }}
                  />
                ))}
              </div>

              <div className="border-2 border-dashed border-ink/40 p-4 text-center">
                <span className="font-display text-sm font-bold text-ink-muted">
                  {pagesLabel}
                </span>
              </div>
            </div>
          </div>

          {/* --- Couverture, pivotant sur la reliure ---
              Le pivot est placé sur le dos peint dans l'image (~4 % de sa
              largeur), pas sur le bord : c'est là qu'est la charnière. */}
          <div className="absolute inset-0 [transform-origin:4%_50%] [transform-style:preserve-3d] transition-transform duration-700 ease-out [transform:rotateY(0deg)] group-hover:[transform:rotateY(-34deg)]">
            <div className="relative h-full w-full overflow-hidden border-2 border-ink shadow-ink [backface-visibility:hidden]">
              <Image
                src={COVER_SRC}
                alt=""
                fill
                sizes="(max-width: 768px) 80vw, 22rem"
                className="object-cover"
                priority
              />
            </div>
          </div>
        </div>

        {/* Ombre portée au sol : ancre l'objet, sans flou. À l'intérieur du
            groupe, sans quoi le survol ne l'atteindrait pas. */}
        <span className="mx-auto mt-6 block h-1 w-3/4 bg-ink/10 transition-[width] duration-700 group-hover:w-4/5" />
      </div>
    </div>
  );
}
