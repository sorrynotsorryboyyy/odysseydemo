import { PricingTable } from './PricingTable';
import {
  AvatarPlaceholder,
  Badge,
  ButtonLink,
  Card,
  Icon,
  IconBubble,
  Placeholder,
  Section,
  SectionHeading,
  type IconName,
} from '@/components/ui';
import { translate, translateList, type Dictionary } from '@/i18n/getDictionary';
import { ageRanges } from '@/lib/ages';
import { illustrationStyles } from '@/lib/styles';

/**
 * Sections de la page d'accueil, dans l'ordre du parcours de conversion.
 * Aucun texte en dur : tout vient du dictionnaire.
 */

type SectionProps = { dictionary: Dictionary };

export function Hero({ dictionary }: SectionProps) {
  const t = (key: string) => translate(dictionary, key);

  return (
    <section
      aria-labelledby="hero-title"
      className="relative overflow-hidden bg-gradient-to-b from-accent-50 via-cream to-cream"
    >
      {/* Halos décoratifs, sous le contenu. */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -left-24 top-10 h-64 w-64 rounded-full bg-accent-200/40 blur-3xl"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -right-20 top-40 h-72 w-72 rounded-full bg-warm-200/40 blur-3xl"
      />

      <div className="relative mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div className="text-center lg:text-left">
            <Badge className="animate-fade-up">{t('home.hero.badge')}</Badge>

            <h1
              id="hero-title"
              className="mt-5 font-display text-4xl font-bold leading-[1.1] text-ink sm:text-5xl lg:text-6xl"
            >
              {t('home.hero.title')}
            </h1>

            <p className="mx-auto mt-6 max-w-xl text-lg text-ink-muted text-pretty lg:mx-0">
              {t('home.hero.subtitle')}
            </p>

            <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center lg:justify-start">
              <ButtonLink href="/tarifs" size="lg">
                {t('common.cta.start')}
                <Icon name="arrow-right" className="h-5 w-5" />
              </ButtonLink>
              <ButtonLink href="/pack" size="lg" variant="secondary">
                {t('common.cta.discoverPack')}
              </ButtonLink>
            </div>

            <p className="mt-6 text-sm text-ink-soft">{t('home.hero.note')}</p>
          </div>

          {/* Mise en scène du livre : deux couvertures décalées. */}
          <div className="relative mx-auto w-full max-w-sm lg:max-w-md">
            <Placeholder
              seed="hero-book"
              ratio="book"
              className="rotate-3 shadow-lift"
              label={t('home.hero.mockupLabel')}
            />
            <Placeholder
              seed="hero-book-back"
              ratio="book"
              className="absolute -bottom-6 -left-6 w-2/5 -rotate-6 shadow-lift"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

const proofIcons: IconName[] = ['book', 'clock', 'infinity', 'shield'];

export function Proof({ dictionary }: SectionProps) {
  const items = translateList(dictionary, 'home.proof.items');

  return (
    <section aria-labelledby="proof-title" className="border-y border-ink/5 bg-white py-8">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        <h2 id="proof-title" className="sr-only">
          {translate(dictionary, 'home.proof.title')}
        </h2>
        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item, index) => (
            <li key={item} className="flex items-start gap-3">
              <Icon
                name={proofIcons[index % proofIcons.length]}
                className="mt-0.5 h-5 w-5 text-accent-700"
              />
              <span className="text-sm font-medium text-ink text-pretty">{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function Steps({ dictionary }: SectionProps) {
  const t = (key: string) => translate(dictionary, key);
  const steps = ['one', 'two', 'three'] as const;

  return (
    <Section labelledBy="steps-title">
      <SectionHeading
        id="steps-title"
        eyebrow={t('home.steps.eyebrow')}
        title={t('home.steps.title')}
      />

      <ol className="grid gap-6 md:grid-cols-3">
        {steps.map((step, index) => (
          <li key={step}>
            <Card className="h-full" interactive>
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-accent-500 font-display text-lg font-bold text-ink">
                {index + 1}
              </span>
              <h3 className="mt-5 font-display text-xl font-bold text-ink">
                {t(`home.steps.items.${step}.title`)}
              </h3>
              <p className="mt-2 text-ink-muted text-pretty">
                {t(`home.steps.items.${step}.body`)}
              </p>
            </Card>
          </li>
        ))}
      </ol>
    </Section>
  );
}

const formatIcons: Record<string, IconName> = {
  pdf: 'download',
  print: 'printer',
  cahier: 'palette',
};

export function Formats({ dictionary }: SectionProps) {
  const t = (key: string) => translate(dictionary, key);
  const formats = ['pdf', 'print', 'cahier'] as const;

  return (
    <Section labelledBy="formats-title" tone="white">
      <SectionHeading id="formats-title" title={t('home.formats.title')} />

      <div className="grid gap-6 md:grid-cols-3">
        {formats.map((format) => (
          <Card
            key={format}
            as="article"
            className="h-full bg-cream-50"
            labelledBy={`format-${format}`}
          >
            <IconBubble
              name={formatIcons[format]}
              tone={format === 'print' ? 'warm' : 'accent'}
            />
            <h3
              id={`format-${format}`}
              className="mt-5 font-display text-xl font-bold text-ink"
            >
              {t(`home.formats.${format}.title`)}
            </h3>
            <p className="mt-2 text-ink-muted text-pretty">
              {t(`home.formats.${format}.body`)}
            </p>
          </Card>
        ))}
      </div>
    </Section>
  );
}

export function AgePicker({ dictionary }: SectionProps) {
  const t = (key: string) => translate(dictionary, key);

  return (
    <Section labelledBy="ages-title">
      <SectionHeading
        id="ages-title"
        eyebrow={t('home.ages.eyebrow')}
        title={t('home.ages.title')}
        intro={t('home.ages.intro')}
      />

      <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {ageRanges.map((range) => (
          <li key={range}>
            <Card className="h-full text-center" interactive>
              <Placeholder
                seed={`age-${range}`}
                ratio="square"
                className="mx-auto w-20"
                rounded="rounded-full"
              />
              <p className="mt-4 font-display text-2xl font-bold text-accent-700">
                {t(`home.ages.items.${range}.label`)}
              </p>
              <h3 className="mt-1 font-display text-lg font-bold text-ink">
                {t(`home.ages.items.${range}.title`)}
              </h3>
              <p className="mt-2 text-sm text-ink-muted text-pretty">
                {t(`home.ages.items.${range}.body`)}
              </p>
            </Card>
          </li>
        ))}
      </ul>
    </Section>
  );
}

export function StyleGallery({ dictionary }: SectionProps) {
  const t = (key: string) => translate(dictionary, key);

  return (
    <Section labelledBy="styles-title" tone="white">
      <SectionHeading
        id="styles-title"
        eyebrow={t('home.styles.eyebrow')}
        title={t('home.styles.title')}
        intro={t('home.styles.intro')}
      />

      <ul className="grid grid-cols-2 gap-5 md:grid-cols-3">
        {illustrationStyles.map((style) => (
          <li key={style}>
            <figure className="group overflow-hidden rounded-2xl bg-cream-50 shadow-soft ring-1 ring-ink/5 transition-shadow hover:shadow-lift">
              <Placeholder seed={`style-${style}`} ratio="wide" rounded="rounded-none" />
              <figcaption className="p-4 text-center font-medium text-ink">
                {t(`home.styles.items.${style}`)}
              </figcaption>
            </figure>
          </li>
        ))}
      </ul>
    </Section>
  );
}

const benefitIcons: Record<string, IconName> = {
  price: 'shield',
  once: 'check',
  forever: 'infinity',
  refund: 'heart',
};

export function Benefits({ dictionary }: SectionProps) {
  const t = (key: string) => translate(dictionary, key);
  const benefits = ['price', 'once', 'forever', 'refund'] as const;

  return (
    <Section labelledBy="benefits-title">
      <SectionHeading id="benefits-title" title={t('home.benefits.title')} />

      <div className="grid gap-6 sm:grid-cols-2">
        {benefits.map((benefit) => (
          <article key={benefit} className="flex gap-4">
            <IconBubble name={benefitIcons[benefit]} />
            <div>
              <h3 className="font-display text-lg font-bold text-ink">
                {t(`home.benefits.items.${benefit}.title`)}
              </h3>
              <p className="mt-1 text-ink-muted text-pretty">
                {t(`home.benefits.items.${benefit}.body`)}
              </p>
            </div>
          </article>
        ))}
      </div>
    </Section>
  );
}

interface Testimonial {
  quote: string;
  author: string;
}

export function Testimonials({ dictionary }: SectionProps) {
  const t = (key: string) => translate(dictionary, key);
  const raw = (dictionary.home as Record<string, unknown> | undefined)?.testimonials as
    | { items?: Testimonial[] }
    | undefined;
  const items = raw?.items ?? [];

  return (
    <Section labelledBy="testimonials-title" tone="white">
      <SectionHeading id="testimonials-title" title={t('home.testimonials.title')} />

      <ul className="grid gap-6 md:grid-cols-3">
        {items.map((item) => (
          <li key={item.author}>
            <Card as="figure" className="flex h-full flex-col bg-cream-50">
              <div className="flex gap-0.5 text-accent-500" aria-hidden="true">
                {Array.from({ length: 5 }).map((_, index) => (
                  <Icon key={index} name="star" filled className="h-4 w-4" />
                ))}
              </div>

              <blockquote className="mt-4 flex-1">
                <p className="text-ink text-pretty">{item.quote}</p>
              </blockquote>

              <figcaption className="mt-5 flex items-center gap-3 border-t border-ink/5 pt-4">
                <AvatarPlaceholder
                  seed={item.author}
                  initial={item.author.slice(0, 1).toUpperCase()}
                />
                <span className="text-sm font-medium text-ink-muted">{item.author}</span>
              </figcaption>
            </Card>
          </li>
        ))}
      </ul>
    </Section>
  );
}

export function Scope({ dictionary }: SectionProps) {
  const t = (key: string) => translate(dictionary, key);
  const included = translateList(dictionary, 'home.scope.included.items');
  const excluded = translateList(dictionary, 'home.scope.excluded.items');

  return (
    <Section labelledBy="scope-title">
      <SectionHeading id="scope-title" title={t('home.scope.title')} />

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="bg-warm-50 ring-warm-200">
          <h3 className="font-display text-xl font-bold text-ink">
            {t('home.scope.included.title')}
          </h3>
          <ul className="mt-4 space-y-3">
            {included.map((item) => (
              <li key={item} className="flex gap-3">
                <Icon name="check" className="mt-0.5 h-5 w-5 text-warm-700" />
                <span className="text-ink-muted text-pretty">{item}</span>
              </li>
            ))}
          </ul>
        </Card>

        {/* Dire ce qu'on ne promet pas est un argument, pas un aveu. */}
        <Card className="bg-cream-100">
          <h3 className="font-display text-xl font-bold text-ink">
            {t('home.scope.excluded.title')}
          </h3>
          <ul className="mt-4 space-y-3">
            {excluded.map((item) => (
              <li key={item} className="flex gap-3">
                <Icon name="x" className="mt-0.5 h-5 w-5 text-ink-soft" />
                <span className="text-ink-muted text-pretty">{item}</span>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </Section>
  );
}

export function HomePricing({ dictionary }: SectionProps) {
  const t = (key: string) => translate(dictionary, key);

  return (
    <Section labelledBy="home-pricing-title" tone="white" size="wide">
      <SectionHeading
        id="home-pricing-title"
        eyebrow={t('home.pricing.eyebrow')}
        title={t('home.pricing.title')}
        intro={t('home.pricing.intro')}
      />
      <PricingTable dictionary={dictionary} headingLevel="h3" />
    </Section>
  );
}

export function FinalCta({ dictionary }: SectionProps) {
  const t = (key: string) => translate(dictionary, key);

  return (
    <Section labelledBy="final-cta-title" size="narrow">
      <div className="relative overflow-hidden rounded-3xl bg-ink px-6 py-14 text-center sm:px-12">
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-accent-500/25 blur-3xl"
        />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-20 -left-10 h-56 w-56 rounded-full bg-warm-500/20 blur-3xl"
        />

        <div className="relative">
          <h2
            id="final-cta-title"
            className="font-display text-3xl font-bold text-cream sm:text-4xl"
          >
            {t('home.finalCta.title')}
          </h2>
          <p className="mx-auto mt-4 max-w-md text-cream/80 text-pretty">
            {t('home.finalCta.body')}
          </p>
          <div className="mt-8">
            <ButtonLink href="/tarifs" size="lg">
              {t('home.finalCta.action')}
              <Icon name="arrow-right" className="h-5 w-5" />
            </ButtonLink>
          </div>
        </div>
      </div>
    </Section>
  );
}

const insideIcons: Record<string, IconName> = {
  cover: 'sparkle',
  pages: 'palette',
  story: 'book',
  ending: 'heart',
};

/** Ce que contient réellement un livre — répond à « qu'est-ce que j'achète ». */
export function Inside({ dictionary }: SectionProps) {
  const t = (key: string) => translate(dictionary, key);
  const items = ['cover', 'pages', 'story', 'ending'] as const;

  return (
    <Section labelledBy="inside-title" tone="white">
      <SectionHeading
        id="inside-title"
        eyebrow={t('home.inside.eyebrow')}
        title={t('home.inside.title')}
        intro={t('home.inside.intro')}
      />

      <div className="grid gap-6 md:grid-cols-2">
        {items.map((item) => (
          <Card key={item} as="article" className="h-full bg-cream-50">
            <IconBubble name={insideIcons[item]} tone={item === 'pages' ? 'warm' : 'accent'} />
            <h3 className="mt-5 font-display text-xl font-bold text-ink">
              {t(`home.inside.items.${item}.title`)}
            </h3>
            <p className="mt-2 text-ink-muted text-pretty">
              {t(`home.inside.items.${item}.body`)}
            </p>
          </Card>
        ))}
      </div>
    </Section>
  );
}

interface CompareRow {
  feature: string;
  pdf: boolean;
  relie: boolean;
  pack: boolean;
}

/**
 * Comparatif des formules.
 * Un vrai <table> : c'est de la donnée tabulaire, les lecteurs d'écran
 * annoncent alors l'en-tête de colonne avec chaque cellule.
 */
export function Compare({ dictionary }: SectionProps) {
  const t = (key: string) => translate(dictionary, key);
  const compare = (dictionary.home as Record<string, unknown> | undefined)?.compare as
    | { rows?: CompareRow[] }
    | undefined;
  const rows = compare?.rows ?? [];
  const columns = ['pdf', 'relie', 'pack'] as const;

  return (
    <Section labelledBy="compare-title" size="wide">
      <SectionHeading
        id="compare-title"
        eyebrow={t('home.compare.eyebrow')}
        title={t('home.compare.title')}
        intro={t('home.compare.intro')}
      />

      {/* Le tableau défile horizontalement plutôt que de déborder la page. */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[36rem] border-collapse text-left">
          <caption className="sr-only">{t('home.compare.title')}</caption>
          <thead>
            <tr className="border-b border-ink/10">
              <th scope="col" className="py-4 pr-4 font-display text-sm font-bold text-ink">
                {t('home.compare.columns.feature')}
              </th>
              {columns.map((column) => (
                <th
                  key={column}
                  scope="col"
                  className="px-3 py-4 text-center font-display text-sm font-bold text-ink"
                >
                  {t(`home.compare.columns.${column}`)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.feature} className="border-b border-ink/5">
                <th
                  scope="row"
                  className="py-4 pr-4 text-sm font-normal text-ink-muted text-pretty"
                >
                  {row.feature}
                </th>
                {columns.map((column) => (
                  <td key={column} className="px-3 py-4 text-center">
                    {row[column] ? (
                      <>
                        <Icon
                          name="check"
                          className="mx-auto h-5 w-5 text-accent-700"
                        />
                        <span className="sr-only">{t('home.compare.yes')}</span>
                      </>
                    ) : (
                      <>
                        <span aria-hidden="true" className="text-ink-soft/40">
                          —
                        </span>
                        <span className="sr-only">{t('home.compare.no')}</span>
                      </>
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Section>
  );
}
