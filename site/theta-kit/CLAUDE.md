# CLAUDE.md · Site θ Théta (kit v1)

Tu es Claude Code. Ce dossier est le **Théta Kit v1** : tout ce qu'il faut pour transformer le prototype du site θ Théta (fait dans Claude Design) en un vrai site Next.js, bilingue FR/EN, adapté au téléphone, à la tablette et à l'ordinateur, déployé sur Vercel et branché sur l'automatisation Théta existante.

Auteur : Ladji Lama Kamagate (Abidjan, ESATIC SRIT). Série : θ Théta, « le Machine Learning, une notion à la fois », 62 épisodes, hashtag #ThetaML.

## 0. Avant d'écrire une ligne de code

1. Lis ce fichier en entier, puis `docs/` dans l'ordre (01 à 09).
2. Ouvre les 4 prototypes de `reference/` dans un navigateur (voir `reference/README.md`) et parcours-les. Ce sont **la source de vérité visuelle et comportementale**. Le site final doit leur ressembler, en mieux structuré.
3. Lis `QUESTIONS-AUTOMATISATION.md`. **Réponds à chaque question par écrit dans ce même fichier**, en inspectant le dépôt d'automatisation Théta existant (voir section 6). Ne devine pas : si une réponse n'est pas trouvable, écris « inconnu » et demande à l'auteur.
4. Seulement ensuite, propose un plan court (10 lignes max) et commence.

## 1. Règles absolues

- **`../../serie-ml` est la source de vérité.** Ce kit n'est qu'un outil pour produire le site. Textes, statuts, profil et décisions se réfèrent à `serie-ml` ; en cas d'écart avec le kit (`contenu/`, `data/`, `docs/`), la série gagne et le kit s'adapte. Si la série ne tranche pas, demande à l'auteur.
- **Ne rien inventer.** Aucune statistique, date, expérience, projet, certification ou citation qui ne figure pas dans `contenu/`, `data/` ou les PDF de `public/`. En cas de doute, laisse un `TODO(auteur)` visible dans le code et liste-le dans ton compte rendu.
- **Pas de tiret long** (le caractère cadratin ni le double tiret) dans les textes affichés. Utilise deux-points, virgule ou point.
- **Téléphone de l'auteur jamais affiché** publiquement, même s'il est dans le CV.
- **Palette fermée** (voir `docs/01-design-system.md`). Aucune autre couleur, aucun dégradé violet, aucun emoji décoratif.
- **Polices** : Geist, Geist Mono, Instrument Serif italique. Rien d'autre.
- **Typographie française** dans la version FR : espace insécable avant `: ; ? !`, guillemets « ».
- **Textes des épisodes** : ne réécris jamais un texte d'épisode validé. Les YAML `statut: publie` sont figés. Pour l'anglais, traduis fidèlement (voir `docs/04-i18n.md`), sans ajouter d'information.
- **Accessibilité** : tout ce qui est 3D a un équivalent lisible sans WebGL, et `prefers-reduced-motion` coupe les animations lourdes.
- Ne pousse pas en production, ne publie rien sur LinkedIn et ne touche pas aux secrets sans accord explicite de l'auteur.

## 2. Pile technique cible

