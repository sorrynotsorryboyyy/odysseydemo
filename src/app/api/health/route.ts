import { NextResponse } from 'next/server';

import { env, firebaseConfigured } from '@/server/lib/env';
import { collections, db } from '@/server/lib/firebase';

export const dynamic = 'force-dynamic';

/**
 * Diagnostic de configuration.
 *
 * Indique quelles variables manquent et si Firestore répond, sans jamais
 * révéler une valeur. Sur une plateforme de déploiement, une variable mal
 * collée produit sinon un 500 muet très long à élucider.
 */
export async function GET() {
  const checks: Record<string, string> = {};

  // Présence des variables, sans exposer leur contenu.
  checks.FIREBASE_PROJECT_ID = env.FIREBASE_PROJECT_ID ? 'défini' : 'MANQUANT';
  checks.FIREBASE_SERVICE_ACCOUNT = env.FIREBASE_SERVICE_ACCOUNT
    ? `défini (${env.FIREBASE_SERVICE_ACCOUNT.length} caractères)`
    : 'MANQUANT';
  checks.SESSION_SECRET =
    env.SESSION_SECRET.length >= 32 ? 'défini' : 'TROP COURT (32 minimum)';
  checks.NEXT_PUBLIC_SITE_URL = env.NEXT_PUBLIC_SITE_URL;

  if (!firebaseConfigured) {
    return NextResponse.json(
      { status: 'incomplet', checks, hint: 'Renseigner les variables manquantes.' },
      { status: 503 },
    );
  }

  // Aller-retour réel : une variable présente mais invalide échoue ici.
  try {
    await db().collection(collections.users).limit(1).get();
    checks.firestore = 'accessible';
  } catch (error) {
    checks.firestore = 'ÉCHEC';
    return NextResponse.json(
      {
        status: 'erreur',
        checks,
        // Le message de `firebase.ts` est explicite et ne contient aucune
        // valeur : il est sûr de le remonter.
        error: (error as Error).message.slice(0, 300),
      },
      { status: 503 },
    );
  }

  return NextResponse.json({ status: 'ok', checks });
}
