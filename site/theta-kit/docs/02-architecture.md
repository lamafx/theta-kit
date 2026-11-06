# 02 · Architecture du site

## Arborescence Next.js proposée

```
app/
  [locale]/
    layout.tsx              polices, jetons, en-tête, pied de page, NextIntlClientProvider
    page.tsx                accueil
    voyage/page.tsx         tunnel 3D
    labo/page.tsx           labo (thème par défaut)
    labo/[theme]/page.tsx
    profil/page.tsx
    episodes/[n]/page.tsx
    confidentialite/page.tsx
    mentions-legales/page.tsx
  api/inscription/route.ts
  api/episodes/route.ts     (optionnel, mode webhook)
  sitemap.ts  robots.ts  opengraph-image.tsx
components/
  layout/ Header Footer LegalModal IrisTransition
  home/   Loader Hero RobotScene Marquee EpisodeStack EpisodeCard PdfBar CreatorBand SignupForm Portal
  voyage/ TunnelScene TunnelHud
  labo/   LabScene LabControls themes/*.ts
  profil/ Cover3D Tickers Counters Projects Proofs ProofLightbox ProofUpload Timeline Toolbox Contact
  three/  thetaGlyph.ts robot.ts quality.ts useWebGL.ts
lib/ content.ts (YAML + zod) i18n.ts device.ts analytics.ts
contenu/ data/ messages/ public/
```

## Accueil (`reference/Main.dc.html`)

