#!/usr/bin/env node
/**
 * Attribue ou retire le rôle admin à un compte.
 *
 *   npm run admin -- leocheche72@gmail.com          promeut
 *   npm run admin -- leocheche72@gmail.com --revoke rétrograde
 *   npm run admin -- --list                          liste les admins
 *
 * Le rôle vit dans le document `users` de Firestore, jamais dans un jeton
 * client : un utilisateur ne peut pas se promouvoir lui-même.
 *
 * Volontairement hors interface web. Une page « devenir admin », même
 * protégée, est une porte de plus à défendre ; ici, l'accès à la clé de
 * service est la seule condition.
 */

import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

const args = process.argv.slice(2);
const wantsList = args.includes('--list');
const revoke = args.includes('--revoke');
const email = args.find((arg) => !arg.startsWith('--'));

if (!wantsList && !email) {
  console.error('Usage : npm run admin -- <email> [--revoke]');
  console.error('        npm run admin -- --list');
  process.exit(1);
}

if (!process.env.FIREBASE_SERVICE_ACCOUNT) {
  console.error('FIREBASE_SERVICE_ACCOUNT absente. Lancer avec : npm run admin');
  process.exit(1);
}

let credentials;
try {
  let raw = process.env.FIREBASE_SERVICE_ACCOUNT.trim();
  // Tolère une valeur entourée de guillemets, forme produite en copiant
  // une ligne depuis un fichier .env.
  if (
    (raw.startsWith("'") && raw.endsWith("'")) ||
    (raw.startsWith('"') && raw.endsWith('"'))
  ) {
    raw = raw.slice(1, -1);
  }
  credentials = JSON.parse(raw);
} catch {
  console.error('FIREBASE_SERVICE_ACCOUNT n’est pas un JSON valide.');
  process.exit(1);
}

if (getApps().length === 0) {
  initializeApp({
    credential: cert({
      projectId: credentials.project_id,
      clientEmail: credentials.client_email,
      privateKey: credentials.private_key?.replace(/\\n/g, '\n'),
    }),
    projectId: credentials.project_id,
  });
}

const db = getFirestore();

if (wantsList) {
  const snapshot = await db.collection('users').where('role', '==', 'admin').get();

  if (snapshot.empty) {
    console.log('\nAucun compte admin.');
    console.log('En créer un : npm run admin -- votre@email.fr');
  } else {
    console.log(`\n${snapshot.size} compte(s) admin :`);
    for (const doc of snapshot.docs) {
      console.log(`  - ${doc.data().email}`);
    }
  }
  process.exit(0);
}

// Le profil est créé à la première connexion Google : il doit donc exister.
const snapshot = await db.collection('users').where('email', '==', email).limit(1).get();
const doc = snapshot.docs[0];

if (!doc) {
  console.error(`\nAucun compte pour « ${email} ».`);
  console.error('Se connecter une première fois sur le site, puis relancer.');
  process.exit(1);
}

const role = revoke ? 'user' : 'admin';
await doc.ref.update({ role, roleUpdatedAt: new Date().toISOString() });

console.log(`\n${email} → rôle « ${role} »`);

// Les sessions ouvertes portent l'ancien rôle : sans cette purge, il
// faudrait attendre leur expiration pour que le changement s'applique.
const sessions = await db.collection('sessions').where('userId', '==', doc.id).get();
for (const session of sessions.docs) await session.ref.delete();

if (sessions.size > 0) {
  console.log(`${sessions.size} session(s) fermée(s) — se reconnecter pour appliquer.`);
}

process.exit(0);
