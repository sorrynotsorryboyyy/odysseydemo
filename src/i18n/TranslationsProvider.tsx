'use client';

import { createContext, useContext, useMemo, type ReactNode } from 'react';

import type { Locale } from './config';

type Dictionary = Record<string, unknown>;

interface TranslationsValue {
  locale: Locale;
  dictionary: Dictionary;
}

const TranslationsContext = createContext<TranslationsValue | null>(null);

export function TranslationsProvider({
  locale,
  dictionary,
  children,
}: TranslationsValue & { children: ReactNode }) {
  const value = useMemo(() => ({ locale, dictionary }), [locale, dictionary]);

  return (
    <TranslationsContext.Provider value={value}>{children}</TranslationsContext.Provider>
  );
}

function isPlainObject(value: unknown): value is Dictionary {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function lookup(dictionary: Dictionary, key: string): unknown {
  return key
    .split('.')
    .reduce<unknown>(
      (node, part) => (isPlainObject(node) ? node[part] : undefined),
      dictionary,
    );
}

/**
 * Accès aux traductions depuis un composant client.
 * Le dictionnaire est déjà replié sur le français côté serveur.
 */
export function useTranslations(prefix = '') {
  const context = useContext(TranslationsContext);

  if (!context) {
    throw new Error('useTranslations must be used inside a TranslationsProvider');
  }

  const { dictionary, locale } = context;

  /**
   * Résout une clé relative au préfixe. Une clé ouverte par `..` sort du
   * préfixe et s'applique à la racine du dictionnaire — pratique pour
   * atteindre `common.*` depuis un composant préfixé.
   */
  const fullKey = (key: string) => {
    if (key.startsWith('..')) return key.slice(2);
    return prefix ? `${prefix}.${key}` : key;
  };

  return {
    locale,
    t: (key: string): string => {
      const value = lookup(dictionary, fullKey(key));
      return typeof value === 'string' ? value : fullKey(key);
    },
    list: (key: string): string[] => {
      const value = lookup(dictionary, fullKey(key));
      return Array.isArray(value)
        ? value.filter((item): item is string => typeof item === 'string')
        : [];
    },
  };
}