| Sujet | Choix |
|---|---|
| Framework | Next.js 15 (App Router), TypeScript strict, React Server Components par défaut |
| Styles | CSS Modules ou Tailwind 4 avec les jetons de `docs/01` en variables CSS. Un seul des deux, pas les deux. |
| 3D | `three` (version récente) chargé **uniquement côté client** via `dynamic(() => import(...), { ssr: false })` |
| i18n | `next-intl`, routes `/fr/...` et `/en/...`, FR par défaut, détection `Accept-Language` |
| Contenu | `contenu/NN.yaml` lus au build (`yaml` + `zod` pour valider), pages statiques (SSG) |
| Formulaires | Route handler `app/api/inscription/route.ts` vers Brevo (ou le service que l'automatisation utilise déjà, voir Q-AUTO) |
| Polices | paquet `geist` (Geist, Geist Mono) + `next/font/google` pour Instrument Serif |
| Hébergement | Vercel, domaine `theta-ml.vercel.app` (décidé par l'auteur le 2026-11-08) |
| Analyse | Vercel Analytics (sans cookie) |

## 3. Pages et routes

| Route | Prototype | Rôle |
|---|---|---|
| `/[locale]` | `reference/Main.dc.html` | Accueil : chargement, hero clair avec robot 3D, bande défilante, carrousels empilés avec PDF, bande « créateur », formulaire, pied de page, portail vers le voyage |
| `/[locale]/voyage` | `reference/Tunnel.dc.html` | Tunnel 3D : chaque épisode est une porte θ ; défilement continu depuis l'accueil |
| `/[locale]/labo` et `/[locale]/labo/[theme]` | `reference/Labo.dc.html` | Labo 3D interactif : derivee, gradient, descente, minilots, minlocaux, selle |
| `/[locale]/profil` | `reference/Profil.dc.html` | « Épisode 00 » : l'auteur, projets, preuves (certifications et prix), parcours, outils, contact |
| `/[locale]/episodes/[n]` | (nouveau, simple) | Une page par épisode pour le SEO et le partage LinkedIn : titre, accroche, couverture, PDF, texte du post, lien labo si `theme` |
| `/[locale]/confidentialite`, `/[locale]/mentions-legales` | modales du prototype | Pages simples (les modales peuvent rester en plus) |
| `/api/inscription` | `sendRec()` de Main | Collecte e-mail (PDF / newsletter) |
| `/api/episodes` (optionnel) | | Point d'entrée pour l'automatisation si on choisit le mode webhook (voir `docs/08`) |

Détails section par section, transitions (iris), états et interactions : `docs/02-architecture.md`.

## 4. Appareils : téléphone, tablette, ordinateur

L'auteur veut que **tout soit visuel selon le type d'appareil**, pas seulement « responsive ». Il y a donc trois expériences conçues, décrites dans `docs/05-responsive.md` :

- **Téléphone** (< 640 px) : pile verticale, robot 3D allégé (ou image fixe si GPU faible), carrousels en balayage horizontal plein écran au lieu de l'empilement sticky, tunnel en mode portrait (la règle `narrow` du prototype), labo avec commandes tactiles en bas d'écran.
- **Tablette** (640 à 1024 px) : deux colonnes là où c'est utile, tunnel paysage ou portrait selon l'orientation, gestes tactiles.
- **Ordinateur** (> 1024 px) : l'expérience complète du prototype (cartes sticky, parallaxe souris, inclinaison 3D des certificats).

Détecter aussi : `pointer: coarse`, `hover: none`, `prefers-reduced-motion`, `navigator.hardwareConcurrency` et le taux d'images réel pour baisser la qualité 3D. Recette obligatoire sur les gabarits listés dans `docs/09-recette.md`.

## 5. Contenu et données

- `contenu/NN.yaml` : un fichier par épisode, schéma dans `docs/03-contenu.md`. 01 à 03 sont complets (FR + EN) et tirés des vrais carrousels PDF. 04 à 10 sont en `statut: brouillon` (texte du post FR seulement, PDF provisoires).
- `data/profil.json`, `data/projets.json`, `data/certificats.json`, `data/parcours.json` : bilingues.
- `messages/fr.json`, `messages/en.json` : toutes les chaînes d'interface.
- `public/` : PDF, couvertures, CV, certificats, photo détourée. Garde les mêmes chemins.

**Le site doit se reconstruire seul quand un nouvel épisode arrive.** Ajouter `contenu/11.yaml` + `public/pdf/theta-11.pdf` + `public/covers/theta-11.webp` et pousser sur Git doit suffire à faire apparaître l'épisode partout (carrousels, tunnel, page épisode, sitemap).

## 6. Brancher l'automatisation existante

L'auteur dit : « l'automatisation est gérée par Théta actuellement et couplée avec IN ». Il existe donc déjà un projet (dans son VS Code) qui produit les carrousels et publie sur LinkedIn. Ton travail :

1. Trouver ce dépôt ou ce dossier (demande le chemin à l'auteur s'il n'est pas à côté de ce kit).
2. Répondre à `QUESTIONS-AUTOMATISATION.md`.
3. Choisir **un** des trois modes décrits dans `docs/08-pont-automatisation.md` (même dépôt, dépôt séparé + commit automatique, ou webhook) et l'implémenter **sans casser le flux existant**.
4. Le flux cible : épisode validé → PDF + couverture + YAML écrits → commit sur le dépôt du site → Vercel reconstruit → publication LinkedIn avec le lien `/{locale}/episodes/NN` → statistiques renvoyées dans le YAML (`linkedin.stats`).

## 7. Ordre de travail conseillé

1. Répondre aux questions d'automatisation.
2. Squelette Next.js + i18n + jetons + polices + mise en page de base + pied de page.
3. Chargeur de contenu (YAML + zod) et pages épisodes (sans 3D). Déploiement de prévisualisation Vercel dès ici.
4. Accueil : hero, carrousels + téléchargement PDF, formulaire + API.
5. Profil : projets, preuves, parcours, contact.
6. 3D : robot du hero, tunnel, labo, couverture du profil. Avec les replis.
7. Adaptation par appareil (docs/05), puis recette complète (docs/09).
8. Pont d'automatisation (docs/08).
9. SEO : métadonnées, Open Graph par épisode (image = couverture), `sitemap.xml`, `robots.txt`, `hreflang` FR/EN.

À la fin de chaque étape : `npm run build` sans erreur, `npm run lint`, capture d'écran téléphone + ordinateur, court compte rendu en français.

## 8. Ce qui est déjà vérifié et ce qui ne l'est pas

Vérifié dans le prototype : visuels des sections, formulaires, profil, certificats, pied de page, rendu mobile du profil, vidéo de démonstration.
Non vérifié (à tester dans le vrai site) : tunnel intégré dans l'accueil, téléchargements réels, écriture des inscriptions, envoi des certificats par l'auteur. Dans le prototype ces fonctions passent par l'environnement Claude Design (`window.claude`) : **elles doivent être remplacées** (voir `docs/02` section « Équivalences »).
