import Link from 'next/link';
import Robot3D from '@/components/Robot3D';
import { Carte, Jauge, Pastille } from '@/components/Bloc';
import { IcExterne, IcPdf } from '@/components/Icones';
import { audience, inscrits } from '@/lib/audience';
import { donnees } from '@/lib/donnees';
import { B, dateCourte, dateLongue, nombre, relatif } from '@/lib/format';
import { githubActif, issuesOuvertes, tournees } from '@/lib/github';
import { synthese } from '@/lib/synthese';

export const metadata = { title: 'Accueil' };

function salut() {
  const h = new Date().getUTCHours();
  return h < 5 ? 'Bonne nuit' : h < 18 ? 'Bonjour' : 'Bonsoir';
}

export default async function Accueil() {
  const d = await donnees();
  if (d.indisponible) return null;
  const s = synthese(d);
  const [aud, nbInscrits, runs, issues] = await Promise.all([
    audience(7).catch(() => null),
    inscrits(),
    githubActif() ? tournees(10, 'linkedin.yml').catch(() => null) : Promise.resolve(null),
    githubActif() ? issuesOuvertes().catch(() => null) : Promise.resolve(null),
  ]);
  const derniere = runs?.find((r) => r.statut === 'completed');
  const impressions = d.episodes.reduce((t, e) => t + Number(e.mesures?.j7?.impressions ?? e.mesures?.h48?.impressions ?? 0), 0);
  const avanceAlerte = s.relusAvance < s.avanceMin;
  const p = s.prochain;
  const labosDuProchain = p ? d.labos.filter((l) => p.themes.includes(l.id)) : [];

  return (
    <>
      <section className="heros">
        <div>
          <p className="sur">{dateLongue(new Date().toISOString(), false)}</p>
          <h1>
            {salut()}, <em>Ladji Lama</em>
          </h1>
          <p className="chapeau">
            {s.publies.length} post{s.publies.length > 1 ? 's' : ''} publié{s.publies.length > 1 ? 's' : ''} sur {s.total}. {s.relusAvance} épisode
            {s.relusAvance > 1 ? 's' : ''} relu{s.relusAvance > 1 ? 's' : ''} d’avance.
          </p>
        </div>
        <Robot3D />
      </section>

      <div className="grille" style={{ marginTop: 8 }}>
        {p ? (
          <Carte className="c8 mise" titre="Prochain post" droite={<span className="mono">{relatif(p.date_prevue)}</span>}>
            <p className="sur" style={{ color: 'var(--pale)' }}>
              Nº {p.n} · {p.chapitre.titre}
            </p>
            <h2 style={{ fontSize: 'clamp(22px,3vw,30px)', fontWeight: 500, letterSpacing: '-.03em', margin: '0 0 6px' }}>{p.titre}</h2>
            <p className="discret" style={{ margin: '0 0 16px' }}>
              {dateLongue(p.date_prevue)} · <Pastille statut={p.statut} /> · labo {labosDuProchain.map((l) => l.id).join(', ') || '—'} :{' '}
              {labosDuProchain.length ? 'fermé jusqu’à la sortie' : 'aucun'}
            </p>
            <div className="btns">
              <Link className="btn btn-plein" href={`/episodes/${p.n}`}>
                Voir le post
              </Link>
              {p.pdf ? (
                <a className="btn" href={`${B}/api/fichier?chemin=${encodeURIComponent(p.pdf)}`} target="_blank" rel="noreferrer">
                  <IcPdf /> PDF
                </a>
              ) : null}
              {labosDuProchain[0] ? (
                <Link className="btn" href={`/labos/${labosDuProchain[0].id}`}>
                  Labo {labosDuProchain[0].id}
                </Link>
              ) : null}
            </div>
          </Carte>
        ) : (
          <Carte className="c8 mise" titre="Prochain post">
            <p>Aucun post prévu.</p>
          </Carte>
        )}

        <Carte className={`c4${avanceAlerte ? ' alerte' : ''}`} titre="Avance">
          <p className="chiffre">
            {s.relusAvance}
            <small>relus d’avance · minimum {s.avanceMin}</small>
          </p>
          <div style={{ margin: '14px 0 10px' }}>
            <Jauge valeur={s.relusAvance} max={Math.max(s.avanceMin * 2, s.relusAvance)} alerte={avanceAlerte} />
          </div>
          <p className="petit discret" style={{ margin: 0 }}>
            {avanceAlerte ? 'Sous le minimum : relisez ou produisez un épisode.' : `Dernier relu : Nº ${d.episodes.filter((e) => e.statut === 'relu').at(-1)?.n ?? '—'}.`}
          </p>
        </Carte>

        <Carte className={`c6${s.aRelire.length + s.bilansARelire.length ? ' alerte' : ''}`} titre="À relire" droite={<Link href="/episodes?filtre=a-relire">tout voir</Link>}>
          {s.aRelire.length + s.bilansARelire.length === 0 && s.enProduction.length === 0 ? <p className="vide">Rien à relire.</p> : null}
          <ul className="lignes">
            {s.aRelire.map((e) => (
              <li key={e.n}>
                <span className="num">Nº {e.n}</span>
                <Link className="titre" href={`/episodes/${e.n}`}>
                  {e.titre}
                </Link>
                <span className="fin">
                  <Pastille statut="genere" />
                </span>
              </li>
            ))}
            {s.bilansARelire.map((b) => (
              <li key={b.cle}>
                <span className="num">B{b.saison}</span>
                <Link className="titre" href={`/episodes/${b.cle}`}>
                  Bilan de la saison {b.saison}
                </Link>
                <span className="fin">
                  <Pastille statut="genere" />
                </span>
              </li>
            ))}
            {s.enProduction.slice(0, 3).map((e) => (
              <li key={e.n}>
                <span className="num">Nº {e.n}</span>
                <Link className="titre" href={`/episodes/${e.n}`}>
                  {e.titre}
                </Link>
                <span className="fin">
                  <span className="pastille p-attente">{e.a_refaire[0]?.etape} à faire</span>
                </span>
              </li>
            ))}
          </ul>
        </Carte>

        <Carte className="c6" titre="Posts et labos">
          <div className="grille" style={{ gap: 12 }}>
            <div className="c6">
              <p className="chiffre">
                {s.publies.length}
                <small>/ {s.total} publiés</small>
              </p>
              <p className="petit discret">{s.total - s.publies.length} restants</p>
            </div>
            <div className="c6">
              <p className="chiffre">
                {s.labos.ouverts.length}
                <small>labos ouverts</small>
              </p>
              <p className="petit discret">
                {s.labos.prets.length} prêts · {s.labos.aFinir.length} à finir · {s.labos.aConcevoir.length} à concevoir
              </p>
            </div>
          </div>
          <div style={{ marginTop: 6 }}>
            <Jauge valeur={s.publies.length} max={s.total} />
          </div>
          {s.labos.recetteAFaire.length ? (
            <p className="message erreur" style={{ marginTop: 14 }}>
              Recette à valider avant 7 jours : {s.labos.recetteAFaire.map((l) => l.id).join(', ')}.{' '}
              <Link href="/labos">Ouvrir les labos</Link>
            </p>
          ) : null}
        </Carte>

        <Carte className="c4" titre="Tournée LinkedIn" droite={<Link href="/publication">salle</Link>}>
          {!githubActif() ? (
            <p className="petit discret">Accès GitHub de l’admin à configurer (ADMIN_GITHUB_TOKEN) pour suivre les tournées.</p>
          ) : derniere ? (
            <>
              <p style={{ margin: '0 0 6px' }}>
                <Pastille statut={derniere.conclusion === 'success' ? 'ok' : 'alerte'}>{derniere.conclusion === 'success' ? 'réussie' : derniere.conclusion ?? derniere.statut}</Pastille>
              </p>
              <p className="petit discret" style={{ margin: 0 }}>
                {relatif(derniere.maj_le)} · pilote {d.publication.pilote}
              </p>
            </>
          ) : (
            <p className="petit discret">Aucune tournée récente.</p>
          )}
        </Carte>

        <Carte className={`c4${s.jetonJours !== null && s.jetonJours <= 14 ? ' alerte' : ''}`} titre="Jeton LinkedIn">
          <p className="chiffre">
            {s.jetonJours ?? '—'}
            <small>jours restants</small>
          </p>
          <p className="petit discret" style={{ margin: 0 }}>
            {d.publication.jeton_expire ? `Expire le ${dateLongue(d.publication.jeton_expire, false)}.` : 'Date d’expiration inconnue.'}
          </p>
        </Carte>

        <Carte className={`c4${issues?.length ? ' alerte' : ''}`} titre="Alertes" droite={<Link href="/decisions">décisions</Link>}>
          <p className="chiffre">
            {issues ? issues.length : '—'}
            <small>issue{issues && issues.length > 1 ? 's' : ''} ouverte{issues && issues.length > 1 ? 's' : ''}</small>
          </p>
          <p className="petit discret" style={{ margin: 0 }}>
            {s.decisionsOuvertes.length} décision{s.decisionsOuvertes.length > 1 ? 's' : ''} en attente.
          </p>
        </Carte>

        <Carte className="c8" titre="Audience · 7 jours" droite={<Link href="/stats">détails</Link>}>
          {aud ? (
            <>
              <div className="grille" style={{ gap: 12 }}>
                <div className="c3">
                  <p className="chiffre">{nombre(aud.visiteurs)}</p>
                  <p className="petit discret">visiteurs</p>
                </div>
                <div className="c3">
                  <p className="chiffre">{nombre(aud.pages)}</p>
                  <p className="petit discret">pages vues</p>
                </div>
                <div className="c3">
                  <p className="chiffre">{nombre(Object.values(aud.labos).reduce((t, l) => t + l.ouvert, 0))}</p>
                  <p className="petit discret">labos ouverts</p>
                </div>
                <div className="c3">
                  <p className="chiffre">{nbInscrits ?? '—'}</p>
                  <p className="petit discret">inscrits</p>
                </div>
              </div>
              <div className="histo" style={{ marginTop: 14, height: 70 }} aria-label="Visiteurs par jour">
                {aud.parJour.map((j) => (
                  <i key={j.jour} title={`${dateCourte(j.jour)} : ${j.visiteurs} visiteurs`} style={{ height: `${Math.max(4, (j.visiteurs / Math.max(1, ...aud.parJour.map((x) => x.visiteurs))) * 100)}%` }} />
                ))}
              </div>
            </>
          ) : (
            <p className="petit discret">
              Compteur à brancher (base Upstash sur Vercel). Inscrits : {nbInscrits ?? '—'} · impressions LinkedIn saisies : {nombre(impressions)}.
            </p>
          )}
        </Carte>

        <Carte className="c4" titre="CV public" droite={<Link href="/profil">modifier</Link>}>
          <p style={{ margin: '0 0 6px' }}>Mis à jour {d.cv?.modifie_le ? `le ${dateLongue(d.cv.modifie_le, false)}` : '—'}</p>
          <div className="btns">
            {d.cv ? (
              <a className="btn btn-petit" href={`${B}/api/fichier?chemin=${encodeURIComponent(d.cv.chemin)}`} target="_blank" rel="noreferrer">
                <IcPdf /> Ouvrir
              </a>
            ) : null}
            <a className="btn btn-petit" href="https://theta-ml.vercel.app/fr/profil" target="_blank" rel="noreferrer">
              Profil <IcExterne />
            </a>
          </div>
        </Carte>
      </div>
    </>
  );
}
