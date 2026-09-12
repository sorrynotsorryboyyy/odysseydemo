import type { Metadata } from 'next';

import { AccountSettings } from '@/components/account/AccountSettings';
import { Section, SectionHeading } from '@/components/ui';
import { getDictionary, translate } from '@/i18n/getDictionary';

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default async function SettingsPage() {
  const dictionary = await getDictionary();

  return (
    <Section size="narrow" labelledBy="settings-title">
      <SectionHeading
        id="settings-title"
        as="h1"
        centered={false}
        title={translate(dictionary, 'account.settings.title')}
      />
      <AccountSettings />
    </Section>
  );
}
