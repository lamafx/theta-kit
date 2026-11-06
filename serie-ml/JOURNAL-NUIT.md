# Journal de la nuit

Session du 2026-10-20. Machine : Windows 11 Pro, Python 3.13.5, Playwright 1.64 (Chromium de Playwright).
Point de départ : commits « Jalon 1 », « Décisions A01 à A09 », « Jalon 2 : rendu fidèle » (135 tests au vert).
Consignes de la nuit : NUIT.md, plus les parties A à E données par l'utilisateur ce soir.

## Partie A · Avant de commencer

- A1 : `python -m playwright install chromium` → code de sortie 0 (chromium-1248 déjà présent).
- A2 : le zip n'était pas décompressé à la racine mais dans `correctif/correctifs-jalon2/`. Ses fichiers ont été
  recopiés à leur place (13 canevas, 14 références dont 12 modifiées, police STIX Two Math et sa licence).
  Commit b99966f « Correctifs typographie et police de complément ». Le dossier `correctif/` est laissé tel quel,
  non suivi par Git.

## Jalon 2 · Rendu fidèle (reprise) — plan

Le jalon 2 a déjà un commit ; il est repris avec les précisions B1 à B7.

1. **Typographie 9.4 dans le générateur** (`serie/typographie.py`) : les références suivent maintenant 9.4, le rendu
   doit donc l'appliquer. Appliquée aux segments de texte (hors formules) par `serie/balisage.py`, aux formules
   (virgule décimale, signe moins), aux textes des visuels (`bibliotheque/_svg.py`) et aux chaînes posées par les
   gabarits (filtre `typo`). Idempotente : un texte déjà composé ne change pas.
2. **B1, police de complément** : `serie/charte.py` ajoute, pour chaque (famille, poids, style) déclaré, une règle
   `@font-face` de même famille, même poids, même style, source `stix-two-math-latin-400-normal.woff2`,
   `unicode-range: U+2207, U+202F`, déclarée après les autres. Le fichier et la plage viennent de la section
   polices de `charte/charte.yaml` (autorisé). Test par CDP (`CSS.getPlatformFontsForNode`) : ∇ et U+202F sont
   dessinés par « STIX Two Math », police chargée (custom), pour chaque famille, poids et style.
3. **B2, contenus de test** : `contenu/08.yaml` → `tests/fixtures/contenu-08.yaml` ; `contenu/01.yaml` →
   `tests/fixtures/contenu-01-images.yaml` (pages Image-Contexte et Image-Capture seulement). `contenu/` ne garde
   que `.gitkeep`. `serie rendre NN --contenu FICHIER` permet de rendre une fixture.
4. **B3, prérequis** (`serie/prerequis.py`) : épisodes précédents du même chapitre + `prerequis_explicites`.
   Rappel fixe : épisode 01 → « Épisode 1 · Saison 1 » ; premier épisode d'un chapitre sans prérequis →
   « Nouveau chapitre · <titre> ». Le rappel devient facultatif dans le contenu quand il est fixe.
5. **B4** : rôle « Problème » → gabarit mécanisme ; A10 résolue.
6. **B5, « Vérifiez-vous »** : champ `verification` (question ≤ 30 mots, page de la réponse) sur la page de fin ;
   encadré dans la colonne gauche, entre les points et l'épisode suivant, hors de la baguette du robot.
   Mise à jour (autorisée) de `08-Fin.dc.html`, `architecture-carrousel.md`, puis `tests/reference/08-Fin.png`
   régénérée à partir du canevas modifié.
7. **B6, variantes sans image** : Contexte sans image → frise des repères agrandie à la place de la photo ;
   Capture sans image → visuel Flux pleine largeur, crédit « Schéma ». Le cadre « à déposer ici » disparaît des
   gabarits. Les références Image-Contexte et Image-Capture montrent encore ce cadre : la comparaison masque la
   zone de l'image (rendue avec une image d'essai neutre), tout le reste de la page reste comparé.
8. **B7, seuils** : mesurer l'écart canevas-rendu-ici / nouvelle référence pour chaque page, seuil = écart + marge,
   chiffres dans `tests/test_rendu.py` et ici ; vérifier chaque page à l'œil.

