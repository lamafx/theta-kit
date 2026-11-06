# Épisode 04 · corrections automatiques

| Page | Ce qui a échoué | Avant | Après |
| --- | --- | --- | --- |
| 3 (comparaison) | Contrôle : paramètres d'un cas vérifiés contre la forme du visuel (pivot) et non la sienne (decalage) | erreur « paramètres non admis ['fleches'] » | contrôle corrigé (serie/verification.py) : chaque cas avec sa forme |
| 2 (ouverture) | « poids », terme de l'épisode 11 | « poids de la voiture (milliers de livres) » | « masse (milliers de livres) » |
| 4 (définition) | « valeurs », terme de l'épisode 57 | « les valeurs de ses paramètres » ; « valeurs réelles » | « les réglages de ses paramètres » ; « résultats réels » |
| 2 (ouverture) | Prérequis non cité : Nº 01 | « (Nº 02 et 03) » | « (Nº 01, 02 et 03) » |
| 3 (comparaison) | Débordement : « x » rogné par son cadre | cadre 440 × 300 | cadre 440 × 310 |
| 2 (ouverture) | À l'œil : légendes de l'axe et des points qui se chevauchent | domaine [0, 5], plage [0, 36] | domaine [0, 6], plage [0, 42], échelle [126, 8] |

## Mise en conformité de la relecture vérifiée sur le web (2026-10-29)

| Nº | Où | Avant | Après |
| --- | --- | --- | --- |
| C1 | page 2, texte | « Un modèle simple prédit ŷ… » | « La régression linéaire, un modèle simple, prédit ŷ… » (cas particulier dit explicitement) |

## Correction demandée par l'utilisateur (2026-10-30)

Demande : retirer sur toute la série les légendes de commentaire sous les schémas (les légendes et crédits des images réelles restent). Suppression seule, aucune affirmation ajoutée : relecture enregistrée sans nouveau passage du relecteur. La source reste citée en premier commentaire.

| Page | Avant | Après |
| --- | --- | --- |
| 2 (ouverture) | légende « Exemple du cours Machine Learning de Google. » | pas de légende (vide au-dessus du pied : 222 px, seuil 287) |

## Réécriture demandée par l'utilisateur (2026-10-30) : fil de la saison

Demande : appliquer toutes les pistes de la critique du 2026-10-30 (exemple suivi, mêmes mots d'un épisode à l'autre, une seule nuance par épisode, question de la page précédente rendue visible, vrais pièges, analogies dans le carrousel, posts sans « Dans le carrousel : », hashtags en français), sans aucune mention de projet personnel.

| Page | Avant | Après |
| --- | --- | --- |
| exemple | voitures (MLCC) : miles par gallon selon la masse, a = −4,6, b = 34 | maisons d'Ames : prix (millions de FCFA) selon la surface (centaines de m²), droite des moindres carrés sur 2 925 ventes de 2006 à 2010, a = 74, b = 4 (calculs/ames.py) ; x = 1,5 → ŷ = 115 (calcul `prediction`) |
| 2 | rappel général | « Nº 01, 02 et 03 : le modèle apprend d'exemples, et prédire le prix d'une maison est une régression. » ; étiquette de la droite déplacée (chevauchement corrigé) |
| 3 | texte abstrait ; axes x, ŷ ; encadré voitures | les deux boutons (venus du post) ; axes surface, prix ; encadré maisons d'Ames |
| 4 | — | « Les règles que le modèle tire des exemples (épisode 01), ici, ce sont deux nombres : a et b. » |
| post | voiture ; « Dans le carrousel : … » ; #LinearRegression | prix de base plus un montant par m² ; promesse sans sommaire ; #RegressionLineaire |

| Nº | Page | Avant | Après |
| --- | --- | --- | --- |
| C1 (relecture 2026-10-30) | post, promesse | « prédit le prix selon la surface, en FCFA. » | « prédit le prix selon la surface, en FCFA au cours BCEAO du 27 octobre 2026. » |

## Demande de l'utilisateur (2026-10-31) : « on parle de régression linéaire alors qu'on ne sait pas ce que c'est ; donner un élément pour comprendre le réglage »

- Page 2, texte : « La régression linéaire prédit $ŷ$, le prix, à partir d'une entrée $x$, la surface : $ŷ$ = $a$·$x$ + $b$. Le réglage $a$ fixe l'inclinaison de la droite, $b$ son ordonnée à l'origine. » → « Une régression prédit un nombre. Linéaire, sa prédiction suit une droite : le prix $ŷ$ selon la surface $x$, $ŷ$ = $a$·$x$ + $b$. $a$ et $b$ sont deux réglages : des nombres à ajuster, comme deux boutons. » (l'inclinaison et l'ordonnée à l'origine restent écrites sur le schéma).
- Page 3, texte : « Pensez à deux boutons. » → « Que fait chaque bouton ? »

## Mises en conformité de la relecture du 2026-10-31

- C1 · Extraits : ajout de `mlcc-ligne` ; page 2, sources : `[mlcc-relation, mlcc-droite, mlcc-ordonnee, ames-surface, ames-prix, bceao-dollar]` → `[mlcc-relation, mlcc-ligne, mlcc-droite, mlcc-ordonnee, mlcc-minimiser, ames-surface, ames-prix, bceao-dollar]` ; texte publié inchangé.

## Décisions de la relecture appliquées (2026-11-01, demande de l'utilisateur : « applique toutes les recommandations »)

