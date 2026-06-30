#!/usr/bin/env python3
"""Merge all content sources into the master content.json (project root).
Sources:
  sources/scripture_harvest.json     (harvested DRC passages)
  sources/curated_nonscripture.json  (hand-curated CCC/father/summa/saint/prayer)
De-dupes by id, sorts deterministically, and runs the validator.
"""
import json, os, subprocess, sys, datetime

HERE = os.path.dirname(os.path.abspath(__file__))      # sources/
ROOT = os.path.dirname(HERE)
SOURCES = [
    os.path.join(HERE, "scripture_harvest.json"),
    os.path.join(HERE, "curated_deuterocanon.json"),
    os.path.join(HERE, "curated_nonscripture.json"),
    os.path.join(HERE, "curated_creeds.json"),
    os.path.join(HERE, "curated_marian_antiphons.json"),
    os.path.join(HERE, "curated_rosary_1.json"),
    os.path.join(HERE, "curated_rosary_2.json"),
    os.path.join(HERE, "sanctoral.json"),
    os.path.join(HERE, "baltimore.json"),
    os.path.join(HERE, "book_imitation.json"),
    os.path.join(HERE, "book_devoutlife.json"),
    os.path.join(HERE, "book_interior_castle.json"),
    os.path.join(HERE, "butler_saints.json"),
    os.path.join(HERE, "shea_saints.json"),
    os.path.join(HERE, "book_confessions.json"),
    # Rebuilt from the public-domain T. N. Taylor translation (Gutenberg #16772),
    # replacing the earlier modern ICS translation that was under copyright.
    os.path.join(HERE, "book_story_of_a_soul.json"),
    os.path.join(HERE, "book_practice.json"),
    # book_abandonment.json / book_glories.json withheld: harvest_books.py's
    # split_long() truncates ~16% of glories' cards mid-sentence on "St." and
    # leaves ~7% near-duplicate adjacent cards; needs an abbreviation-aware
    # sentence splitter fix before these ship. See harvest_books.py CONFIGS.
]
OUT = os.path.join(ROOT, "content.json")
VALIDATE = os.path.join(ROOT, "validate_content.py")


def main():
    items, seen = [], set()
    for path in SOURCES:
        if not os.path.exists(path):
            print("  WARN missing source:", path); continue
        for it in json.load(open(path, encoding="utf-8")):
            if it["id"] in seen:
                continue
            seen.add(it["id"])
            items.append(it)

    # stable order: scripture (by id) first, then others by type+id — purely cosmetic;
    # the office composer reshuffles deterministically anyway.
    items.sort(key=lambda x: (x["type"] != "scripture", x.get("type", ""), x["id"]))

    content = {
        "schemaVersion": 1,
        "appId": "lumen.v1",
        "generated": datetime.date.today().isoformat(),
        "count": len(items),
        "items": items,
    }
    json.dump(content, open(OUT, "w", encoding="utf-8"), ensure_ascii=False, indent=1)

    from collections import Counter
    print(f"compiled {len(items)} items -> {OUT}")
    print("by type :", dict(Counter(x["type"] for x in items)))
    print("by genre:", dict(Counter(x.get("genre") for x in items if x["type"] == "scripture")))
    size = os.path.getsize(OUT) / 1024
    print(f"content.json size: {size:.0f} KB")

    r = subprocess.run([sys.executable, VALIDATE, OUT], capture_output=True, text=True)
    print("\n--- validation ---")
    print(r.stdout.strip())
    sys.exit(r.returncode)


if __name__ == "__main__":
    main()
