# 07 · Mise en ligne sur Vercel

## Première mise en ligne

1. Créer le dépôt GitHub du site (nom proposé : `theta-site`), branche `main`.
2. `npx create-next-app@latest theta-site --ts --app --eslint --src-dir=false --import-alias "@/*"` puis y déplacer le contenu de ce kit (`contenu/`, `data/`, `messages/`, `public/`, `docs/`, `reference/`, `CLAUDE.md`).
3. Sur vercel.com : « Add New Project », importer le dépôt, framework Next.js détecté, ajouter les variables de `docs/06`.
4. Nom du projet Vercel = sous-domaine. Proposé : `theta-ml` → `https://theta-ml.vercel.app`. **À confirmer par l'auteur** (vérifier la disponibilité). Si `theta` est pris, essayer `theta-ml`, `thetaml`, `theta-kamagate`.
5. Chaque branche ou PR obtient une URL de prévisualisation : l'utiliser pour la recette (`docs/09`) avant de fusionner dans `main`.

## Réglages

- `next.config.ts` : `images.formats: ['image/avif', 'image/webp']`, en-têtes de cache longs pour `/pdf/*`, `/covers/*`, `/certificats/*` (`Cache-Control: public, max-age=31536000, immutable` **seulement si** les fichiers sont versionnés par leur nom ; sinon `max-age=3600, stale-while-revalidate=86400`).
- En-têtes de sécurité : `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, CSP raisonnable (Google Fonts si utilisé, sinon tout local).
- `@vercel/analytics` et `@vercel/speed-insights`.
- Taille : les PDF font environ 7 Mo au total, sans problème pour Vercel. Si la saison complète dépasse quelques centaines de Mo, déplacer les PDF vers Vercel Blob et garder les chemins via des redirections.

## Domaine personnel plus tard

Si l'auteur achète un domaine (par exemple `theta.ml` ou `thetaml.com`), l'ajouter dans Vercel > Settings > Domains, rediriger `*.vercel.app` vers lui, mettre à jour `NEXT_PUBLIC_SITE_URL`, le sitemap et le lien dans les posts LinkedIn.

## Liens à mettre à jour après la mise en ligne

- Lien du site sur le profil LinkedIn de l'auteur (section Coordonnées / Site web) et dans le CV.
- Ancien portfolio `lama-portofolio.vercel.app` : rediriger vers `/profil` ou le garder ? `TODO(auteur)`.
