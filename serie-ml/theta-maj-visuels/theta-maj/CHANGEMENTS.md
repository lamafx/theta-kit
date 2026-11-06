# Théta (θ) · mise à jour des visuels

Cette mise à jour ne remplace pas l'identité de Théta. Palette, polices (Geist, Geist Mono, STIX Two Text), format 1080 x 1350, marges, signature sans photo et page de fin claire restent identiques.
Elle change trois choses : la couverture, la place du robot dans les pages et les tailles de texte minimales.

## 1. Couverture : version A, le robot joue le sujet

**Avant :** le robot blanc, vu de face, toujours au centre de la couverture, tête seule.
**Après :** le robot apparaît en buste, en gros plan et coupé par un bord du visuel. Il fait un geste qui raconte le sujet de l'épisode.

La règle :
1. Chaque épisode reçoit un verbe : chercher, montrer, se demander, ranger, examiner, peser, compter, freiner, se tromper, régler, tracer, transmettre, être attentif.
2. Le verbe donne le geste. Il y a 13 gestes, visibles dans `robot/apercus/planche.png`.
3. Le geste donne la position du robot (droite, gauche, bas, haut ou bas-centre) : il se place là où son bras peut atteindre le motif.
4. Ses yeux suivent son geste.
5. Le titre est en bas, sauf quand le robot occupe le bas : il passe alors en haut.

Exemples validés :

| Épisode | Verbe | Geste | Position |
|---|---|---|---|
| Nº 08 Descente de gradient | chercher | main en visière | droite |
| Nº 16 Sigmoïde | montrer | doigt pointé sur 0,5 | gauche |
| Nº 31 Arbres de décision | se demander | main au menton | bas |
| Nº 35 k-means | ranger | dépose un point dans un groupe | haut |

Les 62 épisodes ont reçu leur verbe et leur geste dans `data/episodes.json`, avec une description du motif à dessiner.

## 2. Pages intérieures : le contenu prend la place

- **Le robot sort des pages techniques.** Il revient seulement en petit, dans un encadré de conseil ou d'alerte (exemple : page Piège), et en grand sur la page de fin.
- **Schéma plein cadre :** le schéma peut occuper toute la largeur (1080 px, sans marge), avec les annotations posées directement dessus.
- **Formule annotée :** chaque symbole porte sa légende reliée par un trait, à la place du tableau de légendes.
- **Une idée et deux phrases au plus par page.**

## 3. Lisibilité sur téléphone

Une page de 1080 px s'affiche à environ 390 px sur un téléphone : tout est divisé par 2,8.

| Élément | Avant | Après |
|---|---|---|
| Légendes de schéma | 16 px | 22 px |
| En-tête et rubrique | 17 px | 22 px |
| Signature | 20 px | 24 px |
| Texte courant | 27 px | 30 px |
| Titre de page | 54 px | 60 px |
| Titre de couverture | 108 px | 124 px (96 px pour les titres longs) |

Règle : aucun texte sous 22 px.

## Fichiers livrés

| Fichier | Statut | Rôle |
|---|---|---|
| `robot/robot.mjs` | nouveau | Robot paramétrique : tête, buste, bras, mains, accessoires |
| `robot/gestures.json` | nouveau | Les 13 gestes et les 5 placements sur la couverture |
| `robot/apercus/planche.png` | nouveau | Aperçu des 13 gestes |
| `scripts/apercu-gestes.mjs` | nouveau | Régénère les aperçus après modification d'un geste |
| `templates/couverture.mjs` | remplace l'ancienne couverture | Génère la couverture d'un épisode |
| `motifs/08.svg`, `16.svg`, `31.svg`, `35.svg` | nouveau | Motifs des 4 couvertures validées |
| `templates/exemples/couverture-*.html` | nouveau | Les 4 couvertures validées |
| `templates/exemples/page-*.html` | nouveau | Pages de référence : schéma plein cadre, formule annotée, robot en note |
| `design/tokens.json` | modifié | Ajout des tailles minimales et des règles de pages |
| `data/episodes.json` | modifié | Ajout des champs `verbe`, `geste`, `doigts` et `motif` |

## Ce qu'il reste à faire dans le projet

1. **Copier ces dossiers à la racine du projet**, en gardant la même arborescence. Les scripts en `.mjs` tournent avec Node 18+ et n'ont pas besoin de `package.json`.
2. **Remplacer l'ancienne couverture** (robot de face, au centre) par `templates/couverture.mjs` dans le pipeline. Commande : `node templates/couverture.mjs 08`, ou `tout` pour les 62.
3. **Dessiner les 58 motifs manquants** dans `motifs/NN.svg`, d'après le champ `motif` de `data/episodes.json`. Tant qu'un motif manque, le générateur affiche un avertissement et laisse la zone vide.
4. **Mettre à jour les gabarits de pages existants** (ouverture, mécanisme, formule, comparaison, exemple, piège, fin) avec les tailles du tableau ci-dessus.
5. **Retirer le robot des pages techniques**, sauf dans un encadré de conseil ou d'alerte.
6. **Garder la page de fin telle quelle :** version claire, robot qui pointe le résumé avec sa baguette. Seules ses tailles de texte changent.

## Dessiner un motif

- Contenu SVG sans balise `<svg>`, en coordonnées 1080 x 1350. `{{accent}}` est remplacé par la couleur d'accent.
- Le motif se place dans la `zone_motif` du placement (`robot/gestures.json`) et rejoint le geste : le doigt touche le point clé, la loupe grossit la bonne case, le point tenu tombe vers son groupe.
- Repères utiles :
  - pointer (gauche) : bout du doigt en (777, 433) ;
  - deposer (haut) : point tenu en (579, 820) ;
  - regler (droite) : bouton en (292, 791) ;
  - loupe (droite) : lentille centrée en (243, 432), rayon 90.
- Pour un autre geste : x = translate.x + x_local × scale (× -1 si miroir), y = translate.y + y_local × scale.
- Pas de phrase dans le motif, seulement des étiquettes courtes à 22 px minimum.
