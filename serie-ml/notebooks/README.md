# Notebooks θ Théta

Le code derrière la série LinkedIn **θ Théta, le Machine Learning, une notion à la fois**, signée Ladji Lama Kamagate.
Chaque notebook refait en Python les calculs d'un ou deux épisodes, puis propose de petits exercices.

| Épisodes | Notebook | Ce que vous y faites |
| --- | --- | --- |
| 04, 05 | `05-la-fonction-de-cout.ipynb` | Écrire la MSE et tracer le coût selon un réglage |
| 06, 07 | `07-derivee-et-gradient.ipynb` | Calculer pentes et gradients, et les vérifier numériquement |
| 08 | `08-la-descente-de-gradient.ipynb` | Coder la descente et comparer trois taux d'apprentissage |
| 09 | `09-descente-stochastique.ipynb` | Comparer gradient complet, mini-lots et exemple par exemple |
| 10 | `10-minimums-locaux-et-points-selle.ipynb` | Construire un minimum local et un point selle |
| 11 | `11-la-regression-lineaire.ipynb` | Écrire une régression de zéro, puis la comparer à scikit-learn |

Chaque notebook vérifie ses résultats par des `assert` : s'il s'exécute jusqu'au bout, ses chiffres sont corrects.

## Lancer les notebooks

Il faut Python 3.10 ou plus, avec numpy, pandas, matplotlib et scikit-learn.

Pour les reconstruire et les réexécuter :

```
python notebooks/construire.py        # tous
python notebooks/construire.py 08 11  # seulement ceux-là
```

Les sources sont dans `sources/`. Modifiez-les plutôt que les fichiers `.ipynb`, que cette commande réécrit.

## Données

`donnees/ames-maisons.csv.gz` garde six colonnes du jeu Ames Housing de Dean De Cock, *Ames, Iowa: Alternative to the
Boston Housing Data as an End of Semester Regression Project*, Journal of Statistics Education 19(3), 2011,
<https://doi.org/10.1080/10691898.2011.11889627>. Les prix sont convertis au cours BCEAO du 27 octobre 2026
(1 dollar = 588,30 FCFA).
