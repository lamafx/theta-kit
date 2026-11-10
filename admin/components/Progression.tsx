'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

/** Fine barre bleue en haut de l'écran pendant une navigation, comme un signe que le clic a été pris. */
export default function Progression() {
  const chemin = usePathname();
  const params = useSearchParams();
  const [actif, setActif] = useState(false);
  useEffect(() => setActif(false), [chemin, params]);
  useEffect(() => {
    const clic = (e: MouseEvent) => {
      const a = (e.target as HTMLElement)?.closest?.('a');
      if (!a || a.target === '_blank' || e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
      const url = new URL(a.href, location.href);
      if (url.origin !== location.origin || !url.pathname.startsWith('/admin') || url.pathname.startsWith('/admin/api')) return;
      if (url.pathname + url.search === location.pathname + location.search) return;
      setActif(true);
    };
    document.addEventListener('click', clic, true);
    return () => document.removeEventListener('click', clic, true);
  }, []);
  return <div className={`progression${actif ? ' active' : ''}`} aria-hidden="true" />;
}
