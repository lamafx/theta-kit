# Relecture · Nº 04 · Modèle et paramètres

Relecture du 2026-11-01, après la session de design n° 2 (texte en 30 px, limites à 32 mots pour l'ouverture et 55 par
page). D'après `corrections.md` et le comptage de `serie verifier`, seul le texte de la page 2 a été resserré (pages 3 et 4 :
47 et 50 mots, comme avant) ; la couverture est nouvelle. Les décisions déjà tranchées ne sont pas rouvertes.

Sources relues aujourd'hui sur le web (WebFetch) : Google, Machine Learning Crash Course, « Linear regression »,
https://developers.google.com/machine-learning/crash-course/linear-regression (« Last updated 2025-12-09 UTC ») ;
les extraits `mlcc-relation`, `mlcc-ligne`, `mlcc-droite` (« m is the slope of the line. »), `mlcc-ordonnee`
(« b is the y-intercept. »), `mlcc-minimiser`, `mlcc-entrainement`, `mlcc-parametre` et `mlcc-equation` y sont présents
mot pour mot. Les sources d'Ames, de Data 100 et de la BCEAO ont été relues ce matin (relecture précédente) ; aucune
affirmation qui en dépend n'a changé.

## Priorité : nuances de la page 2 après resserrement

Comparaison faite sans `git show` (l'outil de relecture n'a pas de terminal) : le texte de e57677b est reconstitué à partir
de `corrections.md` (2026-10-31, D10, audit 04.2) et de la relecture précédente, qui le comptait à 40 mots :

- Avant : « Une régression prédit un nombre. Linéaire, sa prédiction suit une droite : le prix $ŷ$ selon la seule surface $x$, $ŷ$ = $a$·$x$ + $b$. $a$ et $b$ sont deux réglages : à ajuster aux données, comme deux boutons. »
- Après : « La régression linéaire prédit le prix $ŷ$ selon la seule surface $x$ : la droite $ŷ$ = $a$·$x$ + $b$. $a$ et $b$ s'ajustent aux données, comme des boutons. » (31 mots)

| Nuance | Avant | Après | Verdict |
| --- | --- | --- | --- |
| Une seule entrée (D10) | « selon la seule surface $x$ » | inchangé | Gardée |
| Les réglages viennent des données (audit 04.2, `mlcc-minimiser`) | « à ajuster aux données » | « s'ajustent aux données » | Gardée ; le pronominal a ici un sens passif, et la page 4 dit qui les ajuste (« le modèle les ajuste aux exemples ») |
| Linéaire = la prédiction est sur une droite (`mlcc-ligne`) | « Linéaire, sa prédiction suit une droite » | « : la droite $ŷ$ = $a$·$x$ + $b$ » | Gardée, moins explicite : le lien est fait par les deux-points et par le schéma (ŷ = 115 lu sur la droite) |
| Une régression prédit un nombre (`mlcc-glossaire-regression`) | phrase d'ouverture | retirée de la page | Pas de perte : le rappel de la même page dit « prédire le prix d'une maison est une régression » (Nº 03) et le texte dit « prédit le prix » |
| Deux réglages | « $a$ et $b$ sont deux réglages » | dans le titre « Deux réglages : a et b. » | Gardée |
| Inclinaison, ordonnée à l'origine | sur le schéma | sur le schéma, inchangé | Gardée |

Conclusion : aucune nuance scientifique perdue ; la seule régression, d'ordre visuel, vient de la taille des étiquettes
(D3 ci-dessous).

## Mises en conformité (appliquées automatiquement)

Aucune. Pas de tiret long, pas de citation entre guillemets dans les pages ni dans le post, pas de formule absolue,
cas particulier dit (« La régression linéaire », « ici en deux nombres »), chiffres datés (ventes de 2006 à 2010, cours
BCEAO du 27 octobre 2026 dans le post), pas d'image réelle.

## Décisions de l'utilisateur

