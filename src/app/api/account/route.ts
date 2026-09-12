import { NextResponse } from 'next/server';

import { toErrorResponse } from '@/server/lib/errors';
import { auth, collections, db } from '@/server/lib/firebase';
import { destroyAllSessions, destroySession, requireUser } from '@/server/lib/session';

export const dynamic = 'force-dynamic';

/**
 * Suppression de compte (RGPD).
 *
 * Efface le compte Firebase, le profil et les sessions. Les commandes sont
 * anonymisées plutôt que détruites : la trace comptable est une obligation
 * légale, mais elle ne conserve aucune donnée personnelle.
 */
export async function DELETE() {
  try {
    const user = await requireUser();
    const firestore = db();

    const orders = await firestore
      .collection(collections.orders)
      .where('userId', '==', user.userId)
      .get();

    const batch = firestore.batch();
    for (const doc of orders.docs) {
      batch.update(doc.ref, {
        userId: null,
        personalization: null,
        childFirstName: '[supprimé]',
        deletedAt: new Date().toISOString(),
      });
    }
    batch.delete(firestore.collection(collections.users).doc(user.userId));
    await batch.commit();

    await destroyAllSessions(user.userId);
    await auth().deleteUser(user.userId).catch(() => undefined);
    await destroySession();

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return toErrorResponse(error);
  }
}
