# Questions sur l'automatisation Théta existante

**Pour Claude Code** : réponds sous chaque question (ligne `Réponse :`), en citant le fichier ou la commande qui le prouve. Si l'information n'existe pas dans le projet, écris « inconnu, à demander à l'auteur ». Ne modifie rien dans l'automatisation pendant cette étape.

**Pour l'auteur** : les questions marquées 👤 ne peuvent être tranchées que par toi.

## A. Où et quoi

**Q1.** Chemin du dossier ou dépôt de l'automatisation sur le PC (et URL GitHub s'il y en a une). Est-ce un dépôt Git ? Branche principale ?
Réponse : `C:\DEV\theta-kit\serie-ml`. Dépôt Git, branche `main`, dépôt GitHub privé `lamafx/serie-ml` (`git remote -v`). Le dernier push date d'avant les 11 derniers commits locaux (`git log origin/main..main`). Le chemin `../theta` de `PROMPT-DEMARRAGE.md` est donc faux : c'est `../../serie-ml` depuis ce kit.

**Q2.** Que désigne exactement « IN » ? LinkedIn ? Si oui : API officielle LinkedIn (Community Management / Share API avec jeton OAuth), un outil tiers (Buffer, Make, Zapier, n8n, Publer...), un serveur MCP LinkedIn, ou de l'automatisation de navigateur ? Si ce n'est pas LinkedIn, qu'est-ce que c'est ?
Réponse : Oui, « IN » est LinkedIn, par l'**API officielle** avec jeton OAuth 2.0 au nom du membre (portées `openid profile w_member_social`). Ni outil tiers, ni serveur MCP, ni automatisation de navigateur. Appels : Documents API, Posts API, commentaire par `/v2/socialActions` (`serie-ml/serie/linkedin.py`, `AMBIGUITES.md` A49).

**Q3.** Langage et outils de l'automatisation (Python, Node, scripts Claude Code, commandes slash, hooks, tâches planifiées) ? Liste des scripts ou commandes principaux et de ce que fait chacun.
Réponse : Python 3.11 ou plus (paquet `serie`, `pyproject.toml` : PyYAML, pydantic, Jinja2, Playwright, pypdf, keyring), Claude Code (skills, sous-agent, hooks) et une tâche Windows.
- Commandes `serie` (`serie/cli.py`) : `etat`, `reprendre NN` (étape suivante), `statut NN relu`, `valider` (fiches), `rendre NN` (PNG et PDF), `verifier NN` (contrôles), `images NN` (images réelles), `publier NN` (dossier `publier/NN/`), `bilan`, `decisions`, `linkedin connecter|etat|tourner|planifier|essai|publier`.
- Skills `.claude/skills/` : `/episode`, `/corriger`, `/etat`, `/saison`, `/bilan`, `/stats`. Sous-agent `.claude/agents/relecteur.md`.
- Hooks `.claude/hooks/` : `proteger.py` (verrou des gabarits), `verifier_contenu.py`, `maj_etat.py`, `rappel_session.py`.
- Tâche Windows « Theta LinkedIn » : `serie linkedin tourner` toutes les 5 minutes (`schtasks /Query`).

**Q4.** Arborescence : où sont la banque de sujets, les sources des carrousels (HTML ? Claude Design ?), les PDF exportés, les couvertures, le dossier `editorial/` (historique, catalogues, évaluations) ?
Réponse : Tout est relatif à `serie-ml/`.
- Banque de sujets : `banque/episodes/NN-*.yaml` (62 fiches).
- Sources des carrousels : `contenu/NN.yaml` (contenu), `gabarits/` (Jinja2 HTML), `bibliotheque/` (visuels), `design/` (maquettes Claude Design, polices), `calculs/` (chiffres). Extraits des références : `sources/NN/extraits.yaml`.
- PDF exportés : `sortie/NN/` (travail), `publier/NN/NN-titre.pdf` (final).
- Couvertures : `publier/NN/couvertures/a.png` et `classique.png`, page 1 du PDF pour la version retenue.
- `editorial/` : `theta-post/editorial/` (historique, catalogues d'accroches et d'analogies, évaluations, ligne éditoriale, programme, règles scientifiques).

## B. Production d'un épisode

