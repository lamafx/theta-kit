# Relecture · Nº 08 · La descente de gradient

Relu le 2026-11-01. Avertissements scientifiques (contre-exemple ou hypothèse implicite, voir la charte, « La validation scientifique ») : **D1** (η fixe présenté comme une définition), **D5** (page 7 : « cette droite » avec b fixé ; coût nul), **D6** (page de fin : « oscille et diverge » sans nuance).

## Mises en conformité (appliquées automatiquement)

### C1 · Texte du post, champ `promesse` : le cours BCEAO n'est pas daté

- **Constat** : la page 7 affiche un coût calculé en FCFA (J = 1 030, converti au cours BCEAO du 27 octobre 2026), mais ni la page ni le post ne disent « au cours BCEAO du … », contrairement à l'épisode 05.
- **Source** : `charte/regles-redaction.md`, « Les montants et les légendes » : « le texte ou le post dit « au cours BCEAO du … » » ; extrait `bceao-dollar` (« Cours des devises du mardi 27 Octobre 2026 […] Dollar us 588,3000 »), lu le 2026-10-30 sur [BCEAO · Cours de référence des principales devises contre Franc CFA](https://www.bceao.int/fr/cours/cours-de-reference-des-principales-devises-contre-franc-cfa). Relu aujourd'hui : la page affiche le cours du 30 octobre 2026 (« Dollar us 587,1400 ») ; le cours du 27 n'est plus consultable sans le sélecteur de date, il reste attesté par l'extrait de `sources/05/`.
- **Avant** : « … trois pas calculés à la main, puis, sur les maisons d'Ames, pourquoi la descente peut s'arrêter avec un coût qui n'est pas nul. »
- **Après** : « … trois pas calculés à la main, puis, sur les maisons d'Ames (prix en FCFA au cours BCEAO du 27 octobre 2026), pourquoi la descente peut s'arrêter avec un coût qui n'est pas nul. »
- **Règle appliquée** : tout montant converti dit son cours daté ; tout chiffre est daté et sourcé. Relancer `serie verifier 08` (le post doit rester entre 120 et 220 mots).

### C2 · Page 7 (Piège), champ `texte` : le coût 1 030 est donné sans unité

- **Constat** : « J vaut encore 1 030 » ne dit pas l'unité, alors que l'épisode 05 l'écrit (« $J$ s'exprime en millions de FCFA au carré ») et que `calculs/cout.py` la fixe.
- **Source** : `contenu/05.yaml`, page 5, encadré « Une unité étrange » ; `calculs/cout.py` : « J est donc en millions de FCFA au carré » ; `calculs.cout.cout_selon_a(b=4, unite=20)` : c = 1029,9.
- **Avant** : « Pourtant $J$ vaut encore 1 030 : aucune droite ne passe par toutes les ventes. »
- **Après** : « Pourtant $J$ vaut encore 1 030 millions de FCFA au carré : aucune droite ne passe par toutes les ventes. »
- **Règle appliquée** : tout montant publié est en FCFA, avec son unité ; chiffre sourcé. La page passe de 50 à 55 mots (titre et texte), à la limite permise ; si vous préférez de la marge, retirer « encore » (54 mots), « Pourtant » portant déjà l'opposition.

## Décisions de l'utilisateur

### D1 · Page 3 (Mécanisme), champs `texte` et `encadres[0].titre` : « η est un nombre fixe » lu comme une définition

