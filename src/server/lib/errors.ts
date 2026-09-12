import { NextResponse } from 'next/server';

/**
 * Erreurs métier.
 *
 * Le `code` est stable et exploitable par le frontend ; le `message` part
 * dans les journaux serveur, jamais vers le client — une erreur interne ne
 * doit rien révéler de la structure du système.
 */
export class HttpError extends Error {
  constructor(
    readonly statusCode: number,
    readonly code: string,
    message?: string,
  ) {
    super(message ?? code);
    this.name = 'HttpError';
  }
}

export const badRequest = (code = 'invalid_request', message?: string) =>
  new HttpError(400, code, message);
export const unauthorized = (code = 'unauthorized', message?: string) =>
  new HttpError(401, code, message);
export const forbidden = (code = 'forbidden', message?: string) =>
  new HttpError(403, code, message);
export const notFound = (code = 'not_found', message?: string) =>
  new HttpError(404, code, message);
export const conflict = (code = 'conflict', message?: string) =>
  new HttpError(409, code, message);
export const tooLarge = (code = 'payload_too_large', message?: string) =>
  new HttpError(413, code, message);
export const unavailable = (code = 'service_unavailable', message?: string) =>
  new HttpError(503, code, message);

/**
 * Traduit une exception en réponse HTTP.
 * Partagé par tous les route handlers : un seul endroit décide de ce qui
 * sort vers le client.
 */
export function toErrorResponse(error: unknown): NextResponse {
  if (error instanceof HttpError) {
    if (error.statusCode >= 500) console.error(`[${error.code}]`, error.message);
    return NextResponse.json({ error: error.code }, { status: error.statusCode });
  }

  // Détection par la forme plutôt que par `instanceof` : plusieurs copies de
  // zod peuvent coexister, auquel cas le test d'instance échoue et la trace
  // de validation fuirait au client.
  const issues = (error as { issues?: unknown }).issues;
  if ((error as { name?: string }).name === 'ZodError' && Array.isArray(issues)) {
    return NextResponse.json(
      {
        error: 'invalid_payload',
        issues: (issues as Array<{ path: unknown[]; message: string }>).map((issue) => ({
          path: issue.path.join('.'),
          message: issue.message,
        })),
      },
      { status: 400 },
    );
  }

  console.error('erreur non gérée', error);
  return NextResponse.json({ error: 'internal_error' }, { status: 500 });
}
