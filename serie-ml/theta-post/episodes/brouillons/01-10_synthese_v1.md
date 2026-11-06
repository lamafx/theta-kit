# Épisodes 01 à 10 · Synthèse de la réécriture v1

Aucun fichier de `episodes/valides/`, `contenu/`, `publier/` ni de la mémoire éditoriale n'a été modifié.

## Variation sur la série

| Nº | Accroche | Corps | Visuel | Conclusion | Mots | Note |
|---|---|---|---|---|---|---:|
| 01 | E | 3 · problème concret puis résolution | Non | Observation mémorable | 145 | 9,2 |
| 02 | B | 12 · limite ou compromis + 10 · expérience de l'auteur | Non | Mini-exercice | 178 | 9,2 |
| 03 | A | 2 · explication directe, sous forme d'arbre de décision | Non | Transition intrigante | 173 | 9,2 |
| 04 | G | 9 · étude de cas chiffrée | Oui, une ligne | Observation mémorable | 178 | 9,3 |
| 05 | G | 6 · mini-démonstration + 11 · comparaison de deux méthodes | Non | Question ouverte (conservée) | 158 | 9,5 |
| 06 | A | 1 · analogie pédagogique | Non | Petit défi | 128 | 9,5 |
| 07 | B | 6 · mini-démonstration + 5 · mythe contre réalité | Non | Transition intrigante | 166 | 9,5 |
| 08 | D | 8 · récit historique documenté | Oui, une phrase | Observation pratique | 168 | 9,4 |
| 09 | G | 12 · limite ou compromis, appuyé d'un mini-calcul | Non | Question technique | 154 | 9,3 |
| 10 | F | 5 · mythe contre réalité | Non | Transition vers l'épisode 11 | 178 | 9,2 |

Note moyenne : 9,33, contre 8,2 au départ. Ce sont des estimations, à contester.

## Questions à l'auteur

1. Nº 02 : acceptez-vous la phrase sur votre mémoire (requêtes clients, 1 919 exemples, 19 intentions) ?
2. Nº 08 : acceptez-vous d'ajouter Cauchy (1847), Lemaréchal (2012) et Brown et al. (2020) au premier commentaire ?
3. Nº 01 : le titre officiel est-il « Qu'est-ce que le Machine Learning ? » (carrousel, fiche) ou « Introduction au Machine Learning » (`programme.md`) ?
4. Intégration : `serie/publication.py` et `charte/texte-linkedin.md` imposent encore 2 à 4 phrases d’intuition, une promesse, une question finale et `#DataScience` (les dix textes, de 128 à 178 mots, respectent en revanche leur minimum de 120 mots). Il faut les aligner sur `theta-post/CLAUDE.md` avant d'injecter ces textes.

## Textes

### Nº 01

```text
Vous reconnaissez un spam d’un coup d’œil.
Pourriez-vous écrire la règle exacte qui permet de le faire ?

Essayons.

« Contient le mot gratuit » : votre opérateur l’écrit aussi.
« Plein de majuscules » : une alerte de votre banque aussi.
« Expéditeur inconnu » : comme tout nouveau contact.

Chaque règle bloque des messages légitimes, en laisse passer d’autres, et les spams changent sans cesse.

Le Machine Learning déplace le travail : au lieu d’écrire la règle, on fournit des mails déjà triés, et l’apprentissage en tire un modèle. Les deux approches cohabitent. En 2019, Gmail combinait règles et apprentissage, et Google indiquait bloquer environ 100 millions de spams de plus chaque jour grâce à TensorFlow.

Écrire un programme, c’est expliquer. Entraîner un modèle, c’est montrer. Les 61 épisodes suivants partent de cette différence.

Nº 01 · θ Théta, le Machine Learning, une notion à la fois. Épisode suivant · Nº 02 : Données, caractéristiques et étiquettes.

#MachineLearning #IntelligenceArtificielle #DataScience #ApprentissageAutomatique #ThetaML
```

### Nº 02

```text
Numéroter ses quartiers 1, 2 et 3 paraît anodin.
Pour certains modèles, le troisième vaut maintenant trois fois le premier.

Un tableau de données n’est pas un simple rangement : chaque colonne décrit le monde au modèle, et il la prend au mot.

Le risque dépend pourtant du modèle :

· ceux qui additionnent ou mesurent des distances risquent de lire ces numéros comme des quantités ;
· ceux qui raisonnent par seuils successifs, comme les arbres de décision, y sont moins sensibles ;
· la parade classique, une colonne par quartier, a ses limites : avec un très grand nombre de catégories, elle peut devenir un mauvais choix.

Ce vocabulaire dépasse les maisons. Dans mon mémoire sur un agent conversationnel, un exemple était une requête client (1 919 au total), et son étiquette l’une de 19 intentions.

Mini-exercice : un fichier clients contient « couleur préférée » et « taille de T-shirt (S, M, L) ». Une seule de ces colonnes peut recevoir des numéros sans inventer un ordre. Laquelle ?

Nº 02 · θ Théta, le Machine Learning, une notion à la fois. Épisode suivant · Nº 03 : Les trois familles d’apprentissage.

#MachineLearning #IntelligenceArtificielle #DataScience #PreparationDesDonnees #ThetaML
```

