> **Anciens textes, jamais publiés.** Remplacés le 2026-11-05 par les fichiers `NN_slug.md` de ce dossier. Conservés pour mémoire.

# Épisodes 01 à 10 · Textes publiés (référence, ne pas modifier)

Ces textes sont la mémoire de la série. Ils ne sont pas un modèle à imiter. À partir de l'épisode 11, chaque épisode validé est enregistré dans son propre fichier : `NN_slug.md`.

---

## Nº 01

Un programme classique suit des règles écrites à la main.
Le Machine Learning les tire d’exemples.

Pensez au tri de vos mails. En 2019, Google indiquait bloquer environ 100 millions de spams de plus chaque jour grâce à TensorFlow, un outil d’apprentissage développé par Google. Selon le même billet, l’apprentissage permet de s’adapter vite à des spams qui changent sans cesse.

Le carrousel part du spam, une tâche où les règles écrites à la main ne suffisent pas, remonte au programme de dames d’Arthur Samuel en 1959, et finit sur une limite : loin de ses exemples, rien ne garantit la réponse d’un modèle.

Quelle tâche de votre quotidien serait difficile à décrire avec des règles écrites ?

Nº 01 · θ Théta, le Machine Learning, une notion à la fois. Épisode suivant · Nº 02 : Données, caractéristiques et étiquettes.

#MachineLearning #IntelligenceArtificielle #DataScience #ApprentissageAutomatique #ThetaML

---

## Nº 02

Pour un modèle, une maison n’est pas une maison.
C’est une ligne de tableau.

Imaginez un tableur : chaque ligne décrit une maison vendue, les premières colonnes ses caractéristiques, la dernière son prix. Pour apprendre, le modèle ne voit que ces lignes, et souvent seulement des nombres : le nom du quartier doit alors être converti, et la façon de le faire compte.

Le carrousel part de trois ventes réelles à Ames, aux États-Unis, en 2010, avec des prix convertis en FCFA au cours BCEAO du 27 octobre 2026. Il montre un piège, numéroter des quartiers comme s’il s’agissait de quantités, puis une façon de les coder qui l’évite : une colonne par quartier. Les ventes d’Ames reviendront dans l’épisode 04.

Dans votre métier, quelles données faudrait-il d’abord convertir en nombres ?

Nº 02 · θ Théta, le Machine Learning, une notion à la fois. Épisode suivant · Nº 03 : Les trois familles d’apprentissage.

#MachineLearning #IntelligenceArtificielle #DataScience #PreparationDesDonnees #ThetaML

---

## Nº 03

Apprendre avec les réponses, sans les réponses, ou en agissant.
Trois familles, et des frontières souvent floues.

Pensez à votre boîte mail. Pour reconnaître le spam, on montre au modèle des mails déjà triés, avec la réponse. Mais des données arrivent aussi sans aucune réponse : il faut alors y chercher une structure. Et parfois, le système ne se contente pas de données réunies d’avance : il agit.

Le carrousel compare le supervisé et le non supervisé sur un même nuage d’exemples, puis distingue deux tâches courantes du supervisé : la régression, qui prédit un nombre, comme le prix des maisons de l’épisode 02, et la classification, qui prédit une catégorie. Il finit sur l’apprentissage par renforcement, qui apprend en agissant.

Laquelle de ces trois familles vous semble la plus proche de la façon dont vous apprenez ?

Nº 03 · θ Théta, le Machine Learning, une notion à la fois. Épisode suivant · Nº 04 : Modèle et paramètres.

#MachineLearning #IntelligenceArtificielle #DataScience #ApprentissageSupervise #ThetaML

---

## Nº 04

Un modèle de Machine Learning peut tenir en une ligne.
Et n’avoir que deux réglages.

