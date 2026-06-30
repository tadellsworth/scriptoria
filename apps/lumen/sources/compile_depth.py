#!/usr/bin/env python3
"""Merge all 'go deeper' layers into one lazy-loaded depth.json, keyed by card id:
  - gospel scripture  -> Fathers' commentary (Catena Aurea, from commentary.json)
  - catechism Q&A      -> Kinkead's explanation (kinkead_expl.json)
  - saints             -> the complete life (butler_lives.json + shea_lives.json)
The app fetches this once in the background and renders the matching section when
a card is tapped. Output: ROOT/depth.json"""
import json, os, re

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)

def load(p):
    return json.load(open(p, encoding="utf-8")) if os.path.exists(p) else {}

def rechunk(text):
    """Restore readable paragraphs to a flattened life: keep explicit breaks
    (e.g. the Reflection coda), and split long runs into ~3-sentence paragraphs."""
    out = []
    for seg in text.split("\n\n"):
        seg = seg.strip()
        if not seg:
            continue
        if len(seg) <= 600:
            out.append(seg); continue
        buf = ""
        for s in re.split(r'(?<=[.!?\u201d"])\s+', seg):
            if buf and len(buf) + len(s) > 480:
                out.append(buf.strip()); buf = s
            else:
                buf = (buf + " " + s).strip()
        if buf:
            out.append(buf.strip())
    return out

items = {}

# 1. Fathers (gospel) -- from the catena harvester's output
cat = load(os.path.join(ROOT, "commentary.json"))
fathers_src = (cat.get("meta") or {}).get("source", "Catena Aurea (Newman trans., PD)")
for cid, gl in (cat.get("commentary") or {}).items():
    items[cid] = {"k": "fathers", "g": gl}

# 2. Kinkead explanations (catechism)
for cid, paras in load(os.path.join(HERE, "kinkead_expl.json")).items():
    items[cid] = {"k": "expl", "p": paras}
expl_src = "An Explanation of the Baltimore Catechism, T. L. Kinkead (1891, PD)"

# 3. Saints' full lives
for fn in ("butler_lives.json", "shea_lives.json"):
    for cid, text in load(os.path.join(HERE, fn)).items():
        items[cid] = {"k": "life", "p": rechunk(text)}

payload = {"meta": {"fathers": fathers_src, "expl": expl_src}, "items": items}
out = os.path.join(ROOT, "depth.json")
json.dump(payload, open(out, "w", encoding="utf-8"), ensure_ascii=False, separators=(",", ":"))

from collections import Counter
kinds = Counter(v["k"] for v in items.values())
print(f"depth.json items: {len(items)}  by kind: {dict(kinds)}")
print(f"size: {os.path.getsize(out)/1e6:.2f} MB -> {out}")
