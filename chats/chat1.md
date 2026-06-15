# Super App Integration Design

_Started 2026-06-15 16:54 UTC_

---

## User

i have 5 different latin & catholic apps I'd like to make into one Super app. Can you review the attached and make me a prototype of how they would all work together?

## Assistant

I'll dig into your five apps and the Scriptoria design system before proposing how to unify them. Let me read everything first.

_[tool: read_file]_

_[tool: read_file]_

_[tool: read_file]_

_[tool: read_file]_

_[tool: read_file]_

_[tool: list_files]_

These five apps are rich — I've now got a clear picture of each:

- **The Little Missal** — children's daily devotional (Gospel · wonder · prayer, day-by-day)
- **Lingua Latina** — Ecclesiastical-Latin learner (flashcards, tappable words)
- **Credo** — gamified Catechism path (Duolingo-style nodes, XP/streak/hearts)
- **Confiteor** — Mass / Confession / Adoration finder near you (live "next opportunity," map, parish cards)
- **Laudate** — a full daily companion (readings, Liturgy of the Hours, prayers, rosary, calendar/streak, journal, confession tracker, examen)

There's real overlap to resolve (confession tracking + readings + catechism each appear in more than one), so before I design the unified shell I want to lock a few decisions.

_[tool: questions_v2]_

## User

Questions answered:
- concept: Explore a few options
- name: Scriptoria (the design-system name)
- audience: An individual adult deepening their faith
- scope: The hub + every screen as a polished static mockup
- variations: Yes — 3 distinct home-screen directions to choose from
- gamification: Minimal — drop most gamification, keep a quiet daily streak
- device: iPhone (mobile, in a device frame)
- identity: Homogenize fully — one consistent Scriptoria look everywhere
- theme: Parchment/light (the Missal & Credo default)

## Assistant

Got it — Scriptoria, individual adult, fully homogenized parchment look, iPhone frame, minimal gamification, and a complete static mockup set with 3 home directions. Let me set up the design context before building.

_[tool: list_files]_

_[tool: read_file]_

_[tool: read_file]_

Let me read the token files and the component definitions to lift exact values.

_[tool: read_file]_

_[tool: read_file]_

_[tool: read_file]_

_[tool: read_file]_

Now let me grab the iPhone frame starter and check how the DS React components are shaped.

_[tool: copy_starter_component]_

_[tool: read_file]_

_[tool: read_file]_

_[tool: list_files]_

I have the full system mapped. Let me set up a plan and start building.

**Information architecture** — I'll merge the five apps into five tabs:
- **Today** ← Laudate readings + Little Missal devotional
- **Pray** ← Laudate prayers, Rosary, Hours, Examen
- **Learn** ← Credo (Catechism) + Lingua Latina (gentle, no hearts/XP)
- **Find** ← Confiteor (Mass/Confession/Adoration near you)
- **Me** ← profile, quiet streak, journal, confession tracker, progress

_[tool: update_todos]_

Now let me snip the large file-read outputs I've already absorbed, then build the scaffold and Section A.

_[tool: snip]_

Now I'll build the scaffold — a dark "scriptorium desk" stage, a design brief, and the first section with three home-screen directions. This is a large first write.

_[tool: dc_write]_

## Assistant

_[tool: dc_write]_

Let me see how the scaffold and Section A render before continuing.

_[tool: show_html]_

_[tool: show_html]_

The masthead and brief look great. Let me scroll down to see the three phone mockups.

_[tool: save_screenshot]_

_[tool: save_screenshot]_

The Leaf renders beautifully — dropcap, gilt rule, gospel card all on-system. Now let me append the remaining sections, each a finished tab screen. Starting with **Today**.

_[tool: dc_html_str_replace]_

Now **Pray** — the prayer library plus the Rosary player.

_[tool: dc_html_str_replace]_

## Assistant

I'll snip resolved screenshot/exploration messages, then continue with the **Pray** section.

_[tool: snip]_

_[tool: dc_html_str_replace]_

Now **Learn** — the Learn home, a Credo catechism lesson (de-gamified), and a Lingua Latina flashcard.

_[tool: dc_html_str_replace]_

Now **Find** (Confiteor) and **Me** to finish the set.

_[tool: dc_html_str_replace]_

Finally, **Me** — profile with the quiet streak, plus the journal.

_[tool: dc_html_str_replace]_

All five tabs are built. Let me capture the full set to verify it holds together before handing off.

_[tool: save_screenshot]_

_[tool: save_screenshot]_

