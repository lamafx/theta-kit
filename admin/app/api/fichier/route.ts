import fs from 'node:fs';
import path from 'node:path';
import { NextResponse, type NextRequest } from 'next/server';
import { sansSession } from '@/lib/garde';

export const runtime = 'nodejs';

const TYPES: Record<string, string> = {
  '.pdf': 'application/pdf',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.md': 'text/markdown; charset=utf-8',
};

/** Sert un fichier de l'instantané (PDF, pages du carrousel, CV, certificats), session exigée par le middleware. */
export async function GET(req: NextRequest) {
  const refus = await sansSession(req);
  if (refus) return refus;
  const chemin = req.nextUrl.searchParams.get('chemin') ?? '';
  const propre = path.posix.normalize(chemin);
  if (!/^(serie-ml|site\/theta-kit)\//.test(propre) || propre.includes('..') || !TYPES[path.extname(propre).toLowerCase()]) {
    return NextResponse.json({ erreur: 'chemin refusé' }, { status: 400 });
  }
  const abs = path.join(process.cwd(), '.instantane', 'fichiers', ...propre.split('/'));
  if (!fs.existsSync(abs)) return NextResponse.json({ erreur: 'fichier absent de l’instantané' }, { status: 404 });
  const octets = fs.readFileSync(abs);
  return new NextResponse(new Uint8Array(octets), {
    headers: {
      'Content-Type': TYPES[path.extname(propre).toLowerCase()],
      'Content-Length': String(octets.length),
      'Content-Disposition': `inline; filename="${path.basename(propre)}"`,
      'Cache-Control': 'private, max-age=300',
    },
  });
}
