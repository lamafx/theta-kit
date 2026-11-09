'use client';

import { useEffect, useRef } from 'react';
import { LaboEngine } from '@/lib/engines/labo';
import { envoyer } from './Compteur';
import { useMoteur } from './Moteur';
import LaboView from './views/LaboView';
import '@/styles/labo.css';

export default function Labo(p: any) {
  // Compteur maison : labo ouvert, puis temps passé sur ce labo (envoyé en quittant ou en changeant de labo).
  const courant = useRef<{ id: string; debut: number } | null>(null);
  const fermer = () => {
    const c = courant.current;
    if (c) envoyer({ t: 'labo', id: c.id, e: 'temps', s: (Date.now() - c.debut) / 1000 });
    courant.current = null;
  };
  const ouvrir = (id: string) => {
    fermer();
    courant.current = { id, debut: Date.now() };
    envoyer({ t: 'labo', id, e: 'ouvert' });
  };
  useEffect(() => {
    if (p.theme) ouvrir(p.theme);
    const cache = () => {
      if (document.visibilityState === 'hidden') fermer();
      else if (!courant.current && p.theme) courant.current = { id: new URL(location.href).pathname.split('/').pop() || p.theme, debut: Date.now() };
    };
    document.addEventListener('visibilitychange', cache);
    return () => {
      document.removeEventListener('visibilitychange', cache);
      fermer();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const onTheme = (k: string) => {
    if (!p.apercu) window.history.replaceState(null, '', `${p.href.labo}/${k}`);
    ouvrir(k);
  };
  return <LaboView {...useMoteur(LaboEngine, { ...p, onTheme })} />;
}
