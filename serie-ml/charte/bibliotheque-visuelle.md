# Bibliothèque visuelle

Extrait du document de conception. Ce fichier fait foi.

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
