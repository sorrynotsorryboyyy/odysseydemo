import { cert, getApps, initializeApp, type App } from 'firebase-admin/app';
import { getAuth, type Auth } from 'firebase-admin/auth';
import { getFirestore, type Firestore } from 'firebase-admin/firestore';

import { env, firebaseConfigured } from './env';

/**
 * Accès Firebase côté serveur (SDK Admin).
 *
 * L'initialisation est différée : tant que les clés ne sont pas renseignées,
 * le module se charge sans erreur et le site s'affiche. Seules les routes qui
 * touchent réellement à Firestore échouent, avec un message explicite.
 */

/**
 * Lit la clé de compte de service.
 *
 * Tolère les formes que produisent les interfaces de déploiement : valeur
 * entourée de guillemets (copiée depuis un fichier .env), ou clé privée
 * portant de vrais sauts de ligne au lieu de `
` littéraux.
 */
function parseServiceAccount(raw: string): Record<string, string> {
  let value = raw.trim();

  // Guillemets englobants : Vercel les prendrait pour du contenu.
  if (
    (value.startsWith("'") && value.endsWith("'")) ||
    (value.startsWith('"') && value.endsWith('"'))
  ) {
    value = value.slice(1, -1);
  }

  return JSON.parse(value) as Record<string, string>;
}

let app: App | null = null;

function getApp(): App {
  if (app) return app;

  const existing = getApps();
  if (existing.length > 0) {
    app = existing[0]!;
    return app;
  }

  if (!firebaseConfigured) {
    throw new Error(
      'Firebase n’est pas configuré : renseigner FIREBASE_PROJECT_ID et FIREBASE_SERVICE_ACCOUNT.',
    );
  }

  let credentials: Record<string, string>;
  try {
    credentials = parseServiceAccount(env.FIREBASE_SERVICE_ACCOUNT);
  } catch (error) {
    // Message explicite : une variable mal collee dans une interface de
    // deploiement produit sinon un 500 muet, tres long a diagnostiquer.
    throw new Error(
      `FIREBASE_SERVICE_ACCOUNT illisible : ${(error as Error).message}`,
    );
  }

  for (const field of ['project_id', 'client_email', 'private_key'] as const) {
    if (!credentials[field]) {
      throw new Error(
        `FIREBASE_SERVICE_ACCOUNT incomplet : champ "${field}" absent. ` +
          'Utiliser le fichier JSON complet, pas la seule cle privee.',
      );
    }
  }

  app = initializeApp({
    credential: cert({
      projectId: credentials.project_id,
      clientEmail: credentials.client_email,
      // Une clé stockée en variable d'environnement porte des `\n` littéraux :
      // sans cette conversion, la signature échoue.
      privateKey: credentials.private_key?.replace(/\n/g, '\n'),
    }),
    projectId: env.FIREBASE_PROJECT_ID,
  });

  return app;
}

export function auth(): Auth {
  return getAuth(getApp());
}

let firestore: Firestore | null = null;

export function db(): Firestore {
  // `settings()` ne peut être appelé qu'une fois par instance : sans ce
  // garde, le second appel lèverait une erreur.
  if (!firestore) {
    firestore = getFirestore(getApp());
    firestore.settings({ ignoreUndefinedProperties: true });
  }
  return firestore;
}

/** Noms de collections, centralisés pour éviter les fautes de frappe. */
export const collections = {
  users: 'users',
  sessions: 'sessions',
  orders: 'orders',
  claimTokens: 'claimTokens',
  contactMessages: 'contactMessages',
  photos: 'photos',
} as const;
