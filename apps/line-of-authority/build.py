#!/usr/bin/env python3
"""Assemble the single static "Line of Authority" page from data.json.

The page is a keepsake: the apostolic succession from Jesus Christ, through the
Bishops of Rome (St. Peter to Benedict XIII) and the chain of consecrating hands,
down to the baptism of Tad Ellsworth at the Easter Vigil, 2026.

There is no framework and no runtime unpacking — this script pre-renders every
node into one self-contained, mobile-first HTML file. Fonts are the three Google
Fonts the design uses (Playfair Display / Source Serif 4 / JetBrains Mono) with
graceful serif fallbacks, so it degrades cleanly if the CDN is unreachable.

Usage:
    python3 build.py               # writes ./index.html next to this script
    LOA_OUT=/path python3 build.py # writes /path/index.html
"""
import json
import html
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))


def ordinal_en(n):
    """English ordinal — a faithful port of the original bundle's ordinal(),
    including JavaScript's sign-of-dividend '%', so 11/12/13 -> 'th'."""
    s = ["th", "st", "nd", "rd"]
    v = n % 100

    def jsrem(a, b):
        r = abs(a) % abs(b)
        return -r if a < 0 else r

    def pick(i):
        return s[i] if 0 <= i < len(s) else None

    return f"{n}{pick(jsrem(v - 20, 10)) or pick(v) or s[0]}"


def esc(x):
    return html.escape(x, quote=True)


def build(data):
    popes = data["popes"]
    tail = data["tail"]
    rows = []

    # Christ — the source
    rows.append(
        '      <div class="node node--source">\n'
        '        <span class="node__badge" aria-hidden="true">\n'
        '          <span class="node__badge-ring"></span>\n'
        '          <svg width="13" height="13" viewBox="0 0 14 14"><path d="M6 1h2v4h4v2H8v6H6V7H2V5h4z" fill="var(--gold)"/></svg>\n'
        '        </span>\n'
        '        <div class="node__source-name">Jesus Christ</div>\n'
        '        <div class="node__source-role">The Source of All Authority</div>\n'
        '      </div>'
    )

    def phase(label):
        return (
            '      <div class="phase" role="separator">\n'
            '        <span class="phase__mark" aria-hidden="true">✦</span>\n'
            f'        <div class="phase__label">{esc(label)}</div>\n'
            '      </div>'
        )

    def node(name, role, date):
        return (
            '      <div class="node">\n'
            '        <span class="node__dot" aria-hidden="true"></span>\n'
            f'        <div class="node__name">{esc(name)}</div>\n'
            f'        <div class="node__role">{esc(role)}</div>\n'
            f'        <div class="node__date">{esc(date)}</div>\n'
            '      </div>'
        )

    rows.append(phase("The Bishops of Rome — St. Peter to Benedict XIII"))
    for i, (name, dates) in enumerate(popes):
        rows.append(node(name, f"{ordinal_en(i + 1)} Bishop of Rome", f"Reigned {dates}"))

    rows.append(phase("The Consecration Chain — Hands upon Hands"))
    for name, role, date in tail:
        rows.append(node(name, role, date))

    nodes_html = "\n".join(rows)

    favicon = (
        "data:image/svg+xml,"
        "%3Csvg%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%2014%2014'%3E"
        "%3Crect%20width='14'%20height='14'%20fill='%234A0F1A'/%3E"
        "%3Cpath%20d='M6%201h2v4h4v2H8v6H6V7H2V5h4z'%20fill='%23C5A55A'/%3E%3C/svg%3E"
    )
    fonts = (
        "https://fonts.googleapis.com/css2?"
        "family=Playfair+Display:ital,wght@0,700;0,900;1,700&"
        "family=Source+Serif+4:ital,opsz,wght@0,8..60,300;0,8..60,400;0,8..60,600;1,8..60,300;1,8..60,400&"
        "family=JetBrains+Mono:wght@400;600&display=swap"
    )

    return TEMPLATE.format(favicon=favicon, fonts=fonts, nodes=nodes_html)


