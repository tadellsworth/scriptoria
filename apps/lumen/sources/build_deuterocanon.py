#!/usr/bin/env python3
"""Curated 'notable portions' of the deuterocanonical books, extracted verbatim
from the same scrollmapper Douay-Rheims (DRC) source as the rest of Scripture, so
text and numbering match the existing cards. Titled highlights, weighted to Wisdom.
Narrative books were never harvested (the scripture harvester only pulls the
sapiential + gospel + epistle books), so this fills that gap."""
import json, os, re

HERE = os.path.dirname(os.path.abspath(__file__))
DRC = json.load(open(os.path.join(HERE, "DRC.json")))
B = {b["name"]: b for b in DRC["books"]}

def vtext(src, ch, a, b):
    chap = next(c for c in B[src]["chapters"] if c["chapter"] == ch)
    parts = [v["text"] for v in chap["verses"] if a <= v["verse"] <= b]
    return re.sub(r"\s+", " ", " ".join(parts)).strip()

# (abbr, display, src_book, chapter, vstart, vend, genre, title)
P = [
    ("wis", "Wisdom",      "Wisdom",        3,  1,  3, "wisdom", "The Souls of the Just"),
    ("wis", "Wisdom",      "Wisdom",        6, 12, 14, "wisdom", "Wisdom Is Easily Found"),
    ("wis", "Wisdom",      "Wisdom",        7, 26, 27, "wisdom", "The Brightness of Eternal Light"),
    ("wis", "Wisdom",      "Wisdom",       11, 24, 27, "wisdom", "Thou Lovest All Things That Are"),
    ("sir", "Sirach",      "Sirach",        2,  1,  5, "wisdom", "Prepare Thy Soul for Temptation"),
    ("sir", "Sirach",      "Sirach",        6, 14, 17, "wisdom", "A Faithful Friend"),
    ("tob", "Tobias",      "Tobit",         4,  7, 11, "wisdom", "Alms Deliver from Death"),
    ("tob", "Tobias",      "Tobit",         8,  5,  8, "psalm",  "The Prayer of Tobias and Sara"),
    ("tob", "Tobias",      "Tobit",        12,  6,  9, "wisdom", "Prayer, Fasting, and Alms"),
    ("jdt", "Judith",      "Judith",       13, 23, 25, "psalm",  "Blessed Art Thou Among Women"),
    ("bar", "Baruch",      "Baruch",        3, 36, 38, "wisdom", "He Was Seen Upon Earth"),
    ("1mac","1 Machabees", "I Maccabees",   2, 61, 64, "wisdom", "Be Valiant for the Law"),
    ("2mac","2 Machabees", "II Maccabees",  7, 27, 29, "wisdom", "The Mother's Courage"),
    ("2mac","2 Machabees", "II Maccabees", 12, 43, 46, "wisdom", "A Holy and Wholesome Thought"),
    ("dan", "Daniel",      "Daniel",        3, 57, 63, "psalm",  "Bless the Lord, All Ye Works"),
    ("dan", "Daniel",      "Daniel",       13, 42, 43, "psalm",  "Susanna's Prayer"),
]

cards = []
for abbr, disp, src, ch, a, b, genre, title in P:
    body = vtext(src, ch, a, b)
    ref = f"{disp} {ch}:{a}-{b}" if a != b else f"{disp} {ch}:{a}"
    cards.append({
        "id": f"scripture-deutero-{abbr}-{ch}-{a}",
        "type": "scripture", "genre": genre, "title": title,
        "body": body, "ref": ref, "source": "DRC",
        "tags": ["scripture", "deuterocanon", abbr], "verified": True,
    })

json.dump(cards, open(os.path.join(HERE, "curated_deuterocanon.json"), "w"),
          ensure_ascii=False, indent=1)
print(f"wrote {len(cards)} deuterocanonical cards\n")
for c in cards:
    print(f"--- {c['ref']}  [{c['genre']}]  \"{c['title']}\"  ({len(c['body'])} chars)")
    print("   ", c['body'][:300] + ("..." if len(c['body']) > 300 else ""))
