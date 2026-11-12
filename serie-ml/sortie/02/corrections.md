# Épisode 02 · corrections automatiques

| Page | Ce qui a échoué | Avant | Après |
| --- | --- | --- | --- |
| 4 (piège) | « transformer » : terme « Transformer » de l'épisode 58 | « choisir comment transformer » | « choisir comment convertir » |
| 4 (piège) | Le nombre « 16 » ne vient d'aucun extrait lisible par le contrôle (« 0..16 ») | « chaque case compte les pixels allumés, de 0 à 16 » | « chaque case compte les pixels allumés d'un bloc de 4 × 4 » (la grille affiche les valeurs) |
| 3 (mécanisme) | Avertissement : « valeurs », terme de l'épisode 57 | « une maison et toutes ses valeurs » | « une maison et tout ce qu'on en sait » |
| 5 (fin) | Avertissement : « tableau » absent des pages | « Dans le tableau des maisons, quelle colonne est l'étiquette ? » | « Pour les maisons, quelle colonne est l'étiquette ? » |
| 2 (ouverture) | Page trop vide : 321 px (seuil 287) | 2 lignes grises au-dessus et au-dessous | 3 lignes grises (`fantomes: 3`, cadre 920 × 460) |
| 1 (couverture) | À l'œil : la fenêtre passait sous l'en-tête | rangées 0 à 6 | rangées 2 à 8 |

## Mises en conformité de la relecture (2026-10-26)

| Nº | Page | Avant | Après |
| --- | --- | --- | --- |
| C1 | 3 (mécanisme) | « Chaque colonne est une caractéristique : … La dernière colonne, l'étiquette, » | « Ici, chaque colonne sauf la dernière est une caractéristique : … La dernière, l'étiquette, » |
| C1 | post, intuition | « chaque colonne une de ses caractéristiques, et la dernière donne son prix. » | « les premières colonnes ses caractéristiques, et la dernière colonne donne son prix. » |
| C2 | 5 (fin) | « Un exemple, c'est une ligne : ses caractéristiques, puis son étiquette. » | « …, puis, en apprentissage supervisé, son étiquette. » |
| C3 | post, question | « …d'abord transformer en nombres ? » | « …d'abord convertir en nombres ? » |

## Correction demandée par l'utilisateur (2026-10-30)

Demande : « pour les prix tout doit être dans les unités ivoiriennes, passe de dollar à FCFA ». Cours : BCEAO, 27 octobre 2026, 1 USD = 588,3000 FCFA (extrait `bceao-dollar`), calcul `calculs/devises.py`, arrondi au million.

| Page | Avant | Après |
| --- | --- | --- |
| 2 (ouverture), visuel | colonne « prix ($) » ; 345 000 | colonne « prix (FCFA) » ; 203 000 000 |
| 2 (ouverture), description | « prix 345 000 dollars » | « prix 203 millions de FCFA » |
| 2 (ouverture), légende | « Exemple tiré du glossaire Machine Learning de Google. » | « Exemple tiré du glossaire Machine Learning de Google ; prix convertis en FCFA au cours BCEAO du 27 octobre 2026, arrondis au million. » |
| 3 (mécanisme), visuel | colonne « prix ($) » ; 345 000 · 179 000 · 392 000 | colonne « prix (FCFA) » ; 203 000 000 · 105 000 000 · 231 000 000 |
| 2 et 3, sources | — | + `bceao-dollar` |

## Légendes retirées (demande de l'utilisateur, 2026-10-30)

Demande : retirer sur toute la série les légendes de commentaire sous les schémas, sans laisser la page vide. La conversion en FCFA passe dans le post ; elle s'appuie sur l'extrait `bceao-dollar` déjà vérifié par le relecteur : relecture enregistrée sans nouveau passage.

| Page | Avant | Après |
| --- | --- | --- |
| 2 (ouverture), légende | « Exemple tiré du glossaire Machine Learning de Google ; prix convertis en FCFA au cours BCEAO du 27 octobre 2026, arrondis au million. » | pas de légende |
| 2 (ouverture), visuel | `fantomes: 3`, cadre 920 × 460 | `fantomes: 4`, cadre 920 × 570 (sans légende : 299 px de vide, seuil 287 ; après : 249 px) |
| post, promesse | « …tiré du glossaire Machine Learning de Google, et comment… » | « …tiré du glossaire Machine Learning de Google (prix convertis en FCFA au cours BCEAO du 27 octobre 2026), et comment… » |

