import profil from '@/data/profil.json';
import projets from '@/data/projets.json';
import certificats from '@/data/certificats.json';
import parcours from '@/data/parcours.json';
import { typoProfonde } from './typo';

type L = 'fr' | 'en';
const lg = (v: any, l: L) => (v && typeof v === 'object' ? v[l] : v);

export function donneesProfil(l: L) {
  const intl = l === 'en' ? 'en-US' : 'fr-FR';
  const unite = (n: number) => (l === 'fr' ? `${n} projet${n > 1 ? 's' : ''}` : `${n} project${n > 1 ? 's' : ''}`);
  const sup = (c: any) => (c.suffixe === 'e' ? (l === 'fr' ? 'e' : 'rd') : c.suffixe);
  const fmtDate = (d: string) =>
    /^\d{4}-\d{2}-\d{2}$/.test(d)
      ? new Intl.DateTimeFormat(intl, { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }).format(new Date(d))
      : /^\d{4}-\d{2}$/.test(d)
        ? new Intl.DateTimeFormat(intl, { month: 'long', year: 'numeric', timeZone: 'UTC' }).format(new Date(`${d}-01`))
        : d;
  const d = {
    p: {
      compteurs: profil.compteurs.map((c: any) => ({ valeur: c.valeur, sup: sup(c), texte: c.texte, label: c[l] })),
      parcours: parcours.map((e: any) => ({ annee: lg(e.annee, l), t: e[l].t, d: e[l].d, cls: e.actuel ? 'tl-now' : undefined })),
      outils: profil.boite_a_outils.map((g: any) => ({
        t: g[l],
        d: g.desc[l],
        chips: g.outils.map((o: any) => ({ t: o.t, n: o.n ? unite(o.n) : '' })),
      })),
    },
    projets: projets.map((j: any) => ({
      n: j.n, title: j.titre[l], date: j.date[l], res: lg(j.resultat, l), tags: j.tags, notion: j.notion[l], tools: j.outils, desc: j.desc[l], bullets: j.points[l],
    })),
    preuves: certificats.map((c: any) => ({
      id: c.id, type: c.type, title: c.titre[l], issuer: c.emetteur[l], date: fmtDate(c.date), rank: c.rang ?? '', event: c.emetteur[l],
      url: c.image ?? undefined, ct: c.image ? 'image/jpeg' : undefined, file: c.fichier ?? undefined, skills: c.competences, desc: c.desc[l], vedette: !!c.vedette, seed: true,
    })),
  };
  return l === 'fr' ? typoProfonde(d) : d;
}

export const CONTACT = profil.contact;
