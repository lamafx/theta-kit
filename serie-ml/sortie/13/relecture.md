# Relecture · Nº 13 · Normaliser les données

Relu le 2026-11-14, sans avoir vu la rédaction. Les quatre références de la fiche ont été relues en ligne :
MLCC et scikit-learn (pages HTML), D2L 12.6 (page HTML), LeCun et al. (1998) (PDF lu à l'adresse de la fiche,
par HTTP ; la copie de Léon Bottou, https://leon.bottou.org/publications/pdf/tricks-1998.pdf, a un codage de
police illisible à l'extraction). Les 34 extraits de `sources/13/extraits.yaml` y figurent mot pour mot (à la mise en forme LaTeX près pour D2L).

## Mises en conformité (appliquées automatiquement)

Aucune. Pas de tiret long, pas de citation entre guillemets, pas de chiffre daté attendu (120 m², 3 chambres,
μ = 100, σ = 20 et « dix fois » sont des exemples, ceux de MLCC pour les deux derniers), pas d'image réelle.

## Décisions de l'utilisateur

### D1 · Post : dire que des variantes de la descente atténuent le problème

- **Constat** : le post (`linkedin.texte`, 3e paragraphe) présente le rebond et la lenteur comme la conséquence
  des écarts d'échelle, sans dire que cela vaut pour la descente à un seul pas pour tous les poids. La source
  principale donne elle-même cette limite (extrait `mlcc-optimiseurs`, recueilli mais utilisé nulle part).
  Ajouter la nuance n'en retire aucune ; la recommandation de normaliser reste.
- **Source vérifiée** : Google, Machine Learning Crash Course, « Numerical data: Normalization »,
  https://developers.google.com/machine-learning/crash-course/numerical-data/normalization :
  « That said, more advanced optimizers like Adagrad and Adam protect against this problem by changing the
  effective learning rate over time. » et « We recommend normalizing numeric features covering distinctly
  different ranges (for example, age and income). »
- **Correction proposée** (`linkedin.texte`, 3e paragraphe) :
  - avant : « La descente de gradient, qui corrige les poids un peu à chaque tour, en souffre : un pas assez
    prudent pour la surface est trop timide pour les chambres. L'entraînement rebondit et ralentit ; avec des
    écarts énormes, il peut même ne jamais aboutir. »
  - après : « La descente de gradient, qui corrige les poids un peu à chaque tour, en souffre : un pas assez
    prudent pour la surface est trop timide pour les chambres. L'entraînement rebondit et ralentit ; avec des
    écarts énormes, il peut même ne jamais aboutir. Des variantes de la descente, qui ajustent leur pas en cours
    de route, atténuent ce défaut ; normaliser reste conseillé. »
  - sources à citer : `mlcc-optimiseurs`, `mlcc-recommande`.
- **Option recommandée** : oui, un lecteur averti (recruteur technique) objectera sinon qu'Adam règle le
  problème ; la phrase ne nomme pas Adam, qui n'est introduit qu'au Nº 44. Autre option : ne rien ajouter et
  garder la nuance pour le Nº 44.
- **Décision** : oui / non / autre

### D2 · Post : la phrase finale assimile normaliser et diviser par l'écart-type

- **Constat** : la dernière phrase du post (`linkedin.texte`) dit « Normaliser, c'est mesurer chaque
  caractéristique avec sa propre règle : son écart-type. » Or le post vient d'écrire « Un remède répandu », et
  MLCC présente la standardisation (Z-score) comme une méthode parmi trois ; la mise à l'échelle linéaire, par
  exemple, divise par l'étendue (maximum moins minimum), pas par l'écart-type. La phrase généralise ce que la
  source limite.
- **Source vérifiée** : Google, Machine Learning Crash Course, « Numerical data: Normalization »,
  https://developers.google.com/machine-learning/crash-course/numerical-data/normalization :
  « This section covers three popular normalization methods: linear scaling Z-score scaling log scaling ».
- **Correction proposée** (`linkedin.texte`, dernière phrase) :
  - avant : « Normaliser, c'est mesurer chaque caractéristique avec sa propre règle : son écart-type. »
  - après : « Standardiser, c'est mesurer chaque caractéristique avec sa propre règle : son écart-type. »
- **Option recommandée** : oui, un mot change et la synthèse devient exacte ; le terme « standardisation » est
  introduit juste avant dans le post. Autre option : « Normaliser, c'est souvent mesurer chaque caractéristique
  avec sa propre règle : son écart-type. »
- **Décision** : oui / non / autre

### D3 · Page 2 : deux libellés du dessin chevauchent les ellipses

- **Constat** : page 2 (`visuel`), le libellé « coût le plus bas » est barré par l'ellipse intérieure (niveau 1,
  demi-hauteur d'environ 28 px, juste à la hauteur du texte) et « poids des chambres w₂ » est traversé par la
  pointe de l'ellipse extérieure (niveau 9). La lecture reste possible mais le dessin paraît brouillon.
- **Source vérifiée** : sans objet (rendu `sortie/13/page-02.png`, regardé).
- **Correction proposée** (`pages[1].visuel.params.niveaux`) :
  - avant : `niveaux: [1, 4, 9]`
  - après : `niveaux: [4, 9]`
  - effet : l'ellipse intérieure (niveau 4, demi-hauteur d'environ 55 px) entoure le libellé « coût le plus
    bas » sans le couper ; la vallée reste très allongée. Le chevauchement de « poids des chambres w₂ » tient à
    la place du libellé, fixée par la bibliothèque : il relève d'une session de design (à noter dans
    AMBIGUITES.md).
