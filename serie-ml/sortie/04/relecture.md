# Relecture · Nº 04 · Modèle et paramètres

Relecture du 2026-11-14, sur `contenu/04.yaml` réécrit pour la compréhension (pages 2, 3, 4, 5 et texte du post).
Le dossier `publier/04/` date d'avant cette réécriture : son `texte.txt` ne correspond plus au contenu relu.

Sources relues aujourd'hui sur le web :

- Google, Machine Learning Crash Course, « Linear regression »,
  https://developers.google.com/machine-learning/crash-course/linear-regression (« Last updated 2025-12-09 UTC »).
  Les extraits `mlcc-relation`, `mlcc-ligne`, `mlcc-droite`, `mlcc-ordonnee`, `mlcc-parametre`, `mlcc-entrainement`,
  `mlcc-equation` et `mlcc-minimiser` y sont présents mot pour mot (`mlcc-minimiser` est dans une partie dépliable :
  absent du texte affiché par le lecteur web, présent dans le code HTML de la page).
- Google, Machine Learning Crash Course, « Linear regression: Loss »,
  https://developers.google.com/machine-learning/crash-course/linear-regression/loss.
- Google, « Machine Learning Glossary », https://developers.google.com/machine-learning/glossary (entrées
  « parameter », « hyperparameter », « neural network »).
- Data 100, « Ordinary Least Squares », https://ds100.org/fa23-course-notes/ols/ols.html.
- D. De Cock (2011), Journal of Statistics Education 19(3), http://jse.amstat.org/v19n3/decock.pdf ;
  http://jse.amstat.org/v19n3/decock/DataDocumentation.txt ; http://jse.amstat.org/v19n3/decock/AmesHousing.txt
  (2 930 lignes de données, 5 maisons de plus de 4 000 pieds carrés, années de vente 2006 à 2010 : recompté).
- BCEAO, « Cours de référence des principales devises contre Franc CFA »,
  https://www.bceao.int/fr/cours/cours-de-reference-des-principales-devises-contre-franc-cfa : la page n'affiche que
  le dernier cours (« Cours des devises du vendredi 13 Novembre 2026 », dollar US 593,5200) ; le cours du
  27 octobre 2026 (588,3000) ne peut plus y être relu, l'extrait `bceao-dollar` recopié le 2026-10-30 fait foi.

Calculs recoupés : `calculs.ames.droite_prix_surface()` donne a = 73,6 et b = 3,98 avant arrondi, 2 925 ventes ;
avec les réglages arrondis, 74 × 1,5 + 4 = 115 (114,4 sans arrondi, ce que dit la description du schéma).

## Avertissement scientifique (en tête)

- Page 4, ligne 3, et page 5, point 3 : le critère est écrit maison par maison (« pour chaque maison vendue, l'écart
  […] doit être le plus petit possible »). Contre-exemple tiré des données : trois maisons de 2 290 pieds carrés
  (213 m²) vendues 122 500, 255 900 et 500 067 dollars ; une droite ne donne qu'un seul prix prédit pour 213 m², elle
  ne peut pas rendre les trois écarts les plus petits possible à la fois. Le critère porte sur l'ensemble des ventes
  (voir D1).

## Mises en conformité (appliquées automatiquement)

Les trois corrections portent sur le texte du post ; appliquées ensemble, il compte 220 mots signature comprise
(compteur de `serie/publication.py`), soit la limite ; le post actuel en compte 217. C1 seule le porterait à 221 et
C1 + C2 à 223 : C1 n'est applicable qu'avec C3.

**C1 · Post, `linkedin.texte` : montant en FCFA sans le cours BCEAO daté.**
- Constat : « 74 millions de FCFA » est un montant converti ; ni le post ni les pages ne disent « au cours BCEAO du … ».
- Source : `charte/regles-redaction.md`, « Les montants et les légendes » : « le texte ou le post dit « au cours BCEAO
  du … » » ; extrait `bceao-dollar` : « Cours des devises du mardi 27 Octobre 2026 […] Dollar us 588,3000 ».
- Avant : « Le premier, 74, dit que chaque 100 m² de plus ajoute 74 millions de FCFA au prix prédit. »
- Après : « Le premier, 74 : chaque 100 m² de plus ajoute 74 millions de FCFA au prix prédit (cours BCEAO du 27 octobre 2026). »
- Règle appliquée : tout chiffre est daté et sourcé ; montant converti au cours BCEAO daté. « dit que » retiré pour
  tenir la longueur, sans changer le sens.

