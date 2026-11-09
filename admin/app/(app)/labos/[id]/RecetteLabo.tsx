'use client';

import { useState } from 'react';
import { BoutonGeste } from '@/components/Geste';
import type { GroupeRecette, Recette } from '@/lib/types';

export default function RecetteLabo({ id, modele, recette }: { id: string; modele: GroupeRecette[]; recette: Recette | null }) {
  const [cases, setCases] = useState<Record<string, boolean>>(recette?.cases ?? {});
  const [note, setNote] = useState(recette?.note ?? '');
  const toutes = modele.flatMap((g) => g.cases.map((c) => c.id));
  const nb = toutes.filter((c) => cases[c]).length;
  const complete = nb === toutes.length && toutes.length > 0;
  return (
    <>
      <div className="grille">
        {modele.map((g) => (
          <div key={g.titre} className="c6">
            <p className="sur" style={{ margin: '6px 0 4px' }}>{g.titre}</p>
            {g.cases.map((c) => (
              <label key={c.id} className="case">
                <input type="checkbox" checked={!!cases[c.id]} onChange={(e) => setCases({ ...cases, [c.id]: e.target.checked })} />
                <span>{c.texte}</span>
              </label>
            ))}
          </div>
        ))}
      </div>
      <label className="champ" style={{ marginTop: 16 }}>
        <span>Note (ce qui reste à reprendre)</span>
        <textarea className="zone" style={{ minHeight: 70 }} value={note} onChange={(e) => setNote(e.target.value)} maxLength={2000} />
      </label>
      <p className="mono petit discret">{nb} / {toutes.length} cases cochées</p>
      <div className="btns">
        <BoutonGeste geste="recette" cible={id} libelle="Enregistrer" avantEnvoi={() => ({ cases, note, valider: false })} />
        <BoutonGeste
          geste="recette"
          cible={id}
          classe="btn btn-plein"
          libelle="Valider la recette"
          desactive={!complete}
          question={`Valider la recette du labo ${id} ? La date de validation sera enregistrée.`}
          avantEnvoi={() => ({ cases, note, valider: true })}
        />
      </div>
    </>
  );
}
