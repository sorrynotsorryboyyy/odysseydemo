'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { Button, Card, Notice } from '@/components/ui';

const statuses = [
  { value: 'pending', label: 'En attente' },
  { value: 'generating', label: 'Création en cours' },
  { value: 'ready', label: 'Prête' },
  { value: 'printing', label: 'En impression' },
  { value: 'shipped', label: 'Expédiée' },
  { value: 'failed', label: 'Échec' },
] as const;

/** Changement de statut d'une commande depuis l'espace d'administration. */
export function OrderStatusForm({
  orderId,
  current,
}: {
  orderId: string;
  current: string;
}) {
  const router = useRouter();
  const [status, setStatus] = useState(current);
  const [state, setState] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

  async function save() {
    setState('saving');

    try {
      const response = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        setState('error');
        return;
      }

      setState('saved');
      // Rafraîchit le rendu serveur : sans cela, la page garderait
      // l'ancien statut jusqu'au prochain chargement complet.
      router.refresh();
    } catch {
      setState('error');
    }
  }

  return (
    <Card>
      <h2 className="font-display text-lg font-bold text-ink">Statut</h2>

      <div className="mt-4 space-y-4">
        <label htmlFor="order-status" className="sr-only">
          Statut de la commande
        </label>
        <select
          id="order-status"
          value={status}
          onChange={(event) => {
            setStatus(event.target.value);
            setState('idle');
          }}
          className="block w-full border border-ink/25 border-b-2 border-b-ink/40 bg-white px-3 py-2.5 text-ink focus:border-accent-700 focus:outline-none"
        >
          {statuses.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        {state === 'error' ? (
          <Notice tone="error" role="alert">
            L’enregistrement a échoué.
          </Notice>
        ) : null}

        {state === 'saved' ? (
          <Notice tone="success" role="status">
            Statut enregistré.
          </Notice>
        ) : null}

        <Button
          type="button"
          onClick={() => void save()}
          disabled={state === 'saving' || status === current}
          fullWidth
        >
          Enregistrer
        </Button>
      </div>
    </Card>
  );
}
