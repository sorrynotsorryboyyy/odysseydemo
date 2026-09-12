import type { Metadata } from 'next';

import { PricingTable } from '@/components/marketing/PricingTable';
import { Section, SectionHeading } from '@/components/ui';
import { getDictionary, translate } from '@/i18n/getDictionary';

export async function generateMetadata(): Promise<Metadata> {
  const dictionary = await getDictionary();
  return {
    title: translate(dictionary, 'meta.pricing.title'),
    description: translate(dictionary, 'meta.pricing.description'),
    robots: { index: false, follow: false },
  };
}

/** Choix de la formule, à l'entrée du tunnel. */
export default async function PlanChoicePage() {
  const dictionary = await getDictionary();
  const t = (key: string) => translate(dictionary, key);

  return (
    <Section size="wide" labelledBy="plan-choice-title">
      <SectionHeading
        id="plan-choice-title"
        as="h1"
        title={t('pricing.title')}
        intro={t('pricing.intro')}
      />
      <PricingTable dictionary={dictionary} />
    </Section>
  );
}