### Nº 03

```text
Un modèle peut apprendre sans qu’on lui donne la moindre réponse, et même à partir de données qui n’existent pas encore.

Ce qui sépare les trois grandes familles d’apprentissage, c’est d’abord la situation de départ, pas la complexité de l’algorithme.

Chaque exemple a sa réponse ? Supervisé.
Aucun n’en a ? Non supervisé : on cherche une structure.
Pas de jeu de données fixe ? Renforcement : le système agit, et ses actions changent ce qu’il observe ensuite.

Ces cases sont des repères, pas des cloisons. Goodfellow, Bengio et Courville le rappellent : supervisé et non supervisé ne sont pas des termes formellement définis. Un projet peut n’avoir des réponses que pour une partie de ses exemples : c’est le semi-supervisé. Et le renforcement peut lui-même apprendre de données déjà réunies, sans agir : c’est le renforcement hors ligne.

Dans ces trois cas, il reste quelque chose à la fin de l’apprentissage. Souvent des nombres, parfois très peu : deux, dans l’épisode suivant.

Nº 03 · θ Théta, le Machine Learning, une notion à la fois. Épisode suivant · Nº 04 : Modèle et paramètres.

#MachineLearning #IntelligenceArtificielle #DataScience #ApprentissageSupervise #ThetaML
```

### Nº 04

```text
2 925 ventes de maisons en entrée.
Deux nombres en sortie : 74 et 4.

C’est tout ce que garde une droite ajustée sur les ventes d’Ames. Un tel modèle se lit en deux parties :

Ce qui est choisi : la forme, ici une droite. Ce choix précède l’entraînement.
Ce qui est appris : les paramètres, ici 74 et 4, calculés à partir des exemples.

Cette séparation survit au changement d’échelle. Un réseau de neurones a lui aussi une forme choisie d’avance et des paramètres appris, seulement bien plus nombreux.

Le second nombre réserve une surprise : c’est le prix prédit pour une maison de 0 m². Elle n’existe pas. Ce 4 n’est pas une vente, c’est un point de départ du calcul.

Que fait chacun de ces nombres à la droite ? Deux gestes très différents, à voir en faisant glisser les pages.

Ce modèle ne garde aucune vente. Il en garde un résumé, avec ce que tout résumé laisse de côté.

Nº 04 · θ Théta, le Machine Learning, une notion à la fois. Épisode suivant · Nº 05 : La fonction de coût.

#MachineLearning #IntelligenceArtificielle #DataScience #RegressionLineaire #ThetaML
```

### Nº 05

```text
Quand on élève les erreurs au carré, une seule erreur de 25 pèse autant que 625 erreurs de 1.

Le calcul tient en deux lignes :

Avec le carré : 25² = 625, soit 625 erreurs de 1.
Sans le carré (valeur absolue) : 25, soit 25 erreurs de 1.

Une fonction de coût ne se contente donc pas de mesurer. Elle dit au modèle ce qui est grave.

L’erreur quadratique moyenne, la plus courante en régression, lui dit d’éviter d’abord les grands écarts. C’est utile quand un grand écart coûte vraiment cher. C’est gênant quand ce point isolé est une anomalie : il tire le modèle vers lui, ce que l’erreur absolue moyenne fait bien moins.

Le choix dépend des données et de ce que coûte réellement une erreur.

Dans votre métier, une grosse erreur coûte-t-elle plus que plusieurs petites ?

Nº 05 · θ Théta, le Machine Learning, une notion à la fois. Épisode suivant · Nº 06 : La pente d’une courbe : la dérivée.

#MachineLearning #IntelligenceArtificielle #Statistiques #FonctionDeCout #ThetaML
```

### Nº 06

```text
Le compteur de votre voiture affiche une dérivée.

À 80 km/h, il ne dit ni où vous êtes ni où vous arriverez. Il dit à quel rythme votre position change, à cet instant.

Pour un modèle, la dérivée du coût joue ce rôle. Elle n’indique pas où se trouve le meilleur réglage. Elle indique dans quel sens le coût évolue si le réglage bouge un peu, et à quel rythme, là où l’on se trouve.

Cette information locale dispense d’essayer tous les réglages un par un.

Petit défi, sans calculatrice : en a = 3, la dérivée de J(a) = a² vaut 6. Estimez de combien J monte si a passe à 3,01.

Nº 06 · θ Théta, le Machine Learning, une notion à la fois. Épisode suivant · Nº 07 : Le gradient.

#MachineLearning #IntelligenceArtificielle #Mathematiques #Derivee #ThetaML
```

