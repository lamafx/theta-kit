import crypto from 'node:crypto';
import { NextResponse, type NextRequest } from 'next/server';
import { sansSession } from '@/lib/garde';
import { GESTES, type CleGeste } from '@/lib/gestes';
import { ErreurGithub, githubActif, lancerWorkflow } from '@/lib/github';
import { limiteDepassee } from '@/lib/redis';
import { origineValide } from '@/lib/requete';
import { COOKIE_SALLE, verifier } from '@/lib/session';

export const runtime = 'nodejs';

const CIBLE = /^[a-z0-9][a-z0-9-]{0,40}$/i;

/** Lance un geste. La session est vérifiée par le middleware ; un geste sensible exige en plus la salle et la phrase. */
export async function POST(req: NextRequest) {
  const refus = await sansSession(req);
  if (refus) return refus;
  if (!origineValide(req)) return NextResponse.json({ erreur: 'requête refusée' }, { status: 403 });
  let c: { geste?: string; cible?: string; valeur?: unknown; phrase?: string };
  try {
    c = await req.json();
  } catch {
    return NextResponse.json({ erreur: 'requête illisible' }, { status: 400 });
  }
  const geste = c.geste as CleGeste;
  const def = GESTES[geste];
  if (!def) return NextResponse.json({ erreur: 'geste inconnu' }, { status: 400 });
  const cible = String(c.cible ?? '');
  if (cible && !CIBLE.test(cible)) return NextResponse.json({ erreur: 'cible invalide' }, { status: 400 });
  const valeur = typeof c.valeur === 'string' ? c.valeur : c.valeur == null ? '' : JSON.stringify(c.valeur);
  if (valeur.length > 20000) return NextResponse.json({ erreur: 'texte trop long' }, { status: 400 });

  if (def.sensible) {
    if (!(await verifier(req.cookies.get(COOKIE_SALLE)?.value, 'salle'))) {
      return NextResponse.json({ erreur: 'Salle de publication fermée : ressaisissez votre mot de passe.', salle: true }, { status: 403 });
    }
    const attendue = def.phrase?.(cible, valeur) ?? '';
    if ((c.phrase ?? '').trim().toUpperCase() !== attendue) {
      return NextResponse.json({ erreur: `Phrase de confirmation incorrecte (attendue : ${attendue}).` }, { status: 400 });
    }
  }
  if (!githubActif()) return NextResponse.json({ erreur: 'Accès GitHub de l’admin non configuré (ADMIN_GITHUB_TOKEN) : aucun geste ne peut partir.' }, { status: 503 });
  if (await limiteDepassee(`geste:${geste}`, def.sensible ? 6 : 30, 3600)) {
    return NextResponse.json({ erreur: 'Trop de gestes de ce type en une heure.' }, { status: 429 });
  }

  const jeton = crypto.randomBytes(4).toString('hex');
  const depuis = new Date(Date.now() - 5000).toISOString();
  try {
    if (def.workflow === 'linkedin.yml') {
      await lancerWorkflow('linkedin.yml', { action: geste, cle: cible, jeton });
    } else {
      await lancerWorkflow('admin.yml', { geste, cible, valeur, jeton });
    }
  } catch (e) {
    const m = e instanceof ErreurGithub ? e.message : 'GitHub injoignable';
    return NextResponse.json({ erreur: `Le geste n’est pas parti : ${m}` }, { status: 502 });
  }
  return NextResponse.json({ ok: true, jeton, workflow: def.workflow, depuis });
}
