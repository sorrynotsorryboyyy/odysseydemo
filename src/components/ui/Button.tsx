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
    'bg-accent-500 text-ink border-2 border-ink shadow-ink hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-ink-lg active:translate-x-0.5 active:translate-y-0.5 active:shadow-none',
  secondary:
    'bg-white text-ink border-2 border-ink shadow-ink-sm hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-ink active:translate-x-0.5 active:translate-y-0.5 active:shadow-none',
  ghost:
    'text-ink border-2 border-transparent underline decoration-accent-600 decoration-2 underline-offset-4 hover:decoration-ink',
  inverse: 'bg-cream text-ink border-2 border-ink hover:bg-white',
  // Action destructive : crème sur rouge foncé (contraste 6.08).
  danger:
    'bg-danger-700 text-cream border-2 border-ink shadow-ink-sm hover:bg-danger-800 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none',
};

// Cibles tactiles d'au moins 44 px de haut.
const sizes: Record<Size, string> = {
  sm: 'min-h-[2.75rem] px-4 py-2 text-sm',
  md: 'min-h-[3rem] px-6 py-3 text-base',
  lg: 'min-h-[3.5rem] px-8 py-4 text-lg',
};

/**
 * L'ombre portee se decale au clic : le bouton s'enfonce, comme une touche.
 * La transition ne porte que sur `transform` et `box-shadow`, les deux
 * proprietes les moins couteuses a animer.
 */
const base =
  'inline-flex items-center justify-center gap-2 rounded-lg font-bold tracking-tight transition-[transform,box-shadow,background-color,border-color] duration-150 disabled:cursor-not-allowed disabled:opacity-60 disabled:shadow-none';

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
