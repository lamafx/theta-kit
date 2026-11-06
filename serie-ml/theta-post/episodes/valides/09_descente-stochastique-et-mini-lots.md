# Nº 09 · texte validé le 2026-11-05, fin modifiée le 2026-11-06

Calculer une pente sur 10 000 exemples plutôt que 100 demande cent fois plus de calcul, pour une estimation seulement dix fois plus précise.

La cause est une racine carrée : l’erreur type d’une moyenne estimée sur n exemples décroît en 1/√n.

100 exemples : calcul 1, erreur 1.
10 000 exemples : calcul 100, erreur 0,1.

D’où le pari de la descente stochastique et des mini-lots : renoncer à une pente exacte pour faire bien plus de pas. Goodfellow, Bengio et Courville notent en 2016 que la plupart des algorithmes d’optimisation convergent ainsi beaucoup plus vite, en calcul total et non en nombre de pas.

Le prix à payer est un chemin qui zigzague et qui, à taux d’apprentissage fixe, ne se pose pas au minimum.

Au-delà d’un certain point, un pas de plus vaut souvent mieux qu’un exemple de plus.

Nº 09 · θ Théta, le Machine Learning, une notion à la fois. Épisode suivant · Nº 10 : Minimums locaux et points selle.

#MachineLearning #IntelligenceArtificielle #Optimisation #DescenteStochastique #ThetaML
