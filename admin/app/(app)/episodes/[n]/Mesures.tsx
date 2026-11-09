'use client';

import { useState } from 'react';
import { BoutonGeste } from '@/components/Geste';

// Format de serie-ml/mesures/NN.yaml (skill /stats) : h48 {impressions, reactions}, j7 {impressions, reactions,
// enregistrements, partages}. Les chiffres viennent de LinkedIn, saisis à la main (r_member_social est restreint).
const H48 = ['impressions', 'reactions'] as const;
const J7 = ['impressions', 'reactions', 'enregistrements', 'partages', 'commentaires'] as const;
const LIB: Record<string, string> = { impressions: 'Impressions', reactions: 'Réactions', enregistrements: 'Enregistrements', partages: 'Partages', commentaires: 'Commentaires' };

export default function Mesures({ n, mesures, publieLe }: { n: string; mesures: Record<string, any> | null; publieLe: string | null }) {
  const [h48, setH48] = useState<Record<string, string>>(() => Object.fromEntries(H48.map((k) => [k, mesures?.h48?.[k] ?? ''])));
  const [j7, setJ7] = useState<Record<string, string>>(() => Object.fromEntries(J7.map((k) => [k, mesures?.j7?.[k] ?? ''])));
  const jours = publieLe ? Math.floor((Date.now() - new Date(`${publieLe}T08:30:00Z`).getTime()) / 86400000) : 0;
  const champ = (val: Record<string, string>, set: (v: Record<string, string>) => void, k: string) => (
    <label className="champ" key={k} style={{ margin: 0 }}>
      <span>{LIB[k]}</span>
      <input className="entree" inputMode="numeric" pattern="[0-9]*" value={val[k]} onChange={(e) => set({ ...val, [k]: e.target.value.replace(/\D/g, '') })} />
    </label>
  );
  const num = (o: Record<string, string>) => Object.fromEntries(Object.entries(o).filter(([, v]) => v !== '').map(([k, v]) => [k, Number(v)]));
  const j7Complet = ['impressions', 'reactions', 'enregistrements', 'partages'].every((k) => j7[k] !== '');
  return (
    <>
      <p className="petit discret" style={{ marginTop: 0 }}>
        Publié il y a {jours} jour{jours > 1 ? 's' : ''}. Relevez les chiffres dans LinkedIn à 48 h puis à 7 jours.
      </p>
      <p className="sur" style={{ marginTop: 10 }}>À 48 heures</p>
      <div className="duo">{H48.map((k) => champ(h48, setH48, k))}</div>
      <p className="sur" style={{ marginTop: 16 }}>À 7 jours</p>
      <div className="duo">{J7.map((k) => champ(j7, setJ7, k))}</div>
      <div style={{ marginTop: 14 }}>
        <BoutonGeste
          geste="mesurer"
          cible={n}
          classe="btn btn-plein"
          libelle="Enregistrer les chiffres"
          question={j7Complet ? `Enregistrer les chiffres du Nº ${n} ? Il passera à « mesuré ».` : `Enregistrer les chiffres du Nº ${n} ?`}
          avantEnvoi={() => ({ h48: num(h48), j7: num(j7) })}
        />
      </div>
    </>
  );
}
