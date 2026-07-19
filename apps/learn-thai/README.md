# Learn Thai — เรียนภาษาไทย

A single-file, installable **progressive web app** for learning the Thai language
(script, sounds, vocabulary, and listening practice).

Live: `https://tadellsworth.github.io/scriptoria/learn-thai/`

## What it is

`index.html` is the whole app — all CSS, JavaScript, and the Apple touch icon are
inlined (the icon is an embedded base64 PNG). There is **no build step**; the page
is served as-is. It has no local file dependencies and no runtime state
(no `localStorage`); the only external requirement is **Google Fonts** (Fraunces /
Plus Jakarta Sans / Noto Sans Thai) over the network.

## PWA layer (added when it was brought into this repo)

The original export shipped without a manifest or service worker. To make it
installable on Android/Chrome and usable offline (it was already iOS-installable
via Apple web-app meta tags), the following were added alongside the app:

```
learn-thai/
  index.html            # the app (original export + a <link rel="manifest"> and a tiny SW registration)
  manifest.webmanifest  # name, colors, icons, standalone display
  sw.js                 # offline cache (network-first navigation); bump CACHE to force-refresh
  icon-192.png          # manifest icon (derived from the inlined 180px icon)
  icon-512.png          # manifest icon (derived from the inlined 180px icon)
  README.md
```

The service worker sits next to `index.html`, so its scope is this folder only
(`/scriptoria/learn-thai/`) and it never caches sibling apps.

> The manifest icons were upscaled from the app's inlined 180×180 Apple touch icon.
> iOS home-screen installs use the crisp inline 180px icon directly. Dropping in the
> 1024×1024 source (`learn-thai-icon-1024.png`) and regenerating `icon-512`/`icon-192`
> would sharpen the Android/Chrome install icon.

## Deploy

No build — the Pages workflow copies this folder to `_site/learn-thai/`. Editing
`index.html` and bumping `sw.js`'s `CACHE` name pushes the update to installed clients.
