import 'server-only';
import crypto from 'node:crypto';

// Format de ADMIN_MOT_DE_PASSE_HASH : scrypt:N:r:p:sel:empreinte (base64url), produit par
// `node scripts/mot-de-passe.mjs`. Le mot de passe en clair n'est jamais stocké.
export function verifierMotDePasse(saisi: string): boolean {
  const ref = process.env.ADMIN_MOT_DE_PASSE_HASH;
  if (!ref || typeof saisi !== 'string' || saisi.length > 200) return false;
  const [algo, N, r, p, sel, attendu] = ref.split(':');
  if (algo !== 'scrypt' || !sel || !attendu) return false;
  const voulu = Buffer.from(attendu, 'base64url');
  const calcule = crypto.scryptSync(saisi.normalize('NFC'), Buffer.from(sel, 'base64url'), voulu.length, {
    N: Number(N), r: Number(r), p: Number(p), maxmem: 256 * 1024 * 1024,
  });
  return calcule.length === voulu.length && crypto.timingSafeEqual(calcule, voulu);
}