Critère de fin (BRIEF-CONSTRUCTION.md) : `serie rendre 08` produit des pages identiques aux images de
`tests/reference/` (écart sous un seuil fixé dans le test, hors anti-crénelage).

## Jalon 2 · Rendu fidèle (reprise) — réalisation

- **Typographie 9.4** : `serie/typographie.py` (texte et notation), appliquée par `balisage.composer` (le texte
  autour des `$…$` est composé d'un bloc, les symboles à part), par `_svg.esc` / `texte_svg` (étiquettes des
  visuels) et par le filtre Jinja `typo` (en-tête, crédits, épisode suivant, sommaire, titre du document).
- **B1** : 9 règles de complément (Geist 400/500/600/700, Geist Mono 400/500, STIX Two Text 400/500 × normal/italique),
  une par (famille, poids, style) déclarée, toutes après les règles d'origine. Vérifié par CDP
  (`CSS.getPlatformFontsForNode`) : 36 cas (3 familles × 3 poids × 2 styles × 2 caractères), tous dessinés par
  « STIX Two Math », police chargée. Test : `tests/test_typographie_prerequis.py`.
- **B2** : `tests/fixtures/contenu-08.yaml`, `tests/fixtures/contenu-01-images.yaml` (+ `contenu-valide.yaml`,
  `bilan-1.yaml`, images d'essai) ; `contenu/` vide ; `serie rendre NN --contenu F --sortie D`.
- **B3** : `serie/prerequis.py` ; 08 → [5, 6, 7] ; 01 → « Épisode 1 · Saison 1 » ; 05 → « Nouveau chapitre ·
  Apprendre de ses erreurs ». Le rappel du contenu devient facultatif quand il est fixé ; un rappel contraire est refusé.
- **B4** : Problème → mécanisme ; A10 résolue.
- **B5** : `verification: {question, page}` sur la page de fin (page 2 à N−1, sinon refus du schéma) ; encadré
  dans la colonne gauche. Canevas `08-Fin.dc.html`, `architecture-carrousel.md` et `tests/reference/08-Fin.png`
  mis à jour (la référence est le canevas modifié rendu ici).
- **B6** : plus aucun cadre « à déposer ici » dans les gabarits. Contexte sans image : le texte en 34 px dans le
  cadre de la photo, puis la frise agrandie. Capture sans image : forme `page` de la famille Flux (nouvelle,
  A25), crédit « Schéma ». Crédit écrit par le code depuis la fiche .yaml de l'image (`serie/images.py`).
- **B7, seuils** : écart du canevas rendu ici à la nouvelle référence, + 100 px de marge (hors anti-crénelage,
  sur 1 458 000 px). Images de différences vérifiées : uniquement des bords de glyphes.

| Page | Canevas ici / réf. | Rendu / canevas ici | Rendu / réf. | Seuil |
| --- | ---: | ---: | ---: | ---: |
| Main | 622 | 25 | 647 | 722 |
| 02-Ouverture | 2 780 | 0 | 2 780 | 2 880 |
| 03-Mecanisme | 4 601 | 36 | 4 638 | 4 701 |
| 04-Comparaison | 4 941 | 25 | 4 966 | 5 041 |
| 05-Formule | 3 438 (11 758 avant B1) | 0 | 3 438 | 3 538 |
| 06-Exemple | 3 685 | 0 | 3 685 | 3 785 |
| 07-Piege | 3 369 | 0 | 3 369 | 3 469 |
| 08-Fin | 0 (régénérée ici) | 0 | 0 | 100 |
| Image-Contexte (masques) | 3 130 | 0 | 3 130 | 3 230 |
| Image-Capture (masque) | 2 943 | 0 | 2 943 | 3 043 |
| Bilan-Couverture | 1 024 | 0 | 1 024 | 1 124 |
| Bilan-Sommaire | 9 975 | 0 | 9 975 | 10 075 |
| Bib-Motifs | 3 573 | 0 | 3 573 | 3 673 |
| Bib-Visuels | 9 149 | 0 | 9 149 | 9 249 |

- **Vérification à l'œil** : planche des 8 pages de 08, pages Image-Contexte et Image-Capture (image d'essai),
  et leurs deux variantes sans image. Rien d'anormal ; ∇ et « ? » à leur place, apostrophes courbes partout.
- Ambiguïtés : A10, A13, A14, A16, A17 résolues ; nouvelles A24 (importante), A25, A26, A27 (mineures).

