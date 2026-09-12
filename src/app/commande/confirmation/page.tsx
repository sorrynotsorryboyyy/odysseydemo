import type { Metadata } from 'next';

import { ButtonLink, Card, IconBubble, Section } from '@/components/ui';
import { getDictionary, translate } from '@/i18n/getDictionary';

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default async function ConfirmationPage() {
  const dictionary = await getDictionary();
  const t = (key: string) => translate(dictionary, key);

  return (
    <Section size="narrow" labelledBy="confirmation-title">
      <Card className="text-center">
        <div className="flex justify-center">
          <IconBubble name="check" tone="warm" />
        </div>

        <h1
          id="confirmation-title"
          className="mt-5 font-display text-3xl font-bold text-ink"
        >
          {t('checkout.confirmation.title')}
        </h1>

        <p className="mt-4 text-ink-muted text-pretty">
          {t('checkout.confirmation.body')}
        </p>
        <p className="mt-2 text-sm text-ink-soft text-pretty">
          {t('checkout.confirmation.printNote')}
        </p>

        <div className="mt-8">
          <ButtonLink href="/compte/bibliotheque" size="lg">
            {t('checkout.confirmation.action')}
          </ButtonLink>
        </div>
      </Card>
    </Section>
  );
}
