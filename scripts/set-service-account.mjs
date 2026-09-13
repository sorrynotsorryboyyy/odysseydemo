#!/usr/bin/env node
/**
 * Insère la clé de compte de service Firebase dans .env.local.
 *
 * Usage :
 *   node scripts/set-service-account.mjs "C:/Users/leoch/Downloads/cle.json"
 *
 * Le JSON téléchargé depuis la console contient des sauts de ligne, qu'une
 * variable d'environnement ne peut pas porter. Ce script le compacte sur une
 * seule ligne et vérifie qu'il s'agit bien d'une clé de compte de service —
 * coller la seule clé privée est l'erreur la plus fréquente.
 *
 * Rien n'est affiché du contenu : le fichier n'est jamais versionné.
 */

import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const source = process.argv[2];

if (!source) {
  console.error('Usage : node scripts/set-service-account.mjs "chemin/vers/cle.json"');
  process.exit(1);
}

const path = resolve(source);
if (!existsSync(path)) {
  console.error(`Fichier introuvable : ${path}`);
  process.exit(1);
}

const raw = readFileSync(path, 'utf8');

let parsed;
try {
  parsed = JSON.parse(raw);
} catch {
  console.error('\nCe fichier n’est pas un JSON valide.');
  if (raw.trimStart().startsWith('-----BEGIN')) {
    console.error(
      'Il semble ne contenir que la clé privée. Il faut le fichier complet\n' +
        'téléchargé depuis : Paramètres du projet > Comptes de service >\n' +
        'Générer une nouvelle clé privée.',
    );
  }
  process.exit(1);
}

// Champs indispensables : sans eux, l'authentification serveur échoue.
const required = ['type', 'project_id', 'private_key', 'client_email'];
const missing = required.filter((field) => !parsed[field]);

if (missing.length > 0) {
  console.error(`\nChamps manquants : ${missing.join(', ')}`);
  console.error('Ce n’est pas une clé de compte de service complète.');
  process.exit(1);
}

if (parsed.type !== 'service_account') {
  console.error(`\nType inattendu : "${parsed.type}" (attendu : service_account)`);
  process.exit(1);
}

const envPath = resolve('.env.local');
let env = existsSync(envPath) ? readFileSync(envPath, 'utf8') : '';

function setVar(key, value) {
  const line = `${key}=${JSON.stringify(value)}`;
  const pattern = new RegExp(`^${key}=.*$`, 'm');
  env = pattern.test(env) ? env.replace(pattern, line) : `${env.trimEnd()}\n${line}\n`;
}

// Compacté sur une ligne : les `\n` de la clé privée deviennent littéraux,
// le code les reconvertit au chargement.
setVar('FIREBASE_SERVICE_ACCOUNT', JSON.stringify(parsed));
setVar('FIREBASE_PROJECT_ID', parsed.project_id);

writeFileSync(envPath, env);

console.log(`\nClé enregistrée pour le projet « ${parsed.project_id} ».`);
console.log(`Compte de service : ${parsed.client_email}`);
console.log('\nVérifier avec : npm run check');
console.log('Le fichier JSON téléchargé peut maintenant être supprimé.');
