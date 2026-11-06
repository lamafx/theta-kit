# 01 · Système visuel θ Théta

Le site reprend l'identité des carrousels LinkedIn : nuit profonde, bleu électrique, blanc, touche de bronze. Deux ambiances : **claire** (accueil, sections de lecture, formulaires) et **nuit** (tunnel, labo, couverture du profil, pied de page).

## Couleurs (palette fermée)

| Jeton | Valeur | Usage |
|---|---|---|
| `--night` | `#0A0F17` | Fond nuit, texte principal sur fond clair |
| `--night-2` | `#13223F` | Centre des dégradés radiaux nuit (iris, tunnel) |
| `--blue` | `#4C8DFF` | Accent principal, liens, lueurs, poitrine du robot |
| `--panel` | `#1C46C9` | Panneau bleu du hero, boutons pleins |
| `--panel-deep` | `#102C86` | Ombre du panneau bleu |
| `--pale` | `#CFE0FF` | Texte secondaire sur nuit, années de la frise |
| `--pale-2` | `#9CC6FF` | Lueurs secondaires, lumière d'appoint 3D |
| `--white` | `#F5F8FC` | Fond clair, texte sur nuit |
| `--paper` | `#FFFFFF` | Cartes sur fond clair |
| `--bronze` | `#D9A066` | Prix, badges « réel », pied du robot (rare : 1 ou 2 touches par écran) |

Gris neutres de texte et de traits, dérivés de la nuit (déjà utilisés par le prototype) :
`--ink-1 #1E2938`, `--ink-2 #2E3B4D`, `--ink-3 #4A5768`, `--ink-4 #6B7A8C`, `--ink-5 #8A97A8`, `--ink-6 #A7B3C2`, `--line #C9D4E3`, `--line-2 #DCE3EC`.

Interdit : toute autre teinte (pas de vert « succès », pas de rouge vif ; une erreur de formulaire s'écrit en `--night` avec une icône, ou en bronze foncé).

## Typographie

| Rôle | Police | Réglages |
|---|---|---|
| Titres | Geist 500 à 600 | `letter-spacing: -0.03em` à `-0.04em`, `line-height: 0.95` à `1.05` |
| Mot accentué dans un titre | Instrument Serif *italique* | même taille, couleur `--blue` ou `--pale` |
| Texte | Geist 400 | 15 à 17 px, `line-height: 1.55` |
| Étiquettes, numéros d'épisode, métadonnées | Geist Mono 400 à 500 | 11 à 13 px, `letter-spacing: 0.08em`, MAJUSCULES |
| Grands nombres (frise, compteurs) | Instrument Serif italique | 44 px et plus |

Tailles fluides : `clamp(36px, 5vw, 72px)` pour les titres de section, `clamp(56px, 11vw, 168px)` pour le nom sur la couverture du profil.

## Mouvement

| Nom | Courbe | Durée | Usage |
|---|---|---|---|
| `--ease-out` | `cubic-bezier(.2,.7,.2,1)` | 400 à 700 ms | Apparitions au défilement, cartes |
| `--ease-std` | `cubic-bezier(.4,0,.2,1)` | 200 à 300 ms | Survols, boutons |
| `--ease-iris` | `cubic-bezier(.77,0,.18,1)` | 700 à 900 ms | Transition iris entre pages |
| `--ease-snap` | `cubic-bezier(.7,0,.25,1)` | 500 ms | Passage carte suivante |

**Transition iris** : un disque `clip-path: circle()` part du point cliqué, rempli d'un dégradé radial `--night-2` vers `--night`, couvre l'écran, la page suivante s'ouvre par le même disque qui se rétracte. À reproduire avec la View Transitions API de Next.js si disponible, sinon un calque fixe comme dans le prototype.

`prefers-reduced-motion: reduce` : pas d'iris (fondu de 150 ms), pas de parallaxe, 3D figée sur une image.

## Composants signature

- **θ lumineux** : le θ est dessiné en tubes (cœur blanc `#F2F6FF` + deux halos additifs bleus), légèrement penché (cisaillement 0,21). Même dessin dans le hero, les portes du tunnel et la couverture du profil. Code de référence : `initHero()` dans `reference/Main.dc.html`.
- **Robot Théta** : blanc laqué, visière noire avec visage animé (texture canvas), poitrine bleue lumineuse, socle. Expressions : salut, clin d'œil, grimace, surprise, réflexion, pitre. Il est **devant** le θ, jamais confondu avec lui.
- **Carte épisode** : couverture réelle (ou fiche provisoire), numéro en Geist Mono, titre en deux lignes (t1 en Geist, t2 en Instrument Serif italique), badge de téléchargement visible sur la couverture.
- **Pastilles (chips)** : bord `--line`, rayon complet, Geist Mono 12 px.
- **Boutons** : plein `--panel` texte blanc ; contour `--night` ; sur nuit, contour `--pale`. Rayon 999 px, hauteur 44 px minimum (48 px sur tactile).

## Logo et signature

`θ Théta` : le θ en Instrument Serif italique, « Théta » en Geist 600. Signature de série : « Nº XX · θ Théta, le Machine Learning, une notion à la fois. »