## Réécriture demandée par l'utilisateur (2026-10-30) : fil de la saison

Demande : appliquer toutes les pistes de la critique du 2026-10-30 (exemple suivi, mêmes mots d'un épisode à l'autre, une seule nuance par épisode, question de la page précédente rendue visible, vrais pièges, analogies dans le carrousel, posts sans « Dans le carrousel : », hashtags en français), sans aucune mention de projet personnel.

| Page | Avant | Après |
| --- | --- | --- |
| exemple | trois maisons du glossaire MLCC (chambres, salles de bain, âge, prix) | trois ventes réelles à Ames en 2010 (De Cock, 2011 ; calculs/ames.py, ordres 2, 267, 171) : surface (m²), chambres, quartier, prix (FCFA) ; la fiche (« surface, chambres, quartier, prix ») est désormais suivie : D2 n'a plus d'objet |
| 2 | « une ligne de nombres : ses caractéristiques, puis son prix » | rappel du Nº 01 ; « une ligne de tableau : sa surface, ses chambres, son quartier, puis son prix » |
| 3 | « Ici, chaque colonne sauf la dernière… » | « ici, trois maisons vendues à Ames, aux États-Unis, en 2010, prix convertis en FCFA » ; encadré « la même information » |
| 4 (piège) | « Le texte et les images deviennent des nombres. » (chiffres manuscrits UCI) | « Un quartier n'est pas une quantité. » (MLCC, données catégorielles) ; encadré : une colonne par quartier, 1 ou 0 ; jeu UCI retiré de la fiche : D3, D5, D6 n'ont plus d'objet |
| post | « ligne de nombres » ; image d'un chiffre ; #FeatureEngineering | « ligne de tableau » ; quartier à convertir ; promesse sans sommaire ; #PreparationDesDonnees |

| Nº | Page | Avant | Après |
| --- | --- | --- | --- |
| C1 (relecture 2026-10-30) | 3 (mécanisme) | « Chaque colonne sauf la dernière est une caractéristique » | « Dans ce tableau, chaque colonne sauf la dernière est une caractéristique » |
| D14 (relecture 2026-10-30, erreur de la réécriture) | post, promesse | « Ces maisons reviendront dans les épisodes suivants. » | « Les ventes d'Ames reviendront dans l'épisode 04. » |

## Demande de l'utilisateur (2026-10-31)

« On ne sait même pas ce qu'est un modèle » :
- Rappel : « Nº 01 : le modèle tire ses règles d'exemples et de leurs réponses. » → « Nº 01 : un modèle, tiré d'exemples, prédit la réponse de cas nouveaux. »
- Page 2, texte : ajout en tête de « Le modèle reçoit un exemple et prédit sa réponse. » ; « Pour un modèle, une maison… » → « Pour lui, une maison… ». Source ajoutée : glossaire-modele.

