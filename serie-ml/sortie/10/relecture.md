# Relecture · Nº 10 · Minimums locaux et points selle

Relu le 2026-11-02. Avertissements scientifiques (hypothèse implicite ou désaccord, voir la charte, « La validation scientifique ») : **D1** (page 3 et page 5 : la fiche décrit le point selle comme « plat dans une direction, en pente dans l'autre », D2L dit que toutes les pentes y sont nulles ; le contenu suit D2L, mais présente l'exemple $J$ = a² − b² comme le cas général), **D3** (page 4 : « toute corde reste au-dessus » contredit « le fond peut être plat » de la même page), **D4** (page 4, encadré : « grands modèles », la taille n'est pas le critère de la source).

Limites de la relecture : le PDF arXiv v1 de Dauphin et al. n'a pas pu être converti en texte par l'outil ; les extraits `dauphin-*` du corps de l'article sont vérifiés sur la version HTML d'ar5iv (dernière version de l'article), le résumé et la date sur la page abs d'arXiv. La fiche n'a pas de rubrique « à ne pas écrire ». Aucune image réelle dans l'épisode (pas de dossier `assets/images/candidats/10/`) : point 5 de la procédure sans objet.

## Mises en conformité (appliquées automatiquement)

### C1 · Page 5 (Fin), `points[0]` : la page de fin généralise ce que la page 2 limitait à un cas

- **Constat** : la page 2 dit « La descente partie à gauche s'arrête au premier » (cette courbe, ce départ) ; la page de fin écrit « La descente s'arrête au premier creux », sans condition, comme une règle. La source dit « peut ».
- **Source** : [D2L 12.1 · Optimization and Deep Learning](https://d2l.ai/chapter_optimization/optimization-intro.html), extrait `d2l-arret-local` : « the numerical solution obtained by the final iteration may only minimize the objective function locally, rather than globally » ; et extrait `d2l-bruit-deloge` : « Only some degree of noise might knock the parameter out of the local minimum. »
- **Avant / après** :
  - avant : « La descente s'arrête au premier creux, où la pente est nulle : un **minimum local**. Le plus bas est le **minimum global**. »
  - après : « La descente peut s'arrêter au premier creux, où la pente est nulle : un **minimum local**. Le plus bas est le **minimum global**. »
- **Règle appliquée** : pas de formule absolue non sourcée (CLAUDE.md, « Règles éditoriales Théta ») ; la page de fin ne dit rien de nouveau. La page 5 n'a que 6 px libres : relancer `serie rendre 10` puis `serie verifier 10` (la ligne 1 gagne un mot, la ligne 3 est courte, le texte devrait rester sur 3 lignes).

## Décisions de l'utilisateur

### D1 · Pages 3 et 5, `texte` et `points[1]` (et fiche, `pages[2].message`) : ce qui est « plat » au point selle

- **Constat** : trois versions coexistent.
  - La fiche (page 3) : « Le point selle : plat dans une direction, en pente dans l'autre. » C'est inexact : au point selle, la pente est nulle dans toutes les directions ; ce qui diffère d'une direction à l'autre, c'est la courbure (creux ou bosse).
  - D2L 12.1 : toutes les pentes s'annulent, et pour f(x, y) = x² − y², le point (0, 0) est un minimum selon x et un maximum selon y. Le critère général est celui de la matrice des dérivées secondes : des valeurs propres de signes opposés.
  - Le contenu (page 3 et fin) : « $∇J$ = (0 ; 0), mais $J$ est en creux selon $a$, en bosse selon $b$ ». C'est juste pour l'exemple dessiné ($J$ = a² − b²), mais la phrase se lit comme une définition générale. En général, la direction du creux et celle de la bosse ne sont pas les axes $a$ et $b$. Il faut donc signaler le cas particulier (règle éditoriale).
- **Source vérifiée** : [D2L 12.1 · Optimization and Deep Learning](https://d2l.ai/chapter_optimization/optimization-intro.html) :
  - « A saddle point is any location where all gradients of a function vanish but which is neither a global nor a local minimum. »
  - « This is a maximum with respect to \(y\) and a minimum with respect to \(x\). »
  - « When the eigenvalues of the function's Hessian matrix at the zero-gradient position are negative and positive, we have a saddle point for the function. »
- **Correction proposée** :
  - Option A, à trois endroits :
    - page 3, `texte` : avant « mais $J$ est en creux selon $a$, en bosse selon $b$. » ; après « mais ici $J$ est en creux selon $a$, en bosse selon $b$. » (un mot de plus : 49 mots sur la page).
    - page 5, `points[1]` : avant « Au **point selle**, $∇J$ = (0 ; 0), mais $J$ est en creux selon $a$, en bosse selon $b$. » ; après « Au **point selle**, $∇J$ = (0 ; 0), mais $J$ est en creux dans une direction, en bosse dans une autre. » Ajouter à `sources/10/extraits.yaml` l'extrait `d2l-selle-hessien` (la phrase « negative and positive » ci-dessus) et le citer en page 3.
    - fiche, `pages[2].message` (à corriger par vous, hors production) : avant « Le point selle : plat dans une direction, en pente dans l'autre. » ; après « Le point selle : pente nulle partout, mais creux dans une direction, bosse dans l'autre. »
  - Option B : suivre la fiche à la lettre (« plat dans une direction, en pente dans l'autre »). Déconseillé : D2L dit le contraire (« all gradients of a function vanish »), et la question de la page 5 (« la pente est nulle : pourquoi n'est-ce pas un minimum ? ») perdrait son sens.
  - Option C : garder le contenu tel quel et ne corriger que la fiche (raccourci non signalé : $a$ et $b$ servent de directions générales).
- **Option recommandée** : A. Elle garde la version de D2L, que le contenu suit déjà, et dit que l'exemple est un cas particulier. La fin énonce alors la propriété générale, déjà montrée en page 3. Si vous ne voulez pas d'extrait nouveau, C, mais la page de fin reste écrite comme une définition.
- **Décision** : oui (A) / oui (B) / oui (C) / non / autre

### D2 · Page 3, `texte` : « Partie sur l'axe » ne dit pas quel axe

- **Constat** : la page a deux axes ($a$ et $b$). La descente ne cale que si elle part sur l'axe de $a$ ($b$ = 0). Partie sur l'axe de $b$, elle s'éloigne tout de suite du point selle. Le lecteur doit le deviner sur le schéma.
- **Source vérifiée** : [D2L 12.1](https://d2l.ai/chapter_optimization/optimization-intro.html) : « Optimization might stall at this point, even though it is not a minimum. » ; [Dauphin et al. (2014), ar5iv](https://ar5iv.labs.arxiv.org/html/1406.2572) : « While gradient descent dynamics are repelled away from a saddle point to lower error by following directions of negative curvature, this repulsion can occur slowly due to the plateau. »
- **Correction proposée** : avant « Partie sur l'axe, la descente y cale ; partie à côté, elle finit par s'en écarter. » ; après « Partie sur l'axe de $a$, la descente y cale ; partie à côté, elle finit par s'en écarter. » (deux mots de plus : 50 mots sur la page, 51 avec D1-A ; la page a 35 px libres, une ligne de texte de plus est possible : relancer `serie verifier 10`).
- **Option recommandée** : appliquer, parce que la phrase devient lisible sans le schéma. Autre option : laisser le texte et nommer les chemins sur le schéma (voir D5).
- **Décision** : oui / non / autre

### D3 · Page 4, `texte` : « toute corde reste au-dessus de la courbe », puis « le fond peut toutefois être plat »

- **Constat** : la définition de D2L est une inégalité large (≥). Une corde peut donc toucher la courbe. C'est le cas sur un fond plat, que la même page annonce deux phrases plus loin. Les deux phrases se contredisent à la lettre. Le libellé du schéma (« la corde reste au-dessus ») reste juste pour la parabole dessinée.
- **Source vérifiée** : [D2L 12.2 · Convexity](https://d2l.ai/chapter_optimization/convexity.html) : « \(\lambda f(x) + (1-\lambda) f(x') \geq f(\lambda x + (1-\lambda) x')\) » ; « this does not mean that there cannot be more than one global minimum ». La page ne contient pas de phrase sur la corde : l'image de la corde est une lecture de l'inégalité.
- **Correction proposée** : avant « Pour une **fonction convexe**, toute corde reste au-dessus de la courbe, et tout minimum local est global » ; après « Pour une **fonction convexe**, aucune corde ne passe sous la courbe, et tout minimum local est global » (même nombre de mots).
- **Option recommandée** : appliquer, parce que la définition devient exacte et s'accorde avec « le fond peut toutefois être plat ». Autre option : garder « au-dessus », comme raccourci assumé pour une courbe en U.
- **Décision** : oui / non / autre

### D4 · Page 4, `encadres[0].texte` : « la plupart des grands modèles »

- **Constat** : la source parle des problèmes d'apprentissage profond, pas de la taille des modèles. Un modèle linéaire reste convexe quel que soit son nombre de réglages : c'est la phrase de MLCC citée en page 4. « Grands » suggère un critère que la source ne donne pas. Le terme « réseau profond » n'est introduit qu'au Nº 39 et ne peut pas servir ici.
- **Source vérifiée** : [D2L 12.1](https://d2l.ai/chapter_optimization/optimization-intro.html) : « Sadly, though, most deep learning problems do not fall into this category. » et « The objective function of deep learning models usually has many local optima. » ; [MLCC · Gradient descent](https://developers.google.com/machine-learning/crash-course/linear-regression/gradient-descent) (mise à jour du 2026-02-03) : « The loss functions for linear models always produce a convex surface. »
- **Correction proposée** : avant « Pour la plupart des grands modèles, vus plus loin dans la série, le coût n'est pas convexe et compte de nombreux creux. » ; après « Pour beaucoup de modèles vus plus loin dans la série, le coût n'est pas convexe et compte de nombreux creux. »
- **Option recommandée** : appliquer : « beaucoup » est couvert par la source sans affirmer une majorité parmi tous les modèles de la série, dont certains sont convexes. Autre option : « Pour beaucoup de modèles à plusieurs couches, vus plus loin dans la série, … », si « couche » est déjà introduit (à vérifier dans le glossaire).
- **Décision** : oui / non / autre

### D5 · Page 3, visuel : le chemin bleu traverse le libellé « réglage $b$ », et les libellés du bas se lisent d'un trait

- **Constat** : sur `page-03.png`, la fin du chemin bleu (20 pas) monte jusqu'en haut du cadre et barre le libellé d'axe « réglage $b$ ». Sous l'axe, « cale au point selle » et « point selle » se suivent sur la même ligne et se lisent « cale au point selle point selle ». Les deux points de départ se superposent presque.
- **Source vérifiée** : rendu `sortie/10/page-03.png`. Calcul : avec $η$ = 0,1 et $J$ = a² − b², $b$ est multiplié par 1,2 à chaque pas ; parti de $b$ = 0,08, le chemin atteint $b$ ≈ 1,23 au pas 15 et le haut du cadre (1,65) vers le pas 17.
- **Correction proposée** :
  - `chemins[1]` : avant `pas: 20` ; après `pas: 15` (le chemin s'arrête sous le libellé ; l'ancre du texte, pas 13, reste valide).
  - `chemins[0].texte` : avant « cale au point selle » ; après « sur l'axe : cale » ; `chemins[1].texte` : avant « s'en écarte » ; après « à côté : s'en écarte » (les mots du texte de la page, sans redite de « point selle »).
- **Option recommandée** : les deux changements, pour que le schéma reprenne la phrase de la page sans chevauchement. Si un seul : `pas: 15`.
- **Décision** : oui / non / autre

### D6 · Page 4, `texte` : « (Nº 05) » s'affiche « (No 05) »

- **Constat** : dans la police du texte courant, le « º » du rendu paraît à la hauteur d'un « o » ordinaire : on lit « No 05 ». Dans le rappel de la page 2 (police à chasse fixe), « Nº » s'affiche bien.
- **Source vérifiée** : rendus `sortie/10/page-04.png` et `sortie/10/page-02.png`.
- **Correction proposée** : aucune dans le contenu ; vérifier l'image à 100 % et, si l'effet se confirme, l'écrire dans `AMBIGUITES.md` pour une session de design (glyphe « º » de la police du texte). Autre option : avant « (Nº 05) » ; après « (épisode 05) », comme dans le texte du post.
- **Option recommandée** : la note dans AMBIGUITES, parce que le défaut viendrait de la police et toucherait tous les épisodes, pas le contenu.
- **Décision** : oui / non / autre

## Contrôles automatiques (serie verifier)

Recopie de `sortie/10/verification.md` :

Résultat : aucune erreur bloquante, 1 avertissement(s).

Avertissements :
- page 2 (ouverture) : 31 mots, proche de la limite de 32

| Page | Mots | Vide au-dessus du pied (px) |
| --- | ---: | ---: |
| 1 | 5 | 1 |
| 2 | 31 | 218 |
| 3 | 48 | 35 |
| 4 | 48 | 29 |
| 5 | 0 | 6 |

Seuil de remplissage : 233 px.

## Affirmations et sources

| Page | Affirmation | Extrait | Vérifiée sur |
| --- | --- | --- | --- |
| 2 | Rappel : coût $J$ (Nº 05), pente et $∇J$ (Nº 06, 07), descente (Nº 08, 09) | glossaire (`introduit_par` 5, 6, 7, 8, 9) | dépôt (`charte/glossaire.yaml`), pas de source web nécessaire |
| 2 | Cette courbe a deux creux (x·cos(πx) sur [−1 ; 2]) | `d2l-exemple-deux-creux` | [D2L 12.1](https://d2l.ai/chapter_optimization/optimization-intro.html), « f(x) = x·cos(πx) for −1.0 ≤ x ≤ 2.0 » |
| 2 | La descente partie à gauche s'arrête au premier creux, où la pente est nulle | `d2l-arret-local`, `mlcc-bille` (tracé : `calculs/`) | D2L 12.1 ; [MLCC](https://developers.google.com/machine-learning/crash-course/linear-regression/gradient-descent), « ball rolling down a hill » |
| 2 | Minimum local, minimum global (définitions) | `d2l-minimum-local`, `d2l-minimum-global` | D2L 12.1 |
| 3 | Au point selle, $∇J$ = (0 ; 0) sans que ce soit un minimum | `d2l-selle-definition` | D2L 12.1, « all gradients of a function vanish » |
| 3 | $J$ en creux selon $a$, en bosse selon $b$ | `d2l-selle-2d` | D2L 12.1, vrai pour x² − y² (voir D1) |
| 3 | Partie sur l'axe, la descente y cale | `d2l-selle-x3` (chemin : `calculs/`) | D2L 12.1, « Optimization might stall at this point » |
| 3 | Partie à côté, elle finit par s'en écarter | `dauphin-repousse` | [ar5iv 1406.2572](https://ar5iv.labs.arxiv.org/html/1406.2572), « repelled away from a saddle point » |
| 3 | Encadré : plus de réglages, plus de points selle que de minimums locaux ; Dauphin et coauteurs, 2014, fonctions d'erreur aléatoires | `dauphin-rapport`, `dauphin-date`, `d2l-selle-probable` | ar5iv (« increases exponentially with the dimensionality N », fonctions d'erreur gaussiennes aléatoires) ; [arXiv abs](https://arxiv.org/abs/1406.2572), soumis le 10 juin 2014 ; D2L 12.1 |
| 4 | Toute corde reste au-dessus de la courbe | `d2l-definition-convexe` | [D2L 12.2](https://d2l.ai/chapter_optimization/convexity.html), inégalité ≥ (voir D3) |
| 4 | Tout minimum local est global ; pas de creux où caler | `d2l-local-global`, `d2l-pas-coince` | D2L 12.2, « we cannot "get stuck" » |
| 4 | C'est le cas de la MSE d'une droite | `mlcc-lineaire-convexe`, `mlcc-minimum-global` | MLCC (exemple en MSE, mise à jour du 2026-02-03) |
| 4 | Le fond peut être plat | `d2l-fond-plat` | D2L 12.2, max(\|x\| − 1, 0) |
| 4 | Encadré : la plupart des grands modèles ont un coût non convexe à nombreux creux | `d2l-convexe-rare`, `d2l-nombreux-optima`, `d2l-non-convexe-dl` | D2L 12.1 et 12.2, « most deep learning problems » (voir D4) |
| 5 | Reprises des pages 2, 3 et 4 | idem | idem (voir C1, D1) |
| 5 | Épisode suivant : Nº 11, La régression linéaire, « Mettons tout ensemble sur un premier vrai modèle. » | fiche 10 (`episode_suivant`), fiche 11 (`titre`) | dépôt, conforme |
| Post | Une descente de gradient peut s'arrêter avant le point le plus bas | `d2l-arret-local` | D2L 12.1, « may only minimize the objective function locally » |
| Post | Le col, plat en son centre, peut retenir un moment | `dauphin-plateaux` | arXiv abs, « high error plateaus that can dramatically slow down learning » |
| Post | Fonctions convexes, coût d'une droite : tout minimum local est global | `d2l-local-global`, `mlcc-lineaire-convexe` | D2L 12.2, MLCC |
| Post | Le bruit des mini-lots peut aider à sortir d'un minimum local | `d2l-bruit-deloge` | D2L 12.1, « Only some degree of noise might knock the parameter out of the local minimum » |

## Validation scientifique

**Page 2 (Ouverture)**
- Hypothèse : un seul réglage, la courbe x·cos(πx) restreinte à [−1 ; 2], un départ à gauche et un $η$ assez petit pour ne pas sauter la bosse.
- Domaine : dit (« cette courbe », « partie à gauche ») ; le $η$ n'est pas dit, mais le tracé le montre.
- Contre-exemple : avec un $η$ plus grand ou le bruit des mini-lots (D2L 12.1), la descente peut sortir du premier creux ; en grande dimension, Dauphin et al. (2014) estiment que les minimums locaux sont rares et ont une erreur proche de celle du minimum global. Le premier est dit dans le post, le second est partiellement traité par l'encadré de la page 3.
- Raccourci : « où la pente est nulle : un minimum local » associe pente nulle et minimum ; la page 3 corrige aussitôt (pente nulle sans minimum) : raccourci assumé par l'enchaînement des pages.

**Page 3 (Mécanisme)**
- Hypothèse : deux réglages, $J$ = a² − b² (courbures opposées alignées sur les axes), descente sans bruit.
- Domaine : « avec deux réglages » est dit ; l'alignement des directions sur $a$ et $b$ ne l'est pas (D1). L'axe de départ n'est pas nommé (D2).
- Contre-exemple : un point selle dont le creux et la bosse suivent des diagonales ; le point x³ de D2L (une dimension, pente et courbure nulles), qui fait aussi caler la descente sans être un creux d'un côté et une bosse de l'autre.
- Raccourci : « la descente y cale » vaut pour un départ exactement sur l'axe ; le chemin voisin montre que c'est un cas limite : assumé par le schéma.

**Page 3 (encadré)**
- Hypothèse : fonctions d'erreur aléatoires (gaussiennes) en grande dimension.
- Domaine : dit (« pour des fonctions d'erreur tirées au hasard »), daté (2014) et attribué (« ce qu'avancent »).
- Contre-exemple : avec un seul réglage, une fonction aléatoire a surtout des creux et des bosses, presque jamais de point selle (Rasmussen et Williams, cités par Dauphin et al.) : cohérent avec « plus il y a de réglages ».
- Raccourci : aucun ; la nuance est gardée.

**Page 4 (Repère)**
- Hypothèse : fonction convexe ; la MSE d'un modèle linéaire en est une.
- Domaine : dit (« pour une fonction convexe », « la MSE d'une droite ») ; l'encadré dit le cas particulier (règle éditoriale respectée).
- Contre-exemple : le fond plat, où une corde touche la courbe (D3) ; un coût convexe sans minimum (D2L 12.2 : « or that there might even exist one »), non dit, sans effet pour la MSE d'une droite.
- Raccourci : « au-dessus » pour « pas en dessous » (D3) ; « grands modèles » pour « apprentissage profond » (D4).

**Page 5 (Fin)**
- Hypothèse : celles des pages 2 à 4.
- Domaine : le point 1 perd la condition de la page 2 (C1), le point 2 la rend générale sans le dire (D1).
- Contre-exemple : ceux des pages 2 et 3.
- Raccourci : propre à une page de résumé, à condition que C1 et D1 soient appliqués.

**Post LinkedIn**
- Hypothèse : celles du carrousel ; l'image du marcheur dans le brouillard correspond à une descente sans vue d'ensemble (MLCC, « ball rolling down a hill »).
- Domaine : « peut » est employé partout où la source dit « may » ou « might ».
- Contre-exemple : aucun non traité.
- Raccourci : « le coût d'une droite » pour « la MSE d'une droite », sans incidence.