**C2 · Post, `linkedin.texte` : nombre de ventes non daté.**
- Constat : « 2 925 ventes de maisons » ne dit pas quand ; la source donne les années (les pages le disent, page 3).
- Source : De Cock (2011), http://jse.amstat.org/v19n3/decock.pdf : « the sale of individual residential property in
  Ames, Iowa from 2006 to 2010 ».
- Avant : « 2 925 ventes de maisons en entrée. » et « de ces ventes d'Ames, une ville des États-Unis, »
- Après : « 2 925 ventes de maisons (2006 à 2010) en entrée. » et « de ces ventes d'Ames, ville des États-Unis, »
  (même tournure que la page 3 ; l'accroche passe à 82 caractères, sous 150).
- Règle appliquée : tout chiffre est daté.

**C3 · Post, `linkedin.texte`, dernière phrase : formule absolue non sourcée.**
- Constat : « comme tout résumé » est une généralité que la source ne porte pas ; la phrase dit la même chose sans elle.
- Source : aucune des références de la fiche ne parle des résumés en général.
- Avant : « Ce modèle ne garde aucune vente, seulement un résumé, qui, comme tout résumé, laisse des détails de côté. »
- Après : « Ce modèle ne garde aucune vente, seulement un résumé, qui laisse des détails de côté. »
- Règle appliquée : pas de formule absolue (« tout ») sauf si elle est vraie et sourcée. La fin reste une synthèse en
  une phrase.

## Décisions de l'utilisateur

**D1 · Page 4, `lignes[2].sens`, et page 5, `points[2]` : le critère écrit maison par maison.**
- Constat : « pour chaque maison vendue, l'écart […] doit être le plus petit possible » laisse croire que chaque écart
  est rendu minimal ; c'est impossible dès que deux maisons de même surface ont des prix différents (contre-exemple en
  tête). Les sources minimisent un écart d'ensemble, une moyenne sur tous les exemples, sujet du Nº 05.
- Source vérifiée : Google MLCC, « Linear regression: Loss »,
  https://developers.google.com/machine-learning/crash-course/linear-regression/loss : « we recommend averaging the
  losses across all the examples » et « The goal of training a model is to minimize the loss, reducing it to its
  lowest possible value. » ; Data 100, « Ordinary Least Squares », https://ds100.org/fa23-course-notes/ols/ols.html :
  « it is the value of θ that minimizes the squared loss ».
- Correction proposée :
  - Page 4, avant : « « Meilleurs » dépend d'un critère : pour chaque maison vendue, l'écart entre le prix prédit par la
    droite et le vrai prix de vente doit être le plus petit possible. Il faut donc d'abord mesurer cet écart. »
  - Page 4, après : « « Meilleurs » dépend d'un critère : sur l'ensemble des maisons vendues, l'écart global entre prix
    prédits et vrais prix de vente doit être le plus petit possible. Il faut donc d'abord mesurer cet écart. »
    (page 4 : 54 → 51 mots ; aucun terme nouveau)
  - Page 5, avant : « Entraîner, c'est chercher les réglages : l'écart entre prix prédit et vrai prix de vente doit être
    le plus petit possible. »
  - Page 5, après : « Entraîner, c'est chercher les réglages : l'écart global entre prix prédits et vrais prix de vente
    doit être le plus petit possible. »
- Option recommandée : celle-ci ; elle garde la phrase simple et prépare le Nº 05 (une seule mesure pour toutes les
  ventes). Autre option : « en moyenne, sur toutes les maisons vendues, l'écart… » (plus explicite, 2 mots de plus,
  page 4 à 53).
- Décision : oui / non / autre

**D2 · Post, `linkedin.texte`, paragraphe sur le réseau de neurones : affirmation sans extrait et généralisée.**
- Constat : aucun extrait de `sources/04/extraits.yaml` n'appuie la phrase ; « seulement bien plus nombreux » dit que
  la seule différence avec la droite est le nombre de paramètres, ce que la source ne dit pas (et un tout petit réseau
  peut en avoir peu).
- Source vérifiée : Google, « Machine Learning Glossary », https://developers.google.com/machine-learning/glossary :
  « parameter : The weights and biases that a model learns during training. » ; « hyperparameter : […] In contrast,
  parameters are the various weights and bias that the model learns during training. » ; « neural network : A model
  containing at least one hidden layer. »
- Correction proposée :
  - Avant : « Un réseau de neurones, modèle bien plus complexe qu'une droite, se lit de la même façon : une forme
    choisie d'avance, des paramètres appris, seulement bien plus nombreux. »
  - Après : « Un réseau de neurones, modèle bien plus complexe qu'une droite, se lit de la même façon : une forme
    choisie d'avance, des paramètres appris, souvent bien plus nombreux. » (même nombre de mots ; le post reste à 220)
  - Et ajouter à `sources/04/extraits.yaml` l'extrait `mlcc-glossaire-parametre` (« The weights and biases that a model
    learns during training. », lu sur https://developers.google.com/machine-learning/glossary#parameter), référence déjà
    dans la fiche.
