# Épisode 01 · corrections automatiques

| Page | Ce qui a échoué | Avant | Après |
| --- | --- | --- | --- |
| 2 (ouverture) | Page trop vide : 386 px entre le dernier bloc et le pied (seuil 287) | Titre « Le Machine Learning. » sur 2 lignes, sans légende | Titre de la fiche, « Qu'est-ce que le Machine Learning ? », sur 3 lignes ; légende « Ce qui change, c'est d'où viennent les règles. » |
| 3 (contexte) | Débordement : pied de page poussé à 1296 px (limite 1294) | « Son auteur lui fournit une liste de critères pour juger une position ; en jouant… » ; légende « Un IBM 704 au centre de recherche Langley de la NACA. » (2 lignes) | « Son auteur lui fournit une liste de critères ; en jouant… » ; légende « Un IBM 704 au centre Langley de la NACA. » (1 ligne) |
| 5 (piège) | Aucun contrôle en échec : le nuage collait au texte (vérification à l'œil) | origine [40, 384], cadre par défaut 920 × 420 | origine [40, 408], cadre 920 × 444 : 24 px d'air au-dessus du repère |

## 2026-10-26 · décisions de l'utilisateur, puis contrôles

| Page | Ce qui a échoué | Avant | Après |
| --- | --- | --- | --- |
| 2, 3, 4, 5, 6, post | Décisions de relecture de l'utilisateur (A42) | voir commit « Épisode 01 : généré » | cas supervisé explicite, Samuel 1959 sourcé, spam sourcé et daté (Google, 2019), piège nuancé |
| 3 (contexte) | Débordement : pied de page poussé à 1307 px (limite 1294) après la nouvelle phrase sur Samuel | repère « 1959 · Publication de l'étude dans l'IBM Journal » | repère retiré : le texte dit déjà « En 1959, Arthur Samuel… » |
| post LinkedIn | 117 mots (120 à 220) | intuition en une phrase sur Gmail | ajout : « Écrire une règle pour chaque arnaque serait long ; montrer des mails déjà triés l'est beaucoup moins. » |
| 6 (fin) | « Vérifiez-vous » : mot absent des pages (« donne ») | « En apprentissage supervisé, que donne-t-on au programme ? » | « En apprentissage supervisé, d'où le programme tire-t-il ses règles ? » |

## Mises en conformité de la relecture vérifiée sur le web (2026-10-26)

| Nº | Où | Avant | Après |
| --- | --- | --- | --- |
| C1 | page 4, texte | « …environ 100 millions de spams de plus sont bloqués chaque jour. » | « …étaient bloqués chaque jour en 2019. » |
| C2 | page 2, sources | `dlb-donnees` | `dlb-donnees, dlb-supervise` (nouvel extrait, DLB 5.1.3) |
| C3 | extrait `gmail-999` | « they help block more than 99.9 percent… » | phrase entière : « our existing ML models are highly effective at doing this—in conjunction with our other protections, they help block… » |

## Correction demandée par l'utilisateur (2026-10-30)

Demande : retirer sur toute la série les légendes de commentaire sous les schémas (les légendes et crédits des images réelles restent). Suppression seule, aucune affirmation ajoutée : relecture enregistrée sans nouveau passage du relecteur.

| Page | Avant | Après |
| --- | --- | --- |
| 2 (ouverture) | légende « Ce qui change, c'est d'où viennent les règles. » | pas de légende (vide au-dessus du pied : 243 px, seuil 287) |

## Réécriture demandée par l'utilisateur (2026-10-30) : fil de la saison

Demande : appliquer toutes les pistes de la critique du 2026-10-30 (exemple suivi, mêmes mots d'un épisode à l'autre, une seule nuance par épisode, question de la page précédente rendue visible, vrais pièges, analogies dans le carrousel, posts sans « Dans le carrousel : », hashtags en français), sans aucune mention de projet personnel.

| Page | Avant | Après |
| --- | --- | --- |
| ordre | 3 Contexte (Samuel), 4 Exemple (spam) | 3 Exemple (spam : le problème), 4 Contexte (Samuel : l'origine) ; fiche alignée |
| 2 | « Programme classique : … Apprentissage supervisé, le cas présenté ici : … Non supervisé et par renforcement : Nº 03. » | « Un programme classique suit des règles écrites à la main. En apprentissage supervisé, le cas de cet épisode, on montre des exemples et leurs réponses : le modèle en tire lui-même les règles. » |
| 3 (spam) | titre « …à écrire seules. » ; phrase TensorFlow | titre « …à écrire à la main. » ; ouvre sur « Pourquoi apprendre ? » (dlb-taches) ; la phrase TensorFlow passe dans le post ; légende de l'image « Un dossier Spam. » |
| 4 (Samuel) | — | ouvre sur « L'idée n'est pas neuve. » |
| 5 (piège) | titre « Il dépend de ce que contiennent ses exemples. » ; « Le programme tire… » | titre « Hors de ses exemples, sa réponse est moins sûre. » ; « Le modèle tire… » ; encadré « …ceux qui conçoivent le modèle » |
| 6 (fin) | « Le programme en tire les règles. » ; « Il dépend de… » | « Le modèle en tire lui-même les règles. » ; « Hors de ses exemples, sa réponse est moins sûre. » |
| post | intuition 99,9 % (répétait la page) ; « Dans le carrousel : … » | intuition : 100 millions de spams de plus par jour (2019) ; promesse rédigée sans sommaire |

| Nº | Page | Avant | Après |
| --- | --- | --- | --- |
| C1 (relecture 2026-10-30) | 2 (ouverture), sources | [dlb-donnees, dlb-supervise] | + dlb-taches |
| D15 (relecture 2026-10-30, erreur de la réécriture) | post, intuition | « grâce à un nouvel outil d'apprentissage, TensorFlow » | « grâce à TensorFlow, un outil d'apprentissage développé par Google » |

## Demande de l'utilisateur (2026-10-31) : « page deux, le contexte n'est pas encore établi et on énonce apprentissage supervisé »

- Page 2, texte : « Un programme classique suit des règles écrites à la main. En apprentissage supervisé, le cas de cet épisode, on montre des exemples et leurs réponses : le modèle en tire lui-même les règles. » → « Un programme classique suit des règles écrites à la main. Le Machine Learning apprend d'exemples : il en tire un modèle, qui prédit la réponse de cas nouveaux. Ici, chaque exemple a sa réponse : l'apprentissage supervisé. » Source ajoutée : glossaire MLCC (glossaire-modele), ajouté à la fiche 01.
- Page 6, point 1 : « Apprentissage supervisé : des exemples et leurs réponses. » → « Apprentissage supervisé : chaque exemple a sa réponse. »
- Page 6, point 2 : « Le modèle en tire lui-même les règles. » → « Le Machine Learning en tire un modèle, qui prédit la réponse de cas nouveaux. »

## Mises en conformité de la relecture du 2026-10-31

- C1 · Extraits : ajout de `gmail-tensorflow` (« TensorFlow, an open-source machine learning (ML) framework developed at Google ») ; texte publié inchangé.

## Décisions de la relecture appliquées (2026-11-01, demande de l'utilisateur : « applique toutes les recommandations »)

- D20 · Page 2 : « il en tire un modèle, qui prédit la réponse de cas nouveaux. Ici, chaque exemple a sa réponse : l'apprentissage supervisé. » → « il en tire un modèle. Ici, chaque exemple a sa réponse ; le modèle prédit celle de cas nouveaux : l'apprentissage supervisé. » ; fin, point 2 : « qui prédit la réponse » → « qui prédit ici la réponse ».
- D12 · Page 2, schéma : « Règles » → « Modèle » (et la description).
- D13 · Page 3, légende : « Un dossier Spam. » → « Le tri du spam, simplifié. »
- D14 · Page 3, sources : + glossaire-spam, dlb-supervise.
- D17 · Page 4 : « L'idée n'est pas neuve. » → « L'idée de faire apprendre la machine n'est pas neuve. »
- D7 · Page 5 : « probablement justes, pas certaines » → « probablement justes pour la plupart des cas, pas certaines ».
- D18 (option 1) · Page 5, titre : « Hors de ses exemples, sa réponse est moins sûre. » → « Loin de ses exemples, rien ne garantit sa réponse. » ; texte : « sa réponse est moins sûre » → « ses erreurs peuvent augmenter » (extrait wilds-decalage, WILDS ajouté à la fiche) ; fin, point 3 et post, promesse alignés.
- D6 · Page 5, visuel : « un cas jamais vu » → « un cas éloigné ».
- D21 · Vérification : « En apprentissage supervisé, d'où le modèle tire-t-il ses règles ? » → « D'où le Machine Learning tire-t-il un modèle ? »
- D16 · Post, intuition : « Écrire une règle pour chaque arnaque serait long ; montrer des mails déjà triés l'est beaucoup moins. » → « Selon le même billet, l'apprentissage permet de s'adapter vite à des spams qui changent sans cesse. » (extrait gmail-adapte).
- Gardés comme recommandé : D1 (non), D3 (inutile avec D12), D8, D10, D19. D11 et D13 (gabarit) : déjà dans AMBIGUITES A46 (d) et (e).

## Audit éditorial et scientifique de l'utilisateur (2026-11-01)

- 01.3 · Page 5 : « elles sont probablement justes pour la plupart des cas, pas certaines. » → « au mieux, elles sont probablement justes pour la plupart des cas, sans garantie. » (DLB : « Machine learning promises to find rules that are probably correct… » : une visée, pas une garantie.)
- 01.1, 01.2, 01.4 : déjà conformes (page 2 « Ici, chaque exemple a sa réponse […] : l'apprentissage supervisé » ; page 3 « en combinant règles et apprentissage » ; page 5 « ses erreurs peuvent augmenter »), inchangés.

## Second audit de l'utilisateur (2026-11-01)

- 01.1 · Page 5 : « au mieux, elles sont probablement justes pour la plupart des cas, sans garantie. Face à un cas très différent de ses exemples, ses erreurs peuvent augmenter. » → « il peut bien prédire des cas proches de ses exemples, mais rien ne le garantit. Face à un cas très différent, ses erreurs peuvent augmenter. » (−1 mot ; dlb-induction, dlb-generalisation, wilds-decalage). Remplace la décision D1 de la relecture.
- 01.2 · Page 4, « Selon l'article, 8 à 10 heures de jeu machine lui suffisent pour jouer mieux que son auteur » : inchangé. Fidèle au résumé de Samuel (« It can learn to do this in a remarkably short period of time (8 or 10 hours of machine-playing time) »), rapporté à l'article et à ce programme (« lui »), avec les critères fournis par l'auteur dits juste avant.


## Session de design n° 2 (2026-11-01) : couverture A et lisibilité sur téléphone

Décision de l'utilisateur (A54) : texte en 30 px, aucun texte sous 22 px, limites abaissées à 32 mots (ouverture) et
55 (page de contenu), textes resserrés sans retirer de nuance. Points notables :
- Page 2 : phrases nominales (« Programme classique : règles écrites à la main. Machine Learning : modèle tiré d'exemples. ») ; « En apprentissage supervisé » et la prédiction de cas nouveaux gardés.
- Page 3 : « Pourquoi apprendre ? » retiré ; « logiciels malveillants » → « maliciels ».
- Page 4 : phrase d'introduction retirée ; « pour jouer mieux que son auteur » → « pour y parvenir » (le titre le dit).
- Page 5 : « des cas proches de ses exemples » → « des cas proches » ; phrase sur Samuel resserrée.
- Couverture : geste « pointer », titre en 96 px.
- Relecture du 2026-11-01 (après resserrage), D1 et D2 appliquées : elles rétablissent une précision perdue en resserrant (page 4 : « lui suffisent pour y parvenir » → « après 8 à 10 heures de jeu machine, il dépasse son auteur ») et le « Ici » de la décision D20 (page 2 : « En apprentissage supervisé, chaque exemple… » → « Ici, apprentissage supervisé : chaque exemple… ») ; même nombre de mots.

## Réécriture du texte du post (2026-11-05, A63)

Demande de l'utilisateur : réécrire le post selon `theta-post/`, textes validés le 2026-11-05. Pages du carrousel inchangées.

- Avant : bloc `linkedin` en quatre parties (commit d57f104).
- Après : bloc `linkedin` en `texte` libre ; rapport dans `theta-post/episodes/brouillons/01_qu-est-ce-que-le-machine-learning_v1.md`.

## Validation du 2026-11-06

Épisode relu et validé par l'utilisateur, qui a demandé le passage à « relu » et l'enregistrement de la relecture. Le sous-agent `relecteur` n'a pas été repassé sur le texte du post réécrit ; `sortie/01/relecture.md` reste le rapport précédent et ses décisions D n'ont pas été arbitrées une à une.
