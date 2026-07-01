# CLAUDE.md — VIGOR

Standing context for working on **VIGOR** in Claude Code. Read this first.

## What it is
VIGOR is a single-file, offline-capable **workout PWA**, built as a personal gift for
the owner's 58-year-old father (male, 5'9", ~190 lb). It is **not** connected to any
professional/work project — keep it entirely separate and free of any business branding.

The program is a weekday (Mon–Fri) routine built from six blocks per day —
warm-up mobility, lymph activation, day-specific strength, kegels, a core finisher,
and a cooldown — with an optional lighter weekend mobility session. The aesthetic is a
deliberately calm "well-made instrument": warm stone canvas, brass + deep-pine accents,
large legible type, big tap targets. Not a neon gym-bro app.

## Hard constraints (do not break these)
- **Single file at runtime.** The whole app ships as one `index.html` (CSS + HTML + JS
  inline) plus a tiny `sw.js`. No build step at runtime, no frameworks, no bundler.
- **No runtime dependencies** except Google Fonts (Archivo / JetBrains Mono / Hanken
  Grotesk) loaded from the CDN. UI text uses the native system font first
  (`-apple-system` → SF on iPhone, Roboto on Android), fonts are the fallback.
- **State is localStorage only.** Key = `vigor.v1`. Currently **no** Firebase / network
  sync (single user, one device). If sync is ever added, use **Firebase REST via `fetch()`**,
  never the SDK (the SDK trips iOS content blockers) — this is the owner's standing rule
  across their other apps.
- **Stable identifiers are non-negotiable.** Never change the localStorage key `vigor.v1`
  or reshape saved fields incompatibly — doing so wipes the dad's real history. `load()`
  merges new defaults over old saves; keep that pattern when adding fields.
- **Offline + installable.** `sw.js` (service worker) provides offline + the Android
  install prompt. It must sit next to `index.html` in its **own folder** (its scope is the
  folder it lives in). Bump the cache name (`vigor-v1`) when you want to force-refresh.

## Repo layout & build
```
vigor/
  build.py            # assembles the single file; run this to build
  CLAUDE.md           # this file
  HANDOFF.md          # current state + feature roadmap
  README.md           # quickstart
  src/
    app_template.html # THE SOURCE — full app with __ICON180/192/512__ placeholders
    icons_b64.py      # committed base64 icons (source of truth for the icon)
    make_icons.py     # regenerates icons_b64.py (Pillow) — only if changing the icon
    sw.js             # service worker (copied verbatim to the build)
  dist/               # build output: index.html + sw.js  (this is what you deploy)
```
Build:  `python3 build.py`  → writes `dist/index.html` + `dist/sw.js`.
Override output dir: `VIGOR_OUT=/path python3 build.py`.
`build.py` extracts the inline `<script>`, runs `node --check` on it, injects the icons,
and asserts no placeholder was left behind.

**Edit `src/app_template.html`** for all app changes, then rebuild. Do not hand-edit
`dist/`. The base64 icons live only in `icons_b64.py` (kept out of the template so diffs
stay readable) and are injected at build time.

## Deploy
Static HTTPS host (owner uses **Netlify**). Put `dist/index.html` + `dist/sw.js` in a
dedicated folder/site. HTTPS is required for the service worker and the install prompt.
On Android: open in Chrome → "Install app". The manifest is injected inline via a Blob URL
(`injectManifest()`), background color matches the launch screen for a continuous splash.

## Architecture of app_template.html
One file, three regions:
1. **`<style>`** — CSS custom properties in `:root` (palette, `--ease-ios`, `--spring`,
   safe-area vars, `--scale` for the text-size control). iOS-flavored: system font,
   spring transitions, translucent nav, segmented controls, bottom-sheet modals.
2. **HTML** — `#splash` (launch screen), `#app` with four `.screen`s (Today / Week /
   Moves / You), the full-screen `#player`, bottom `.nav`, and modals (`#demo-modal`,
   `#picker-modal`).
