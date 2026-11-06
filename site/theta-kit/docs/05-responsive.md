# 05 · Téléphone, tablette, ordinateur

Demande de l'auteur : « assure-toi que tout soit visuel selon le type d'appareil ». Donc pas seulement des colonnes qui se replient : chaque section a une **mise en scène pensée pour l'appareil**.

## Détection

```ts
// lib/device.ts
export type Tier = 'phone' | 'tablet' | 'desktop';
// largeur : phone < 640, tablet 640-1024, desktop > 1024
// + matchMedia('(pointer: coarse)'), '(hover: none)', '(prefers-reduced-motion: reduce)'
// + orientation, devicePixelRatio
export type Gpu = 'high' | 'mid' | 'low';
// low si : hardwareConcurrency <= 4 ET pointer coarse, ou WebGL absent, ou fps mesurés < 40 pendant 2 s
```

CSS d'abord (container queries et media queries), JavaScript seulement pour la 3D et les interactions. Rendu serveur identique pour tous ; les variantes 3D se décident côté client.

## Qualité 3D par niveau

| | desktop / high | tablet / mid | phone / low |
|---|---|---|---|
| `setPixelRatio` | min(dpr, 2) | min(dpr, 1.5) | 1 |
| Antialias | oui | oui | non |
| Halos additifs du θ | 2 couches | 1 couche | 1 couche |
| Particules / poussière | 100 % | 50 % | 20 % ou aucune |
| Ombres, environnement PMREM | oui | oui | environnement simplifié |
| Si WebGL absent ou `reduced-motion` | image fixe (capture de la scène en WebP, à générer au build ou à la main) |

Mettre la 3D en pause hors écran (`IntersectionObserver`) et quand l'onglet est caché.

## Section par section

| Section | Téléphone | Tablette | Ordinateur |
|---|---|---|---|
| En-tête | Logo + bouton menu plein écran ; « Entrer θ » dans le menu | Liens visibles, CTA compact | Comme le prototype |
| Hero | Titre en haut, panneau bleu dessous à 4:5, robot centré et plus grand, bulle au-dessus de la tête ; toucher le robot = expression suivante | Deux colonnes en paysage, empilé en portrait | Deux colonnes, robot réagit au survol et à la souris |
| Carrousels | **Balayage horizontal** plein écran (scroll-snap), une couverture par écran, boutons PDF / labo / e-mail en barre collée en bas ; compteur « 2 / 11 » ; bouton « Passer » | Cartes sticky réduites (couverture à gauche, texte à droite) | Cartes empilées sticky du prototype + barre `pd-bar` |
| Téléchargement PDF | Ouvre le PDF dans un nouvel onglet (iOS ignore `download`) + bouton partager (`navigator.share`) si disponible | Lien `download` | Lien `download` |
| Bande créateur | Avatar au-dessus, phrase défilante, pas de pastille-curseur | Ligne unique | Avatar, défileur, pastille qui suit le curseur |
| Formulaire | Champs pleine largeur, 48 px de haut, `inputmode="email"`, `autocomplete` | 2 colonnes | Comme le prototype |
| Portail vers le voyage | Bouton « Entrer dans le voyage » (pas de défilement infini sur mobile, trop fragile) | Défilement + bouton | Défilement continu sans clic |
| Voyage | Portrait (`narrow`) : caméra recule, textes sous la porte ; glisser vertical = avancer ; boutons ‹ › en bas | Selon l'orientation ; glisser | Molette, flèches, clic sur les portes |
| Labo | Scène en haut (60 % de l'écran), commandes en tiroir bas, gros curseurs tactiles, « Lecture » bien visible | Scène + panneau latéral en paysage | Comme le prototype |
| Profil, couverture | Photo centrée, « Ladji Lama » derrière sur deux lignes, parallaxe par gyroscope **désactivée** (permission iOS), simple flottement | Parallaxe légère au toucher | Parallaxe souris + 3D |
| Projets | Accordéon une colonne, filtres en défilement horizontal | Accordéon 2 colonnes | Comme le prototype |
| Preuves | Rail en scroll-snap, une carte à 85 % de largeur, **pas d'inclinaison 3D** (ou légère au toucher), visionneuse plein écran avec glisser gauche/droite | Deux cartes visibles | Rail + inclinaison 3D + reflet |
| Parcours | Ligne à gauche, contenu à droite | Idem plus large | Comme le prototype |
| Pied de page | Liens en accordéons | 2 colonnes | Comme le prototype |

## Détails à ne pas oublier

- `100dvh` au lieu de `100vh` (barre d'adresse mobile).
- Zones tactiles de 44 × 44 px minimum.
- `env(safe-area-inset-*)` pour les iPhone à encoche et la barre `pd-bar`.
- Pas d'effet uniquement au survol : tout ce qui apparaît au survol doit exister au toucher ou être visible par défaut.
- Images : `next/image` avec `sizes` adaptés ; couvertures en WebP (déjà fournies) ; photo détourée en PNG à convertir en WebP + AVIF.
- Polices : `display: swap`, préchargement de Geist seulement.
- Budget performance téléphone (4G moyenne) : LCP < 2,5 s, CLS < 0,1, JS initial < 200 ko hors three.js ; three.js chargé après l'affichage du hero.
