'use client';

import type { ReactNode } from 'react';

import { cn } from '@/lib/cn';

/** Classes communes aux contrôles de saisie. */
export const controlClass =
  'block w-full rounded-xl border-0 bg-white px-4 py-3 text-ink shadow-soft ring-1 ring-inset ring-ink/10 placeholder:text-ink-soft/60 transition-shadow focus:ring-2 focus:ring-inset focus:ring-accent-600 disabled:opacity-60';

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
      <label htmlFor={htmlFor} className="block text-sm font-semibold text-ink">
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
    info: 'bg-accent-50 text-accent-900 ring-accent-200',
    error: 'bg-danger-50 text-danger-900 ring-danger-200',
    success: 'bg-accent-50 text-accent-900 ring-accent-200',
  } as const;

  return (
    <p
      role={role}
      className={cn('rounded-xl px-4 py-3 text-sm font-medium ring-1', tones[tone])}
    >
      {children}
    </p>
  );
}
