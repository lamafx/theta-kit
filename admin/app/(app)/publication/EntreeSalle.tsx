'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Robot3D from '@/components/Robot3D';
import { api } from '@/lib/client';

/** Étape 1 sur 5 de chaque geste sensible : ressaisir le mot de passe, pour 10 minutes de salle. */
export default function EntreeSalle() {
  const [mdp, setMdp] = useState('');
  const [erreur, setErreur] = useState<string | null>(null);
  const [envoi, setEnvoi] = useState(false);
  const router = useRouter();
  async function entrer(e: React.FormEvent) {
    e.preventDefault();
    setEnvoi(true);
    setErreur(null);
    try {
      await api('connexion', { corps: { motDePasse: mdp, salle: true } });
      router.refresh();
    } catch (x) {
      setErreur((x as Error).message);
      setEnvoi(false);
    }
  }
  return (
    <div className="carte mise" style={{ maxWidth: 460, textAlign: 'center' }}>
      <div style={{ width: 150, margin: '0 auto' }}>
        <Robot3D />
      </div>
      <p className="sur">Étape 1 sur 5 · Entrée dans la salle</p>
      <form onSubmit={entrer} style={{ textAlign: 'left' }}>
        <label className="champ">
          <span>Mot de passe</span>
          <input className="entree" type="password" autoComplete="current-password" required value={mdp} onChange={(e) => setMdp(e.target.value)} />
        </label>
        {erreur ? <p className="message erreur">{erreur}</p> : null}
        <button className="btn btn-plein" style={{ width: '100%' }} disabled={envoi || !mdp}>
          {envoi ? <span className="chargement" /> : null} Ouvrir la salle pour 10 minutes
        </button>
      </form>
    </div>
  );
}
