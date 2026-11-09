'use client';

import { useEffect } from 'react';

/** Enregistre le service worker de la PWA, limité à /admin/. */
export default function EnregistrerSW() {
  useEffect(() => {
    if (!('serviceWorker' in navigator) || location.hostname === 'localhost' && !location.search.includes('sw')) return;
    navigator.serviceWorker.register('/admin/sw.js', { scope: '/admin/' }).catch(() => {});
  }, []);
  return null;
}
