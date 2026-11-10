'use client';

import { useState } from 'react';
import Anneaux from '@/components/Anneaux';
import Robot3D from '@/components/Robot3D';
import { api } from '@/lib/client';

export default function Connexion({ suite, configure }: { suite: string; configure: boolean }) {
  const [mdp, setMdp] = useState('');
  const [erreur, setErreur] = useState<string | null>(null);
  const [envoi, setEnvoi] = useState(false);
  const [ok, setOk] = useState(false);

  async function envoyer(e: React.FormEvent) {
    e.preventDefault();
    setEnvoi(true);
    setErreur(null);
    try {
      await api('connexion', { corps: { motDePasse: mdp } });
      setOk(true);
      location.href = `/admin${suite === '/' ? '' : suite}`;
    } catch (x) {
      setErreur((x as Error).message);
      setEnvoi(false);
    }
  }

  return (
    <main className="connexion">
      <Anneaux />
      <div className="boite">
        <Robot3D expression={ok ? 'happy' : 'neutral'} />
        <p className="sur">Série θ Théta</p>
        <h1>
          Espace <em>réservé</em>
        </h1>
        <p className="chapeau" style={{ margin: '10px auto 0' }}>
          Seul l’auteur de la série y a accès.
        </p>
        {!configure ? (
          <p className="message erreur" style={{ marginTop: 18 }}>
            L’admin n’est pas encore configuré : le mot de passe doit être défini sur Vercel (voir admin/LISEZ-MOI.md).
          </p>
        ) : (
          <form onSubmit={envoyer} className="carte">
            <label className="champ">
              <span>Mot de passe</span>
              <input className="entree" type="password" autoComplete="current-password" required autoFocus value={mdp} onChange={(e) => setMdp(e.target.value)} />
            </label>
            {erreur ? <p className="message erreur" role="alert">{erreur}</p> : null}
            <button className="btn btn-plein" style={{ width: '100%', marginTop: 6 }} disabled={envoi || !mdp}>
              {envoi ? <span className="chargement" /> : null} Entrer
            </button>
          </form>
        )}
      </div>
    </main>
  );
}
