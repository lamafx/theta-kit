import { NextResponse, type NextRequest } from 'next/server';
import { donnees, estPublie } from '@/lib/donnees';
import { githubActif, lancerWorkflow } from '@/lib/github';
import { joursAvant } from '@/lib/format';
import { notifierUneFois, pushActif } from '@/lib/push';
import { synthese } from '@/lib/synthese';
import type { Episode } from '@/lib/types';

export const runtime = 'nodejs';

/**
 * Tâche quotidienne (Vercel Cron, vercel.json, 7 h à Abidjan) : réveil du post du jour, relevé des statistiques LinkedIn, avance sous le minimum, épisodes à relire,
 * labo sans recette à J-7, jeton bientôt expiré. Chaque alerte part une fois par jour au plus.
 */
export async function GET(req: NextRequest) {
  if (req.headers.get('authorization') !== `Bearer ${process.env.CRON_SECRET}` || !process.env.CRON_SECRET) {
    return NextResponse.json({ erreur: 'non autorisé' }, { status: 401 });
  }
  const d = await donnees();
  if (d.indisponible) return NextResponse.json({ ok: false, raison: 'instantané indisponible' });
  const reveils = await reveiller([...d.episodes, ...d.bilans]);
  const stats = await releverStats(d.episodes.some((e) => estPublie(e)) || d.bilans.some((b) => estPublie(b)));
  if (!pushActif()) return NextResponse.json({ ok: true, reveils, stats, envoyees: 0, raison: 'notifications non configurées' });
  const s = synthese(d);
  const jour = new Date().toISOString().slice(0, 10);
  const envois: Promise<number>[] = [];
  if (s.relusAvance < s.avanceMin) {
    envois.push(notifierUneFois(`avance-${jour}`, { titre: 'Avance sous le minimum', texte: `${s.relusAvance} épisode(s) relu(s) d’avance, minimum ${s.avanceMin}.`, lien: '/admin/episodes?filtre=a-relire' }));
  }
  if (s.aRelire.length) {
    envois.push(notifierUneFois(`relire-${jour}`, { titre: 'À relire', texte: s.aRelire.map((e) => `Nº ${e.n} · ${e.titre}`).join(' ; '), lien: `/admin/episodes/${s.aRelire[0].n}` }));
  }
  for (const l of s.labos.recetteAFaire) {
    envois.push(notifierUneFois(`recette-${l.id}-${jour}`, { titre: `Labo ${l.id} : recette à faire`, texte: `Il ouvre dans ${joursAvant(l.date_ouverture)} jour(s) et sa recette n’est pas validée.`, lien: `/admin/labos/${l.id}` }));
  }
  if (s.jetonJours !== null && [30, 14, 7, 3, 1].includes(s.jetonJours)) {
    envois.push(notifierUneFois(`jeton-${s.jetonJours}`, { titre: 'Jeton LinkedIn', texte: `Il expire dans ${s.jetonJours} jour(s) : renouvelez-le sur le PC.`, lien: '/admin/publication' }, 3 * 86400));
  }
  if (s.prochain?.date_prevue && joursAvant(s.prochain.date_prevue) === 1 && s.prochain.statut !== 'relu') {
    envois.push(notifierUneFois(`demain-${s.prochain.n}`, { titre: `Nº ${s.prochain.n} demain, pas relu`, texte: 'La tournée refusera de le publier tant qu’il n’est pas relu.', lien: `/admin/episodes/${s.prochain.n}` }));
  }
  const n = (await Promise.all(envois)).reduce((a, b) => a + b, 0);
  return NextResponse.json({ ok: true, reveils, stats, envoyees: n });
}

/**
 * Le cron de GitHub saute des tournées (Nº 01, 2026-11-10) : pour chaque post prévu aujourd'hui et pas encore
 * publié, lance linkedin-reveil.yml, qui attend l'heure exacte puis lance la tournée.
 */
async function reveiller(posts: { statut: Episode['statut']; date_prevue: string | null }[]) {
  if (!githubActif()) return 'accès GitHub non configuré';
  const maintenant = Date.now();
  const heures = [...new Set(posts
    .filter((p) => p.date_prevue && !estPublie(p))
    .map((p) => new Date(p.date_prevue!))
    .filter((q) => q.getTime() > maintenant - 30 * 60_000 && q.getTime() < maintenant + 4 * 3600_000)
    .map((q) => q.toISOString()))];
  const lances: string[] = [];
  for (const a of heures) {
    try {
      await lancerWorkflow('linkedin-reveil.yml', { a });
      lances.push(a);
    } catch (e) {
      lances.push(`${a} : échec (${(e as Error).message})`);
    }
  }
  return lances;
}

/**
 * Relevé quotidien des statistiques LinkedIn (serie linkedin stats, sur GitHub) : mesures/linkedin/<id>.yaml et
 * mesures/NN.yaml (48 h, 7 jours), sans rien saisir. Exige la portée r_member_postAnalytics ; sans elle, la tournée
 * ouvre une issue une fois, avec la marche à suivre.
 */
async function releverStats(unPostPublie: boolean) {
  if (!unPostPublie) return 'aucun post publié';
  if (!githubActif()) return 'accès GitHub non configuré';
  try {
    await lancerWorkflow('linkedin.yml', { action: 'stats', cle: '', jeton: '' });
    return 'lancé';
  } catch (e) {
    return `échec (${(e as Error).message})`;
  }
}
