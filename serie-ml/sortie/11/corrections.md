# Corrections · épisode 11

## Production du 2026-11-06 (nuit, sans relecteur)

- Page 5 : la fiche écrit ∂J/∂w et ∂J/∂b. Le glyphe ∂ manque aux polices embarquées (A57, refus bloquant) : écrit ∇_w J et ∇_b J, avec « la pente de J selon w ». Sens inchangé ; à reprendre si A57 est traité.
- Page 3 : la boucle Flux `retour` laissait la page trop vide (refus bloquant) : schéma en trois lignes (au départ, à chaque itération, à la fin).
- Renvois « épisode NN » retirés des pages 3, 5 et 6 : le contrôle des nombres les refuse hors extrait.
- Sources non relues cette nuit : extraits du 2026-11-02. Relecture par le `relecteur` à faire.

## Relecture du 2026-11-14 (mises en conformité du relecteur)

- C1 · Post, 3e paragraphe : chiffre daté.
  - Avant : « Sur les 2 925 ventes d'Ames, elle retrouve après 1 000 itérations la droite que la formule donne d'un coup. »
  - Après : « Sur les 2 925 ventes de maisons d'Ames, dans l'Iowa, de 2006 à 2010, elle retrouve après 1 000 itérations la droite que la formule donne d'un coup. »
- C2 · Post, 3e paragraphe : cours de conversion dit.
  - Avant : « … la droite que la formule donne d'un coup. »
  - Après : « … la droite que la formule donne d'un coup. Les prix du carrousel sont convertis en FCFA au cours BCEAO du 27 octobre 2026. »

## Compréhension, passage 1 (2026-11-14) : carrousel 7,75, post 7,12, sous 8,5

Propositions du lecteur débutant appliquées (compréhension), ajustées aux contrôles (mots, débordement) :

- Page 2, rappel. Avant : « Nº 04 : une droite et ses réglages ; Nº 05 : la MSE ; Nº 08 : la descente. » Après : « Nº 04 : la droite et ses réglages ($a$ devient ici $w$) ; Nº 05 : la MSE, moyenne des erreurs au carré ; Nº 08 : la descente. »
- Page 2, texte. Avant : « Avec la seule surface, la **régression linéaire** prédit $ŷ$ = $w$·$x$ + $b$. Le poids $w$ règle son influence, le biais $b$ la prédiction à surface nulle. L'**ajustement** les choisit. » Après : « La **régression linéaire** prédit le prix depuis la surface : $ŷ$ = $w$·$x$ + $b$. Le poids $w$ règle la pente ; le biais $b$ donne le prix à surface nulle. » (proposition raccourcie : 32 mots au plus ; « ajustement » passe page 3)
- Page 2, axes. Avant : « surface (centaines de m²) », « prix (millions de FCFA) ». Après : « surface de la maison (centaines de m²) », « prix de vente (millions de FCFA) ».
- Page 3, texte. Avant : « L'entraînement part de $w$ et $b$ tirés au hasard, près de zéro. Puis… » Après : « L'**ajustement** choisit $w$ et $b$. Il part de deux nombres tirés au hasard, près de zéro. Puis… » (« nombres » plutôt que « valeurs », terme du glossaire)
- Page 3, encadré. Avant : « Chaque itération corrige… » Après : « Chaque tour de boucle, appelé **itération**, corrige… »
- Page 4, texte. Avant : « Mêmes ventes, même $!η$ = 0,2. Pour lire le progrès, le départ est fixé à $w$ = 0 et $b$ = 0. La droite grise est le creux de la MSE. » Après : « On reprend les mêmes ventes, avec $!η$ = 0,2. Pour mieux voir le progrès, on part de $w$ = 0 et $b$ = 0, et non au hasard. La droite grise est celle du creux de la MSE : pour une droite, une formule directe la donne d'un coup. » (source `d2l-analytique` ajoutée à la page, venue de la page 5)
- Page 5, texte. Avant : « La MSE dépend de $w$ et de $b$ ; sa dérivée selon chacun donne sa part du gradient. Pour une droite, une formule directe donne aussi le creux. La plupart des modèles suivants n'en ont pas. » Après : « La MSE dépend de $w$ et de $b$. Sa pente selon $b$ se calcule de même, sans multiplier par $x_i$. La plupart des modèles suivants n'ont pas de formule directe du creux. » (la proposition « Cette boucle sert aussi aux modèles suivants » n'est pas reprise : elle généralisait le fond, voir D1 ; la ligne ∇_b J passe dans le texte faute de place)
- Page 5, légendes. Ajout : « Σ : la somme sur les $n$ ventes ; 2/$n$ en fait deux fois la moyenne ». Retrait de la ligne ∇_b J (reprise dans le texte, elle n'est pas dans la formule affichée).
- Page 7, point 1. Avant : « … prédit $ŷ$ = $w$·$x$ + $b$ : le poids $w$, le biais $b$. » Après : « … prédit $ŷ$ = $w$·$x$ + $b$, avec deux réglages : le poids $w$ et le biais $b$. »
- Post, ligne 1. Avant : « La régression linéaire a une formule exacte. » Après : « La régression linéaire, qui trace la droite la plus proche d'un nuage de points, a une formule exacte. »
- Post, paragraphe 2. Avant : « … sans la moindre itération. » Après : « … sans répéter le moindre calcul. »
- Post, paragraphe 3. Avant : « Le détour par la descente de gradient paraît donc inutile. … après 1 000 itérations … Les prix du carrousel sont convertis en FCFA au cours BCEAO du 27 octobre 2026. » Après : « Le détour par la descente de gradient, qui corrige les réglages un peu à chaque tour, paraît donc inutile. … après 1 000 tours … » ; la phrase des prix devient le dernier paragraphe : « Dans le carrousel, les prix sont convertis en FCFA au cours de la banque centrale (BCEAO) du 27 octobre 2026. »
- Post, paragraphe 4. Avant : « … la boucle : mesurer le coût, lire le gradient, faire un pas. » Après : « … la boucle : mesurer l'erreur du modèle (le coût), lire dans quel sens la réduire (le gradient), puis corriger les réglages (faire un pas). » (« Il ne leur reste que » gardé : D1 attend l'utilisateur)
