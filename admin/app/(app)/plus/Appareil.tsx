'use client';

import { useEffect, useState } from 'react';
import { IcCloche, IcSortie } from '@/components/Icones';
import { api } from '@/lib/client';

function cleOctets(b64: string) {
  const s = atob((b64 + '='.repeat((4 - (b64.length % 4)) % 4)).replace(/-/g, '+').replace(/_/g, '/'));
  return Uint8Array.from(s, (c) => c.charCodeAt(0));
}

/** Installation de la PWA, notifications de cet appareil, déconnexion. */
export default function Appareil({ vapid }: { vapid: string }) {
  const [installable, setInstallable] = useState<any>(null);
  const [installee, setInstallee] = useState(false);
  const [abonne, setAbonne] = useState<boolean | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const ios = typeof navigator !== 'undefined' && /iphone|ipad|ipod/i.test(navigator.userAgent);

  useEffect(() => {
    setInstallee(window.matchMedia('(display-mode: standalone)').matches || (navigator as any).standalone === true);
    const avant = (e: Event) => {
      e.preventDefault();
      setInstallable(e);
    };
    window.addEventListener('beforeinstallprompt', avant);
    navigator.serviceWorker?.ready.then((r) => r.pushManager?.getSubscription()).then((s) => setAbonne(!!s)).catch(() => setAbonne(false));
    return () => window.removeEventListener('beforeinstallprompt', avant);
  }, []);

  async function activer() {
    setMessage(null);
    try {
      if (!vapid) throw new Error('Notifications non configurées sur Vercel (clés VAPID).');
      const permis = await Notification.requestPermission();
      if (permis !== 'granted') throw new Error('Autorisation refusée dans le navigateur.');
      const reg = await navigator.serviceWorker.register('/admin/sw.js', { scope: '/admin/' });
      await navigator.serviceWorker.ready;
      const sub = await reg.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: cleOctets(vapid) });
      await api('push', { corps: { abonnement: sub.toJSON() } });
      setAbonne(true);
      setMessage('Notifications activées sur cet appareil.');
    } catch (e) {
      setMessage((e as Error).message);
    }
  }

  async function couper() {
    const reg = await navigator.serviceWorker.ready;
    const sub = await reg.pushManager.getSubscription();
    if (sub) {
      await api('push', { method: 'DELETE', corps: { endpoint: sub.endpoint } }).catch(() => {});
      await sub.unsubscribe();
    }
    setAbonne(false);
  }

  async function deconnecter() {
    await api('connexion', { method: 'DELETE', corps: {} }).catch(() => {});
    navigator.serviceWorker?.controller?.postMessage('vider');
    location.href = '/admin/connexion';
  }

  return (
    <div style={{ display: 'grid', gap: 16 }}>
      <div>
        <h3>Application</h3>
        {installee ? (
          <p className="discret" style={{ margin: 0 }}>Installée sur cet appareil.</p>
        ) : installable ? (
          <button className="btn btn-plein" onClick={async () => { installable.prompt(); await installable.userChoice; setInstallable(null); }}>
            Installer θ Admin
          </button>
        ) : ios ? (
          <p className="discret" style={{ margin: 0 }}>Sur iPhone : bouton Partager de Safari, puis « Sur l’écran d’accueil ».</p>
        ) : (
          <p className="discret" style={{ margin: 0 }}>Menu du navigateur, puis « Installer l’application ».</p>
        )}
      </div>
      <div>
        <h3>Notifications</h3>
        <p className="petit discret" style={{ marginTop: 0 }}>
          Post publié ou échoué, alerte de la tournée, avance sous le minimum, labo sans recette à 7 jours, jeton à renouveler.{ios ? ' Sur iPhone, elles ne marchent qu’une fois l’application installée.' : ''}
        </p>
        <div className="btns">
          {abonne ? (
            <>
              <button className="btn" onClick={() => api('push', { corps: { essai: true } }).then(() => setMessage('Notification d’essai envoyée.')).catch((e) => setMessage(e.message))}>
                <IcCloche /> Essayer
              </button>
              <button className="btn" onClick={couper}>Couper sur cet appareil</button>
            </>
          ) : (
            <button className="btn btn-plein" onClick={activer} disabled={abonne === null}>
              <IcCloche /> Activer
            </button>
          )}
        </div>
        {message ? <p className="message" style={{ marginTop: 10 }}>{message}</p> : null}
      </div>
      <div>
        <h3>Session</h3>
        <button className="btn" onClick={deconnecter}>
          <IcSortie /> Se déconnecter et effacer les données de cet appareil
        </button>
      </div>
    </div>
  );
}
