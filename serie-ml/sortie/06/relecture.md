# Relecture · Nº 06 · La pente d'une courbe : la dérivée

Relu le 2026-11-01. Toutes les affirmations sont justes et rattachées à un extrait relu sur la source primaire
(D2L 2.4, DLB ch. 4). Aucune règle éditoriale n'est enfreinte. Les quatre valeurs du tableau de la page 4 sont
recalculées et justes (le rapport vaut exactement 6 + h). Points à trancher, par ordre d'importance : une
hypothèse implicite à la page 3 (D1), la traçabilité du calcul de la page 4 (D4), puis la forme (D2, D3, D5, D6).

**Avertissement scientifique (en tête, charte « La validation scientifique »)** : page 3, « Pente positive : J
monte quand a augmente. Négative : J descend. » n'est vrai que pour un petit déplacement de a. Le contre-exemple
n'est pas traité : en a = −2 (pente −4), passer à a = 3 fait monter J de 4 à 9. Voir D1.

## Mises en conformité (appliquées automatiquement)

Aucune. Pas de tiret long, pas de citation entre guillemets, pas de chiffre réel à dater (tous les nombres sont
des valeurs de J(a) = a²), pas de formule absolue non sourcée, pas d'image réelle donc pas de crédit.

## Décisions de l'utilisateur

### D1 · Page 3, `texte` : le sens du signe ne vaut que pour un petit déplacement

- **Constat** : « $J$ monte quand $a$ augmente » ne dit pas que c'est vrai seulement pour un petit déplacement
  (la page 2 le disait, « bouge un peu », mais pas la page 3). En a = −2, la pente est −4, mais passer à a = 3
  fait monter J de 4 à 9.
- **Source vérifiée** : Goodfellow, Bengio, Courville, *Deep Learning*, ch. 4, section 4.3,
  https://www.deeplearningbook.org/contents/numerical.html (page lue en entier via un lecteur de texte, la page
  HTML d'origine n'étant pas lisible directement) : « f(x − ε sign(f′(x))) is less than f(x) for small enough ε »
  et « it specifies how to scale a small change in the input to obtain the corresponding change in the output ».
- **Correction proposée** (44 → 46 mots, limite 55) :
  - avant : « Pente positive : $J$ monte quand $a$ augmente. Négative : $J$ descend. »
  - après : « Pente positive : $J$ monte quand $a$ augmente un peu. Négative : $J$ descend. »
- **Option recommandée** : oui. Deux mots suffisent à dire l'hypothèse, et ils reprennent ceux de la page 2.
  La page de fin (« Pente positive : $J$ monte. ») reste telle quelle : elle résume. Autre option : « … quand $a$
  augmente, tout près du point. » (49 mots).
- **Décision** : oui / non / autre

### D2 · Page 2, `texte` : « la tangente suit la courbe » laisse croire qu'elle la longe

- **Constat** : « La tangente suit la courbe en un point. » : « suit » laisse penser que la tangente épouse la
  courbe. En fait, c'est une droite qui la touche en ce point puis s'en écarte (on le voit sur le visuel). Le mot
  « droite » n'est pas écrit.
- **Source vérifiée** : « Tangente (géométrie) », Wikipédia,
  https://fr.wikipedia.org/wiki/Tangente_(géométrie) : « la tangente à une courbe en un de ses points est une
  droite qui « touche » la courbe au plus près au voisinage de ce point » ; D2L 2.4,
  https://d2l.ai/chapter_preliminaries/calculus.html : « its tangent line y = 2x - 3 at x=1, where the
  coefficient 2 is the slope of the tangent line ».
- **Correction proposée** (29 → 31 mots, limite 32) :
  - avant : « La tangente suit la courbe en un point. »
  - après : « La tangente, une droite, frôle la courbe en un point. »
