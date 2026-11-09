import Link from 'next/link';
import { Entete, Pastille } from '@/components/Bloc';
import { donnees, laboOuvert } from '@/lib/donnees';
import { dateCourte, joursAvant } from '@/lib/format';

export const metadata = { title: 'Labos 3D' };

export default async function Labos() {
  const d = await donnees();
  if (d.indisponible) return null;
  const nbCases = d.recette_modele.reduce((t, g) => t + g.cases.length, 0);
  const labos = d.labos.map((l) => {
    const ep = d.episodes.find((e) => e.n === l.n);
    const publieLe = ep?.publie_le ?? l.publie_le;
    const ouvert = laboOuvert(l.date_ouverture, publieLe);
    const cochees = Object.values(l.recette?.cases ?? {}).filter(Boolean).length;
    const j = joursAvant(l.date_ouverture);
    const urgent = !ouvert && !l.recette?.validee_le && j !== null && j <= 7;
    const etat = !l.scene ? 'à concevoir' : l.parcours && l.quiz ? 'prêt' : 'parcours à faire';
    return { ...l, ouvert, cochees, urgent, etat };
  });
  const compte = (f: (x: (typeof labos)[number]) => boolean) => labos.filter(f).length;

  return (
    <>
      <Entete
        sur="Labos 3D"
        titre={<>Les <em>labos</em></>}
        chapeau={`${compte((l) => l.ouvert)} ouverts · ${compte((l) => l.etat === 'prêt')} prêts · ${compte((l) => l.etat === 'parcours à faire')} parcours à faire · ${compte((l) => l.etat === 'à concevoir')} à concevoir. Un labo s’ouvre avec la publication de son épisode.`}
      />
      <div className="carte defile" style={{ padding: '6px 14px' }}>
        <table className="tableau">
          <thead>
            <tr>
              <th>Nº</th>
              <th>Labo</th>
              <th>Construction</th>
              <th>Recette</th>
              <th>Ouverture</th>
            </tr>
          </thead>
          <tbody>
            {labos.map((l) => (
              <tr key={l.id}>
                <td className="mono">{l.n}</td>
                <td>
                  <Link href={`/labos/${l.id}`} style={{ color: 'var(--white)', fontWeight: 600 }}>
                    {l.titre}
                  </Link>
                  <span className="mono petit discret" style={{ display: 'block' }}>{l.id}</span>
                </td>
                <td>
                  <Pastille statut={l.etat === 'prêt' ? 'ok' : l.etat === 'à concevoir' ? 'neutre' : 'attente'}>{l.etat}</Pastille>
                </td>
                <td>
                  {l.recette?.validee_le ? (
                    <Pastille statut="ok">validée</Pastille>
                  ) : l.urgent ? (
                    <Pastille statut="alerte">{l.cochees}/{nbCases} · J-{joursAvant(l.date_ouverture)}</Pastille>
                  ) : (
                    <span className="mono petit discret">{l.cochees}/{nbCases}</span>
                  )}
                </td>
                <td>
                  <Pastille statut={l.ouvert ? 'ouvert' : 'neutre'}>{l.ouvert ? 'ouvert' : `le ${dateCourte(l.date_ouverture)}`}</Pastille>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
