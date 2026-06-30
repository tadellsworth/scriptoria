#!/usr/bin/env python3
"""Harvest paragraph-level 'meditation' cards from the public-domain prose books.

Strategy: blank-line-separated blocks are paragraph units. Per book we:
  - begin only after a body-start anchor (skips covers, TOC, modern intros)
  - strip leading heading lines inside a block (chapter titles, etc.)
  - clean inline noise (marginal [12v deg], superscript footnote digits)
  - drop junk blocks (headings, footnotes, TOC leaders, index/page dumps)
  - split over-long paragraphs at sentence boundaries
  - track the coarse division (Book / Part / Mansion) for the ref string
Output: one sources/*.json per book, list of card dicts.
"""
import re, json, os, sys

TXT = os.path.join(os.path.dirname(__file__), "txt")
OUT = os.path.dirname(__file__)

MIN_LEN = 200
MAX_LEN = 720
SPLIT_TARGET = 470

GODWORDS = {"GOD", "CHRIST", "JESUS", "LORD"}

# scripture / scholarly citation marker:  word + roman-numeral chapter + verse,
# or an abbreviated reference (bk./ch./cf.) + roman numeral
CITE = re.compile(
    r"[A-Za-z\u00c6\u00e6]{2,12}\.?\s+[ivxlcdm]{1,7}\.\s+\d{1,3}\b"
    r"|\b(?:bk|ch|cf|sqq|ibid)\.\s+[ivxlcdm]{1,7}\b")

LATIN = re.compile(r"\b(nam|unde|est|perfectio|intellectus|theologia|voluntatis|"
                   r"idonei|scholastica|mystica|potest|secus|aquarum|meae|me\u00e6|"
                   r"hominum|filiis|salis|deliciae)\b")

