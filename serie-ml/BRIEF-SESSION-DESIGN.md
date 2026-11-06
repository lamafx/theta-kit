# Brief · session de design n° 1

Session lancée exprès par l'utilisateur (CLAUDE.md : `gabarits/`, `bibliotheque/`, `charte/`, `design/` et
`tests/reference/` ne changent que dans une session de design). Décisions de l'utilisateur du 2026-10-25 :
A12, A11, A25, A24, plus A22 (épisode 62) et A35 (fin du bilan), dans `AMBIGUITES.md`.

## 0. Ouvrir et fermer la session

- Ouvrir : créer le fichier vide `.session-design` à la racine du dépôt. Le hook `.claude/hooks/proteger.py`
  déverrouille alors les 5 dossiers de sa liste `VERROUILLES` : `gabarits/`, `bibliotheque/`, `charte/`,
  `design/`, `tests/reference/` (même liste dans CLAUDE.md ; `tests/test_hooks.py` vérifie qu'elles restent
  alignées).
- **Un commit par famille terminée**, suite au vert : canevas, référence, forme, calcul et tests de la famille
  ensemble (« Session de design n° 1 : Grille », etc.).
- Pendant la session, **chaque gabarit ou forme produit a son image de référence** dans `tests/reference/` et
  passe la suite (`python -m pytest -q`) **avant d'être commité**, comme 08-Fin. `tests/test_couverture_references.py`
  l'impose : tout canevas, tout gabarit et toute forme de `bibliotheque/` doit apparaître dans une référence ; les
  manques connus sont dans `EN_ATTENTE` (7 fonds de couverture A11, Flux `page` A25) et doivent en sortir dès que leur référence existe.
- Fermer, dans cet ordre : suite au vert, commit « Session de design n° 1 » (entrées traitées de AMBIGUITES.md
  passées en « Résolues »), puis **l'agent supprime lui-même `.session-design`**. Au démarrage d'une session,
  le hook `rappel_session.py` avertit si le fichier est resté.
- Méthode établie aux jalons 2 et 3 : on dessine d'abord le **canevas** (`design/canevas-gabarits/*.dc.html`),
  on le valide à l'œil, on en tire l'**image de référence** (`tests/reference/*.png`, rendue sur cette machine par
  `serie/etalon.py`), puis le **code** (`bibliotheque/<famille>.py`) qui doit reproduire le canevas
  (fidélité ≤ 100 px, `tests/test_rendu.py`). Toute valeur affichée vient de `calculs/`.

## 1. Référence de style

Le carrousel de l'épisode 08 (« La descente de gradient ») fait foi pour le style, la densité et la
hiérarchie : `tests/reference/02-Ouverture.png` à `08-Fin.png` et `Main.png` (couverture), sources dans
`design/canevas-gabarits/`. La grammaire de chaque famille est celle de ses vignettes :
`tests/reference/Bib-Motifs.png` (fonds de couverture, 400 × 170) et `Bib-Visuels.png` (pages, 264 × 112).
Une forme pleine page agrandit cette grammaire, elle n'en invente pas une autre.

## 2. Contraintes de la charte (charte/charte.yaml, charte-graphique.md, bibliotheque-visuelle.md)

