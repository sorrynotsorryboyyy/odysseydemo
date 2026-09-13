import { BookCover } from './BookCover';
import { PricingTable } from './PricingTable';
import {
  ButtonLink,
  Icon,
  ImageSlot,
  StyleImage,
  Section,
  SectionHeading,
} from '@/components/ui';
import { translate, translateList, type Dictionary } from '@/i18n/getDictionary';
import { ageRanges } from '@/lib/ages';
import { illustrationStyles } from '@/lib/styles';

/**
 * Sections de la page d'accueil.
 *
 * Chaque section a une composition distincte : une page dont tous les blocs
 * suivent le schéma « titre + grille de cartes » se lit comme un gabarit,
 * pas comme un site conçu.
 *
 * Aucun texte en dur : tout vient du dictionnaire. Aucune information
 * inventée : les affirmations proviennent de la FAQ et des CGV.
 */

type SectionProps = { dictionary: Dictionary };

/** Lit un tableau d'objets dans le dictionnaire. */
function readList<T>(dictionary: Dictionary, path: string): T[] {
  const value = path
    .split('.')
    .reduce<unknown>(
      (node, key) =>
        node && typeof node === 'object' ? (node as Record<string, unknown>)[key] : undefined,
      dictionary,
    );
  return Array.isArray(value) ? (value as T[]) : [];
}

/* ------------------------------------------------------------------ */