ROMAN = ["", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X"]
ORD_WORD = {"FIRST": 1, "SECOND": 2, "THIRD": 3, "FOURTH": 4, "FIFTH": 5,
            "SIXTH": 6, "SEVENTH": 7}


def raw_blocks(name):
    t = open(os.path.join(TXT, name + ".txt"), encoding="utf-8").read()
    return re.split(r"\n\s*\n", t)


def fix_leadin(s):
    """Normalise a leading run of small-caps lead-in words (a Kempis quirk)."""
    toks = s.split(" ")
    out, i = [], 0
    while i < len(toks) and i < 6:
        w = toks[i]
        letters = re.sub(r"[^A-Za-z]", "", w)
        if len(letters) >= 2 and letters.isupper():
            if i == 0:
                out.append(w[0].upper() + w[1:].lower())
            elif letters in GODWORDS:
                out.append(w[0].upper() + w[1:].lower())
            else:
                out.append(w.lower())
            i += 1
        else:
            break
    return " ".join(out + toks[i:])


def clean(s, cfg):
    s = s.replace("\x0c", " ")
    # marginal manuscript tags: [20] [12v deg] [13r] etc.
    s = re.sub(r"\[\s*\d{1,3}\s*[rvRV]?\s*\u00b0?\s*\]", " ", s)
    # plain numeric footnote markers: [1754] etc. (1-4 digits, nothing else inside
    # the brackets) \u2014 the manuscript-tag regex above only covers up to 3 digits
    # plus an optional folio letter/degree sign, so it misses these (Glories of
    # Mary's 1852 translation runs to footnote [1934]).
    s = re.sub(r"\[\d{1,4}\]", " ", s)
    # join internal line breaks
    s = re.sub(r"\s*\n\s*", " ", s)
    s = re.sub(r"[ \t]+", " ", s).strip()
    # superscript footnote digits glued to punctuation or a closing quote
    s = re.sub(r"([.!?,;:\"'\u2019\u201d\u00bb])\d{1,3}(?=\s|$|[\"'\u2019\u201d])", r"\1", s)
    # footnote ref number after sentence punctuation or a closing quote + space
    s = re.sub(r"(?<=[.!?;:,\u201d\u2019\"])\s\d{1,3}(?=\s)", "", s)
    # footnote digits glued directly to a word, before a space + capital (e.g. manna2 Try)
    s = re.sub(r"([a-z\u2019\"])\d{1,2}\b(?=\s+[A-Z\"])", r"\1", s)
    # footnote ref (2-3 digits) after a lowercase word before a capitalised citation
    s = re.sub(r"(?<=[a-z])\s\d{2,3}(?=\s[A-Z])", "", s)
    # truncate at scholarly citation apparatus  (e.g. "Prov. viii. 31", "ch. xi. 7")
    mcite = CITE.search(s)
    if mcite:
        s = s[:mcite.start()].rstrip(" ,;:.\u2014-\u2019\u201d\"")
    if cfg.get("strip_para_num"):
        s = re.sub(r"^\d{1,3}\.\s+", "", s)
    s = fix_leadin(s)          # safe no-op unless body opens with small-caps
    return s.strip()


def strip_lead_lines(block, cfg):
    """Drop leading lines that are chapter headings / all-caps titles."""
    lines = block.split("\n")
    drop_res = cfg.get("drop_lead_line_res", [])
    while lines:
        ln = lines[0].strip()
        if ln == "":
            lines.pop(0); continue
        letters = re.sub(r"[^A-Za-z]", "", ln)
        is_upper_title = (len(letters) >= 3 and letters.isupper()
                          and len(ln) <= 80)
        if any(r.match(ln) for r in drop_res) or is_upper_title:
            lines.pop(0); continue
        break
    return "\n".join(lines)


JUNK_KEYWORDS = re.compile(
    r"(table of contents|copyright|all rights reserved|public domain|isbn|"
    r"ics publications|institute of carmelite|catholic primer|nihil obstat|"
    r"imprimatur|www\.|http|index of|library of|translated from|this edition|"
    r"electronic version|has been omitted|the translator)", re.I)


def is_junk(s):
    if len(s) < MIN_LEN:
        return True
    if "....." in s or ". . ." in s:
        return True
    letters = [c for c in s if c.isalpha()]
    if not letters:
        return True
    upper_ratio = sum(c.isupper() for c in letters) / len(letters)
    if upper_ratio > 0.55:          # heading / shouting block
        return True
    digit_ratio = sum(c.isdigit() for c in s) / len(s)
    if digit_ratio > 0.08:          # index / page-number dump / footnote list
        return True
    if s.count(".") < 2:            # not real prose
        return True
    if re.match(r"^\d", s):         # starts with a footnote number
        return True
    if len(re.findall(r"\b\d{1,2}\.\s", s)) >= 4:   # enumerated argument/synopsis
        return True
    if len(LATIN.findall(s)) >= 2:   # Latin footnote block
        return True
    if JUNK_KEYWORDS.search(s):
        return True
    return False


def _wrap(p):
    """Word-wrap an over-long single segment into <= MAX_LEN pieces."""
    out = []
    while len(p) > MAX_LEN:
        cut = p.rfind(" ", 0, MAX_LEN)
        if cut < MIN_LEN:
            cut = MAX_LEN
        out.append(p[:cut].strip())
        p = p[cut:].strip()
    if p:
        out.append(p)
    return out


def split_long(s):
    if len(s) <= MAX_LEN:
        return [s]
    parts = re.split(r"(?<=[.!?\u201d\"])\s+(?=[A-Z\u201c\"])", s)
    chunks, cur = [], ""
    for part in parts:
        for piece in _wrap(part):
            if cur and len(cur) + 1 + len(piece) > MAX_LEN:
                chunks.append(cur); cur = piece
            elif cur and len(cur) + 1 + len(piece) > SPLIT_TARGET and len(cur) >= MIN_LEN:
                chunks.append(cur); cur = piece
            else:
                cur = (cur + " " + piece).strip()
    if cur:
        chunks.append(cur)
    # fold a too-short trailing chunk back only if it stays within MAX
    if (len(chunks) >= 2 and len(chunks[-1]) < MIN_LEN
            and len(chunks[-2]) + 1 + len(chunks[-1]) <= MAX_LEN):
        chunks[-2] = (chunks[-2] + " " + chunks.pop()).strip()
    return chunks


def harvest(cfg):
    blocks = raw_blocks(cfg["file"])
    started = cfg.get("start_re") is None
    section = cfg.get("section0", "")
    cards, n = [], 0
    for block in blocks:
        head = " ".join(block.split())
        if not started:
            if cfg["start_re"].search(head):
                started = True
                m = cfg["section_re"].match(head) if cfg.get("section_re") else None
                if m:
                    section = cfg["section_fmt"](m)
            continue
        # is this block a coarse-division heading?
        if cfg.get("section_re"):
            m = cfg["section_re"].match(head)
            if m and len(head) <= 90:
                section = cfg["section_fmt"](m)
                continue
        body = strip_lead_lines(block, cfg)
        body = clean(body, cfg)
        if is_junk(body):
            continue
        for chunk in split_long(body):
            if is_junk(chunk):
                continue
            n += 1
            ref = cfg["source"] + (", " + section if section else "")
            cards.append({
                "id": f"{cfg['prefix']}-{n:04d}",
                "type": "meditation",
                "title": cfg["title"],
                "body": chunk,
                "ref": ref,
                "source": cfg["source"],
                "tags": cfg["tags"],
                "verified": True,
            })
    return cards


def _soul_section(m):
    g = m.group(1)
    if g.startswith("CHAPTER"):
        return "Chapter " + m.group(2)
    if g.startswith("EPILOGUE"):
        return "Epilogue"
    if g.startswith("COUNSELS"):
        return "Counsels and Reminiscences"
    if g.startswith("LETTERS"):
        return "Letters"
    if g.startswith("PRAYERS"):
        return "Prayers"
    return ""


CONFIGS = {
    "imitation": {
        "file": "imitation", "prefix": "imitation",
        "title": "The Imitation of Christ",
        "source": "The Imitation of Christ",
        "tags": ["meditation", "imitation of christ", "a kempis", "discipleship"],
        "start_re": re.compile(r"^BOOK ONE\b"),
        "section_re": re.compile(r"^BOOK (ONE|TWO|THREE|FOUR)\b"),
        "section_fmt": lambda m: "Book " + {"ONE": "I", "TWO": "II",
                                            "THREE": "III", "FOUR": "IV"}[m.group(1)],
        "section0": "Book I",
        "drop_lead_line_res": [re.compile(r"^The .+ Chapter$"),
                               re.compile(r"^BOOK (ONE|TWO|THREE|FOUR)\b")],
        "fix_leadin": True,
    },
    "devoutlife": {
        "file": "devoutlife", "prefix": "devoutlife",
        "title": "Introduction to the Devout Life",
        "source": "Introduction to the Devout Life",
        "tags": ["meditation", "devout life", "de sales", "virtue"],
        "start_re": re.compile(r"^DEAR reader"),
        "section_re": re.compile(r"^PART\s+([IVX]+)\b"),
        "section_fmt": lambda m: "Part " + m.group(1),
        "section0": "",
        "drop_lead_line_res": [re.compile(r"^CHAPTER [IVXLC]+\.?"),
                               re.compile(r"^PART [IVXLC]+\.?"),
                               re.compile(r"^(Preparation|Considerations|"
                                          r"Affections and Resolutions|Conclusion)\.?$")],
    },
    "interior_castle": {
        "file": "interior_castle", "prefix": "interior",
        "title": "The Interior Castle",
        "source": "The Interior Castle",
        "tags": ["meditation", "interior castle", "teresa of avila",
                 "prayer", "mystical"],
        "start_re": re.compile(r"^THE FIRST MANSIONS"),
        "section_re": re.compile(r"^THE (FIRST|SECOND|THIRD|FOURTH|FIFTH|"
                                 r"SIXTH|SEVENTH) MANSIONS"),
        "section_fmt": lambda m: m.group(1).capitalize() + " Mansions",
        "section0": "First Mansions",
        "drop_lead_line_res": [re.compile(r"^CHAPTER [IVXLC]+\.?"),
                               re.compile(r"^THE (FIRST|SECOND|THIRD|FOURTH|FIFTH|"
                                          r"SIXTH|SEVENTH) MANSIONS")],
        "strip_para_num": True,
    },
    # Public-domain T. N. Taylor translation (Gutenberg #16772). Verse poems and
    # the editorial prologue are excluded; harvest begins at Therese's own Ch. I.
    "story_of_a_soul": {
        "file": "story_of_a_soul", "prefix": "therese",
        "title": "Story of a Soul",
        "source": "Story of a Soul",
        "tags": ["meditation", "therese", "little way", "autobiography"],
        "start_re": re.compile(r"^CHAPTER I\b"),
        "section_re": re.compile(r"^(CHAPTER ([IVXLC]+)\b|EPILOGUE|COUNSELS AND "
                                 r"REMINISCENCES|LETTERS OF SOEUR|PRAYERS OF SOEUR)"),
        "section_fmt": _soul_section,
        "section0": "Chapter I",
        "drop_lead_line_res": [re.compile(r"^CHAPTER [IVXLC]+\b"),
                               re.compile(r"^(EPILOGUE|COUNSELS|LETTERS|PRAYERS)\b")],
    },
    # Public-domain E. B. Pusey translation (Gutenberg #3296). Thirteen books.
    "confessions": {
        "file": "confessions", "prefix": "confessions",
        "title": "The Confessions of St. Augustine",
        "source": "The Confessions of St. Augustine",
        "tags": ["meditation", "confessions", "augustine", "conversion"],
        "start_re": re.compile(r"^BOOK I\b"),
        "section_re": re.compile(r"^BOOK ([IVX]+)\b"),
        "section_fmt": lambda m: "Book " + m.group(1),
        "section0": "Book I",
        "drop_lead_line_res": [re.compile(r"^BOOK [IVX]+\b")],
    },
    # Public-domain compilation, Gutenberg ebook #5657. The work's own internal
    # lead-ins ("First Conversation:", "First Letter:") are short enough to read
    # naturally as part of the harvested paragraph text, so they don't need
    # special stripping.
    "practice": {
        "file": "practice", "prefix": "practice",
        "title": "The Practice of the Presence of God",
        "source": "The Practice of the Presence of God",
        "tags": ["meditation", "practice of the presence of god",
                 "brother lawrence", "prayer"],
        "start_re": re.compile(r"^CONVERSATIONS$"),
        "section_re": re.compile(r"^(CONVERSATIONS|Letters)$"),
        "section_fmt": lambda m: {"CONVERSATIONS": "Conversations",
                                  "Letters": "Letters"}[m.group(1)],
        "section0": "Conversations",
    },
    # Public-domain translation by Ella McMahon, Gutenberg ebook #52057,
    # explicitly marked public domain in the USA in its Gutenberg metadata.
    "abandonment": {
        "file": "abandonment", "prefix": "abandonment",
        "title": "Abandonment to Divine Providence",
        "source": "Abandonment to Divine Providence",
        "tags": ["meditation", "abandonment", "de caussade", "providence",
                 "surrender"],
        "start_re": re.compile(r"^Book First\.$"),
        "section_re": re.compile(r"^Book (First|Second|Third)\.$"),
        "section_fmt": lambda m: "Book " + {"First": "I", "Second": "II",
                                            "Third": "III"}[m.group(1)],
        "section0": "Book I",
        "drop_lead_line_res": [re.compile(r"^_CHAPTER [IVXLC]+\._$"),
                               re.compile(r"^Book (First|Second|Third)\.$")],
    },
    # Public-domain 1852 Dunigan translation, Gutenberg ebook #72411, explicitly
    # marked public domain in the USA in its Gutenberg metadata. Bracketed
    # footnote markers (e.g. "[1754]") are stripped during cleaning (see clean()).
    "glories": {
        "file": "glories", "prefix": "glories",
        "title": "The Glories of Mary",
        "source": "The Glories of Mary",
        "tags": ["meditation", "glories of mary", "liguori", "mary",
                 "salve regina"],
        "start_re": re.compile(r"^PART FIRST: ON THE SALVE REGINA\.$"),
        "section_re": re.compile(r"^PART (FIRST|SECOND)"),
        "section_fmt": lambda m: {"FIRST": "Part I: On the Salve Regina",
                                  "SECOND": "Part II"}[m.group(1)],
        "section0": "Part I: On the Salve Regina",
        "drop_lead_line_res": [re.compile(r"^CHAPTER [IVXLCDM]+\.$"),
                               re.compile(r"^DISCOURSE [IVXLCDM]+\.$")],
    },
}

if __name__ == "__main__":
    summary = {}
    for key, cfg in CONFIGS.items():
        cards = harvest(cfg)
        path = os.path.join(OUT, f"book_{key}.json")
        json.dump(cards, open(path, "w", encoding="utf-8"),
                  ensure_ascii=False, indent=1)
        lens = [len(c["body"]) for c in cards]
        summary[key] = (len(cards), min(lens) if lens else 0,
                        max(lens) if lens else 0,
                        sum(lens) // len(lens) if lens else 0,
                        cfg.get("deferred", False))
        print(f"\n===== {key}: {len(cards)} cards "
              f"(min {summary[key][1]}, max {summary[key][2]}, "
              f"avg {summary[key][3]})"
              + ("  [DEFERRED]" if cfg.get('deferred') else "") + " =====")
        for c in cards[:4]:
            print(f"  [{c['ref']}] {c['body'][:150]}")
    print("\nSUMMARY:", json.dumps(summary))
