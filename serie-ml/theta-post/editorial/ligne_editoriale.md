# Ligne éditoriale θ Théta

## 1. Identité

- **Nom** : θ Théta. Le symbole θ désigne, en ML, les paramètres d'un modèle : c'est la lettre de la règle θ ← θ − η∇J(θ) (épisode 08).
- **Signature** : « θ Théta, le Machine Learning, une notion à la fois. »
- **Format** : carrousel (infographies réalisées avec Claude Design) + légende LinkedIn.
- **Cadence** : 2 à 3 publications par semaine, 62 épisodes.
- **Public** : étudiants en informatique, débutants en ML, développeurs, data analysts et data scientists, ingénieurs ML, recruteurs techniques.
- **Objectifs** : visibilité professionnelle, crédibilité technique, attractivité auprès des recruteurs et responsables techniques.

## 2. Identité visuelle du carrousel (pour cohérence avec la légende)

- Couverture : carte sombre, robot blanc vu de face, en gros plan (variante A) ; le geste du robot change selon le sujet et fait comprendre son action.
- Pages de contenu : style « éditorial clair ». Bandeau `MACHINE LEARNING · LES FONDAMENTAUX`, grand titre, sous-titre, encadré **L'IDÉE ESSENTIELLE**.
- Page de fin : version claire, robot qui pointe le résumé avec une baguette.
- 3 à 5 pages minimum par sujet. Pas de photo de l'auteur.

Conséquence pour la légende : le carrousel porte déjà la définition, la formule et l'idée essentielle. La légende ne les répète pas ; elle donne l'enjeu.

## 3. Gabarit de légende

```
[ACCROCHE]               1 à 3 lignes. Type A à H, varié.

[CORPS]                  1 à 3 paragraphes courts. Forme choisie parmi les 12.

[VISUEL]                 Facultatif. ≤ 45 mots, deux idées, un enjeu, pas un sommaire.

[CONCLUSION]             Question, citation, synthèse, défi, exercice, observation, transition… varié.
                         Jamais deux demandes au lecteur de suite (CLAUDE.md, section 9).

Nº XX · θ Théta, le Machine Learning, une notion à la fois. Épisode suivant · Nº YY : Titre.

#MachineLearning #IntelligenceArtificielle #[Générique] #[Spécifique] #ThetaML
```

Le blanc entre les blocs est volontaire : sur mobile, LinkedIn coupe après environ 2 à 3 lignes (« voir plus »). Tout ce qui doit accrocher tient avant cette coupure.

## 4. Hashtags

| Position | Règle |
|---|---|
| 1 | `#MachineLearning` |
| 2 | `#IntelligenceArtificielle` |
| 3 | Générique pertinent : `#DataScience` par défaut, à remplacer quand mieux (`#DeepLearning`, `#Statistiques`, `#Mathematiques`, `#NLP`, `#VisionParOrdinateur`, `#MLOps`…) |
| 4 | Spécifique à la notion, sans accents, en CamelCase (`#Gradient`, `#Surapprentissage`…) |
| 5 | `#ThetaML` (toujours en dernier, hashtag propre à la série) |

Hashtags spécifiques déjà utilisés : voir `historique_episodes.md`. Ne pas réutiliser un hashtag spécifique sauf si la notion est la même.

## 5. Données et conventions récurrentes

- **Maisons d'Ames (Iowa, États-Unis)** : jeu de données de ventes 2006 à 2010 (Dean De Cock, *Journal of Statistics Education*, 2011). Utilisé dans les épisodes 02, 04, 05, 08.
- **Conversion en FCFA** : cours BCEAO du 27 octobre 2026. Ce cours reste fixé pour toute la série afin que les chiffres restent comparables d'un épisode à l'autre. Il figure sur les slides ; la légende ne le répète plus, sauf si un montant en FCFA apparaît dans la légende elle-même.
- **Spam** : exemple utilisé en 01 et 03. Épuisé comme exemple d'ouverture.

## 6. Matière personnelle de l'auteur (à confirmer avant chaque usage)

L'auteur est étudiant en 3e année de licence Réseaux, Informatique et Télécommunications (SRIT) à l'ESATIC, Abidjan, Côte d'Ivoire. Il travaille sur le NLP, les agents conversationnels et le développement logiciel.

Expériences réelles connues, mobilisables quand elles éclairent la notion :

- **Mémoire NGONI** (soutenu, mention Très Bien, novembre 2026) : agent conversationnel de support client fondé sur la classification d'intentions (19 intentions).
- Protocole d'évaluation en trois jeux (entraînement / validation / test), avec une correction méthodologique : ne pas confondre le jeu de test final (2 041 requêtes réelles) avec la sélection du modèle. Utile pour les épisodes sur la validation, le surapprentissage, la fuite de données.
- Curation d'un corpus NLU Rasa de 1 919 exemples sur 19 intentions : problème d'exemples trop « gabarits » sur certaines intentions, enrichissement des intentions sous-représentées. Utile pour les épisodes sur la qualité des données, le déséquilibre des classes.
- Frontière difficile entre intentions proches (diagnostic / plainte). Utile pour les épisodes sur la classification, la matrice de confusion, les erreurs.
- Recherche sémantique avec le modèle d'embeddings BGE-M3. Utile pour les épisodes sur les représentations vectorielles et les embeddings.

Règles :

- Ne jamais ajouter de chiffre, de résultat (précision, F1…) ou d'anecdote qui ne figure pas ci-dessus. Si l'épisode en a besoin, poser la question à l'auteur.
- Une touche personnelle tous les 3 ou 4 épisodes, pas plus.
- Formuler sobrement : un constat, une erreur corrigée, un compromis. Pas de mise en avant de la mention ou du diplôme.
