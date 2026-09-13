import Link from 'next/link';
import type { ComponentProps, ReactNode } from 'react';

import { cn } from '@/lib/cn';

type Variant = 'primary' | 'secondary' | 'ghost' | 'inverse' | 'danger';
type Size = 'sm' | 'md' | 'lg';

/**
 * Le variant `primary` porte du blanc sur corail fonce (warm-700) : 5.97 de
 * contraste. Attention a warm-600, qui ne porte aucun texte lisible — ni
 * blanc (4.14) ni encre (4.21), il tombe dans le creux entre les deux.
 * `danger` utilise le rouge hors marque — un signal d'alerte doit être
 * compris sans apprentissage.
 */
const variants: Record<Variant, string> = {
  primary:
    'bg-warm-700 text-white shadow-card hover:bg-warm-800 hover:shadow-card-hover active:translate-y-px',
  secondary:
    'bg-white text-warm-700 border-2 border-warm-200 hover:border-warm-700 hover:bg-warm-25 active:translate-y-px',
  ghost:
    'text-warm-700 underline decoration-warm-300 decoration-2 underline-offset-4 hover:decoration-warm-700',
  inverse: 'bg-white text-warm-700 shadow-card hover:bg-warm-25',
  // Action destructive : blanc sur rouge foncé (contraste 7.06).
  danger: 'bg-danger-700 text-white hover:bg-danger-800 active:translate-y-px',
};

// Cibles tactiles d'au moins 44 px de haut.
const sizes: Record<Size, string> = {
  sm: 'min-h-[2.75rem] px-4 py-2 text-sm',
  md: 'min-h-[3rem] px-6 py-3 text-base',
  lg: 'min-h-[3.5rem] px-8 py-4 text-lg',
};

/**
 * Bouton franchement arrondi, plein, sans cerne : la couleur porte l'action.
 * La transition ne touche que des proprietes peu couteuses a animer.
 */
const base =
  'inline-flex items-center justify-center gap-2 rounded-pill font-bold tracking-tight transition-[transform,box-shadow,background-color,border-color] duration-200 disabled:cursor-not-allowed disabled:opacity-60 disabled:shadow-none';

export function Button({
  variant = 'primary',
  size = 'md',
  fullWidth,
  className,
  ...props
}: ComponentProps<'button'> & {
  variant?: Variant;
  size?: Size;
  fullWidth?: boolean;
}) {
  return (
    <button
      className={cn(base, variants[variant], sizes[size], fullWidth && 'w-full', className)}
      {...props}
    />
  );
}

export function ButtonLink({
  href,
  variant = 'primary',
  size = 'md',
  fullWidth,
  className,
  children,
}: {
  href: string;
  variant?: Variant;
  size?: Size;
  fullWidth?: boolean;
  className?: string;
  children: ReactNode;
}) {
  return (
    <Link
      href={href}
      className={cn(base, variants[variant], sizes[size], fullWidth && 'w-full', className)}
    >
      {children}
    </Link>
  );
}
