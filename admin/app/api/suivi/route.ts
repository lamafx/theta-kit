import { NextResponse, type NextRequest } from 'next/server';
import { sansSession } from '@/lib/garde';
import { messagesTournee, tourneeDuGeste } from '@/lib/github';

export const runtime = 'nodejs';

/** Où en est la tournée lancée par un geste : en attente, en cours, puis résultat et messages de la CLI. */
export async function GET(req: NextRequest) {
  const refus = await sansSession(req);
  if (refus) return refus;
  const p = req.nextUrl.searchParams;
  const workflow = p.get('workflow') ?? '';
  const jeton = p.get('jeton') ?? '';
  const depuis = p.get('depuis') ?? '';
  if (!['admin.yml', 'linkedin.yml'].includes(workflow) || !/^[0-9a-f]{8}$/.test(jeton) || !depuis) {
    return NextResponse.json({ erreur: 'paramètres invalides' }, { status: 400 });
  }
  try {
    const t = await tourneeDuGeste(workflow, jeton, depuis);
    if (!t) return NextResponse.json({ etat: 'en_attente' });
    const fini = t.statut === 'completed';
    const messages = fini ? await messagesTournee(t.id).catch(() => []) : [];
    return NextResponse.json({ etat: fini ? 'fini' : 'en_cours', conclusion: t.conclusion, lien: t.lien, messages });
  } catch (e) {
    return NextResponse.json({ etat: 'inconnu', erreur: (e as Error).message });
  }
}
