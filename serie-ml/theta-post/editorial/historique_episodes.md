# Historique éditorial des épisodes

Une fiche par épisode validé. Lire avant chaque rédaction. Ajouter une fiche après chaque validation, avec la version réellement publiée.

Codes d'accroche : A contre-intuitive · B erreur fréquente · C scientifique directe · D historique · E question · F situation réelle · G chiffre · H paradoxe.
Codes de corps : voir CLAUDE.md, section 4.2.

---

## Vue d'ensemble 01 à 10

Textes réécrits et validés le 2026-11-05, avant toute publication. Les anciens textes sont dans `episodes/valides/01-10_textes_publies.md`.

| Nº | Thème | Accroche (type) | Corps (forme) | Paragraphe visuel | Conclusion | Hashtags 3 et 4 | Mots (env.) |
|---|---|---|---|---|---|---|---|
| 01 | Introduction au ML | E | 3 · problème concret puis résolution | Non | Observation mémorable | #DataScience #ApprentissageAutomatique | 159 |
| 02 | Données, caractéristiques, étiquettes | B | 12 · limite ou compromis + 10 · expérience de l'auteur | Non | Mini-exercice | #DataScience #PreparationDesDonnees | 178 |
| 03 | Trois familles | A | 2 · explication directe, sous forme d'arbre de décision | Non | Transition intrigante | #DataScience #ApprentissageSupervise | 186 |
| 04 | Modèle et paramètres | G | 9 · étude de cas chiffrée | Oui, une ligne | Observation mémorable | #DataScience #RegressionLineaire | 187 |
| 05 | Fonction de coût | G | 6 · mini-démonstration + 11 · comparaison de deux méthodes | Non | Question ouverte (conservée) | #Statistiques #FonctionDeCout | 168 |
| 06 | Dérivée | A | 1 · analogie pédagogique | Non | Synthèse en une phrase | #Mathematiques #Derivee | 134 |
| 07 | Gradient | B | 6 · mini-démonstration + 5 · mythe contre réalité | Non | Transition intrigante | #Mathematiques #Gradient | 184 |
| 08 | Descente de gradient | D | 8 · récit historique documenté | Oui, une phrase | Observation pratique | #Optimisation #DescenteDeGradient | 178 |
| 09 | SGD et mini-lots | G | 12 · limite ou compromis, appuyé d'un mini-calcul | Non | Synthèse en une phrase | #Optimisation #DescenteStochastique | 162 |
| 10 | Minimums locaux, points selle | F | 5 · mythe contre réalité | Non | Citation | #DeepLearning #Optimisation | 195 |

Constats : 10 structures différentes · paragraphe visuel 2/10 · question finale 1/10 (05) · `#DataScience` 4/10.

État à la fin de l'épisode 10 pour la règle des trois consécutifs : 08 = D, 09 = G, 10 = F. Aucun type n'est bloqué pour l'épisode 11. Dernière touche personnelle : épisode 02.

---

## Fiches détaillées

### Nº 01 · Introduction au Machine Learning
- **Accroche exacte** : « Vous reconnaissez un spam d’un coup d’œil. / Pourriez-vous écrire la règle exacte qui permet de le faire ? »
- **Type d'accroche** : E (2 lignes, question)
- **Structure** : Accroche-question · essai de règles en trois lignes · bascule · chiffre · formule de clôture
- **Explication** : 3 · problème concret puis résolution
- **Analogies / exemples** : Essai d'écrire des règles anti-spam
- **Sources** : Billet Google du 7 février 2019
- **Conclusion** : Observation mémorable : « Écrire un programme, c’est expliquer. Entraîner un modèle, c’est montrer. Les 61 épisodes suivants partent de cette différence. »
- **Notions introduites** : règles vs exemples, apprentissage, généralisation (limite hors des exemples)
- **Hashtags** : #MachineLearning #IntelligenceArtificielle #DataScience #ApprentissageAutomatique #ThetaML

