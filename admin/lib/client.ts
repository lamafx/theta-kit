'use client';

/** Appel d'une route de l'admin depuis le navigateur (en-tête x-theta, erreurs lisibles). */
export async function api<T = any>(chemin: string, init: { method?: string; corps?: unknown; formulaire?: FormData } = {}): Promise<T> {
  if (typeof navigator !== 'undefined' && !navigator.onLine) throw new Error('Hors ligne : aucun geste ne part sans réseau.');
  const r = await fetch(`/admin/api/${chemin}`, {
    method: init.method ?? (init.corps || init.formulaire ? 'POST' : 'GET'),
    headers: { 'x-theta': '1', ...(init.corps ? { 'Content-Type': 'application/json' } : {}) },
    body: init.formulaire ?? (init.corps ? JSON.stringify(init.corps) : undefined),
    credentials: 'same-origin',
    cache: 'no-store',
  });
  let j: any = null;
  try {
    j = await r.json();
  } catch {}
  if (r.status === 401 && chemin !== 'connexion') {
    location.href = `/admin/connexion?suite=${encodeURIComponent(location.pathname.replace(/^\/admin/, '') || '/')}`;
  }
  if (!r.ok) throw new Error(j?.erreur ?? `erreur ${r.status}`);
  return j as T;
}
