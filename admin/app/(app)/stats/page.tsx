import Link from 'next/link';
import { Barres, Carte, Entete } from '@/components/Bloc';
import { audience, inscrits } from '@/lib/audience';
import { donnees, estPublie } from '@/lib/donnees';
import { dateCourte, nombre } from '@/lib/format';

export const metadata = { title: 'Statistiques' };

const PERIODES = [
  { cle: '7', libelle: '7 jours', n: 7 },
  { cle: '30', libelle: '30 jours', n: 30 },
  { cle: 'tout', libelle: 'Depuis le lancement', n: 0 },
];

const SOURCES: Record<string, string> = { linkedin: 'LinkedIn', recherche: 'Moteurs de recherche', direct: 'Accès direct', github: 'GitHub', autre: 'Autres sites', social: 'Autres réseaux' };
const PAYS: Record<string, string> = { CI: 'Côte d’Ivoire', FR: 'France', SN: 'Sénégal', CM: 'Cameroun', BF: 'Burkina Faso', ML: 'Mali', BJ: 'Bénin', TG: 'Togo', GN: 'Guinée', CA: 'Canada', US: 'États-Unis', BE: 'Belgique', MA: 'Maroc', GH: 'Ghana', NG: 'Nigeria' };

export default async function Stats({ searchParams }: { searchParams: Promise<{ periode?: string }> }) {
  const { periode = '7' } = await searchParams;
  const d = await donnees();
  if (d.indisponible) return null;
  const p = PERIODES.find((x) => x.cle === periode) ?? PERIODES[0];
  const lancement = d.calendrier.lancement ? new Date(`${d.calendrier.lancement}T00:00:00Z`) : new Date();
  const n = p.n || Math.max(1, Math.min(400, Math.ceil((Date.now() - lancement.getTime()) / 86400000) + 1));
  const [aud, nbInscrits] = await Promise.all([audience(n).catch(() => null), inscrits()]);
  const publies = d.episodes.filter(estPublie);
  const maxJour = aud ? Math.max(1, ...aud.parJour.map((j) => j.visiteurs)) : 1;
  const nomLabo = (id: string) => d.labos.find((l) => l.id === id)?.titre ?? id;

  return (
    <>
      <Entete sur="Audience" titre={<>Les <em>statistiques</em></>} chapeau="Visites du site et des labos (compteur maison, sans cookie), inscriptions, et chiffres LinkedIn saisis à la main." />
      <nav className="filtres">
        {PERIODES.map((x) => (
          <Link key={x.cle} href={`/stats?periode=${x.cle}`} aria-current={x.cle === p.cle ? 'true' : undefined}>{x.libelle}</Link>
        ))}
      </nav>

      {!aud ? (
        <p className="message" style={{ marginBottom: 16 }}>
          Le compteur n’est pas encore branché : la base Upstash Redis doit être ajoutée sur Vercel aux deux projets (site et admin). Voir admin/LISEZ-MOI.md.
        </p>
      ) : null}

      <div className="grille">
        <Carte className="c3" titre="Visiteurs"><p className="chiffre">{nombre(aud?.visiteurs)}</p><p className="petit discret">uniques sur la période</p></Carte>
        <Carte className="c3" titre="Pages vues"><p className="chiffre">{nombre(aud?.pages)}</p><p className="petit discret">{aud && aud.visiteurs ? `${(aud.pages / aud.visiteurs).toFixed(1).replace('.', ',')} par visiteur` : '—'}</p></Carte>
        <Carte className="c3" titre="Labos ouverts"><p className="chiffre">{nombre(aud ? Object.values(aud.labos).reduce((t, l) => t + l.ouvert, 0) : null)}</p><p className="petit discret">ouvertures de labos</p></Carte>
        <Carte className="c3" titre="Inscrits"><p className="chiffre">{nombre(nbInscrits)}</p><p className="petit discret">{nbInscrits === null ? 'Brevo non configuré' : 'contacts Brevo'}</p></Carte>

        {aud ? (
          <Carte className="c12" titre="Visiteurs par jour">
            <div className="histo" role="img" aria-label="Visiteurs par jour">
              {aud.parJour.map((j) => (
                <i key={j.jour} title={`${dateCourte(j.jour)} : ${j.visiteurs} visiteurs, ${j.pages} pages`} style={{ height: `${Math.max(3, (j.visiteurs / maxJour) * 100)}%` }} />
              ))}
            </div>
            <p className="mono petit discret" style={{ display: 'flex', justifyContent: 'space-between', margin: '6px 0 0' }}>
              <span>{dateCourte(aud.jours[0])}</span>
              <span>{dateCourte(aud.jours.at(-1))}</span>
            </p>
          </Carte>
        ) : null}

        {aud ? (
          <>
            <Carte className="c6" titre="Pages les plus vues"><Barres lignes={aud.topPages} /></Carte>
            <Carte className="c6" titre="D’où viennent-ils"><Barres lignes={aud.sources.map(([k, v]) => [SOURCES[k] ?? k, v])} /></Carte>
            <Carte className="c4" titre="Pays"><Barres lignes={aud.pays.map(([k, v]) => [PAYS[k] ?? k, v])} /></Carte>
            <Carte className="c4" titre="Appareils"><Barres lignes={aud.appareils.map(([k, v]) => [k === 'mobile' ? 'Téléphone' : k === 'tablette' ? 'Tablette' : 'Ordinateur', v])} /></Carte>
            <Carte className="c4" titre="Langue"><Barres lignes={aud.langues.map(([k, v]) => [k === 'en' ? 'Anglais' : 'Français', v])} /></Carte>
            <Carte className="c12" titre="Labos : de l’ouverture au quiz">
              {Object.keys(aud.labos).length === 0 ? <p className="vide">Aucun labo ouvert sur la période.</p> : (
                <div className="defile">
                  <table className="tableau">
                    <thead><tr><th>Labo</th><th>Ouvertures</th><th>Étapes atteintes</th><th>Quiz réussis</th><th>Du premier coup</th><th>Temps moyen</th></tr></thead>
                    <tbody>
                      {Object.entries(aud.labos).sort((a, b) => b[1].ouvert - a[1].ouvert).map(([id, l]) => (
                        <tr key={id}>
                          <td><Link href={`/labos/${id}`}>{nomLabo(id)}</Link></td>
                          <td className="mono">{nombre(l.ouvert)}</td>
                          <td className="mono petit">{Object.entries(l.etapes).sort((a, b) => Number(a[0]) - Number(b[0])).map(([k, v]) => `${Number(k) + 1} : ${v}`).join(' · ') || '—'}</td>
                          <td className="mono">{nombre(l.quiz)}{l.ouvert ? <span className="discret"> ({Math.round((l.quiz / l.ouvert) * 100)} %)</span> : null}</td>
                          <td className="mono">{nombre(l.quiz1)}</td>
                          <td className="mono">{l.ouvert ? `${Math.round(l.sec / l.ouvert / 60 * 10) / 10} min`.replace('.', ',') : '—'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </Carte>
          </>
        ) : null}

        <Carte className="c12" titre="LinkedIn · chiffres saisis">
          {publies.length === 0 ? <p className="vide">Aucun post publié pour l’instant.</p> : (
            <div className="defile">
              <table className="tableau">
                <thead><tr><th>Nº</th><th>Post</th><th>Publié</th><th>Impressions 48 h</th><th>Impressions 7 j</th><th>Réactions 7 j</th><th>Enreg.</th><th></th></tr></thead>
                <tbody>
                  {publies.map((e) => (
                    <tr key={e.n}>
                      <td className="mono">{e.n}</td>
                      <td>{e.titre}</td>
                      <td className="mono petit">{dateCourte(e.publie_le)}</td>
                      <td className="mono">{nombre(e.mesures?.h48?.impressions)}</td>
                      <td className="mono">{nombre(e.mesures?.j7?.impressions)}</td>
                      <td className="mono">{nombre(e.mesures?.j7?.reactions)}</td>
                      <td className="mono">{nombre(e.mesures?.j7?.enregistrements)}</td>
                      <td><Link className="btn btn-petit" href={`/episodes/${e.n}`}>{e.mesures?.j7 ? 'Modifier' : 'Saisir'}</Link></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          <p className="petit discret" style={{ margin: '10px 0 0' }}>La lecture automatique des statistiques LinkedIn demande une permission restreinte (r_member_social) : les chiffres se relèvent dans LinkedIn et se saisissent ici.</p>
        </Carte>
      </div>
    </>
  );
}
