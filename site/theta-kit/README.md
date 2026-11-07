# Site θ Théta

Site Next.js bilingue de la série. `serie-ml` reste la source de vérité : le site lit la série, il ne la modifie jamais.

## Commandes

```bash
npm install
npm run sync       # relit ../../serie-ml : contenu/episodes.json, public/pdf, public/covers
npm run dev        # http://localhost:3000
npm run build
npm run lint
```

Pour voir tous les épisodes relus sans attendre leur date, en local seulement : `THETA_APERCU=1 npm run dev`.

## Quand un épisode est-il visible ?

Un épisode apparaît quand `date.txt` de `serie-ml/publier/NN/` est passé. Les pages se revalident toutes les 30 minutes : aucun déploiement n'est nécessaire le jour J, à condition que l'épisode ait été synchronisé et poussé avant.

Chaque nouvel épisode relu demande : `npm run sync`, commit, push.

## Publication

- Vercel : importer `lamafx/theta-kit`, `Root Directory = site/theta-kit`.
- Variables : voir `.env.example`. Ne jamais définir `THETA_APERCU` en production.
- Le formulaire reste fermé tant que `NEXT_PUBLIC_INSCRIPTION_ACTIVE` ne vaut pas `1`.
- Le bouton du CV reste caché tant que `contact.cv` vaut `null` dans `data/profil.json`.

## Organisation

- `app/` : routes. `components/views/` : gabarits portés depuis `reference/`.
- `lib/engines/` : code 3D et interactions portés des prototypes, repris tel quel autant que possible.
- `lib/content.ts` : lecture et validation de `contenu/episodes.json`, fichier généré à ne pas modifier.
- `data/episodes-affichage.json` : titres anglais, formules et liens du labo.
- `messages/` : textes FR et EN. `moteur.en.json` traduit les textes des moteurs.
- `scripts/recette.mjs` : recette dans le navigateur (`msedge`, serveur sur le port 3100).
