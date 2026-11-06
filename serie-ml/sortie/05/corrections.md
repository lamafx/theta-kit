# Corrections de l'épisode 05

## Production (contrôles automatiques et rendu)

- Page 4 (formule) : « rôle Formule : une formule dans le panneau, un symbole par ligne ». Avant : une ligne sans symbole « La MSE est le coût le plus courant en régression, pas le seul. » Après : la nuance passe dans le texte : « …l'erreur quadratique moyenne (MSE), le coût le plus courant en régression, pas le seul. »
- Page 5 (comparaison) : « le nombre « 030 » ne vient d'aucun calcul ». Le contrôle lisait « 1 030 » comme deux nombres ; corrigé dans serie/verification.py (A51), texte inchangé.
- Termes d'épisodes suivants (avertissements) : « la valeur réelle » → « le résultat réel » (pages 2 et 7, mots de l'épisode 04) ; « seule la distance compte » → « seul l'écart compte » (page 3).
- Page 7 : « a un creux : la meilleure droite. » → « a un creux : la droite au coût le plus faible. » (mots de la page 6) ; « Pourquoi élève-t-on chaque erreur au carré ? » → « Pourquoi élever chaque erreur au carré ? » (mots de la page 3).
- Page 2 : 40 mots sur 40 ; « c'est regarder toutes ses erreurs à la fois. » → « c'est regarder toutes ses erreurs. »
- Page 3 (rendu) : l'étiquette de la ligne encadrée chevauchait la ligne du dessus ; fenêtre sur la colonne des carrés, étiquette « les carrés ».
- Page 5 (rendu) : l'étiquette « surface » était coupée ; cadre de 300 à 320 px de haut.

## Mises en conformité de la relecture (sortie/05/relecture.md)

- C1 · Page 3 : « en millions de FCFA. » → « en millions de FCFA au cours du 27 octobre 2026. »
- C2 · Page 5 : « toutes les ventes d'Ames. » → « toutes les ventes d'Ames de 2006 à 2010. »
- C3 · Page 5 : « a le coût le plus faible. » → « a le coût le plus faible des deux. »
- C4 · Page 4 : ligne ajoutée : Σ, « la somme sur les exemples, de $i$ = 1 à $n$ ».
- C5 · Page 3 : sources de la page complétées par mlcc-aberrant et d2l-anomalies (texte publié inchangé).
- C6 · Post, intuition : « La fonction de coût fait ce résumé : elle élève chaque erreur au carré, puis en fait la moyenne. » → « La fonction de coût fait ce résumé ; la plus courante en régression élève chaque erreur au carré, puis en fait la moyenne. »

## Demande de l'utilisateur (2026-10-31)

- Page 4, formule : `J = (1/n) Σ [(ŷ_i − y_i)²]` → `J = {1}/{n} Σ [(ŷ_i − y_i)²]` : la fraction s'affiche empilée, Σ droit et agrandi. Formule inchangée sur le fond : la relecture reste valable, elle n'a pas été relancée.

## Décisions de la relecture appliquées (2026-11-01, demande de l'utilisateur : « applique toutes les recommandations »)

- D2 · Page 3 : « Voici les trois maisons… Le carré rend chaque erreur positive : trop haut ou trop bas, seul l'écart compte. » → « Les trois maisons… Ici, les trois prédictions sont trop hautes ; une trop basse donnerait une erreur négative, que le carré rend positive. »
- D3 · Page 6 : « Tracés ensemble, ces coûts forment une courbe en U. » → « Pour une droite et la MSE, ces coûts forment une courbe en U. » ; post : « la meilleure droite » → « la droite au coût le plus faible ».
- D4 · Page 6 : « $a$ = 74 » → « $a$ ≈ 74 ».
- D5 · Page 5 : ajout de « Les points ne sont pas dessinés : seul $J$ tranche. » (la forme manquante reste en A50).
- Gardé comme recommandé : D1 (option A).

## Audit éditorial et scientifique de l'utilisateur (2026-11-01)

- 05.1 · Page 2 : « L'écart vertical entre les deux, $ŷ$ − $y$, est l'erreur (résidu) de la prédiction. » → « L'écart signé $ŷ$ − $y$ est l'erreur (résidu) ; sans signe, c'est la distance verticale au point. » (+ extrait mlcc-distance) ; fin, point 1 : « l'écart vertical $ŷ$ − $y$ entre la droite et le résultat réel » → « l'écart signé $ŷ$ − $y$ entre la prédiction et le résultat réel ». Convention de signe gardée (décision D1).
- 05.4 · Page 5 : « $J$ calculé sur toutes les ventes d'Ames de 2006 à 2010. » → « $J$ calculé cette fois sur les ventes d'Ames de 2006 à 2010, pas sur les trois maisons. » (« toutes » retiré : 2 925 ventes sur 2 930, les maisons de plus de 4 000 pieds carrés étant écartées.)
- 05.5 et 05.6 · Page 6 : « Son creux est la droite au coût le plus faible : sur les ventes d'Ames, $a$ ≈ 74 » → « Son creux est la droite au coût le plus faible, pour $b$ = 4 et ces ventes d'Ames : $a$ ≈ 74 » ; axe : « réglage $a$ » → « réglage $a$ ($b$ = 4) ».
- 05.2 · Calculs vérifiés (calculs.cout) : erreurs 3, 7, 25 et carrés 9, 49, 625 ; 25 / 7 ≈ 3,57 (« trois fois et demie ») ; 625 / 49 ≈ 12,76 (« près de treize fois ») ; J(74) = 1 030, J(40) = 3 433 (rapport 3,33) ; creux en a = 74 pour b = 4. Inchangés.

