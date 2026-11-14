# Relecture · Nº 11 · La régression linéaire

Relue le 2026-11-14. Avertissement scientifique en tête : le texte du post généralise la descente de gradient à
« la plupart des modèles qui suivront » sans traiter le contre-exemple des arbres de décision et des k plus proches
voisins de la série (voir D1).

## Mises en conformité (appliquées automatiquement)

### C1 · Post, `linkedin.texte`, 3e paragraphe : chiffre non daté

- **Constat** : « 2 925 ventes d'Ames » n'est ni daté ni situé, alors que la source donne la période (règle : tout
  chiffre est daté). L'épisode 12 écrit déjà « de 2006 à 2010 ».
- **Source vérifiée** : De Cock (2011), *Ames, Iowa: Alternative to the Boston Housing Data as an End of Semester
  Regression Project*, http://jse.amstat.org/v19n3/decock.pdf (PDF lu le 2026-11-14) : « the sale of individual
  residential property in Ames, Iowa from 2006 to 2010. The data set contains 2930 observations » ; 2 930 moins les
  5 maisons de plus de 4 000 pieds carrés écartées = 2 925 (recalculé avec `calculs/ames.py`).
- **Avant** : « Sur les 2 925 ventes d'Ames, elle retrouve après 1 000 itérations la droite que la formule donne d'un coup. »
- **Après** : « Sur les 2 925 ventes de maisons d'Ames, dans l'Iowa, de 2006 à 2010, elle retrouve après 1 000 itérations la droite que la formule donne d'un coup. »
- **Règle appliquée** : CLAUDE.md, règles éditoriales Théta, « Tout chiffre est daté et sourcé ».

### C2 · Post, `linkedin.texte`, 3e paragraphe : cours de conversion non dit

- **Constat** : les pages 2 et 4 publient des montants en FCFA (axe « prix (millions de FCFA) », $w$ = 57,5 ou 72,2,
  $J$ = 13 400) convertis depuis des dollars, mais ni le texte des pages ni le post ne disent « au cours BCEAO du … ».
  Les pages 2 (32 mots, limite atteinte) et 4 (28 px de vide) n'ont pas la place : le post la porte, comme à l'épisode 12.
- **Source vérifiée** : extrait `bceao-dollar` (sources/11, repris de sources/05, lu le 2026-10-30) : « Cours des
  devises du mardi 27 Octobre 2026 … Dollar us 588,3000 » ; https://www.bceao.int/fr/cours/cours-de-reference-des-principales-devises-contre-franc-cfa
  n'affiche que le cours du jour, le cours du 27 n'y est plus lisible le 2026-11-14 ; valeur conforme à
  `calculs/devises.py`. De Cock, DataDocumentation.txt : « SalePrice (Continuous): Sale price $$ ».
- **Avant** : « … la droite que la formule donne d'un coup. » (fin du 3e paragraphe, après C1)
- **Après** : « … la droite que la formule donne d'un coup. Les prix du carrousel sont convertis en FCFA au cours BCEAO du 27 octobre 2026. »
- **Règle appliquée** : charte/regles-redaction.md, « Les montants et les légendes » : « le texte ou le post dit
  « au cours BCEAO du … » ».

## Décisions de l'utilisateur

### D1 · Post, `linkedin.texte`, 4e paragraphe : « Il ne leur reste que la boucle »

- **Constat** : la phrase dit que tous les modèles sans formule directe n'ont que la descente de gradient. C'est faux
  pour plusieurs modèles de la série : les k plus proches voisins (ép. 30) ne s'entraînent pas, les arbres de décision
  (ép. 31) choisissent leurs coupures une à une, sans gradient. D2L, la source, ne parle que des modèles de son propre
  livre (surtout des réseaux de neurones) et dit « often », pas « only ». Contre-exemple non traité : désaccord, pas
  mise en conformité.
- **Sources vérifiées** :
  - D2L 3.1, *Linear Regression*, https://d2l.ai/chapter_linear-regression/linear-regression.html : « we can still
    often train models effectively in practice » ; « The key technique for optimizing nearly every deep learning model ».
  - scikit-learn, *1.6 Nearest Neighbors*, https://scikit-learn.org/stable/modules/neighbors.html : « it does not
    attempt to construct a general internal model, but simply stores instances of the training data. »
  - scikit-learn, *1.10 Decision Trees*, https://scikit-learn.org/stable/modules/tree.html : « CART constructs binary
    trees using the feature and threshold that yield the largest information gain at each node. »
