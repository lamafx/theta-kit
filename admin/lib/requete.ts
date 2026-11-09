import type { NextRequest } from 'next/server';

export function ip(req: NextRequest) {
  return (req.headers.get('x-real-ip') ?? req.headers.get('x-forwarded-for')?.split(',')[0] ?? 'inconnue').trim();
}

/**
 * Protection contre les requêtes venues d'un autre site : chaque appel de l'admin porte l'en-tête x-theta
 * (un autre site ne peut pas l'ajouter sans autorisation CORS), et l'origine, si présente, doit être l'admin
 * ou le site public qui le sert sous /admin.
 */
export function origineValide(req: NextRequest) {
  if (req.headers.get('x-theta') !== '1') return false;
  const origine = req.headers.get('origin');
  if (!origine) return true;
  const permises = new Set(
    [process.env.ADMIN_ORIGINES, 'https://theta-ml.vercel.app', req.nextUrl.origin]
      .filter(Boolean)
      .flatMap((s) => String(s).split(','))
      .map((s) => s.trim()),
  );
  return permises.has(origine) || /^http:\/\/localhost:\d+$/.test(origine);
}
