import { NextResponse, type NextRequest } from 'next/server';
import { COOKIE_SESSION, verifier } from '@/lib/session';

// Tout l'admin exige la session, sauf la page de connexion, les fichiers de la PWA, et deux routes
// appelées par des machines avec leur propre secret (notifications des workflows, tâche quotidienne).
const LIBRES = [/^\/connexion$/, /^\/api\/connexion$/, /^\/api\/notifier$/, /^\/api\/cron\//, /^\/manifest\.webmanifest$/, /^\/sw\.js$/, /^\/icones\//, /^\/hors-ligne$/];

export async function middleware(req: NextRequest) {
  const chemin = req.nextUrl.pathname;
  if (LIBRES.some((r) => r.test(chemin))) return NextResponse.next();
  const ok = await verifier(req.cookies.get(COOKIE_SESSION)?.value, 'session');
  if (ok) return NextResponse.next();
  if (chemin.startsWith('/api/')) return NextResponse.json({ erreur: 'session expirée : reconnectez-vous' }, { status: 401 });
  const url = req.nextUrl.clone();
  url.pathname = '/connexion';
  url.search = chemin === '/' ? '' : `?suite=${encodeURIComponent(chemin)}`;
  return NextResponse.redirect(url);
}

// La racine « / » est listée à part : avec basePath, le motif général ne la couvre pas.
export const config = { matcher: ['/', '/((?!_next/static|_next/image|favicon.ico).*)'] };
