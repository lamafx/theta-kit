# Corrections automatiques · Nº 13

## Vérification rapide (`serie verifier 13 --sans-mesures`)

1. Ouverture, 33 mots pour 32 au plus.
   - Avant : « Retoucher le premier change bien plus le coût $J$. »
   - Après : « Retoucher le premier change davantage le coût $J$. »
2. Texte du post, 221 mots pour 220 au plus, et accroche de 188 caractères.
   - Avant : « Au début de l'entraînement, un modèle peut juger une caractéristique dix fois plus importante qu'une autre, pour une seule raison : ses valeurs s'étalent sur une plage dix fois plus large. »
   - Après : « Au départ, un modèle peut juger une caractéristique dix fois plus importante qu'une autre, juste parce que ses valeurs s'étalent dix fois plus. »
   - Deux phrases du corps resserrées (« s'en trouve gênée. Un pas » → « en souffre : un pas » ; « ; celui des chambres, très peu » → « , celui des chambres très peu »).

## Rendu et vérification complète (`serie verifier 13`)

3. Page 2 : indices du rappel ($w_1$, $x_1$…) rendus à 18 px, sous le minimum de 22 px.
   - Avant : « Nº 11 : la descente règle les poids pas à pas ; Nº 12 : un poids par caractéristique, $ŷ$ = $w_1$·$x_1$ + $w_2$·$x_2$ + $b$. »
   - Après : « Nº 11 : la descente règle les poids pas à pas ; Nº 12 : chaque caractéristique reçoit son poids. »
   - Étiquettes des axes : « $w_2$ », « $w_1$ » (écrits tels quels par le dessin) → « w₂ », « w₁ ».
4. Page 4 : pied de page coupé.
   - Avant : « Une façon courante de normaliser s'appelle la **standardisation**. Elle transforme chaque caractéristique à part. Ensuite, chacune a une moyenne de 0 et un écart-type de 1, quelle que soit son unité. »
   - Après : « Une façon courante de normaliser s'appelle la **standardisation**. Après elle, chaque caractéristique a une moyenne de 0 et un écart-type de 1, quelle que soit son unité. »
   - Ligne $μ$ : « la **moyenne** de cette caractéristique sur les exemples de l'entraînement » → « la **moyenne** des valeurs vues pendant l'entraînement ».
5. Page 3 : pied de page poussé hors de la page (1 309 px pour 1 294). Deux essais : textes raccourcis, puis cadre du dessin réduit (440 × 300 → 440 × 230, origine [220, 150] → [220, 115], plage ±2,6 → ±2).
   - Cas 1 : « Chaque pas traverse la vallée étroite d'un bord à l'autre, et avance peu vers le minimum. » → « Chaque pas rebondit d'un bord à l'autre et avance peu. »
   - Encadré : « Surface et chambres varient souvent ensemble (Nº 12). Après normalisation, leur vallée s'arrondit, sans devenir tout à fait ronde. » → « Surface et chambres varient souvent ensemble (Nº 12) : leur vallée s'arrondit sans devenir tout à fait ronde. »
   - Texte : « …échelle, et la vallée s'arrondit. Ici, même départ, même taux d'apprentissage $!η$ et même nombre de pas : seule la forme de la vallée change. » → « …échelle : la vallée s'arrondit. Même départ, même taux d'apprentissage $!η$, même nombre de pas : seule la forme change. »

## Compréhension, passage 1 (carrousel 8/10, post 8,38/10)

6. Page 2 (compréhension) : la vallée et les ovales expliqués, « le premier » levé.
   - Avant : titre « Une vallée\ntrès allongée. » ; texte « Pour une maison de 120 m² et 3 chambres, le poids de la surface multiplie 120, celui des chambres 3. Retoucher le premier change davantage le coût $J$. »
   - Après : titre « Une vallée\nallongée. » ; texte « Le coût $J$ forme une vallée ; chaque ovale relie des réglages de même coût. Pour 120 m² et 3 chambres, la surface pèse bien plus : la vallée s'étire. »
   - Page 5, point 1 et question alignés sur ces mots (« Le coût $J$ forme une vallée. Pour 120 m² et 3 chambres, la surface pèse bien plus : la vallée s'étire. » ; « …quand la vallée du coût est allongée ? »).
7. Page 3 (compréhension) : « même échelle » dit en mots simples, une notion par phrase.
   - Avant : « La **normalisation** met les caractéristiques sur la même échelle : la vallée s'arrondit. Même départ, même taux d'apprentissage $!η$, même nombre de pas : seule la forme change. »
   - Après : « La **normalisation** ramène les caractéristiques au même ordre de grandeur : la vallée s'arrondit. Les deux descentes partent du même point, avec le même taux d'apprentissage $!η$. »
8. Page 4 (compréhension) : l'écart-type dit en mots avant d'être employé.
   - Avant : « Après elle, chaque caractéristique a une moyenne de 0 et un écart-type de 1, quelle que soit son unité. »
   - Après : « Après elle, les valeurs de chaque caractéristique sont centrées sur 0, et leur écart habituel autour de la moyenne, l'écart-type, vaut 1, quelle que soit l'unité. »
9. Post (compréhension) :
   - Accroche : « Au départ, un modèle peut juger une caractéristique dix fois plus importante qu'une autre, juste parce que ses valeurs s'étalent dix fois plus. » → « Un programme qui prédit le prix d'une maison peut d'abord croire qu'une donnée compte dix fois plus qu'une autre, juste parce que ses valeurs s'étalent dix fois plus. »
   - Paragraphe 3 : « La descente de gradient, qui corrige les poids un peu à chaque tour, en souffre : un pas assez prudent pour la surface est trop timide pour les chambres. » → « La descente de gradient corrige ces poids par petits pas. Un pas assez petit pour la surface est trop petit pour les chambres : leur poids avance très lentement. »
   - Paragraphe 5 : « Une précaution : chaque nouvelle maison à prédire passe par la même transformation, avec la moyenne et l'écart-type calculés pendant l'entraînement. » → « Enfin, une nouvelle maison à prédire est transformée comme les autres, avec la moyenne et l'écart-type calculés pendant l'entraînement. Sinon, ses nombres ne seraient plus comparables. »
   - Longueur ramenée à 220 mots : « donc » et « tient en une ligne » retirés.
   - Non appliquée telle quelle : « juste parce que ses nombres sont dix fois plus grands » (la source parle d'une plage de valeurs dix fois plus large, pas de valeurs dix fois plus grandes).
   - Non appliquée : la phrase sous le dessin de la page 2 (un schéma n'a pas de légende, A45) ; son contenu est passé dans le texte de la page.
10. Page 4 : pied de page poussé hors de la page après la correction 8 (1 375 px pour 1 294).
   - Avant : « Une façon courante de normaliser s'appelle la **standardisation**. Après elle, les valeurs de chaque caractéristique sont centrées sur 0, et leur écart habituel autour de la moyenne, l'écart-type, vaut 1, quelle que soit l'unité. »
   - Après : « La **standardisation**, une façon courante de normaliser, centre les valeurs de chaque caractéristique sur 0 et ramène à 1 leur écart habituel autour de la moyenne. »

## Compréhension, passage 2 (carrousel 7,92/10, post 8,25/10)

11. Page 2 : le coût dit en mots simples, la cause de l'étirement écrite.
   - Avant : « Le coût $J$ forme une vallée ; chaque ovale relie des réglages de même coût. Pour 120 m² et 3 chambres, la surface pèse bien plus : la vallée s'étire. »
   - Après : « Le coût $J$ mesure l'erreur selon les poids. Changer le poids de la surface (120 m²) le bouge bien plus que celui des chambres (3) : la vallée s'étire. »
   - Étiquette du centre du dessin : « coût le plus bas » → « le fond : l'erreur la plus basse ». (La phrase sur les ovales ne tient plus dans les 32 mots ; elle est dans la description du dessin.)
   - Page 5, point 1 : « Le coût $J$ forme une vallée. Pour 120 m² et 3 chambres, la surface pèse bien plus : la vallée s'étire. » → « Changer le poids de la surface (120 m²) bouge bien plus le coût $J$ que celui des chambres (3) : la vallée s'étire. »
12. Page 3, cas « Elle zigzague » : la cause du zigzag écrite (réponse à « Vérifiez-vous »).
   - Avant : « Chaque pas rebondit d'un bord à l'autre et avance peu. »
   - Après : « Un pas assez grand pour avancer dans la longueur dépasse le fond dans la largeur : il rebondit d'un bord à l'autre et avance peu. »
13. Page 3, encadré : « varient ensemble » dit en mots simples, la nuance gardée.
   - Avant : « Surface et chambres varient souvent ensemble (Nº 12) : leur vallée s'arrondit sans devenir tout à fait ronde. »
   - Après : « Les grandes maisons ont souvent plus de chambres (Nº 12) : la vallée s'arrondit alors sans devenir tout à fait ronde. »
   - Non appliquée : « elle s'en rapproche assez pour que la descente aille bien plus vite » (affirmation générale non sourcée, et retirerait la nuance de LeCun et al.).
14. Page 4 : phrase allégée.
   - Avant : « La **standardisation**, une façon courante de normaliser, centre les valeurs de chaque caractéristique sur 0 et ramène à 1 leur écart habituel autour de la moyenne. »
   - Après : « La **standardisation** est une façon courante de normaliser : chaque valeur devient son écart à la moyenne, compté en écarts-types. Toutes les caractéristiques se mesurent alors avec la même règle. »
15. Page 5, point 2 : phrases complètes.
   - Avant : « Vallée allongée : la descente zigzague. Vallée ronde : elle va droit au minimum. »
   - Après : « Dans une vallée allongée, la descente zigzague ; dans une vallée ronde, elle va droit au minimum. »
16. Post :
   - « Un modèle linéaire multiplie chaque valeur par un nombre, son poids, puis additionne. » → « Le programme multiplie chaque valeur par un nombre, son poids, puis additionne pour calculer un prix. »
   - « La descente de gradient corrige ces poids par petits pas. Un pas assez petit pour la surface est trop petit pour les chambres : leur poids avance très lentement. L'entraînement rebondit et ralentit ; avec des écarts énormes, il peut même ne jamais aboutir. » → « Pour apprendre, le programme corrige ces poids par petits pas. Un pas qui convient à la surface est minuscule pour les chambres : leur poids avance à peine. L'apprentissage zigzague et ralentit ; avec des écarts énormes, il peut ne jamais aboutir. »
   - Page 2 et post ramenés aux limites (32 et 220 mots) : « d'un rien » et « même » retirés.
17. Page 4 : pied de page poussé hors de la page après la correction 14 (1 331 px pour 1 294).
   - Avant : « …compté en écarts-types. Toutes les caractéristiques se mesurent alors avec la même règle. »
   - Après : « …compté en écarts-types : la même règle pour toutes. »
