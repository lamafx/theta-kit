# Corrections de l'épisode 08

## Production (contrôles automatiques et rendu)

- Fiche 08 (sources) : la page Piège reprend le coût des maisons d'Ames (fil rouge de la saison 1, à reprendre en 08 selon la décision de l'utilisateur du 2026-10-30). Ajout à la fiche, comme à la fiche 05, du cours BCEAO du 27 octobre 2026 (cours) et de De Cock (2011) avec le fichier AmesHousing.txt (source originale) ; provenance.yaml : 157 → 159 références (cours 110 → 111, sources originales 47 → 48) ; `serie valider` conforme.
- Page 3 (rendu) : l'encadré « η ne change pas » s'affichait « H NE CHANGE PAS » (titre d'encadré en capitales : η devient Η). Avant : « η ne change pas ». Après : « Le taux reste fixe ».
- Page 4 (rendu) : même défaut, « LE BON H ». Avant : « Le bon η ». Après : « En pratique ».
- Page 3 (rendu) : l'étiquette « pente −1,6 » chevauchait la courbe. Décalage [-150, -30] → [-140, 22] (sous la courbe, hors de la tangente).
- Page 5 (vérification complète) : « « ← » dessiné en partie par une police du système (Times New Roman) » et « « () » dessiné en partie par une police du système ». La flèche ← (U+2190) n'est dans aucune police embarquée (STIX Two Math n'est embarquée que pour ∇ et U+202F). Avant : formule « θ ← θ [−η]∇J(θ) », lignes θ, ∇J(θ), η, −, « ← : le nouveau $θ$ remplace l'ancien ». Après : formule « θ_{t+1} = θ_t [−η]∇J(θ_t) » (notation du canevas validé de l'épisode 08 ; D2L 12.3 et Ruder écrivent la même règle avec ← ou =), lignes θ_t (« les paramètres du modèle à l'itération $t$ ; ici, un seul »), ∇J(θ_t), η, −, θ_{t+1} (« les paramètres après ce pas »). Aucune nuance retirée ; besoin noté dans AMBIGUITES.md (A58).

## Mises en conformité de la relecture (sortie/08/relecture.md)

- C1 · Texte du post, `promesse`. Avant : « … trois pas calculés à la main, puis, sur les maisons d'Ames, pourquoi la descente peut s'arrêter avec un coût qui n'est pas nul. » Après : « … trois pas calculés à la main, puis, sur les maisons d'Ames (prix en FCFA au cours BCEAO du 27 octobre 2026), pourquoi la descente peut s'arrêter avec un coût qui n'est pas nul. »
- C2 · Page 7, `texte`. Avant : « Pourtant $J$ vaut encore 1 030 : aucune droite ne passe par toutes les ventes. » Après : « Pourtant $J$ vaut encore 1 030 millions de FCFA au carré : aucune droite ne passe par toutes les ventes. » (55 mots, à la limite.)

## Réécriture du texte du post (2026-11-05, A63)

Demande de l'utilisateur : réécrire le post selon `theta-post/`, textes validés le 2026-11-05. Pages du carrousel inchangées.

- Avant : bloc `linkedin` en quatre parties (commit d57f104).
- Après : bloc `linkedin` en `texte` libre ; rapport dans `theta-post/episodes/brouillons/08_la-descente-de-gradient_v1.md`.

## Validation du 2026-11-06

Épisode relu et validé par l'utilisateur, qui a demandé le passage à « relu » et l'enregistrement de la relecture. Le sous-agent `relecteur` n'a pas été repassé sur le texte du post réécrit ; `sortie/08/relecture.md` reste le rapport précédent et ses décisions D n'ont pas été arbitrées une à une.
