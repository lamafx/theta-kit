# Décisions à trancher

Rassemblées par `serie decisions` depuis les rapports de relecture ; la source et les corrections rédigées sont dans `sortie/NN/relecture.md`. Une décision peut déjà être caduque si le texte a changé depuis le rapport.

34 décisions.

## Nº 01 (relu)

### D1 · Page 4, `texte` : « y parvenir » rattache les 8 à 10 heures au mauvais objet

- Constat : dans le corps de la page, « y parvenir » renvoie à « apprend lesquels comptent ». L'affirmation de Samuel (jouer mieux que son auteur) ne figure plus que dans le titre. Le chiffre est donc attaché à un autre résultat que celui de l'article.
- Option recommandée : oui. Le chiffre retrouve l'objet que lui donne Samuel. « il » renvoie au programme, qui est le sujet de la proposition précédente, et « son auteur » lève le doute. Autre option : « lui suffisent pour dépasser son auteur », plus proche de la version d'avant, mais avec 1 mot de plus (56), donc hors limite.

### D2 · Page 2, `texte` : le cas particulier n'est plus dit comme celui de l'épisode

- Constat : la version précédente disait « Ici, chaque exemple a sa réponse […] : l'apprentissage supervisé » (décision D20). La version resserrée dit « En apprentissage supervisé, chaque exemple a sa réponse », ce qui définit le cas sans dire que l'épisode s'y place. La règle éditoriale demande de dire explicitement que l'épisode illustre un cas particulier. La page 6 le dit encore (« prédit ici »), mais la page 2 ne le dit plus.
- Option recommandée : oui. La correction rétablit le « Ici » choisi en D20 et suit la forme nominale des deux phrases qui précèdent (« Programme classique : … Machine Learning : … »). Autre option : ne rien changer, si vous jugez suffisants l'étiquette du schéma (« Apprentissage supervisé ») et le « ici » de la page 6.

## Nº 05 (relu)

### D1 · Page 3, `texte` : la provenance des prédictions (droite de l'épisode 04) a disparu

- Constat : la page ne dit plus que les prix prédits viennent de la droite de l'épisode 04 (a = 74, b = 4). Sans
- Option recommandée : oui. Le modèle qui produit le tableau est nommé et le fil rouge revient, sans changer le nombre de mots.

### D2 · Page 6, `texte` : « sur ces ventes » au lieu de « sur ces ventes d'Ames », et « $b$ = » coupé en fin de ligne

- Constat : le resserrement a retiré « d'Ames », que l'audit 05.5 avait ajouté pour dire de quelles données dépend
- Option recommandée : oui. La page redit les données dont dépend le creux, et la coupure « $b$ = » / « 4 » disparaît.

## Nº 06 (relu)

### D1 · Page 3, `texte` : le sens du signe ne vaut que pour un petit déplacement

- Constat : « $J$ monte quand $a$ augmente » ne dit pas que c'est vrai seulement pour un petit déplacement
- Option recommandée : oui. Deux mots suffisent à dire l'hypothèse, et ils reprennent ceux de la page 2.

### D2 · Page 2, `texte` : « la tangente suit la courbe » laisse croire qu'elle la longe

- Constat : « La tangente suit la courbe en un point. » : « suit » laisse penser que la tangente épouse la
- Option recommandée : la correction ci-dessus, parce qu'elle dit ce qu'est la tangente (une droite) et ne

### D3 · Page 3, visuel : l'étiquette « pente 0 » touche la courbe

- Constat : sur `page-03.png`, le « 0 » de « pente 0 » est posé sur la courbe, à droite du creux
- Option recommandée : oui, parce que c'est un réglage de paramètre et qu'il n'y a rien à changer dans la

### D4 · Page 4, visuel : les colonnes « hausse de J » et « hausse ÷ h » ne viennent d'aucune fonction de `calculs/`

- Constat : `J(3 + h)` vient de `calculs.descente_gradient.erreur`. Mais la hausse et le rapport sont
- Option recommandée : oui. Chaque chiffre est ainsi rattaché à une fonction, ce que demande la charte. Autre

### D5 · Page 1, couverture : un éventail de droites, alors que la fiche décrit « courbe avec des tangentes en plusieurs points »

- Constat : la famille Courbe n'a qu'une forme de couverture, l'éventail de droites autour d'un point
- Option recommandée : publier avec l'éventail et noter le besoin dans AMBIGUITES.md. La couverture reste

### D6 · Post LinkedIn, `promesse` : « de deux façons » présente l'approximation comme un calcul exact

