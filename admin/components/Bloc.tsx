import { LIBELLE_STATUT } from '@/lib/format';

export function Pastille({ statut, children }: { statut: string; children?: React.ReactNode }) {
  return <span className={`pastille p-${statut}`}>{children ?? LIBELLE_STATUT[statut] ?? statut}</span>;
}

export function Carte({ titre, droite, className = '', children }: { titre?: React.ReactNode; droite?: React.ReactNode; className?: string; children: React.ReactNode }) {
  return (
    <section className={`carte ${className}`}>
      {titre ? (
        <h2 className="carte-titre">
          <span>{titre}</span>
          {droite ? <span>{droite}</span> : null}
        </h2>
      ) : null}
      {children}
    </section>
  );
}

export function Entete({ sur, titre, chapeau, droite }: { sur?: string; titre: React.ReactNode; chapeau?: React.ReactNode; droite?: React.ReactNode }) {
  return (
    <header className="entete">
      <div>
        {sur ? <p className="sur">{sur}</p> : null}
        <h1>{titre}</h1>
        {chapeau ? <p className="chapeau">{chapeau}</p> : null}
      </div>
      {droite}
    </header>
  );
}

export function Jauge({ valeur, max, alerte = false }: { valeur: number; max: number; alerte?: boolean }) {
  const p = max > 0 ? Math.max(0, Math.min(100, (valeur / max) * 100)) : 0;
  return (
    <div className={`jauge${alerte ? ' alerte' : ''}`} role="meter" aria-valuemin={0} aria-valuemax={max} aria-valuenow={valeur}>
      <i style={{ width: `${p}%` }} />
    </div>
  );
}

export function Barres({ lignes, total }: { lignes: [string, number][]; total?: number }) {
  const max = total ?? Math.max(1, ...lignes.map((l) => l[1]));
  if (!lignes.length) return <p className="vide">Pas encore de données.</p>;
  return (
    <div className="barres">
      {lignes.map(([lab, v]) => (
        <div className="barre-l" key={lab}>
          <span className="lab" title={lab}>{lab}</span>
          <Jauge valeur={v} max={max} />
          <span className="val">{new Intl.NumberFormat('fr-FR').format(v)}</span>
        </div>
      ))}
    </div>
  );
}
