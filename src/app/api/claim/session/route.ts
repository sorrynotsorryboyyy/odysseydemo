import { NextResponse } from 'next/server';

import { badRequest, notFound, toErrorResponse } from '@/server/lib/errors';
import { collections, db } from '@/server/lib/firebase';
import { createSession } from '@/server/lib/session';
import { claimSchema, type OrderDocument } from '@/server/lib/types';

export const dynamic = 'force-dynamic';

/**
 * Ouverture de session par lien de récupération.
 * Destiné aux acheteurs sans compte : le jeton, à usage unique, rattache la
 * commande à une session.
 */
export async function POST(request: Request) {
  try {
    const { token } = claimSchema.parse(await request.json());
    const firestore = db();

    const snapshot = await firestore
      .collection(collections.claimTokens)
      .where('token', '==', token)
      .limit(1)
      .get();

    const doc = snapshot.docs[0];
    if (!doc) throw notFound('invalid_token');

    const data = doc.data() as { orderId: string; expiresAt: string; usedAt?: string };

    if (data.usedAt) throw badRequest('token_used', 'Lien déjà utilisé');
    if (new Date(data.expiresAt).getTime() < Date.now()) {
      throw badRequest('token_expired', 'Lien expiré');
    }

    const orderRef = firestore.collection(collections.orders).doc(data.orderId);
    const orderSnapshot = await orderRef.get();
    if (!orderSnapshot.exists) throw notFound('order_not_found');

    const order = orderSnapshot.data() as OrderDocument;

    // Session anonyme rattachée à la commande : suffit pour la consulter,
    // sans créer de compte.
    const userId = order.userId ?? `claim:${data.orderId}`;
    await createSession({ userId, email: '', role: 'user' });

    // Usage unique : le lien ne peut pas être rejoué.
    await doc.ref.update({ usedAt: new Date().toISOString() });
    if (!order.userId) await orderRef.update({ userId });

    return NextResponse.json({ orderId: data.orderId });
  } catch (error) {
    return toErrorResponse(error);
  }
}
