# Relecture · Nº 01 · Qu'est-ce que le Machine Learning ?

Relecture du 2026-11-01, après la session de design n° 2 (textes resserrés à 32 et 55 mots, nouvelle couverture). Les décisions déjà tranchées (D1 à D21, audits 01.1 à 01.4) ne sont pas rouvertes. Aucune correction proposée ne fait dépasser les limites de mots.

**Contrôle prioritaire : nuances perdues en resserrant** (comparaison avec la version d'avant la session, telle que la décrivent `sortie/01/corrections.md` et la relecture précédente)

- **Page 2** : la prédiction de cas nouveaux et le cas supervisé sont gardés. Rattacher la prédiction au seul cas supervisé est même plus fidèle au glossaire Google (« In supervised machine learning, a model… infers a prediction »). En revanche, le marqueur « Ici », qui disait que l'épisode se place dans ce cas particulier, a disparu : « En apprentissage supervisé, … » définit le cas sans dire que la suite s'y tient. Voir D2.
- **Page 3** : retirer « Pourquoi apprendre ? » ne retire aucune nuance. « en combinant règles et apprentissage » est gardé. « maliciels » est un terme privilégié par l'Office québécois de la langue française (fiche « logiciel malveillant », qui liste aussi « maliciel ») et traduit exactement « malware ». Aucune correction.
- **Page 4** : **perte de précision.** « lui suffisent pour y parvenir » renvoie, à la lecture, à la phrase qui précède (« le programme apprend lesquels comptent »), et non au titre. Or Samuel donne les 8 à 10 heures pour « jouer mieux que son auteur », pas pour trier les critères. Voir D1.
- **Page 5** : « des cas proches » a perdu son complément (« de ses exemples »). Le titre juste au-dessus (« Loin de ses exemples ») et l'étiquette du nuage (« ce que couvrent les exemples ») le rendent. Raccourci acceptable, sans correction. Les phrases « mais rien ne le garantit » et « ses erreurs peuvent augmenter » sont intactes. La phrase sur Samuel garde son sens : l'humain a écrit les critères, et le programme a choisi parmi eux. Le point D1 de la relecture précédente (extrait `dlb-iid` pour appuyer « proches ») n'apparaît pas dans les sources. Je ne le rouvre pas.
- **Couverture** : aucune affirmation (titre, accroche de la fiche, auteur). Rien à vérifier sur le fond.

## Mises en conformité (appliquées automatiquement)

Aucune. Les textes n'ont pas de tiret long ni de citation entre guillemets. Les chiffres sont datés et sourcés (2019, 1959, « Selon l'article »), et le crédit est au bon format (« Photo : NASA · Public domain · Wikimedia Commons »). « Rien ne garantit » est une formule absolue, mais elle est vraie et sourcée (dlb-induction : « not logically valid »).

## Décisions de l'utilisateur

### D1 · Page 4, `texte` : « y parvenir » rattache les 8 à 10 heures au mauvais objet

- **Constat** : dans le corps de la page, « y parvenir » renvoie à « apprend lesquels comptent ». L'affirmation de Samuel (jouer mieux que son auteur) ne figure plus que dans le titre. Le chiffre est donc attaché à un autre résultat que celui de l'article.
- **Source vérifiée** : Samuel (1959), *Some Studies in Machine Learning Using the Game of Checkers*, résumé reproduit sur https://synapsesocial.com/papers/W3198350258 (la reproduction MIT, https://people.csail.mit.edu/brooks/idocs/Samuel.pdf, dépasse la taille lisible par WebFetch aujourd'hui ; extraits locaux `samuel-mieux-que-l-auteur`, `samuel-heures`) : « will learn to play a better game of checkers than can be played by the person who wrote the program. Furthermore, it can learn to do this in a remarkably short period of time (8 or 10 hours of machine-playing time) ».
- **Correction proposée** (même nombre de mots, 14 pour 14 ; page toujours à 55) :
  - avant : « Selon l'article, 8 à 10 heures de jeu machine lui suffisent pour y parvenir. »
  - après : « Selon l'article, après 8 à 10 heures de jeu machine, il dépasse son auteur. »
- **Option recommandée** : oui. Le chiffre retrouve l'objet que lui donne Samuel. « il » renvoie au programme, qui est le sujet de la proposition précédente, et « son auteur » lève le doute. Autre option : « lui suffisent pour dépasser son auteur », plus proche de la version d'avant, mais avec 1 mot de plus (56), donc hors limite.
- **Décision** : oui / non / autre

### D2 · Page 2, `texte` : le cas particulier n'est plus dit comme celui de l'épisode

