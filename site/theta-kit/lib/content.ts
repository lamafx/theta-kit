import { z } from 'zod';
import brut from '@/contenu/episodes.json';
import affichage from '@/data/episodes-affichage.json';
import { frTypo } from './typo';

const Episode = z.object({
  n: z.string().regex(/^\d{2}$/),
  saison: z.number(),
  chapitre: z.object({ numero: z.number(), titre: z.string() }),
  titre: z.string(),
  accroche: z.string(),
  statut: z.string(),
  pret: z.boolean(),
  date: z.string().optional(),
  publie_le: z.string().nullable().optional(),
  nb_pages: z.number().optional(),
  pages: z.array(z.object({ role: z.string(), titre: z.string(), texte: z.string() })).optional(),
  fin: z.object({ points: z.array(z.string()), verification: z.object({ question: z.string(), page: z.number() }).nullable() }).nullable().optional(),
  post: z.string().nullable().optional(),
  hashtags: z.array(z.string()).optional(),
  sources: z.array(z.object({ libelle: z.string(), url: z.string() })).optional(),
});
export type Episode = z.infer<typeof Episode>;

const Fichier = z.object({ total: z.number(), posts_par_semaine: z.number(), lancement: z.string(), episodes: z.array(Episode) });
// Le build échoue si le fichier généré est invalide : c'est voulu.
export const serie = Fichier.parse(brut);
type Aff = { titre_en: string; fr?: string[]; en?: string[]; accroche_en?: string; v?: string; formule_fr?: string | null; formule_en?: string | null; themes?: string[] };
const AFF = affichage.episodes as Record<string, Aff>;
const CHAP = affichage.chapitres_en as Record<string, string>;

/** Paru : publié par la série, ou date de publication passée. La page se revalide, sans nouveau déploiement. */
export function estParu(e: Episode, maintenant = new Date()): boolean {
  if (!e.pret) return false;
  if (process.env.THETA_APERCU === '1' || e.publie_le) return true;
  return !!e.date && new Date(e.date) <= maintenant;
}

export function episodesParus() {
  return serie.episodes.filter((e) => estParu(e));
}

export function prochain() {
  return serie.episodes.find((e) => !estParu(e));
}

/** Décision de l'auteur (2026-11-07) : tous les labos sont ouverts. À false, chaque labo suit la date de son épisode. */
const TOUS_LES_LABOS_OUVERTS = true;

/** Un labo ouvre avec son épisode. Le prochain épisode prêt ouvre le sien en avant-goût. */
export function estOuvert(e: Episode, maintenant = new Date()): boolean {
  if (TOUS_LES_LABOS_OUVERTS) return true;
  return e.pret && (estParu(e, maintenant) || e === prochain());
}

/** Le labo proposé par défaut : celui du prochain épisode, sinon le dernier ouvert. */
export function laboDuMoment(ouverts: string[]): string {
  const suite = prochain();
  const id = suite ? AFF[suite.n]?.themes?.[0] : undefined;
  return id && ouverts.includes(id) ? id : ouverts[ouverts.length - 1] ?? 'exemples';
}

export function arbreLabos(locale: string, titre: (id: string) => string) {
  const ouverts: string[] = [];
  const saisons = [...new Set(serie.episodes.map((e) => e.saison))].sort((a, b) => a - b);
  const arbre = saisons.map((saison) => {
    const eps = serie.episodes.filter((e) => e.saison === saison);
    const chapitres = [...new Set(eps.map((e) => e.chapitre.numero))].map((numero) => {
      const dans = eps.filter((e) => e.chapitre.numero === numero);
      const labos = dans.flatMap((e) => (AFF[e.n]?.themes ?? []).map((id) => {
        const ouvert = estOuvert(e);
        if (ouvert) ouverts.push(id);
        return { id, n: e.n, titre: titre(id), ouvert, quand: e.date ? dateLisible(e.date, locale) : null };
      }));
      return { titre: vuDe(dans[0], locale).chapitre, labos };
    });
    return { saison, chapitres, nbOuverts: chapitres.flatMap((c) => c.labos).filter((l) => l.ouvert).length };
  });
  return { arbre, ouverts };
}

export function labo(arbre: ReturnType<typeof arbreLabos>['arbre'], id: string) {
  for (const s of arbre) {
    for (const c of s.chapitres) {
      const l = c.labos.find((x) => x.id === id);
      if (l) return { ...l, saison: s.saison };
    }
  }
  return null;
}

function coupure(titre: string): [string, string] {
  const mots = titre.split(' ');
  if (mots.length < 2) return ['', titre];
  const m = Math.ceil(mots.length / 2);
  return [mots.slice(0, m).join(' '), mots.slice(m).join(' ')];
}

export function vuDe(e: Episode, locale: string) {
  const a = AFF[e.n];
  const en = locale === 'en';
  const titre = en ? a?.titre_en ?? e.titre : frTypo(e.titre);
  const coupe = (en ? a?.en : a?.fr) ?? coupure(titre);
  return {
    n: e.n,
    titre,
    t1: en ? coupe[0] : frTypo(coupe[0]),
    t2: en ? coupe[1] : frTypo(coupe[1]),
    accroche: en ? a?.accroche_en ?? e.accroche : frTypo(e.accroche),
    chapitre: en ? CHAP[String(e.chapitre.numero)] ?? e.chapitre.titre : e.chapitre.titre,
    v: a?.v,
    formule: (en ? a?.formule_en : a?.formule_fr) ?? undefined,
    themes: a?.themes ?? [],
  };
}

export function dateLisible(iso: string, locale: string) {
  return new Intl.DateTimeFormat(locale === 'en' ? 'en-US' : 'fr-FR', { day: 'numeric', month: 'long', timeZone: 'UTC' }).format(new Date(iso));
}
