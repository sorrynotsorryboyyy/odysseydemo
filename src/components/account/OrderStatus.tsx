'use client';

import { useEffect, useState } from 'react';

import { Badge, Card, Icon, Notice } from '@/components/ui';
import { useTranslations } from '@/i18n/TranslationsProvider';
import type { ArtifactKind, OrderStatusResponse } from '@/types/api';

const POLL_INTERVAL_MS = 5000;

/** Statuts pour lesquels il n'y a plus rien à attendre. */
const TERMINAL: ReadonlySet<string> = new Set(['ready', 'printing', 'shipped', 'failed']);

/**
 * Statut de génération, rafraîchi tant que la création est en cours.
 * Le premier statut vient du rendu serveur : l'affichage est correct même
 * si le JavaScript n'a pas encore pris la main.
 */
export function OrderStatus({
  orderId,
  initial,
}: {
  orderId: string;
  initial: OrderStatusResponse;
}) {
  const { t } = useTranslations('account.order');
  const [status, setStatus] = useState(initial);

  useEffect(() => {
    if (TERMINAL.has(status.status)) return;

    let cancelled = false;

    const timer = setInterval(async () => {
      try {
        const response = await fetch(`/api/orders/${orderId}/status`, {
          cache: 'no-store',
        });
        if (!response.ok) return;

        const next = (await response.json()) as OrderStatusResponse;
        if (!cancelled) setStatus(next);
      } catch {
        // Coupure réseau passagère : on retentera au tick suivant.
      }
    }, POLL_INTERVAL_MS);

    return () => {
      cancelled = true;
      clearInterval(timer);
    };
  }, [orderId, status.status]);

  const isGenerating = status.status === 'generating';

  return (
    <div className="space-y-6">
      <Card>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-display text-xl font-bold text-ink">{t('statusLabel')}</h2>
          <Badge tone={status.status === 'failed' ? 'neutral' : 'warm'}>
            <span aria-live="polite">{t(`status.${status.status}`)}</span>
          </Badge>
        </div>

        {isGenerating ? (
          <div className="mt-5">
            <p className="text-ink-muted text-pretty">{t('generating')}</p>
            {/* Barre indéterminée si le backend ne fournit pas de pourcentage. */}
            <div
              role="progressbar"
              aria-valuenow={status.progress}
              aria-valuemin={0}
              aria-valuemax={100}
              className="mt-4 h-2 overflow-hidden border border-ink/15 bg-cream-100"
            >
              <div
                className="h-full bg-accent-500 transition-[width] duration-500"
                style={{ width: `${status.progress ?? 35}%` }}
              />
            </div>
          </div>
        ) : null}

        {status.status === 'failed' ? (
          <div className="mt-5">
            <Notice tone="error" role="alert">
              {t('failed')}
            </Notice>
          </div>
        ) : null}
      </Card>

      <Downloads orderId={orderId} kinds={status.availableDownloads} />
    </div>
  );
}

function Downloads({ orderId, kinds }: { orderId: string; kinds: ArtifactKind[] }) {
  const { t } = useTranslations('account.order');

  return (
    <Card>
      <h2 className="font-display text-xl font-bold text-ink">{t('downloads')}</h2>

      {kinds.length === 0 ? (
        <p className="mt-4 text-ink-muted">{t('noDownloads')}</p>
      ) : (
        <ul className="mt-4 space-y-3">
          {kinds.map((kind) => (
            <li key={kind}>
              {/* Téléchargement direct : le proxy relaie le PDF en flux. */}
              <a
                href={`/api/orders/${orderId}/download/${kind}`}
                className="flex items-center justify-between gap-3 rounded-xl bg-cream-50 px-4 py-3 font-medium text-ink ring-1 ring-ink/5 transition-colors hover:bg-accent-50"
              >
                {t(`kinds.${kind}`)}
                <Icon name="download" className="h-5 w-5 text-accent-700" />
              </a>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
