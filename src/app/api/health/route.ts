import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

/**
 * Diagnostic de configuration.
 *
 * Ne dépend d'AUCUN module applicatif : tout est lu directement depuis
 * `process.env`, et chaque étape est isolée. Une route de diagnostic qui
 * plante ne diagnostique rien — c'est précisément quand la configuration
 * est cassée qu'on en a besoin.
 *
 * Aucune valeur n'est révélée, seulement des constats.
 */
export async function GET() {
  const checks: Record<string, string> = {};
  const problems: string[] = [];

  // --- Présence des variables ---
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT ?? '';
  const projectId = process.env.FIREBASE_PROJECT_ID ?? '';
  const secret = process.env.SESSION_SECRET ?? '';

  checks.FIREBASE_PROJECT_ID = projectId || 'MANQUANT';
  checks.SESSION_SECRET = secret ? `défini (${secret.length} car.)` : 'MANQUANT';
  checks.NEXT_PUBLIC_SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'MANQUANT';

  if (!raw) {
    checks.FIREBASE_SERVICE_ACCOUNT = 'MANQUANT';
    problems.push('FIREBASE_SERVICE_ACCOUNT absente');
  } else {
    // La forme de la valeur explique la plupart des échecs.
    const trimmed = raw.trim();
    const realNewlines = (raw.match(/\n/g) ?? []).length;
    const wrapped =
      (trimmed.startsWith("'") && trimmed.endsWith("'")) ||
      (trimmed.startsWith('"') && trimmed.endsWith('"'));

    checks.FIREBASE_SERVICE_ACCOUNT = [
      `${raw.length} caractères`,
      wrapped ? 'entourée de guillemets' : 'sans guillemets englobants',
      realNewlines > 0 ? `${realNewlines} sauts de ligne réels` : 'une seule ligne',
    ].join(' · ');

    // --- Lecture ---
    let value = trimmed;
    if (wrapped) value = value.slice(1, -1);

    try {
      const parsed = JSON.parse(value) as Record<string, string>;
      const missing = ['project_id', 'client_email', 'private_key'].filter(
        (field) => !parsed[field],
      );

      if (missing.length > 0) {
        checks.json = `INCOMPLET — manque : ${missing.join(', ')}`;
        problems.push('clé de service incomplète (fichier JSON entier attendu)');
      } else {
        checks.json = `valide — projet ${parsed.project_id}`;
        if (projectId && parsed.project_id !== projectId) {
          problems.push(
            `le JSON vise ${parsed.project_id} mais FIREBASE_PROJECT_ID vaut ${projectId}`,
          );
        }
      }
    } catch (error) {
      checks.json = `ILLISIBLE — ${(error as Error).message.slice(0, 90)}`;
      problems.push('la valeur n’est pas un JSON valide');
    }
  }

  // --- Connexion réelle, seulement si tout le reste tient ---
  if (problems.length === 0) {
    try {
      const { collections, db } = await import('@/server/lib/firebase');
      await db().collection(collections.users).limit(1).get();
      checks.firestore = 'accessible';
    } catch (error) {
      checks.firestore = 'ÉCHEC';
      problems.push(`Firestore : ${(error as Error).message.slice(0, 140)}`);
    }
  }

  return NextResponse.json(
    { status: problems.length === 0 ? 'ok' : 'erreur', checks, problems },
    { status: problems.length === 0 ? 200 : 503 },
  );
}