- Constat : « calcule la pente en a = 3 de deux façons : par la dérivée 2a, et en divisant la hausse du coût
- Option recommandée : oui. La phrase garde à peu près la même longueur et suit la page 4 (« vérifions »).

## Nº 07 (relu)

### D1 · Page 2, visuel `flux`, champ `etiquette` : les variables a et b deviennent « A » et « B »

- Constat : les étiquettes sont rendues en capitales (« DÉRIVÉE PARTIELLE SELON A », « … SELON B ») ; le
- Option recommandée : la correction ci-dessus, parce qu'elle supprime la confusion sans toucher aux cases.

### D2 · Page 4, `tableau` : signe moins en trait d'union (« -1 », « -6 », « -4 »)

- Constat : le tableau affiche les nombres négatifs avec un trait d'union (vérifié dans
- Option recommandée : noter dans AMBIGUITES.md et publier tel quel, l'écart est visible mais ne fausse rien.

### D3 · Page 4, champ `texte` : « 3 » seul en fin de ligne

- Constat : la coupure tombe entre « 3 » et « fois 2b » ; le lecteur lit « a fixé : 3 », puis « fois 2b »
- Option recommandée : l'espace insécable, si le contrôle de typographie l'accepte au rendu ; sinon,

### D4 · Pages 3 et 4, visuel `niveaux` (carte) : étiquettes qui chevauchent les ellipses

- Constat : sur les pages 3 et 4, la ligne de niveau traverse l'étiquette « réglage a » ; sur la page 3,
- Option recommandée : appliquer et relancer `serie rendre 07` ; revenir en arrière si le cadre déborde.

### D5 · Fiche et extraits : ajouter une référence lisible pour la page 3

- Constat : les extraits MIT (`mit-perpendiculaire`, `mit-exemple`, `mit-plan`, `mit-taux`, `mit-vecteur`,
- Option recommandée : oui, parce que la condition « hors du centre » devient sourcée et la page 3 ne

## Nº 08 (relu)

### D1 · Page 3 (Mécanisme), champs `texte` et `encadres[0].titre` : « η est un nombre fixe » lu comme une définition

- Constat : la page dit que le taux d'apprentissage « est un nombre fixe choisi d'avance » et titre l'encadré « Le taux reste fixe », comme si c'était toujours le cas ; c'est l'hypothèse de l'épisode (la fiche écrit « Avec un η fixe »), pas une propriété générale : beaucoup d'entraînements font varier η (calendriers, méthodes adaptatives, épisode 44 au glossaire).
- Option recommandée : appliquer les deux ; le cas particulier (η fixe) est dit sans ajouter de mot ni de terme. Autre option : ne changer que le `texte`.

### D2 · Page 5 (Formule), ligne `[η]`, champ `sens` : « la taille du pas » contredit la page 3

- Constat : la page 3 dit « le pas vaut η × la pente », la page 5 dit que η est « la taille du pas » ; les deux ne peuvent pas être vraies à la fois.
- Option recommandée : appliquer ; c'est le mot de Ruder (« determines ») et la cohérence avec la page 3 et la fin. Autre option : « le taux d'apprentissage : le pas vaut $η$ × la pente ».

### D3 · Page 5 (Formule), champ `texte` : deux critères d'arrêt présentés comme les seuls

- Constat : « on la répète jusqu'à ce que la pente soit presque nulle, ou pour un nombre d'itérations fixé d'avance » donne deux critères comme une liste fermée ; la source les donne en exemples.
- Option recommandée : appliquer ; deux mots rendent la nuance de la source. Autre option : laisser tel quel (raccourci assumé).

### D4 · Page 4 (Comparaison), champ `encadre.texte` : « Il » sans antécédent

- Constat : l'encadré commence par « Il dépend du problème » ; depuis que son titre est devenu « En pratique » (correction de rendu, η en capitales), « Il » ne renvoie plus à rien, et le lecteur doit deviner qu'il s'agit du bon η.
- Option recommandée : appliquer ; aucune nuance retirée, la phrase redevient lisible seule. Autre option : titre « Le bon taux » et texte inchangé.

### D5 · Page 7 (Piège), champ `encadre.texte` : « cette droite » avec b fixé, et coût nul présenté comme un but

- Constat : la page fixe b = 4 puis affirme « aucun autre réglage de cette droite ne fait mieux » ; un lecteur de l'épisode 05 (« Entraîner, c'est chercher le creux pour a et b ensemble ») peut croire qu'en bougeant b on ferait mieux. Ce n'est pas le cas ici, mais la page ne le dit pas : la droite de l'épisode 04 (a = 74, b = 4) est celle que donne le calcul des moindres carrés sur a et b ensemble (`calculs.ames.droite_prix_surface`), et le coût d'une droite est convexe. Second point : la page invite à « faire baisser J » sans dire qu'un coût nul n'est pas le but ; la source citée (`mlcc-zero`) porte cette nuance.
- Option recommandée : A, à appliquer après un contrôle par `calculs.cout.cout_ames` que J(74, 4) arrondi vaut bien le coût des moindres carrés arrondi (1 030), puisque a et b sont arrondis à l'unité. B si le rendu tient (page 7 : 51 px libres au-dessus du pied, une ligne d'encadré de plus au maximum) ; sinon la nuance du coût nul peut attendre l'épisode 25 (surapprentissage).

