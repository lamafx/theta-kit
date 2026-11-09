'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

// Compteur maison, sans cookie (app/api/compter) : une page vue par changement d'adresse, et les événements
// des labos (étape atteinte, quiz réussi) émis par le moteur. Rien n'est envoyé si le navigateur demande
// à ne pas être suivi, ni depuis l'aperçu réservé à l'auteur.

function suivi() {
  if (typeof navigator === 'undefined') return false;
  if (navigator.doNotTrack === '1' || (navigator as any).globalPrivacyControl === true) return false;
  return !location.pathname.includes('/apercu/');
}

export function envoyer(donnees: Record<string, unknown>) {
  if (!suivi()) return;
  const corps = JSON.stringify(donnees);
  try {
    if (navigator.sendBeacon?.('/api/compter', new Blob([corps], { type: 'text/plain' }))) return;
  } catch {}
  fetch('/api/compter', { method: 'POST', body: corps, keepalive: true }).catch(() => {});
}

export default function Compteur() {
  const chemin = usePathname();
  useEffect(() => {
    let premiere = false;
    try {
      premiere = !sessionStorage.getItem('theta-visite');
      sessionStorage.setItem('theta-visite', '1');
    } catch {}
    envoyer({ t: 'page', p: chemin, premiere, r: premiere ? document.referrer : '' });
  }, [chemin]);
  useEffect(() => {
    const surLabo = (e: Event) => envoyer({ t: 'labo', ...(e as CustomEvent).detail });
    window.addEventListener('theta:labo', surLabo);
    return () => window.removeEventListener('theta:labo', surLabo);
  }, []);
  return null;
}