« Pour le jeu de données, garder sa présentation dans la source ; aucun justificatif pour le FCFA » (choix de l'utilisateur : noms de la source avec leur sens, prix en FCFA, cours cité) :
- Pages 2 et 3, colonnes : [surface (m²), chambres, quartier, prix (FCFA)] → [surface m² · Gr Liv Area, chambres · Bedroom, quartier · Neighborhood, prix FCFA · SalePrice].
- Page 3, texte : « Un jeu de données range ses exemples en lignes : ici, trois maisons vendues à Ames, aux États-Unis, en 2010, prix convertis en FCFA. Dans ce tableau, chaque colonne sauf la dernière est une caractéristique : une variable d'entrée, comme la surface. La dernière, l'étiquette, est la réponse que le modèle apprend à donner, en apprentissage supervisé. » → « Voici trois ventes d'Ames, aux États-Unis, en 2010, sous les noms de colonnes de la source. Chaque ligne est un exemple. Chaque colonne sauf la dernière est une caractéristique : une variable d'entrée. La dernière, l'étiquette, est la réponse à apprendre en apprentissage supervisé : le prix, en dollars dans la source, converti en FCFA au cours BCEAO du 27 octobre 2026. »
- Colonne du prix en dollars à côté du prix en FCFA : demande de changer la forme tableau de la famille Grille (A52). `calculs.ames.maisons` donne déjà le prix de la source (`dollars`).

« On ne dit pas comment faire pour que le modèle reconnaisse le quartier » :
- Page 4, encadré : « Un quartier se code autrement : une colonne par quartier, qui vaut 1 si la maison y est, 0 sinon. » → « Même piège avec des couleurs numérotées : le modèle jugerait « violet » six fois plus probable que « orange ». » (mlcc-six-fois).
- Nouvelle page 5, Mécanisme « Une colonne par quartier. » : tableau quartier × North Ames, College Creek, Old Town (1 ou 0), sources mlcc-une-colonne, mlcc-un-zero, mlcc-nombres, ames-quartier. Le carrousel passe de 5 à 6 pages.
- Fin, point 3 : « Un quartier n'est pas une quantité. » → « Un quartier n'est pas une quantité : une colonne par quartier, 1 ou 0. »
- Post, promesse : « Il se termine sur un piège : numéroter des quartiers comme s'il s'agissait de quantités. » → « Il montre un piège, numéroter des quartiers comme s'il s'agissait de quantités, puis la bonne façon de les coder : une colonne par quartier. »

## Mises en conformité de la relecture du 2026-10-31

- C1 · Page 3 : « Chaque colonne sauf la dernière est une caractéristique » → « Dans ce tableau, chaque colonne sauf la dernière est une caractéristique ».
- C2 · Post, promesse : « puis la bonne façon de les coder » → « puis une façon de les coder qui l'évite ».

## Décisions de la relecture appliquées (2026-11-01, demande de l'utilisateur : « applique toutes les recommandations »)

- D23 · Page 2 : « Le modèle reçoit… » → « Ici, le modèle reçoit… ».
- D15 · Page 2, visuel : « une maison » → « une vente à Ames en 2010 » (sources : + ames-ventes).
- D17 · Pages 2 et 3 : « chambres · Bedroom » → « chambres · Bedroom AbvGr » (extrait ames-fichier).
- D18 · Page 3 : « le prix, en dollars dans la source, converti en FCFA au cours BCEAO du 27 octobre 2026. » → « le prix. Conversions : pieds carrés en m², dollars en FCFA au cours BCEAO du 27 octobre 2026. »
- D12 · Page 4 : « donner un numéro à chaque quartier » → « donner au modèle un numéro par quartier ».
- D11 · Page 4 : « comme si Old Town valait trois fois North Ames » → « comme si Old Town comptait trois fois plus que North Ames ».
- D13, D21 · Page 5, sources : + mlcc-vecteur-un, ames-indicatrices ; `appuie` de mlcc-une-colonne, mlcc-un-zero, mlcc-six-fois mis à jour ; fiche : page 5 Mécanisme ajoutée, Fin en page 6.
- D20 · Post, promesse : « Les ventes d'Ames reviendront dans l'épisode 04. » placée en dernier.
- D22 · Fiche, accroche : « ligne de nombres » → « ligne de tableau ».
- D9 · Fiches 02, 04, 05 : titre de la référence BCEAO complété par « (cours du mardi 27 octobre 2026, 1 dollar US = 588,30 FCFA) » (premier commentaire).
- D10 (1) · Fiches 02, 04, 05 : citation des données « Ames Housing Data, Dean De Cock, Journal of Statistics Education 19(3), consulté le 31 octobre 2026 » et lien vers AmesHousing.txt. D10 (2), la demande de consentement à l'auteur, revient à l'utilisateur.
- D1 · A43 passe en « Résolues » dans AMBIGUITES.md.
- Non appliquée : D19 (« orange 1, violet 6 ») : le 6 de violet ne figure que dans une illustration de la page MLCC, pas dans son texte ; le contrôle des nombres le refuse. Encadré inchangé.

## Audit éditorial et scientifique de l'utilisateur (2026-11-01)

- 02.1 et 02.2 · Page 4 : « Le modèle ne reçoit que des nombres : le nom du quartier doit être converti. Le piège : donner au modèle un numéro par quartier, comme dans ce tableau. Le modèle traiterait ces numéros comme des quantités, comme si… » → « Beaucoup de modèles ne reçoivent que des nombres : le nom du quartier doit alors être converti. Le piège : donner un numéro par quartier, comme dans ce tableau. Selon le modèle, ces numéros risquent d'être lus comme des quantités, comme si… » (extraits sklearn-categories-natives, sklearn-ordre ; scikit-learn ajouté à la fiche).
- 02.1 · Post, intuition : « et seulement des nombres : même le nom du quartier doit être converti » → « et souvent seulement des nombres : le nom du quartier doit alors être converti ».
- 02.4 · Page 5 : « On crée une colonne par quartier. » → « Une solution parmi d'autres : une colonne par quartier. » ; fin, point 3 : « Un quartier n'est pas une quantité : une colonne par quartier, 1 ou 0. » → « Un quartier n'est pas une quantité ; une solution : une colonne par quartier, 1 ou 0. » (extraits sklearn-autre-possibilite, mlcc-limite).
- 02.3 · Conversions vérifiées par calculs.ames.maisons([2, 267, 171]) : 105 000 $ × 588,30 = 61,8 → 62 ; 240 000 $ → 141,2 → 141 ; 96 500 $ → 56,8 → 57 millions de FCFA ; pieds carrés × 0,09290304. Inchangées.
- Demande de l'utilisateur (2026-11-01) · Pages 2 et 3, en-têtes des tableaux : un seul nom, celui de la source. « surface m² · Gr Liv Area », « chambres · Bedroom AbvGr », « quartier · Neighborhood », « prix FCFA · SalePrice » → « Gr Liv Area », « Bedroom AbvGr », « Neighborhood », « SalePrice ». Les unités restent dites en page 3 (« Conversions : pieds carrés en m², dollars en FCFA »).
- C1 (relecture du 2026-11-01, après l'audit) · Page 4, description du visuel : « le modèle la lit comme une quantité » → « selon le modèle, elle risque d'être lue comme une quantité ».

## Second audit de l'utilisateur (2026-11-01)

- 02.1 · Page 2 : « Ici, le modèle reçoit un exemple et prédit sa réponse. » → « Ici, le modèle apprend d'exemples dont la réponse est connue. » (même nombre de mots ; + glossaire-etiquette). La prédiction de cas nouveaux reste dite par le rappel du Nº 01.
- 02.2 · Page 4, encadré : « le modèle jugerait « violet » **six fois** plus probable que « orange » » → « le modèle y lirait **un ordre** et des écarts qui n'existent pas » (mlcc-continus, sklearn-ordre ; mlcc-six-fois retiré des sources de la page : la phrase de MLCC confond quantité et probabilité).
- 02.3 · Conversions recalculées sur AmesHousing.txt brut (ventes 2, 267, 171, vendues en 2010) : 896 / 2 098 / 1 140 pieds carrés × 0,09290304 = 83,2 / 194,9 / 105,9 m² → 83 / 195 / 106 ; 105 000 / 240 000 / 96 500 $ × 588,30 = 61,77 / 141,19 / 56,77 → 62 / 141 / 57 millions de FCFA. Cours du 27 octobre 2026 : extrait bceao-dollar lu le 2026-10-30 ; la page BCEAO n'affiche plus ce jour-là.
- C1 (relecture du 2026-11-01, second audit) · sources/02/extraits.yaml, champs `appuie` de mlcc-six-fois, mlcc-continus, sklearn-ordre, glossaire-etiquette mis à jour tels que rédigés dans relecture.md ; texte publié inchangé.


## Session de design n° 2 (2026-11-01) : couverture A et lisibilité sur téléphone

Décision de l'utilisateur (A54) : texte en 30 px, aucun texte sous 22 px, limites abaissées à 32 mots (ouverture) et
55 (page de contenu), textes resserrés sans retirer de nuance. Points notables :
- Page 2 : « Ici, le modèle apprend d'exemples dont la réponse est connue » → « Le modèle apprend d'exemples à la réponse connue ».
- Page 3 : « Voici … sous les noms de colonnes de la source » → « … ; colonnes sous leurs noms d'origine » ; conversions en une phrase, date BCEAO et « en apprentissage supervisé » gardés.
- Page 2, visuel : cadre 570 → 550 px.
- C1 et C2 (relecture du 2026-11-01, après resserrage) : « Ici, » rétabli en page 2 (« vendue » retiré pour rester à 32 mots) et « ici, » en page 3 (« et en FCFA » → « et FCFA ») ; nuances perdues en resserrant.

## Réécriture du texte du post (2026-11-05, A63)

Demande de l'utilisateur : réécrire le post selon `theta-post/`, textes validés le 2026-11-05. Pages du carrousel inchangées.

- Avant : bloc `linkedin` en quatre parties (commit d57f104).
- Après : bloc `linkedin` en `texte` libre ; rapport dans `theta-post/episodes/brouillons/02_donnees-caracteristiques-et-etiquettes_v2.md`.

## Validation du 2026-11-06

Épisode relu et validé par l'utilisateur, qui a demandé le passage à « relu » et l'enregistrement de la relecture. Le sous-agent `relecteur` n'a pas été repassé sur le texte du post réécrit ; `sortie/02/relecture.md` reste le rapport précédent et ses décisions D n'ont pas été arbitrées une à une.

## Compréhension pour un débutant (2026-11-12, règle des 8,5)

Décision de l'utilisateur : la note de compréhension s'applique au Nº 02. Avant réécriture : carrousel 8,17, post
7,38. Réécriture de la forme seule : aucun fait, chiffre ni source ajouté ou retiré ; les nuances (« beaucoup de
modèles », « selon le modèle », « une solution parmi d'autres », cas supervisé) et la décision du 2026-11-01
(en-têtes sous les noms de la source) sont gardées. Le sous-agent `relecteur` n'a pas été relancé (session
ouverte depuis theta-kit/, où il n'est pas disponible) : à refaire depuis serie-ml/ si un doute existe.

- Fiche, accroche : « Pour une machine, un exemple n'est qu'une ligne de tableau. » → « Pour une machine, une maison n'est qu'une ligne de tableau. »
- Couverture, titre (nouveau) : « Comment une machine voit-elle une maison ? » (avant : le titre de l'ouverture).
- Page 2, rappel : « Nº 01 : un modèle, tiré d'exemples, prédit la réponse de cas nouveaux. » → « Nº 01 : un modèle apprend à partir d'exemples, puis prédit la réponse pour des cas nouveaux. »
- Page 2, texte : « Ici, le modèle apprend d'exemples à la réponse connue. Pour lui, une maison n'est qu'une ligne de tableau : surface, chambres, quartier, puis prix, la réponse à apprendre. » → « Le modèle apprend à estimer un prix à partir de maisons déjà vendues. Pour lui, chaque maison est une ligne : surface, chambres, quartier, puis le prix. »
- Page 3, texte : « Trois ventes d'Ames, aux États-Unis, en 2010 ; colonnes sous leurs noms d'origine. Chaque ligne est un exemple ; ici, chaque colonne sauf la dernière, une caractéristique : une variable d'entrée. La dernière, l'étiquette, est la réponse à apprendre en apprentissage supervisé : le prix. Converties en m² et FCFA, cours BCEAO du 27 octobre 2026. » → « Voici trois maisons vendues à Ames, aux États-Unis, en 2010, avec les noms anglais des colonnes. Chaque ligne est un exemple. Chaque colonne, sauf la dernière, est une caractéristique : une information donnée au modèle. La dernière, l'étiquette, est la réponse à apprendre, en apprentissage supervisé : le prix. »
- Page 3, encadré « Une ligne » (redit le texte) → « Les unités : En m² et en FCFA, cours BCEAO du 27 octobre 2026. » (la conversion quitte le texte).
- Page 4, texte : « Beaucoup de modèles ne reçoivent que des nombres : le nom du quartier doit alors être converti. Le piège : donner un numéro par quartier, comme dans ce tableau. » → « Beaucoup de modèles ne lisent que des nombres : il faut donc traduire le nom du quartier. Le piège : donner à chaque quartier un numéro, comme ici. »
- Fin, point 2 : « Une caractéristique est une variable d'entrée ; l'étiquette est la réponse. » → « Une caractéristique est une information donnée au modèle ; l'étiquette est la réponse. » (« variable d'entrée » n'apparaît plus dans l'épisode ni ailleurs).
- Texte du post : réécrit (accroche « Donnez un numéro à chaque quartier : 1, 2, 3. », tableau expliqué avant le piège, étiquette définie, exercice reformulé : « Une seule a un ordre naturel, que des numéros peuvent garder. »). Mêmes faits : risque selon le modèle, parade et ses limites, modèles qui traitent les catégories, mémoire (1 919 exemples, 19 intentions) ; « requête client » devient « message client ».
- Après : carrousel 8,92, post 8,75 (sortie/02/comprehension.yaml).