Pour estimer le prix d’une maison, on peut partir d’un prix de base et ajouter un montant pour chaque mètre carré. Une régression linéaire raisonne ainsi, avec une différence : elle calcule elle-même ces deux nombres à partir des ventes passées. Ici, le prix de base est celui d’une maison de 0 m² : un point de départ du calcul, pas une vente réelle.

Le carrousel reprend les maisons de l’épisode 02 : à Ames, aux États-Unis, une droite calculée sur les ventes de 2006 à 2010 prédit le prix selon la surface, en FCFA au cours BCEAO du 27 octobre 2026. Il montre ce que changent a et b, et laisse une question pour la suite : meilleurs réglages, mais selon quoi ?

Quel phénomène de votre quotidien décririez-vous avec une simple droite ?

Nº 04 · θ Théta, le Machine Learning, une notion à la fois. Épisode suivant · Nº 05 : La fonction de coût.

#MachineLearning #IntelligenceArtificielle #DataScience #RegressionLineaire #ThetaML

---

## Nº 05

Avant d’apprendre, un modèle doit savoir à quel point il se trompe.
Et le dire en un seul nombre.

Une prédiction de prix tombe rarement juste : un peu trop haute ici, un peu trop basse là. Pour comparer deux droites, il faut résumer toutes ces erreurs en un seul nombre. La fonction de coût fait ce résumé ; la plus courante en régression élève chaque erreur au carré, puis en fait la moyenne.

Le carrousel reprend les maisons d’Ames de l’épisode 02 et la droite de l’épisode 04, prix en FCFA au cours BCEAO du 27 octobre 2026. Il montre pourquoi le carré, ce qu’il coûte face à un point très éloigné, et pourquoi le coût dessine une courbe en U dont le creux est la droite au coût le plus faible.

Dans votre métier, une grosse erreur coûte-t-elle plus que plusieurs petites ?

Nº 05 · θ Théta, le Machine Learning, une notion à la fois. Épisode suivant · Nº 06 : La pente d’une courbe : la dérivée.

#MachineLearning #IntelligenceArtificielle #DataScience #FonctionDeCout #ThetaML

---

## Nº 06

Savoir si ça monte ou si ça descend, et à quelle vitesse.
Un seul nombre le dit : la dérivée.

Imaginez que vous marchez sur un chemin vallonné, les yeux sur vos pieds. À chaque endroit, le sol monte, descend ou reste plat, plus ou moins raide. La dérivée mesure cela pour une courbe, en un point. Pour un modèle, cette courbe est celle du coût : la dérivée dit si un réglage le fait monter ou descendre, et à quel rythme.

Le carrousel part du coût en U de l’épisode 05, simplifié en J(a) = a², avec un seul réglage a. Il montre la tangente et sa pente, ce que disent son signe et sa taille, puis calcule la pente en a = 3 de deux façons : par la dérivée 2a, et en divisant la hausse du coût par un écart de plus en plus petit.

Quelle image vous a fait comprendre la dérivée pour la première fois ?

Nº 06 · θ Théta, le Machine Learning, une notion à la fois. Épisode suivant · Nº 07 : Le gradient.

#MachineLearning #IntelligenceArtificielle #DataScience #Derivee #ThetaML

---

## Nº 07

La pente, quand il y a plusieurs boutons à régler.
Une flèche la donne : le gradient.

Imaginez un appareil à deux boutons, dont le réglage fixe un coût. Tournez un bouton en laissant l’autre en place : le coût monte ou descend, à un certain rythme. Faites de même avec l’autre bouton. Ces deux rythmes, mis côte à côte, indiquent ensemble de quel côté le coût monte le plus vite.

Le carrousel repart de la dérivée de l’épisode 06, cette fois avec deux réglages a et b. Il montre la dérivée partielle, le gradient ∇J qui range ces pentes dans un vecteur, une carte de lignes de niveau où ∇J pointe à angle droit vers la montée la plus raide, puis le calcul de ∇J pour un coût simple : J(a, b) = a² + 3b².