**Q5.** Comment un carrousel devient-il un PDF ? (export Claude Design, Playwright, autre) Où le PDF est-il écrit et sous quel nom ?
Réponse : Par **Playwright** (Chromium) : `serie rendre NN` remplit les gabarits HTML, photographie chaque page en PNG et imprime chaque page en PDF, puis pypdf les assemble (`serie/rendu.py`, `photographier`). Résultat : `sortie/NN/NN-titre.pdf`, copié par `serie publier NN` vers `publier/NN/NN-titre.pdf` (`serie/publication.py`). Exemple : `publier/01/01-qu-est-ce-que-le-machine-learning.pdf`. Claude Design ne sert qu'aux maquettes.

**Q6.** Existe-t-il déjà un fichier de données par épisode (YAML, JSON, Markdown) ? Si oui, son format exact : peut-il produire directement `contenu/NN.yaml` (schéma `docs/03-contenu.md`) ou faut-il une conversion ?
Réponse : Oui, `contenu/NN.yaml`, mais **il faut une conversion** : les deux formats portent le même nom et n'ont pas le même schéma.
- Série : `episode`, `couverture`, `pages[]` (`type`, `titre`, `texte`, `sources`, `visuel`), bloc `linkedin` (`serie/schemas.py`).
- Site : `n`, `saison`, `statut`, `groupe`, `titre{t1,t2}`, `accroche`, `resume`, `theme`, `pdf`, `pages[]`, `a_retenir`, `verifiez_vous`, `suivant`, `sources`, `post_linkedin` (`docs/03-contenu.md`).
- Récupérables : saison, groupe (`chapitre.titre`), titre et accroche (fiche `banque/`), texte du post (`publier/NN/texte.txt`), sources (`premier-commentaire.txt`).
- Absents de la série : toute la version anglaise, `resume`, `theme`, le découpage `t1`/`t2`, `a_retenir`, `verifiez_vous`. Le schéma zod impose `a_retenir` et `verifiez_vous` pour un épisode `publie`.

**Q7.** Comment est marquée la **validation par l'auteur** (fichier, champ `statut`, commande manuelle) ? Le site ne doit recevoir que des épisodes validés.
Réponse : Par le champ `statut` de `etat.yaml`, passé à la main : `serie statut NN relu`. Valeurs : `a_faire`, `genere`, `relu`, `publie`, `mesure` (`serie/schemas.py`, classe `Statut`). `CLAUDE.md` en fait le seul arrêt obligatoire par épisode. Pour le site, condition proposée : `relu` et étapes à jour (`serie reprendre NN`), les mêmes garde-fous que LinkedIn. Limite : les épisodes 01 à 10 sont `relu`, mais la relecture n'a pas été repassée et `sortie/decisions.md` liste 34 décisions non arbitrées.

## C. Publication sur LinkedIn

**Q8.** Le post contient-il un lien ? Où (dans le texte, en premier commentaire) ? Le carrousel est-il publié comme document PDF natif LinkedIn ?
Réponse : Le texte du post ne contient **aucun lien** : `grep http publier/*/texte.txt` ne trouve rien sur les 10 épisodes. Le premier commentaire contient les références et les crédits d'images avec leurs liens (`publier/NN/premier-commentaire.txt`), mais pas de lien vers le site. Oui, le carrousel part en document PDF natif LinkedIn (`envoyer_document`, puis `creer_post`, `serie/linkedin.py`).

**Q9.** Qu'est-ce qui déclenche la publication : commande manuelle, planification (cron, tâche Windows, tâche planifiée Claude), date dans un fichier de calendrier ? Quels jours et heures ?
Réponse : La tâche Windows « Theta LinkedIn » lance `serie linkedin tourner` toutes les 5 minutes ; elle publie ce que `calendrier.yaml` rend dû. Créneaux : **mardi et jeudi à 8 h 30** (Africa/Abidjan). Lancement : **mardi 10 novembre 2026** (`publier/01/date.txt`). Nº 10 : jeudi 10 décembre 2026. Garde-fous : statut `relu`, étapes à jour, dossier complet, heure prévue passée depuis moins de 2 heures, jamais deux fois le même épisode. La tâche exige une session Windows ouverte (`Logon Mode: Interactive only`). Commande manuelle : `serie linkedin publier NN --oui`.