- **Constat** : la page dit que le taux d'apprentissage « est un nombre fixe choisi d'avance » et titre l'encadré « Le taux reste fixe », comme si c'était toujours le cas ; c'est l'hypothèse de l'épisode (la fiche écrit « Avec un η fixe »), pas une propriété générale : beaucoup d'entraînements font varier η (calendriers, méthodes adaptatives, épisode 44 au glossaire).
- **Source vérifiée** : [D2L 12.3 · Gradient Descent](https://d2l.ai/chapter_optimization/gd.html) : « To keep things simple we pick a fixed step size \(\eta > 0\) » ; [Ruder (2017), An overview of gradient descent optimization algorithms, arXiv:1609.04747v2](https://arxiv.org/html/1609.04747) : « Learning rate schedules [18] try to adjust the learning rate during training ».
- **Correction proposée** :
  - `texte`, avant : « $!η$, le taux d'apprentissage, est un nombre fixe choisi d'avance, ici 0,15 ; le pas vaut… »
  - `texte`, après : « $!η$, le taux d'apprentissage, est un nombre choisi d'avance, ici fixe : 0,15 ; le pas vaut… » (49 mots, inchangé)
  - `encadres[0].titre`, avant : « Le taux reste fixe » ; après : « Ici, le taux reste fixe »
- **Option recommandée** : appliquer les deux ; le cas particulier (η fixe) est dit sans ajouter de mot ni de terme. Autre option : ne changer que le `texte`.
- **Décision** : oui / non / autre

### D2 · Page 5 (Formule), ligne `[η]`, champ `sens` : « la taille du pas » contredit la page 3

- **Constat** : la page 3 dit « le pas vaut η × la pente », la page 5 dit que η est « la taille du pas » ; les deux ne peuvent pas être vraies à la fois.
- **Source vérifiée** : [Ruder, arXiv:1609.04747v2](https://arxiv.org/html/1609.04747) : « The learning rate η determines the size of the steps we take to reach a (local) minimum. » ; [MLCC · Hyperparameters](https://developers.google.com/machine-learning/crash-course/linear-regression/hyperparameters) : « The model multiplies the gradient by the learning rate ».
- **Correction proposée** : avant « le taux d'apprentissage : la taille du pas » ; après « le taux d'apprentissage : il règle la taille du pas ».
- **Option recommandée** : appliquer ; c'est le mot de Ruder (« determines ») et la cohérence avec la page 3 et la fin. Autre option : « le taux d'apprentissage : le pas vaut $η$ × la pente ».
- **Décision** : oui / non / autre

### D3 · Page 5 (Formule), champ `texte` : deux critères d'arrêt présentés comme les seuls

- **Constat** : « on la répète jusqu'à ce que la pente soit presque nulle, ou pour un nombre d'itérations fixé d'avance » donne deux critères comme une liste fermée ; la source les donne en exemples.
- **Source vérifiée** : [D2L 12.3 · Gradient Descent](https://d2l.ai/chapter_optimization/gd.html) : « until the stop condition is reached, for example, when the magnitude of the gradient |f'(x)| is small enough or the number of iterations has reached a certain value. » ; [MLCC · Gradient descent](https://developers.google.com/machine-learning/crash-course/linear-regression/gradient-descent) : « repeat the process until the model can't reduce the loss any further. »
- **Correction proposée** : avant « Une itération, c'est un pas : on la répète jusqu'à ce que la pente soit presque nulle, ou pour un nombre d'itérations fixé d'avance. » ; après « Une itération, c'est un pas : on la répète, par exemple, jusqu'à ce que la pente soit presque nulle, ou pour un nombre d'itérations fixé d'avance. » (36 mots)
- **Option recommandée** : appliquer ; deux mots rendent la nuance de la source. Autre option : laisser tel quel (raccourci assumé).
- **Décision** : oui / non / autre

### D4 · Page 4 (Comparaison), champ `encadre.texte` : « Il » sans antécédent

- **Constat** : l'encadré commence par « Il dépend du problème » ; depuis que son titre est devenu « En pratique » (correction de rendu, η en capitales), « Il » ne renvoie plus à rien, et le lecteur doit deviner qu'il s'agit du bon η.
- **Source vérifiée** : [MLCC · Hyperparameters](https://developers.google.com/machine-learning/crash-course/linear-regression/hyperparameters) : « The ideal learning rate is problem-dependent. » ; « Each model and dataset will have its own ideal learning rate. »
- **Correction proposée** : avant « Il dépend du problème : chaque modèle et chaque jeu de données a le sien. » ; après « Le bon $η$ dépend du problème : chaque modèle et chaque jeu de données a le sien. » (η reste en minuscule : il est dans le texte de l'encadré, pas dans son titre)
- **Option recommandée** : appliquer ; aucune nuance retirée, la phrase redevient lisible seule. Autre option : titre « Le bon taux » et texte inchangé.
- **Décision** : oui / non / autre

### D5 · Page 7 (Piège), champ `encadre.texte` : « cette droite » avec b fixé, et coût nul présenté comme un but

- **Constat** : la page fixe b = 4 puis affirme « aucun autre réglage de cette droite ne fait mieux » ; un lecteur de l'épisode 05 (« Entraîner, c'est chercher le creux pour a et b ensemble ») peut croire qu'en bougeant b on ferait mieux. Ce n'est pas le cas ici, mais la page ne le dit pas : la droite de l'épisode 04 (a = 74, b = 4) est celle que donne le calcul des moindres carrés sur a et b ensemble (`calculs.ames.droite_prix_surface`), et le coût d'une droite est convexe. Second point : la page invite à « faire baisser J » sans dire qu'un coût nul n'est pas le but ; la source citée (`mlcc-zero`) porte cette nuance.
- **Source vérifiée** : [MLCC · Gradient descent](https://developers.google.com/machine-learning/crash-course/linear-regression/gradient-descent) : « The loss functions for linear models always produce a convex surface. » ; « no other weight and bias values produce a model with lower loss. » ; « A loss of 0 would mean that the model fits every data point exactly, which is usually a sign of overfitting (i.e., the model is too complex/powerful). » ; `contenu/04.yaml`, page 4 : « le calcul donne $a$ = 74 et $b$ = 4 ».
- **Correction proposée** :
  - Option A, avant : « Plus de pas n'y changent rien : aucun autre réglage de cette droite ne fait mieux. Pour faire baisser $J$, il faut **changer de modèle**. »
  - Option A, après : « Plus de pas n'y changent rien : aucun autre réglage de $a$ ou de $b$ ne fait mieux (épisode 04). Pour faire baisser $J$, il faut **changer de modèle**. »
  - Option B (A, plus la nuance) : « Plus de pas n'y changent rien : aucun autre réglage de $a$ ou de $b$ ne fait mieux (épisode 04). Pour faire baisser $J$, il faut **changer de modèle**, sans viser 0 : un coût nul signale souvent un modèle trop complexe. »
- **Option recommandée** : A, à appliquer après un contrôle par `calculs.cout.cout_ames` que J(74, 4) arrondi vaut bien le coût des moindres carrés arrondi (1 030), puisque a et b sont arrondis à l'unité. B si le rendu tient (page 7 : 51 px libres au-dessus du pied, une ligne d'encadré de plus au maximum) ; sinon la nuance du coût nul peut attendre l'épisode 25 (surapprentissage).
- **Décision** : oui (A) / oui (B) / non / autre

### D6 · Page 8 (Fin), champ `points[2]` : « le point oscille et diverge » sans nuance

- **Constat** : le résumé dit qu'un η trop grand fait osciller **et** diverger ; les sources disent « oscille, et au pire diverge », et l'encadré de la page 4 le dit aussi (« Un η un peu trop grand fait déjà osciller »).
- **Source vérifiée** : [D2L 12.3 · Gradient Descent](https://d2l.ai/chapter_optimization/gd.html) : « If we pick it too large, the solution oscillates and in the worst case it might even diverge. » ; [MLCC · Hyperparameters](https://developers.google.com/machine-learning/crash-course/linear-regression/hyperparameters) : « each iteration either causes the loss to bounce around or continually increase. »
- **Correction proposée** : avant « $η$ trop petit : trop lent. Trop grand : le point oscille et diverge. » ; après « $η$ trop petit : trop lent. Trop grand : le point oscille, voire diverge. »
- **Option recommandée** : appliquer ; la fin reprend alors exactement la page 4 et son encadré, sans rien de nouveau. Autre option : laisser, la page 4 portant la nuance.
- **Décision** : oui / non / autre

### D7 · Page 2 (Ouverture), visuel : θ₀, θ₁, θ₂ et θ* jamais définis à leur apparition

- **Constat** : le schéma de l'ouverture étiquette l'axe θ₀, θ₁, θ₂ et θ* ; l'indice t n'est défini qu'en page 5 et θ* nulle part (le mot « minimum » juste au-dessus aide, sans le définir). Ces étiquettes sont écrites par le gabarit de la forme `descente` (absentes de `textes`), donc hors de portée du contenu.
- **Source vérifiée** : règle de `CLAUDE.md` « Un symbole est défini à sa première apparition » ; la page 2 est à 30 mots sur 32, pas de place pour une définition dans le texte.
- **Correction proposée** : aucune dans `contenu/08.yaml` ; ajouter à AMBIGUITES.md : « Forme Courbe `descente` : rendre les étiquettes θ₀, θ₁, θ₂, θ* paramétrables par `textes` (ou masquables), pour respecter la règle du symbole défini à sa première apparition (épisode 08, page 2). »
- **Option recommandée** : publier tel quel (le dessin rend θ₀ → θ₁ → θ₂ lisible et la page 5 définit θ_t) et noter le besoin pour une prochaine session de design. Autre option : demander une session de design avant publication.
- **Décision** : oui / non / autre

## Contrôles automatiques (serie verifier)

Recopie de `sortie/08/verification.md` :

- Erreurs bloquantes : aucune.
- Avertissements (2) :
  - page 2 (ouverture) : 30 mots, proche de la limite de 32
  - page 7 (piège) : 50 mots, proche de la limite de 55 (55 après C2)

| Page | Mots | Vide au-dessus du pied (px) |
| --- | ---: | ---: |
| 1 | 4 | 59 |
| 2 | 30 | 197 |
| 3 | 49 | 11 |
| 4 | 33 | 28 |
| 5 | 34 | 1 |
| 6 | 42 | 88 |
| 7 | 50 | 51 |
| 8 | 0 | 6 |

Seuil de remplissage : 233 px.

## Affirmations et sources

Pages lues le 2026-11-01 (WebFetch), sauf mention.

| Page | Affirmation | Extrait | Vérifiée sur |
| --- | --- | --- | --- |
| 2 | Le modèle ne voit pas toute la courbe ; il mesure la pente là où il est | d2l-local, ruder-aveugle | [D2L 12.3](https://d2l.ai/chapter_optimization/gd.html) (« in first-order approximation ») ; [Ruder v2](https://arxiv.org/html/1609.04747) (« blindly following the slope ») |
| 2 | Il fait un pas dans l'autre sens, et recommence | mlcc-pente-negative, d2l-negatif, ruder-oppose, mlcc-recommencer | [MLCC · Gradient descent](https://developers.google.com/machine-learning/crash-course/linear-regression/gradient-descent) (« in the direction of the negative slope », « Return to step one ») |
| 3 | η est choisi d'avance par qui entraîne ; fixe ici | mlcc-taux, mlcc-controle, d2l-concepteur, d2l-fixe | [MLCC · Hyperparameters](https://developers.google.com/machine-learning/crash-course/linear-regression/hyperparameters) ; [D2L 12.3](https://d2l.ai/chapter_optimization/gd.html) (« fixed step size ») ; voir D1 |
| 3 | Le pas vaut η × la pente ; pente forte, grand pas | mlcc-multiplie, mlcc-proportionnel, mlcc-grand-pas | [MLCC · Hyperparameters](https://developers.google.com/machine-learning/crash-course/linear-regression/hyperparameters) (« if the slope is large, the model takes a large step ») |
| 3 | θ = −3 : pente −6, pas 0,9 ; θ = −0,8 : pente −1,6, pas 0,24 (η = 0,15) | calcul `descente_gradient` | Recalculé : 2 × 3 = 6, 0,15 × 6 = 0,9 ; 2 × 0,8 = 1,6, 0,15 × 1,6 = 0,24 |
| 4 | J = θ², départ −3,6 ; η = 0,05 : encore loin après 5 pas ; η = 0,3 : près du minimum en 4 pas ; η = 1,05 : diverge | d2l-carre, d2l-lent, d2l-diverge, mlcc-trop-bas, mlcc-augmente, ruder-defi | Recalculé (θ devient (1 − 2η)θ) : 0,05 → −2,13 après 5 pas ; 0,3 → −0,09 après 4 pas ; 1,05 → 3,96, −4,36, 4,79. [D2L 12.3](https://d2l.ai/chapter_optimization/gd.html) (« η=1.1, x overshoots the optimal solution x=0 and gradually diverges ») |
| 4 | Le bon η dépend du problème ; un η un peu trop grand fait osciller | mlcc-ideal, mlcc-propre, d2l-oscille | [MLCC · Hyperparameters](https://developers.google.com/machine-learning/crash-course/linear-regression/hyperparameters) ; [D2L 12.3](https://d2l.ai/chapter_optimization/gd.html) ; voir D4 |
| 5 | θ_{t+1} = θ_t − η∇J(θ_t) | ruder-formule, d2l-regle, d2l-plusieurs, mlcc-nouveau | [Ruder v2](https://arxiv.org/html/1609.04747), équation 1 : « θ = θ − η · ∇θJ(θ) » ; [D2L 12.3](https://d2l.ai/chapter_optimization/gd.html), (12.3.4) et (12.3.7) avec ← ; notation à indices choisie pour la police (A58), même règle |
| 5 | Arrêt : pente presque nulle ou nombre d'itérations fixé | d2l-arret, mlcc-recommencer | [D2L 12.3](https://d2l.ai/chapter_optimization/gd.html) (« for example ») ; voir D3 |
| 5 | η : la taille du pas | ruder-taille | [Ruder v2](https://arxiv.org/html/1609.04747) (« determines the size of the steps ») ; voir D2 |
| 6 | J = θ², pente 2θ (épisode 06) ; 3 → 2,4 → 1,92 → 1,536 ; coût 9 → 2,36 | d2l-carre, mlcc-multiplie, d2l-regle | Recalculé : pas 0,6 ; 0,48 ; 0,384 ; 1,536² = 2,359 ; `contenu/06.yaml` (« $J′$($a$) = 2$a$ ») |
| 7 | Coût des ventes d'Ames selon a, b = 4 : creux a ≈ 74 (droite de l'épisode 04), J ≈ 1 030 | ames-ventes, ames-surface, ames-prix, ames-fichier, bceao-dollar | `calculs.cout.cout_selon_a(b=4, unite=20)` (c = 1029,9) ; `contenu/04.yaml` et `05.yaml` ; [Ames Housing Data · DataDocumentation.txt](http://jse.amstat.org/v19n3/decock/DataDocumentation.txt) (« SIZE: 2930 observations », « Gr Liv Area », « SalePrice ») ; cours BCEAO : extrait lu le 2026-10-30, non relisible aujourd'hui (la page affiche le 30 octobre). L'article De Cock (2011) n'a pu être relu (PDF illisible par l'outil, éditeur en 403) ; la documentation du fichier le confirme. |
| 7 | Pente nulle au creux : la descente s'arrête ; le creux reste au-dessus de 0 | mlcc-bille, mlcc-converge, mlcc-plancher | [MLCC · Gradient descent](https://developers.google.com/machine-learning/crash-course/linear-regression/gradient-descent) (« finally stopping at the point where there's no more downward slope », « typically greater than 0 ») |
| 7 | Aucun autre réglage ne fait mieux ; changer de modèle | mlcc-convexe, mlcc-meilleur, mlcc-zero | [MLCC · Gradient descent](https://developers.google.com/machine-learning/crash-course/linear-regression/gradient-descent) ; voir D5 |
| 8 | Résumé des pages 2 à 4 ; épisode suivant Nº 09 « Descente stochastique et mini-lots » | (pages 2 à 4) ; fiche 08 `episode_suivant` | Conforme à `banque/episodes/09-descente-stochastique-et-mini-lots.yaml` ; transition identique à la fiche ; voir D6 |
| Post | Pente forte, pas long ; θ ← θ − η∇J(θ) ; pas qui raccourcissent ; η trop petit ou trop grand ; coût non nul à Ames | mlcc-grand-pas, d2l-regle, mlcc-trop-bas, mlcc-trop-haut, mlcc-plancher | Mêmes pages ; la notation à flèche du post est celle de D2L (texte brut, pas de contrainte de police) ; voir C1 |

Fiche : pas de section « à ne pas écrire » ni « faits vérifiés » dans `banque/episodes/08-la-descente-de-gradient.yaml` ; rien à confronter. Termes nouveaux (taux d'apprentissage η, itération, convergence, oscillation, divergence) : tous dans le glossaire à l'épisode 8. Aucun tiret long (—) dans `contenu/08.yaml`. Aucune citation entre guillemets dans les pages ni dans le post.

Images : aucune image réelle retenue (`assets/images/candidats/08/` n'existe pas) ; la couverture et la fin portent le personnage de la série (élément de design, sans légende ni crédit à écrire). Le chemin de couverture zigzague en travers des lignes de niveau, cohérent avec une descente sur une cuvette allongée.

À l'œil (planche et pages) : lecture fluide, aucun débordement. Gênes mineures : page 2, le rappel se coupe en laissant « 07). » seul sur sa ligne ; page 6, seule l'étiquette « J = 9 » dit ce qu'elle mesure, les suivantes (5,76 ; 3,69 ; 2,36) sont des coûts sans le dire, et « 3,69 » touche la courbe ; page 4, l'encadré (D4). Rien qui justifie une décision séparée.

## Validation scientifique

**Page 2 (Ouverture)**
- Hypothèse : coût dérivable, un paramètre, pas assez petit pour que la pente locale indique la descente.
- Domaine : dit (« un pas », courbe en U dessinée) ; suffisant pour une ouverture.
- Contre-exemple : sur une bosse ou un plateau, la pente nulle ne dit pas où aller (traité à l'épisode 06, minima locaux à l'épisode 10).
- Raccourci : assumé (une seule courbe en U), signalé par le schéma.

**Page 3 (Mécanisme)**
- Hypothèse : η fixe, un seul paramètre, J = θ².
- Domaine : « un seul paramètre » est dit ; « η fixe » est écrit comme une propriété du taux, pas comme une hypothèse (D1).
- Contre-exemple : avec un calendrier de taux ou une méthode adaptative, la taille du pas change aussi par η.
- Raccourci : à signaler par « ici fixe » (D1).

**Page 4 (Comparaison)**
- Hypothèse : J = θ², départ −3,6 ; seuils propres à cette courbe (diverge pour η > 1).
- Domaine : dit (« Même courbe J(θ) = θ² ») ; l'encadré dit que le bon η dépend du problème.
- Contre-exemple : un η « un peu trop grand » oscille mais converge (cas non dessiné, dit dans l'encadré).
- Raccourci : assumé ; encadré à rendre lisible (D4).

**Page 5 (Formule)**
- Hypothèse : descente sur tout le coût (descente « de lot » chez Ruder), η fixe.
- Domaine : « ici, un seul » paramètre dit ; le gradient est rattaché à l'épisode 07.
- Contre-exemple : d'autres critères d'arrêt (le coût ne baisse plus, MLCC) ; η n'est pas le pas lui-même (D2, D3).
- Raccourci : formule générale, illustrée avec un paramètre ; correct.

**Page 6 (Exemple chiffré)**
- Hypothèse : J = θ², θ₀ = 3, η = 0,1.
- Domaine : tout est dit ; valeurs recalculées exactes.
- Contre-exemple : aucun dans ce cadre ; « chaque pas plus court » vaut ici parce que 0 < η < 0,5.
- Raccourci : aucun.

**Page 7 (Piège)**
- Hypothèse : modèle linéaire et MSE (coût convexe) ; b fixé à 4 pour la coupe dessinée ; la droite (74, 4) est celle des moindres carrés à l'arrondi près.
- Domaine : b fixé est dit ; le fait que b = 4 est aussi le meilleur b ne l'est pas (D5).
- Contre-exemple : un coût non convexe peut s'arrêter dans un creux qui n'est pas le plus bas (épisode 10) ; un coût nul serait souvent un modèle trop complexe (MLCC, D5 option B).
- Raccourci : coupe à une dimension, assumée par « b fixé à 4 » ; unité à écrire (C2).

**Page 8 (Fin)**
- Hypothèse : celles des pages 2 à 4.
- Domaine : résumé fidèle, sauf le point 03.
- Contre-exemple : η un peu trop grand, oscillation sans divergence (D6).
- Raccourci : « oscille et diverge » retire la nuance des sources (D6).

**Texte du post**
- Hypothèse : η fixe (« Plus le sol est raide, plus le pas est long »).
- Domaine : implicite, cohérent avec les pages.
- Contre-exemple : aucun dans le cadre de l'épisode.
- Raccourci : l'image du brouillard est une analogie, non attribuée ; le cours FCFA est à dater (C1).
