# Corrections de l'épisode 07

## Production (contrôles automatiques et rendu)

- Page 4 (exemple) : « 58 mots (titre et texte), 55 au plus ». Avant : « … Donc $∇J$ = (2$a$ ; 6$b$). Aux points de la carte : » et conclusion « En (1 ; 1), $∇J$ = (2 ; 6) : la flèche monte surtout selon $b$, où le coût est trois fois plus courbé. En (0 ; 0), $∇J$ = (0 ; 0). » Après : « … Donc $∇J$ = (2$a$ ; 6$b$), ici aux points de la carte. » et « En (1 ; 1), $∇J$ = (2 ; 6) : la flèche de la carte. Au fond, en (0 ; 0), $∇J$ = (0 ; 0). » La phrase sur la courbure, non sourcée et appuyée sur un terme non introduit, est retirée ; aucune nuance sourcée retirée.
- Page 3 (mécanisme) : « extrait dlb-sans-direction absent ». Ajout de l'extrait DLB ch. 4 « When f′(x) = 0, the derivative provides no information about which direction to move. » dans sources/07/extraits.yaml.
- Page 5 (fin) : « mots absents des pages (autre ; rappor) ». Avant : « La dérivée partielle : la pente de $J$ selon un seul réglage, l'autre fixé. » et « Dans quelle direction pointe $∇J$ par rapport à une ligne de niveau ? » Après : « Bougeons $a$ seul, $b$ fixé : la pente de $J$ est la dérivée partielle. » et « Sur la carte, que fait $∇J$ face à une ligne de niveau ? »
- Page 2 (rendu) : le schéma Flux coupait « Coût J(a, b) » en deux boîtes (virgule lue par YAML). Étapes mises entre guillemets.
- Pages 2 et 4 (vérification complète) : « ∂ dessiné en partie par une police du système (Times New Roman) » et, page 4, « police de 16,28 px sous le minimum de 22 px » (fractions ${∂J}/{∂a}$ dans les titres de colonnes). Avant : « la dérivée partielle ${∂J}/{∂a}$ » ; colonnes « ${∂J}/{∂a}$ = 2$a$ », « ${∂J}/{∂b}$ = 6$b$ ». Après : « la dérivée partielle selon $a$ » ; colonnes « Selon $a$ : 2$a$ », « Selon $b$ : 6$b$ ». La notation ∂ n'est pas affichée (police embarquée sans ∂, AMBIGUITES A57).
- Page 2 (vérification complète) : « page trop vide : 423 px ». Avant : un schéma Flux d'une ligne. Après : trois lignes (dérivée partielle selon a, selon b, rangées dans un vecteur). Ouverture ramenée à 32 mots : « De même pour $b$ » devient « Idem pour $b$ ».
- Page 4 (vérification complète) : « page trop vide : 435 px ». Ajout, sous le tableau, de la carte Niveaux (cadre 920 × 300) avec les valeurs de ∇J aux points du tableau.
- Page 4 (rendu) : l'étiquette « ∇J = (2 ; 6) » chevauchait « réglage b » : décalage [14, 8] puis [-205, 8]. « 3 × 2$b$ = 6$b$ » se coupait après « 3 » : « 3 fois 2$b$, soit 6$b$ » (le 3 reste en fin de ligne, voir D3 de la relecture).

## Mises en conformité de la relecture (sortie/07/relecture.md)

- C1 · Page 3, `texte`. Avant : « En chaque point, $∇J$ est perpendiculaire à la ligne de niveau et pointe vers la montée la plus raide. » Après : « Hors du centre, $∇J$ est perpendiculaire à la ligne de niveau et pointe vers la montée la plus raide. »

## Réécriture du texte du post (2026-11-05, A63)

Demande de l'utilisateur : réécrire le post selon `theta-post/`, textes validés le 2026-11-05. Pages du carrousel inchangées.

- Avant : bloc `linkedin` en quatre parties (commit d57f104).
- Après : bloc `linkedin` en `texte` libre ; rapport dans `theta-post/episodes/brouillons/07_le-gradient_v1.md`.

## Validation du 2026-11-06

Épisode relu et validé par l'utilisateur, qui a demandé le passage à « relu » et l'enregistrement de la relecture. Le sous-agent `relecteur` n'a pas été repassé sur le texte du post réécrit ; `sortie/07/relecture.md` reste le rapport précédent et ses décisions D n'ont pas été arbitrées une à une.
