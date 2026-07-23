# Habla — Speak Spanish

A single-file, installable **PWA** for learning to *speak* Spanish fast.

Live: `https://tadellsworth.github.io/scriptoria/habla/`

## Philosophy

Speaking-first, not vocabulary-grinding. The app is built around the fastest path
to talking:

1. **Pronunciation** — the handful of sounds English speakers miss.
2. **Present tense** — one ending pattern that carries ~80% of everyday speech.
3. **Structure** — putting words in Spanish order.
4. **The core ~800 words** — the words real conversation is actually made of.

It's "Duolified" (streaks, XP, a lesson path, sound effects, spaced repetition) but
every lesson pushes real **grammar** — especially present-tense conjugation — instead
of random vocabulary.

## What's here (MVP foundation)

- **Learn** — a four-unit lesson path (pronunciation → present tense → verbs → speaking)
  that routes into the practices below.
- **Verbs** — a **present-tense conjugation engine**: regular `-ar/-er/-ir` and
  stem-changers (`e→ie`, `o→ue`, `e→i`, `u→ue`) are computed; ~15 high-frequency
  irregulars (ser, estar, ir, tener, hacer, decir, venir, poner, salir, ver, dar,
  saber, conocer, haber…) are stored explicitly. Browse full tables + hear them, or
  drill any verb.
- **Words** — themed decks covering the start of the core-800 (pronouns, question
  words, connectors, prepositions, time, numbers, everyday nouns, adjectives) with
  flashcards and a **spaced-repetition** daily review.
- **Speak** — a listening quiz (hear Spanish → pick the meaning), a **speaking
  practice** (say the prompt aloud; uses on-device speech recognition to check you
  where the browser supports `es`), and a sentence builder.
- **You** — streak / XP / mastery stats, plus a **vosotros** toggle (default off =
  Latin American, matching the source study plan's seseo).

State is `localStorage` (`habla.v1`): XP, streak, SRS schedule, verb-form mastery,
lesson completion, settings. Spanish audio uses the Web Speech API (`es-MX`).

## Structure = easy to extend

Content is data-driven — `VERBS`, `DECKS`, `GRAMMAR`, `SENTENCES`, and `PATH` are
plain arrays/objects near the top of the script. Adding a verb, a deck, a grammar
card, or a whole new unit is a one-object edit. The roadmap (next tenses, more of
the 800, and an **AI conversation partner** via Claude Haiku) slots onto this base.

> No build step — the Pages workflow copies this folder to `_site/habla/`. Bump
> `sw.js`'s `CACHE` to push an update to installed clients.
