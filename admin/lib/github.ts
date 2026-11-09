import 'server-only';

// Accès GitHub de l'admin : un jeton « fine-grained » limité au dépôt theta-kit (variable ADMIN_GITHUB_TOKEN),
// avec Actions (lecture, écriture), Issues (lecture, écriture) et Contents (lecture, écriture).
// Il ne contient jamais le jeton LinkedIn : seuls les workflows ont ce secret.

export const DEPOT = process.env.ADMIN_GITHUB_DEPOT ?? 'lamafx/theta-kit';
export const BRANCHE = process.env.ADMIN_GITHUB_BRANCHE ?? 'main';
const API = 'https://api.github.com';

export const githubActif = () => !!process.env.ADMIN_GITHUB_TOKEN;

export class ErreurGithub extends Error {
  constructor(message: string, public statut = 0) {
    super(message);
  }
}

async function appel(chemin: string, init: RequestInit & { revalidate?: number; brut?: boolean } = {}) {
  const jeton = process.env.ADMIN_GITHUB_TOKEN;
  if (!jeton) throw new ErreurGithub('accès GitHub non configuré (ADMIN_GITHUB_TOKEN)');
  const { revalidate, brut, ...reste } = init;
  const r = await fetch(`${API}${chemin}`, {
    ...reste,
    headers: {
      Authorization: `Bearer ${jeton}`,
      Accept: brut ? 'application/vnd.github.raw+json' : 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
      'User-Agent': 'theta-admin',
      ...(reste.body ? { 'Content-Type': 'application/json' } : {}),
      ...(reste.headers ?? {}),
    },
    ...(revalidate !== undefined ? { next: { revalidate } } : { cache: 'no-store' }),
  });
  if (!r.ok) {
    let detail = '';
    try {
      detail = (await r.json()).message ?? '';
    } catch {}
    throw new ErreurGithub(`GitHub ${r.status}${detail ? ` : ${detail}` : ''}`, r.status);
  }
  return r;
}

const chemins = (p: string) => p.split('/').map(encodeURIComponent).join('/');

/** Contenu texte d'un fichier du dépôt, branche principale. */
export async function fichierGithub(chemin: string, revalidate = 30): Promise<string | null> {
  try {
    const r = await appel(`/repos/${DEPOT}/contents/${chemins(chemin)}?ref=${BRANCHE}`, { brut: true, revalidate });
    return await r.text();
  } catch (e) {
    if (e instanceof ErreurGithub && e.statut === 404) return null;
    throw e;
  }
}

/** Contenu et empreinte (blob) d'un fichier : sert à détecter une modification concurrente. */
export async function fichierAvecSha(chemin: string): Promise<{ contenu: string; sha: string } | null> {
  try {
    const r = await appel(`/repos/${DEPOT}/contents/${chemins(chemin)}?ref=${BRANCHE}`);
    const j = await r.json();
    return { contenu: Buffer.from(j.content ?? '', 'base64').toString('utf8'), sha: j.sha };
  } catch (e) {
    if (e instanceof ErreurGithub && e.statut === 404) return null;
    throw e;
  }
}

/** Lance un workflow (workflow_dispatch). */
export async function lancerWorkflow(workflow: string, inputs: Record<string, string>) {
  await appel(`/repos/${DEPOT}/actions/workflows/${workflow}/dispatches`, {
    method: 'POST',
    body: JSON.stringify({ ref: BRANCHE, inputs }),
  });
}

export type Tournee = {
  id: number;
  nom: string;
  titre: string;
  workflow: string;
  evenement: string;
  statut: string;
  conclusion: string | null;
  cree_le: string;
  maj_le: string;
  lien: string;
};

function tournee(r: any): Tournee {
  return {
    id: r.id,
    nom: r.name,
    titre: r.display_title,
    workflow: String(r.path ?? '').split('/').pop() ?? '',
    evenement: r.event,
    statut: r.status,
    conclusion: r.conclusion,
    cree_le: r.created_at,
    maj_le: r.updated_at,
    lien: r.html_url,
  };
}

export async function tournees(n = 15, workflow?: string): Promise<Tournee[]> {
  const base = workflow ? `/repos/${DEPOT}/actions/workflows/${workflow}/runs` : `/repos/${DEPOT}/actions/runs`;
  const r = await appel(`${base}?per_page=${n}`, { revalidate: 20 });
  return ((await r.json()).workflow_runs ?? []).map(tournee);
}

