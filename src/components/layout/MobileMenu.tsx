'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

import { ButtonLink, Icon } from '@/components/ui';

import { LocaleSwitcher } from './LocaleSwitcher';

interface Labels {
  open: string;
  close: string;
  login: string;
  library: string;
  cta: string;
  language: string;
  nav: string;
}

/** Navigation repliée sous le point de rupture `lg`. */
export function MobileMenu({
  links,
  labels,
}: {
  links: Array<{ href: string; label: string }>;
  labels: Labels;
}) {
  const [isOpen, setOpen] = useState(false);
  const pathname = usePathname();

  // Refermer après navigation, sinon le panneau reste ouvert sur la page suivante.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Neutraliser le défilement de l'arrière-plan pendant l'ouverture.
  useEffect(() => {
    if (!isOpen) return;

    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', onKeyDown);

    return () => {
      document.body.style.overflow = previous;
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [isOpen]);

  return (
    <div className="lg:hidden">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={isOpen}
        aria-controls="mobile-menu"
        aria-label={isOpen ? labels.close : labels.open}
        className="inline-flex h-11 w-11 items-center justify-center rounded-full text-ink transition-colors hover:bg-white"
      >
        <Icon name={isOpen ? 'x' : 'menu'} className="h-6 w-6" />
      </button>

      {isOpen ? (
        <div
          id="mobile-menu"
          className="fixed inset-x-0 bottom-0 top-16 z-40 overflow-y-auto border-t border-ink/5 bg-cream px-4 py-6 sm:top-20"
        >
          <nav aria-label={labels.nav}>
            <ul className="space-y-1">
              {links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="block rounded-xl px-4 py-3 text-lg font-medium text-ink transition-colors hover:bg-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/compte/bibliotheque"
                  className="block rounded-xl px-4 py-3 text-lg font-medium text-ink transition-colors hover:bg-white"
                >
                  {labels.library}
                </Link>
              </li>
              <li>
                <Link
                  href="/compte/connexion"
                  className="block rounded-xl px-4 py-3 text-lg font-medium text-ink transition-colors hover:bg-white"
                >
                  {labels.login}
                </Link>
              </li>
            </ul>
          </nav>

          <div className="mt-6 space-y-4 border-t border-ink/10 pt-6">
            <ButtonLink href="/tarifs" size="lg" fullWidth>
              {labels.cta}
            </ButtonLink>
            <LocaleSwitcher label={labels.language} />
          </div>
        </div>
      ) : null}
    </div>
  );
}
