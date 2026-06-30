#!/usr/bin/env python3
"""Harvest scripture passages from the scrollmapper Douay-Rheims (DRC) dataset.
Chunks each chapter into readable multi-verse passages, tags genre for the
office composer, and filters genealogy/census filler. -> scripture_harvest.json
"""
import json, re, os

HERE = os.path.dirname(os.path.abspath(__file__))
DRC = json.load(open(os.path.join(HERE, "DRC.json")))
IDX = {b["name"]: b for b in DRC["books"]}

# book -> (genre, display name, id-abbrev, psalm-style DR numbering flag)
BOOKS = [
    ("Psalms",        "psalm",   "Psalm",       "ps",   True),
    ("Proverbs",      "wisdom",  "Proverbs",    "prv",  False),
    ("Ecclesiastes",  "wisdom",  "Ecclesiastes","ecc",  False),
    ("Wisdom",        "wisdom",  "Wisdom",      "wis",  False),
    ("Sirach",        "wisdom",  "Sirach",      "sir",  False),
    ("Matthew",       "gospel",  "Matthew",     "mt",   False),
    ("Mark",          "gospel",  "Mark",        "mk",   False),
    ("Luke",          "gospel",  "Luke",        "lk",   False),
    ("John",          "gospel",  "John",        "jn",   False),
    ("Romans",        "epistle", "Romans",      "rom",  False),
    ("I Corinthians", "epistle", "1 Corinthians","1cor",False),
    ("Ephesians",     "epistle", "Ephesians",   "eph",  False),
    ("Philippians",   "epistle", "Philippians", "php",  False),
    ("Colossians",    "epistle", "Colossians",  "col",  False),
    ("Hebrews",       "epistle", "Hebrews",     "heb",  False),
    ("James",         "epistle", "James",       "jas",  False),
    ("I Peter",       "epistle", "1 Peter",     "1pt",  False),
    ("I John",        "epistle", "1 John",      "1jn",  False),
]

TARGET, MIN_CHARS, MAX_CHARS, MAX_VERSES, MERGE_TAIL = 320, 150, 620, 7, 110
GENEALOGY = re.compile(r"\bbegot\b|\bbegat\b|\bthe son of\b", re.I)

def clean(t):
    return re.sub(r"\s+", " ", t).strip()

def is_filler(text):
    return len(GENEALOGY.findall(text)) >= 3

def chunk_chapter(verses):
    """verses: list of (vnum, text) -> list of (vstart, vend, text)."""
    chunks, cur, cstart, clen = [], [], None, 0
    for vnum, text in verses:
        if cstart is None:
            cstart = vnum
        cur.append((vnum, text))
        clen += len(text) + 1
        long_enough = clen >= TARGET and len(cur) >= 2
        if long_enough or clen >= MAX_CHARS or len(cur) >= MAX_VERSES:
            chunks.append((cstart, vnum, clean(" ".join(t for _, t in cur))))
            cur, cstart, clen = [], None, 0
    if cur:  # flush remainder
        body = clean(" ".join(t for _, t in cur))
        if chunks and len(body) < MERGE_TAIL:           # merge tiny tail into previous
            ps, pe, pt = chunks[-1]
            chunks[-1] = (ps, cur[-1][0], clean(pt + " " + body))
        elif len(body) >= 60:
            chunks.append((cstart, cur[-1][0], body))
    return chunks

def main():
    out, seen = [], set()
    per_book = {}
    for name, genre, disp, abbr, drnum in BOOKS:
        if name not in IDX:
            print("  skip (missing):", name); continue
        count = 0
        for ch in IDX[name]["chapters"]:
            cnum = ch["chapter"]
            verses = [(v["verse"], clean(v["text"])) for v in ch["verses"] if v.get("text", "").strip()]
            for vstart, vend, body in chunk_chapter(verses):
                if len(body) < MIN_CHARS and vstart == vend:
                    continue                              # lone short fragment
                if is_filler(body):
                    continue
                suffix = " (DR)" if drnum else ""
                if vstart == vend:
                    ref = f"{disp} {cnum}:{vstart}{suffix}"
                    iid = f"scripture-{abbr}-{cnum}-{vstart}"
                else:
                    ref = f"{disp} {cnum}:{vstart}-{vend}{suffix}"
                    iid = f"scripture-{abbr}-{cnum}-{vstart}-{vend}"
                if iid in seen:
                    continue
                seen.add(iid)
                out.append({
                    "id": iid, "type": "scripture", "genre": genre,
                    "body": body, "ref": ref, "source": "DRC",
                    "tags": [genre, abbr], "verified": True,
                })
                count += 1
        per_book[disp] = count
    json.dump(out, open(os.path.join(HERE, "scripture_harvest.json"), "w"),
              ensure_ascii=False, indent=1)
    print(f"harvested {len(out)} scripture passages")
    from collections import Counter
    g = Counter(x["genre"] for x in out)
    print("by genre:", dict(g))
    print("by book :", per_book)

if __name__ == "__main__":
    main()
