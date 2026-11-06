# Cahier de construction

Ce fichier dit à Claude Code quoi construire, dans quel ordre, et comment savoir que c'est fini.
Le plan complet et ses raisons sont dans `conception/plan-automatisation.md` (section 11) et
`charte/decisions-automatisation.md` (section 9). Lis-les avant le jalon 1.

Stack imposée : Python 3.11+, PyYAML, Jinja2, Playwright (Chromium) pour le rendu PNG,
pypdf pour assembler le PDF, pytest pour les tests. Polices locales dans `design/fonts/`
(Geist, Geist Mono, STIX Two Text), jamais chargées depuis Internet.

## Jalon 1 · Fondations

- Initialiser le dépôt Git, `pyproject.toml`, l'arborescence de la section 11.2.
- Écrire un schéma (pydantic ou jsonschema) pour les fiches `banque/episodes/*.yaml` et pour `contenu/NN.yaml`.
- Écrire `serie etat` (lecture de `etat.yaml`, affichage clair).

- Vérifier l'import contre `provenance.yaml` (nombre de fiches, de références, de termes, de gabarits).

Critère de fin : les 62 fiches passent la validation de schéma ; les nombres de `provenance.yaml` sont retrouvés ;
`serie etat` affiche 62 épisodes « à faire ».

## Jalon 2 · Rendu fidèle

- Convertir chaque gabarit de `design/canevas-gabarits/*.dc.html` en gabarit Jinja dans `gabarits/`
  (une page par type : couverture, ouverture, mécanisme, comparaison, formule, exemple, piège,
  contexte, capture, fin, bilan-couverture, bilan-sommaire). Les valeurs viennent de `charte/charte.yaml`.
  Les `{{accent}}`, `{{alert}}`, `{{c.*}}` des fichiers sources sont des réglages du canevas : remplace-les par les valeurs de la charte.
- Extraire le robot en deux SVG autonomes : `bibliotheque/robot-couverture.svg` et `bibliotheque/robot-baguette.svg`.
- Écrire la bibliothèque des 9 familles (`bibliotheque/*.py`), chacune une fonction
  `rendre(params, theme) -> svg`, en reprenant exactement les planches `Bib-Motifs` et `Bib-Visuels`.
- Écrire `serie rendre NN` : contenu + gabarits → `sortie/NN/page-XX.png` + carrousel PDF.
- Écrire `contenu/08.yaml` et `contenu/01.yaml` à la main à partir des gabarits (ce sont les épisodes de référence).

Critère de fin : `serie rendre 08` produit des pages identiques aux images de `tests/reference/`
(écart de pixels sous un seuil fixé dans le test, hors anti-crénelage).

## Jalon 3 · Contrôles

`serie verifier NN` exécute, et chaque contrôle a un test qui prouve qu'il détecte une erreur introduite exprès :
- schéma du contenu ; familles et paramètres autorisés ;
- mots par page ; mots interdits ; vouvoiement ;
- termes non encore introduits (compléter les formes de `charte/glossaire.yaml`) ;
- typographie française appliquée automatiquement (section 9.4) ;
- débordement : mesure dans Chromium de chaque bloc de texte, taille de police minimale ;
- calculs : chaque nombre du contenu doit provenir d'une fonction de `calculs/` ;
- références : chaque affirmation pointe vers un extrait de `sources/NN/`.

Chaque contrôle classe ses résultats en erreur bloquante, avertissement ou désaccord scientifique
(voir `charte/regles-redaction.md`, « Erreurs, avertissements et désaccords »).

Tests de rendu : non-régression sur les 14 images de `tests/reference/`, plus des pages pièges pour les cas
limites (titre long, formule longue, accents, tableau dense, page sans image).

Critère de fin : tous les tests passent, et chaque contrôle échoue sur son cas piégé.

## Jalon 4 · Agent

- Skills dans `.claude/skills/` : `episode`, `saison`, `bilan`, `etat`, `corriger`, `stats` (section 11.5).
- Sous-agent `.claude/agents/relecteur.md` : outils en lecture seule, ne voit pas la rédaction,
  rattache chaque affirmation à un extrait de source, répond pour chaque page aux quatre questions de la
  validation scientifique (hypothèse, domaine de validité, contre-exemple, raccourci assumé), écrit `sortie/NN/relecture.md`.
- Reprise sûre (section 11.7) : écritures atomiques, empreintes des entrées dans `etat.yaml`, étapes relançables,
  commit Git à chaque production validée.
- Journal des corrections automatiques dans le rapport (avant / après), sans jamais retirer une nuance scientifique pour faire passer un contrôle.
- Hooks dans `.claude/settings.json` (section 11.6) : vérification après chaque écriture dans `contenu/`,
  refus des écritures dans `gabarits/`, `bibliotheque/`, `charte/`, `tests/reference/`, mise à jour de l'état à la fin.
- Reprise par étapes et rendu incrémental (section 11.7).
- Dossier `publier/NN/` : PDF nommé sans caractère spécial, `titre.txt`, `texte.txt`, `premier-commentaire.txt`, aperçus, date prévue.

Critère de fin : `/episode 01` à `/episode 04` produisent chacun un dossier complet sans aucune intervention.

## Jalon 5 · Lancement

- Produire `images-a-fournir.md` pour la saison 1.
- L'utilisateur relit les épisodes 01 à 04 ; fixer `date_lancement` dans `calendrier.yaml`.

Critère de fin : 4 épisodes au statut « relu », dates calculées pour toute la saison 1.

## Hors périmètre de la construction

- La publication sur LinkedIn est automatique depuis le 2026-10-30, par l'API officielle (voir `charte/decisions-automatisation.md`, 9.5, et AMBIGUITES A49).
- Aucun nouveau visuel n'est inventé : un besoin non couvert est signalé, puis dessiné dans une session de design.
