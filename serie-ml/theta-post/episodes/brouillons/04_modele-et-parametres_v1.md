# Nº 04 · modele-et-parametres · v1

Statut : brouillon, en attente de validation de l'auteur.

## A. Diagnostic du texte existant

- Note initiale (estimation de `evaluations.md`) : 8,3
- Défauts : Sommaire ; données répétées (Ames, FCFA, BCEAO) ; accroche à deuxième ligne en « Et ».
- Point fort préservé : La précision sur la maison de 0 m², absente du carrousel : conservée.

## B. Axes de correction

- Remplacer le raisonnement par un contraste chiffré.
- Séparer ce qui est choisi de ce qui est appris : c'est l'acquis utile pour toute la série.
- Retirer unités et cours : le carrousel les porte.

## C. Publication finale

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

## D. Évaluation finale

| Accroche | Rigueur | Fluidité | Originalité | Pédagogie | LinkedIn | **Note** |
|---|---|---|---|---|---|---|
| 9,5 | 9,5 | 9 | 9,5 | 9,5 | 9 | **9,3** |

Objectif de 9,5 non atteint : la note reste celle que le texte défend réellement. Défaut restant : Une phrase de plus que nécessaire entre l'énigme et l'appel au visuel.

## E. Contrôle de cohérence

- Accroche : type G
- Corps : 9 · étude de cas chiffrée
- Paragraphe visuel : Oui, une ligne
- Conclusion : Observation mémorable
- Structure : Chiffre entrée / sortie · découpage choisi / appris · passage à l'échelle · énigme du 0 m² · appel au visuel · clôture
- Longueur : 178 mots hors hashtags
- Vérification scientifique : n = 2 925, a = 74, b = 4 : sortie de calculs.ames.droite_prix_surface() (fichier de 2 930 ventes, surfaces au-delà de 4 000 pieds carrés retirées). « Ce modèle ne garde aucune vente » est limité à ce modèle : les k plus proches voisins (épisode 30) gardent leurs exemples.
- Mémoire éditoriale : à mettre à jour seulement après validation.

## F. Questions à l'auteur

Voir `01-10_synthese_v1.md`.
