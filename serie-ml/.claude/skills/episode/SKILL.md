---
name: episode
description: Produit un épisode de la série Théta de bout en bout (chaîne 11.3) — sources, contenu, texte du post, images, rendu, vérification, relecture, dossier publier/NN/ — en reprenant à la première étape non faite. À utiliser pour « /episode NN » ou « produis l'épisode NN ».
argument-hint: NN
---

# /episode NN

Produis l'épisode `$ARGUMENTS` sans intervention. Toutes les commandes se lancent depuis la racine du dépôt
avec `.venv/Scripts/python -m serie …` (noté `serie …` ci-dessous). Lis seulement les fichiers nommés ici.

## 0. Reprendre

`serie reprendre NN` donne les étapes à faire, dans l'ordre. Commence à la première ; une étape déjà faite et à
jour ne se refait pas. Après chaque étape réussie : `serie etape NN <étape>` (date et empreinte de ses entrées).

## Règles qui s'appliquent à toute la chaîne

- CLAUDE.md, « Principe absolu » : tu n'écris que `sources/NN/extraits.yaml`, `contenu/NN.yaml`, les images
  retenues (`serie images`), `sortie/NN/` et `publier/NN/` (par les commandes). Jamais `gabarits/`,
  `bibliotheque/`, `charte/`, `design/`, `tests/reference/` : un hook le refuse. Si l'épisode a besoin d'un
  changement là, arrête l'étape et écris le besoin dans AMBIGUITES.md (nouvelle entrée, gravité, impact).
