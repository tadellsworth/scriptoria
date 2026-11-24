// Retires the old /vigor/ service worker. Only deletes the old app's own caches:
// every app on this domain shares one cache store.
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', e => {
  e.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(k => k.startsWith('vigor-')).map(k => caches.delete(k)));
    await self.registration.unregister();
  })());
});
