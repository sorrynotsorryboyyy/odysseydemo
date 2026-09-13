import Link from 'next/link';

import { Card, Icon } from '@/components/ui';
import { loadStats } from '@/server/services/admin';
import type { OrderStatus } from '@/server/lib/types';

export const dynamic = 'force-dynamic';

/** Libellés des statuts, dans l'ordre du cycle de vie d'une commande. */
const statusLabels: Record<OrderStatus, string> = {
  pending: 'En attente',
  generating: 'Création en cours',
  ready: 'Prête',
  printing: 'En impression',
  shipped: 'Expédiée',
  failed: 'Échec',
};

function formatEuros(cents: number): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  }).format(cents / 100);
}

export default async function AdminDashboard() {
  const stats = await loadStats();

  const tiles = [
    { label: 'Commandes', value: String(stats.total), href: '/admin/commandes' },
    {
      // Ne compte que les commandes honorées : une commande en attente n'a
      // pas été payée.
      label: 'Chiffre d’affaires',
      value: formatEuros(stats.revenueCents),
      href: '/admin/commandes',
    },
    { label: 'Comptes', value: String(stats.users), href: '/admin/comptes' },
    { label: 'Messages', value: String(stats.contactMessages), href: '/admin/messages' },
  ];

  return (
    <div className="space-y-10">
      <div>
        <h1 className="font-display text-3xl font-bold text-ink">Tableau de bord</h1>
        <p className="mt-2 text-ink-muted">Vue d’ensemble de l’activité.</p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {tiles.map((tile) => (
          <Link key={tile.label} href={tile.href}>
            <Card interactive className="h-full">
              <p className="text-xs font-bold uppercase tracking-[0.15em] text-ink-soft">
                {tile.label}
              </p>
              <p className="mt-3 font-display text-4xl font-bold tabular-nums text-ink">
                {tile.value}
              </p>
            </Card>
          </Link>
        ))}
      </div>

      <section aria-labelledby="status-title">
        <h2 id="status-title" className="font-display text-xl font-bold text-ink">
          Commandes par statut
        </h2>

        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {(Object.keys(statusLabels) as OrderStatus[]).map((status) => {
            const count = stats.byStatus[status] ?? 0;
            const isAlert = status === 'failed' && count > 0;

            return (
              <Link key={status} href={`/admin/commandes?statut=${status}`}>
                <Card
                  interactive
                  className={isAlert ? 'border-danger-700/40 bg-danger-50' : ''}
                >
                  <div className="flex items-baseline justify-between gap-3">
                    <span className="text-sm font-medium text-ink">
                      {statusLabels[status]}
                    </span>
                    <span
                      className={`font-display text-2xl font-bold tabular-nums ${
                        isAlert ? 'text-danger-700' : 'text-ink'
                      }`}
                    >
                      {count}
                    </span>
                  </div>

                  {isAlert ? (
                    <p className="mt-2 flex items-center gap-1.5 text-xs font-medium text-danger-700">
                      <Icon name="x" className="h-3.5 w-3.5" />
                      À traiter
                    </p>
                  ) : null}
                </Card>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
