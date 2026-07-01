# VIGOR — Handoff

Snapshot of where the project stands and what's on the table next. Pair with `CLAUDE.md`
(architecture/conventions).

## Current state
- Fully working single-file PWA. Build reproduces `dist/index.html` (~211 KB) + `dist/sw.js`
  byte-for-byte via `python3 build.py`.
- Service worker cache: `vigor-v1`. localStorage key: `vigor.v1`.
- Deployed target: Netlify (static, HTTPS). Nothing server-side.

## Build & deploy (quick)
1. `python3 build.py` → `dist/index.html` + `dist/sw.js`.
2. Put **both** files in their **own folder / site** on an HTTPS host (Netlify drag-and-drop
   works). `index.html` at the folder root; `sw.js` beside it.
3. Android: open in Chrome → **Install app** (needs HTTPS + sw.js). iOS: Share → Add to
   Home Screen also works; Android is the primary target.
- Bump `vigor-v1` in `src/sw.js` when you want installed copies to force-refresh.
- Keep VIGOR in its own directory so the service worker scope can't cache sibling apps.

## Testing checklist after any change
- `python3 build.py` passes (it runs `node --check`).
- Start a session and reach the end: timers count down, **ticks + 3·2·1 + end chime** fire,
  Next/Prev/skip reachable on every screen (esp. push-up/bodyweight days), the
  progression check-in appears after the strength block and dismisses cleanly.
- Change duration (10/30/45/60) — gauge, block list, and started session all match.
- Rearrange a weekday and set a one-day override — both resolve correctly; override clears
  next day; streak/history unaffected.
- Toggle each setting (voice, ticks, wake-lock, contrast, reminder, weekend, streak freeze).
- Crank Samsung font size / screen zoom (or browser zoom): nothing clips or squishes;
  pinch-zoom works.
- Reload offline (after first load, once sw.js is registered): app still opens.

## Roadmap — candidate features (not yet built)
Prioritized-ish. Items marked (SYNC) benefit from optional Firebase-REST cloud sync.

**Training log depth (highest value)**
- Per-exercise performance log (actual weight/reps each session) with a small trend line
  per movement; per-exercise personal bests; weekly volume (total load / minutes).
- Replace the 5-week calendar with a full-year contribution-style heatmap.

**Data safety (do early)**
- One-tap **export / restore to a JSON file** (protects months of history from a browser
  wipe or new phone).
- (SYNC) Optional **PIN-based cloud backup** via Firebase REST (owner's existing project,
  `fetch()` only, never the SDK) — frame as device-continuity, not monitoring.
- "Share summary for the doctor" export (PDF/print or plain text).

**Smarter programming**
- Multi-week plan with automatic **deload weeks** every 4–6 weeks (important at 58).
- Larger exercise pool + rotation so a given weekday isn't identical forever.
- Optional **3-day vs 5-day** week; **goal mode** (strength vs mobility/conditioning) that
  reshapes the blocks.

**In-workout depth**
- **Tempo metronome** built on the existing tick engine ("3 down, 1 up").
- Flexible rest: **+15s / skip** buttons and an adjustable default rest.
- Start-of-session **readiness check** that can suggest the short session or weekend
  mobility on a rough day.
- Optional per-move form-video links (open externally; keep public-domain / user-supplied).

**Health tracking (age-appropriate)**
- Resting heart rate + blood pressure log with trends.
- Soreness/pain flag per body area that quietly swaps in gentler variants.
- (Intentionally skipping calorie/nutrition tracking.)

**Polish & onboarding**
- First-run **setup wizard** (name, starting weights, days/week, reminder time).
- Personalized greeting ("Good morning, Dad").
- **Weekly goal ring** (e.g., 4 of 5) + a short Sunday recap.
- A few **achievement badges** for milestones.

### Suggested first batch
1. Per-exercise logging + trends.
2. Export / restore to file (and optionally the Firebase-REST backup).
3. Deload weeks + readiness check.
Then the onboarding wizard + weekly goal ring for pure polish.

## Notes for whoever picks this up
- The dad is on **Android/Samsung** with enlarged system text — keep everything reflow-safe
  and never re-disable zoom in the viewport meta.
- Progression today is coarse (a post-strength "too easy / just right / too hard" that nudges
  weights ±5 lb or bodyweight reps ±2). The per-exercise log above is the natural upgrade;
  keep the coarse check-in working alongside or migrate it thoughtfully.
- If you add fields to `S`, extend `DEFAULT` and the merge in `load()` so old saves survive.