### Critère de fin

```
$ python -m serie rendre 8 --contenu tests/fixtures/contenu-08.yaml --sortie <scratchpad>/critere08
…/critere08/page-01.png … page-08.png
…/critere08/08-la-descente-de-gradient.pdf
$ python -m pytest tests/test_rendu.py -q
.............................................                            [100%]
45 passed in 86.18s
$ python -m pytest -q
162 passed, 1 skipped in 227.09s
```

Les 14 pages sont sous leur seuil ; la fidélité au canevas est de 0 px sur 11 pages, 25 à 36 px sur 3.

## Jalon 3 · Contrôles — plan

`serie verifier NN [--contenu F]` : charge le contenu, rend le HTML de chaque page, mesure les pages dans Chromium,
classe chaque résultat (erreur bloquante, avertissement, désaccord) et écrit `sortie/NN/verification.md`.
Code de sortie 1 s'il y a une erreur bloquante. Modules : `serie/verification.py` (contrôles sur le contenu et
le HTML), `serie/mesures.py` (mesures dans Chromium), `serie/donnees/formes-glossaire.yaml` (formes ajoutées).

| Contrôle | Règle | Cas piégé (test) |
| --- | --- | --- |
| Schéma | `Contenu` ; C2 : visuel obligatoire sur ouverture, mécanisme, piège ; piège avec son encadré « Ce que ça veut dire » | ouverture et piège sans visuel |
| Familles, paramètres | chaque famille et forme déclare ses paramètres ; calcul connu | paramètre inventé, calcul inconnu |
| Mots par page | titre + texte (+ conclusion) : 40 sur l'ouverture, 70 ailleurs ; avertissement à 90 % ; question ≤ 30 mots | texte de 80 mots |
| Mots interdits, vouvoiement | superlatifs, emoji, tutoiement | « Tu vas voir, c'est incroyable 🚀 » |
| Termes | formes du glossaire + formes ajoutées (pluriels, verbes) ; technique → erreur, mot courant → avertissement | « gradient » dans l'épisode 01 |
| Rappel | numéros cités ⊆ prérequis (erreur), prérequis non cités (avertissement), rappels fixes | rappel qui cite Nº 09 |
| Typographie (C1) | sur le HTML final : aucune apostrophe droite, aucune espace normale avant ; ! ? : ni dans « Nº 01 » ; dans Chromium, aucun signe de ponctuation seul sur une ligne | titre « Qu'est-ce que le Machine Learning ? » non composé |
| Débordement | dans Chromium : boîte hors de la zone de texte, contenu rogné, pied poussé hors de la page, texte de visuel hors de son dessin ; taille minimale (20 px pour le texte de lecture, 14 px pour tout texte) | titre long, formule longue, tableau dense, police de 12 px |
| Glyphes | dans Chromium (CDP) : chaque texte dessiné par les polices locales, jamais par une police du système | « ŷ » hors formule |
| Remplissage (C3) | vide entre le dernier bloc et le pied ≤ plus grand vide des 14 références + 10 % | titre + 3 lignes |
| Calculs | chaque nombre affiché vient d'un calcul du contenu, de ses paramètres, ou d'un extrait de source | « l'erreur passe de 9 à 2,5 » |
| Références | chaque page (hors couverture et fin) cite des extraits existants de `sources/NN/` ; chaque référence de la fiche a un extrait | page sans source, extrait inconnu |
| Images (C4) | page qui demande une image réelle sans image retenue → variante sans image + avertissement dans le rapport | contexte sans fichier |
| Fin | rien de nouveau : mots des points et de la question présents dans les pages (avertissement) | point inventé |

Pages pièges de rendu (11.7) : titre long, formule longue, accents, tableau dense, page sans image.
Critère de fin : tous les tests passent, et chaque contrôle échoue sur son cas piégé.

## Jalon 3 · Contrôles — réalisation

- `serie verifier NN [--contenu F] [--sources D] [--sans-mesures]` (`serie/verification.py`, `serie/mesures.py`) écrit
  `sortie/NN/verification.md` (erreurs, avertissements, images manquantes et « à confirmer », mots et vide par page)
  et sort en code 1 s'il reste une erreur bloquante.
