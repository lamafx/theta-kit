import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Carte, Entete, Pastille } from '@/components/Bloc';
import Carrousel from '@/components/Carrousel';
import { IcPdf, IcRetour } from '@/components/Icones';
import { donnees, estPublie, laboOuvert } from '@/lib/donnees';
import { B, dateLongue, relatif } from '@/lib/format';
import Relecture from './Relecture';
import Mesures from './Mesures';
import FicheBilan from './FicheBilan';
import ChangerStatut from './ChangerStatut';
import PasserRelu from './PasserRelu';

export const metadata = { title: 'Épisode' };

export default async function Fiche({ params }: { params: Promise<{ n: string }> }) {
  const { n } = await params;
  const d = await donnees();
  if (d.indisponible) return null;
  if (n.startsWith('bilan-')) {
    const b = d.bilans.find((x) => x.cle === n);
    if (!b) notFound();
    return <FicheBilan b={b} />;
  }
  const e = d.episodes.find((x) => x.n === n);
  if (!e) notFound();
  const decisions = d.decisions.filter((x) => e.decisions.includes(x.id) && x.choix?.statut !== 'tranchee');
  const labos = d.labos.filter((l) => e.themes.includes(l.id));
  const precedent = d.episodes[d.episodes.indexOf(e) - 1];
  const suivant = d.episodes[d.episodes.indexOf(e) + 1];
  const notesAdmin = e.corrections?.split(/^## Notes de relecture \(admin\)\s*$/m)[1]?.trim() ?? '';
  const peutValider = e.statut === 'genere';

  return (
    <>
      <p style={{ margin: '0 0 12px' }}>
        <Link href="/episodes" className="petit" style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
          <IcRetour /> Épisodes
        </Link>
      </p>
      <Entete
        sur={`Nº ${e.n} · Saison ${e.saison} · ${e.chapitre.titre}`}
        titre={e.titre}
        chapeau={e.accroche}
        droite={<Pastille statut={e.statut} />}
      />

      <div className="grille">
        <Carte
          className="c8"
          titre="Carrousel"
          droite={
            <span style={{ display: 'inline-flex', gap: 12, alignItems: 'center', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
              {e.pdf ? <a href={`${B}/api/fichier?chemin=${encodeURIComponent(e.pdf)}`} target="_blank" rel="noreferrer" style={{ display: 'inline-flex', gap: 6, alignItems: 'center' }}><IcPdf /> PDF</a> : null}
              {peutValider ? <PasserRelu n={e.n} aRefaire={e.a_refaire.map((x) => x.etape)} /> : null}
            </span>
          }
        >
          <Carrousel pages={e.pages} titre={`Nº ${e.n} · ${e.titre}`} />
        </Carte>

        <Carte className={`c4${e.a_refaire.length && e.statut !== 'a_faire' ? ' alerte' : ''}`} titre="Où en est-il">
          <ul className="lignes">
            <li>
              <span className="discret">Sortie</span>
              <span className="fin">{e.publie_le ? `publié le ${dateLongue(e.publie_le, false)}` : `${dateLongue(e.date_prevue)} · ${relatif(e.date_prevue)}`}</span>
            </li>
            <li>
              <span className="discret">Étapes</span>
              <span className="fin">{e.a_refaire.length ? e.a_refaire.map((x) => x.etape).join(', ') + ' à faire' : 'toutes à jour'}</span>
            </li>
            {labos.map((l) => (
              <li key={l.id}>
                <span className="discret">Labo</span>
                <span className="fin">
                  <Link href={`/labos/${l.id}`}>{l.id}</Link>
                  <Pastille statut={laboOuvert(l.date_ouverture, l.publie_le) ? 'ouvert' : 'neutre'}>{laboOuvert(l.date_ouverture, l.publie_le) ? 'ouvert' : 'fermé'}</Pastille>
                </span>
              </li>
            ))}
            {e.trace?.lien ? (
              <li>
                <span className="discret">LinkedIn</span>
                <span className="fin">
                  <a href={e.trace.lien} target="_blank" rel="noreferrer">voir le post</a>
                </span>
              </li>
            ) : null}
          </ul>
          {e.statut === 'a_faire' && e.a_refaire.some((x) => x.etape === 'relecture') ? (
            <p className="message" style={{ marginTop: 12 }}>
              La relecture du relecteur (Claude) n’est pas faite : lancez <span className="mono">/episode {e.n}</span> depuis serie-ml/. Vous pourrez valider ensuite.
            </p>
          ) : null}
        </Carte>

        <Carte className="c8" titre={e.post.provisoire ? 'Texte du post (provisoire, avant « serie publier »)' : 'Texte du post'}>
          {e.post.titre ? <p className="sur" style={{ color: 'var(--pale)' }}>{e.post.titre}</p> : null}
          {e.post.texte ? <pre className="post">{e.post.texte}</pre> : <p className="vide">Pas encore de texte.</p>}
          {e.post.commentaire ? (
            <>
              <h3 style={{ marginTop: 18 }}>Premier commentaire</h3>
              <pre className="post">{e.post.commentaire}</pre>
            </>
          ) : null}
        </Carte>

        <div className="c4" style={{ display: 'grid', gap: 16, alignContent: 'start' }}>
          {!estPublie(e) ? (
            <Carte titre="Votre relecture" className={peutValider ? 'mise' : ''}>
              <Relecture n={e.n} statut={e.statut} peutValider={peutValider} aRefaire={e.a_refaire.map((x) => x.etape)} decisionsOuvertes={decisions.length} />
            </Carte>
          ) : (
            <Carte titre="Chiffres LinkedIn">
              <Mesures n={e.n} mesures={e.mesures} publieLe={e.publie_le} />
            </Carte>
          )}

          <Carte titre="Statut">
            <ChangerStatut cle={e.n} nom={`Nº ${e.n}`} statut={e.statut} />
          </Carte>

          {e.verification ? (
            <Carte titre="Vérification automatique" className={e.verification.erreurs.length ? 'alerte' : ''}>
              <p style={{ margin: '0 0 8px' }}>{e.verification.resultat}</p>
              {e.verification.erreurs.length ? (
                <ul className="liste-points">
                  {e.verification.erreurs.map((x, i) => <li key={i}>{x}</li>)}
                </ul>
              ) : null}
              {e.verification.avertissements.length ? (
                <details className="repli">
                  <summary>{e.verification.avertissements.length} avertissement{e.verification.avertissements.length > 1 ? 's' : ''}</summary>
                  <ul className="liste-points">
                    {e.verification.avertissements.map((x, i) => <li key={i}>{x}</li>)}
                  </ul>
                </details>
              ) : null}
            </Carte>
          ) : null}

          {notesAdmin ? (
            <Carte titre="Vos notes « À corriger »" className="alerte">
              <pre className="post" style={{ fontSize: 14 }}>{notesAdmin}</pre>
              <p className="petit discret" style={{ margin: '8px 0 0' }}>
                À appliquer avec <span className="mono">/corriger {e.n}</span> depuis serie-ml/.
              </p>
            </Carte>
          ) : null}
        </div>

        {decisions.length ? (
          <Carte className="c12" titre={`Décisions de relecture en attente · ${decisions.length}`} droite={<Link href={`/decisions?episode=${e.n}`}>trancher</Link>}>
            <ul className="lignes">
              {decisions.map((x) => (
                <li key={x.id} style={{ alignItems: 'flex-start' }}>
                  <span className="num">{x.code}</span>
                  <span className="titre" style={{ whiteSpace: 'normal' }}>
                    {x.titre}
                    {x.recommandation ? <span className="petit discret" style={{ display: 'block', marginTop: 4 }}>Recommandé : {x.recommandation}</span> : null}
                  </span>
                </li>
              ))}
            </ul>
          </Carte>
        ) : null}
      </div>

      <nav className="btns" style={{ justifyContent: 'space-between', marginTop: 24 }}>
        {precedent ? <Link className="btn btn-petit" href={`/episodes/${precedent.n}`}>← Nº {precedent.n}</Link> : <span />}
        {suivant ? <Link className="btn btn-petit" href={`/episodes/${suivant.n}`}>Nº {suivant.n} →</Link> : null}
      </nav>
    </>
  );
}