### Nº 02 · Données, caractéristiques et étiquettes
- **Accroche exacte** : « Numéroter ses quartiers 1, 2 et 3 paraît anodin. / Pour certains modèles, le troisième vaut maintenant trois fois le premier. »
- **Type d'accroche** : B (2 lignes)
- **Structure** : Erreur fréquente · thèse · risque selon le modèle · limite de la parade · passage au texte (touche personnelle) · exercice
- **Explication** : 12 · limite ou compromis + 10 · expérience de l'auteur
- **Analogies / exemples** : Quartiers numérotés ; requêtes clients et intentions (NGONI) ; couleur et taille de T-shirt
- **Sources** : MLCC, scikit-learn ; corpus NGONI (expérience de l'auteur)
- **Conclusion** : Mini-exercice : « Mini-exercice : un fichier clients contient « couleur préférée » et « taille de T-shirt (S, M, L) ». Une seule de ces colonnes peut recevoir des numéros sans inventer un ordre. Laquelle ? »
- **Notions introduites** : exemple, caractéristique, étiquette, variable catégorielle, encodage ordinal (piège), encodage one-hot (une colonne par quartier)
- **Hashtags** : #MachineLearning #IntelligenceArtificielle #DataScience #PreparationDesDonnees #ThetaML

### Nº 03 · Les trois familles d'apprentissage
- **Accroche exacte** : « Un modèle peut apprendre sans qu’on lui donne la moindre réponse, et même à partir de données qui n’existent pas encore. »
- **Type d'accroche** : A (phrase longue unique)
- **Structure** : Phrase longue contre-intuitive · critère · trois questions-réponses · nuance en trois temps · transition
- **Explication** : 2 · explication directe, sous forme d'arbre de décision
- **Analogies / exemples** : Trois questions sur la situation de départ
- **Sources** : Goodfellow, Bengio, Courville, 2016 ; Levine et al., 2020
- **Conclusion** : Transition intrigante : « Dans ces trois cas, il reste quelque chose à la fin de l’apprentissage. Souvent des nombres, parfois très peu : deux, dans l’épisode suivant. »
- **Notions introduites** : supervisé, non supervisé, renforcement, régression, classification
- **Hashtags** : #MachineLearning #IntelligenceArtificielle #DataScience #ApprentissageSupervise #ThetaML

### Nº 04 · Modèle et paramètres
- **Accroche exacte** : « 2 925 ventes de maisons en entrée. / Deux nombres en sortie : 74 et 4. »
- **Type d'accroche** : G (2 lignes parallèles)
- **Structure** : Chiffre entrée / sortie · découpage choisi / appris · passage à l'échelle · énigme du 0 m² · appel au visuel · clôture
- **Explication** : 9 · étude de cas chiffrée
- **Analogies / exemples** : 2 925 ventes, deux nombres ; maison de 0 m²
- **Sources** : calculs.ames.droite_prix_surface()
- **Conclusion** : Observation mémorable : « Ce modèle ne garde aucune vente. Il en garde un résumé, avec ce que tout résumé laisse de côté. »
- **Notions introduites** : modèle, paramètres a et b, régression linéaire, ordonnée à l'origine sans sens physique (maison de 0 m²)
- **Hashtags** : #MachineLearning #IntelligenceArtificielle #DataScience #RegressionLineaire #ThetaML

### Nº 05 · La fonction de coût
- **Accroche exacte** : « Quand on élève les erreurs au carré, une seule erreur de 25 pèse autant que 625 erreurs de 1. »
- **Type d'accroche** : G (phrase unique)
- **Structure** : Chiffre · calcul sur deux lignes · retournement · usage et limite · question
- **Explication** : 6 · mini-démonstration + 11 · comparaison de deux méthodes
- **Analogies / exemples** : Une erreur de 25 contre 625 erreurs de 1
- **Sources** : MLCC Loss
- **Conclusion** : Question ouverte (conservée) : « Dans votre métier, une grosse erreur coûte-t-elle plus que plusieurs petites ? »
- **Notions introduites** : erreur, fonction de coût, erreur quadratique moyenne, sensibilité aux valeurs aberrantes, courbe en U
- **Hashtags** : #MachineLearning #IntelligenceArtificielle #Statistiques #FonctionDeCout #ThetaML

### Nº 06 · La pente d'une courbe : la dérivée
- **Accroche exacte** : « Le compteur de votre voiture affiche une dérivée. »
- **Type d'accroche** : A (phrase courte unique)
- **Structure** : Phrase unique · ce que le compteur dit et ne dit pas · transposition au coût · défi. Texte le plus court de la série.
- **Explication** : 1 · analogie pédagogique
- **Analogies / exemples** : Compteur de vitesse
- **Sources** : Calcul
- **Conclusion** : Synthèse en une phrase : « Une dérivée ne dit pas où aller : elle dit de quel côté commencer. »
- **Notions introduites** : tangente, pente, signe et valeur de la dérivée, taux d'accroissement et limite
- **Hashtags** : #MachineLearning #IntelligenceArtificielle #Mathematiques #Derivee #ThetaML

### Nº 07 · Le gradient
- **Accroche exacte** : « Le gradient ne pointe pas vers le minimum. / Même son opposé n’y mène pas forcément tout droit. »
- **Type d'accroche** : B (2 lignes)
- **Structure** : Erreur fréquente · démonstration en un point · question-réponse · enjeu · transition
- **Explication** : 6 · mini-démonstration + 5 · mythe contre réalité
- **Analogies / exemples** : J = a² + 3b² au point (1 ; 1)
- **Sources** : Calcul
- **Conclusion** : Transition intrigante : « Si la flèche ne vise pas le but, comment arrive-t-on quand même ? En la recalculant à chaque pas. »
- **Notions introduites** : dérivée partielle, gradient ∇J, lignes de niveau, orthogonalité du gradient aux lignes de niveau, direction de plus forte montée
- **Hashtags** : #MachineLearning #IntelligenceArtificielle #Mathematiques #Gradient #ThetaML

### Nº 08 · La descente de gradient
- **Accroche exacte** : « La descente de gradient a été décrite en 1847, pour calculer l’orbite d’un astre. »
- **Type d'accroche** : D (phrase unique)
- **Structure** : Date · récit en deux temps · détail sur θ · changement d'échelle · appel au visuel · conseil
- **Explication** : 8 · récit historique documenté
- **Analogies / exemples** : Orbite d'un astre (Cauchy) ; six inconnues contre 175 milliards de paramètres
- **Sources** : Cauchy, 1847 ; Lemaréchal, 2012 ; Brown et al., 2020
- **Conclusion** : Observation pratique : « Si votre coût monte à chaque itération, commencez par regarder η. »
- **Notions introduites** : règle θ ← θ − η∇J(θ), taux d'apprentissage η, η trop petit / trop grand, pas qui raccourcissent près du minimum (à η fixe), coût minimal non nul
- **Hashtags** : #MachineLearning #IntelligenceArtificielle #Optimisation #DescenteDeGradient #ThetaML

### Nº 09 · Descente stochastique et mini-lots
- **Accroche exacte** : « Calculer une pente sur 10 000 exemples plutôt que 100 demande cent fois plus de calcul, pour une estimation seulement dix fois plus précise. »
- **Type d'accroche** : G (phrase longue unique)
- **Structure** : Phrase longue chiffrée · cause · tableau en deux lignes · pari · prix à payer · question
- **Explication** : 12 · limite ou compromis, appuyé d'un mini-calcul
- **Analogies / exemples** : 100 contre 10 000 exemples
- **Sources** : Goodfellow, Bengio, Courville, 2016, ch. 8
- **Conclusion** : Synthèse en une phrase : « Au-delà d’un certain point, un pas de plus vaut souvent mieux qu’un exemple de plus. »
- **Notions introduites** : gradient complet, stochastique, mini-lot, époque, décroissance de η
- **Hashtags** : #MachineLearning #IntelligenceArtificielle #Optimisation #DescenteStochastique #ThetaML

### Nº 10 · Minimums locaux et points selle
- **Accroche exacte** : « Le coût ne baisse plus. / Le modèle a-t-il terminé, ou reste-t-il coincé ? »
- **Type d'accroche** : F (2 lignes, constat + question)
- **Structure** : Situation · trois cas · idée reçue · argument inverse · réserve · transition
- **Explication** : 5 · mythe contre réalité
- **Analogies / exemples** : Coût qui stagne, sans image de relief
- **Sources** : Dauphin et al., 2014
- **Conclusion** : Citation : « Leur thèse repose en partie sur des fonctions d’erreur aléatoires : un éclairage, pas une loi. Elle invite pourtant à se méfier d’un coût qui stagne : ces plateaux, écrivent-ils, « give the illusory impression of the existence of a local minimum », l’illusion d’un minimum local. »
- **Notions introduites** : minimum local, minimum global, point selle, convexité, bruit des mini-lots comme aide possible
- **Hashtags** : #MachineLearning #IntelligenceArtificielle #DeepLearning #Optimisation #ThetaML
