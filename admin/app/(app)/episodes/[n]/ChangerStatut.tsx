'use client';

import { useState } from 'react';
import { BoutonGeste } from '@/components/Geste';

/**
 * Changer le statut d'un épisode ou d'un bilan (geste « statut », admin/outils/geste.py).
 * Seuls les passages de la CLI sont proposés (serie/reprise.py, PASSAGES) : généré → relu, relu → généré,
 * relu → publié (post envoyé à la main, lien exigé), publié → mesuré.
 */
const NOMS: Record<string, string> = { a_faire: 'à faire', genere: 'à relire', relu: 'relu', publie: 'publié', mesure: 'mesuré' };

const PASSAGES: Record<string, { vers: string; libelle: string; effet: string }[]> = {
  genere: [{ vers: 'relu', libelle: 'Relu', effet: 'La tournée pourra le publier à sa date (étapes à jour et note de compréhension d’au moins 8,5 exigées).' }],
  relu: [
    { vers: 'genere', libelle: 'À relire', effet: 'La publication est retenue : la tournée ne le publiera pas tant qu’il n’est pas de nouveau relu.' },
    { vers: 'publie', libelle: 'Publié à la main', effet: 'Pour un post envoyé hors tournée : la date et le lien LinkedIn sont exigés, le labo s’ouvre au prochain déploiement. Rien ne part sur LinkedIn.' },
  ],
  publie: [{ vers: 'mesure', libelle: 'Mesuré', effet: 'Les chiffres LinkedIn sont saisis : le post sort du suivi.' }],
};

export default function ChangerStatut({ cle, nom, statut }: { cle: string; nom: string; statut: string }) {
  const choix = PASSAGES[statut] ?? [];
  const [vers, setVers] = useState(choix[0]?.vers ?? '');
  const [le, setLe] = useState(new Date().toISOString().slice(0, 10));
  const [lien, setLien] = useState('');
  if (!choix.length) {
    return <p className="discret" style={{ margin: 0 }}>Aucun changement possible depuis « {NOMS[statut] ?? statut} » : {statut === 'a_faire' ? 'l’épisode doit d’abord être produit (/episode depuis serie-ml/).' : 'statut final.'}</p>;
  }
  const p = choix.find((c) => c.vers === vers) ?? choix[0];
  const lienOk = /^https:\/\/(www\.)?linkedin\.com\/\S+$/.test(lien.trim());
  const dateOk = /^\d{4}-\d{2}-\d{2}$/.test(le) && le <= new Date().toISOString().slice(0, 10);
  const pret = p.vers !== 'publie' || (lienOk && dateOk);
  return (
    <>
      <p style={{ marginTop: 0 }}>
        Statut actuel : <b>{NOMS[statut] ?? statut}</b>.
      </p>
      <div role="radiogroup" aria-label="Nouveau statut" style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
        {choix.map((c) => (
          <button key={c.vers} type="button" role="radio" aria-checked={c.vers === p.vers} className={`btn btn-petit${c.vers === p.vers ? ' btn-plein' : ''}`} onClick={() => setVers(c.vers)}>
            {c.libelle}
          </button>
        ))}
      </div>
      <p className="petit discret" style={{ marginTop: 0 }}>{p.effet}</p>
      {p.vers === 'publie' ? (
        <>
          <label className="champ">
            <span>Publié le</span>
            <input className="entree" type="date" value={le} max={new Date().toISOString().slice(0, 10)} onChange={(e) => setLe(e.target.value)} />
          </label>
          <label className="champ">
            <span>Lien du post LinkedIn</span>
            <input className="entree" type="url" inputMode="url" value={lien} onChange={(e) => setLien(e.target.value)} placeholder="https://www.linkedin.com/feed/update/urn:li:activity:…" />
          </label>
          {lien && !lienOk ? <p className="petit signal err">Un lien https://www.linkedin.com/… est attendu.</p> : null}
        </>
      ) : null}
      <BoutonGeste
        geste="statut"
        cible={cle}
        classe="btn btn-plein"
        libelle={`Passer à « ${NOMS[p.vers]} »`}
        desactive={!pret}
        question={`${nom} : passer de « ${NOMS[statut] ?? statut} » à « ${NOMS[p.vers]} » ?`}
        avantEnvoi={() => (p.vers === 'publie' ? { statut: 'publie', le, lien: lien.trim() } : { statut: p.vers })}
      />
    </>
  );
}
