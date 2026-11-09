'use client';

import { useState } from 'react';
import { GesteSensible } from '@/components/Geste';
import { dateLongue } from '@/lib/format';

/** Reporter ou avancer un post, entre le post précédent et le suivant (l'ordre des notions ne change jamais). */
export default function Reporter({ n, titre, actuelle, avant, apres }: { n: string; titre: string; actuelle: string; avant: string | null; apres: string | null }) {
  const [ouvert, setOuvert] = useState(false);
  const [quand, setQuand] = useState(actuelle.slice(0, 16));
  const iso = quand ? `${quand}:00.000Z` : '';
  const d = quand ? new Date(iso) : null;
  // La tournée GitHub passe du mardi au vendredi, de 8 h à 10 h 55 (heure d'Abidjan = UTC).
  const creneau = !!d && d.getUTCDay() >= 2 && d.getUTCDay() <= 5 && d.getUTCHours() * 60 + d.getUTCMinutes() >= 480 && d.getUTCHours() * 60 + d.getUTCMinutes() <= 655;
  const dansLOrdre = !!quand && (!avant || iso > avant) && (!apres || iso < apres) && new Date(iso).getTime() > Date.now() + 10 * 60000 && creneau;
  if (!ouvert) {
    return (
      <button type="button" className="btn btn-petit" data-geste onClick={() => setOuvert(true)}>
        Reporter
      </button>
    );
  }
  return (
    <span style={{ display: 'inline-flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
      <input
        className="entree"
        style={{ minHeight: 36, padding: '4px 10px', width: 'auto' }}
        type="datetime-local"
        value={quand}
        min={avant?.slice(0, 16)}
        max={apres?.slice(0, 16)}
        onChange={(e) => setQuand(e.target.value)}
        aria-label={`Nouvelle date du Nº ${n} (heure d’Abidjan)`}
      />
      <GesteSensible
        geste="reporter"
        cible={n}
        valeur={quand.replace('T', ' ')}
        classe="btn btn-petit btn-sensible"
        libelle="Valider la date"
        desactive={!dansLOrdre || iso.slice(0, 16) === actuelle.slice(0, 16)}
        recapitulatif={
          <ul className="lignes">
            <li><span className="discret">Épisode</span><span className="fin">Nº {n} · {titre}</span></li>
            <li><span className="discret">Avant</span><span className="fin">{dateLongue(actuelle)}</span></li>
            <li><span className="discret">Après</span><span className="fin">{dateLongue(iso)}</span></li>
            <li><span className="discret">Bornes</span><span className="fin petit">après {avant ? dateLongue(avant) : 'le lancement'}, avant {apres ? dateLongue(apres) : '—'}</span></li>
          </ul>
        }
      />
      <button type="button" className="btn btn-petit" onClick={() => setOuvert(false)}>Fermer</button>
      {!dansLOrdre ? <span className="signal err">Entre le post précédent et le suivant, dans le futur, du mardi au vendredi entre 8 h et 10 h 55.</span> : null}
    </span>
  );
}
