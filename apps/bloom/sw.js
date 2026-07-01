/* BLOOM service worker — offline-first shell + recorded-audio cache */
const CACHE = "bloom-v7";
const CORE = [
  "./",
  "./index.html",
  "./audio/cues_on.mp3",
  "./audio/ex_bicyclecrunch.mp3",
  "./audio/ex_birddog.mp3",
  "./audio/ex_breathing.mp3",
  "./audio/ex_bridgemarch.mp3",
  "./audio/ex_burpees.mp3",
  "./audio/ex_calfraise.mp3",
  "./audio/ex_catcow.mp3",
  "./audio/ex_childpose.mp3",
  "./audio/ex_deadbug.mp3",
  "./audio/ex_glutebridge.mp3",
  "./audio/ex_highknees.mp3",
  "./audio/ex_jumplunge.mp3",
  "./audio/ex_kneehug.mp3",
  "./audio/ex_march.mp3",
  "./audio/ex_mountainclimbers.mp3",
  "./audio/ex_plankfull.mp3",
  "./audio/ex_plankjacks.mp3",
  "./audio/ex_plyopushup.mp3",
  "./audio/ex_pushup.mp3",
  "./audio/ex_singlebridge.mp3",
  "./audio/ex_skater.mp3",
  "./audio/ex_splitsquat.mp3",
  "./audio/ex_squat.mp3",
  "./audio/ex_squatjump.mp3",
  "./audio/ex_standoblique.mp3",
  "./audio/finish.mp3",
  "./audio/preview.mp3",
  "./audio/rest.mp3",
  "./audio/switch.mp3"
];

self.addEventListener("install", function (e) {
  self.skipWaiting();
  e.waitUntil(
    caches.open(CACHE).then(function (c) {
      return c.addAll(CORE).catch(function () { /* ignore individual failures */ });
    })
  );
});

self.addEventListener("activate", function (e) {
  e.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(
        keys.map(function (k) { return k === CACHE ? null : caches.delete(k); })
      );
    }).then(function () { return self.clients.claim(); })
  );
});

self.addEventListener("fetch", function (e) {
  var req = e.request;
  if (req.method !== "GET") return;
  // Network-first for navigations so updates land; fall back to cached shell offline.
  if (req.mode === "navigate") {
    e.respondWith(
      fetch(req).then(function (res) {
        var copy = res.clone();
        caches.open(CACHE).then(function (c) { c.put("./index.html", copy); });
        return res;
      }).catch(function () {
        return caches.match("./index.html").then(function (m) { return m || caches.match("./"); });
      })
    );
    return;
  }
  // Cache-first for everything else.
  e.respondWith(
    caches.match(req).then(function (m) {
      return m || fetch(req).then(function (res) {
        if (res && res.status === 200 && res.type === "basic") {
          var copy = res.clone();
          caches.open(CACHE).then(function (c) { c.put(req, copy); });
        }
        return res;
      }).catch(function () { return m; });
    })
  );
});
