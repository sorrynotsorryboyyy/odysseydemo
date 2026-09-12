'use client';

import { getApp, getApps, initializeApp, type FirebaseApp } from 'firebase/app';
import {
  GoogleAuthProvider,
  getAuth,
  signInWithPopup,
  type Auth,
} from 'firebase/auth';

/**
 * Firebase côté navigateur.
 *
 * Cette configuration est PUBLIQUE par nature : elle identifie le projet,
 * elle n'autorise rien par elle-même. Les droits réels sont vérifiés par le
 * serveur, qui contrôle la signature du jeton avant d'ouvrir une session.
 *
 * À ne pas confondre avec la clé de compte de service, elle secrète, qui
 * reste côté serveur.
 */

const config = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

/** Vrai lorsque la configuration Web est renseignée. */
export function isFirebaseConfigured(): boolean {
  return Boolean(config.apiKey && config.authDomain && config.projectId);
}

function app(): FirebaseApp {
  return getApps().length > 0 ? getApp() : initializeApp(config);
}

function clientAuth(): Auth {
  return getAuth(app());
}

/**
 * Ouvre la fenêtre Google et renvoie le jeton d'identité.
 * Ce jeton est ensuite transmis à l'API, qui vérifie sa signature.
 */
export async function signInWithGoogle(): Promise<string> {
  if (!isFirebaseConfigured()) {
    throw new Error('firebase_not_configured');
  }

  const provider = new GoogleAuthProvider();
  // Force le choix du compte : sans cela, Google reconnecte silencieusement
  // le dernier compte utilisé, ce qui déroute sur un poste partagé.
  provider.setCustomParameters({ prompt: 'select_account' });

  const credential = await signInWithPopup(clientAuth(), provider);
  return credential.user.getIdToken();
}
