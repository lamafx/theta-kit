# Épisode 10 : corrections automatiques

## Avant la relecture (contrôles `serie verifier 10`)

- Page 5 (Fin), point 1 : « mots absents des pages (forcém) ».
  - avant : « La descente s'arrête au premier creux où la pente est nulle : un **minimum local**, pas forcément le **minimum global**. »
  - après : « La descente s'arrête au premier creux, où la pente est nulle : un **minimum local**. Le plus bas est le **minimum global**. »
- Page 2 (Ouverture), rappel : « prérequis non cités : Nº 05, Nº 06, Nº 07, Nº 09 ».
  - avant : « Nº 08 : la descente avance à l'inverse de la pente, et s'arrête là où la pente est nulle. »
  - après : « Nº 05, 06 et 07 : le coût $J$, sa pente $∇J$ ; Nº 08 et 09 : la descente, pas à pas, jusqu'à une pente nulle. »
- Page 2 (Ouverture), visuel : « page trop vide : 319 px entre le dernier bloc et le pied (seuil 233 px) ».
  - avant : cadre [920, 450], origine [300, 250], échelle [200, 96], plage [−1,3 ; 2], position_x [820, 282].
  - après : cadre [920, 580], origine [300, 320], échelle [200, 125], plage [−1,3 ; 2,1], position_x [820, 352].
- Page 3 (Mécanisme), visuel : « pied de page poussé hors de la page (bas à 1307 px, limite 1294) ».
  - avant : cadre [920, 450], origine [460, 225], échelle 130.
  - après : cadre [920, 410], origine [460, 205], échelle 120.
- Page 4 (Repère), visuel : « pied de page poussé hors de la page (bas à 1298 px, limite 1294) ».
  - avant : cadre [920, 450], origine [460, 400].
  - après : cadre [920, 425], origine [460, 385].

## Mises en conformité de la relecture

- C1 · Page 5 (Fin), `points[0]` : pas de formule absolue ; la source dit « may only minimize… locally ».
  - avant : « La descente s'arrête au premier creux, où la pente est nulle : un **minimum local**. Le plus bas est le **minimum global**. »
  - après : « La descente peut s'arrêter au premier creux, où la pente est nulle : un **minimum local**. Le plus bas est le **minimum global**. »

## Réécriture du texte du post (2026-11-05, A63)

Demande de l'utilisateur : réécrire le post selon `theta-post/`, textes validés le 2026-11-05. Pages du carrousel inchangées.

- Avant : bloc `linkedin` en quatre parties (commit d57f104).
- Après : bloc `linkedin` en `texte` libre ; rapport dans `theta-post/episodes/brouillons/10_minimums-locaux-et-points-selle_v1.md`.

## Fin du post (2026-11-06)

Demande de l'utilisateur : varier les fins de post. Fin : transition remplacée par une citation vérifiée mot pour mot (Dauphin et al., 2014, extrait dauphin-plateaux).

## Validation du 2026-11-06

Épisode relu et validé par l'utilisateur, qui a demandé le passage à « relu » et l'enregistrement de la relecture. Le sous-agent `relecteur` n'a pas été repassé sur le texte du post réécrit ; `sortie/10/relecture.md` reste le rapport précédent et ses décisions D n'ont pas été arbitrées une à une.
