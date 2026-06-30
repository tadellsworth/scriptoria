# Lumen — Developer Handoff

> Single-file Catholic formation-feed PWA. Personal project (keep it separate from any
> Precision Custom Home Builders work). This file is the standing context for Claude Code —
> read it before working, and keep it updated as the project moves.

## 1. What Lumen is

A daily *florilegium*: Scripture, the Church Fathers, the Catechism, the saints, and the
prayers of the Church — a measured ~25-card "office" each day, styled as a scrollable
illuminated manuscript, meant to be read slowly instead of scrolled endlessly. Vanilla JS
in the browser, Python for all tooling. No framework, no runtime dependencies. iPhone-first,
installable, offline-capable. Lives in the **`scriptoria` monorepo** under `apps/lumen/` and
deploys to GitHub Pages at **https://tadellsworth.github.io/scriptoria/lumen/** (a sibling of
the Scriptoria app at the Pages root). Was previously a standalone Netlify site at
onefaithdelivered.org.

## 2. Golden rules (do not violate)

- **One deployed file family, zero runtime deps.** Output is `index.html` + `content.json` +
  `depth.json` + `sw.js`. No CDN, no npm, no framework, no in-browser build. All CSS/JS is
  inline; the icon is base64-embedded.
- **Firebase via REST only — never the SDK.** iOS content blockers break the SDK. Sync is
  plain `fetch()` to the RTDB REST endpoint.
- **Stable identifiers forever.** `STORE_KEY` (`lumen.v1.state`), `SYNC_NS` (`lumen`), and
  every card `id` must never change across releases, or saved state + cloud sync break.
- **`innerHTML +=` is banned** for dynamic content (it destroys event listeners). Use
  `appendChild` / `insertBefore`.
- **`viewport-fit=cover` is required**, or iOS `env(safe-area-inset-*)` returns 0.
- **Use Python, not bash, for any file with Unicode or very long lines** (Greek, accented
  Latin, Thai, emoji). Bash mangles them.
- **Validate JS twice.** `node --check app.js`, and `build.py` re-checks the JS it
  re-extracts from the assembled HTML.
- **Prefer exact-anchor `str_replace` over rewrites.** Confirm the anchor is unique first.
- **Public-domain texts only** for anything deployed. `verified:true` means "faithfully
  extracted from a PD source," not legal clearance. The `--strict` build blocks unverified
  items; some sources (e.g. *Story of a Soul*, a modern copyrighted translation) are kept
  out of public builds.

## 3. Repository layout

Lumen is one app in the `scriptoria` monorepo; everything below is rooted at
`apps/lumen/` (this used to be the standalone `formato/` directory). The Scriptoria
React app lives alongside it under `apps/scriptoria/`, and the GitHub Pages deploy
workflow is at the repo root in `.github/workflows/deploy.yml`.

```
apps/lumen/
├── CLAUDE.md                 ← this file
├── content.json              compiled corpus (~7,640 cards)          [generated]
├── depth.json                compiled "go deeper" layer              [generated]
├── commentary.json           Fathers-only intermediate               [generated, NOT deployed]
├── validate_content.py       schema / PD gate (invoked by build.py)
├── TAXONOMY.md               card-type & genre reference
├── dist/                     build output: the 4 deployable files    [generated, gitignored]
├── app/
│   ├── shell.html            DOM + ALL CSS; placeholders /*__APP_JS__*/ and __ICON_B64__
│   ├── app.js                the whole app, one IIFE: engine + UI + sync + depth
│   ├── build.py              assemble → outputs (validate, node --check ×2, inject icon)
│   ├── sw.js                 service worker (cache name lumen-vN)
│   ├── test_engine.py        42 engine-only tests
│   ├── icon.b64              base64 icon, injected at build time
│   └── make_icon.py          regenerate icon.b64 (Pillow, 4× supersample → downsample)
└── sources/
    ├── compile_content.py    merge source JSONs → content.json
    ├── compile_depth.py      merge Fathers + Kinkead + lives → depth.json
    ├── harvest_*.py          text harvesters (scripture, catena, kinkead, butler, shea, books, baltimore)
    ├── build_deuterocanon.py curated deuterocanonical cards
    ├── *.json                source + intermediate data
    └── raw_*/                raw harvested text (catena, kinkead, butler, shea, books)
```

