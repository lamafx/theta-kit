# Relecture · Nº 02 · Données, caractéristiques et étiquettes

Relecture du 2026-11-01, après la session de design n° 2 (textes resserrés : 32 mots à l'ouverture, 55 par page ; nouvelle couverture). J'ai comparé l'état d'avant, celui que vérifiait la relecture précédente (texte de `publier/02/texte.txt` et pages `publier/02/apercus/`), avec `contenu/02.yaml` actuel. Je n'ai pas pu lancer `git show e57677b` (pas de shell dans ce passage). Les aperçus publiés donnent pourtant le texte exact d'avant le resserrage : page 2 à 38 mots, page 3 à 66.

**Ce que le resserrage a changé :**
- Les pages 4 et 5, la fin, le post et les encadrés sont identiques à l'état d'avant.
- Page 2 : « Ici, » a disparu. La phrase d'ouverture devient une vérité générale, fausse pour l'apprentissage non supervisé (voir C1). « Ici » avait été ajouté par une décision de l'utilisateur (D23).
- Page 3 : « Dans ce tableau, » a disparu. Cette nuance avait été rétablie deux fois en mise en conformité (relectures du 2026-10-30 et du 2026-10-31). Voir C2.
- Page 3 : les unités d'origine (« pieds carrés », « dollars ») ont disparu, alors que les en-têtes ne gardent que les noms de la source. Le maintien de ces unités en page 3 était la condition de la demande de l'utilisateur du 2026-11-01. Voir D1.
- Le reste des coupes (possessifs « sa, ses, son » en page 2, « Voici », « sous les noms de colonnes de la source » devenu « colonnes sous leurs noms d'origine ») ne retire aucune nuance.

Les corrections ci-dessous tiennent toutes dans les nouvelles limites : chaque mot ajouté est compensé par un mot retiré. Le compte suit `compter_mots` : titre et texte, mots séparés par des blancs, ponctuation isolée exclue.

## Mises en conformité (appliquées automatiquement)

**C1 · Page 2, `texte` : le cas particulier n'est plus dit.** « Le modèle apprend d'exemples à la réponse connue » se lit comme une règle générale. Or l'apprentissage non supervisé apprend d'exemples sans réponse, et c'est l'objet du Nº 03 annoncé en fin d'épisode. Cela contredit la règle « si un épisode illustre un cas particulier, le dire explicitement » et défait la décision D23 de l'utilisateur (« Ici, »).
- Source vérifiée : glossaire MLCC, https://developers.google.com/machine-learning/glossary, entrée *unsupervised machine learning* : « Training a model to find patterns in a dataset, typically an unlabeled dataset. » ; entrée *supervised machine learning* : « Training a model from features and their corresponding labels. »
- Avant : « Le modèle apprend d'exemples à la réponse connue. Pour lui, une maison vendue n'est qu'une ligne de tableau : surface, chambres, quartier, puis prix, la réponse à apprendre. » (32 mots avec le titre)
- Après : « Ici, le modèle apprend d'exemples à la réponse connue. Pour lui, une maison n'est qu'une ligne de tableau : surface, chambres, quartier, puis prix, la réponse à apprendre. » (32 mots avec le titre ; « vendue » est retiré pour compenser, et la vente reste dite sur la même page par l'étiquette du visuel « une vente à Ames en 2010 »)
- Règle appliquée : cas particulier dit explicitement (CLAUDE.md, Règles éditoriales Théta) ; une nuance n'est jamais retirée pour passer un contrôle.

**C2 · Page 3, `texte` : la formule « chaque colonne sauf la dernière, une caractéristique » n'est plus bornée au tableau montré.** Dans un jeu de données, une colonne peut n'être ni caractéristique ni étiquette : MLCC le dit, et dans Ames c'est le cas des colonnes `Order` et `PID`.
- Source vérifiée : MLCC, *Feature vectors*, https://developers.google.com/machine-learning/crash-course/numerical-data/feature-vectors : « For example, suppose a dataset provides five columns, but only two of those columns (`b` and `d`) are features in the model. »
- Avant : « Chaque ligne est un exemple ; chaque colonne sauf la dernière, une caractéristique : une variable d'entrée. […] Converties en m² et en FCFA, cours BCEAO du 27 octobre 2026. » (55 mots)
- Après : « Chaque ligne est un exemple ; ici, chaque colonne sauf la dernière, une caractéristique : une variable d'entrée. […] Converties en m² et FCFA, cours BCEAO du 27 octobre 2026. » (55 mots ; le second « en » est retiré pour compenser)
- Règle appliquée : pas de formule absolue non sourcée (CLAUDE.md) ; la nuance « Dans ce tableau » / « Ici » avait déjà été rétablie en mise en conformité le 2026-10-26, le 2026-10-30 et le 2026-10-31.

## Décisions de l'utilisateur

**D1 · Page 3, `texte` : les unités d'origine ne sont plus dites.** Les en-têtes ne portent plus que les noms de la source (`Gr Liv Area`, `SalePrice`). Quant à « Converties en m² et FCFA », le participe ne s'accorde avec aucun nom proche (on lit « trois ventes converties »), et la phrase ne dit plus de quelles unités on part. Votre demande du 2026-11-01 précisait : « Les unités restent dites en page 3 (« Conversions : pieds carrés en m², dollars en FCFA ») ».
- Source vérifiée : *Ames Housing Data, documentation*, http://jse.amstat.org/v19n3/decock/DataDocumentation.txt : « Gr Liv Area (Continuous): Above grade (ground) living area square feet » ; « SalePrice (Continuous): Sale price $$ ».
- Correction proposée (à partir du texte après C2). Avant : « La dernière, l'étiquette, est la réponse à apprendre en apprentissage supervisé : le prix. Converties en m² et FCFA, cours BCEAO du 27 octobre 2026. » Après : « La dernière, l'étiquette : le prix, réponse à apprendre en apprentissage supervisé. Pieds carrés en m², dollars en FCFA au cours BCEAO du 27 octobre 2026. » (55 mots, comme avant)
- Option recommandée : la correction. Elle rend les unités de la source, supprime le participe flottant et garde « en apprentissage supervisé » et la date du cours. Autre option : garder le texte actuel et considérer que « Converties » suffit.
- Décision : oui / non / autre

**D2 · Page 3, `texte` : le terme « jeu de données », que l'épisode 02 doit introduire, n'apparaît toujours dans aucune page.** C'est la reprise de D1 de la relecture précédente, toujours sans réponse, adaptée au nouveau texte. La fiche (`termes_introduits`) et `charte/glossaire.yaml` le rattachent à l'épisode 02, et le Nº 03 l'emploie comme un terme connu.
- Source vérifiée : glossaire MLCC, https://developers.google.com/machine-learning/glossary, entrée *data set or dataset* : « A collection of raw data, commonly (but not exclusively) organized in one of the following formats: » (« a spreadsheet », « a file in CSV (comma-separated values) format »).
- Correction proposée, sans changer le compte de mots. Avant : « Trois ventes d'Ames, aux États-Unis, en 2010 ; colonnes sous leurs noms d'origine. » Après : « Trois ventes d'Ames, aux États-Unis, en 2010 ; colonnes du jeu de données. » (5 mots contre 5)
- Option recommandée : oui. Le terme est introduit sur l'objet réel, et les en-têtes en anglais montrent d'eux-mêmes que les noms sont ceux d'origine. Autre option : déplacer l'introduction du terme au Nº 03, ce qui passe par AMBIGUITES.md puisque `charte/` est verrouillé.
- Décision : oui / non / autre

**D3 · Page 4, `texte` : « Selon le modèle » peut se lire « d'après le modèle ».** C'est la reprise de D2, toujours sans réponse. La version précédente ajoutait un mot ; elle est ici compensée pour rester à 55 au plus.
- Source vérifiée : scikit-learn, *Preprocessing data*, https://scikit-learn.org/stable/modules/preprocessing.html : « Such integer representation can, however, not be used directly with all scikit-learn estimators, as these expect continuous input, and would interpret the categories as being ordered ».
- Correction proposée. Avant : « Le piège : donner un numéro par quartier, comme dans ce tableau. Selon le modèle, ces numéros risquent… » Après : « Le piège : donner un numéro par quartier, comme ici. Selon le modèle utilisé, ces numéros risquent… » (54 mots). `visuel.params.description`, avant : « selon le modèle, elle risque » ; après : « selon le modèle utilisé, elle risque ».
- Option recommandée : la correction, qui lève l'ambiguïté sans toucher à la nuance. Autre option : « Pour certains modèles, ces numéros… » (même compte, plus proche de « not … with all »).
- Décision : oui / non / autre

**D4 · Page 2, `sources` : aucun extrait ne dit « apprendre d'exemples dont la réponse est connue ».** C'est la reprise de D3, toujours sans réponse ; le texte publié ne change pas.
- Source vérifiée : glossaire MLCC, https://developers.google.com/machine-learning/glossary, entrée *supervised machine learning* : « Training a model from features and their corresponding labels. »
- Correction proposée : ajouter à `sources/02/extraits.yaml` l'entrée `id: glossaire-supervise`, avec `reference` et `lu_sur` : https://developers.google.com/machine-learning/glossary, `lu_le: 2026-11-01`, `extrait: Training a model from features and their corresponding labels.` et `appuie: "Ouverture : ici, le modèle apprend d'exemples à la réponse connue."`. Page 2, `sources` : ajouter `glossaire-supervise` après `glossaire-modele`.
- Option recommandée : oui, la phrase clé de l'ouverture s'appuie alors sur une définition mot pour mot. Autre option : ne rien ajouter.
- Décision : oui / non / autre

**D5 · Page 4, `sources` : « des écarts qui n'existent pas » (encadré) n'a pas d'extrait qui le fonde.** C'est la reprise de D4, toujours sans réponse ; le texte publié ne change pas.
- Source vérifiée : scikit-learn, *Ensembles, Categorical Features Support*, https://scikit-learn.org/stable/modules/ensemble.html : « It is also usually better to rely on the native categorical support rather than to treat categorical features as continuous (ordinal), which happens for ordinal-encoded categorical data, since categories are nominal quantities where order does not matter. »
- Correction proposée : ajouter l'entrée `id: sklearn-nominales`, avec `lu_sur` : https://scikit-learn.org/stable/modules/ensemble.html, `lu_le: 2026-11-01`, `extrait: "treat categorical features as continuous (ordinal), which happens for ordinal-encoded categorical data, since categories are nominal quantities where order does not matter."` et `appuie: "Page 4, encadré : numérotées, des catégories sans ordre sont lues comme continues ; ordre et écarts n'existent pas."`. Page 4, `sources` : ajouter `sklearn-nominales`.
- Option recommandée : oui ; « continuous » fonde les écarts, « order does not matter » fonde « qui n'existent pas ». Autre option : prolonger `sklearn-ordre` jusqu'à « (i.e. the set of browsers was ordered arbitrarily) ».
- Décision : oui / non / autre

Après C1, C2, D1, D2 ou D3, relancer `serie rendre 02` puis `serie verifier 02`.

## Contrôles automatiques (serie verifier)

Résultat : aucune erreur bloquante, 4 avertissement(s).

Avertissements :
- page 2 (ouverture) : 32 mots, proche de la limite de 32
- page 3 (mécanisme) : 55 mots, proche de la limite de 55
- page 4 (piège) : 55 mots, proche de la limite de 55
- page 5 (mécanisme) : 54 mots, proche de la limite de 55

| Page | Mots | Vide au-dessus du pied (px) |
| --- | ---: | ---: |
| 1 | 0 | 59 |
| 2 | 32 | 112 |
| 3 | 55 | 30 |
| 4 | 55 | 164 |
| 5 | 54 | 148 |
| 6 | 0 | 6 |

Seuil de remplissage : 233 px.

## Affirmations et sources

Pages 4, 5, 6 et post : textes inchangés depuis la relecture précédente, où chaque affirmation a été rattachée à son extrait. Les passages de scikit-learn et de MLCC ont été relus ce jour.

| Page | Affirmation | Extrait | Vérifiée sur |
| --- | --- | --- | --- |
| 1 | Pour une machine, un exemple n'est qu'une ligne de tableau | accroche de la fiche | renvoi aux pages 2 et 3 |
| 2 | (Ici,) le modèle apprend d'exemples à la réponse connue | `glossaire-etiquette`, `glossaire-exemple` (D4 : + `glossaire-supervise`) | glossaire MLCC, *supervised machine learning* |
| 2 | Une maison = une ligne : surface, chambres, quartier, puis prix, la réponse | `glossaire-exemple`, `ames-*` | `DataDocumentation.txt` (Gr Liv Area, Bedroom, Neighborhood, SalePrice) |
| 2, 3 | 83 m², 2, North Ames, 62 000 000 ; 195, 4, College Creek, 141 000 000 ; 106, 3, Old Town, 57 000 000 | `ames-ventes`, `ames-*`, `bceao-dollar` | calculs inchangés, revérifiés le 2026-11-01 sur `AmesHousing.txt` (relecture précédente) |
| 3 | Ventes d'Ames, aux États-Unis, en 2010 | `ames-ventes` | `DataDocumentation.txt` : « Yr Sold (Discrete): Year Sold (YYYY) » |
| 3 | Colonnes sous leurs noms d'origine | `ames-fichier` | en-tête de `AmesHousing.txt` |
| 3 | (Ici,) chaque colonne sauf la dernière est une caractéristique, variable d'entrée | `glossaire-caracteristique`, `mlcc-lignes` | MLCC *Feature vectors* (colonnes b et d) |
| 3 | La dernière, l'étiquette, réponse à apprendre en apprentissage supervisé : le prix | `glossaire-etiquette` | glossaire MLCC |
| 3 | Converties en m² et FCFA, cours BCEAO du 27 octobre 2026 | `ames-surface`, `ames-prix`, `bceao-dollar` | « square feet », « Sale price $$ » ; cours de l'extrait du 2026-10-30 (non réaffiché par la BCEAO) |
| 4 | Selon le modèle, numéros lus comme des quantités ; encadré : un ordre et des écarts qui n'existent pas | `mlcc-continus`, `sklearn-ordre` (D5 : + `sklearn-nominales`) | scikit-learn *Preprocessing* et *Ensembles* |

Fiche : pas de champ « à ne pas écrire ». L'épisode suivant annoncé (Nº 03, « Les trois familles d'apprentissage », « Et quand on n'a pas d'étiquette ? ») est bien celui de la fiche. La fin n'apporte rien de nouveau. Aucun tiret long, aucune citation entre guillemets. Aucune image réelle, donc aucun crédit à contrôler.

