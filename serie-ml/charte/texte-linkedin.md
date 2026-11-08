# Texte LinkedIn du post

Ce fichier fait foi pour ce que le code contrôle. La méthode de rédaction (types d'accroche, formes de corps, variation d'un épisode à l'autre, grille de notation) est dans `theta-post/CLAUDE.md`. Décision de l'utilisateur du 2026-11-05, A63.

## 7. Texte LinkedIn du post

Le texte apporte une valeur en plus du carrousel : un enjeu, un angle, une raison de faire glisser. Il ne le résume pas et n'énumère pas ses pages. Il fait entre 60 et 220 mots, signature comprise, hors hashtags et adresses. La longueur suit la notion : elle n'est pas uniforme.

| Partie | Règle | Obligatoire |
| --- | --- | --- |
| Accroche | 3 lignes au plus ; 150 caractères visés, pour rester visible avant « voir plus » | Oui |
| Corps | 1 à 3 paragraphes courts, dans la forme que la notion demande | Oui |
| Présentation du visuel | Environ 45 mots au plus, deux idées, un enjeu | Non |
| Conclusion | Question, défi, exercice, observation, mise en situation ou transition : pas forcément une question | Oui |
| Signature de série | Ajoutée par le code : numéro, série, épisode suivant | Oui |
| Liens du site | Ajoutés par le code : page de l'épisode et labo 3D (A68) | Oui |
| Hashtags | Ajoutés par le code : 5, voir ci-dessous | Oui |

Hashtags, dans cet ordre :

1. `#MachineLearning`
2. `#IntelligenceArtificielle`
3. Un générique : `#DataScience` par défaut, remplacé quand un hashtag plus précis existe (`#DeepLearning`, `#Statistiques`, `#Mathematiques`, `#Optimisation`, `#NLP`…)
4. Un hashtag propre au sujet, sans accent
5. `#ThetaML`, toujours en dernier, écrit exactement ainsi

Dans `contenu/NN.yaml`, le bloc `linkedin` contient `texte` (accroche, corps et conclusion, paragraphes séparés par une ligne vide), `hashtag` (le sujet) et, si besoin, `generique`. Les contenus écrits avant A63 gardent `accroche`, `intuition`, `promesse` et `question` : ces quatre parties sont mises bout à bout et suivent les mêmes contrôles.

- Ton : clair, rigoureux, vouvoiement.
- Pas de lien écrit dans le texte rédigé ; les références vont en premier commentaire. Le code ajoute seul, après la signature, les liens du site : la page de l'épisode, puis chaque labo 3D (bilan : l'accueil du site). Décision de l'utilisateur du 2026-11-08, A68.
- Une formule au plus dans le texte, écrite en clair (θ ← θ − η∇J).
- Pas de tiret long.
