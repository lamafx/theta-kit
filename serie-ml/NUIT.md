# Mission de nuit · construction du système Théta

Tu travailles seul : personne ne pourra répondre à une question avant demain matin.
Ne pose aucune question. Quand un choix est ambigu, prends l'option la plus prudente,
inscris-la dans AMBIGUITES.md (voir plus bas), et continue.

## Le registre des ambiguïtés

Toutes les ambiguïtés vont dans un seul fichier, AMBIGUITES.md, pour être tranchées ensemble demain.
Une entrée par ambiguïté, numérotée, au format suivant :

| Champ | Contenu |
| --- | --- |
| Nº | A01, A02… |
| Jalon | Le jalon où elle est apparue |
| Fichier | Le fichier du kit concerné, avec la section ou la ligne |
| Question | La question précise, en une phrase |
| Options | Les 2 ou 3 réponses possibles |
| Choix provisoire | L'option retenue cette nuit, et pourquoi c'est la plus prudente |
| Impact si c'est faux | Ce qu'il faudra refaire, et où dans le code |
| Gravité | Bloquante, importante ou mineure |

Regroupe les doublons. Trie le fichier par gravité, puis par jalon.

## Ce que tu dois faire

1. Lis CLAUDE.md puis BRIEF-CONSTRUCTION.md en entier.
2. Réalise les jalons 1, 2, 3 et 4, dans cet ordre. Le jalon 5 demande l'utilisateur : ne le commence pas.
3. Pour chaque jalon :
   - écris ton plan dans JOURNAL-NUIT.md avant de coder ;
   - code, teste, puis vérifie le critère de fin avec une commande réelle, et colle sa sortie dans le journal ;
   - fais un commit Git nommé « Jalon N : … » ;
   - passe au jalon suivant seulement si le critère est rempli.
4. Si un critère reste impossible à remplir après 3 approches différentes, arrête-toi là :
   ne commence pas le jalon suivant, et explique le blocage dans le rapport.

## Ce que tu as le droit de faire

- Pendant la construction, tu peux créer et modifier `gabarits/`, `bibliotheque/`, `serie/`, `calculs/`, `tests/`
  (sauf `tests/reference/`), `.claude/`, `contenu/`, `sources/`, `sortie/`, `publier/`.
- Installer les dépendances Python du projet, et Chromium pour Playwright.

## Ce qui t'est interdit

- Modifier `banque/`, `charte/`, `design/`, `conception/`, `tests/reference/` ou `provenance.yaml`.
  Si l'un d'eux te paraît faux, note-le dans le rapport sans le changer.
- Abaisser un critère de fin, désactiver un test ou remplacer une image de référence pour faire passer un contrôle.
  Si la comparaison d'images échoue seulement à cause du lissage des polices propre à cet ordinateur,
  fixe un seuil de tolérance, justifie-le chiffres à l'appui dans le journal, et vérifie visuellement les pages.
- Rédiger un épisode de mémoire. Au jalon 4, si une référence ne peut pas être lue, marque l'épisode
  comme bloqué au lieu d'inventer.
- Pousser vers un dépôt distant, publier quoi que ce soit, ou envoyer des données hors de cet ordinateur.
- Inventer des chiffres réels ou des images réelles.

## Si une action t'est refusée

Note dans le journal l'action et la raison, cherche une autre façon de faire dans ce qui t'est permis,
et sinon passe à la suite.

## Avant de t'arrêter, quoi qu'il arrive

Écris RAPPORT-MATIN.md, court et lisible en 5 minutes :
- les jalons terminés, avec la preuve de chaque critère de fin ;
- les décisions prises seul et les hypothèses ;
- les blocages, et ce qu'il faut de l'utilisateur pour les lever ;
- le nombre d'ambiguïtés par gravité, avec un renvoi vers AMBIGUITES.md (sans les recopier) ;
- la commande exacte pour reprendre là où tu t'es arrêté.