Avant de lire ce carrousel, comment vous représentiez-vous le gradient ?

Nº 07 · θ Théta, le Machine Learning, une notion à la fois. Épisode suivant · Nº 08 : La descente de gradient.

#MachineLearning #IntelligenceArtificielle #DataScience #Gradient #ThetaML

---

## Nº 08

Comment un modèle apprend-il de ses erreurs ?
Un pas à la fois, en descendant une pente.

Imaginez-vous dans le brouillard, sur le flanc d’une vallée. Vous ne voyez pas le fond, mais vous sentez sous vos pieds de quel côté le sol descend. Vous faites un pas de ce côté, puis vous recommencez. Plus le sol est raide, plus le pas est long.

Le carrousel part du coût de l’épisode 05 et de la pente des épisodes 06 et 07. Il montre la règle θ ← θ − η∇J(θ), pourquoi les pas raccourcissent d’eux-mêmes près du minimum, ce qui se passe quand le taux d’apprentissage η est trop petit ou trop grand, trois pas calculés à la main, puis, sur les maisons d’Ames (prix en FCFA au cours BCEAO du 27 octobre 2026), pourquoi la descente peut s’arrêter avec un coût qui n’est pas nul.

Dans votre travail, avancez-vous plutôt à petits pas sûrs ou à grands pas, quitte à revenir en arrière ?

Nº 08 · θ Théta, le Machine Learning, une notion à la fois. Épisode suivant · Nº 09 : Descente stochastique et mini-lots.

#MachineLearning #IntelligenceArtificielle #DataScience #DescenteDeGradient #ThetaML

---

## Nº 09

Pour faire un seul pas, faut-il relire toutes les données ?
Non : quelques exemples tirés au hasard suffisent.

Pour goûter une soupe, on n’avale pas toute la marmite : une cuillère, bien remuée, suffit à juger. La descente stochastique fait de même : à chaque pas, elle estime la pente sur un exemple ou un petit lot tiré au hasard, au lieu de tout le jeu de données.

Le carrousel compare trois façons de calculer la pente : tout le jeu, un exemple, ou un mini-lot, souvent de 32 à 256 exemples (usage décrit en 2016). Il montre pourquoi un chemin qui zigzague arrive quand même près du minimum, ce qu’est une époque, et pourquoi le taux d’apprentissage η doit décroître, ni trop vite ni trop lentement : une idée déjà présente chez Robbins et Monro en 1951.

Dans votre travail, décidez-vous plutôt sur un échantillon rapide, ou après avoir tout relu ?

Nº 09 · θ Théta, le Machine Learning, une notion à la fois. Épisode suivant · Nº 10 : Minimums locaux et points selle.

#MachineLearning #IntelligenceArtificielle #DataScience #DescenteStochastique #ThetaML

---

## Nº 10

Le fond d’un creux n’est pas toujours le fond de la vallée.
Une descente de gradient peut s’arrêter avant le point le plus bas.

Imaginez une marche dans le brouillard : vous descendez tant que le sol descend, et vous vous arrêtez quand il devient plat. Rien ne vous dit qu’il n’existe pas, plus loin, une vallée plus basse. Et un col, plat en son centre, peut aussi vous retenir un moment.

Le carrousel montre, sur une courbe à deux creux, la différence entre minimum local et minimum global ; puis le point selle, où la pente est nulle sans que ce soit un minimum. Il finit par le cas des fonctions convexes, comme le coût d’une droite : là, tout minimum local est global. Le bruit des mini-lots (épisode 09) peut d’ailleurs aider la descente à sortir d’un minimum local.

Dans vos projets, comment vérifiez-vous qu’un entraînement ne s’est pas arrêté trop tôt ?

Nº 10 · θ Théta, le Machine Learning, une notion à la fois. Épisode suivant · Nº 11 : La régression linéaire.

#MachineLearning #IntelligenceArtificielle #DataScience #Optimisation #ThetaML
