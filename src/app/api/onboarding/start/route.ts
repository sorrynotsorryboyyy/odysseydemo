import { randomUUID } from 'node:crypto';

import { NextResponse } from 'next/server';

import { toErrorResponse } from '@/server/lib/errors';

export const dynamic = 'force-dynamic';

/**
 * Ouvre une session d'onboarding.
 * Permet de composer une commande avant d'avoir un compte ; le rattachement
 * se fait au moment du checkout.
 */
export async function POST() {
  try {
    return NextResponse.json({ sessionId: randomUUID() });
  } catch (error) {
    return toErrorResponse(error);
  }
}
