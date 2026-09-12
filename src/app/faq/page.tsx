import type { Metadata } from 'next';

import { FaqList, getFaqItems } from '@/components/marketing/Faq';
import { JsonLd } from '@/components/seo/JsonLd';
import { ButtonLink, Icon, Section, SectionHeading } from '@/components/ui';
import { getDictionary, translate } from '@/i18n/getDictionary';
import { breadcrumbSchema, faqSchema } from '@/lib/structuredData';

export async function generateMetadata(): Promise<Metadata> {
  const dictionary = await getDictionary();
  return {
    title: translate(dictionary, 'meta.faq.title'),
    description: translate(dictionary, 'meta.faq.description'),
    alternates: { canonical: '/faq' },
  };
}

export default async function FaqPage() {
  const dictionary = await getDictionary();
  const t = (key: string) => translate(dictionary, key);

  return (
    <Section labelledBy="faq-title">
      <JsonLd schema={faqSchema(dictionary)} />
      <JsonLd
        schema={breadcrumbSchema([
          { name: t('common.nav.home'), path: '/' },
          { name: t('faq.title'), path: '/faq' },
        ])}
      />

      <SectionHeading
        id="faq-title"
        as="h1"
        title={t('faq.title')}
        intro={t('faq.intro')}
      />

      <FaqList items={getFaqItems(dictionary)} />

      <div className="mt-12 text-center">
        <ButtonLink href="/contact" variant="secondary">
          {t('common.nav.contact')}
          <Icon name="arrow-right" className="h-5 w-5" />
        </ButtonLink>
      </div>
    </Section>
  );
}
