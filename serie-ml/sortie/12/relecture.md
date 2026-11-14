# Relecture · Nº 12 · La régression linéaire multiple

Relecture du 2026-11-14, sur la version issue du passage de compréhension (contenu du 2026-11-14 04:08). Elle remplace la relecture du 2026-11-11 : ses points C1 à C3 sont appliqués, D1 est devenu sans objet (le produit scalaire est passé à la page 3 et y est défini en mots), D2 à D5 restent ouverts et sont repris ci-dessous sous de nouveaux numéros.

**Avertissement scientifique (en tête, règle de la validation scientifique)** : un contre-exemple n'est pas traité, et une hypothèse est transposée sans vérification.

1. Un poids dépend des autres caractéristiques retenues. Sur les mêmes 2 925 ventes et dans les mêmes unités, la surface pèse 74 seule (épisode 04, `calculs.ames.droite_prix_surface()`) et 92,3 à chambres égales ; les chambres seules ont un poids positif (+7,8 millions de FCFA par chambre, calcul refait pour cette relecture, absent de `calculs/`) et −19,1 à surface égale. L'épisode ne le dit nulle part (D1, D2).
2. L'encadré « Un poids négatif » finit par « Le modèle sépare donc mal leurs deux effets. » : c'est le constat de scikit-learn sur AGE et EXPERIENCE (instabilité des poids), appliqué à Ames sans calcul. Sur Ames, la corrélation surface-chambres vaut 0,53 et les poids restent stables d'un échantillon à l'autre (w₂ entre −17,6 et −20,4 sur quatre moitiés tirées au hasard) ; le « donc » laisse croire que le poids négatif vient d'une mauvaise séparation, alors qu'il vient surtout de la lecture à surface égale (D2).

## Mises en conformité (appliquées automatiquement)

Aucune. Pas de tiret long, pas de citation entre guillemets, pas d'image ni de crédit ; les chiffres sont datés (« de 2006 à 2010 », page 3 et post) et le cours de conversion est dit et daté dans le post (« au cours de la BCEAO … du 27 octobre 2026 ») ; le seul mot absolu (« toujours », post) est vrai pour un modèle linéaire et sourcé.

## Décisions de l'utilisateur

### D1 · Texte du post, 3e paragraphe : le poids de la surface change quand on ajoute les chambres (contre-exemple non traité)

- **Constat** : le lecteur de la série a vu « 74 » pour le poids de la surface (Nº 04) et lit ici 92,3, sans explication ; c'est pourtant la preuve la plus simple, sur les données de la série, qu'un poids se lit « les autres caractéristiques fixées ».
- **Source vérifiée** : scikit-learn, *Common pitfalls in the interpretation of coefficients of linear models*, https://scikit-learn.org/stable/auto_examples/inspection/plot_linear_model_coefficient_interpretation.html : « This is different from plotting \(X_i\) versus \(y\) and fitting a linear relationship: in that case all possible values of the other features are taken into account in the estimation (marginal dependence). » ; chiffres : `calculs.ames.droite_prix_surface()` (a = 74, n = 2 925) et `calculs.ames.plan_prix_surface_chambres()` (w1 = 92,3), tous deux gardés par `tests/test_ames.py`.
- **Correction proposée** (`linkedin.texte`, 3e paragraphe ; 191 → 203 mots, limite 220) :
  - Avant : « … le poids de la surface vaut 92,3 millions de FCFA par centaine de mètres carrés ; celui des chambres, −19,1 millions. »
  - Après : « … le poids de la surface vaut 92,3 millions de FCFA par centaine de mètres carrés ; celui des chambres, −19,1 millions. Seule, la surface pesait 74 millions : ajouter les chambres change son poids. »
- **Option recommandée** : la correction dans le post, qui ne touche pas aux pages et répond à la question qu'un abonné se posera. Autre option : laisser le post tel quel et traiter le contre-exemple seulement par D2.
- **Décision** : oui / non / autre

