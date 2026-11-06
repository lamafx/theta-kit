# Architecture d'un carrousel

Extrait du document de conception. Ce fichier fait foi.

## 1. Architecture d'un carrousel

Chaque post suit le même squelette : une couverture sombre, une page d'ouverture claire avec le grand titre, des pages de contenu claires sans grand titre, puis une page de fin claire où le robot revient résumer. Seul le nombre de pages de contenu varie, ce qui donne deux formats qu'on alterne.

### L'ordre des pages

1. **Couverture** (sombre) : le robot, le fond propre au sujet, le numéro, le titre, l'accroche et « Glissez → ».
2. **Ouverture** (claire) : le grand titre du sujet, la phrase d'intuition et le premier visuel. C'est la page éditoriale validée (Direction C).
3. **Pages de contenu** (claires) : plus de grand titre, seulement un titre de page court. La place gagnée sert à l'explication et au visuel.
4. **Fin** (claire, fond gris-bleu #EEF2F8) : à retenir en 3 points en grand, puis un encadré « Vérifiez-vous », puis l'épisode suivant (titre et phrase de transition de la fiche) et l'invitation à suivre la série sur une ligne sobre. Le robot de la couverture revient en bas à droite et pointe le résumé avec une baguette.
   L'encadré « Vérifiez-vous » pose une question sur l'épisode (30 mots au plus), suivie de « Réponse : page N ». La question ne porte que sur ce que l'épisode a montré, et la page N y répond.

### Les types de pages de contenu

| Type | Ce que la page fait | Exemple (descente de gradient) |
| --- | --- | --- |
| Problème | Montre pourquoi la notion existe | Le modèle ne voit que la pente sous ses pieds |
| Mécanisme | Explique comment ça marche, avec un schéma | Une pente forte donne un grand pas, une pente faible un petit pas |
| Comparaison | Met 2 ou 3 cas côte à côte | η trop petit, bien choisi, trop grand |
| Formule | Donne la formule et la légende de chaque symbole | θ ← θ − η∇J |
| Exemple chiffré | Déroule le calcul sur de vraies valeurs | Trois itérations à la main |
| Piège | Montre l'erreur classique à éviter | Oublier de normaliser les données |
| Contexte | Ancre la notion dans un fait réel et daté, avec une image réelle créditée | 1959 : le programme de dames d'Arthur Samuel sur IBM 704 |

**Ces types sont une boîte à outils, pas un plan obligatoire.** Les maquettes de l'épisode 08 montrent le style global. Chaque sujet ne prend que les types dont il a besoin : un sujet sans cas à opposer n'a pas de page Comparaison, un sujet sans formule n'a pas de page Formule. Ce qui ne change jamais : la couverture, l'ouverture, la page de fin, l'en-tête, le pied de page et les règles ci-dessous.

### Deux formats en alternance

| Format | Pages | Usage |
| --- | --- | --- |
| Court | 4 à 6 : couverture, ouverture, 1 à 3 pages de contenu, fin | Notions simples ou de transition |
| Long | 7 à 9 : couverture, ouverture, 4 à 6 pages de contenu, fin | Notions centrales, avec formule et comparaison |

Rythme conseillé : un format long et un ou deux formats courts par semaine. Le format de chaque épisode est fixé dans la banque.

### Règles de style communes

- Une seule idée par page.
- 32 mots maximum sur l'ouverture, 55 mots maximum sur une page de contenu (session de design n° 2, 2026-11-01 ; 40 et 70 avant).
- Un terme n'apparaît que s'il a été introduit dans ce post ou dans un épisode précédent.
- Chaque visuel est calculé à partir de la vraie formule, jamais dessiné à l'œil.
- En-tête fixe sur toutes les pages : Nº de l'épisode, chapitre, numéro de page (3/7).
- Pied de page fixe : « Ladji Lama Kamagate » à gauche, numéro de page ou « Glissez → » à droite.
- Polices : Geist (texte), Geist Mono (étiquettes), STIX Two Text (formules, et lettres grecques hors formule : A29). Une seule couleur d'accent bleue.
- Texte d'au moins 24 px sur une page de 1080 × 1350 px, pour rester lisible sur téléphone.

### Le fil de lecture

- **L'ouverture rappelle d'où l'on vient** : une ligne qui cite l'épisode précédent, par exemple « On sait mesurer l'erreur (Nº 05) et lire une pente (Nº 06 et 07) ».
- **Chaque page répond à la question laissée par la précédente.** Si deux pages peuvent s'inverser sans gêne, l'une des deux est de trop.
- **Un symbole est défini à sa première apparition**, dans la phrase même : « η, le taux d'apprentissage, règle la taille du pas ».
- **L'ordre conseillé** : ouverture, puis l'intuition (problème ou mécanisme), puis les cas (comparaison), puis la formule, puis la preuve (exemple chiffré). La formule arrive quand le lecteur sait déjà ce qu'elle va dire.
- **La page de fin reprend les mots exacts des pages** : rien de nouveau n'y apparaît. La question « Vérifiez-vous » porte sur une page de l'épisode, dont elle donne le numéro.

### La couleur d'alerte

Un orange brûlé (#C2410C) est la seule exception à l'accent bleu unique. Il marque ce qui tourne mal : la divergence, un piège, une erreur classique. Il n'apparaît que sur les pages Comparaison et Piège.
