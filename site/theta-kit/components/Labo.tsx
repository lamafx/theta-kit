'use client';

import { LaboEngine } from '@/lib/engines/labo';
import { useMoteur } from './Moteur';
import LaboView from './views/LaboView';
import '@/styles/labo.css';

export default function Labo(p: any) {
  const onTheme = (k: string) => window.history.replaceState(null, '', `${p.href.labo}/${k}`);
  return <LaboView {...useMoteur(LaboEngine, { ...p, onTheme })} />;
}