- **Option recommandée** : la correction ci-dessus, parce qu'elle dit ce qu'est la tangente (une droite) et ne
  laisse pas croire qu'elle longe la courbe. Autre option, à nombre de mots égal (29) : « La tangente frôle la
  courbe en un point. »
- **Décision** : oui / non / autre

### D3 · Page 3, visuel : l'étiquette « pente 0 » touche la courbe

- **Constat** : sur `page-03.png`, le « 0 » de « pente 0 » est posé sur la courbe, à droite du creux
  (`points[1].decalage: [26, -22]`), et se lit mal.
- **Source vérifiée** : rendu `sortie/06/page-03.png` (le tracé suit `bibliotheque/courbe.py`, `_tangentes` :
  l'étiquette est placée en `x + dx`, `y + dy`, en px du cadre 920 × 450, à l'échelle 1 dans la page). En
  a = 0,95 (105 px à droite), la courbe est 24 px au-dessus du creux, à la hauteur du bas du texte.
- **Correction proposée** :
  - avant : `- {theta: 0, decalage: [26, -22]}`
  - après : `- {theta: 0, decalage: [26, -48]}`
  (le bas du texte passe à environ 24 px au-dessus de la courbe ; rien d'autre ne se trouve dans cette zone).
- **Option recommandée** : oui, parce que c'est un réglage de paramètre et qu'il n'y a rien à changer dans la
  forme. Autre option : `[-110, -48]`, l'étiquette à gauche du creux.
- **Décision** : oui / non / autre

### D4 · Page 4, visuel : les colonnes « hausse de J » et « hausse ÷ h » ne viennent d'aucune fonction de `calculs/`

- **Constat** : `J(3 + h)` vient de `calculs.descente_gradient.erreur`. Mais la hausse et le rapport sont
  calculés à la main dans le commentaire, alors que la charte demande un exemple « recalculé, pas recopié ». La
  charte classe aussi « chiffre sans fonction de calcul » parmi les erreurs bloquantes, ce que `serie verifier`
  ne détecte pas. J'ai recalculé les valeurs et elles sont justes : rapports 7 ; 6,5 ; 6,2 ; 6,1 (= 6 + h).
- **Source vérifiée** : D2L 2.4, https://d2l.ai/chapter_preliminaries/calculus.html : « Setting x=1, we see that
  \frac{f(x+h) - f(x)}{h} approaches 2 as h approaches 0. » La même page calcule ce rapport par une fonction
  (sorties « h=0.10000, numerical limit=2.30000 » …). Règle : `charte/regles-redaction.md`, « Les vérifications
  obligatoires » et tableau « Erreurs, avertissements et désaccords ».
- **Correction proposée** : ajouter dans `calculs/descente_gradient.py` (dossier non verrouillé) :
  ```python
  def taux(theta: float, h: float, a: float = 1.0) -> dict[str, float]:
      """Écart h, J(θ + h), hausse J(θ + h) − J(θ) et rapport hausse ÷ h (épisode 06)."""
      haut = erreur(theta + h, a)
      hausse = haut - erreur(theta, a)
      return {"h": h, "j": haut, "hausse": hausse, "rapport": hausse / h}
  ```
  et, dans `contenu/06.yaml`, remplacer le commentaire :
  - avant : `lignes:  # calculs.descente_gradient.erreur(3 + h), erreur(3 + h) − erreur(3), puis ÷ h (arrondi à 2 décimales)`
  - après : `lignes:  # calculs.descente_gradient.taux(3, h) pour h = 1 ; 0,5 ; 0,2 ; 0,1 (arrondi à 2 décimales)`
  Les valeurs du tableau ne changent pas.
- **Option recommandée** : oui. Chaque chiffre est ainsi rattaché à une fonction, ce que demande la charte. Autre
  option : laisser en l'état et noter dans AMBIGUITES.md que le rapport est fait à la main.
- **Décision** : oui / non / autre

### D5 · Page 1, couverture : un éventail de droites, alors que la fiche décrit « courbe avec des tangentes en plusieurs points »

- **Constat** : la famille Courbe n'a qu'une forme de couverture, l'éventail de droites autour d'un point
  (`pivot: [660, 400]`). Elle ne montre aucune courbe, alors que la fiche décrit `couverture.description:
  courbe avec des tangentes en plusieurs points`. Le rendu se lit quand même : des droites passent par un point et
  une seule est mise en avant, ce qui rappelle la tangente parmi les droites possibles. Mais ce n'est pas ce que
  décrit la fiche.
- **Source vérifiée** : `banque/episodes/06-la-pente-d-une-courbe-la-derivee.yaml` (champ `couverture`) ;
  `sortie/06/page-01.png`. Aucune source web n'est utile ici : la question est de mise en page.
- **Correction proposée** : rien à changer dans `contenu/06.yaml`. Ajouter dans AMBIGUITES.md : « Couverture de
  la famille Courbe : une seule forme (éventail). La fiche 06 décrit une courbe avec des tangentes en plusieurs
  points ; à prévoir lors d'une prochaine session de design (variante de couverture "courbe et tangentes"). »
- **Option recommandée** : publier avec l'éventail et noter le besoin dans AMBIGUITES.md. La couverture reste
  lisible, et seule une session de design peut ajouter une forme. Autre option : changer la description de la
  fiche (« des droites autour d'un point, une seule surlignée »).
- **Décision** : oui / non / autre

### D6 · Post LinkedIn, `promesse` : « de deux façons » présente l'approximation comme un calcul exact

- **Constat** : « calcule la pente en a = 3 de deux façons : par la dérivée 2a, et en divisant la hausse du coût
  par un écart de plus en plus petit ». Le tableau ne donne pas 6 : il s'en approche (6,1 pour h = 0,1). La page 4
  le dit (« Vérifions », « s'approche de 6 »).
- **Source vérifiée** : D2L 2.4, https://d2l.ai/chapter_preliminaries/calculus.html : « This limit tells us what
  the ratio between a perturbation h and the change in the function value f(x + h) - f(x) converges to as we
  shrink its size to zero. »
- **Correction proposée** :
  - avant : « puis calcule la pente en a = 3 de deux façons : par la dérivée 2a, et en divisant la hausse du coût
    par un écart de plus en plus petit. »
  - après : « puis calcule la pente en a = 3 par la dérivée 2a, et la retrouve en divisant la hausse du coût par
    un écart de plus en plus petit. »
- **Option recommandée** : oui. La phrase garde à peu près la même longueur et suit la page 4 (« vérifions »).
  Relancer `serie verifier 06` après la modification pour contrôler la longueur du post.
- **Décision** : oui / non / autre

## Contrôles automatiques (serie verifier)

Recopie de `sortie/06/verification.md` :

Résultat : aucune erreur bloquante, 2 avertissement(s).

Avertissements :
- page 2 (ouverture) : 29 mots, proche de la limite de 32
- page 4 (exemple) : 53 mots, proche de la limite de 55

Mesures :

| Page | Mots | Vide au-dessus du pied (px) |
| --- | ---: | ---: |
| 1 | 6 | 59 |
| 2 | 29 | 158 |
| 3 | 44 | 60 |
| 4 | 53 | 231 |
| 5 | 0 | 6 |

Seuil de remplissage : 233 px.

(Si D1 et D2 sont acceptées : page 2 à 31 mots, page 3 à 46 ; à revérifier.)

## Affirmations et sources

Sources relues le 2026-11-01 : D2L 2.4, https://d2l.ai/chapter_preliminaries/calculus.html (page HTML) ; DLB
ch. 4, https://www.deeplearningbook.org/contents/numerical.html (lue via le lecteur r.jina.ai, la page d'origine
étant un rendu PDF illisible par l'outil) ; pour le contre-exemple du point selle, D2L 12.1,
https://d2l.ai/chapter_optimization/optimization-intro.html.

| Page | Affirmation | Extrait | Vérifiée sur |
| --- | --- | --- | --- |
| 2 (rappel) | Épisode 05 : J selon a dessine un U ; ici, le plus simple, J = a² | (renvoi à l'épisode 05, page 6 : « les coûts J forment un U ») | `contenu/05.yaml` ; cas particulier dit (« ici, le plus simple ») |
| 2 | La tangente suit la courbe en un point (voir D2) | d2l-tangente | D2L 2.4 : « its tangent line y = 2x - 3 at x=1 … the coefficient 2 is the slope of the tangent line » ; Wikipédia, Tangente (géométrie) |
| 2 | Sa pente est la dérivée | d2l-pente, dlb-pente | D2L 2.4 : « derivatives tell us the slope of a function at a particular location » ; DLB 4.3 : « The derivative f′(x) gives the slope of f(x) at the point x. » |
| 2 | Le rythme auquel J change quand a bouge un peu | d2l-taux, d2l-instantane, dlb-petit-pas | D2L 2.4 : « a derivative is the rate of change in a function with respect to changes in its arguments » ; « instantaneous rate of change » |
| 2 (visuel) | Pente 4 en a = 2 ; un pas de 1, la tangente monte de 4 | d2l-puissance | Calculée par `calculs.descente_gradient.pente(2)` = 4 (code de `_tangentes`) ; 2 × 2 = 4 |
| 3 | Pente positive : J monte quand a augmente | dlb-positif | DLB fig. 4.1 : « For x > 0, we have f′(x) > 0, so we can decrease f by moving leftward. » (pour f(x) = ½x²) ; vrai pour un petit pas (D1) |
| 3 | Négative : J descend | dlb-negatif | DLB fig. 4.1 : « For x < 0, we have f′(x) < 0, so we can decrease f by moving rightward. » |
| 3 | Nulle : c'est plat, comme au fond du creux | dlb-minimum, dlb-critique | DLB fig. 4.1 : « Global minimum at x = 0. » ; fig. 4.2 : « A critical point is a point with zero slope. » |
| 3 | La taille de la pente dit la vitesse | d2l-vitesse | D2L 2.4 : « Derivatives can tell us how rapidly a loss function would increase or decrease … » |
| 3 | En a = 3, J monte plus vite qu'il ne descend en a = −2 | d2l-puissance | Pentes 6 et −4 (`pente(3)`, `pente(-2)`) ; 6 > 4 |
| 3 (encadré) | Au sommet d'une bosse aussi, la pente est nulle | dlb-types | DLB fig. 4.2 : « a local maximum, which is higher than the neighboring points » |
| 3 (encadré) | Elle n'indique plus de quel côté aller | dlb-sans-direction | DLB 4.3 : « the derivative provides no information about which direction to move » |
| 4 | Pour J(a) = a², J′(a) = 2a | d2l-puissance | D2L 2.4, éq. 2.4.3 : « \frac{d}{dx} x^n = n x^{n-1} for n \neq 0 » (n = 2) |
| 4 | En a = 3, la pente vaut 6 | d2l-puissance | 2 × 3 = 6 |
| 4 (tableau) | J(4) = 16, J(3,5) = 12,25, J(3,2) = 10,24, J(3,1) = 9,61 ; hausses 7 ; 3,25 ; 1,24 ; 0,61 ; rapports 7 ; 6,5 ; 6,2 ; 6,1 | d2l-numerique, d2l-limite | Recalculé : rapport = 6 + h, exact ; D2L 2.4 fait le même calcul en x = 1 (2,3 ; 2,03 …) ; traçabilité : D4 |
| 4 (conclusion) | Quand h rapetisse, le rapport s'approche de 6, la pente en a = 3 | d2l-limite | D2L 2.4, éq. 2.4.1 : « f'(x) = \lim_{h \rightarrow 0} \frac{f(x+h) - f(x)}{h} » |
| 5 | Trois points de rappel, question renvoyant à la page 3, épisode suivant Nº 07 « Le gradient », « Mais un modèle a souvent des milliers de boutons. » | (rien de nouveau) | Conforme à la fiche 06 (`episode_suivant`) et au titre de la fiche 07 |
| Post | Savoir si ça monte ou descend, et à quelle vitesse : un seul nombre, la dérivée (un seul réglage) | d2l-taux, d2l-vitesse | D2L 2.4 ; cas d'un seul réglage dit dans la promesse (« avec un seul réglage a ») |
| Post | Pour un modèle, la dérivée dit si un réglage fait monter ou descendre le coût, et à quel rythme | d2l-vitesse, d2l-optimisation | D2L 2.4 : « … were we to increase or decrease each parameter by an infinitesimally small amount. » |
| Post | Pente en a = 3 par 2a et par la hausse ÷ un écart de plus en plus petit (voir D6) | d2l-limite, d2l-puissance | D2L 2.4 |

Images : aucune image réelle retenue (`assets/images/candidats/06/` est vide). La couverture est un motif de la
bibliothèque (voir D5).

## Validation scientifique

**Page 2 (ouverture)**
- Hypothèse : J dérivable au point considéré ; une seule variable a ; J = a², simplification du U de l'épisode 05.
- Domaine : dit (« ici, le plus simple », « un réglage a », « bouge un peu »).
- Contre-exemple : une courbe avec un angle (J = |a| en 0) n'a pas de tangente unique. C'est hors du cas traité,
  qui est lisse, donc acceptable.
- Raccourci : « rythme » pour « taux de variation instantané », assumé ; « suit la courbe » est un raccourci de
  trop (D2).

**Page 3 (mécanisme)**
- Hypothèse : le sens donné par le signe ne vaut que pour un petit déplacement de a.
- Domaine : non dit sur cette page (D1).
- Contre-exemple : en a = −2 (pente −4), aller jusqu'à a = 3 fait monter J (de 4 à 9). Pour l'encadré : une
  pente nulle peut aussi signaler un point ni creux ni bosse, comme le palier de J = a³ en 0 (D2L 12.1 : « Consider
  the function f(x) = x^3. Its first and second derivative vanish for x=0. »). L'encadré dit « aussi », sans
  prétendre faire la liste complète : il n'est pas faux.
- Raccourci : le point selle n'est pas évoqué, ce qui est acceptable (une seule nuance par épisode, celle de la
  bosse) ; la locution « un peu » manque (D1).

**Page 4 (exemple chiffré)**
- Hypothèse : J(a) = a² exactement ; dérivée par la règle de la puissance (n = 2).
- Domaine : dit (« Pour J(a) = a² », « en a = 3 »).
- Contre-exemple : aucun dans ce cadre. Pour une autre courbe, le rapport ne s'approche pas de la pente de façon
  aussi régulière (ici l'écart vaut exactement h), mais la page ne généralise pas.
- Raccourci : la limite est présentée comme « le rapport s'approche de 6 », sans le mot « limite ». C'est
  assumé et juste.

**Page 5 (fin)**
- Hypothèse : les mêmes que pour les pages 2 à 4 ; rien de nouveau.
- Domaine : résumé ; « Pente positive : J monte » sans « un peu », acceptable puisqu'il résume la page 3 (corrigée
  si D1 est acceptée).
- Contre-exemple : celui de la page 3.
- Raccourci : assumé, c'est le rôle de la page.

**Post LinkedIn**
- Hypothèse : un seul réglage ; les autres sont fixés, comme b = 4 dans l'épisode 05.
- Domaine : dit (« avec un seul réglage a »).
- Contre-exemple : avec plusieurs réglages, il faut une dérivée par réglage. C'est le sujet de l'épisode 07,
  annoncé en page 5.
- Raccourci : « de deux façons » présente l'approximation comme un calcul exact (D6).
