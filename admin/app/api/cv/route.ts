import { NextResponse, type NextRequest } from 'next/server';
import { sansSession } from '@/lib/garde';
import { instantane } from '@/lib/donnees';
import { commiter, ErreurGithub, fichierAvecSha, githubActif } from '@/lib/github';
import { texteDuPdf } from '@/lib/pdf';
import { origineValide } from '@/lib/requete';
import { telephones } from '@/lib/telephone';

export const runtime = 'nodejs';
export const maxDuration = 60;

const CHEMIN = 'site/theta-kit/public/cv/CV-Ladji-Lama-Kamagate-ML.pdf';
const MAX = 4 * 1024 * 1024;

/**
 * Remplace le CV public. Deux temps : « verifier » analyse le PDF (téléphone, texte lisible) sans rien écrire ;
 * « publier » refait l'analyse, puis commite le PDF sous le même nom (le lien du site ne change pas).
 */
export async function POST(req: NextRequest) {
  const refus = await sansSession(req);
  if (refus) return refus;
  if (!origineValide(req)) return NextResponse.json({ erreur: 'requête refusée' }, { status: 403 });
  const f = await req.formData();
  const fichier = f.get('cv');
  const mode = f.get('mode') === 'publier' ? 'publier' : 'verifier';
  const confirme = f.get('confirme') === '1';
  if (!(fichier instanceof File)) return NextResponse.json({ erreur: 'aucun fichier' }, { status: 400 });
  if (fichier.size > MAX) return NextResponse.json({ erreur: 'PDF trop lourd (4 Mo au plus).' }, { status: 400 });
  const octets = Buffer.from(await fichier.arrayBuffer());
  if (octets.subarray(0, 5).toString('latin1') !== '%PDF-') return NextResponse.json({ erreur: 'Ce fichier n’est pas un PDF.' }, { status: 400 });

  const { pages, brut, nbPages } = await texteDuPdf(octets);
  const numeros = telephones(`${pages}\n${brut}`);
  const lisible = pages.replace(/\s/g, '').length > 200;
  const analyse = { nbPages, lisible, numeros, taille: octets.length, extrait: pages.replace(/\s+/g, ' ').trim().slice(0, 240) };
  if (numeros.length) {
    return NextResponse.json({ ...analyse, erreur: `Refusé : numéro de téléphone trouvé (${numeros.join(', ')}). Le CV public ne doit jamais l’afficher, même dans une balise invisible.` }, { status: 422 });
  }
  if (mode === 'verifier') return NextResponse.json({ ...analyse, ok: true });
  if (!lisible && !confirme) {
    return NextResponse.json({ ...analyse, erreur: 'Texte illisible (vectorisé ?) : cochez « j’ai vérifié qu’il n’y a pas de téléphone ».' }, { status: 422 });
  }
  if (!githubActif()) return NextResponse.json({ erreur: 'Accès GitHub de l’admin non configuré (ADMIN_GITHUB_TOKEN).' }, { status: 503 });
  try {
    const actuel = await fichierAvecSha(CHEMIN);
    const attendu = instantane().cv?.sha ?? null;
    const c = await commiter(
      [{ chemin: CHEMIN, contenu: octets, shaAttendu: actuel?.sha === attendu ? attendu : actuel?.sha ?? null }],
      'Profil : nouveau CV public (déposé depuis l’admin, garde-fou téléphone passé)',
    );
    return NextResponse.json({ ...analyse, ok: true, commit: c.lien });
  } catch (e) {
    return NextResponse.json({ erreur: e instanceof ErreurGithub ? e.message : 'GitHub injoignable' }, { status: 502 });
  }
}
