import { Icon } from '@/components/ui';

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
export function BookCover({
  title,
  childName,
  pagesLabel,
}: {
  title: string;
  childName: string;
  pagesLabel: string;
}) {
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
          <div className="absolute inset-0 border border-ink/20 bg-cream-50 p-6">
            <div className="flex h-full flex-col justify-between">
              <div className="space-y-2.5">
                {/* Lignes de texte simulées : le rythme d'une page, sans
                    prétendre montrer un contenu qui n'existe pas encore. */}
                {[92, 100, 86, 96, 74].map((width, index) => (
                  <span
                    key={index}
                    className="block h-1.5 bg-ink/12"
                    style={{ width: `${width}%` }}
                  />
                ))}
              </div>

              <div className="border border-dashed border-ink/20 p-4 text-center">
                <span className="font-display text-sm font-bold text-ink-muted">
                  {pagesLabel}
                </span>
              </div>
            </div>
          </div>

          {/* --- Couverture, pivotant sur la reliure --- */}
          <div className="absolute inset-0 origin-left [transform-style:preserve-3d] transition-transform duration-700 ease-out [transform:rotateY(0deg)] group-hover:[transform:rotateY(-34deg)]">
            <div className="relative h-full w-full overflow-hidden border border-ink bg-accent-500 shadow-ink [backface-visibility:hidden]">
              {/* Trame imprimée, en aplat franc. */}
              <span
                className="absolute inset-0 opacity-20"
                style={{
                  backgroundImage:
                    'url("data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%2718%27 height=%2718%27%3E%3Ccircle cx=%279%27 cy=%279%27 r=%272%27 fill=%27%231a1a1a%27/%3E%3C/svg%3E")',
                }}
              />

              {/* Filet de composition, code de couverture d'édition. */}
              <span className="absolute inset-4 border border-ink/30" />

              <div className="relative flex h-full flex-col justify-between p-7">
                <p className="flex items-center gap-2 text-[0.65rem] font-bold uppercase tracking-[0.2em] text-ink/70">
                  <Icon name="sparkle" filled className="h-3.5 w-3.5" />
                  Taletto
                </p>

                <div>
                  <p className="font-display text-3xl font-bold leading-[1.05] text-ink">
                    {title}
                  </p>
                  <span className="mt-4 block h-px w-16 bg-ink/40" />
                  <p className="mt-3 text-sm font-semibold uppercase tracking-[0.15em] text-ink/70">
                    {childName}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* --- Tranche : donne l'épaisseur, visible en perspective --- */}
          <div className="absolute left-0 top-0 h-full w-3 origin-left border-y border-l border-ink bg-accent-700 [transform:rotateY(-90deg)_translateX(-0.375rem)]" />
        </div>
      </div>

      {/* Ombre portée au sol : ancre l'objet, sans flou. */}
      <span
        aria-hidden="true"
        className="mx-auto mt-6 block h-1 w-3/4 bg-ink/10 transition-all duration-700 group-hover:w-4/5"
      />
    </div>
  );
}