## Second audit de l'utilisateur (2026-11-01) : vérifications, aucun texte changé

Recalcul indépendant de calculs/, sur AmesHousing.txt brut (2 930 ventes, 2 925 gardées après le filtre de 4 000 pieds carrés), x en centaines de m², y en millions de FCFA (588,30 FCFA par dollar) :
- J(74, 4) = 1 030,2 et J(40, 4) = 3 433,4 (rapport 3,33) : la page dit 1 030 et 3 433.
- b = 4 fixé : creux analytique a* = Σx(y − 4) / Σx² = 73,59, confirmé par balayage de a de 0 à 150 au pas de 0,01 ; J* = 1 029,9 ; J(73) = 1 030,6, J(75) = 1 034,1. « a ≈ 74 » est bien le minimum à b = 4, pas seulement la meilleure des deux droites.
- 25 / 7 = 3,571 ; 625 / 49 = 12,755.
- Formule de la page 4 : rendu lisible (fraction empilée, indices, carré).
- Sans le filtre de 4 000 pieds carrés : J(74, 4) = 1 107,9, J(40, 4) = 3 487,8, creux en a = 73,19. Les valeurs publiées dépendent donc de ce filtre, qui n'est pas dit dans le carrousel.

## Retours éditoriaux de l'utilisateur (2026-11-01, troisième passage)

- Couverture, titre (choix de l'utilisateur) : « Mesurer l'erreur d'une droite. » (titre de l'ouverture) → « Comment une IA sait-elle qu'elle se trompe ? » ; l'ouverture garde « Mesurer l'erreur d'une droite. ».
- Convention de signe · Page 2 : « L'écart signé ŷ − y est l'erreur (résidu) ; sans signe, c'est la distance verticale au point. » → « L'erreur (résidu) est ŷ − y, souvent y − ŷ en statistique ; sans signe, c'est la distance verticale. » (extrait nist-residu, NIST/SEMATECH e-Handbook ajouté à la fiche) ; fin, point 1 aligné : « L'erreur (résidu) : ŷ − y, souvent y − ŷ en statistique ; sans signe, la distance verticale. » Remplace la décision D1 de la relecture.
- Courbe en U · Page 6, titre : « Toutes les droites : une courbe en U. » → « Toutes les inclinaisons : une courbe en U. » (D2 de la relecture) ; texte : « Son creux est la droite au coût le plus faible, pour b = 4 et ces ventes d'Ames : a ≈ 74, celle de l'épisode 04. Entraîner, c'est chercher ce creux. » → « Son creux donne le meilleur réglage a quand b = 4, sur ces ventes d'Ames : a ≈ 74, comme dans l'épisode 04. Entraîner, c'est chercher le creux pour a et b ensemble. » Ici, le creux à b = 4 (a = 73,59) coïncide, à l'arrondi, avec le minimum pour a et b ensemble (a = 73,60, b = 3,98).
- Coûts J = 1 030 et 3 433 : déjà recalculés sur le fichier brut (section précédente) ; inchangés.


## Session de design n° 2 (2026-11-01) : couverture A et lisibilité sur téléphone

Décision de l'utilisateur (A54) : texte en 30 px, aucun texte sous 22 px, limites abaissées à 32 mots (ouverture) et
55 (page de contenu), textes resserrés sans retirer de nuance. Points notables :
- Page 2 : « Juger une droite, c'est regarder toutes ses erreurs. » retiré ; signe et convention gardés.
- Page 3 : « Les trois maisons de l'épisode 02, la droite de l'épisode 04 » → « En millions de FCFA (cours du 27 octobre 2026). Les trois prédictions… » ; calculs inchangés.
- Page 4 : texte resserré ; ligne de légende « J : le coût de la droite » retirée (J défini dans le texte).
- Page 6 : « chaque droite a son coût J » fondu dans la phrase sur la courbe en U.
- Visuels : page 2 cadre 432 px ; page 5 cadre 320 → 300 px.
- D1 et D2 (relecture du 2026-11-01, après resserrage), appliquées car elles rétablissent ce que le resserrage avait retiré : page 3, la droite de l'épisode 04 renommée (texte du relecteur) ; page 6, « sur ces ventes » → « sur ces ventes d'Ames », et espaces insécables dans « b = 4 ».

## Réécriture du texte du post (2026-11-05, A63)

Demande de l'utilisateur : réécrire le post selon `theta-post/`, textes validés le 2026-11-05. Pages du carrousel inchangées.

- Avant : bloc `linkedin` en quatre parties (commit d57f104).
- Après : bloc `linkedin` en `texte` libre ; rapport dans `theta-post/episodes/brouillons/05_la-fonction-de-cout_v1.md`.

## Validation du 2026-11-06

Épisode relu et validé par l'utilisateur, qui a demandé le passage à « relu » et l'enregistrement de la relecture. Le sous-agent `relecteur` n'a pas été repassé sur le texte du post réécrit ; `sortie/05/relecture.md` reste le rapport précédent et ses décisions D n'ont pas été arbitrées une à une.
