'use client';

import { ProfilEngine } from '@/lib/engines/profil';
import { useMoteur } from './Moteur';
import ProfilView from './views/ProfilView';
import '@/styles/profil.css';

export default function Profil(p: any) {
  return <ProfilView {...useMoteur(ProfilEngine, p)} />;
}