- **Option recommandée** : oui, avec la note dans AMBIGUITES.md pour le second libellé. Autre option : laisser
  tel quel, le Nº 09 utilise le même dessin.
- **Décision** : oui / non / autre

## Contrôles automatiques (serie verifier)

Résultat : aucune erreur bloquante, 4 avertissements.

- page 2 (ouverture) : 32 mots, proche de la limite de 32
- page 4 (formule) : ligne 1 : « valeur » est le terme « valeur », introduit à l'épisode 57 (mot courant : vérifier le sens)
- page 4 (formule) : ligne 2 : « valeurs » est le terme « valeur », introduit à l'épisode 57 (mot courant : vérifier le sens)
- page 4 (formule) : ligne 3 : « valeurs » est le terme « valeur », introduit à l'épisode 57 (mot courant : vérifier le sens)

Sens vérifié pour les trois derniers : « valeur » est employé au sens courant (le nombre que prend une
caractéristique), pas au sens du terme technique de l'épisode 57 ; MLCC emploie le même mot (« raw value »).

## Affirmations et sources

| Page | Affirmation | Extrait | Vérifiée sur |
| --- | --- | --- | --- |
| 2 | Pour 120 m² et 3 chambres, le poids de la surface multiplie 120, celui des chambres 3 ; retoucher le premier change davantage J | `lecun-lineaire`, `lecun-entrees`, `skl-dominer`, `mlcc-attention` | LeCun et al. (1998), exemple LMS (Hessienne du modèle linéaire = covariance des entrées) ; scikit-learn 8.3.1 ; MLCC |
| 2 | Les lignes de niveau du coût forment une vallée très allongée | `lecun-ovales`, `lecun-etalement`, `d2l-canyon`, `d2l-raide` | LeCun et al. (1998) ; D2L 12.6 « Momentum » |
| 3 | La normalisation met les caractéristiques sur la même échelle | `mlcc-but` | MLCC (« The goal of normalization is to transform features to be on a similar scale. ») |
| 3 | Vallée allongée : la descente rebondit d'un bord à l'autre et avance peu | `mlcc-rebond`, `d2l-oscille`, `d2l-dilemme`, `lecun-pas` | MLCC (« gradient descent can "bounce" and slow convergence ») ; D2L 12.6 ; LeCun et al. (1998) |
| 3 | Vallée ronde : chaque pas va droit vers le minimum | `lecun-gradient` | LeCun et al. (1998), fig. 7b (le gradient ne vise pas le minimum dans l'ellipse ; il le vise dans le cercle) |
| 3 | Mêmes départ, η et nombre de pas : seule la forme change | dessin (`calculs.descente_gradient`) | Calcul refait : à η = 0,055, facteurs 1 − 2ηk de −0,76 (raide) et 0,89 (plat) pour la vallée [1, 16] : le chemin rebondit et reste à environ 0,6 du minimum après 15 pas ; 0,56 dans les deux directions pour [4, 4] : minimum atteint |
| 3 | Surface et chambres varient ensemble : la vallée s'arrondit sans devenir ronde | `lecun-liees` ; Nº 12 | LeCun et al. (1998) (« this will not make the error surface spherical, but it will possibly reduce its eccentricity ») ; `contenu/12.yaml` (ventes d'Ames) |
| 4 | La standardisation est une façon courante de normaliser | `mlcc-populaires`, `skl-courante` | MLCC ; scikit-learn 8.3.1 |
| 4 | x′ = (x − μ) / σ ; μ moyenne, σ écart-type | `mlcc-formule`, `skl-centrer-diviser`, `lecun-moyenne`, `lecun-variances` | MLCC ; scikit-learn ; LeCun et al. (1998) (« Subtract the means », « Normalize the variances of the input variables. ») |
| 4 | Après elle, moyenne 0 et écart-type 1 | `skl-zero-un` | scikit-learn (« Scaled data has zero mean and unit variance ») |
| 4 | μ et σ calculés pendant l'entraînement | `skl-entrainement`, `mlcc-prediction` | scikit-learn (StandardScaler) ; MLCC (avertissement sur les prédictions) |
| 4 | x′ = nombre d'écarts-types entre x et la moyenne ; μ = 100, σ = 20 : 130 donne 1,5 | `mlcc-zscore`, `mlcc-exemple` | MLCC (« Z-score = +1.5 ») |
| Post | Au départ, une caractéristique dix fois plus étalée est jugée dix fois plus importante | `mlcc-dix-fois` | MLCC (« the model assumes that Feature B is ten times more "important" than Feature A ») ; paraphrase, pas de guillemets |
| Post | Un pas assez prudent pour la surface est trop timide pour les chambres | `d2l-dilemme`, `lecun-pas` | D2L 12.6 ; LeCun et al. (1998) |
| Post | Avec des écarts énormes, l'entraînement peut ne jamais aboutir | `mlcc-echec` | MLCC (caractéristiques de −1 à +1 contre 5 000 à 1 000 000 000 : « fail to converge entirely ») |
| Post | Remède répandu : retirer la moyenne, diviser par l'écart-type ; 130 devient 1,5 | `mlcc-populaires`, `mlcc-formule`, `mlcc-exemple` | MLCC |
| Post | Chaque nouvelle maison passe par la même transformation, avec μ et σ de l'entraînement | `mlcc-prediction`, `skl-entrainement` | MLCC ; scikit-learn |
| Post | Normaliser, c'est mesurer avec son écart-type | aucun (généralisation) | voir D2 |

