# Série Théta (θ) — mémoire du projet

Série de carrousels LinkedIn éducatifs sur le Machine Learning, signée Ladji Lama Kamagate.
Nom affiché : « θ Théta », sous-titre « le Machine Learning, une notion à la fois ».
62 épisodes en 4 saisons. Cible : visibilité et recruteurs. Langue : français, vouvoiement.

## Principe absolu

L'IA écrit le fond, le code fixe la forme.
- Tu n'écris que des fichiers `contenu/NN.yaml` (textes + familles de visuels + paramètres).
- Tu n'écris jamais de HTML, CSS ou SVG pour un épisode. Le rendu est fait par `serie/`.
- Tu ne modifies jamais `gabarits/`, `bibliotheque/`, `charte/`, `design/` ni `tests/reference/` pendant une production.
  Ces dossiers ne changent que dans une session de design lancée exprès par l'utilisateur.
  Le hook `.claude/hooks/proteger.py` les verrouille ; la session de design les ouvre avec le fichier
  `.session-design` à la racine (brief : `BRIEF-SESSION-DESIGN.md`). Un besoin de changement hors session va dans AMBIGUITES.md.
  En session de design : chaque gabarit ou forme produit a son image dans `tests/reference/` et passe la suite
  avant son commit ; à la fin (suite verte, commit fait), supprime toi-même `.session-design`.

## Où se trouve la vérité

Le dépôt fait foi. Le dossier `conception/` est une archive : ne t'en sers que pour comprendre l'historique.

| Besoin | Fichier |
| --- | --- |
| Fiche d'un épisode | `banque/episodes/NN-*.yaml` |
| Architecture d'un carrousel, types de pages | `charte/architecture-carrousel.md` |
| Couleurs, polices, tailles | `charte/charte.yaml` et `charte/charte-graphique.md` |
| Règles de rédaction et vérifications | `charte/regles-redaction.md` |
| Typographie française, cas limites, statuts, calendrier | `charte/decisions-automatisation.md` |
| Familles de visuels | `charte/bibliotheque-visuelle.md` |
| Texte LinkedIn | `charte/texte-linkedin.md` |
| Termes et épisode qui les introduit | `charte/glossaire.yaml` |
| Rendu attendu de chaque gabarit | `tests/reference/*.png` (sources : `design/canevas-gabarits/`) |
| Où en est chaque épisode | `etat.yaml` |

Lis seulement les fichiers dont la tâche en cours a besoin.

## Règles de contenu (résumé, le détail est dans charte/)

- Jamais de rédaction de mémoire : chaque affirmation vient d'une référence de la fiche, dont l'extrait est gardé dans `sources/NN/`.
- Chaque chiffre et chaque courbe viennent d'une fonction de `calculs/`, jamais du texte.
- Un terme n'apparaît que s'il est introduit dans l'épisode ou un épisode précédent (`glossaire.yaml`).
- Un symbole est défini à sa première apparition.
- 32 mots maximum sur l'ouverture, 55 sur une page de contenu.
- Une idée par page ; chaque page répond à la question laissée par la précédente.
- Compréhension d'abord (décision de l'utilisateur, 2026-11-12) : le sous-agent `lecteur-debutant` note le
  carrousel et le texte du post pour un vrai débutant ; sous 8,5/10 pour l'un des deux, l'épisode n'est ni
  généré ni publié (`serie/comprehension.py`, étape `comprehension`). Phrases complètes, pas de style
  télégraphique, chaque terme et symbole expliqué en mots simples là où il apparaît.
- La page de fin ne contient rien de nouveau.
- Aucune spéculation : un fait non sourcé est retiré ou signalé dans le rapport.
- Pas d'emoji, pas de superlatifs, pas de tutoiement dans les textes publiés.
- Images réelles : cherchées et téléchargées par l’agent (`serie images NN`), droit de réutiliser contrôlé, crédit écrit par le code ; jamais d’image générée ni de fausse capture (voir charte, 9.5).

## Règles éditoriales Théta

Décision de l'utilisateur (2026-10-26). Elles s'ajoutent aux règles de contenu ci-dessus.

- Aucune affirmation sans source vérifiée sur le web pendant la relecture ; préférer la source primaire (article original, billet officiel) à la presse.
- Une citation n'est entre guillemets que si elle est vérifiée mot pour mot dans le texte original ; sinon, paraphraser.
- Fin de post variée (décision du 2026-11-06) : alterner question, citation et synthèse en une phrase ; jamais deux demandes au lecteur de suite, au plus deux sur cinq épisodes consécutifs (`theta-post/CLAUDE.md`, section 9).
- Tout chiffre est daté (« en 2019 ») et sourcé.
- Pas de formule absolue (toujours, jamais, tout) sauf si elle est vraie et sourcée.
- Légendes et crédits en français ; dans un crédit, seul le libellé est traduit (« Photo : »), auteur, source et licence restent d'origine.
- Si un épisode illustre un cas particulier (ex. apprentissage supervisé), le dire explicitement.
- Pas de tiret long (—) dans les textes.

## Déroulé d'un épisode, sans quitter Claude Code

- `/episode NN` va de la fiche au dossier `publier/NN/` sans s'arrêter : sources, contenu, images, rendu, vérification, relecture, publication.
- La relecture (sous-agent `relecteur`) vérifie chaque point sur le web et le rédige comme une décision : source (titre + lien), correction prête à appliquer, option recommandée, oui / non / autre. Les mises en conformité aux règles éditoriales sont appliquées aussitôt et listées ; les décisions attendent l'utilisateur.
- Les couvertures sont générées par le gabarit HTML `gabarits/couverture.html.j2` (tiré de la maquette `design/propositions/couverture-n01.html`, A41) : numéro, titre, accroche, motif de la bibliothèque ; exportées en PNG 1080 × 1350 par Playwright (`serie rendre NN`).
- Le seul arrêt obligatoire par épisode : l'utilisateur relit la version corrigée, répond aux décisions, puis lance lui-même `serie statut NN relu`.
- La publication est automatique (décision de l'utilisateur, 2026-10-30 ; AMBIGUITES A49) : `serie linkedin tourner`, lancé toutes les 5 minutes par la tâche Windows « Theta LinkedIn », publie le post dû par l'API officielle, seulement s'il est relu, à jour et noté au moins 8,5 en compréhension. Ne lance jamais `serie linkedin publier --oui` ni `essai --poster` sans accord explicite de l'utilisateur dans la conversation.

## Échecs et reprise

- Erreur bloquante : corrige et relance. Après 2 échecs sur le même point, arrête et écris-le dans `sortie/NN/relecture.md`.
- Avertissement : ne bloque pas, liste-le dans le rapport.
- Désaccord scientifique (sources divergentes, hypothèse implicite, contre-exemple) : ne corrige jamais seul, expose les versions dans le rapport.
- Ne retire jamais une nuance scientifique pour faire passer un contrôle.
- Chaque étape enregistre son résultat dans `etat.yaml` ; une commande relancée repart de la première étape non terminée.

## Construction

Tant que le système n'est pas construit, suis `BRIEF-CONSTRUCTION.md`, jalon par jalon.
Ne passe au jalon suivant que si le critère de fin du jalon en cours est vérifié.
