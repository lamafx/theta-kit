'use client';

import { useEffect, useState } from 'react';
import { dateLongue } from '@/lib/format';

/** Bandeau hors ligne : l'écran montre le dernier état chargé, et les gestes sont grisés. */
export default function HorsLigne({ genereLe }: { genereLe: string }) {
  const [hors, setHors] = useState(false);
  useEffect(() => {
    const maj = () => {
      setHors(!navigator.onLine);
      document.documentElement.classList.toggle('hors-ligne', !navigator.onLine);
    };
    maj();
    window.addEventListener('online', maj);
    window.addEventListener('offline', maj);
    return () => {
      window.removeEventListener('online', maj);
      window.removeEventListener('offline', maj);
    };
  }, []);
  if (!hors) return null;
  return (
    <p className="message" role="status" style={{ marginBottom: 16 }}>
      Hors ligne · état du {dateLongue(genereLe)}. Aucun geste ne part sans réseau.
    </p>
  );
}
