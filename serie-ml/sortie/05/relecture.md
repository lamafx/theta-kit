# Relecture · Nº 05 · La fonction de coût

Relu le 2026-11-01, après la session de design n° 2 (limites de 32 et 55 mots, ligne de légende J retirée en page 4,
nouvelle couverture). Cette relecture remplace la précédente. Les décisions déjà tranchées ne sont pas rouvertes ; le
titre de couverture est un choix de l'utilisateur, l'accroche de couverture est celle de la fiche.

Comparaison faite avec la version du commit e57677b, lue sur les aperçus `publier/05/apercus/page-0X.png` (rendus avant
la session) et sur la relecture précédente, qui citait les textes mot pour mot. Mots comptés comme `compter_mots`
(`serie/verification.py`) : titre + texte, découpage aux espaces, la ponctuation isolée ne compte pas.

## Nuances après le resserrement : bilan

| Page | Ce qui a été retiré | Nuance scientifique perdue ? |
| --- | --- | --- |
| 2 | « Juger une droite, c'est regarder toutes ses erreurs. » | Non. Le signe de la série, l'usage inverse (y − ŷ) et la « distance verticale » sont gardés. On perd une transition vers la page 3 ; l'idée « toutes les erreurs » reste en page 4 (« On additionne les carrés des erreurs ») et dans le post. |
| 3 | « Les trois maisons de l'épisode 02, la droite de l'épisode 04 » ; « Ici » | Pas de nuance de fond : le cas reste limité aux « trois prédictions » du tableau. Mais la page ne dit plus quel modèle a produit les prédictions (65, 148, 82 viennent de a = 74, b = 4) : le lecteur peut croire qu'elles viennent de la droite d'illustration de la page 2. Le fil rouge (décision du 2026-10-30) n'est plus visible sur cette page. Voir D1. |
| 3 | « une trop basse donnerait une erreur négative, que le carré rend positive » → « trop basse, l'erreur serait négative : le carré la rend positive » | Non : même sens. |
| 4 | Ligne « J : le coût de la droite » ; « le coût le plus courant en régression, pas le seul » → « la plus courante en régression, pas la seule » | Non. J est défini dans le texte avant la formule (« c'est la fonction de coût $J$ ») ; « pas la seule » est gardé. |
| 6 | « chaque droite a son coût J » fondu ; « réglage a » → « a » ; « ces ventes d'Ames » → « ces ventes » | Presque rien : « Pour une droite et la MSE », « quand $b$ = 4 », « ≈ 74 » et « pour $a$ et $b$ ensemble » sont gardés. « d'Ames », ajouté par l'audit 05.5, est retiré alors que la page a encore un mot de marge (54 sur 55). Voir D2. |
| 5, 7, post | Rien | Textes identiques. |

## Mises en conformité (appliquées automatiquement)

Aucune. Pas de tiret long ; pas de citation entre guillemets dans les textes publiés ; chiffres datés (cours du
27 octobre 2026 en page 3 et dans le post, ventes de 2006 à 2010 en page 5) ; aucune formule absolue non justifiée ;
aucune image réelle, donc ni légende ni crédit.

## Décisions de l'utilisateur

### D1 · Page 3, `texte` : la provenance des prédictions (droite de l'épisode 04) a disparu

- **Constat** : la page ne dit plus que les prix prédits viennent de la droite de l'épisode 04 (a = 74, b = 4). Sans
  ce lien, le tableau n'a pas de modèle identifié sur la page, et le fil rouge de la saison 1 n'y est plus visible.
- **Source vérifiée** : `calculs.cout.erreurs_maisons([2, 267, 171], a=74, b=4)` (commentaire du tableau dans
  `contenu/05.yaml`) ; `contenu/04.yaml` : « le calcul donne $a$ = 74 et $b$ = 4 ». MLCC, Linear regression: Loss,
  https://developers.google.com/machine-learning/crash-course/linear-regression/loss : « Loss focuses on the distance
  between the values, not the direction. » (inchangé, le sens de la page tient).
- **Correction proposée** (55 mots sur 55, titre compris ; à confirmer par `serie verifier 05`) :
  - Avant : « En millions de FCFA (cours du 27 octobre 2026). Les trois prédictions sont trop hautes ; trop basse, l'erreur serait négative : le carré la rend positive. Il grossit aussi les grosses erreurs : à Old Town, l'erreur vaut trois fois et demie celle de College Creek, son carré près de treize fois. »
  - Après : « Droite de l'épisode 04, millions de FCFA (cours du 27 octobre 2026). Ses prédictions sont trop hautes ; trop basse, l'erreur serait négative : le carré la rend positive. Il grossit les grosses erreurs : l'erreur d'Old Town vaut trois fois et demie celle de College Creek, son carré près de treize fois. »
- **Option recommandée** : oui. Le modèle qui produit le tableau est nommé et le fil rouge revient, sans changer le nombre de mots.
  Autre option : garder tel quel, puisque la page 5 (« La droite de l'épisode 04 ») et le post nomment cette droite.
- **Décision** : oui / non / autre

### D2 · Page 6, `texte` : « sur ces ventes » au lieu de « sur ces ventes d'Ames », et « $b$ = » coupé en fin de ligne

- **Constat** : le resserrement a retiré « d'Ames », que l'audit 05.5 avait ajouté pour dire de quelles données dépend
  le creux. La page est à 54 mots sur 55 : on peut le remettre. À l'œil, la ligne 2 finit sur « quand $b$ = » et la ligne
  3 commence par « 4 » : il manque des espaces insécables autour du « = ».
- **Source vérifiée** : D2L 3.1, https://d2l.ai/chapter_linear-regression/linear-regression.html : « minimize the total
  loss across all training examples » (le creux dépend des exemples) ; corrections.md, second audit : creux à 73,59
  sur les 2 925 ventes gardées, 73,19 sans le filtre.
- **Correction proposée** (55 mots sur 55 ; « ⍽ » marque ici une espace insécable U+00A0, qui ne change pas le compte) :
  - Avant : « Son creux donne le meilleur $a$ quand $b$ = 4, sur ces ventes : $a$ ≈ 74, comme dans l'épisode 04. »
  - Après : « Son creux donne le meilleur $a$ quand $b$⍽=⍽4, sur ces ventes d'Ames : $a$ ≈ 74, comme dans l'épisode 04. »
- **Option recommandée** : oui. La page redit les données dont dépend le creux, et la coupure « $b$ = » / « 4 » disparaît.
  Autre option : ne mettre que les insécables, si vous préférez garder un mot de marge.
- **Décision** : oui / non / autre

Pour mémoire, sans les rouvrir : la description (texte alternatif) de la page 6 dit toujours « en a = 74 » et
`sources/05/extraits.yaml` n'a toujours pas d'extrait `ames-4000` (D2 et D3 de la relecture précédente). Si ces deux
décisions ont été tranchées par « oui », elles ne sont pas encore appliquées dans les fichiers.

## Contrôles automatiques (serie verifier)

Recopie de `sortie/05/verification.md` :

Résultat : aucune erreur bloquante, 9 avertissement(s).

- page 2 (ouverture) : 32 mots, proche de la limite de 32
- page 3 (mécanisme) : 55 mots, proche de la limite de 55
- page 5 (comparaison) : 50 mots, proche de la limite de 55
- page 6 (mécanisme) : 54 mots, proche de la limite de 55
- page 2 (ouverture) : texte : « distance » est le terme « distance », introduit à l'épisode 30 (mot courant : vérifier le sens)
- page 4 (formule) : titre : « moyenne » est le terme « moyenne μ », introduit à l'épisode 13 (mot courant : vérifier le sens)
- page 4 (formule) : texte : « moyenne » est le terme « moyenne μ », introduit à l'épisode 13 (mot courant : vérifier le sens)
- page 7 (fin) : point 1 : « distance » est le terme « distance », introduit à l'épisode 30 (mot courant : vérifier le sens)
- page 7 (fin) : point 3 : « moyenne » est le terme « moyenne μ », introduit à l'épisode 13 (mot courant : vérifier le sens)

| Page | Mots | Vide au-dessus du pied (px) |
| --- | ---: | ---: |
| 1 | 7 | 1 |
| 2 | 32 | 218 |
| 3 | 55 | 168 |
| 4 | 49 | 78 |
| 5 | 50 | 28 |
| 6 | 54 | 224 |
| 7 | 0 | 6 |

Seuil de remplissage : 233 px.

Sens vérifié : « distance verticale » est la longueur du segment vertical point-droite (MLCC : « distance between the
values ») ; « moyenne » est la moyenne arithmétique des carrés, sans μ.

## Affirmations et sources

Vérifiées sur le web le 2026-11-01 : [MLCC, Linear regression: Loss](https://developers.google.com/machine-learning/crash-course/linear-regression/loss),
[D2L 3.1](https://d2l.ai/chapter_linear-regression/linear-regression.html),
[NIST/SEMATECH e-Handbook 4.4.4](https://www.itl.nist.gov/div898/handbook/pmd/section4/pmd44.htm). Tous les extraits cités ci-dessous y figurent mot pour mot.

| Page | Affirmation | Extrait | Vérifiée sur |
| --- | --- | --- | --- |
| 2 | La droite prédit ŷ, le résultat réel est y | mlcc-difference | MLCC : « loss measures the difference between the predicted and actual values » |
| 2 | Erreur ŷ − y, souvent y − ŷ en statistique | nist-residu | D2L : ½(ŷ⁽ⁱ⁾ − y⁽ⁱ⁾)² ; NIST : e_i = y_i − f(x_i ; β̂), « The residuals from a fitted model are the differences between the responses observed… » |
| 2 | Sans signe, la distance verticale | mlcc-distance | MLCC : « Loss focuses on the distance between the values, not the direction. » |
| 3 | Prix en millions de FCFA au cours du 27 octobre 2026 ; erreurs 3, 7, 25 ; carrés 9, 49, 625 | ames-prix, bceao-dollar, ames-surface | `erreurs_maisons` (a = 74, b = 4) ; extrait BCEAO « Dollar us 588,3000 » |
| 3 | Le carré rend positive une erreur négative | mlcc-signe | MLCC : « Square the difference between the actual value and the prediction. » |
| 3 | Old Town : erreur 3,5 fois, carré près de 13 fois College Creek | mlcc-carre-grand, d2l-carre | 25 / 7 = 3,57 ; 625 / 49 = 12,76 ; MLCC : « squaring makes the loss even larger » |
| 3 | Un point très éloigné peut tirer la droite | mlcc-aberrant, d2l-anomalies | MLCC : « MSE moves the model more toward the outliers, while MAE doesn't. » ; D2L : « excessive sensitivity to anomalous data » |
| 4 | Moyenne des carrés sur n exemples : J, la MSE | mlcc-mse, d2l-moyenne | MLCC : « The average of L2 losses across a set of N examples. » ; D2L : « we simply average (or equivalently, sum) the losses » |
| 4 | La plus courante en régression, pas la seule | d2l-regression, mlcc-choix | D2L : « For regression problems, the most common loss function is the squared error. » ; MLCC : « Deciding whether to use MAE or MSE can depend on the dataset… » |
| 4 | Plus J est petit, mieux la droite suit les données | d2l-zero | D2L : « smaller values are better and perfect predictions incur a loss of 0 » |
| 5 | J = 1 030 (a = 74) et 3 433 (a = 40), ventes de 2006 à 2010 | ames-ventes, ames-surface, ames-prix, bceao-dollar | `cout_ames`, test [1030, 3433] ; inchangé |
| 6 | Courbe en U, creux a ≈ 74 pour b = 4 ; entraîner, c'est chercher le creux pour a et b | d2l-minimiser, ames-ventes | `cout_selon_a` (73,59) ; D2L : « minimize the total loss across all training examples », « Linear regression happens to be a learning problem with a global minimum » |
| 7 | Rappels des pages 2 à 6 ; épisode suivant nº 06 | (fiche) | Inchangé, conforme à la fiche |
| Post | Inchangé | bceao-dollar, d2l-regression | Comme pages 3 et 4 |

## Validation scientifique

**Page 2** · Hypothèse : régression à une sortie, erreur mesurée verticalement · Domaine : dit (signe de la série, usage inverse) · Contre-exemple : régression orthogonale, hors sujet · Raccourci : « erreur (résidu) » réunit erreur théorique et résidu, assumé.

**Page 3** · Hypothèse : prédictions de la droite a = 74, b = 4, non nommée depuis le resserrement (D1) · Domaine : les trois maisons du tableau · Contre-exemple : une erreur inférieure à 1 rapetisse au carré (mlcc-carre-petit), sans effet ici, les rapports restent 3,57 et 12,76 · Raccourci : « tirer toute la droite », gardé au conditionnel (« peut »).

**Page 4** · Hypothèse : coût moyen sur les exemples d'entraînement, sans le ½ de D2L (même creux) · Domaine : dit (« ici », « pas la seule ») · Contre-exemple : la MAE, couverte · Raccourci : « suit les données » vaut pour ces données.

**Page 5** · Hypothèse : b = 4, J sur les 2 925 ventes gardées · Domaine : période dite, filtre non dit (choix déjà tranché) · Contre-exemple : a = 73,59 fait un peu mieux que 74, couvert par « des deux » · Raccourci : droites sans les points, dit.

**Page 6** · Hypothèse : droite, MSE, b fixé · Domaine : dit, sauf les données (« ces ventes », D2) · Contre-exemple : a et b ensemble donnent une cuvette, couvert par la dernière phrase · Raccourci : 73,59 écrit « ≈ 74 ».

**Page 7** · Rien de nouveau ; « la droite au coût le plus faible » est juste pour a et b ensemble (minimum global, D2L).

**À l'œil (planche)** : lecture fluide, texte en 30 px lisible. Couverture : titre sur trois lignes, robot et nuage de
points lisibles ; le « ?! » recouvre l'extrémité haute de la droite et un point (effet voulu, sans gêne pour le sens).
Page 6 : coupure « $b$ = » / « 4 » en fin de ligne 2 (D2). Page 5 : encadré à 28 px du pied, sans débordement.
Vouvoiement respecté, pas de tiret long.
