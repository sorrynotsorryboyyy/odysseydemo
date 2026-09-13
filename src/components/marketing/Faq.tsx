import { Icon } from '@/components/ui';
import { type Dictionary } from '@/i18n/getDictionary';

interface FaqItem {
  question: string;
  answer: string;
}

/** Lit les entrées de FAQ du dictionnaire (`faq.items`). */
export function getFaqItems(dictionary: Dictionary): FaqItem[] {
  const faq = dictionary.faq as { items?: FaqItem[] } | undefined;
  return faq?.items ?? [];
}

/**
 * Liste de questions/réponses. `details`/`summary` donne le repli et la
 * navigation clavier sans une ligne de JavaScript.
 */
export function FaqList({ items }: { items: FaqItem[] }) {
  return (
    <div className="mx-auto max-w-3xl space-y-3">
      {items.map((item) => (
        <details
          key={item.question}
          className="group bg-white px-5 shadow-print border border-ink/15 transition-shadow open:shadow-lifted"
        >
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-5 font-display text-lg font-bold text-ink marker:content-none">
            {item.question}
            <Icon
              name="arrow-right"
              className="h-5 w-5 shrink-0 rotate-90 text-accent-700 transition-transform duration-200 group-open:-rotate-90"
            />
          </summary>
          <p className="pb-5 text-ink-muted text-pretty">{item.answer}</p>
        </details>
      ))}
    </div>
  );
}