- Option recommandée : celle-ci ; l'idée du post est gardée, sourcée, sans dire que tout le reste est identique. Autre
  option : retirer le paragraphe (le réseau de neurones n'arrive qu'au Nº 37), ce qui libère environ 27 mots.
- Décision : oui / non / autre

**D3 · Page 1 (couverture) : le coude du robot recouvre le titre.**
- Constat : l'articulation orange du bras (vers 490 × 860 px) se pose sur le haut du « g » et du « l » de « réglages » ;
  le mot reste lisible mais la lettre est cachée.
- Source vérifiée : rendu `sortie/04/page-01.png`.
- Correction proposée : aucune dans `contenu/04.yaml` (le robot et sa position viennent du gabarit de couverture). Avant :
  bras au-dessus du titre ; après : bras qui s'arrête au-dessus de la ligne du titre, à faire en session de design
  (noter dans `AMBIGUITES.md`).
- Option recommandée : le noter pour la prochaine session de design et publier ainsi ; autre option : passer à la
  couverture classique (`visuel_classique`), sans robot.
- Décision : oui / non / autre

**D4 · Page 2, `visuel` : l'étiquette « $a$ = 74 : l'inclinaison » est barrée par le pointillé vertical de x = 1,5.**
- Constat : le segment bleu de la pente est à x = 1,4 et son étiquette commence vers 575 px, juste où passe le pointillé
  qui descend du point (585 px) : la lettre « a » est coupée.
- Source vérifiée : rendu `sortie/04/page-02.png`.
- Correction proposée : avant `triangle: 0.4` ; après `triangle: 0.6` (le segment passe à x = 1,6, son étiquette à
  droite du pointillé ; aucun texte changé). À contrôler sur le rendu : l'étiquette ne doit pas toucher
  « $ŷ = a·x + b$ ».
- Option recommandée : celle-ci, un paramètre seul. Autre option : `triangle: 0.1` (segment à x = 1,1, l'étiquette
  finit avant le pointillé si elle tient en 160 px, à vérifier).
- Décision : oui / non / autre

**D5 · Page 3, schéma de droite : l'étiquette « $b$ change » est posée sur la droite bleue.**
- Constat : la droite décalée passe sous les lettres de « change » et les touche ; même gêne, moindre, pour « $a$
  change » contre la flèche du schéma de gauche.
- Source vérifiée : rendu `sortie/04/page-03.png`.
- Correction proposée : aucune dans `contenu/04.yaml` (la place des étiquettes est fixée par `bibliotheque/courbe.py`) ;
  avant : étiquette sur la droite ; après : étiquette au-dessus de la droite, en session de design.
- Option recommandée : publier ainsi (les deux mots restent lisibles) et le noter dans `AMBIGUITES.md` ; autre option :
  retirer `b` de `textes` du cas « $b$ change » (la légende « $b$ change » est déjà au-dessus du schéma).
- Décision : oui / non / autre

## Contrôles automatiques (serie verifier)

Résultat : aucune erreur bloquante, 2 avertissement(s).

- page 2 (ouverture) : 32 mots, proche de la limite de 32
- page 4 (formule) : 54 mots, proche de la limite de 55

## Affirmations et sources

