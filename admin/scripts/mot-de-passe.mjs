// Génère le mot de passe de l'admin et les secrets à mettre sur Vercel.
//   node scripts/mot-de-passe.mjs            → mot de passe aléatoire
//   node scripts/mot-de-passe.mjs "mon mdp"  → empreinte d'un mot de passe choisi
// Affiche les variables d'environnement ; rien n'est écrit sur le disque.
import crypto from 'node:crypto';
import * as webpush from 'web-push';

const ALPHABET = 'abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789';
function aleatoire(n) {
  const o = crypto.randomBytes(n);
  return Array.from(o, (b) => ALPHABET[b % ALPHABET.length]).join('');
}

// Les options (« --json ») ne sont jamais prises pour un mot de passe choisi.
const choisi = process.argv.slice(2).find((a) => !a.startsWith('--'));
// Quatre groupes de 5 caractères : facile à recopier sur un téléphone, ~115 bits d'entropie.
const motDePasse = choisi ?? [0, 1, 2, 3].map(() => aleatoire(5)).join('-');
const N = 1 << 15, r = 8, p = 1;
const sel = crypto.randomBytes(16);
const empreinte = crypto.scryptSync(motDePasse.normalize('NFC'), sel, 32, { N, r, p, maxmem: 256 * 1024 * 1024 });
// Séparateur « : » et base64url : aucun « $ » que dotenv pourrait prendre pour une variable.
const hash = ['scrypt', N, r, p, sel.toString('base64url'), empreinte.toString('base64url')].join(':');
const vapid = webpush.generateVAPIDKeys();

const lignes = {
  ADMIN_MOT_DE_PASSE_HASH: hash,
  ADMIN_SECRET: crypto.randomBytes(32).toString('base64url'),
  THETA_APERCU_SECRET: crypto.randomBytes(32).toString('base64url'),
  ADMIN_NOTIF_SECRET: crypto.randomBytes(24).toString('base64url'),
  CRON_SECRET: crypto.randomBytes(24).toString('base64url'),
  NEXT_PUBLIC_VAPID_PUBLIC: vapid.publicKey,
  ADMIN_VAPID_PRIVE: vapid.privateKey,
};
if (process.argv.includes('--json')) {
  console.log(JSON.stringify({ motDePasse, ...lignes }));
} else {
  if (!choisi) console.log(`Mot de passe : ${motDePasse}\n`);
  for (const [k, v] of Object.entries(lignes)) console.log(`${k}=${v}`);
}
