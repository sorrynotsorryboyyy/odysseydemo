import { NextResponse } from 'next/server';

import { badRequest, notFound, toErrorResponse } from '@/server/lib/errors';
import { collections, db } from '@/server/lib/firebase';
import { env } from '@/server/lib/env';
import { readSession } from '@/server/lib/session';
import type { OrderDocument } from '@/server/lib/types';

export const dynamic = 'force-dynamic';

/**
 * Fin du tunnel de commande.
 *
 * Le paiement et la génération sont hors périmètre : la commande reste en
 * `pending` et l'utilisateur est renvoyé vers la confirmation. Le frontend
 * suit l'URL retournée comme il suivrait une URL Stripe — aucun changement
 * n'est nécessaire de son côté quand le paiement sera branché.
 */
export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { orderId?: string };
    if (!body?.orderId) throw badRequest('missing_order_id');

    const ref = db().collection(collections.orders).doc(body.orderId);
    const snapshot = await ref.get();
    if (!snapshot.exists) throw notFound('order_not_found');

    // Rattachement au compte connecté, si la commande a été composée avant
    // la connexion.
    const session = await readSession();
    if (session?.userId && !(snapshot.data() as OrderDocument).userId) {
      await ref.update({ userId: session.userId, updatedAt: new Date().toISOString() });
    }

    return NextResponse.json({
      url: `${env.NEXT_PUBLIC_SITE_URL}/commande/confirmation?order=${body.orderId}`,
    });
  } catch (error) {
    return toErrorResponse(error);
  }
}
