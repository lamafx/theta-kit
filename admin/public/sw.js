// Service worker de θ Admin (portée /admin/ seulement : il ne touche jamais au site public ni aux labos).
// Hors ligne : la dernière version vue de chaque page s'affiche, marquée hors ligne ; aucun geste ne part
// hors ligne et rien n'est mis en file d'attente.
const VERSION = 'theta-admin-v1';
const COQUILLE = ['/admin/hors-ligne', '/admin/icones/icone-192.png', '/admin/icones/badge-96.png'];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(VERSION).then((c) => c.addAll(COQUILLE)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((cles) => Promise.all(cles.filter((k) => k !== VERSION && k !== `${VERSION}-pages`).map((k) => caches.delete(k)))).then(() => self.clients.claim()),
  );
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== location.origin || !url.pathname.startsWith('/admin')) return;
  // Fichiers statiques versionnés : le cache d'abord.
  if (url.pathname.startsWith('/admin/_next/static/') || url.pathname.startsWith('/admin/icones/')) {
    e.respondWith(caches.match(req).then((r) => r || fetch(req).then((rep) => { const copie = rep.clone(); caches.open(VERSION).then((c) => c.put(req, copie)); return rep; })));
    return;
  }
  // Pages : le réseau d'abord, la dernière version vue sinon.
  if (req.mode === 'navigate') {
    e.respondWith(
      fetch(req)
        .then((rep) => {
          if (rep.ok && !rep.redirected) { const copie = rep.clone(); caches.open(`${VERSION}-pages`).then((c) => c.put(req, copie)); }
          return rep;
        })
        .catch(() => caches.open(`${VERSION}-pages`).then((c) => c.match(req)).then((r) => r || caches.match('/admin/hors-ligne'))),
    );
  }
});

self.addEventListener('message', (e) => {
  // À la déconnexion : on efface tout ce qui a été gardé sur l'appareil.
  if (e.data === 'vider') e.waitUntil(caches.keys().then((cles) => Promise.all(cles.map((k) => caches.delete(k)))));
});

self.addEventListener('push', (e) => {
  let d = {};
  try { d = e.data ? e.data.json() : {}; } catch { d = { texte: e.data && e.data.text() }; }
  e.waitUntil(
    self.registration.showNotification(d.titre || 'θ Admin', {
      body: d.texte || '',
      icon: '/admin/icones/icone-192.png',
      badge: '/admin/icones/badge-96.png',
      tag: d.tag || undefined,
      data: { lien: d.lien || '/admin/' },
    }),
  );
});

self.addEventListener('notificationclick', (e) => {
  e.notification.close();
  const lien = (e.notification.data && e.notification.data.lien) || '/admin/';
  e.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((fenetres) => {
      for (const f of fenetres) if (f.url.includes('/admin')) { f.navigate(lien); return f.focus(); }
      return self.clients.openWindow(lien);
    }),
  );
});
