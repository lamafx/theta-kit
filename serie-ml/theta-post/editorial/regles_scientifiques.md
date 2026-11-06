# Règles scientifiques et points de vigilance

Lire avant chaque épisode. Enrichir après chaque vérification.

## 1. Formulations à surveiller (règles générales)

| Éviter | Préférer | Pourquoi |
|---|---|---|
| « La descente de gradient trouve le minimum » | « … s'approche d'un minimum, global si le coût est convexe » | Non convexe : minimum local ou point selle possible |
| « Les pas raccourcissent d'eux-mêmes » (sans condition) | « À taux d'apprentissage fixe, les pas raccourcissent quand la pente s'adoucit » | Le pas vaut η × ‖∇J‖ ; il ne raccourcit que si le gradient diminue |
| « Le bruit stochastique fait sortir des minimums locaux » | « … peut aider à sortir de certains minimums locaux peu marqués ou de points selle » | Aucune garantie |
| « Les mini-lots font 32 à 256 exemples » | « … souvent entre 32 et 256 », avec source et contexte | Valeur d'usage, pas une règle |
| « η doit décroître » | « Pour les garanties théoriques de convergence de la SGD, η doit décroître (conditions de Robbins et Monro) ; en pratique, les calendriers varient » | Beaucoup d'entraînements utilisent des calendriers variés ou des optimiseurs adaptatifs |
| « Quelques exemples suffisent » | « … donnent une estimation bruitée mais exploitable de la pente » | « Suffire » est catégorique |
| « Tous les modèles… » | Préciser la classe de modèles | Ne pas généraliser une propriété de la régression linéaire |
| Dérivée / dérivée partielle / gradient employés l'un pour l'autre | Dérivée : 1 variable. Dérivée partielle : 1 variable parmi plusieurs, les autres fixées. Gradient : vecteur des dérivées partielles | Confusion fréquente |
| « Le gradient pointe vers le minimum » | « Le gradient pointe vers la plus forte montée ; −∇J vers la plus forte descente locale » | Direction locale seulement, pas vers le minimum |

## 2. Vérifications faites sur les épisodes 01 à 10

