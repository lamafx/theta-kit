import 'server-only';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { NextResponse, type NextRequest } from 'next/server';
import { COOKIE_SESSION, verifier } from './session';

// Deuxième barrière, en plus du middleware : chaque page et chaque route vérifient elles-mêmes la session.

/** Pour une route : une réponse 401 si la session manque, sinon null. */
export async function sansSession(req: NextRequest) {
  if (await verifier(req.cookies.get(COOKIE_SESSION)?.value, 'session')) return null;
  return NextResponse.json({ erreur: 'session expirée : reconnectez-vous' }, { status: 401 });
}

/** Pour une page : renvoie vers la connexion si la session manque. */
export async function exigerSession() {
  const jar = await cookies();
  if (!(await verifier(jar.get(COOKIE_SESSION)?.value, 'session'))) redirect('/connexion');
}
