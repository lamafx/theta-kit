import Nav from '@/components/Nav';
import HorsLigne from '@/components/HorsLigne';
import { donnees } from '@/lib/donnees';
import { exigerSession } from '@/lib/garde';
import { synthese } from '@/lib/synthese';

export const dynamic = 'force-dynamic';

export default async function Coquille({ children }: { children: React.ReactNode }) {
  await exigerSession();
  const d = await donnees();
  const s = d.indisponible ? null : synthese(d);
  const pastilles = s
    ? {
        episodes: s.aRelire.length + s.bilansARelire.length || undefined,
        labos: s.labos.recetteAFaire.length || undefined,
        decisions: s.decisionsOuvertes.length || undefined,
        publication: s.jetonJours !== null && s.jetonJours <= 14 ? 1 : undefined,
      }
    : {};
  const version = d.commit ? `${d.commit.slice(0, 7)} · ${d.direct ? 'direct' : 'instantané'}` : 'instantané';
  return (
    <div className="coquille">
      <Nav pastilles={pastilles} version={version} />
      <main className="principal">
        <HorsLigne genereLe={d.genere_le} />
        {d.indisponible ? (
          <p className="message erreur">
            Instantané de la série indisponible : le build n’a pas pu lire serie-ml. Vérifiez sur Vercel que le projet admin inclut les fichiers hors de son dossier (voir admin/LISEZ-MOI.md).
          </p>
        ) : null}
        {children}
      </main>
    </div>
  );
}
