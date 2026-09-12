'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { Button, Card, Icon, Notice } from '@/components/ui';
import { useTranslations } from '@/i18n/TranslationsProvider';
import { isFirebaseConfigured, signInWithGoogle } from '@/lib/firebaseClient';

/**
 * Connexion et inscription.
 *
 * Un seul chemin : Google. Aucun mot de passe n'est stocké ni transmis, donc
 * rien à réinitialiser et une surface d'attaque réduite d'autant.
 *
 * Le mode (`login` ou `register`) ne change que le texte affiché : côté
 * Google, la première connexion crée le compte, les suivantes l'ouvrent.
 */
export function AuthForm({ mode }: { mode: 'login' | 'register' }) {
  const { t } = useTranslations(`account.${mode}`);
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isPending, setPending] = useState(false);

  const configured = isFirebaseConfigured();

  async function onGoogle() {
    setError(null);
    setPending(true);

    try {
      const idToken = await signInWithGoogle();

      const response = await fetch('/api/auth/google', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ idToken }),
      });

      if (!response.ok) {
        setError('error');
        setPending(false);
        return;
      }

      router.push('/compte/bibliotheque');
      router.refresh();
    } catch (cause) {
      // L'utilisateur qui ferme la fenêtre Google n'est pas une erreur.
      const code = (cause as { code?: string }).code;
      if (code === 'auth/popup-closed-by-user' || code === 'auth/cancelled-popup-request') {
        setPending(false);
        return;
      }

      setError('error');
      setPending(false);
    }
  }

  return (
    <Card className="space-y-5 text-center">
      <p className="text-ink-muted text-pretty">{t('googleIntro')}</p>

      {!configured ? (
        <Notice tone="error" role="alert">
          {t('..common.errors.unreachable')}
        </Notice>
      ) : null}

      {error ? (
        <Notice tone="error" role="alert">
          {t('error')}
        </Notice>
      ) : null}

      <Button
        type="button"
        size="lg"
        fullWidth
        disabled={isPending || !configured}
        onClick={() => void onGoogle()}
      >
        <Icon name="sparkle" className="h-5 w-5" />
        {t('googleButton')}
      </Button>

      <p className="text-sm text-ink-soft text-pretty">{t('googleNote')}</p>
    </Card>
  );
}
