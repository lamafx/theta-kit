import Link from 'next/link';
import { cookies } from 'next/headers';
import { Carte, Entete, Pastille } from '@/components/Bloc';
import { BoutonGeste, GesteSensible } from '@/components/Geste';
import { IcPdf } from '@/components/Icones';
import { donnees, estPublie } from '@/lib/donnees';
import { B, dateLongue, relatif } from '@/lib/format';
import { githubActif, issuesOuvertes, tournees } from '@/lib/github';
import { COOKIE_SALLE, verifier } from '@/lib/session';
import { synthese } from '@/lib/synthese';
import EntreeSalle from './EntreeSalle';
import Reporter from './Reporter';

export const metadata = { title: 'Salle de publication' };

function resteSalle(jeton?: string) {
  try {
    const charge = JSON.parse(Buffer.from(jeton!.split('.')[0], 'base64url').toString('utf8'));
    return Math.max(0, Math.round((charge.exp * 1000 - Date.now()) / 60000));
  } catch {
    return 0;
  }
}

export default async function Salle() {
  const jar = await cookies();
  const jetonSalle = jar.get(COOKIE_SALLE)?.value;
  const ouverte = await verifier(jetonSalle, 'salle');
  const d = await donnees();
  if (d.indisponible) return null;
  const s = synthese(d);

  if (!ouverte) {
    return (
      <>
        <Entete sur="Espace réservé" titre={<>Salle de <em>publication</em></>} chapeau="Ici partent les gestes qui touchent LinkedIn et le calendrier. Ressaisissez votre mot de passe pour ouvrir la salle pendant 10 minutes." />
        <EntreeSalle />
      </>
    );
  }

  const [runs, runsAdmin, issues] = await Promise.all([
    githubActif() ? tournees(12, 'linkedin.yml').catch(() => []) : Promise.resolve([]),
    githubActif() ? tournees(8, 'admin.yml').catch(() => []) : Promise.resolve([]),
    githubActif() ? issuesOuvertes().catch(() => []) : Promise.resolve([]),
  ]);
  const aVenir = d.episodes.filter((e) => !estPublie(e) && e.date_prevue).sort((a, b) => a.date_prevue!.localeCompare(b.date_prevue!)).slice(0, 4);
  const publies = d.episodes.filter(estPublie).slice(-6).reverse();
  const autrePilote = d.publication.pilote === 'github' ? 'windows' : 'github';
  const fusion = [...runs, ...runsAdmin].sort((a, b) => b.cree_le.localeCompare(a.cree_le)).slice(0, 14);

  return (
    <>
      <Entete sur="Espace réservé" titre={<>Salle de <em>publication</em></>} />
      <p className="salle-bandeau" style={{ marginBottom: 18 }}>
        <b>Salle ouverte</b> · elle se referme dans {resteSalle(jetonSalle)} min. Chaque geste demande un récapitulatif, une phrase à taper et 10 secondes pour annuler.
      </p>

      <div className="grille">
        <Carte className="c12" titre="Posts à venir" droite={<span className="mono">pilote : {d.publication.pilote}</span>}>
          <ul className="lignes">
            {aVenir.map((e, i) => {
              const precedent = i > 0 ? aVenir[i - 1] : null;
              const suivant = aVenir[i + 1] ?? null;
              const recap = (
                <ul className="lignes">
                  <li><span className="discret">Épisode</span><span className="fin">Nº {e.n} · {e.titre}</span></li>
                  <li><span className="discret">Statut</span><span className="fin"><Pastille statut={e.statut} /></span></li>
                  <li><span className="discret">Date prévue</span><span className="fin">{dateLongue(e.date_prevue)}</span></li>
                  <li><span className="discret">Étapes</span><span className="fin">{e.a_refaire.length ? `${e.a_refaire.map((x) => x.etape).join(', ')} à refaire : la CLI refusera` : 'à jour'}</span></li>
                  <li><span className="discret">Ensuite</span><span className="fin">avance : {Math.max(0, s.relusAvance - (e.statut === 'relu' ? 1 : 0))} relus · labo {e.themes.join(', ') || '—'} ouvert</span></li>
                  {e.pdf ? <li><span className="discret">PDF</span><span className="fin"><a href={`${B}/api/fichier?chemin=${encodeURIComponent(e.pdf)}`} target="_blank" rel="noreferrer">ouvrir le PDF exact</a></span></li> : null}
                </ul>
              );
              return (
                <li key={e.n} style={{ flexWrap: 'wrap', alignItems: 'center' }}>
                  <span className="num">Nº {e.n}</span>
                  <span className="titre" style={{ minWidth: 180 }}>
                    <Link href={`/episodes/${e.n}`} style={{ color: 'var(--white)' }}>{e.titre}</Link>
                    <span className="petit discret" style={{ display: 'block' }}>{dateLongue(e.date_prevue)} · {relatif(e.date_prevue)}</span>
                  </span>
                  <span className="fin">
                    <Pastille statut={e.statut} />
                    {e.pdf ? <a className="btn btn-petit" href={`${B}/api/fichier?chemin=${encodeURIComponent(e.pdf)}`} target="_blank" rel="noreferrer"><IcPdf /> PDF</a> : null}
                    <Reporter n={e.n} titre={e.titre} actuelle={e.date_prevue!} avant={precedent?.date_prevue ?? null} apres={suivant?.date_prevue ?? null} />
                    <GesteSensible geste="publier" cible={e.n} classe="btn btn-petit btn-sensible" libelle="Publier maintenant" desactive={e.statut !== 'relu'} recapitulatif={recap} />
                  </span>
                </li>
              );
            })}
          </ul>
        </Carte>

        <Carte className="c6" titre="Tournée">
          <p style={{ marginTop: 0 }}>La tournée GitHub passe toutes les 5 minutes de 8 h à 11 h les jours de post et publie le post dû. Ces gestes la lancent tout de suite.</p>
          <div className="btns">
            <BoutonGeste geste="etat" libelle="État de la connexion" />
            <BoutonGeste geste="apercu" libelle="Aperçu du prochain post" />
          </div>
          <div className="btns" style={{ marginTop: 10 }}>
            <GesteSensible geste="tourner" classe="btn btn-sensible" recapitulatif={<p>Prochain post dû : {s.prochain ? `Nº ${s.prochain.n}, ${dateLongue(s.prochain.date_prevue)} (${relatif(s.prochain.date_prevue)})` : 'aucun'}.</p>} />
            <GesteSensible geste="essai" recapitulatif={<p>L’essai envoie le PDF du Nº 01 en post de test, visible de vos relations seulement, puis le supprime.</p>} />
          </div>
        </Carte>

        <Carte className={`c6${s.jetonJours !== null && s.jetonJours <= 14 ? ' alerte' : ''}`} titre="Pilote et jeton">
          <ul className="lignes">
            <li><span className="discret">Pilote</span><span className="fin"><span className="mono">{d.publication.pilote}</span>
              <GesteSensible geste="pilote" valeur={autrePilote} classe="btn btn-petit" libelle={`Passer à ${autrePilote}`} recapitulatif={<p>La tournée passera de <b>{d.publication.pilote}</b> à <b>{autrePilote}</b>. {autrePilote === 'windows' ? 'Le PC doit rester allumé, session ouverte, aux heures de post.' : 'La tâche Windows ne publiera plus rien.'}</p>} />
            </span></li>
            <li><span className="discret">Jeton LinkedIn</span><span className="fin">{d.publication.jeton_expire ? `expire le ${dateLongue(d.publication.jeton_expire, false)} (${s.jetonJours} j)` : 'date inconnue'}</span></li>
          </ul>
          <details className="repli">
            <summary>Renouveler le jeton (sur le PC)</summary>
            <ol className="liste-points">
              <li>Depuis serie-ml/ : <span className="mono">serie linkedin connecter</span> (le navigateur s’ouvre).</li>
              <li>Puis : <span className="mono">.venv\Scripts\python.exe outils\jeton-vers-github.py</span> (copie le jeton dans le secret GitHub et note la nouvelle date).</li>
            </ol>
          </details>
        </Carte>

        <Carte className="c6" titre="Posts publiés">
          {publies.length === 0 ? <p className="vide">Aucun post publié.</p> : (
            <ul className="lignes">
              {publies.map((e) => (
                <li key={e.n} style={{ flexWrap: 'wrap' }}>
                  <span className="num">Nº {e.n}</span>
                  <span className="titre">{e.titre}<span className="petit discret" style={{ display: 'block' }}>{dateLongue(e.publie_le, false)}</span></span>
                  <span className="fin">
                    {e.trace?.lien ? <a className="btn btn-petit" href={e.trace.lien} target="_blank" rel="noreferrer">LinkedIn</a> : null}
                    <GesteSensible geste="supprimer" cible={e.n} classe="btn btn-petit" libelle="Supprimer" recapitulatif={<p>Post du Nº {e.n} publié le {dateLongue(e.publie_le, false)}{e.trace?.lien ? <> : <a href={e.trace.lien} target="_blank" rel="noreferrer">voir</a></> : null}. Les réactions et commentaires seront perdus.</p>} />
                  </span>
                </li>
              ))}
            </ul>
          )}
        </Carte>

        <Carte className={`c6${issues.length ? ' alerte' : ''}`} titre={`Alertes ouvertes · ${issues.length}`}>
          {!githubActif() ? <p className="petit discret">Accès GitHub à configurer.</p> : issues.length === 0 ? <p className="vide">Aucune alerte.</p> : (
            <ul className="lignes">
              {issues.map((i) => (
                <li key={i.numero}><a className="titre" href={i.lien} target="_blank" rel="noreferrer" style={{ whiteSpace: 'normal' }}>{i.titre}</a><span className="fin mono petit discret">{relatif(i.cree_le)}</span></li>
              ))}
            </ul>
          )}
        </Carte>

        <Carte className="c12" titre="Dernières tournées">
          {!githubActif() ? <p className="petit discret">Accès GitHub de l’admin à configurer (ADMIN_GITHUB_TOKEN).</p> : (
            <div className="defile">
              <table className="tableau">
                <thead><tr><th>Tournée</th><th>Déclenchée</th><th>Résultat</th><th>Quand</th></tr></thead>
                <tbody>
                  {fusion.map((r) => (
                    <tr key={r.id}>
                      <td><a href={r.lien} target="_blank" rel="noreferrer">{r.titre}</a><span className="mono petit discret" style={{ display: 'block' }}>{r.workflow}</span></td>
                      <td className="petit">{r.evenement === 'schedule' ? 'automatique' : r.evenement === 'workflow_dispatch' ? 'à la main' : r.evenement}</td>
                      <td><Pastille statut={r.conclusion === 'success' ? 'ok' : r.conclusion ? 'alerte' : 'attente'}>{r.conclusion ?? r.statut}</Pastille></td>
                      <td className="mono petit">{relatif(r.cree_le)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Carte>

        <Carte className="c12" titre="Journal des gestes de l’admin">
          {d.publication.journal.length === 0 ? <p className="vide">Aucun geste enregistré.</p> : (
            <ul className="lignes">
              {[...d.publication.journal].reverse().slice(0, 25).map((g, i) => (
                <li key={i} style={{ flexWrap: 'wrap' }}>
                  <span className="mono petit discret" style={{ minWidth: 130 }}>{dateLongue(g.le)}</span>
                  <span className="titre" style={{ whiteSpace: 'normal' }}><b>{g.geste}</b>{g.cible ? ` ${g.cible}` : ''}{g.valeur ? <span className="discret"> · {g.valeur}</span> : null}</span>
                  <span className="fin">{g.resultat ? <Pastille statut={/^(ok|fait)/i.test(g.resultat) ? 'ok' : 'alerte'}>{g.resultat.slice(0, 60)}</Pastille> : null}{g.tournee ? <a className="petit" href={g.tournee} target="_blank" rel="noreferrer">tournée</a> : null}</span>
                </li>
              ))}
            </ul>
          )}
        </Carte>
      </div>
    </>
  );
}
