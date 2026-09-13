import type { Metadata } from 'next';

import { FaqList, getFaqItems } from '@/components/marketing/Faq';
import { PricingTable } from '@/components/marketing/PricingTable';
import { Compare } from '@/components/marketing/sections';
import { JsonLd } from '@/components/seo/JsonLd';
import { ButtonLink, Card, Icon, Section, SectionHeading } from '@/components/ui';
import { getDictionary, translate } from '@/i18n/getDictionary';
import { breadcrumbSchema, productSchema } from '@/lib/structuredData';

export async function generateMetadata(): Promise<Metadata> {
  const dictionary = await getDictionary();
  return {
    title: translate(dictionary, 'meta.pricing.title'),
    description: translate(dictionary, 'meta.pricing.description'),
    alternates: { canonical: '/tarifs' },
  };
}

interface Guarantee {
  title: string;
  body: string;
}

export default async function PricingPage() {
  const dictionary = await getDictionary();
  const t = (key: string) => translate(dictionary, key);

  const pricing = dictionary.pricing as Record<string, unknown> | undefined;
  const guarantees =
    ((pricing?.guarantees as { items?: Guarantee[] } | undefined)?.items ?? []);

  return (
    <>
      <JsonLd schema={productSchema(dictionary)} />
      <JsonLd
        schema={breadcrumbSchema([
          { name: t('common.nav.home'), path: '/' },
          { name: t('pricing.title'), path: '/tarifs' },
        ])}
      />

      <Section labelledBy="pricing-title" size="wide" className="pb-8">
        <SectionHeading
          id="pricing-title"
          as="h1"
          eyebrow={t('pricing.eyebrow')}
          title={t('pricing.title')}
          intro={t('pricing.intro')}
        />

        <PricingTable dictionary={dictionary} />

        <p className="mt-8 text-center text-sm text-ink-soft">{t('pricing.note')}</p>
      </Section>

      <Compare dictionary={dictionary} />

      <Section labelledBy="guarantees-title" tone="white">
        <SectionHeading id="guarantees-title" title={t('pricing.guarantees.title')} />

        <div className="grid gap-6 sm:grid-cols-2">
          {guarantees.map((guarantee) => (
            <article key={guarantee.title} className="flex gap-4">
              <Icon name="check" className="mt-1 h-5 w-5 shrink-0 text-warm-700" />
              <div>
                <h3 className="font-display text-lg font-bold text-ink">
                  {guarantee.title}
                </h3>
                <p className="mt-1 text-ink-muted text-pretty">{guarantee.body}</p>
              </div>
            </article>
          ))}
        </div>
      </Section>

      <Section labelledBy="pricing-help-title" size="narrow">
        <Card className="text-center">
          <h2
            id="pricing-help-title"
            className="font-display text-2xl font-bold text-ink"
          >
            {t('pricing.help.title')}
          </h2>
          <p className="mt-4 text-ink-muted text-pretty">{t('pricing.help.body')}</p>
          <div className="mt-6">
            <ButtonLink href="/contact" variant="secondary">
              {t('pricing.help.action')}
              <Icon name="arrow-right" className="h-5 w-5" />
            </ButtonLink>
          </div>
        </Card>
      </Section>

      <Section labelledBy="pricing-faq-title" tone="white">
        <SectionHeading id="pricing-faq-title" title={t('faq.title')} />
        <FaqList items={getFaqItems(dictionary).slice(0, 6)} />
      </Section>
    </>
  );
}
