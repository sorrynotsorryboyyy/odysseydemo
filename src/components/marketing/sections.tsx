import { BookCover } from './BookCover';
import { PricingTable } from './PricingTable';
import {
  ButtonLink,
  ColorField,
  Icon,
  IconBubble,
  ImageSlot,
  StyleImage,
  hasStyleImage,
  Reveal,
  Section,
  SectionHeading,
} from '@/components/ui';
import { translate, translateList, type Dictionary } from '@/i18n/getDictionary';
import { ageRanges } from '@/lib/ages';
import { cn } from '@/lib/cn';
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
    <section
      aria-labelledby="hero-title"
      className="relative isolate overflow-hidden bg-white"
    >
      <ColorField palette="duo" />

      <div className="relative mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div className="grid items-center gap-14 lg:grid-cols-[1.1fr_0.9fr]">
          <Reveal>
            <p className="flex items-center gap-3 text-xs font-bold uppercase tracking-[0.2em] text-warm-700">
              <span aria-hidden="true" className="h-px w-10 bg-warm-700" />
              {t('home.hero.badge')}
            </p>

            <h1
              id="hero-title"
              className="mt-6 font-display text-[2.75rem] font-bold leading-[0.98] tracking-tight text-ink sm:text-6xl lg:text-[4.25rem]"
            >
              {t('home.hero.title')}
            </h1>

            <p className="mt-7 max-w-xl border-l-2 border-warm-700 pl-5 text-lg leading-relaxed text-ink-muted text-pretty">
              {t('home.hero.subtitle')}
            </p>

            {/* Un seul appel à l'action dominant ; le second est secondaire
                par sa forme autant que par sa place. */}
            <div className="mt-9 flex flex-wrap items-center gap-5">
              <ButtonLink href="/tarifs" size="lg" variant="inverse">
                {t('common.cta.start')}
                <Icon name="arrow-right" className="h-5 w-5" />
              </ButtonLink>
              <ButtonLink href="/pack" variant="ghost">
                {t('common.cta.discoverPack')}
              </ButtonLink>
            </div>

            <p className="mt-7 border-t border-warm-100 pt-4 text-sm text-ink-soft">
              {t('home.hero.note')}
            </p>
          </Reveal>

          {/* Deux animations sur un même élément se disputeraient `transform` :
              la révélation est portée par le wrapper, le flottement par
              l'enfant. */}
          <Reveal delay={140}>
            <div className="animate-float">
              <BookCover pagesLabel={t('home.hero.mockupLabel')} />
            </div>
          </Reveal>
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

  /**
   * Une icône par engagement, dans l'ordre du dictionnaire. Le repli sur
   * `check` évite qu'un cinquième engagement ajouté plus tard casse la
   * grille.
   */
  const marks = [
    { icon: 'tag', tone: 'warm' },
    { icon: 'infinity', tone: 'accent' },
    { icon: 'download', tone: 'sun' },
    { icon: 'refresh', tone: 'warm' },
  ] as const;

  return (
    <section aria-labelledby="guarantees-title" className="bg-white">
      <div className="mx-auto w-full max-w-6xl px-4 pb-16 sm:px-6 lg:px-8">
        <h2 id="guarantees-title" className="sr-only">
          {translate(dictionary, 'home.guarantees.title')}
        </h2>

        <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item, index) => {
            const mark = marks[index] ?? { icon: 'check', tone: 'warm' };
            return (
              <Reveal key={item.label} delay={index * 80}>
                <div className="flex h-full flex-col items-center rounded-2xl bg-warm-25 px-5 py-7 text-center">
                  <IconBubble name={mark.icon} tone={mark.tone} />
                  <dt className="mt-4 font-display text-base font-bold text-ink">
                    {item.label}
                  </dt>
                  <dd className="mt-1.5 text-sm leading-relaxed text-ink-muted text-pretty">
                    {item.body}
                  </dd>
                </div>
              </Reveal>
            );
          })}
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

  const insideIcons = {
    cover: 'book',
    pages: 'palette',
    story: 'sparkle',
    ending: 'heart',
  } as const;
  const insideTones = {
    cover: 'warm',
    pages: 'accent',
    story: 'sun',
    ending: 'warm',
  } as const;
  const formatIcons = { pdf: 'download', print: 'printer', cahier: 'star' } as const;

  return (
    <Section labelledBy="inside-title" tone="white">
      <SectionHeading
        id="inside-title"
        eyebrow={t('home.inside.eyebrow')}
        title={t('home.inside.title')}
        intro={t('home.inside.intro')}
      />

      {/* Le visuel occupe la pleine largeur : c'est lui qui montre le
          produit, le texte ne fait que le nommer. */}
      <Reveal>
        <ImageSlot
          ratio="wide"
          src="/images/style-ligne-claire.png"
          label={t('home.imageSlot.spread')}
          sizes="(max-width: 768px) 92vw, 72rem"
          className="mx-auto max-w-5xl"
        />
      </Reveal>

      {/* Quatre repères en grille plutôt qu'en liste : chacun tient sur une
          icône et deux lignes. */}
      <ul className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {inside.map((item, index) => (
          <Reveal as="li" key={item} delay={index * 90}>
            <div className="flex h-full flex-col rounded-xl bg-white p-6 shadow-card">
              <IconBubble name={insideIcons[item]} tone={insideTones[item]} />
              <h3 className="mt-4 font-display text-lg font-bold text-ink">
                {t(`home.inside.items.${item}.title`)}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-muted text-pretty">
                {t(`home.inside.items.${item}.body`)}
              </p>
            </div>
          </Reveal>
        ))}
      </ul>

      {/* Trois formats, trois pastilles colorées. */}
      <div className="mt-16">
        <h3 className="text-center font-display text-xl font-bold text-ink">
          {t('home.formats.title')}
        </h3>

        <div className="mt-8 grid gap-6 sm:grid-cols-3">
          {formats.map((format, index) => (
            <Reveal key={format} delay={index * 90}>
              <div className="flex h-full flex-col items-center rounded-xl bg-warm-25 p-7 text-center">
                <IconBubble name={formatIcons[format]} tone="warm" />
                <h4 className="mt-4 font-display text-base font-bold text-ink">
                  {t(`home.formats.${format}.title`)}
                </h4>
                <p className="mt-2 text-sm leading-relaxed text-ink-muted text-pretty">
                  {t(`home.formats.${format}.body`)}
                </p>
              </div>
            </Reveal>
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
  // Une couleur par étape : la progression se lit sans compter.
  const stepTones = [
    'bg-warm-100 text-warm-900',
    'bg-sun-100 text-sun-900',
    'bg-accent-100 text-accent-900',
  ] as const;

  return (
    <Section labelledBy="steps-title" tone="paper" glow="warm">
      <SectionHeading
        id="steps-title"
        eyebrow={t('home.steps.eyebrow')}
        title={t('home.steps.title')}
      />

      <ol className="relative grid gap-8 md:grid-cols-3">
        {/* Filet de liaison, seulement là où les étapes sont alignées. */}
        <span
          aria-hidden="true"
          className="absolute left-[16%] right-[16%] top-14 hidden h-0.5 origin-left animate-draw-line bg-warm-200 md:block"
        />

        {steps.map((step, index) => (
          <Reveal as="li" key={step} delay={index * 120} className="relative">
            <div className="flex h-full flex-col items-center rounded-2xl bg-white p-8 text-center shadow-card">
              {/* Le chiffre porte la couleur : c'est le repère qu'on suit. */}
              <span
                className={cn(
                  'flex h-16 w-16 items-center justify-center rounded-2xl font-display text-2xl font-bold',
                  stepTones[index],
                )}
              >
                {index + 1}
              </span>
              <h3 className="mt-5 font-display text-xl font-bold text-ink">
                {t(`home.steps.items.${step}.title`)}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-muted text-pretty">
                {t(`home.steps.items.${step}.body`)}
              </p>
            </div>
          </Reveal>
        ))}
      </ol>
    </Section>
  );
}

/* ------------------------------------------------------------------ */

/** Tranches d'âge : quatre colonnes de texte, séparées par des filets. */
export function AgePicker({ dictionary }: SectionProps) {
  const t = (key: string) => translate(dictionary, key);

  // Une teinte par tranche : quatre blocs de couleur plutôt que quatre
  // paragraphes. Tous portent du texte encre, vérifié au-dessus de 11.
  const ageTones = [
    'bg-warm-100',
    'bg-sun-100',
    'bg-accent-100',
    'bg-warm-200',
  ] as const;

  return (
    <Section labelledBy="ages-title" tone="white" glow="duo">
      <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-warm-700">
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

        <ul className="grid gap-5 sm:grid-cols-2">
          {ageRanges.map((range, index) => (
            <Reveal as="li" key={range} delay={index * 80}>
              <div
                className={cn(
                  'flex h-full flex-col rounded-2xl p-6 transition-transform duration-200 hover:-translate-y-1',
                  ageTones[index % ageTones.length],
                )}
              >
                {/* L'âge en grand : c'est le critère de choix. */}
                <p className="font-display text-4xl font-bold tabular-nums text-ink">
                  {t(`home.ages.items.${range}.label`)}
                </p>
                <h3 className="mt-2 text-sm font-bold uppercase tracking-[0.1em] text-ink/70">
                  {t(`home.ages.items.${range}.title`)}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-ink-muted text-pretty">
                  {t(`home.ages.items.${range}.body`)}
                </p>
              </div>
            </Reveal>
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

      {/* Les styles illustrés passent devant : la galerie s'ouvre sur du
          contenu réel, les emplacements encore vides finissent la grille.
          Les six restent affichés — tous sont commandables. */}
      <ul className="grid grid-cols-2 gap-5 md:grid-cols-3">
        {[...illustrationStyles]
          .sort((a, b) => Number(hasStyleImage(b)) - Number(hasStyleImage(a)))
          .map((style, index) => (
          <Reveal as="li" key={style} delay={index * 70}>
            <figure className="transition-transform duration-200 hover:-translate-y-1">
              <StyleImage style={style} label={t(`home.styles.items.${style}`)} />
              <figcaption className="mt-3 text-center text-sm font-bold text-ink">
                {t(`home.styles.items.${style}`)}
              </figcaption>
            </figure>
          </Reveal>
        ))}
      </ul>
    </Section>
  );
}

/* ------------------------------------------------------------------ */

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

/* ------------------------------------------------------------------ */

export function FinalCta({ dictionary }: SectionProps) {
  const t = (key: string) => translate(dictionary, key);

  return (
    <section
      aria-labelledby="final-cta-title"
      className="relative isolate overflow-hidden bg-warm-700"
    >
      <div className="relative mx-auto w-full max-w-3xl px-4 py-20 text-center sm:px-6">
        {/* Trame imprimée plutôt que halo flou : la texture se lit. */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-[0.12]"
          style={{
            backgroundImage:
              'url("data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%2720%27 height=%2720%27%3E%3Ccircle cx=%2710%27 cy=%2710%27 r=%272.5%27 fill=%27%23ffffff%27/%3E%3C/svg%3E")',
          }}
        />

        <div className="relative">
          <h2
            id="final-cta-title"
            className="font-display text-4xl font-bold text-white sm:text-5xl"
          >
            {t('home.finalCta.title')}
          </h2>
          <p className="mx-auto mt-4 max-w-md text-lg text-white/90 text-pretty">
            {t('home.finalCta.body')}
          </p>
          <div className="mt-9">
            <ButtonLink href="/tarifs" size="lg" variant="inverse">
              {t('home.finalCta.action')}
              <Icon name="arrow-right" className="h-5 w-5" />
            </ButtonLink>
          </div>
        </div>
      </div>
    </section>
  );
}
