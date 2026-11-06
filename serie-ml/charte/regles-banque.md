# Règles de la banque et saisons

Extrait du document de conception. Ce fichier fait foi.

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
