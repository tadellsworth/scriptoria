#!/usr/bin/env python3
"""Harvest one capsule 'saint' card per day from the public-domain Benziger/Shea
edition of Butler's *Lives of the Saints, With Reflections for Every Day in the
Year* (1894), as scanned at sacred-texts.com.

Each day reads:  "Month D.--TITLE.\\n\\n<life> ... Reflection.--<reflection>"
We take the TITLE and the opening of the <life>, skipping any feast day already
covered by the curated sanctoral set or the full-Butler cards, so every date
still resolves to exactly one saint (no engine change). The Reflections are not
used here; they could seed a separate meditation set later.
"""
import re, json, os
import harvest_butler as hb   # reuse clean_text, title_case, first_sentences, slugify, etc.

HERE = os.path.dirname(__file__)
SRC = os.path.join(HERE, "raw_shea", "lots_txt")
OUT = os.path.join(HERE, "shea_saints.json")

MONTHS = {"January": 1, "February": 2, "March": 3, "April": 4, "May": 5,
          "June": 6, "July": 7, "August": 8, "September": 9, "October": 10,
          "November": 11, "December": 12}
MNAMES = "|".join(MONTHS)

ENTRY = re.compile(rf"\n({MNAMES}) (\d{{1,2}})[.:]\s*[-\u2013\u2014]+(.*?)"
                   rf"(?=\n(?:{MNAMES}) \d{{1,2}}[.:]\s*[-\u2013\u2014]+|\Z)", re.S)


def taken_feasts():
    feasts = {c.get("feast") for c in json.load(open(hb.SANCTORAL)) if c.get("feast")}
    for fname in ("butler_saints.json", "curated_nonscripture.json"):
        path = os.path.join(HERE, fname)
        if os.path.exists(path):
            feasts |= {c.get("feast") for c in json.load(open(path))
                       if c.get("type") == "saint" and c.get("feast")}
    return feasts


def strip_marks(s):
    s = re.sub(r"\[p\.\s*\d+\]", " ", s)                 # sacred-texts page markers
    s = re.sub(r"\[paragraph continues\]", " ", s, flags=re.I)
    s = re.sub(r"Reflections for Every Day in the Year", " ", s)
    return s


def main():
    text = open(SRC, encoding="latin-1").read().replace("\r\n", "\n")
    skip = taken_feasts()
    cards, seen, lives = [], set(), {}
    for mon, day, rest in ENTRY.findall(text):
        mm, dd = MONTHS[mon], int(day)
        if not (1 <= dd <= hb.DAYS_IN[mm]):
            continue
        feast = f"{mm:02d}-{dd:02d}"
        if feast in skip or feast in seen:
            continue
        # title is the first line; life is everything after the blank line,
        # up to the "Reflection.--" coda.
        parts = rest.split("\n\n", 1)
        if len(parts) != 2:
            continue
        title_raw, body_raw = parts
        halves = re.split(r"\bReflection[s]?\.\s*[-\u2014]+", body_raw, maxsplit=1)
        life = hb.clean_text(strip_marks(halves[0]))
        reflection = hb.clean_text(strip_marks(halves[1])) if len(halves) > 1 else ""
        title = hb.title_case(hb.clean_text(strip_marks(title_raw)).rstrip(" .,"))
        body = hb.first_sentences(life)
        if len(title) < 3 or len(body) < hb.MIN_LEN:
            continue
        more = hb.first_sentences(life, target=1400, ceiling=1700)
        if reflection:
            more += "\n\nReflection.\u2014" + hb.first_sentences(
                reflection, target=400, ceiling=560)
        cats = [c for c in hb.CATEGORY_WORDS
                if re.search(r"\b" + c + r"\b", title.lower())]
        card = {
            "id": f"saint-shea-{mm:02d}{dd:02d}-{hb.slugify(title)}",
            "type": "saint",
            "title": title,
            "feast": feast,
            "body": body,
            "ref": f"Feast: {hb.MONTH_NAME[mm]} {dd}",
            "source": "Lives of the Saints, Benziger ed. (PD)",
            "tags": ["saint", "shea"] + cats[:3],
            "verified": False,
        }
        if more and len(more) > len(body) + 40:
            card["more"] = more
        life_full = hb.first_sentences(life, target=3200, ceiling=3800)
        if reflection:
            life_full += "\n\nReflection.\u2014" + hb.first_sentences(
                reflection, target=700, ceiling=900)
        if life_full and len(life_full) > len(card.get("more", body)) + 40:
            lives[card["id"]] = life_full
        cards.append(card)
        seen.add(feast)
    cards.sort(key=lambda c: c["feast"])
    json.dump(cards, open(OUT, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    json.dump(lives, open(os.path.join(HERE, "shea_lives.json"), "w",
              encoding="utf-8"), ensure_ascii=False)
    from collections import Counter
    bym = Counter(int(c["feast"][:2]) for c in cards)
    print(f"wrote {len(cards)} Shea saint cards -> {OUT}")
    print("by month:", {hb.MONTH_NAME[m]: n for m, n in sorted(bym.items())})


if __name__ == "__main__":
    main()
