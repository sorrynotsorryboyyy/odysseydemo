'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

import { Icon } from '@/components/ui';
import { cn } from '@/lib/cn';

interface Labels {
  library: string;
  settings: string;
  logout: string;
  openMenu: string;
  admin: string;
}

/**
 * Menu du compte connecté.
 *
 * Remplace le lien « Connexion » une fois la session ouverte. L'e-mail sert
 * de repère : sur un poste partagé, savoir quel compte est actif évite de
 * commander pour le mauvais enfant.
 */
export function AccountMenu({
  email,
  labels,
  isAdmin = false,
}: {
  email: string;
  labels: Labels;
  isAdmin?: boolean;
}) {
  const [isOpen, setOpen] = useState(false);
  const [isPending, setPending] = useState(false);
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);

  // Fermeture au clic extérieur et à la touche Échap : un menu qui reste
  // ouvert derrière le contenu est une gêne, pas une fonctionnalité.
  useEffect(() => {
    if (!isOpen) return;

    const onPointerDown = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };

    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);

    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [isOpen]);

  async function logout() {
    setPending(true);
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      setOpen(false);
      router.push('/');
      // Rafraîchit le rendu serveur : sans cela, l'en-tête continuerait
      // d'afficher la session fermée.
      router.refresh();
    } finally {
      setPending(false);
    }
  }

  // Initiale affichée dans la pastille, sur un e-mail éventuellement vide
  // (session ouverte par lien de récupération).
  const initial = (email.trim()[0] ?? '?').toUpperCase();

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={isOpen}
        aria-haspopup="menu"
        aria-label={labels.openMenu}
        className="flex min-h-[2.75rem] items-center gap-2 border-2 border-ink bg-white px-3 py-2 text-sm font-medium text-ink shadow-ink-sm ring-1 ring-inset ring-ink/10 transition-colors hover:ring-ink/20"
      >
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-accent-500 font-display text-sm font-bold text-ink">
          {initial}
        </span>
        <span className="hidden max-w-[12rem] truncate xl:inline">{email}</span>
        <Icon
          name="arrow-right"
          className={cn(
            'h-4 w-4 shrink-0 text-ink-soft transition-transform',
            isOpen ? '-rotate-90' : 'rotate-90',
          )}
        />
      </button>

      {isOpen ? (
        <div
          role="menu"
          className="absolute right-0 top-full z-50 mt-2 w-64 overflow-hidden bg-white shadow-ink border-2 border-ink"
        >
          <p className="border-b border-ink/5 px-4 py-3 text-sm text-ink-soft">
            <span className="block truncate font-medium text-ink">{email}</span>
          </p>

          <Link
            href="/compte/bibliotheque"
            role="menuitem"
            className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-ink transition-colors hover:bg-cream-50"
          >
            <Icon name="book" className="h-4 w-4 text-accent-700" />
            {labels.library}
          </Link>

          <Link
            href="/compte/parametres"
            role="menuitem"
            className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-ink transition-colors hover:bg-cream-50"
          >
            <Icon name="shield" className="h-4 w-4 text-accent-700" />
            {labels.settings}
          </Link>

          {isAdmin ? (
            <Link
              href="/admin"
              role="menuitem"
              className="flex items-center gap-3 border-t border-ink/5 px-4 py-3 text-sm font-medium text-accent-700 transition-colors hover:bg-accent-50"
            >
              <Icon name="shield" className="h-4 w-4" />
              {labels.admin}
            </Link>
          ) : null}

          <button
            type="button"
            role="menuitem"
            onClick={() => void logout()}
            disabled={isPending}
            className="flex w-full items-center gap-3 border-t border-ink/5 px-4 py-3 text-left text-sm font-medium text-ink-muted transition-colors hover:bg-cream-50 disabled:opacity-60"
          >
            <Icon name="x" className="h-4 w-4" />
            {labels.logout}
          </button>
        </div>
      ) : null}
    </div>
  );
}
