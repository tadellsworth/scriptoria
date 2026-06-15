# Handoff: Scriptoria — the unified Catholic & Latin Super App

## Overview
Scriptoria merges five existing standalone mobile web apps into **one product** with a single
illuminated-manuscript identity. The five apps become **five tabs**:

| Tab | Absorbs | Source app(s) |
| --- | --- | --- |
| **Today** | Daily lectionary readings + a short children's-missal-style devotion | `daily-missal.html` (Laudate) + `little-missal.html` |
| **Pray** | Prayer library, Rosary, Liturgy of the Hours, Daily Examen | `daily-missal.html` (Laudate) |
| **Learn** | Credo catechism path + Lingua Latina vocabulary flashcards | `credo.html` + `latin-learner.html` |
| **Find** | Confiteor — Mass, Confession & Adoration finder near the user | `confession-times.html` (Confiteor) |
| **Me** | One quiet streak, journal, confession tracker, learning progress, settings | `daily-missal.html` + `credo.html` |

The product is an **iPhone-first mobile app** (all five sources are mobile PWAs today).

## About the Design Files
The files in `designs/` are **design references created in HTML** — streaming "Design Component"
(`.dc.html`) prototypes showing the intended look and behavior. **They are not production code to
copy directly**, and they depend on this project's preview runtime, so they will not open
standalone in a browser. Read them as a precise visual + interaction spec.

**Your task** is to recreate these designs in the target codebase's environment. There is no
existing production codebase yet, so choose the most appropriate stack for a content-rich,
offline-capable, installable mobile app — e.g. **React + Vite + a PWA setup**, React Native, or
SwiftUI if going native. Whatever you choose, implement the unified Scriptoria look from the
design tokens below.

### The big efficiency unlock — reuse, don't rewrite
The `source_apps/` folder contains the **five original apps, fully working**, each a single HTML
file with real data and logic already written. Most of this project is a **merge + re-skin**, not
a from-scratch build. For each tab, lift the existing logic/data and re-skin it to the Scriptoria
tokens. See **"Source-App Logic Map"** at the bottom — it tells you exactly where each behavior and
dataset already lives.

## Fidelity
**High-fidelity (hifi).** Final colors, typography, spacing, and interactions. Recreate the UI
pixel-accurately using the exact token values in **Design Tokens**. The visual language is a
bound design system ("Scriptoria") — its token CSS is included in `design_system/`.

---

## Global Layout & Chrome

- **Frame:** single-column mobile, 390px logical width (iPhone 14/15 class). Safe-area aware.
- **Page ground:** parchment with a faint radial "tooth" texture:
  `background: var(--tex-parchment), var(--parchment);`
