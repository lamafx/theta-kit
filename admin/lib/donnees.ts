import 'server-only';
import fs from 'node:fs';
import path from 'node:path';
import YAML from 'yaml';
import { fichierGithub, githubActif } from './github';
import type { Donnees, Episode, Statut } from './types';

let cache: { mtime: number; d: Donnees } | null = null;

/** L'instantané fait au build (scripts/instantane.mjs). */
export function instantane(): Donnees {
  const f = path.join(process.cwd(), '.instantane', 'donnees.json');
  try {
    const mtime = fs.statSync(f).mtimeMs;
    if (!cache || cache.mtime !== mtime) cache = { mtime, d: JSON.parse(fs.readFileSync(f, 'utf8')) };
    return cache.d;
  } catch {
    return { indisponible: true, genere_le: new Date().toISOString() } as Donnees;
  }
}

/**
 * L'instantané, corrigé par l'état en direct de etat.yaml sur GitHub quand l'accès est configuré :
 * un épisode validé ou publié il y a une minute apparaît tout de suite, sans attendre le redéploiement.
 */
export async function donnees(): Promise<Donnees & { direct: boolean }> {
  const d = instantane();
  if (d.indisponible || !githubActif()) return { ...d, direct: false };
  try {
    const brut = await fichierGithub('serie-ml/etat.yaml', 30);
    if (!brut) return { ...d, direct: false };
    const etat = YAML.parse(brut, { schema: 'core' }) as { episodes: Record<string, { statut: Statut; publie_le?: string | null }> };
    const episodes: Episode[] = d.episodes.map((e) => {
      const v = etat.episodes?.[e.n];
      if (!v) return e;
      return { ...e, statut: v.statut, publie_le: v.publie_le ? String(v.publie_le).slice(0, 10) : null };
    });
    return { ...d, episodes, direct: true };
  } catch {
    return { ...d, direct: false };
  }
}

/** Épisodes relus et pas encore publiés : l'avance de sécurité. */
export function avance(eps: Episode[]) {
  return eps.filter((e) => e.statut === 'relu').length;
}

/** Le prochain post : le plus ancien épisode non publié qui a une date. */
export function prochainPost(eps: Episode[]) {
  return eps.filter((e) => !['publie', 'mesure'].includes(e.statut) && e.date_prevue).sort((a, b) => a.date_prevue!.localeCompare(b.date_prevue!))[0];
}

export function estPublie(e: Pick<Episode, 'statut'>) {
  return e.statut === 'publie' || e.statut === 'mesure';
}

/** Labo ouvert sur le site : épisode publié, ou date de sortie passée (même règle que site/theta-kit/lib/content.ts). */
export function laboOuvert(dateOuverture: string | null, publieLe: string | null, maintenant = new Date()) {
  if (publieLe) return true;
  return !!dateOuverture && new Date(dateOuverture) <= maintenant;
}