1. **Chargement** (prop `showLoader`) : θ qui se dessine, compteur, puis ouverture. Une seule fois par session (`sessionStorage`).
2. **En-tête** : logo, liens « Carrousels PDF » (#carrousels), « Labo 3D », bouton « Entrer θ » (vers le voyage). Sélecteur de langue FR / EN.
3. **Hero clair** : grand titre à gauche, panneau bleu `--panel` à droite contenant la scène 3D : θ lumineux derrière, robot sur socle devant. Le robot joue une expression toutes les 4 à 6 s (`heroAct`), avec bulle de texte et pastilles. Survol ou toucher du robot : il réagit (raycast). Code : `initHero`, `heroFrame`, `drawFace`, `heroAct`.
4. **Bande défilante** (marquee) des notions.
5. **#carrousels** : cartes empilées en `position: sticky`, une par épisode publié + une carte « Guide de fin de saison ». Inspiration : serhii.website, sections MS-Marketing et DrShbair.
   - Chaque carte : couverture cliquable (télécharge le PDF) avec badge, numéro, groupe, titre, résumé, boutons « Télécharger le PDF », « Ouvrir dans le labo 3D » (si `theme`), « Recevoir par e-mail » (ouvre une modale d'inscription préremplie avec l'épisode).
   - Barre `pd-bar` fixe en bas pendant la section : précédent, suivant, **« Passer la section »** (saute à #createur). Défilement animé maison (`scrollTween`).
6. **#createur** : bande légère vers le profil. Avatar dans un anneau qui tourne, défileur de phrases, pastille qui suit le curseur. Clic : transition iris vers `/profil`.
7. **#inscription** : e-mail, prénom facultatif, pastilles d'intérêt (PDF des épisodes / newsletter), consentement avec lien Confidentialité.
8. **Pied de page** : logo, liens, LinkedIn, GitHub, contact, Confidentialité, Mentions légales, « Dernière étape : le voyage 3D ↓ ».
9. **#portail** : en continuant à défiler après le pied de page, le tunnel apparaît (dans le prototype : iframe intégrée, messages `postMessage`) puis bascule plein écran vers `/voyage` **sans clic**. Dans Next.js : préchargement du composant `TunnelScene` et `router.push` à la fin de l'iris, avec repli après 2,6 s.

## Voyage (`reference/Tunnel.dc.html`)

- Tunnel 3D défilé à la molette, au doigt ou aux flèches. Chaque épisode est une **porte θ** ; chapitres par groupe (Les bases, Optimisation, ...), un chapitre « Guide », puis une **sortie Auteur** (contact `mailto`).
- Lissage par ressort, effet de « warp » à l'arrivée.
- Mode étroit : `const narrow = W < 820 || W / H < 1.05` : caméra et textes adaptés au portrait.
- Mode intégré (`#embed`) utilisé par le portail de l'accueil.
- Clic sur une porte : panneau de l'épisode (titre, résumé, PDF, labo).
- Sortie : iris vers la page demandée.

## Labo (`reference/Labo.dc.html`)

- Thèmes : `derivee`, `gradient`, `descente`, `minilots`, `minlocaux`, `selle`. Le thème vient de l'URL (`/labo/gradient`). Dans le prototype il passait par `localStorage['theta-lab-theme']`.
- Chaque thème : surface ou courbe 3D, une bille ou un point qu'on lâche, réglages (taux d'apprentissage η, taille de lot...), bouton « Lecture » pour l'animation automatique.
- Entrée animée `lb-in` (iris), sortie iris.
- Clair / nuit selon le thème.

## Profil, « Épisode 00 » (`reference/Profil.dc.html`)

1. **Couverture** : canvas 3D (θ en tubes, anneaux, poussière, parallaxe souris), « Ladji Lama » géant derrière la photo détourée, « Kamagate » en serif devant, couches `.px` qui suivent `--mx/--my`, infos en bas à gauche.
2. **Défileurs** de mots-clés.
3. **Phrase + compteurs** animés (`data-count`).
4. **Projets** : accordéon filtrable (Tout, Machine Learning, Vision, IoT). Données : `data/projets.json`.
5. **#preuves, Certifications et distinctions** : rail horizontal de cartes inclinables en 3D avec reflet, filtres (Tout, Certifications, Prix), barre de progression, visionneuse plein écran (précédent / suivant / « Ouvrir le fichier »). Données : `data/certificats.json`.
   - **Ajout par l'auteur** : dans le prototype, une modale réservée au propriétaire envoyait le fichier dans les « assets » et une ligne dans la collection `certificats`. Dans le vrai site : voir Équivalences.
6. **Parcours** : frise avec ligne de progression et points. Données : `data/parcours.json`.
7. **Boîte à outils** : groupes Analyser, Servir, Construire des interfaces, Livrer, Au-delà du code.
8. **Contact** : « Télécharger mon CV ↓ », LinkedIn, GitHub, e-mail.
9. Pied de page commun.

## Page épisode (nouvelle)

`/[locale]/episodes/[n]` : en-tête avec couverture, titre, accroche ; bouton PDF ; texte du post LinkedIn (version de la langue) ; « À retenir » ; « Vérifiez-vous » avec réponse repliable ; liens épisode précédent / suivant ; bouton labo si `theme`. Open Graph = couverture. C'est cette URL que l'automatisation met dans le post LinkedIn.

## Équivalences prototype → site réel

| Prototype (Claude Design) | Site réel |
|---|---|
| `window.claude...downloads` pour le PDF | `<a href="/pdf/theta-NN.pdf" download>` + événement analytics |
| `db.collection('abonnes')`, `demandes_pdf` | `POST /api/inscription` → Brevo (contacts + listes) ou service déjà utilisé par l'automatisation |
| prop `formEndpoint` | variable d'environnement `INSCRIPTION_PROVIDER` |
| `assets` + `db.collection('certificats')` (ajout par l'auteur) | **Fichier `data/certificats.json` + dossier `public/certificats/`** édités par Git (le plus simple). Option : petite page `/admin` protégée par mot de passe (variable `ADMIN_TOKEN`) qui écrit dans Vercel Blob. À décider avec l'auteur. |
| `localStorage['theta-lab-theme']` | segment d'URL `/labo/[theme]` |
| `localStorage['theta-from-portal']` | paramètre `?from=portail` ou état du routeur |
| `/_blob/4ff78...` | paquet npm `three` |
| `/_blob/02e3a...` | `public/img/llk-cutout.png` |
| iframe du tunnel + `postMessage` | composant React partagé, pas d'iframe |
