import type { Metadata } from 'next';

import { LegalPage } from '@/components/marketing/LegalPage';
import { getDictionary, translate } from '@/i18n/getDictionary';

export async function generateMetadata(): Promise<Metadata> {
  const dictionary = await getDictionary();
  return {
    title: translate(dictionary, 'meta.legal.cgv.title'),
    description: translate(dictionary, 'meta.legal.cgv.description'),
    alternates: { canonical: '/legal/cgv' },
  };
}

export default async function CgvPage() {
  const dictionary = await getDictionary();

  return <LegalPage dictionary={dictionary} scope="cgv" />;
}
