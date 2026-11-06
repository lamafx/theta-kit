# Prompts à coller dans Claude Code

Ouvrir le dossier `theta/` dans VS Code, lancer Claude Code depuis ce dossier (il lit `CLAUDE.md` automatiquement), puis coller le prompt voulu.

---

## 1. Premier lancement (prise en main du dossier)

```
Lis CLAUDE.md puis tous les fichiers de editorial/ et episodes/valides/.

Ne rédige rien pour l'instant. Rends-moi un rapport court :
1. Ta compréhension de la mission en 5 lignes.
2. Le squelette répétitif des épisodes 01 à 10 tel que tu le vois, et ce que tu ajoutes ou contestes dans mon diagnostic.
3. Les contraintes qui s'appliquent à l'épisode 11 (types d'accroche, formules et analogies bloquées, conclusion).
4. Les informations qui te manquent (programme 12 à 62, expériences personnelles, etc.).
5. Toute incohérence que tu repères entre les fichiers.

Ne modifie aucun fichier.
```

---

## 2. Rédiger un nouvel épisode

```
Rédige l'épisode [NN] : « [Titre officiel] ».

Contenu du carrousel (pour que la légende ne le répète pas) :
[colle ici le texte des slides, ou indique le chemin du PDF dans le dossier]

Suis le processus de CLAUDE.md, étapes 1 à 8, sans t'arrêter. Écris le rapport dans episodes/brouillons/ et affiche-le. Arrête-toi à l'étape 9 et attends ma validation.
```

---

## 3. Réviser un texte que j'ai déjà écrit

```
Révise ce brouillon de l'épisode [NN] selon CLAUDE.md (format A à F).
Commence par le diagnostic et la note initiale, puis propose la version améliorée.

[colle ici ton texte]
```

---

## 4. Valider un épisode

```
Je valide la version [vX] de l'épisode [NN].
Exécute l'étape 10 : copie le texte dans episodes/valides/[NN]_[slug].md, ajoute la fiche dans historique_episodes.md, mets à jour les deux catalogues (y compris les compteurs de formules sur la fenêtre glissante), evaluations.md et, si besoin, regles_scientifiques.md. Montre-moi les modifications faites.
```

---

## 5. Contrôle de série (tous les 5 épisodes)

```
Fais un audit des 5 derniers épisodes validés : répétitions de structure (pas seulement de mots), équilibre des types d'accroche et de conclusion, analogies, exemples, longueur, cohérence pédagogique. Propose des orientations pour les 5 suivants. Ne modifie aucun épisode validé.
```
