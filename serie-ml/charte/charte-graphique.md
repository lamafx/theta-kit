# Charte graphique

Extrait du document de conception. Ce fichier fait foi.

## 5. Charte graphique

Toutes les valeurs ci-dessous viennent du canevas Claude Design « Théta (θ) — Gabarits officiels », qui contient le carrousel de référence complet de l'épisode 08 (8 pages : couverture, ouverture, mécanisme, comparaison, formule, exemple chiffré, piège, fin). C'est la seule source de style pour l'agent ; l'ancien canevas « Descente de gradient » ne sert plus que d'archive. L'agent les reprend telles quelles, sans les réinterpréter.

### Format

- Page : 1080 × 1350 px (portrait 4:5), export en PDF pour le carrousel LinkedIn.
- Marges : 72 px en haut, 80 px sur les côtés, 56 px en bas.
- Toutes les pages d'un carrousel ont le même format.

### Couleurs

| Rôle | Pages claires | Couverture (sombre) | Page de fin |
| --- | --- | --- | --- |
| Fond | #FFFFFF | #0A0F17 | #EEF2F8 |
| Texte principal | #0E1116 | #F5F8FC | #0E1116 |
| Texte courant | #3E4450 | #A7B3C2 | #3E4450 |
| Texte secondaire, étiquettes | #5F6673 | #8A97A8 | #5F6673 |
| Filets | #E4E6EA | #1E2938 | #D5DCE6 |
| Accent | #2D5BFF | #4C8DFF | #2D5BFF |
| Alerte (divergence, piège) | #C2410C | — | — |

### Typographie

| Usage | Police | Taille | Graisse |
| --- | --- | --- | --- |
| Titre de couverture | Geist | 124 px, 96 px pour un titre long, interlettrage −0,04 em | 600 |
| Titre d'ouverture | Geist | 108 px, interlettrage −0,035 em | 600 |
| Titre de page de contenu | Geist | 60 px, interlettrage −0,03 em | 600 |
| Texte d'explication | Geist | 30 px, interligne 1,45 | 400 |
| Points à retenir (fin) | Geist | 38 px | 500 |
| En-tête, rubriques, étiquettes, légendes de schéma, numéros | Geist Mono ou Geist, interlettrage 0,12 em | 22 px | 500 |
| Signature | Geist | 24 px | 500 |
| Formules et symboles | STIX Two Text, italique pour les variables | 26 à 62 px | 400 |

**Lisibilité sur téléphone** (session de design n° 2, 2026-11-01). Une page de 1080 px s'affiche à environ 390 px : aucun texte sous 22 px (`texte_min`), contrôlé par `serie verifier`. Limites de mots relevées en conséquence : 32 pour l'ouverture, 55 pour une page de contenu. Les en-têtes de tableau ne passent plus en majuscules (un η capital se lit « H »).

**Formules écrites comme en mathématiques** (décision de l'utilisateur, 2026-10-31). Une fraction est empilée, le numérateur au-dessus de la barre et le dénominateur dessous, jamais « 1/n » en ligne : le contenu l'écrit `{1}/{n}` (notation de `serie/balisage.py`). La somme Σ et le produit Π sont droits et agrandis, comme les opérateurs d'un texte de mathématiques.

### Composants fixes

- **En-tête** : « Nº XX » en accent, puis le nom du chapitre à gauche ; « page / total » à droite. Sur la couverture, le nom de la série (« θ Théta », le symbole en STIX italique accent) remplace le numéro de page.
- **Pied de page** : filet, « Ladji Lama Kamagate » à gauche, « Glissez → » à droite sur toutes les pages sauf la dernière.
- **Étiquette de type** : au-dessus du titre de chaque page de contenu (MÉCANISME, COMPARAISON, FORMULE…), en Geist Mono accent.
- **Robot** : sur la couverture d'épisode, depuis la session de design n° 2 (2026-11-01, couverture A), il est en buste, en gros plan, coupé par un bord, et **joue le sujet** : chaque fiche donne un verbe (`couverture.verbe`), le verbe donne l'un des 13 gestes (`couverture.geste`, `bibliotheque/robot-gestes.json`), le geste donne sa position (droite, gauche, bas, haut, bas-centre) ; ses yeux suivent son geste. Le titre est en bas, en haut quand le robot occupe le bas ; 124 px, 96 px pour un titre de plus de 26 caractères ou une ligne de plus de 14. Le robot ne paraît pas sur les pages techniques ; il garde son dessin de face sur la couverture du bilan et sa baguette sur la page de fin.
- **Deux couvertures par épisode** (décision de l'utilisateur, 2026-11-02) : la couverture A et la couverture classique, celle d'avant la session de design n° 2 (robot de face au centre, motif pleine largeur autour de lui, titre 92 px, accroche dessous ; gabarit `couverture-classique.html.j2`, référence Couverture-Classique). `serie rendre` produit les deux (`sortie/NN/couvertures/a.png` et `classique.png`, copiées dans `publier/NN/couvertures/`) ; `couverture: classique` dans le contenu met la classique dans le carrousel (par défaut : `a`). Le motif de la classique se règle à part (`visuel_classique` de la page de couverture), sinon il reprend `visuel`.

**Nom de la série : Théta (θ).** Le symbole des paramètres d'un modèle, présent dans presque chaque épisode. Il s'écrit toujours avec le symbole et le nom ensemble (« θ Théta »), pour rester lisible par un lecteur non technique. Sous-titre : « le Machine Learning, une notion à la fois ». Hashtag de série : #ThetaML (T et ML en majuscules, pour la lisibilité), vérifié libre sur LinkedIn le 2026-10-25 ; il termine chaque post.

### Visuels

- Courbes calculées à partir de la vraie formule, trait noir de 3 px ; chemins et points en accent ; minimum marqué par un cercle blanc cerclé de noir.
- Pas de dégradé de fond, pas d'ombre portée sur les pages claires, pas d'emoji.
- Fond de couverture : le motif calculé de la famille (A11), placé dans la zone que le bras du robot atteint (`zone_motif` de la position), montré à sa taille, plus lumineux au centre de la zone et fondu sur ses bords.
