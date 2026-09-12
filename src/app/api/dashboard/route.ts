import { NextResponse } from 'next/server';

import { toErrorResponse } from '@/server/lib/errors';
import { collections, db } from '@/server/lib/firebase';
import { requireUser } from '@/server/lib/session';
import { toOrderSummary, type OrderDocument } from '@/server/lib/types';

export const dynamic = 'force-dynamic';

/** Commandes de l'utilisateur connecté, les plus récentes d'abord. */
export async function GET() {
  try {
    const user = await requireUser();

    const snapshot = await db()
      .collection(collections.orders)
      .where('userId', '==', user.userId)
      .orderBy('createdAt', 'desc')
      .limit(50)
      .get();

    const orders = snapshot.docs.map((doc) =>
      toOrderSummary({ id: doc.id, ...doc.data() } as OrderDocument),
    );

    return NextResponse.json({ orders });
  } catch (error) {
    return toErrorResponse(error);
  }
}
