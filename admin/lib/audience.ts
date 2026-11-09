import 'server-only';
import { pipeline, redisActif } from './redis';

// Lecture du compteur maison (écrit par site/theta-kit/app/api/compter). Clés par jour (AAAA-MM-JJ, UTC) :
//   pv:J  pages vues (champ « _total » et un champ par adresse)   uv:J  visiteurs uniques (HyperLogLog)
//   src:J sources   pays:J pays   app:J téléphone / ordinateur   lg:J langue
//   lab:J labos : « id|ouvert », « id|etape|k », « id|quiz », « id|quiz1 », « id|sec »

export function jours(n: number, fin = new Date()) {
  const out: string[] = [];
  for (let i = n - 1; i >= 0; i--) out.push(new Date(fin.getTime() - i * 86400000).toISOString().slice(0, 10));
  return out;
}

const somme = (cibles: Record<string, number>, h: Record<string, string> | string[] | null) => {
  if (!h) return;
  const paires: [string, string][] = Array.isArray(h) ? Array.from({ length: h.length / 2 }, (_, i) => [h[2 * i], h[2 * i + 1]]) : Object.entries(h);
  for (const [k, v] of paires) cibles[k] = (cibles[k] ?? 0) + Number(v);
};

export type Audience = {
  jours: string[];
  parJour: { jour: string; pages: number; visiteurs: number }[];
  visiteurs: number;
  pages: number;
  topPages: [string, number][];
  sources: [string, number][];
  pays: [string, number][];
  appareils: [string, number][];
  langues: [string, number][];
  labos: Record<string, { ouvert: number; quiz: number; quiz1: number; sec: number; etapes: Record<string, number> }>;
};

export async function audience(n: number): Promise<Audience | null> {
  if (!redisActif()) return null;
  const js = jours(n);
  const cmds: (string | number)[][] = [];
  for (const j of js) cmds.push(['HGETALL', `pv:${j}`], ['PFCOUNT', `uv:${j}`], ['HGETALL', `src:${j}`], ['HGETALL', `pays:${j}`], ['HGETALL', `app:${j}`], ['HGETALL', `lg:${j}`], ['HGETALL', `lab:${j}`]);
  cmds.push(['PFCOUNT', ...js.map((j) => `uv:${j}`)]);
  const r = await pipeline(cmds);
  if (!r) return null;
  const pv: Record<string, number> = {};
  const src: Record<string, number> = {};
  const pays: Record<string, number> = {};
  const app: Record<string, number> = {};
  const lg: Record<string, number> = {};
  const lab: Record<string, number> = {};
  const parJour = js.map((jour, i) => {
    const b = i * 7;
    const jpv: Record<string, number> = {};
    somme(jpv, r[b]);
    somme(pv, r[b]);
    somme(src, r[b + 2]);
    somme(pays, r[b + 3]);
    somme(app, r[b + 4]);
    somme(lg, r[b + 5]);
    somme(lab, r[b + 6]);
    return { jour, pages: jpv._total ?? 0, visiteurs: Number(r[b + 1] ?? 0) };
  });
  const tri = (o: Record<string, number>, sauf = '_total') => Object.entries(o).filter(([k]) => k !== sauf).sort((a, b) => b[1] - a[1]);
  const labos: Audience['labos'] = {};
  for (const [k, v] of Object.entries(lab)) {
    const [id, quoi, etape] = k.split('|');
    const l = (labos[id] ??= { ouvert: 0, quiz: 0, quiz1: 0, sec: 0, etapes: {} });
    if (quoi === 'etape') l.etapes[etape] = (l.etapes[etape] ?? 0) + v;
    else if (quoi in l) (l as any)[quoi] += v;
  }
  return {
    jours: js,
    parJour,
    visiteurs: Number(r[r.length - 1] ?? 0),
    pages: pv._total ?? 0,
    topPages: tri(pv).slice(0, 12),
    sources: tri(src),
    pays: tri(pays).slice(0, 10),
    appareils: tri(app),
    langues: tri(lg),
    labos,
  };
}

/** Inscriptions : nombre de contacts Brevo (BREVO_API_KEY), mis en cache une heure. */
export async function inscrits(): Promise<number | null> {
  const cle = process.env.BREVO_API_KEY;
  if (!cle) return null;
  try {
    const r = await fetch('https://api.brevo.com/v3/contacts?limit=1&offset=0', { headers: { 'api-key': cle, accept: 'application/json' }, next: { revalidate: 3600 } });
    if (!r.ok) return null;
    return (await r.json()).count ?? null;
  } catch {
    return null;
  }
}