- **Constat** : la version précédente disait « Ici, chaque exemple a sa réponse […] : l'apprentissage supervisé » (décision D20). La version resserrée dit « En apprentissage supervisé, chaque exemple a sa réponse », ce qui définit le cas sans dire que l'épisode s'y place. La règle éditoriale demande de dire explicitement que l'épisode illustre un cas particulier. La page 6 le dit encore (« prédit ici »), mais la page 2 ne le dit plus.
- **Source vérifiée** : Google, *Machine Learning Glossary*, https://developers.google.com/machine-learning/glossary (extrait local `glossaire-modele`, lu le 2026-10-31) : « In supervised machine learning, a model takes an example as input and infers a prediction as output. » ; DLB 5.1.3 (`dlb-supervise`) : « each example is also associated with a label or target ».
- **Correction proposée** (3 mots pour 3 ; page toujours à 32) :
  - avant : « En apprentissage supervisé, chaque exemple a sa réponse ; le modèle prédit celle de cas nouveaux. »
  - après : « Ici, apprentissage supervisé : chaque exemple a sa réponse ; le modèle prédit celle de cas nouveaux. »
- **Option recommandée** : oui. La correction rétablit le « Ici » choisi en D20 et suit la forme nominale des deux phrases qui précèdent (« Programme classique : … Machine Learning : … »). Autre option : ne rien changer, si vous jugez suffisants l'étiquette du schéma (« Apprentissage supervisé ») et le « ici » de la page 6.
- **Décision** : oui / non / autre

## Contrôles automatiques (serie verifier)

Recopie de `sortie/01/verification.md` :

Résultat : aucune erreur bloquante, 6 avertissement(s).

Images manquantes (variante sans image)
- page 3 (capture) : aucune image retenue pour « Votre dossier spam, adresses et noms floutés » ; rendue dans sa variante sans image

Avertissements
- page 2 (ouverture) : 32 mots, proche de la limite de 32
- page 3 (capture) : 55 mots, proche de la limite de 55
- page 4 (contexte) : 55 mots, proche de la limite de 55
- page 5 (piège) : 55 mots, proche de la limite de 55
- page 5 (piège) : texte : « erreurs » est le terme « erreur (résidu) », introduit à l'épisode 05 (mot courant : vérifier le sens)
- page 3 (capture) : image manquante : variante sans image

Mesures

| Page | Mots | Vide au-dessus du pied (px) |
| --- | ---: | ---: |
| 1 | 5 | 54 |
| 2 | 32 | 200 |
| 3 | 55 | 122 |
| 4 | 55 | 127 |
| 5 | 55 | 50 |
| 6 | 0 | 6 |

Seuil de remplissage : 233 px.

Note du relecteur : à la page 5, « erreurs » a son sens courant (une prédiction fausse), pas le sens du résidu de l'épisode 05.

## Affirmations et sources

