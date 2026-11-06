# Nº 08 · la-descente-de-gradient · v1

Statut : brouillon, en attente de validation de l'auteur.

## A. Diagnostic du texte existant

- Note initiale (estimation de `evaluations.md`) : 7,9
- Défauts : Brouillard repris en 10 ; paragraphe carrousel trop long et dense ; « d'eux-mêmes » sans condition ; question professionnelle forcée.
- Point fort préservé : La formule θ ← θ − η∇J(θ), seule formule du texte.

## B. Axes de correction

- Premier récit historique de la série, avec source primaire.
- Rattacher le nom de la série à l'histoire de la méthode.
- Remplacer le sommaire par un seul enjeu : η.

## C. Publication finale

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

## D. Évaluation finale

| Accroche | Rigueur | Fluidité | Originalité | Pédagogie | LinkedIn | **Note** |
|---|---|---|---|---|---|---|
| 9,5 | 9,5 | 9,5 | 9,5 | 9 | 9 | **9,4** |

Objectif de 9,5 non atteint : la note reste celle que le texte défend réellement. Défaut restant : Récit plus long que la moyenne ; trois sources nouvelles à ajouter au premier commentaire.

## E. Contrôle de cohérence

- Accroche : type D
- Corps : 8 · récit historique documenté
- Paragraphe visuel : Oui, une phrase
- Conclusion : Observation pratique
- Structure : Date · récit en deux temps · détail sur θ · changement d'échelle · appel au visuel · conseil
- Longueur : 168 mots hors hashtags
- Vérification scientifique : Cauchy, Comptes rendus 25, 536-538, séance du 18 octobre 1847 ; θ noté par Cauchy, élimination difficile, orbite, six inconnues : note lue en traduction (Pulskamp) et Lemaréchal, Documenta Math., 2012, 251-254. GPT-3 : « 175 billion parameters », Brown et al., 2020.
- Mémoire éditoriale : à mettre à jour seulement après validation.

## F. Questions à l'auteur

Voir `01-10_synthese_v1.md`.
