import Link from 'next/link';
import type { ComponentProps, ReactNode } from 'react';

import { cn } from '@/lib/cn';

type Variant = 'primary' | 'secondary' | 'ghost' | 'inverse' | 'danger';
type Size = 'sm' | 'md' | 'lg';

/**
 * Le variant `primary` porte du texte encre sur la sarcelle : encre/#14b8a6
 * donne 6.99 de contraste, bien au-dessus du seuil AA.
 * `danger` utilise le rouge hors marque — un signal d'alerte doit être
 * compris sans apprentissage.
 */
const variants: Record<Variant, string> = {
  primary:
    'bg-accent-500 text-ink shadow-glow hover:bg-accent-400 active:bg-accent-600',
  secondary:
    'bg-white text-ink ring-1 ring-inset ring-ink/10 shadow-soft hover:bg-cream-50 hover:ring-ink/20',
  ghost: 'text-accent-700 hover:bg-accent-50',
  inverse: 'bg-cream text-ink hover:bg-white',
  // Action destructive : crème sur rouge foncé (contraste 6.08).
  danger: 'bg-danger-700 text-cream hover:bg-danger-800 active:bg-danger-900',
};

// Cibles tactiles d'au moins 44 px de haut.
const sizes: Record<Size, string> = {
  sm: 'min-h-[2.75rem] px-4 py-2 text-sm',
  md: 'min-h-[3rem] px-6 py-3 text-base',
  lg: 'min-h-[3.5rem] px-8 py-4 text-lg',
};

const base =
  'inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-60';

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