### D2 · Page 4, encadré « Un poids négatif », champ `texte` : « Le modèle sépare donc mal leurs deux effets »

- **Constat** : la dernière phrase transpose à Ames un constat fait par scikit-learn sur d'autres données (AGE et EXPERIENCE) et en fait, par « donc », la cause du poids négatif ; sur Ames, aucun calcul de `calculs/` ne l'appuie, et le calcul refait ici montre des poids stables (voir l'avertissement en tête).
- **Source vérifiée** : scikit-learn, *Common pitfalls…*, même lien : « as AGE and EXPERIENCE vary together in the data, their effect is difficult to tease apart. » et, dans « Lessons learned », « Correlated features induce instabilities in the coefficients of linear models and their effects cannot be well teased apart. » ; pour la lecture conditionnelle : « Coefficients in multivariate linear models represent the dependency between a given feature and the target, **conditional** on the other features. »
- **Correction proposée** (encadré de 35 mots, après 36 ; la colonne de gauche a la place d'environ deux lignes de plus) :
  - Avant : « Il compare des maisons de même surface, pas une petite et une grande. Or, dans ces ventes, surface et chambres varient ensemble : l'une change souvent avec l'autre. Le modèle sépare donc mal leurs deux effets. »
  - Après : « Il compare des maisons de même surface, pas une petite et une grande. Or, dans ces ventes, surface et chambres varient ensemble : l'une change souvent avec l'autre. Sans la surface, le poids des chambres devient positif. »
  - Condition : ajouter à `calculs/ames.py` une fonction qui donne la droite du prix selon les chambres seules (pente +7,8 sur les 2 925 ventes) et, pour appuyer « varient ensemble », la corrélation surface-chambres (0,53), avec leur test ; puis `serie verifier 12`.
- **Option recommandée** : la correction, qui garde la nuance (les deux caractéristiques varient ensemble) et remplace une affirmation non vérifiée sur Ames par un fait calculé, conforme à la leçon de scikit-learn sur la dépendance conditionnelle. Autre option : garder la phrase en la rendant prudente, sans « donc » : « Leurs deux effets sont alors plus difficiles à séparer. » (constat général de scikit-learn, sans calcul nouveau).
- **Décision** : oui / non / autre

### D3 · Texte du post, accroche : « à surface égale » manque aux premières lignes

- **Constat** : « Une chambre de plus, et le prix prédit baisse. » n'est vrai qu'à surface égale ; avant « voir plus », LinkedIn n'affiche que les premières lignes, et la condition n'arrive qu'au 4e paragraphe. Le lecteur débutant risquait déjà de retenir « une chambre fait baisser le prix » (`sortie/12/comprehension.yaml`, critère « message »).
- **Source vérifiée** : scikit-learn, *Common pitfalls…*, même lien : « Coefficients in multiple linear models represent the relationship between the given feature, \(X_i\) and the target, \(y\), assuming that all the other features remain constant (conditional dependence). »
- **Correction proposée** (`linkedin.texte`, ligne 1 ; +3 mots) :
  - Avant : « Une chambre de plus, et le prix prédit baisse. »
  - Après : « À surface égale, une chambre de plus, et le prix prédit baisse. »
- **Option recommandée** : la correction : la condition fait partie de l'affirmation, et l'accroche reste surprenante. Autre option : garder l'accroche, la condition étant donnée au 4e paragraphe.
- **Décision** : oui / non / autre

### D4 · Texte du post, 5e paragraphe : le sujet annoncé du Nº 13

- **Constat** : « Reste que 92,3 et 19,1 ne se comparent pas … Ce sera le sujet du prochain épisode. » annonce que le Nº 13 traitera la comparaison des poids ; la fiche 13 (« Normaliser les données ») traite la mise à la même échelle et son effet sur la descente (vallée allongée puis ronde), pas la lecture des poids.
- **Source vérifiée** : fiche 13, `banque/episodes/13-normaliser-les-donnees.yaml`, accroche : « Mettre toutes les caractéristiques sur la même échelle. » ; fiche 12, transition : « Justement : des m² et un nombre de chambres ne sont pas à la même échelle. » ; scikit-learn, *Common pitfalls…*, « Lessons learned » : « Coefficients must be scaled to the same unit of measure to retrieve feature importance. »
- **Correction proposée** (`linkedin.texte` ; +5 mots) :
  - Avant : « Ce sera le sujet du prochain épisode. »
  - Après : « Les mettre sur la même échelle, c'est le sujet du prochain épisode. »
- **Option recommandée** : la correction, qui annonce exactement le sujet de la fiche 13. Autre option : garder la phrase si le Nº 13 doit aussi montrer des poids comparables après mise à l'échelle (à ajouter alors à la fiche 13, avec l'extrait scikit-learn ci-dessus).
- **Décision** : oui / non / autre

### D5 · Page 3, encadré « Les unités » : les chambres comptées hors sous-sol

- **Constat** : la donnée « Bedroom AbvGr » ne compte pas les chambres du sous-sol ; la page dit « les chambres » sans cette restriction, alors que la page 4 en tire « une chambre de plus ».
- **Source vérifiée** : De Cock, *Ames Housing Data*, DataDocumentation.txt, http://jse.amstat.org/v19n3/decock/DataDocumentation.txt : « Bedroom (Discrete): Bedrooms above grade (does NOT include basement bedrooms) ».
- **Correction proposée** (encadré « Les unités », 18 → 21 mots ; la colonne de gauche a trois lignes contre cinq à droite) :
  - Avant : « La surface en centaines de m², les chambres à l'unité, le prix prédit $ŷ$ en millions de FCFA. »
  - Après : « La surface en centaines de m², les chambres (hors sous-sol) à l'unité, le prix prédit $ŷ$ en millions de FCFA. »
- **Option recommandée** : la correction, qui dit le domaine de la donnée pour trois mots. Autre option : ne rien changer, la restriction étant secondaire pour le message (la surface, elle aussi « above grade », n'a jamais été précisée dans la série).
- **Décision** : oui / non / autre

### D6 · Page 3, champ `texte` : la formule est coupée après « + » (à l'œil)

- **Constat** : sur `sortie/12/page-03.png`, la ligne 4 finit par « ŷ = 92,3·x₁ − 19,1·x₂ + » et « 32,6, avec x₁ la surface… » passe à la ligne 5 : le biais est séparé de sa formule.
- **Source vérifiée** : `sortie/12/page-03.png` et `sortie/12/planche.png` (rendu du 2026-11-14).
- **Correction proposée** :
  - Avant : « $ŷ$ = 92,3·$x_1$ − 19,1·$x_2$ + 32,6, »
  - Après : la même formule avec une espace insécable (U+00A0) avant et après « − » et « + », pour que « 92,3·x₁ − 19,1·x₂ + 32,6 » ne soit jamais coupé ; vérifier ensuite que la page 3 tient (55 mots, 9 px de vide au-dessus du pied).
- **Option recommandée** : les insécables, sans changer un mot. Autre option : noter dans AMBIGUITES.md que le rendu devrait interdire une coupure autour d'un opérateur dans une formule (session de design).
- **Décision** : oui / non / autre

### D7 · Page 5 : l'encadré « Vérifiez-vous » touche presque le point 03 (à l'œil)

- **Constat** : le point 03 occupe quatre lignes et l'encadré « Vérifiez-vous » commence une dizaine de pixels sous « même unité. » ; la page paraît serrée à cet endroit.
- **Source vérifiée** : `sortie/12/page-05.png` (rendu du 2026-11-14).
- **Correction proposée** : aucune dans le texte (le point 03 a été allongé exprès au passage de compréhension pour ne pas être télégraphique) ; ajouter à AMBIGUITES.md : « Page de fin : garder un écart minimal entre le dernier point et l'encadré Vérifiez-vous » (gabarit, session de design).
- **Option recommandée** : la note dans AMBIGUITES.md, sans toucher au texte. Autre option : raccourcir le point 1 (deux lignes) pour gagner une ligne, par exemple « Chaque caractéristique reçoit son poids : c'est le **vecteur de poids**. ».
- **Décision** : oui / non / autre

## Contrôles automatiques (serie verifier)

Résultat : aucune erreur bloquante, 5 avertissement(s).

Avertissements :

- page 2 (ouverture) : 32 mots, proche de la limite de 32
- page 3 (mécanisme) : 55 mots, proche de la limite de 55
- page 2 (ouverture) : visuel : « biais » est le terme « biais », introduit à l'épisode 26 (mot courant : vérifier le sens)
- page 2 (ouverture) : visuel : « biais » est le terme « biais », introduit à l'épisode 26 (mot courant : vérifier le sens)
- page 3 (mécanisme) : texte : « profondeur » est le terme « profondeur », introduit à l'épisode 31 (mot courant : vérifier le sens)

Mesures :

| Page | Mots | Vide au-dessus du pied (px) |
| --- | ---: | ---: |
| 1 | 4 | 1 |
| 2 | 32 | 150 |
| 3 | 55 | 9 |
| 4 | 47 | 86 |
| 5 | 0 | 6 |

Seuil de remplissage : 233 px.

Sens vérifié pour les avertissements du glossaire : « Un poids, un biais » et « Deux poids, un biais » désignent le biais $b$ de la régression linéaire (« biais b », introduit à l'épisode 11 dans `charte/glossaire.yaml`), pas le biais de l'épisode 26 ; « profondeur » est l'axe de profondeur du dessin en perspective, pas la profondeur d'un arbre. Aucun changement nécessaire.

## Affirmations et sources

| Page | Affirmation | Extrait | Vérifiée sur |
| --- | --- | --- | --- |
| 2 | Rappel : Nº 11, ŷ = w·x + b | (Nº 11) | `contenu/11.yaml`, page 2 : « $ŷ$ = $w$·$x$ + $b$ » |
| 2 | Le prix prédit dépend de plusieurs caractéristiques, un poids pour chacune : ŷ = w₁·x₁ + w₂·x₂ + … + b | skl-combinaison, skl-formule, d2l-somme | scikit-learn, *Linear Models*, https://scikit-learn.org/stable/modules/linear_model.html : « the target value is expected to be a linear combination of the features », ŷ(w, x) = w₀ + w₁x₁ + … + w_p x_p ; D2L 3.1, https://d2l.ai/chapter_linear-regression/linear-regression.html : ŷ = w₁x₁ + ⋯ + w_d x_d + b (lus le 2026-11-14) |
| 2 | Les poids forment le vecteur de poids | skl-coef, d2l-produit-scalaire | scikit-learn : « we designate the vector \(w = (w_1, ..., w_p)\) as coef_ » ; D2L : « all weights into a vector », « the weight vector » |
| 2 | x₁ la surface, x₂ les chambres : des nombres | mlcc-vecteur, mlcc-nombres | MLCC, *Feature vectors*, https://developers.google.com/machine-learning/crash-course/numerical-data/feature-vectors : « Every value in a feature vector must be a floating-point value. » (mot pour mot) |
| 3 | Ventes d'Ames (Iowa), 2006 à 2010 | ames-ventes | De Cock (2011), http://jse.amstat.org/v19n3/decock.pdf (texte extrait du PDF le 2026-11-14) : « the sale of individual residential property in Ames, Iowa from 2006 to 2010. The data set contains 2930 observations » |
| 3 | Surface, chambres, prix | ames-surface, ames-chambres, ames-prix, ames-fichier | DataDocumentation.txt, http://jse.amstat.org/v19n3/decock/DataDocumentation.txt : « Gr Liv Area (Continuous): Above grade (ground) living area square feet », « Bedroom (Discrete): Bedrooms above grade (does NOT include basement bedrooms) », « SalePrice (Continuous): Sale price $$ » (voir D5) |
| 3 | Deux caractéristiques : la droite devient un plan | skl-deux-entrees, skl-plan | scikit-learn : « a model that looks like this for two-dimensional data: ŷ(w, x) = w₀ + w₁x₁ + w₂x₂ » ; « If we want to fit a paraboloid to the data instead of a plane » |
| 3 | Les pointillés sont les erreurs ; le plan rend la somme de leurs carrés la plus petite | skl-moindres-carres | scikit-learn : « to minimize the residual sum of squares between the observed targets in the dataset, and the targets predicted by the linear approximation » |
| 3, 4, post | ŷ = 92,3·x₁ − 19,1·x₂ + 32,6 sur 2 925 ventes | calcul, ames-4000 | `calculs.ames.plan_prix_surface_chambres()` relancé le 2026-11-14 : {w1: 92,3, w2: −19,1, b: 32,6, n: 2 925} ; 2 930 − 5 = 2 925, De Cock : « I would recommend removing any houses with more than 4000 square feet from the data set (which eliminates these five unusual observations) ». Ordre de grandeur : 92,3 millions de FCFA par 100 m² font environ 146 dollars par pied carré au cours du 27 octobre 2026 |
| 3 | Multiplier chaque poids par sa caractéristique puis additionner : produit scalaire | d2l-produit-scalaire | D2L : « Collecting all features into a vector … we can express our model compactly via the dot product between w and x », puis ŷ = wᵀx + b (le biais hors du produit, comme le dit l'encadré) |
| 3, 4, post | Montants en millions de FCFA, cours BCEAO du 27 octobre 2026 | bceao-dollar | Page BCEAO, https://www.bceao.int/fr/cours/cours-de-reference-des-principales-devises-contre-franc-cfa, lue le 2026-11-14 : elle n'affiche que le cours du jour (« Cours des devises du vendredi 13 Novembre 2026 », « Dollar us 593,5200 ») ; le cours du 27 octobre (588,3000) n'est plus lisible en ligne, il est repris de sources/05 (lu le 2026-10-30) et de `calculs/devises.py` |
| 4 | Un poids se lit quand les autres caractéristiques ne bougent pas | pieges-autres-fixees, d2l-influence | scikit-learn, *Common pitfalls…*, https://scikit-learn.org/stable/auto_examples/inspection/plot_linear_model_coefficient_interpretation.html : « assuming that all the other features remain constant (conditional dependence) » ; D2L : « The weights determine the influence of each feature on our prediction. » |
| 4 | Un poids négatif fait baisser le prix prédit, à surface égale | pieges-baisse | *Common pitfalls…* : « An increase of the AGE will induce a decrease of the WAGE when all other features remain constant. » |
| 4 | Dans ces ventes, surface et chambres varient ensemble ; le modèle sépare donc mal leurs effets | pieges-ensemble, skl-independance | *Common pitfalls…* : « as AGE and EXPERIENCE vary together in the data, their effect is difficult to tease apart » ; scikit-learn : « The coefficient estimates for Ordinary Least Squares rely on the independence of the features. » Aucun extrait ni calcul propre à Ames ; corrélation 0,53 et poids stables d'après un calcul de relecture (voir D2) |
| 4, 5, post | Comparer 92,3 et 19,1 n'a pas de sens : unités différentes | pieges-unites | *Common pitfalls…* : « we cannot compare the magnitude of different coefficients since the features have different natural scales, and hence value ranges, because of their different unit of measure. » |
| 5 | Épisode suivant : Nº 13, Normaliser les données | fiche | `banque/episodes/13-normaliser-les-donnees.yaml` ; transition identique à celle de la fiche 12 |
| post | Chaque caractéristique multipliée par son poids, plus un nombre fixe, le biais | d2l-somme, d2l-biais | D2L : « The bias determines the value of the estimate when all features are zero. » |
| post | « Un poids se lit toujours ainsi, les autres caractéristiques fixées » | pieges-autres-fixees | *Common pitfalls…*, « Lessons learned » : « Coefficients in multivariate linear models represent the dependency between a given feature and the target, **conditional** on the other features. » Le « toujours » est vrai pour un modèle linéaire sans interaction, ce qu'est celui de l'épisode |
| post | Le prochain épisode traite de la comparaison des poids | fiche 13 | Voir D4 |

Fiche : pas de rubrique « à ne pas écrire » dans `banque/episodes/12-la-regression-lineaire-multiple.yaml`. L'épisode suivant annoncé (Nº 13) est celui de la fiche.

Images : aucune image réelle (pas de dossier `assets/images/candidats/12/`) ; la couverture utilise le motif Nuage (plan) de la bibliothèque.

Fin du post : question au lecteur. Fins des épisodes 08 à 12 : conseil (08), synthèse (09), citation (10), synthèse (11), question (12) : au plus deux demandes sur cinq, jamais deux de suite. Conforme.

Tiret long : aucun dans `contenu/12.yaml`.

À l'œil (planche) : pages lisibles, pas de débordement. Deux gênes, traitées en D6 (formule coupée, page 3) et D7 (page 5 serrée). Sur le dessin de la page 3, peu de pointillés sont visibles parce que beaucoup de points sont proches du plan ; le texte « Les pointillés sont les erreurs » reste juste.

## Validation scientifique

**Page 2 (ouverture)**
- Hypothèse : modèle linéaire en les caractéristiques, caractéristiques numériques.
- Domaine : dit (rappel du Nº 11, « régression linéaire », et formule écrite).
- Contre-exemple : une relation courbe (Nº 11) ; hors du sujet de l'ouverture.
- Raccourci : « $x_1$ la surface, $x_2$ les chambres… » donne l'exemple de la série pour des indices généraux ; assumé et clair.

**Page 3 (mécanisme)**
- Hypothèse : deux caractéristiques, moindres carrés sur les 2 925 ventes gardées (5 maisons de plus de 4 000 pieds carrés écartées), chambres hors sous-sol.
- Domaine : lieu, période et caractéristiques dits ; les 5 ventes écartées ne sont pas dites (écart de 5 sur 2 930, sans effet sur le message) ; « hors sous-sol » non dit (D5).
- Contre-exemple : au-delà de deux caractéristiques, plus de dessin ; traité par l'encadré « Au-delà de deux ».
- Raccourci : « Chaque vente devient un point » alors que le dessin en montre 70 : assumé, la description du visuel le dit.

**Page 4 (lecture)**
- Hypothèse : modèle linéaire à ces deux caractéristiques ; lecture conditionnelle, sur le prix prédit et non le prix réel.
- Domaine : la condition est dite (« À chambres égales », « À surface égale », titre) ; le prix est dit « prédit », sans lecture causale, comme le demande scikit-learn (« we should be careful when making conclusions about causality »).
- Contre-exemple : un poids change quand on ajoute ou retire une caractéristique (surface : 74 seule, 92,3 avec les chambres ; chambres : +7,8 seules, −19,1 avec la surface). Non traité : avertissement en tête, D1 et D2.
- Raccourci : « Le modèle sépare donc mal leurs deux effets » transpose à Ames un constat fait sur d'autres données, sans calcul, et le présente comme la cause du poids négatif (D2).

**Page 5 (fin)**
- Rien de nouveau : les trois points reprennent les pages 2 à 4 ; la question « Vérifiez-vous » renvoie à la page 4, qui y répond.

**Texte du post**
- Hypothèse : la même que les pages 3 et 4.
- Domaine : période et cours dits ; la condition « à surface égale » n'arrive qu'au 4e paragraphe (D3).
- Contre-exemple : comme page 4 (D1).
- Raccourci : le sujet annoncé du Nº 13 est plus étroit que la fiche 13 (D4).
