---
name: saison
description: Produit tous les épisodes d'une saison de la série Théta qui ne sont pas encore générés, un par un et chacun dans un contexte neuf, puis la liste des images à confirmer. À utiliser pour « /saison N ».
argument-hint: N
---

# /saison N

Saison `$ARGUMENTS`. Les bornes de la saison sont dans `calendrier.yaml` (`saisons.N.episodes`).

1. `.venv/Scripts/python -m serie etat` : repère les épisodes de la saison encore « à faire » (ou dont
   `serie reprendre NN` montre des étapes à refaire).
2. Pour chacun, dans l'ordre des numéros : lance un sous-agent `general-purpose` avec cette consigne, et attends
   sa fin avant le suivant (un épisode s'appuie sur les précédents) :
   « Produis l'épisode NN de la série Théta en suivant exactement `.claude/skills/episode/SKILL.md`. Rends
   seulement le rapport final. »
   Chaque épisode démarre ainsi d'un contexte neuf (11.4) : ne lui passe ni tes notes ni la rédaction des autres.
3. Un épisode bloqué (référence illisible, A12, deux échecs) n'arrête pas la saison si les suivants n'en
   dépendent pas (prérequis) ; sinon, arrête-toi et dis lequel bloque.
4. Écris `images-a-fournir.md` à la racine : pour chaque page Contexte ou Capture de la saison, l'image retenue
   (crédit), « à confirmer » (raison, lien de la page source) ou « aucune image sûre : variante sans image ».
   Source : `sortie/NN/verification.md` et `sortie/NN/relecture.md` de chaque épisode. Les « à confirmer »
   d'abord.
5. Réponse : un tableau épisode · statut · points à trancher, puis l'avance (`serie etat`).

Ne touche à aucun fichier d'un épisode déjà « relu » sans demande de l'utilisateur.
