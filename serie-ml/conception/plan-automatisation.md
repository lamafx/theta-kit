# Plan de l'automatisation

Extrait du document de conception. Ce fichier fait foi.

## 11. L'automatisation dans VS Code

**Le principe : l'IA écrit le fond, le code fixe la forme.** L'agent ne produit qu'un fichier de contenu structuré par épisode : des textes et des paramètres de visuels. Il n'écrit jamais de HTML, de CSS ou de SVG. Tout le reste (mise en page, dessins, typographie, rendu, contrôles) est fait par du code déterministe : deux générations du même contenu donnent exactement les mêmes images. C'est ce qui empêche le style de dériver.

### 11.1 D'où l'on part, où l'on va

|  | Aujourd'hui | À la fin de la construction |
| --- | --- | --- |
| Contenu | Ce document : banque, règles, références | Une fiche YAML par épisode dans le dépôt |
| Style | Deux canevas Claude Design | Gabarits HTML, feuille de style et bibliothèque de visuels en Python |
| Production | À la main, avec Claude | Une commande par épisode dans VS Code |
| Contrôle | Relecture humaine | Contrôles automatiques, puis 5 minutes de relecture |
| Suivi | Aucun | etat.yaml et calendrier.yaml |

### 11.2 L'organisation du dépôt

```
serie-ml/
├── CLAUDE.md                 mémoire du projet, moins de 200 lignes
├── .claude/
│   ├── settings.json         hooks et permissions
│   ├── skills/               commandes /episode, /saison, /bilan, /etat, /corriger
│   └── agents/relecteur.md   sous-agent de relecture, lecture seule
├── banque/episodes/          62 fiches NN-titre.yaml (entrée, ne change pas)
├── charte/                   charte.yaml, règles, typographie, texte LinkedIn, glossaire.yaml
├── gabarits/                 un gabarit HTML par type de page + style.css (verrouillés)
├── bibliotheque/             9 familles de visuels + robot (Python → SVG, verrouillés)
├── calculs/                  fonctions qui produisent chaque chiffre et chaque courbe
├── serie/                    le générateur : rendu, typographie, contrôles, état
├── tests/reference/          rendus de référence des épisodes 01 et 08
├── sources/NN/               extraits des références, gardés en cache
├── contenu/NN.yaml           ce que l'agent écrit : textes et paramètres
├── assets/images/            images réelles que tu déposes
├── sortie/NN/                PNG, PDF, rapport de relecture
├── publier/NN/               dossier prêt à publier
├── etat.yaml                 statut de chaque épisode
└── calendrier.yaml           dates de publication
```

### 11.3 La chaîne de production d'un épisode

Tu tapes /episode 09. Le reste s'enchaîne seul, et chaque étape enregistre son résultat avant de passer à la suivante.

| Étape | Qui | Produit | Contrôle |
| --- | --- | --- | --- |
| 1. Lire la fiche et celles des prérequis | Agent | — | La fiche existe et ses prérequis sont publiés ou relus |
| 2. Lire les références et en garder les extraits utiles | Agent | sources/09/ | Chaque référence de la fiche a un extrait |
| 3. Calculer les chiffres et les courbes | Code | calculs/09 → valeurs | Les valeurs sont recalculées à chaque rendu |
| 4. Rédiger le contenu | Agent | contenu/09.yaml | Schéma, mots par page, termes, typographie (hook) |
| 5. Rendre les pages | Code | sortie/09/\*.png, carrousel PDF | Aucun texte ne déborde, taille de police minimale |
| 6. Relire avec un regard neuf | Sous-agent relecteur | sortie/09/relecture.md | Chaque chiffre et chaque formule rattachés à un extrait |
| 7. Rédiger le texte LinkedIn | Agent | publier/09/texte.txt | Longueur, structure, hashtags |
| 8. Préparer la publication | Code | publier/09/ | Statut « généré » dans etat.yaml |

Si un contrôle échoue, l'erreur est renvoyée à l'agent, qui corrige seul. Après 2 essais ratés sur le même point, il s'arrête et le signale dans le rapport au lieu d'insister.

### 11.4 Les garde-fous contre la dérive

Chaque risque de dérive a un garde-fou qui ne dépend pas de la bonne volonté de l'agent.

| Risque | Garde-fou |
| --- | --- |
| Le style change d'un épisode à l'autre | L'agent ne touche jamais au rendu : gabarits, feuille de style et bibliothèque sont verrouillés par un hook qui refuse toute modification pendant une production |
| Un gabarit est modifié par erreur | Test de référence : les épisodes 01 et 08 sont rendus à chaque changement du code et comparés pixel par pixel aux images validées |
| Un visuel est improvisé | Le contenu ne peut citer qu'une famille de la bibliothèque et ses paramètres autorisés ; le schéma refuse le reste |
| Un chiffre est faux | Les chiffres et les courbes viennent des fonctions de calculs/, jamais du texte de l'agent |
| Une affirmation n'est pas sourcée | Le relecteur, un sous-agent sans accès en écriture et sans l'historique de rédaction, rattache chaque affirmation à un extrait de sources/ |
| Un terme arrive trop tôt | glossaire.yaml liste chaque terme, ses formes (diverge, divergence, diverger) et l'épisode qui l'introduit ; le contrôle cherche toutes les formes |
| Le ton dérive | Les règles de rédaction et deux épisodes modèles (01 et 08) sont fournis à chaque rédaction ; une liste de mots interdits est contrôlée (superlatifs, emoji, tutoiement) |
| Le texte déborde | Mesure après rendu, dans le navigateur : un bloc qui dépasse sa zone fait échouer la page |
| La typographie varie | Appliquée par le générateur, jamais par l'agent (9.4) |
| Le contexte de l'agent se dilue avec le temps | Chaque épisode démarre d'une session neuve : l'agent ne lit que la fiche, les fiches des prérequis et les règles, pas l'historique |

