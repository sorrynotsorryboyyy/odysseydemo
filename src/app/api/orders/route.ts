import { randomUUID } from 'node:crypto';

import { NextResponse } from 'next/server';

import { resolveOffer } from '@/server/lib/catalog';
import { badRequest, toErrorResponse } from '@/server/lib/errors';
import { collections, db } from '@/server/lib/firebase';
import { readSession } from '@/server/lib/session';
import { createOrderSchema, type OrderDocument } from '@/server/lib/types';

export const dynamic = 'force-dynamic';

/**
 * Crée une commande à l'état `pending`.
 *
 * SÉCURITÉ : le montant vient exclusivement du catalogue serveur. Un client
 * qui trafique le corps de la requête ne peut pas modifier le prix, seulement
 * choisir une offre existante — ou se voir refuser.
 */
export async function POST(request: Request) {
  try {
    const body = createOrderSchema.parse(await request.json());

    const offer = resolveOffer({
      product: body.product,
      print: body.print,
      cahier: body.cahier,
    });

    if (!offer) {
      throw badRequest('unknown_offer', 'Combinaison de paramètres non vendue');
    }

    // Le consentement RGPD conditionne l'enregistrement : sans lui, aucune
    // donnée d'enfant n'est écrite.
    if (body.personalization.consent !== true) {
      throw badRequest('consent_required', 'Consentement RGPD manquant');
    }

    if (body.personalization.photoId && !body.personalization.photoConsent) {
      throw badRequest('photo_consent_required', 'Consentement photo manquant');
    }

    const session = await readSession();
    const now = new Date().toISOString();
    const orderId = randomUUID();

    const order: Omit<OrderDocument, 'id'> = {
      status: 'pending',
      product: body.product,
      print: body.print,
      cahier: body.cahier,
      amountCents: offer.amountCents,
      currency: offer.currency,
      userId: session?.userId ?? null,
      personalization: body.personalization,
      childFirstName: body.personalization.firstName,
      availableDownloads: [],
      createdAt: now,
      updatedAt: now,
    };

    await db().collection(collections.orders).doc(orderId).set(order);

    return NextResponse.json({ id: orderId }, { status: 201 });
  } catch (error) {
    return toErrorResponse(error);
  }
}
