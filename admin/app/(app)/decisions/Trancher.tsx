'use client';

import { useState } from 'react';
import { BoutonGeste } from '@/components/Geste';
import { dateLongue } from '@/lib/format';
import type { Decision } from '@/lib/types';

export default function Trancher({ decision }: { decision: Decision }) {
  const options = [
    ...(decision.recommandation ? ['Suivre la recommandation'] : []),
    ...(decision.famille === 'relecture' ? ['Ne rien changer'] : decision.recommandation ? ['Ne pas suivre la recommandation'] : ['Oui', 'Non']),
    'Autre (préciser)',
  ];
  const [choix, setChoix] = useState(decision.choix?.choix ?? '');
  const [note, setNote] = useState(decision.choix?.note ?? '');
  const autre = choix === 'Autre (préciser)';
  if (decision.choix?.statut === 'tranchee') {
    return (
      <p className="message ok" style={{ margin: 0 }}>
        Tranchée{decision.choix.le ? ` le ${dateLongue(decision.choix.le, false)}` : ''} : {decision.choix.choix}
        {decision.choix.note ? ` · ${decision.choix.note}` : ''}
      </p>
    );
  }
  return (
    <div>
      <div className="filtres" role="radiogroup" aria-label="Votre choix" style={{ borderRadius: 16 }}>
        {options.map((o) => (
          <button key={o} type="button" role="radio" aria-checked={choix === o} onClick={() => setChoix(o)}>
            {o}
          </button>
        ))}
      </div>
      {autre || choix ? (
        <label className="champ">
          <span>{autre ? 'Votre choix' : 'Note (facultatif)'}</span>
          <textarea className="zone" style={{ minHeight: 64 }} value={note} onChange={(e) => setNote(e.target.value)} maxLength={2000} />
        </label>
      ) : null}
      <div className="btns">
        <BoutonGeste
          geste="trancher"
          cible={decision.id}
          classe="btn btn-plein btn-petit"
          libelle="Enregistrer"
          desactive={!choix || (autre && note.trim().length < 2)}
          avantEnvoi={() => ({ statut: 'tranchee', choix, note: note.trim() })}
        />
        <BoutonGeste geste="trancher" cible={decision.id} classe="btn btn-petit" libelle="Plus tard" avantEnvoi={() => ({ statut: 'plus_tard', note: note.trim() })} />
      </div>
    </div>
  );
}