### 11.5 Les commandes

Ce sont des skills Claude Code, dans .claude/skills/. Chaque commande s'appuie sur le générateur, une petite interface en ligne de commande nommée serie.

| Commande | Ce qu'elle fait |
| --- | --- |
| /episode NN | Toute la chaîne de la section 11.3 pour un épisode |
| /saison N | Produit images-a-fournir.md, puis enchaîne /episode sur tous les épisodes de la saison qui ne sont pas encore générés |
| /bilan N | Le post bilan de la saison N (couverture, sommaire, fin) |
| /etat | Où en est chaque épisode, l'avance en épisodes relus, les images manquantes, la prochaine date de publication |
| /corriger NN \[page\] | Applique une correction que tu décris en une phrase, puis relance les contrôles et le rendu de cet épisode seul |
| /stats NN | Enregistre les statistiques que tu donnes et prépare le bilan des 4 semaines quand il est dû |

Le générateur peut aussi être lancé sans agent : serie rendre NN, serie verifier NN, serie regenerer --tout, serie etat.

### 11.6 Les automatismes (hooks)

Configurés dans .claude/settings.json, ils s'exécutent sans que personne ait à y penser.

- **Après chaque modification d'un fichier contenu/** : serie verifier s'exécute. En cas d'erreur, le hook la renvoie à l'agent, qui corrige avant de continuer.
- **Avant toute modification de gabarits/, bibliotheque/ ou charte/** : le hook refuse, sauf pendant une session de design que tu lances exprès.
- **À la fin de chaque réponse de l'agent** : etat.yaml est mis à jour, pour qu'une interruption ne fasse rien perdre.

### 11.7 Reprendre et corriger (points 18 à 20)

- **Reprise** : chaque étape de 11.3 écrit son résultat et l'enregistre dans etat.yaml. Si la session s'arrête (limite d'utilisation, coupure), /episode NN repart de la première étape non terminée.
- **Rien n'est refait inutilement** : le rendu d'une page n'est relancé que si son contenu, son gabarit ou la charte ont changé.
- **Correction d'un épisode** : /corriger NN modifie le contenu, puis relance les contrôles et le rendu de cet épisode seul. S'il était déjà relu, il repasse au statut « généré ».
- **Changement de charte** : serie regenerer --tout rend à nouveau tous les épisodes et produit une planche avant / après, pour valider d'un coup d'œil.

**Garanties techniques de la reprise :**

- **Écritures atomiques** : chaque fichier est écrit sous un nom provisoire puis renommé. Une coupure ne laisse jamais un fichier à moitié écrit.
- **Empreintes** : etat.yaml garde, pour chaque étape terminée, l'empreinte de ses entrées (fiche, sources, contenu, gabarits, charte). Si une entrée a changé, l'étape est considérée comme à refaire.
- **Étapes relançables** : relancer une étape terminée donne le même résultat et n'efface rien d'autre.
- **Versions** : chaque production validée est enregistrée dans Git, ce qui permet de revenir à la version précédente d'un épisode.
- **Tests de cas limites** : en plus des 14 rendus de référence (un par type de page), des pages pièges vérifient les titres longs, les formules longues, les accents, les tableaux denses et l'absence d'image.

### 11.8 L'optimisation

- **L'agent lit peu** : CLAUDE.md reste court et renvoie aux fichiers détaillés, lus seulement par la commande qui en a besoin.
- **L'agent écrit peu** : un fichier de contenu par épisode, quelques centaines de mots. Le rendu, local et gratuit, ne consomme rien de ton usage Claude.
- **Les sources sont lues une fois** : leurs extraits restent dans sources/, réutilisables pour la relecture et les corrections.
- **La production se fait par lots** : /saison génère d'avance, ce qui laisse de la marge si une limite d'utilisation est atteinte un jour.

### 11.9 Le plan de construction

Chaque jalon a un critère de fin vérifiable. On ne passe au suivant que s'il est rempli.

| Jalon | Contenu | Critère de fin |
| --- | --- | --- |
| 1. Fondations | Export du document en fichiers, squelette du dépôt, CLAUDE.md | Les 62 fiches passent la validation de schéma |
| 2. Rendu fidèle | Gabarits HTML, feuille de style, robot extrait, bibliothèque des 9 familles | L'épisode 08 rendu par le code est identique au canevas validé |
| 3. Contrôles | Typographie, débordements, termes, schéma, calculs, tests de référence | Chaque contrôle détecte une erreur volontairement introduite |
| 4. Agent | Skills, sous-agent relecteur, hooks | /episode 01 à 04 produisent des dossiers complets sans intervention |
| 5. Lancement | Relecture des 4 premiers épisodes, images de la saison 1 | 4 épisodes relus d'avance, date de lancement fixée |

### 11.10 Ton rôle, une fois en route

| Quand | Quoi | Durée visée |
| --- | --- | --- |
| Début de saison | Lancer /saison N, déposer les images listées | Une séance |
| Chaque épisode | Lire relecture.md, valider ou demander une correction | 5 minutes |
| Chaque publication | Copier le dossier publier/ sur LinkedIn | 5 minutes |
| Toutes les 4 semaines | Donner les statistiques avec /stats, lire le bilan | 15 minutes |
