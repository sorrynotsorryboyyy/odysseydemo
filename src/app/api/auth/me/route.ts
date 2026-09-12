import { NextResponse } from 'next/server';

import { toErrorResponse } from '@/server/lib/errors';
import { requireUser } from '@/server/lib/session';

export const dynamic = 'force-dynamic';

/** Session courante : le frontend s'en sert pour afficher l'état connecté. */
export async function GET() {
  try {
    const user = await requireUser();
    return NextResponse.json(user);
  } catch (error) {
    return toErrorResponse(error);
  }
}