- Chaque famille déclare ses formes et leurs paramètres (`PARAMETRES`) ; la vignette est réservée aux planches.
- Termes : formes dérivées (sans symbole, sans parenthèse, pluriel) + `serie/donnees/formes-glossaire.yaml` (A28).
- Débordement : un bloc trop haut écrasait le visuel au lieu de déborder (flex-shrink). Corrigé dans la feuille de
  style (`.page > *{flex-shrink:0}`, sans effet sur les 14 références) et contrôlé (« visuel déformé »).
- Glyphes : contrôle ajouté (CDP) ; les lettres grecques hors formule sont un avertissement (A29), comme dans les
  canevas validés ; toute autre police du système est bloquante.
- C3, seuil mesuré sur les 14 références (`vides_png`, filet du pied) : Main 130, 02-Ouverture **261**, 03 107,
  04 28, 05 190, 06 135, 07 153, 08 11, Image-Contexte 3, Image-Capture 242, Bilan-Couverture 126,
  Bilan-Sommaire 240, Bib-Motifs 1, Bib-Visuels 212 → seuil 261 × 1,1 = **287 px**. Le rendu de la fixture 08
  donne les mêmes vides (131, 261, 107, 28, 190, 135, 154, 11).
- `serie verifier 8 --contenu tests/fixtures/contenu-08.yaml` : 2 erreurs, toutes deux attendues (pas de
  `sources/08/`, donc « 0,001 » sans extrait) ; avertissements : « valeurs » (mot courant, épisode 57), θ hors formule.
- Ambiguïtés nouvelles : A28 et A30 (importantes), A29 et A31 (mineures).

| Contrôle | Cas piégé | Test |
| --- | --- | --- |
| Schéma (C2) | ouverture et piège sans visuel ; piège sans encadré | `test_ouverture_et_piege_sans_visuel`, `test_schema_visuel_obligatoire` |
| Familles, paramètres | paramètre inventé, forme inconnue, calcul inconnu, vignette sur une page | `test_visuels_pieges` |
| Mots | 80 mots ; ouverture > 40 ; question > 30 | `test_mots_trop_nombreux`, `test_ouverture_limitee_a_40_mots`, `test_question_de_30_mots_au_plus` |
| Interdits, vouvoiement | « Tu vas voir, c'est incroyable 🚀 : ton modèle… » | `test_interdits_pieges` |
| Termes | « gradient » dans l'épisode 01 ; jeux de données, divergent, mini-lots | `test_terme_technique_trop_tot`, `test_formes_derivees_et_ajoutees` |
| Rappel | Nº 09 cité dans l'épisode 08 ; rappel libre sur l'épisode 01 | `test_rappel_cite_un_non_prerequis`, `test_rappel_fixe_de_l_episode_01` |
| Typographie (C1) | « Qu'est-ce que le Machine Learning ? » non composé ; générateur sans typographie ; « ? » seul sur une ligne | `test_titre_non_compose_detecte`, `test_generateur_sans_typographie_detecte`, `test_ponctuation_seule_sur_une_ligne` |
| Débordement, tailles | titre long, formule longue, tableau dense, police de 12 px | `test_pages_pieges` |
| Glyphes, accents | « ✓ » ; accents rendus par les polices locales | `test_pages_pieges`, `test_accents_dessines_par_les_polices_locales` |
| Remplissage (C3) | un titre et 3 lignes | `test_pages_pieges[page vide]` |
| Nombres | « l'erreur passe de 9 à 2,5 » ; « 0,001 » sans extrait | `test_nombre_sans_calcul`, `test_nombre_sans_source` |
| Références | page sans source, extrait inconnu, référence sans extrait, référence illisible | `test_references_pieges`, `test_reference_illisible_bloque` |
| Images (C4) | contexte sans image retenue → variante + rapport ; fiche ignorée | `test_image_annoncee_sans_image_retenue`, `test_rapport_signale_l_image_manquante`, `test_image_de_la_fiche_ignoree` |
| Fin | mot nouveau sur la page de fin | `test_fin_avec_mot_nouveau` |

### Critère de fin

```
$ python -m pytest -q --durations=10
…
217 passed, 1 skipped in 465.11s (0:07:45)
```

