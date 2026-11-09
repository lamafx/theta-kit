import 'server-only';
import * as webpush from 'web-push';
import { redis, redisActif } from './redis';

// Notifications de la PWA (Web Push, clés VAPID). Les abonnements des appareils sont gardés dans Redis.
const CLE = 'push:abonnements';

export const pushActif = () => !!(process.env.NEXT_PUBLIC_VAPID_PUBLIC && process.env.ADMIN_VAPID_PRIVE && redisActif());

function configurer() {
  webpush.setVapidDetails('mailto:admin@theta-ml.vercel.app', process.env.NEXT_PUBLIC_VAPID_PUBLIC!, process.env.ADMIN_VAPID_PRIVE!);
}

export async function abonner(abonnement: unknown) {
  await redis('SADD', CLE, JSON.stringify(abonnement));
}

export async function desabonner(endpoint: string) {
  const tous = (await redis<string[]>('SMEMBERS', CLE)) ?? [];
  for (const a of tous) if (JSON.parse(a).endpoint === endpoint) await redis('SREM', CLE, a);
}

export type Notification = { titre: string; texte: string; lien?: string; tag?: string };

/** Envoie à tous les appareils abonnés ; un abonnement expiré (404, 410) est retiré. */
export async function notifier(n: Notification): Promise<number> {
  if (!pushActif()) return 0;
  configurer();
  const tous = (await redis<string[]>('SMEMBERS', CLE)) ?? [];
  let ok = 0;
  await Promise.all(
    tous.map(async (a) => {
      try {
        await webpush.sendNotification(JSON.parse(a), JSON.stringify({ ...n, lien: n.lien ?? '/admin/' }), { TTL: 24 * 3600, urgency: 'normal' });
        ok++;
      } catch (e: any) {
        if (e?.statusCode === 404 || e?.statusCode === 410) await redis('SREM', CLE, a);
      }
    }),
  );
  return ok;
}

/** Une alerte donnée ne part qu'une fois par jour (clé de déduplication dans Redis). */
export async function notifierUneFois(cle: string, n: Notification, secondes = 20 * 3600) {
  if (!pushActif()) return 0;
  const pose = await redis('SET', `push:vu:${cle}`, '1', 'NX', 'EX', secondes);
  if (pose !== 'OK') return 0;
  return notifier({ ...n, tag: n.tag ?? cle });
}
