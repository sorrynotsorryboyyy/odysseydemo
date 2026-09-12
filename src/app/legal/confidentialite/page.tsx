import type { Metadata } from 'next';

import { LegalPage } from '@/components/marketing/LegalPage';
import { getDictionary, translate } from '@/i18n/getDictionary';

export async function generateMetadata(): Promise<Metadata> {
  const dictionary = await getDictionary();
  return {
    title: translate(dictionary, 'meta.legal.privacy.title'),
    description: translate(dictionary, 'meta.legal.privacy.description'),
    alternates: { canonical: '/legal/confidentialite' },
  };
}

export default async function PrivacyPage() {
  const dictionary = await getDictionary();

  return <LegalPage dictionary={dictionary} scope="privacy" />;
}
