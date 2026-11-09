import { NextResponse, type NextRequest } from 'next/server';
import { sansSession } from '@/lib/garde';
import { jetonApercu } from '@/lib/session';

const SITE = process.env.THETA_SITE_URL ?? 'https://theta-ml.vercel.app';

/** Aperçu d'un labo encore fermé : un lien signé, valable une heure, vers la page d'aperçu du site. */
export async function GET(req: NextRequest) {
  const refus = await sansSession(req);
  if (refus) return refus;
  const id = req.nextUrl.searchParams.get('id') ?? '';
  if (!/^[a-z0-9]{2,30}$/.test(id)) return NextResponse.json({ erreur: 'labo inconnu' }, { status: 400 });
  const lg = req.nextUrl.searchParams.get('lg') === 'en' ? 'en' : 'fr';
  const jeton = await jetonApercu(id);
  if (!jeton) return NextResponse.json({ erreur: 'aperçu non configuré (THETA_APERCU_SECRET)' }, { status: 503 });
  return NextResponse.redirect(`${SITE}/${lg}/apercu/${id}?j=${encodeURIComponent(jeton)}`, 302);
}
