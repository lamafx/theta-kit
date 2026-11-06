# Règles de rédaction pour l'agent (inclut la validation scientifique et les niveaux d'erreur)

Extrait du document de conception. Ce fichier fait foi.

## 6. Règles de rédaction pour l'agent

L'agent ne rédige jamais un épisode de mémoire : il part de la fiche de la banque, vérifie chaque affirmation dans les références de l'onglet Références, puis applique la charte.

### Les étapes de production d'un épisode

1. **Lire la fiche** de l'épisode (section 4) et celles des prérequis, pour reprendre les mêmes mots.
2. **Lire les références** de l'épisode et noter, pour chaque page, la phrase de la source qui la justifie.
3. **Choisir les types de pages** utiles au sujet, dans l'ordre conseillé (section 1).
4. **Rédiger le texte de chaque page**, dans les limites de mots.
5. **Calculer les visuels** à partir des formules, avec les valeurs écrites dans la fiche.
6. **Lancer les vérifications** ci-dessous, puis produire le carrousel et le texte LinkedIn.
7. **Rendre une note de relecture** : les points à vérifier par toi, et la source de chaque formule et de chaque chiffre.

### Les vérifications obligatoires

- [ ] Chaque formule est identique à celle d'une référence, aux notations près.
- [ ] Chaque exemple chiffré est recalculé, pas recopié.
- [ ] Aucun terme n'apparaît avant d'avoir été introduit (cet épisode ou un épisode précédent).
- [ ] Chaque symbole est défini à sa première apparition.
- [ ] 32 mots maximum sur l'ouverture, 55 sur une page de contenu (session de design n° 2, 2026-11-01 ; 40 et 70 avant).
- [ ] La page de fin n'apporte rien de nouveau.
- [ ] L'épisode suivant annoncé correspond à la banque.

### La validation scientifique

Une source citée ne prouve pas qu'une interprétation est juste, et un calcul exact peut illustrer un raisonnement faux. Le relecteur répond donc, pour chaque page qui affirme quelque chose, à quatre questions écrites dans relecture.md :

1. **Hypothèse** : sous quelles conditions l'affirmation est-elle vraie (une dimension, η fixe, modèle linéaire, classes équilibrées…) ?
2. **Domaine de validité** : ces conditions sont-elles dites ou évidentes pour le lecteur ? Sinon, il faut les écrire.
3. **Contre-exemple** : quel cas simple contredirait l'affirmation si elle était généralisée ?
4. **Raccourci assumé** : s'il s'agit d'une simplification volontaire, est-elle signalée (« dans le cas le plus simple », « ici ») ?

Une réponse manquante ou un contre-exemple non traité est un avertissement scientifique : il remonte en tête du rapport de relecture.

### Erreurs, avertissements et désaccords

| Niveau | Exemples | Ce que fait l'agent |
| --- | --- | --- |
| Erreur bloquante | Schéma invalide, texte qui déborde, terme non introduit, chiffre sans fonction de calcul | Corrige, au plus 2 essais, puis s'arrête et le signale |
| Avertissement | Mots proches de la limite, image manquante, formulation lourde | Ne bloque pas, le liste dans le rapport |
| Désaccord scientifique | Deux sources divergent, contre-exemple non traité, hypothèse implicite | Ne corrige jamais seul : il expose les deux versions et te laisse trancher |

Chaque correction automatique est consignée dans le rapport : ce qui a échoué, ce qui a été changé, et la phrase avant et après. Une correction qui fait passer un contrôle en retirant une nuance scientifique est interdite : l'agent doit préférer un avertissement.

### L'usage des références

- **Cours de référence** : pour l'intuition, le vocabulaire et les exemples.
- **Source originale** : pour la formule exacte, la date et le nom des auteurs.
- **En cas de désaccord** entre deux sources, l'agent le signale dans la note de relecture au lieu de trancher seul.
- **Les sources ne sont jamais recopiées** : l'agent reformule, et ne cite qu'une courte phrase au plus.
- **Un chiffre réel** vient de toi, jamais de l'agent.

### Les montants et les légendes

- **Tout montant publié est en FCFA** (décision du 2026-10-30, A44). Un montant sourcé dans une autre devise est converti par `calculs/devises.py` au cours de référence de la BCEAO, daté et sourcé (extrait dans `sources/NN/`), puis arrondi ; le texte ou le post dit « au cours BCEAO du … ». Un épisode qui convertit date et source son propre cours.
- **Pas de légende sous un schéma** (décision du 2026-10-30, A45) : le champ `legende` d'une page ne sert qu'aux images réelles, qui gardent légende et crédit. La source d'un schéma va dans le premier commentaire ; une précision nécessaire (conversion, cas particulier) va dans le texte de la page ou dans le post. Un vide trop grand se comble par le visuel (cadre, lignes), jamais par du texte ajouté.

### Les images réelles

- **L'agent cherche et télécharge lui-même les images** (`serie images NN`, puis recherche web), en commençant par la source la plus proche de l'événement ; tu n'en fournis plus (voir decisions-automatisation.md, 9.5).
- **Le droit de réutiliser est contrôlé**, pas la source : chaque candidate est classée « libre », « à confirmer » ou « exclue », et la phrase de la source qui donne les conditions est recopiée mot pour mot dans sa fiche .yaml. Une image « à confirmer » n'est prise que si aucune « libre » ne convient, et tu la valides à la relecture.
- **L'image retenue montre sans ambiguïté ce que dit la fiche** : bon objet, bon lieu, bonne époque, vérifiés à l'œil et dans la description de la source. Sinon, la page passe à sa variante sans image.
- **Crédit sous chaque image**, en Geist Mono 14 px, écrit par le code : « Photo : Auteur · Licence ou conditions · Source ».
- **Légende factuelle** : ce que montre l'image, rien de plus. Une photo d'un IBM 704 à Lawrence Livermore n'est pas « l'ordinateur de Samuel ».
- **Jamais d'image générée par IA présentée comme réelle**, jamais de fausse capture : une capture personnelle est remplacée par un schéma Flux légendé « Schéma ».

**Le traitement visuel**, pour qu'une image réelle se fonde dans le carrousel au lieu de trancher (modèles : pages « Contexte » et « Exemple » du canevas des gabarits) :

| Règle | Photo (page Contexte) | Capture d'écran (page Exemple) |
| --- | --- | --- |
| Place | Dans la colonne du texte, 920 px de large, jamais en pleine page | Idem |
| Format | 920 × 520 px, recadrée au centre | 920 × 430 px sous une barre de fenêtre neutre de 44 px |
| Couleurs | Noir et blanc, contraste +8 %, voile bleu d'accent à 8 % | Noir et blanc, contraste +4 % |
| Contour | Coins arrondis 20 px, filet 1 px #E4E6EA | Idem |
| Annotation | Aucune, ou un seul repère accent | Un cadre accent arrondi autour de la ligne utile, une étiquette courte |
| Légende | À gauche, Geist 20 px, ce que montre l'image | Idem |
| Crédit | À droite, Geist Mono 14 px, « Photo : source, année » | « Capture : Ladji Lama Kamagate » |

Le noir et blanc sert deux buts : les photos d'archive le sont déjà, et une capture colorée (logos, boutons) ne vient pas concurrencer le bleu d'accent. Une seule image réelle par page, et au plus deux par carrousel.
