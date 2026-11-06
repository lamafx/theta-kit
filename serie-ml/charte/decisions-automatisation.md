# Décisions pour l'automatisation (inclut la typographie 9.4 et le calendrier 9.7)

Extrait du document de conception. Ce fichier fait foi.

## 9. Décisions pour l'automatisation

Ces décisions fixent tout ce que l'agent devrait sinon te demander une fois le code lancé. Une fois exportées dans le dépôt, elles ne se discutent plus en prompt : on modifie le fichier concerné.

### 9.1 Le dépôt est la seule source de vérité (points 1 et 2)

- Avant le premier codage, ce document est exporté une fois dans le dépôt. Ensuite, Claude Code ne lit plus que le dépôt.
- Ce document et les deux canevas Claude Design deviennent des archives de conception. Une modification future se fait dans le fichier du dépôt, avec un commit qui la décrit.
- Organisation des fichiers exportés :

| Fichier | Contenu |
| --- | --- |
| banque/episodes/NN-titre.yaml | Une fiche par épisode : numéro, saison, chapitre, titre, accroche, fond de couverture, format, prérequis, termes introduits (avec leurs formes), pages, épisode suivant, références, images, faits vérifiés |
| charte/charte.yaml | Couleurs, polices, tailles, marges, composants |
| charte/regles-redaction.md | Sections 1, 2 et 6 : fil de lecture, limites de mots, vérifications, images réelles |
| charte/typographie.md | Règles du point 9.4 |
| charte/texte-linkedin.md | Section 7 |
| calendrier.yaml | Saisons, dates prévues, jours de publication |
| etat.yaml | Où en est chaque épisode (voir 9.6) |

**Provenance de l'export.** Le kit garde un fichier provenance.yaml : version du document exporté, date, nombre de fiches et de références. Au jalon 1, Claude Code compare ces nombres à ceux du dépôt. Toute modification ultérieure d'une fiche passe par un commit qui en donne la raison.

### 9.2 Les gabarits sont convertis une seule fois (point 3)

- Chaque type de page du canevas « Gabarits officiels » devient un gabarit HTML classique, avec une feuille de style commune construite à partir de charte.yaml.
- La conversion est validée une fois, en comparant le rendu de chaque gabarit à la page du canevas. Après cette validation, on ne redessine plus : on remplit.
- Le rendu final passe par Chromium : une image PNG par page, puis un PDF qui les assemble.

### 9.3 Formats et cas limites (points 8 et 9)

- **Format court** : 4 à 6 pages, couverture et fin comprises. **Format long** : 7 à 9 pages. Jamais plus de 9.
- **Ligne de rappel de l'ouverture** : elle cite les numéros des prérequis. Pour l'épisode 01, elle devient « Épisode 1 · Saison 1 ».

| Situation | « Épisode suivant » sur la page de fin |
| --- | --- |
| Épisode ordinaire | Numéro, titre et phrase de transition de l'épisode suivant, puis l'invitation fixe à suivre la série (A15) |
| Dernier épisode d'une saison | « Bilan, puis saison N+1 · Nº XX », titre et phrase de transition du premier épisode de la saison suivante, puis l'invitation (A22) |
| Post bilan de saison | « Saison N+1 : reprise le \[date du calendrier\] » |
| Épisode 62 | « Fin de la série · merci de l'avoir suivie », puis bilan de la saison 4 |

### 9.4 Typographie française (point 13)

Appliquée automatiquement par le générateur, sur tous les textes, avant le rendu. L'agent n'a pas à y penser.

| Règle | Exemple |
| --- | --- |
| Espace fine insécable avant ; ! ? | Pourquoi ? |
| Espace insécable avant : et à l'intérieur des guillemets | « exemple » : |
| Virgule décimale partout, formules comprises | η = 0,1 |
| Espace fine insécable entre milliers | 10 000 |
| Signe moins mathématique, pas de trait d'union | −6 |
| Signe de multiplication | η × la pente |
| Apostrophe typographique | l’erreur |
| Majuscules accentuées | À retenir |
| Pas de coupure entre un nombre et son unité, ni entre Nº et le numéro | Nº 08 |

### 9.5 Ce qui reste à ta charge (points 15, 16 et 17)

Trois étapes humaines sont gardées, chacune préparée par l'agent pour durer quelques minutes.

**Les images réelles : cherchées et téléchargées par l'agent, validées par toi à la relecture.**