The build holds together — gilt coins, lapis panels, parchment grounds, consistent tab bar throughout. Let me hand it off and run verification.

_[tool: snip]_

_[tool: update_todos]_

Here's your **Scriptoria Super App** — a single concept board showing how all five apps live as one product.

**The merge:** five apps → five tabs, all in one homogenized parchment look (Credo's gamified chrome and Confiteor's dark theme retired):
- **Today** ← Laudate readings + Little Missal devotion
- **Pray** ← prayer library, Rosary, Hours, Examen
- **Learn** ← Credo catechism + Lingua Latina (hearts/XP dropped, gilt coins kept)
- **Find** ← Confiteor confession/Mass/Adoration finder
- **Me** ← one quiet ✦ streak, journal, confession tracker, progress

**13 finished screens** in iPhone frames, anchored to real June 15 2026 liturgical content (Mon, 11th Week OT — Matthew 5:38–42), including **three home directions** to choose from: A1 *The Leaf* (one devotional page), A2 *The Cloister* (gilt-tile hub), A3 *The Day's Hours* (rule-of-life timeline).

_[tool: done]_

Delivered. The adherence check flags that I styled against the design system's **CSS token layer** (its palette, type, `.scriptoria-title`/`-eyebrow`/`-rule` classes, gilt-coin and card vocabulary) rather than mounting its React bundle — a deliberate choice for a 13-screen static concept board, where inline-styled frames stream instantly and stay directly editable. The visuals are fully grounded in Scriptoria; nothing invented.

Page loads clean with no console errors. When you pick a home direction (A1–A3), I'll wire that flow into a tappable prototype and bring in the live DS components where real interaction warrants them.

## User

for home lets go with A1. for C lets go with C1. for D lets go with D1. and for E lets do E1. for F lets do F1

## Assistant

A1, C1, D1, E1, F1 — plus Today is A1. I'll wire those into a single working tappable prototype: one phone, the five tabs actually switch screens, with a couple of real touches (the Candlelight theme toggle works). Let me pull the exact chosen-screen markup from the board first.

_[tool: read_file]_

I have what I need. Now I'll build a **working prototype**: one phone where the five tabs actually switch between A1 / C1 / D1 / E1 / F1, and the Candlelight toggle on the Me screen flips the whole app into the dark theme. Let me snip the now-settled board-build messages first, then write it.

_[tool: snip]_

_[tool: dc_write]_

Let me verify the prototype renders and the tabs actually switch state, including the theme toggle.

_[tool: show_html]_

Today renders cleanly. Now let me exercise the actual interactivity — switch through the tabs and flip the Candlelight theme.

_[tool: multi_screenshot]_

Everything works: the five tabs swap screens (Pray → Rosary, Learn → Credo/Lingua, Find → Confiteor, Me → profile), and tapping **Candlelight** flips the whole app into the dark by-candlelight theme — lapis lifts to sky-blue, parchment turns to ink, status-bar icons invert. That's the real Scriptoria dark scope doing the work.

_[tool: snip]_

_[tool: done]_

Done — your **Scriptoria Prototype** is live and tappable.

**What works:**
- The five tabs (Today / Pray / Learn / Find / Me) switch between your chosen screens **A1 · C1 · D1 · E1 · F1**
- The **Candlelight** toggle on the Me tab flips the entire app into Scriptoria's dark theme
- Press states on cards, rows, and buttons throughout

The adherence check again notes I composed against the design system's **CSS token/class layer** rather than mounting its React bundle — the same deliberate call as the board, keeping the prototype lightweight and every screen directly editable. All color, type, spacing, and component vocabulary is genuine Scriptoria; loads clean with no console errors.

Two files now: **Scriptoria Super App** (the 13-screen concept board) and **Scriptoria Prototype** (this working flow). Natural next steps if you want them: deepen one tab into a sub-flow (e.g. tapping the Rosary actually opens the bead player C2, or a parish card opens detail E2), or wire the streak/journal to persist. Just say which.

## User

should we finish fleshing out the entire app here or can I move it to claude code? not sure what is most efficient to finish the app now that we have the design nailed down

## Assistant

Short answer: **move the build to Claude Code** — but let's make the handoff clean here first, because a few things are far cheaper to decide in pixels than in code.

Here's how I'd split it:

