import { Notice, Section } from '@/components/ui';
import { translate, type Dictionary } from '@/i18n/getDictionary';

interface LegalSection {
  title: string;
  body: string;
}

/**
 * Gabarit commun aux pages légales : colonne étroite, mesure confortable.
 *
 * Les textes sont des trames génériques, pas un conseil juridique : elles
 * portent un avertissement visible tant que les mentions entre crochets
 * n'ont pas été complétées et le tout relu par un professionnel.
 */
export function LegalPage({
  dictionary,
  scope,
}: {
  dictionary: Dictionary;
  /** Clé de la page dans le dictionnaire : `cgv`, `privacy` ou `refunds`. */
  scope: 'cgv' | 'privacy' | 'refunds';
}) {
  const t = (key: string) => translate(dictionary, key);

  const legal = dictionary.legal as Record<string, unknown> | undefined;
  const page = legal?.[scope] as { sections?: LegalSection[] } | undefined;
  const sections = page?.sections ?? [];

  return (
    <Section size="narrow" labelledBy="legal-title">
      <h1 id="legal-title" className="font-display text-4xl font-bold text-ink">
        {t(`legal.${scope}.title`)}
      </h1>

      <p className="mt-5 max-w-prose text-lg text-ink-muted text-pretty">
        {t(`legal.${scope}.intro`)}
      </p>

      {/* Avertissement : ces trames doivent être relues avant exploitation. */}
      <div className="mt-6">
        <Notice tone="info">{t('legal.disclaimer')}</Notice>
      </div>

      <div className="mt-10 max-w-prose space-y-8">
        {sections.map((section) => (
          <section key={section.title}>
            <h2 className="font-display text-xl font-bold text-ink">{section.title}</h2>
            <p className="mt-3 text-ink-muted text-pretty">{section.body}</p>
          </section>
        ))}
      </div>
    </Section>
  );
}
