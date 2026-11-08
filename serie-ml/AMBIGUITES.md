# Registre des ambiguïtés

Les entrées ouvertes sont classées par moment de traitement ; les entrées résolues gardent leur décision.
Session de design n° 1 (2026-10-25) : A12, A11, A24, A25, A22, A35 et A39 sont résolues. Aucune entrée ouverte.

## Ouvertes

### Prochaine session de design

#### A64 · Fins de post dans la charte

| Champ | Contenu |
| --- | --- |
| Nº | A64 |
| Jalon | 5 (lancement) |
| Fichier | charte/texte-linkedin.md (ligne « Conclusion ») |
| Question | La règle de fin de post du 2026-11-06 est dans CLAUDE.md et `theta-post/CLAUDE.md`. La charte, verrouillée, ne cite ni la citation ni la synthèse parmi les conclusions. |
| Options | 1. Ajouter ces deux formes à la ligne « Conclusion » lors de la prochaine session de design. 2. Laisser la charte renvoyer à `theta-post/CLAUDE.md`, qui porte déjà la méthode de rédaction. |
| Choix provisoire | Option 1, sans urgence : le code ne contrôle pas le type de fin, rien n'est bloqué. |
| Impact si c'est faux | Aucun sur la publication ; une liste incomplète dans la charte. |
| Gravité | Mineure |
| Statut | Ouverte |

#### A65 · Post manqué : continuer la série ou l'arrêter

| Champ | Contenu |
| --- | --- |
| Nº | A65 |
| Jalon | 5 (production) |
| Fichier | serie/linkedin.py (`tourner`) |
| Question | Quand un post dépasse ses 2 heures, faut-il que les posts suivants partent quand même ? |
| Options | 1. Ils partent ; le post manqué reste à publier à la main, hors calendrier, donc parfois après le suivant. 2. La série s'arrête jusqu'à ce que l'utilisateur intervienne (ancien comportement). |
| Choix provisoire | Option 1, demandée par l'utilisateur le 2026-11-06 (« post manqué qui ne bloque plus les suivants »). Un post manqué ne part jamais seul et déclenche une alerte Windows. |
| Impact si c'est faux | Un épisode peut sortir avant celui dont il dépend ; retour à l'option 2 en remplaçant `continue` par `return` dans `tourner`. |
| Gravité | Mineure |
| Statut | Ouverte, code fait |

#### A66 · Nº 11, page 3 : le schéma Flux en boucle touche le texte

| Champ | Contenu |
| --- | --- |
| Nº | A66 |
| Jalon | 5 (production) |
| Fichier | bibliotheque/flux.py ou gabarits/ (page Mécanisme) |
| Question | La forme Flux `page` avec `retour` commence juste sous le texte, sans marge, sur la page 3 de l'épisode 11. Faut-il ajouter un espace ? |
| Options | 1. Ajouter une marge haute à la forme en session de design. 2. Laisser ainsi. |
| Choix provisoire | Option 2 pour l'instant : le contenu ne peut pas régler cet espace. La page reste lisible, avec un encadré dessous. |
| Impact si c'est faux | Une ligne de style, puis la planche de référence Flux à refaire. |
| Gravité | Mineure |
| Statut | Ouverte, à traiter en session de design |

#### A67 · Nº 12 : pas de forme pour un plan en perspective

| Champ | Contenu |
| --- | --- |
| Nº | A67 |
| Jalon | 5 (production) |
| Fichier | bibliotheque/nuage.py (`PARAMETRES`, couverture), calculs/ (régression à deux entrées) ; fiche banque/episodes/12-*.yaml, couverture et page 3 |
| Question | La fiche 12 demande « plan incliné au-dessus d'un nuage de points en perspective » en couverture et « la droite devient un plan » en page 3 ; aucune forme ne dessine un plan ni un nuage en perspective. Comment le montrer ? |
| Options | 1. En session de design : une forme Nuage `plan` et une couverture, plus un calcul de la régression surface et chambres sur Ames. 2. Changer la fiche : montrer deux droites côte à côte, sans perspective. |
| Choix provisoire | Aucun : épisode 12 arrêté avant l'étape sources (SKILL episode, étape 3 : « une page qui demande une forme absente : n'invente rien, arrête »). |
| Impact si c'est faux | Épisodes 12 et suivants en attente ; ils doivent être relus avant le 2026-12-08 environ pour garder quatre épisodes d'avance. |
| Gravité | Importante |
| Statut | Ouverte, session de design à lancer par l'utilisateur |

#### A44 · Montants en FCFA dans toute la série

| Champ | Contenu |
| --- | --- |
| Nº | A44 |
| Jalon | 5 (production) |
| Fichier | charte/regles-redaction.md (règle à écrire) ; calculs/devises.py ; contenu/02.yaml ; fiches à prix (11 « Le prix selon la surface », etc.) |
| Question | Demande de l'utilisateur (2026-10-30) : « pour les prix tout doit être dans les unités ivoiriennes ». Où l'écrire comme règle, et comment convertir un montant sourcé dans une autre devise ? |
| Options | 1. Règle de charte : tout montant publié est en FCFA ; un montant sourcé en devise est converti par `calculs/devises.py` au cours de référence BCEAO daté et sourcé, arrondi, et le post dit « converti au cours BCEAO du … » (pas de légende sous les schémas, voir A45). 2. Préférer des exemples dont la source est déjà en FCFA, et ne convertir qu'à défaut. |
| Choix provisoire | Option 1 appliquée à l'épisode 02 (cours du 27 octobre 2026, 1 USD = 588,3000 FCFA, arrondi au million ; conversion dite dans le post). La règle de charte attend une session de design (charte/ verrouillée). Le cours est figé dans calculs/devises.py : un autre épisode qui convertit doit dater et sourcer son propre cours. |
| Impact si c'est faux | contenu/02.yaml, calculs/devises.py, sources/02. |
| Gravité | Moyenne |
| Statut | Résolu le 2026-10-31 : règle écrite dans charte/regles-redaction.md (« Les montants et les légendes ») |

#### A45 · Pas de légende sous les schémas

| Champ | Contenu |
| --- | --- |
| Nº | A45 |
| Jalon | 5 (production) |
| Fichier | charte/regles-redaction.md, charte/architecture-carrousel.md (règle à écrire) ; serie/schemas.py (champ `legende` de page) ; contenu/01.yaml, 02.yaml, 04.yaml |
| Question | Demande de l'utilisateur (2026-10-30) : retirer sur toute la série les légendes de commentaire sous les visuels (« Exemple tiré du glossaire… »), sans laisser la page vide ; les images réelles gardent légende et crédit. |
| Options | 1. Règle de charte : le champ `legende` d'une page ne sert plus pour un schéma ; la source va en premier commentaire, une précision nécessaire (conversion, cas particulier) va dans le texte ou le post ; un vide trop grand se comble par le visuel (cadre, lignes), jamais par du texte ajouté. 2. Retirer aussi le champ du schéma et du gabarit. |
| Choix provisoire | Option 1 appliquée : légendes retirées en 01 (p. 2), 02 (p. 2, visuel agrandi) et 04 (p. 2). Images réelles inchangées (01, IBM 704). Règle de charte et éventuel contrôle (`serie verifier` refusant `legende` hors image) en session de design. |
| Impact si c'est faux | contenu/01.yaml, 02.yaml, 04.yaml. |
| Gravité | Moyenne |
| Statut | Résolu le 2026-10-31 : règle écrite dans charte/regles-redaction.md (« Les montants et les légendes ») ; pas de contrôle automatique ajouté |

#### A46 · Fil de la saison : ce que le contenu seul ne peut pas faire

| Champ | Contenu |
| --- | --- |
| Nº | A46 |
| Jalon | 5 (production) |
| Fichier | bibliotheque/nuage.py, gabarits/fin.html.j2, gabarits/capture.html.j2, charte/charte.yaml (polices), charte/architecture-carrousel.md |
| Question | Critique du 2026-10-30, appliquée par l'utilisateur à toute la saison : une partie demande de changer la bibliothèque ou les gabarits, verrouillés hors session de design. |
| Options | 1. Ouvrir une session de design pour les points ci-dessous. 2. Les abandonner. |
| Choix provisoire | Option 1. Points : (a) famille Nuage : accepter des points réels venus de calculs/ (nuage des ventes d'Ames autour de la droite, épisodes 04, 05, 11 ; vraies mesures d'iris, épisode 03) au lieu d'un tirage ; (b) une ligne « question » visible qui relie chaque page à la précédente (aujourd'hui écrite dans la première phrase du texte) ; (c) page de fin : une ligne « Où on en est » (carte de la saison) ; (d) page Capture sans image : la légende de l'image s'affiche sous le schéma, ce qui contredit A45 (texte réduit à « Un dossier Spam. » en 01) ; (e) Geist n'a pas le signe º : « Nº » s'affiche « No » dans le texte courant (les rappels en Geist Mono sont justes) ; le contenu écrit « épisode 02 » en attendant ; (f) Flux pleine page (03, page 5) : le texte de 5 lignes touche l'étiquette du schéma. |
| Impact si c'est faux | Aucun sur le contenu actuel. |
| Gravité | Moyenne |
| Statut | À traiter en session de design |

#### A47 · Encadré « En Côte d'Ivoire » et voix de l'auteur

| Champ | Contenu |
| --- | --- |
| Nº | A47 |
| Jalon | 5 (production) |
| Fichier | contenu/NN.yaml (posts et encadrés) ; sources/NN/ |
| Question | La critique du 2026-10-30 propose une application ivoirienne réelle par épisode quand elle existe, et une phrase de l'auteur (« Ce que j'en retiens en pratique »). |
| Options | 1. Application ivoirienne : seulement avec une source primaire vérifiée (communiqué d'entreprise ou d'administration, article scientifique). 2. Phrase de l'auteur : écrite par l'utilisateur, jamais par l'agent. |
| Choix provisoire | Rien d'ajouté le 2026-10-30 : aucune source primaire trouvée sur une application de ML déployée en Côte d'Ivoire (fraude au mobile money, cacao) ; un document CTCN de septembre 2025 décrit une demande d'assistance, pas un déploiement. L'utilisateur peut fournir des sources et ses phrases. Aucune mention de projet personnel (demande de l'utilisateur, 2026-10-30). |
| Impact si c'est faux | Aucun. |
| Gravité | Faible |
| Statut | En attente de sources et de textes de l'utilisateur |

#### A48 · Retrait du projet personnel de l'utilisateur

| Champ | Contenu |
| --- | --- |
| Nº | A48 |
| Jalon | 5 (production) |
| Fichier | charte/regles-banque.md (ligne 50), charte/regles-redaction.md (ligne 56) |
| Question | Demande de l'utilisateur (2026-10-30) : retirer complètement du projet toute mention de son projet personnel. Fait hors charte : CLAUDE.md, NUIT.md, fiches 61 et 62 (la page 4 de l'épisode 62 s'appuie désormais sur les jeux publics Snips et ATIS, Chen, Zhuo et Wang, 2019, tableau 2), conception/. Restent deux phrases de la charte, verrouillée. |
| Options | 1. regles-banque.md : « …(62), clôt la série sur une application concrète. » ; regles-redaction.md : « **Un chiffre réel** vient de toi, jamais de l'agent. » 2. Autre formulation. |
| Choix provisoire | Option 1, à appliquer dès que l'utilisateur ouvre une session de design (fichier `.session-design`) ; l'agent ne l'ouvre pas lui-même. |
| Impact si c'est faux | Deux phrases de la charte. |
| Gravité | Faible |
| Statut | Résolu le 2026-10-31 (session de design) : option 1 appliquée aux deux phrases |

#### A49 · Publication LinkedIn automatique

| Champ | Contenu |
| --- | --- |
| Nº | A49 |
| Jalon | 5 (production) |
| Fichier | charte/decisions-automatisation.md (9.5 « La publication, à la main »), BRIEF-CONSTRUCTION.md (« Hors périmètre ») |
| Question | Décision de l'utilisateur (2026-10-30) : « je veux full automatisé ». La charte (9.5) dit encore que la publication est manuelle. |
| Options | 1. Écrire dans la charte : `serie linkedin tourner`, lancé toutes les 5 minutes par le Planificateur de tâches, publie par l'API officielle le post dû, seulement s'il est relu, à jour, dans les 2 heures suivant l'heure prévue, et jamais deux fois ; sinon il prévient. 2. Revenir à la publication manuelle. |
| Choix provisoire | Option 1, code fait (serie/linkedin.py, tests/test_linkedin.py). Restent : la phrase de la charte (session de design) ; les bilans de saison, qui n'ont pas encore de dossier publier/ (la tournée prévient et s'arrête) ; l'accès au premier commentaire (`w_member_social_feed` dans la doc Comments API) et à la Documents API pour une application en libre-service, à vérifier par `serie linkedin essai`. |
| Impact si c'est faux | serie/linkedin.py, la tâche planifiée « Theta LinkedIn ». |
| Gravité | Importante |
| Statut | Code prêt ; charte écrite le 2026-10-31 (9.5). Essais réels du 2026-11-06, application en libre-service, relations seulement : PDF complet, post, premier commentaire et suppression passent (commentaire par `/v2/socialActions`, car `/rest/socialActions` répond 403). Tâche planifiée « Theta LinkedIn » créée le 2026-11-06 par l'utilisateur, dernier résultat 0 ; session Windows ouverte requise (ouverture de session interactive) |

#### A50 · Épisode 05 : formes qui manquent pour montrer le coût

| Champ | Contenu |
| --- | --- |
| Nº | A50 |
| Jalon | 5 (production) |
| Fichier | bibliotheque/nuage.py, bibliotheque/grille.py, bibliotheque/courbe.py |
| Question | Production de l'épisode 05 (2026-10-31) avec les formes existantes : la page Comparaison montre deux droites (forme pivot) sans les ventes d'Ames, et la courbe en U de la page 6 reprend la forme pentes sans tangente, sans graduation ni point pour la droite a = 40. |
| Options | 1. En session de design : (a) Nuage, forme droite : une droite choisie (a, b) et non seulement celle des moindres carrés, sur des points réels (avec A46 a), pour la comparaison bonne / mauvaise droite ; (b) Courbe : une forme « coût selon un réglage » avec un axe gradué et des points marqués (a = 40, a = 74) ; (c) Grille, tableau : le cadre d'une fenêtre sur la dernière colonne est rogné à droite de quelques pixels (page 3 de 05). 2. Garder l'épisode tel quel. |
| Choix provisoire | Option 2 jusqu'à la session de design ; les chiffres affichés viennent de calculs/cout.py (tests/test_ames.py). |
| Impact si c'est faux | contenu/05.yaml, pages 3, 5 et 6. |
| Gravité | Moyenne |
| Statut | À traiter en session de design |

#### A51 · Contrôle des nombres groupés par milliers