**Finish here (design decisions, fast and visual)**
- Any screens a developer would otherwise have to guess at: the sub-flows you haven't seen yet (Rosary bead player, a Credo lesson, flashcard, parish detail), plus the unglamorous-but-important states — empty journal, "no confession nearby," loading, onboarding, settings.
- Dark/Candlelight across all screens (right now it's proven on Me; worth confirming the others).
- This is the stuff that causes churn if a dev invents it and you redo it.

**Build in Claude Code (real software)**
- The actual app is five working programs with live behavior — lectionary data, geolocation + distance math for confession times, localStorage for streak/journal/confession tracker, the Credo curriculum, the Rosary engine, PWA packaging. That's engineering, not design.
- **Big efficiency unlock:** your five source HTML files already contain all that working logic and real data. The Claude Code job is mostly *merge + re-skin under this design system* — not build from scratch. That's a much smaller lift than it looks.

**The bridge:** there's a **Handoff to Claude Code** capability that packages this design — the Scriptoria tokens, the screen specs, the component vocabulary — into a developer-ready bundle. I'd pair it with the five original apps as the logic source.

So my recommendation: spend one more short pass here finishing the missing screens/states, then I generate the Claude Code handoff package and you build there. Want me to **(a)** flesh out the remaining screens + states now, **(b)** go straight to preparing the handoff package, or **(c)** both — screens first, then package?

## User

ok lets finalize things here. do (A) first

## Assistant

Good call — finishing the secondary screens and edge states here means the Claude Code handoff has nothing to guess at. I'll add them to the concept board as a new section. Let me clear settled context and check the board's tail first.

_[tool: snip]_

_[tool: read_file]_

Now I'll add **Section G — secondary screens & states**. First batch: onboarding, Liturgy of the Hours, and the Examen.

_[tool: dc_html_str_replace]_

Now the confession tracker with its record modal, full settings, and the quiet edge states.

_[tool: dc_html_str_replace]_

Let me update the closing note to reflect the now-complete set.

_[tool: str_replace_edit]_

Let me verify Section G renders cleanly — checking the onboarding, Hours timeline, and the confession modal.

_[tool: show_html]_

_[tool: save_screenshot]_

The tracker renders well. Let me confirm the modal sheet at the bottom of that screen.

_[tool: save_screenshot]_

The record sheet, settings, Hours, examen, onboarding, and quiet states all render on-system. Section G is complete — the board now documents all 19 screens.

_[tool: snip]_

_[tool: done]_

The board is now complete. **Section G** adds the screens a developer would otherwise have to invent:

- **G1 · Welcome** — first-run, one Chi-Rho coin and one button
- **G2 · Liturgy of the Hours** — the full canonical day, Lauds → Compline, with Latin
- **G3 · Daily Examen** — the five Ignatian steps
- **G4 · Confession + record sheet** — the tracker with its bottom-sheet modal open
- **G5 · Settings** — theme, Show Latin, reminders, reading cycle, location, account
- **G6 · Quiet states** — empty-day and offline, kept reverent rather than error-red

**The design is now complete: 19 screens across Sections A–G**, every tab, every sub-flow, every edge state, in one consistent Scriptoria look. (The adherence note is the same standing choice — composing on the design system's CSS token layer; no console errors.)

You're in a good spot to hand off. When you're ready, say the word and I'll generate the **Claude Code handoff package** — design tokens, screen specs, and component notes — paired with your five original apps as the working-logic source, so the build there is a merge-and-reskin rather than a rewrite.

## User

ok generate the handoff

## Assistant

_[tool: read_skill_prompt]_

_[tool: snip]_

Reading the handoff spec — now I'll assemble the package: a self-sufficient README, the design files, the exact design tokens, and (the efficiency unlock) your five original apps as the working-logic source.

_[tool: write_file]_

_[tool: copy_files]_

The package is assembled. Let me present it for download.

_[tool: present_fs_item_for_download]_

Your **Claude Code handoff** is ready to download above.

**What's inside `design_handoff_scriptoria_super_app/`:**
- **`README.md`** — self-sufficient spec: the 5-tab IA, all 19 screens (layout, components, exact copy), interactions, state, the full **design-token table** (every hex, type scale, spacing, radii, shadows), and a **Source-App Logic Map** telling the developer exactly where each behavior/dataset already lives.
- **`designs/`** — the 19-screen board + the working prototype.
- **`design_system/`** — the Scriptoria token CSS + component bundle.
- **`source_apps/`** — your five original working apps (the merge-and-reskin source).

The README leads with the key framing: **reuse, don't rewrite** — most of the build is porting existing logic under the new look, not starting over.

One option per the handoff process: I can add **screenshots of each screen** into the bundle so the developer has visual reference alongside the spec (not included by default). Want me to add those?

