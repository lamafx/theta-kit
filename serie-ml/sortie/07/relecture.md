# Relecture · Nº 07 · Le gradient

Avertissement scientifique en tête : aucun contre-exemple non traité. Le seul point de fond (page 3, « En chaque
point ») est une formule absolue que les sources ne justifient pas au minimum ; il est corrigé en C1 sans retirer
de nuance. Les calculs de la page 4 sont justes (J, 2a, 6b aux quatre points), la carte est à la même échelle
sur les deux axes, donc les angles droits dessinés sont exacts.

Limite de la vérification : la page HTML officielle du DLB (deeplearningbook.org) et le PDF des notes MIT ne
sont pas lisibles par l'outil de lecture. Le DLB a été lu sur une copie intégrale du chapitre 4 (lien
ci-dessous) ; les extraits MIT n'ont pas pu être relus mot pour mot, la même affirmation a été vérifiée sur un
manuel ouvert (OpenStax), voir D5.

## Mises en conformité (appliquées automatiquement)

### C1 · Page 3, champ `texte` : « En chaque point », formule absolue

- **Constat** : « En chaque point, ∇J est perpendiculaire à la ligne de niveau et pointe vers la montée la plus
  raide » est faux au centre (0 ; 0), où ∇J = (0 ; 0) n'a pas de direction, comme le dit l'encadré de la même
  page. Les sources ne posent la propriété que là où le gradient n'est pas nul.
- **Source vérifiée** : OpenStax, *Calculus Volume 3*, 4.6 « Directional Derivatives and the Gradient »,
  théorème 4.14, https://openstax.org/books/calculus-volume-3/pages/4-6-directional-derivatives-and-the-gradient :
  « If ∇f(x0,y0)≠0, then ∇f(x0,y0) is normal to the level curve of f at (x0,y0). » ; théorème 4.13 :
  « If ∇f(x0,y0)≠0, then Duf(x0,y0) is maximized when u points in the same direction as ∇f(x0,y0). »
- **Avant** : « En chaque point, $∇J$ est perpendiculaire à la ligne de niveau et pointe vers la montée la plus raide. »
- **Après** : « Hors du centre, $∇J$ est perpendiculaire à la ligne de niveau et pointe vers la montée la plus raide. »
  (même nombre de mots : la page reste à 52.)
- **Règle appliquée** : pas de formule absolue (toujours, jamais, tout) sauf si elle est vraie et sourcée
  (CLAUDE.md, règles éditoriales Théta). La correction ajoute la condition, elle ne retire aucune nuance.

## Décisions de l'utilisateur

### D1 · Page 2, visuel `flux`, champ `etiquette` : les variables a et b deviennent « A » et « B »

- **Constat** : les étiquettes sont rendues en capitales (« DÉRIVÉE PARTIELLE SELON A », « … SELON B ») ; le
  lecteur voit une variable A qui n'existe pas, alors que le texte et les cases écrivent a et b.
- **Source vérifiée** : rendu `sortie/07/page-02.png` (pas de source web : point de lecture).
- **Correction proposée** :
  - avant : `etiquette: "Dérivée partielle selon a"` / `etiquette: "Dérivée partielle selon b"`
  - après : `etiquette: "Première dérivée partielle"` / `etiquette: "Deuxième dérivée partielle"`
    (les cases « a bouge, b fixé » et « b bouge, a fixé » disent déjà laquelle).
- **Option recommandée** : la correction ci-dessus, parce qu'elle supprime la confusion sans toucher aux cases.
  Autre option : garder les étiquettes et demander, dans AMBIGUITES.md, que le gabarit ne mette pas en
  capitales les variables d'une étiquette (session de design).
- **Décision** : oui / non / autre

### D2 · Page 4, `tableau` : signe moins en trait d'union (« -1 », « -6 », « -4 »)

- **Constat** : le tableau affiche les nombres négatifs avec un trait d'union (vérifié dans
  `sortie/07/html/page-04.html` : `<td>-1</td>`, `<td class="accent">-6</td>`), alors que la carte juste en
  dessous écrit « (4 ; −6) » et « (−4 ; 0) » avec le vrai signe moins. Le contrôle typographique de
  `serie verifier` ne l'a pas relevé. Le format vient du rendu du tableau, pas de `contenu/07.yaml`.