(Le test sauté est la famille Flux en thème couverture : Flux ne sert qu'aux pages intérieures.)

## Partie D · Images réelles : recherche et téléchargement automatiques

- `serie/images.py` : `classer` (libre / à confirmer / exclue, avec la raison), `credit`, `licence_avec_lien`,
  recherche par API publiques (`chercher_commons`, `chercher_openverse`), téléchargement (`chercher_et_telecharger`,
  jusqu'à 5 candidates ≥ 1 200 px, « libre » d'abord, « exclue » jamais, robots.txt respecté, User-Agent du projet,
  1 s entre deux requêtes), ajout d'une candidate trouvée à la main (`ajouter_candidate`), écriture atomique.
- `serie images NN` (recherche pour chaque page Contexte sans image retenue ; Capture : rien à chercher, règle D6),
  `serie images NN --lister`, `serie images NN --ajouter URL --page-source … --auteur … --licence/--conditions …`.
- Champ `recherche` (mots-clés) ajouté à l'image du contenu.
- **Refus rencontré** : Python (OpenSSL) refuse le certificat de commons.wikimedia.org (« certificate has expired »,
  racine expirée dans le magasin de cet ordinateur) alors que curl (Schannel) le valide. Les requêtes passent par
  curl quand il existe, urllib sinon.
- Les vignettes JPEG de Commons (2 400 px) remplacent les originaux TIFF, illisibles par Chromium.
- Charte mise à jour (autorisé) : decisions-automatisation.md §9.5 et la partie images de regles-redaction.md ;
  CLAUDE.md aligné.
- Tests (`tests/test_images.py`, sans réseau) : 15 conditions d'exemple (5 libres, 3 à confirmer, 7 exclues), crédit
  photo et capture, lien de licence CC BY, image sans fiche ou exclue jamais affichée, variante sans image quand
  rien n'est retenu. 23 tests au vert.
- Essai réel (lecture seule) : « IBM 704 » sur Commons donne des photos NASA en domaine public (Langley, 1957,
  jusqu'à 8 000 px) ; la photo LLNL de Commons (« IBM 704 mainframe.gif ») ne fait que 355 × 233 px.

## Jalon 4 · Agent — plan

**Socle (code)**
1. Reprise sûre (11.7) dans `serie/etat.py` : écritures atomiques de `etat.yaml` (clés entre guillemets, A07),
   étapes de 11.3 enregistrées avec l'empreinte sha256 de leurs entrées (fiche, sources, contenu, gabarits, charte,
   bibliothèque, images) ; `serie etape NN ETAPE` enregistre, `serie reprendre NN` donne la première étape à faire
   (non faite ou entrées modifiées), `serie etat --maj` repasse « relu » à « généré » si une entrée a changé.
2. Rendu incrémental : `serie rendre` ne rephotographie que les pages dont le HTML a changé (empreintes par page).
3. `serie publier NN` → `publier/NN/` : PDF nommé sans caractère spécial, `titre.txt`, `texte.txt` (composé par le
   code à partir du bloc `linkedin` du contenu : accroche, intuition, promesse, question, hashtag du sujet ; 120 à
   220 mots ; lien de licence CC BY si besoin, D5), `premier-commentaire.txt` (références de la fiche, crédits des
   images), aperçus PNG, `date.txt` (calendrier). Contrôle de la longueur et des hashtags.
4. Planche `sortie/NN/planche.png` (E3), écrite par `serie rendre`.
5. Formes de page manquantes pour 02 à 04 (A12), dans la grammaire des vignettes : Grille (tableau de données,
   pixels), Courbe (droite ŷ = a·x + b et droite fantôme), Flux vertical ; valeurs tirées de `calculs/`.

**Agent (`.claude/`)**
6. Skills `episode`, `saison`, `bilan`, `etat`, `corriger`, `stats` ; `/episode NN` enchaîne 11.3 avec
   `serie images NN` après la rédaction et la recherche web d'images.
7. Sous-agent `relecteur` : lecture seule (Read, Grep, Glob) + écriture de `sortie/NN/relecture.md` seulement ;
   ne lit pas l'historique de rédaction ; rattache chaque affirmation à un extrait ; 4 questions par page ;
   images « à confirmer » en tête.
8. Hooks (`.claude/settings.json`, scripts `.claude/hooks/*.py`) : vérification après écriture dans `contenu/` ;
   refus d'écrire dans `gabarits/`, `bibliotheque/`, `charte/`, `tests/reference/` hors session de design
   (fichier `.session-design` à la racine) ; mise à jour de l'état à la fin de chaque réponse. Écrits en dernier,
   pour ne pas bloquer la construction elle-même.

**Production (E2, E3)** : épisodes 01 à 04, chacun : extraits des références (`sources/NN/`), contenu, images
(01), rendu, vérification, relecture par le sous-agent, texte LinkedIn, `publier/NN/`, planche vérifiée à l'œil,
`etat.yaml`, commit. Une référence illisible bloque l'épisode (NUIT.md).

Critère de fin : `/episode 01` à `/episode 04` produisent chacun un dossier complet sans intervention.

## Jalon 4 · Agent — réalisation (en cours)

Session du 2026-10-24.

- **1, reprise sûre** (`serie/reprise.py`) : 9 étapes de 11.3, chacune avec la date et l'empreinte sha256 de ses
  entrées ; `serie etape NN ETAPE`, `serie reprendre NN`, `serie etat --maj` (relu → généré si une entrée a changé).
  Écriture de `etat.yaml` par fichier provisoire puis renommage. Les clés d'épisode sont maintenant écrites entre
  guillemets (`'08'`, `'09'`), comme A07 le prévoyait : `yaml.safe_dump` ne le faisait pas.
- **2, rendu incrémental** (`serie/rendu.py`) : empreinte par page (HTML + fichiers locaux chargés), dans
  `sortie/NN/empreintes.yaml` ; seules les pages modifiées ou absentes sont rephotographiées, le PDF est réassemblé
  à partir des pages PDF gardées dans `sortie/NN/pdf/`. Chemins `file:///` relus par `url2pathname`.
- **4, planche** : `sortie/NN/planche.png` écrite par `serie rendre` dès qu'une page change.
- Tests : `tests/test_reprise.py` (9 tests) ; une retouche de la page 3 de la fixture 08 ne rephotographie que la
  page 3, une page effacée à la main est refaite, le PDF garde ses 8 pages.

```
$ python -m pytest -q
249 passed, 1 skipped in 369.18s (0:06:09)
```

- **3, `serie publier NN`** (`serie/publication.py`, `serie/calendrier.py`) : contrôle le bloc `linkedin` du contenu
  (nouveau, facultatif sauf pour publier : accroche, intuition, promesse, question, hashtag du sujet), compose le
  texte (signature de série, liens des licences CC BY, 3 hashtags fixes + celui du sujet), rend l'épisode en
  incrémental et écrit `publier/NN/` : PDF, `titre.txt`, `texte.txt`, `premier-commentaire.txt`, `apercus/`,
  `date.txt`. Rien n'est écrit s'il reste une erreur. La typographie 9.4 n'est appliquée ni aux adresses, ni aux
  titres des références (« D2L 12.3 »), ni aux noms de licence (« CC BY-SA 4.0 »).
- Dates (9.7) : `dates_prevues` place chaque saison, puis son bilan, sur les créneaux, en recommençant sur une
  semaine impaire après la pause (A32). Tant que `date_lancement` n'est pas fixée, `date.txt` dit « à fixer ».
- Fixture 08 : bloc `linkedin` tiré de l'exemple de charte/texte-linkedin.md (134 mots).
- Ambiguïtés nouvelles : A32, A33, A34 (mineures).

```
$ python -m pytest -q
271 passed, 1 skipped in 220.49s (0:03:40)
```

Reste : 5 (formes de page pour 02 à 04), 6 à 8 (skills, relecteur, hooks), production 01 à 04.

## Décisions de l'utilisateur du 2026-10-25 — appliquées

- **A33** : avertissement de l'accroche à 150 caractères (mobile).
- **A20** : `couleurs.complements` dans charte.yaml (fond_image, icone, bord_carte, texte_bloc_sombre) ; plus aucune
  couleur en dur (style.css.j2, rendu.py, blocs.py, planche Bib-Motifs).
- **A23** : « modèle » introduit par l'épisode 01 (fiche 01 et glossaire), retiré de l'épisode 04 ; `serie valider`
  conforme (193 termes).
- **A15** : page de fin = titre de l'épisode suivant, phrase de transition de la fiche (Geist 22 px 500), invitation.
  Canevas 08-Fin.dc.html modifié, tests/reference/08-Fin.png régénérée ici ; vérifiée à l'œil (aucun chevauchement
  avec le robot ; vide C3 de la page de fin inchangé, 11 px).
