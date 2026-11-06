# Prototypes de référence (Claude Design)

| Fichier | Page du site | Taille d'aperçu |
|---|---|---|
| `Main.dc.html` | Accueil | 1440 × 14 800 |
| `Tunnel.dc.html` | Voyage 3D | 1440 × 900 |
| `Labo.dc.html` | Labo 3D | 1440 × 900 |
| `Profil.dc.html` | Profil, Épisode 00 | 1440 × 7 200 |

Version en ligne (privée, celle de l'auteur) : https://claude.ai/artifact/P6synu2RQWiAnLzCGYJgrf

## Lire le format `.dc.html`

Ces fichiers ne s'ouvrent pas tels quels dans un navigateur : c'est le format des canevas Claude Design.

- `<x-dc>` contient le gabarit HTML et un `<style>` ; `{{nom}}` insère une valeur ; `<sc-for list="{{x}}" as="y">` répète ; `<sc-if value="{{cond}}">` affiche si vrai.
- `<script type="text/x-dc" data-dc-script data-props='...'>` contient `class Component extends DCLogic` : `this.state`, `this.setState()`, `renderVals()` (les valeurs du gabarit), `componentDidMount()`, `componentWillUnmount()`. C'est l'équivalent d'un composant React à classe.
- `ref="{{setX}}"` = callback ref ; `onClick="{{fn}}"`, `onSubmit`, `onPointerMove` = gestionnaires d’événement (style React).
- `data-props` décrit les propriétés réglables (ex. `showLoader`, `formEndpoint`).
- `window.claude...use('db' | 'downloads' | 'assets')` : services fournis par Claude Design, **à remplacer** (voir `docs/02`, Équivalences).

## Ressources référencées par chemin `/_blob/...`

| Chemin | Contenu | Remplacement |
|---|---|---|
| `/_blob/4ff7829355437e45b4e7daba220cc22f` | three.js r159 (UMD, `window.THREE`) | `import * as THREE from 'three'` |
| `/_blob/02e3a1fd7f97ac2eebd2035ff5e3db52` | Photo détourée de l'auteur | `/img/llk-cutout.png` |

## Où trouver quoi dans le code

| Besoin | Fichier · méthode |
|---|---|
| Robot 3D, θ en tubes, expressions | `Main` · `initHero`, `heroFrame`, `drawFace`, `heroAct` |
| Cartes empilées, barre de navigation, défilement animé | `Main` · `epsDef`, `pdNext`, `pdPrev`, `pdSkip`, `scrollTween` |
| Téléchargement PDF | `Main` · `download` |
| Formulaires | `Main` · `subscribe`, `requestPdf`, `sendRec` |
| Portail vers le tunnel | `Main` · section `#portail`, messages `postMessage` |
| Tunnel, portes, chapitres, mode étroit | `Tunnel` · classe complète, règle `narrow` |
| Thèmes du labo | `Labo` · thèmes `derivee`, `gradient`, `descente`, `minilots`, `minlocaux`, `selle` |
| Couverture 3D du profil | `Profil` · `init3d`, `tick` |
| Preuves, inclinaison, visionneuse, ajout | `Profil` · `SEED`, `tilt`, `untilt`, `lb*`, `addCert`, `removeCert` |
| Projets | `Profil` · `PJ`, `FILT` |

Conseil : pour voir un prototype fonctionner, le plus simple est de l'ouvrir dans le canevas Claude Design (lien ci-dessus). Pour l'étudier hors ligne, lire le gabarit et la classe ; ne pas essayer de faire tourner le format DC dans Next.js, il faut **réécrire** en composants React.