**Q10.** Les statistiques LinkedIn sont-elles déjà récupérées ? Lesquelles (impressions, réactions, commentaires, partages, clics) ? Où sont-elles stockées ? Faut-il les afficher sur le site (👤) ou seulement les garder pour adapter les posts ?
Réponse : Non, rien n'est récupéré automatiquement : la lecture demande `r_member_social`, permission restreinte que l'application n'a pas. L'auteur donne les chiffres à `/stats NN` : impressions et réactions à 48 h ; impressions, réactions, enregistrements et partages à 7 jours ; ils iraient dans `mesures/NN.yaml` (`.claude/skills/stats/SKILL.md`). Le dossier `mesures/` n'existe pas encore. 👤 **Proposition tirée de l'état de la série, à confirmer par l'auteur.** Les garder pour adapter les posts, sans les afficher sur le site : aucun chiffre n'existe avant le lancement, et ils sont saisis à la main.

**Q11.** Où sont rangés les secrets (jeton LinkedIn, etc.) : `.env`, gestionnaire de secrets, variables système ? Le jeton expire-t-il, et comment est-il renouvelé ?
Réponse : Dans le **gestionnaire d'identifiants de Windows** (keyring, service `theta-linkedin`) : identifiant et secret de l'application, jeton. Rien dans le dépôt (`serie/linkedin.py`, classe `Coffre`), pas de `.env`. Le jeton dure 60 jours et expire le 2027-01-05 (`serie linkedin etat`). Renouvellement manuel : `serie linkedin connecter` dans le navigateur, sans jeton de rafraîchissement. La tournée prévient 14 et 3 jours avant (`ALERTES_JETON`).

## D. Branchement avec le site

**Q12.** 👤 Mode de branchement préféré (voir `docs/08`) : A même dépôt, B deux dépôts avec commit automatique (recommandé), C webhook ?
Réponse : 👤 **Proposition tirée de l'état de la série, à confirmer par l'auteur.** **Mode A, même dépôt**. Les deux dossiers sont désormais réunis dans le dépôt public `theta-kit`, ce qui rend le mode B inutile : pas de second clone ni de jeton à portée limitée. Vercel : `Root Directory = site/theta-kit`, avec une « Ignored Build Step » pour ne pas reconstruire à chaque commit de `serie-ml/`. Ce choix remplace la recommandation par défaut de `docs/08` (mode B). Conséquence : `serie-ml` a son propre dépôt à l'intérieur, à garder en tête pour tout commit à la racine.

**Q13.** L'automatisation tourne-t-elle uniquement sur le PC de l'auteur, ou aussi sur un serveur ou dans le cloud ? (Détermine si elle peut faire `git push`.)
Réponse : Uniquement sur le PC de l'auteur. Il n'y a ni serveur ni cloud : le serveur reste à faire dans la feuille de route. La tâche planifiée tourne si une session Windows est ouverte. Elle peut faire `git push` : le Git Credential Manager est configuré. Le PC éteint ou fermé, plus de 2 heures de retard font manquer le post.

**Q14.** Faut-il attendre que le site soit en ligne avant de publier sur LinkedIn, pour que le lien de l'épisode marche dès la première minute ?
Réponse : Non. Le post ne contient aucun lien vers le site (Q8) et le site n'est pas construit : ce kit ne contient encore aucun code Next.js. Le lancement du 2026-11-10 ne dépend donc pas du site. Si un lien est ajouté plus tard, il faudra attendre que la page réponde 200 avant publication (`docs/08`). Ce sera une modification de l'automatisation.

**Q15.** Les épisodes 04 à 10 ont-ils déjà des carrousels finis (PDF + couverture) dans l'automatisation ? Si oui, où ? Ils remplaceront les fiches provisoires du kit.
Réponse : Oui, tous : `serie-ml/publier/04/` à `publier/10/` contiennent le PDF final (de 5 à 8 pages), `couvertures/` (PNG), `apercus/`, `texte.txt`, `premier-commentaire.txt`, `date.txt`. Les PDF 01 à 03 du kit sont identiques octet pour octet à ceux de la série ; les PDF 04 à 10 du kit sont les fiches de 3 pages à remplacer. Il faut produire les `theta-NN.webp` (`docs/08`). Attention : les YAML du kit sont en retard sur la série. Les textes de post diffèrent sur les 10 épisodes (de 21 à 39 % de ressemblance avec `publier/NN/texte.txt`), l'accroche sur 04 à 10, et le groupe « Optimisation » s'appelle « Apprendre de ses erreurs » dans `banque/` pour 05 à 10.

## E. E-mails

