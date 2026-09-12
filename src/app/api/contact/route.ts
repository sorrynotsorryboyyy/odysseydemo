import { NextResponse } from 'next/server';

import { toErrorResponse } from '@/server/lib/errors';
import { collections, db } from '@/server/lib/firebase';
import { contactSchema } from '@/server/lib/types';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const body = contactSchema.parse(await request.json());

    await db().collection(collections.contactMessages).add({
      ...body,
      createdAt: new Date().toISOString(),
      handledAt: null,
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return toErrorResponse(error);
  }
}
