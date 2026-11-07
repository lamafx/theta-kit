import { NextResponse } from 'next/server';
import { z } from 'zod';

const Demande = z.object({
  type: z.enum(['inscription', 'pdf']),
  email: z.string().email().max(160),
  prenom: z.string().max(60).optional(),
  interets: z.array(z.enum(['pdf', 'newsletter'])).optional(),
  episode: z.string().max(4).optional(),
  titre: z.string().max(200).optional(),
  newsletter: z.boolean().optional(),
  consentement: z.literal(true),
  source: z.string().max(40),
  locale: z.enum(['fr', 'en']).optional(),
  date: z.string().max(40),
});

// Limite en mémoire : 5 requêtes par 10 minutes et par adresse IP, par instance.
const FENETRE = 600_000;
const seaux = new Map<string, number[]>();
function limite(ip: string) {
  const t = Date.now();
  const recents = (seaux.get(ip) ?? []).filter((x) => t - x < FENETRE);
  recents.push(t);
  seaux.set(ip, recents);
  return recents.length > 5;
}

async function versBrevo(d: z.infer<typeof Demande>) {
  const cle = process.env.BREVO_API_KEY;
  if (!cle) return false;
  const veut = d.type === 'pdf' ? ['pdf', ...(d.newsletter ? ['newsletter'] : [])] : d.interets ?? [];
  const listIds = [
    veut.includes('pdf') ? Number(process.env.BREVO_LIST_PDF) : 0,
    veut.includes('newsletter') ? Number(process.env.BREVO_LIST_NEWSLETTER) : 0,
  ].filter(Boolean);
  const r = await fetch('https://api.brevo.com/v3/contacts', {
    method: 'POST',
    headers: { 'api-key': cle, 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: d.email, updateEnabled: true, listIds, attributes: { PRENOM: d.prenom ?? '', LANGUE: d.locale ?? 'fr', SOURCE: d.source } }),
  });
  return r.ok;
}

async function versWebhook(d: z.infer<typeof Demande>) {
  const url = process.env.FORM_ENDPOINT;
  if (!url) return false;
  const r = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(d) });
  return r.ok;
}

export async function POST(req: Request) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'inconnue';
  if (limite(ip)) return NextResponse.json({ ok: false, error: 'trop de demandes' }, { status: 429 });
  const corps = Demande.safeParse(await req.json().catch(() => null));
  if (!corps.success) return NextResponse.json({ ok: false, error: 'invalide' }, { status: 400 });
  const service = process.env.INSCRIPTION_PROVIDER;
  if (service !== 'brevo' && service !== 'webhook') return NextResponse.json({ ok: false, error: 'service non configuré' }, { status: 503 });
  const ok = service === 'brevo' ? await versBrevo(corps.data) : await versWebhook(corps.data);
  return ok ? NextResponse.json({ ok: true }) : NextResponse.json({ ok: false, error: 'envoi' }, { status: 502 });
}
