import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Carte, Entete, Pastille } from '@/components/Bloc';
import { IcExterne, IcRetour } from '@/components/Icones';
import { donnees, laboOuvert } from '@/lib/donnees';
import { B, dateLongue, relatif } from '@/lib/format';
import RecetteLabo from './RecetteLabo';

export const metadata = { title: 'Labo' };

const SITE = process.env.THETA_SITE_URL ?? 'https://theta-ml.vercel.app';

export default async function Labo({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const d = await donnees();
  if (d.indisponible) return null;
  const l = d.labos.find((x) => x.id === id);
  if (!l) notFound();
  const ep = d.episodes.find((e) => e.n === l.n);
  const ouvert = laboOuvert(l.date_ouverture, ep?.publie_le ?? l.publie_le);
  const apercuPossible = !!process.env.THETA_APERCU_SECRET;

  return (
    <>
      <p style={{ margin: '0 0 12px' }}>
        <Link href="/labos" className="petit" style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
          <IcRetour /> Labos
        </Link>
      </p>
      <Entete
        sur={`Labo 3D · Nº ${l.n} · ${l.id}`}
        titre={l.titre}
        chapeau={ep ? `Épisode : ${ep.titre}` : undefined}
        droite={<Pastille statut={ouvert ? 'ouvert' : 'neutre'}>{ouvert ? 'ouvert au public' : 'fermé au public'}</Pastille>}
      />
      <div className="grille">
        <Carte className="c4 mise" titre="Ouvrir le labo">
          <p style={{ marginTop: 0 }}>
            {ouvert
              ? 'Le labo est en ligne.'
              : l.scene
                ? `Fermé jusqu’au ${dateLongue(l.date_ouverture)} (${relatif(l.date_ouverture)}). Vous pouvez le manipuler en aperçu.`
                : 'Ce labo n’est pas encore construit.'}
          </p>
          <div className="btns">
            {ouvert ? (
              <a className="btn btn-plein" href={`${SITE}/fr/labo/${l.id}`} target="_blank" rel="noreferrer">
                Ouvrir <IcExterne />
              </a>
            ) : l.scene ? (
              apercuPossible ? (
                <a className="btn btn-plein" href={`${B}/api/apercu-labo?id=${l.id}`} target="_blank" rel="noreferrer">
                  Aperçu réservé <IcExterne />
                </a>
              ) : (
                <span className="petit discret">Aperçu à configurer (THETA_APERCU_SECRET sur les deux projets Vercel).</span>
              )
            ) : null}
            {ouvert && l.scene ? (
              <a className="btn" href={`${SITE}/en/labo/${l.id}`} target="_blank" rel="noreferrer">
                Version anglaise <IcExterne />
              </a>
            ) : null}
          </div>
        </Carte>
        <Carte className="c8" titre="Construction">
          <ul className="lignes">
            <li><span className="discret">Scène 3D et vue 2D</span><span className="fin"><Pastille statut={l.scene ? 'ok' : 'neutre'}>{l.scene ? 'faite' : 'à faire'}</Pastille></span></li>
            <li><span className="discret">Parcours guidé</span><span className="fin"><Pastille statut={l.parcours ? 'ok' : 'neutre'}>{l.parcours ? 'fait' : 'à faire'}</Pastille></span></li>
            <li><span className="discret">Question du carrousel (quiz)</span><span className="fin"><Pastille statut={l.quiz ? 'ok' : 'neutre'}>{l.quiz ? 'faite' : 'à faire'}</Pastille></span></li>
            {l.conception ? <li><span className="discret">Conception</span><span className="fin petit">{l.conception}</span></li> : null}
          </ul>
        </Carte>
        <Carte className="c12" titre="Recette" droite={l.recette?.validee_le ? <Pastille statut="ok">validée le {dateLongue(l.recette.validee_le, false)}</Pastille> : null}>
          <p className="petit discret" style={{ marginTop: 0 }}>
            La liste de la section 8 de conception/labos-saison-1.txt. Cochez au fil de vos essais ; « Valider la recette » enregistre la date quand tout est coché.
          </p>
          <RecetteLabo id={l.id} modele={d.recette_modele} recette={l.recette} />
        </Carte>
      </div>
    </>
  );
}
