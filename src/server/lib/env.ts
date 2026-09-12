import { z } from 'zod';

/**
 * Configuration serveur.
 *
 * Toutes les valeurs ont un défaut : sans aucune clé, le site doit compiler
 * et s'afficher. C'est ce que fait Vercel au premier déploiement, avant que
 * les variables soient renseignées. Les fonctionnalités qui dépendent d'un
 * service se dégradent alors proprement au lieu de casser le build.
 */
const schema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),

  NEXT_PUBLIC_SITE_URL: z.string().default('http://localhost:3000'),

  /** Sert à hacher les jetons de session. À remplacer en production. */
  SESSION_SECRET: z
    .string()
    .default('developpement-secret-non-sur-a-remplacer-en-production'),

  // --- Firebase, côté serveur ---
  FIREBASE_PROJECT_ID: z.string().default(''),
  /** Clé de compte de service, JSON sur une seule ligne. Secrète. */
  FIREBASE_SERVICE_ACCOUNT: z.string().default(''),
});

const parsed = schema.safeParse(process.env);

if (!parsed.success) {
  const details = parsed.error.issues
    .map((issue) => `  - ${issue.path.join('.')}: ${issue.message}`)
    .join('\n');
  throw new Error(`Configuration invalide :\n${details}`);
}

export const env = parsed.data;

export const isProduction = env.NODE_ENV === 'production';

/**
 * Vrai lorsque Firebase est réellement configuré.
 * Les routes qui en dépendent renvoient une erreur explicite sinon, plutôt
 * que de planter sur une initialisation impossible.
 */
export const firebaseConfigured =
  Boolean(env.FIREBASE_SERVICE_ACCOUNT) && Boolean(env.FIREBASE_PROJECT_ID);
