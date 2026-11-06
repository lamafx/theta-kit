---
name: etat
description: Dit où en est la série Théta — statut de chaque épisode, avance en épisodes relus, prochaine publication, images manquantes ou à confirmer, ambiguïtés ouvertes. À utiliser pour « /etat » ou « où en est-on ».
---

# /etat

1. `.venv/Scripts/python -m serie etat --maj` (un épisode relu dont une entrée a changé repasse à « généré »).
2. Pour chaque épisode « généré » ou « relu » : la section images de `sortie/NN/verification.md` (manquantes,
   « à confirmer ») et la section « À trancher » de `sortie/NN/relecture.md`.
3. Les entrées « Ouvertes » de `AMBIGUITES.md` (titre et statut seulement).
4. La fin de `JOURNAL-NUIT.md` si la construction n'est pas terminée.

Réponse en français, courte : un tableau des épisodes qui ne sont pas « à faire » ; l'avance et son seuil ; la
prochaine publication (ou « date de lancement non fixée ») ; ce qui attend l'utilisateur (relectures, images à
confirmer, ambiguïtés). Ne modifie rien d'autre que ce que fait `serie etat --maj`.