export function Hero({ dictionary }: SectionProps) {
  const t = (key: string) => translate(dictionary, key);

  return (
    <section aria-labelledby="hero-title" className="bg-white">
      <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div className="grid items-center gap-14 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <p className="flex items-center gap-3 text-xs font-bold uppercase tracking-[0.2em] text-accent-700">
              <span aria-hidden="true" className="h-px w-10 bg-accent-700" />
              {t('home.hero.badge')}
            </p>

            <h1
              id="hero-title"
              className="mt-6 font-display text-[2.75rem] font-bold leading-[0.98] tracking-tight text-ink sm:text-6xl lg:text-[4.25rem]"
            >
              {t('home.hero.title')}
            </h1>

            <p className="mt-7 max-w-xl border-l-2 border-accent-700 pl-5 text-lg leading-relaxed text-ink-muted text-pretty">
              {t('home.hero.subtitle')}
            </p>

            {/* Un seul appel à l'action dominant ; le second est secondaire
                par sa forme autant que par sa place. */}
            <div className="mt-9 flex flex-wrap items-center gap-5">
              <ButtonLink href="/tarifs" size="lg">
                {t('common.cta.start')}
                <Icon name="arrow-right" className="h-5 w-5" />
              </ButtonLink>
              <ButtonLink href="/pack" variant="ghost">
                {t('common.cta.discoverPack')}
              </ButtonLink>
            </div>

            <p className="mt-7 border-t border-ink/10 pt-4 text-sm text-ink-soft">
              {t('home.hero.note')}
            </p>
          </div>

          <BookCover pagesLabel={t('home.hero.mockupLabel')} />
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */

interface Guarantee {
  label: string;
  body: string;
}

/**
 * Bandeau d'engagements — fusion des anciennes sections « Proof » et
 * « Benefits », qui répétaient les mêmes garanties.
 *
 * Colonnes séparées par des filets, sans carte ni ombre : le bandeau ancre
 * le hero sans se disputer son attention.
 */
export function Guarantees({ dictionary }: SectionProps) {
  const items = readList<Guarantee>(dictionary, 'home.guarantees.items');

  return (
    <section
      aria-labelledby="guarantees-title"
      className="border-b-2 border-ink bg-white"
    >
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        <h2 id="guarantees-title" className="sr-only">
          {translate(dictionary, 'home.guarantees.title')}
        </h2>

        <dl className="grid divide-y divide-ink/10 sm:grid-cols-2 sm:divide-y-0 lg:grid-cols-4 lg:divide-x">
          {items.map((item) => (
            <div key={item.label} className="px-0 py-6 sm:px-6 lg:first:pl-0 lg:last:pr-0">
              <dt className="font-display text-base font-bold text-ink">{item.label}</dt>
              <dd className="mt-1.5 text-sm leading-relaxed text-ink-muted text-pretty">
                {item.body}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */

/**
 * Ce que contient le livre — fusion de « Formats » et « Inside », qui
 * décrivaient tous deux le produit.
 *
 * Composition en deux temps : un texte long face au visuel, puis les trois
 * formats en colonnes de texte. Pas une carte.
 */
export function WhatYouGet({ dictionary }: SectionProps) {
  const t = (key: string) => translate(dictionary, key);
  const inside = ['cover', 'pages', 'story', 'ending'] as const;
  const formats = ['pdf', 'print', 'cahier'] as const;

  return (
    <Section labelledBy="inside-title" tone="white">
      <div className="grid gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
        <div className="lg:sticky lg:top-28">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent-700">
            {t('home.inside.eyebrow')}
          </p>
          <h2
            id="inside-title"
            className="mt-4 font-display text-3xl font-bold leading-tight text-ink sm:text-4xl"
          >
            {t('home.inside.title')}
          </h2>
          <p className="mt-5 text-ink-muted text-pretty">{t('home.inside.intro')}</p>

          <ImageSlot
            ratio="wide"
            label={t('home.imageSlot.spread')}
            className="mt-8 hidden lg:flex"
          />
        </div>

        {/* Liste définitionnelle : la hiérarchie vient du texte, pas d'un
            cadre autour de chaque élément. */}
        <dl className="divide-y divide-ink/10 border-y border-ink/10">
          {inside.map((item, index) => (
            <div key={item} className="flex gap-6 py-7 first:pt-0 last:pb-0">
              <span className="font-display text-sm font-bold tabular-nums text-accent-700">
                {String(index + 1).padStart(2, '0')}
              </span>
              <div>
                <dt className="font-display text-xl font-bold text-ink">
                  {t(`home.inside.items.${item}.title`)}
                </dt>
                <dd className="mt-2 leading-relaxed text-ink-muted text-pretty">
                  {t(`home.inside.items.${item}.body`)}
                </dd>
              </div>
            </div>
          ))}
        </dl>
      </div>

      <div className="mt-16 border-t border-ink/10 pt-10">
        <h3 className="font-display text-xl font-bold text-ink">
          {t('home.formats.title')}
        </h3>

        <div className="mt-6 grid gap-x-10 gap-y-7 sm:grid-cols-3">
          {formats.map((format) => (
            <div key={format}>
              <h4 className="font-display text-base font-bold text-ink">
                {t(`home.formats.${format}.title`)}
              </h4>
              <p className="mt-2 text-sm leading-relaxed text-ink-muted text-pretty">
                {t(`home.formats.${format}.body`)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}

/* ------------------------------------------------------------------ */

/** Les trois étapes, en ligne, reliées par un filet continu. */
export function Steps({ dictionary }: SectionProps) {
  const t = (key: string) => translate(dictionary, key);
  const steps = ['one', 'two', 'three'] as const;

  return (
    <Section labelledBy="steps-title" tone="teal">
      <SectionHeading
        id="steps-title"
        eyebrow={t('home.steps.eyebrow')}
        title={t('home.steps.title')}
        onColor
      />

      <ol className="relative grid gap-10 md:grid-cols-3 md:gap-8">
        {/* Filet de liaison, seulement là où les étapes sont alignées. */}
        <span
          aria-hidden="true"
          className="absolute left-0 right-0 top-5 hidden h-px bg-ink/15 md:block"
        />

        {steps.map((step, index) => (
          <li key={step} className="relative">
            <span className="relative flex h-11 w-11 items-center justify-center rounded-lg border-2 border-ink bg-white font-display text-lg font-bold text-ink shadow-ink-sm">
              {index + 1}
            </span>
            <h3 className="mt-5 font-display text-xl font-bold text-ink">
              {t(`home.steps.items.${step}.title`)}
            </h3>
            <p className="mt-2 leading-relaxed text-ink-muted text-pretty">
              {t(`home.steps.items.${step}.body`)}
            </p>
          </li>
        ))}
      </ol>
    </Section>
  );
}

/* ------------------------------------------------------------------ */

/** Tranches d'âge : quatre colonnes de texte, séparées par des filets. */
export function AgePicker({ dictionary }: SectionProps) {
  const t = (key: string) => translate(dictionary, key);

  return (
    <Section labelledBy="ages-title" tone="white">
      <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent-700">
            {t('home.ages.eyebrow')}
          </p>
          <h2
            id="ages-title"
            className="mt-4 font-display text-3xl font-bold leading-tight text-ink sm:text-4xl"
          >
            {t('home.ages.title')}
          </h2>
          <p className="mt-4 text-ink-muted text-pretty">{t('home.ages.intro')}</p>
        </div>

        <ul className="grid gap-x-8 gap-y-8 sm:grid-cols-2">
          {ageRanges.map((range) => (
            <li key={range} className="border-t-2 border-ink pt-4">
              <p className="font-display text-2xl font-bold tabular-nums text-ink">
                {t(`home.ages.items.${range}.label`)}
              </p>
              <h3 className="mt-1 text-sm font-bold uppercase tracking-[0.1em] text-accent-700">
                {t(`home.ages.items.${range}.title`)}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-muted text-pretty">
                {t(`home.ages.items.${range}.body`)}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </Section>
  );
}

/* ------------------------------------------------------------------ */

/** Styles d'illustration : la seule grille d'images de la page. */
export function StyleGallery({ dictionary }: SectionProps) {
  const t = (key: string) => translate(dictionary, key);

  return (
    <Section labelledBy="styles-title" tone="coral" size="wide">
      <SectionHeading
        id="styles-title"
        eyebrow={t('home.styles.eyebrow')}
        title={t('home.styles.title')}
        intro={t('home.styles.intro')}
        onColor
      />

      <ul className="grid grid-cols-2 gap-5 md:grid-cols-3">
        {illustrationStyles.map((style) => (
          <li key={style}>
            <figure>
              <StyleImage style={style} label={t(`home.styles.items.${style}`)} />
              <figcaption className="mt-3 text-center text-sm font-bold text-ink">
                {t(`home.styles.items.${style}`)}
              </figcaption>
            </figure>
          </li>
        ))}
      </ul>
    </Section>
  );
}

/* ------------------------------------------------------------------ */

/** Ce qu'on promet et ce qu'on ne promet pas, face à face. */
export function Scope({ dictionary }: SectionProps) {
  const t = (key: string) => translate(dictionary, key);
  const included = translateList(dictionary, 'home.scope.included.items');
  const excluded = translateList(dictionary, 'home.scope.excluded.items');

  return (
    <Section labelledBy="scope-title" tone="paper">
      <SectionHeading id="scope-title" title={t('home.scope.title')} />

      <div className="grid gap-5 md:grid-cols-2">
        <div className="rounded-xl border-2 border-ink bg-white p-7 shadow-ink-sm">
          <h3 className="font-display text-lg font-bold text-ink">
            {t('home.scope.included.title')}
          </h3>
          <ul className="mt-5 space-y-3">
            {included.map((item) => (
              <li key={item} className="flex gap-3">
                <Icon name="check" className="mt-0.5 h-5 w-5 shrink-0 text-accent-700" />
                <span className="text-sm leading-relaxed text-ink-muted text-pretty">
                  {item}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Dire ce qu'on ne promet pas est un argument de confiance, pas un
            aveu : même traitement visuel que la colonne de gauche. */}
        <div className="rounded-xl border-2 border-ink bg-cream-100 p-7 shadow-ink-sm">
          <h3 className="font-display text-lg font-bold text-ink">
            {t('home.scope.excluded.title')}
          </h3>
          <ul className="mt-5 space-y-3">
            {excluded.map((item) => (
              <li key={item} className="flex gap-3">
                <span
                  aria-hidden="true"
                  className="mt-2.5 h-px w-4 shrink-0 bg-ink-soft"
                />
                <span className="text-sm leading-relaxed text-ink-muted text-pretty">
                  {item}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Section>
  );
}

/* ------------------------------------------------------------------ */

interface AfterStep {
  title: string;
  body: string;
}

/**
 * Ce qui se passe après la commande.
 *
 * Remplace l'ancienne section de témoignages, qui présentait trois avis
 * inventés et une notation cinq étoiles jamais collectée. Chaque
 * affirmation ci-dessous provient de la FAQ ou des CGV.
 */
export function AfterOrder({ dictionary }: SectionProps) {
  const t = (key: string) => translate(dictionary, key);
  const steps = readList<AfterStep>(dictionary, 'home.after.steps');

  return (
    <Section labelledBy="after-title" tone="white" size="narrow">
      <SectionHeading
        id="after-title"
        eyebrow={t('home.after.eyebrow')}
        title={t('home.after.title')}
        intro={t('home.after.intro')}
      />

      <ol className="relative border-l border-ink/20 pl-8">
        {steps.map((step, index) => (
          <li key={step.title} className="relative pb-9 last:pb-0">
            <span
              aria-hidden="true"
              className="absolute -left-[2.35rem] top-1 flex h-6 w-6 items-center justify-center rounded-md border border-ink bg-white text-[0.7rem] font-bold tabular-nums text-ink"
            >
              {index + 1}
            </span>
            <h3 className="font-display text-lg font-bold text-ink">{step.title}</h3>
            <p className="mt-2 leading-relaxed text-ink-muted text-pretty">{step.body}</p>
          </li>
        ))}
      </ol>
    </Section>
  );
}

/* ------------------------------------------------------------------ */

export function HomePricing({ dictionary }: SectionProps) {
  const t = (key: string) => translate(dictionary, key);

  return (
    <Section labelledBy="home-pricing-title" tone="paper" size="wide">
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

/* ------------------------------------------------------------------ */

interface CompareRow {
  feature: string;
  pdf: boolean;
  relie: boolean;
  pack: boolean;
}

/**
 * Comparatif des formules.
 * Un vrai `<table>` : c'est de la donnée tabulaire, les lecteurs d'écran
 * annoncent alors l'en-tête de colonne avec chaque cellule.
 */
export function Compare({ dictionary }: SectionProps) {
  const t = (key: string) => translate(dictionary, key);
  const rows = readList<CompareRow>(dictionary, 'home.compare.rows');
  const columns = ['pdf', 'relie', 'pack'] as const;

  return (
    <Section labelledBy="compare-title" tone="paper" size="wide" className="pt-0">
      <h2
        id="compare-title"
        className="font-display text-2xl font-bold text-ink sm:text-3xl"
      >
        {t('home.compare.title')}
      </h2>

      <div className="mt-8 overflow-x-auto border-2 border-ink bg-white">
        <table className="w-full min-w-[36rem] border-collapse text-left">
          <caption className="sr-only">{t('home.compare.title')}</caption>
          <thead>
            <tr className="border-b border-ink">
              <th scope="col" className="px-5 py-4 font-display text-sm font-bold text-ink">
                {t('home.compare.columns.feature')}
              </th>
              {columns.map((column) => (
                <th
                  key={column}
                  scope="col"
                  className="px-4 py-4 text-center font-display text-sm font-bold text-ink"
                >
                  {t(`home.compare.columns.${column}`)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.feature} className="border-b border-ink/10 last:border-0">
                <th
                  scope="row"
                  className="px-5 py-3.5 text-sm font-normal text-ink-muted text-pretty"
                >
                  {row.feature}
                </th>
                {columns.map((column) => (
                  <td key={column} className="px-4 py-3.5 text-center">
                    {row[column] ? (
                      <>
                        <Icon name="check" className="mx-auto h-5 w-5 text-accent-700" />
                        <span className="sr-only">{t('home.compare.yes')}</span>
                      </>
                    ) : (
                      <>
                        <span aria-hidden="true" className="text-ink-soft/50">
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

/* ------------------------------------------------------------------ */

export function FinalCta({ dictionary }: SectionProps) {
  const t = (key: string) => translate(dictionary, key);

  return (
    <section aria-labelledby="final-cta-title" className="border-t border-ink bg-ink">
      <div className="relative mx-auto w-full max-w-3xl px-4 py-20 text-center sm:px-6">
        {/* Trame imprimée plutôt que halo flou : la texture se lit. */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              'url("data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%2720%27 height=%2720%27%3E%3Ccircle cx=%2710%27 cy=%2710%27 r=%272.5%27 fill=%27%23faf8f0%27/%3E%3C/svg%3E")',
          }}
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
          <div className="mt-9">
            <ButtonLink href="/tarifs" size="lg">
              {t('home.finalCta.action')}
              <Icon name="arrow-right" className="h-5 w-5" />
            </ButtonLink>
          </div>
        </div>
      </div>
    </section>
  );
}
