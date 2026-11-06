# Série Théta (θ) — Architecture et banque de sujets

Oct 18, 2026 · @donne moi un prompt pour generer un portofolio de hacker avec de

## 1. Architecture d'un carrousel

Chaque post suit le même squelette : une couverture sombre, une page d'ouverture claire avec le grand titre, des pages de contenu claires sans grand titre, puis une page de fin claire où le robot revient résumer. Seul le nombre de pages de contenu varie, ce qui donne deux formats qu'on alterne.

### L'ordre des pages

1. **Couverture** (sombre) : le robot, le fond propre au sujet, le numéro, le titre, l'accroche et « Glissez → ».
2. **Ouverture** (claire) : le grand titre du sujet, la phrase d'intuition et le premier visuel. C'est la page éditoriale validée (Direction C).
3. **Pages de contenu** (claires) : plus de grand titre, seulement un titre de page court. La place gagnée sert à l'explication et au visuel.
4. **Fin** (claire, fond gris-bleu #EEF2F8) : à retenir en 3 points en grand, l'épisode suivant et l'invitation à suivre la série sur une ligne sobre. Le robot de la couverture revient en bas à droite et pointe le résumé avec une baguette.

### Les types de pages de contenu

| Type | Ce que la page fait | Exemple (descente de gradient) |
| --- | --- | --- |
| Problème | Montre pourquoi la notion existe | Le modèle ne voit que la pente sous ses pieds |
| Mécanisme | Explique comment ça marche, avec un schéma | Une pente forte donne un grand pas, une pente faible un petit pas |
| Comparaison | Met 2 ou 3 cas côte à côte | η trop petit, bien choisi, trop grand |
| Formule | Donne la formule et la légende de chaque symbole | θ ← θ − η∇J |
| Exemple chiffré | Déroule le calcul sur de vraies valeurs | Trois itérations à la main |
| Piège | Montre l'erreur classique à éviter | Oublier de normaliser les données |
| Contexte | Ancre la notion dans un fait réel et daté, avec une image réelle créditée | 1959 : le programme de dames d'Arthur Samuel sur IBM 704 |

**Ces types sont une boîte à outils, pas un plan obligatoire.** Les maquettes de l'épisode 08 montrent le style global. Chaque sujet ne prend que les types dont il a besoin : un sujet sans cas à opposer n'a pas de page Comparaison, un sujet sans formule n'a pas de page Formule. Ce qui ne change jamais : la couverture, l'ouverture, la page de fin, l'en-tête, le pied de page et les règles ci-dessous.

### Deux formats en alternance

| Format | Pages | Usage |
| --- | --- | --- |
| Court | 5 : couverture, ouverture, 2 pages de contenu, fin | Notions simples ou de transition |
| Long | 7 à 8 : couverture, ouverture, 4 à 5 pages de contenu, fin | Notions centrales, avec formule et comparaison |

Rythme conseillé : un format long et un ou deux formats courts par semaine. Le format de chaque épisode est fixé dans la banque.

### Règles de style communes

- Une seule idée par page.
- 40 mots maximum sur l'ouverture, 70 mots maximum sur une page de contenu.
- Un terme n'apparaît que s'il a été introduit dans ce post ou dans un épisode précédent.
- Chaque visuel est calculé à partir de la vraie formule, jamais dessiné à l'œil.
- En-tête fixe sur toutes les pages : Nº de l'épisode, chapitre, numéro de page (3/7).
- Pied de page fixe : « Ladji Lama Kamagate » à gauche, numéro de page ou « Glissez → » à droite.
- Polices : Geist (texte), Geist Mono (étiquettes), STIX Two Text (formules). Une seule couleur d'accent bleue.
- Texte d'au moins 24 px sur une page de 1080 × 1350 px, pour rester lisible sur téléphone.

### Le fil de lecture

- **L'ouverture rappelle d'où l'on vient** : une ligne qui cite l'épisode précédent, par exemple « On sait mesurer l'erreur (05) et lire une pente (06) ».
- **Chaque page répond à la question laissée par la précédente.** Si deux pages peuvent s'inverser sans gêne, l'une des deux est de trop.
- **Un symbole est défini à sa première apparition**, dans la phrase même : « η, le taux d'apprentissage, règle la taille du pas ».
- **L'ordre conseillé** : ouverture, puis l'intuition (problème ou mécanisme), puis les cas (comparaison), puis la formule, puis la preuve (exemple chiffré). La formule arrive quand le lecteur sait déjà ce qu'elle va dire.
- **La page de fin reprend les mots exacts des pages** : rien de nouveau n'y apparaît.

### La couleur d'alerte

Un orange brûlé (#C2410C) est la seule exception à l'accent bleu unique. Il marque ce qui tourne mal : la divergence, un piège, une erreur classique. Il n'apparaît que sur les pages Comparaison et Piège.

## 2. Règles de la banque de sujets

Chaque épisode a une fiche avec les mêmes rubriques, et l'ordre des épisodes suit une seule règle : on ne parle jamais d'une notion que le lecteur n'a pas encore vue.

### Les rubriques d'une fiche

| Rubrique | Contenu |
| --- | --- |
| Numéro et chapitre | Position dans la série |
| Titre | Le nom de la notion, affiché en couverture et en ouverture |
| Accroche | Une phrase propre au sujet, sous le titre de couverture |
| Fond derrière le robot | Le motif calculé qui évoque le sujet |
| Format | Court ou long |
| Prérequis | Les épisodes à avoir lus avant |
| Termes introduits | Les mots nouveaux, définis dans ce post |
| Pages | Le type et le message de chaque page |
| Épisode suivant | Le prochain sujet et la phrase de transition |

### Comment l'ordre est construit

- **Du concret vers l'abstrait** : on montre un exemple avant la formule.
- **Une notion s'appuie sur la précédente** : chaque épisode cite au moins un terme d'un épisode déjà publié.
- **Les maths arrivent juste à temps** : la dérivée est présentée juste avant la descente de gradient, pas au début de la série.
- **Chaque chapitre se termine par un pont** vers le suivant, annoncé sur la page de fin.
- **Les termes sont réutilisés** : par exemple la divergence, introduite avec η trop grand, revient avec les optimiseurs et la disparition du gradient.

Dans le plan détaillé (section 4), chaque épisode a pour prérequis implicites tous les épisodes qui le précèdent dans son chapitre. Seuls les prérequis venant d'autres chapitres sont indiqués.

## 3. Vue d'ensemble : 10 chapitres, 62 épisodes

La série part de « qu'est-ce que le Machine Learning ? » et mène jusqu'au NLP et aux modèles de langage, ton terrain. Elle est publiée en 4 saisons séparées par une pause de 2 semaines, en commençant par l'épisode 01. La colonne « Fin prévue » compte les semaines de publication seules, sans les pauses.

| Chapitre | Épisodes | Nombre | Fin prévue (à 2,5 posts/semaine) |
| --- | --- | --- | --- |
| 1. Les bases | 01 – 04 | 4 | Semaine 2 |
| 2. Apprendre de ses erreurs | 05 – 10 | 6 | Semaine 4 |
| 3. La régression | 11 – 14 | 4 | Semaine 6 |
| 4. La classification | 15 – 19 | 5 | Semaine 8 |
| 5. Évaluer un modèle | 20 – 24 | 5 | Semaine 10 |
| 6. Bien généraliser | 25 – 29 | 5 | Semaine 12 |
| 7. Les modèles classiques | 30 – 36 | 7 | Semaine 15 |
| 8. Les réseaux de neurones | 37 – 46 | 10 | Semaine 19 |
| 9. Les réseaux spécialisés | 47 – 51 | 5 | Semaine 21 |
| 10. Le langage | 52 – 62 | 11 | Semaine 25 |

La fonction de coût (05) vient bien avant la descente de gradient (08), avec entre les deux la dérivée (06) et le gradient (07). Le dernier épisode, la classification d'intention (62), clôt la série sur une application concrète.

### Le découpage en saisons

Chaque saison se termine par un post bilan court : un carrousel sommaire des épisodes de la saison, qui renvoie vers chacun. La pause sert à préparer la saison suivante d'avance.

| Saison | Épisodes | Chapitres | Durée (2,5 posts/semaine) |
| --- | --- | --- | --- |
| 1 · Comprendre l'apprentissage | 01 – 19, puis bilan | 1 à 4 | environ 8 semaines |
| 2 · Évaluer et généraliser | 20 – 36, puis bilan | 5 à 7 | environ 7 semaines |
| 3 · Les réseaux de neurones | 37 – 51, puis bilan | 8 et 9 | environ 6 semaines |
| 4 · Le langage | 52 – 62, puis bilan | 10 | environ 5 semaines |

Calendrier complet : 26 semaines de publication et 3 pauses de 2 semaines, soit environ 32 semaines. Le carrousel de l'épisode 08 qui figure dans les gabarits sert uniquement de référence de style : il est publié à sa place, en semaine 4.

## 4. Banque de sujets détaillée

Chaque fiche donne la couverture (accroche et fond derrière le robot), les termes introduits, le plan des pages et le pont vers l'épisode suivant. La page 1 est toujours la couverture et la dernière page toujours la fin : elles ne sont pas répétées dans les plans.

### Chapitre 1 · Les bases

Poser le vocabulaire avant toute formule : ce qu'est apprendre, ce qu'est un exemple, ce qu'est un modèle.

#### 01 · Qu'est-ce que le Machine Learning ? · Court

- **Accroche :** « Au lieu d'écrire les règles, on montre des exemples. »
- **Fond derrière le robot :** nuage de points épars, les exemples
- **Termes introduits :** Machine Learning, exemple, apprentissage
- **Pages :**
  - 2 Ouverture — Programme classique : règles + données → réponses. Machine Learning : données + réponses → règles.
  - 3 Contexte — 1959 : Arthur Samuel (IBM) publie un programme de dames qui apprend à jouer mieux que son auteur, en 8 à 10 heures de jeu. Image réelle : photo d'un IBM 704, le modèle utilisé pour ses expériences.
  - 4 Exemple — Le filtre anti-spam : impossible d'écrire toutes les règles, facile de montrer des milliers de mails déjà triés. Image réelle : capture de ton propre dossier spam, adresses floutées.
  - 5 Piège — Le ML n'est pas magique : il n'apprend que ce que contiennent ses exemples. Même le programme de Samuel partait d'une liste de critères fournie par son auteur.
- Faits vérifiés : (1) l'article de 1959 affirme qu'un ordinateur peut apprendre à jouer aux dames mieux que la personne qui l'a programmé, en 8 à 10 heures de jeu machine ; (2) les expériences de l'article ont tourné sur un IBM 704 ; (3) l'auteur fournissait une liste de critères pour juger une position (dont l'avance en pièces), et le programme apprenait lesquels utiliser et quel poids leur donner ; (4) en 1962, après des milliers de parties contre lui-même, le programme bat Robert Nealey, qui se présentait comme maître de dames (source : IBM). À ne pas écrire : la définition célèbre attribuée à Samuel, qu'on ne trouve pas dans l'article.
- **Épisode suivant :** 02 · « Mais à quoi ressemble un exemple, pour une machine ? »

#### 02 · Données, caractéristiques et étiquettes · Court

- **Accroche :** « Pour une machine, un exemple n'est qu'une ligne de nombres. »
- **Fond derrière le robot :** grille de données, une colonne mise en évidence
- **Termes introduits :** jeu de données, caractéristique, étiquette
- **Pages :**
  - 2 Ouverture — Une maison = surface, chambres, quartier, et son prix : une ligne d'un tableau.
  - 3 Mécanisme — Lignes = exemples, colonnes = caractéristiques, dernière colonne = étiquette.
  - 4 Piège — Le texte et les images doivent d'abord devenir des nombres.
- **Épisode suivant :** 03 · « Et quand on n'a pas d'étiquette ? »

#### 03 · Les trois familles d'apprentissage · Court

- **Accroche :** « Avec la réponse, sans la réponse, ou par essais et erreurs. »
- **Fond derrière le robot :** trois groupes de points distincts
- **Termes introduits :** supervisé, non supervisé, par renforcement, régression, classification
- **Pages :**
  - 2 Ouverture — Les trois grandes familles en trois colonnes, présentées comme des repères et non comme une liste complète.
  - 3 Comparaison — Prédire un prix (supervisé), regrouper des clients (non supervisé), apprendre à jouer (renforcement).
  - 4 Repère — Régression : prédire un nombre. Classification : prédire une catégorie. D'autres cadres existent, comme l'apprentissage auto-supervisé, qui reviendra avec les modèles de langage (59).
- **Épisode suivant :** 04 · « Mais concrètement, qu'est-ce qui apprend ? »

#### 04 · Modèle et paramètres · Court

- **Accroche :** « Un modèle, c'est une fonction avec des boutons de réglage. »
- **Fond derrière le robot :** famille de droites qui pivotent autour d'un point
- **Termes introduits :** modèle, paramètre θ, prédiction ŷ, entraînement
- **Pages :**
  - 2 Ouverture — ŷ = a·x + b : a et b sont les boutons.
  - 3 Comparaison — Changer a fait pivoter la droite, changer b la décale.
  - 4 Définition — Entraîner, c'est chercher les meilleurs réglages. Meilleurs selon quoi ?
- **Épisode suivant :** 05 · « Pour régler, il faut d'abord mesurer l'erreur. »

### Chapitre 2 · Apprendre de ses erreurs

Le cœur de la série : mesurer l'erreur, lire une pente, descendre. Les maths arrivent juste à temps.

#### 05 · La fonction de coût · Long

- **Accroche :** « Avant d'apprendre, une IA doit savoir à quel point elle se trompe. »
- **Fond derrière le robot :** nuage de points, une droite et les segments d'écart
- **Termes introduits :** erreur (résidu), fonction de coût J, erreur quadratique moyenne (MSE)
- **Pages :**
  - 2 Ouverture — Prédire, puis comparer : les écarts verticaux entre les points et la droite.
  - 3 Mécanisme — Pourquoi le carré : des erreurs toujours positives, et les grosses erreurs punies davantage. Revers : un seul point aberrant peut tirer toute la droite. La MSE est le coût de référence de la régression, pas de tous les problèmes.
  - 4 Formule — J = (1/n) Σ (ŷᵢ − yᵢ)².
  - 5 Comparaison — Une bonne droite et une mauvaise droite, avec leur J.
  - 6 Mécanisme — J selon le réglage a : une courbe en U, dont le creux est la meilleure droite.
- **Épisode suivant :** 06 · « Pour descendre vers ce creux, il faut savoir lire une pente. »

#### 06 · La pente d'une courbe : la dérivée · Court

- **Accroche :** « Savoir si ça monte ou si ça descend, et à quelle vitesse. »
- **Fond derrière le robot :** courbe avec des tangentes en plusieurs points
- **Termes introduits :** dérivée, tangente, pente
- **Pages :**
  - 2 Ouverture — La dérivée est la pente de la tangente en un point.
  - 3 Mécanisme — Positive : ça monte. Négative : ça descend. Nulle : c'est plat, comme au fond du creux.
  - 4 Exemple chiffré — J(a) = a², donc J′(a) = 2a. En a = 3, la pente vaut 6.
- **Épisode suivant :** 07 · « Mais un modèle a souvent des milliers de boutons. »

#### 07 · Le gradient · Court

- **Accroche :** « La pente, quand il y a plusieurs boutons à régler. »
- **Fond derrière le robot :** lignes de niveau avec des flèches perpendiculaires
- **Termes introduits :** dérivée partielle, gradient ∇J, lignes de niveau
- **Pages :**
  - 2 Ouverture — Une dérivée par paramètre, rangées dans un vecteur : le gradient ∇J.
  - 3 Mécanisme — Sur une carte de niveaux, ∇J pointe vers la montée la plus raide.
  - 4 Exemple chiffré — J(a, b) = a² + 3b², donc ∇J = (2a, 6b).
- **Épisode suivant :** 08 · « On sait où ça monte. Il suffit d'aller dans l'autre sens. »

#### 08 · La descente de gradient · Long

- **Accroche :** « Comment une IA apprend de ses erreurs, un pas à la fois. »
- **Fond derrière le robot :** lignes de niveau et chemin qui converge vers le centre (couverture validée)
- **Termes introduits :** taux d'apprentissage η, itération, convergence, oscillation, divergence
- **Pages :**
  - 2 Ouverture — Le modèle ne voit que la pente sous ses pieds, et fait un pas dans l'autre sens.
  - 3 Mécanisme — Avec un η fixe et un seul paramètre, le déplacement vaut η × la pente : pente forte, grand pas ; pente faible, petit pas. Les pas raccourcissent près du minimum.
  - 4 Comparaison — η trop petit : on avance à peine. Bien choisi : convergence. Trop grand : oscillation, puis divergence.
  - 5 Formule — θ ← θ − η∇J(θ), symbole par symbole.
  - 6 Exemple chiffré — J(θ) = θ², θ = 3, η = 0,1 : 3 → 2,4 → 1,92 → 1,536. L'erreur passe de 9 à 2,36.
  - 7 Piège — Pente nulle ne veut pas dire erreur nulle : au minimum, l'erreur peut rester élevée, et il faut alors changer de modèle.
- **Épisode suivant :** 09 · « Calculer la pente sur toutes les données à chaque pas, ça coûte cher. »

#### 09 · Descente stochastique et mini-lots · Long

- **Accroche :** « Apprendre vite, sans tout relire à chaque pas. »
- **Fond derrière le robot :** chemin bruité qui zigzague sur les lignes de niveau
- **Termes introduits :** descente stochastique (SGD), mini-lot, époque
- **Pages :**
  - 2 Ouverture — Calculer ∇J sur un million d'exemples à chaque pas, c'est lent.
  - 3 Comparaison — Tout le jeu : lent et régulier. Un exemple : rapide et bruité. Un mini-lot de 32 à 256 : le compromis.
  - 4 Mécanisme — Le chemin bruité arrive quand même près du minimum.
  - 5 Définition — Une époque = un passage complet sur toutes les données.
  - 6 Piège — Un η grand plus du bruit : le modèle ne se pose jamais. D'où un η qui décroît au fil des époques.
- **Épisode suivant :** 10 · « Et si la courbe avait plusieurs creux ? »

#### 10 · Minimums locaux et points selle · Court

- **Accroche :** « Le fond d'un creux n'est pas toujours le fond de la vallée. »
- **Fond derrière le robot :** courbe ondulée à plusieurs creux
- **Termes introduits :** minimum local, minimum global, point selle, fonction convexe
- **Pages :**
  - 2 Ouverture — Une courbe à deux creux : la descente s'arrête dans le premier.
  - 3 Mécanisme — Le point selle : plat dans une direction, en pente dans l'autre.
  - 4 Repère — Avec un coût convexe, comme la MSE d'une droite, tout minimum local est global : pas de faux creux, même si le fond peut être plat.
- **Épisode suivant :** 11 · « Mettons tout ensemble sur un premier vrai modèle. »

### Chapitre 3 · La régression

Premier vrai modèle : tout ce qui a été vu au chapitre 2 s'applique à une droite, puis à un plan, puis à une courbe.

#### 11 · La régression linéaire · Long

- **Accroche :** « Tracer la meilleure droite à travers les données. »
- **Fond derrière le robot :** nuage de points et droite ajustée
- **Prérequis :** 04, 05, 08
- **Termes introduits :** poids w, biais b, ajustement
- **Pages :**
  - 2 Ouverture — Le prix selon la surface : ŷ = w·x + b.
  - 3 Mécanisme — Une droite au hasard, puis MSE, gradient et pas, en boucle.
  - 4 Comparaison — La droite après 0, 10 et 100 itérations.
  - 5 Formule — ∂J/∂w = (2/n) Σ (ŷ − y)·x et ∂J/∂b = (2/n) Σ (ŷ − y).
  - 6 Piège — Une droite ne suit pas une relation courbe.
- **Épisode suivant :** 12 · « Le prix ne dépend pas que de la surface. »

#### 12 · La régression linéaire multiple · Court

- **Accroche :** « Plusieurs caractéristiques, un seul résultat. »
- **Fond derrière le robot :** plan incliné au-dessus d'un nuage de points en perspective
- **Termes introduits :** vecteur de poids, produit scalaire
- **Pages :**
  - 2 Ouverture — ŷ = w₁x₁ + w₂x₂ + … + b.
  - 3 Mécanisme — Avec deux caractéristiques, la droite devient un plan.
  - 4 Lecture — Chaque poids dit l'influence d'une caractéristique… si elles sont à la même échelle.
- **Épisode suivant :** 13 · « Justement : des m² et un nombre de chambres ne sont pas à la même échelle. »

#### 13 · Normaliser les données · Court

- **Accroche :** « Mettre toutes les caractéristiques sur la même échelle. »
- **Fond derrière le robot :** lignes de niveau très allongées qui deviennent rondes
- **Termes introduits :** normalisation, standardisation, moyenne μ, écart-type σ
- **Pages :**
  - 2 Ouverture — 120 m² contre 3 chambres : la vallée du coût est très allongée.
  - 3 Comparaison — Vallée allongée : la descente zigzague. Vallée ronde : elle va droit au but.
  - 4 Formule — x′ = (x − μ) / σ.
- **Épisode suivant :** 14 · « Et quand une droite ne suffit plus ? »

#### 14 · La régression polynomiale · Court

- **Accroche :** « Quand la relation n'est pas une ligne droite. »
- **Fond derrière le robot :** courbe qui épouse un nuage de points courbe
- **Termes introduits :** polynôme, degré
- **Pages :**
  - 2 Ouverture — Ajouter x² et x³ comme de nouvelles caractéristiques.
  - 3 Comparaison — Degré 1, 3 et 15 sur les mêmes points.
  - 4 Piège — Le degré 15 passe par tous les points… et rate les nouveaux. Avant-goût du chapitre 6.
- **Épisode suivant :** 15 · « Prédire un nombre, on sait faire. Et prédire une catégorie ? »

### Chapitre 4 · La classification

Passer d'un nombre à une catégorie : la sigmoïde, la probabilité, puis un coût fait pour elle.

#### 15 · La frontière de décision · Court

- **Accroche :** « Séparer les données en deux camps. »
- **Fond derrière le robot :** deux nuages de points séparés par une ligne
- **Prérequis :** 03
- **Termes introduits :** classe, frontière de décision, classification binaire
- **Pages :**
  - 2 Ouverture — Spam ou non-spam : deux classes.
  - 3 Mécanisme — Une droite qui sépare : d'un côté 0, de l'autre 1.
  - 4 Piège — Un 0 ou un 1 brut ne dit pas à quel point le modèle est sûr.
- **Épisode suivant :** 16 · « Il nous faut une sortie entre 0 et 1. »

#### 16 · La fonction sigmoïde · Court

- **Accroche :** « Écraser n'importe quel nombre entre 0 et 1. »
- **Fond derrière le robot :** courbe en S
- **Termes introduits :** sigmoïde σ, probabilité
- **Pages :**
  - 2 Ouverture — σ(z) = 1 / (1 + e⁻ᶻ).
  - 3 Mécanisme — z très négatif : 0. z = 0 : 0,5. z très positif : 1.
  - 4 Lecture — La sortie se lit comme une probabilité.
- **Épisode suivant :** 17 · « Branchons la sigmoïde sur une régression. »

#### 17 · La régression logistique · Long

- **Accroche :** « Transformer un score en probabilité. »
- **Fond derrière le robot :** courbe en S au-dessus de points alignés à 0 et à 1
- **Termes introduits :** score (logit), seuil de décision
- **Pages :**
  - 2 Ouverture — z = w·x + b, puis p = σ(z).
  - 3 Mécanisme — Les points à 0 et à 1, et la sigmoïde ajustée entre eux.
  - 4 Mécanisme — Le seuil 0,5 redonne la frontière de décision.
  - 5 Comparaison — Seuil 0,3, 0,5 ou 0,8 : un modèle plus ou moins prudent.
  - 6 Piège — Avec la sigmoïde, la MSE donne un coût qui n'est plus convexe (lien avec 10).
- **Épisode suivant :** 18 · « Il faut un coût fait pour les probabilités. »

#### 18 · L'entropie croisée · Long

- **Accroche :** « Punir une IA sûre d'elle… quand elle a tort. »
- **Fond derrière le robot :** courbe −log(p)
- **Termes introduits :** entropie croisée (log loss), logarithme
- **Pages :**
  - 2 Ouverture — Si la vraie classe est 1, le coût vaut −log(p).
  - 3 Exemple chiffré — p = 0,9 : coût 0,11. p = 0,1 : coût 2,3.
  - 4 Formule — J = −\[y·log(p) + (1 − y)·log(1 − p)\], en moyenne sur les exemples.
  - 5 Comparaison — MSE et entropie croisée face à une erreur commise avec assurance.
  - 6 Repère — Pour un modèle linéaire suivi de la sigmoïde, l'entropie croisée donne un coût convexe : tout minimum local est global.
- **Épisode suivant :** 19 · « Et s'il y a plus de deux classes ? »

#### 19 · La fonction Softmax · Long

- **Accroche :** « Choisir entre plusieurs réponses, avec des probabilités. »
- **Fond derrière le robot :** barres de probabilités de hauteurs différentes
- **Termes introduits :** logits, softmax, classification multi-classes, encodage one-hot
- **Pages :**
  - 2 Ouverture — Chat, chien ou oiseau : trois scores bruts deviennent trois probabilités.
  - 3 Mécanisme — Exponentielle de chaque score, puis division par la somme.
  - 4 Exemple chiffré — Scores (2 ; 1 ; 0,1) → probabilités (0,66 ; 0,24 ; 0,10).
  - 5 Formule — softmax(zᵢ) = e^zᵢ / Σⱼ e^zⱼ.
  - 6 Mécanisme — Avec l'entropie croisée : le coût vaut −log de la probabilité de la bonne classe.
- **Épisode suivant :** 20 · « Notre modèle prédit. Mais est-il bon ? »

### Chapitre 5 · Évaluer un modèle

Un modèle qui prédit n'est pas forcément un bon modèle : découper les données, puis choisir la bonne mesure.

#### 20 · Entraînement, validation, test · Court

- **Accroche :** « Ne jamais noter un élève sur ses propres exercices. »
- **Fond derrière le robot :** une barre de données découpée en trois blocs
- **Termes introduits :** jeu d'entraînement, jeu de validation, jeu de test, fuite de données
- **Pages :**
  - 2 Ouverture — Un découpage 70 / 15 / 15.
  - 3 Mécanisme — Le rôle de chacun : apprendre, régler, juger une seule fois.
  - 4 Piège — La fuite de données : normaliser (13) avant de découper laisse le jeu de test influencer l'entraînement. Bonne pratique : découper d'abord, calculer μ et σ sur l'entraînement seul, puis les appliquer aux trois jeux.
- **Épisode suivant :** 21 · « Juger, oui. Mais avec quelle mesure ? »

#### 21 · La matrice de confusion · Court

- **Accroche :** « Voir où le modèle se trompe, pas seulement combien. »
- **Fond derrière le robot :** grille 2 × 2 aux cases plus ou moins remplies
- **Termes introduits :** vrai positif, faux positif, vrai négatif, faux négatif, exactitude
- **Pages :**
  - 2 Ouverture — Le tableau 2 × 2 : ce qui était vrai, ce qui a été prédit.
  - 3 Exemple chiffré — 100 mails triés : lire chaque case.
  - 4 Piège — 99 % d'exactitude avec 1 % de fraudes : il suffit de répondre toujours « pas fraude ».
- **Épisode suivant :** 22 · « Il faut des mesures qui ne se laissent pas tromper. »

#### 22 · Précision, rappel et F1 · Long

- **Accroche :** « Ne pas crier au loup, et ne pas rater le loup. »
- **Fond derrière le robot :** deux jauges qui se répondent
- **Termes introduits :** précision, rappel, score F1
- **Pages :**
  - 2 Ouverture — Précision : parmi mes alertes, combien sont justes ?
  - 3 Mécanisme — Rappel : parmi les vrais cas, combien j'en attrape ?
  - 4 Comparaison — Filtre anti-spam ou dépistage d'une maladie : laquelle des deux compte le plus.
  - 5 Formule — F1 = 2PR / (P + R).
  - 6 Mécanisme — Déplacer le seuil (17) échange de la précision contre du rappel.
- **Épisode suivant :** 23 · « Et si on regardait tous les seuils à la fois ? »

#### 23 · La courbe ROC et l'AUC · Long

- **Accroche :** « Juger un modèle sur tous les seuils à la fois. »
- **Fond derrière le robot :** courbe ROC bombée au-dessus de la diagonale
- **Termes introduits :** taux de vrais positifs, taux de faux positifs, courbe ROC, AUC
- **Pages :**
  - 2 Ouverture — Chaque seuil donne un point.
  - 3 Mécanisme — On relie les points : la courbe ROC.
  - 4 Comparaison — Le hasard (diagonale, AUC 0,5), un bon modèle, le modèle parfait (AUC 1).
  - 5 Lecture — L'AUC = la probabilité de classer un positif au-dessus d'un négatif.
  - 6 Piège — Avec des classes très déséquilibrées, préférer la courbe précision-rappel.
- **Épisode suivant :** 24 · « Un seul découpage des données, c'est peut-être un coup de chance. »

#### 24 · La validation croisée · Court

- **Accroche :** « Tester cinq fois plutôt qu'une. »
- **Fond derrière le robot :** cinq barres découpées, le bloc de test qui se déplace
- **Termes introduits :** validation croisée à k plis, pli
- **Pages :**
  - 2 Ouverture — Cinq découpages : chaque bloc sert une fois de test.
  - 3 Mécanisme — La moyenne et l'écart des cinq scores.
  - 4 Repère — Précieux avec peu de données, coûteux avec beaucoup.
- **Épisode suivant :** 25 · « Excellent à l'entraînement, mauvais au test : que se passe-t-il ? »

### Chapitre 6 · Bien généraliser

Le vrai but n'est pas de réussir sur les exemples vus, mais sur ceux qu'on n'a jamais vus.

#### 25 · Sur-apprentissage et sous-apprentissage · Long

- **Accroche :** « Apprendre par cœur n'est pas comprendre. »
- **Fond derrière le robot :** courbes d'erreur d'entraînement et de validation qui s'écartent
- **Prérequis :** 14, 20
- **Termes introduits :** surapprentissage, sous-apprentissage, généralisation, capacité
- **Pages :**
  - 2 Ouverture — L'élève qui récite les corrigés sans les comprendre.
  - 3 Comparaison — Degré 1, 3 et 15 (rappel de 14) : trop simple, juste, trop complexe.
  - 4 Mécanisme — Les deux courbes d'erreur selon la complexité : l'écart se creuse.
  - 5 Diagnostic — Deux erreurs hautes : sous-apprentissage. Basse puis haute : surapprentissage.
  - 6 Remèdes — Plus de données, un modèle plus simple, la régularisation.
- **Épisode suivant :** 26 · « Derrière ces deux erreurs se cache un compromis. »

#### 26 · Le compromis biais-variance · Long

- **Accroche :** « Trop rigide ou trop nerveux : il faut choisir. »
- **Fond derrière le robot :** une cible avec des impacts groupés ou dispersés
- **Termes introduits :** biais, variance, bruit
- **Pages :**
  - 2 Ouverture — La cible : biais faible ou fort, variance faible ou forte.
  - 3 Mécanisme — Biais : se tromper toujours dans le même sens. Variance : changer d'avis selon les données.
  - 4 Mécanisme — L'erreur totale en U selon la complexité.
  - 5 Lien — Biais fort = sous-apprentissage, variance forte = surapprentissage.
  - 6 Piège — Le bruit des données : une erreur qu'aucun modèle ne peut supprimer.
- **Épisode suivant :** 27 · « Comment calmer un modèle trop nerveux ? »

#### 27 · La régularisation L2 · Court

- **Accroche :** « Freiner un modèle trop ambitieux. »
- **Fond derrière le robot :** une courbe tordue et sa version lissée
- **Termes introduits :** régularisation, pénalité, L2 (Ridge), λ
- **Pages :**
  - 2 Ouverture — J + λΣw² : les gros poids coûtent cher.
  - 3 Comparaison — λ nul, moyen, grand : courbe tordue, lisse, trop plate.
  - 4 Repère — λ se choisit avec le jeu de validation (20).
- **Épisode suivant :** 28 · « Et si on voulait carrément éteindre des caractéristiques ? »

#### 28 · La régularisation L1 · Court

- **Accroche :** « Garder l'essentiel, éteindre le reste. »
- **Fond derrière le robot :** un losange et un cercle posés sur les lignes de niveau
- **Termes introduits :** L1 (Lasso), parcimonie, sélection de caractéristiques
- **Pages :**
  - 2 Ouverture — J + λΣ|w|.
  - 3 Comparaison — L2 réduit tous les poids, L1 en met plusieurs exactement à zéro.
  - 4 Mécanisme — Le losange touche les lignes de niveau par un coin : un poids tombe à zéro.
- **Épisode suivant :** 29 · « Il existe une régularisation encore plus simple : s'arrêter à temps. »

#### 29 · L'arrêt précoce · Court

- **Accroche :** « Savoir s'arrêter au bon moment. »
- **Fond derrière le robot :** courbes d'erreur avec un repère vertical au minimum de validation
- **Prérequis :** 09
- **Termes introduits :** arrêt précoce, patience
- **Pages :**
  - 2 Ouverture — L'erreur de validation remonte : on arrête.
  - 3 Mécanisme — Garder le meilleur modèle, avec une patience de quelques époques.
  - 4 Repère — Gratuit et efficace, surtout pour les réseaux de neurones.
- **Épisode suivant :** 30 · « Changeons de famille : des modèles qui n'utilisent pas la descente de gradient. »

### Chapitre 7 · Les modèles classiques

D'autres façons d'apprendre, souvent sans descente de gradient, qui restent les meilleures sur beaucoup de données en tableau.

#### 30 · Les k plus proches voisins · Court

- **Accroche :** « Dis-moi qui sont tes voisins, je te dirai qui tu es. »
- **Fond derrière le robot :** un point central relié à ses voisins les plus proches
- **Termes introduits :** distance, k plus proches voisins (k-NN), vote majoritaire
- **Pages :**
  - 2 Ouverture — Un nouveau point prend la classe majoritaire de ses k voisins.
  - 3 Comparaison — k = 1, 5 et 25 : une frontière nerveuse ou lisse (lien avec 26).
  - 4 Piège — Sans normalisation (13), les distances sont faussées.
- **Épisode suivant :** 31 · « Et si le modèle posait plutôt des questions ? »

#### 31 · Les arbres de décision · Long

- **Accroche :** « Une suite de questions, oui ou non. »
- **Fond derrière le robot :** un arbre qui se ramifie
- **Termes introduits :** nœud, feuille, profondeur, impureté de Gini
- **Pages :**
  - 2 Ouverture — Un arbre qui décide d'accorder un prêt.
  - 3 Mécanisme — Chaque question découpe l'espace en rectangles.
  - 4 Mécanisme — La meilleure question est celle qui rend les groupes les plus purs.
  - 5 Comparaison — Profondeur 2, 5, puis illimitée.
  - 6 Piège — Un arbre trop profond apprend par cœur (25).
- **Épisode suivant :** 32 · « Un arbre seul est nerveux. Et une forêt ? »

#### 32 · Les forêts aléatoires · Court

- **Accroche :** « Mille arbres un peu différents valent mieux qu'un seul. »
- **Fond derrière le robot :** une rangée d'arbres stylisés
- **Termes introduits :** méthode d'ensemble, bagging, forêt aléatoire
- **Pages :**
  - 2 Ouverture — Chaque arbre voit un tirage différent des données et des caractéristiques.
  - 3 Mécanisme — Les arbres votent, et la variance baisse (26).
  - 4 Repère — La forêt mesure aussi quelles caractéristiques comptent le plus pour prédire. Attention : utile pour prédire ne veut pas dire cause.
- **Épisode suivant :** 33 · « Et si les arbres se corrigeaient l'un l'autre au lieu de voter ? »

#### 33 · Le gradient boosting · Long

- **Accroche :** « Chaque nouvel arbre corrige les erreurs du précédent. »
- **Fond derrière le robot :** un escalier de petits arbres alignés
- **Prérequis :** 08
- **Termes introduits :** boosting, apprenant faible
- **Pages :**
  - 2 Ouverture — L'arbre 1 prédit, l'arbre 2 prédit l'erreur restante, et ainsi de suite.
  - 3 Mécanisme — La prédiction s'approche de la cible, étape par étape.
  - 4 Lien — C'est une descente de gradient, faite arbre par arbre.
  - 5 Comparaison — Forêt : des arbres en parallèle. Boosting : des arbres en série.
  - 6 Repère — XGBoost et LightGBM, les références pour les données en tableau.
- **Épisode suivant :** 34 · « Revenons à la frontière : laquelle est la meilleure ? »

#### 34 · Les machines à vecteurs de support (SVM) · Long

- **Accroche :** « La frontière qui laisse le plus de marge. »
- **Fond derrière le robot :** deux nuages, une frontière et ses deux bandes de marge
- **Prérequis :** 15
- **Termes introduits :** marge, vecteurs de support, noyau
- **Pages :**
  - 2 Ouverture — Plusieurs droites séparent les deux classes : laquelle choisir ?
  - 3 Mécanisme — Celle qui laisse la plus grande marge. Seuls les points au bord comptent.
  - 4 Mécanisme — Données non séparables : l'astuce du noyau les sépare dans un autre espace.
  - 5 Comparaison — Noyau linéaire et noyau gaussien sur les mêmes données.
  - 6 Repère — La marge souple : tolérer quelques erreurs pour mieux généraliser.
- **Épisode suivant :** 35 · « Et sans aucune étiquette ? »

#### 35 · Le k-means · Long

- **Accroche :** « Former des groupes sans qu'on donne la réponse. »
- **Fond derrière le robot :** trois groupes de points autour de leurs centres
- **Prérequis :** 03
- **Termes introduits :** regroupement (clustering), centroïde, inertie
- **Pages :**
  - 2 Ouverture — Des clients regroupés selon leur comportement.
  - 3 Mécanisme — Chaque point rejoint le centre le plus proche, puis chaque centre se déplace au milieu de son groupe.
  - 4 Comparaison — Itérations 1, 2 et 5.
  - 5 Mécanisme — Choisir k avec la méthode du coude.
  - 6 Piège — Le résultat dépend du départ, et les groupes non ronds sont mal gérés.
- **Épisode suivant :** 36 · « Trop de caractéristiques pour voir quoi que ce soit ? »

#### 36 · L'analyse en composantes principales (ACP) · Long

- **Accroche :** « Résumer beaucoup de dimensions en quelques-unes. »
- **Fond derrière le robot :** un nuage allongé et ses deux axes principaux
- **Termes introduits :** réduction de dimension, composante principale, variance expliquée
- **Pages :**
  - 2 Ouverture — 100 caractéristiques : impossible à dessiner.
  - 3 Mécanisme — Trouver l'axe le long duquel les données s'étalent le plus.
  - 4 Mécanisme — Projeter sur deux axes : une carte en 2D.
  - 5 Lecture — La variance expliquée : la part d'information qu'on garde.
  - 6 Piège — Normaliser d'abord (13), sinon une caractéristique écrase les autres.
- **Épisode suivant :** 37 · « Place aux réseaux de neurones, en commençant par une seule cellule. »

### Chapitre 8 · Les réseaux de neurones

Du neurone seul au réseau profond, puis toutes les astuces qui le rendent entraînable. La divergence et la descente de gradient du chapitre 2 reviennent partout.

#### 37 · Le neurone artificiel · Court

- **Accroche :** « Une somme pondérée, puis une décision. »
- **Fond derrière le robot :** schéma d'un neurone : entrées, somme, sortie
- **Prérequis :** 17
- **Termes introduits :** neurone, somme pondérée, perceptron
- **Pages :**
  - 2 Ouverture — Entrées × poids + biais, puis activation, puis sortie.
  - 3 Lien — C'est exactement la régression logistique (17).
  - 4 Piège — Un seul neurone ne trace qu'une frontière droite : il échoue sur le XOR.
- **Épisode suivant :** 38 · « Tout se joue dans l'activation. »

#### 38 · Les fonctions d'activation · Long

- **Accroche :** « Sans elles, un réseau ne serait qu'une droite. »
- **Fond derrière le robot :** ReLU, sigmoïde et tanh superposées
- **Termes introduits :** fonction d'activation, non-linéarité, ReLU, tanh
- **Pages :**
  - 2 Ouverture — Empiler des couches linéaires donne toujours une droite.
  - 3 Comparaison — Sigmoïde, tanh et ReLU.
  - 4 Mécanisme — Leurs pentes : la sigmoïde devient plate aux extrémités.
  - 5 Repère — ReLU par défaut dans les couches cachées.
  - 6 Piège — Les neurones ReLU « morts », bloqués sur une pente nulle.
- **Épisode suivant :** 39 · « Assemblons les neurones en couches. »

#### 39 · Le réseau multicouche · Court

- **Accroche :** « Des couches de neurones qui apprennent à voir autrement. »
- **Fond derrière le robot :** réseau de nœuds en trois couches reliées
- **Termes introduits :** couche d'entrée, couche cachée, couche de sortie, réseau profond
- **Pages :**
  - 2 Ouverture — Le schéma à trois couches.
  - 3 Mécanisme — Chaque couche déforme l'espace : le XOR devient séparable.
  - 4 Repère — « Profond » veut simplement dire plusieurs couches cachées.
- **Épisode suivant :** 40 · « Comment l'information traverse-t-elle le réseau ? »

#### 40 · La propagation avant · Court

- **Accroche :** « Suivre un exemple de l'entrée jusqu'à la réponse. »
- **Fond derrière le robot :** réseau parcouru par un flux lumineux de gauche à droite
- **Termes introduits :** propagation avant, matrice de poids W
- **Pages :**
  - 2 Ouverture — Couche par couche : z = Wx + b, puis l'activation.
  - 3 Exemple chiffré — Un mini-réseau 2-2-1 calculé à la main.
  - 4 Lien — En sortie : softmax (19) et entropie croisée (18).
- **Épisode suivant :** 41 · « On a l'erreur en sortie. Comment remonter jusqu'au premier poids ? »

#### 41 · La rétropropagation · Long

- **Accroche :** « Remonter l'erreur, couche par couche. »
- **Fond derrière le robot :** réseau parcouru par des flèches en sens inverse
- **Prérequis :** 06, 08
- **Termes introduits :** rétropropagation, règle de la chaîne
- **Pages :**
  - 2 Ouverture — Chaque poids a sa part de responsabilité dans l'erreur.
  - 3 Mécanisme — La règle de la chaîne : les pentes se multiplient d'une couche à l'autre.
  - 4 Exemple chiffré — Le mini-réseau de l'épisode 40, en sens inverse.
  - 5 Mécanisme — Passe avant, passe arrière, mise à jour.
  - 6 Lien — C'est la descente de gradient (08) appliquée à tout le réseau.
- **Épisode suivant :** 42 · « Des pentes multipliées couche après couche… et si elles sont toutes petites ? »

#### 42 · Disparition et explosion du gradient · Long

- **Accroche :** « Quand le signal d'erreur s'éteint, ou explose. »
- **Fond derrière le robot :** flèches arrière de plus en plus fines
- **Termes introduits :** disparition du gradient, explosion du gradient, connexion résiduelle
- **Pages :**
  - 2 Ouverture — 0,25 multiplié dix fois par lui-même ≈ 0,000001.
  - 3 Mécanisme — Les premières couches n'apprennent presque plus.
  - 4 Comparaison — Sigmoïde (pente au plus 0,25) contre ReLU (pente 1).
  - 5 Mécanisme — L'explosion : des pentes supérieures à 1, et la divergence revient (08).
  - 6 Remèdes — ReLU, bonne initialisation, normalisation, connexions résiduelles.
- **Épisode suivant :** 43 · « Tout commence par le choix des poids de départ. »

#### 43 · L'initialisation des poids · Court

- **Accroche :** « Bien partir pour bien apprendre. »
- **Fond derrière le robot :** histogrammes de poids en forme de cloche
- **Termes introduits :** initialisation de Xavier, initialisation de He
- **Pages :**
  - 2 Ouverture — Tous les poids à zéro : tous les neurones apprennent la même chose.
  - 3 Comparaison — Poids trop petits, trop grands, bien réglés.
  - 4 Repère — Xavier avec tanh, He avec ReLU.
- **Épisode suivant :** 44 · « Bien partir, puis bien marcher : améliorons la descente elle-même. »

#### 44 · Les optimiseurs : momentum, RMSProp, Adam · Long

- **Accroche :** « Descendre plus vite, sans déraper. »
- **Fond derrière le robot :** plusieurs chemins sur les lignes de niveau, l'un zigzague, l'autre glisse
- **Prérequis :** 09, 13
- **Termes introduits :** momentum, RMSProp, Adam, taux d'apprentissage adaptatif
- **Pages :**
  - 2 Ouverture — La SGD zigzague dans les vallées étroites.
  - 3 Mécanisme — Le momentum : garder de l'élan d'un pas à l'autre.
  - 4 Mécanisme — RMSProp : un pas adapté à chaque paramètre.
  - 5 Comparaison — SGD, momentum et Adam sur la même vallée.
  - 6 Repère — Adam avec η = 0,001 : le réglage par défaut.
- **Épisode suivant :** 45 · « Un gros réseau surapprend vite. Comment l'en empêcher ? »

#### 45 · Le dropout · Court

- **Accroche :** « Éteindre des neurones au hasard pour mieux apprendre. »
- **Fond derrière le robot :** réseau dont certains nœuds sont grisés
- **Prérequis :** 25
- **Termes introduits :** dropout, taux de dropout
- **Pages :**
  - 2 Ouverture — À chaque pas, 20 à 50 % des neurones sont éteints.
  - 3 Mécanisme — Aucun neurone ne peut compter sur un autre : le réseau devient plus robuste.
  - 4 Piège — On ne l'applique qu'à l'entraînement, jamais en prédiction.
- **Épisode suivant :** 46 · « Dernière astuce : garder les valeurs internes sous contrôle. »

#### 46 · La normalisation par lots · Court

- **Accroche :** « Recalibrer chaque couche, à chaque lot. »
- **Fond derrière le robot :** des distributions décalées qui se recentrent
- **Prérequis :** 13
- **Termes introduits :** normalisation par lots (batch norm)
- **Pages :**
  - 2 Ouverture — La normalisation de l'épisode 13, mais à l'intérieur du réseau.
  - 3 Mécanisme — À l'entraînement : moyenne 0 et écart-type 1 sur chaque mini-lot, puis une échelle et un décalage appris. En prédiction : des moyennes gardées pendant l'entraînement, pas celles du lot.
  - 4 Repère — L'entraînement devient plus stable et accepte un η plus grand.
- **Épisode suivant :** 47 · « Pour les images, un réseau classique gaspille énormément de poids. »

### Chapitre 9 · Les réseaux spécialisés

Des architectures pensées pour la structure des données : l'espace des images, l'ordre des séquences, puis la réutilisation de ce qui a déjà été appris.

#### 47 · La convolution · Long

- **Accroche :** « Regarder une image par petites fenêtres. »
- **Fond derrière le robot :** grille de pixels et un filtre 3 × 3 qui glisse
- **Termes introduits :** convolution, filtre (noyau), carte de caractéristiques
- **Pages :**
  - 2 Ouverture — Une image de 1000 × 1000 pixels = un million d'entrées.
  - 3 Mécanisme — Un filtre 3 × 3 glisse sur toute l'image.
  - 4 Exemple chiffré — Un filtre qui détecte les bords verticaux.
  - 5 Mécanisme — Le partage des poids : le même filtre partout.
  - 6 Repère — Les filtres ne sont pas écrits à la main : ils sont appris.
- **Épisode suivant :** 48 · « Empilons les filtres pour construire un vrai réseau d'images. »

#### 48 · Le pooling et l'architecture d'un CNN · Court

- **Accroche :** « Des bords aux formes, puis aux objets. »
- **Fond derrière le robot :** une pile de couches qui rétrécissent
- **Termes introduits :** pooling, réseau convolutif (CNN)
- **Pages :**
  - 2 Ouverture — Le max-pooling garde la valeur la plus forte de chaque zone.
  - 3 Mécanisme — Couches basses : des bords. Couches hautes : des formes, puis des objets.
  - 4 Repère — Convolution, pooling, puis couches denses et softmax (19).
- **Épisode suivant :** 49 · « Les images ont un espace. Le texte et le son ont un ordre. »

#### 49 · Les réseaux récurrents (RNN) · Long

- **Accroche :** « Une mémoire qui passe d'un mot au suivant. »
- **Fond derrière le robot :** une boucle déroulée en chaîne de cellules
- **Termes introduits :** séquence, état caché, réseau récurrent (RNN)
- **Pages :**
  - 2 Ouverture — L'ordre compte : « le chien mord l'homme » n'est pas « l'homme mord le chien ».
  - 3 Mécanisme — L'état caché passe d'un mot au suivant.
  - 4 Mécanisme — Le réseau déroulé dans le temps.
  - 5 Lien — La rétropropagation (41) à travers le temps.
  - 6 Piège — Sur les longues phrases, le gradient disparaît (42).
- **Épisode suivant :** 50 · « Il faut une mémoire qui sait quoi garder. »

#### 50 · Les LSTM · Long

- **Accroche :** « Apprendre ce qu'il faut retenir, et ce qu'il faut oublier. »
- **Fond derrière le robot :** une cellule et ses trois portes
- **Termes introduits :** LSTM, porte d'oubli, porte d'entrée, porte de sortie, état de cellule
- **Pages :**
  - 2 Ouverture — Une voie rapide pour la mémoire.
  - 3 Mécanisme — La porte d'oubli décide ce qu'on efface.
  - 4 Mécanisme — Les portes d'entrée et de sortie décident ce qu'on écrit et ce qu'on lit.
  - 5 Lien — Pourquoi le gradient survit enfin (42).
  - 6 Repère — Le GRU, une version simplifiée.
- **Épisode suivant :** 51 · « Entraîner tout ça de zéro coûte cher. Et si on réutilisait ? »

#### 51 · L'apprentissage par transfert · Court

- **Accroche :** « Réutiliser ce qu'un autre modèle a déjà appris. »
- **Fond derrière le robot :** un réseau aux couches basses figées et aux couches hautes allumées
- **Termes introduits :** apprentissage par transfert, modèle pré-entraîné, couches gelées
- **Pages :**
  - 2 Ouverture — Un CNN entraîné sur des millions d'images sait déjà voir les bords.
  - 3 Mécanisme — Geler les premières couches, réentraîner les dernières.
  - 4 Repère — Peu de données ? Le transfert d'abord.
- **Épisode suivant :** 52 · « Le transfert a tout changé pour le langage. Mais d'abord : comment une machine lit-elle ? »

### Chapitre 10 · Le langage

Du texte découpé en morceaux jusqu'aux grands modèles de langage, pour finir sur un cas réel : la classification d'intention.

#### 52 · La tokenisation · Court

- **Accroche :** « Découper le texte en morceaux qu'une machine peut compter. »
- **Fond derrière le robot :** une phrase découpée en blocs
- **Prérequis :** 02
- **Termes introduits :** token, vocabulaire, sous-mot
- **Pages :**
  - 2 Ouverture — Des mots, des caractères ou des sous-mots.
  - 3 Exemple — Un mot rare découpé en sous-mots connus.
  - 4 Repère — Chaque token reçoit un numéro dans le vocabulaire.
- **Épisode suivant :** 53 · « Des numéros, oui. Mais comment en faire des caractéristiques ? »

#### 53 · Le sac de mots et le TF-IDF · Court

- **Accroche :** « Compter les mots pour représenter un texte. »
- **Fond derrière le robot :** barres de fréquence de mots
- **Termes introduits :** sac de mots, TF-IDF
- **Pages :**
  - 2 Ouverture — Un texte devient un vecteur de comptes.
  - 3 Mécanisme — TF-IDF : un mot fréquent ici mais rare ailleurs pèse lourd.
  - 4 Piège — L'ordre est perdu, et « bon » et « excellent » n'ont rien en commun.
- **Épisode suivant :** 54 · « Il faut des vecteurs qui portent le sens. »

#### 54 · Les embeddings · Long

- **Accroche :** « Quand les mots deviennent des points dans l'espace. »
- **Fond derrière le robot :** nuage de mots en 2D, regroupés par sens
- **Prérequis :** 36
- **Termes introduits :** embedding, vecteur dense, similarité cosinus
- **Pages :**
  - 2 Ouverture — Chaque mot devient un point dans un espace de quelques centaines de dimensions.
  - 3 Mécanisme — Les mots de sens proche sont proches dans l'espace.
  - 4 Formule — La similarité cosinus entre deux vecteurs.
  - 5 Exemple — roi − homme + femme ≈ reine.
  - 6 Repère — Les embeddings sont appris, comme des poids.
- **Épisode suivant :** 55 · « Comment apprend-on ces vecteurs ? »

#### 55 · Word2Vec · Long

- **Accroche :** « Un mot se définit par les mots qui l'entourent. »
- **Fond derrière le robot :** un mot central relié à ses voisins dans une fenêtre
- **Termes introduits :** contexte, fenêtre, skip-gram, CBOW
- **Pages :**
  - 2 Ouverture — On reconnaît un mot à ses fréquentations.
  - 3 Mécanisme — Skip-gram : prédire les voisins à partir du mot.
  - 4 Mécanisme — CBOW : prédire le mot à partir de ses voisins.
  - 5 Lien — Un petit réseau, une softmax (19) et une descente de gradient (08).
  - 6 Piège — Un seul vecteur par mot : « avocat », le fruit ou le métier ?
- **Épisode suivant :** 56 · « Il faut un sens qui dépende du contexte. »

#### 56 · Le mécanisme d'attention · Long

- **Accroche :** « Savoir sur quels mots se concentrer. »
- **Fond derrière le robot :** liens pondérés entre les mots d'une phrase
- **Prérequis :** 49
- **Termes introduits :** attention, poids d'attention
- **Pages :**
  - 2 Ouverture — Traduire une longue phrase : un RNN oublie le début.
  - 3 Mécanisme — À chaque mot produit, regarder tous les mots d'entrée, avec des poids.
  - 4 Mécanisme — Ces poids viennent d'une softmax (19).
  - 5 Exemple — La carte d'attention d'une traduction.
  - 6 Lien — Fini l'oubli des longues phrases.
- **Épisode suivant :** 57 · « Et si chaque mot regardait tous les mots de sa propre phrase ? »

#### 57 · L'auto-attention · Long

- **Accroche :** « Chaque mot regarde tous les autres. »
- **Fond derrière le robot :** matrice d'attention aux cases plus ou moins claires
- **Prérequis :** 54
- **Termes introduits :** auto-attention, requête, clé, valeur, tête d'attention
- **Pages :**
  - 2 Ouverture — « Il a posé l'avocat sur la table » : quel sens pour « avocat » ?
  - 3 Mécanisme — Requête, clé, valeur : comme une recherche dans une bibliothèque.
  - 4 Formule — softmax(QKᵀ / √d) · V.
  - 5 Exemple — La matrice d'attention de la phrase.
  - 6 Repère — Plusieurs têtes : plusieurs façons de regarder la phrase.
- **Épisode suivant :** 58 · « Empilons l'auto-attention : voici le Transformer. »

#### 58 · Le Transformer · Long

- **Accroche :** « L'architecture derrière les grands modèles de langage. »
- **Fond derrière le robot :** blocs empilés reliés par des flèches résiduelles
- **Prérequis :** 42, 46
- **Termes introduits :** Transformer, encodage de position, encodeur, décodeur
- **Pages :**
  - 2 Ouverture — Auto-attention et réseau dense, empilés N fois.
  - 3 Mécanisme — L'encodage de position redonne l'ordre des mots.
  - 4 Mécanisme — Connexions résiduelles et normalisation : entraîner très profond (42).
  - 5 Comparaison — RNN : mot par mot. Transformer : toute la phrase en parallèle.
  - 6 Repère — Encodeur (BERT) et décodeur (GPT).
- **Épisode suivant :** 59 · « Que fait un décodeur, au juste ? Il prédit le token suivant. »

#### 59 · Le modèle de langage · Long

- **Accroche :** « Prédire le token suivant, encore et encore. »
- **Fond derrière le robot :** barres de probabilités pour le token suivant
- **Termes introduits :** modèle de langage, génération, pré-entraînement, LLM
- **Pages :**
  - 2 Ouverture — « Le chat dort sur le… » : les tokens candidats (canapé, lit, toit) avec leurs probabilités.
  - 3 Mécanisme — Une softmax (19) sur tout le vocabulaire de tokens (52).
  - 4 Mécanisme — Générer (le décodage) : choisir un token, l'ajouter, recommencer.
  - 5 Lien — Le coût est l'entropie croisée (18), sur des milliards de phrases.
  - 6 Repère — C'est le principe des grands modèles de langage (LLM).
- **Épisode suivant :** 60 · « Mais comment choisir le mot parmi ces probabilités ? »

#### 60 · La température et l'échantillonnage · Court

- **Accroche :** « Régler la créativité d'un modèle. »
- **Fond derrière le robot :** barres de probabilités plus ou moins aplaties
- **Termes introduits :** température, échantillonnage, top-k, top-p
- **Pages :**
  - 2 Ouverture — Diviser les logits par T avant la softmax.
  - 3 Comparaison — T = 0,2, 1 et 2 : distribution plus concentrée, inchangée, plus aplatie. La température change la diversité des réponses, pas leur justesse.
  - 4 Repère — Top-k et top-p : ne tirer que parmi les tokens les plus probables.
- **Épisode suivant :** 61 · « Un modèle généraliste. Comment le spécialiser ? »

#### 61 · Le fine-tuning · Court

- **Accroche :** « Spécialiser un modèle géant avec peu de données. »
- **Fond derrière le robot :** une courbe de coût qui repart d'un point déjà bas
- **Prérequis :** 51
- **Termes introduits :** fine-tuning, LoRA
- **Pages :**
  - 2 Ouverture — Le transfert (51) appliqué au langage.
  - 3 Mécanisme — Continuer l'entraînement sur ses propres exemples, avec un petit η.
  - 4 Repère — LoRA : n'entraîner que de petites matrices ajoutées au modèle.
- **Épisode suivant :** 62 · « Mettons tout ça en pratique sur un vrai projet. »

#### 62 · La classification d'intention · Long

- **Accroche :** « Comprendre ce que l'utilisateur veut vraiment dire. »
- **Fond derrière le robot :** des phrases qui convergent vers des catégories d'intention
- **Prérequis :** 19, 22, 61
- **Termes introduits :** intention, assistant conversationnel
- **Pages :**
  - 2 Ouverture — « Je veux payer ma facture » → l'intention « paiement ».
  - 3 Mécanisme — Texte, tokens, embeddings, modèle, puis softmax sur les intentions.
  - 4 Exemple — Sur les jeux publics Snips et ATIS (Chen, Zhuo et Wang, 2019) : des phrases, leurs intentions, et la précision obtenue.
  - 5 Évaluation — Matrice de confusion (21) et F1 (22) par intention.
  - 6 Piège — Les intentions proches, et les phrases hors sujet.
- **Épisode suivant :** fin de la saison 1, avec un post-bilan qui renvoie vers toute la série.

## 5. Charte graphique

Toutes les valeurs ci-dessous viennent du canevas Claude Design « Théta (θ) — Gabarits officiels », qui contient le carrousel de référence complet de l'épisode 08 (8 pages : couverture, ouverture, mécanisme, comparaison, formule, exemple chiffré, piège, fin). C'est la seule source de style pour l'agent ; l'ancien canevas « Descente de gradient » ne sert plus que d'archive. L'agent les reprend telles quelles, sans les réinterpréter.

### Format

- Page : 1080 × 1350 px (portrait 4:5), export en PDF pour le carrousel LinkedIn.
- Marges : 72 px en haut, 80 px sur les côtés, 56 px en bas.
- Toutes les pages d'un carrousel ont le même format.

### Couleurs

| Rôle | Pages claires | Couverture (sombre) | Page de fin |
| --- | --- | --- | --- |
| Fond | #FFFFFF | #0A0F17 | #EEF2F8 |
| Texte principal | #0E1116 | #F5F8FC | #0E1116 |
| Texte courant | #3E4450 | #A7B3C2 | #3E4450 |
| Texte secondaire, étiquettes | #5F6673 | #8A97A8 | #5F6673 |
| Filets | #E4E6EA | #1E2938 | #D5DCE6 |
| Accent | #2D5BFF | #4C8DFF | #2D5BFF |
| Alerte (divergence, piège) | #C2410C | — | — |

### Typographie

| Usage | Police | Taille | Graisse |
| --- | --- | --- | --- |
| Titre de couverture et d'ouverture | Geist | 104 à 108 px, interlettrage −0,035 em | 600 |
| Titre de page de contenu | Geist | 54 px, interlettrage −0,03 em | 600 |
| Texte d'explication | Geist | 27 à 28 px, interligne 1,45 | 400 |
| Points à retenir (fin) | Geist | 38 px | 500 |
| En-tête, étiquettes, numéros | Geist Mono, majuscules, interlettrage 0,12 em | 15 à 17 px | 500 |
| Formules et symboles | STIX Two Text, italique pour les variables | 26 à 62 px | 400 |

### Composants fixes

- **En-tête** : « Nº XX » en accent, puis le nom du chapitre à gauche ; « page / total » à droite. Sur la couverture, le nom de la série (« θ Théta », le symbole en STIX italique accent) remplace le numéro de page.
- **Pied de page** : filet, « Ladji Lama Kamagate » à gauche, « Glissez → » à droite sur toutes les pages sauf la dernière.
- **Étiquette de type** : au-dessus du titre de chaque page de contenu (MÉCANISME, COMPARAISON, FORMULE…), en Geist Mono accent.
- **Robot** : le même dessin vectoriel sur toutes les couvertures (de face, casque cuivré, visière noire, yeux bleus) et sur la page de fin (yeux souriants, baguette).

**Nom de la série : Théta (θ).** Le symbole des paramètres d'un modèle, présent dans presque chaque épisode. Il s'écrit toujours avec le symbole et le nom ensemble (« θ Théta »), pour rester lisible par un lecteur non technique. Sous-titre : « le Machine Learning, une notion à la fois ». Hashtag de série proposé : #ThetaML, à vérifier sur LinkedIn avant le lancement.

### Visuels

- Courbes calculées à partir de la vraie formule, trait noir de 3 px ; chemins et points en accent ; minimum marqué par un cercle blanc cerclé de noir.
- Pas de dégradé de fond, pas d'ombre portée sur les pages claires, pas d'emoji.
- Fond de couverture : le motif du sujet indiqué dans la banque, en traits accent de faible opacité, plus lumineux près du robot.

## 6. Règles de rédaction pour l'agent

L'agent ne rédige jamais un épisode de mémoire : il part de la fiche de la banque, vérifie chaque affirmation dans les références de l'onglet Références, puis applique la charte.

### Les étapes de production d'un épisode

1. **Lire la fiche** de l'épisode (section 4) et celles des prérequis, pour reprendre les mêmes mots.
2. **Lire les références** de l'épisode et noter, pour chaque page, la phrase de la source qui la justifie.
3. **Choisir les types de pages** utiles au sujet, dans l'ordre conseillé (section 1).
4. **Rédiger le texte de chaque page**, dans les limites de mots.
5. **Calculer les visuels** à partir des formules, avec les valeurs écrites dans la fiche.
6. **Lancer les vérifications** ci-dessous, puis produire le carrousel et le texte LinkedIn.
7. **Rendre une note de relecture** : les points à vérifier par toi, et la source de chaque formule et de chaque chiffre.

### Les vérifications obligatoires

- [ ] Chaque formule est identique à celle d'une référence, aux notations près.
- [ ] Chaque exemple chiffré est recalculé, pas recopié.
- [ ] Aucun terme n'apparaît avant d'avoir été introduit (cet épisode ou un épisode précédent).
- [ ] Chaque symbole est défini à sa première apparition.
- [ ] 40 mots maximum sur l'ouverture, 70 sur une page de contenu.
- [ ] La page de fin n'apporte rien de nouveau.
- [ ] L'épisode suivant annoncé correspond à la banque.

### La validation scientifique

Une source citée ne prouve pas qu'une interprétation est juste, et un calcul exact peut illustrer un raisonnement faux. Le relecteur répond donc, pour chaque page qui affirme quelque chose, à quatre questions écrites dans relecture.md :

1. **Hypothèse** : sous quelles conditions l'affirmation est-elle vraie (une dimension, η fixe, modèle linéaire, classes équilibrées…) ?
2. **Domaine de validité** : ces conditions sont-elles dites ou évidentes pour le lecteur ? Sinon, il faut les écrire.
3. **Contre-exemple** : quel cas simple contredirait l'affirmation si elle était généralisée ?
4. **Raccourci assumé** : s'il s'agit d'une simplification volontaire, est-elle signalée (« dans le cas le plus simple », « ici ») ?

Une réponse manquante ou un contre-exemple non traité est un avertissement scientifique : il remonte en tête du rapport de relecture.

### Erreurs, avertissements et désaccords

| Niveau | Exemples | Ce que fait l'agent |
| --- | --- | --- |
| Erreur bloquante | Schéma invalide, texte qui déborde, terme non introduit, chiffre sans fonction de calcul | Corrige, au plus 2 essais, puis s'arrête et le signale |
| Avertissement | Mots proches de la limite, image manquante, formulation lourde | Ne bloque pas, le liste dans le rapport |
| Désaccord scientifique | Deux sources divergent, contre-exemple non traité, hypothèse implicite | Ne corrige jamais seul : il expose les deux versions et te laisse trancher |

Chaque correction automatique est consignée dans le rapport : ce qui a échoué, ce qui a été changé, et la phrase avant et après. Une correction qui fait passer un contrôle en retirant une nuance scientifique est interdite : l'agent doit préférer un avertissement.

### L'usage des références

- **Cours de référence** : pour l'intuition, le vocabulaire et les exemples.
- **Source originale** : pour la formule exacte, la date et le nom des auteurs.
- **En cas de désaccord** entre deux sources, l'agent le signale dans la note de relecture au lieu de trancher seul.
- **Les sources ne sont jamais recopiées** : l'agent reformule, et ne cite qu'une courte phrase au plus.
- **Un chiffre réel** vient de toi, jamais de l'agent.

### Les images réelles

- **Uniquement des images dont la licence est vérifiée** : domaine public, licence libre, image fournie par une institution pour la presse, ou capture que tu as faite toi-même.
- **Crédit sous chaque image**, en Geist Mono 14 px, au format « Photo : source, année ».
- **Légende factuelle** : ce que montre l'image, rien de plus. Une photo d'un IBM 704 à Lawrence Livermore n'est pas « l'ordinateur de Samuel ».
- **Jamais d'image générée par IA présentée comme réelle**, et jamais de capture contenant des données personnelles non floutées.
- **L'agent ne télécharge pas les images lui-même** : il indique la source exacte, tu la récupères et tu la déposes dans le dossier du projet.

**Le traitement visuel**, pour qu'une image réelle se fonde dans le carrousel au lieu de trancher (modèles : pages « Contexte » et « Exemple » du canevas des gabarits) :

| Règle | Photo (page Contexte) | Capture d'écran (page Exemple) |
| --- | --- | --- |
| Place | Dans la colonne du texte, 920 px de large, jamais en pleine page | Idem |
| Format | 920 × 520 px, recadrée au centre | 920 × 430 px sous une barre de fenêtre neutre de 44 px |
| Couleurs | Noir et blanc, contraste +8 %, voile bleu d'accent à 8 % | Noir et blanc, contraste +4 % |
| Contour | Coins arrondis 20 px, filet 1 px #E4E6EA | Idem |
| Annotation | Aucune, ou un seul repère accent | Un cadre accent arrondi autour de la ligne utile, une étiquette courte |
| Légende | À gauche, Geist 20 px, ce que montre l'image | Idem |
| Crédit | À droite, Geist Mono 14 px, « Photo : source, année » | « Capture : Ladji Lama Kamagate » |

Le noir et blanc sert deux buts : les photos d'archive le sont déjà, et une capture colorée (logos, boutons) ne vient pas concurrencer le bleu d'accent. Une seule image réelle par page, et au plus deux par carrousel.

## 7. Texte LinkedIn du post

Le texte accompagne le carrousel sans le répéter : il donne envie d'ouvrir, puis lance la discussion. Il fait entre 120 et 220 mots.

| Partie | Contenu | Exemple (épisode 08) |
| --- | --- | --- |
| Accroche | 2 lignes maximum, visibles avant « voir plus » | Un modèle de Machine Learning n'apprend pas comme nous. Il descend une pente. |
| Intuition | 2 à 4 phrases, une image mentale | Imaginez un bol : la hauteur est l'erreur, le fond est le meilleur modèle. |
| Promesse du carrousel | Ce que le lecteur va comprendre en le parcourant | Dans le carrousel : pourquoi les pas raccourcissent, et ce qui se passe quand η est mal réglé. |
| Question | Une question ouverte pour les commentaires | Quelle notion de ML vous a le plus bloqué au début ? |
| Signature de série | Numéro, série, épisode suivant | Nº 08 · Théta (θ), le Machine Learning une notion à la fois. Prochain épisode : descente stochastique. |
| Hashtags | 3 à 5, toujours les mêmes plus un propre au sujet | #MachineLearning #IntelligenceArtificielle #DataScience + #DeepLearning |

- Ton : clair, rigoureux, vouvoiement.
- Pas de lien externe dans le texte ; les références peuvent aller en premier commentaire.
- Une formule au plus dans le texte, écrite en clair (θ ← θ − η∇J).

## 8. Mesurer et ajuster

L'objectif est la visibilité auprès des recruteurs : on suit donc à la fois l'audience de la série et ce qu'elle déclenche sur ton profil.

| Indicateur | Où le lire | Quand |
| --- | --- | --- |
| Impressions et réactions par post | Statistiques du post | 48 h et 7 jours après publication |
| Enregistrements et partages | Statistiques du post | 7 jours après publication |
| Visites du profil | Statistiques du profil | Chaque semaine |
| Nouveaux abonnés | Statistiques du profil | Chaque semaine |
| Messages et invitations de recruteurs | Messagerie, à compter à la main | Chaque semaine |

**Le bilan tout****e****s les 4 semaines** sert à décider, chiffres à l'appui :

- quel format garder en priorité, court ou long ;
- quels types de pages retiennent le mieux (les enregistrements sont le meilleur signal pour un carrousel éducatif) ;
- le jour et l'heure de publication ;
- s'il faut ralentir le rythme plutôt que baisser la qualité.

L'agent peut préparer ce bilan à partir des chiffres que tu lui transmets ; il ne lit pas tes statistiques LinkedIn lui-même.

## 9. Décisions pour l'automatisation

Ces décisions fixent tout ce que l'agent devrait sinon te demander une fois le code lancé. Une fois exportées dans le dépôt, elles ne se discutent plus en prompt : on modifie le fichier concerné.

### 9.1 Le dépôt est la seule source de vérité (points 1 et 2)

- Avant le premier codage, ce document est exporté une fois dans le dépôt. Ensuite, Claude Code ne lit plus que le dépôt.
- Ce document et les deux canevas Claude Design deviennent des archives de conception. Une modification future se fait dans le fichier du dépôt, avec un commit qui la décrit.
- Organisation des fichiers exportés :

| Fichier | Contenu |
| --- | --- |
| banque/episodes/NN-titre.yaml | Une fiche par épisode : numéro, saison, chapitre, titre, accroche, fond de couverture, format, prérequis, termes introduits (avec leurs formes), pages, épisode suivant, références, images, faits vérifiés |
| charte/charte.yaml | Couleurs, polices, tailles, marges, composants |
| charte/regles-redaction.md | Sections 1, 2 et 6 : fil de lecture, limites de mots, vérifications, images réelles |
| charte/typographie.md | Règles du point 9.4 |
| charte/texte-linkedin.md | Section 7 |
| calendrier.yaml | Saisons, dates prévues, jours de publication |
| etat.yaml | Où en est chaque épisode (voir 9.6) |

**Provenance de l'export.** Le kit garde un fichier provenance.yaml : version du document exporté, date, nombre de fiches et de références. Au jalon 1, Claude Code compare ces nombres à ceux du dépôt. Toute modification ultérieure d'une fiche passe par un commit qui en donne la raison.

### 9.2 Les gabarits sont convertis une seule fois (point 3)

- Chaque type de page du canevas « Gabarits officiels » devient un gabarit HTML classique, avec une feuille de style commune construite à partir de charte.yaml.
- La conversion est validée une fois, en comparant le rendu de chaque gabarit à la page du canevas. Après cette validation, on ne redessine plus : on remplit.
- Le rendu final passe par Chromium : une image PNG par page, puis un PDF qui les assemble.

### 9.3 Formats et cas limites (points 8 et 9)

- **Format court** : 4 à 6 pages, couverture et fin comprises. **Format long** : 7 à 9 pages. Jamais plus de 9.
- **Ligne de rappel de l'ouverture** : elle cite les numéros des prérequis. Pour l'épisode 01, elle devient « Épisode 1 · Saison 1 ».

| Situation | « Épisode suivant » sur la page de fin |
| --- | --- |
| Épisode ordinaire | Numéro, titre et phrase de transition de l'épisode suivant |
| Dernier épisode d'une saison | « Prochainement : le bilan de la saison N » |
| Post bilan de saison | « Saison N+1 : reprise le \[date du calendrier\] » |
| Épisode 62 | « Fin de la série · merci de l'avoir suivie », puis bilan de la saison 4 |

### 9.4 Typographie française (point 13)

Appliquée automatiquement par le générateur, sur tous les textes, avant le rendu. L'agent n'a pas à y penser.

| Règle | Exemple |
| --- | --- |
| Espace fine insécable avant ; ! ? | Pourquoi ? |
| Espace insécable avant : et à l'intérieur des guillemets | « exemple » : |
| Virgule décimale partout, formules comprises | η = 0,1 |
| Espace fine insécable entre milliers | 10 000 |
| Signe moins mathématique, pas de trait d'union | −6 |
| Signe de multiplication | η × la pente |
| Apostrophe typographique | l’erreur |
| Majuscules accentuées | À retenir |
| Pas de coupure entre un nombre et son unité, ni entre Nº et le numéro | Nº 08 |

### 9.5 Ce qui reste à ta charge (points 15, 16 et 17)

Trois étapes humaines sont gardées, chacune préparée par l'agent pour durer quelques minutes.

**Les images réelles, une fois par saison.**

- Au début de chaque saison, l'agent produit images-a-fournir.md : pour chaque image, l'épisode, la page, la source exacte, la licence, le crédit, le nom de fichier attendu et la zone à garder au recadrage.
- Tu déposes les fichiers dans assets/images/, déjà floutés si ce sont des captures. Le générateur applique seul le traitement de la charte (noir et blanc, voile, recadrage, coins, crédit).
- Si une image manque, la page est rendue dans sa variante sans image et le rapport de relecture le signale. La génération ne s'arrête pas.

**La relecture, à chaque épisode.** L'agent produit relecture.md, une page au plus :

- chaque chiffre et chaque formule, avec sa source et l'extrait qui la justifie ;
- les phrases où il a un doute, mises en évidence ;
- les résultats des contrôles automatiques (mots, termes, débordements, calculs).

Tu lis, tu corriges si besoin, puis tu passes l'épisode au statut « relu ». Rien n'est prêt à publier sans ce statut.

**La publication, à la main.** Pour chaque épisode relu, l'agent prépare publier/NN/ :

- le PDF du carrousel, avec un nom de fichier sans caractère spécial (01-qu-est-ce-que-le-machine-learning.pdf), et titre.txt, le titre à saisir dans LinkedIn au moment d'ajouter le document (« Nº 01 · Qu’est-ce que le Machine Learning ? ») ;
- texte.txt, le texte du post, prêt à coller ;
- premier-commentaire.txt, avec les sources ;
- les aperçus PNG ;
- la date et l'heure prévues par le calendrier.

Tu publies, puis tu passes l'épisode au statut « publié » avec la date.

### 9.6 Les statuts d'un épisode

Un épisode passe par cinq statuts, enregistrés dans etat.yaml : à faire, généré, relu, publié, puis bilan (ses statistiques sont saisies). C'est ce fichier qui permet à l'agent de savoir où on en est sans que tu le lui expliques.

### 9.7 Le calendrier de publication

Les semaines alternent 2 et 3 posts, soit 2,5 en moyenne. Les heures sont celles d'Abidjan (GMT), qui ne change pas d'heure.

| Semaine | Mardi 8 h 30 | Jeudi 8 h 30 | Samedi 10 h |
| --- | --- | --- | --- |
| Impaire | épisode | épisode | épisode |
| Paire | épisode | épisode | — |

- **Pourquoi ces créneaux** : des matins de semaine pour toucher les recruteurs et les étudiants au début de leur journée, avec au moins un jour d'écart entre deux posts. Le samedi, plus calme, reçoit le troisième post.
- **C'est une hypothèse de départ**, pas une certitude : le premier bilan des 4 semaines (section 8) compare les créneaux et les ajuste avec tes vrais chiffres.
- **Saison 1** : 19 épisodes et 1 bilan, soit 20 posts sur 8 semaines (4 semaines à 3 posts, 4 à 2).
- **Date de lancement** : fixée à la fin de la construction, quand les 4 premiers épisodes sont générés et relus d'avance. Le générateur calcule ensuite toutes les dates dans calendrier.yaml.
- **Avance de sécurité** : on garde toujours au moins 4 épisodes relus et prêts d'avance. En dessous, l'agent le signale dans son rapport.

## 10. Bibliothèque visuelle (points 5, 6 et 7)

Tout visuel de la série appartient à l'une des familles ci-dessous, dessinées sur deux planches du canevas des gabarits. Un épisode choisit une famille et lui donne des paramètres ; il n'invente jamais de nouvelle forme.

### Les familles

| Famille | Paramètres | Couvertures | Pages intérieures |
| --- | --- | --- | --- |
| Nuage de points | points, droite ou frontière, écarts, groupes | 13 | régression, classes, groupes, embeddings |
| Courbe | fonction, points sur la courbe, courbe fantôme | 12 | coûts, tangentes, sigmoïde, ROC |
| Réseau | nœuds par couche, liens, sens, nœuds éteints | 12 | neurones, couches, attention entre mots |
| Barres | valeurs, barre dominante, étiquette | 7 | probabilités, fréquences, distributions |
| Lignes de niveau | forme de la vallée, chemin, bruit | 6 | gradient, optimiseurs, normalisation |
| Blocs | découpage, proportions, empilement | 5 | jeux de données, tokens, couches |
| Grille | taille, intensités, fenêtre mise en évidence | 4 | matrices, confusion, attention, pixels |
| Arbre | profondeur, branche suivie, classes des feuilles | 3 | arbres, forêts, boosting |
| Flux | boîtes, flèches, boucle de retour | — | principes et étapes (pages intérieures seulement) |

Code couleur commun : sur les pages claires, noir pour l'objet étudié, bleu d'accent pour ce qui bouge ou ce qu'on montre, gris clair pour le contexte ; sur la couverture, tout est en bleu d'accent à des opacités différentes.

### L'affectation des 62 couvertures

| Famille | Épisodes |
| --- | --- |
| Nuage de points | 01, 03, 05, 11, 12, 14, 15, 26, 30, 34, 35, 36, 54 |
| Courbe | 04, 06, 10, 16, 17, 18, 23, 25, 27, 29, 38, 61 |
| Réseau | 37, 39, 40, 41, 42, 45, 49, 50, 51, 55, 56, 62 |
| Barres | 19, 22, 43, 46, 53, 59, 60 |
| Lignes de niveau | 07, 08, 09, 13, 28, 44 |
| Blocs | 20, 24, 48, 52, 58 |
| Grille | 02, 21, 47, 57 |
| Arbre | 31, 32, 33 |

Deux épisodes consécutifs peuvent partager une famille : leurs paramètres doivent alors les distinguer (par exemple, 07 montre des flèches perpendiculaires aux niveaux, 08 un chemin qui converge).

### Les règles d'usage

- **Comparaison** : 2 ou 3 fois le même visuel, avec les mêmes axes, en ne changeant qu'un paramètre.
- **Tableau, formule et image réelle** ont leurs propres gabarits de page, hors bibliothèque.
- **Un besoin non couvert** (par exemple un schéma de cellule LSTM trop riche pour la famille Réseau) est signalé dans le rapport de relecture. Il passe par une étape de design, puis rejoint la bibliothèque ; l'agent ne l'improvise pas.

### Le post bilan de saison

Trois pages, avec les gabarits « Bilan » du canevas :

1. **Couverture** : le robot au centre d'une orbite de numéros, un par épisode de la saison, de plus en plus lumineux d'un chapitre à l'autre.
2. **Sommaire** : les épisodes groupés par chapitre, sur deux colonnes.
3. **Fin** : le gabarit de fin habituel, avec « Saison N+1 : reprise le \[date\] » (voir 9.3).

## 11. L'automatisation dans VS Code

**Le principe : l'IA écrit le fond, le code fixe la forme.** L'agent ne produit qu'un fichier de contenu structuré par épisode : des textes et des paramètres de visuels. Il n'écrit jamais de HTML, de CSS ou de SVG. Tout le reste (mise en page, dessins, typographie, rendu, contrôles) est fait par du code déterministe : deux générations du même contenu donnent exactement les mêmes images. C'est ce qui empêche le style de dériver.

### 11.1 D'où l'on part, où l'on va

|  | Aujourd'hui | À la fin de la construction |
| --- | --- | --- |
| Contenu | Ce document : banque, règles, références | Une fiche YAML par épisode dans le dépôt |
| Style | Deux canevas Claude Design | Gabarits HTML, feuille de style et bibliothèque de visuels en Python |
| Production | À la main, avec Claude | Une commande par épisode dans VS Code |
| Contrôle | Relecture humaine | Contrôles automatiques, puis 5 minutes de relecture |
| Suivi | Aucun | etat.yaml et calendrier.yaml |

### 11.2 L'organisation du dépôt

```
serie-ml/
├── CLAUDE.md                 mémoire du projet, moins de 200 lignes
├── .claude/
│   ├── settings.json         hooks et permissions
│   ├── skills/               commandes /episode, /saison, /bilan, /etat, /corriger
│   └── agents/relecteur.md   sous-agent de relecture, lecture seule
├── banque/episodes/          62 fiches NN-titre.yaml (entrée, ne change pas)
├── charte/                   charte.yaml, règles, typographie, texte LinkedIn, glossaire.yaml
├── gabarits/                 un gabarit HTML par type de page + style.css (verrouillés)
├── bibliotheque/             9 familles de visuels + robot (Python → SVG, verrouillés)
├── calculs/                  fonctions qui produisent chaque chiffre et chaque courbe
├── serie/                    le générateur : rendu, typographie, contrôles, état
├── tests/reference/          rendus de référence des épisodes 01 et 08
├── sources/NN/               extraits des références, gardés en cache
├── contenu/NN.yaml           ce que l'agent écrit : textes et paramètres
├── assets/images/            images réelles que tu déposes
├── sortie/NN/                PNG, PDF, rapport de relecture
├── publier/NN/               dossier prêt à publier
├── etat.yaml                 statut de chaque épisode
└── calendrier.yaml           dates de publication
```

### 11.3 La chaîne de production d'un épisode

Tu tapes /episode 09. Le reste s'enchaîne seul, et chaque étape enregistre son résultat avant de passer à la suivante.

| Étape | Qui | Produit | Contrôle |
| --- | --- | --- | --- |
| 1. Lire la fiche et celles des prérequis | Agent | — | La fiche existe et ses prérequis sont publiés ou relus |
| 2. Lire les références et en garder les extraits utiles | Agent | sources/09/ | Chaque référence de la fiche a un extrait |
| 3. Calculer les chiffres et les courbes | Code | calculs/09 → valeurs | Les valeurs sont recalculées à chaque rendu |
| 4. Rédiger le contenu | Agent | contenu/09.yaml | Schéma, mots par page, termes, typographie (hook) |
| 5. Rendre les pages | Code | sortie/09/\*.png, carrousel PDF | Aucun texte ne déborde, taille de police minimale |
| 6. Relire avec un regard neuf | Sous-agent relecteur | sortie/09/relecture.md | Chaque chiffre et chaque formule rattachés à un extrait |
| 7. Rédiger le texte LinkedIn | Agent | publier/09/texte.txt | Longueur, structure, hashtags |
| 8. Préparer la publication | Code | publier/09/ | Statut « généré » dans etat.yaml |

Si un contrôle échoue, l'erreur est renvoyée à l'agent, qui corrige seul. Après 2 essais ratés sur le même point, il s'arrête et le signale dans le rapport au lieu d'insister.

### 11.4 Les garde-fous contre la dérive

Chaque risque de dérive a un garde-fou qui ne dépend pas de la bonne volonté de l'agent.

| Risque | Garde-fou |
| --- | --- |
| Le style change d'un épisode à l'autre | L'agent ne touche jamais au rendu : gabarits, feuille de style et bibliothèque sont verrouillés par un hook qui refuse toute modification pendant une production |
| Un gabarit est modifié par erreur | Test de référence : les épisodes 01 et 08 sont rendus à chaque changement du code et comparés pixel par pixel aux images validées |
| Un visuel est improvisé | Le contenu ne peut citer qu'une famille de la bibliothèque et ses paramètres autorisés ; le schéma refuse le reste |
| Un chiffre est faux | Les chiffres et les courbes viennent des fonctions de calculs/, jamais du texte de l'agent |
| Une affirmation n'est pas sourcée | Le relecteur, un sous-agent sans accès en écriture et sans l'historique de rédaction, rattache chaque affirmation à un extrait de sources/ |
| Un terme arrive trop tôt | glossaire.yaml liste chaque terme, ses formes (diverge, divergence, diverger) et l'épisode qui l'introduit ; le contrôle cherche toutes les formes |
| Le ton dérive | Les règles de rédaction et deux épisodes modèles (01 et 08) sont fournis à chaque rédaction ; une liste de mots interdits est contrôlée (superlatifs, emoji, tutoiement) |
| Le texte déborde | Mesure après rendu, dans le navigateur : un bloc qui dépasse sa zone fait échouer la page |
| La typographie varie | Appliquée par le générateur, jamais par l'agent (9.4) |
| Le contexte de l'agent se dilue avec le temps | Chaque épisode démarre d'une session neuve : l'agent ne lit que la fiche, les fiches des prérequis et les règles, pas l'historique |

### 11.5 Les commandes

Ce sont des skills Claude Code, dans .claude/skills/. Chaque commande s'appuie sur le générateur, une petite interface en ligne de commande nommée serie.

| Commande | Ce qu'elle fait |
| --- | --- |
| /episode NN | Toute la chaîne de la section 11.3 pour un épisode |
| /saison N | Produit images-a-fournir.md, puis enchaîne /episode sur tous les épisodes de la saison qui ne sont pas encore générés |
| /bilan N | Le post bilan de la saison N (couverture, sommaire, fin) |
| /etat | Où en est chaque épisode, l'avance en épisodes relus, les images manquantes, la prochaine date de publication |
| /corriger NN \[page\] | Applique une correction que tu décris en une phrase, puis relance les contrôles et le rendu de cet épisode seul |
| /stats NN | Enregistre les statistiques que tu donnes et prépare le bilan des 4 semaines quand il est dû |

Le générateur peut aussi être lancé sans agent : serie rendre NN, serie verifier NN, serie regenerer --tout, serie etat.

### 11.6 Les automatismes (hooks)

Configurés dans .claude/settings.json, ils s'exécutent sans que personne ait à y penser.

- **Après chaque modification d'un fichier contenu/** : serie verifier s'exécute. En cas d'erreur, le hook la renvoie à l'agent, qui corrige avant de continuer.
- **Avant toute modification de gabarits/, bibliotheque/ ou charte/** : le hook refuse, sauf pendant une session de design que tu lances exprès.
- **À la fin de chaque réponse de l'agent** : etat.yaml est mis à jour, pour qu'une interruption ne fasse rien perdre.

### 11.7 Reprendre et corriger (points 18 à 20)

- **Reprise** : chaque étape de 11.3 écrit son résultat et l'enregistre dans etat.yaml. Si la session s'arrête (limite d'utilisation, coupure), /episode NN repart de la première étape non terminée.
- **Rien n'est refait inutilement** : le rendu d'une page n'est relancé que si son contenu, son gabarit ou la charte ont changé.
- **Correction d'un épisode** : /corriger NN modifie le contenu, puis relance les contrôles et le rendu de cet épisode seul. S'il était déjà relu, il repasse au statut « généré ».
- **Changement de charte** : serie regenerer --tout rend à nouveau tous les épisodes et produit une planche avant / après, pour valider d'un coup d'œil.

**Garanties techniques de la reprise :**

- **Écritures atomiques** : chaque fichier est écrit sous un nom provisoire puis renommé. Une coupure ne laisse jamais un fichier à moitié écrit.
- **Empreintes** : etat.yaml garde, pour chaque étape terminée, l'empreinte de ses entrées (fiche, sources, contenu, gabarits, charte). Si une entrée a changé, l'étape est considérée comme à refaire.
- **Étapes relançables** : relancer une étape terminée donne le même résultat et n'efface rien d'autre.
- **Versions** : chaque production validée est enregistrée dans Git, ce qui permet de revenir à la version précédente d'un épisode.
- **Tests de cas limites** : en plus des 14 rendus de référence (un par type de page), des pages pièges vérifient les titres longs, les formules longues, les accents, les tableaux denses et l'absence d'image.

### 11.8 L'optimisation

- **L'agent lit peu** : CLAUDE.md reste court et renvoie aux fichiers détaillés, lus seulement par la commande qui en a besoin.
- **L'agent écrit peu** : un fichier de contenu par épisode, quelques centaines de mots. Le rendu, local et gratuit, ne consomme rien de ton usage Claude.
- **Les sources sont lues une fois** : leurs extraits restent dans sources/, réutilisables pour la relecture et les corrections.
- **La production se fait par lots** : /saison génère d'avance, ce qui laisse de la marge si une limite d'utilisation est atteinte un jour.

### 11.9 Le plan de construction

Chaque jalon a un critère de fin vérifiable. On ne passe au suivant que s'il est rempli.

| Jalon | Contenu | Critère de fin |
| --- | --- | --- |
| 1. Fondations | Export du document en fichiers, squelette du dépôt, CLAUDE.md | Les 62 fiches passent la validation de schéma |
| 2. Rendu fidèle | Gabarits HTML, feuille de style, robot extrait, bibliothèque des 9 familles | L'épisode 08 rendu par le code est identique au canevas validé |
| 3. Contrôles | Typographie, débordements, termes, schéma, calculs, tests de référence | Chaque contrôle détecte une erreur volontairement introduite |
| 4. Agent | Skills, sous-agent relecteur, hooks | /episode 01 à 04 produisent des dossiers complets sans intervention |
| 5. Lancement | Relecture des 4 premiers épisodes, images de la saison 1 | 4 épisodes relus d'avance, date de lancement fixée |

### 11.10 Ton rôle, une fois en route

| Quand | Quoi | Durée visée |
| --- | --- | --- |
| Début de saison | Lancer /saison N, déposer les images listées | Une séance |
| Chaque épisode | Lire relecture.md, valider ou demander une correction | 5 minutes |
| Chaque publication | Copier le dossier publier/ sur LinkedIn | 5 minutes |
| Toutes les 4 semaines | Donner les statistiques avec /stats, lire le bilan | 15 minutes |
