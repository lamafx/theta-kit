# Relecture · Nº 09 · Descente stochastique et mini-lots

Relu le 2026-11-01. Avertissements scientifiques (contre-exemple ou hypothèse implicite, voir la charte, « La validation scientifique ») : **D3** (page 6 : un η fixe « ne laisse pas le modèle se poser », contre-exemple publié quand chaque exemple a un gradient nul au minimum), **D1** (taille de mini-lot « 32 à 256 » : sources divergentes), **D4** (page 5 : la pratique, un exemple vu une fois par époque, écrite comme une définition).

Limite de la relecture : la page HTML du Deep Learning Book (chapitre 8) n'a pas pu être lue par l'outil (texte vide après conversion, aussi via un proxy de lecture) ; les extraits `dlb-*` sont recoupés par la version de travail de 2015 hébergée sur book.huihoo.com (lecture partielle), par la traduction chinoise du 8.1.3 et, pour le fond, par D2L et Ruder (voir D6).

## Mises en conformité (appliquées automatiquement)

### C1 · Pages 3 et 7, texte du post : la taille de mini-lot « 32 à 256 » n'est pas datée

- **Constat** : « souvent de 32 à 256 exemples » (page 3, `cas[2].texte` ; page 7, `points[0]` ; post, `promesse`) est un chiffre de pratique qui change avec le temps (voir D1), donné sans date alors que sa source, le Deep Learning Book, est datée de 2016.
- **Source** : [Deep Learning, Goodfellow, Bengio et Courville (page d'accueil)](https://www.deeplearningbook.org/), BibTeX : « publisher={MIT Press}, » « year={2016} » ; extrait `dlb-32-256` (« Typical power of 2 batch sizes range from 32 to 256, with 16 sometimes being attempted for large models. »), confirmé par la traduction du 8.1.3 ([windmising.gitbook.io](https://windmising.gitbook.io/bible-deeplearning/0optimization/0difference/3minibatch) : « 一般，2的幂数的取值范围是32到256 »).
- **Avant / après** :
  - page 3, `cas[2].texte` : « Chaque pas lit un mini-lot, souvent de 32 à 256 exemples. » → « Chaque pas lit un mini-lot, souvent de 32 à 256 exemples (usage décrit en 2016). » (4 lignes au plus dans la colonne, comme la colonne « Un exemple » : la grille ne grandit pas)
  - page 7, `points[0]` : « Chaque pas lit un exemple tiré au hasard (SGD) ou un mini-lot, souvent de 32 à 256 exemples. » → « Chaque pas lit un exemple tiré au hasard (SGD) ou un mini-lot, souvent de 32 à 256 en 2016. » (même longueur de ligne : la page n'a que 6 px libres)
  - post, `promesse` : « … ou un mini-lot, souvent de 32 à 256 exemples. » → « … ou un mini-lot, souvent de 32 à 256 exemples (usage décrit en 2016). »
- **Règle appliquée** : tout chiffre est daté et sourcé (CLAUDE.md, « Règles éditoriales Théta »). Relancer `serie verifier 09` (débordement page 7, longueur du post).

## Décisions de l'utilisateur

### D1 · Pages 3 et 7, post : « souvent de 32 à 256 exemples », une fourchette que les sources ne partagent pas

- **Constat** : la fourchette vient d'une seule source (DLB, 2016) ; d'autres sources primaires donnent d'autres valeurs : Ruder (2017) écrit 50 à 256, Masters et Luschi (2018) trouvent les meilleurs résultats entre 2 et 32, Goyal et al. (2017) entraînent sans perte jusqu'à 8 192 images par mini-lot. « Souvent » et la date (C1) gardent la phrase juste ; la question est de savoir si l'on dit davantage.
- **Source vérifiée** :
  - [Ruder, An overview of gradient descent optimization algorithms, arXiv:1609.04747v2 (2017)](https://arxiv.org/html/1609.04747) : « Common mini-batch sizes range between 50 and 256, but can vary for different applications. »
  - [Masters et Luschi, Revisiting Small Batch Training for Deep Neural Networks, arXiv:1804.07612 (2018)](https://arxiv.org/abs/1804.07612) : « The best performance has been consistently obtained for mini-batch sizes between m = 2 and m = 32 »
  - [Goyal et al., Accurate, Large Minibatch SGD: Training ImageNet in 1 Hour, arXiv:1706.02677 (2017)](https://arxiv.org/abs/1706.02677) : « we show no loss of accuracy when training with large minibatch sizes up to 8192 images. »
- **Correction proposée** :
  - Option A : garder la phrase datée de C1, rien d'autre.
  - Option B, page 3, `cas[2].texte`, après C1 : « Chaque pas lit un mini-lot, souvent de 32 à 256 exemples (usage décrit en 2016). » → « Chaque pas lit un mini-lot : quelques dizaines à quelques centaines d'exemples, selon le modèle. » (et de même en page 7 et dans le post ; plus de chiffre à dater, la fourchette couvre DLB et Ruder, pas les extrêmes)
  - Option C, post seulement, ajouter après la phrase de `promesse` : « La bonne taille reste discutée : de 2 à 32 dans une étude de 2018, jusqu'à 8 192 dans une autre de 2017. » (ajouter les extraits `masters-2-32` et `goyal-8192` à `sources/09/` et les références à la fiche)
- **Option recommandée** : A ; la page est une comparaison de trois façons de faire, et « souvent » plus la date suffisent à ne pas présenter la fourchette comme une règle. C si vous voulez que le post porte la nuance (il a de la marge, pas les pages).
- **Décision** : oui (A) / oui (B) / oui (C) / non / autre

### D2 · Page 3 (Comparaison), `cas[1].titre` : « Rapide » contredit l'encadré

- **Constat** : la colonne « Un exemple » est titrée « Rapide, mais bruité », puis l'encadré dit qu'« un exemple à la fois fait perdre du temps machine » et que le mini-lot va plus vite que les deux autres ; le lecteur reçoit « rapide » et « lent » pour le même cas. La source distingue : rapide en nombre d'exemples traités, plus lent en temps de calcul.
- **Source vérifiée** : [D2L 12.5 · Minibatch Stochastic Gradient Descent](https://d2l.ai/chapter_optimization/minibatch-sgd.html) : « although stochastic gradient descent converges faster than GD in terms of number of examples processed, it uses more time to reach the same loss than GD because computing the gradient example by example is not as efficient. »
- **Correction proposée** : `cas[1].titre`, avant « Rapide, mais bruité » ; après « Léger, mais bruité » (en miroir de « Régulier, mais lourd » ; même nombre de mots).
- **Option recommandée** : appliquer ; chaque pas est léger (un seul exemple), ce qui est exact, et l'encadré n'a plus à corriger le titre. Autre option : « Pas léger, mais bruité ».
- **Décision** : oui / non / autre

### D3 · Page 6 (Piège), `titre` et `texte` : contre-exemple au « ne se pose pas » avec un η fixe

- **Constat** : la page affirme sans condition qu'avec un η fixe « les écarts ne disparaissent pas, même au minimum » ; c'est vrai quand les exemples ne sont pas tous ajustés au même point (cas dessiné, cas visé par DLB et D2L), mais il existe un contre-exemple publié : si le modèle ajuste exactement chaque exemple, le gradient de chaque exemple est nul au minimum, l'écart disparaît, et la SGD à taux fixe converge.
- **Source vérifiée** :
  - [D2L 12.4 · Stochastic Gradient Descent](https://d2l.ai/chapter_optimization/sgd.html) : « even when we arrive near the minimum, we are still subject to the uncertainty injected by the instantaneous gradient » (version de la page)
  - [Ma, Bassily et Belkin, The Power of Interpolation, arXiv:1712.06559 (2017-2018)](https://ar5iv.labs.arxiv.org/html/1712.06559) : « in the interpolated regime SGD with fixed step size converges exponentially fast for convex loss functions »
- **Correction proposée** :
  - Option A, `texte`, avant : « Avec un $η$ fixe, les écarts ne disparaissent pas, même au minimum : le modèle rebondit autour sans s'y poser. » ; après : « Avec un $η$ fixe, en général, les écarts ne disparaissent pas, même au minimum : le modèle rebondit autour sans s'y poser. » (46 mots avec le titre ; la suite inchangée)
  - Option B, après : « Avec un $η$ fixe, les écarts ne disparaissent pas, même au minimum, sauf si chaque exemple y a un $∇J$ nul : le modèle rebondit autour sans s'y poser. » (52 mots ; ajouter l'extrait `ma-interpolation` à `sources/09/` et la référence à la fiche)
  - Option C : laisser tel quel (raccourci assumé : le cas des pages est celui d'un bruit qui ne s'annule pas).
- **Option recommandée** : A ; deux mots ouvrent l'exception sans introduire un cas que la série n'a pas encore les moyens d'expliquer. B si vous voulez nommer l'exception (une ligne de plus, 89 px libres).
- **Décision** : oui (A) / oui (B) / oui (C) / non / autre

### D4 · Page 5 (Définition), `lignes[0].sens` : une pratique écrite comme une définition

- **Constat** : « Chaque exemple y est vu une fois, dans un ordre tiré au hasard » décrit le parcours sans remise, que D2L appelle un choix de pratique ; la définition de la page 3 (« un exemple tiré au hasard » à chaque pas) est un tirage avec remise, où un exemple peut revenir deux fois dans une même époque.
- **Source vérifiée** : [D2L 12.4 · Stochastic Gradient Descent](https://d2l.ai/chapter_optimization/sgd.html) : « Sampling with replacement leads to an increased variance and decreased data efficiency » ; « Hence, in practice we perform the latter (and this is the default choice throughout this book). »
- **Correction proposée** : avant « Chaque exemple y est vu une fois, dans un ordre tiré au hasard, qui change d'une époque à l'autre. » ; après « En pratique, chaque exemple y est vu une fois, dans un ordre tiré au hasard, qui change d'une époque à l'autre. »
- **Option recommandée** : appliquer ; deux mots, la définition du panneau reste seule à définir, et les pages 3 et 5 ne se contredisent plus. Autre option : laisser (écart sans conséquence pour le lecteur à ce stade).
- **Décision** : oui / non / autre

### D5 · Page 5 (Définition), `lignes` : le mini-lot manque au décompte des pas

- **Constat** : la page répond à « combien de pas pour les voir tous ? » pour tout le jeu et pour un exemple, pas pour le mini-lot, que la page 3 vient de présenter comme le compromis retenu.
- **Source vérifiée** : [D2L 12.5 · Minibatch Stochastic Gradient Descent](https://d2l.ai/chapter_optimization/minibatch-sgd.html) : « In our case this amounts to 1500 updates per epoch. » ; « each observation is processed only once per epoch » ; chiffre : `calculs.descente_gradient.pas_par_epoque(1500, 32)` = 47 (le dernier lot compte 28 exemples).
- **Correction proposée** : ajouter, entre la ligne « Un exemple à chaque pas : 1 500 pas pour 1 500 exemples. » et « On fait d'ordinaire plusieurs époques. », la ligne `sens: "Un mini-lot de 32 à chaque pas : 47 pas pour 1 500 exemples."`
- **Option recommandée** : appliquer ; la page compte alors les trois cas de la page 3, avec un chiffre issu de `calculs/` (191 px libres, une ligne en prend environ 80). Autre option : laisser, la page restant juste.
- **Décision** : oui / non / autre

### D6 · Sources : ajouter Ruder pour « On dit souvent SGD même avec des mini-lots »

- **Constat** : l'encadré de la page 3 repose sur `dlb-stochastique` (« it is now common to call them simply stochastic methods »), qui dit « méthodes stochastiques », pas « SGD », et dont la page primaire n'a pas pu être relue ; une source primaire lisible dit exactement ce qu'écrit la page.
- **Source vérifiée** : [Ruder, An overview of gradient descent optimization algorithms, arXiv:1609.04747v2](https://arxiv.org/html/1609.04747), section 2.3 : « the term SGD usually is employed also when mini-batches are used »
- **Correction proposée** : ajouter à `sources/09/extraits.yaml` l'extrait `ruder-sgd-mini-lots` (référence https://arxiv.org/abs/1609.04747, lu sur https://arxiv.org/html/1609.04747, extrait ci-dessus, appuie « Comparaison, encadré : on dit souvent SGD même avec des mini-lots ») ; ajouter Ruder (2017) aux références `cours` de la fiche 09 ; ajouter l'id aux `sources` de la page 3. Aucun texte publié ne change.
- **Option recommandée** : appliquer ; Ruder est déjà une source de la série (épisode 08). Autre option : garder DLB seul.
- **Décision** : oui / non / autre

## Contrôles automatiques (serie verifier)

Recopie de `sortie/09/verification.md` :

- Erreurs bloquantes : aucune.
- Avertissements (3) :
  - page 4 (mécanisme) : titre : « moyenne » est le terme « moyenne μ », introduit à l'épisode 13 (mot courant : vérifier le sens)
  - page 4 (mécanisme) : texte : « moyenne » est le terme « moyenne μ », introduit à l'épisode 13 (mot courant : vérifier le sens)
  - page 7 (fin) : point 2 : « moyenne » est le terme « moyenne μ », introduit à l'épisode 13 (mot courant : vérifier le sens)

| Page | Mots | Vide au-dessus du pied (px) |
| --- | ---: | ---: |
| 1 | 4 | 54 |
| 2 | 28 | 164 |
| 3 | 20 | 28 |
| 4 | 45 | 60 |
| 5 | 20 | 191 |
| 6 | 44 | 89 |
| 7 | 0 | 6 |

Seuil de remplissage : 233 px.

Sens vérifié pour « moyenne » : locution courante « en moyenne », sans symbole μ ni calcul de moyenne ; le sens (espérance du gradient d'un exemple tiré au hasard) est celui de D2L (« on average »). Rien à changer.

## Affirmations et sources

Pages lues le 2026-11-01 (WebFetch), sauf mention.

| Page | Affirmation | Extrait | Vérifiée sur |
| --- | --- | --- | --- |
| 2 | Rappel : Nº 05 le coût J, Nº 06 et 07 le gradient ∇J, Nº 08 un pas dans l'autre sens | (épisodes précédents) | `contenu/05.yaml` à `08.yaml` |
| 2 | Chaque pas (descente de l'épisode 08) calcule ∇J sur tous les exemples, un calcul par exemple ; le coût d'un pas grandit avec le nombre d'exemples | d2l-moyenne-exemples, d2l-cout-n, d2l-cout-grand-jeu, d2l-tout-le-jeu | [D2L 12.4](https://d2l.ai/chapter_optimization/sgd.html) (« usually the average of the loss functions for each example », « when the training dataset is larger, the cost of gradient descent for each iteration will be higher ») ; [D2L 12.5](https://d2l.ai/chapter_optimization/minibatch-sgd.html) (« uses the full dataset to compute gradients ») |
| 2 | « Imaginons-en un million » | hypothèse (A59) | Dit comme une hypothèse ; aucun chiffre réel |
| 3 | Trois façons : tout le jeu, un exemple tiré au hasard (SGD), un mini-lot | d2l-tout-le-jeu, d2l-un-exemple, d2l-sgd-un-exemple, d2l-entre-les-deux, d2l-mini-lot, dlb-entre-deux | [D2L 12.4](https://d2l.ai/chapter_optimization/sgd.html) (« we uniformly sample an index ») ; [D2L 12.5](https://d2l.ai/chapter_optimization/minibatch-sgd.html) (« two extremes », « something in between », « over a small batch ») ; DLB : version 2015 (huihoo) « fall somewhere in between » |
| 3 | Tout le jeu : régulier, mais lourd ; un exemple : bruité ; mini-lot : bien moins bruité | d2l-bruite, d2l-ecart-type, d2l-mieux-aligne, d2l-sgd-o1 | [D2L 12.4](https://d2l.ai/chapter_optimization/sgd.html) (« much more noisy », « drops from O(n) … to the constant O(1) ») ; [D2L 12.5](https://d2l.ai/chapter_optimization/minibatch-sgd.html) (« standard deviation is reduced by a factor », « more reliably aligned with the full gradient ») ; « Rapide » : voir D2 |
| 3 | Mini-lot souvent de 32 à 256 exemples | dlb-32-256 | DLB primaire illisible par l'outil ; traduction du 8.1.3 (gitbook) ; date 2016 sur [deeplearningbook.org](https://www.deeplearningbook.org/) ; sources divergentes : voir C1 et D1 |
| 3 | On dit souvent SGD même avec des mini-lots | dlb-stochastique | DLB, version 2015 (huihoo) : « These were traditionally called minibatch or minibatch stochastic methods » ; [Ruder v2](https://arxiv.org/html/1609.04747) (« the term SGD usually is employed also when mini-batches are used ») ; voir D6 |
| 3 | Un exemple à la fois fait perdre du temps machine ; en temps de calcul, le mini-lot va en général plus vite | d2l-temps-sgd, d2l-horloge, d2l-compromis | [D2L 12.5](https://d2l.ai/chapter_optimization/minibatch-sgd.html) (« In general, minibatch stochastic gradient descent is faster than stochastic gradient descent and gradient descent … when measured in terms of clock time ») |
| 3, 4, 6 | Chemins bruités dessinés | d2l-simulation | `calculs.descente_gradient.sgd_2d` (bruit de moyenne 0, écart-type divisé par √lot) ; [D2L 12.4](https://d2l.ai/chapter_optimization/sgd.html) (« adding random noise with a mean of 0 and a variance of 1 to the gradient to simulate ») |
| 4 | En moyenne, le ∇J d'un exemple indique la même direction que celui de tout le jeu | d2l-en-moyenne | [D2L 12.4](https://d2l.ai/chapter_optimization/sgd.html) (« on average, the stochastic gradient is a good estimate of the gradient » ; équation 12.4.4 : l'espérance, sous un tirage uniforme, est égale au gradient de tout le jeu) |
| 4 | Le chemin zigzague, puis arrive près du minimum | d2l-bruite, d2l-pres-du-minimum | [D2L 12.4](https://d2l.ai/chapter_optimization/sgd.html) (« even when we arrive near the minimum ») |
| 4 | Un seul creux : cas particulier ; plusieurs creux, plus de garantie en général | d2l-convexe, d2l-non-convexe | [D2L 12.4](https://d2l.ai/chapter_optimization/sgd.html) (« For convex problems we can prove … », « Optimality guarantees … are in general not available in nonconvex cases ») |
| 5 | Une époque, un passage complet ; chaque exemple vu une fois, ordre tiré au hasard, qui change | d2l-une-fois-par-epoque, d2l-une-seule-fois, d2l-ordre-different | [D2L 12.5](https://d2l.ai/chapter_optimization/minibatch-sgd.html) (« each observation is processed only once per epoch, albeit in random order ») ; [D2L 12.4](https://d2l.ai/chapter_optimization/sgd.html) (« in a different random order », « in practice we perform the latter ») ; voir D4 |
| 5 | Tout le jeu : 1 pas par époque ; un exemple : 1 500 pas pour 1 500 exemples | d2l-tout-le-jeu-epoque, d2l-1500-pas, d2l-1500-exemples | [D2L 12.5](https://d2l.ai/chapter_optimization/minibatch-sgd.html) (« updated only once per epoch », « 1500 updates per epoch », « minibatch size to 1500 (i.e., to the total number of examples) ») |
| 5 | On fait d'ordinaire plusieurs époques | dlb-plusieurs-passages, dlb-epoques | DLB primaire illisible par l'outil ; nuance de l'extrait (« unless the training set is extremely large ») rendue par « d'ordinaire » |
| 6 | Avec un η fixe, les écarts ne disparaissent pas au minimum ; le modèle rebondit autour | dlb-bruit-demeure, d2l-pres-du-minimum, d2l-sans-progres, d2l-rebondir | [D2L 12.4](https://d2l.ai/chapter_optimization/sgd.html) (« it will not improve after additional steps ») ; [D2L 12.11](https://d2l.ai/chapter_optimization/lr-scheduler.html) (« bouncing around the minimum and thus not reach optimality ») ; contre-exemple : voir D3 |
| 6 | D'où un η qui décroît au fil des époques, ni trop vite ni trop lentement | d2l-reduire-eta, d2l-par-epoque, d2l-decroitre-eta, d2l-ni-trop-vite, d2l-pas-trop-vite, dlb-decroitre | [D2L 12.4](https://d2l.ai/chapter_optimization/sgd.html) (« If it is too quick, we will stop optimizing prematurely », « albeit not too quickly ») ; [D2L 12.11](https://d2l.ai/chapter_optimization/lr-scheduler.html) (« adjust it downward after every epoch (or even after every minibatch) ») ; [D2L 12.5](https://d2l.ai/chapter_optimization/minibatch-sgd.html) (« advisable to decay the learning rates ») |
| 6 | En 1951, Robbins et Monro raccourcissaient les pas d'une suite d'essais bruités pour approcher une solution | rm-publication, rm-inconnue, rm-methode, rm-suite, rm-un-sur-n | [Robbins et Monro (1951), copie JSTOR, Columbia](https://www.columbia.edu/~ww2040/8100F16/RM51.pdf) : « The Annals of Mathematical Statistics , Sep., 1951, Vol. 22, No. 3 » ; « M(x) is assumed to be a monotone function of x but is unknown to the experimenter » ; « Let {aₙ} be a fixed sequence of positive constants such that » (Σaₙ² < ∞) ; « satisfied by the sequence aₙ = 1/n ». Il s'agit de trouver la racine de M(x) = α, d'où « une solution », correctement général |
| 7 | Résumé des pages 3, 4 et 6 ; question → page 6 ; épisode suivant Nº 10 « Minimums locaux et points selle », « Et si la courbe avait plusieurs creux ? » | (pages 3 à 6) ; fiche 09 `episode_suivant` | Conforme à la fiche et à `banque/episodes/10-minimums-locaux-et-points-selle.yaml` ; rien de nouveau |
| Post | Accroche, soupe (analogie non attribuée), trois façons, époque, η qui décroît ni trop vite ni trop lentement, idée présente chez Robbins et Monro en 1951 | mêmes extraits | Mêmes pages ; « ni trop vite ni trop lentement » est bien chez Robbins et Monro : condition (6) Σaₙ² < ∞ (assez vite) et (26)-(27) Σaₙ = ∞ (pas trop vite) ; « 32 à 256 » : voir C1 |

Fiche : pas de section « à ne pas écrire » ni « faits vérifiés » dans `banque/episodes/09-descente-stochastique-et-mini-lots.yaml` ; le message de la page 6 de la fiche (« ne se pose jamais ») a bien été adouci dans la page (pas de « jamais »). Termes nouveaux (descente stochastique (SGD), mini-lot, époque) : ceux de la fiche. Aucun tiret long (—) dans `contenu/09.yaml`. Aucune citation entre guillemets dans les pages ni dans le post. « Un cas particulier » est dit (page 4, encadré).

Images : aucune image réelle (`assets/images/candidats/09/` n'existe pas) ; couverture et fin portent le personnage de la série (élément de design, sans légende ni crédit). Les chemins des pages 3, 4 et 6 sont des simulations (`sgd_2d`), sans légende, conformément à la règle « pas de légende sous les schémas ».

À l'œil (planche et pages) : lecture fluide, aucun débordement, pas de ∂ ni de ← affiché ; η reste en minuscule partout (aucun η dans un titre d'encadré). Gênes mineures, sans décision séparée : page 4, le chemin bleu est dense autour de la croix (la croix reste visible) ; page 6, le chemin orange s'emmêle au centre, ce qui sert le propos ; page 7, « selle » seul sur la seconde ligne du titre de l'épisode suivant (titre de la fiche, rendu par le gabarit) ; page 3, étiquettes de colonnes en STIX, conforme au gabarit.

## Validation scientifique

**Page 2 (Ouverture)**
- Hypothèse : J est la moyenne des coûts de chaque exemple ; le gradient de tout le jeu coûte un calcul par exemple.
- Domaine : dit (« un calcul par exemple ») ; le million est donné comme hypothèse (« Imaginons »).
- Contre-exemple : aucun dans ce cadre (un calcul vectorisé reste proportionnel au nombre d'exemples).
- Raccourci : « un calcul » par exemple, assumé.

**Page 3 (Comparaison)**
- Hypothèse : même carte, même départ, même η ; bruit d'un exemple de moyenne 0, divisé par √32 pour un mini-lot.
- Domaine : dit (« Même carte, même départ. Seul change… ») ; la simulation n'est pas dite, raccourci de schéma.
- Contre-exemple : en temps de calcul, un exemple par pas n'est pas « rapide » (D2) ; la taille de mini-lot varie selon les sources (D1).
- Raccourci : chemins simulés comme dans D2L ; fourchette à dater (C1).

**Page 4 (Mécanisme)**
- Hypothèse : tirage uniforme (le gradient d'un exemple est juste en moyenne) ; coût à un seul creux.
- Domaine : dit (encadré « Un cas particulier » : un seul creux).
- Contre-exemple : plusieurs creux, plus de garantie (dit) ; « un seul creux » remplace « convexe » de D2L (une fonction à un seul creux peut ne pas être convexe), raccourci acceptable à ce niveau.
- Raccourci : « le ∇J d'un seul exemple » pour le gradient du coût d'un exemple, assumé ; « près du » minimum, pas « au » minimum, juste.

**Page 5 (Définition)**
- Hypothèse : parcours sans remise, mélange à chaque époque ; jeu de 1 500 exemples (D2L).
- Domaine : la pratique est écrite comme une définition (D4).
- Contre-exemple : tirage avec remise (définition de la page 3), un exemple peut revenir dans une époque ; jeu très grand, une seule époque peut suffire (DLB, « unless the training set is extremely large »), couvert par « d'ordinaire ».
- Raccourci : le mini-lot manque au décompte (D5).

**Page 6 (Piège)**
- Hypothèse : η fixe et gradients des exemples non tous nuls au minimum.
- Domaine : la seconde condition n'est pas dite.
- Contre-exemple : modèle qui ajuste exactement chaque exemple, SGD à taux fixe qui converge (Ma, Bassily et Belkin) ; sur tout le jeu, un η fixe suffit (épisode 08, `dlb-vrai-gradient`), cas hors page.
- Raccourci : à signaler par « en général » (D3) ; Robbins et Monro résolvent M(x) = α, pas un minimum, et la page dit « une solution », juste.

**Page 7 (Fin)**
- Hypothèse : celles des pages 3, 4 et 6.
- Domaine : résumé fidèle ; rien de nouveau.
- Contre-exemple : ceux de D1 et D3.
- Raccourci : point 3 (« le modèle rebondit autour du minimum ») hérite de D3 ; inchangé si A est retenu, la page 6 portant la nuance.

**Texte du post**
- Hypothèse : celles des pages ; la soupe est une analogie (échantillon bien mélangé = tirage au hasard).
- Domaine : cohérent avec les pages.
- Contre-exemple : ceux de D1 et D3.
- Raccourci : « doit décroître » repose sur DLB (« it is necessary ») et D2L (« advisable ») ; chiffre à dater (C1).
