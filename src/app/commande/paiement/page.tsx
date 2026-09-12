import type { Metadata } from 'next';

import { ButtonLink, Card, Section } from '@/components/ui';
import { getDictionary, translate } from '@/i18n/getDictionary';

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

/**
 * Point d'entrée de repli vers le paiement.
 *
 * Le chemin nominal ne passe pas par ici : le récapitulatif du formulaire
 * crée la commande puis redirige directement vers la session Stripe. Cette
 * page sert aux arrivées directes (favori, retour arrière), en renvoyant
 * l'utilisateur vers son brouillon plutôt que sur une impasse.
 */
export default async function PaymentPage() {
  const dictionary = await getDictionary();
  const t = (key: string) => translate(dictionary, key);

  return (
    <Section size="narrow" labelledBy="payment-title">
      <Card className="text-center">
        <h1 id="payment-title" className="font-display text-3xl font-bold text-ink">
          {t('checkout.payment.title')}
        </h1>
        <p className="mt-4 text-ink-muted text-pretty">{t('checkout.payment.body')}</p>
        <div className="mt-8">
          <ButtonLink href="/app" size="lg">
            {t('checkout.payment.action')}
          </ButtonLink>
        </div>
      </Card>
    </Section>
  );
}
