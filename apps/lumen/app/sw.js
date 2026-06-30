/* Lumen service worker.
   - app shell + content.json precached for offline
   - navigations: network-first (so new Pages deploys reach installed devices)
   - content.json: stale-while-revalidate (instant from cache, refresh in background)
   - Firebase sync calls pass straight through, never cached */
var CACHE = 'lumen-v19';
var SHELL = ['./', './index.html', './content.json'];

self.addEventListener('install', function (e) {
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE).then(function (c) { return c.addAll(SHELL); }));
});

self.addEventListener('activate', function (e) {
  e.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(keys.map(function (k) { if (k !== CACHE) return caches.delete(k); }));
    }).then(function () { return self.clients.claim(); })
  );
});

self.addEventListener('fetch', function (e) {
  var req = e.request;
  if (req.method !== 'GET') return;
  var url = new URL(req.url);
  if (url.hostname.indexOf('firebaseio.com') !== -1) return;   // sync: passthrough

  // document navigations -> network-first, fall back to cached shell offline
  if (req.mode === 'navigate') {
    e.respondWith(
      fetch(req).then(function (resp) {
        var copy = resp.clone();
        caches.open(CACHE).then(function (c) { c.put('./index.html', copy); });
        return resp;
      }).catch(function () { return caches.match('./index.html'); })
    );
    return;
  }

  // content.json -> stale-while-revalidate
  if (url.origin === self.location.origin && /content\.json$/.test(url.pathname)) {
    e.respondWith(
      caches.open(CACHE).then(function (c) {
        return c.match(req).then(function (cached) {
          var net = fetch(req).then(function (resp) {
            if (resp && resp.ok) c.put(req, resp.clone());
            return resp;
          }).catch(function () { return cached; });
          return cached || net;
        });
      })
    );
    return;
  }

  // other same-origin GETs -> cache-first
  if (url.origin === self.location.origin) {
    e.respondWith(
      caches.match(req).then(function (hit) {
        return hit || fetch(req).then(function (resp) {
          var copy = resp.clone();
          caches.open(CACHE).then(function (c) { c.put(req, copy); });
          return resp;
        }).catch(function () { return caches.match('./index.html'); });
      })
    );
  }
});
