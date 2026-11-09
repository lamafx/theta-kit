import cles from '@/contenu/pdf-cles.json';
import { estParu, serie } from '@/lib/content';

// PDF des épisodes : disponibles seulement une fois l'épisode paru (décision de l'auteur du 2026-11-09 : aucun
// document à venir ne doit être lisible par un tiers). Chaque PDF est rangé dans public/pdf/<empreinte>/, un dossier
// impossible à deviner ; cette route vérifie la sortie, puis renvoie vers le fichier, servi tel quel par Vercel
// (pas de limite de taille de réponse). L'adresse publique reste /pdf/theta-NN.pdf.
export const dynamic = 'force-dynamic';

export async function GET(req: Request, { params }: { params: Promise<{ fichier: string }> }) {
  const { fichier } = await params;
  const m = /^theta-(\d{2})\.pdf$/.exec(fichier);
  const e = m ? serie.episodes.find((x) => x.n === m[1]) : undefined;
  const cle = m ? (cles as Record<string, string>)[m[1]] : undefined;
  if (!m || !e || !cle || !estParu(e)) return new Response('Introuvable', { status: 404 });
  return new Response(null, { status: 307, headers: { Location: new URL(`/pdf/${cle}/${fichier}`, req.url).toString(), 'Cache-Control': 'no-store' } });
}
