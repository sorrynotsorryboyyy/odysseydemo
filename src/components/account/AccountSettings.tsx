'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { Button, Card, controlClass, Field, Notice } from '@/components/ui';
import { useTranslations } from '@/i18n/TranslationsProvider';

export function AccountSettings() {
  const { t } = useTranslations('account.settings');
  const router = useRouter();
  const [confirmation, setConfirmation] = useState('');
  const [error, setError] = useState(false);
  const [isPending, setPending] = useState(false);

  // Le mot de confirmation est traduit : il suit la langue de l'interface.
  const confirmWord = t('deletion.confirmWord');
  const canDelete = confirmation.trim().toUpperCase() === confirmWord.toUpperCase();

  async function logout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/');
    router.refresh();
  }

  async function deleteAccount(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canDelete) return;

    setError(false);
    setPending(true);

    try {
      const response = await fetch('/api/account', { method: 'DELETE' });
      if (!response.ok) {
        setError(true);
        setPending(false);
        return;
      }

      router.push('/');
      router.refresh();
    } catch {
      setError(true);
      setPending(false);
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <h2 className="font-display text-xl font-bold text-ink">{t('account')}</h2>
        <div className="mt-5">
          <Button type="button" variant="secondary" onClick={() => void logout()}>
            {t('logout')}
          </Button>
        </div>
      </Card>

      {/* Zone destructive : bordure d'alerte et confirmation par saisie. */}
      <Card className="border-2 border-danger-200 bg-danger-50/50 ring-0">
        <h2 className="font-display text-xl font-bold text-ink">
          {t('deletion.title')}
        </h2>
        <p className="mt-3 text-ink-muted text-pretty">{t('deletion.body')}</p>

        <form onSubmit={deleteAccount} className="mt-6 space-y-5">
          <Field htmlFor="confirm-deletion" label={t('deletion.confirmLabel')}>
            <input
              id="confirm-deletion"
              type="text"
              value={confirmation}
              onChange={(event) => setConfirmation(event.target.value)}
              autoComplete="off"
              className={controlClass}
            />
          </Field>

          {error ? (
            <Notice tone="error" role="alert">
              {t('deletion.error')}
            </Notice>
          ) : null}

          <Button
            type="submit"
            disabled={!canDelete || isPending}
            variant="danger"
          >
            {t('deletion.submit')}
          </Button>
        </form>
      </Card>
    </div>
  );
}