- **A22 (partie)** : dernier épisode d'une saison → « Bilan, puis saison N+1 · Nº XX », titre et transition du
  premier épisode de la saison suivante ; même annonce dans la signature du post. Le bloc de clôture de l'épisode 62
  attend la session de design.
- **A29** : complément `polices.grecques` (sous-ensemble grec de STIX Two Text, U+0370-03FF) pour Geist et Geist
  Mono ; vérifié par CDP (θ, η, Σ dessinés par « STIX Two Text », police chargée). Une police du système est
  désormais toujours une erreur. Planchers remesurés : 02-Ouverture 2 938, 03-Mecanisme 4 759, 06-Exemple 6 740
  (l'en-tête du tableau gagne 1 px, tout ce qui suit descend de 1 px ; images de différences vérifiées),
  07-Piege 3 527. Vide C3 de la page 6 de la fixture : 134 px (135 avant).
- **A30 (précision)** : une année (1000 à 2099) n'est admise que si elle figure dans un extrait de sources/NN/.
- AMBIGUITES.md : 14 entrées résolues ; restent A12, A11, A24, A25, A22 (session de design) et A34 (#ThetaML).

```
$ python -m pytest -q
274 passed, 1 skipped in 249.15s (0:04:09)
```

## Jalon 4 · Agent — skills, relecteur, hooks (2026-10-25)

- **Vérifications demandées** : A29, la tolérance remesurée ne touche que les 4 entrées 02, 03, 06, 07 de
  `PLANCHER` (seuil par page ; marge de 100 px inchangée). A22, la signature du post est maintenant tirée de
  `episode_suivant` (serie/rendu.py), la même fonction que la page de fin : même étiquette, même titre.
- **Une seule grille de règles** : `serie verifier` applique aussi les règles du texte du post quand le contenu en
  a un (`texte_du_post`, `controler_linkedin`, partagés avec `serie publier`). Le relecteur recopie ce rapport et
  n'a pas de grille à lui.
- **Commandes ajoutées** : `serie statut NN|bilan-N relu|publie --le|mesure|genere` (passages contrôlés),
  `serie bilan N` (couverture et sommaire ; fin : A35), prochaine publication dans `serie etat`.
- **Reprise** : `linkedin` suit `contenu` dans `ETAPES` ; contenu, linkedin et images s'enregistrent ensemble
  après le choix de l'image (A37).
- **Skills** (`.claude/skills/`) : episode, saison (un sous-agent par épisode, contexte neuf), bilan, etat,
  corriger, stats. **Sous-agent** `.claude/agents/relecteur.md` : Read, Grep, Glob, Write (relecture.md seulement).
- **Hooks** (`.claude/settings.json`, `.claude/hooks/`) : `proteger.py` (PreToolUse : gabarits/, bibliotheque/,
  charte/, design/, tests/reference/ verrouillés hors `.session-design` ; shell : A36), `verifier_contenu.py`
  (PostToolUse : `serie verifier NN --sans-mesures`, erreurs renvoyées à l'agent), `maj_etat.py` (Stop :
  `serie etat --maj`). Ils s'appliquent quand Claude Code est lancé depuis `serie-ml/` (`$CLAUDE_PROJECT_DIR`).
- Aucun fichier de gabarits/, bibliotheque/ ni tests/reference/ modifié dans cette partie.
- **Brief de la session de design** : `BRIEF-SESSION-DESIGN.md`.
- Ambiguïtés nouvelles : A35 (importante, session de design), A36, A37 (mineures).

```
$ python -m pytest -q
312 passed, 1 skipped in 318.46s (0:05:18)
```

Reste du jalon 4 : session de design (A12…), puis production 01 à 04 avec /episode (critère de fin).

## A34 · #ThetaML (2026-10-25)

- Vérifié libre par l'utilisateur. `HASHTAG_SERIE = "#ThetaML"` termine chaque post :
  `#MachineLearning #IntelligenceArtificielle #DataScience <sujet> #ThetaML` (5 hashtags, dans la limite 3 à 5).
- Règle : un post sans #ThetaML, ou qui l'écrit autrement (#thetaml, #ThetaMl…), est une erreur
  (`controler_hashtag_serie`) : dans `serie verifier` et `serie publier` (texte composé), et dans `serie valider`
  (posts déjà préparés, `publier/NN/texte.txt`). Le hashtag du sujet ne peut pas être #ThetaML.
- charte.yaml (`serie.hashtag`), charte-graphique.md, texte-linkedin.md, relecteur et /episode mis à jour.

## Limite de hashtags, A36 et A37 (2026-10-25)

- Contrôle unique `controler_hashtags` (serie/publication.py), appliqué par `serie verifier`, `serie publier` et
  `serie valider` : 3 à 5 hashtags, jamais plus ; #ThetaML présent, écrit exactement ainsi, dernier du post, une
  seule fois. Un hashtag écrit dans le corps du post (accroche, intuition, promesse, question) est une erreur :
  seul le champ `hashtag` en porte un. Par construction, le post en a 5 (3 fixes, sujet, série).
- A36 et A37 : choix provisoires validés par défaut par l'utilisateur.
- BRIEF-SESSION-DESIGN.md, section 7 : ordre de la session selon l'utilisateur (A12 pour 02 à 04, A11, A25, A24,
  puis épisode 62 et fin du bilan).

## Préparation de la session de design (2026-10-25)

- Hook `SessionStart` (`.claude/hooks/rappel_session.py`) : si `.session-design` est présent au démarrage,
  avertissement à l'utilisateur (systemMessage) et consigne à l'agent (additionalContext). Ne bloque pas.
- Fin de session de design : suite verte, commit, puis l'agent supprime `.session-design` (brief, section 0 ;
  CLAUDE.md).
