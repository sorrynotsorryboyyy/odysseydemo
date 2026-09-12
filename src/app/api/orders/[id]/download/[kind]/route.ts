import { notFound, toErrorResponse } from '@/server/lib/errors';

export const dynamic = 'force-dynamic';

/**
 * Téléchargement d'un artefact.
 *
 * La génération de livre est hors périmètre pour l'instant : aucun PDF
 * n'existe, la route répond donc systématiquement « pas encore prêt ».
 * Le frontend affiche déjà ce cas correctement.
 */
export async function GET() {
  try {
    throw notFound('artifact_not_ready');
  } catch (error) {
    return toErrorResponse(error);
  }
}
