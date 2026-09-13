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
    'bg-accent-500 text-ink border border-ink shadow-ink hover:-translate-x-px hover:-translate-y-px hover:shadow-[4px_4px_0_0_rgb(26_26_26)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none',
  secondary:
    'bg-white text-ink border border-ink/25 shadow-print hover:border-ink hover:shadow-lifteded active:translate-x-0.5 active:translate-y-0.5 active:shadow-none',
  ghost: 'text-accent-700 border border-transparent hover:border-ink/20 hover:bg-accent-50',
  inverse: 'bg-cream text-ink border border-ink/20 hover:bg-white',
  // Action destructive : crème sur rouge foncé (contraste 6.08).
  danger:
    'bg-danger-700 text-cream border border-danger-900 shadow-print hover:bg-danger-800 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none',
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
  'inline-flex items-center justify-center gap-2 font-semibold tracking-tight transition-[transform,box-shadow,background-color,border-color] duration-150 disabled:cursor-not-allowed disabled:opacity-60 disabled:shadow-none';

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
