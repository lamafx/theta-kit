---
name: stats
description: Enregistre les statistiques LinkedIn d'un épisode de la série Théta données par l'utilisateur, le passe à « mesuré », et prépare le bilan des 4 semaines quand il est dû. À utiliser pour « /stats NN … ».
argument-hint: NN <chiffres>
---

# /stats NN <chiffres>

Arguments : `$ARGUMENTS`. Tu ne lis jamais les statistiques LinkedIn toi-même : seulement les chiffres donnés
par l'utilisateur (charte/mesure.md). S'il en manque un, demande-le ; n'en estime aucun.

1. Écris ou complète `mesures/NN.yaml` :
   ```yaml
   episode: NN
   publie_le: AAAA-MM-JJ        # depuis etat.yaml
   h48: {impressions: , reactions: }
   j7: {impressions: , reactions: , enregistrements: , partages: }
   saisi_le: AAAA-MM-JJ
   ```
   Les chiffres de profil de la semaine (visites, nouveaux abonnés, messages de recruteurs) vont dans
   `mesures/profil.yaml`, une entrée par semaine (`semaine_du`).
2. Quand les chiffres à 7 jours sont saisis : `.venv/Scripts/python -m serie statut NN mesure`.
3. Bilan des 4 semaines : dû si 4 semaines ou plus séparent la première publication (ou le dernier bilan,
   `mesures/bilan-*.md`) d'aujourd'hui. Écris alors `mesures/bilan-AAAA-MM-JJ.md` : les chiffres en tableau,
   puis les quatre décisions de charte/mesure.md (format court ou long, types de pages qui retiennent — les
   enregistrements d'abord —, jour et heure, rythme), chacune avec les chiffres qui la justifient et
   « pas assez de données » quand c'est le cas. Une recommandation, jamais une modification de
   `calendrier.yaml` ou de la charte sans l'accord de l'utilisateur.
4. Commit Git `Statistiques NN`.
