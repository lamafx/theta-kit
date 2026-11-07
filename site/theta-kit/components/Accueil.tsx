'use client';

import { MainEngine } from '@/lib/engines/main';
import { useMoteur } from './Moteur';
import MainView from './views/MainView';
import '@/styles/accueil.css';

export default function Accueil(p: any) {
  return <MainView {...useMoteur(MainEngine, p)} />;
}
