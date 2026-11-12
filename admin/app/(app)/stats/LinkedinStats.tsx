import Link from 'next/link';
import { Barres, Carte } from '@/components/Bloc';
import { NOMS_DEMOS, type CleDemo } from '@/lib/export-linkedin';
import { dateCourte, nombre } from '@/lib/format';
import type { Episode, PostLinkedin } from '@/lib/types';
import ImportLinkedIn from './ImportLinkedIn';

const ORDRE_DEMOS: CleDemo[] = ['poste', 'lieu', 'secteur', 'entreprise', 'anciennete', 'taille'];

const dernier = (p: PostLinkedin) => p.releves.at(-1)?.chiffres ?? {};
const interactions = (c: ReturnType<typeof dernier>) => c.interactions ?? (c.reactions ?? 0) + (c.commentaires ?? 0) + (c.partages ?? 0);
const moyenne = (v: number[]) => (v.length ? v.reduce((a, b) => a + b, 0) / v.length : null);
const pct = (v: number | null) => (v === null ? '—' : `${v.toFixed(1).replace('.', ',')} %`);

/** Démographie de tous les posts, chaque post pesant ses membres atteints (les parts de LinkedIn sont par post). */
function demographie(posts: PostLinkedin[], cle: CleDemo): [string, number][] {
  const somme = new Map<string, number>();
  let poids = 0;
  for (const p of posts) {
    const lignes = p.demographie?.[cle];
    if (!lignes?.length) continue;
    const w = dernier(p).membres_atteints ?? dernier(p).impressions ?? 1;
    poids += w;
    for (const [v, part] of lignes) somme.set(v, (somme.get(v) ?? 0) + part * w);
  }
  if (!poids) return [];
  return [...somme.entries()].map(([v, s]) => [v, s / poids] as [string, number]).sort((a, b) => b[1] - a[1]).slice(0, 8);
}

export default function LinkedinStats({ posts, episodes }: { posts: PostLinkedin[]; episodes: Episode[] }) {
  const titre = (cle: string | null) => (cle ? episodes.find((e) => e.n === cle)?.titre ?? cle : null);
  const serie = posts.filter((p) => p.episode);
  const avant = posts.filter((p) => !p.episode);
  const moyImp = (l: PostLinkedin[]) => moyenne(l.map((p) => dernier(p).impressions ?? 0));
  const taux = (l: PostLinkedin[]) => moyenne(l.filter((p) => dernier(p).impressions).map((p) => (interactions(dernier(p)) / dernier(p).impressions!) * 100));
  const abonnes = serie.reduce((t, p) => t + (dernier(p).abonnes ?? 0), 0);
  const avecDemo = posts.filter((p) => p.demographie && Object.keys(p.demographie).length);
  const auto = posts.some((p) => p.releves.some((r) => (r as { source?: string }).source === 'api'));

  return (
    <>
      <Carte className="c3" titre="Impressions par post Théta">
        <p className="chiffre">{nombre(moyImp(serie) === null ? null : Math.round(moyImp(serie)!))}</p>
        <p className="petit discret">{serie.length} post{serie.length > 1 ? 's' : ''} de la série</p>
      </Carte>
      <Carte className="c3" titre="Avant la série">
        <p className="chiffre">{nombre(moyImp(avant) === null ? null : Math.round(moyImp(avant)!))}</p>
        <p className="petit discret">impressions par post, {avant.length} post{avant.length > 1 ? 's' : ''}</p>
      </Carte>
      <Carte className="c3" titre="Taux d’interaction">
        <p className="chiffre">{pct(taux(serie))}</p>
        <p className="petit discret">série · avant : {pct(taux(avant))}</p>
      </Carte>
      <Carte className="c3" titre="Abonnés gagnés">
        <p className="chiffre">{nombre(serie.length ? abonnes : null)}</p>
        <p className="petit discret">par les posts de la série</p>
      </Carte>

      <Carte className="c12" titre="LinkedIn · chaque post" droite={<span className="petit discret">{auto ? 'relevé chaque matin' : 'relevé automatique à activer'}</span>}>
        {posts.length === 0 ? <p className="vide">Aucun relevé pour l’instant.</p> : (
          <div className="defile">
            <table className="tableau">
              <thead><tr><th>Publié</th><th>Post</th><th>Impressions</th><th>Membres atteints</th><th>Réactions</th><th>Commentaires</th><th>Republications</th><th>Interaction</th><th>Abonnés</th><th>Relevé</th></tr></thead>
              <tbody>
                {posts.map((p) => {
                  const c = dernier(p);
                  return (
                    <tr key={p.id}>
                      <td className="mono petit">{dateCourte(p.publie_le)}</td>
                      <td>
                        {p.episode && !p.episode.startsWith('bilan-') ? <Link href={`/episodes/${p.episode}`}>Nº {p.episode} · {titre(p.episode)}</Link>
                          : p.episode ? <Link href={`/episodes/${p.episode}`}>{p.episode}</Link>
                          : <a href={p.url} target="_blank" rel="noreferrer" className="discret">hors série</a>}
                      </td>
                      <td className="mono">{nombre(c.impressions)}</td>
                      <td className="mono">{nombre(c.membres_atteints)}</td>
                      <td className="mono">{nombre(c.reactions)}</td>
                      <td className="mono">{nombre(c.commentaires)}</td>
                      <td className="mono">{nombre(c.partages)}</td>
                      <td className="mono">{c.impressions ? pct((interactions(c) / c.impressions) * 100) : '—'}</td>
                      <td className="mono">{nombre(c.abonnes)}</td>
                      <td className="mono petit discret">{dateCourte(p.releves.at(-1)?.releve_le)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
        {!auto ? (
          <p className="message" style={{ margin: '12px 0 0' }}>
            Relevé automatique prêt : il part chaque matin à 7 h dès que l’application LinkedIn a la permission de lire les statistiques
            (produit « Community Management API », puis <span className="mono">serie linkedin connecter --stats</span> et <span className="mono">outils/jeton-vers-github.py</span>, une seule fois).
          </p>
        ) : null}
      </Carte>

      {avecDemo.length ? ORDRE_DEMOS.map((k) => {
        const lignes = demographie(avecDemo, k);
        return lignes.length ? (
          <Carte key={k} className="c4" titre={`Qui vous lit · ${NOMS_DEMOS[k]}`}>
            <Barres lignes={lignes} total={Math.max(...lignes.map((l) => l[1]))} suffixe=" %" />
          </Carte>
        ) : null;
      }) : null}

      <Carte className="c12" titre="Secours">
        <details className="repli">
          <summary>Importer un export LinkedIn (.xlsx) à la place du relevé automatique</summary>
          <div style={{ marginTop: 12 }}><ImportLinkedIn /></div>
          <p className="petit discret" style={{ margin: '10px 0 0' }}>L’export ajoute la démographie des lecteurs (postes, lieux, entreprises), que l’API ne donne pas pour un profil personnel.</p>
        </details>
      </Carte>
    </>
  );
}
