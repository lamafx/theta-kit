// Sessions de l'admin : cookies signés (HMAC-SHA256), lisibles dans le middleware (Edge) comme dans les routes.
// Deux cookies : la session (30 jours) et la session de salle (10 minutes, après ressaisie du mot de passe).

export const COOKIE_SESSION = 'theta_admin';
export const COOKIE_SALLE = 'theta_salle';
export const DUREE_SESSION = 30 * 24 * 3600;
export const DUREE_SALLE = 10 * 60;

const enc = new TextEncoder();

function b64url(octets: ArrayBuffer | Uint8Array) {
  const u = octets instanceof Uint8Array ? octets : new Uint8Array(octets);
  let s = '';
  for (const b of u) s += String.fromCharCode(b);
  return btoa(s).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function deB64url(s: string) {
  const b = atob(s.replace(/-/g, '+').replace(/_/g, '/') + '==='.slice((s.length + 3) % 4));
  return Uint8Array.from(b, (c) => c.charCodeAt(0));
}

function secret() {
  const s = process.env.ADMIN_SECRET;
  if (!s || s.length < 32) return null;
  return s;
}

async function cle() {
  const s = secret();
  if (!s) throw new Error('ADMIN_SECRET absent ou trop court');
  return crypto.subtle.importKey('raw', enc.encode(s), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign', 'verify']);
}

/** Change ADMIN_VERSION_SESSION sur Vercel pour déconnecter tous les appareils. */
const version = () => process.env.ADMIN_VERSION_SESSION ?? '1';

export async function signer(genre: 'session' | 'salle', duree: number) {
  const charge = b64url(enc.encode(JSON.stringify({ g: genre, v: version(), exp: Math.floor(Date.now() / 1000) + duree })));
  const sig = b64url(await crypto.subtle.sign('HMAC', await cle(), enc.encode(charge)));
  return `${charge}.${sig}`;
}

export async function verifier(jeton: string | undefined | null, genre: 'session' | 'salle') {
  if (!jeton || !secret()) return false;
  const [charge, sig] = jeton.split('.');
  if (!charge || !sig) return false;
  try {
    const ok = await crypto.subtle.verify('HMAC', await cle(), deB64url(sig), enc.encode(charge));
    if (!ok) return false;
    const c = JSON.parse(new TextDecoder().decode(deB64url(charge)));
    return c.g === genre && c.v === version() && typeof c.exp === 'number' && c.exp > Date.now() / 1000;
  } catch {
    return false;
  }
}

export function optionsCookie(duree: number) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict' as const,
    path: '/admin',
    maxAge: duree,
  };
}

/** Jeton signé à durée courte pour l'aperçu d'un labo fermé sur le site (secret partagé THETA_APERCU_SECRET). */
export async function jetonApercu(theme: string, duree = 3600) {
  const s = process.env.THETA_APERCU_SECRET;
  if (!s || s.length < 32) return null;
  const k = await crypto.subtle.importKey('raw', enc.encode(s), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const exp = Math.floor(Date.now() / 1000) + duree;
  const sig = b64url(await crypto.subtle.sign('HMAC', k, enc.encode(`${theme}.${exp}`)));
  return `${exp}.${sig}`;
}
