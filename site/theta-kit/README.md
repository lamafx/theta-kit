# Théta Kit v1 · le site θ Théta, prêt à générer

Ce kit contient tout le contexte pour que Claude Code génère le site θ Théta complet : Next.js, FR/EN, téléphone/tablette/ordinateur, Vercel, et branché sur ton automatisation actuelle.

## Contenu

```
theta-kit/
  README.md                    ce fichier (pour toi)
  CLAUDE.md                    les règles et le plan pour Claude Code (lu automatiquement)
  PROMPT-DEMARRAGE.md          le message à coller dans Claude Code
  QUESTIONS-AUTOMATISATION.md  23 questions : Claude Code répond à celles sur ton automatisation, toi aux 👤
  docs/                        01 design · 02 architecture · 03 contenu · 04 FR/EN · 05 appareils
                               06 formulaires · 07 Vercel · 08 pont automatisation · 09 recette
  reference/                   les 4 prototypes Claude Design (accueil, voyage, labo, profil)
  contenu/                     01 à 03 complets FR + EN (tirés de tes vrais carrousels), 04 à 10 brouillons
  data/                        profil, projets, certificats, parcours (FR + EN)
  messages/                    textes d'interface fr.json / en.json
  public/                      PDF 01 à 10, couvertures 01 à 03, CV, 3 certificats, photo détourée
```

## Comment l'utiliser (5 étapes)

1. **Dézippe** le kit à côté du dossier de ton automatisation Théta (même dossier parent), par exemple :
   `Documents/theta/` (automatisation) et `Documents/theta-kit/` (ce kit).
2. Ouvre `theta-kit` dans VS Code, lance Claude Code.
3. Colle le contenu de `PROMPT-DEMARRAGE.md`.
4. Claude Code va d'abord lire le kit et ton automatisation, puis **remplir `QUESTIONS-AUTOMATISATION.md`**. Réponds ensuite toi-même aux questions marquées 👤 (sous-domaine, CV, certificats, anglais UK/US...).
5. Il construit le site étape par étape, avec une URL de prévisualisation Vercel à chaque étape. Tu valides avant la mise en ligne.

## Ce qu'il te faut

- Un compte GitHub et un compte Vercel (gratuit) reliés.
- Node.js 20 ou plus.
- Pour les e-mails : un compte Brevo (ou le service que ton automatisation utilise déjà).

## Points ouverts à trancher (aussi listés dans les questions)

- **CV** : le fichier du site est ton CV le plus récent (« Développeur web et mobile »). Le site, lui, te présente côté Machine Learning et affiche « 88 % » (chiffre de ton ancien CV, absent du nouveau). Choisis lequel publier (Q19).
- **Sous-domaine** : `theta-ml.vercel.app` proposé (Q18).
- **Épisodes 04 à 10** : PDF provisoires de 3 pages en attendant les vrais carrousels (Q15).
- Les posts LinkedIn dans les YAML viennent du document « texte post » du projet ; ils sont marqués `a_valider` et ne sont pas réécrits.
