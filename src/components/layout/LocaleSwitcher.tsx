'use client';

import { useRouter } from 'next/navigation';
import { useId, useTransition } from 'react';

import { LOCALE_COOKIE, locales, localeLabels, type Locale } from '@/i18n/config';
import { useTranslations } from '@/i18n/TranslationsProvider';

/**
 * Sélection de la langue par cookie : les 4 langues partagent une URL.
 * Le cookie est posé côté client puis la route est rafraîchie pour que le
 * rendu serveur reparte avec le bon dictionnaire.
 */
export function LocaleSwitcher({ label }: { label: string }) {
  const { locale } = useTranslations();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const selectId = useId();

  function onChange(next: Locale) {
    // 1 an, sur tout le site. Pas de donnée personnelle : simple préférence.
    document.cookie = `${LOCALE_COOKIE}=${next}; path=/; max-age=31536000; samesite=lax`;
    startTransition(() => router.refresh());
  }

  return (
    <div className="flex items-center gap-2">
      <label htmlFor={selectId} className="sr-only">
        {label}
      </label>
      <select
        id={selectId}
        value={locale}
        disabled={isPending}
        onChange={(event) => onChange(event.target.value as Locale)}
        className="form-select min-h-[2.75rem] border border-ink/20 bg-white py-2 pl-3 pr-9 text-sm font-medium text-ink shadow-print ring-1 ring-inset ring-ink/10 transition-colors hover:ring-ink/20 disabled:opacity-60"
      >
        {locales.map((code) => (
          <option key={code} value={code}>
            {localeLabels[code]}
          </option>
        ))}
      </select>
    </div>
  );
}
