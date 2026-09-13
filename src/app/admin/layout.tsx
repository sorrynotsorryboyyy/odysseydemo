import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { ReactNode } from 'react';

import { Container, Icon } from '@/components/ui';
import { readSession } from '@/server/lib/session';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Administration',
  // L'espace d'administration n'a rien à faire dans un index de recherche.
  robots: { index: false, follow: false },
};

const tabs = [
  { href: '/admin', label: 'Tableau de bord', icon: 'sparkle' },
  { href: '/admin/commandes', label: 'Commandes', icon: 'book' },
  { href: '/admin/messages', label: 'Messages', icon: 'heart' },
  { href: '/admin/comptes', label: 'Comptes', icon: 'shield' },
] as const;

/**
 * Enveloppe de l'espace d'administration.
 *
 * Le contrôle d'accès est ici, au niveau du layout : toutes les pages en
 * héritent, aucune ne peut l'oublier.
 *
 * Un visiteur sans rôle admin reçoit une 404, pas une 403 : signaler
 * « interdit » révélerait qu'une zone d'administration existe à cette
 * adresse.
 */
export default async function AdminLayout({ children }: { children: ReactNode }) {
  const session = await readSession();
  if (session?.role !== 'admin') notFound();

  return (
    <div className="min-h-screen bg-paper">
      <div className="border-b-2 border-ink bg-ink text-cream">
        <Container size="wide">
          <div className="flex flex-wrap items-center justify-between gap-4 py-5">
            <div>
              <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-accent-400">
                <Icon name="shield" className="h-4 w-4" />
                Administration
              </p>
              <p className="mt-1 font-display text-2xl font-bold">Taletto</p>
            </div>

            <div className="flex items-center gap-4 text-sm">
              <span className="text-cream/70">{session.email}</span>
              <Link href="/" className="font-semibold text-accent-400 hover:underline">
                Retour au site
              </Link>
            </div>
          </div>

          <nav aria-label="Sections d’administration">
            <ul className="flex flex-wrap gap-1">
              {tabs.map((tab) => (
                <li key={tab.href}>
                  <Link
                    href={tab.href}
                    className="flex items-center gap-2 border-b-2 border-transparent px-4 py-3 text-sm font-medium text-cream/80 transition-colors hover:border-accent-400 hover:text-cream"
                  >
                    <Icon name={tab.icon} className="h-4 w-4" />
                    {tab.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </Container>
      </div>

      <Container size="wide">
        <div className="py-10">{children}</div>
      </Container>
    </div>
  );
}