- `tests/test_couverture_references.py` : tout canevas, tout gabarit et toute forme de visuel doit apparaître
  dans une image de référence. Manques actuels, listés dans `EN_ATTENTE` : fonds de couverture Nuage, Réseau,
  Barres, Blocs, Grille, Arbre (A11) et Flux `page` (A25). Les 12 gabarits et les 5 formes de page de la Courbe
  sont couverts.

## Brief de design, mise à jour avant la session (2026-10-25)

- Dossiers verrouillés : le hook protège bien charte/. Une seule liste (gabarits/, bibliotheque/, charte/,
  design/, tests/reference/) dans le hook, CLAUDE.md (design/ ajouté), le brief et le rappel de démarrage ;
  `test_meme_liste_de_dossiers_verrouilles_partout` les garde alignés.
- `EN_ATTENTE` : 7 fonds de couverture (Courbe ajoutée, forme à créer) + Flux `page` ; nouveau test : chaque
  famille de couverture a son fond rendu dans une référence, ou attendu.
- Brief : épisode 03 (Comparaison supervisé / non supervisé, renforcement sur une page Flux à part), épisode 01
  (piège : zone couverte en contexte, point hors zone en alerte), Nuage `droite` réutilise le calcul de la droite
  de la Courbe, Grille `pixels` 8 × 8 au plus, un commit par famille terminée. Décisions tracées en A38 ; /episode
  lit les décisions résolues qui citent son épisode.

## Nuit du 2026-11-06 (demande de l'utilisateur : « fait toutes les tâches possibles »)

Interdits gardés : rien de publié, rien de poussé, aucun service externe, aucun dossier verrouillé modifié.

- LinkedIn : bilans publiables, post manqué non bloquant (A65), alerte du jeton à 14 et 3 jours.
- Bilan de la saison 1 : contenu/bilan-1.yaml, publier/bilan-1/, statut « généré ».
- Épisode 11 : contenu, rendu et vérification sans erreur bloquante ; relecture et publication à faire, le
  `relecteur` n'étant disponible que depuis une session ouverte dans serie-ml/.
- Épisode 12 : arrêté avant les sources, forme de plan absente (A67).
- Notebooks 05, 07, 08, 09, 10, 11 : notebooks/, exécutés, chiffres vérifiés par des `assert`. Exécution avec
  Anaconda : numpy et nbclient ne sont pas dans .venv.
- `serie decisions` : sortie/decisions.md, 34 décisions.

Refus : `serie linkedin planifier` a été refusé deux fois par le contrôle des permissions (persistance) ; non
contourné, l'utilisateur doit lancer la commande.
