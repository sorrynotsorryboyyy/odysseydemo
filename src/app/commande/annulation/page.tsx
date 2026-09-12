import type { Metadata } from 'next';

import { ButtonLink, Card, IconBubble, Section } from '@/components/ui';
import { getDictionary, translate } from '@/i18n/getDictionary';

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default async function CancelPage() {
  const dictionary = await getDictionary();
  const t = (key: string) => translate(dictionary, key);

  return (
    <Section size="narrow" labelledBy="cancel-title">
      <Card className="text-center">
        <div className="flex justify-center">
          <IconBubble name="x" tone="ink" />
        </div>

        <h1 id="cancel-title" className="mt-5 font-display text-3xl font-bold text-ink">
          {t('checkout.cancel.title')}
        </h1>

        {/* Le brouillon reste en sessionStorage : reprendre où on en était. */}
        <p className="mt-4 text-ink-muted text-pretty">{t('checkout.cancel.body')}</p>

        <div className="mt-8">
          <ButtonLink href="/app" size="lg">
            {t('checkout.cancel.action')}
          </ButtonLink>
        </div>
      </Card>
    </Section>
  );
}
