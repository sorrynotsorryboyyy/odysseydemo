'use client';

import { Badge, Icon } from '@/components/ui';
import { useTranslations } from '@/i18n/TranslationsProvider';
import { planFromParams } from '@/lib/products';
import type { PersonalizationDraft } from '@/lib/validation';
import type { ProductParams } from '@/types/product';

/** Récapitulatif avant paiement. Chaque bloc renvoie vers son étape. */
export function Summary({
  params,
  values,
  onEdit,
}: {
  params: ProductParams;
  values: PersonalizationDraft;
  onEdit: (stepIndex: number) => void;
}) {
  const { t } = useTranslations('form');
  const plan = planFromParams(params);

  const rows: Array<{ label: string; value: string; step: number }> = [
    {
      label: t('summary.child'),
      value: [values.firstName, values.age ? `${values.age}` : null]
        .filter(Boolean)
        .join(' · '),
      step: 0,
    },
    {
      label: t('summary.story'),
      value: [values.interests, values.universe, values.themes]
        .filter(Boolean)
        .join(' · '),
      step: 1,
    },
    {
      label: t('summary.style'),
      value: values.style ? t(`..home.styles.items.${values.style}`) : '',
      step: 2,
    },
    {
      label: t('summary.languages'),
      value: [values.primaryLanguage, values.secondaryLanguage]
        .filter(Boolean)
        .join(' · '),
      step: 3,
    },
  ];

  return (
    <section aria-labelledby="summary-title">
      <h2 id="summary-title" className="font-display text-2xl font-bold text-ink">
        {t('summary.title')}
      </h2>
      <p className="mt-2 text-ink-muted">{t('summary.intro')}</p>

      {plan ? (
        <div className="mt-6 flex items-center justify-between gap-4 rounded-2xl bg-accent-50 p-4 ring-1 ring-accent-200">
          <div>
            <Badge>{t('summary.plan')}</Badge>
            <p className="mt-2 font-display text-lg font-bold text-ink">
              {t(`..pricing.plans.${plan.id}.name`)}
            </p>
          </div>
          <p className="font-display text-3xl font-bold text-ink">
            {plan.priceEur}
            <span className="ml-1 text-sm font-medium text-ink-soft">
              {t('..pricing.currency')}
            </span>
          </p>
        </div>
      ) : null}

      <dl className="mt-6 divide-y divide-ink/5 border-y border-ink/5">
        {rows.map((row) => (
          <div key={row.label} className="flex gap-4 py-4">
            <dt className="w-28 shrink-0 text-sm font-semibold text-ink">{row.label}</dt>
            <dd className="flex flex-1 items-start justify-between gap-3">
              <span className="text-sm text-ink-muted text-pretty">{row.value}</span>
              <button
                type="button"
                onClick={() => onEdit(row.step)}
                className="shrink-0 border border-accent-700/30 px-2.5 py-1 text-sm font-semibold text-accent-700 transition-colors hover:bg-accent-50"
              >
                {t('summary.edit')}
              </button>
            </dd>
          </div>
        ))}
      </dl>

      {plan ? (
        <p className="mt-6 flex items-center justify-between font-display text-lg font-bold text-ink">
          <span className="flex items-center gap-2">
            <Icon name="check" className="h-5 w-5 text-accent-700" />
            {t('summary.total')}
          </span>
          <span>
            {plan.priceEur} {t('..pricing.currency')}
          </span>
        </p>
      ) : null}
    </section>
  );
}
