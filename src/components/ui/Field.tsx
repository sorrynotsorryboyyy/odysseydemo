'use client';

import type { ReactNode } from 'react';

import { cn } from '@/lib/cn';

/** Classes communes aux contrôles de saisie. */
/**
 * Champs a angles vifs. Le focus epaissit la bordure basse plutot que
 * d'ajouter un anneau diffus : le trait se lit mieux et reste dans le
 * registre imprime.
 */
export const controlClass =
  'block w-full rounded-lg border border-warm-100 bg-white px-3 py-2.5 text-ink placeholder:text-ink-soft transition-colors focus:border-warm-700 focus:outline-none disabled:opacity-60';

/**
 * Enveloppe label + aide + erreur.
 * L'aide et l'erreur sont reliées au contrôle par `aria-describedby`, à câbler
 * par l'appelant via les identifiants dérivés de `htmlFor`.
 */
export function Field({
  htmlFor,
  label,
  hint,
  error,
  children,
  className,
}: {
  htmlFor: string;
  label: string;
  hint?: string;
  error?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('space-y-2', className)}>
      <label
        htmlFor={htmlFor}
        className="block text-xs font-bold uppercase tracking-[0.1em] text-ink"
      >
        {label}
      </label>

      {hint ? (
        <p id={`${htmlFor}-hint`} className="text-sm text-ink-soft text-pretty">
          {hint}
        </p>
      ) : null}

      {children}

      {error ? (
        <p id={`${htmlFor}-error`} role="alert" className="text-sm font-medium text-danger-700">
          {error}
        </p>
      ) : null}
    </div>
  );
}

/** Bandeau de message, pour les retours de formulaire. */
export function Notice({
  tone = 'info',
  children,
  role,
}: {
  tone?: 'info' | 'error' | 'success';
  children: ReactNode;
  role?: 'alert' | 'status';
}) {
  // L'erreur utilise `danger` (rouge) et non une couleur de marque : le
  // rouge est le seul signal d'alerte compris sans apprentissage.
  const tones = {
    info: 'border-accent-200 bg-accent-50 text-accent-900',
    error: 'border-danger-200 bg-danger-50 text-danger-900',
    success: 'border-accent-200 bg-accent-50 text-accent-900',
  } as const;

  return (
    <p
      role={role}
      className={cn('rounded-lg border-2 px-4 py-3 text-sm font-medium', tones[tone])}
    >
      {children}
    </p>
  );
}
