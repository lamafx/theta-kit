'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

/** Les fenêtres de confirmation vont dans <body> : une carte floutée (backdrop-filter) piégerait position: fixed. */
function Fenetre({ children }: { children: React.ReactNode }) {
  const [pret, setPret] = useState(false);
  useEffect(() => setPret(true), []);
  return pret ? createPortal(children, document.body) : null;
}
import { api } from '@/lib/client';
import { DELAI_ANNULATION, GESTES, type CleGeste } from '@/lib/gestes';

type Lance = { jeton: string; workflow: string; depuis: string };
type Suivi = { etat: 'en_attente' | 'en_cours' | 'fini' | 'inconnu'; conclusion?: string | null; lien?: string; messages?: { niveau: string; titre: string; message: string }[]; erreur?: string };

/** Suit la tournée lancée par un geste jusqu'à son résultat, puis rafraîchit l'écran. */
export function SuiviGeste({ lance, onFini }: { lance: Lance; onFini?: (ok: boolean) => void }) {
  const [s, setS] = useState<Suivi>({ etat: 'en_attente' });
  const router = useRouter();
  const fini = useRef(false);
  useEffect(() => {
    let arret = false;
    const debut = Date.now();
    const tick = async () => {
      if (arret || fini.current) return;
      try {
        const r = await api<Suivi>(`suivi?workflow=${lance.workflow}&jeton=${lance.jeton}&depuis=${encodeURIComponent(lance.depuis)}`);
        if (arret) return;
        setS(r);
        if (r.etat === 'fini') {
          fini.current = true;
          onFini?.(r.conclusion === 'success');
          // L'état en direct (etat.yaml sur GitHub) se relit en 30 s ; le site et l'instantané suivent au redéploiement.
          setTimeout(() => router.refresh(), 2500);
          setTimeout(() => router.refresh(), 35000);
          return;
        }
      } catch {}
      if (Date.now() - debut < 15 * 60000) setTimeout(tick, 4000);
    };
    setTimeout(tick, 2500);
    return () => {
      arret = true;
    };
  }, [lance, onFini, router]);

  const ok = s.etat === 'fini' && s.conclusion === 'success';
  const ko = s.etat === 'fini' && s.conclusion !== 'success';
  return (
    <div className={`message${ok ? ' ok' : ko ? ' erreur' : ''}`} role="status" style={{ marginTop: 12 }}>
      <p style={{ margin: 0, display: 'flex', alignItems: 'center', gap: 10 }}>
        {s.etat !== 'fini' ? <span className="chargement" /> : null}
        {s.etat === 'en_attente' && 'Geste envoyé, la tournée GitHub démarre…'}
        {s.etat === 'en_cours' && 'Tournée en cours sur GitHub…'}
        {s.etat === 'inconnu' && `Suivi indisponible${s.erreur ? ` (${s.erreur})` : ''} : voyez la tournée sur GitHub.`}
        {ok && 'Fait. L’écran se met à jour dans quelques secondes.'}
        {ko && `La tournée a échoué ou a refusé le geste (${s.conclusion ?? 'inconnu'}).`}
      </p>
      {s.messages?.length ? (
        <ul className="liste-points" style={{ marginTop: 8 }}>
          {s.messages.map((m, i) => (
            <li key={i}>
              {m.titre ? <b>{m.titre} : </b> : null}
              {m.message}
            </li>
          ))}
        </ul>
      ) : null}
      {s.lien ? (
        <p className="petit" style={{ margin: '8px 0 0' }}>
          <a href={s.lien} target="_blank" rel="noreferrer">
            Voir la tournée sur GitHub
          </a>
        </p>
      ) : null}
    </div>
  );
}

/** Bouton d'un geste simple : une confirmation, puis le suivi. */
export function BoutonGeste({
  geste, cible = '', valeur, libelle, question, classe = 'btn', desactive = false, avantEnvoi,
}: {
  geste: CleGeste; cible?: string; valeur?: unknown; libelle?: string; question?: string; classe?: string; desactive?: boolean; avantEnvoi?: () => unknown;
}) {
  const [ouvert, setOuvert] = useState(false);
  const [envoi, setEnvoi] = useState(false);
  const [erreur, setErreur] = useState<string | null>(null);
  const [lance, setLance] = useState<Lance | null>(null);
  async function envoyer() {
    setEnvoi(true);
    setErreur(null);
    try {
      const v = avantEnvoi ? avantEnvoi() : valeur;
      const r = await api<Lance>('geste', { corps: { geste, cible, valeur: v } });
      setLance(r);
      setOuvert(false);
    } catch (e) {
      setErreur((e as Error).message);
    } finally {
      setEnvoi(false);
    }
  }
  return (
    <>
      <button type="button" className={classe} data-geste disabled={desactive || envoi} onClick={() => (question ? setOuvert(true) : envoyer())}>
        {envoi ? <span className="chargement" /> : null}
        {libelle ?? GESTES[geste].libelle}
      </button>
      {ouvert ? (
        <Fenetre>
        <div className="confirmation" role="dialog" aria-modal="true">
          <div className="carte">
            <p className="sur">Confirmation</p>
            <h2 style={{ fontSize: 22 }}>{question}</h2>
            {erreur ? <p className="message erreur">{erreur}</p> : null}
            <div className="btns" style={{ marginTop: 18 }}>
              <button className="btn btn-plein" onClick={envoyer} disabled={envoi}>
                {envoi ? <span className="chargement" /> : null} Confirmer
              </button>
              <button className="btn" onClick={() => setOuvert(false)}>
                Annuler
              </button>
            </div>
          </div>
        </div>
        </Fenetre>
      ) : null}
      {!ouvert && erreur ? <p className="message erreur">{erreur}</p> : null}
      {lance ? <SuiviGeste lance={lance} /> : null}
    </>
  );
}

