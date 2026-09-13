import type { Metadata } from 'next';

import { FaqList, getFaqItems } from '@/components/marketing/Faq';
import { PricingTable } from '@/components/marketing/PricingTable';
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

export default async function PricingPage() {
  const dictionary = await getDictionary();
  const t = (key: string) => translate(dictionary, key);

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
