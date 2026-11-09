import { z } from 'zod';

// Formes minimales que le site attend (site/theta-kit/lib/profil.ts, components/views/ProfilView.tsx).
// Les champs en plus sont gardés tels quels (passthrough) : l'admin n'efface jamais ce qu'il ne connaît pas.
const fren = z.object({ fr: z.string(), en: z.string() }).passthrough();
const frenListes = z.object({ fr: z.array(z.string()), en: z.array(z.string()) }).passthrough();

export const SCHEMAS = {
  profil: z
    .object({
      nom: z.string().min(2),
      titre: fren,
      accroche: fren,
      contact: z.object({ email: z.string().email(), cv: z.string() }).passthrough(),
      compteurs: z.array(z.object({ fr: z.string(), en: z.string() }).passthrough()),
      boite_a_outils: z.array(z.object({ fr: z.string(), en: z.string(), desc: fren, outils: z.array(z.object({ t: z.string() }).passthrough()) }).passthrough()),
    })
    .passthrough(),
  parcours: z.array(
    z.object({ annee: z.union([z.string(), fren]), fr: z.object({ t: z.string(), d: z.string() }).passthrough(), en: z.object({ t: z.string(), d: z.string() }).passthrough() }).passthrough(),
  ),
  certificats: z.array(
    z
      .object({
        id: z.string().regex(/^[a-z0-9-]+$/, 'identifiant : minuscules, chiffres et tirets'),
        type: z.string(),
        date: z.string(),
        titre: fren,
        emetteur: fren,
        competences: z.array(z.string()),
        desc: fren,
        image: z.string().nullable().optional(),
        fichier: z.string().nullable().optional(),
        vedette: z.boolean().optional(),
      })
      .passthrough(),
  ),
  projets: z.array(
    z
      .object({
        n: z.string(),
        tags: z.array(z.string()),
        date: fren,
        titre: fren,
        notion: fren,
        outils: z.array(z.string()),
        desc: fren,
        points: frenListes,
      })
      .passthrough(),
  ),
  sections: z.object({ ordre: z.array(z.string()), masquees: z.array(z.string()) }).passthrough(),
};

export type FichierProfilCle = keyof typeof SCHEMAS;
export const FICHIERS_PROFIL = Object.keys(SCHEMAS) as FichierProfilCle[];
export const cheminProfil = (f: FichierProfilCle) => `site/theta-kit/data/${f}.json`;
