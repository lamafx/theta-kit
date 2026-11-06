# 03 · Modèle de contenu

Un épisode = un fichier `contenu/NN.yaml` + `public/pdf/theta-NN.pdf` + (si publié) `public/covers/theta-NN.webp`.
`01.yaml` est le **fichier modèle complet**. `04` à `10` sont des brouillons (PDF provisoire de 3 pages, pas de couverture).

## Champs

| Champ | Type | Obligatoire | Notes |
|---|---|---|---|
| `n` | chaîne `"01"` à `"62"` | oui | **toujours entre guillemets** (sinon `08` peut être lu comme un nombre) |
| `saison` | entier | oui | |
| `statut` | `publie` \| `brouillon` | oui | `brouillon` : visible dans le tunnel et la liste, avec mention « fiche provisoire », pas de page épisode indexée |
| `groupe` | `{fr, en}` | oui | Chapitre du tunnel et étiquette de carte |
| `titre` | `{fr: {t1, t2}, en: {t1, t2}}` | oui | t1 en Geist, t2 en Instrument Serif italique |
| `titre_couverture` | `{fr, en}` | non | Titre affiché sur la couverture du carrousel s'il diffère |
| `accroche` | `{fr, en}` | oui | Sous-titre de la couverture |
| `resume` | `{fr, en}` | oui | Texte de la carte sur l'accueil (2 lignes max) |
| `theme` | `derivee` \| `gradient` \| `descente` \| `minilots` \| `minlocaux` \| `selle` \| `null` | oui | Active le bouton « Ouvrir dans le labo 3D » |
| `pdf` | `{chemin, pages, type: carrousel\|provisoire, langue}` | oui | |
| `couverture` | chemin \| `null` | oui | Sans couverture : la carte affiche la fiche typographique du prototype |
| `pages[]` | liste | non | `num`, `rubrique`, `titre`, `texte`, et selon la page `rappel`, `schema`, `tableau`, `encadres`, `ce_que_ca_veut_dire`, `exemple_classique`, `image`, `legende` ; chaque texte en `{fr, en}` |
| `a_retenir` | `{fr: [3], en: [3]}` | si publié | |
| `verifiez_vous` | `{question: {fr,en}, reponse_page}` | si publié | Réponse repliable : afficher le texte de la page indiquée |
| `suivant` | `{n, titre, teaser}` | si publié | |
| `sources` | liste de chaînes | si publié | Affichées en bas de la page épisode |
| `post_linkedin` | `{statut, fr, en}` | non | Texte du post ; `statut: a_valider` tant que l'auteur n'a pas validé |
| `hashtags` | liste | non | |
| `linkedin` | `{url, publie_le, stats{...}}` | non | Écrit par l'automatisation après publication |

## Validation (zod, à mettre dans `lib/content.ts`)

```ts
const L = z.object({ fr: z.string(), en: z.string().nullable() });
export const Episode = z.object({
  n: z.string().regex(/^\d{2}$/),
  saison: z.number().int(),
  statut: z.enum(['publie', 'brouillon']),
  groupe: L,
  titre: z.object({ fr: z.object({ t1: z.string(), t2: z.string() }), en: z.object({ t1: z.string(), t2: z.string() }) }),
  titre_couverture: L.optional(),
  accroche: L, resume: L,
  theme: z.enum(['derivee', 'gradient', 'descente', 'minilots', 'minlocaux', 'selle']).nullable(),
  pdf: z.object({ chemin: z.string(), pages: z.number(), type: z.enum(['carrousel', 'provisoire']), langue: z.string() }),
  couverture: z.string().nullable(),
  pages: z.array(z.record(z.any())).default([]),
  a_retenir: z.object({ fr: z.array(z.string()), en: z.array(z.string()) }).optional(),
  verifiez_vous: z.object({ question: L, reponse_page: z.number() }).optional(),
  suivant: z.object({ n: z.string(), titre: L, teaser: L }).optional(),
  sources: z.array(z.string()).optional(),
  post_linkedin: z.object({ statut: z.string(), fr: z.string(), en: z.string().nullable() }).optional(),
  hashtags: z.array(z.string()).optional(),
  linkedin: z.any().optional(),
}).superRefine((e, ctx) => {
  if (e.statut === 'publie' && (!e.couverture || !e.a_retenir || !e.verifiez_vous))
    ctx.addIssue({ code: 'custom', message: `Épisode ${e.n} publié mais incomplet` });
});
```

Le build **échoue** si un YAML est invalide : c'est voulu, l'automatisation verra l'erreur dans le déploiement Vercel.

## Repli de langue

Si un champ `en` vaut `null` ou commence par `TODO`, la version anglaise affiche le texte français avec une petite mention « Available in French only for now ». Jamais de traduction automatique au rendu.

## La carte « Guide »

Elle n'est pas un épisode : elle vient de `messages/*.json` (`home.guide`). Le guide PDF de fin de saison sera `public/pdf/theta-guide-saison-1.pdf` quand il existera ; d'ici là, le bouton mène au formulaire (intérêt « PDF »).

## Les 62 épisodes

Le programme complet (titres 11 à 62) n'est pas dans ce kit. Le tunnel et l'accueil n'affichent que les épisodes ayant un YAML. Le compteur « Nº XX / 62 » utilise la constante `TOTAL_EPISODES = 62`.
