import { NextResponse, type NextRequest } from 'next/server';
import { sansSession } from '@/lib/garde';
import { instantane } from '@/lib/donnees';
import { commiter, ErreurGithub, fichierAvecSha, githubActif, ouvrirIssue, type FichierACommiter } from '@/lib/github';
import { origineValide } from '@/lib/requete';
import { cheminProfil, FICHIERS_PROFIL, SCHEMAS, type FichierProfilCle } from '@/lib/schemas-profil';
import { telephonesJson } from '@/lib/telephone';

export const runtime = 'nodejs';

const estFichier = (f: unknown): f is FichierProfilCle => FICHIERS_PROFIL.includes(f as FichierProfilCle);

/** Contenu actuel d'un fichier du profil : sur GitHub si l'accès est configuré, sinon l'instantané. */
export async function GET(req: NextRequest) {
  const refus = await sansSession(req);
  if (refus) return refus;
  const f = req.nextUrl.searchParams.get('fichier');
  if (!estFichier(f)) return NextResponse.json({ erreur: 'fichier inconnu' }, { status: 400 });
  if (githubActif()) {
    try {
      const r = await fichierAvecSha(cheminProfil(f));
      if (r) return NextResponse.json({ contenu: JSON.parse(r.contenu), sha: r.sha, source: 'github' });
      if (f === 'sections') return NextResponse.json({ contenu: { ordre: [], masquees: [] }, sha: null, source: 'github' });
    } catch {}
  }
  const p = instantane().profil?.[f];
  return NextResponse.json({ contenu: p?.contenu ?? (f === 'sections' ? { ordre: [], masquees: [] } : null), sha: p?.sha ?? null, source: 'instantane' });
}

// Champs dont un changement doit être reporté dans serie-ml/theta-post/editorial/ligne_editoriale.md, section 6.
function faitsIdentite(f: FichierProfilCle, avant: any, apres: any): string[] {
  const diff = (a: unknown, b: unknown) => JSON.stringify(a) !== JSON.stringify(b);
  if (f === 'profil') return ['titre', 'statut', 'accroche', 'en_une_phrase', 'compteurs'].filter((k) => diff(avant?.[k], apres?.[k]));
  if (f === 'parcours' && diff(avant, apres)) return ['parcours (diplômes, expériences)'];
  if (f === 'certificats' && diff(avant, apres)) return ['certificats et distinctions'];
  return [];
}

type Depot = { nom: string; base64: string };

export async function POST(req: NextRequest) {
  const refus = await sansSession(req);
  if (refus) return refus;
  if (!origineValide(req)) return NextResponse.json({ erreur: 'requête refusée' }, { status: 403 });
  if (!githubActif()) return NextResponse.json({ erreur: 'Accès GitHub de l’admin non configuré (ADMIN_GITHUB_TOKEN).' }, { status: 503 });
  let c: { fichier?: string; contenu?: unknown; sha?: string | null; depots?: Depot[] };
  try {
    c = await req.json();
  } catch {
    return NextResponse.json({ erreur: 'requête illisible (fichiers trop lourds ?)' }, { status: 400 });
  }
  if (!estFichier(c.fichier)) return NextResponse.json({ erreur: 'fichier inconnu' }, { status: 400 });
  const f = c.fichier;
  const v = SCHEMAS[f].safeParse(c.contenu);
  if (!v.success) {
    const i = v.error.issues[0];
    return NextResponse.json({ erreur: `Structure refusée : ${i.path.join('.') || 'racine'} · ${i.message}` }, { status: 422 });
  }
  const tels = telephonesJson(c.contenu);
  if (tels.length) return NextResponse.json({ erreur: `Refusé : numéro de téléphone dans ${tels.map((t) => t.chemin).join(', ')}. Il ne doit jamais apparaître sur le site.` }, { status: 422 });

  const fichiers: FichierACommiter[] = [{ chemin: cheminProfil(f), contenu: JSON.stringify(c.contenu, null, 2) + '\n', shaAttendu: c.sha ?? null }];
  for (const d of c.depots ?? []) {
    if (!/^[a-z0-9][a-z0-9-]{1,80}\.(jpg|jpeg|png|webp|pdf)$/.test(d.nom)) return NextResponse.json({ erreur: `nom de fichier refusé : ${d.nom}` }, { status: 400 });
    const octets = Buffer.from(d.base64, 'base64');
    if (octets.length > 3 * 1024 * 1024) return NextResponse.json({ erreur: `${d.nom} : 3 Mo au plus` }, { status: 400 });
    fichiers.push({ chemin: `site/theta-kit/public/certificats/${d.nom}`, contenu: octets });
  }

  let avant: unknown = instantane().profil?.[f]?.contenu;
  try {
    const actuel = await fichierAvecSha(cheminProfil(f));
    if (actuel) avant = JSON.parse(actuel.contenu);
  } catch {}
  try {
    const r = await commiter(fichiers, `Profil : ${f}.json modifié depuis l’admin${fichiers.length > 1 ? ` (+ ${fichiers.length - 1} fichier${fichiers.length > 2 ? 's' : ''})` : ''}`);
    const faits = faitsIdentite(f, avant, c.contenu);
    let issue: string | null = null;
    if (faits.length) {
      issue = await ouvrirIssue(
        'Profil : à reporter dans ligne_editoriale.md §6',
        `Modifié depuis l’admin : ${faits.join(', ')} (${f}.json).\n\nLe §6 de serie-ml/theta-post/editorial/ligne_editoriale.md décrit les faits de l’auteur que les posts utilisent. serie-ml fait foi : il n’est jamais réécrit automatiquement. Reportez-y le changement si les posts doivent en tenir compte, puis fermez cette issue.\n\nCommit : ${r.lien}`,
        ['profil'],
      ).catch(() => null);
    }
    return NextResponse.json({ ok: true, commit: r.lien, sha: null, alerte6: faits.length ? faits : null, issue });
  } catch (e) {
    return NextResponse.json({ erreur: e instanceof ErreurGithub ? e.message : 'GitHub injoignable' }, { status: e instanceof ErreurGithub && e.statut === 409 ? 409 : 502 });
  }
}