- **Status bar:** 50px tall; left `9:41` (Outfit 600, 14px, `--ink`); right signal/wifi/battery icons in `--ink`.
- **Tab bar (bottom):** translucent vellum (`--leaf-95`) with `backdrop-filter: blur(14px)`, 1px top
  border `--gold-20`. Five items, each a 22px line icon + a 9.5px Outfit label (letter-spacing .05em).
  - Inactive `--ink-faint`; active `--lapis` (label weight 600). Active state is per-current-tab.
  - Icons (Lucide-style, 1.7px stroke): **Today** = sun, **Pray** = flame, **Learn** = open book,
    **Find** = map-pin, **Me** = user. *(Substitution flagged: the design system is otherwise
    typographic/Unicode; thin classical line icons are used only for the tab bar's functional needs.)*
  - Below the row: a 5px × 134px home indicator at 30% `--ink`.
- **Masthead pattern** (opens most screens): centered gold Chi-Rho (☧), a Cinzel uppercase title,
  an italic Cormorant date/subtitle, then the **gilt rule** divider (`.scriptoria-rule` — a centered
  ornament ❦/✠/❧ flanked by fading gold gradient lines).
- **Card registers:**
  - *Vellum card* (`.vellum`): `linear-gradient(180deg, var(--vellum), var(--parchment))`, 1px
    `--gold-30` border, **3px** radius (`--r-leaf`), shadow `--sh-vellum`.
  - *Ink panel:* `linear-gradient(165deg, var(--lapis), var(--lapis-deep))`, 12px radius, `--sh-card`,
    parchment text — used for headers, featured cards, the streak panel.
  - *Prayer/rubric callout:* `--gold-08` wash with a 3px gold (or amethyst) left keyline.
- **Motion:** `scriptoria-rise` (opacity + 8px lift, .55s ease-out) for entrances; one allowed
  infinite is `scriptoria-glow` (slow gilt pulse) on the single "next" CTA. No bounce. Respect
  `prefers-reduced-motion`.
- **Press:** cards lift/sink ~1–2px or scale 0.985; coins scale 0.95.

---

## Screens / Views

The design board (`designs/Scriptoria Super App.dc.html`) is organized in sections A–G. Each phone
is labeled (e.g. "A1 · THE LEAF").

### Home directions (Section A — pick ONE; **A1 was chosen**)
- **A1 · The Leaf (CHOSEN HOME = the Today tab).** The day as one devotional manuscript page:
  masthead (☧ / "Scriptoria" / "Monday, the 15th of June" / "11th Week in Ordinary Time") → gilt rule
  → quiet streak ribbon ("✦ 12 days kept") → **Gospel** vellum card with a Cinzel drop-cap → "A thought
  to carry" italic card → "Let us pray" gold-keyline callout ending "AMEN ✠", with a Latin line
  ("Non resístere malo — offer no resistance to evil").
- A2 · The Cloister (alt, not chosen): a launcher hub of gilt tiles.
- A3 · The Day's Hours (alt, not chosen): a rule-of-life timeline.

### Today (Section B)
- **B1 · Today (full).** Date nav (‹ Monday / June 15, 2026 ›) → **Ordinary Time green** liturgical
  banner (border/bg `rgba(45,122,79,.3/.07)`, emerald text; banners are color-coded by season:
  green=Ordinary, violet=Lent/Advent, white/gold=feast, red=martyr/Passion, rose=Gaudete/Laetare) →
  readings accordion (First Reading 1 Kings 21:1–16 collapsed, Psalm 5:2–7 collapsed, **Gospel
  Matthew 5:38–42 expanded** with justified body) → saint strip (gilt coin + "St. Germaine Cousin").
  Reading labels use a vermillion eyebrow.

### Pray (Section C)
- **C1 · Pray home (CHOSEN).** Masthead "Prayer / Oremus" → **Rosary feature** ink panel ("Today ·
  Monday / The Holy Rosary / The Joyful Mysteries", 3 bead-dots, gold "Begin ✠" pill) → two tiles
  (Liturgy of the Hours, Daily Examen) → **Prayer Library** list (Pater Noster, Ave Maria, Gloria
  Patri, Salve Regina — each Latin title + italic English gloss + ›).
- C2 · Rosary player (alt detail): ink header with mystery + 59-bead dot strip + "BEAD 14 OF 59";
  centered Ave Maria in English then Latin; Back / Next footer.

### Learn (Section D)
- **D1 · Learn home (CHOSEN).** Masthead "Learn / Disce" → **Credo** vellum card (gilt ☧ coin,
  "Pillar I · The Creed", progress bar "The Holy Trinity 7/24" at 29%, gold "Continue lesson" pill) →
  **Lingua Latina** vellum card (lapis Λ coin, "Unit III · Prayer Words", two stat cells "12 to
  review" / "48 mastered", outlined "Review flashcards" pill).
- D2 · Credo lesson (alt detail): de-gamified — gilt progress bar + "4/9" (no hearts), CCC eyebrow,
  question, 4 options (selected/correct = emerald), gentle "Deo gratias" explanation callout.
- D3 · Lingua flashcard (alt detail): revealed flip card "ORÁRE / to pray", tappable example
  "Ora et labora", "Again" / "Knew it" recall buttons (spaced-repetition).

### Find (Section E)
- **E1 · Find list (CHOSEN).** Masthead "Confiteor / Near Canton, GA" → **Next Opportunity** banner
  (amethyst left keyline) → filter chips (All active=lapis fill, Today, Saturday, Nearest) → parish
  cards. The soonest card gets a gold border + `0 0 0 3px var(--gold-12)` glow + "SOONEST" tag; each
  shows name, city, "Adoration now"/"Perpetual Adoration" in emerald, distance + drive time, and gold
  time chips (soonest chip = solid gold).
- E2 · Parish detail (alt): ink header, Confession schedule (amethyst eyebrow), Adoration (emerald,
  "NOW" badge), Directions/Call/Website actions (Directions = amethyst), Act of Contrition callout.

### Me (Section F)
- **F1 · Me (CHOSEN).** Gilt "JM" avatar coin → "John Mary" → **quiet streak** ink panel ("A quiet
  streak / 12 days kept / ✦", 7 week-dots, 5 lit) → tracker rows (Confession "21 days since",
  My Journal "38 reflections", Learning "7 lessons · 48 Latin words") → **Theme** toggle
  (Parchment / Candlelight pill).
- F2 · Journal (alt): masthead, prompt ("What in today's Gospel spoke to your heart?"), writing
  surface with caret, "Saved just now ✦", past-reflection list.

### Secondary screens & states (Section G)
- **G1 · Welcome / onboarding.** No tab bar. Big 128px gilt ☧ coin, "Scriptoria" display, italic
  tagline, short body, lapis "Begin ✠" button, "I already have an account" link.
- **G2 · Liturgy of the Hours.** Back header → vertical timeline of the seven hours (Lauds/Terce done
  = emerald check; **Sext = current**, gold node + glow + vellum card with Latin "Deus, in adiutórium
  meum inténde."; None/Vespers/Compline upcoming). Each hour: Cinzel name + italic English label + time.
- **G3 · Daily Examen.** Five step cards (I Gratitude — with a filled reflection field; II Petition;
  III Review; IV Respond + V Resolve shown compact) → gold "Save to journal".
- **G4 · Confession tracker + record sheet.** Tracker (amethyst "21", "Last on the 25th of May",
  1 John 1:9 callout) dimmed under a **bottom-sheet modal** "Record a Confession" (grab handle,
  Date field, Penance field, Cancel / amethyst "Save ✠"). Scrim `rgba(20,15,9,.5)`.
- **G5 · Settings.** Sections: Appearance (Theme toggle; "Show Latin" switch ON = gold track),
  Rhythm (Daily reminder 7:00 AM, Reading cycle "Year II · Weekday", Confession finder "Canton, GA"),
  Account ("John Mary · Manage").
- **G6 · Quiet states.** Reverent, never error-red: dashed "Offline — showing your last saved day"
  ribbon; empty-day state (large 50% ❦ ornament, "No entry for this day yet", "Return to today");
  empty-journal "A blank leaf" card.

---

## Interactions & Behavior

- **Tab navigation:** tapping a tab swaps the active screen; tab bar reflects active tab. (See
  `designs/Scriptoria Prototype.dc.html` for the working five-tab flow.)
- **Theme toggle (works in the prototype):** Parchment ↔ Candlelight flips a `data-theme="dark"`
  scope, recoloring the whole app via tokens (parchment→ink, lapis→luminous sky-blue, gold warms).
  Persist the choice.
- **Today:** date ‹ / › steps the day; reading cards are accordions (expand to fetch full text);
  "Return to today" resets.
- **Pray:** Rosary "Begin" opens the bead player (59 beads, prev/next, mystery set by weekday);
  a global "Show Latin" toggle reveals Latin beneath prayers/verses.
- **Learn:** Credo lesson checks an answer then shows a gentle explanation and Continue; Lingua
  flashcard flips to reveal, then Again/Knew-it feeds spaced repetition. **No hearts, no XP, no
  fail screen** — see Gamification note.
- **Find:** "Next Opportunity" computes the soonest upcoming confession across parishes; filters
  (Today/Saturday/Nearest); "Nearest" requests geolocation; cards expand to full schedule; actions
  deep-link to Maps / tel: / website. "Adoration now" / perpetual computed against current time.
- **Me:** streak increments on a daily devotional check-in; tracker rows open journal / confession /
  progress; theme toggle as above.
- **Confession modal:** bottom sheet; Save records a dated entry (+ optional penance) and resets
  "days since".
- **Empty/offline:** show the reverent G6 states rather than spinners-forever or red errors.

### Gamification — deliberately minimal
Credo's original **hearts, XP, and "Out of Hearts" fail screen are removed.** Keep exactly **one
quiet daily streak** (the ✦ "days kept"), shared across the whole app. Lesson/flashcard progress is
shown as calm progress bars and counts, never as competitive scoring.

## State Management
Per-feature state (lift from sources, then unify under one user/profile):
- `tab` (active tab), `theme` ('light' | 'dark', persisted).
- **Today:** `currentDate`, fetched readings cache, liturgical day/season, saint.
- **Pray:** rosary bead index + mystery set (by weekday), `showLatin` flag, examen field values.
- **Learn:** Credo lesson/question index + per-lesson completion + progress; Lingua card queue +
  per-word mastery (spaced repetition).
- **Find:** `userLocation` (geolocation), `filter`, `search`, `now` (ticked each minute), expanded set.
- **Me:** streak count + check-in calendar, journal entries, confession records, derived progress.
- **Persistence:** the sources use `localStorage` with a `missal_*` prefix (journal, streak,
  confession, examen, routines) and Credo's own progress store. Unify to one namespace
  (e.g. `scriptoria_*`) or a real per-user backend.

---

## Design Tokens

Exact values are in `design_system/tokens/*.css` (link `design_system/styles.css` to get all).
The bound namespace for the React component bundle is `ScriptoriaDesignSystem_d07b87`.

### Color — light (`:root`)
- Grounds: `--parchment #f4ecd8` · `--vellum #faf4e8` · `--parchment-2 #ebe0c4` · `--parchment-3 #ddc99b`
- Ink (warm sepia): `--ink #2a1f15` · `--ink-soft #6a574a` · `--ink-faint #9b8a7a`
- Lapis (primary blue): `--lapis #1e3a5f` · `--lapis-deep #142940` · `--lapis-soft #3a4a82`
- Gold: `--gold #c9a32f` · `--gold-light #e6c558` · `--gold-dark #8a6f15`
- Accents: `--vermillion #c41e1e` · `--vermillion-deep #8a1414` · `--emerald #2d7a4f` · `--amethyst #5b3a72`
- Gilt washes: `--gold-04/08/12/20/30/40` = `rgba(201,163,47, .04/.08/.12/.20/.30/.40)`
- Leaf washes: `--leaf-50/60/70/95` = `rgba(255,255,255, .50/.60/.70/.95)`
- Semantic: text on ink = `--parchment`; hairline borders = `--gold-20/30/40`; feast/danger = vermillion.

### Color — dark (`[data-theme="dark"]`, "candlelight")
- Grounds: `--parchment #161320` · `--vellum #1d1a28` · `--parchment-2 #221d30` · `--parchment-3 #342c44`
- Ink: `#ece2cf` / `#c4b69e` / `#8a7e6a` · Lapis lifts: `#9db8e0` / `#6f8fc4` / `#b0c4e8`
- Gold warms: `#d8b75a` / `#ecd07e` / `#b08a3e` · Accents: vermillion `#e87a6a`, emerald `#62b07a`, amethyst `#a584c0`
- `--surface-ink #100d18`, leaf washes become low-alpha white over ink.

### Typography
- Families: `--font-display: 'Cinzel'` (display & titles, uppercase, tracked) · `--font-body:
  'Cormorant Garamond'` (body & devotional prose; italic for prayers/leads/translations) ·
  `--font-ui: 'Outfit'` (chrome, numerals, eyebrow labels). All three are Google Fonts.
- Scale: display `clamp(2.4rem,6vw,3.4rem)` · h1 `2rem` · h2 `1.5rem` · h3 `1.25rem` · title
  `1.15rem` · lead `1.25rem` · **body `1.0625rem` (17px — Cormorant reads small)** · ui `0.9375rem`
  (15px) · label `0.7rem` (≈11px) · caption `0.8125rem`.
- Weights 400/500/600/700. Line-heights: tight 1.15 · snug 1.3 · body 1.6 · loose 1.9.
- Tracking (signature): display `0.06em` · title `0.18em` · label `0.22em` · ui `0.04em`.

### Spacing (4px base)
`--sp-1..8` = 4 / 8 / 12 / 16 / 24 / 32 / 48 / 64 px.

### Radii
`--r-leaf 3px` (manuscript cards/badges) · `--r-sm 8` · `--r-md 12` (app cards/inputs) · `--r-lg 14`
(primary buttons/headers) · `--r-pill 999` · `--r-circle 50%` (emblems/avatars/nodes).

### Shadows (warm sepia, never grey)
- `--sh-soft 0 2px 6px rgba(42,31,21,.10), 0 1px 2px rgba(42,31,21,.06)`
- `--sh-card 0 4px 12px rgba(42,31,21,.14), 0 2px 4px rgba(42,31,21,.08)`
- `--sh-deep 0 8px 24px rgba(42,31,21,.22)`
- `--sh-gold 0 4px 14px rgba(201,163,47,.35), 0 2px 4px rgba(42,31,21,.12)`
- `--sh-emboss inset 0 -4px 8px rgba(0,0,0,.15), inset 0 2px 6px rgba(255,255,255,.4)` (gilt coins)
- `--sh-vellum 0 1px 2px rgba(42,36,29,.08), 0 4px 14px rgba(42,36,29,.05), inset 0 1px 0 rgba(255,255,255,.7)`

### Motion & texture
- `--ease cubic-bezier(.4,0,.2,1)` · `--ease-out cubic-bezier(.16,1,.3,1)` · durations .15 / .25 / .55s.
- Keyframes: `scriptoria-rise`, `scriptoria-fade`, `scriptoria-glow`.
- `--tex-parchment` / `--tex-vellum` are the radial-gradient page textures.

### Components in the bundle (`design_system/_ds_bundle.js`, `window.ScriptoriaDesignSystem_d07b87`)
`Button · Badge · Card · Divider · Emblem · NavPill · ProgressBar · SectionHeading · WordChip`.
These encode the gilt-coin Emblem, gilt-rule Divider, vellum/ink Card, tracked Button, etc. — match
their look even if you reimplement in your framework.

## The "gilt coin" emblem (recurring motif)
A circle with `radial-gradient(circle at 30% 30%, var(--gold-light), var(--gold) 70%, var(--gold-dark))`,
shadow `--sh-gold` + `--sh-emboss`, optional 2–3px parchment border, bearing a glyph (☧, a unit
numeral, initials, or Λ for Latin). Used as app mark, avatar, lesson node, and unit medallion.

## Iconography & ornaments
- Brand marks & ornaments are **Unicode**, set in Cinzel/Cormorant and colored gold:
  ☧ Chi-Rho · ✠ cross · ❦ ❧ fleurons · † dagger · ✦ star. **Never draw SVG ornaments.**
- State glyphs (functional only): ✓ completed (emerald), 🔒 locked, ← → nav.
- The only drawn icons are the five thin-line tab-bar icons (flagged substitution above).
- App marks: original Chi-Rho PNGs ship inside the source apps (data-URI `<link rel=icon>` /
  apple-touch-icon). Extract from `source_apps/` if you want the exact lockups; otherwise the
  Unicode ☧ on a gilt coin is the canonical mark.

---

## Source-App Logic Map (reuse this working code)

All five live in `source_apps/`. Each is one self-contained HTML file with data + logic.

- **`daily-missal.html` (Laudate)** — the richest source. Contains: lectionary fetch
  (`READINGS_API = https://cpbjr.github.io/catholic-readings-api`), readings accordion with
  on-demand text load, liturgical season → color mapping, saint-of-the-day, **Rosary engine**
  (59-bead overlay, mystery-by-weekday, prev/next), prayer library + **Latin toggle**, Liturgy of
  the **Hours** timeline, **Journal** (localStorage), **Confession tracker** + record modal +
  history, **Ignatian Examen**, streak/calendar, holy-days, prayer routines. → feeds **Today, Pray,
  Me** (and the confession tracker in Me).
- **`little-missal.html`** — `DAILY_ENTRIES` map (date → liturgicalDay, gospelReference, theme,
  question, prayer) and day navigation. → feeds the **devotional layer of Today** (the "thought to
  carry" + "let us pray").
- **`credo.html` (Credo)** — `CURRICULUM` (units → lessons → questions) with question types
  `multipleChoice / trueFalse / match / fillBlank / tapOrder`, serpentine lesson path, and the
  XP/streak/hearts chrome **to be dropped**. → feeds **Learn (Credo track)** and learning progress in Me.
- **`latin-learner.html` (Lingua Latina)** — vocabulary flashcards, tappable Latin words with
  glosses, light/dark themes. (Large file.) → feeds **Learn (Lingua track)**.
- **`confession-times.html` (Confiteor)** — `CHURCHES` dataset (name, city, address, lat/lng, phone,
  website, driveMin, weekly `schedule` / `adoration` / `mass`), `haversine` distance, geolocation,
  `getUpcomingSlots` / next-opportunity logic, "happening now" / perpetual-adoration detection,
  filters & search. → feeds **Find** wholesale.

**Recommended approach:** scaffold the chosen stack with the Scriptoria tokens as the theme; port
each source file's data + pure logic into modules; rebuild the five tabs' UI to match the `designs/`
screens; unify auth/profile + persistence; drop hearts/XP, keep one streak; wire the `data-theme`
dark mode and the Latin toggle as global preferences.

## Files in this bundle
- `designs/Scriptoria Super App.dc.html` — the 19-screen reference board (Sections A–G).
- `designs/Scriptoria Prototype.dc.html` — the working five-tab flow + theme toggle (chosen screens).
- `design_system/` — the Scriptoria token CSS (`styles.css` + `tokens/*.css`), the component bundle
  (`_ds_bundle.js`), `_ds_manifest.json`, and the design-system `readme.md` (full guide).
- `source_apps/` — the five original working apps (logic + data source).
