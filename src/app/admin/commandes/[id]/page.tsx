import Link from 'next/link';
import { notFound } from 'next/navigation';

import { OrderStatusForm } from '@/components/admin/OrderStatusForm';
import { Card, Icon } from '@/components/ui';
import { loadOrder } from '@/server/services/admin';

export const dynamic = 'force-dynamic';

/** Ligne d'un tableau de définition, pour les champs simples. */
function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-4 border-b border-warm-100 py-3 last:border-0">
      <dt className="w-44 shrink-0 text-sm font-medium text-ink-soft">{label}</dt>
      <dd className="text-sm text-ink text-pretty">{value || '—'}</dd>
    </div>
  );
}

export default async function AdminOrderDetail({
  params,
}: {
  params: { id: string };
}) {
  const order = await loadOrder(params.id);
  if (!order) notFound();

  const p = order.personalization;

  return (
    <div className="space-y-8">
      <Link
        href="/admin/commandes"
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-warm-700 hover:underline"
      >
        <Icon name="arrow-right" className="h-4 w-4 rotate-180" />
        Commandes
      </Link>

      <div>
        <h1 className="font-display text-3xl font-bold text-ink">
          {order.childFirstName}
        </h1>
        <p className="mt-2 font-mono text-sm text-ink-soft">{order.id}</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <div className="space-y-6">
          <Card>
            <h2 className="font-display text-lg font-bold text-ink">Commande</h2>
            <dl className="mt-4">
              <Row label="Offre" value={order.product} />
              <Row label="Impression" value={order.print ? 'Oui' : 'Non'} />
              <Row label="Cahier d’activités" value={order.cahier ? 'Oui' : 'Non'} />
              <Row
                label="Montant"
                value={`${(order.amountCents / 100).toFixed(2)} ${order.currency.toUpperCase()}`}
              />
              <Row
                label="Créée le"
                value={new Date(order.createdAt).toLocaleString('fr-FR')}
              />
              <Row label="Compte" value={order.userId ?? 'Sans compte'} />
            </dl>
          </Card>

          {p ? (
            <Card>
              <h2 className="font-display text-lg font-bold text-ink">
                Personnalisation
              </h2>
              <dl className="mt-4">
                <Row label="Prénom" value={p.firstName} />
                <Row label="Âge" value={`${p.age} ans`} />
                <Row label="Centres d’intérêt" value={p.interests} />
                <Row label="Univers" value={p.universe} />
                <Row label="Thèmes" value={p.themes ?? ''} />
                <Row label="Style" value={p.style} />
                <Row label="Langue" value={p.primaryLanguage} />
                <Row label="Langue secondaire" value={p.secondaryLanguage ?? ''} />
                <Row label="Inclusion" value={p.inclusion ?? ''} />
                <Row label="Photo" value={p.photoId ? 'Fournie' : 'Aucune'} />
              </dl>
            </Card>
          ) : (
            <Card>
              {/* Cas d'une suppression RGPD : la trace comptable subsiste,
                  les données personnelles ont été effacées. */}
              <p className="text-ink-muted">
                Données de personnalisation supprimées (demande RGPD).
              </p>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          <OrderStatusForm orderId={order.id} current={order.status} />

          {order.failureReason ? (
            <Card className="border-danger-700/40 bg-danger-50">
              <h2 className="font-display text-lg font-bold text-danger-900">
                Motif de l’échec
              </h2>
              <p className="mt-3 text-sm text-danger-900 text-pretty">
                {order.failureReason}
              </p>
            </Card>
          ) : null}
        </div>
      </div>
    </div>
  );
}