3. **`<script>`** — one IIFE-free top-level module. Rough map:
   - **Data/util:** `KEY`, `DEFAULT`, `load`/`save`, date helpers (`todayKey`, `dowKey`,
     `isWeekday`, `activeDayKey`, `DAY_KEYS`, `DAY_FULL`).
   - **Program builders:** `hold`/`reps`/`flow` exercise factories; block builders
     (`warmupBlock`, `lymphBlock`, `kegelBlock`, `cooldownBlock`, per-day strength, core
     map); `buildDay` → `WEEK`; weekend blocks → `WEEKEND`.
   - **Durations:** `DURATIONS` (10/30/45/60), `TRIM` presets, `scaleDay`, `blockLabel`,
     `curDuration`.
   - **Schedule/override:** `S.schedule` (weekday→workout id), `scheduledId`,
     `overrideActive`, `todayWorkoutId`, `WORKOUTS`, inline SVG icons `ICO_SWAP`/`ICO_RESET`.
   - **Rendering:** `renderToday`, `renderDurationPicker`/`setDuration`,
     `renderOverrideRow`/`clearOverride`, `renderGauge`/`arcPath`, `renderBlocks`,
     `renderStreak`, `renderWeek` + chooser (`openPicker`/`pickWorkout`/`closePicker`,
     `resetSchedule`), `renderMoves`, `renderYou` (records, weight card + `weightChart`/
     `logWeight`, calendar), `renderSettings`/`toggleSet`.
   - **Player:** `startToday`/`startDay`/`startDayObj`, `buildSteps`, `renderStep`
     (+ the `_origRenderStep` wrapper — see gotchas), `renderTools`, `effReps`, `announce`,
     `rxLine`, `setMain`, `setRing`, `startTimer`/`tick`/`pauseResume`/`stopTimer`,
     `timerDone`/`afterWork`/`advance`/`nextStep`/`prevStep`, `finishSession`,
     `closePlayer`, `showRate`/`hideRate`/`applyRate` (progression check-in).
   - **Feature module:** swaps (`ALT`, `applySwap`, `setSwap`), demos (`PATTERN`,
     `*_FIG`, `demoFigure`, `openDemo`), voice (`speak`/`stopSpeak`), wake lock,
     reminders, `applyContrast`, `dismissSplash`, `registerSW`, audio
     (`getCtx`/`beep`/`tickSound`), `init`.

## Data model (`S`, persisted under `vigor.v1`)
```
history:{ 'YYYY-MM-DD': true }          # completed sessions (date-keyed)
weights:{ 'YYYY-MM-DD': lbs }           # body-weight log
prog:{ dumbbell, kettlebell, bodyweight } # progression (bodyweight = rep offset; weights nudge settings)
swaps:{ 'Exercise name': 'easier'|'harder' }
schedule:{ mon..fri: workoutId }        # which workout runs each weekday
override:{ date, id } | null            # one-day "do a different workout today"
settings:{ sound, vibrate, autoAdvance, scale, dumbbell, kettlebell, voice, wakelock,
           contrast, streakFreeze, weekend, reminderOn, reminderTime, duration, ticks }
```
History/weights are date-keyed, so schedule/override/duration changes never disturb
progress. Streak counts consecutive scheduled weekdays with `streakFreeze` allowing one
forgiven miss.

## Conventions & gotchas
- **Always `node --check` the JS after editing** (build.py does this; if it fails it
  aborts). Prefer exact-anchor edits over big rewrites in this large file.
- **`renderStep` is wrapped.** `const _origRenderStep = renderStep; renderStep = function(){…}`
  restores control-bar visibility, hides the finish view, resets the main button, then
  calls the original. The progression overlay (`showRate`) hides the side buttons; the
  wrapper is what brings them back. Don't remove it.
- **Player must stay scroll-safe.** `#player` is a fixed full-height flex column;
  `.pl-mid` scrolls (`overflow-y:auto; justify-content:safe center`) and the control bar is
  `flex:none`. This is what keeps Next reachable under large text / small screens. A past
  bug hid Next on the push-up screen because content overflowed a fixed-height layout.
- **Accessibility/zoom:** the viewport intentionally allows pinch-zoom (no
  `user-scalable=no`). Buttons use `min-height`+padding, not fixed heights; tight rows
  wrap. Keep new UI reflow-safe — the dad uses Samsung font-size + screen-zoom.
- **Avoid fragile glyphs in text.** Some symbol glyphs (e.g. ⇄, ↺) render as tofu boxes
  on some Android fonts. Use the inline SVG icons (`ICO_SWAP`, `ICO_RESET`) or single-
  codepoint emoji instead — never multi-codepoint ZWJ emoji in UI copy.
- **Audio needs a user gesture.** `getCtx()` lazily creates/resumes the AudioContext;
  it works because playback starts from the Start-button tap. `beep()` = end chime,
  `tickSound(strong)` = per-second countdown tick (strong = final 3s), gated on
  `settings.sound` / `settings.ticks`.
- **Respect `prefers-reduced-motion`** — a global rule disables animations; the splash
  falls back to a quick JS dismiss.
- **Cite nothing / no external state.** Everything is inline; don't add `localStorage`
  usage inside artifacts-style code beyond the single `S` store.

## Current feature set (already built)
Four screens + full-screen guided player + animated launch screen. Session lengths
10/30/45/60 min (trims blocks sensibly). Rearrange which workout runs on each weekday +
one-day "do a different workout today" override. Optional weekend mobility. Per-exercise
easier/harder swaps. Looping movement-pattern demos. Spoken coaching (announce move,
"halfway"/"switch sides"). Screen wake-lock, daily reminder, high-contrast mode, streak
forgiveness. Body-weight log with trend line, records, monthly summary. Coarse
progression check-in after the strength block. Per-second countdown ticks with a 3·2·1.
iOS-style visuals/transitions and accessibility/zoom hardening throughout.
