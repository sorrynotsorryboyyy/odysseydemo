# Mise en ligne

## 1. Firebase

### Firestore
Console > **Firestore Database** > Creer une base > mode **production** > region **europe-west** (`eur3`).

### Regles de securite
Console > Firestore > onglet **Regles**, coller le contenu de `firestore.rules`, puis **Publier**.

Ces regles refusent tout acces direct depuis un navigateur. Ce n'est pas une
erreur : l'API Next.js utilise le SDK Admin, qui les contourne. Si une cle Web
fuite, personne ne peut lire la base pour autant.

### Index
Console > Firestore > onglet **Index** > Creer un index composite :

| Collection | Champs | Portee |
|---|---|---|
| `orders` | `userId` (croissant), `createdAt` (decroissant) | Collection |

Sans lui, la bibliotheque renvoie une erreur. Firestore propose aussi un lien
de creation directe dans le message d'erreur, si l'oubli passe inapercu.

### Authentication
Console > **Authentication** > Commencer > onglet **Sign-in method** :
- activer **Google**
- renseigner un **e-mail d'assistance** (obligatoire, sinon l'activation echoue)

Onglet **Settings** > *Domaines autorises* : verifier `localhost`, et **ajouter
le domaine Vercel apres le deploiement** — sans cela la connexion marche en
local mais echoue en ligne.

### Les deux cles

| Cle | Ou | Secrete ? |
|---|---|---|
| Compte de service (JSON) | Parametres > Comptes de service > Generer une cle privee | **Oui** |
| Configuration Web | Parametres > Vos applications > Application Web | Non (`NEXT_PUBLIC_`) |

La seconde est souvent oubliee : sans elle, le bouton Google reste desactive.

---

## 2. Vercel

Import du depot, framework Next.js detecte automatiquement.

Variables a declarer dans **Settings > Environment Variables** (jamais dans le depot) :

```
SESSION_SECRET                      (celui de .env.local, ou en regenerer un)
FIREBASE_PROJECT_ID
FIREBASE_SERVICE_ACCOUNT            le JSON sur une seule ligne
NEXT_PUBLIC_SITE_URL                https://<projet>.vercel.app
NEXT_PUBLIC_FIREBASE_API_KEY
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
NEXT_PUBLIC_FIREBASE_PROJECT_ID
NEXT_PUBLIC_FIREBASE_APP_ID
```

Le site se deploie meme sans ces variables : les pages s'affichent, seules les
fonctions de compte sont indisponibles. Utile pour verifier le rendu avant de
brancher Firebase.

**Apres le premier deploiement** : reporter l'URL `*.vercel.app` dans les
domaines autorises Firebase, sinon la connexion Google echoue.

---

## 3. Verification

1. Ouvrir le site, parcourir l'accueil et les tarifs
2. `/compte/connexion` > **Continuer avec Google** > la fenetre s'ouvre
3. Apres connexion : redirection vers `/compte/bibliotheque`
4. Passer une commande depuis `/tarifs` > elle apparait en **En attente**
5. `/compte/parametres` > deconnexion > `/compte/bibliotheque` doit refuser l'acces

Le bouton de telechargement repond « pas encore pret » : la generation de livre
est hors perimetre pour l'instant.
