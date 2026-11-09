import Link from 'next/link';
import { Entete } from '@/components/Bloc';
import { donnees } from '@/lib/donnees';
import type { Decision } from '@/lib/types';
import Trancher from './Trancher';

export const metadata = { title: 'Décisions' };

const FAMILLES: { cle: Decision['famille']; titre: string; aide: string }[] = [
  { cle: 'relecture', titre: 'Relectures des épisodes', aide: 'Décisions D des rapports du relecteur (sortie/NN/relecture.md). La correction rédigée est dans le rapport ; une fois tranchées, elles s’appliquent avec /corriger.' },
  { cle: 'labos', titre: 'Conception des labos', aide: 'Décisions D1 à D10 de conception/labos-saison-1.txt.' },
  { cle: 'ambiguite', titre: 'Ambiguïtés ouvertes', aide: 'Entrées de AMBIGUITES.md encore ouvertes.' },
];

export default async function Decisions({ searchParams }: { searchParams: Promise<{ episode?: string; voir?: string }> }) {
  const { episode, voir } = await searchParams;
  const d = await donnees();
  if (d.indisponible) return null;
  const toutes = d.decisions.filter((x) => !episode || x.episode === episode);
  const ouvertes = toutes.filter((x) => x.choix?.statut !== 'tranchee');
  const liste = voir === 'tranchees' ? toutes.filter((x) => x.choix?.statut === 'tranchee') : ouvertes;
  const titreEp = (n?: string) => d.episodes.find((e) => e.n === n)?.titre ?? '';

  return (
    <>
      <Entete
        sur="À trancher"
        titre={<>Les <em>décisions</em></>}
        chapeau={`${ouvertes.length} en attente${episode ? ` pour le Nº ${episode}` : ''}. Vos choix sont enregistrés dans serie-ml/decisions.yaml.`}
      />
      <nav className="filtres">
        <Link href={episode ? `/decisions?episode=${episode}` : '/decisions'} aria-current={voir !== 'tranchees' ? 'true' : undefined}>En attente <span className="mono discret">{ouvertes.length}</span></Link>
        <Link href={`/decisions?voir=tranchees${episode ? `&episode=${episode}` : ''}`} aria-current={voir === 'tranchees' ? 'true' : undefined}>Tranchées <span className="mono discret">{toutes.length - ouvertes.length}</span></Link>
        {episode ? <Link href="/decisions">Tous les épisodes</Link> : null}
      </nav>
      {FAMILLES.map((f) => {
        const deF = liste.filter((x) => x.famille === f.cle);
        if (!deF.length) return null;
        const groupes = f.cle === 'relecture' ? [...new Set(deF.map((x) => x.episode))] : [undefined];
        return (
          <section key={f.cle} style={{ marginBottom: 28 }}>
            <h2 style={{ marginBottom: 4 }}>{f.titre} <span className="mono discret petit">{deF.length}</span></h2>
            <p className="petit discret" style={{ margin: '0 0 12px' }}>{f.aide}</p>
            {groupes.map((g) => (
              <div key={g ?? 'tout'} style={{ display: 'grid', gap: 12, marginBottom: 14 }}>
                {g ? <p className="sur" style={{ margin: '6px 0 0' }}><Link href={`/episodes/${g}`}>Nº {g} · {titreEp(g)}</Link></p> : null}
                {deF.filter((x) => x.episode === g).map((x) => (
                  <article key={x.id} className="carte" style={{ padding: 18 }}>
                    <p className="mono petit" style={{ margin: '0 0 6px', color: 'var(--pale-2)' }}>{x.code}</p>
                    <h3 style={{ fontWeight: 500, lineHeight: 1.4 }}>{x.titre}</h3>
                    {x.contexte ? <p className="discret" style={{ margin: '0 0 8px' }}>{x.contexte}</p> : null}
                    {x.options.length && x.famille === 'ambiguite' ? <p className="petit discret" style={{ margin: '0 0 8px' }}>Options : {x.options[0]}</p> : null}
                    {x.recommandation ? <p className="petit" style={{ margin: '0 0 10px', color: 'var(--bronze)' }}>Recommandé : {x.recommandation}</p> : null}
                    <Trancher decision={x} />
                  </article>
                ))}
              </div>
            ))}
          </section>
        );
      })}
      {!liste.length ? <p className="carte vide">Rien ici.</p> : null}
    </>
  );
}
