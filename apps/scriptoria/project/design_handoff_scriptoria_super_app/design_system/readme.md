# Scriptoria Design System

> *Illuminated, calm, reverent.* The shared design language behind a family of
> Catholic & Ecclesiastical-Latin learning apps — built to feel like a modern
> illuminated manuscript: parchment grounds, lapis blue, gilt gold, and the
> Chi-Rho.

---

## 1 · Context — the products

Scriptoria is the common system extracted from three companion apps. All three
share the same parchment-and-gold manuscript aesthetic and a calm, catechetical
voice; they differ in surface rounding and chrome.

| Product | What it is | Signature |
| --- | --- | --- |
| **The Little Missal** | A daily children's devotional — Gospel, a question to ponder, a short prayer, and a line of Latin. | Sharp vellum cards, masthead Chi-Rho, day navigation. |
| **Credo** | A catechism companion with a Duolingo-style serpentine lesson path. | Gilt coin "lesson nodes", navy headers, XP/streak chrome. |
| **Lingua Latina Ecclesiastica** | An Ecclesiastical-Latin learner: vocabulary flashcards, grammar, prayers. | Flip cards, tappable Latin words, light **and** dark themes. |

### Sources given
- Local codebase folder `Archive 2/` (read-only), containing three standalone
  HTML apps: `credo.html`, `latin-learner.html`, `little-missal.html`.
- Working copies preserved in this project under **`_source/`** for reference.
- App icons extracted from the source files into **`assets/`**.

No Figma or repository links were provided. All tokens, type, and components in
this system were lifted directly from the three HTML sources.

---

## 2 · Content Fundamentals — how Scriptoria speaks

The voice is **calm, warm, and reverent** — a gentle catechist, never a
marketer. Across all three apps the writing is unhurried and devotional.

- **Person & address.** Second person, intimate: *"What is one way **you** could
  serve someone in **your** family today?"* Prayers speak directly to God in the
  first person: *"Jesus, you came to serve. Teach **me** to look for ways to
  help."*
- **Tone.** Encouraging and tender; never anxious or gamified-aggressive.
  Children are the implied reader of the Missal, so sentences are short, concrete,
  and kind. The Latin learner is gentle but a touch more scholarly.
- **Casing.** Sentence case for prose. **Cinzel titles are UPPERCASE** and
  letter-spaced (the inscriptional register). Eyebrow labels are uppercase,
  tracked (`GOSPEL`, `MORNING PRAYER`, `UNIT I`).
- **Latin.** Ecclesiastical Latin appears as devotional anchors with plain-English
  glosses always within reach — *Oremus — let us pray.* Italic Cormorant for the
  English translation beneath. Never assume the reader knows the Latin.
- **Liturgical accuracy.** Days carry their proper names (*The Most Holy Trinity*,
  *St. Justin · Martyr*) and seasons map to color (see Visual Foundations).
- **Closes.** Prayers end on *Amen ✠*. Sign-of-the-Cross framing recurs.
- **No emoji.** None. The decorative vocabulary is liturgical Unicode — ☧ ✠ ❦ ❧ †
  ✦ — rendered in gold, never emoji. (Functional check marks ✓ and padlocks 🔒
  appear only as state indicators.)
- **Vibe.** *A quiet chapel, a ruled page, gold leaf catching candlelight.*

**Example copy**
> **GOSPEL** · Mark 10:32–45
> Jesus came to serve and not to be served. The greatest in his Kingdom are the
> ones who help and care for others.
>
> *What is one way you could serve someone in your family today?*

---

## 3 · Visual Foundations

**Palette.** An illuminated-manuscript scheme. Grounds are **parchment**
(`#f4ecd8`) and lighter **vellum** (`#faf4e8`). The primary is **lapis**
(`#1e3a5f`) — azurite blue for headers, titles, dark panels. **Gold**
(`#c9a32f`, with light/dark steps) is the accent of record: rules, borders,
active states, gilt emblems. Text is **warm sepia ink** (`#2a1f15`), never pure
black. Seasonal accents follow the liturgical year: **vermillion** (`#c41e1e`,
feast & rubric), **emerald** (`#2d7a4f`, Ordinary Time & success), **amethyst**
(`#5b3a72`, Lent & Advent). A dark *"candlelight"* theme is scoped to
`[data-theme="dark"]` — parchment turns to ink, lapis lifts to luminous sky-blue,
gold warms.

**Type.** Three voices. **Cinzel** — inscriptional Roman capitals — for display
and titles (uppercase, tracked 0.06–0.22em). **Cormorant Garamond** — a warm
humanist serif — for body and devotional prose, with *italic* for prayers, leads,
and translations (set at a generous 1.6–1.9 line-height). **Outfit** — a quiet
geometric sans — for UI chrome, numerals, and tracked eyebrow labels. Cormorant
reads small, so body is set at 17px.
*(All three are Google Fonts — flagged below.)*

**Backgrounds.** Never flat. A faint parchment **tooth** is layered as soft radial
gradients (`--tex-parchment` / `--tex-vellum`); the source apps also used a low-
opacity SVG fractal-noise overlay for grain. No photography, no full-bleed imagery —
the page *is* the manuscript leaf.

**Cards.** Two registers. The **vellum** card (manuscript) is sharp-cornered
(`--r-leaf`, 3px), with a hairline gilt border, a subtle top-to-bottom parchment
gradient, and an inner-highlight + soft-drop shadow (`--sh-vellum`). The **app**
card is softer (`--r-md`, 12px). The **ink** card is a lapis gradient panel for
headers and rubric callouts. Prayer callouts add a `gold-08` wash with a 3px gilt
left keyline.

