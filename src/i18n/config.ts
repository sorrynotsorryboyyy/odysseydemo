export const locales = ['fr', 'en', 'de', 'es'] as const;
export type Locale = (typeof locales)[number];

/** Le français est la langue de référence : toute clé manquante y retombe. */
export const defaultLocale: Locale = 'fr';

export const LOCALE_COOKIE = 'taletto_locale';

export const localeLabels: Record<Locale, string> = {
  fr: 'Français',
  en: 'English',
  de: 'Deutsch',
  es: 'Español',
};

/** Codes utilisés dans les balises hrefLang. */
export const hrefLangCodes: Record<Locale, string> = {
  fr: 'fr-FR',
  en: 'en',
  de: 'de-DE',
  es: 'es-ES',
};

export function isLocale(value: unknown): value is Locale {
  return typeof value === 'string' && (locales as readonly string[]).includes(value);
}