# The double braces below are literal CSS braces escaped for str.format().
TEMPLATE = '''<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="theme-color" content="#4A0F1A">
<meta name="color-scheme" content="light">
<meta name="description" content="Line of Authority — the apostolic succession from Jesus Christ, through the Bishops of Rome and the chain of consecrating hands, to the baptism of Tad Ellsworth at the Easter Vigil, 2026.">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
<meta property="og:title" content="Line of Authority — Tad Ellsworth">
<meta property="og:description" content="Apostolic succession from Jesus Christ to the Easter Vigil, 2026.">
<meta property="og:type" content="website">
<title>Line of Authority — Tad Ellsworth</title>
<link rel="icon" href="{favicon}">
<link rel="apple-touch-icon" href="{favicon}">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="{fonts}">
<style>
/* ══════════════════════════════════════════════════════
   LINE OF AUTHORITY  ·  One Faith Delivered
   A crimson + gold ecclesiastical palette on warm parchment.
   Flattened to a single static, offline-graceful, mobile-first page.
   ══════════════════════════════════════════════════════ */
:root {{
  --crimson:      #8B0000;
  --gold:         #C5A55A;
  --dark-gold:    #8B7335;
  --parchment:    #F5F0E8;
  --ink:          #2A2A2A;
  --muted:        #666666;
  --surface-page: var(--parchment);

  --font-display: 'Playfair Display', Georgia, 'Times New Roman', serif;
  --font-body:    'Source Serif 4', Georgia, serif;
  --font-mono:    'JetBrains Mono', ui-monospace, 'SF Mono', SFMono-Regular, Menlo, monospace;

  --grad-hero:  linear-gradient(135deg, #4A0F1A 0%, #6B1D2A 40%, #3D1520 100%);
  --grad-panel: linear-gradient(135deg, #4A0F1A, #6B1D2A);
  --shadow-sm:  0 2px 10px rgba(0,0,0,0.06);
  --shadow-md:  0 2px 12px rgba(0,0,0,0.06);
  --radius-md:  4px;
  --radius-lg:  6px;
  --texture-scanline: repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.03) 2px, rgba(255,255,255,0.03) 4px);

  --rail-bg: repeating-linear-gradient(to bottom, var(--crimson) 0 3px, transparent 3px 9px);
  --row-gap: 22px;

  /* geometry of the timeline rail */
  --rail-x: 19px;      /* centre line of the dots */
  --rail-indent: 46px; /* text inset from the rail */
}}

* {{ box-sizing: border-box; }}
html {{ background: var(--surface-page); -webkit-text-size-adjust: 100%; }}
body {{
  margin: 0;
  background: var(--surface-page);
  color: var(--ink);
  font-family: var(--font-body);
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
}}

/* ── Hero ── */
.hero {{
  background: var(--grad-hero);
  color: var(--parchment);
  padding: 76px 40px 60px;
  padding-left: max(40px, env(safe-area-inset-left));
  padding-right: max(40px, env(safe-area-inset-right));
  text-align: center;
  position: relative;
  overflow: hidden;
}}
.hero__scan {{ position: absolute; inset: 0; background: var(--texture-scanline); pointer-events: none; }}
.hero__inner {{ position: relative; z-index: 1; }}
.hero__eyebrow {{
  font-family: var(--font-mono); font-size: 0.7rem; font-weight: 600;
  letter-spacing: 0.18em; text-transform: uppercase; color: var(--gold);
  opacity: 0.85; margin-bottom: 22px;
}}
.ornament {{ color: var(--gold); font-size: 1rem; letter-spacing: 12px; opacity: 0.7; margin-bottom: 18px; }}
.hero__title {{
  font-family: var(--font-display); font-size: clamp(2.2rem, 8vw, 3.4rem);
  font-weight: 900; letter-spacing: -0.5px; color: var(--parchment);
  margin: 0 0 12px; line-height: 1.15;
}}
.hero__title span {{ color: var(--gold); }}
.hero__name {{
  font-family: var(--font-body); font-size: clamp(1.15rem, 4vw, 1.35rem);
  font-weight: 300; font-style: italic; color: rgba(245,240,232,0.82); margin: 0;
}}
.hero__meta {{
  font-family: var(--font-mono); font-size: 0.66rem; font-weight: 600;
  letter-spacing: 0.15em; text-transform: uppercase; color: rgba(197,165,90,0.7);
  margin-top: 24px; line-height: 1.8;
}}

/* ── Chain / timeline ── */
.chain {{ max-width: 760px; margin: 0 auto; padding: 56px 28px 80px; }}
.rail {{ position: relative; }}
.rail::before {{
  content: ""; position: absolute; left: var(--rail-x); top: 15px; bottom: 6px;
  width: 2px; background: var(--rail-bg); opacity: 0.85;
}}

.node {{ position: relative; padding: 0 0 var(--row-gap) var(--rail-indent); }}
.node__dot {{
  position: absolute; left: 12px; top: 5px; width: 15px; height: 15px;
  border-radius: 50%; border: 2px solid var(--crimson); background: var(--parchment);
  box-shadow: 0 0 0 5px var(--parchment);
}}
.node__name {{ font-weight: 600; font-size: 1.04rem; color: var(--ink); line-height: 1.35; }}
.node__role {{ font-style: italic; font-size: 0.92rem; color: var(--muted); margin-top: 2px; }}
.node__date {{
  font-family: var(--font-mono); font-size: 0.66rem; font-weight: 600;
  letter-spacing: 0.12em; text-transform: uppercase; color: var(--dark-gold); margin-top: 5px;
}}

/* Christ — the source (larger badge + crimson display name) */
.node--source {{ padding-bottom: 26px; }}
.node__badge {{
  position: absolute; left: 5px; top: 0; width: 29px; height: 29px; border-radius: 50%;
  background: var(--grad-panel); box-shadow: 0 0 0 5px var(--parchment), var(--shadow-sm);
  display: flex; align-items: center; justify-content: center;
}}
.node__badge-ring {{ position: absolute; inset: 4px; border: 1px solid rgba(197,165,90,0.45); border-radius: 50%; }}
.node__source-name {{ font-family: var(--font-display); font-weight: 700; font-size: 1.45rem; color: var(--crimson); line-height: 1.2; }}
.node__source-role {{
  font-family: var(--font-mono); font-size: 0.68rem; font-weight: 600;
  letter-spacing: 0.14em; text-transform: uppercase; color: var(--dark-gold); margin-top: 6px;
}}

/* phase divider */
.phase {{ position: relative; padding: 8px 0 16px var(--rail-indent); margin-top: 6px; }}
.phase__mark {{
  position: absolute; left: 12px; top: 5px; color: var(--gold); font-size: 0.95rem;
  line-height: 1; background: var(--parchment); padding: 4px 0;
}}
.phase__label {{
  font-family: var(--font-mono); font-size: 0.68rem; font-weight: 600;
  letter-spacing: 0.15em; text-transform: uppercase; color: var(--crimson);
}}

/* connector into the terminus */
.connector {{ width: 2px; height: 30px; margin-left: var(--rail-x); background: var(--rail-bg); opacity: 0.85; }}

/* Tad — the arrival */
.terminus {{
  position: relative; background: var(--grad-hero); border-radius: var(--radius-lg);
  padding: 38px 40px; overflow: hidden; box-shadow: var(--shadow-md); text-align: center;
}}
.terminus__frame {{ position: absolute; inset: 8px; border: 1px solid rgba(197,165,90,0.28); border-radius: var(--radius-md); pointer-events: none; }}
.terminus__inner {{ position: relative; z-index: 1; }}
.terminus__eyebrow {{
  font-family: var(--font-mono); font-size: 0.66rem; font-weight: 600;
  letter-spacing: 0.16em; text-transform: uppercase; color: var(--gold); opacity: 0.85; margin-bottom: 14px;
}}
.terminus__name {{ font-family: var(--font-display); font-weight: 700; font-size: clamp(1.7rem, 6vw, 2rem); color: var(--gold); line-height: 1.1; margin-bottom: 12px; }}
.terminus__sub {{ font-style: italic; font-size: clamp(0.95rem, 3.6vw, 1.05rem); color: rgba(245,240,232,0.9); }}
.terminus__orn {{ color: var(--gold); font-size: 0.85rem; letter-spacing: 10px; opacity: 0.7; margin-top: 20px; }}

/* ── Small screens ── */
@media (max-width: 480px) {{
  .hero {{ padding: 56px 22px 44px; padding-left: max(22px, env(safe-area-inset-left)); padding-right: max(22px, env(safe-area-inset-right)); }}
  .hero__eyebrow {{ margin-bottom: 16px; }}
  .ornament {{ letter-spacing: 9px; }}
  .chain {{ padding: 40px 18px 64px; }}
  .terminus {{ padding: 32px 22px; }}
  :root {{ --rail-indent: 42px; }}
}}

/* ── Print (a keepsake worth printing) ── */
@media print {{
  html, body {{ background: #fff; -webkit-print-color-adjust: exact; print-color-adjust: exact; }}
  .node, .phase, .terminus {{ break-inside: avoid; }}
}}

@media (prefers-reduced-motion: reduce) {{
  * {{ scroll-behavior: auto; }}
}}
</style>
</head>
<body>
<article>
  <header class="hero">
    <div class="hero__scan"></div>
    <div class="hero__inner">
      <div class="hero__eyebrow">Apostolic Succession</div>
      <div class="ornament">✦ &nbsp; ✦ &nbsp; ✦</div>
      <h1 class="hero__title">Line of <span>Authority</span></h1>
      <p class="hero__name">Tad Ellsworth</p>
      <p class="hero__meta">From Jesus Christ · Through the Hands of His Bishops · To the Easter Vigil, 2026</p>
    </div>
  </header>

  <main class="chain">
    <div class="rail">
{nodes}
    </div>

    <div class="connector" aria-hidden="true"></div>

    <section class="terminus">
      <div class="terminus__frame" aria-hidden="true"></div>
      <div class="terminus__inner">
        <div class="terminus__eyebrow">Received into the Church</div>
        <div class="terminus__name">Tad Ellsworth</div>
        <div class="terminus__sub">Baptized — Easter Vigil, 2026 · Jasper, Georgia</div>
        <div class="terminus__orn">✦ &nbsp; ✦ &nbsp; ✦</div>
      </div>
    </section>
  </main>
</article>
</body>
</html>
'''


def main():
    data = json.load(open(os.path.join(HERE, "data.json"), encoding="utf-8"))
    doc = build(data)

    out_dir = os.environ.get("LOA_OUT", HERE)
    os.makedirs(out_dir, exist_ok=True)
    out_path = os.path.join(out_dir, "index.html")
    with open(out_path, "w", encoding="utf-8") as f:
        f.write(doc)

    # sanity checks
    dated = len(data["popes"]) + len(data["tail"])
    assert doc.count('class="node"') == dated, "node count mismatch"
    assert 'class="node node--source"' in doc, "missing source node"
    assert doc.count('class="phase"') == 2, "expected two phase dividers"
    print(f"wrote {out_path}")
    print(f"  {len(data['popes'])} popes + {len(data['tail'])} consecrators "
          f"+ Christ + Tad  |  {len(doc.encode()):,} bytes")


if __name__ == "__main__":
    sys.exit(main())
