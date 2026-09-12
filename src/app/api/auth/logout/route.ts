import { NextResponse } from 'next/server';

import { toErrorResponse } from '@/server/lib/errors';
import { destroySession } from '@/server/lib/session';

export const dynamic = 'force-dynamic';

export async function POST() {
  try {
    await destroySession();
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return toErrorResponse(error);
  }
}