**D1 (reprise sans changement, toujours sans réponse) · Post, `linkedin.promesse` : la question annoncée n'est plus celle que le carrousel laisse ouverte.**
- Constat : pages 4 et 5 répondent déjà à « selon quoi ? » (l'écart aux résultats réels) ; reste ouvert : comment le mesurer (fiche, transition vers le Nº 05).
- Source vérifiée : Google MLCC, « Linear regression », https://developers.google.com/machine-learning/crash-course/linear-regression : « to minimize the difference between predicted and actual values » ; fiche 04, `episode_suivant.transition` : « Pour régler, il faut d'abord mesurer l'erreur. »
- Correction proposée : avant « … et laisse une question pour la suite : meilleurs réglages, mais selon quoi ? » ; après « … et laisse une question pour la suite : comment mesurer l'écart aux prix réels ? »
- Option recommandée : celle-ci (rejoint le Nº 05). Autre option : « … l'écart aux résultats réels ? », mots de la page 5.
- Décision : oui / non / autre

**D2 (reprise sans changement, toujours sans réponse) · Page 4, `lignes[2].sens` : « à réduire » pour « minimize ».**
- Constat : « meilleurs » veut dire l'écart le plus petit ; les sources disent « minimize ».
- Source vérifiée : Google MLCC, même page : « to minimize the difference between predicted and actual values ».
- Correction proposée : avant « …résultats réels, à réduire ; il faut d'abord le mesurer. » ; après « …résultats réels, à minimiser ; il faut d'abord le mesurer. » (même nombre de mots, page 4 à 50).
- Option recommandée : celle-ci, fidèle à la source. Autre option : garder « à réduire ».
- Décision : oui / non / autre

**D3 (nouveau) · Page 2, `visuel` : l'étiquette « $b$ = 4 : l'ordonnée à l'origine » chevauche « $x$ = 1,5, soit 150 m² » sous l'axe.**
- Constat : avec les étiquettes en 22 px, « l'origine » (fin vers 415 px dans le schéma) recouvre le « x » de l'entrée (début vers 392 px) ; `serie verifier` ne le détecte pas (pas de débordement du cadre).
- Source vérifiée : rendu `sortie/04/page-02.png` ; positions dans `bibliotheque/courbe.py` (`_droite` : étiquette de b à xb + 18, entrée centrée sur x, même ligne sous l'axe) et `bibliotheque/_plan.py` (titre de l'axe x calé à droite de l'axe).
- Correction proposée (paramètres seuls, aucune affirmation ajoutée) :
  - Avant : `origine: [110, 380]`, `echelle: [252, 1.2]`, `textes.entree: $x$ = 1,5, soit 150 m²`
  - Après : `origine: [100, 380]`, `echelle: [270, 1.2]`, `textes.entree: $x$ = 1,5 (150 m²)`
  - Estimation : entrée centrée à 505 px, de 429 à 581 environ ; écart d'environ 24 px avec l'étiquette de b et 59 px avec « surface (centaines de m²) » (640 à 906) ; « ŷ = 115 » reste dans le cadre (16 à 86). À contrôler sur le rendu.
- Option recommandée : celle-ci ; le contenu de D5 (« 150 m² ») est gardé, seule la tournure change. Autre option : sans toucher au texte, `origine` et `echelle` seuls (écart d'environ 5 px, trop juste) ; ou, en session de design, placer l'étiquette de b au-dessus du point (à noter dans AMBIGUITES.md).
- Décision : oui / non / autre

## Contrôles automatiques (serie verifier)

Résultat : aucune erreur bloquante, 2 avertissement(s).

Avertissements :

- page 2 (ouverture) : 31 mots, proche de la limite de 32
- page 4 (formule) : 50 mots, proche de la limite de 55

| Page | Mots | Vide au-dessus du pied (px) |
| --- | ---: | ---: |
| 1 | 0 | 54 |
| 2 | 31 | 192 |
| 3 | 47 | 28 |
| 4 | 50 | 67 |
| 5 | 0 | 6 |

Seuil de remplissage : 233 px.

## Affirmations et sources

| Page | Affirmation | Extrait | Vérifiée sur |
| --- | --- | --- | --- |
| 2 | La régression linéaire prédit le prix selon la seule surface : la droite ŷ = a·x + b | mlcc-relation, mlcc-ligne, ames-surface, ames-prix | MLCC (« linear regression finds the relationship between features and a label », « drawing a best fit line through the points ») ; DataDocumentation.txt (relu ce matin) |
| 2 | a et b s'ajustent aux données | mlcc-minimiser | MLCC (« the model adjusts its bias (b) and weights (w) ») |
| 2 | a l'inclinaison, b l'ordonnée à l'origine (schéma) | mlcc-droite, mlcc-ordonnee | MLCC (« m is the slope of the line. », « b is the y-intercept. ») |
| 2 | a = 74, b = 4, x = 1,5 soit 150 m², ŷ = 115 | calculs/ames.py, ames-4000, bceao-dollar | Inchangé depuis la relecture du matin (recoupement 73,6 / 3,99 ; 74 × 1,5 + 4 = 115) |
| 3 | À b fixe, a fait pivoter autour du point sur l'axe vertical ; b décale sans tourner | mlcc-droite, mlcc-ordonnee | Conséquence de y = a·x + b ; schéma conforme |
| 3 | Ventes d'Ames de 2006 à 2010 : a = 74, b = 4 ; 74 millions de FCFA par centaine de m² | ames-ventes, ames-fichier, bceao-dollar | Inchangé (relu ce matin) |
| 4 | Deux nombres, forme choisie d'avance ; le modèle les ajuste ; paramètres notés θ | mlcc-equation, mlcc-minimiser, mlcc-parametre, ds100-theta | MLCC (« In ML, we write the equation… », « Bias is a parameter of the model and is calculated during training. ») ; Data 100 (relu ce matin) |
| 4 | Panneau et lignes : meilleur modèle, écart à réduire | mlcc-entrainement, mlcc-minimiser | MLCC (« the weight and bias that produce the best model ») ; voir D2 |
| 5 | Reprise des pages 2 à 4 ; Nº 05 « La fonction de coût » | fiche 04 | Conforme à la fiche |
| post | Prix de base + montant par m², calculés à partir des ventes ; prix de base à 0 m² | mlcc-entrainement, mlcc-ordonnee | MLCC |
| post | Question annoncée « selon quoi ? » | sans objet | Voir D1 |

Fiche : pas de rubrique « à ne pas écrire » ; épisode suivant (Nº 05, « Pour régler, il faut d'abord mesurer l'erreur. »)
conforme. Images : aucune image réelle.

À l'œil (planche, pages 1 et 2) : page 2, chevauchement sous l'axe (D3). Couverture : le robot tient un bouton, l'éventail de
droites pivote autour d'un point un peu au-dessus de ce bouton ; le lien se lit, rien n'est rogné. Pages 3 à 5 : rien à
signaler.

## Validation scientifique

- **Page 2.** Hypothèse : le prix suit à peu près une droite de la surface. Domaine : une seule entrée (« la seule surface »), ventes d'Ames 2006 à 2010, maisons de 4 000 pieds carrés au plus. Contre-exemple : à 0 m², 4 millions de FCFA, prix d'aucune maison (dit dans le post). Raccourci : réglages arrondis (dit dans la description) ; « linéaire » expliqué par la droite plutôt que par une phrase.
- **Page 3.** Hypothèse : axe vertical en x = 0 ; « à b fixe » pose la condition du pivot. Domaine : toute droite. Contre-exemple : aucun. Raccourci : schéma à échelle libre, valeurs réelles dans l'encadré.
- **Page 4.** Hypothèse : forme choisie avant l'entraînement. Domaine : modèle à paramètres. Contre-exemple : meilleurs sur les exemples ne veut pas dire meilleurs sur de nouvelles maisons (épisode 01). Raccourci : « ajuste » sans dire comment ; « à réduire » (D2).
- **Page 5.** Ceux des pages 2 à 4 ; « Changer a fait pivoter » sans « à b fixe », condition dite page 3.
- **Post.** Ceux de la page 2 ; question annoncée à mettre à jour (D1).