| Champ | Contenu |
| --- | --- |
| Nº | A51 |
| Jalon | 5 (production) |
| Fichier | serie/verification.py (`nombres`, `NOMBRE`) ; tests/test_controles.py |
| Question | « J = 1 030 » (épisode 05) était lu comme 1 et 030 ; écrit 1030, il aurait été pris pour une date. |
| Options | 1. Lire d'un bloc un nombre groupé par milliers (espace simple, insécable ou fine, comme typographie.texte) et ne jamais le prendre pour une date. 2. Interdire les nombres de 1 000 à 1 999 hors dates. |
| Choix provisoire | Option 1, faite le 2026-10-31 (test_nombre_groupe_par_milliers). |
| Impact si c'est faux | Le contrôle des chiffres de tous les épisodes. |
| Gravité | Faible |
| Statut | Fait ; à valider |

#### A52 · Relecture des épisodes 01 à 04 : ce que le contenu seul ne peut pas faire

| Champ | Contenu |
| --- | --- |
| Nº | A52 |
| Jalon | 5 (production) |
| Fichier | bibliotheque/grille.py (forme tableau), bibliotheque/nuage.py (forme groupes) ; contenu/02.yaml (page 3), contenu/03.yaml (page 3) |
| Question | Relecture de l'utilisateur (2026-10-31). (a) Nº 02, page 3 : présenter le jeu de données comme dans la source, avec le prix en dollars (SalePrice) puis en FCFA ; la forme tableau ne marque qu'une colonne d'étiquette, la dernière, et lirait le prix en dollars comme une caractéristique. (b) Nº 03, page 3 : « ajouter des couleurs pour démarquer » les groupes trouvés ; la forme groupes dessine chaque groupe avec la même tache bleue. |
| Options | 1. En session de design : (a) tableau, paramètre `etiquettes` (nombre de colonnes d'étiquette en fin de tableau, 1 par défaut) ; (b) groupes, une teinte par groupe tirée de la charte (accent, puis gris foncé, puis une troisième teinte à choisir), sans la confondre avec les classes du cas supervisé. 2. Garder la version provisoire. |
| Choix provisoire | Option 2 : Nº 02, en-têtes « prix FCFA · SalePrice » et conversion dite dans le texte (cours BCEAO du 27 octobre 2026) ; Nº 03, une tache bleue par groupe. `calculs.ames.maisons` donne déjà le prix de la source (`dollars`). (c) Image de référence Couvertures : la fiche 02 dit « ligne de tableau » depuis le 2026-11-01 (D22) ; l'ancienne accroche est figée dans tests/fixtures/couvertures.yaml, à retirer quand la référence sera refaite en session de design. |
| Impact si c'est faux | contenu/02.yaml, contenu/03.yaml (page 3 de chacun) ; tests/fixtures/couvertures.yaml. |
| Gravité | Moyenne |
| Statut | À traiter en session de design |

#### A54 · Session de design n° 2 : mise à jour visuelle theta-maj-visuels

| Champ | Contenu |
| --- | --- |
| Nº | A54 |
| Jalon | 5 (production) |
| Fichier | theta-maj-visuels/theta-maj/ (paquet de l'utilisateur, en JavaScript) ; gabarits/, bibliotheque/, charte/, design/, tests/reference/ |
| Question | Le paquet change la couverture (robot qui joue le sujet), retire le robot des pages techniques et relève les tailles de texte (aucun texte sous 22 px). Il est écrit pour une autre chaîne (Node) et propose des motifs dessinés à la main. |
| Options | Intégration : porter en Python ou appeler Node. Motifs : calculés par famille (A11) ou un SVG dessiné par épisode. Texte : tailles et limites abaissées, ou deux phrases par page, ou couverture seule d'abord. |
| Choix provisoire | — |
| Impact si c'est faux | Couverture, gabarits, références et contenus 01 à 05. |
| Gravité | Majeure |
| Statut | Résolue le 2026-11-01 |
| Décision | Choix de l'utilisateur : porter en Python (bibliotheque/robot.py, robot-gestes.json, gabarits/couverture.html.j2) ; motifs calculés par famille, placés dans la zone du geste (calculs/couvertures.py, `en_zone`) ; tailles du paquet et limites de mots abaissées, textes 01 à 05 resserrés. Le robot n'était déjà plus sur les pages techniques (couverture et fin seulement). |

#### A53 · Nº 03, page 5 : la boucle du renforcement sur un schéma à deux lignes

| Champ | Contenu |
| --- | --- |
| Nº | A53 |
| Jalon | 5 (production) |
| Fichier | bibliotheque/flux.py (forme page) ; contenu/03.yaml (page 5) |
| Question | Second audit de l'utilisateur (2026-11-01) : le schéma doit montrer le cycle complet, action, retour de l'environnement, nouvelle action. La page 5 met deux lignes côte à côte (jeu de données fixe / renforcement) ; la forme page ne dessine la boucle `retour` que sur une seule ligne (« une boucle de retour ne se dessine que sur une seule ligne »). Le cycle n'est dit que par l'étiquette « Retour, puis recommencer ». |
| Options | 1. En session de design : autoriser `retour` sur une ligne précise d'un schéma à plusieurs lignes (flèche de la dernière boîte vers la première de cette ligne). 2. Garder la version actuelle : la boucle est dessinée en page 2 (panneau « par renforcement ») et dite en page 5. |
| Choix provisoire | Option 2. |
| Impact si c'est faux | contenu/03.yaml, page 5 (paramètre `retour` sur la seconde ligne). |
| Gravité | Mineure |
| Statut | À traiter en session de design |

#### A55 · Nº 06 : pas de forme Courbe pour une tangente sans pas de descente

| Champ | Contenu |
| --- | --- |
| Nº | A55 |
| Jalon | 5 (production) |
| Fichier | bibliotheque/courbe.py (`PARAMETRES`), tests/reference/Formes-Courbe.png, tests/fixtures/formes.yaml ; contenu/06.yaml (pages 2 et 3) |
| Question | Production de l'épisode 06 (2026-11-01). La fiche dit « La dérivée est la pente de la tangente en un point » (page 2) et « Positive : ça monte. Négative : ça descend. Nulle : c'est plat » (page 3) ; la couverture : « courbe avec des tangentes en plusieurs points ». Aucune forme de page ne dessine une courbe avec sa tangente sans autre chose : `pentes` ajoute à chaque point la flèche du pas η × pente et l'étiquette « pas = … » (η = 0 laisse une flèche de 6 px et « pas = 0 ») ; `descente` ajoute ∇J (épisode 07), le pas et θ₀, θ₁… (épisode 08) ; `plancher` est en orange (réservé à Comparaison et Piège) avec l'accolade « erreur restante » ; `droite` trace une droite seule, sans la courbe, et pose toujours un point en (0, b). Le pas et ∇J ne sont pas encore introduits en 06. |
| Options | 1. En session de design : une forme Courbe `tangentes` (repère de `pentes` : origine, echelle, fonction, domaine, cadre, axe), avec `points` = liste de {theta, decalage}, une tangente en tirets accent et l'étiquette « pente v » à chacun (v par calculs.descente_gradient.pente), sans flèche ni « pas » ; option `triangle` (un pas de 1 sur l'axe, la montée v, comme la forme `droite`) pour lire la pente sur la tangente. Image de référence et paramètres d'exemple à ajouter. Puis relancer `/episode 06`. 2. Produire 06 sans tangente dessinée : page 2 en courbe en U seule (`pentes`, `points: []`, comme la page 6 de 05), pages 3 et 4 en tableaux (Grille `tableau`). La tangente n'est alors que dite. |
| Choix provisoire | Aucun : l'épisode 06 est arrêté avant l'étape contenu (SKILL episode, étape 3 : « une page qui demande une forme absente : n'invente rien, arrête »). Faits : lecture et sources (sources/06/extraits.yaml, D2L 2.4 et DLB ch. 4 ajouté à la fiche). Plan prévu : p. 2 la tangente au coût $J$ = $a$² en un point et sa pente ; p. 3 tangentes en $a$ = −2, 0 et 3 (pentes −4, 0, 6 ; nuance : pente nulle au creux, mais aussi au sommet d'une bosse, DLB fig. 4.2) ; p. 4 tableau des rapports (J(3 + h) − J(3)) ÷ h pour h = 1 ; 0,5 ; 0,1 (7 ; 6,5 ; 6,1 → 6), comme D2L 2.4 le fait en x = 1 ; deux décimales au plus, car la forme `tableau` arrondit les nombres à deux décimales. |
| Impact si c'est faux | Épisode 06 en attente ; 07 (même chapitre) et 08 l'ont pour prérequis. |
| Gravité | Importante |
| Statut | Résolue le 2026-11-01 |
| Décision | Option 1, prise par l'orchestrateur pendant la session de design n° 2 que l'utilisateur a lancée (production des épisodes 06 à 15 demandée) : forme Courbe `tangentes` (tangente en tirets, « pente v » calculée, `triangle` facultatif), image de référence dans Formes-Courbe. |

#### A56 · Nº 07 : pas de forme Niveaux pour une carte de lignes de niveau avec le gradient

| Champ | Contenu |
| --- | --- |
| Nº | A56 |
| Jalon | 5 (production) |
| Fichier | bibliotheque/niveaux.py (`PARAMETRES`), calculs/descente_gradient.py, tests/reference/ (pas encore de planche Formes-Niveaux), tests/fixtures/formes.yaml ; contenu/07.yaml (couverture, page 3) |
| Question | Production de l'épisode 07 (2026-11-01). La fiche dit « Sur une carte de niveaux, ∇J pointe vers la montée la plus raide » (page 3, Mécanisme, « avec un schéma ») et, pour la couverture, « lignes de niveau avec des flèches perpendiculaires » ; charte/bibliotheque-visuelle.md : « 07 montre des flèches perpendiculaires aux niveaux, 08 un chemin qui converge ». La famille Niveaux n'a que deux formes : `couverture`, qui dessine toujours le chemin de descente de l'épisode 08 (`iterations_2d` : départ, η, pas ; `pas: 0` laisse des ellipses et un point, sans flèche), et `vignette` (planches). Aucune forme de page ne dessine une carte de lignes de niveau ; aucune ne pose de flèche ∇J perpendiculaire à un niveau ; calculs/ n'a pas de fonction qui donne ∇J en un point (a, b). Courbe, Grille, Nuage et Flux ne montrent qu'un réglage, ou pas de carte. |
| Options | 1. En session de design : (a) une forme Niveaux `carte` pleine largeur (cadre 920 × 450 ; repère `origine`, `echelle`, `domaine` en a et b ; axes « réglage $a$ », « réglage $b$ ») qui trace les lignes de niveau de $J$($a$, $b$) = $k_a$·$a$² + $k_b$·$b$² pour des `niveaux` c donnés (ellipses de demi-axes √(c/$k_a$) et √(c/$k_b$), calculées), en gris de contexte, et, en des `points` (a, b) avec leur `decalage`, la flèche ∇J = (2$k_a$·$a$, 2$k_b$·$b$) en accent, à une échelle commune, avec l'étiquette « ∇J » ; option `angle_droit` (petit carré à la ligne de niveau) ; `textes` ; une fonction `gradient_2d` dans calculs/descente_gradient.py ; (b) un paramètre `fleches` de la forme `couverture` (flèches perpendiculaires aux ellipses en quelques points, sans chemin) pour distinguer 07 de 08. Image de référence (planche Formes-Niveaux) et paramètres d'exemple à ajouter. Puis relancer `/episode 07`. 2. Produire 07 sans carte : page 3 en texte et tableau (Grille `tableau` : points, ∇J, direction), couverture avec le motif de 08 (`pas: 0` : ellipses et un point). La perpendicularité et la montée la plus raide ne sont alors que dites, et la couverture contredit bibliotheque-visuelle.md. |
| Choix provisoire | Aucun : l'épisode 07 est arrêté avant l'étape contenu (SKILL episode, étape 3 : « une page qui demande une forme absente : n'invente rien, arrête »). Faits : lecture et sources (sources/07/extraits.yaml, 24 extraits ; D2L 2.4, DLB ch. 4, et MIT OCW 18.02SC session 35, ajoutée à la fiche 07 et à provenance.yaml car les deux premières ne parlent pas de lignes de niveau). Plan prévu : p. 2 (Ouverture) une dérivée partielle par réglage, rangées dans un vecteur, ∇J = (∂J/∂a, ∂J/∂b) en fractions empilées (Grille `ligne`, ou la carte) ; p. 3 carte de niveaux de $J$ = $a$² + 3$b$² (ellipses), ∇J en trois points, perpendiculaire au niveau et vers l'extérieur (MIT : « perpendicular to the level curves », « points radially outward » ; DLB : « the gradient points directly uphill ») ; nuance : au fond de la vallée, ∇J = (0, 0) (DLB, points critiques) ; p. 4 tableau des points (a, b), 2a, 6b, par exemple (1, 1) → (2, 6), (2, −1) → (4, −6), (0, 0) → (0, 0), valeurs tirées de la nouvelle fonction de calculs/ ; fin et transition vers 08 (« aller dans le sens opposé », DLB). |
| Impact si c'est faux | Épisode 07 en attente ; 08 (même chapitre) l'a pour prérequis, et sa couverture partage la famille Niveaux. |
| Gravité | Importante |
| Statut | Résolu le 2026-11-01 (session de design n° 2) : option 1. Forme Niveaux `carte` (repère à une seule `echelle`, `courbures`, `niveaux`, `points` avec `valeurs`, `angle_droit`, `decalage` ; `longueur` des flèches ; `textes` x, y, gradient, minimum), calculs `gradient_2d` et `gradient_tableau` (et `niveau_2d`) ; paramètre `fleches` (et `longueur`) de la couverture Niveaux, sans chemin. Planche Formes-Niveaux ajoutée, couverture 07 sur la planche Couvertures ; suite : 410. |

#### A57 · Nº 07 : pas de glyphe ∂ dans les polices embarquées ; signe moins des tableaux

| Champ | Contenu |
| --- | --- |
| Nº | A57 |
| Jalon | 5 (production) |
| Fichier | charte/charte.yaml (`polices.grecques`, U+0370-03FF), gabarits/ (polices embarquées) ; rendu des cellules de tableau (`tableau.lignes`) ; contenu/07.yaml (pages 2 et 4) |
| Question | Production de l'épisode 07 (2026-11-01). 1. La dérivée partielle s'écrit ∂J/∂a (D2L 2.4, DLB ch. 4, MIT 18.02SC). `serie verifier 07` refuse « ∂ dessiné en partie par une police du système (Times New Roman) » : ∂ (U+2202) n'est dans aucun sous-ensemble embarqué, alors que ∇ (U+2207) l'est. Dans un titre de colonne de tableau, la fraction ${∂J}/{∂a}$ tombe aussi à 16,28 px (minimum 22 px). 2. Les nombres négatifs d'un tableau calculé s'affichent avec un trait d'union (« -6 »), alors que les étiquettes des visuels écrivent le signe moins (« −6 ») ; relevé par la relecture de 07 (D2). |
| Options | 1. En session de design : embarquer ∂ (et les opérateurs U+2200-22FF utiles) depuis STIX Two Text ; fixer une taille minimale pour une fraction dans un titre de colonne ; écrire le signe moins (U+2212) dans les cellules de tableau. 2. Ne rien changer : la dérivée partielle reste écrite en mots (« selon $a$ »). |
| Choix provisoire | Option 2 pour l'épisode 07 : « la dérivée partielle selon $a$ », colonnes « Selon $a$ : 2$a$ » et « Selon $b$ : 6$b$ » ; la notation ∂ n'apparaît pas. Les fiches 11 (∂J/∂w) et suivantes en auront besoin. |
| Impact si c'est faux | contenu/07.yaml, pages 2 et 4 ; épisodes à venir qui écrivent ∂ ; tous les tableaux à valeurs négatives (07, 08). |
| Gravité | Mineure |
| Statut | À traiter en session de design |

#### A58 · Nº 08 : flèche ← absente des polices embarquées ; η en capitale dans un titre d'encadré

| Champ | Contenu |
| --- | --- |
| Nº | A58 |
| Jalon | 5 (production) |
| Fichier | charte/charte.yaml (police de complément STIX Two Math, U+2207 et U+202F seulement), serie/balisage.py (`OPERATEURS` contient ←), gabarits/style.css.j2 (titres d'encadré en capitales) ; contenu/08.yaml (pages 3, 4 et 5) |
| Question | Production de l'épisode 08 (2026-11-01). 1. La fiche écrit la règle « θ ← θ − η∇J(θ) » (D2L 12.3 : x ← x − η f′(x)). `serie verifier 08` refuse « ← dessiné en partie par une police du système (Times New Roman) » : U+2190 n'est dans aucun sous-ensemble embarqué, alors que le balisage le range parmi les opérateurs. 2. Un titre d'encadré passe en capitales : « η ne change pas » s'affiche « H NE CHANGE PAS » (η devient Η, qui se lit H). |
| Options | 1. En session de design : embarquer les flèches U+2190-21FF depuis STIX Two Math ; garder les lettres grecques en minuscules dans les titres en capitales (span sans `text-transform`). 2. Ne rien changer : écrire la règle avec un indice d'itération (θ_{t+1} = θ_t − η∇J(θ_t), notation du canevas validé de 08) et éviter les lettres grecques dans les titres d'encadré. |
| Choix provisoire | Option 2 pour l'épisode 08 : formule « θ_{t+1} = θ_t [−η]∇J(θ_t) » ; encadrés « Le taux reste fixe » et « En pratique ». |
| Impact si c'est faux | contenu/08.yaml, pages 3, 4 et 5 ; toute formule à flèche (← →) des épisodes suivants ; tout titre d'encadré avec une lettre grecque. |
| Gravité | Mineure |
| Statut | À traiter en session de design |

#### A59 · Nº 09 : pas de chemin bruité (descente stochastique) dans la famille Niveaux

| Champ | Contenu |
| --- | --- |
| Nº | A59 |
| Jalon | 5 (production) |
| Fichier | bibliotheque/niveaux.py (`PARAMETRES`), calculs/descente_gradient.py, tests/reference/Formes-Niveaux.png et Couvertures.png, tests/fixtures/formes.yaml et couvertures.yaml ; contenu/09.yaml (couverture, pages 3, 4, 5 et 6) |
| Question | Production de l'épisode 09 (2026-11-01). La fiche demande pour la couverture un « chemin bruité qui zigzague sur les lignes de niveau », en page 3 (Comparaison) « Tout le jeu : lent et régulier. Un exemple : rapide et bruité. Un mini-lot de 32 à 256 : le compromis. », en page 4 (Mécanisme) « Le chemin bruité arrive quand même près du minimum. », en page 6 (Piège) « Un η grand plus du bruit : le modèle ne se pose jamais. D'où un η qui décroît au fil des époques. » ; charte/bibliotheque-visuelle.md range le « bruit » parmi les paramètres de la famille Lignes de niveau. Aucune forme ne dessine un chemin bruité : Niveaux `couverture` trace le chemin exact de 08 (`iterations_2d`, sans bruit), `carte` ne pose que des flèches ∇J, `vignette` est un chemin dessiné à la main pour les planches ; Courbe `descente`, `comparaison` et `iterations` sont exacts, sur un seul réglage. calculs/ n'a aucune descente stochastique (gradient bruité, mini-lot, η qui décroît), et aucune fonction pour le nombre de pas par époque. |
| Options | 1. En session de design : (a) dans calculs/descente_gradient.py, une fonction `sgd_2d(depart, eta, courbures, pas, bruit, lot, decroissance, graine)` : le pas de 08 sur J(a, b) = k_a·a² + k_b·b², avec au gradient un bruit tiré (moyenne 0, écart-type `bruit`, comme D2L 12.4 qui ajoute au gradient un bruit de moyenne 0 et de variance 1), divisé par √`lot` pour un mini-lot (D2L 12.5 : écart-type réduit d'un facteur b^(−1/2)), et η_t = η / √(t + 1) si `decroissance` (D2L 12.4, décroissance polynomiale α = 0,5) ; une fonction `pas_par_epoque(n, lot)` (⌈n ÷ lot⌉) et son tableau ; (b) une forme Niveaux `chemin` (repère et `niveaux` de `carte`, sans flèche ∇J) qui trace un ou plusieurs `chemins` calculés par `sgd_2d`, chacun avec son style (accent ou contexte) et son étiquette, et le point de départ et le minimum marqués ; utilisable en Comparaison (paramètres communs dans le visuel, `lot` ou `bruit` par cas, comme Courbe `comparaison`) ; (c) des paramètres `bruit`, `lot` et `graine` pour le chemin de la forme `couverture`, pour distinguer 09 (chemin qui zigzague) de 08 (chemin qui converge). Images de référence (Formes-Niveaux, Couvertures) et paramètres d'exemple à ajouter. Puis relancer `/episode 09`. 2. Produire 09 sans chemin bruité : Comparaison et Définition en tableaux (Grille `tableau`), Mécanisme et Piège en texte avec la carte de 07 ; le bruit n'est alors que dit, et la couverture reprend le chemin exact de 08, ce que bibliotheque-visuelle.md interdit (deux épisodes consécutifs de la même famille doivent se distinguer). |
| Choix provisoire | Aucun : l'épisode 09 est arrêté avant l'étape contenu (SKILL episode, étape 3 : « une page qui demande une forme absente : n'invente rien, arrête »). Faits : lecture et sources (sources/09/extraits.yaml, 50 extraits ; D2L 12.4, 12.5, 12.11, Robbins et Monro 1951 lu sur la copie JSTOR de l'université Columbia, et DLB ch. 8, ajouté à la fiche 09 et à provenance.yaml car « de 32 à 256 » n'est écrit que là : « Typical power of 2 batch sizes range from 32 to 256 »). Plan prévu : p. 2 (Ouverture) rappel de 08, chaque pas calcule ∇J sur tous les exemples, un coût qui grandit avec leur nombre (D2L 12.4) ; le « million d'exemples » de la fiche n'est dans aucune source : le dire comme une hypothèse, ou prendre les 1 500 exemples de D2L 12.5 ; p. 3 trois chemins sur la même carte (tout le jeu, un exemple, mini-lot) ; « de 32 à 256, en puissances de 2 » (DLB 8.1.3) ; nuance : « SGD » désigne aussi la descente par mini-lots (DLB) ; p. 4 un chemin bruité qui finit près du minimum, car en moyenne le gradient d'un exemple est le bon (D2L 12.4) ; cas particulier dit : coût en vallée unique (convexe, épisodes 05 et 08) ; p. 5 une époque, un passage où chaque exemple est vu une fois, dans un ordre tiré au hasard (D2L 12.5) ; tableau des pas par époque pour 1 500 exemples et des lots de 1 500, 100 et 1 (1, 15, 1 500 pas ; D2L 12.5) ; p. 6 deux chemins, η fixe qui rebondit autour du minimum (D2L 12.11, DLB : le bruit ne disparaît pas au minimum) et η qui décroît ; Robbins et Monro (1951) : des pas aₙ = 1/n ; nuance : ni trop vite, ni trop lentement (D2L 12.4) ; règle écrite sans ← et titres d'encadré sans η (A58). |
| Impact si c'est faux | Épisode 09 en attente ; 10 (même chapitre) l'a pour prérequis ; 13, 28 et 44 partagent la famille Niveaux. |
| Gravité | Importante |
| Statut | Résolu le 2026-11-01 (session de design n° 2) : option 1. Calculs `sgd_2d` (bruit de moyenne 0, écart-type `bruit` ÷ √`lot`, `decroissance` : η ÷ √(t + 1)), `pas_par_epoque` et `pas_par_epoque_tableau` (lignes exemples, lot, pas) ; forme Niveaux `chemin` (repère à une seule `echelle`, `niveaux`, `chemins` avec depart, eta, pas, bruit, lot, decroissance, graine, style accent / objet / contexte, texte, `ancre` et `decalage` de l'étiquette ; croix au minimum ; `alerte` pour la Comparaison) ; paramètres `bruit`, `lot`, `graine` de la couverture Niveaux. Planche Formes-Niveaux (chemins, comparaison η fixe ou qui décroît) et couverture 09 sur la planche Couvertures (4 100 px). Trois tests rendus indépendants des épisodes produits (fixture 08). Suite : 412. |

#### A60 · Nº 10 : pas de courbe à plusieurs creux (Courbe) ni de point selle (Niveaux)

| Champ | Contenu |
| --- | --- |
| Nº | A60 |
| Jalon | 5 (production) |
| Fichier | bibliotheque/courbe.py et bibliotheque/niveaux.py (`PARAMETRES`), calculs/descente_gradient.py, tests/reference/Formes-Courbe.png, Formes-Niveaux.png et Couvertures.png, tests/fixtures/formes.yaml et couvertures.yaml ; contenu/10.yaml (couverture, pages 2, 3 et 4) |
| Question | Production de l'épisode 10 (2026-11-02). La fiche demande pour la couverture une « courbe ondulée à plusieurs creux » (famille Courbe), en page 2 (Ouverture) « Une courbe à deux creux : la descente s'arrête dans le premier. », en page 3 (Mécanisme) « Le point selle : plat dans une direction, en pente dans l'autre. », en page 4 (Repère) « Avec un coût convexe, comme la MSE d'une droite, tout minimum local est global : pas de faux creux, même si le fond peut être plat. » Aucune forme ne dessine une courbe non convexe : toutes les formes Courbe d'un réglage (`descente`, `pentes`, `tangentes`, `comparaison`, `plancher`, `iterations`) tracent la parabole J(θ) = a·θ² + c (`Repere`, `calculs.descente_gradient.erreur`), et la couverture Courbe est l'éventail de droites de 04. Aucune forme ne dessine un point selle : Niveaux `carte`, `chemin` et `couverture` ne tracent que des ellipses (`niveau_2d` : demi-axes √(c ÷ k), impossible avec une courbure négative), et `iterations_2d` / `sgd_2d` ne descendent que J(a, b) = k_a·a² + k_b·b² avec k_a, k_b > 0. calculs/ n'a aucune fonction à plusieurs creux, ni descente sur une telle fonction, ni coût en selle. |
| Options | 1. En session de design : (a) dans calculs/descente_gradient.py, la fonction de D2L 12.1, f(x) = x·cos(πx) sur [−1 ; 2] (valeur, pente cos(πx) − πx·sin(πx), descente `iterations_f(theta0, eta, pas)`, creux calculés : minimum local vers x ≈ −0,27, f ≈ −0,18 ; bosse vers x ≈ 0,27 ; minimum global vers x ≈ 1,09, f ≈ −1,05 ; avec η = 0,05, un départ en −0,9 ou en 0,2 s'arrête dans le creux local, un départ en 0,4 rejoint le creux global) ; (b) une forme Courbe `creux` (page) qui trace cette courbe échantillonnée, la descente calculée (départ, pas, points) qui s'arrête dans le premier creux, et les étiquettes `minimum local` et `minimum global` à leurs creux ; (c) une couverture Courbe `ondulee` (courbe à plusieurs creux en accent, un point posé dans un creux) pour la couverture A et la classique ; (d) pour le point selle, dans calculs/, J(a, b) = k_a·a² − k_b·b² (D2L 12.1 : f(x, y) = x² − y², point selle en (0, 0)) et sa descente ; une forme Niveaux `selle` (lignes de niveau en hyperboles de part et d'autre du point (0, 0), marqué ; un chemin calculé qui part sur l'axe b = 0 et cale au point selle, et un second, parti un peu à côté, qui finit par s'en écarter selon b, lentement d'abord, comme dans Dauphin et al. 2014) ; à défaut, deux coupes Courbe côte à côte (`fonction.a` positif : un creux selon a ; négatif : une bosse selon b) ; (e) pour le Repère, une forme Courbe `convexe` : la parabole, une corde entre deux points qui reste au-dessus (définition de D2L 12.2) et, en option, un fond plat (D2L 12.2 : max(\|x\| − 1, 0)). Images de référence et paramètres d'exemple à ajouter. Puis relancer `/episode 10`. 2. Produire 10 sans ces formes : Ouverture et Mécanisme en texte seul ou en tableau (Grille `tableau`), couverture éventail de 04 ; la page 2 ne montre alors pas la courbe à deux creux qu'elle décrit, et la page 3 pas la selle. |
| Choix provisoire | Aucun : l'épisode 10 est arrêté avant l'étape contenu (SKILL episode, étape 3 : « une page qui demande une forme absente : n'invente rien, arrête »). Faits : lecture et sources (sources/10/extraits.yaml, 33 extraits ; D2L 12.1, D2L 12.2, Dauphin et al. 2014 lu sur arXiv, résumé et PDF v1, et MLCC Gradient descent, ajouté à la fiche 10 et à provenance.yaml car « comme la MSE d'une droite » n'est écrit que là : « The loss functions for linear models always produce a convex surface »). Plan prévu : p. 2 (Ouverture) rappel de 08 (la descente s'arrête quand la pente est nulle) ; courbe de D2L 12.1 à deux creux ; minimum local (plus bas que ses voisins) et minimum global (le plus bas de toute la courbe) ; la descente partie à gauche s'arrête dans le premier creux, car la pente y est nulle (D2L 12.1) ; nuance : le bruit des mini-lots de 09 peut l'en faire sortir (D2L 12.1). p. 3 (Mécanisme) point selle : pente nulle sans être un minimum ; un creux selon une direction, une bosse selon l'autre (D2L 12.1 : « a maximum with respect to y and a minimum with respect to x ») ; la descente peut y caler, puis en sort lentement à cause du plateau (Dauphin et al. 2014) ; avec beaucoup de paramètres, les points selle sont plus fréquents que les minimums locaux (D2L 12.1, Dauphin et al. 2014). Écart à la fiche, à trancher par l'utilisateur à la relecture : « plat dans une direction, en pente dans l'autre » ne dit pas ce que dit D2L, puisqu'au point selle la pente est nulle dans toutes les directions ; formulation prévue : « en creux dans une direction, en bosse dans l'autre ». p. 4 (Repère) fonction convexe (la corde reste au-dessus de la courbe, D2L 12.2) ; tout minimum local est global (D2L 12.2), le cas du coût d'une droite (MLCC) ; nuance de la fiche : le fond peut être plat, plusieurs réglages au même coût le plus bas (D2L 12.2) ; cas particulier dit : la plupart des problèmes d'apprentissage profond ne sont pas convexes (D2L 12.1). Titres d'encadré sans lettre grecque ni variable (A58) ; ni ∂ ni ← (A57, A58). |
| Impact si c'est faux | Épisode 10 en attente ; 11 (chapitre suivant) suit 10 au calendrier ; 16, 17, 18 et les autres épisodes Courbe auront besoin de courbes autres que la parabole (sigmoïde, entropie croisée). |
| Gravité | Importante |
| Statut | Résolu le 2026-11-02 (session de design n° 2) : option 1, sous une forme plus générale. Calculs `FONCTIONS` (ondulee x·cos(πx), parabole, fond_plat max(\|x\| − 1, 0)), `valeur_f`, `iterations_f(courbe, theta0, eta, pas)`, `creux_f(courbe, debut, fin)` et `niveau_selle` ; forme Courbe `trace` (une courbe nommée dans le repère du plan, `creux` étiquetés minimum local / minimum global, `descentes`, `corde` pour la convexité, `position_x` et `position_courbe` pour les étiquettes) ; couverture Courbe `vague` (courbe ondulée et descente arrêtée dans un creux) ; Niveaux `chemin` et `carte` acceptent des courbures de signes opposés (hyperboles du point selle, chemin qui cale au point selle). Planches Formes-Courbe, Formes-Niveaux et Couvertures refaites ; suite : 419. |

#### A61 · Nº 11 : pas de descente de gradient sur la droite d'Ames, ni de nuage à relation courbe

| Champ | Contenu |
| --- | --- |
| Nº | A61 |
| Jalon | 5 (production) |
| Fichier | calculs/ (nouvelle descente sur w et b), bibliotheque/nuage.py et bibliotheque/courbe.py (`PARAMETRES`), tests/reference/Formes-Nuage.png et Formes-Courbe.png, tests/fixtures/formes.yaml ; contenu/11.yaml (pages 2, 4 et 6) |
| Question | Production de l'épisode 11 (2026-11-02). La fiche demande en page 4 (Comparaison) « La droite après 0, 10 et 100 itérations. » et en page 6 (Piège) « Une droite ne suit pas une relation courbe. » ; la couverture est un « nuage de points et droite ajustée ». 1. calculs/ n'a aucune descente de gradient sur une régression linéaire : `iterations`, `iterations_f`, `iterations_2d` et `sgd_2d` descendent des fonctions fixées (a·θ², x·cos(πx), k_a·a² + k_b·b²), jamais la MSE J(w, b) = (1/n) Σ (w·xᵢ + b − yᵢ)² d'un jeu de points ; `cout_selon_a` ne donne que la coupe à b fixé. Les droites des itérations 0, 10 et 100 ne peuvent donc venir d'aucune fonction, ni pour un dessin (Courbe `pivot`, qui accepte a et b) ni pour un tableau (Grille `tableau`). 2. Aucune forme ne pose des points sur une relation courbe : Nuage `droite` tire ses points autour d'une droite (`tendance` [a, b], `calculs.nuage.autour_d_une_droite`) et trace toujours leur droite des moindres carrés ; Courbe `trace` dessine une courbe nommée (ondulee, parabole, fond_plat) sans points. 3. Nuage `droite` ne prend pas de points réels (A46 a) : ni les ventes d'Ames, ni une droite imposée (w, b) au lieu des moindres carrés ; une page Comparaison « même nuage, trois droites » est impossible. |
| Options | 1. En session de design : (a) dans calculs/ (ames.py ou cout.py), une fonction `descente_droite(eta, pas, depart=[0, 0])` : la descente de gradient de la MSE sur les ventes d'Ames (x en centaines de m², y en millions de FCFA), pas de MLCC « Gradient descent » (dérivées (2/n) Σ (ŷ − y)·x et (2/n) Σ (ŷ − y)), qui renvoie w, b et J à chaque itération demandée ; valeurs calculées pour vérification, départ (0 ; 0), η = 0,2 : itération 0, J ≈ 13 400 ; 10, w ≈ 57,5, b ≈ 27,9, J ≈ 1 085 ; 100, w ≈ 72,2, b ≈ 6,1, J ≈ 1 030 ; la droite des moindres carrés (w ≈ 73,6, b ≈ 4,0, J ≈ 1 030, 2 925 ventes) est atteinte vers 1 000 ; (b) une forme Nuage qui pose des points venus de calculs/ (un échantillon reproductible des ventes d'Ames, tiré avec une graine) et une droite (w, b) donnée, avec ses écarts, utilisable en Comparaison (mêmes points, `w` et `b` par cas ; « fantôme » de la droite finale en gris) ; (c) pour le Piège, un tirage autour d'une courbe (par exemple `tendance` du second degré dans `calculs.nuage`), la droite des moindres carrés et les écarts qui ont un motif (au-dessus aux deux bouts, en dessous au milieu) ; la même forme servira à la couverture et aux pages de l'épisode 14 (« courbe qui épouse un nuage de points courbe »). Images de référence et paramètres d'exemple à ajouter. Puis relancer `/episode 11`. 2. Produire 11 sans ces formes : page 4 en texte seul, page 6 avec des points tirés autour d'une droite ; la page 4 ne montre alors pas l'évolution de la droite, et la page 6 contredirait son propre message. |
| Choix provisoire | Aucun : l'épisode 11 est arrêté avant l'étape contenu (SKILL episode, étape 3 : « une page qui demande une forme absente : n'invente rien, arrête »). Faits : lecture et sources (sources/11/extraits.yaml, 40 extraits ; D2L 3.1, scikit-learn « Linear Models » 1.1, 1.1.1 et 1.1.16, et, ajoutés à la fiche 11 et à provenance.yaml : MLCC « Gradient descent », car la boucle de la page 3 et les dérivées de la page 5 avec le facteur 2 ne sont écrites que là ; De Cock 2011 et le cours BCEAO du 27 octobre 2026, fil rouge d'Ames et prix en FCFA). Plan prévu : p. 2 (Ouverture) rappel de 04 (a et b), 05 (la MSE) et 08 (la descente) ; ŷ = w·x + b, poids w et biais b, les noms d'usage du a et du b de l'épisode 04 (D2L : « weights », « bias ») ; w règle l'influence de la surface, b la prédiction pour une surface nulle (D2L) ; ajustement : choisir w et b pour coller au mieux, en moyenne, aux prix (D2L) ; cas particulier dit : une seule caractéristique, la surface (plusieurs à l'épisode 12) ; visuel Courbe `droite` (existant) ou nuage d'Ames (option 1 b). p. 3 (Mécanisme) Flux `page` en boucle (existant) : départ au hasard près de zéro, coût MSE, direction par le gradient, un pas, recommencer (MLCC ; D2L). p. 4 (Comparaison) trois droites sur les mêmes ventes, J sous chacune (option 1 a, b) ; nuance : après 100 itérations, la droite approche du creux sans l'atteindre exactement (D2L) ; un seul creux pour la MSE d'une droite (épisode 10 ; D2L : sous condition de rang plein). p. 5 (Formule) dérivées écrites sans ∂ (A57), par exemple « pente selon $w$ = {2}/{n} Σ (ŷᵢ − yᵢ)·xᵢ » et « pente selon $b$ = {2}/{n} Σ (ŷᵢ − yᵢ) » (MLCC) ; écart de notation : D2L met 1/2 dans le coût et n'a donc pas le 2 ; nuance : pour la droite, une formule directe (moindres carrés, scikit-learn ; D2L « analytically ») donne aussi le creux, la descente sert aux modèles qui n'en ont pas. p. 6 (Piège) des points sur une relation courbe, la droite des moindres carrés à côté (option 1 c) ; la régression linéaire suppose une relation à peu près linéaire (D2L, scikit-learn) ; remède annoncé : des fonctions non linéaires des données (scikit-learn 1.1.16), épisode 14. Titres d'encadré et de colonne sans lettre grecque ni variable (A58) ; ni ∂ ni ← (A57, A58) ; « épisode 04 » et non « Nº 04 » dans le texte courant (A46 e). |
| Impact si c'est faux | Épisode 11 en attente ; 12 et 13 (même chapitre) l'ont pour prérequis ; 14 a besoin du même nuage à relation courbe. |
| Gravité | Importante |
| Statut | Résolu le 2026-11-02 (session de design n° 2) : option 1. Calculs `descente_droite(eta, iterations, depart)` (w, b au dixième et J à l'unité à chaque itération demandée, sur toutes les ventes d'Ames ; départ (0 ; 0), η = 0,2 : 0 → J 13 400 ; 10 → 57,5, 27,9, J 1 085 ; 100 → 72,2, 6,1, J 1 030 ; 1 000 → 73,6, 4,0), `echantillon_ames(n, graine)` (vraies ventes, tirage reproductible), `points_surface_prix`, et `calculs.nuage.autour_d_un_polynome`. Forme Nuage `droite` étendue : `source: ames`, `polynome` (relation courbe), droite donnée par `descente` {eta, iteration, depart} ou `w` et `b`, `fantome` (droite des moindres carrés en gris), `alerte` ; utilisable en Comparaison (jusqu'à 3 cas). Pas de nouvelle couverture : la couverture Nuage (nuage et droite) convient. Planche Formes-Nuage refaite ; suite : 421. |

#### A62 · Nº 06 : la couverture Courbe ne dessine pas de tangentes

| Champ | Contenu |
| --- | --- |
| Nº | A62 |
| Jalon | 5 (production) |
| Fichier | bibliotheque/courbe.py (`_couverture`, `PARAMETRES`), tests/reference/Couvertures.png, tests/fixtures/couvertures.yaml, design/canevas-gabarits/Couvertures.dc.html ; contenu/06.yaml (couverture) |
| Question | Remarque de l'utilisateur (2026-11-03) : la couverture de 06 n'a aucun lien avec l'épisode. Son fond est l'éventail de droites qui pivotent de 04 (« changer a fait pivoter »), alors que la fiche 06 demande « une courbe avec des tangentes en plusieurs points ». |
| Options | 1. Courbe en U et trois tangentes (descend, plate au creux, monte), le robot pointe celle qui monte. 2. Courbe en U et une seule tangente avec son triangle de pente. 3. Tangentes pâles qui glissent le long du U, une marquée. |
| Choix provisoire | Aucun. |
| Impact si c'est faux | La couverture de 06 ne montre pas l'idée de l'épisode. |
| Gravité | Mineure |
| Statut | Résolu le 2026-11-03 (choix de l'utilisateur : option 1). Couverture Courbe `tangentes` : la parabole J(θ) = θ² (`Repere`), ses tangentes en tirets aux `points` (par défaut −2, 0, 3, comme la page Mécanisme), de même `longueur` quelle que soit la pente, celle du point `marque` (par défaut le dernier) marquée et cerclée ; opacité de calculs.couvertures. contenu/06.yaml : A et classique. Planche Couvertures refaite (13 couvertures, 4 910 px). |
### Production des épisodes 02 à 04

#### A43 · Références ajoutées aux fiches 02 et 03 pendant la production

| Champ | Contenu |
| --- | --- |
| Nº | A43 |
| Jalon | 5 (production) |
| Fichier | banque/episodes/02-*.yaml (références) ; provenance.yaml ; contenu/02.yaml, contenu/03.yaml |
| Question | La fiche 02 ne citait que la page MLCC « Feature vectors », qui ne parle ni d'étiquette ni d'image : peut-on ajouter des sources primaires pendant la production, et suivre les données sourcées plutôt que le message de la fiche ? |
| Options | 1. Garder les références ajoutées (glossaire MLCC, jeu UCI) et aligner les messages des fiches sur le contenu sourcé. 2. Retirer ces passages et s'en tenir à la référence d'origine. |
| Choix provisoire | Option 1, à valider : glossaire MLCC (étiquette, tableau des trois maisons) et jeu UCI (chiffres manuscrits) ajoutés à la fiche 02 (provenance : 139 références). Le contenu 02 suit le tableau sourcé (chambres, salles de bain, âge, prix) et non « surface, chambres, quartier, prix ». Épisode 03 : exemple des iris (DLB) au lieu de « prix » et « clients » ; « retour » au lieu de « récompense » (DLB parle de boucle de retour). |
| Impact si c'est faux | contenu/02.yaml, contenu/03.yaml, sources/02, fiche 02, provenance.yaml. |
| Gravité | Importante |
| Statut | Résolu le 2026-11-01 (décision de l'utilisateur, D1 de la relecture de 02) : option 1. Références ajoutées et gardées : glossaire MLCC, MLCC One-hot encoding, BCEAO, De Cock (2011). Jeu UCI retiré le 2026-10-30 avec la page qu'il appuyait. |

## Résolues

### A68 · Lien du site dans chaque post

| Champ | Contenu |
| --- | --- |
| Nº | A68 |
| Jalon | 5 (lancement) |
| Fichier | charte/texte-linkedin.md ; serie/publication.py (`liens_site`, `labos_du_site`) ; tests/test_publication.py ; publier/01 à 10 et bilan-1 |
| Question | La charte interdisait tout lien dans le texte (Q8 de `site/theta-kit/QUESTIONS-AUTOMATISATION.md`). Le site existe désormais : le post doit-il y renvoyer ? |
| Options | 1. Lien dans le texte du post. 2. Lien en premier commentaire. 3. Les deux. |
| Gravité | Importante |
| Statut | Résolue le 2026-11-08 |
| Décision | Décision de l'utilisateur (2026-11-08) : option 1. Après la signature, le code ajoute « À retrouver sur le site : https://theta-ml.vercel.app/fr/episodes/NN », puis une ligne « À manipuler dans le labo 3D : … » par labo de l'épisode (rattachement lu dans `site/theta-kit/data/episodes-affichage.json`) ; le bilan renvoie à l'accueil. Le texte rédigé reste sans lien. Risque accepté : LinkedIn peut moins diffuser un post avec un lien externe. Les dossiers 01 à 10 et bilan-1 sont régénérés ; seul `texte.txt` change, l'étape « publication » est réenregistrée et les statuts restent « relu ». |

### A63 · Texte du post : règles de theta-post à la place du gabarit en quatre blocs

| Champ | Contenu |
| --- | --- |
| Nº | A63 |
| Jalon | 5 (lancement) |
| Fichier | charte/texte-linkedin.md ; serie/schemas.py (`LinkedIn`) ; serie/publication.py ; tests/test_publication.py ; .claude/skills/episode/SKILL.md |
| Question | `theta-post/CLAUDE.md` demande une structure libre et une conclusion variée ; la charte et le code imposaient accroche, intuition, promesse, question, 120 mots minimum et #DataScience. Lequel fait foi ? |
| Gravité | Importante |
| Statut | Résolue le 2026-11-05 |
| Décision | Décision de l'utilisateur (2026-11-05) : les limites de theta-post s'appliquent. Bloc `linkedin` : `texte` libre, `hashtag`, `generique` optionnel (#DataScience par défaut). 60 à 220 mots, accroche de 3 lignes au plus, 4 à 5 hashtags, pas de question obligatoire, tiret long refusé. L'ancienne forme en quatre parties reste acceptée pour contenu/01 à 10 tant que les textes réécrits ne sont pas validés : aucun contenu, aucune empreinte d'étape ni aucun post de publier/ ne change. Une fois ces textes injectés, l'ancienne forme pourra être retirée. |

### A42 · Relecture de l'épisode 01, règles éditoriales et calendrier

| Champ | Contenu |
| --- | --- |
| Nº | A42 |
| Jalon | 5 (lancement) |
| Fichier | contenu/01.yaml ; charte/glossaire.yaml et fiches 01, 03 (« supervisé ») ; serie/verification.py (`controler_termes`) ; CLAUDE.md ; .claude/agents/relecteur.md ; .claude/skills/episode/SKILL.md ; calendrier.yaml ; provenance.yaml |
| Question | Comment appliquer les décisions de relecture de l'épisode 01 et la nouvelle méthode de travail ? |
| Gravité | Importante |
| Statut | Résolue le 2026-10-26 |
| Décision | Décisions de l'utilisateur (2026-10-26). Page 2 : l'exemple est dit « apprentissage supervisé » ; « supervisé » est introduit par l'épisode 01 (glossaire et fiches 01 et 03), « non supervisé » et « par renforcement » sont annoncés pour le Nº 03 ; un terme annoncé (même phrase que le numéro de l'épisode qui l'introduit) est admis par le contrôle. Spam : sourcé par le billet Google Workspace du 7 février 2019 (ajouté à la fiche 01 ; provenance.yaml : 137 références, 42 sources originales). Piège : formulations nuancées. Page 3 : « En 1959, Arthur Samuel emploie le terme machine learning dans le titre d'un article… » (version sourcée, au lieu de « popularise »). Règles éditoriales Théta et relecture vérifiée sur le web, rédigée en décisions (CLAUDE.md). Calendrier : lancement le mardi 10 novembre 2026, mardi et jeudi chaque semaine (le samedi des semaines impaires de A32 est retiré). |

### A40 · Légende d'ouverture et crédit en anglais (épisode 01)

| Champ | Contenu |
| --- | --- |
| Nº | A40 |
| Jalon | Production de l'épisode 01 (relecture) |
| Fichier | gabarits/style.css.j2 (`.legende` : Geist Mono 15 px, retrait de 40 px) ; serie/images.py (`credit`) |
| Question | (1) La légende sous le visuel d'ouverture, en Geist Mono 15 px décalée de 40 px, se lit mal sous un schéma Flux : faut-il la changer ? (2) Le crédit recopie la licence de la source, en anglais (« Photo : NASA · Public domain · Wikimedia Commons ») : faut-il la traduire (« Domaine public ») ? |
| Options | (1) Garder la légende du canevas 02-Ouverture, ou la passer en Geist 20 px sans retrait. (2) Garder la licence telle qu'écrite à la source, ou traduire les licences courantes (Public domain, CC BY…) dans le crédit. |
| Choix provisoire | Rien n'est changé : gabarits/ est verrouillé hors session de design, et la licence recopiée mot pour mot est la plus prudente (règle D2). |
| Impact si c'est faux | `.legende` (gabarits/style.css.j2) et la référence 02-Ouverture ; `credit` (serie/images.py) et les références Image-Contexte. |
| Gravité | Mineure |
| Statut | Résolue le 2026-10-26 |
| Décision | Décision de l'utilisateur (2026-10-26) : rien ne change. Légendes en français ; dans le crédit, seul le libellé est traduit (« Photo : »), auteur, source et licence restent d'origine (règle éditoriale de CLAUDE.md). |

### A41 · Style des couvertures d'épisode

| Champ | Contenu |
| --- | --- |
| Nº | A41 |
| Jalon | Production de l'épisode 01 |
| Fichier | design/propositions/couverture-n01.html (maquette de l'utilisateur) ; gabarits/couverture.html.j2, gabarits/style.css.j2 ; charte/charte.yaml (`titre_couverture`) ; bibliotheque/nuage.py (`_couverture`) |
| Question | La maquette de couverture fournie par l'utilisateur (titre 92 px, robot réduit, points et droite placés à la main, accroche allongée) vaut-elle pour l'épisode 01 seul ou pour toute la série, et ses points peuvent-ils rester placés à la main ? |
| Options | Portée : toutes les couvertures, famille Nuage seulement, épisode 01 seulement. Points : calculés ou coordonnées exactes. Accroche : celle de la fiche ou celle de la maquette. |
| Gravité | Importante |
| Statut | Résolue le 2026-10-26 (session de design) |
| Décision | Décision de l'utilisateur (2026-10-26) : toutes les couvertures d'épisode ; points calculés ; accroche de la fiche. |
| Réalisation | Couverture d'épisode : scène de 640 px, robot à 95 % (570 × 608 à 175, 32), fond décalé de −60 px, titre 92 px (`titre_couverture` ; le bilan garde 108 px, `titre_bilan`), accroche 820 px. Le signe final du grand titre (. ? !) est en accent. Fond Nuage : exemples de part et d'autre du robot autour d'une droite (calculs/couvertures.py, `nuage_droite`), droite des moindres carrés et écarts en pointillés, sans l'effacement vers le robot d'A11 ; les groupes (épisode 03) gardent leur motif. Titre de couverture facultatif dans le contenu (`PageCouverture.titre`). Canevas Main, références Main et Couvertures refaits ici. |

### A24 · Références Image-Contexte et Image-Capture périmées

| Champ | Contenu |
| --- | --- |
| Nº | A24 |
| Jalon | 2 |
| Fichier | tests/reference/Image-Contexte.png, Image-Capture.png ; tests/test_rendu.py (`MASQUES`) |
| Question | Ces deux références montrent le cadre « à déposer ici » (interdit par B6) et un crédit à l'ancien format (D5) : comment les comparer ? |
| Options | 1. Masquer la zone de l'image et celle du crédit, comparer tout le reste (titre, texte, légende, repères, en-tête, pied). 2. Régénérer ces deux références avec une image d'essai, dans une session de design. |
| Choix provisoire | Option 1 : la fixture rend une image d'essai unie ; 2 zones masquées sur Image-Contexte (image 923 × 523, crédit 497 × 36), 1 sur Image-Capture (écran 923 × 432), soit 34 % et 27 % de la page. Un test vérifie que les masques restent sous 35 %. |
| Impact si c'est faux | Régénérer les deux références (design/canevas-gabarits/Image-*.dc.html) et retirer `MASQUES`. |
| Gravité | Importante |
| Statut | Résolue le 2026-10-25 : Image-Contexte validée par l'utilisateur ; Image-Capture validée sous deux corrections, faites |
| Décision | Décision de l'utilisateur (2026-10-25) : Modifiée : les références Image-Contexte et Image-Capture seront régénérées pendant la session de design. Le masquage de la zone de l'image reste seulement en attendant. |
| Réalisation | Canevas Image-Contexte et Image-Capture mis à jour (image d'essai, crédit au format D5) ; références régénérées ici ; `MASQUES` et `test_masques_limites_aux_images` retirés ; planchers à 0. La capture se cadre en haut à gauche, comme dans son canevas. |
| Correctif | Rouverte par l'utilisateur : la zone de l'image était grise et vide dans les deux références. Cause : les images d'essai (tests/fixtures/images/) étaient d'une seule couleur, faites pour être masquées ; chemin et chargement étaient bons. Dans le canevas Image-Capture, le style de l'image se trouvait dans `<helmet>`, que l'étalon retire : l'image y était à sa taille d'origine, en couleur. Corrigé : mires d'essai structurées (tests/fixtures/images/generer.py), style de l'image en ligne dans le canevas, références régénérées (rendu = canevas, 0 px). Garde-fous : `photographier` refuse une image non chargée ; `serie verifier` refuse une zone image vide ou uniforme (écart type de la luminance sous 8, surlignage et badge masqués), erreur bloquante ; tests dans tests/test_images.py, dont un sur les deux références. |
| Correctif 2 | Demandé par l'utilisateur sur Image-Capture. Badge et cadre réunis : le badge est dans le cadre d'accent, une seule position (`annotation.haut`, `hauteur` d'au moins 40 px), ils ne peuvent plus se séparer. L'écran de la capture s'étend jusqu'au pied (430 px au moins, charte) quand la page n'a pas d'autre bloc : vide sous la légende 52 px au lieu de 242 (seuil C3 287). Mire de capture 1200 × 840. Test du badge dans le cadre. |

### A39 · Visuel de l'ouverture de l'épisode 03

| Champ | Contenu |
| --- | --- |
| Nº | A39 |
| Jalon | Session de design n° 1 |
| Fichier | banque/episodes/03-*.yaml (page 2, Ouverture : « les trois grandes familles en trois colonnes ») ; BRIEF-SESSION-DESIGN.md, section 3 |
| Question | Quel visuel pour l'ouverture de l'épisode 03, obligatoire (C2), alors que le gabarit d'ouverture ne prend qu'un visuel d'une seule famille ? |
| Options | 1. Trois petits panneaux (nuage coloré, nuage gris, boucle Flux) : une nouvelle forme composée, à dessiner en session. 2. Un Flux `page` sur trois lignes étiquetées (supervisé, non supervisé, renforcement), forme existante ; mais la boucle de retour ne se dessine que sur une ligne seule. 3. Un Nuage `points` seul (avec étiquettes), le renforcement renvoyé à sa page. |
| Impact si c'est faux | Une forme de plus dans bibliotheque/ (option 1) ou seulement le contenu de l'épisode 03 (options 2 et 3). |
| Gravité | Importante (bloquait l'ouverture de l'épisode 03) |
| Statut | Résolue le 2026-10-25 (session de design n° 1) |
| Décision | Décision de l'utilisateur (2026-10-25) : option 1, trois panneaux. La règle « même visuel » ne vaut que pour les pages Comparaison. |
| Réalisation | Forme `panneaux` de la famille Nuage : le même nuage (tirage de calculs/nuage.py) coloré par étiquette, puis tout gris, puis une boucle de la grammaire Flux (agir, récompense, retour « recommencer » en accent) ; un titre sous chaque panneau. Planche Formes-Nuage. |

### A12 · Visuels de pages intérieures hors famille Courbe

| Champ | Contenu |
| --- | --- |
| Nº | A12 |
| Jalon | 2 |
| Fichier | design/canevas-gabarits/Bib-Visuels.dc.html (vignettes 264 × 112) ; charte/bibliotheque-visuelle.md |
| Question | À quelle taille et avec quelle mise en page rendre les familles Nuage, Réseau, Barres, Niveaux, Blocs, Grille, Arbre et Flux sur une page de contenu (920 px de large) ? |
| Options | 1. Dessiner leurs formes pleine largeur dans une session de design. 2. Agrandir la vignette. |
| Choix provisoire | Aucune forme pleine largeur n'est inventée : seules les vignettes existent. Seule la Courbe a des formes de page (descente, pentes, comparaison, plancher, iterations), reprises des pages de l'épisode 08. Les épisodes 02 à 04 en auront besoin au jalon 4. |
| Impact si c'est faux | Ajouter des formes aux modules de `bibliotheque/`, comme pour `courbe.py`. |
| Gravité | Importante |
| Statut | Résolue le 2026-10-25 (session de design n° 1) |
| Décision | Décision de l'utilisateur (2026-10-25) : Option 1 : une forme pleine page par famille (Nuage, Réseau, Barres, Grille, Arbre, Flux), avec le carrousel de l'épisode 08 comme référence de style, de densité et de hiérarchie. Bloquant pour les épisodes 02 à 04. |
| Réalisation | Formes de page Grille (`ligne`, `tableau`, `pixels`), Courbe en droites (`droite`, `pivot`, `decalage`), Nuage (`points` avec `etiquettes`, `zone` et `hors_zone`, `groupes`, `droite`, `frontiere`). Calculs : calculs/grille.py (chiffres manuscrits UCI, CC BY 4.0), calculs/droite.py (partagé Courbe et Nuage), calculs/nuage.py. Planches Formes-Grille, Formes-Courbe, Formes-Nuage (canevas, références, fidélité). Réseau, Barres, Blocs, Arbre : formes de page hors priorité (premiers besoins aux épisodes 19, 20, 31, 37), pour une prochaine session. |

### A11 · Couvertures des familles autres que Lignes de niveau

| Champ | Contenu |
| --- | --- |
| Nº | A11 |
| Jalon | 2 |
| Fichier | design/canevas-gabarits/Main.dc.html (seul fond pleine page, famille niveaux) ; Bib-Motifs.dc.html (vignettes 400 × 170) |
| Question | Quel fond de couverture dessiner pour les 56 épisodes dont la famille n'est pas « niveaux » ? |
| Options | 1. Agrandir la vignette de la planche Bib-Motifs derrière le robot. 2. Dessiner un fond pleine page par famille dans une session de design. |
| Choix provisoire | Option 1, provisoire (`bibliotheque/_planche.py`, forme `couverture`) : c'est le seul dessin validé de ces familles. Le résultat (couverture de l'épisode 01) est lisible mais plus chargé que celle du 08 : les traits de la vignette, agrandis 2,7 fois, passent près du robot. |
| Impact si c'est faux | Remplacer la forme `couverture` de chaque famille (`bibliotheque/<famille>.py`) ; régénérer les couvertures déjà rendues. |
| Gravité | Importante |
| Statut | Résolue le 2026-10-25 (session de design n° 1) |
| Décision | Décision de l'utilisateur (2026-10-25) : Modifiée : l'agrandissement ×2,7 de la vignette est abandonné. Chaque famille aura son propre motif de fond, recadré et très atténué, pour que le robot reste dominant comme sur la famille Lignes de niveau. Même session que A12. |
| Réalisation | Un motif de fond par famille, calculé par calculs/couvertures.py : en haut et à droite, effacé vers le robot (0,08 à 0,6, surfaces pleines à 40 %), éteint avant le titre, un élément marqué ; graine et paramètres pour distinguer deux épisodes voisins. La Courbe a son fond (éventail de droites). Planche Couvertures (9 couvertures rendues par le gabarit, 08 en modèle). L'agrandissement de bibliotheque/_planche.py est retiré. |

### A25 · Forme pleine page de la famille Flux

| Champ | Contenu |
| --- | --- |
| Nº | A25 |
| Jalon | 2 |
| Fichier | bibliotheque/flux.py (forme `page`) ; design/canevas-gabarits/Bib-Visuels.dc.html (vignette seule) |
| Question | Les consignes B6, D6 et E2 demandent un visuel Flux pleine largeur, que seul la vignette 264 × 112 dessine : est-ce la bonne mise en page ? |
| Options | 1. Agrandir la grammaire de la vignette (boîtes blanches arrondies, flèches pleines, boucle accent), sur plusieurs lignes et avec des sorties empilées. 2. Dessiner la forme dans une session de design. |
| Choix provisoire | Option 1 : boîtes de 76 px, texte Geist 24 px (au-dessus du minimum de 20 px), flèches de 64 px, boucle de retour en accent ; tons « objet » (noir) et « contexte » (gris), accent par boîte (« ! »). |
| Impact si c'est faux | `_page` dans bibliotheque/flux.py ; les pages qui l'emploient (capture sans image, ouvertures). |
| Gravité | Mineure |
| Statut | Résolue le 2026-10-25 (session de design n° 1) |
| Décision | Décision de l'utilisateur (2026-10-25) : Choix provisoire gardé, à valider à l'œil pendant la session de design. |
| Réalisation | Choix provisoire validé à l'œil sur ses trois usages (planche Formes-Flux). Une correction : chasse de Geist 500 mesurée à 0,52 (0,56 avant), qui coupait « Données + réponses » à tort. |

### A22 · Pages de fin du dernier épisode d'une saison et de l'épisode 62

| Champ | Contenu |
| --- | --- |
| Nº | A22 |
| Jalon | 2 |
| Fichier | charte/decisions-automatisation.md §9.3 ; `episode_suivant` dans serie/rendu.py |
| Question | Comment afficher « Prochainement : le bilan de la saison N » et « Fin de la série · merci de l'avoir suivie » dans le bloc « épisode suivant » ? |
| Options | 1. Étiquette « Prochainement » ou « Fin de la série », titre « Le bilan de la saison N » ou « Merci de l'avoir suivie ». 2. Un dessin dédié. |
| Choix provisoire | Option 1, testée sur le texte mais sur aucune image de référence. |
| Impact si c'est faux | `episode_suivant` (serie/rendu.py). |
| Gravité | Mineure |
| Statut | Résolue le 2026-10-25 (session de design n° 1) |
| Décision | Décision de l'utilisateur (2026-10-25) : Validée avec précision. Fait : le dernier épisode d'une saison annonce la saison suivante (« Bilan, puis saison N+1 · Nº XX », titre et transition du premier épisode de la saison suivante ; même annonce dans la signature du post). Reste : un vrai bloc de clôture de la série pour l'épisode 62, à dessiner en session de design. |
| Réalisation | Bloc de clôture de l'épisode 62 : « Fin de la série », « Merci de l'avoir suivie », les 4 saisons et leurs épisodes, l'invitation à relire le sommaire de chaque saison ; même source pour la signature du post (`episode_suivant`). Référence Fin-Serie. |

### A35 · Page de fin du post bilan

| Champ | Contenu |
| --- | --- |
| Nº | A35 |
| Jalon | 4 |
| Fichier | charte/bibliotheque-visuelle.md (« Fin : le gabarit de fin habituel, avec « Saison N+1 : reprise le [date] » ») ; gabarits/fin.html.j2 ; serie/rendu.py (`rendre_bilan`) |
| Question | Le gabarit de fin exige 3 points à retenir et un encadré « Vérifiez-vous », qu'un bilan n'a pas. Comment rendre la fin du bilan ? |
| Options | 1. Variante du gabarit de fin pour le bilan (sans points ni encadré, avec la date de reprise), dessinée en session de design. 2. Donner au bilan 3 points et une question. |
| Choix provisoire | Aucun : `serie bilan N` rend la couverture et le sommaire seulement ; /bilan signale la page manquante. Modifier gabarits/ est interdit hors session de design. |
| Impact si c'est faux | `pages_bilan_html` (serie/rendu.py) ; un gabarit ou une variante dans gabarits/. |
| Gravité | Importante |
| Statut | Résolue le 2026-10-25 (session de design n° 1) |
| Réalisation | Option 1 : le gabarit de fin sans points ni « Vérifiez-vous », « Saison N+1 : reprise le [jour] » (« prochainement » sans date de lancement), les chapitres de la saison suivante, son premier épisode ; après la saison 4, les saisons et la clôture. `pages_bilan_html` rend 3 pages. Référence Bilan-Fin. |

### A38 · Visuels des épisodes 01 (piège) et 03 (comparaison, renforcement)

| Champ | Contenu |
| --- | --- |
| Nº | A38 |
| Jalon | 4 (préparation de la session de design) |
| Fichier | banque/episodes/03-*.yaml (page 3, Comparaison : supervisé, non supervisé, renforcement) ; banque/episodes/01-*.yaml (page 5, Piège) ; BRIEF-SESSION-DESIGN.md, section 3 |
| Question | La Comparaison de l'épisode 03 demande « le même visuel, mêmes axes », ce que le renforcement ne permet pas. Quel visuel pour le piège de l'épisode 01 ? |
| Options | 1. Comparaison à deux panneaux, renforcement sur une page à part. 2. Un panneau Flux parmi deux panneaux Nuage. |
| Gravité | Importante |
| Statut | Résolue le 2026-10-25 |
| Décision | Décision de l'utilisateur (2026-10-25). Épisode 03 : la Comparaison oppose supervisé et non supervisé, même nuage, mêmes axes, seul change le fait que les points soient colorés par étiquette ou tous gris ; le renforcement va sur une page à part (Mécanisme, après la Comparaison), en Flux avec boucle de retour : l'épisode passe à 6 pages (format court). Épisode 01, Piège : Nuage `points`, la zone couverte par les exemples en contexte, un point hors de cette zone en alerte. La fiche n'est pas modifiée : cette décision prime sur elle. |

### A36 · Protection des dossiers verrouillés par le shell

| Champ | Contenu |
| --- | --- |
| Nº | A36 |
| Jalon | 4 |
| Fichier | .claude/hooks/proteger.py |
| Question | Le hook refuse les écritures de Write et Edit dans gabarits/, bibliotheque/, charte/, design/, tests/reference/. Comment traiter Bash et PowerShell ? |
| Options | 1. Refuser une commande qui nomme un dossier verrouillé avec une opération d'écriture courante (redirection, cp, mv, rm, sed -i, tee, Set-Content, Copy-Item, git checkout…). 2. Refuser toute commande qui nomme un dossier verrouillé. |
| Choix provisoire | Option 1 : l'option 2 bloquerait les lectures (cat, grep) et les commits. Limite connue : un script (python -c, heredoc) qui écrit lui-même un fichier n'est pas détecté ; la règle de CLAUDE.md reste la première protection. |
| Impact si c'est faux | `ECRITURE` et `MOTIF_DOSSIERS` (.claude/hooks/proteger.py) ; tests/test_hooks.py. |
| Gravité | Mineure |
| Statut | Résolue le 2026-10-25 |
| Décision | Décision de l'utilisateur (2026-10-25) : choix provisoire validé par défaut, il ne bloque rien. |

### A37 · Ordre des étapes « contenu », « linkedin » et « images »

| Champ | Contenu |
| --- | --- |
| Nº | A37 |
| Jalon | 4 |
| Fichier | conception/plan-automatisation.md (11.3 : texte LinkedIn à l'étape 7) ; serie/reprise.py (`ETAPES`) ; .claude/skills/episode/SKILL.md |
| Question | Le texte du post (bloc `linkedin`) et l'image retenue (`image.fichier`) s'écrivent dans contenu/NN.yaml. Écrits après le rendu ou la relecture, ils changent l'empreinte du contenu et font paraître rendu, vérification et relecture « à refaire ». |
| Options | 1. Écrire le texte du post avec le contenu (étape « linkedin » juste après « contenu ») et enregistrer contenu, linkedin et images ensemble, une fois l'image choisie. 2. Garder l'ordre de 11.3 et exclure ces champs de l'empreinte. |
| Choix provisoire | Option 1 : l'empreinte reste celle du fichier entier (aucune modification n'échappe à la reprise), et le relecteur relit aussi le texte du post. |
| Impact si c'est faux | `ETAPES` (serie/reprise.py) ; étapes 3 et 4 de /episode. |
| Gravité | Mineure |
| Statut | Résolue le 2026-10-25 |
| Décision | Décision de l'utilisateur (2026-10-25) : choix provisoire validé par défaut, il ne bloque rien. |

### A34 · Hashtags du post et #ThetaML

| Champ | Contenu |
| --- | --- |
| Nº | A34 |
| Jalon | 4 |
| Fichier | charte/texte-linkedin.md (« 3 à 5, toujours les mêmes plus un propre au sujet ») ; charte/charte.yaml (`hashtag_propose: '#ThetaML'`, « à vérifier sur LinkedIn avant le lancement ») ; serie/publication.py |
| Question | Le hashtag de série #ThetaML doit-il être ajouté à chaque post ? |
| Options | 1. Pas encore : 3 hashtags fixes (#MachineLearning #IntelligenceArtificielle #DataScience) + celui du sujet, écrit par l'agent dans le bloc `linkedin`. 2. Ajouter #ThetaML dès maintenant (5 hashtags). |
| Choix provisoire | Option 1 : la charte demande de vérifier #ThetaML avant le lancement. Une fois vérifié, l'ajouter à `HASHTAGS_FIXES` donne 5 hashtags, toujours dans la limite. |
| Impact si c'est faux | `HASHTAGS_FIXES` (serie/publication.py) ; `test_texte_compose`. |
| Gravité | Mineure |
| Statut | Résolue le 2026-10-25 |
| Décision | Décision de l'utilisateur (2026-10-25) : #ThetaML est libre sur LinkedIn. Il termine chaque post, écrit exactement #ThetaML (T et ML en majuscules), après les hashtags fixes et celui du sujet (`HASHTAG_SERIE`, serie/publication.py ; `serie.hashtag` dans charte.yaml). Un post sans #ThetaML, ou qui l'écrit autrement, est une erreur : `controler_hashtag_serie`, appliqué par `serie verifier`, `serie publier` et `serie valider` (posts de publier/NN/texte.txt). |

### A15 · Page de fin : invitation au lieu de la transition

| Champ | Contenu |
| --- | --- |
| Nº | A15 |
| Jalon | 2 |
| Fichier | design/canevas-gabarits/08-Fin.dc.html ; charte/decisions-automatisation.md §9.3 (« Numéro, titre et phrase de transition ») |
| Question | Sous le titre de l'épisode suivant, faut-il la phrase de transition de la fiche, ou l'invitation « Suivez la série et enregistrez ce carrousel pour le relire. » du canevas ? |
| Options | 1. Le canevas (invitation fixe). 2. 9.3 (transition de la fiche). |
| Choix provisoire | Option 1 : le canevas sert de référence pixel. La transition des fiches n'est pas affichée. |
| Impact si c'est faux | `INVITATION` et `episode_suivant` dans `serie/rendu.py`. |
| Gravité | Mineure |
| Statut | Résolue le 2026-10-25 |
| Décision | Décision de l'utilisateur (2026-10-25) : Modifiée : la page de fin affiche la phrase de transition de la fiche sous le titre de l'épisode suivant (Geist 22 px 500), puis l'invitation fixe du canevas. Gabarit fin, canevas 08-Fin.dc.html et tests/reference/08-Fin.png (régénérée ici) mis à jour. |

### A20 · Couleurs des canevas absentes de charte.yaml

| Champ | Contenu |
| --- | --- |
| Nº | A20 |
| Jalon | 2 |
| Fichier | charte/charte.yaml ; gabarits/style.css.j2 ; bibliotheque/ |
| Question | Faut-il ajouter à la charte les quelques couleurs des canevas qu'elle ne nomme pas ? |
| Options | 1. Les ajouter à charte.yaml. 2. Les garder en dur. |
| Choix provisoire | Option 2 : #EEF1F5 (fond des images en attente), #8A919C (icônes, flèche du gradient), #1B2533 (bord des cartes de planche), #C9D3DF (texte des blocs sur fond sombre) restent en dur. Toutes les autres valeurs viennent de charte.yaml. |
| Impact si c'est faux | charte/charte.yaml, gabarits/style.css.j2, `theme()` dans serie/rendu.py. |
| Gravité | Mineure |
| Statut | Résolue le 2026-10-25 |
| Décision | Décision de l'utilisateur (2026-10-25) : Modifiée : les 4 couleurs sont dans charte.yaml (`couleurs.complements` : fond_image, icone, bord_carte, texte_bloc_sombre) ; plus aucune couleur en dur dans le code. |

### A23 · Terme « modèle » sur l'épisode 01

| Champ | Contenu |
| --- | --- |
| Nº | A23 |
| Jalon | 2 |
| Fichier | design/canevas-gabarits/Image-Capture.dc.html (« on montre au modèle ») et Image-Contexte.dc.html (« le modèle utilisé ») ; charte/glossaire.yaml (« modèle » introduit par l'épisode 04) |
| Question | Le canevas validé de l'épisode 01 emploie « modèle » avant son introduction : faut-il réécrire ces phrases ? |
| Options | 1. Réécrire les deux phrases (et régénérer Image-Capture.png, Image-Contexte.png). 2. Tolérer, l'un des deux emplois (« le modèle d'ordinateur ») n'étant pas le terme du glossaire. |
| Choix provisoire | Le texte du canevas est gardé mot pour mot. Le contrôle des termes (jalon 3) le signalera. |
| Impact si c'est faux | contenu/01.yaml et les deux images de référence. |
| Gravité | Mineure |
| Statut | Résolue le 2026-10-25 |
| Décision | Décision de l'utilisateur (2026-10-25) : Modifiée : « modèle » est un terme introduit par l'épisode 01 (fiche 01 et charte/glossaire.yaml), et non plus par l'épisode 04. Le canevas reste mot pour mot ; le signalement disparaît. |

### A28 · Formes du glossaire et mots courants

| Champ | Contenu |
| --- | --- |
| Nº | A28 |
| Jalon | 3 |
| Fichier | BRIEF-CONSTRUCTION.md (« compléter les formes de charte/glossaire.yaml ») ; NUIT.md (charte/ interdit) ; serie/donnees/formes-glossaire.yaml |
| Question | Où compléter les formes, et que faire des termes qui sont aussi des mots courants (« valeur » est introduit à l'épisode 57, mais le canevas validé de l'épisode 08 écrit « trois valeurs de η ») ? |
| Options | 1. Formes ajoutées dans serie/donnees/ ; terme technique → erreur, mot courant → avertissement à relire. 2. Compléter charte/glossaire.yaml et tout traiter en erreur. |
| Choix provisoire | Option 1. Le code dérive les formes (sans symbole, sans parenthèse, pluriel régulier) ; le fichier ajoute verbes et adjectifs (diverge, converge, entraîner…) et liste 37 mots courants (erreur, pente, valeur, contexte, classe, précision…). |
| Impact si c'est faux | Déplacer les formes dans charte/glossaire.yaml (`charger_termes`, serie/verification.py) ; revoir la liste `courants`. |
| Gravité | Importante |
| Statut | Résolue le 2026-10-25 |
| Décision | Décision de l'utilisateur (2026-10-25) : Option 1 : terme technique introduit trop tôt = erreur ; mot courant de la liste des 37 = avertissement à relire. |

### A29 · Lettres grecques hors formule

| Champ | Contenu |
| --- | --- |
| Nº | A29 |
| Jalon | 3 |
| Fichier | bibliotheque/courbe.py (étiquette « paramètre θ » en Geist) ; tableau de l'exemple chiffré (« Pente 2θ » en Geist Mono) ; canevas 02 à 07 |
| Question | Geist et Geist Mono n'ont pas de lettres grecques : le θ de ces étiquettes est dessiné par une police du système (Arial ou Consolas ici, autre chose sur l'ordinateur des références). Faut-il le corriger ? |
| Options | 1. Avertissement : les canevas validés font de même. 2. Erreur, et passer ces θ en STIX dans une session de design (références à régénérer). |
| Choix provisoire | Option 1 pour les lettres grecques seules ; toute autre police du système (✓, flèche en Geist Mono…) est une erreur bloquante. Dans le texte des pages, l'agent écrit les symboles entre $, en STIX. |
| Impact si c'est faux | `controler_mesures` ; bibliotheque/courbe.py, gabarits/exemple.html.j2 et les références 02 à 07. |
| Gravité | Mineure |
| Statut | Résolue le 2026-10-25 |
| Décision | Décision de l'utilisateur (2026-10-25) : Modifiée : une police contenant les lettres grecques est embarquée pour Geist et Geist Mono : le sous-ensemble grec de STIX Two Text (police des formules), règle de complément `polices.grecques` de charte.yaml (U+0370-03FF). Un θ dessiné par une police du système est une erreur bloquante. Planchers de tests/test_rendu.py remesurés (02, 03, 06, 07). |

### A30 · Nombres d'origine historique ou sourcée

| Champ | Contenu |
| --- | --- |
| Nº | A30 |
| Jalon | 3 |
| Fichier | CLAUDE.md (« Chaque chiffre et chaque courbe viennent d'une fonction de calculs/ ») ; `controler_nombres` (serie/verification.py) |
| Question | Une date (1959) ou un chiffre de cours (« entre 0,001 et 0,1 ») doivent-ils venir d'une fonction de calculs/ ? |
| Options | 1. Un nombre affiché est admis s'il vient d'un calcul ou d'un paramètre du contenu, ou s'il figure dans un extrait de sources/NN/ ou dans la fiche. 2. Tout nombre passe par calculs/, y compris les dates. |
| Choix provisoire | Option 1 : un calcul ne peut pas produire une date ; l'extrait de source en est la preuve. Les nombres dans les formules ($…$), les numéros d'épisode (Nº 05) et de page sont exclus. |
| Impact si c'est faux | `controler_nombres` ; ajouter des fonctions de données sourcées dans calculs/. |
| Gravité | Importante |
| Statut | Résolue le 2026-10-25 |
| Décision | Décision de l'utilisateur (2026-10-25) : Option 1. Précision : une date historique doit venir d'un extrait de source traçable. `controler_nombres` n'admet une année (1000 à 2099) que si elle figure dans un extrait de sources/NN/ ; la fiche ne suffit plus pour une date. |

### A32 · Alternance des semaines entre deux saisons

| Champ | Contenu |
| --- | --- |
| Nº | A32 |
| Jalon | 4 |
| Fichier | charte/decisions-automatisation.md (9.7) ; calendrier.yaml (`pause_entre_saisons_semaines`) ; serie/calendrier.py |
| Question | Après la pause entre deux saisons, la nouvelle saison commence-t-elle par une semaine impaire (3 posts) ou continue-t-elle l'alternance de la saison précédente ? Les semaines de pause comptent-elles ? |
| Options | 1. Chaque saison recommence sur une semaine impaire ; la pause compte en semaines pleines sans post, après la semaine du bilan. 2. L'alternance continue d'une saison à l'autre, pause comprise. |
| Choix provisoire | Option 1 : c'est la seule qui redonne pour la saison 1 les « 20 posts sur 8 semaines (4 à 3 posts, 4 à 2) » de 9.7, et elle s'applique de la même façon à chaque saison. Lancement un mardi 3 novembre 2026 → bilan 1 le jeudi 24 décembre, épisode 20 le mardi 12 janvier 2027. |
| Impact si c'est faux | `dates_prevues` (serie/calendrier.py) ; `test_dates_de_la_saison_1`. |
| Gravité | Mineure |
| Statut | Résolue le 2026-10-25 |
| Décision | Décision de l'utilisateur (2026-10-25) : Option 1 : chaque saison, y compris après une pause, commence par une semaine à 3 posts. |

### A33 · Longueur de l'accroche LinkedIn

| Champ | Contenu |
| --- | --- |
| Nº | A33 |
| Jalon | 4 |
| Fichier | charte/texte-linkedin.md (« 2 lignes maximum, visibles avant voir plus ») ; serie/publication.py |
| Question | Comment contrôler qu'une accroche reste visible avant « voir plus » ? LinkedIn coupe selon la largeur de l'écran, pas selon les retours à la ligne. |
| Options | 1. 2 lignes au plus dans le contenu (erreur), et un avertissement au-delà de 210 caractères. 2. Une limite stricte en caractères. |
| Choix provisoire | Option 1 : 210 caractères est un ordre de grandeur, pas une règle publiée par LinkedIn ; un avertissement se relit, une erreur bloquerait à tort. |
| Impact si c'est faux | `CARACTERES_ACCROCHE` et `controler_linkedin` (serie/publication.py). |
| Gravité | Mineure |
| Statut | Résolue le 2026-10-25 |
| Décision | Décision de l'utilisateur (2026-10-25) : Option 1, avec un avertissement à partir de 150 caractères (coupure « voir plus » sur mobile) au lieu de 210 : `CARACTERES_ACCROCHE`. |

### A18 · Rendu des rôles Définition et Remèdes

| Champ | Contenu |
| --- | --- |
| Nº | A18 |
| Jalon | 2 |
| Fichier | décision A02 (« panneau = phrase définie ; lignes = liste numérotée ») ; gabarits/formule.html.j2 |
| Question | Quel style pour une phrase dans le panneau et pour des lignes numérotées, que le canevas ne montre pas ? |
| Options | 1. Le style choisi ci-dessous. 2. Un dessin dans une session de design. |
| Choix provisoire | Phrase en Geist 38 px (taille des points de la page de fin), centrée ; numéros « 01 », « 02 » en Geist Mono 20 px accent, comme la page de fin. Aucune image de référence ne le vérifie. |
| Impact si c'est faux | `.panneau .phrase` et `.numero-ligne` dans gabarits/style.css.j2. |
| Gravité | Mineure |
| Statut | Résolue le 2026-10-25 |
| Décision | Décision de l'utilisateur (2026-10-25) : Choix provisoire validé tel quel. |

### A19 · Réglages de placement dans les paramètres des visuels

| Champ | Contenu |
| --- | --- |
| Nº | A19 |
| Jalon | 2 |
| Fichier | contenu/08.yaml (`origine`, `echelle`, `axe`, `decalage`, `decalages`) ; bibliotheque/courbe.py |
| Question | Le contenu peut-il porter des réglages de placement en pixels (origine du repère, décalage d'une étiquette) ? |
| Options | 1. Oui, comme paramètres de la famille. 2. Non : la famille calcule tout seule ses placements. |
| Choix provisoire | Option 1, limitée : les valeurs (θ, pentes, erreurs) viennent toujours de calculs/ ; seuls le repère et quelques décalages d'étiquettes, placés à la main dans le canevas, sont des paramètres. Sans eux, la fidélité au canevas n'est pas atteignable. |
| Impact si c'est faux | `bibliotheque/courbe.py` et le contrôle des paramètres autorisés (jalon 3). |
| Gravité | Mineure |
| Statut | Résolue le 2026-10-25 |
| Décision | Décision de l'utilisateur (2026-10-25) : Choix provisoire validé tel quel. |

### A21 · Couverture de bilan pour une saison de 1 à 3 chapitres

| Champ | Contenu |
| --- | --- |
| Nº | A21 |
| Jalon | 2 |
| Fichier | design/canevas-gabarits/Bilan-Couverture.dc.html (saison 1, 4 chapitres) ; `orbite()` dans serie/rendu.py |
| Question | Quelle luminosité donner à chaque chapitre quand une saison n'en a pas quatre (saison 2 : 3, saison 3 : 2, saison 4 : 1) ? |
| Options | 1. +0,2 d'opacité par chapitre, le dernier à 1 (règle déduite du canevas). 2. Une échelle dessinée par saison. |
| Choix provisoire | Option 1. Le canevas donne 0,35, 0,55, 0,75 et 1 pour le trait, 0,64, 0,75, 0,86 et 1 pour le texte. La page de fin du bilan (« Saison N+1 : reprise le… ») viendra avec /bilan au jalon 4. |
| Impact si c'est faux | `orbite()` dans serie/rendu.py. |
| Gravité | Mineure |
| Statut | Résolue le 2026-10-25 |
| Décision | Décision de l'utilisateur (2026-10-25) : Choix provisoire validé tel quel. |

### A26 · Mise en page de la variante Contexte sans image

| Champ | Contenu |
| --- | --- |
| Nº | A26 |
| Jalon | 2 |
| Fichier | gabarits/contexte.html.j2 ; gabarits/style.css.j2 (`.a-la-place`, `.frise`) |
| Question | « La frise agrandie, le texte à la place de la photo » : quelle forme exacte ? |
| Options | 1. Le texte de la page, en 34 px, dans le cadre même de la photo (920 × 520, fond panneau, coins 20 px), puis la frise des repères avec une ligne, un point par date, dates Geist Mono 40 px et faits 26 px. 2. Le texte à sa place habituelle et une frise verticale. |
| Choix provisoire | Option 1 : c'est la seule qui remplit la page sous le seuil C3 (vide de 157 px sur la fixture, seuil 287). |
| Impact si c'est faux | Les deux fichiers ci-dessus. |
| Gravité | Mineure |
| Statut | Résolue le 2026-10-25 |
| Décision | Décision de l'utilisateur (2026-10-25) : Choix provisoire validé tel quel. |

### A27 · Place de l'encadré « Vérifiez-vous »

| Champ | Contenu |
| --- | --- |
| Nº | A27 |
| Jalon | 2 |
| Fichier | design/canevas-gabarits/08-Fin.dc.html (modifié, B5) ; tests/reference/08-Fin.png (régénérée ici) |
| Question | Où placer l'encadré entre « À retenir » et « Épisode suivant » sans gêner le robot ? |
| Options | 1. Colonne de gauche (380 px), juste au-dessus de l'épisode suivant, carte blanche à coins de 20 px. 2. Pleine largeur sous les points, au risque de toucher la baguette (pointe à x = 483, y = 735). |
| Choix provisoire | Option 1 : étiquette Geist Mono 15 px accent, question Geist 24 px 500, « Réponse : page N » Geist Mono 15 px. Une question de 30 mots tient en 7 lignes ; le contrôle de débordement (jalon 3) vérifie la place. |
| Impact si c'est faux | Le canevas, la référence 08-Fin.png, `.verifiez` dans gabarits/style.css.j2. |
| Gravité | Mineure |
| Statut | Résolue le 2026-10-25 |
| Décision | Décision de l'utilisateur (2026-10-25) : Choix provisoire validé tel quel. |

### A31 · Mots comptés par page

| Champ | Contenu |
| --- | --- |
| Nº | A31 |
| Jalon | 3 |
| Fichier | charte/regles-redaction.md (« 40 mots maximum sur l'ouverture, 70 sur une page de contenu ») ; `controler_mots` |
| Question | Quels textes compter : tout ce qui est affiché, ou le titre et le texte ? |
| Options | 1. Titre + texte (+ conclusion de l'exemple). 2. Tout (encadrés, cas, légendes). |
| Choix provisoire | Option 1 : avec l'option 2, les pages validées de l'épisode 08 dépasseraient la limite (comparaison : 77 mots). La ligne de rappel et la légende de l'ouverture ne comptent pas (l'ouverture validée fait 40 mots avec le rappel, 28 sans). |
| Impact si c'est faux | `controler_mots` (serie/verification.py). |
| Gravité | Mineure |
| Statut | Résolue le 2026-10-25 |
| Décision | Décision de l'utilisateur (2026-10-25) : Choix provisoire validé tel quel. |

### A10 · Rôle « Problème » sans gabarit

| Champ | Contenu |
| --- | --- |
| Nº | A10 |
| Jalon | Décisions A01 à A09 |
| Fichier | charte/architecture-carrousel.md, « Les types de pages de contenu » (Problème) ; décision A02 |
| Question | Avec quel gabarit rendre une page de rôle « Problème », absente de la liste de A02 ? |
| Options | 1. Mécanisme, comme l'intuition (« problème ou mécanisme » dans l'ordre conseillé). 2. Le refuser tant qu'aucune fiche ne l'emploie. |
| Choix provisoire | Option 2 : aucune des 62 fiches n'a de page Problème. Le schéma des fiches l'accepte, mais `serie valider` bloque une fiche qui l'emploierait, et un contenu ne peut pas porter ce rôle. |
| Impact si c'est faux | Ajouter « Problème » à `Role` et `ROLES_VERS_GABARITS` (`serie/schemas.py`). |
| Gravité | Mineure |
| Statut | Résolue le 2026-10-20 |
| Décision | Décision de l'utilisateur (B4, 2026-10-20) : « Problème » se rend avec le gabarit mécanisme (`ROLES_VERS_GABARITS`). |

### A13 · Glyphe ∇ absent des polices fournies

| Champ | Contenu |
| --- | --- |
| Nº | A13 |
| Jalon | 2 |
| Fichier | design/fonts/stix-two-text-*.woff2 (sous-ensembles latin, grec, cyrillique, vietnamien) ; tests/reference/05-Formule.png |
| Question | Quelle police doit dessiner ∇ (formule de l'épisode 08, et toute formule de gradient) ? |
| Options | 1. Ajouter une police mathématique locale qui le contient (STIX Two Math), puis régénérer les références. 2. Laisser la police de secours du système. |
| Choix provisoire | Option 2 : rien n'est ajouté à design/. Le ∇ est donc dessiné par une police du système, différente ici et sur l'ordinateur des références ; sa ligne y gagne 2 px et décale la suite. Mesuré et absorbé par le plancher du test (11 758 px sur la page Formule, contre 622 à 9 996 ailleurs). |
| Impact si c'est faux | Ajouter la police dans design/fonts/ et `serie/charte.py` ; régénérer tests/reference/ (session de design) ; abaisser `PLANCHER` dans tests/test_rendu.py. |
| Gravité | Importante |
| Statut | Résolue le 2026-10-20 |
| Décision | Résolue par l'utilisateur (correctifs du 2026-10-20) : police de complément STIX Two Math (∇ et U+202F) ajoutée à design/fonts/ et déclarée par `serie/charte.py` ; références régénérées. Plancher de la page Formule : 11 758 → 3 438 px. |

### A14 · Typographie française (9.4) et images de référence

| Champ | Contenu |
| --- | --- |
| Nº | A14 |
| Jalon | 2 |
| Fichier | charte/decisions-automatisation.md §9.4 ; design/canevas-gabarits/*.dc.html ; tests/reference/*.png |
| Question | Les canevas gardent l'apostrophe droite et l'espace ordinaire avant « : » et « ? » (seul le sommaire du bilan a l'apostrophe courbe) : quand le jalon 3 appliquera 9.4, faut-il régénérer les références ? |
| Options | 1. Régénérer les 14 références après le jalon 3, dans une session de design. 2. Comparer les références avant typographie, et vérifier la typographie à part. |
| Choix provisoire | Jalon 2 : aucune règle de 9.4 n'est appliquée, sauf l'apostrophe des titres du sommaire, comme sur son canevas. Le rendu reste ainsi comparable aux références. Conséquence visible : le « ? » du titre de l'épisode 01 tombe seul en fin de ligne. |
| Impact si c'est faux | tests/test_rendu.py (comparer avant ou après typographie) ; `pages_bilan_html` (`serie/rendu.py`), qui applique l'apostrophe à part. |
| Gravité | Importante |
| Statut | Résolue le 2026-10-20 |
| Décision | Résolue par l'utilisateur (correctifs du 2026-10-20) : canevas et références passés à la typographie 9.4 ; le générateur l'applique à tous les textes (`serie/typographie.py`). |

### A16 · Prérequis de l'épisode 08 et ligne de rappel

| Champ | Contenu |
| --- | --- |
| Nº | A16 |
| Jalon | 2 |
| Fichier | banque/episodes/08-la-descente-de-gradient.yaml (`prerequis_explicites: []`) ; §9.3 (« elle cite les numéros des prérequis ») ; décision A08 |
| Question | La fiche 08 ne déclare aucun prérequis alors que son rappel cite 05, 06 et 07 : faut-il compléter la fiche ? |
| Options | 1. Ajouter 5, 6 et 7 aux prérequis de la fiche. 2. Laisser la fiche ; le rappel suit A08. |
| Choix provisoire | Option 2 : la fiche n'est pas modifiée. À trancher avant que le jalon 3 contrôle le rappel contre les prérequis. |
| Impact si c'est faux | banque/episodes/08-*.yaml, ou le futur contrôle du rappel (jalon 3). |
| Gravité | Mineure |
| Statut | Résolue le 2026-10-20 |
| Décision | Ce n'était pas une ambiguïté : prérequis = épisodes précédents du même chapitre + `prerequis_explicites` (charte/regles-banque.md). Calculés par `serie/prerequis.py` ; l'épisode 08 donne 05, 06, 07. |

### A17 · Pages de l'épisode 01 sans canevas

| Champ | Contenu |
| --- | --- |
| Nº | A17 |
| Jalon | 2 |
| Fichier | contenu/01.yaml, pages 1, 2, 5 et 6 |
| Question | Les textes de ces pages, rédigés uniquement à partir de la fiche, et leur mise en page (ouverture et piège sans visuel) conviennent-ils ? |
| Options | 1. Valider. 2. Réécrire et dessiner les visuels manquants (A12). |
| Choix provisoire | Rédigées à partir des seuls messages et faits vérifiés de la fiche, comme convenu. Le visuel de l'ouverture devient facultatif dans le schéma (`PageOuverture`), pour ne pas inventer de dessin. Pages à relire ; l'épisode reste « à faire » dans etat.yaml. |
| Impact si c'est faux | contenu/01.yaml ; `PageOuverture.visuel` (serie/schemas.py) si un visuel devient obligatoire. |
| Gravité | Mineure |
| Statut | Résolue le 2026-10-20 |
| Décision | Sans objet (B2) : contenu/01.yaml est supprimé ; les pages Image-Contexte et Image-Capture deviennent la fixture tests/fixtures/contenu-01-images.yaml. L'épisode 01 sera rédigé au jalon 4. |

### A01 · Format de `contenu/NN.yaml`

| Champ | Contenu |
| --- | --- |
| Nº | A01 |
| Jalon | 1 |
| Fichier | BRIEF-CONSTRUCTION.md, jalon 1 ; conception/plan-automatisation.md §11.2 (« textes et paramètres », sans autre précision) |
| Question | Quels champs porte chaque type de page dans `contenu/NN.yaml` ? |
| Options | 1. Un schéma par type de page, avec des champs nommés (titre, texte, visuel, cas, formule, tableau, image, points). 2. Une page générique avec des blocs libres. |
| Choix provisoire | Option 1, dans `serie/schemas.py` (`Contenu`) : un schéma strict par type refuse tout champ imprévu, ce qui empêche l'agent d'improviser une mise en page. Les champs viennent des textes visibles des canevas `design/canevas-gabarits/`. Les paramètres de chaque famille restent libres (`params`) jusqu'au jalon 3. |
| Impact si c'est faux | Revoir les modèles `Page*` de `serie/schemas.py` et la fixture `tests/donnees/contenu-valide.yaml`. Les gabarits Jinja du jalon 2 lisent ces champs. |
| Gravité | Importante |
| Statut | Résolue le 2026-10-19 |
| Décision | Option 1 validée (schéma strict par gabarit). Chaque page de contenu porte un champ `role`, l'étiquette affichée au-dessus du titre (`PageAvecRole`, `serie/schemas.py`). Couverture, ouverture et fin n'affichent pas d'étiquette dans le canevas : elles n'ont pas de `role`, et le schéma le refuse. |

### A02 · Types de page des fiches sans gabarit

| Champ | Contenu |
| --- | --- |
| Nº | A02 |
| Jalon | 1 |
| Fichier | banque/episodes/*.yaml (rubrique `pages`) ; charte/architecture-carrousel.md, « Les types de pages de contenu » |
| Question | Quel gabarit rend les pages Repère (25), Lien (10), Lecture (4), Définition (2), Remèdes (2), Diagnostic (1) et Évaluation (1), absentes de la liste des types et des canevas ? |
| Options | 1. Les rattacher à un gabarit existant (Repère, Définition et Lecture vers Mécanisme ; Remèdes et Diagnostic vers Piège ou Mécanisme ; Lien vers Mécanisme). 2. Dessiner de nouveaux gabarits dans une session de design. |
| Choix provisoire | Aucun rattachement pour l'instant : le schéma des fiches accepte ces types tels quels et `serie valider` les liste. `TYPES_FICHE_VERS_GABARIT` (`serie/schemas.py`) les marque « à décider ». Inventer un rattachement modifierait le rendu sans validation. |
| Impact si c'est faux | Compléter `TYPES_FICHE_VERS_GABARIT`, et peut-être ajouter des gabarits au jalon 2. |
| Gravité | Importante |
| Statut | Résolue le 2026-10-19 |
| Décision | Les rôles ne sont pas des gabarits. Repère, Lien, Lecture → mécanisme ; Définition et Remèdes → formule (panneau = phrase définie, lignes = liste numérotée) ; Diagnostic → comparaison ; Évaluation → exemple ; Exemple sans calcul → mécanisme, ou capture si `image_reelle` (A09). Appliqué dans `ROLES_VERS_GABARITS` et `gabarit_page_fiche`. Un rôle absent de cette liste est une nouvelle ambiguïté (voir A10). |

### A03 · Suivi des posts bilan dans `etat.yaml`

| Champ | Contenu |
| --- | --- |
| Nº | A03 |
| Jalon | 1 |
| Fichier | etat.yaml ; charte/decisions-automatisation.md §9.6 |
| Question | Où enregistrer l'état des 4 posts bilan de saison, qui n'ont pas d'entrée dans `etat.yaml`, et que veut dire le statut « bilan » (statistiques saisies) par rapport au « post bilan » ? |
| Options | 1. Ajouter une rubrique `bilans: {1: {statut…}}` à `etat.yaml`. 2. Ne pas suivre les bilans dans l'état. |
| Choix provisoire | Le schéma `Etat` n'accepte que les 62 épisodes. `serie etat` affiche « puis bilan » à la fin de chaque saison, sans statut. Rien n'est ajouté au fichier tant que la question n'est pas tranchée. |
| Impact si c'est faux | Étendre `Etat` (`serie/schemas.py`) et `afficher_etat` (`serie/etat.py`) au jalon 4 (`/bilan`). |
| Gravité | Importante |
| Statut | Résolue le 2026-10-19 |
| Décision | Option 1. Rubrique `bilans` (saisons 1 à 4) ajoutée à etat.yaml, avec les mêmes statuts. Le dernier statut s'appelle « mesuré » (`mesure`) au lieu de « bilan », dans le code et dans §9.6. |

### A04 · Nombre de pages par format

| Champ | Contenu |
| --- | --- |
| Nº | A04 |
| Jalon | 1 |
| Fichier | charte/charte.yaml (`format.formats` : court 4–6, long 7–9) ; charte/architecture-carrousel.md (court 5, long 7–8) ; charte/decisions-automatisation.md §9.3 (comme charte.yaml) |
| Question | Quelle fourchette fait foi ? |
| Options | 1. charte.yaml et §9.3. 2. architecture-carrousel.md. |
| Choix provisoire | Option 1, lue dans charte.yaml : c'est la valeur machine, et elle concorde avec §9.3. Les 62 fiches respectent aussi la fourchette plus étroite (court 5 ou 6, long 7 ou 8). |
| Impact si c'est faux | Aucun sur les fiches actuelles. `controler_fiche` (`serie/validation.py`) lit la charte. |
| Gravité | Mineure |
| Statut | Résolue le 2026-10-19 |
| Décision | charte.yaml fait foi (court 4 à 6, long 7 à 9). Tableau d'architecture-carrousel.md corrigé. |

### A05 · Fin de série annoncée en « saison 1 »

| Champ | Contenu |
| --- | --- |
| Nº | A05 |
| Jalon | 1 |
| Fichier | banque/episodes/62-la-classification-d-intention.yaml, `episode_suivant.texte` |
| Question | « fin de la saison 1, avec un post-bilan… » : faut-il lire « saison 4 » ? §9.3 prévoit « Fin de la série · merci de l'avoir suivie », puis le bilan de la saison 4. |
| Options | 1. Coquille, il faut lire « saison 4 ». 2. Volontaire. |
| Choix provisoire | La fiche n'est pas modifiée. `serie valider` émet un avertissement. La page de fin suivra §9.3. |
| Impact si c'est faux | Corriger la fiche par un commit qui en donne la raison. |
| Gravité | Mineure |
| Statut | Résolue le 2026-10-19 |
| Décision | Coquille. Dans la fiche 62, `episode_suivant.texte` vaut « Fin de la série · merci de l'avoir suivie ». Le bilan de la saison 4 suit, comme le prévoit calendrier.yaml (`bilan: true`). |

### A06 · Nombre de références dans `provenance.yaml`

| Champ | Contenu |
| --- | --- |
| Nº | A06 |
| Jalon | 1 |
| Fichier | provenance.yaml ; charte/decisions-automatisation.md §9.1 (« nombre de fiches et de références ») |
| Question | provenance.yaml donne `episodes_avec_references: 62` mais aucun nombre total de références : lequel comparer ? |
| Options | 1. Comparer seulement `episodes_avec_references`. 2. Ajouter le total à provenance.yaml. |
| Choix provisoire | Option 1. Le total trouvé (136 : 95 cours, 41 sources originales) est affiché à titre d'information. |
| Impact si c'est faux | Ajouter une ligne aux comparaisons de `valider_depot` (`serie/validation.py`). |
| Gravité | Mineure |
| Statut | Résolue le 2026-10-19 |
| Décision | Option 2. provenance.yaml donne `references_total: 136`, `cours: 95`, `sources_originales: 41`, et `serie valider` les compare. |

### A07 · Clés d'épisode non entre guillemets dans `etat.yaml`

| Champ | Contenu |
| --- | --- |
| Nº | A07 |
| Jalon | 1 |
| Fichier | etat.yaml, clés `08` et `09` |
| Question | `08` et `09` sont écrits sans guillemets : PyYAML les lit comme du texte, un lecteur YAML 1.2 comme les entiers 8 et 9. |
| Options | 1. Normaliser les clés à la lecture. 2. Mettre des guillemets dans le fichier. |
| Choix provisoire | Option 1 (`cle_episode` dans `serie/depot.py`) : rien n'est modifié dans le kit. Les écritures du jalon 4 mettront les clés entre guillemets. |
| Impact si c'est faux | Aucun. |
| Gravité | Mineure |
| Statut | Résolue le 2026-10-19 |
| Décision | Validé tel que proposé : clés normalisées à la lecture, guillemets à l'écriture (jalon 4). |

### A08 · Rappel de l'ouverture de l'épisode 08

| Champ | Contenu |
| --- | --- |
| Nº | A08 |
| Jalon | 1 (vu pour le jalon 2) |
| Fichier | design/canevas-gabarits/02-Ouverture.dc.html (« lire une pente (Nº 07) ») ; charte/architecture-carrousel.md (« lire une pente (06) ») |
| Question | La pente renvoie-t-elle à l'épisode 06 (la dérivée) ou 07 (le gradient) ? |
| Options | 1. Garder le canevas (07), qui sert de référence pixel. 2. Suivre la charte (06). |
| Choix provisoire | À trancher au jalon 2. Par défaut, garder le canevas validé, puisque `tests/reference/02-Ouverture.png` en dépend. |
| Impact si c'est faux | Le texte de `contenu/08.yaml` et l'image de référence ne concorderaient plus. |
| Gravité | Mineure |
| Statut | Résolue le 2026-10-19 |
| Décision | La ligne de rappel devient « On sait mesurer l'erreur (Nº 05) et lire une pente (Nº 06 et 07). » Canevas et image de référence remplacés par les versions corrigées fournies par l'utilisateur ; exemple d'architecture-carrousel.md aligné. |

### A09 · Page Exemple avec capture réelle

| Champ | Contenu |
| --- | --- |
| Nº | A09 |
| Jalon | 1 (vu pour le jalon 2) |
| Fichier | banque/episodes/01-*.yaml, page 4 (type « Exemple » avec `image_reelle`) ; design/canevas-gabarits/Image-Capture.dc.html |
| Question | Une page de fiche « Exemple » qui a une image réelle se rend-elle avec le gabarit capture ? |
| Options | 1. Oui, avec capture si `image_reelle` est présent, sinon exemple. 2. Toujours avec exemple. |
| Choix provisoire | Option 1, à appliquer au jalon 2. Le contenu a un type `capture` distinct. |
| Impact si c'est faux | Modifier la règle de rattachement au jalon 2. |
| Gravité | Mineure |
| Statut | Résolue le 2026-10-19 |
| Décision | Option 1 validée : une page « Exemple » avec `image_reelle` se rend avec le gabarit capture, sinon avec mécanisme (A02). |