À l'œil (planche, pages 1 et 3) :
- La couverture est lisible ; la loupe sur la grille illustre « examiner » comme le prévoit la fiche.
- Page 3 : le libellé « caractéristiques » de l'accolade touche presque la dernière ligne du texte (30 px de vide en bas de page, texte à 6 lignes). Après D1, le texte garde le même nombre de mots ; vérifiez sur le rendu qu'il ne passe pas à 7 lignes.
- Page 3 : le libellé « exemple » vient au contact du cadre de la colonne `Gr Liv Area`. C'est une gêne légère qui relève du gabarit, pas du contenu.

## Validation scientifique

**Page 2** · Hypothèse : apprentissage supervisé, données en tableau. · Domaine : non dit depuis le resserrage ; C1 le rétablit (« Ici »). · Contre-exemple : l'apprentissage non supervisé (« typically an unlabeled dataset »), sujet du Nº 03. · Raccourci : « le modèle apprend » pour « on entraîne le modèle » ; une ligne de 4 colonnes sur 82 ; assumé.

**Page 3** · Hypothèse : la dernière colonne est l'étiquette ; les prix de 2010 sont convertis au cours de 2026. · Domaine : lieu, année, cas supervisé et date du cours sont dits ; la limitation au tableau est rétablie par C2. · Contre-exemple : des colonnes ni caractéristiques ni étiquette (MLCC b et d ; `Order`, `PID`). · Raccourci : arrondi au million ; unités d'origine absentes (D1).

**Page 4** · Hypothèse : des catégories nominales ; certains modèles lisent un numéro comme une grandeur. · Domaine : « Beaucoup de modèles », « Selon le modèle » (D3). · Contre-exemple : les modèles à support natif des catégories, couverts par la nuance. · Raccourci : « trois fois plus » ne vaut que pour un modèle qui calcule sur la valeur ; assumé.

**Page 5** · Hypothèse : des catégories sans ordre, en petit nombre. · Domaine : « Une solution parmi d'autres ». · Contre-exemple : de très nombreuses catégories (MLCC : « usually a bad choice »). · Raccourci : la colonne des noms est affichée pour la lecture seulement.

**Page 6 et post** · Hypothèses et domaine des pages 2 à 5 (« en apprentissage supervisé », « souvent », « une solution »). · Contre-exemple : aucun nouveau. · Raccourci : résumé sans ajout.