| Sujet | Contrainte |
| --- | --- |
| Page | 1080 × 1350 px ; marges 72 (haut), 80 (côtés), 56 (bas) : zone de contenu de 920 px de large |
| Visuel de page | 920 px de large ; hauteurs des formes de l'épisode 08 : 360 à 460 px (Courbe : descente 420, pentes 460, comparaison 3 × 280 × 220, plancher 440, itérations 360) |
| Couleurs, pages claires | objet étudié `#0E1116`, ce qui bouge ou ce qu'on montre en accent `#2D5BFF`, contexte `#C3C7CE`, panneau `#F4F6FA`, alerte `#C2410C` (1 par page, 2 par carrousel au plus) |
| Couleurs, couverture | fond `#0A0F17`, tout le motif en accent `#4C8DFF` à opacités variables (Lignes de niveau : 0,08 à 0,6), texte `#F5F8FC` |
| Polices | Geist (texte), Geist Mono (étiquettes), STIX Two Text (formules et lettres grecques, A29) ; aucune police du système |
| Tailles | texte de lecture 20 px au moins ; tout texte 14 px au moins ; étiquettes 16 px ; une étiquette de visuel en Geist 16 px gris secondaire `#5F6673` |
| Remplissage (C3) | 287 px de vide au plus entre le dernier bloc et le pied |
| Visuel obligatoire | ouverture, mécanisme, piège (C2) |
| Comparaison | 2 ou 3 fois le même visuel, mêmes axes, un seul paramètre change |
| Calcul | chaque point, droite, valeur vient d'une fonction de `calculs/`, jamais placé à l'œil (seuls repère et décalages d'étiquettes sont des paramètres, A19) |
| Couverture | fond SVG 1080 × 780 placé à (−80, −30), derrière le robot (`bibliotheque/robot-couverture.svg` à (160, 60)) et sous le titre (108 px) ; le robot reste dominant |

## 3. Priorité : ce dont les épisodes 01 à 04 ont besoin

| Ép. | Page | Besoin | Famille, forme | Existe ? |
| --- | --- | --- | --- | --- |
| 01 | Couverture | nuage de points épars, les exemples | Nuage, fond de couverture | non (A11) |
| 01 | Ouverture | « règles + données → réponses » / « données + réponses → règles » | Flux, `page` sur 2 lignes | provisoire (A25) |
| 01 | Exemple (capture) | schéma du filtre anti-spam, variante sans capture | Flux, `page` | provisoire (A25) |
| 01 | Piège | il n'apprend que ce que contiennent ses exemples | Nuage, `points` : la zone couverte par les exemples en contexte (gris), un point hors de cette zone en alerte | non (A12) |
| 02 | Couverture | grille de données, une colonne mise en évidence | Grille, fond de couverture | non (A11) |
| 02 | Ouverture | une maison = une ligne d'un tableau | Grille, `ligne` | non (A12) |
| 02 | Mécanisme | lignes = exemples, colonnes = caractéristiques, dernière colonne = étiquette | Grille, `tableau` (colonne mise en évidence) | non (A12) |
| 02 | Piège | le texte et les images deviennent des nombres | Grille, `pixels` : image de 8 × 8 cases au plus, intensités et valeurs lisibles | non (A12) |
| 03 | Couverture | trois groupes de points distincts | Nuage, fond de couverture | non (A11) |
| 03 | Comparaison | supervisé contre non supervisé : même nuage, mêmes axes ; seul change la couleur des points (colorés par étiquette, ou tous gris) | Nuage, `points` ×2 (paramètre `etiquettes`) | non (A12) |
| 03 | Renforcement (page à part) | apprendre à jouer : agir, recevoir une récompense, recommencer | Flux, `page` avec boucle de retour | provisoire (A25) |
| 03 | Ouverture | les trois familles, en repères | à trancher en session (voir ci-dessous) | non |
| 04 | Couverture | famille de droites qui pivotent autour d'un point | Courbe, fond de couverture | non (A11) |
| 04 | Ouverture | ŷ = a·x + b, a et b sont les boutons | Courbe, `droite` | non |
| 04 | Comparaison | changer a fait pivoter la droite, changer b la décale | Courbe, `pivot` et `decalage` (droite fantôme) | non |

Décisions de l'utilisateur (2026-10-25) intégrées ci-dessus :
- **03, Comparaison** : supervisé contre non supervisé seulement, même nuage et mêmes axes ; seul change le fait
  que les points soient colorés par étiquette ou tous gris. Le **renforcement va sur une page à part**
  (Mécanisme), en Flux avec boucle de retour : l'épisode 03 passe de 5 à 6 pages (format court, 4 à 6).
- **01, Piège** : Nuage `points`, la zone couverte par les exemples en contexte, un point hors de cette zone en
  alerte (la seule alerte de la page).
- **04** : la Courbe n'est pas dans la liste A12, mais l'épisode 04 a besoin de formes de droite et d'un fond de
  couverture Courbe ; ce brief les ajoute à la session.

Reste à trancher pendant la session : le visuel de l'**ouverture de l'épisode 03** (« les trois familles en
trois colonnes », visuel obligatoire). Proposition : trois petits panneaux — nuage coloré, nuage gris, boucle
Flux — la règle « même visuel » ne s'appliquant qu'aux pages Comparaison.

## 4. Par famille : ce qui doit être produit

Ordre de priorité : premier épisode qui en a besoin.

| Famille | Pleine page (A12) | Fond de couverture (A11) | Premier besoin |
| --- | --- | --- | --- |
| **Grille** | `ligne` (une ligne de tableau, valeurs nommées), `tableau` (lignes, colonnes, colonne mise en évidence, étiquette distinguée), `pixels` (image de 8 × 8 cases au plus, intensités en cases, valeurs lisibles) ; plus tard matrice de confusion (21), attention (57), fenêtre de convolution (47) | grille, une colonne mise en évidence (02, 21, 47, 57) | 02 |
| **Nuage** | `points` (exemples épars ; paramètre `etiquettes` : colorés par étiquette ou tous gris ; zone couverte en contexte et point hors zone en alerte), `groupes` (2 à 4 groupes), `droite` (régression : **réutilise le calcul de la droite de la Courbe** et y ajoute les points et les écarts verticaux), `frontiere` (classes de part et d'autre) ; axes et étiquettes comme la Courbe de l'épisode 08 | nuage épars, ou groupes (01, 03, 05, 11, 12, 14, 15, 26, 30, 34, 35, 36, 54) | 01 |
| **Courbe** (ajout) | `droite` (ŷ = a·x + b, calcul partagé avec Nuage `droite`), `pivot` (a change, b fixe), `decalage` (b change, a fixe), avec droite fantôme en contexte | droites qui pivotent (04, 06, 10, 16, 17, 18, 23, 25, 27, 29, 38, 61) | 04 |
| **Flux** | valider `page` (A25 : boîtes de 76 px, Geist 24 px, flèches de 64 px, boucle en accent) ; variante sur 2 lignes comparées ; boucle de retour pour la page renforcement de l'épisode 03 | aucun (pages intérieures seulement) | 01 |
| **Barres** | `barres` (valeurs, barre dominante en accent, étiquettes), `probabilites` (somme à 1, softmax) | barres, une dominante (19, 22, 43, 46, 53, 59, 60) | 19 |
| **Blocs** | `decoupage` (jeu de données en parts : entraînement, validation, test), `empilement` (couches, tokens) | blocs proportionnels (20, 24, 48, 52, 58) | 20 |
| **Arbre** | `arbre` (profondeur, branche suivie en accent, feuilles colorées par classe) | arbre, une branche suivie (31, 32, 33) | 31 |
| **Réseau** | `couches` (nœuds par couche, liens, sens), `eteints` (dropout), `attention` (liens pondérés entre mots) | réseau en couches (37, 39, 40, 41, 42, 45, 49, 50, 51, 55, 56, 62) | 37 |

Pour chaque fond de couverture (A11, décision modifiée) : **un motif propre à la famille, recadré et très
atténué**, pas l'agrandissement × 2,7 de la vignette. Modèle : Lignes de niveau (`Main.png`) — le motif occupe
le haut et le côté droit, s'efface vers le robot, opacités de 0,08 à 0,6, un seul élément plus marqué (le chemin).
Le motif doit rester calculé (`calculs/`) et paramétrable, pour que deux épisodes consécutifs de la même famille
se distinguent (bibliotheque-visuelle.md).

Livrables par forme : un canevas (planche pleine page, ou page d'épisode), son image de référence, la forme dans
`bibliotheque/<famille>.py` (`FORMES`, `PARAMETRES`), le calcul dans `calculs/`, un test de fidélité. Pour les
couvertures, une planche des 7 fonds côte à côte aide à juger l'ensemble.

## 5. Références à régénérer (A24)

`tests/reference/Image-Contexte.png` et `Image-Capture.png` montrent encore le cadre « à déposer ici » (retiré,
B6) et l'ancien format de crédit (D5).
1. Mettre à jour `design/canevas-gabarits/Image-Contexte.dc.html` et `Image-Capture.dc.html` : image d'essai
   (comme `tests/fixtures/images/`), crédit « Photo : Auteur · Licence · Source ».
2. Régénérer les deux PNG ici, vérifier à l'œil.
3. Retirer `MASQUES` de `tests/test_rendu.py` (et le test `test_masques_limites_aux_images`), remesurer leurs
   planchers.

## 6. Pages de fin à dessiner

- **Épisode 62, bloc de clôture (A22)** : aujourd'hui « Fin de la série · Merci de l'avoir suivie » dans le bloc
  « épisode suivant ». À dessiner : un vrai bloc de clôture (récapitulatif des 4 saisons ? remerciement,
  invitation à relire le sommaire), dans la page de fin, sans gêner la baguette du robot (pointe à x = 483,
  y = 735). Le texte du post (signature) reprend la même étiquette et le même titre (une seule source :
  `episode_suivant`, serie/rendu.py).
- **Fin du post bilan (A35)** : variante du gabarit de fin sans points ni « Vérifiez-vous », avec
  « Saison N+1 : reprise le [date] » (date de `serie/calendrier.py`). Ajouter la page à `pages_bilan_html`.

## 7. Ordre de la session (décision de l'utilisateur du 2026-10-25) et critère de fin

1. **A12, familles des épisodes 02 à 04** : formes pleine page Grille (02), Courbe en droites (04), puis Nuage
   (03, et le piège de 01), qui réutilise le calcul de la droite. C'est ce qui débloque la production. Un commit
   par famille terminée.
2. **A11, fonds de couverture** : les 7 fonds (Nuage, Grille, Courbe d'abord, puis Barres, Blocs, Arbre,
   Réseau), sur une planche commune. La Courbe n'a pas encore de forme `couverture` : elle est à créer.
3. **A25** : validation à l'œil de la forme pleine page Flux (01).
4. **A24** : régénération des références Image-Contexte et Image-Capture, retrait des masques.
5. **En dernier, pas urgent** : le bloc de clôture de l'épisode 62 (A22) ; la fin du post bilan (A35, même
   gabarit de fin) peut se faire au même moment.
6. Formes pleine page de Barres, Blocs, Arbre, Réseau (premiers besoins : épisodes 19, 20, 31, 37) : hors
   priorité, éventuellement une deuxième session.

Critère de fin de la session : les épisodes 01 à 04 peuvent être produits sans « bloqué par A12 » ; toutes les
nouvelles formes ont un canevas, une référence et un test de fidélité ; `python -m pytest -q` passe ; les entrées
traitées de AMBIGUITES.md passent en « Résolues ».
