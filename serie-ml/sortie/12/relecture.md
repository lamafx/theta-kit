# Relecture · Nº 12 · La régression linéaire multiple

**Avertissement scientifique (en tête, règle de la validation scientifique)** : un contre-exemple n'est pas traité. Le poids de la surface vaut 74 quand elle est seule (épisode 04, mêmes 2 925 ventes, mêmes unités) et 92,3 à chambres égales (ici). L'épisode ne dit pas qu'un poids dépend des autres caractéristiques retenues ; un lecteur de la série verra deux valeurs pour « le poids de la surface ». Voir D5.

## Mises en conformité (appliquées automatiquement)

### C1 · Page 2, champ `legende` : légende sous un schéma

- **Constat** : la page 2 (ouverture) porte une `legende` sous un schéma Flux (« En gris, la régression linéaire à une caractéristique ; en noir, la régression linéaire multiple. »). Le champ `legende` est réservé aux images réelles.
- **Source** : `charte/regles-redaction.md`, « Les montants et les légendes » : « Pas de légende sous un schéma (décision du 2026-10-30, A45) : le champ `legende` d'une page ne sert qu'aux images réelles ». Les étiquettes du Flux (« Une caractéristique », « Plusieurs caractéristiques ») disent déjà ce que dit la légende, et la `description` garde le gris et le noir pour l'accessibilité.
- **Avant** : `legende: "En gris, la régression linéaire à une caractéristique ; en noir, la régression linéaire multiple."`
- **Après** : ligne `legende` supprimée.
- **Règle appliquée** : A45. Si `serie verifier` signale ensuite un vide trop grand (223 px aujourd'hui, seuil 233 px), le combler par le visuel (cadre, lignes du Flux), jamais par du texte ajouté.

### C2 · Page 3, champ `texte` : chiffres non datés

- **Constat** : la formule 92,3·x₁ − 19,1·x₂ + 32,6 est calculée sur les ventes d'Ames sans que la page date ces ventes ; la source donne la période.
- **Source** : De Cock, Ames Housing Data, DataDocumentation.txt, http://jse.amstat.org/v19n3/decock/DataDocumentation.txt : « for individual residential properties sold in Ames, IA from 2006 to 2010. » (même datation qu'aux épisodes 04 et 05 : « Sur les ventes d'Ames de 2006 à 2010 »).
- **Avant** : « Chaque vente d'Ames devient un point : surface en largeur, chambres en profondeur, prix en hauteur. »
- **Après** : « Chaque vente d'Ames, de 2006 à 2010, devient un point : surface en largeur, chambres en profondeur, prix en hauteur. »
- **Règle appliquée** : « Tout chiffre est daté et sourcé » (CLAUDE.md, règles éditoriales). 43 mots au lieu de 39 (limite 55). Le vide au-dessus du pied n'est que de 42 px : si le texte passe à 5 lignes et déborde, mettre la même précision en tête du texte de la page 4 (« Sur les ventes de 2006 à 2010, à chambres égales, … »), qui a 181 px de vide.

### C3 · Texte du post (`linkedin.texte`), 3e paragraphe : période et cours de conversion absents

- **Constat** : le post donne 2 925 ventes et des montants en millions de FCFA sans dater les ventes ni dire le cours de conversion ; ni la page 3 ni le post ne disent « au cours BCEAO du … ».
- **Source** : DataDocumentation.txt (lien ci-dessus) : « from 2006 to 2010 » ; BCEAO, Cours de référence des principales devises contre Franc CFA, https://www.bceao.int/fr/cours/cours-de-reference-des-principales-devises-contre-franc-cfa, extrait `bceao-dollar` lu le 2026-10-30 : « Cours des devises du mardi 27 Octobre 2026 … Dollar us 588,3000 ». La page affiche aujourd'hui le cours du jour (« Cours des devises du mardi 10 Novembre 2026 », 584,9400), d'où la nécessité de dater le cours utilisé.
- **Avant** : « Sur les 2 925 ventes, le poids de la surface vaut 92,3 millions de FCFA par centaine de mètres carrés. Celui des chambres vaut −19,1 millions. »
- **Après** : « Sur les 2 925 ventes de 2006 à 2010, le poids de la surface vaut 92,3 millions de FCFA par centaine de mètres carrés (prix convertis au cours BCEAO du 27 octobre 2026). Celui des chambres vaut −19,1 millions. »
- **Règle appliquée** : « Les montants et les légendes » : « le texte ou le post dit « au cours BCEAO du … » » ; « Tout chiffre est daté et sourcé ». Le post est choisi plutôt que l'encadré « Les unités » de la page 3, qui n'a pas la place (42 px de vide).

## Décisions de l'utilisateur

### D1 · Page 2, champ `texte` : le produit scalaire n'est pas défini (de quoi avec quoi, et sans b)

- **Constat** : « cette somme de produits est un produit scalaire » introduit le terme sans dire entre quels vecteurs ; la phrase suit une formule qui finit par « + b », et le lecteur peut croire que ŷ entier est le produit scalaire.
- **Source vérifiée** : D2L 3.1 Linear Regression, https://d2l.ai/chapter_linear-regression/linear-regression.html : « Collecting all features into a vector … and all weights into a vector …, we can express our model compactly via the dot product between w and x », suivi de ŷ = wᵀx + b.
- **Correction proposée** :
  - Avant : « Avec plusieurs caractéristiques $x_1$, $x_2$…, chacune reçoit son poids : $ŷ$ = $w_1$·$x_1$ + $w_2$·$x_2$ + … + $b$. Les poids forment le **vecteur de poids** ; cette somme de produits est un **produit scalaire**. »
  - Après : « Chaque caractéristique $x_1$, $x_2$… reçoit son poids : $ŷ$ = $w_1$·$x_1$ + $w_2$·$x_2$ + … + $b$. Les poids forment le **vecteur de poids** ; hors $b$, c'est son **produit scalaire** avec les caractéristiques. »
  - 31 mots avec le titre (compte de `serie/verification.py`), au lieu de 32 ; limite 32.
- **Option recommandée** : la correction, parce qu'un terme introduit doit être défini complètement à sa première apparition. Autre option : garder le texte, en jugeant que « somme de produits » exclut déjà b.
- **Décision** : oui / non / autre

### D2 · Page 3, champ `texte` : la formule est coupée après le signe moins (à l'œil)

- **Constat** : sur la page rendue, la ligne 3 finit par « ŷ = 92,3·x₁ − » et « 19,1·x₂ + 32,6. » passe à la ligne 4 ; le signe se lit mal isolé de son nombre.
- **Source vérifiée** : `sortie/12/page-03.png` (rendu du 2026-11-11).
- **Correction proposée** :
  - Avant : « $ŷ$ = 92,3·$x_1$ − 19,1·$x_2$ + 32,6. »
  - Après : la même formule avec une espace insécable (U+00A0) avant et après « − » : « $ŷ$ = 92,3·$x_1$ − 19,1·$x_2$ + 32,6. », pour que « 92,3·x₁ − 19,1·x₂ » ne soit jamais coupé. À revoir après C2, qui décale déjà la coupure.
- **Option recommandée** : les insécables, sans changer un mot. Autre option : signaler dans AMBIGUITES.md que le code devrait interdire une coupure autour d'un opérateur dans une formule (session de design).
- **Décision** : oui / non / autre

### D3 · Texte du post, accroche : « à surface égale » manque aux deux premières lignes

- **Constat** : « Une chambre de plus, et le prix prédit baisse. » est vrai seulement à surface égale ; sur LinkedIn, seules les premières lignes s'affichent avant « voir plus », et la condition n'arrive qu'au 4e paragraphe.
- **Source vérifiée** : scikit-learn, Common pitfalls in the interpretation of coefficients of linear models, https://scikit-learn.org/stable/auto_examples/inspection/plot_linear_model_coefficient_interpretation.html : « Coefficients in multiple linear models represent the relationship between the given feature, X_i and the target, y, assuming that all the other features remain constant (conditional dependence). » et « This is different from plotting X_i versus y and fitting a linear relationship ».
- **Correction proposée** :
  - Avant : « Une chambre de plus, et le prix prédit baisse. »
  - Après : « À surface égale, une chambre de plus, et le prix prédit baisse. »
- **Option recommandée** : la correction : la condition fait partie de l'affirmation, et l'accroche reste surprenante. Autre option : garder l'accroche telle quelle, la nuance étant donnée plus bas.
- **Décision** : oui / non / autre

### D4 · Texte du post, 5e paragraphe : le sujet annoncé de l'épisode 13

- **Constat** : « Reste que comparer 92,3 et 19,1 n'a pas de sens … Ce sera le sujet du prochain épisode. » annonce que l'épisode 13 traitera la comparaison des poids ; la fiche 13 (« Normaliser les données ») traite la mise à l'échelle des caractéristiques et son effet sur la descente (vallée allongée, puis ronde), pas la lecture des poids.
- **Source vérifiée** : MLCC, Numerical data: Normalization, https://developers.google.com/machine-learning/crash-course/numerical-data/normalization : « The goal of normalization is to transform features to be on a similar scale. » ; fiche 13, accroche : « Mettre toutes les caractéristiques sur la même échelle. » ; fiche 12, transition : « Justement : des m² et un nombre de chambres ne sont pas à la même échelle. »
- **Correction proposée** :
  - Avant : « Ce sera le sujet du prochain épisode. »
  - Après : « Les mettre sur la même échelle, c'est le sujet du prochain épisode. »
- **Option recommandée** : la correction, qui annonce exactement le sujet de la fiche 13. Autre option : garder la phrase si l'épisode 13 doit montrer aussi des poids comparables après mise à l'échelle (scikit-learn, même page : « Coefficients must be scaled to the same unit of measure to retrieve feature importance. »), à ajouter alors à la fiche 13.
- **Décision** : oui / non / autre

### D5 · Page 4 ou texte du post : un poids change quand on ajoute une caractéristique (contre-exemple non traité)

- **Constat** : la série a donné à la surface un poids de 74 (épisode 04, `calculs.ames.droite_prix_surface()`, mêmes 2 925 ventes, mêmes unités) ; l'épisode 12 lui donne 92,3 à chambres égales, sans le dire. C'est aussi la seule preuve, dans les données, de « Surface et chambres varient ensemble » (encadré « Un poids négatif ») : aux moindres carrés, ajouter une caractéristique non liée à la surface ne changerait pas son poids. Aujourd'hui, cette phrase de l'encadré n'a pas d'extrait ni de calcul propre à Ames ; l'extrait `pieges-ensemble` porte sur AGE et EXPERIENCE.
- **Source vérifiée** : scikit-learn, Common pitfalls…, https://scikit-learn.org/stable/auto_examples/inspection/plot_linear_model_coefficient_interpretation.html, « Lessons learned » : « Coefficients in multivariate linear models represent the dependency between a given feature and the target, **conditional** on the other features. » et « Correlated features induce instabilities in the coefficients of linear models and their effects cannot be well teased apart. » ; `tests/test_ames.py` (a = 74 à l'épisode 04 ; w₁ = 92,3, w₂ = −19,1, b = 32,6, n = 2 925 à l'épisode 12).
- **Correction proposée** (dans le post, 3e paragraphe, après la phrase sur les chambres) :
  - Avant : « Celui des chambres vaut −19,1 millions. »
  - Après : « Celui des chambres vaut −19,1 millions. Seule, la surface pesait 74 millions (épisode 04) : ajouter une caractéristique change le poids des autres. »
- **Option recommandée** : le post, qui n'a pas de limite serrée et garde les pages intactes. Autre option : page 4, encadré « Un poids négatif », « Seule, la surface pesait 74 ; à chambres égales, 92,3 : les deux varient ensemble. » (à mesurer, la colonne a peu de place). Option complémentaire : ajouter à `calculs/ames.py` la corrélation surface-chambres sur les 2 925 ventes, pour sourcer « varient ensemble » par un calcul.
- **Décision** : oui / non / autre

## Contrôles automatiques (serie verifier)

Résultat : aucune erreur bloquante, 3 avertissement(s).

Avertissements :

- page 2 (ouverture) : 32 mots, proche de la limite de 32
- page 2 (ouverture) : visuel : « biais » est le terme « biais », introduit à l'épisode 26 (mot courant : vérifier le sens)
- page 3 (mécanisme) : texte : « profondeur » est le terme « profondeur », introduit à l'épisode 31 (mot courant : vérifier le sens)

Mesures :

| Page | Mots | Vide au-dessus du pied (px) |
| --- | ---: | ---: |
| 1 | 4 | 1 |
| 2 | 32 | 223 |
| 3 | 39 | 42 |
| 4 | 44 | 181 |
| 5 | 0 | 6 |

Seuil de remplissage : 233 px.

Sens vérifié pour les deux avertissements du glossaire : « Un poids, un biais » désigne le biais b de la régression linéaire, introduit à l'épisode 11 (« biais b » dans `charte/glossaire.yaml`), pas le biais de l'épisode 26 ; « profondeur » est l'axe de profondeur du dessin en perspective, pas la profondeur d'un arbre. Aucun changement nécessaire.

## Affirmations et sources

| Page | Affirmation | Extrait | Vérifiée sur |
| --- | --- | --- | --- |
| 2 | ŷ = w₁·x₁ + w₂·x₂ + … + b, un poids par caractéristique | d2l-somme, skl-formule, skl-combinaison | D2L 3.1 (ŷ = w₁x₁ + ⋯ + w_d x_d + b), https://d2l.ai/chapter_linear-regression/linear-regression.html ; scikit-learn Linear Models, https://scikit-learn.org/stable/modules/linear_model.html (« linear combination of the features ») |
| 2 | Les poids forment le vecteur de poids | skl-coef, d2l-produit-scalaire | scikit-learn : « we designate the vector w = (w_1, ..., w_p) as coef_ » ; D2L : « all weights into a vector » |
| 2 | La somme de produits est un produit scalaire | d2l-produit-scalaire | D2L : « via the dot product between w and x » (voir D1) |
| 2 | Caractéristiques en nombres (rappel) | mlcc-vecteur, mlcc-nombres | MLCC Feature vectors, https://developers.google.com/machine-learning/crash-course/numerical-data/feature-vectors (deux phrases lues mot pour mot) |
| 3 | Deux caractéristiques : la droite devient un plan | skl-deux-entrees, skl-plan | scikit-learn, section 1.1.16 : « two-dimensional data: ŷ(w, x) = w_0 + w_1 x_1 + w_2 x_2 » ; « fit a paraboloid to the data instead of a plane » |
| 3 | Le plan rend la somme des carrés des erreurs la plus petite | skl-moindres-carres | scikit-learn : « to minimize the residual sum of squares » |
| 3 | Ventes d'Ames : surface, chambres, prix | ames-ventes, ames-surface, ames-chambres, ames-prix, ames-fichier | DataDocumentation.txt, http://jse.amstat.org/v19n3/decock/DataDocumentation.txt : « Gr Liv Area (Continuous): Above grade (ground) living area square feet », « Bedroom (Discrete): Bedrooms above grade (does NOT include basement bedrooms) », « SalePrice (Continuous): Sale price $$ », « 2930 observations », « from 2006 to 2010 » ; colonnes présentes dans AmesHousing.txt |
| 3 | 2 925 ventes gardées (plus de 4 000 pieds carrés écartées) | ames-4000 | DataDocumentation.txt : « I would recommend removing any houses with more than 4000 square feet from the data set » (« these 5 unusual observations ») ; 2 930 − 5 = 2 925, `tests/test_ames.py` |
| 3, 4, post | ŷ = 92,3·x₁ − 19,1·x₂ + 32,6 | calcul | `calculs.ames.plan_prix_surface_chambres()`, vérifié par `tests/test_ames.py` (équations normales). Ordre de grandeur cohérent : 92,3 millions de FCFA par 100 m² font environ 146 dollars par pied carré au cours du 27 octobre 2026. Les paramètres du visuel recopient ces valeurs (w1, w2, b) au lieu d'appeler le calcul ; le test les garde égales. |
| 3, 4 | Montants en millions de FCFA | bceao-dollar | Page BCEAO lue le 2026-11-11 : elle n'affiche que le cours du jour (10 novembre 2026, 584,9400) ; le cours du 27 octobre (588,3000) n'est plus lisible en ligne, repris de sources/05 (lu le 2026-10-30) et de `calculs/devises.py` (voir C3) |
| 4 | Un poids se lit les autres caractéristiques fixées | pieges-autres-fixees, d2l-influence | scikit-learn, Common pitfalls, https://scikit-learn.org/stable/auto_examples/inspection/plot_linear_model_coefficient_interpretation.html : « assuming that all the other features remain constant (conditional dependence) » ; D2L : « The weights determine the influence of each feature on our prediction. » |
| 4 | Un poids négatif se lit de la même façon | pieges-baisse | Common pitfalls : « An increase of the AGE will induce a decrease of the WAGE when all other features remain constant. » |
| 4 | Surface et chambres varient ensemble, leurs effets se séparent mal | pieges-ensemble, skl-independance | Common pitfalls : « as AGE and EXPERIENCE vary together in the data, their effect is difficult to tease apart » ; scikit-learn : « The coefficient estimates for Ordinary Least Squares rely on the independence of the features. » Le cas d'Ames n'a ni extrait ni calcul (voir D5) |
| 4 | Comparer 92,3 et 19,1 n'a pas de sens (unités différentes) | pieges-unites | Common pitfalls : « we cannot compare the magnitude of different coefficients since the features have different natural scales, and hence value ranges, because of their different unit of measure » |
| 5 | Épisode suivant : Nº 13, Normaliser les données | fiche | `banque/episodes/13-normaliser-les-donnees.yaml` ; transition identique à celle de la fiche 12 |
| post | Somme pondérée plus un biais | d2l-somme, d2l-biais | D2L : « The bias determines the value of the estimate when all features are zero. » |
| post | « Un poids se lit toujours les autres caractéristiques fixées » | pieges-autres-fixees | Common pitfalls, « Lessons learned » : « conditional on the other features » ; le « toujours » est vrai pour un modèle linéaire et sourcé |
| post | Le prochain épisode traite de la comparaison des poids | fiche 13 | Voir D4 |

Fiche : pas de rubrique « à ne pas écrire » dans `banque/episodes/12-la-regression-lineaire-multiple.yaml`. L'épisode suivant annoncé (Nº 13) est celui de la fiche.

Images : aucune image réelle (pas de dossier `assets/images/candidats/12/`) ; la couverture utilise le motif Nuage plan de la bibliothèque.

Fin du post : question au lecteur. Fins des épisodes 08 à 12 : conseil (08), synthèse (09), citation (10), synthèse (11), question (12) : au plus deux demandes sur cinq, jamais deux de suite. Conforme.

Tiret long : aucun dans `contenu/12.yaml`.

## Validation scientifique

**Page 2 (ouverture)**
- Hypothèse : modèle linéaire en les caractéristiques, caractéristiques numériques.
- Domaine : dit (rappel du Nº 11, « régression linéaire »).
- Contre-exemple : une relation courbe (épisode 11, page Piège) ; non repris ici, sans gêne pour l'ouverture.
- Raccourci : « cette somme de produits est un produit scalaire » ne dit pas entre quels vecteurs ni que b est hors du produit (D1).

**Page 3 (mécanisme)**
- Hypothèse : deux caractéristiques, moindres carrés sur les 2 925 ventes gardées (plus de 4 000 pieds carrés écartées).
- Domaine : surface et chambres dites ; la période des ventes et le cours de conversion manquent (C2, C3) ; le dessin montre 70 ventes sur 2 925, dit seulement dans la description du visuel.
- Contre-exemple : avec trois caractéristiques ou plus, plus de dessin possible ; traité par l'encadré « Au-delà de deux ».
- Raccourci : « Chaque vente devient un point » alors que le dessin n'en montre que 70 : assumé, sans gêne pour le sens.

**Page 4 (lecture)**
- Hypothèse : modèle linéaire à ces deux caractéristiques ; lecture conditionnelle (« quand les autres ne bougent pas »), sur le prix prédit, pas sur le prix réel.
- Domaine : la condition est dite (« À chambres égales », « À surface égale ») ; le caractère prédit est dit (« au prix prédit »).
- Contre-exemple : le poids de la surface vaut 74 quand elle est seule (épisode 04) et 92,3 ici ; un poids dépend des caractéristiques retenues. Non traité (D5, avertissement en tête).
- Raccourci : « leurs effets se séparent mal » transpose à Ames un constat de scikit-learn sur AGE et EXPERIENCE ; à appuyer par un calcul (D5). Pas de lecture causale suggérée (« prix prédit »), ce que demande scikit-learn (« we should be careful when making conclusions about causality »).

**Page 5 (fin)**
- Rien de nouveau ; les trois points reprennent les pages 2 à 4.

**Texte du post**
- Hypothèse : la même que les pages 3 et 4.
- Domaine : la condition « à surface égale » arrive au 4e paragraphe seulement (D3) ; période et cours non dits (C3).
- Contre-exemple : comme page 4 (D5).
- Raccourci : le sujet annoncé du Nº 13 est plus large que la fiche 13 (D4).
