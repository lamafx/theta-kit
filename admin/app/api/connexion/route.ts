import { NextResponse, type NextRequest } from 'next/server';
import { verifierMotDePasse } from '@/lib/motdepasse';
import { limiteDepassee } from '@/lib/redis';
import { COOKIE_SALLE, COOKIE_SESSION, DUREE_SALLE, DUREE_SESSION, optionsCookie, signer, verifier } from '@/lib/session';
import { ip, origineValide } from '@/lib/requete';

export const runtime = 'nodejs';

/** Connexion (session de 30 jours) ou entrée dans la salle de publication (10 minutes), par le mot de passe. */
export async function POST(req: NextRequest) {
  if (!origineValide(req)) return NextResponse.json({ erreur: 'requête refusée' }, { status: 403 });
  if (!process.env.ADMIN_MOT_DE_PASSE_HASH || !process.env.ADMIN_SECRET) {
    return NextResponse.json({ erreur: 'L’admin n’est pas encore configuré : mot de passe absent sur Vercel.' }, { status: 503 });
  }
  let corps: { motDePasse?: string; salle?: boolean };
  try {
    corps = await req.json();
  } catch {
    return NextResponse.json({ erreur: 'requête illisible' }, { status: 400 });
  }
  if (await limiteDepassee(`connexion:${ip(req)}`, 5, 900)) {
    return NextResponse.json({ erreur: 'Trop d’essais. Réessayez dans un quart d’heure.' }, { status: 429 });
  }
  if (corps.salle && !(await verifier(req.cookies.get(COOKIE_SESSION)?.value, 'session'))) {
    return NextResponse.json({ erreur: 'session expirée : reconnectez-vous' }, { status: 401 });
  }
  // Délai constant : la réponse ne dit rien du mot de passe par sa durée.
  const debut = Date.now();
  const ok = verifierMotDePasse(String(corps.motDePasse ?? ''));
  await new Promise((r) => setTimeout(r, Math.max(0, 600 - (Date.now() - debut))));
  if (!ok) return NextResponse.json({ erreur: 'Mot de passe incorrect.' }, { status: 401 });
  const rep = NextResponse.json({ ok: true });
  if (corps.salle) rep.cookies.set(COOKIE_SALLE, await signer('salle', DUREE_SALLE), optionsCookie(DUREE_SALLE));
  else rep.cookies.set(COOKIE_SESSION, await signer('session', DUREE_SESSION), optionsCookie(DUREE_SESSION));
  return rep;
}

export async function DELETE(req: NextRequest) {
  if (!origineValide(req)) return NextResponse.json({ erreur: 'requête refusée' }, { status: 403 });
  const rep = NextResponse.json({ ok: true });
  rep.cookies.set(COOKIE_SESSION, '', { ...optionsCookie(0), maxAge: 0 });
  rep.cookies.set(COOKIE_SALLE, '', { ...optionsCookie(0), maxAge: 0 });
  return rep;
}