## 4. Build / test / deploy loop

From `app/`:

```bash
node --check app.js          # syntax gate
python3 test_engine.py       # 42 tests — must all pass (engine only)
python3 build.py             # assemble; add --strict for public builds
```

`build.py` writes `index.html`, `content.json`, `depth.json`, `sw.js` to **`OUT`**, which
resolves in this order: `--out <dir>` arg → `LUMEN_OUT` env var → `apps/lumen/dist`
(default). For local work just run `python3 build.py` and open `../dist/index.html`.

**Deploying is automatic.** Pushing to `main` runs `.github/workflows/deploy.yml`, which
runs this same `build.py` with `LUMEN_OUT` pointed at the published site's `/lumen` folder
and publishes to GitHub Pages — Lumen at `…/scriptoria/lumen/`, Scriptoria at the root. No
manual file copying. (HTTPS, required for the service worker, is provided by Pages.) All
paths in the app are relative, so it works unchanged under the `/lumen/` subpath.

**Bump the service-worker cache version (`lumen-vN` in `sw.js`) on every content or asset
change.** Installed devices (incl. iPhone home-screen PWAs) only pick up a new
`content.json` / `depth.json` when the cache name changes. Currently **lumen-v13**.

Regenerate data when sources change:

```bash
cd sources
python3 compile_content.py   # → content.json  (auto-runs validate_content.py)
python3 compile_depth.py     # → depth.json
```

## 5. content.json — the corpus

`compile_content.py` merges the `SOURCES` list of per-type JSONs and validates. Current
corpus ≈ 7,640 cards: scripture ~3,223 (genres psalm / gospel / wisdom / epistle, incl. 16
curated deuterocanonical cards), meditation ~3,516 (spiritual classics: *Imitation*,
*Introduction to the Devout Life*, *Interior Castle*, *Confessions*), catechism 526
(Baltimore Q&A), saint 365, plus a few father / prayer / summa. A liturgical-calendar engine
in `app.js` picks the saint-of-day and seasonal coloring.

Card shape: `{id, type, title, body, ref, source, tags, verified, [genre], [more], [feast]}`.
See `TAXONOMY.md`. The day's office is composed from `DEFAULT_WEIGHTS` (`app.js`), targeting
~25 cards, scripture-forward, with any deficit flowing to the largest pools.

## 6. depth.json — the "go deeper" layer (newest system)

Tapping a card opens a detail sheet; for some cards it expands into deeper material, all
served from one lazy-loaded, SW-cached `depth.json`.

`compile_depth.py` merges three intermediates into
`depth.json = {meta, items:{cardId:{k, …}}}`:

| kind `k` | cards | payload | source · harvester |
|---|---|---|---|
| `fathers` | gospel scripture (1120) | glosses `g:[{f,t}]` | Catena Aurea, Newman 1841 (PD) · `harvest_catena.py` → `commentary.json` |
| `expl` | catechism (104) | paras `p:[…]` | Kinkead 1891, Gutenberg #14554 (PD) · `harvest_kinkead.py` → `kinkead_expl.json` |
| `life` | saints (216) | paras `p:[…]` | Butler + Shea (PD) · `harvest_butler.py` / `harvest_shea.py` → `*_lives.json` |

Runtime (`app.js`): `loadDepth()` fetches `./depth.json` once (warmed at boot, cached by the
SW) into the `DEPTH` map. `openDetail()` calls `renderDepth(scroll, item, bodyWrap)`:

- `fathers` → append a "The Fathers" gloss section (Father name as crimson rubric + gloss)
- `expl` → append a "The Explanation" paragraph section
- `life` → **replace** the body with the complete life (falls back to `more`/`body` if depth
  hasn't loaded yet; upgrades in place on load, only while that same card is open)

CSS is under `/* depth layer */` in `shell.html` (`.depth`, `.fathers-*`, `.gloss-*`,
`.expl-text`). `depth.json` is deliberately **not** precached in `sw.js`; the cache-first
branch stores it on first fetch.

## 7. app.js map

One IIFE, in regions: config constants (top) → **pure engine** (FNV seeded RNG, liturgical
calendar, card scoring/selection, office composition — this is what `test_engine.py` covers,
extracted from the IIFE and run in Node) → rendering (today/feed, deck + swipe gestures,
browse/stack toggle) → detail sheet + depth → saved/treasury → Firebase REST sync → boot +
SW registration + web-app-manifest injection. Keep engine functions self-contained so the
test harness can keep extracting them.

## 8. Service worker

`sw.js`: precache = app shell + `content.json`; navigations network-first (so new Pages
deploys reach installed devices); `content.json` stale-while-revalidate; other same-origin
GETs (incl. `depth.json`) cache-first; `firebaseio.com` passes through uncached. **Bump
`lumen-vN` on any change** — this is the cache-busting mechanism.

## 9. Firebase sync

RTDB `https://languageapps-da8a8-default-rtdb.firebaseio.com`, REST only, shared across the
app suite. Lumen reads/writes `/{SYNC_NS}/{pin}.json` (i.e. `/lumen/{pin}.json`) via
`GET`/`PUT`. PIN-based, no SDK, no auth library. Keep `SYNC_NS = 'lumen'` stable.

## 10. Sourcing raw texts (for future harvests)

Sandbox network is allowlisted for `github.com`, `raw.githubusercontent.com`,
`codeload.github.com`, `api.github.com`, and PyPI — **not** gutenberg.org / sacred-texts /
archive.org. The GitHub API rate-limits at ~60/hr on a shared IP, so prefer
`codeload.github.com/{owner}/{repo}/tar.gz/HEAD` tarballs and `raw.githubusercontent.com`
for individual files. Provenance of the current `raw_*`:

- **Douay-Rheims**: scrollmapper `bible_databases` → `DRC.json`
- **Catena Aurea**: `tj06man/catena-aurea-project` (per-chapter markdown, all four Gospels)
- **Kinkead**: `GITenberg/…_14554` (Gutenberg #14554, "Baltimore Catechism No. 4")
- **Butler**: Gutenberg #20450 (Jan–Mar), #49604 (July)
- **Shea / Benziger**: sacred-texts, *Lives of the Saints, With Reflections for Every Day*

## 11. Current state (as of this handoff)

- content.json ~7,640 cards; depth.json 1,440 items (fathers 1120, expl 104, life 216),
  2.8 MB; service worker **lumen-v13**; deploy = 4 files.
- Depth coverage: gospel ~99.8% (2 uncovered), catechism 104/522 (~20% — Kinkead edition
  mismatch; accuracy was chosen over coverage), saints 216 with a fuller life (the rest
  already show their full short life via `more`).

## 12. Known gaps & next work

- **Gospel**: hand-fill the 2 uncovered cards — Mark 8:39 and Matthew 16:1-3 (versification
  edge cases where the Catena groups verses differently).
- **Catechism**: coverage is capped by the edition mismatch between this app's question set
  ("Who made us?") and Kinkead's ("Who made the world?"). Raise it only by sourcing an
  *explained* edition that matches the app's questions — do **not** loosen the matching
  thresholds (that pairs explanations with the wrong doctrine). Kinkead's inline Scripture
  citations are currently stripped; they could be kept as references.
- **Saints**: surface the Shea "Reflection" codas as a distinct closing element; June 6
  (St. Norbert) is the one uncovered calendar day.
- **Standing horizon**: Compline / Night-Prayer office (the Tobias / Judith / Daniel
  canticles are now in the corpus); Treasury spaced-repetition for the Baltimore Q&A;
  read-aloud via the Web Speech API; share-as-image; cross-links (Augustine → *Confessions*,
  a Father → his Catena glosses); a full narrative-deuterocanon harvest from `DRC.json`.

## 13. Conventions & gotchas

- UI interactions use `data-act` event delegation.
- Motion curves are tuned per interaction (spring / fly-off / detail-sheet); every animation
  guards `prefers-reduced-motion`.
- The detail scrim must keep `pointer-events:none` while closed — a closed-but-`opacity:0`
  scrim once swallowed touches and froze the app.
- Tab-bar icons are fixed 24px and rendered icon-above-label (iOS style) via `insertBefore`.
- After any `str_replace` to `app.js`: re-run `node --check`, then `build.py`. `build.py` is
  the single source of truth for the deployed bundle — never hand-edit `index.html`.