- D10 · Page 2 : « selon la surface $x$ » → « selon la seule surface $x$ ».
- D11 · Page 2, sources : + mlcc-glossaire-regression (glossaire MLCC ajouté à la fiche).
- D5 · Page 2, visuel : « $x$ = 1,5 » → « $x$ = 1,5, soit 150 m² » (calcul prediction_surface, calculs/ames.py).
- D4 · Page 2, description : « Pour 150 m² » → « Avec ces réglages arrondis, pour 150 m² » ; valeurs exactes vérifiées : a ≈ 73,6, b ≈ 3,98, ŷ(1,5) ≈ 114,4.
- D1 (option 2) · Page 3, cas 1 : a 0,25, b 2, fantôme 0,7 → a 0,15, b 4, fantôme 0,4 : même droite de départ (a = 0,4, b = 4) des deux côtés.
- D7 · Page 4 : « Les règles que le modèle tire des exemples (épisode 01), ici, ce sont deux nombres : $a$ et $b$. » → « Les règles que le modèle tire des exemples (épisode 01) tiennent ici en deux nombres, $a$ et $b$ ; la forme, une droite, est choisie d'avance. » (extrait mlcc-equation).
- D2 · Page 4, sources : + ds100-theta (Data 100 ajouté à la fiche).
- D8 · Page 4, panneau : « trouver les réglages de ses paramètres » → « trouver les paramètres ».
- D3 · Post, intuition : ajout de « Ici, le prix de base est celui d'une maison de 0 m² : un point de départ du calcul, pas une vente réelle. »
- Gardé comme recommandé : D9 (non).

## Audit éditorial et scientifique de l'utilisateur (2026-11-01)

- 04.2 · Page 2 : « des nombres à ajuster, comme deux boutons » → « à ajuster aux données, comme deux boutons » ; page 3, encadré : « Sur les ventes d'Ames » → « Sur les seules ventes d'Ames ».
- 04.1 · Page 3 : « Le premier, $a$, fait tourner la droite » → « Le premier, $a$, à $b$ fixe, fait tourner la droite ».
- 04.3 · Page 4 : « Pendant l'entraînement, le modèle les calcule lui-même. » → « Pendant l'entraînement, le modèle les ajuste aux exemples. » (mlcc-minimiser : « the model adjusts its bias (b) and weights (w) »).
- 04.4 · Page 4, ligne 3 : « Meilleurs selon quoi ? Selon l'écart entre prédictions et résultats réels : il faut d'abord le mesurer. » → « Meilleurs selon un critère : l'écart entre prédictions et résultats réels, à réduire ; il faut d'abord le mesurer. » ; fin, point 3 : « Entraîner, c'est chercher les meilleurs réglages. » → « …les meilleurs réglages, selon l'écart aux résultats réels. »
- Calculs vérifiés : droite_prix_surface() → a = 74, b = 4 sur 2 925 ventes (maisons de plus de 4 000 pieds carrés écartées) ; 74 × 1,5 + 4 = 115.
- C1 (relecture du 2026-11-01, après l'audit) · Page 3, sources : + ames-ventes, ames-4000, ames-surface, ames-prix, ames-fichier, bceao-dollar (encadré a = 74, b = 4) ; texte publié inchangé.

## Second audit de l'utilisateur (2026-11-01)

- Page 3, encadré : « Sur les seules ventes d'Ames » → « Sur les ventes d'Ames » (retire la coupure de ligne entre « b = » et « 4 », D2 de la relecture ; le contexte reste dit).
- 04.2 · Contrôle graphique : à gauche, la droite pivote autour de son point sur l'axe vertical (cercle) ; les deux panneaux partagent axes et échelle. Conforme.
- 04.3 · Unités : x en centaines de m², ŷ et b en millions de FCFA, a en millions de FCFA par centaine de m² (encadré : « chaque centaine de m² ajoute 74 millions de FCFA »). Conforme.
- Recalcul indépendant sur AmesHousing.txt brut : moindres carrés a = 73,60, b = 3,98 sur 2 925 ventes (maisons de plus de 4 000 pieds carrés écartées, recommandation de De Cock) ; sans ce filtre, a = 70,73, b = 7,82.


## Session de design n° 2 (2026-11-01) : couverture A et lisibilité sur téléphone

Décision de l'utilisateur (A54) : texte en 30 px, aucun texte sous 22 px, limites abaissées à 32 mots (ouverture) et
55 (page de contenu), textes resserrés sans retirer de nuance. Points notables :
- Page 2 : « Une régression prédit un nombre. Linéaire, sa prédiction suit une droite… » → « La régression linéaire prédit le prix ŷ selon la seule surface x : la droite ŷ = a·x + b. a et b s'ajustent aux données, comme des boutons. »
- Couverture : pivot de l'éventail près du bouton tenu par le robot.
- D3 (relecture du 2026-11-01, après resserrage), appliquée car elle répare un chevauchement créé par les étiquettes en 22 px : page 2, origine [110, 380] → [100, 380], échelle [252, 1.2] → [270, 1.2], « $x$ = 1,5, soit 150 m² » → « $x$ = 1,5 (150 m²) ».

## Réécriture du texte du post (2026-11-05, A63)

Demande de l'utilisateur : réécrire le post selon `theta-post/`, textes validés le 2026-11-05. Pages du carrousel inchangées.

- Avant : bloc `linkedin` en quatre parties (commit d57f104).
- Après : bloc `linkedin` en `texte` libre ; rapport dans `theta-post/episodes/brouillons/04_modele-et-parametres_v1.md`.

## Validation du 2026-11-06

Épisode relu et validé par l'utilisateur, qui a demandé le passage à « relu » et l'enregistrement de la relecture. Le sous-agent `relecteur` n'a pas été repassé sur le texte du post réécrit ; `sortie/04/relecture.md` reste le rapport précédent et ses décisions D n'ont pas été arbitrées une à une.