**Borders & rules.** Borders are gold hairlines at low alpha (`--gold-20/30/40`).
The signature divider is the **gilt rule**: a centered ornament (❦ / ✠) flanked by
gold-gradient lines that fade at both ends.

**Shadows.** Always **warm sepia**, never neutral grey. `--sh-soft` → `--sh-card`
→ `--sh-deep` for elevation; `--sh-gold` for the gilt glow on emblems and the
illuminated CTA; `--sh-emboss` (inner) for coined gold medallions; `--sh-vellum`
for the manuscript-leaf lift.

**Radii.** Sharp for manuscript elements (3px), softer for interactive product
chrome (12–14px), pill for chips/toggles/nav, circle for emblems and lesson nodes.

**Corners / emblems.** The recurring motif is the **gilt coin** — a radial
gold gradient (`light → gold → dark`) with an emboss, bearing the Chi-Rho or a
lesson numeral. It is the app mark, the lesson node, and the unit medallion.

**Motion.** Unhurried and reverent. The canonical entrance is `scriptoria-rise`
(opacity + an 8px lift over 0.55s, `ease-out`) — fades and gentle rises, **never
bounce**. The one infinite animation allowed is `scriptoria-glow`, a slow gilt
pulse on the single "next" call-to-action. All motion respects
`prefers-reduced-motion`.

**Hover / press.** Hover washes the **gilt tint** (`--gold-08/12`) on inactive
pills, words, and cards; interactive cards lift 2px. Press **sinks 1px**
(`translateY(1px)`) or scales to 0.95 on coins — quiet, physical, never springy.
Active states fill solid (lapis or gold) with vellum text.

**Transparency & blur.** Translucent white "leaves" (`--leaf-50/60/70`) sit over
the textured ground for app cards; overlays use a near-opaque vellum
(`--leaf-95`). Blur is used sparingly, only behind modal word-popups.

**Imagery vibe.** Warm, gilded, candlelit — never cool or photographic. If imagery
is ever needed, treat it as a tipped-in illumination, not a hero photo.

---

## 4 · Iconography

Scriptoria's iconography is **typographic and liturgical**, not a drawn icon set.

- **Brand marks.** The **Chi-Rho (☧)** monogram is the heart of the brand —
  rendered in gold on lapis (Missal), as a coined emblem (Credo), or engraved in
  sepia (Lingua Latina). The three app icons live in **`assets/`**
  (`icon-little-missal.png`, `icon-credo.png`, `icon-latin-learner.png`) — extracted
  from the source apps. Use these as the canonical lockups; do not redraw them.
- **Ornaments.** Decorative glyphs are **Unicode**, set in Cinzel/Cormorant and
  colored gold: ☧ (Chi-Rho), ✠ (cross), ❦ ❧ (fleurons), † (dagger), ✦ (star).
  See the *Ornaments & Gilt Rule* card. **Never hand-draw SVG ornaments.**
- **State glyphs.** Functional only: ✓ (completed, emerald), 🔒 (locked), ← →
  (navigation), ✦ (streak). These are the *only* place near-emoji marks appear.
- **No icon font, no emoji UI.** The source apps ship no Lucide/Heroicons/etc.
  If a future surface genuinely needs lined UI icons, substitute a thin,
  classical set (e.g. **Lucide** at 1.5px stroke) and **flag the substitution** —
  but prefer Unicode ornaments and text labels first.

---

## 5 · Index — what's in this system

**Global entry**
- `styles.css` — the one file consumers link. Imports only.

**Tokens** (`tokens/`, all reachable from `styles.css`)
- `fonts.css` — Cinzel · Cormorant Garamond · Outfit (Google Fonts).
- `colors.css` — grounds, ink, lapis, gold, accents, gilt/leaf washes, semantic
  aliases, and the `[data-theme="dark"]` candlelight scope.
- `typography.css` — families, fluid scale, weights, line-heights, tracking.
- `spacing.css` — spacing, radii, shadows, motion keyframes, texture gradients.
- `base.css` — page defaults + shared primitives (`.scriptoria-rule`, eyebrow,
  title, display helpers).

**Components** (`components/core/`) — React primitives on the bundle namespace
`window.ScriptoriaDesignSystem_d07b87`:
`Button` · `Badge` · `Card` · `Divider` · `Emblem` · `NavPill` · `ProgressBar` ·
`SectionHeading` · `WordChip`. Each has a `.d.ts` contract and a `.prompt.md`
usage note; `components.card.html` is the gallery.

**Foundation cards** (`guidelines/`) — the specimens rendered in the Design System
tab: Type (Display, Body, UI), Colors (Grounds, Lapis & Ink, Gold, Accents, Dark),
Spacing (Scale, Radii, Shadows), Brand (Ornaments, Logo & App Marks).

**UI kits** (`ui_kits/`)
- `little-missal/` — the daily devotional screen (`index.html`, `MissalApp.jsx`).
- `lingua-latina/` — the Latin-learner home: progress, lesson path, flashcards
  (`index.html`, `LinguaApp.jsx`).

**Assets** (`assets/`) — the three Chi-Rho app marks.

**Reference** (`_source/`) — the original app HTML, preserved.

---

## 6 · Substitutions & flags

- **Fonts are Google Fonts**, loaded via `@import` in `tokens/fonts.css` (Cinzel,
  Cormorant Garamond, Outfit — the exact families the source apps used). They are
  **not self-hosted** here. If you need offline/self-hosted webfonts, drop the
  `.woff2` files in `assets/fonts/` and replace the `@import` with `@font-face`
  rules. *No font substitutions were made — these are the originals.*
- **No drawn iconography** was invented; the brand uses Unicode ornaments + the
  extracted PNG app marks.
