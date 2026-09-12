import type { Metadata } from 'next';

import { AuthForm } from '@/components/account/AuthForm';
import { Section, SectionHeading } from '@/components/ui';
import { getDictionary, translate } from '@/i18n/getDictionary';

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default async function LoginPage() {
  const dictionary = await getDictionary();

  return (
    <Section size="narrow" labelledBy="auth-title">
      <SectionHeading
        id="auth-title"
        as="h1"
        title={translate(dictionary, 'account.login.title')}
      />
      <AuthForm mode="login" />
    </Section>
  );
}
