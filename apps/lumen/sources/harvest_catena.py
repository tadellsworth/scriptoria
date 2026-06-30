#!/usr/bin/env python3
"""Attach Church-Fathers commentary (Catena Aurea, Newman trans., public domain)
to each Gospel scripture card. Parses the per-chapter markdown, splits each
pericope into Father-attributed glosses, maps pericopes onto the existing Gospel
cards by verse overlap, and writes a card-keyed commentary.json (lazy-loaded by
the app). Source text is St. Thomas Aquinas' Catena Aurea in J. H. Newman's 1841
English translation -- public domain."""
import re, os, glob, json, collections

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.join(HERE, "raw_catena")
GOSPELS = {"matthew": "Matthew", "mark": "Mark", "luke": "Luke", "john": "John"}
MAX_GLOSSES = 5
TRIM_TARGET, TRIM_CEIL = 460, 640

NAME_RE = re.compile(r"\*\*([A-Z][A-ZÆŒ’'\.\- ]*?)\*\*\.?")
SMALL = {"of", "the", "in", "ap"}

def norm_name(n):
    n = n.strip().title()
    return " ".join(w if w.lower() not in SMALL else w.lower() for w in n.split())

def trim(t):
    if len(t) <= TRIM_CEIL:
        return t
    cut = t[:TRIM_CEIL]
    m = list(re.finditer(r"[.!?](?:\s|$)", cut))
    good = [x for x in m if x.end() >= TRIM_TARGET]
    if good:
        return cut[:good[0].end()].strip()
    return cut[:TRIM_TARGET].rstrip() + "\u2026"

def parse_file(path):
    txt = re.split(r"Copyright ©", open(path, encoding="utf-8").read())[0]
    parts = re.split(r"(?m)^### +(\d+):([\d–\-]+)\s*$", txt)
    out = []
    for i in range(1, len(parts), 3):
        ch = int(parts[i]); vsr = parts[i + 1]; body = parts[i + 2]
        m = re.match(r"(\d+)(?:[–\-](\d+))?", vsr)
        a = int(m.group(1)); b = int(m.group(2)) if m.group(2) else a
        segs = NAME_RE.split(body)
        glosses = []
        for j in range(1, len(segs), 2):
            name = norm_name(segs[j]); t = segs[j + 1]
            t = re.sub(r"^\s*\([^)]*\)\s*", "", t)               # leading citation
            t = re.sub(r"\\([.\[\]])", r"\1", t)                  # md escapes
            t = re.sub(r"\[([^\]]*)\]\([^)]*\)", r"\1", t)        # md links
            t = re.sub(r"\s+", " ", t).strip()
            if len(t) >= 40:
                glosses.append((name, trim(t)))
        if glosses:
            out.append((ch, a, b, glosses))
    return out

# gospel -> chapter -> list of (a,b,glosses)
peric = {g: collections.defaultdict(list) for g in GOSPELS}
for g in GOSPELS:
    for f in sorted(glob.glob(os.path.join(ROOT, g, "*.md"))):
        for ch, a, b, gl in parse_file(f):
            peric[g][ch].append((a, b, gl))

items = json.load(open(os.path.join(HERE, os.pardir, "content.json")))["items"]
gospel_cards = [c for c in items if c.get("genre") == "gospel" and c.get("type") == "scripture"]
REF = re.compile(r"^(Matthew|Mark|Luke|John)\s+(\d+):(\d+)(?:-(\d+))?")

def gloss_for(g, ch, vs, ve):
    buckets = []  # list of gloss-lists, one per overlapping pericope
    for (a, b, gl) in peric[g].get(ch, []):
        if a <= ve and b >= vs:          # verse overlap
            buckets.append(list(gl))
    # round-robin across pericopes for verse coverage
    picked, seen_last = [], None
    while buckets and len(picked) < MAX_GLOSSES:
        for bk in list(buckets):
            if not bk:
                buckets.remove(bk); continue
            nm, t = bk.pop(0)
            picked.append({"f": nm, "t": t})
            if len(picked) >= MAX_GLOSSES:
                break
    return picked

out, n_cards, n_gl, chars = {}, 0, 0, 0
no_match = 0
for c in gospel_cards:
    m = REF.match(c["ref"])
    if not m:
        continue
    g = m.group(1).lower(); ch = int(m.group(2))
    vs = int(m.group(3)); ve = int(m.group(4)) if m.group(4) else vs
    gl = gloss_for(g, ch, vs, ve)
    if gl:
        out[c["id"]] = gl
        n_cards += 1; n_gl += len(gl)
        chars += sum(len(x["t"]) + len(x["f"]) for x in gl)
    else:
        no_match += 1

payload = {"meta": {"source": "Catena Aurea, St. Thomas Aquinas (J. H. Newman trans., 1841, PD)"},
           "commentary": out}
path = os.path.join(HERE, os.pardir, "commentary.json")
json.dump(payload, open(path, "w"), ensure_ascii=False, separators=(",", ":"))
sz = os.path.getsize(path)
print(f"gospel cards          : {len(gospel_cards)}")
print(f"  with commentary     : {n_cards}")
print(f"  no pericope match   : {no_match}")
print(f"glosses attached      : {n_gl}  (avg {n_gl/max(n_cards,1):.1f}/card)")
print(f"commentary.json size  : {sz/1e6:.2f} MB")
