'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { Card, Notice } from '@/components/ui';
import { useTranslations } from '@/i18n/TranslationsProvider';

type State = 'checking' | 'invalid' | 'missing' | 'error';

export function ClaimHandler({ token }: { token?: string }) {
  const { t } = useTranslations('account.claim');
  const router = useRouter();
  const [state, setState] = useState<State>(token ? 'checking' : 'missing');

  useEffect(() => {
    if (!token) return;

    let cancelled = false;

    async function claim() {
      try {
        const response = await fetch('/api/claim/session', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ token }),
        });

        if (cancelled) return;

        if (!response.ok) {
          setState('invalid');
          return;
        }

        // Session ouverte : le cookie est posé, on bascule sur la bibliothèque.
        router.replace('/compte/bibliotheque');
        router.refresh();
      } catch {
        if (!cancelled) setState('error');
      }
    }

    void claim();

    return () => {
      cancelled = true;
    };
  }, [token, router]);

  if (state === 'checking') {
    return (
      <Card className="text-center">
        <p aria-live="polite" className="text-ink-muted">
          {t('body')}
        </p>
      </Card>
    );
  }

  return (
    <Card className="space-y-5 text-center">
      <Notice tone="error" role="alert">
        {state === 'missing' ? t('missingToken') : null}
        {state === 'invalid' ? t('invalid') : null}
        {state === 'error' ? t('..common.errors.unreachable') : null}
      </Notice>

      <p className="text-sm text-ink-muted">
        {t('help')}{' '}
        <Link href="/contact" className="font-semibold text-warm-700 hover:underline">
          {t('..common.nav.contact')}
        </Link>
      </p>
    </Card>
  );
}
