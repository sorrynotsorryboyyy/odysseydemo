import { ButtonLink, Icon, IconBubble, Reveal } from '@/components/ui';
import { translate, translateList, type Dictionary } from '@/i18n/getDictionary';
import { cn } from '@/lib/cn';
import { planHref, plans } from '@/lib/products';

/**
 * Les trois offres. Réutilisée par l'accueil (titres h3) et la page Tarifs
 * (titres h2), d'où le niveau de titre paramétrable.
 *
 * Les URLs viennent de `planHref` : contrat backend, à ne pas reconstruire ici.
 *
 * Chaque offre porte un bandeau d'une couleur différente. C'est ce qui
 * permet de les distinguer d'un coup d'œil — trois cartes blanches
 * identiques obligent à lire pour comparer.
 */

/** Repères visuels par offre, dans l'ordre de `plans`. */
const marks = [
  { icon: 'download', tone: 'accent', band: 'bg-accent-100' },
  { icon: 'printer', tone: 'sun', band: 'bg-sun-100' },
  { icon: 'star', tone: 'warm', band: 'bg-warm-100' },
] as const;

export function PricingTable({
  dictionary,
  headingLevel = 'h2',
}: {
  dictionary: Dictionary;
  headingLevel?: 'h2' | 'h3';
}) {
  const t = (key: string) => translate(dictionary, key);
  const Heading = headingLevel;

  return (
    <ul className="grid items-stretch gap-6 lg:grid-cols-3">
      {plans.map((plan, index) => {
        const mark = marks[index] ?? marks[0];
        const featured = plan.featured;

        return (
          <Reveal as="li" key={plan.id} delay={index * 100} className="h-full">
            <article
              aria-labelledby={`plan-${plan.id}`}
              className={cn(
                'flex h-full flex-col overflow-hidden rounded-2xl transition-transform duration-200 hover:-translate-y-1',
                featured
                  ? 'bg-warm-700 text-white shadow-float ring-2 ring-warm-800'
                  : 'bg-white shadow-card',
              )}
            >
              {/* Bandeau de tête : la couleur identifie l'offre. */}
              <div
                className={cn(
                  'flex items-center gap-4 px-7 pb-6 pt-7',
                  featured ? 'bg-warm-800' : mark.band,
                )}
              >
                <IconBubble
                  name={mark.icon}
                  tone={featured ? 'warm' : mark.tone}
                  className="shrink-0"
                />
                <div>
                  <Heading
                    id={`plan-${plan.id}`}
                    className={cn(
                      'font-display text-xl font-bold leading-tight',
                      featured ? 'text-white' : 'text-ink',
                    )}
                  >
                    {t(`pricing.plans.${plan.id}.name`)}
                  </Heading>
                  {featured ? (
                    <p className="mt-1 text-xs font-bold uppercase tracking-[0.14em] text-white/90">
                      {t('pricing.featuredLabel')}
                    </p>
                  ) : null}
                </div>
              </div>

              <div className="flex flex-1 flex-col px-7 pb-7 pt-6">
                <p className="flex items-baseline gap-1.5">
                  <span
                    className={cn(
                      'font-display text-5xl font-bold tabular-nums',
                      featured ? 'text-white' : 'text-ink',
                    )}
                  >
                    {plan.priceEur}
                  </span>
                  <span
                    className={cn(
                      'text-sm font-medium',
                      featured ? 'text-white/90' : 'text-ink-soft',
                    )}
                  >
                    {t('pricing.currency')}
                  </span>
                </p>

                {/* `flex-1` sur la liste : les boutons s'alignent en bas
                    même quand les offres n'ont pas le même nombre de lignes. */}
                <ul className="mt-6 flex-1 space-y-3">
                  {translateList(dictionary, `pricing.plans.${plan.id}.features`).map(
                    (feature) => (
                      <li key={feature} className="flex gap-3">
                        <Icon
                          name="check"
                          className={cn(
                            'mt-0.5 h-5 w-5 shrink-0',
                            featured ? 'text-warm-100' : 'text-accent-900',
                          )}
                        />
                        <span
                          className={cn(
                            'text-sm text-pretty',
                            featured ? 'text-white/90' : 'text-ink-muted',
                          )}
                        >
                          {feature}
                        </span>
                      </li>
                    ),
                  )}
                </ul>

                <div className="mt-8">
                  <ButtonLink
                    href={planHref(plan)}
                    fullWidth
                    variant={featured ? 'inverse' : 'primary'}
                  >
                    {t('common.cta.choosePlan')}
                  </ButtonLink>
                </div>
              </div>
            </article>
          </Reveal>
        );
      })}
    </ul>
  );
}
