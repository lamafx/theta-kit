import Link from 'next/link';
import { Entete, Pastille } from '@/components/Bloc';
import { donnees, estPublie } from '@/lib/donnees';
import { dateCourte } from '@/lib/format';
import type { Episode } from '@/lib/types';

export const metadata = { title: 'Épisodes' };

const FILTRES: { cle: string; libelle: string; garde: (e: Episode) => boolean }[] = [
  { cle: 'tous', libelle: 'Tous', garde: () => true },
  { cle: 'a-relire', libelle: 'À relire', garde: (e) => e.statut === 'genere' || (e.statut === 'a_faire' && e.a_refaire.length > 0 && e.a_refaire.length < 9) },
  { cle: 'relus', libelle: 'Relus non publiés', garde: (e) => e.statut === 'relu' },
  { cle: 'publies', libelle: 'Publiés', garde: (e) => estPublie(e) },
  { cle: 'a-produire', libelle: 'À produire', garde: (e) => e.statut === 'a_faire' },
];

export default async function Episodes({ searchParams }: { searchParams: Promise<{ filtre?: string }> }) {
  const { filtre = 'tous' } = await searchParams;
  const d = await donnees();
  if (d.indisponible) return null;
  const f = FILTRES.find((x) => x.cle === filtre) ?? FILTRES[0];
  const eps = d.episodes.filter(f.garde);
  const saisons = [...new Set(eps.map((e) => e.saison))];
  const compte = (cle: string) => d.episodes.filter(FILTRES.find((x) => x.cle === cle)!.garde).length;
  const labosOk = new Map(d.labos.map((l) => [l.id, l]));

  return (
    <>
      <Entete
        sur="Série θ Théta"
        titre={<>Les <em>épisodes</em></>}
        chapeau={`${compte('publies')} publiés · ${compte('relus')} relus d’avance · ${compte('a-relire')} à relire · ${compte('a-produire')} à produire, sur ${d.episodes.length}.`}
      />
      <nav className="filtres" aria-label="Filtrer">
        {FILTRES.map((x) => (
          <Link key={x.cle} href={x.cle === 'tous' ? '/episodes' : `/episodes?filtre=${x.cle}`} aria-current={x.cle === f.cle ? 'true' : undefined}>
            {x.libelle} <span className="mono discret">{compte(x.cle)}</span>
          </Link>
        ))}
      </nav>
      {eps.length === 0 ? <p className="carte vide">Aucun épisode dans ce filtre.</p> : null}
      {saisons.map((s) => {
        const deS = eps.filter((e) => e.saison === s);
        const chapitres = [...new Set(deS.map((e) => e.chapitre.numero))];
        const bilan = d.bilans.find((b) => b.saison === s);
        return (
          <section key={s} style={{ marginBottom: 26 }}>
            <h2 className="sur" style={{ margin: '0 0 10px' }}>
              Saison {s}
            </h2>
            <div className="carte" style={{ padding: '6px 18px' }}>
              {chapitres.map((c) => (
                <div key={c}>
                  <p className="petit discret mono" style={{ margin: '14px 0 2px' }}>
                    Chapitre {c} · {deS.find((e) => e.chapitre.numero === c)?.chapitre.titre}
                  </p>
                  <div className="lignes">
                    {deS
                      .filter((e) => e.chapitre.numero === c)
                      .map((e) => (
                        <Link key={e.n} href={`/episodes/${e.n}`}>
                          <span className="num">{e.n}</span>
                          <span className="titre">{e.titre}</span>
                          <span className="fin">
                            {e.themes.map((t) => {
                              const l = labosOk.get(t);
                              return (
                                <span key={t} className="pastille p-neutre" title={`Labo ${t}`}>
                                  {t}
                                  {l ? (l.parcours && l.quiz ? ' ✓' : '') : ''}
                                </span>
                              );
                            })}
                            <span className="mono petit discret">{dateCourte(e.publie_le ?? e.date_prevue)}</span>
                            <Pastille statut={e.statut} />
                          </span>
                        </Link>
                      ))}
                  </div>
                </div>
              ))}
              {bilan && (f.cle === 'tous' || (f.cle === 'a-relire' && bilan.statut === 'genere')) ? (
                <div className="lignes" style={{ borderTop: '1px solid var(--ligne)', marginTop: 6 }}>
                  <Link href={`/episodes/${bilan.cle}`}>
                    <span className="num">B{s}</span>
                    <span className="titre">Bilan de la saison {s}</span>
                    <span className="fin">
                      <span className="mono petit discret">{dateCourte(bilan.publie_le ?? bilan.date_prevue)}</span>
                      <Pastille statut={bilan.statut} />
                    </span>
                  </Link>
                </div>
              ) : null}
            </div>
          </section>
        );
      })}
    </>
  );
}
