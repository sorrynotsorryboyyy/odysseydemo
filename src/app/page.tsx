import type { Metadata } from 'next';

import { FaqList, getFaqItems } from '@/components/marketing/Faq';
import {
  AgePicker,
  Benefits,
  Compare,
  FinalCta,
  Formats,
  Hero,
  HomePricing,
  Inside,
  Proof,
  Scope,
  Steps,
  StyleGallery,
  Testimonials,
} from '@/components/marketing/sections';
import { JsonLd } from '@/components/seo/JsonLd';
import { ButtonLink, Icon, Section, SectionHeading } from '@/components/ui';
import { getDictionary, translate } from '@/i18n/getDictionary';
import {
  faqSchema,
  organizationSchema,
  productSchema,
  websiteSchema,
} from '@/lib/structuredData';

export async function generateMetadata(): Promise<Metadata> {
  const dictionary = await getDictionary();
  return {
    title: translate(dictionary, 'meta.home.title'),
    description: translate(dictionary, 'meta.home.description'),
    alternates: { canonical: '/' },
  };
}

export default async function HomePage() {
  const dictionary = await getDictionary();

  return (
    <>
      {/* Données structurées : décrivent le produit, les prix et la FAQ. */}
      <JsonLd schema={organizationSchema(dictionary)} />
      <JsonLd schema={websiteSchema(dictionary)} />
      <JsonLd schema={productSchema(dictionary)} />
      {/* 6 : le balisage doit refléter les questions réellement affichées. */}
      <JsonLd schema={faqSchema(dictionary, 6)} />

      <Hero dictionary={dictionary} />
      <Proof dictionary={dictionary} />
      <Steps dictionary={dictionary} />
      <Inside dictionary={dictionary} />
      <Formats dictionary={dictionary} />
      <AgePicker dictionary={dictionary} />
      <StyleGallery dictionary={dictionary} />
      <Benefits dictionary={dictionary} />
      <Testimonials dictionary={dictionary} />
      <Scope dictionary={dictionary} />
      <HomePricing dictionary={dictionary} />
      <Compare dictionary={dictionary} />

      <Section labelledBy="home-faq-title">
        <SectionHeading
          id="home-faq-title"
          title={translate(dictionary, 'home.faq.title')}
        />
        {/* Les 6 essentielles ici ; la page /faq porte les 14. */}
        <FaqList items={getFaqItems(dictionary).slice(0, 6)} />

        <div className="mt-10 text-center">
          <ButtonLink href="/faq" variant="secondary">
            {translate(dictionary, 'home.faq.seeAll')}
            <Icon name="arrow-right" className="h-5 w-5" />
          </ButtonLink>
        </div>
      </Section>

      <FinalCta dictionary={dictionary} />
    </>
  );
}
