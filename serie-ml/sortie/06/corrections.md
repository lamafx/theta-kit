# Corrections de l'épisode 06

## Production (contrôles automatiques et rendu)

- Page 4 (exemple) : « 57 mots (titre et texte), 55 au plus ». Avant : « Plus $h$ rapetisse, plus le rapport s'approche de 6 : la pente de la tangente en $a$ = 3. » Après : « Quand $h$ rapetisse, le rapport s'approche de 6 : la pente en $a$ = 3. » (53 mots).
- Page 4 (vérification complète) : « page trop vide : 351 px entre le dernier bloc et le pied (seuil 233 px) ». Avant : trois écarts h (1 ; 0,5 ; 0,1), cadre de 330 px. Après : quatre écarts h (1 ; 0,5 ; 0,2 ; 0,1 ; rapport 6,2 pour h = 0,2, recalculé par calculs.descente_gradient.erreur), cadre de 450 px. Aucune nuance retirée.
- Couverture (rendu) : pivot de l'éventail du centre du fond [540, 390] à [660, 400], pour que le doigt du robot (geste « pointer ») montre le point au lieu de le cacher.

## Mises en conformité de la relecture (sortie/06/relecture.md)

Aucune : le relecteur n'en a relevé aucune (six décisions D1 à D6 attendent l'utilisateur).

## Réécriture du texte du post (2026-11-05, A63)

Demande de l'utilisateur : réécrire le post selon `theta-post/`, textes validés le 2026-11-05. Pages du carrousel inchangées.

- Avant : bloc `linkedin` en quatre parties (commit d57f104).
- Après : bloc `linkedin` en `texte` libre ; rapport dans `theta-post/episodes/brouillons/06_la-pente-d-une-courbe-la-derivee_v1.md`.

## Fin du post (2026-11-06)

Demande de l'utilisateur : varier les fins de post. Fin : petit défi remplacé par une synthèse en une phrase.

## Validation du 2026-11-06

Épisode relu et validé par l'utilisateur, qui a demandé le passage à « relu » et l'enregistrement de la relecture. Le sous-agent `relecteur` n'a pas été repassé sur le texte du post réécrit ; `sortie/06/relecture.md` reste le rapport précédent et ses décisions D n'ont pas été arbitrées une à une.
