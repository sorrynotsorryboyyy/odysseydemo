import { createHash, randomBytes } from 'node:crypto';

import { cookies } from 'next/headers';

import { env, isProduction } from './env';
import { unauthorized } from './errors';
import { collections, db } from './firebase';

/**
 * Sessions applicatives.
 *
 * Firebase Auth authentifie l'utilisateur ; l'API échange ensuite le jeton
 * Firebase contre une session maison portée par un cookie `httpOnly`. Le
 * jeton Firebase n'est donc jamais exposé au JavaScript de la page, et une
 * session peut être révoquée immédiatement côté serveur.
 *
 * Seul le HACHAGE du jeton est stocké : une fuite de Firestore ne donne
 * aucune session utilisable.
 */

export const SESSION_COOKIE = 'taletto_session';

/** Durée de vie d'une session : 30 jours. */
const SESSION_TTL_MS = 30 * 24 * 60 * 60 * 1000;

export interface SessionUser {
  userId: string;
  email: string;
  role: 'user' | 'admin';
}

function hashToken(token: string): string {
  return createHash('sha256').update(`${token}${env.SESSION_SECRET}`).digest('hex');
}

/** Crée une session et pose le cookie. */
export async function createSession(user: SessionUser): Promise<void> {
  const token = randomBytes(32).toString('base64url');
  const expiresAt = new Date(Date.now() + SESSION_TTL_MS);

  await db().collection(collections.sessions).doc(hashToken(token)).set({
    userId: user.userId,
    email: user.email,
    role: user.role,
    expiresAt: expiresAt.toISOString(),
    createdAt: new Date().toISOString(),
  });

  cookies().set(SESSION_COOKIE, token, {
    httpOnly: true,
    // `Lax` suffit : le site appelle sa propre API, jamais depuis un
    // formulaire tiers.
    sameSite: 'lax',
    secure: isProduction,
    path: '/',
    maxAge: Math.floor(SESSION_TTL_MS / 1000),
  });
}

/** Lit la session courante, ou `null` si absente ou expirée. */
export async function readSession(): Promise<SessionUser | null> {
  const token = cookies().get(SESSION_COOKIE)?.value;
  if (!token) return null;

  try {
    const snapshot = await db()
      .collection(collections.sessions)
      .doc(hashToken(token))
      .get();

    if (!snapshot.exists) return null;

    const data = snapshot.data() as {
      userId: string;
      email: string;
      role: 'user' | 'admin';
      expiresAt: string;
    };

    if (new Date(data.expiresAt).getTime() < Date.now()) {
      // Session expirée : supprimée au passage, plutôt que de laisser
      // s'accumuler des documents morts.
      await snapshot.ref.delete().catch(() => undefined);
      return null;
    }

    return { userId: data.userId, email: data.email, role: data.role };
  } catch {
    // Firebase non configuré ou injoignable : pas de session, pas d'erreur.
    return null;
  }
}

/** Supprime la session courante et efface le cookie. */
export async function destroySession(): Promise<void> {
  const token = cookies().get(SESSION_COOKIE)?.value;

  if (token) {
    await db()
      .collection(collections.sessions)
      .doc(hashToken(token))
      .delete()
      .catch(() => undefined);
  }

  cookies().delete(SESSION_COOKIE);
}

/** Exige une session valide ; lève une 401 sinon. */
export async function requireUser(): Promise<SessionUser> {
  const user = await readSession();
  if (!user) throw unauthorized('unauthorized', 'Session absente ou expirée');
  return user;
}

/** Supprime toutes les sessions d'un utilisateur. */
export async function destroyAllSessions(userId: string): Promise<void> {
  const snapshot = await db()
    .collection(collections.sessions)
    .where('userId', '==', userId)
    .get();

  await Promise.all(snapshot.docs.map((doc) => doc.ref.delete()));
}
