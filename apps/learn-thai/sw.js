/* Learn Thai service worker — offline support + installability.
   Lives in the same folder as index.html, so its scope is this folder only
   (/scriptoria/learn-thai/) and it never touches sibling apps on the site.
   Bump CACHE to force-refresh installed clients. */
const CACHE = 'learn-thai-v1';
const CORE = ['./', './index.html', './manifest.webmanifest', './icon-192.png', './icon-512.png'];

self.addEventListener('install', e => {
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(CORE).catch(() => {})));
});

self.addEventListener('activate', e => {
  e.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)));
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;

  // App page: network-first so updates land, fall back to cache when offline.
  if (req.mode === 'navigate') {
    e.respondWith(
      fetch(req).then(r => {
        const copy = r.clone();
        caches.open(CACHE).then(c => c.put(req, copy));
        return r;
      }).catch(() => caches.match(req).then(m => m || caches.match('./index.html')).then(m => m || caches.match('./')))
    );
    return;
  }

  // Everything else (fonts, icons): serve cache, refresh in the background.
  e.respondWith(
    caches.match(req).then(m => {
      const net = fetch(req).then(r => {
        const copy = r.clone();
        caches.open(CACHE).then(c => c.put(req, copy).catch(() => {}));
        return r;
      }).catch(() => m);
      return m || net;
    })
  );
});
