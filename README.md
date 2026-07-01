# Scriptoria monorepo

Independent personal PWAs, developed side by side in one repo and published to a single
GitHub Pages site under separate paths.

| App | Source | Live URL | Stack |
|-----|--------|----------|-------|
| **Scriptoria** | [`apps/scriptoria/`](apps/scriptoria/) | `https://tadellsworth.github.io/scriptoria/` | Vite + React PWA |
| **Lumen** | [`apps/lumen/`](apps/lumen/) | `https://tadellsworth.github.io/scriptoria/lumen/` | Vanilla-JS PWA, Python build tooling |
| **Bloom** | [`apps/bloom/`](apps/bloom/) | `https://tadellsworth.github.io/scriptoria/bloom/` | Vanilla-JS PWA, Python build tooling |
| **Vigor** | [`apps/vigor/`](apps/vigor/) | `https://tadellsworth.github.io/scriptoria/vigor/` | Vanilla-JS PWA, Python build tooling |

Each app has its own toolchain, build, and service worker. They share nothing at runtime —
editing one never touches the other.

## Layout

```
.
├── apps/
│   ├── scriptoria/  Vite + React PWA (its own package.json, vite.config.ts)
│   ├── lumen/       single-file PWA + Python corpus/build tooling (formato)
│   ├── bloom/       single-file PWA + Python build tooling (strength-progression workouts)
│   └── vigor/       single-file PWA + Python build tooling (daily strength & mobility)
└── .github/workflows/
    └── deploy.yml         builds every app → publishes to GitHub Pages
```

## Develop

**Scriptoria** (Node 20):

```bash
cd apps/scriptoria
npm install
npm run dev          # local dev server
npm run build        # production build → apps/scriptoria/dist
```

**Lumen** (Python 3 + Node for the syntax gate):

```bash
cd apps/lumen/app
python3 test_engine.py   # 42 engine tests
python3 build.py         # assemble → apps/lumen/dist (index.html, content.json, depth.json, sw.js)
```

`build.py` writes to `apps/lumen/dist` by default; override with `LUMEN_OUT=/path` or
`--out /path`. See [`apps/lumen/CLAUDE.md`](apps/lumen/CLAUDE.md) for the full corpus/build
loop and golden rules.

**Bloom** (Python 3 + Node for the syntax gate):

```bash
cd apps/bloom
python3 build.py       # assemble → apps/bloom/dist/index.html; sw.js is hand-maintained, copy it in alongside
```

`build.py` writes to `apps/bloom/dist` by default; override with `BLOOM_OUT=/path`. See
[`apps/bloom/BLOOM-HANDOFF.md`](apps/bloom/BLOOM-HANDOFF.md) for the recorded-voice-cue
feature status.

**Vigor** (Python 3 + Node for the syntax gate):

```bash
cd apps/vigor
python3 build.py       # extract inline JS → node --check → inject icons → dist/index.html + sw.js
```

Edit `src/app_template.html` (the whole app), then rebuild — never hand-edit `dist/`.
`build.py` writes to `apps/vigor/dist` by default; override with `VIGOR_OUT=/path`. See
[`apps/vigor/CLAUDE.md`](apps/vigor/CLAUDE.md) for architecture and conventions.

## Deploy

Pushing to `main` runs [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml), which
builds every app and publishes them to GitHub Pages — Scriptoria at the site root, Lumen at
`/lumen/`, Bloom at `/bloom/`, Vigor at `/vigor/`.

**One-time setup:** in the repo's **Settings → Pages → Build and deployment**, set
**Source** to **GitHub Actions**. After that every push to `main` deploys automatically (or
run the workflow manually from the **Actions** tab).

> Scriptoria's Vite `base` is `/scriptoria/` to match the Pages project URL. If the repo is
> ever renamed or moved to a custom domain, update `base` (and the PWA `scope`/`start_url`)
> in `apps/scriptoria/vite.config.ts`. Lumen, Bloom and Vigor use only relative paths, so
> they need no such change.
