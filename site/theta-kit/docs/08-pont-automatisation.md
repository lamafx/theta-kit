# 08 · Pont avec l'automatisation Théta existante

## Ce que l'on sait (dit par l'auteur)

- Les carrousels sont produits depuis son VS Code avec Claude Code, à partir d'une banque de sujets dans l'ordre (chapitre, couverture avec le robot dans une pose adaptée, accroche, courbe de fond, sujet suivant).
- L'automatisation « est gérée par Théta actuellement et couplée avec IN ». **IN** est très probablement LinkedIn (publication des posts, récupération des statistiques pour adapter les publications suivantes). À confirmer : voir `QUESTIONS-AUTOMATISATION.md`, Q2.
- Une direction éditoriale existe (prompt « MISSION : DIRECTION ÉDITORIALE ET CONTRÔLE QUALITÉ ») avec une mémoire `editorial/` (historique, catalogues, évaluations). **Le site ne doit jamais modifier ces fichiers.**
- Aucune publication ne part sans validation de l'auteur.

## Ce que le site attend de l'automatisation

Pour chaque épisode validé :

| Fichier | Où | Format |
|---|---|---|
| `contenu/NN.yaml` | dépôt du site | schéma `docs/03` |
| `public/pdf/theta-NN.pdf` | dépôt du site (ou Vercel Blob) | PDF du carrousel tel que publié sur LinkedIn |
| `public/covers/theta-NN.webp` | dépôt du site | page 1 du PDF, 1080 px de large, WebP qualité 82 |

Commande pour fabriquer la couverture depuis le PDF (déjà utilisée pour 01 à 03) :
```bash
pdftoppm -f 1 -l 1 -r 144 -png public/pdf/theta-NN.pdf /tmp/c && \
cwebp -q 82 -resize 1080 0 /tmp/c-1.png -o public/covers/theta-NN.webp
```

## Trois façons de brancher (choisir après les réponses aux questions)

### Mode A · Même dépôt (le plus simple)
Le site vit dans un dossier `site/` du dépôt d'automatisation. L'étape « publier » de l'automatisation copie les 3 fichiers dans `site/`, fait un commit, pousse. Vercel (réglé sur `Root Directory = site`) reconstruit.

### Mode B · Deux dépôts, commit automatique
L'automatisation garde son dépôt. À la publication, un script `scripts/push-to-site.(ts|py)` :
1. clone ou met à jour `theta-site` ;
2. copie les 3 fichiers ;
3. valide le YAML (même schéma zod, ou `ajv` avec un JSON Schema généré) ;
4. commit `épisode NN : <titre>` et push (jeton GitHub à portée limitée au dépôt du site, dans `.env` de l'automatisation, jamais dans le code).

### Mode C · Webhook
L'automatisation appelle `POST /api/episodes` (signé HMAC avec `AUTOMATION_SECRET`) avec le YAML et les fichiers ; la route écrit dans Vercel Blob + déclenche un Deploy Hook Vercel. Plus complexe : seulement si l'automatisation tourne ailleurs que sur le PC de l'auteur et ne peut pas pousser sur Git.

**Recommandation par défaut : Mode B.** Il ne touche presque pas à l'automatisation existante et garde l'historique dans Git.

## Ordre des opérations à la publication

1. L'auteur valide l'épisode (règle éditoriale).
2. L'automatisation écrit YAML + PDF + couverture et pousse vers le site.
3. Attendre que le déploiement Vercel soit prêt (API Vercel `GET /v13/deployments/...` ou simple sondage de `https://<site>/fr/episodes/NN` jusqu'à 200).
4. Publier sur LinkedIn (IN) avec le lien `https://<site>/fr/episodes/NN` en premier commentaire ou dans le texte, selon la pratique actuelle (Q8).
5. Écrire en retour `linkedin.url` et `linkedin.publie_le` dans le YAML, commit.
6. Plus tard, la récupération des statistiques met à jour `linkedin.stats` (commit groupé une fois par jour pour éviter trop de déploiements, ou stockage hors Git : Q10).

## Ce qu'il ne faut pas faire

- Ne pas déplacer, renommer ou réécrire les scripts de l'automatisation sans accord.
- Ne pas déclencher de publication LinkedIn depuis le site.
- Ne pas mettre de jeton LinkedIn dans les variables Vercel (le site n'en a pas besoin).