### Nº 07

```text
Le gradient ne pointe pas vers le minimum.
Même son opposé n’y mène pas forcément tout droit.

Prenons J = a² + 3b², au point (1 ; 1).

Le minimum est en (0 ; 0) : il faudrait réduire a et b autant l’un que l’autre, direction (−1 ; −1).
Le gradient vaut (2 ; 6) : son opposé indique (−2 ; −6), à environ 27 degrés de cette direction.

La flèche se trompe-t-elle ? Non : elle ne connaît pas le minimum. Elle répond à une question locale : quels réglages pèsent le plus sur le coût, ici ? En ce point, b pèse trois fois plus que a.

C’est tout l’intérêt du gradient. Dès que plusieurs paramètres doivent être ajustés en même temps, une seule pente ne suffit plus : il faut savoir comment chacun d’eux pèse sur le coût.

Si la flèche ne vise pas le but, comment arrive-t-on quand même ? En la recalculant à chaque pas.

Nº 07 · θ Théta, le Machine Learning, une notion à la fois. Épisode suivant · Nº 08 : La descente de gradient.

#MachineLearning #IntelligenceArtificielle #Mathematiques #Gradient #ThetaML
```

### Nº 08

```text
La descente de gradient a été décrite en 1847, pour calculer l’orbite d’un astre.

Le 18 octobre de cette année-là, Augustin Cauchy présente à l’Académie des sciences une méthode pour résoudre des systèmes d’équations : l’élimination habituelle échoue souvent, ou donne une équation très compliquée.

Son idée : partir de valeurs données, calculer les dérivées, retrancher à chaque inconnue sa dérivée multipliée par un petit nombre, puis recommencer.

Ce petit nombre, il le note déjà θ. Nous gardons cette lettre pour les paramètres et nommons η la taille du pas : θ ← θ − η∇J(θ).

Le reste a changé d’échelle : six inconnues pour une orbite chez Cauchy, 175 milliards de paramètres pour GPT-3 en 2020, entraînés avec des variantes de la même idée.

Le carrousel s’arrête sur ce que cette ligne cache : selon η, le même algorithme traîne, converge ou diverge.

Si votre coût monte à chaque itération, commencez par regarder η.

Nº 08 · θ Théta, le Machine Learning, une notion à la fois. Épisode suivant · Nº 09 : Descente stochastique et mini-lots.

#MachineLearning #IntelligenceArtificielle #Optimisation #DescenteDeGradient #ThetaML
```

### Nº 09

```text
Calculer une pente sur 10 000 exemples plutôt que 100 demande cent fois plus de calcul, pour une estimation seulement dix fois plus précise.

La cause est une racine carrée : l’erreur type d’une moyenne estimée sur n exemples décroît en 1/√n.

100 exemples : calcul 1, erreur 1.
10 000 exemples : calcul 100, erreur 0,1.

D’où le pari de la descente stochastique et des mini-lots : renoncer à une pente exacte pour faire bien plus de pas. Goodfellow, Bengio et Courville notent en 2016 que la plupart des algorithmes d’optimisation convergent ainsi beaucoup plus vite, en calcul total et non en nombre de pas.

Le prix à payer est un chemin qui zigzague et qui, à taux d’apprentissage fixe, ne se pose pas au minimum.

Quelle taille de mini-lot utilisez-vous par défaut, et pourquoi celle-là ?

Nº 09 · θ Théta, le Machine Learning, une notion à la fois. Épisode suivant · Nº 10 : Minimums locaux et points selle.

#MachineLearning #IntelligenceArtificielle #Optimisation #DescenteStochastique #ThetaML
```

### Nº 10

```text
Le coût ne baisse plus.
Le modèle a-t-il terminé, ou reste-t-il coincé ?

Une pente presque nulle dit seulement qu’à cet endroit, le coût ne varie plus guère. Trois situations au moins y ressemblent :

· un minimum global : le travail est fait ;
· un minimum local : un creux, plus haut qu’un autre ;
· un point selle : le coût descend encore dans au moins une direction.

L’idée reçue : un entraînement bloqué serait piégé dans un minimum local.

L’argument inverse : un minimum exige que toutes les directions remontent. Plus il y a de paramètres, moins c’est probable, sauf à un niveau d’erreur proche du meilleur. En 2014, Dauphin et ses coauteurs y voient surtout un problème de points selle, entourés de plateaux qui ralentissent l’apprentissage et imitent un minimum.

Leur thèse repose en partie sur des fonctions d’erreur aléatoires : un éclairage, pas une loi.

Un cas échappe à tout cela : le coût convexe d’une droite, sans faux creux. La série y revient dans l’épisode suivant.

Nº 10 · θ Théta, le Machine Learning, une notion à la fois. Épisode suivant · Nº 11 : La régression linéaire.

#MachineLearning #IntelligenceArtificielle #DeepLearning #Optimisation #ThetaML
```

