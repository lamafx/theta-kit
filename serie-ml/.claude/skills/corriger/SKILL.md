---
name: corriger
description: Applique une correction décrite en une phrase à un épisode de la série Théta, puis relance contrôles, rendu, relecture et publication de cet épisode seul. À utiliser pour « /corriger NN [page] <correction> ».
argument-hint: NN [page] <correction>
---

# /corriger NN [page] <correction>

Arguments : `$ARGUMENTS` (numéro, page facultative, puis la correction demandée).

1. Lis `contenu/NN.yaml`, `sources/NN/extraits.yaml` et `sortie/NN/relecture.md`. Si la correction touche le
   fond, elle doit s'appuyer sur un extrait : sinon, ajoute l'extrait à `sources/NN/` (même règle que /episode,
   étape 2) ou demande la source à l'utilisateur.
2. Modifie seulement ce qui est demandé dans `contenu/NN.yaml`. Note avant / après dans
   `sortie/NN/corrections.md` (date, page, demande de l'utilisateur). Ne retire jamais une nuance scientifique ;
   si la demande l'exige, dis-le et attends la réponse.
3. Le hook vérifie le contenu. Puis, comme dans `.claude/skills/episode/SKILL.md` :
   `serie etat --maj` (relu → généré), `serie etape NN contenu` et `linkedin` (et `images` si une image a
   changé), étapes 5 à 8 (rendu, vérification, relecteur, lecteur débutant, publication), chacune enregistrée. La
   compréhension doit rester à 8,5 au moins (étape 7 bis) : sinon, rien n'est publié.
4. Une correction qui demande un changement dans `gabarits/`, `bibliotheque/`, `charte/`, `design/` ou
   `tests/reference/` ne se fait pas ici : écris-la dans AMBIGUITES.md et dis-le.
5. Commit Git `Épisode NN : correction (<résumé>)`.

Réponse : avant / après, résultat des contrôles, et le statut (« généré » : à relire).
