import type { Metadata } from 'next';
import Link from 'next/link';

import { OrderStatus } from '@/components/account/OrderStatus';
import { Card, Icon, Notice, Section } from '@/components/ui';
import { getDictionary, translate } from '@/i18n/getDictionary';
import { collections, db } from '@/server/lib/firebase';
import { readSession } from '@/server/lib/session';
import type { OrderDocument } from '@/server/lib/types';
import type { OrderStatusResponse } from '@/types/api';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

/** Statut d'une commande, ou `null` si absente, interdite ou base injoignable. */
async function loadStatus(orderId: string): Promise<OrderStatusResponse | null> {
  try {
    const snapshot = await db().collection(collections.orders).doc(orderId).get();
    if (!snapshot.exists) return null;

    const order = { id: snapshot.id, ...snapshot.data() } as OrderDocument;
    const session = await readSession();

    // Une commande rattachée à un compte n'est lisible que par lui.
    if (order.userId && order.userId !== session?.userId) return null;

    return {
      id: order.id,
      status: order.status,
      progress: order.progress,
      availableDownloads: order.availableDownloads ?? [],
      failureReason: order.failureReason,
    };
  } catch {
    return null;
  }
}

export default async function OrderPage({ params }: { params: { id: string } }) {
  const dictionary = await getDictionary();
  const t = (key: string) => translate(dictionary, key);

  const status = await loadStatus(params.id);

  const backLink = (
    <Link
      href="/compte/bibliotheque"
      className="inline-flex items-center gap-1.5 text-sm font-semibold text-warm-700 hover:underline"
    >
      <Icon name="arrow-right" className="h-4 w-4 rotate-180" />
      {t('common.nav.library')}
    </Link>
  );

  if (!status) {
    return (
      <Section size="narrow" labelledBy="order-title">
        <h1 id="order-title" className="font-display text-3xl font-bold text-ink">
          {t('account.order.title')}
        </h1>
        <Card className="mt-6 space-y-5">
          <Notice tone="error" role="alert">
            {t('common.errors.unreachable')}
          </Notice>
          {backLink}
        </Card>
      </Section>
    );
  }

  return (
    <Section size="narrow" labelledBy="order-title">
      <div className="mb-6">{backLink}</div>

      <h1 id="order-title" className="font-display text-3xl font-bold text-ink">
        {t('account.order.title')}{' '}
        <span className="text-ink-soft">{params.id}</span>
      </h1>

      <div className="mt-8">
        <OrderStatus orderId={params.id} initial={status} />
      </div>
    </Section>
  );
}