/**
 * Geste sensible, dans la salle de publication : récapitulatif, phrase à taper, délai d'annulation, suivi.
 * (L'entrée dans la salle, par le mot de passe, est la première confirmation.)
 */
export function GesteSensible({
  geste, cible = '', valeur = '', recapitulatif, libelle, classe = 'btn', desactive = false,
}: {
  geste: CleGeste; cible?: string; valeur?: string; recapitulatif: React.ReactNode; libelle?: string; classe?: string; desactive?: boolean;
}) {
  const def = GESTES[geste];
  const attendue = def.phrase?.(cible, valeur) ?? '';
  const [etape, setEtape] = useState<0 | 1 | 2 | 3>(0);
  const [phrase, setPhrase] = useState('');
  const [reste, setReste] = useState(DELAI_ANNULATION);
  const [erreur, setErreur] = useState<string | null>(null);
  const [lance, setLance] = useState<Lance | null>(null);
  const minuterie = useRef<ReturnType<typeof setInterval> | null>(null);

  const fermer = () => {
    if (minuterie.current) clearInterval(minuterie.current);
    setEtape(0);
    setPhrase('');
    setReste(DELAI_ANNULATION);
  };

  const demarrerCompte = () => {
    setEtape(3);
    setReste(DELAI_ANNULATION);
    let r = DELAI_ANNULATION;
    minuterie.current = setInterval(async () => {
      r -= 1;
      setReste(r);
      if (r <= 0) {
        if (minuterie.current) clearInterval(minuterie.current);
        try {
          const l = await api<Lance>('geste', { corps: { geste, cible, valeur, phrase } });
          setLance(l);
          fermer();
        } catch (e) {
          setErreur((e as Error).message);
          setEtape(2);
          if ((e as any).message?.includes('Salle')) location.reload();
        }
      }
    }, 1000);
  };

  useEffect(() => () => { if (minuterie.current) clearInterval(minuterie.current); }, []);

  return (
    <>
      <button type="button" className={classe} data-geste disabled={desactive} onClick={() => { setErreur(null); setEtape(1); }}>
        {libelle ?? def.libelle}
      </button>
      {etape > 0 ? (
        <Fenetre>
        <div className="confirmation" role="dialog" aria-modal="true" aria-label={def.libelle}>
          <div className="carte">
            <div className="etapes" aria-hidden="true">
              <i className="fait" />
              <i className={etape > 1 ? 'fait' : 'encours'} />
              <i className={etape > 2 ? 'fait' : etape === 2 ? 'encours' : ''} />
              <i className={etape === 3 ? 'encours' : ''} />
              <i />
            </div>
            {etape === 1 ? (
              <>
                <p className="sur">Étape 2 sur 5 · Récapitulatif</p>
                <h2 style={{ fontSize: 22 }}>{def.libelle}</h2>
                {def.effet ? <p className="message">{def.effet}</p> : null}
                <div style={{ margin: '14px 0' }}>{recapitulatif}</div>
                <div className="btns">
                  <button className="btn btn-plein" onClick={() => setEtape(2)}>
                    J’ai vérifié, continuer
                  </button>
                  <button className="btn" onClick={fermer}>
                    Annuler
                  </button>
                </div>
              </>
            ) : null}
            {etape === 2 ? (
              <>
                <p className="sur">Étape 3 sur 5 · Phrase de confirmation</p>
                <p>Recopiez exactement :</p>
                <p className="phrase">{attendue}</p>
                <input className="entree" style={{ marginTop: 12 }} autoFocus autoCapitalize="characters" autoComplete="off" spellCheck={false} value={phrase} onChange={(e) => setPhrase(e.target.value)} aria-label="Phrase de confirmation" />
                {erreur ? <p className="message erreur" style={{ marginTop: 10 }}>{erreur}</p> : null}
                <div className="btns" style={{ marginTop: 14 }}>
                  <button className="btn btn-alerte" disabled={phrase.trim().toUpperCase() !== attendue} onClick={demarrerCompte}>
                    Lancer dans {DELAI_ANNULATION} secondes
                  </button>
                  <button className="btn" onClick={fermer}>
                    Annuler
                  </button>
                </div>
              </>
            ) : null}
            {etape === 3 ? (
              <>
                <p className="sur">Étape 4 sur 5 · Délai d’annulation</p>
                <p className="compte" aria-live="polite">{Math.max(0, reste)}</p>
                <p style={{ textAlign: 'center' }}>{reste > 0 ? 'Le geste part à zéro.' : 'Envoi…'}</p>
                <button className="btn btn-plein" style={{ width: '100%', minHeight: 56, fontSize: 17 }} onClick={fermer} disabled={reste <= 0}>
                  Annuler
                </button>
              </>
            ) : null}
          </div>
        </div>
        </Fenetre>
      ) : null}
      {lance ? <SuiviGeste lance={lance} /> : null}
    </>
  );
}
