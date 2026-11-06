# Nº 09 · descente-stochastique-et-mini-lots · v1

Statut : brouillon, en attente de validation de l'auteur.

## A. Diagnostic du texte existant

- Note initiale (estimation de `evaluations.md`) : 8,2
- Défauts : « suffisent » et « doit décroître » trop catégoriques ; soupe ; sommaire avec dates.
- Point fort préservé : La question finale sur l'échantillon : son idée passe dans une question plus précise.

## B. Axes de correction

- Apporter l'argument de fond, absent du carrousel : le rendement décroissant en 1/√n.
- Supprimer les formulations catégoriques.
- Parler aux praticiens dans la conclusion.

## C. Publication finale

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

## D. Évaluation finale

| Accroche | Rigueur | Fluidité | Originalité | Pédagogie | LinkedIn | **Note** |
|---|---|---|---|---|---|---|
| 9,5 | 9,5 | 9 | 9,5 | 9,5 | 9 | **9,3** |

Objectif de 9,5 non atteint : la note reste celle que le texte défend réellement. Défaut restant : 1/√n suppose des exemples tirés au hasard ; la nuance reste implicite pour alléger.

## E. Contrôle de cohérence

- Accroche : type G
- Corps : 12 · limite ou compromis, appuyé d'un mini-calcul
- Paragraphe visuel : Non
- Conclusion : Question technique
- Structure : Phrase longue chiffrée · cause · tableau en deux lignes · pari · prix à payer · question
- Longueur : 154 mots hors hashtags
- Vérification scientifique : DLB ch. 8, lu le 2026-11-05 : σ/√n ; 100 fois plus de calcul pour une erreur type divisée par 10 ; convergence plus rapide « in terms of total computation, not in terms of number of updates ». Référence déjà présente dans le premier commentaire.
- Mémoire éditoriale : à mettre à jour seulement après validation.

## F. Questions à l'auteur

Voir `01-10_synthese_v1.md`.