**Q16.** L'automatisation envoie-t-elle déjà des e-mails ou gère-t-elle une liste d'abonnés (Brevo, Mailchimp, Gmail API, autre) ? Sinon, 👤 d'accord pour Brevo (offre gratuite à vérifier sur brevo.com) ?
Réponse : Non : aucune trace d'envoi d'e-mail ni de liste d'abonnés dans `serie/`, `theta-post/CLAUDE.md`, `AMBIGUITES.md`, `charte/` et `.claude/` (recherche `brevo`, `mailchimp`, `smtp`, `newsletter`). La newsletter reste à faire dans la feuille de route. 👤 **Proposition tirée de l'état de la série, à confirmer par l'auteur.** Brevo, comme le prévoit le kit ; l'offre gratuite n'a pas été vérifiée ici.

**Q17.** À la sortie d'un épisode, l'envoi de la newsletter doit-il être automatique, ou validé par l'auteur comme le post ?
Réponse : 👤 **Proposition tirée de l'état de la série, à confirmer par l'auteur.** Automatique, sans seconde validation. La décision du 2026-10-30 (A49) fait de `serie statut NN relu` le seul arrêt, et la publication suit seule. L'envoi doit partir **après** la réussite du post LinkedIn, pas avant, pour ne jamais annoncer un épisode qui n'est pas sorti.

## F. Décisions de l'auteur 👤

**Q18.** Nom du sous-domaine Vercel : `theta-ml.vercel.app` te convient ? Sinon lequel ?
Réponse : 👤 **Proposition tirée de l'état de la série, à confirmer par l'auteur.** `theta-ml.vercel.app` : le nom paraît libre (`DEPLOYMENT_NOT_FOUND` le 2026-11-06, à confirmer à la création du projet). Il suit le hashtag de la série, #ThetaML.

**Q19.** Quel CV publier sur le site ? Le plus récent dit « Développeur web et mobile » et ne mentionne plus les 88 % ni XGBoost ; l'ancien dit « Stagiaire Machine Learning ». Le site met en avant le ML : garder les 88 % (et dire s'il s'agit de précision ou d'exactitude, *precision* ou *accuracy* en anglais) ou les retirer ?
Réponse : 👤 **Proposition tirée de l'état de la série, à confirmer par l'auteur.** Publier un CV orienté ML, **sans téléphone**, et **retirer les 88 % pour l'instant**. Le CV du kit affiche le numéro de téléphone, ce que `CLAUDE.md` interdit : il a été exclu du dépôt public (`.gitignore` à la racine). L'objectif de la série est un stage, et `profil.json` annonce « Ouvert à un stage en ML », alors que ce CV titre « Développeur web et mobile ». Les 88 % sont marqués `_verifier` dans `data/projets.json` et `data/profil.json`. Précision ou exactitude : inconnu, à demander à l'auteur. La série exige un chiffre sourcé, et l'erreur serait visible dès l'épisode 22 (Nº 22, « Précision, rappel et F1 »).

**Q20.** Ajout de nouveaux certificats : simple (tu me les envoies, je les ajoute dans `data/certificats.json` via Git) ou page `/admin` protégée sur le site ?
Réponse : 👤 **Proposition tirée de l'état de la série, à confirmer par l'auteur.** Simple, par Git : ajout dans `data/certificats.json`. Le site est statique et sans base de données ; une page `/admin` ajouterait une authentification à maintenir pour un ajout rare.

**Q21.** Anglais britannique ou américain pour la version EN ?
Réponse : 👤 **Proposition tirée de l'état de la série, à confirmer par l'auteur.** Britannique : le kit l'utilise déjà (`docs/04-i18n.md`, ligne 21). La série n'a pas de version anglaise.

**Q22.** Que faire de l'ancien portfolio `lama-portofolio.vercel.app` : redirection vers `/profil`, ou on le garde ?
Réponse : 👤 **Proposition tirée de l'état de la série, à confirmer par l'auteur.** Le garder tant que le nouveau site n'est pas en ligne : il répond encore (HTTP 200) et le CV y renvoie. Rediriger ensuite vers `/profil`. La série ne tranche pas ce point.

**Q23.** Pour l'AI for Good Bronze Award : nom exact de l'équipe (HeriTech) et ton rôle dans l'équipe, à afficher ?
Réponse : Nom de l'équipe : **HeriTech**, confirmé par le certificat (`public/certificats/ai-for-good-bronze-2026.jpg`). Il cite trois membres, dont l'auteur, et deux tuteurs. Rôle dans l'équipe : inconnu, à demander à l'auteur ; ni le certificat ni `data/` ne le disent.
