'use client';

import { BoutonGeste } from '@/components/Geste';

/**
 * Bouton « Passer à relu » posé à côté du PDF, là où l'on vient de lire le carrousel (geste « valider »).
 * Grisé tant qu'une étape reste à faire (souvent la note de compréhension) : la raison est dite à côté.
 */
export default function PasserRelu({ n, aRefaire }: { n: string; aRefaire: string[] }) {
  const bloque = aRefaire.length > 0;
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
      {bloque ? <span className="petit signal err">Avant « relu » : {aRefaire.join(', ')}</span> : null}
      <BoutonGeste
        geste="valider"
        cible={n}
        classe="btn btn-petit btn-plein"
        libelle="Passer à relu"
        desactive={bloque}
        question={`J’ai lu le Nº ${n} : il passe à « relu » et partira à sa date. Confirmer ?`}
      />
    </span>
  );
}
