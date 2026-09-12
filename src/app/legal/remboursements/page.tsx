import type { Metadata } from 'next';

import { LegalPage } from '@/components/marketing/LegalPage';
import { getDictionary, translate } from '@/i18n/getDictionary';

export async function generateMetadata(): Promise<Metadata> {
  const dictionary = await getDictionary();
  return {
    title: translate(dictionary, 'meta.legal.refunds.title'),
    description: translate(dictionary, 'meta.legal.refunds.description'),
    alternates: { canonical: '/legal/remboursements' },
  };
}

export default async function RefundsPage() {
  const dictionary = await getDictionary();

  return <LegalPage dictionary={dictionary} scope="refunds" />;
}