- **Correction proposée** :
  - Avant : « La plupart des modèles qui suivront n'ont pas de formule de ce genre. Il ne leur reste que la boucle : mesurer le coût, lire le gradient, faire un pas. »
  - Après (option A) : « La plupart des modèles qui suivront n'ont pas de formule de ce genre. Pour beaucoup d'entre eux, il reste la boucle : mesurer le coût, lire le gradient, faire un pas. »
  - Après (option B) : « La plupart des modèles qui suivront n'ont pas de formule de ce genre. Pour beaucoup d'entre eux, la boucle devient la méthode courante : mesurer le coût, lire le gradient, faire un pas. »
- **Option recommandée** : A, qui garde le rythme du post et ne promet plus la boucle à tous les modèles ; B si vous
  préférez reprendre le « often » de D2L plus fidèlement.
- **Décision** : oui / non / autre

### D2 · Page 6 (piège), `texte` : l'hypothèse « une seule entrée, telle quelle » n'est pas dite

- **Constat** : « La régression linéaire suppose une relation à peu près en ligne droite » est vrai avec l'entrée $x$
  telle quelle. Mais scikit-learn rappelle qu'un modèle linéaire peut s'entraîner sur des fonctions non linéaires des
  données : c'est ce que fera l'épisode 14 (régression polynomiale), qui reste une régression linéaire. Sans précision,
  l'épisode 14 paraîtra contredire celui-ci.
- **Sources vérifiées** :
  - D2L 3.1, https://d2l.ai/chapter_linear-regression/linear-regression.html : « we assume that the relationship
    between features x and target y is approximately linear ».
  - scikit-learn, *1.1 Linear Models*, https://scikit-learn.org/stable/modules/linear_model.html : « One common pattern
    within machine learning is to use linear models trained on nonlinear functions of the data. »
