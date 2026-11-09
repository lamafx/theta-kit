import 'server-only';

// Base clé-valeur Upstash Redis (place de marché Vercel), par son API REST : compteur de visites,
// abonnements aux notifications, limites d'essais. Sans configuration, tout se dégrade sans erreur.
const URL_ = () => process.env.KV_REST_API_URL ?? process.env.UPSTASH_REDIS_REST_URL;
const JETON = () => process.env.KV_REST_API_TOKEN ?? process.env.UPSTASH_REDIS_REST_TOKEN;

export const redisActif = () => !!(URL_() && JETON());

export async function redis<T = any>(...commande: (string | number)[]): Promise<T | null> {
  if (!redisActif()) return null;
  const r = await fetch(URL_()!, {
    method: 'POST',
    headers: { Authorization: `Bearer ${JETON()}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(commande),
    cache: 'no-store',
  });
  if (!r.ok) throw new Error(`Redis ${r.status}`);
  return (await r.json()).result as T;
}

/** Plusieurs commandes en un aller-retour. */
export async function pipeline(commandes: (string | number)[][]): Promise<any[] | null> {
  if (!redisActif() || !commandes.length) return null;
  const r = await fetch(`${URL_()}/pipeline`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${JETON()}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(commandes),
    cache: 'no-store',
  });
  if (!r.ok) throw new Error(`Redis ${r.status}`);
  return ((await r.json()) as { result: any }[]).map((x) => x.result);
}

/** Limite d'essais : `max` par fenêtre de `secondes`. Renvoie true si la limite est dépassée. */
const memoire = new Map<string, number[]>();
export async function limiteDepassee(cle: string, max: number, secondes: number) {
  if (redisActif()) {
    try {
      const n = await redis<number>('INCR', `limite:${cle}`);
      if (n === 1) await redis('EXPIRE', `limite:${cle}`, secondes);
      return (n ?? 0) > max;
    } catch {}
  }
  const t = Date.now();
  const recents = (memoire.get(cle) ?? []).filter((x) => t - x < secondes * 1000);
  recents.push(t);
  memoire.set(cle, recents);
  return recents.length > max;
}
