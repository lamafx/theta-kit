# θ Admin

L'espace d'administration de la série θ Théta. C'est une application installable (PWA), réservée à l'auteur, servie sous **theta-ml.vercel.app/admin**. Sa conception est dans `serie-ml/conception/espace-admin.txt`.

serie-ml fait foi : l'admin lit les fichiers de la série et n'y écrit jamais directement. Chaque geste lance un workflow GitHub qui passe par la CLI `serie`, commite, puis Vercel reconstruit le site et l'admin.

## Ce qu'il contient

| Écran | Ce qu'on y fait |
| --- | --- |
| Accueil | Prochain post, avance de posts relus, ce qui reste à relire, posts et labos, tournée, jeton, audience, CV |
| Épisodes | Les 62 épisodes et leur statut, avec des filtres |
| Fiche d'épisode | Carrousel en plein écran, PDF, texte du post, premier commentaire, vérification. Boutons « Valider », « À corriger », et saisie des chiffres LinkedIn |
| Labos | État de chaque labo, aperçu réservé d'un labo fermé, recette case par case |
| Décisions | Décisions D des relectures, D1 à D10 des labos, ambiguïtés ouvertes |
| Statistiques | Visiteurs, pages, provenance, pays, appareils, usage des labos, inscrits, chiffres LinkedIn |
| Salle de publication | Tout LinkedIn. Chaque geste passe par 5 confirmations : mot de passe, récapitulatif, phrase à taper, 10 secondes pour annuler, puis suivi et journal |
| Profil et CV | Dépôt du CV avec garde-fou contre le téléphone, ordre et visibilité des sections, contenu en français et en anglais, certificats avec leurs images |
| Plus | Installer l'application, notifications, déconnexion |

## Organisation

- `scripts/instantane.mjs` lit `../serie-ml` et `../site/theta-kit` à chaque build. Il écrit `.instantane/` (hors Git) et copie les PDF, les pages des carrousels, le CV et les certificats.
- `lib/` contient l'accès aux données, aux sessions, à GitHub, à Redis, aux notifications, et le garde-fou contre le téléphone.
- `app/(app)/` contient les écrans, `app/api/` les routes, `public/sw.js` le service worker (limité à `/admin/`).
- `outils/geste.py` exécute les gestes dans le workflow `.github/workflows/admin.yml`.
- Les gestes LinkedIn (tourner, essai, publier, supprimer, état, aperçu) passent par `.github/workflows/linkedin.yml`.

## En local

```bash
npm install
node scripts/mot-de-passe.mjs "un-mot-de-passe-de-test"   # affiche les variables à mettre dans .env.local
npm run build && npm start                                # http://localhost:3100/admin
npm test                                                  # garde-fou téléphone (CV public et CV de travail)
```

## Mise en ligne

1. **Projet Vercel** `theta-admin` : même dépôt `lamafx/theta-kit`, **Root Directory = `admin`**. Laisser activé « Include files outside of the Root Directory in the Build Step » : le build lit `../serie-ml`.
2. **Variables du projet admin** (toutes sensibles, en production) :
   - `ADMIN_MOT_DE_PASSE_HASH`, `ADMIN_SECRET` : produites par `node scripts/mot-de-passe.mjs`. Le mot de passe en clair n'est stocké nulle part.
   - `THETA_APERCU_SECRET` : la même valeur dans les deux projets (site et admin).
   - `NEXT_PUBLIC_VAPID_PUBLIC`, `ADMIN_VAPID_PRIVE` : notifications.
   - `ADMIN_NOTIF_SECRET` : la même valeur dans le secret GitHub du même nom.
   - `CRON_SECRET` : alertes quotidiennes à 7 h.
   - `ADMIN_GITHUB_TOKEN` : voir le point 5.
   - `BREVO_API_KEY` : facultatif, pour compter les inscrits.
3. **Projet du site** (`theta-ml`) : ajouter `ADMIN_ORIGIN = https://<adresse du projet admin>.vercel.app` et `THETA_APERCU_SECRET`. Sans `ADMIN_ORIGIN`, /admin n'est relié à rien.
4. **Upstash Redis**, depuis la place de marché Vercel, relié aux **deux** projets (variables `KV_REST_API_URL` et `KV_REST_API_TOKEN`). C'est la base du compteur de visites, des notifications et de la limite d'essais du mot de passe.
5. **Jeton GitHub de l'admin**. Sur GitHub : Settings, Developer settings, Fine-grained tokens, Generate new token.
   - Repository access : seulement `lamafx/theta-kit`.
   - Permissions : Actions (lecture et écriture), Contents (lecture et écriture), Issues (lecture et écriture), Metadata (lecture).
   - Durée : un an.
   - Le coller dans la variable `ADMIN_GITHUB_TOKEN` du projet admin. Tant qu'il manque, l'admin reste en lecture seule.
6. **GitHub** (dépôt theta-kit, Settings, Secrets and variables, Actions) : ajouter la variable `ADMIN_URL = https://theta-ml.vercel.app/admin` et le secret `ADMIN_NOTIF_SECRET`.

## Sécurité

- Les deux sessions sont des cookies signés (HMAC), `HttpOnly`, `Secure`, `SameSite=Strict`, limités au chemin `/admin` : 30 jours pour l'admin, 10 minutes pour la salle de publication.
- Chaque route et chaque page vérifient la session, en plus du middleware. Chaque appel porte l'en-tête `x-theta` et son origine est contrôlée.
- Le mot de passe accepte 5 essais par quart d'heure.
- Changer `ADMIN_VERSION_SESSION` sur Vercel déconnecte tous les appareils.
- Les phrases de confirmation et la session de salle sont vérifiées côté serveur.
- Un numéro de téléphone est refusé partout : dans le CV (texte, balises invisibles, métadonnées) et dans les fichiers du profil.
- Le jeton GitHub de l'admin ne donne pas accès à LinkedIn : seul `linkedin.yml` a ce secret.
