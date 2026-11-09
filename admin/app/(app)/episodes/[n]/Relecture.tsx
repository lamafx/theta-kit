'use client';

import { useState } from 'react';
import { BoutonGeste } from '@/components/Geste';

export default function Relecture({ n, statut, peutValider, aRefaire, decisionsOuvertes }: { n: string; statut: string; peutValider: boolean; aRefaire: string[]; decisionsOuvertes: number }) {
  const [note, setNote] = useState('');
  const [bloquer, setBloquer] = useState(statut === 'relu');
  return (
    <>
      {peutValider ? (
        <>
          <p style={{ marginTop: 0 }}>
            Après lecture du carrousel et du texte, validez : l’épisode passe à « relu » et la tournée pourra le publier à sa date.
          </p>
          {decisionsOuvertes ? <p className="message" style={{ marginBottom: 12 }}>{decisionsOuvertes} décision{decisionsOuvertes > 1 ? 's' : ''} de relecture reste{decisionsOuvertes > 1 ? 'nt' : ''} sans réponse.</p> : null}
          <BoutonGeste geste="valider" cible={n} classe="btn btn-plein" libelle={`Valider le Nº ${n}`} question={`Valider le Nº ${n} ? Il passera à « relu » et partira à sa date.`} desactive={aRefaire.length > 0} />
          {aRefaire.length ? <p className="petit signal err">Étapes à refaire avant de valider : {aRefaire.join(', ')}.</p> : null}
        </>
      ) : (
        <p style={{ marginTop: 0 }} className="discret">
          {statut === 'relu' ? 'Déjà relu : il partira à sa date. Une note « À corriger » peut encore le retenir.' : 'Pas encore prêt pour votre validation.'}
        </p>
      )}
      <details className="repli" open={!peutValider && statut === 'relu' ? false : undefined}>
        <summary>À corriger</summary>
        <label className="champ" style={{ marginTop: 10 }}>
          <span>Ce qui ne va pas (page, phrase, correction voulue)</span>
          <textarea className="zone" value={note} onChange={(e) => setNote(e.target.value)} maxLength={4000} placeholder="Page 3 : « … » devrait dire …" />
        </label>
        {statut === 'relu' ? (
          <label className="case" style={{ borderTop: 0, paddingTop: 0 }}>
            <input type="checkbox" checked={bloquer} onChange={(e) => setBloquer(e.target.checked)} />
            <span>Retenir la publication tant que ce n’est pas corrigé (l’épisode repasse à « à relire »).</span>
          </label>
        ) : null}
        <BoutonGeste
          geste="corriger"
          cible={n}
          libelle="Envoyer la note"
          desactive={note.trim().length < 3}
          question={`Ajouter cette note aux corrections du Nº ${n}${bloquer && statut === 'relu' ? ' et retenir sa publication' : ''} ?`}
          avantEnvoi={() => ({ note: note.trim(), bloquer: bloquer && statut === 'relu' })}
        />
      </details>
    </>
  );
}
