---
name: bilan
description: Prépare le post bilan d'une saison de la série Théta (couverture, sommaire et fin), le rend et le passe à « généré ». À utiliser pour « /bilan N ».
argument-hint: N
---

# /bilan N

Saison `$ARGUMENTS`.

1. Lis `charte/bibliotheque-visuelle.md` (« Le post bilan de saison »), `calendrier.yaml` et les titres des
   fiches de la saison. Les épisodes du sommaire viennent des fiches : tu ne les recopies pas.
2. Écris `contenu/bilan-N.yaml` (schéma `ContenuBilan` de `serie/schemas.py`, modèle :
   `tests/fixtures/bilan-1.yaml`) : couverture (titre, accroche), sommaire (titre, texte). Rien de nouveau :
   le bilan rassemble, il n'enseigne pas. Vouvoiement, pas de superlatif. Le hook contrôle le schéma.
   Ajoute le bloc `linkedin` (`texte`, `hashtag`, `generique` si besoin), mêmes règles qu'un épisode :
   60 à 220 mots, pas de lien ni de formule. La signature, la reprise et les hashtags sont ajoutés par le code.
3. `.venv/Scripts/python -m serie bilan N --publier` écrit `sortie/bilan-N/` et `publier/bilan-N/`, puis regarde
   `sortie/bilan-N/page-01.png` à `page-03.png`.
4. La page de fin (« Saison N+1 : reprise le [date] », A35) est écrite par le code, depuis `calendrier.yaml`
   et les fiches : tu n'y écris rien. Tant que `date_lancement` n'est pas fixée, elle dit « reprise
   prochainement » : signale-le dans ta réponse.
5. `.venv/Scripts/python -m serie statut bilan-N genere`, puis commit Git `Bilan de la saison N : généré`.

Réponse : les trois pages produites, la date de reprise affichée, et ce qui reste à faire (relecture par
l'utilisateur, puis `serie statut bilan-N relu`). La tournée LinkedIn publie ensuite le bilan à sa date.