/** La tournée lancée par un geste : retrouvée par son jeton (dans son titre) ou, à défaut, par sa date. */
export async function tourneeDuGeste(workflow: string, jeton: string, depuis: string): Promise<Tournee | null> {
  const r = await appel(`/repos/${DEPOT}/actions/workflows/${workflow}/runs?event=workflow_dispatch&per_page=20&created=>=${encodeURIComponent(depuis.slice(0, 19))}Z`);
  const runs: Tournee[] = ((await r.json()).workflow_runs ?? []).map(tournee);
  const trouvee = runs.find((t) => t.titre.includes(jeton));
  if (trouvee) return trouvee;
  // Une tournée sans jeton dans son titre : la première lancée à la main après le geste.
  const sansJeton = runs.filter((t) => !/· [0-9a-z]{8}\b/.test(t.titre)).sort((a, b) => a.cree_le.localeCompare(b.cree_le));
  return sansJeton[0] ?? null;
}

/** Les messages laissés par une tournée (annotations ::notice / ::error). */
export async function messagesTournee(id: number): Promise<{ niveau: string; titre: string; message: string }[]> {
  const jobs = (await (await appel(`/repos/${DEPOT}/actions/runs/${id}/jobs`)).json()).jobs ?? [];
  const out: { niveau: string; titre: string; message: string }[] = [];
  for (const j of jobs) {
    const a = await (await appel(`/repos/${DEPOT}/check-runs/${j.id}/annotations`)).json();
    for (const x of a ?? []) out.push({ niveau: x.annotation_level, titre: x.title ?? '', message: x.message ?? '' });
  }
  return out;
}

export type Issue = { numero: number; titre: string; lien: string; cree_le: string; etiquettes: string[] };

export async function issuesOuvertes(): Promise<Issue[]> {
  const r = await appel(`/repos/${DEPOT}/issues?state=open&per_page=30`, { revalidate: 30 });
  return ((await r.json()) as any[])
    .filter((i) => !i.pull_request)
    .map((i) => ({ numero: i.number, titre: i.title, lien: i.html_url, cree_le: i.created_at, etiquettes: (i.labels ?? []).map((l: any) => l.name) }));
}

export async function ouvrirIssue(titre: string, corps: string, etiquettes: string[] = []) {
  const r = await appel(`/repos/${DEPOT}/issues`, { method: 'POST', body: JSON.stringify({ title: titre, body: corps, labels: etiquettes }) });
  return (await r.json()).html_url as string;
}

export type FichierACommiter = { chemin: string; contenu: string | Buffer; shaAttendu?: string | null };

/**
 * Un seul commit pour plusieurs fichiers (API Git). Refuse si un fichier a changé sur GitHub depuis
 * que l'auteur l'a ouvert (shaAttendu), pour ne jamais écraser une modification faite ailleurs.
 */
export async function commiter(fichiers: FichierACommiter[], message: string) {
  const ref = await (await appel(`/repos/${DEPOT}/git/ref/heads/${BRANCHE}`)).json();
  const parent = ref.object.sha;
  const commitParent = await (await appel(`/repos/${DEPOT}/git/commits/${parent}`)).json();
  for (const f of fichiers) {
    if (f.shaAttendu === undefined) continue;
    const actuel = await fichierAvecSha(f.chemin);
    const shaActuel = actuel?.sha ?? null;
    if (shaActuel !== f.shaAttendu) {
      throw new ErreurGithub(`${f.chemin} a changé sur GitHub depuis son ouverture : rechargez la page avant d'enregistrer.`, 409);
    }
  }
  const arbre = [];
  for (const f of fichiers) {
    const binaire = Buffer.isBuffer(f.contenu);
    const blob = await (
      await appel(`/repos/${DEPOT}/git/blobs`, {
        method: 'POST',
        body: JSON.stringify(binaire ? { content: (f.contenu as Buffer).toString('base64'), encoding: 'base64' } : { content: f.contenu, encoding: 'utf-8' }),
      })
    ).json();
    arbre.push({ path: f.chemin, mode: '100644', type: 'blob', sha: blob.sha });
  }
  const tree = await (await appel(`/repos/${DEPOT}/git/trees`, { method: 'POST', body: JSON.stringify({ base_tree: commitParent.tree.sha, tree: arbre }) })).json();
  const commit = await (await appel(`/repos/${DEPOT}/git/commits`, { method: 'POST', body: JSON.stringify({ message, tree: tree.sha, parents: [parent] }) })).json();
  // Avance rapide seulement : si la branche a bougé entre-temps, GitHub refuse et rien n'est écrasé.
  await appel(`/repos/${DEPOT}/git/refs/heads/${BRANCHE}`, { method: 'PATCH', body: JSON.stringify({ sha: commit.sha, force: false }) });
  return { sha: commit.sha as string, lien: commit.html_url as string };
}
