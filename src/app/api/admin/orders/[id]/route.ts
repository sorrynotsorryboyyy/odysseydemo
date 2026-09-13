import { NextResponse } from 'next/server';

import { badRequest, toErrorResponse } from '@/server/lib/errors';
import { requireAdmin } from '@/server/lib/session';
import { orderStatuses, type OrderStatus } from '@/server/lib/types';
import { updateOrderStatus } from '@/server/services/admin';

export const dynamic = 'force-dynamic';

/**
 * Changement de statut d'une commande.
 *
 * `requireAdmin` lève une 404 pour un non-admin : la route ne révèle pas
 * son existence.
 */
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    await requireAdmin();

    const body = (await request.json()) as { status?: string };

    if (!body.status || !orderStatuses.includes(body.status as OrderStatus)) {
      throw badRequest('invalid_status');
    }

    await updateOrderStatus(params.id, body.status as OrderStatus);

    return NextResponse.json({ id: params.id, status: body.status });
  } catch (error) {
    return toErrorResponse(error);
  }
}
