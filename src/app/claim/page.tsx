import type { Metadata } from 'next';

import { ClaimHandler } from '@/components/account/ClaimHandler';
import { Section, SectionHeading } from '@/components/ui';
import { getDictionary, translate } from '@/i18n/getDictionary';

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

/**
 * Récupération d'accès par lien, pour les acheteurs sans compte.
 * Le jeton arrive en `?token=…` et est échangé contre une session.
 */
export default async function ClaimPage({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const dictionary = await getDictionary();
  const raw = searchParams.token;
  const token = Array.isArray(raw) ? raw[0] : raw;

  return (
    <Section size="narrow" labelledBy="claim-title">
      <SectionHeading
        id="claim-title"
        as="h1"
        title={translate(dictionary, 'account.claim.title')}
      />
      <ClaimHandler token={token} />
    </Section>
  );
}
