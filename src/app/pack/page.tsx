import type { Metadata } from 'next';

import { JsonLd } from '@/components/seo/JsonLd';
import {
  Badge,
  ButtonLink,
  Card,
  Icon,
  Placeholder,
  Section,
  SectionHeading,
} from '@/components/ui';
import { getDictionary, translate, translateList } from '@/i18n/getDictionary';
import { getPlan, planHref } from '@/lib/products';
import { breadcrumbSchema } from '@/lib/structuredData';

export async function generateMetadata(): Promise<Metadata> {
  const dictionary = await getDictionary();
  return {
    title: translate(dictionary, 'meta.pack.title'),
    description: translate(dictionary, 'meta.pack.description'),
    alternates: { canonical: '/pack' },
  };
}

export default async function PackPage() {
  const dictionary = await getDictionary();
  const t = (key: string) => translate(dictionary, key);
  const pack = getPlan('pack');

  const packDict = dictionary.pack as Record<string, unknown> | undefined;
  const whyItems =
    ((packDict?.why as { items?: Array<{ title: string; body: string }> } | undefined)
      ?.items ?? []);

  return (
    <>
      <JsonLd
        schema={breadcrumbSchema([
          { name: t('common.nav.home'), path: '/' },
          { name: t('pack.title'), path: '/pack' },
        ])}
      />

      <Section labelledBy="pack-title" className="pb-8">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <Badge>{t('pricing.featuredLabel')}</Badge>
            <h1 className="mt-5 font-display text-4xl font-bold text-ink sm:text-5xl">
              {t('pack.title')}
            </h1>
            <p className="mt-5 text-lg text-ink-muted text-pretty">{t('pack.intro')}</p>

            {pack ? (
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <ButtonLink href={planHref(pack)} size="lg">
                  {t('common.cta.choosePlan')}
                  <Icon name="arrow-right" className="h-5 w-5" />
                </ButtonLink>
                <p className="font-display text-2xl font-bold text-ink">
                  {pack.priceEur}{' '}
                  <span className="text-base font-medium text-ink-soft">
                    {t('pricing.currency')}
                  </span>
                </p>
              </div>
            ) : null}
          </div>

          <div className="relative mx-auto w-full max-w-sm">
            <Placeholder seed="pack-book" ratio="book" className="rotate-2 shadow-lifted" />
            <Placeholder
              seed="pack-cahier"
              ratio="book"
              className="absolute -bottom-6 -right-6 w-2/5 -rotate-6 shadow-lifted"
            />
          </div>
        </div>
      </Section>

      <Section labelledBy="pack-contents-title" tone="white">
        <SectionHeading id="pack-contents-title" title={t('pack.contents.title')} />

        <ul className="mx-auto grid max-w-3xl gap-3">
          {translateList(dictionary, 'pack.contents.items').map((item) => (
            <li
              key={item}
              className="flex gap-3 rounded-2xl bg-cream-50 p-4 border border-ink/15"
            >
              <Icon name="check" className="mt-0.5 h-5 w-5 text-accent-700" />
              <span className="text-ink text-pretty">{item}</span>
            </li>
          ))}
        </ul>
      </Section>

      <Section labelledBy="pack-cahier-title">
        <div className="grid items-center gap-10 md:grid-cols-2">
          <Placeholder seed="cahier-spread" ratio="wide" className="shadow-print" />
          <div>
            <h2
              id="pack-cahier-title"
              className="font-display text-3xl font-bold text-ink"
            >
              {t('pack.cahier.title')}
            </h2>
            <p className="mt-4 text-ink-muted text-pretty">{t('pack.cahier.body')}</p>
          </div>
        </div>
      </Section>

      <Section labelledBy="pack-why-title" tone="white">
        <SectionHeading id="pack-why-title" title={t('pack.why.title')} />

        <div className="grid gap-6 sm:grid-cols-2">
          {whyItems.map((item) => (
            <article key={item.title} className="flex gap-4">
              <Icon name="check" className="mt-1 h-5 w-5 shrink-0 text-accent-700" />
              <div>
                <h3 className="font-display text-lg font-bold text-ink">{item.title}</h3>
                <p className="mt-1 text-ink-muted text-pretty">{item.body}</p>
              </div>
            </article>
          ))}
        </div>
      </Section>

      <Section labelledBy="pack-price-title" size="narrow">
        <Card className="bg-ink text-center text-cream">
          <h2
            id="pack-price-title"
            className="font-display text-3xl font-bold text-cream"
          >
            {t('pack.price.title')}
          </h2>
          <p className="mt-3 text-cream/80 text-pretty">{t('pack.price.body')}</p>
          {pack ? (
            <div className="mt-8">
              <ButtonLink href={planHref(pack)} size="lg">
                {t('common.cta.choosePlan')}
              </ButtonLink>
            </div>
          ) : null}
        </Card>
      </Section>
    </>
  );
}