- Tu ne fournis plus d'image. Pour chaque page qui demande une image réelle, l'agent écrit dans contenu/NN.yaml ce que l'image doit montrer (sujet, lieu, date), tiré d'un fait sourcé de la fiche.
- `serie images NN` cherche dans les API publiques (Wikimedia Commons, Openverse), et l'agent complète par une recherche web en commençant par la source la plus proche de l'événement (l'institution elle-même), puis en élargissant (musées, universités, salles de presse, archives, Library of Congress, NASA, Smithsonian, Europeana…). Les règles de chaque site sont respectées (User-Agent, rythme, robots.txt).
- Jusqu'à 5 candidates par page sont téléchargées dans assets/images/candidats/NN/, au moins 1 200 px sur le plus grand côté, chacune avec sa fiche .yaml : titre, auteur, date, page source, adresse du fichier, classe, conditions recopiées mot pour mot, lien de la licence, empreinte sha256, date de téléchargement.
- Ce qui est contrôlé, c'est le droit de réutiliser l'image : « libre » (domaine public, dont les œuvres du gouvernement fédéral américain, CC0, CC BY, CC BY-SA, ou autorisation écrite de réutilisation avec crédit qui couvre la modification), « à confirmer » (conditions floues, « Courtesy of… » sans licence écrite), « exclue » (NC, ND, tous droits réservés, banque d'images payante, image générée par IA, illustration retouchée présentée comme une photo).
- L'agent regarde chaque candidate et lit sa description à la source ; il ne retient qu'une image qui montre sans ambiguïté ce que dit la fiche (bon objet, bon lieu, bonne époque), de préférence « libre ». Il justifie son choix dans relecture.md et met les images « à confirmer » en tête : tu les valides à la relecture.
- Le crédit est écrit par le code à partir de la fiche .yaml : « Photo : Auteur · Licence ou conditions · Source ». Pour CC BY et CC BY-SA, le lien de la licence est aussi donné dans le texte LinkedIn de l'épisode.
- Une capture personnelle (ton dossier spam, par exemple) ne se cherche pas, et une fausse capture est interdite : la page Capture montre à la place un schéma de la famille Flux, avec la légende « Schéma ».
- Si aucune candidate n'est sûre, la page est rendue dans sa variante sans image et le rapport de relecture le signale. La génération ne s'arrête pas. Une image n'est jamais générée ni présentée comme réelle.
- Le générateur applique seul le traitement de la charte (noir et blanc, voile, recadrage, coins, crédit).

**La relecture, à chaque épisode.** L'agent produit relecture.md, une page au plus :

- chaque chiffre et chaque formule, avec sa source et l'extrait qui la justifie ;
- les phrases où il a un doute, mises en évidence ;
- les résultats des contrôles automatiques (mots, termes, débordements, calculs).

Tu lis, tu corriges si besoin, puis tu passes l'épisode au statut « relu ». Rien n'est prêt à publier sans ce statut.

**La publication, automatique** (décision du 2026-10-30, A49). Pour chaque épisode relu, l'agent prépare publier/NN/ :

- le PDF du carrousel, avec un nom de fichier sans caractère spécial (01-qu-est-ce-que-le-machine-learning.pdf), et titre.txt, le titre à saisir dans LinkedIn au moment d'ajouter le document (« Nº 01 · Qu’est-ce que le Machine Learning ? ») ;
- texte.txt, le texte du post, prêt à coller ;
- premier-commentaire.txt, avec les sources ;
- les aperçus PNG ;
- la date et l'heure prévues par le calendrier.

`serie linkedin tourner`, lancé toutes les 5 minutes par la tâche Windows « Theta LinkedIn », publie le post dû par l'API officielle de LinkedIn : seulement s'il est relu et à jour, dans les 2 heures qui suivent l'heure prévue, et jamais deux fois ; sinon il prévient et ne publie rien. Il passe ensuite l'épisode au statut « publié » avec la date. Le jeton reste dans le gestionnaire d'identifiants de Windows, jamais dans le dépôt ; aucune automatisation par le navigateur.

### 9.6 Les statuts d'un épisode

Un épisode passe par cinq statuts, enregistrés dans etat.yaml : à faire, généré, relu, publié, puis mesuré (ses statistiques sont saisies). Les quatre posts bilan de saison sont suivis dans la rubrique `bilans` du même fichier, avec les mêmes statuts. C'est ce fichier qui permet à l'agent de savoir où on en est sans que tu le lui expliques.

### 9.7 Le calendrier de publication

Les semaines alternent 2 et 3 posts, soit 2,5 en moyenne. Les heures sont celles d'Abidjan (GMT), qui ne change pas d'heure.

| Semaine | Mardi 8 h 30 | Jeudi 8 h 30 | Samedi 10 h |
| --- | --- | --- | --- |
| Impaire | épisode | épisode | épisode |
| Paire | épisode | épisode | — |

- **Pourquoi ces créneaux** : des matins de semaine pour toucher les recruteurs et les étudiants au début de leur journée, avec au moins un jour d'écart entre deux posts. Le samedi, plus calme, reçoit le troisième post.
- **C'est une hypothèse de départ**, pas une certitude : le premier bilan des 4 semaines (section 8) compare les créneaux et les ajuste avec tes vrais chiffres.
- **Saison 1** : 19 épisodes et 1 bilan, soit 20 posts sur 8 semaines (4 semaines à 3 posts, 4 à 2).
- **Date de lancement** : fixée à la fin de la construction, quand les 4 premiers épisodes sont générés et relus d'avance. Le générateur calcule ensuite toutes les dates dans calendrier.yaml.
- **Avance de sécurité** : on garde toujours au moins 4 épisodes relus et prêts d'avance. En dessous, l'agent le signale dans son rapport.
