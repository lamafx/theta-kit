# Relecture · Nº 03 · Les trois familles d'apprentissage

Relecture du 2026-11-14, après la réécriture pour la compréhension (pages 2, 3, 4, 5, 6 et texte du post ; détail
à la fin de `sortie/03/corrections.md`). Le texte du post, réécrit le 2026-11-05 puis le 2026-11-14, est relu ici en
entier pour la première fois par le relecteur.

**Avertissement scientifique** : aucun. Chaque page répond aux quatre questions (voir la dernière section) ; les
nuances des relectures précédentes sont toutes présentes (« des repères plutôt qu'une liste complète », « pas
forcément de vraies catégories », « reviennent souvent », « Le plus souvent », « positif ou négatif », « peuvent
changer », « publié en 1936 », semi-supervisé et renforcement hors ligne dans le post).

## Mises en conformité (appliquées automatiquement)

Aucune. Pas de tiret long, pas de citation entre guillemets dans les pages ni dans le post, pas d'image réelle (donc
pas de crédit à traduire), et les deux dates (1936, 2016) sont sourcées : la notice du manuel donne « year={2016} ».
Aucun mot absolu (« toujours », « jamais », « tout ») n'est employé dans un texte publié.

## Décisions de l'utilisateur

### D1 · Page 2 (ouverture), `texte` : « une par une » ne décrit pas la suite du carrousel

- **Constat** : la page annonce que les pages suivantes présentent les trois familles « une par une », mais la
  page 3 montre le supervisé et le non supervisé côte à côte, et la page 4 revient au supervisé. Un débutant qui suit
  l'annonce à la lettre peut chercher une page par famille.