Fiche : aucune rubrique « à ne pas écrire » ; l'épisode suivant annoncé en page 5 (Nº 14, « Et quand une droite
ne suffit plus ? ») est celui de la fiche. Fin de post : synthèse en une phrase, après une question au Nº 12 et une
phrase de fait au Nº 11 : variété respectée.

Images : aucune image réelle (pas de dossier `assets/images/candidats/13/`) ; la couverture et la fin portent
l'illustration du gabarit.

À l'œil (planche) : lecture fluide ; outre D3, le signe « Nº » du corps de texte (encadré page 3) se lit presque
« No » à cette taille, comme au Nº 10 : propriété de la police, sans correction de contenu.

## Validation scientifique

**Page 2 (ouverture)**
- Hypothèse : modèle linéaire et coût au carré (Nº 11 et 12) ; la forme de la vallée vient des valeurs des
  caractéristiques.
- Domaine : régression linéaire entraînée par descente de gradient ; ailleurs (réseaux), la vallée dépend aussi
  du modèle.
- Contre-exemple : aucun pour cette maison ; sur tout le jeu, c'est la moyenne des carrés des valeurs qui compte,
  pas une seule maison.
- Raccourci : le dessin prend un rapport de courbures de 16, alors que 120 contre 3 donnerait 1 600 ; dit
  « dessin d'illustration » dans `contenu/13.yaml`, pas sur la page. Acceptable : une ellipse 40 fois plus longue
  que haute ne se dessine pas.

**Page 3 (comparaison)**
- Hypothèse : un seul taux d'apprentissage η pour tous les poids (descente de gradient simple).
- Domaine : descente simple ; les variantes à pas adaptatif (Adagrad, Adam, Nº 44) atténuent le problème
  (MLCC), voir D1.
- Contre-exemple : des caractéristiques liées ne donnent pas une vallée ronde après normalisation ; dit dans
  l'encadré « Presque ronde » (LeCun : « possibly reduce its eccentricity »).
- Raccourci : « même départ » est une image : normaliser change aussi les unités des poids, donc le point de
  départ réel ; assumé pour isoler l'effet de la forme.

**Page 4 (formule)**
- Hypothèse : μ et σ sont estimés sur les données d'entraînement et réutilisés tels quels.
- Domaine : MLCC conseille le Z-score pour des données à peu près en cloche ; pour des valeurs très étirées
  (lois de puissance), le passage au logarithme ; la page dit « une façon courante », sans exclusivité.
- Contre-exemple : une caractéristique constante (σ = 0) ne se divise pas ; scikit-learn ne divise que les
  caractéristiques non constantes. Cas marginal, non signalé.
- Raccourci : l'écart-type est dit « l'écart habituel entre les valeurs et leur moyenne » (c'est une moyenne
  quadratique) ; x′ est dit « nombre d'écarts-types », sans préciser qu'il est négatif sous la moyenne.
  Vocabulaire : l'épisode suit MLCC, où la standardisation est une façon de normaliser ; scikit-learn réserve
  « normalization » à la mise à norme 1 de chaque exemple (« Normalization is the process of scaling individual
  samples to have unit norm. »). Pas d'erreur, puisque le cours de référence emploie ce sens.

**Page 5 (fin)**
- Hypothèse, domaine, contre-exemple : reprend les pages 2 à 4, rien de nouveau.
- Raccourci : « bien plus » (fin) contre « davantage » (page 2) : plus fort mais exact (rapport de 40 sur la
  pente, 1 600 sur la courbure).

**Post**
- Hypothèse : descente de gradient à pas unique ; domaine et nuance des optimiseurs : voir D1 ; généralisation
  de la dernière phrase : voir D2.

Relecture écrite : sortie/13/relecture.md (0 mises en conformité, 3 décisions).
