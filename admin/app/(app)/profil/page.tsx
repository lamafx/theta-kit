import Link from 'next/link';
import { Carte, Entete } from '@/components/Bloc';
import { IcExterne } from '@/components/Icones';
import { donnees } from '@/lib/donnees';
import { EditeurCV, EditeurFichier, EditeurSections } from './Editeurs';

export const metadata = { title: 'Profil et CV' };

const ONGLETS = [
  { cle: 'profil', titre: 'En-tête', aide: 'Titre, accroche, compteurs, contact, langues et boîte à outils (data/profil.json).' },
  { cle: 'parcours', titre: 'Parcours', aide: 'Diplômes et expériences, du plus ancien au plus récent : la page les affiche du plus récent au plus ancien (data/parcours.json).' },
  { cle: 'certificats', titre: 'Certificats', aide: 'Distinctions, hackathons et certificats ; « À la une » met une carte en avant. Une image ou un PDF se dépose sur le champ (data/certificats.json).' },
  { cle: 'projets', titre: 'Projets', aide: 'Les projets construits avec leur API (data/projets.json).' },
];

export default async function Profil({ searchParams }: { searchParams: Promise<{ onglet?: string }> }) {
  const { onglet = 'profil' } = await searchParams;
  const d = await donnees();
  const o = ONGLETS.find((x) => x.cle === onglet) ?? ONGLETS[0];
  return (
    <>
      <Entete
        sur="Site public"
        titre={<>Profil et <em>CV</em></>}
        chapeau="Chaque enregistrement fait un commit sur GitHub, puis le site se redéploie. Un numéro de téléphone est toujours refusé."
        droite={<a className="btn btn-petit" href="https://theta-ml.vercel.app/fr/profil" target="_blank" rel="noreferrer">Voir le profil <IcExterne /></a>}
      />
      <div className="grille">
        <Carte className="c6" titre="CV public">
          <EditeurCV cv={d.indisponible ? null : d.cv} />
        </Carte>
        <Carte className="c6" titre="Sections de la page">
          <EditeurSections />
        </Carte>
        <Carte className="c12" titre="Contenu">
          <nav className="filtres">
            {ONGLETS.map((x) => (
              <Link key={x.cle} href={`/profil?onglet=${x.cle}`} aria-current={x.cle === o.cle ? 'true' : undefined} scroll={false}>
                {x.titre}
              </Link>
            ))}
          </nav>
          <EditeurFichier key={o.cle} fichier={o.cle} titre={o.titre} aide={o.aide} />
        </Carte>
      </div>
    </>
  );
}
