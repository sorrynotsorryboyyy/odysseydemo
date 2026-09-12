'use client';

import { useEffect } from 'react';

import { Button, ButtonLink, Card, Section } from '@/components/ui';
import { useTranslations } from '@/i18n/TranslationsProvider';

/**
 * Frontière d'erreur des routes.
 * Le message reste générique : aucune trace technique à l'écran.
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const { t } = useTranslations('common');

  useEffect(() => {
    // La trace part dans les journaux serveur, pas vers l'utilisateur.
    console.error(error);
  }, [error]);

  return (
    <Section size="narrow" labelledBy="error-title">
      <Card className="text-center">
        <h1 id="error-title" className="font-display text-3xl font-bold text-ink">
          {t('errors.title')}
        </h1>

        <p className="mt-4 text-ink-muted text-pretty">{t('errors.generic')}</p>

        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Button type="button" size="lg" onClick={reset}>
            {t('actions.retry')}
          </Button>
          <ButtonLink href="/" size="lg" variant="secondary">
            {t('errors.backHome')}
          </ButtonLink>
        </div>
      </Card>
    </Section>
  );
}
