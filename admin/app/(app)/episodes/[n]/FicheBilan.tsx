import Link from 'next/link';
import { Carte, Entete, Pastille } from '@/components/Bloc';
import Carrousel from '@/components/Carrousel';
import { BoutonGeste } from '@/components/Geste';
import { IcPdf, IcRetour } from '@/components/Icones';
import { B, dateLongue, relatif } from '@/lib/format';
import type { Bilan } from '@/lib/types';
import ChangerStatut from './ChangerStatut';

/** Le post bilan d'une saison : carrousel, texte, date, et la validation de l'auteur. */
export default function FicheBilan({ b }: { b: Bilan }) {
  return (
    <>
      <p style={{ margin: '0 0 12px' }}>
        <Link href="/episodes" className="petit" style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
          <IcRetour /> Épisodes
        </Link>
      </p>
      <Entete sur={`Bilan · Saison ${b.saison}`} titre={<>Bilan de la <em>saison {b.saison}</em></>} droite={<Pastille statut={b.statut} />} />
      <div className="grille">
        <Carte
          className="c8"
          titre="Carrousel"
          droite={
            b.pdf ? (
              <a href={`${B}/api/fichier?chemin=${encodeURIComponent(b.pdf)}`} target="_blank" rel="noreferrer" style={{ display: 'inline-flex', gap: 6, alignItems: 'center' }}>
                <IcPdf /> PDF
              </a>
            ) : null
          }
        >
          <Carrousel pages={b.pages ?? []} titre={`Bilan de la saison ${b.saison}`} />
        </Carte>
        <Carte className={`c4${b.statut === 'genere' ? ' mise' : ''}`} titre="Votre relecture">
          <p style={{ marginTop: 0 }}>
            {b.publie_le ? `Publié le ${dateLongue(b.publie_le, false)}.` : b.date_prevue ? `Prévu ${dateLongue(b.date_prevue)} (${relatif(b.date_prevue)}).` : 'Pas encore de date.'}
          </p>
          {b.statut === 'genere' ? (
            <BoutonGeste geste="valider" cible={b.cle} classe="btn btn-plein" libelle="Valider le bilan" question={`Valider le bilan de la saison ${b.saison} ? Il passera à « relu » et partira à sa date.`} />
          ) : (
            <p className="discret">{b.statut === 'relu' ? 'Déjà relu : il partira à sa date.' : b.statut === 'a_faire' ? 'Pas encore produit (/bilan depuis serie-ml/).' : ''}</p>
          )}
          {b.trace?.lien ? (
            <p>
              <a href={b.trace.lien} target="_blank" rel="noreferrer">Voir le post sur LinkedIn</a>
            </p>
          ) : null}
          <details className="repli">
            <summary>Changer le statut</summary>
            <div style={{ marginTop: 10 }}>
              <ChangerStatut cle={b.cle} nom={`Bilan de la saison ${b.saison}`} statut={b.statut} />
            </div>
          </details>
        </Carte>
        <Carte className="c12" titre="Texte du post">
          {b.post?.titre ? <p className="sur" style={{ color: 'var(--pale)' }}>{b.post.titre}</p> : null}
          {b.post?.texte ? <pre className="post">{b.post.texte}</pre> : <p className="vide">Pas encore de texte.</p>}
        </Carte>
      </div>
    </>
  );
}