- Erreur bloquante : corrige et relance. Deux échecs sur le même point : arrête, écris-le dans
  `sortie/NN/relecture.md` (section « À trancher par l'utilisateur ») et passe au rapport final.
- Jamais de nuance scientifique retirée pour faire passer un contrôle. Désaccord : exposer, ne pas trancher.
- Chaque correction automatique est notée, avant / après, dans `sortie/NN/corrections.md`.

## 1. lecture

- La fiche `banque/episodes/NN-*.yaml`, puis celles de ses prérequis : épisodes précédents du même chapitre et
  `prerequis_explicites`. Reprends leurs mots.
- Dans `AMBIGUITES.md`, les entrées « Résolues » qui citent l'épisode NN (Grep `épisode NN`, `Épisode NN`) :
  ce sont des décisions de l'utilisateur, elles priment sur la fiche (exemple : A38 pour 01 et 03).
- `etat.yaml` : un prérequis encore « à faire » bloque (arrête et dis-le) ; un prérequis « généré » mais pas
  « relu » est seulement signalé dans le rapport.
- `serie etape NN lecture`

## 2. sources

- Lis chaque référence de la fiche (cours et sources originales) à son adresse. Pour chaque phrase utile, un
  extrait mot pour mot dans `sources/NN/extraits.yaml` (schéma `Sources` de `serie/schemas.py` : `id`,
  `reference` = l'adresse de la fiche, `lu_sur`, `lu_le`, `extrait`, `appuie`). Chaque référence a au moins un
  extrait. Une date historique n'est admise que si un extrait la contient.
- Une référence illisible (page absente, accès refusé) va dans `illisibles` et bloque l'épisode : arrête-toi.
- `serie etape NN sources`

## 3. contenu et texte du post

- Lis : `charte/architecture-carrousel.md`, `charte/regles-redaction.md`, `charte/bibliotheque-visuelle.md`, et
  les épisodes modèles : `tests/fixtures/contenu-08.yaml` (et `contenu/01.yaml` quand il existe).
- Écris `contenu/NN.yaml` (schéma `Contenu`) : pages dans l'ordre de la fiche, une idée par page, chaque page
  répond à la question laissée par la précédente ; visuels uniquement par familles et formes existantes, avec
  des valeurs tirées de `calculs/` ; symboles entre `$…$` ; pas de chiffre écrit à la main s'il peut venir d'un
  calcul.
- Formes de page existantes : `PARAMETRES` de chaque module de `bibliotheque/`, et leurs planches
  `tests/reference/Formes-*.png` (paramètres d'exemple : `tests/fixtures/formes.yaml`). Depuis la session de
  design n° 1 : Courbe, Grille, Nuage (dont `panneaux`, ouverture de 03), Flux. Pas encore de forme de page
  pour Barres, Blocs, Arbre, Réseau. Une page qui demande une forme absente : n'invente rien, arrête, écris le
  besoin dans AMBIGUITES.md et signale-le dans le rapport.
- Ajoute le bloc `linkedin` (charte/texte-linkedin.md) : `texte` rédigé selon `theta-post/CLAUDE.md` (accroche de
  3 lignes au plus et 150 caractères visés, corps, conclusion ; 60 à 220 mots, structure et conclusion variées ;
  fin de post choisie selon sa section 9 et `theta-post/editorial/catalogue_accroches.md`, jamais deux demandes
  au lecteur de suite), `hashtag` du sujet et, si un hashtag plus précis que #DataScience existe, `generique`. Une formule au plus,
  écrite en clair, pas de `$`. Les hashtags fixes et #ThetaML sont ajoutés par le code : ne les écris pas.
- Le hook lance `serie verifier NN --sans-mesures` après chaque écriture : corrige jusqu'à ce qu'il passe.

## 4. images

- Pages Contexte : `serie images NN`, puis recherche web en partant de l'institution concernée (9.5 de
  `charte/decisions-automatisation.md`). Regarde chaque candidate, lis sa description à la source, retiens-en une
  qui montre sans ambiguïté ce que dit la page, de préférence « libre » : `image.fichier` dans le contenu.
  Aucune sûre : la page reste sans image (variante prévue) et c'est signalé.
- Pages Capture : rien à chercher (schéma Flux « Schéma »).
- Puis, une fois le contenu final : `serie etape NN contenu`, `serie etape NN linkedin`, `serie etape NN images`.
  Ces trois étapes s'enregistrent ensemble, après le choix de l'image, car tous trois écrivent dans
  `contenu/NN.yaml` (A37).

## 5. rendu

- `serie rendre NN` (seules les pages modifiées sont refaites), puis regarde `sortie/NN/planche.png`.
- `serie etape NN rendu`

## 6. verification

- `serie verifier NN` (complet, mesures dans Chromium). Code 1 : corrige `contenu/NN.yaml`, relance rendu et
  vérification (règle des deux échecs).
- `serie etape NN verification`

## 7. relecture

- Lance le sous-agent `relecteur` avec le numéro de l'épisode. Il vérifie chaque affirmation sur le web et
  écrit `sortie/NN/relecture.md` : des **mises en conformité** (C1, C2…) et des **décisions** (D1, D2…), chacune
  avec sa source, sa correction rédigée et son option recommandée.
- Applique toi-même les mises en conformité, telles qu'elles sont rédigées, dans `contenu/NN.yaml` (et, si une
  source est ajoutée, dans `sources/NN/extraits.yaml`) ; note chacune dans `sortie/NN/corrections.md` (avant /
  après, numéro C). Ne modifie pas le rapport du relecteur. Puis refais 5 et 6 (une seule fois).
- N'applique pas les décisions D : elles attendent l'utilisateur. Tu ne t'arrêtes pas pour autant.
- `serie etape NN relecture`

## 8. publication

- `serie publier NN` → `publier/NN/` (PDF, titre, texte, premier commentaire, aperçus, date).
- `serie etape NN publication` : l'épisode passe à « généré ».
- Commit Git : `Épisode NN : généré` avec la liste des fichiers produits (contenu, sources, images retenues).
  Pas de push.

## Rapport final (dans ta réponse)

Statut, mises en conformité appliquées (liste courte), puis les décisions D telles que le relecteur les a
rédigées (constat, source, correction proposée, option recommandée, oui / non / autre), avertissements, images
à confirmer, et le chemin de `publier/NN/`. Le seul arrêt obligatoire de l'épisode est celui de
l'utilisateur : il relit la version corrigée, répond aux décisions, puis lance lui-même `serie statut NN relu`.
