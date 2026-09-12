import 'server-only';

import { cookies } from 'next/headers';

import { defaultLocale, isLocale, LOCALE_COOKIE, type Locale } from './config';

export type Dictionary = Record<string, unknown>;

const loaders: Record<Locale, () => Promise<{ default: Dictionary }>> = {
  fr: () => import('./messages/fr.json'),
  en: () => import('./messages/en.json'),
  de: () => import('./messages/de.json'),
  es: () => import('./messages/es.json'),
};

function isPlainObject(value: unknown): value is Dictionary {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/**
 * Fusionne `override` par-dessus `base`. Toute clé absente de la locale
 * demandée retombe donc sur la valeur française plutôt que d'afficher la
 * clé brute à l'écran.
 */
function deepMerge(base: Dictionary, override: Dictionary): Dictionary {
  const result: Dictionary = { ...base };

  for (const [key, value] of Object.entries(override)) {
    // Une chaîne vide compte comme une traduction manquante : on garde le fr.
    if (value === undefined || value === null || value === '') continue;

    const current = result[key];
    result[key] =
      isPlainObject(current) && isPlainObject(value) ? deepMerge(current, value) : value;
  }

  return result;
}

/** Locale retenue pour la requête courante : cookie, sinon français. */
export function getLocale(): Locale {
  const value = cookies().get(LOCALE_COOKIE)?.value;
  return isLocale(value) ? value : defaultLocale;
}

/** Dictionnaire résolu, replié sur le français. */
export async function getDictionary(locale?: Locale): Promise<Dictionary> {
  const target = locale ?? getLocale();
  const base = (await loaders[defaultLocale]()).default;

  if (target === defaultLocale) return base;

  const translated = (await loaders[target]()).default;
  return deepMerge(base, translated);
}

/**
 * Lit une clé pointée (`home.hero.title`) dans un dictionnaire.
 * Renvoie la clé elle-même si rien n'est trouvé — visible en développement,
 * ce qui vaut mieux qu'un trou silencieux dans la page.
 */
export function translate(dictionary: Dictionary, key: string): string {
  const value = key
    .split('.')
    .reduce<unknown>(
      (node, part) => (isPlainObject(node) ? node[part] : undefined),
      dictionary,
    );

  return typeof value === 'string' ? value : key;
}

/** Variante liste, pour les clés dont la valeur est un tableau de chaînes. */
export function translateList(dictionary: Dictionary, key: string): string[] {
  const value = key
    .split('.')
    .reduce<unknown>(
      (node, part) => (isPlainObject(node) ? node[part] : undefined),
      dictionary,
    );

  return Array.isArray(value) ? value.filter((item): item is string => typeof item === 'string') : [];
}