| Nº | Affirmation | Statut | Remarque |
|---|---|---|---|
| 01 | Google 2019 : environ 100 millions de spams supplémentaires bloqués par jour grâce à TensorFlow | À conserver avec la source exacte | Billet officiel Google (Google Cloud / Gmail), février 2019. Vérifier l'URL avant toute réutilisation |
| 01 | Programme de dames d'Arthur Samuel « en 1959 » | Précision utile | 1959 est l'année de l'article *Some Studies in Machine Learning Using the Game of Checkers* (IBM Journal of Research and Development). Le programme existait depuis le début des années 1950. Écrire « décrit en 1959 » plutôt que « de 1959 » |
| 02 | Encodage ordinal des quartiers = piège ; une colonne par quartier (one-hot) | Correct | Le piège dépend du modèle. **Attention** : « les arbres de décision y sont moins sensibles » n'a pas de source primaire trouvée le 2026-11-05 (scikit-learn ne le dit pas) ; ne pas l'écrire sans source |
| 04 | Ordonnée à l'origine = prix d'une maison de 0 m², sans réalité physique | Correct, bonne précision | |
| 05 | Erreur quadratique moyenne : carré des erreurs puis moyenne ; pénalise fortement les points éloignés | Correct | |
| 05 | Coût en U | Correct pour un paramètre ; bol (paraboloïde) pour deux | Pour la régression linéaire, le coût est convexe |
| 06 | J(a) = a², J'(a) = 2a, pente en a = 3 égale à 6 | Correct | |
| 07 | J(a, b) = a² + 3b², ∇J = (2a, 6b) ; gradient orthogonal aux lignes de niveau | Correct (fonction différentiable, gradient non nul) | |
| 08 | θ ← θ − η∇J(θ) ; pas plus courts près du minimum | Correct à η fixe | Garder la condition |
| 08 | Coût final non nul sur Ames | Correct | Les points ne sont pas alignés : il reste une erreur irréductible pour une droite |
| 09 | Mini-lots de 32 à 256 (usage décrit en 2016) | Correct avec la source | Goodfellow, Bengio, Courville, *Deep Learning*, MIT Press, 2016, chapitre 8 |
| 09 | Robbins et Monro, 1951 | Correct | *A Stochastic Approximation Method*, Annals of Mathematical Statistics, 1951. Conditions : Σ ηₜ = ∞ et Σ ηₜ² < ∞ |
| 10 | Fonction convexe : tout minimum local est global | Correct | |
| 10 | Coût de la régression linéaire (EQM) convexe | Correct | |
| 10 | Bruit des mini-lots qui « peut » aider | Correct (formulation prudente) | |
| 02 | One-hot, « usually a bad choice » avec beaucoup de catégories | Correct avec la source | MLCC, pas scikit-learn |
| 03 | Actions du système | Nuance imposée | « peuvent changer » ce qu'il observe : le renforcement hors ligne apprend sans agir |
| 04 | 2 925 ventes, a = 74, b = 4 | Correct | calculs.ames.droite_prix_surface() : fichier de 2 930 ventes, surfaces au-delà de 4 000 pieds carrés retirées |
| 05 | Une erreur de 25 pèse 625 erreurs de 1 au carré, 25 en valeur absolue | Correct | MSE et MAE : MLCC Loss |
| 06 | J(3,01) − J(3) ≈ 0,06 | Correct | Valeur exacte 0,0601 |
| 07 | En (1 ; 1), −∇J s'écarte de 26,6° de la direction du minimum | Correct | Recalculé ; vrai pour J = a² + 3b², pas en général |
| 08 | Cauchy, 18 octobre 1847, θ, orbite, six inconnues | Correct | Note lue en traduction anglaise, à relire en français si possible |
| 08 | GPT-3 : 175 milliards de paramètres, entraîné avec Adam | Correct | Brown et al., 2020, résumé et annexe B |
| 09 | 100 fois plus de calcul, erreur type divisée par 10 | Correct | Goodfellow, Bengio, Courville, 2016, ch. 8 ; suppose un tirage au hasard |
| 10 | Points selle plutôt que minimums locaux | Thèse, pas loi | Dauphin et al., 2014 : en partie sur des fonctions d'erreur aléatoires |

## 3. Références vérifiées réutilisables

- A. L. Samuel, « Some Studies in Machine Learning Using the Game of Checkers », *IBM Journal of Research and Development*, 1959.
- H. Robbins, S. Monro, « A Stochastic Approximation Method », *Annals of Mathematical Statistics*, 1951.
- I. Goodfellow, Y. Bengio, A. Courville, *Deep Learning*, MIT Press, 2016.
- D. De Cock, « Ames, Iowa: Alternative to the Boston Housing Data as an End of Semester Regression Project », *Journal of Statistics Education*, 2011.
- A.-L. Cauchy, « Méthode générale pour la résolution des systèmes d'équations simultanées », *Comptes rendus de l'Académie des sciences* 25, 1847, 536-538.
- C. Lemaréchal, « Cauchy and the Gradient Method », *Documenta Mathematica*, Extra Volume ISMP, 2012, 251-254.
- T. B. Brown et al., « Language Models are Few-Shot Learners », arXiv:2005.14165, 2020.
- Y. Dauphin et al., « Identifying and attacking the saddle point problem in high-dimensional non-convex optimization », arXiv:1406.2572, 2014.
- A.-M. Legendre, méthode des moindres carrés, 1805 ; C. F. Gauss, 1809 (utile pour l'épisode 11).

Toute nouvelle référence : vérifier en ligne (auteur, titre, année, revue) avant de l'ajouter ici.
