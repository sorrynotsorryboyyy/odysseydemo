import Link from 'next/link';

import { Badge, Card, Icon } from '@/components/ui';
import { listOrders } from '@/server/services/admin';
import { orderStatuses, type OrderStatus } from '@/server/lib/types';

export const dynamic = 'force-dynamic';

const statusLabels: Record<OrderStatus, string> = {
  pending: 'En attente',
  generating: 'Création',
  ready: 'Prête',
  printing: 'Impression',
  shipped: 'Expédiée',
  failed: 'Échec',
};

export default async function AdminOrders({
  searchParams,
}: {
  searchParams: { statut?: string; q?: string };
}) {
  const status = orderStatuses.includes(searchParams.statut as OrderStatus)
    ? (searchParams.statut as OrderStatus)
    : undefined;

  const orders = await listOrders({ status, search: searchParams.q });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl font-bold text-ink">Commandes</h1>
        <p className="mt-2 text-ink-muted">
          {orders.length} commande{orders.length > 1 ? 's' : ''} affichée
          {orders.length > 1 ? 's' : ''}.
        </p>
      </div>

      {/* Filtres : une navigation par liens, donc partageable et utilisable
          sans JavaScript. */}
      <div className="flex flex-wrap items-center gap-2">
        <Link
          href="/admin/commandes"
          className={`border px-3 py-1.5 text-sm font-medium transition-colors ${
            !status
              ? 'border-ink bg-ink text-cream'
              : 'border-warm-200 bg-white text-ink hover:border-warm-700'
          }`}
        >
          Toutes
        </Link>

        {orderStatuses.map((value) => (
          <Link
            key={value}
            href={`/admin/commandes?statut=${value}`}
            className={`border px-3 py-1.5 text-sm font-medium transition-colors ${
              status === value
                ? 'border-ink bg-ink text-cream'
                : 'border-warm-200 bg-white text-ink hover:border-warm-700'
            }`}
          >
            {statusLabels[value]}
          </Link>
        ))}
      </div>

      <form method="get" className="flex gap-2">
        {status ? <input type="hidden" name="statut" value={status} /> : null}
        <input
          type="search"
          name="q"
          defaultValue={searchParams.q ?? ''}
          placeholder="Prénom de l’enfant ou identifiant"
          className="w-full max-w-sm border border-warm-200 border-b-2 border-b-ink/40 bg-white px-3 py-2 text-ink focus:border-warm-700 focus:outline-none"
        />
        <button
          type="submit"
          className="border border-warm-200 bg-white px-4 py-2 text-sm font-semibold text-ink shadow-card"
        >
          Rechercher
        </button>
      </form>

      {orders.length === 0 ? (
        <Card>
          <p className="text-ink-muted">Aucune commande ne correspond.</p>
        </Card>
      ) : (
        <div className="overflow-x-auto border border-warm-100 bg-white">
          <table className="w-full min-w-[44rem] border-collapse text-left text-sm">
            <thead className="border-b border-warm-100 bg-cream-50">
              <tr>
                <th scope="col" className="px-4 py-3 font-bold text-ink">Enfant</th>
                <th scope="col" className="px-4 py-3 font-bold text-ink">Offre</th>
                <th scope="col" className="px-4 py-3 font-bold text-ink">Montant</th>
                <th scope="col" className="px-4 py-3 font-bold text-ink">Statut</th>
                <th scope="col" className="px-4 py-3 font-bold text-ink">Date</th>
                <th scope="col" className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-b border-warm-100 last:border-0">
                  <td className="px-4 py-3 font-medium text-ink">
                    {order.childFirstName}
                  </td>
                  <td className="px-4 py-3 text-ink-muted">
                    {order.product}
                    {order.print ? ' · imprimé' : ''}
                    {order.cahier ? ' · cahier' : ''}
                  </td>
                  <td className="px-4 py-3 tabular-nums text-ink">
                    {(order.amountCents / 100).toFixed(2)} €
                  </td>
                  <td className="px-4 py-3">
                    <Badge tone={order.status === 'failed' ? 'neutral' : 'accent'}>
                      {statusLabels[order.status]}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 tabular-nums text-ink-soft">
                    {new Date(order.createdAt).toLocaleDateString('fr-FR')}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/admin/commandes/${order.id}`}
                      className="inline-flex items-center gap-1 font-semibold text-warm-700 hover:underline"
                    >
                      Détail
                      <Icon name="arrow-right" className="h-4 w-4" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
