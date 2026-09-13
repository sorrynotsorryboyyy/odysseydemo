#!/usr/bin/env node
/**
 * Vérifie que les clés fonctionnent RÉELLEMENT.
 *
 * Usage : npm run check
 *
 * Ne se contente pas de constater qu'une variable est renseignée : fait un
 * aller-retour écriture/suppression sur Firestore, interroge Firebase Auth et
 * soumet la clé Web à Google. Une clé présente mais invalide est le cas qui
 * fait perdre le plus de temps.
 *
 * Aucune valeur n'est affichée : seulement des verdicts.
 */

console.log('Vérification des clés\n');
let fail = 0;
const ok = (s, d) => console.log(`  ok    ${s.padEnd(22)} ${d}`);
const ko = (s, d) => { fail++; console.log(` ÉCHEC  ${s.padEnd(22)} ${d}`); };

// --- Clé de compte de service : lecture ET écriture Firestore ---
try {
  const { initializeApp, cert, getApps } = await import('firebase-admin/app');
  const { getFirestore } = await import('firebase-admin/firestore');
  const { getAuth } = await import('firebase-admin/auth');

  const creds = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
  if (getApps().length === 0) {
    initializeApp({
      credential: cert({
        projectId: creds.project_id,
        clientEmail: creds.client_email,
        privateKey: creds.private_key?.replace(/\n/g, '\n'),
      }),
      projectId: process.env.FIREBASE_PROJECT_ID,
    });
  }

  // Le projet du JSON doit correspondre à FIREBASE_PROJECT_ID.
  if (creds.project_id !== process.env.FIREBASE_PROJECT_ID) {
    ko('Cohérence projet', `JSON=${creds.project_id} vs var=${process.env.FIREBASE_PROJECT_ID}`);
  } else {
    ok('Cohérence projet', creds.project_id);
  }

  const db = getFirestore();
  const ref = db.collection('_diagnostics').doc('check');
  await ref.set({ at: new Date().toISOString() });
  await ref.delete();
  ok('Firestore', 'écriture et suppression réussies');

  await getAuth().listUsers(1);
  ok('Firebase Auth', 'accessible');
} catch (e) {
  ko('Compte de service', e.message.slice(0, 110));
}

// --- Configuration Web : la clé API est-elle acceptée par Google ? ---
try {
  const key = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
  const r = await fetch(
    `https://identitytoolkit.googleapis.com/v1/projects?key=${key}`,
  );
  if (r.status === 200 || r.status === 403) {
    // 403 = clé valide mais endpoint restreint : la clé existe bel et bien.
    ok('Clé Web', 'reconnue par Google');
  } else {
    const body = await r.text();
    ko('Clé Web', `HTTP ${r.status} — ${body.slice(0, 80)}`);
  }
} catch (e) {
  ko('Clé Web', e.message.slice(0, 110));
}

// --- Cohérence des identifiants publics ---
const dom = process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ?? '';
const pub = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ?? '';
if (dom.startsWith(pub)) ok('Domaine Auth', dom);
else ko('Domaine Auth', `${dom} ne correspond pas au projet ${pub}`);

if (pub === process.env.FIREBASE_PROJECT_ID) ok('Projets alignés', pub);
else ko('Projets alignés', 'la config Web vise un autre projet que le serveur');

console.log(fail === 0 ? '\nToutes les clés fonctionnent.' : `\n${fail} problème(s).`);
process.exit(fail === 0 ? 0 : 1);
