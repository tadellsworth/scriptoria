# Scriptoria monorepo

Two independent Catholic web apps, developed side by side in one repo and published to a
single GitHub Pages site under separate paths.

| App | Source | Live URL | Stack |
|-----|--------|----------|-------|
| **Scriptoria** | [`apps/scriptoria/`](apps/scriptoria/) | `https://tadellsworth.github.io/scriptoria/` | Vite + React PWA |
| **Lumen** | [`apps/lumen/`](apps/lumen/) | `https://tadellsworth.github.io/scriptoria/lumen/` | Vanilla-JS PWA, Python build tooling |

Each app has its own toolchain, build, and service worker. They share nothing at runtime —
editing one never touches the other.

## Layout

```
.
├── apps/
│   ├── scriptoria/        Vite + React PWA (its own package.json, vite.config.ts)
│   └── lumen/             single-file PWA + Python corpus/build tooling (formato)
└── .github/workflows/
    └── deploy.yml         builds both apps → publishes to GitHub Pages
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

## Deploy

Pushing to `main` runs [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml), which
builds both apps and publishes them to GitHub Pages — Scriptoria at the site root, Lumen at
`/lumen/`.

**One-time setup:** in the repo's **Settings → Pages → Build and deployment**, set
**Source** to **GitHub Actions**. After that every push to `main` deploys automatically (or
run the workflow manually from the **Actions** tab).

> Scriptoria's Vite `base` is `/scriptoria/` to match the Pages project URL. If the repo is
> ever renamed or moved to a custom domain, update `base` (and the PWA `scope`/`start_url`)
> in `apps/scriptoria/vite.config.ts`. Lumen uses only relative paths, so it needs no such
> change.