| Page | Affirmation | Extrait | Vérifiée sur |
| --- | --- | --- | --- |
| 2 | Programme classique : règles écrites à la main ; Machine Learning : modèle tiré d'exemples. | dlb-taches, dlb-donnees | DLB ch. 5, https://www.deeplearningbook.org/contents/ml.html (extraits locaux, déjà vérifiés aux relectures précédentes) |
| 2 | En apprentissage supervisé, chaque exemple a sa réponse ; le modèle prédit celle de cas nouveaux. | dlb-supervise, glossaire-modele | [Machine Learning Glossary (Google)](https://developers.google.com/machine-learning/glossary) ; DLB 5.1.3 |
| 3 | Certaines tâches sont trop difficiles pour des règles écrites à la main. | dlb-taches | DLB ch. 5 (extrait local) |
| 3 | En 2019, Google indique bloquer dans Gmail plus de 99,9 % des spams, du phishing et des maliciels, en combinant règles et apprentissage. | gmail-date, gmail-999, gmail-regles | [Spam does not bring us joy… (Google Workspace Blog)](https://workspace.google.com/blog/product-announcements/ridding-gmail-of-100-million-more-spam-messages-with-tensorflow), lu le 2026-11-01 : « February 7, 2019 » ; « they help block more than 99.9 percent of spam, phishing, and malware from reaching Gmail inboxes » ; « complement existing ML and rules-based protections » |
| 3 | L'apprentissage repère des motifs que les auteurs de règles pourraient manquer. | gmail-motifs | même billet : « helping us identify patterns in large data sets that humans who create the rules might not catch » |
| 4 | En 1959, Arthur Samuel emploie le terme machine learning dans le titre d'un article sur un programme de dames. | samuel-publication, samuel-titre, samuel-auteur | Samuel 1959, IBM Journal 3(3) (extraits locaux, reproduction MIT) |
| 4 | L'auteur fournit des critères ; en jouant, le programme apprend lesquels comptent. | samuel-liste-fournie | [résumé de Samuel (synapsesocial)](https://synapsesocial.com/papers/W3198350258) : liste de paramètres « redundant and incomplete », dont les signes et poids sont inconnus |
| 4 | Selon l'article, 8 à 10 heures de jeu machine suffisent (voir D1 pour l'objet). | samuel-heures, samuel-mieux-que-l-auteur | même résumé : « (8 or 10 hours of machine-playing time) » |
| 4 (image) | Un IBM 704 au centre Langley de la NACA. | samuel-ibm-704 | [Commons, GPN-2000-001881](https://commons.wikimedia.org/wiki/File:IBM_Electronic_Data_Processing_Machine_-_GPN-2000-001881.jpg) : « IBM type 704 electronic data processing machine », Langley NACA, 21 mars 1957, NASA, domaine public |
| 5 | Règles tirées d'un nombre limité d'exemples : bonne prédiction possible sur des cas proches, sans garantie. | dlb-induction, dlb-probable, dlb-generalisation | DLB 5.1 et 5.2 (extraits locaux) |
| 5 | Face à un cas très différent, ses erreurs peuvent augmenter. | wilds-decalage | [arXiv:2012.07421, WILDS](https://arxiv.org/abs/2012.07421) (extrait local, vérifié le 2026-11-01 à la relecture précédente) |
| 5 | Samuel avait écrit les critères parmi lesquels son programme choisissait. | samuel-liste-fournie, samuel-liste-humaine | Samuel 1959 : « from a supplied list » ; « a man-generated list » (extraits locaux) |
| post | En 2019, environ 100 millions de spams de plus bloqués chaque jour grâce à TensorFlow, outil développé par Google ; adaptation rapide à des spams qui changent. | gmail-100-millions, gmail-tensorflow, gmail-adapte | même billet, lu le 2026-11-01 : « With TensorFlow, we are now blocking around 100 million additional spam messages every day. » ; « an open-source machine learning (ML) framework developed at Google » ; « adapt quickly to ever-changing spam attempts » |

Fiche : la définition attribuée à Samuel (« à ne pas écrire ») est absente. La page 6 annonce bien l'épisode suivant de la fiche, Nº 02, « Données, caractéristiques et étiquettes », avec sa transition (« Mais à quoi ressemble un exemple, pour une machine ? »).

Image de la page 4 : elle montre sans ambiguïté l'objet (un IBM 704), le lieu (Langley, NACA) et l'époque (1957). La légende ne prétend pas qu'il s'agit de la machine de Samuel. Le crédit est en français, et seul le libellé est traduit.

À l'œil (planche) : rien ne gêne la lecture. La couverture (robot qui pointe le nuage) laisse le titre et l'accroche dégagés. La page 5 est la plus serrée (50 px de vide), mais le nuage, ses étiquettes et l'encadré restent bien séparés. Sur la page 4, la fin de phrase « lui suffisent pour y parvenir » tombe seule sur la dernière ligne, ce qui rend plus visible le défaut de renvoi traité en D1.

## Validation scientifique

**Page 2** · Hypothèse : le modèle est tiré d'exemples ; en supervisé, chaque exemple a sa réponse. · Domaine : l'apprentissage supervisé ; la page ne dit plus que c'est celui de l'épisode (D2). · Contre-exemple : en non supervisé et par renforcement, les exemples n'ont pas de réponse ; la restriction « En apprentissage supervisé » les tient à l'écart. · Raccourci : « règles écrites à la main » pour « fixed programs written and designed by human beings ».

**Page 3** · Hypothèse : des mails déjà triés servent d'exemples. · Domaine : Gmail, chiffres de Google publiés en 2019. · Contre-exemple : les règles restent utiles, et le texte le dit (« en combinant »). · Raccourci : 99,9 % est le résultat de l'ensemble des protections, pas de l'apprentissage seul ; « en combinant » le respecte.

**Page 4** · Hypothèse : l'auteur fournit les critères ; le programme apprend lesquels comptent. · Domaine : un programme de dames, sur un IBM 704, dans l'article de 1959. · Contre-exemple : le résultat vaut face à son auteur, pas face à un maître (la victoire sur Nealey date de 1962, et la page ne la revendique pas). · Raccourci : « 8 à 10 heures » pour « 8 or 10 hours », attribué à l'article ; l'objet du chiffre est à rétablir (D1).

**Page 5** · Hypothèse : « proches » veut dire tirés de la même distribution que les exemples. · Domaine : un modèle supervisé jugé sur des cas nouveaux. · Contre-exemple : un cas proche peut être mal prédit (« rien ne le garantit » le couvre) ; un cas éloigné peut être bien prédit (« peuvent augmenter » le couvre). · Raccourci : « proches » et « très différent », sans complément, s'appuient sur le titre ; le décalage de distribution (WILDS), qui concerne une population, est ramené à un seul cas.

**Post** · Hypothèse : TensorFlow sert ici d'outil d'apprentissage, et les chiffres sont ceux que donne Google. · Domaine : Gmail, février 2019. · Contre-exemple : aucun, chaque chiffre est attribué au billet. · Raccourci : « outil d'apprentissage » pour « machine learning framework ».
