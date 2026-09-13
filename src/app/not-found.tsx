import { ButtonLink, Card, Icon, Section } from '@/components/ui';
import { getDictionary, translate } from '@/i18n/getDictionary';

export default async function NotFound() {
  const dictionary = await getDictionary();
  const t = (key: string) => translate(dictionary, key);

  return (
    <Section size="narrow" labelledBy="not-found-title">
      <Card className="text-center">
        <p className="font-display text-6xl font-bold text-warm-700">404</p>

        <h1
          id="not-found-title"
          className="mt-4 font-display text-3xl font-bold text-ink"
        >
          {t('common.errors.notFoundTitle')}
        </h1>

        <p className="mt-4 text-ink-muted text-pretty">{t('common.errors.notFound')}</p>

        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <ButtonLink href="/" size="lg">
            {t('common.errors.backHome')}
            <Icon name="arrow-right" className="h-5 w-5" />
          </ButtonLink>
          <ButtonLink href="/contact" size="lg" variant="secondary">
            {t('common.nav.contact')}
          </ButtonLink>
        </div>
      </Card>
    </Section>
  );
}
