import crypto from 'node:crypto';
import { NextResponse, type NextRequest } from 'next/server';

// Compteur maison, sans cookie (décision de l'auteur du 2026-11-09, conception/espace-admin.txt, 3.4).
// Base Upstash Redis (place de marché Vercel). L'adresse IP n'est jamais stockée : un visiteur est compté une fois
// par jour par une empreinte (IP + navigateur + sel du jour) ; le sel expire le lendemain. Lu par l'admin.
export const runtime = 'nodejs';

const URL_ = process.env.KV_REST_API_URL ?? process.env.UPSTASH_REDIS_REST_URL;
const JETON = process.env.KV_REST_API_TOKEN ?? process.env.UPSTASH_REDIS_REST_TOKEN;
const DUREE = 400 * 86400;
const ROBOTS = /bot|crawl|spider|slurp|preview|facebookexternalhit|linkedinbot|embedly|headless|lighthouse|pingdom|monitor/i;
const LABO = /^[a-z0-9]{2,30}$/;

async function pipeline(cmds: (string | number)[][]) {
  const r = await fetch(`${URL_}/pipeline`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${JETON}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(cmds),
    cache: 'no-store',
  });
  if (!r.ok) throw new Error(`Redis ${r.status}`);
  return (await r.json()) as { result: unknown }[];
}

function source(referent: string, hote: string) {
  if (!referent) return 'direct';
  let h = '';
  try {
    h = new URL(referent).hostname.replace(/^www\./, '');
  } catch {
    return 'direct';
  }
  if (h === hote) return null;
  if (/(^|\.)linkedin\.com$|^lnkd\.in$/.test(h)) return 'linkedin';
  if (/(^|\.)(google|bing|duckduckgo|yahoo|ecosia|qwant|yandex|baidu)\./.test(h)) return 'recherche';
  if (/(^|\.)github\.(com|io)$/.test(h)) return 'github';
  if (/(^|\.)(facebook|instagram|x|twitter|whatsapp|t|telegram|reddit|youtube)\.(com|co|me|org)$/.test(h)) return 'social';
  return 'autre';
}

function appareil(ua: string) {
  if (/ipad|tablet|(android(?!.*mobile))/i.test(ua)) return 'tablette';
  if (/mobi|iphone|android/i.test(ua)) return 'mobile';
  return 'ordinateur';
}

/** Chemin gardé : /fr, /en, puis au plus deux segments connus (labo/cout, episodes/05…). */
function cheminPropre(p: string) {
  const m = /^\/(fr|en)(\/(episodes|labo|voyage|profil|confidentialite|mentions-legales)(\/[a-z0-9-]{1,30})?)?\/?$/.exec(p);
  return m ? m[0].replace(/\/$/, '') || '/' : null;
}

export async function POST(req: NextRequest) {
  if (!URL_ || !JETON) return new NextResponse(null, { status: 204 });
  const ua = req.headers.get('user-agent') ?? '';
  if (ROBOTS.test(ua) || req.headers.get('dnt') === '1' || req.headers.get('sec-gpc') === '1') return new NextResponse(null, { status: 204 });
  let c: any;
  try {
    c = JSON.parse(await req.text());
  } catch {
    return new NextResponse(null, { status: 400 });
  }
  const jour = new Date().toISOString().slice(0, 10);
  const cmds: (string | number)[][] = [];
  const incr = (cle: string, champ: string, n = 1) => cmds.push(['HINCRBY', `${cle}:${jour}`, champ, n], ['EXPIRE', `${cle}:${jour}`, DUREE]);

  if (c?.t === 'page') {
    const chemin = cheminPropre(String(c.p ?? ''));
    if (!chemin) return new NextResponse(null, { status: 204 });
    incr('pv', '_total');
    incr('pv', chemin);
    if (c.premiere) {
      const s = source(String(c.r ?? '').slice(0, 300), req.nextUrl.hostname.replace(/^www\./, ''));
      if (s) incr('src', s);
      incr('app', appareil(ua));
      incr('lg', chemin.startsWith('/en') ? 'en' : 'fr');
      const pays = (req.headers.get('x-vercel-ip-country') ?? '').toUpperCase();
      if (/^[A-Z]{2}$/.test(pays)) incr('pays', pays);
    }
    // Visiteur unique du jour : empreinte jetable, jamais l'adresse IP elle-même.
    const ip = (req.headers.get('x-real-ip') ?? req.headers.get('x-forwarded-for')?.split(',')[0] ?? '').trim();
    const [sel] = await pipeline([['SET', `sel:${jour}`, crypto.randomBytes(16).toString('hex'), 'NX', 'EX', 2 * 86400], ['GET', `sel:${jour}`]]).then((r) => [r[1]?.result as string]);
    const empreinte = crypto.createHash('sha256').update(`${sel}|${ip}|${ua}`).digest('hex').slice(0, 20);
    cmds.push(['PFADD', `uv:${jour}`, empreinte], ['EXPIRE', `uv:${jour}`, DUREE]);
  } else if (c?.t === 'labo' && LABO.test(String(c.id ?? ''))) {
    const id = String(c.id);
    if (c.e === 'ouvert') incr('lab', `${id}|ouvert`);
    else if (c.e === 'etape' && Number.isInteger(c.k) && c.k >= 0 && c.k < 30) incr('lab', `${id}|etape|${c.k}`);
    else if (c.e === 'quiz') {
      incr('lab', `${id}|quiz`);
      if (c.essai === 1) incr('lab', `${id}|quiz1`);
    } else if (c.e === 'temps' && Number.isFinite(c.s) && c.s > 2) incr('lab', `${id}|sec`, Math.min(1800, Math.round(c.s)));
    else return new NextResponse(null, { status: 204 });
  } else {
    return new NextResponse(null, { status: 204 });
  }
  try {
    await pipeline(cmds);
  } catch {}
  return new NextResponse(null, { status: 204 });
}
