# Nº 09 · Corrections automatiques

## Vérification sans mesures (avant le rendu)

- Page 2, rappel : prérequis non cités (Nº 05, 06, 07).
  - Avant : « Nº 08 : le modèle mesure la pente, fait un pas dans l'autre sens, et recommence. »
  - Après : « Nº 05 : le coût $J$ ; Nº 06 et 07 : sa pente, le gradient $∇J$ ; Nº 08 : un pas dans l'autre sens. »
- Page 6, texte : « bruit » est un terme de l'épisode 26 (avertissement, mot courant) ; repris avec le mot de la page 4.
  - Avant : « Avec un $!η$ fixe, le bruit ne disparaît pas, même au minimum… »
  - Après : « Avec un $η$ fixe, les écarts ne disparaissent pas, même au minimum… »

## Rendu (lecture de la planche)

- Page 6, encadré : $η$ s'affichait en capitale (« Un H qui décroît »), comme A58.
  - Avant : « Un $η$ qui décroît raccourcit les pas… »
  - Après : « Un taux qui décroît raccourcit les pas… »
- Pages 2, 4 et 6, visuels : étiquettes et chemins qui se chevauchaient près du minimum.
  - Page 2 : cadre agrandi (920 × 500), étiquette « tout le jeu » au départ.
  - Page 4 : le chemin bruité part d'un autre point que le chemin régulier (graine 7) ; plus d'étiquette « minimum » sous la croix.
  - Page 6 : un seul chemin (taux fixe), au lieu de deux chemins mêlés au centre ; le remède est dit dans le texte.

## Vérification complète

- Page 5 : « page trop vide : 236 px entre le dernier bloc et le pied (seuil 233 px) ». La deuxième ligne est coupée en deux, sans texte ajouté.
  - Avant : « Tout le jeu à chaque pas : 1 pas par époque. Un exemple à chaque pas : 1 500 pas pour 1 500 exemples. »
  - Après : 2 lignes, « Tout le jeu à chaque pas : 1 pas par époque. » et « Un exemple à chaque pas : 1 500 pas pour 1 500 exemples. »

## Relecture : mises en conformité appliquées

- C1 (chiffre daté) : la fourchette de 32 à 256 vient du Deep Learning Book (MIT Press, 2016) ; extrait `dlb-annee` (« year={2016} », page d'accueil du livre) ajouté à sources/09/extraits.yaml et cité en page 3.
  - Page 3, cas « Un mini-lot » : « Chaque pas lit un mini-lot, souvent de 32 à 256 exemples. » → « Chaque pas lit un mini-lot, souvent de 32 à 256 exemples (usage décrit en 2016). »
  - Page 7, point 1 : « … ou un mini-lot, souvent de 32 à 256 exemples. » → « … ou un mini-lot, souvent de 32 à 256 en 2016. »
  - Post, promesse : « … ou un mini-lot, souvent de 32 à 256 exemples. » → « … ou un mini-lot, souvent de 32 à 256 exemples (usage décrit en 2016). »
  - Rendu et vérification relancés une fois : 0 erreur bloquante, 3 avertissements (« moyenne », locution courante « en moyenne »).

## Réécriture du texte du post (2026-11-05, A63)

Demande de l'utilisateur : réécrire le post selon `theta-post/`, textes validés le 2026-11-05. Pages du carrousel inchangées.

- Avant : bloc `linkedin` en quatre parties (commit d57f104).
- Après : bloc `linkedin` en `texte` libre ; rapport dans `theta-post/episodes/brouillons/09_descente-stochastique-et-mini-lots_v1.md`.

## Fin du post (2026-11-06)

Demande de l'utilisateur : varier les fins de post. Fin : question technique remplacée par une synthèse en une phrase.

## Validation du 2026-11-06

Épisode relu et validé par l'utilisateur, qui a demandé le passage à « relu » et l'enregistrement de la relecture. Le sous-agent `relecteur` n'a pas été repassé sur le texte du post réécrit ; `sortie/09/relecture.md` reste le rapport précédent et ses décisions D n'ont pas été arbitrées une à une.