- **Source vérifiée** : rendu `sortie/07/page-04.png` et son HTML (pas de source web).
- **Correction proposée** : aucune dans `contenu/07.yaml`. Ajouter à AMBIGUITES.md : « Tableaux : les nombres
  négatifs issus de `calculs/` sont rendus avec un trait d'union (-6) au lieu du signe moins (−6) ; vu sur
  l'épisode 07, page 4. À corriger dans le formatage des cellules (session de design). »
- **Option recommandée** : noter dans AMBIGUITES.md et publier tel quel, l'écart est visible mais ne fausse rien.
  Autre option : attendre la correction du gabarit avant publication.
- **Décision** : oui / non / autre

### D3 · Page 4, champ `texte` : « 3 » seul en fin de ligne

- **Constat** : la coupure tombe entre « 3 » et « fois 2b » ; le lecteur lit « a fixé : 3 », puis « fois 2b »
  à la ligne suivante.
- **Source vérifiée** : rendu `sortie/07/page-04.png` (pas de source web).
- **Correction proposée** :
  - avant : « Puis en $b$, $a$ fixé : 3 fois 2$b$, soit 6$b$. »
  - après : « Puis en $b$, $a$ fixé : 3 fois 2$b$, soit 6$b$. » avec une espace insécable (U+00A0) entre « 3 »
    et « fois » (même texte, même nombre de mots).
- **Option recommandée** : l'espace insécable, si le contrôle de typographie l'accepte au rendu ; sinon,
  laisser tel quel.
- **Décision** : oui / non / autre

### D4 · Pages 3 et 4, visuel `niveaux` (carte) : étiquettes qui chevauchent les ellipses

- **Constat** : sur les pages 3 et 4, la ligne de niveau traverse l'étiquette « réglage a » ; sur la page 3,
  l'étiquette « ∇J » du point (−2 ; 0) touche l'ellipse extérieure.
