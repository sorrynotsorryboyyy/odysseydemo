import { NextResponse } from 'next/server';

import { badRequest, toErrorResponse, unauthorized } from '@/server/lib/errors';
import { auth, collections, db } from '@/server/lib/firebase';
import { createSession } from '@/server/lib/session';
import { googleAuthSchema } from '@/server/lib/types';

export const dynamic = 'force-dynamic';

/**
 * Connexion Google.
 *
 * Le navigateur obtient un `idToken` via le SDK Firebase, puis le transmet
 * ici. Le serveur vérifie sa signature auprès de Firebase avant d'ouvrir une
 * session : un jeton forgé est rejeté.
 */
export async function POST(request: Request) {
  try {
    const { idToken } = googleAuthSchema.parse(await request.json());

    let decoded;
    try {
      decoded = await auth().verifyIdToken(idToken);
    } catch {
      throw unauthorized('invalid_token', 'Jeton Firebase invalide ou expiré');
    }

    const email = decoded.email;
    if (!email) {
      throw badRequest('email_required', 'Le compte Google ne fournit pas d’adresse');
    }

    // Création ou mise à jour du profil applicatif.
    const ref = db().collection(collections.users).doc(decoded.uid);
    const snapshot = await ref.get();

    let role: 'user' | 'admin' = 'user';

    if (!snapshot.exists) {
      await ref.set({
        email,
        displayName: decoded.name ?? null,
        createdAt: new Date().toISOString(),
        role,
      });
    } else {
      const data = snapshot.data() as { role?: 'user' | 'admin'; email?: string };
      role = data.role ?? 'user';
      // L'adresse peut avoir changé côté Google.
      if (data.email !== email) await ref.update({ email });
    }

    await createSession({ userId: decoded.uid, email, role });

    return NextResponse.json({ userId: decoded.uid, email });
  } catch (error) {
    return toErrorResponse(error);
  }
}