### D6 · Page 8 (Fin), champ `points[2]` : « le point oscille et diverge » sans nuance

- Constat : le résumé dit qu'un η trop grand fait osciller **et** diverger ; les sources disent « oscille, et au pire diverge », et l'encadré de la page 4 le dit aussi (« Un η un peu trop grand fait déjà osciller »).
- Option recommandée : appliquer ; la fin reprend alors exactement la page 4 et son encadré, sans rien de nouveau. Autre option : laisser, la page 4 portant la nuance.

### D7 · Page 2 (Ouverture), visuel : θ₀, θ₁, θ₂ et θ* jamais définis à leur apparition

- Constat : le schéma de l'ouverture étiquette l'axe θ₀, θ₁, θ₂ et θ* ; l'indice t n'est défini qu'en page 5 et θ* nulle part (le mot « minimum » juste au-dessus aide, sans le définir). Ces étiquettes sont écrites par le gabarit de la forme `descente` (absentes de `textes`), donc hors de portée du contenu.
- Option recommandée : publier tel quel (le dessin rend θ₀ → θ₁ → θ₂ lisible et la page 5 définit θ_t) et noter le besoin pour une prochaine session de design. Autre option : demander une session de design avant publication.

## Nº 09 (relu)

### D1 · Pages 3 et 7, post : « souvent de 32 à 256 exemples », une fourchette que les sources ne partagent pas

- Constat : la fourchette vient d'une seule source (DLB, 2016) ; d'autres sources primaires donnent d'autres valeurs : Ruder (2017) écrit 50 à 256, Masters et Luschi (2018) trouvent les meilleurs résultats entre 2 et 32, Goyal et al. (2017) entraînent sans perte jusqu'à 8 192 images par mini-lot. « Souvent » et la date (C1) gardent la phrase juste ; la question est de savoir si l'on dit davantage.
- Option recommandée : A ; la page est une comparaison de trois façons de faire, et « souvent » plus la date suffisent à ne pas présenter la fourchette comme une règle. C si vous voulez que le post porte la nuance (il a de la marge, pas les pages).

### D2 · Page 3 (Comparaison), `cas[1].titre` : « Rapide » contredit l'encadré

- Constat : la colonne « Un exemple » est titrée « Rapide, mais bruité », puis l'encadré dit qu'« un exemple à la fois fait perdre du temps machine » et que le mini-lot va plus vite que les deux autres ; le lecteur reçoit « rapide » et « lent » pour le même cas. La source distingue : rapide en nombre d'exemples traités, plus lent en temps de calcul.
- Option recommandée : appliquer ; chaque pas est léger (un seul exemple), ce qui est exact, et l'encadré n'a plus à corriger le titre. Autre option : « Pas léger, mais bruité ».

### D3 · Page 6 (Piège), `titre` et `texte` : contre-exemple au « ne se pose pas » avec un η fixe

- Constat : la page affirme sans condition qu'avec un η fixe « les écarts ne disparaissent pas, même au minimum » ; c'est vrai quand les exemples ne sont pas tous ajustés au même point (cas dessiné, cas visé par DLB et D2L), mais il existe un contre-exemple publié : si le modèle ajuste exactement chaque exemple, le gradient de chaque exemple est nul au minimum, l'écart disparaît, et la SGD à taux fixe converge.
- Option recommandée : A ; deux mots ouvrent l'exception sans introduire un cas que la série n'a pas encore les moyens d'expliquer. B si vous voulez nommer l'exception (une ligne de plus, 89 px libres).

### D4 · Page 5 (Définition), `lignes[0].sens` : une pratique écrite comme une définition

- Constat : « Chaque exemple y est vu une fois, dans un ordre tiré au hasard » décrit le parcours sans remise, que D2L appelle un choix de pratique ; la définition de la page 3 (« un exemple tiré au hasard » à chaque pas) est un tirage avec remise, où un exemple peut revenir deux fois dans une même époque.
- Option recommandée : appliquer ; deux mots, la définition du panneau reste seule à définir, et les pages 3 et 5 ne se contredisent plus. Autre option : laisser (écart sans conséquence pour le lecteur à ce stade).