- **Source vérifiée** : rendus `sortie/07/page-03.png` et `sortie/07/page-04.png` (pas de source web).
- **Correction proposée** (à confirmer au rendu, je n'ai pas pu tester le gabarit) :
  - pages 3 et 4 : avant `domaine: [-3.4, 3.4]`, après `domaine: [-4.4, 4.4]` (l'axe a sort des ellipses,
    l'étiquette avec lui ; le cadre de 920 px le permet aux deux échelles) ;
  - page 3, point (−2 ; 0) : avant `decalage: [-14, -16]`, après `decalage: [-40, -16]`.
- **Option recommandée** : appliquer et relancer `serie rendre 07` ; revenir en arrière si le cadre déborde.
- **Décision** : oui / non / autre

### D5 · Fiche et extraits : ajouter une référence lisible pour la page 3

- **Constat** : les extraits MIT (`mit-perpendiculaire`, `mit-exemple`, `mit-plan`, `mit-taux`, `mit-vecteur`,
  `mit-symbole`) viennent d'un PDF que je n'ai pas pu relire mot pour mot ; seul le titre de la session
  (« Gradient: Definition, Perpendicular to Level Curves ») est confirmé. De plus, l'extrait
  `mit-perpendiculaire` annonce une preuve (« In the next session we will prove… ») sans condition ; la
  condition ∇f ≠ 0, nécessaire pour C1, n'est écrite dans aucun extrait.
- **Source vérifiée** : OpenStax, *Calculus Volume 3*, 4.6, https://openstax.org/books/calculus-volume-3/pages/4-6-directional-derivatives-and-the-gradient :
  « If ∇f(x0,y0)≠0, then ∇f(x0,y0) is normal to the level curve of f at (x0,y0). »
- **Correction proposée** : ajouter à `banque/episodes/07-le-gradient.yaml` (références, cours) :
  `- titre: OpenStax Calculus Volume 3 · 4.6 Directional Derivatives and the Gradient` /
  `url: https://openstax.org/books/calculus-volume-3/pages/4-6-directional-derivatives-and-the-gradient`,
  et à `sources/07/extraits.yaml` deux extraits : `openstax-normale` (phrase ci-dessus, appuie page 3 et C1)
  et `openstax-max` (« If ∇f(x0,y0)≠0, then Duf(x0,y0) is maximized when u points in the same direction as
  ∇f(x0,y0). », appuie le titre de la page 3) ; les citer dans `sources:` de la page 3.
- **Option recommandée** : oui, parce que la condition « hors du centre » devient sourcée et la page 3 ne
  dépend plus d'un PDF illisible. Autre option : relire vous-même le PDF MIT et garder la fiche telle quelle.
- **Décision** : oui / non / autre

## Contrôles automatiques (serie verifier)

Résultat : aucune erreur bloquante, 3 avertissement(s).

Avertissements :

- page 2 (ouverture) : 32 mots, proche de la limite de 32
- page 3 (mécanisme) : 52 mots, proche de la limite de 55
- page 4 (exemple) : 54 mots, proche de la limite de 55

| Page | Mots | Vide au-dessus du pied (px) |
| --- | ---: | ---: |
| 1 | 2 | 54 |
| 2 | 32 | 42 |
| 3 | 52 | 56 |
| 4 | 54 | 142 |
| 5 | 0 | 6 |

Seuil de remplissage : 233 px.

## Affirmations et sources

Liens lus : D2L 2.4 https://d2l.ai/chapter_preliminaries/calculus.html (lu directement) ; DLB ch. 4, page
officielle https://www.deeplearningbook.org/contents/numerical.html illisible par l'outil, lu sur la copie du
chapitre 4 https://wxdublin.gitbooks.io/deep-learning/gradient-based-optimization.html ; MIT OCW 18.02SC,
session 35 (page lue, PDF illisible) ; OpenStax 4.6 (lu directement).

| Page | Affirmation | Extrait | Vérifiée sur |
| --- | --- | --- | --- |
| 2 | Le coût dépend de plusieurs réglages | d2l-plusieurs, dlb-plusieurs | D2L 2.4 : « In deep learning, we also need to work with functions of many variables. » ; DLB : « We often minimize functions that have multiple inputs » |
| 2 | Bouger a seul, b fixé : la pente de J est la dérivée partielle selon a ; idem pour b | d2l-partielle, dlb-partielle, mit-taux | D2L 2.4 : « we can treat x_1, …, x_{i-1}, x_{i+1}, …, x_n as constants » ; DLB : « measures how f changes as only the variable x_i increases at point x. » (mit-taux non relu, voir D5) |
| 2 | Rangées dans un vecteur, ces pentes forment le gradient ∇J | d2l-vecteur, dlb-gradient, mit-vecteur, d2l-nabla, mit-symbole | D2L 2.4 : « We can concatenate partial derivatives of a multivariate function with respect to all its variables » ; « When there is no ambiguity, ∇ₓf(x) is typically replaced by ∇f(x). » ; DLB : « The gradient generalizes the notion of derivative to the case where the derivative is with respect to a vector » |
| 2 | Rappel : Nº 05, une droite à deux réglages a et b ; Nº 06, la pente de J selon un réglage | épisodes 05 et 06 | `contenu/05.yaml` (« chercher le creux pour a et b ensemble ») et `contenu/06.yaml` (« La dérivée, une pente ») : conforme |
| 3 | J = a² + 3b², coût choisi pour l'exemple | aucun (choix d'exemple, dit comme tel) | sans objet ; calculs dans `calculs/descente_gradient.py` |
| 3 | Les lignes de niveau relient les points de même coût | mit-perpendiculaire (f(x, y) = c) | OpenStax 4.6 (courbe de niveau, théorème 4.14) ; MIT non relu mot pour mot |
| 3 | ∇J perpendiculaire à la ligne de niveau | mit-perpendiculaire, mit-exemple | OpenStax 4.6, théorème 4.14 : « If ∇f(x0,y0)≠0, then ∇f(x0,y0) is normal to the level curve of f at (x0,y0). » (condition : C1) |
| 3 | ∇J pointe vers la montée la plus raide | dlb-plus-vite, dlb-montee | DLB : « the gradient points directly uphill, and the negative gradient points directly downhill. » ; OpenStax 4.13 : « maximized when u points in the same direction as ∇f(x0,y0) » |
| 3 | Encadré : au fond, toutes les dérivées partielles sont nulles, ∇J = (0 ; 0) n'indique aucune direction | dlb-critique, dlb-sans-direction | DLB : « In multiple dimensions, critical points are points where every element of the gradient is equal to zero. » ; « the derivative provides no information about which direction to move. » ; OpenStax 4.13 : « If ∇f(x0,y0)=0, then Duf(x0,y0)=0 for any unit vector u. » |
| 3 | Valeurs sur la carte : (1 ; 1) → (2 ; 6), (2 ; −1) → (4 ; −6), (−2 ; 0) vers la gauche | calcul `gradient_tableau` | recalculé : 2a et 6b aux trois points, conforme ; flèches perpendiculaires vérifiées sur le rendu (axes à la même échelle) |
| 4 | Dérivée en a, b fixé : 2a ; en b : 3 fois 2b, soit 6b | d2l-partielle, d2l-puissance, d2l-multiple, d2l-somme, d2l-constante | D2L 2.4 : « d/dx xⁿ = n x^{n-1} » pour « n ≠ 0 » ; « d/dx [C f(x)] = C d/dx f(x) » ; « d/dx [f(x) + g(x)] = d/dx f(x) + d/dx g(x) » ; « d/dx C = 0 » |
| 4 | ∇J = (2a ; 6b) ; tableau J, 2a, 6b aux quatre points | dlb-element, calcul `gradient_tableau` | DLB : « Element i of the gradient is the partial derivative of f with respect to x_i » ; valeurs recalculées : (1;1) 4, 2, 6 ; (2;−1) 7, 4, −6 ; (−2;0) 4, −4, 0 ; (0;0) 0, 0, 0 |
| 5 | Trois points à retenir, reprise des pages 2 et 3 | mêmes extraits | rien de nouveau ; épisode suivant Nº 08 « La descente de gradient », transition identique à la fiche |
| Post | Deux rythmes côte à côte indiquent où le coût monte le plus vite ; ∇J à angle droit vers la montée la plus raide ; J(a, b) = a² + 3b² | dlb-montee, mit-perpendiculaire | DLB et OpenStax ci-dessus ; aucun chiffre daté nécessaire (pas de statistique) |

## Validation scientifique

**Page 2 (ouverture)**
- Hypothèse : J dérivable par rapport à chaque réglage ; deux réglages a et b.
- Domaine : dit (« Bougeons a seul, b fixé », « Idem pour b ») ; le cas à deux réglages est explicite.
- Contre-exemple : aucun pour la définition ; avec n réglages, n dérivées partielles (D2L), la page n'affirme pas le contraire.
- Raccourci : « pente » pour dérivée partielle, assumé et cohérent avec l'épisode 06.

**Page 3 (mécanisme)**
- Hypothèse : J dérivable et ∇J ≠ 0 ; « la plus raide » au sens de la distance usuelle, a et b mesurés sur la même échelle.
- Domaine : coût dit « choisi pour l'exemple » ; la condition ∇J ≠ 0 manquait dans le texte (corrigée en C1, « Hors du centre »), elle est déjà dans l'encadré.
- Contre-exemple : au centre (0 ; 0), ∇J = (0 ; 0) n'est ni perpendiculaire ni orienté (traité par l'encadré et C1). Si a et b avaient des unités différentes (cas d'Ames en 08), la direction « la plus raide » dépendrait de l'échelle choisie : non abordé ici, sans erreur, puisque la carte est à la même échelle sur les deux axes.
- Raccourci : « montée la plus raide » pour la direction de plus forte hausse locale ; assumé, conforme au DLB (« points directly uphill »).

**Page 4 (exemple chiffré)**
- Hypothèse : J = a² + 3b² précisément ; règles de la puissance, du multiple constant, de la somme et de la constante.
- Domaine : dit (« Pour J = a² + 3b² », « ici aux points de la carte »).
- Contre-exemple : aucun ; les quatre lignes du tableau sont exactes.
- Raccourci : aucun ; la conclusion « Au fond, en (0 ; 0) » vaut pour ce J (seul point critique), ce que le contexte rend clair.

**Page 5 (fin)**
- Hypothèse : celles des pages 2 et 3.
- Domaine : « Sur la carte » limite le point 3 à l'exemple.
- Contre-exemple : le centre (∇J nul), traité page 3.
- Raccourci : reprise sans « en chaque point », pas de formule absolue.

**Texte du post**
- Hypothèse : deux réglages, coût dérivable.
- Domaine : l'analogie de l'appareil à deux boutons est présentée comme une image (« Imaginez »).
- Contre-exemple : si les deux rythmes sont nuls, ils n'indiquent aucun côté ; non dit dans le post, dit dans le carrousel.
- Raccourci : assumé (texte d'annonce, le détail est renvoyé au carrousel).

Images réelles : aucune pour cet épisode (dossier `assets/images/candidats/07/` absent) ; rien à contrôler.
