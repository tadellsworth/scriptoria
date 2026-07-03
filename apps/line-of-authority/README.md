# Line of Authority

A single static keepsake page: the **apostolic succession** from Jesus Christ,
through the Bishops of Rome (St. Peter to Benedict XIII) and the chain of
consecrating hands, down to the baptism of **Tad Ellsworth** at the Easter
Vigil, 2026.

Live: `https://tadellsworth.github.io/scriptoria/line-of-authority/`

## What it is

Not an app — one self-contained, mobile-first HTML page. There is **no
framework and no runtime unpacking**: every node is pre-rendered into
`index.html`. It uses the three Google Fonts of the "One Faith Delivered"
design (Playfair Display / Source Serif 4 / JetBrains Mono) with graceful serif
fallbacks, so it still reads well if the font CDN is unreachable. The page is
responsive down to narrow phones and includes tidy print styles.

The design was flattened from a bundled React/`x-dc` export so it loads
instantly and can be maintained as plain data + HTML.

## Layout

```
line-of-authority/
  build.py      # renders data.json -> index.html (the deliverable)
  data.json     # the succession data: { popes: [[name, dates]...], tail: [[name, role, date]...] }
  index.html    # the built page (source of truth for the deploy — committed)
  README.md
```

## Edit / rebuild

To change or extend the succession (e.g. add a future consecrator), edit
`data.json`, then rebuild:

```bash
cd apps/line-of-authority
python3 build.py                 # writes ./index.html
LOA_OUT=/some/dir python3 build.py   # or write elsewhere
```

`build.py` is deterministic — the same `data.json` always produces the same
`index.html`. The Pages deploy simply copies `index.html` to
`_site/line-of-authority/index.html`; it does not need to run `build.py`.
