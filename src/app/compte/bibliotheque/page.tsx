import type { Metadata } from 'next';
import Link from 'next/link';

import {
  Badge,
  ButtonLink,
  Card,
  Icon,
  Notice,
  Placeholder,
  Section,
  SectionHeading,
} from '@/components/ui';
import { getDictionary, translate } from '@/i18n/getDictionary';
import { collections, db } from '@/server/lib/firebase';
import { readSession } from '@/server/lib/session';
import { toOrderSummary, type OrderDocument } from '@/server/lib/types';
import type { DashboardResponse } from '@/types/api';

export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  const dictionary = await getDictionary();
  return {
    title: translate(dictionary, 'meta.library.title'),
    description: translate(dictionary, 'meta.library.description'),
    robots: { index: false, follow: false },
  };
}

/** Commandes de l'utilisateur, ou `null` si non connecté ou base injoignable. */
async function loadDashboard(): Promise<DashboardResponse | null> {
  try {
    const user = await readSession();
    if (!user) return null;

    const snapshot = await db()
      .collection(collections.orders)
      .where('userId', '==', user.userId)
      .orderBy('createdAt', 'desc')
      .limit(50)
      .get();

    return {
      orders: snapshot.docs.map((doc) =>
        toOrderSummary({ id: doc.id, ...doc.data() } as OrderDocument),
      ),
    };
  } catch {
    // Firebase non configuré : la page reste servie avec son message d'erreur.
    return null;
  }
}

export default async function LibraryPage() {
  const dictionary = await getDictionary();
  const t = (key: string) => translate(dictionary, key);

  // Lecture directe : cette page est rendue côté serveur, un aller-retour
  // HTTP vers notre propre API n'aurait aucun intérêt.
  const dashboard = await loadDashboard();

  // Backend injoignable ou session expirée : la page reste servie.
  if (!dashboard) {
    return (
      <Section size="narrow" labelledBy="library-title">
        <SectionHeading
          id="library-title"
          as="h1"
          title={t('account.library.title')}
        />
        <Card className="space-y-5 text-center">
          <Notice tone="error" role="alert">
            {t('common.errors.unreachable')}
          </Notice>
          <ButtonLink href="/compte/connexion" variant="secondary">
            {t('common.nav.login')}
          </ButtonLink>
        </Card>
      </Section>
    );
  }

  const { orders } = dashboard;

  return (
    <Section labelledBy="library-title">
      <SectionHeading
        id="library-title"
        as="h1"
        title={t('account.library.title')}
        intro={t('account.library.intro')}
      />

      {orders.length === 0 ? (
        <Card className="mx-auto max-w-lg text-center">
          <p className="text-ink-muted">{t('account.library.empty')}</p>
          <div className="mt-6">
            <ButtonLink href="/tarifs" size="lg">
              {t('account.library.emptyAction')}
            </ButtonLink>
          </div>
        </Card>
      ) : (
        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {orders.map((order) => (
            <li key={order.id}>
              <Card
                as="article"
                labelledBy={`order-${order.id}`}
                className="flex h-full flex-col"
                interactive
              >
                <Placeholder
                  seed={order.id}
                  ratio="book"
                  className="w-24"
                  label={order.childFirstName}
                />

                <h2
                  id={`order-${order.id}`}
                  className="mt-5 font-display text-xl font-bold text-ink"
                >
                  {order.childFirstName}
                </h2>

                <p className="mt-1 text-sm text-ink-soft">
                  {t('account.library.orderedOn')}{' '}
                  <time dateTime={order.createdAt}>
                    {new Date(order.createdAt).toLocaleDateString()}
                  </time>
                </p>

                <p className="mt-4">
                  <Badge tone={order.status === 'failed' ? 'neutral' : 'warm'}>
                    {t(`account.order.status.${order.status}`)}
                  </Badge>
                </p>

                <div className="mt-auto pt-6">
                  <Link
                    href={`/compte/commande/${order.id}`}
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-warm-700 hover:underline"
                  >
                    {t('account.library.viewOrder')}
                    <Icon name="arrow-right" className="h-4 w-4" />
                  </Link>
                </div>
              </Card>
            </li>
          ))}
        </ul>
      )}
    </Section>
  );
}
