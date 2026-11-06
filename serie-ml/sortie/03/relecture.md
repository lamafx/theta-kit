# Relecture · Nº 03 · Les trois familles d'apprentissage

Relecture du 2026-11-01, après la session de design n° 2 (texte en 30 px, limites à 32 et 55 mots, couverture A).

**Contrôle prioritaire : nuances perdues en resserrant.** Je n'ai pas pu lancer `git show e57677b:contenu/03.yaml`
(pas d'accès au shell dans cette relecture). J'ai donc comparé `contenu/03.yaml` avec les aperçus de
`publier/03/apercus/`, rendus avant la session : ils contiennent déjà tous les changements du troisième passage
(« pour un cas nouveau », « Le plus souvent », « positif ou négatif », « pas forcément des catégories réelles »).
Ils correspondent donc bien à l'état e57677b. Résultat :

- Pages 3, 4, 5 et 6, encadrés, cas, schémas et texte du post : mot pour mot identiques. Aucune nuance n'a été touchée
  (« par exemple des groupes », « pas forcément des catégories réelles », « reviennent souvent », « Le plus souvent »,
  « positif ou négatif », « peuvent changer », « publié en 1936 »).
- Page 2, seul texte resserré : « Dans l'épisode 02, chaque maison avait sa réponse, son prix ; les données n'en ont pas
  toujours. » devient « Les données n'ont pas toujours leur réponse. » La nuance « pas toujours » est conservée, tout
  comme la nuance unique de l'épisode (« des repères plutôt qu'une liste complète »). Le lien concret avec le prix des
  maisons reste dans le rappel de la même page (« son prix est l'étiquette ») et en page 3. Rien n'est perdu.
- Changements visuels seulement : page 3, cadre du visuel comparé ramené de 300 à 205 px (les deux groupes et leurs
  centres restent lisibles) ; couverture, groupes recentrés.

## Mises en conformité (appliquées automatiquement)

Aucune. Pas de tiret long, pas d'image réelle (pas de crédit à traduire), pas de citation entre guillemets dans les
pages ni dans le post, et la seule date (1936) a sa source.

## Décisions de l'utilisateur

Aucune nouvelle. Pour rappel, ces points sont déjà tranchés et je ne les rouvre pas : l'espace sous le texte de la
page 5 (D1, AMBIGUITES A46 (f)), « retour » au lieu de « récompense » (D2), et la boucle du schéma Flux à deux lignes
(AMBIGUITES A53). Sur le nouveau rendu en 30 px, l'étiquette « SUPERVISÉ, NON SUPERVISÉ » de la page 5 colle presque
au texte (environ 20 px). L'écart était le même avant la session ; il relève du gabarit, donc de A46 (f).

## Contrôles automatiques (serie verifier)

Résultat : aucune erreur bloquante, 1 avertissement(s).

Avertissements :
- page 2 (ouverture) : 31 mots, proche de la limite de 32

| Page | Mots | Vide au-dessus du pied (px) |
| --- | ---: | ---: |
| 1 | 0 | 59 |
| 2 | 31 | 155 |
| 3 | 46 | 28 |
| 4 | 44 | 84 |
| 5 | 48 | 180 |
| 6 | 0 | 6 |

Seuil de remplissage : 233 px.

## Affirmations et sources

Note : la page de cours du DLB (deeplearningbook.org/contents/ml.html) ne s'est lue que partiellement aujourd'hui
(texte tronqué à 10 000 caractères par l'outil de lecture). Seules la liste des tâches (régression, classification,
« Some of the most common machine learning tasks include the following ») ont pu être relues le 2026-11-01. Les
autres extraits du DLB restent ceux lus le 2026-10-26 et le 2026-11-01 lors des relectures précédentes. Les phrases
qui s'appuient sur eux n'ont pas changé depuis.

| Page | Affirmation | Extrait | Vérifiée sur |
| --- | --- | --- | --- |
| 2 | Les données n'ont pas toujours leur réponse ; trois familles, des repères plutôt qu'une liste complète | dlb-supervise, dlb-non-supervise, dlb-renforcement, dlb-flou, dlb-variantes | [DLB ch. 5](https://www.deeplearningbook.org/contents/ml.html) (extraits du 2026-10-26) |
| 3 | Supervisé : chaque exemple a son étiquette ; non supervisé : une structure, par exemple des groupes d'exemples semblables | dlb-supervise, dlb-non-supervise, dlb-groupes | DLB ch. 5 (extraits du 2026-10-26) |
| 3, cas | Des groupes trouvés : pas forcément des catégories réelles | dlb-mal-pose | DLB ch. 5 (extrait du 2026-11-01) |
| 3, encadré | Un jeu publié en 1936 décrit 150 fleurs d'iris | dlb-iris, dlb-iris-date | [UCI, Iris](https://archive.ics.uci.edu/dataset/53/iris), lu le 2026-11-01 : « Fisher, R. (1936). Iris [Dataset] », 150 exemples, « 3 classes of 50 instances each » |
| 3, encadré | Avec l'espèce, on apprend à la reconnaître d'après ses mesures | dlb-iris-especes | DLB ch. 5 (extrait du 2026-10-26) |
| 4 | Deux tâches reviennent souvent ; la régression prédit un nombre ; la classification, une catégorie | dlb-taches-courantes, dlb-regression, dlb-classification | [DLB ch. 5 via r.jina.ai](https://r.jina.ai/https://www.deeplearningbook.org/contents/ml.html), lu le 2026-11-01 : « predict a numerical value given some input » ; « specify which of k categories some input belongs to » |
| 5 | Certains algorithmes ne se contentent pas d'un jeu fixe ; le plus souvent, un jeu réuni à l'avance | dlb-jeu-fixe, dlb-jeu-entier | DLB ch. 5 (extraits du 2026-10-26 et du 2026-11-01) |
| 5 | Le système agit dans un environnement, reçoit un retour, recommence | dlb-renforcement | DLB ch. 5 (extrait du 2026-10-26) |
| 5 | Le retour est positif ou négatif | sb-positif-negatif | [Sutton et Barto, § 3.1](http://incompleteideas.net/book/first/ebook/node28.html), lu le 2026-11-01 : « The rewards might be zero most of the time, but then become positive when the robot secures an empty can » |
| 5 | Ses actions peuvent changer les données reçues ensuite | sb-actions | [Sutton et Barto, § 1.1](http://incompleteideas.net/book/first/ebook/node7.html), lu le 2026-11-01 : « In the most interesting and challenging cases, actions may affect not only the immediate reward but also the next situation » |
| 5 | « peuvent » (contre-exemple : renforcement hors ligne) | levine-hors-ligne | [Levine et al. (2020), arXiv:2005.01643](https://arxiv.org/abs/2005.01643), lu le 2026-11-01 : « reinforcement learning algorithms that utilize previously collected data, without additional online data collection » |
| post | Des frontières souvent floues | dlb-flou | DLB ch. 5 (extrait du 2026-10-26) : « The lines between them are often blurred. » |
| post | Régression : un nombre ; classification : une catégorie | dlb-regression, dlb-classification | DLB ch. 5 via r.jina.ai, lu le 2026-11-01 |

## Validation scientifique

**Page 2**
- Hypothèse : le découpage en trois familles est une convention, pas une définition formelle.
- Domaine : c'est dit (« des repères plutôt qu'une liste complète »).
- Contre-exemple : le semi-supervisé, l'auto-supervisé. Il est couvert par la même phrase.
- Raccourci : assumé et signalé.

**Page 3**
- Hypothèse : en supervisé, chaque exemple est étiqueté ; en non supervisé, aucun.
- Domaine : dit (« par exemple des groupes »).
- Contre-exemple : des groupes qui ne correspondent à aucune catégorie réelle. C'est traité dans le cas (« pas forcément des catégories réelles »).
- Raccourci : le non supervisé réduit au regroupement. C'est signalé par « par exemple ».

**Page 4**
- Hypothèse : on ne parle que des tâches courantes du supervisé.
- Domaine : dit (« reviennent souvent »).
- Contre-exemple : d'autres tâches (classement, structure de sortie). Elles sont couvertes par « souvent ».
- Raccourci : assumé.

**Page 5**
- Hypothèse : apprentissage en ligne, où le système collecte ses propres données.
- Domaine : dit (« peuvent changer », « Le plus souvent »).
- Contre-exemple : le renforcement hors ligne (Levine et al., 2020). Il est traité par « peuvent ».
- Raccourci : « retour » plutôt que « récompense ». C'est un choix tranché par l'utilisateur (D2).

**Page 6** : rien de nouveau ; l'épisode suivant (Nº 04, « Mais concrètement, qu'est-ce qui apprend ? ») est conforme à la fiche.

**Avertissement scientifique** : aucun.
