import crypto from 'node:crypto';
import { NextResponse, type NextRequest } from 'next/server';
import { notifier } from '@/lib/push';

export const runtime = 'nodejs';

/**
 * Appelée par les workflows GitHub (post publié, alerte de tournée, résultat d'un geste), avec le secret
 * ADMIN_NOTIF_SECRET (secret GitHub du même nom). Pas de session : c'est une machine qui appelle.
 */
export async function POST(req: NextRequest) {
  const secret = process.env.ADMIN_NOTIF_SECRET;
  const recu = req.headers.get('authorization')?.replace(/^Bearer /, '') ?? '';
  if (!secret || recu.length !== secret.length || !crypto.timingSafeEqual(Buffer.from(recu), Buffer.from(secret))) {
    return NextResponse.json({ erreur: 'non autorisé' }, { status: 401 });
  }
  const c = await req.json().catch(() => null);
  if (!c?.titre || !c?.texte) return NextResponse.json({ erreur: 'titre et texte requis' }, { status: 400 });
  const lien = typeof c.lien === 'string' && c.lien.startsWith('/admin') ? c.lien : '/admin/';
  const n = await notifier({ titre: String(c.titre).slice(0, 80), texte: String(c.texte).slice(0, 300), lien, tag: c.tag ? String(c.tag).slice(0, 40) : undefined });
  return NextResponse.json({ ok: true, envoyees: n });
}