- **Correction proposée** :
  - Avant : « La régression linéaire suppose une relation à peu près en ligne droite. »
  - Après : « Avec la seule entrée $x$, la régression linéaire suppose une relation à peu près en ligne droite. »
  (40 → 44 mots, sous la limite de 55 ; 117 px de vide sur la page ; « entrée $x$ » figure déjà sur l'axe.)
- **Option recommandée** : oui, pour poser le domaine de validité et préparer l'épisode 14 ; autre option : laisser
  la page et faire porter la nuance par l'épisode 14.
- **Décision** : oui / non / autre

### D3 · Page 3 (mécanisme), `texte` : un seul critère d'arrêt, alors que les pages 4 et le post en utilisent un autre

- **Constat** : « Il s'arrête quand le coût ne baisse plus » reprend MLCC, mais la page 4 s'arrête à 10 et 100
  itérations, le post à 1 000, et D2L dit que la descente n'atteint en général pas exactement le creux en un nombre
  fini de pas (le coût continue donc de baisser un peu). Les deux sources donnent deux critères.
- **Sources vérifiées** :
  - MLCC, *Linear regression: Gradient descent*, https://developers.google.com/machine-learning/crash-course/linear-regression/gradient-descent :
    « Return to step one and repeat the process until the model can't reduce the loss any further. » et
    « gradient descent has found the weights and bias that nearly minimize the loss. »
  - D2L 3.1, https://d2l.ai/chapter_linear-regression/linear-regression.html : « After training for some
    predetermined number of iterations (or until some other stopping criterion is met) » ; « Although the algorithm
    converges slowly towards the minimizers it typically will not find them exactly in a finite number of steps. »
- **Correction proposée** :
  - Avant : « Il s'arrête quand le coût ne baisse plus. »
  - Après (option A) : « Il s'arrête quand le coût ne baisse presque plus, ou après un nombre d'itérations fixé d'avance. » (41 → 49 mots)
  - Après (option B) : « Il s'arrête quand le coût ne baisse presque plus. » (41 → 42 mots)
- **Option recommandée** : A, qui annonce les arrêts à 10, 100 et 1 000 itérations de la page 4 et du post ; B si la
  ligne de plus déborde (82 px de vide sur la page).
- **Décision** : oui / non / autre

### D4 · Post, `linkedin.texte`, 2e paragraphe : ce que Legendre et Gauss ont publié

- **Constat** : « Elle remonte au début du XIXe siècle, avec Legendre en 1805 et Gauss en 1809 » suit D2L (cours),
  mais la source originale montre que Legendre publie la méthode des moindres carrés (le principe du calcul), pas
  « la régression linéaire » sous ce nom ; Gauss la publie en 1809 en disant l'employer depuis 1795. Raccourci
  défendable, simplement moins exact que la source originale.
- **Sources vérifiées** :
  - D2L 3.1, https://d2l.ai/chapter_linear-regression/linear-regression.html : « Dating back to the dawn of the 19th
    century (Gauss, 1809, Legendre, 1805) ».
  - University of York, History of Statistics, *Legendre, On Least Squares* (trad. Ruger et Walker, D. E. Smith,
    *A Source Book in Mathematics*, 1929), https://www.york.ac.uk/depts/maths/histstat/legendre.htm : la méthode
    « appeared as an appendix entitled "Sur la Méthode des moindres quarrés" » de *Nouvelles méthodes pour la
    détermination des orbites des comètes*, Paris 1805.
- **Correction proposée** :
  - Avant : « Elle remonte au début du XIXe siècle, avec Legendre en 1805 et Gauss en 1809. »
  - Après : « Son principe remonte au début du XIXe siècle : Legendre le publie en 1805, Gauss en 1809. »
  (sans « moindres carrés », terme non introduit au glossaire)
- **Option recommandée** : oui, la date et les auteurs suivent alors la source originale (règle « Source originale :
  pour la date et le nom des auteurs ») ; non est acceptable, D2L le dit ainsi.
- **Décision** : oui / non / autre

### D5 · Page 2 (ouverture), `texte` et visuel : formule coupée et étiquette posée sur un point

- **Constat** : à l'œil, la formule du `texte` est coupée en fin de ligne (« $ŷ$ = $w$·$x$ » / « + $b$ ») ; dans le
  nuage, l'étiquette « ŷ = w·x + b » est traversée par un point noir (sur le « x »). Les deux gênent la lecture de
  la formule centrale de l'épisode.
- **Source vérifiée** : rendu `sortie/11/page-02.png` (aucune source web en jeu).
- **Correction proposée** :
  - `texte`, avant : « Avec la seule surface, la **régression linéaire** prédit $ŷ$ = $w$·$x$ + $b$. »
  - `texte`, après : « La **régression linéaire** prédit, avec la seule surface, $ŷ$ = $w$·$x$ + $b$. » (même nombre de
    mots, 32 ; à vérifier au rendu que la formule tient sur une ligne)
  - visuel, avant : `decalage: [-150, -24]` ; après : un décalage qui pose l'étiquette dans le vide sous la droite, à
    droite (par exemple `decalage: [-60, 60]`), à vérifier au rendu.
- **Option recommandée** : oui aux deux, puis relancer `serie rendre 11` ; autre option : demander en session de
  design (AMBIGUITES.md) que les formules en ligne ne soient jamais coupées.
- **Décision** : oui / non / autre

### D6 · Pages 5 et 6 : deux gênes de rendu qui relèvent du gabarit

- **Constat** : page 5, l'indice de $∇_w J$ et $∇_b J$ touche le $J$ (dans le `panneau` comme dans les `lignes`),
  ce qui se lit mal ; page 6, le pointillé d'écart traverse le mot « écart ». Ni l'un ni l'autre ne se corrige dans
  `contenu/11.yaml` sans changer le sens.
- **Source vérifiée** : rendus `sortie/11/page-05.png` et `sortie/11/page-06.png`.
- **Correction proposée** : avant : aucune mention ; après : une entrée dans AMBIGUITES.md pour la prochaine session
  de design (« espacer l'indice de ∇ ; écarter l'étiquette "écart" de son pointillé »).
- **Option recommandée** : oui, le contenu est juste et la page reste lisible en attendant ; autre option : publier
  tel quel sans entrée.
- **Décision** : oui / non / autre

## Contrôles automatiques (serie verifier)

Résultat : aucune erreur bloquante, 4 avertissement(s).

- page 2 (ouverture) : 32 mots, proche de la limite de 32
- page 2 (ouverture) : texte : « biais » est le terme « biais », introduit à l'épisode 26 (mot courant : vérifier le sens)
- page 5 (formule) : ligne 4 : « biais » est le terme « biais », introduit à l'épisode 26 (mot courant : vérifier le sens)
- page 7 (fin) : point 1 : « biais » est le terme « biais », introduit à l'épisode 26 (mot courant : vérifier le sens)

(Sens vérifié par le relecteur : dans les trois cas, il s'agit du « biais $b$ » introduit par cet épisode, pas du
biais du compromis biais-variance de l'épisode 26.)

## Affirmations et sources

| Page | Affirmation | Extrait | Vérifiée sur |
| --- | --- | --- | --- |
| 2 | Avec la seule surface, la régression linéaire prédit ŷ = w·x + b | d2l-une-variable, d2l-exemple-maisons | D2L 3.1 (lue le 2026-11-14) |
| 2 | Le poids règle l'influence, le biais la prédiction à surface nulle | d2l-influence, d2l-poids-biais | D2L 3.1 : « The weights determine the influence of each feature on our prediction. » |
| 2 | L'ajustement choisit w et b | d2l-objectif, d2l-ajustement | D2L 3.1 |
| 2 | Nuage : ventes réelles d'Ames, prix en millions de FCFA | ames-ventes, ames-4000, ames-prix, bceao-dollar | De Cock (2011), PDF JSE ; cours BCEAO non relisible (voir C2) |
| 3 | Départ au hasard, près de zéro | mlcc-hasard, d2l-initialiser | MLCC : « The model begins training with randomized weights and biases near zero » ; D2L : « typically at random » |
| 3 | Boucle : coût, gradient, pas | mlcc-perte, mlcc-direction, mlcc-pas | MLCC (les trois étapes lues mot pour mot) |
| 3 | Arrêt quand le coût ne baisse plus | mlcc-boucle | MLCC ; D2L donne un autre critère (D3) |
| 3 | C'est la descente de gradient avec la MSE | d2l-descente, mlcc-mse | D2L 3.1, MLCC |
| 4 | J = 13 400 ; w = 57,5, b = 27,9, J = 1 085 ; w = 72,2, b = 6,1, J = 1 030 (η = 0,2) | calcul | `calculs/ames.descente_droite` relancé : valeurs identiques ; creux exact w = 73,6, b = 4,0 |
| 4 | La descente approche du creux sans forcément l'atteindre | d2l-lentement | D2L : « typically will not find them exactly in a finite number of steps » |
| 4 | J ne tombe pas à zéro : aucune droite ne passe par toutes les ventes | d2l-pas-exact | D2L 3.1 ; coût au creux = 1 030 > 0 (calcul) |
| 4 | La droite grise est le creux de la MSE | skl-moindres-carres, mlcc-convexe | scikit-learn 1.1.1 (mot pour mot) ; MLCC : « The loss functions for linear models always produce a convex surface. » (la page MLCC a reformulé l'extrait gardé) |
| 5 | ∇_w J = (2/n) Σ (ŷ_i − y_i)·x_i ; ∇_b J sans le facteur x | mlcc-derivee-poids, mlcc-derivee-biais | MLCC (formules relues) |
| 5 | Une formule directe donne aussi le creux | d2l-analytique | D2L : « we can find the optimal parameters … analytically » |
| 5 | La plupart des modèles suivants n'en ont pas | d2l-analytique | D2L : « Unlike most of the models that we will cover » (vrai aussi pour la série : régressions logistique, réseaux ; les ép. 12 et 14 en ont une) |
| 6 | Hypothèse d'une relation à peu près en ligne droite | d2l-hypothese-lineaire, skl-combinaison | D2L, scikit-learn (voir D2) |
| 6 | Écarts au-dessus aux deux bouts, en dessous au milieu | calcul (points d'illustration) | rendu page-06.png : conforme |
| 6 | Un prochain épisode reprend ce cas | skl-non-lineaire | scikit-learn ; fiche 14 « La régression polynomiale » |
| 7 | Épisode suivant : Nº 12, « Le prix ne dépend pas que de la surface » | fiche 11, `episode_suivant` | fiche 11 et fiche 12 (titre « La régression linéaire multiple ») |
| Post | Legendre en 1805, Gauss en 1809 | d2l-date | D2L ; York, *Legendre, On Least Squares* (voir D4) |
| Post | Une formule donne directement les meilleurs réglages | d2l-analytique | D2L 3.1 |
| Post | 2 925 ventes d'Ames ; 1 000 itérations retrouvent la droite de la formule | ames-ventes, ames-4000, calcul | De Cock (2011) ; calcul : à 1 000 itérations w = 73,6, b = 4,0, égaux au dixième au creux exact (73,60 ; 3,98) |
| Post | La plupart des modèles qui suivront n'ont pas de formule ; il ne leur reste que la boucle | d2l-analytique | D2L ; contredit par scikit-learn (k plus proches voisins, arbres) : voir D1 |

Images réelles : aucune (pas de dossier `assets/images/candidats/11/`) ; couverture et robot de la page 7 viennent
des gabarits.

À ne pas écrire : la fiche 11 n'a pas de rubrique « à ne pas écrire » ; rien à contrôler. Pas de tiret long.

## Validation scientifique

**Page 2 (ouverture)**
- Hypothèse : une seule caractéristique (la surface), modèle affine.
- Domaine : dit (« Avec la seule surface »).
- Contre-exemple : aucun pour la définition ; le biais n'a pas de sens physique à surface nulle (D2L le dit), non traité ici mais déjà vu à l'épisode 04.
- Raccourci : assumé (cas d = 1 de D2L ; plusieurs caractéristiques à l'épisode 12).

**Page 3 (mécanisme)**
- Hypothèse : descente de gradient sur toutes les ventes, η bien choisi.
- Domaine : η n'est pas dit ici mais l'est page 4 (0,2).
- Contre-exemple : avec un η trop grand, le coût monte au lieu de baisser (épisode 08) ; le critère d'arrêt n'est jamais exactement atteint (D3).
- Raccourci : « tirés au hasard » contre « fixé à 0 » page 4 : assumé et dit page 4.

**Page 4 (comparaison)**
- Hypothèse : départ w = b = 0, η = 0,2, toutes les ventes gardées (les 120 points ne sont que dessinés).
- Domaine : dit (« Mêmes ventes, même η = 0,2 », départ fixé).
- Contre-exemple : aucun ; un seul creux car la MSE d'une droite est convexe (MLCC) et les surfaces ne sont pas toutes égales (condition de D2L).
- Raccourci : « Presque au creux » assumé et nuancé par l'encadré.

**Page 5 (formule)**
- Hypothèse : coût = MSE sans facteur 1/2 (MLCC, épisode 05) ; D2L met un 1/2 et perd le 2.
- Domaine : cohérent avec l'épisode 05 ; la différence avec D2L n'est pas dite, sans effet sur le lecteur.
- Contre-exemple : « La plupart des modèles suivants n'en ont pas » : les épisodes 12 et 14 en ont une, mais « la plupart » reste vrai sur la série.
- Raccourci : ∇_b J décrit en mots, pas écrit ; assumé.

**Page 6 (piège)**
- Hypothèse : entrée x prise telle quelle.
- Domaine : non dit (D2).
- Contre-exemple : une régression linéaire sur x et x² suit une relation courbe (scikit-learn, épisode 14).
- Raccourci : points d'illustration, non tirés d'Ames ; les axes génériques le laissent voir.

**Page 7 (fin)** : rien de nouveau ; la question renvoie bien à la page 4.

**Post**
- Hypothèse : une droite, une entrée, toutes les ventes, η = 0,2 (non dit dans le post, sans effet sur l'idée).
- Domaine : « Pour une droite » dit.
- Contre-exemple : k plus proches voisins et arbres de décision, sans boucle de gradient (D1).
- Raccourci : « remonte à Legendre et Gauss » (D4).
