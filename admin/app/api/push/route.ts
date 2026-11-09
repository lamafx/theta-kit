import { NextResponse, type NextRequest } from 'next/server';
import { sansSession } from '@/lib/garde';
import { abonner, desabonner, notifier, pushActif } from '@/lib/push';
import { origineValide } from '@/lib/requete';

export const runtime = 'nodejs';

/** Abonne cet appareil aux notifications, ou envoie une notification d'essai. */
export async function POST(req: NextRequest) {
  const refus = await sansSession(req);
  if (refus) return refus;
  if (!origineValide(req)) return NextResponse.json({ erreur: 'requête refusée' }, { status: 403 });
  if (!pushActif()) return NextResponse.json({ erreur: 'Notifications non configurées (clés VAPID et base Redis sur Vercel).' }, { status: 503 });
  const c = await req.json().catch(() => ({}));
  if (c.essai) {
    const n = await notifier({ titre: 'θ Admin', texte: 'Les notifications arrivent bien sur cet appareil.', tag: 'essai' });
    return NextResponse.json({ ok: true, envoyees: n });
  }
  if (!c.abonnement?.endpoint || !String(c.abonnement.endpoint).startsWith('https://')) return NextResponse.json({ erreur: 'abonnement invalide' }, { status: 400 });
  await abonner(c.abonnement);
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: NextRequest) {
  const refus = await sansSession(req);
  if (refus) return refus;
  if (!origineValide(req)) return NextResponse.json({ erreur: 'requête refusée' }, { status: 403 });
  const c = await req.json().catch(() => ({}));
  if (c.endpoint) await desabonner(String(c.endpoint));
  return NextResponse.json({ ok: true });
}
