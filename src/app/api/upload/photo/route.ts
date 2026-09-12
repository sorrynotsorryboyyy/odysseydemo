import { randomUUID } from 'node:crypto';

import { NextResponse } from 'next/server';

import { badRequest, toErrorResponse, tooLarge } from '@/server/lib/errors';
import { collections, db } from '@/server/lib/firebase';

export const dynamic = 'force-dynamic';

const MAX_BYTES = 5 * 1024 * 1024;
const ACCEPTED = ['image/jpeg', 'image/png', 'image/webp'];

/**
 * Photo de référence.
 *
 * Les contrôles de type et de taille sont refaits ici : la validation côté
 * navigateur ne protège de rien.
 *
 * Le stockage de fichiers (Cloudinary) est hors périmètre : seules les
 * métadonnées sont enregistrées, ce qui suffit au parcours de commande.
 */
export async function POST(request: Request) {
  try {
    const form = await request.formData();
    const file = form.get('photo');

    if (!(file instanceof File)) throw badRequest('missing_photo');

    if (!ACCEPTED.includes(file.type)) {
      throw badRequest('unsupported_type', 'Formats acceptés : JPEG, PNG, WebP');
    }

    if (file.size > MAX_BYTES) {
      throw tooLarge('photo_too_large', 'Maximum 5 Mo');
    }

    const photoId = randomUUID();

    await db().collection(collections.photos).doc(photoId).set({
      mimeType: file.type,
      sizeBytes: file.size,
      createdAt: new Date().toISOString(),
      // Purge programmée : la politique de confidentialité l'annonce.
      purgeAfter: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
      stored: false,
    });

    return NextResponse.json({ photoId });
  } catch (error) {
    return toErrorResponse(error);
  }
}