| Page | Affirmation | Extrait | Vérifiée sur |
| --- | --- | --- | --- |
| 2 | Prédire un prix est une régression (rappel) | mlcc-glossaire-regression | MLCC Glossary (citée par l'extrait ; page relue le 2026-10-31, non relue en entier aujourd'hui, 550 000 caractères) |
| 2 | La régression linéaire prédit le prix par une droite, selon la seule surface | mlcc-relation, mlcc-ligne | MLCC « Linear regression » |
| 2 | a règle l'inclinaison, b la hauteur de départ (ordonnée à l'origine) | mlcc-droite, mlcc-ordonnee | MLCC « Linear regression » (« m is the slope of the line. », « b is the y-intercept. ») |
| 2 | a = 74, b = 4 ; x = 1,5 (150 m²) donne ŷ = 115 | calculs/ames.py, ames-surface, ames-prix, bceao-dollar | Recalcul : 73,6 et 3,98 ; 74 × 1,5 + 4 = 115 ; DataDocumentation.txt (« Gr Liv Area », « SalePrice ») |
| 3 | Changer a fait tourner la droite autour de son point sur l'axe vertical ; changer b la décale sans la tourner | mlcc-droite, mlcc-ordonnee | Propriété de ŷ = a·x + b (le point x = 0 vaut b) ; MLCC |
| 3 | Ventes d'Ames, ville des États-Unis, de 2006 à 2010 | ames-ventes | De Cock (2011), decock.pdf |
| 3 | a = 74, b = 4 : 100 m² de plus ajoutent 74 millions de FCFA | calculs/ames.py, ames-4000, ames-fichier, bceao-dollar | Recalcul sur AmesHousing.txt (2 930 − 5 = 2 925 ventes) ; cours BCEAO du 27 octobre 2026 non relisible aujourd'hui |
| 4 | La forme, une droite, est choisie d'avance | mlcc-equation | MLCC « Linear regression » |
| 4 | a et b sont les paramètres, calculés pendant l'entraînement | mlcc-parametre, mlcc-entrainement | MLCC « Linear regression » ; Glossary « parameter » |
| 4 | Entraîner, c'est trouver les paramètres qui donnent le meilleur modèle | mlcc-entrainement | MLCC (« the model calculates the weight and bias that produce the best model ») |
| 4 | Paramètres souvent notés θ | ds100-theta | Data 100 « Ordinary Least Squares » |
| 4 | Critère : l'écart prédit / réel le plus petit possible | mlcc-minimiser | MLCC « Linear regression » et « Loss » ; voir D1 |
| post | 2 925 ventes ; deux nombres, 74 et 4 | ames-ventes, ames-4000, calculs/ames.py | De Cock (2011) ; recalcul ; date ajoutée par C2 |
| post | Forme choisie d'avance, paramètres appris pendant l'entraînement | mlcc-equation, mlcc-parametre | MLCC |
| post | Réseau de neurones : même lecture, paramètres plus nombreux | aucun | Glossary « parameter », « hyperparameter », « neural network » ; voir D2 |
| post | 100 m² de plus ajoutent 74 millions de FCFA | calculs/ames.py, bceao-dollar | Recalcul ; cours daté par C1 |
| post | b est le prix prédit pour 0 m², surface d'aucune maison | mlcc-ordonnee | MLCC (« b is the y-intercept. ») ; plus petite surface du fichier : 334 pieds carrés |
| post | Le modèle ne garde aucune vente, seulement un résumé | calculs/ames.py | Le modèle est fait des deux nombres a et b ; « comme tout résumé » retiré par C3 |

## Validation scientifique

- **Page 2.** Hypothèse : le prix suit à peu près une droite de la surface, une seule entrée. Domaine : dit (« la seule
  surface »), ventes d'Ames 2006 à 2010, maisons de 4 000 pieds carrés au plus. Contre-exemple : à 0 m², 4 millions de
  FCFA, prix d'aucune maison (dit dans le post). Raccourci : réglages arrondis (dit dans la description du schéma).
- **Page 3.** Hypothèse : modèle ŷ = a·x + b, axes à l'origine. Domaine : évident (mêmes schémas, droite de départ en
  gris). Contre-exemple : aucun ; si l'axe vertical n'est pas en x = 0, la droite pivote autour du point en x = 0 et
  non du point affiché, cas qui ne se présente pas ici. Raccourci : schémas sans valeurs, dit par les titres « $a$
  change » / « $b$ change ».
- **Page 4.** Hypothèse : la forme est fixée avant l'entraînement et le critère est un écart d'ensemble. Domaine : la
  forme fixée est dite ; le critère d'ensemble ne l'est pas (D1). Contre-exemple : trois maisons de 213 m² vendues
  72, 151 et 294 millions de FCFA, un seul prix prédit. Raccourci : « l'écart » sans dire comment on le mesure,
  assumé et annoncé (« Il faut donc d'abord mesurer cet écart. », Nº 05).
- **Page 5.** Hypothèse et domaine : ceux des pages 2 à 4, rien de nouveau. Contre-exemple : le même qu'en page 4
  pour le point 3 (D1). Raccourci : « les réglages » pour les paramètres, termes introduits en pages 2 et 4.
- **Post.** Hypothèse : les ventes de plus de 4 000 pieds carrés sont écartées (2 930 → 2 925), comme le recommande
  l'auteur ; non dit dans le post, sans effet sur ce qu'il affirme. Domaine : Ames, 2006 à 2010 (C2), prix en FCFA au
  cours du 27 octobre 2026 sans correction de l'inflation (décision A44). Contre-exemple : réseau de neurones à très
  peu de paramètres (D2). Raccourci : « une droite tracée au plus près », sans nommer les moindres carrés, assumé.

Relecture écrite : sortie/04/relecture.md (3 mises en conformité, 5 décisions).
