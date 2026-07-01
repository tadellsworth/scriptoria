# VIGOR

A single-file, offline-capable **workout PWA** — a daily strength & mobility routine.
Vanilla HTML/CSS/JS, no frameworks, localStorage only. Built to be installed on a phone
(Android-first) from a static HTTPS host.

## Build
```
python3 build.py          # -> dist/index.html + dist/sw.js
VIGOR_OUT=/some/dir python3 build.py   # custom output dir
```
`build.py` extracts the inline JS, runs `node --check`, and injects the icons.

## Develop
Edit **`src/app_template.html`** (the whole app), then rebuild. Never hand-edit `dist/`.
Icons live in `src/icons_b64.py` (regenerate with `src/make_icons.py`, needs Pillow).

## Deploy
Put `dist/index.html` + `dist/sw.js` together in their **own folder** on an HTTPS host
(e.g. Netlify). `index.html` at the root of that folder. HTTPS is required for the service
worker and the Android "Install app" prompt.

See **CLAUDE.md** for architecture/conventions and **HANDOFF.md** for state + roadmap.
