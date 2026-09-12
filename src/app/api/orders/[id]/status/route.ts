import { NextResponse } from 'next/server';

import { forbidden, notFound, toErrorResponse } from '@/server/lib/errors';
import { collections, db } from '@/server/lib/firebase';
import { readSession } from '@/server/lib/session';
import type { OrderDocument } from '@/server/lib/types';

export const dynamic = 'force-dynamic';

export async function GET(
  _request: Request,
  { params }: { params: { id: string } },
) {
  try {
    const snapshot = await db().collection(collections.orders).doc(params.id).get();
    if (!snapshot.exists) throw notFound('order_not_found');

    const order = { id: snapshot.id, ...snapshot.data() } as OrderDocument;
    const session = await readSession();

    // Une commande rattachée à un compte n'est lisible que par lui.
    if (order.userId && order.userId !== session?.userId) {
      throw forbidden('not_your_order');
    }

    return NextResponse.json({
      id: order.id,
      status: order.status,
      progress: order.progress,
      availableDownloads: order.availableDownloads ?? [],
      failureReason: order.failureReason,
    });
  } catch (error) {
    return toErrorResponse(error);
  }
}
