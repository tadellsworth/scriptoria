/* Habla service worker — offline support + installability.
   Lives beside index.html, so its scope is this folder only
   (/scriptoria/habla/) and it never touches sibling apps.
   Bump CACHE to force-refresh installed clients. */
const CACHE = 'habla-v1';
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
  if (req.mode === 'navigate') {
    e.respondWith(
      fetch(req).then(r => { const c = r.clone(); caches.open(CACHE).then(x => x.put(req, c)); return r; })
        .catch(() => caches.match(req).then(m => m || caches.match('./index.html')).then(m => m || caches.match('./')))
    );
    return;
  }
  e.respondWith(
    caches.match(req).then(m => {
      const net = fetch(req).then(r => { const c = r.clone(); caches.open(CACHE).then(x => x.put(req, c).catch(() => {})); return r; }).catch(() => m);
      return m || net;
    })
  );
});
