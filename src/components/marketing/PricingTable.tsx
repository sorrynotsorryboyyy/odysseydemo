import { Badge, ButtonLink, Card, Icon } from '@/components/ui';
import { translate, translateList, type Dictionary } from '@/i18n/getDictionary';
import { cn } from '@/lib/cn';
import { planHref, plans } from '@/lib/products';

/**
 * Les trois offres. Réutilisée par l'accueil (titres h3) et la page Tarifs
 * (titres h2), d'où le niveau de titre paramétrable.
 *
 * Les URLs viennent de `planHref` : contrat backend, à ne pas reconstruire ici.
 */
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
    <ul className="grid items-start gap-6 lg:grid-cols-3">
      {plans.map((plan) => (
        <li key={plan.id} className={cn(plan.featured && 'lg:-mt-4')}>
          <Card
            as="article"
            labelledBy={`plan-${plan.id}`}
            className={cn(
              'flex h-full flex-col',
              plan.featured
                ? 'bg-ink text-cream shadow-lift ring-2 ring-accent-500'
                : 'bg-white',
            )}
          >
            {plan.featured ? (
              <Badge className="mb-4 self-start">{t('pricing.featuredLabel')}</Badge>
            ) : null}

            <Heading
              id={`plan-${plan.id}`}
              className={cn(
                'font-display text-2xl font-bold',
                plan.featured ? 'text-cream' : 'text-ink',
              )}
            >
              {t(`pricing.plans.${plan.id}.name`)}
            </Heading>

            <p className="mt-4 flex items-baseline gap-1.5">
              <span
                className={cn(
                  'font-display text-5xl font-bold',
                  plan.featured ? 'text-cream' : 'text-ink',
                )}
              >
                {plan.priceEur}
              </span>
              <span
                className={cn(
                  'text-sm font-medium',
                  plan.featured ? 'text-cream/70' : 'text-ink-soft',
                )}
              >
                {t('pricing.currency')}
              </span>
            </p>

            <ul className="mt-6 flex-1 space-y-3">
              {translateList(dictionary, `pricing.plans.${plan.id}.features`).map(
                (feature) => (
                  <li key={feature} className="flex gap-3">
                    <Icon
                      name="check"
                      className={cn(
                        'mt-0.5 h-5 w-5',
                        plan.featured ? 'text-accent-400' : 'text-accent-700',
                      )}
                    />
                    <span
                      className={cn(
                        'text-sm text-pretty',
                        plan.featured ? 'text-cream/90' : 'text-ink-muted',
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
                variant={plan.featured ? 'primary' : 'secondary'}
              >
                {t('common.cta.choosePlan')}
              </ButtonLink>
            </div>
          </Card>
        </li>
      ))}
    </ul>
  );
}
