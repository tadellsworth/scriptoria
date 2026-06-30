# Formation Feed — Content Taxonomy & Model

Scaffold for the scrollable Catholic formation feed. This defines the content
model and the rules the feed mechanic will rely on. Branding/name is a
placeholder (`formato.v1`) — swap later without touching this structure.

## 1. Card types

The feed is a mix of short, self-contained cards. Six types in the seed:

| type        | what it is                              | seed source            |
|-------------|------------------------------------------|------------------------|
| `scripture` | a verse or short passage                 | Douay-Rheims (DRC)     |
| `catechism` | a CCC paragraph (snippet)                | CCC                    |
| `father`    | a line from a Church Father              | ANF / NPNF (PD)        |
| `summa`     | a distilled line from Aquinas            | Summa (Dominican, PD)  |
| `saint`     | a saint feature: bio + a line they said  | original bio + quote   |
| `prayer`    | a traditional prayer, full text          | public domain          |

Adding a type later = add it to `TYPES` in `validate_content.py` and to the
renderer's `switch`. Nothing else cares.

## 2. Item schema

Every item carries the same common fields; two types add a `title`.

```jsonc
{
  "id":       "scripture-jn-6-35",   // STABLE + unique. Never reuse/renumber.
  "type":     "scripture",           // one of the six types
  "body":     "And Jesus said ...",  // the text shown on the card
  "ref":      "John 6:35",           // citation / attribution line
  "source":   "DRC",                 // provenance tag (see §3)
  "tags":     ["eucharist","bread-of-life"],  // themes, for threading/filter
  "verified": true                   // §4 — is the text source-confirmed?
}
```

Type-specific:

- `saint` and `prayer` add **`title`** (e.g. "St. Augustine of Hippo").
- `saint` may add **`quote`** (a line attributed to them), shown under the bio.

`id` convention: `{type}-{slug}` (`ccc-1324`, `prayer-memorare`,
`father-augustine-restless`). Stable IDs are load-bearing — saved/seen state in
localStorage and Firebase is keyed on them, exactly like the app-ID discipline
in the other apps.

`tags` are the hook for later features: a "today's thread" (all cards sharing a
tag — e.g. an Eucharist day), or "more like this" from a saved card.

## 3. Provenance & the copyright line

`source` records where the text came from, so a public release can be filtered
by license. Values in the seed: `DRC` (public-domain scripture),
`ANF`/`NPNF` (public-domain Fathers), `Summa (Dominican trans., PD)`,
`PD` (public-domain prayers), `original bio` (my own prose), and `CCC`.

The only non-public-domain source is **CCC**. USCCB's rule: using **fewer than
5,000 words** of the Catechism needs no permission as long as the copyright
notice is shown; **more than 5,000 words**, even free to the public, needs
written permission. So:

- Personal/family build: snippet the CCC freely.
- Public/shared build: keep total CCC text well under 5,000 words and carry the
  notice — or pull CCC cards out by filtering `source === "CCC"`.

## 4. The `verified` gate

`verified: true` = the body text came from a trusted dataset or is canonical
public-domain text I'm certain of (all `scripture`, the three `prayer` cards,
CCC 1). `verified: false` = a faithful working draft whose exact wording should
be confirmed against the cited source before it ships (the Fathers/Summa
translations, several CCC paragraphs, the saint quotes — I couldn't fetch those
sources from this environment).

`validate_content.py --strict` **fails the build** on any `verified: false`
item and prints the worklist. Use `--strict` for a public release; omit it for
personal builds. Current worklist is the 13 items the validator lists.

To clear an item: confirm the wording against its `ref`, fix `body` if needed,
flip `verified` to `true`.

## 5. Daily-portion contract (for the feed mechanic)

The mechanic phase implements this; the content model already supports it.

- **Finite, not bottomless.** `DAILY_PORTION` cards per day (start at 12), then a
  soft "that's today's portion" stop card. Deliberately *not* infinite scroll.
- **Deterministic daily order.** Shuffle seeded by the ISO date → the same
  portion in the same order on every device, no server needed for ordering.
- **Interleave by type.** No more than 2 cards of the same type in a row;
  guarantee ≥1 `scripture` per portion.
- **Streak + state.** `{ lastOpenedISO, streak, savedIds[], seenIds[] }` in
  localStorage, mirrored via Firebase REST (PIN-based, same pattern as the
  language apps) so saves/streak follow the user across devices.
- **Threading (later).** Use `tags` for themed days and "more like this".

## 6. Build integration

`content.json` is the canonical, human-editable source. The build step
(mechanic phase) will:

1. `python3 validate_content.py content.json` (add `--strict` for public).
2. Inline `content.json` into `app.js` by replacing a `/*__CONTENT_JSON__*/`
   placeholder — same move as the `/*__APP_JS__*/` and `"__ICON_B64__"`
   inlining in the other apps, so the result stays a single offline file.

## Files in this scaffold

- `content.json` — the seed content (27 items; 10 scripture, 4 CCC, 4 Fathers,
  2 Summa, 4 saints, 3 prayers).
- `validate_content.py` — schema + integrity gate; `--strict` blocks unverified.
- `TAXONOMY.md` — this document.