### D5 · Page 5 (Définition), `lignes` : le mini-lot manque au décompte des pas

- Constat : la page répond à « combien de pas pour les voir tous ? » pour tout le jeu et pour un exemple, pas pour le mini-lot, que la page 3 vient de présenter comme le compromis retenu.
- Option recommandée : appliquer ; la page compte alors les trois cas de la page 3, avec un chiffre issu de `calculs/` (191 px libres, une ligne en prend environ 80). Autre option : laisser, la page restant juste.

### D6 · Sources : ajouter Ruder pour « On dit souvent SGD même avec des mini-lots »

- Constat : l'encadré de la page 3 repose sur `dlb-stochastique` (« it is now common to call them simply stochastic methods »), qui dit « méthodes stochastiques », pas « SGD », et dont la page primaire n'a pas pu être relue ; une source primaire lisible dit exactement ce qu'écrit la page.
- Option recommandée : appliquer ; Ruder est déjà une source de la série (épisode 08). Autre option : garder DLB seul.

## Nº 10 (relu)

### D1 · Pages 3 et 5, `texte` et `points[1]` (et fiche, `pages[2].message`) : ce qui est « plat » au point selle

- Constat : trois versions coexistent.
- Option recommandée : A. Elle garde la version de D2L, que le contenu suit déjà, et dit que l'exemple est un cas particulier. La fin énonce alors la propriété générale, déjà montrée en page 3. Si vous ne voulez pas d'extrait nouveau, C, mais la page de fin reste écrite comme une définition.

### D2 · Page 3, `texte` : « Partie sur l'axe » ne dit pas quel axe

- Constat : la page a deux axes ($a$ et $b$). La descente ne cale que si elle part sur l'axe de $a$ ($b$ = 0). Partie sur l'axe de $b$, elle s'éloigne tout de suite du point selle. Le lecteur doit le deviner sur le schéma.
- Option recommandée : appliquer, parce que la phrase devient lisible sans le schéma. Autre option : laisser le texte et nommer les chemins sur le schéma (voir D5).

### D3 · Page 4, `texte` : « toute corde reste au-dessus de la courbe », puis « le fond peut toutefois être plat »

- Constat : la définition de D2L est une inégalité large (≥). Une corde peut donc toucher la courbe. C'est le cas sur un fond plat, que la même page annonce deux phrases plus loin. Les deux phrases se contredisent à la lettre. Le libellé du schéma (« la corde reste au-dessus ») reste juste pour la parabole dessinée.
- Option recommandée : appliquer, parce que la définition devient exacte et s'accorde avec « le fond peut toutefois être plat ». Autre option : garder « au-dessus », comme raccourci assumé pour une courbe en U.

### D4 · Page 4, `encadres[0].texte` : « la plupart des grands modèles »

- Constat : la source parle des problèmes d'apprentissage profond, pas de la taille des modèles. Un modèle linéaire reste convexe quel que soit son nombre de réglages : c'est la phrase de MLCC citée en page 4. « Grands » suggère un critère que la source ne donne pas. Le terme « réseau profond » n'est introduit qu'au Nº 39 et ne peut pas servir ici.
- Option recommandée : appliquer : « beaucoup » est couvert par la source sans affirmer une majorité parmi tous les modèles de la série, dont certains sont convexes. Autre option : « Pour beaucoup de modèles à plusieurs couches, vus plus loin dans la série, … », si « couche » est déjà introduit (à vérifier dans le glossaire).

### D5 · Page 3, visuel : le chemin bleu traverse le libellé « réglage $b$ », et les libellés du bas se lisent d'un trait

- Constat : sur `page-03.png`, la fin du chemin bleu (20 pas) monte jusqu'en haut du cadre et barre le libellé d'axe « réglage $b$ ». Sous l'axe, « cale au point selle » et « point selle » se suivent sur la même ligne et se lisent « cale au point selle point selle ». Les deux points de départ se superposent presque.
- Option recommandée : les deux changements, pour que le schéma reprenne la phrase de la page sans chevauchement. Si un seul : `pas: 15`.

### D6 · Page 4, `texte` : « (Nº 05) » s'affiche « (No 05) »

- Constat : dans la police du texte courant, le « º » du rendu paraît à la hauteur d'un « o » ordinaire : on lit « No 05 ». Dans le rappel de la page 2 (police à chasse fixe), « Nº » s'affiche bien.
- Option recommandée : la note dans AMBIGUITES, parce que le défaut viendrait de la police et toucherait tous les épisodes, pas le contenu.
