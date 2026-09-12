import { NextResponse } from 'next/server';

import { toErrorResponse } from '@/server/lib/errors';
import { db } from '@/server/lib/firebase';
import { readSession } from '@/server/lib/session';

export const dynamic = 'force-dynamic';

/** Consentement RGPD enregistré hors du tunnel de commande. */
export async function POST(request: Request) {
  try {
    const session = await readSession();

    await db().collection('consents').add({
      userId: session?.userId ?? null,
      at: new Date().toISOString(),
      userAgent: request.headers.get('user-agent'),
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return toErrorResponse(error);
  }
}