- **Source vérifiée** : le carrousel lui-même (`contenu/03.yaml`, pages 3 à 5 ; `sortie/03/planche.png`).
- **Correction proposée** :
  - avant : « Les pages suivantes les présentent une par une. »
  - après : « Les pages suivantes les présentent. » (29 mots au lieu de 32, l'avertissement de limite disparaît)
- **Option recommandée** : oui, l'annonce reste vraie sans rien promettre de l'ordre. Autre option : garder la
  phrase, l'écart étant léger.
- **Décision** : oui / non / autre

### D2 · Post, paragraphe « Deux exemples », `texte` : « sans agir » est plus large que la source

- **Constat** : le post dit que le renforcement hors ligne apprend « de données déjà réunies, sans agir ». Les
  données ont bien été produites par des actions (d'un autre système ou d'une version précédente) ; ce que la source
  exclut, c'est de collecter de nouvelles données pendant l'apprentissage.
- **Source vérifiée** : Levine, Kumar, Tucker et Fu (2020), « Offline Reinforcement Learning: Tutorial, Review, and
  Perspectives on Open Problems », arXiv:2005.01643, https://arxiv.org/abs/2005.01643 : « reinforcement learning
  algorithms that utilize previously collected data, without additional online data collection. »
- **Correction proposée** :
  - avant : « Et le renforcement peut aussi apprendre de données déjà réunies, sans agir : c'est le renforcement hors ligne. »
  - après : « Et le renforcement peut aussi apprendre de données déjà réunies, sans agir pendant l'apprentissage : c'est le renforcement hors ligne. »
- **Option recommandée** : oui, la phrase dit exactement ce que dit la source (« without additional online data
  collection ») pour trois mots de plus. Autre option : « sans agir de nouveau », plus court, mais qui laisse
  entendre que c'est le même système qui a agi avant, ce que la source ne dit pas.
- **Décision** : oui / non / autre

### D3 · Post, dernier paragraphe, `texte` : « Dans les trois cas, l'apprentissage laisse un modèle »

- **Constat** : dans le vocabulaire du renforcement, « modèle » a un sens plus étroit (un modèle de l'environnement,
  que seuls certains systèmes ont) ; ce que laisse l'apprentissage par renforcement s'y appelle d'abord une
  politique. Dans la série, « modèle » est introduit au Nº 01 au sens large (ce que l'apprentissage tire des
  exemples), sens que suit le manuel Deep Learning ; la phrase est juste dans ce sens, mais un lecteur qui connaît le
  renforcement peut y voir une imprécision.
- **Source vérifiée** : Sutton et Barto, Reinforcement Learning, An Introduction, § 1.3 « Elements of Reinforcement
  Learning », http://incompleteideas.net/book/first/ebook/node9.html (lu via r.jina.ai) : « The fourth and final
  element of some reinforcement learning systems is a model of the environment. » et « A policy defines the learning
  agent's way of behaving at a given time. »
- **Correction proposée** :
  - avant : « Dans les trois cas, l'apprentissage laisse un modèle derrière lui, souvent fait de nombres. Dans l'épisode suivant, un modèle qui n'en a que deux. »
  - après (option B) : « Dans les trois cas, l'apprentissage laisse un résultat derrière lui, souvent fait de nombres. Dans l'épisode suivant, un modèle qui n'en a que deux. »
- **Option recommandée** : non (garder le texte), parce que « modèle » est le terme de la série depuis le Nº 01,
  qu'il fait le lien avec le Nº 04 (« Modèle et paramètres ») et que le sens étroit de Sutton et Barto n'est pas
  introduit ; l'option B lève l'ambiguïté au prix d'un mot plus vague, que le lecteur débutant comprendra moins bien.
- **Décision** : oui / non / autre

## Contrôles automatiques (serie verifier)

Résultat : aucune erreur bloquante, 2 avertissement(s).

Avertissements :
- page 2 (ouverture) : 32 mots, proche de la limite de 32
- page 5 (mécanisme) : 55 mots, proche de la limite de 55

| Page | Mots | Vide au-dessus du pied (px) |
| --- | ---: | ---: |
| 1 | 0 | 59 |
| 2 | 32 | 155 |
| 3 | 46 | 28 |
| 4 | 46 | 84 |
| 5 | 55 | 57 |
| 6 | 0 | 6 |

Seuil de remplissage : 233 px.

## Affirmations et sources

Note sur le DLB : la page du chapitre 5 (deeplearningbook.org/contents/ml.html) ne se lit aujourd'hui que sur ses
10 000 premiers caractères (section 5.1 jusqu'à la liste des tâches), directement comme via r.jina.ai. Les extraits
situés plus loin (supervisé, non supervisé, flou, variantes, jeu fixe, renforcement, iris, regroupement) restent ceux
recopiés le 2026-10-26 et le 2026-11-01 ; les phrases qui s'appuient sur eux ont été reformulées le 2026-11-14 sans
changer de sens. La page d'accueil du manuel a été relue aujourd'hui pour les auteurs et l'année.

| Page | Affirmation | Extrait | Vérifiée sur |
| --- | --- | --- | --- |
| 2 | Les données n'ont pas toujours leur réponse ; trois grandes familles, des repères plutôt qu'une liste complète | dlb-supervise, dlb-non-supervise, dlb-renforcement, dlb-flou, dlb-variantes | DLB ch. 5 (extraits du 2026-10-26) |
| 3 | Supervisé : chaque exemple a son étiquette, le modèle apprend à la retrouver ; non supervisé : une structure, par exemple des groupes d'exemples semblables | dlb-supervise, dlb-non-supervise, dlb-groupes | DLB ch. 5 (extraits du 2026-10-26) |
| 3, cas | Le modèle trouve des groupes, pas forcément de vraies catégories | dlb-mal-pose | DLB ch. 5 (extrait du 2026-11-01) : « no single criterion that measures how well a clustering of the data corresponds to the real world » |
| 3, encadré | Un jeu publié en 1936 décrit 150 fleurs d'iris | dlb-iris, dlb-iris-date | [UCI, Iris](https://archive.ics.uci.edu/dataset/53/iris), lu le 2026-11-14 : « Fisher, R. (1936). Iris [Dataset]. », 150 exemples, « 3 classes of 50 instances each » |
| 3, encadré | Avec l'espèce, on apprend à la reconnaître d'après ses mesures | dlb-iris-especes | DLB ch. 5 (extrait du 2026-10-26) |
| 4 | Deux tâches reviennent souvent ; la régression prédit un nombre ; la classification, une catégorie | dlb-taches-courantes, dlb-regression, dlb-classification | [DLB ch. 5 via r.jina.ai](https://r.jina.ai/https://www.deeplearningbook.org/contents/ml.html), partie lisible (liste des tâches), lu le 2026-11-14 |
| 4 | Spam et non-spam dans l'épisode 01 | (renvoi interne) | `contenu/01.yaml`, page « Le spam » et schéma « Spam, Non-spam » |
| 5 | Certains systèmes n'apprennent pas seulement d'un jeu de données fixe ; le plus souvent, un jeu réuni à l'avance | dlb-jeu-fixe, dlb-jeu-entier | DLB ch. 5 (extraits du 2026-10-26 et du 2026-11-01) |
| 5 | Le système agit dans un environnement, le monde qui lui répond | dlb-renforcement, sb-environnement | [Sutton et Barto, § 1.2 « Examples »](http://incompleteideas.net/book/first/ebook/node8.html), lu via r.jina.ai le 2026-11-14 : « All involve interaction between an active decision-making agent and its environment, » |
| 5 | Comme une partie d'échecs | sb-echecs | Sutton et Barto, § 1.2, lu le 2026-11-14 : « A master chess player makes a move. » ; la section s'ouvre sur « A good way to understand reinforcement learning is to consider some of the examples » |
| 5 | Le retour est positif ou négatif | sb-positif-negatif | [Sutton et Barto, § 3.1](http://incompleteideas.net/book/first/ebook/node28.html) (extrait du 2026-11-01 ; page non relisible aujourd'hui : certificat refusé en direct, erreur 422 via r.jina.ai) |
| 5 | Ses actions peuvent changer ce qu'il observe ensuite | sb-actions | [Sutton et Barto, § 1.1](http://incompleteideas.net/book/first/ebook/node7.html), lu via r.jina.ai le 2026-11-14 : « actions may affect not only the immediate reward but also the next situation » ; § 1.2 : « The agent's actions are permitted to affect the future state of the environment » |
| 5 | « peuvent » (contre-exemple : renforcement hors ligne) | levine-hors-ligne | [Levine et al. (2020), arXiv:2005.01643](https://arxiv.org/abs/2005.01643), lu le 2026-11-14 |
| 6 | Vérifiez-vous : la famille qui n'apprend pas seulement d'un jeu réuni à l'avance (réponse page 5) | dlb-jeu-fixe | Conforme à la page 5 |
| post | Apprendre sans aucune réponse, et à partir de données produites en agissant | dlb-non-supervise, dlb-renforcement | DLB ch. 5 (extraits du 2026-10-26) : « a feedback loop between the learning system and its experiences » |
| post | Supervisé : chaque exemple a sa réponse ; non supervisé : une structure ; renforcement : agir, actions qui peuvent changer ce qu'il observe | dlb-supervise, dlb-non-supervise, sb-actions | DLB ch. 5 ; Sutton et Barto, § 1.1, lu le 2026-11-14 |
| post | Les auteurs du manuel Deep Learning (2016), Goodfellow, Bengio et Courville | dlb-auteurs, dlb-annee | [deeplearningbook.org](https://www.deeplearningbook.org/), lu le 2026-11-14 : « Ian Goodfellow and Yoshua Bengio and Aaron Courville » ; « year={2016} », « publisher={MIT Press} » |
| post | Supervisé et non supervisé n'ont pas de définition stricte (paraphrase, sans guillemets) | dlb-flou | DLB ch. 5 (extrait du 2026-10-26) : « Unsupervised learning and supervised learning are not formally defined terms. » |
| post | Semi-supervisé : des réponses pour une partie des exemples | dlb-variantes | DLB ch. 5 (extrait du 2026-10-26) : « some examples include a supervision target but others do not » |
| post | Renforcement hors ligne : apprendre de données déjà réunies | levine-hors-ligne | arXiv:2005.01643, lu le 2026-11-14 (voir D2) |
| post | L'apprentissage laisse un modèle, souvent fait de nombres ; au Nº 04, un modèle à deux nombres | (renvoi interne) | `contenu/04.yaml` : « tiennent ici en deux nombres, $a$ et $b$ » (voir D3) |
| post | La situation de départ sépare les familles, d'abord | dlb-supervise, dlb-non-supervise, dlb-jeu-fixe | DLB ch. 5 : les trois définitions portent sur ce que l'algorithme reçoit (étiquettes ou non, jeu fixe ou interaction) ; « d'abord » garde la nuance |

## Validation scientifique

**Page 2**
- Hypothèse : le découpage en trois familles est une convention, pas une définition formelle.
- Domaine : dit (« des repères plutôt qu'une liste complète »).
- Contre-exemple : le semi-supervisé, l'auto-supervisé ; couverts par la même phrase, et le semi-supervisé est nommé dans le post.
- Raccourci : assumé et signalé ; « une par une » décrit mal l'ordre des pages (D1).

**Page 3**
- Hypothèse : en supervisé, chaque exemple est étiqueté ; en non supervisé, aucun.
- Domaine : dit (« par exemple des groupes »).
- Contre-exemple : des groupes qui ne correspondent à aucune catégorie réelle ; traité dans le cas (« pas forcément de vraies catégories »).
- Raccourci : le non supervisé réduit au regroupement, signalé par « par exemple ».

**Page 4**
- Hypothèse : seules les tâches courantes du supervisé sont présentées.
- Domaine : dit (« Deux tâches reviennent souvent »).
- Contre-exemple : d'autres tâches (transcription, traduction, sortie structurée) ; couvertes par « souvent ».
- Raccourci : assumé.

**Page 5**
- Hypothèse : apprentissage en ligne, où le système agit et reçoit ses observations de l'environnement.
- Domaine : dit (« Certains systèmes », « peuvent changer », « Le plus souvent »).
- Contre-exemple : le renforcement hors ligne (Levine et al., 2020) ; traité par « peuvent » ici et nommé dans le post.
- Raccourci : « retour » plutôt que « récompense », et « positif ou négatif » sans le cas nul (Sutton et Barto : « zero most of the time ») ; choix déjà tranchés par vous (D2 du 2026-11-01, audit 03.2). La partie d'échecs est une image de l'environnement tirée des exemples de Sutton et Barto, pas un système présenté comme réel : correct.

**Page 6** : rien de nouveau ; la question renvoie bien à la page 5 ; l'épisode suivant (Nº 04, « Modèle et paramètres », « Mais concrètement, qu'est-ce qui apprend ? ») est conforme à la fiche.

**Post**
- Hypothèse : les familles se distinguent par ce que reçoit l'algorithme.
- Domaine : dit (« d'abord », « des repères, pas des cloisons »).
- Contre-exemples : semi-supervisé et renforcement hors ligne, nommés ; « sans agir » à préciser (D2).
- Raccourci : « modèle » au sens large de la série pour les trois familles (D3).

**Fiche** : la fiche 03 n'a pas de liste « à ne pas écrire » ; rien d'interdit relevé.

**Images** : aucune image réelle dans l'épisode (pas de dossier `assets/images/candidats/03/`) ; la couverture et
la page de fin utilisent l'illustration du gabarit.

**À l'œil (planche)** : lecture fluide. Page 5 pleine (55 mots, 57 px au-dessus du pied) mais sans chevauchement ;
l'étiquette « SUPERVISÉ, NON SUPERVISÉ » est bien séparée du texte. Page 3 : 28 px au-dessus du pied, sans gêne.
