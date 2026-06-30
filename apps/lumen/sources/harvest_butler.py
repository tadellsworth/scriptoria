#!/usr/bin/env python3
"""
harvest_butler.py  --  principal Saint-of-the-Day cards from Alban Butler.

Source: the public-domain Project Gutenberg transcriptions of Alban Butler's
"Lives of the Fathers, Martyrs, and Other Principal Saints" (the original
18th-c. work; PD by centuries). Only two volumes are on Gutenberg:
  * #20450  January / February / March   (vol1)
  * #49604  July (Vol. VII)              (vol7)
so this harvester currently lights up those four months. The remaining months
drop in by adding more volumes to VOLUMES below (same per-volume CONFIG shape)
once a clean PD text is sourced.

For each calendar day we take the PRINCIPAL (first) entry, skip Butler's
citation/"authority" note and the "A.D. nnn" date line, and capture the opening
of the life as a short capsule. Days already owned by the hand-authored
sanctoral.json are SKIPPED so each day still resolves to exactly one saint and
pickSaintOfDay() needs no change.

Output: sources/butler_saints.json  (added to compile_content.py)
Cards are emitted verified:false -- faithfully extracted from a PD source but
machine-truncated, so they ship in personal/family builds (no --strict) and are
flagged for a human glance before any public --strict push.
"""
import json, os, re

HERE = os.path.dirname(os.path.abspath(__file__))
RAW = os.path.join(HERE, "raw_butler")
OUT = os.path.join(HERE, "butler_saints.json")
SANCTORAL = os.path.join(HERE, "sanctoral.json")

MONTHS = {"JANUARY": 1, "FEBRUARY": 2, "MARCH": 3, "APRIL": 4, "MAY": 5,
          "JUNE": 6, "JULY": 7, "AUGUST": 8, "SEPTEMBER": 9, "OCTOBER": 10,
          "NOVEMBER": 11, "DECEMBER": 12}
MONTH_NAME = {v: k.capitalize() for k, v in MONTHS.items()}
DAYS_IN = {1: 31, 2: 29, 3: 31, 4: 30, 5: 31, 6: 30,
           7: 31, 8: 31, 9: 30, 10: 31, 11: 30, 12: 31}

# Per-volume config. `header` captures (MONTH, day-token) at a line start; the
# day-token is roman (I..XXXI) or arabic. `encoding` differs by transcriber.
VOLUMES = [
    {"file": "butler_vol1_jan_feb_mar.txt", "encoding": "latin-1",
     "months": {"JANUARY", "FEBRUARY", "MARCH"},
     "header": re.compile(r'^\s*(JANUARY|FEBRUARY|MARCH)\s+(1|[IVXLC]+)\.\s*$')},
    {"file": "butler_vol7_july.txt", "encoding": "utf-8",
     "months": {"JULY"},
     "header": re.compile(r'^\s*(JULY)\s+(1|[IVXLC]+)\.\s*$')},
]

TARGET_LEN = 360      # aim for a capsule of roughly this many characters
MAX_LEN = 520         # hard ceiling; truncate at the last sentence end before this
MIN_LEN = 90          # if the first body paragraph is shorter, append the next

# A paragraph is a bibliographic CITATION note (skip it) if it carries the
# tell-tale apparatus: volume/page cites like "t. 1, p. 486" / "l. 2, c. 9",
# manuscript refs, or the names of the hagiographers Butler cites.
CITE_PAT = re.compile(
    r'\b[tlpc]\.\s*\d'                       # t. 1 / p. 486 / l. 2 / c. 16
    r'|\bMSS?\b|\bAct[a.]'
    r'|\bBolland|\bTillemont|\bSurius|\bHenschen|\bPinius|\bUsher|\bBaronius'
    r'|\bMabillon|\bCeillier|\bFleury|\bRosweide|\bBollandist'
)
DATE_PAT = re.compile(
    r'^\s*(A\.?\s*D\.?\b|ABOUT THE YEAR|About the year|In the year'
    r'|Circa\b|A\.\s*M\.\b|Anno\b)', re.I)

ROMAN = {'I': 1, 'V': 5, 'X': 10, 'L': 50, 'C': 100}


def roman_to_int(s):
    if s.isdigit():
        return int(s)
    total, prev = 0, 0
    for ch in reversed(s):
        v = ROMAN.get(ch, 0)
        total += -v if v < prev else v
        prev = max(prev, v)
    return total


def is_allcaps(line):
    """A title / date line: has letters and no lowercase a-z."""
    return bool(re.search('[A-Z]', line)) and not re.search('[a-z]', line)


# ---- cleaning ----------------------------------------------------------------
def clean_text(t):
    t = re.sub(r'\[\d+[a-z]?\]', '', t)        # footnote refs [1] [12a]
    t = re.sub(r'\{\d*\}', '', t)              # page markers {060} {}
    t = t.replace('_', '')                     # italics underscores
    t = re.sub(r'\s*--\s*', '\u2014', t)       # -- -> em dash
    t = t.replace('\n', ' ')
    t = re.sub(r'\s+', ' ', t).strip()
    return t


CONNECTORS = {"and", "of", "the", "in", "on", "to", "for", "or", "a", "an",
              "at", "by", "with", "his", "her", "de", "le"}


def title_case(t):
    t = clean_text(t).rstrip(' .,')
    # normalise the saint abbreviation forms
    t = re.sub(r'^SS\.\s*', 'Sts. ', t)
    t = re.sub(r'^S\.\s+', 'St. ', t)
    t = re.sub(r'^SAINT\s+', 'St. ', t)
    t = re.sub(r'^ST\.\s*', 'St. ', t)
    out = []
    for i, w in enumerate(re.split(r'(\s+|-)', t)):
        if not w.strip() or w == '-':
            out.append(w); continue
        lw = w.lower()
        if w in ('St.', 'Sts.', 'Bd.'):
            out.append(w)
        elif re.fullmatch(r'[IVXLC]+\.?', w):       # regnal numerals (VIII.)
            out.append(w)
        elif i != 0 and lw.rstrip('.,') in CONNECTORS:
            out.append(lw)
        else:
            out.append(w[0].upper() + w[1:].lower())
    s = ''.join(out)
    # tidy a leading bare "St." with nothing after (shouldn't happen) and spaces
    return re.sub(r'\s+', ' ', s).strip()


OFFICE = {'B': 'Bishop', 'C': 'Confessor', 'M': 'Martyr', 'V': 'Virgin',
          'P': 'Priest', 'D': 'Doctor', 'K': 'King', 'Q': 'Queen', 'W': 'Widow',
          'H': 'Hermit', 'A': 'Abbot'}
PLURAL = {'MM': 'Martyrs', 'CC': 'Confessors', 'BB': 'Bishops',
          'VV': 'Virgins', 'PP': 'Popes', 'DD': 'Doctors'}
_OFF_WORDS = (r'(?:Bishop|Pope|Confessor|Martyr|Virgin|Doctor|King|Queen|Widow'
              r'|Hermit|Abbot|Abbess|Empress|Emperor|Anchoret|Apostle'
              r'|Evangelist|Deacon|Priest)')


def normalize_title(raw):
    """Clean an ALL-CAPS Butler heading into a cased title: expand office codes
    (', C' -> Confessor, 'MM.' -> Martyrs, 'B.C.' -> Bishop and Confessor) and
    drop trailing religious-order abbreviations (O.S.D., S.J.)."""
    t = clean_text(raw)                              # keep periods for now
    # split run-together office clusters: "B.C." -> "B. C.", "V.M." -> "V. M."
    for _ in range(2):
        t = re.sub(r'\b([BCMVPDKQWHA])\.([BCMVPDKQWHA])\b', r'\1. \2', t)
    # plural codes, then singular codes. Lookarounds keep us off name initials
    # and regnal numerals ("VIII." is multi-letter, so never matches).
    t = re.sub(r'(?<=[ ,])(MM|CC|BB|VV|PP|DD)\.?(?=$|[ ,.])',
               lambda m: PLURAL[m.group(1)], t)
    t = re.sub(r'(?<=[ ,])([BCMVPDKQWHA])\.(?=$|[ ,])',
               lambda m: OFFICE[m.group(1)], t)
    t = re.sub(r'(?<=[ ,])([BCMVPDKQWHA])(?=$|[ ,])',
               lambda m: OFFICE[m.group(1)], t)
    # trailing order abbreviations: DOTTED short tokens only, so an all-caps
    # tail like "S. FATHER OF THE CHURCH" is never eaten. The final token's
    # period may be absent (a comma-join can strip it).
    t = re.sub(r',?\s*(?:O|S|C)\.(?:\s*[A-Z]{1,3}\.)*(?:\s*[A-Z]{1,3})?\s*$', '', t)
    t = re.sub(r',?\s*(?:&c\.?|etc\.?)\s*$', '', t, flags=re.I)
    t = t.rstrip(' .,')
    t = title_case(t)
    t = re.sub(rf'\b({_OFF_WORDS}) ({_OFF_WORDS})\b', r'\1 and \2', t)
    return re.sub(r'\s+', ' ', t).strip().rstrip(',')


_SENT = '\u0001'                                    # placeholder for abbrev dots
_ABBR = re.compile(r'\b(SS|Sts|St|Mrs|Mr|Dr|Rev|Ven|Bl|Bd|Messrs|Sr|Jr)\.')


def _protect(t):
    t = _ABBR.sub(lambda m: m.group(1) + _SENT, t)
    t = re.sub(r'\b([A-Z])\.', r'\1' + _SENT, t)    # single-letter initials A. J.
    return t


def first_sentences(text, target=TARGET_LEN, ceiling=MAX_LEN):
    text = clean_text(text)
    protected = _protect(text)
    parts = re.split(r'(?<=[.!?])\s+(?=[A-Z\u201c"\u2014])', protected)
    out = ''
    for p in parts:
        cand = (out + ' ' + p).strip() if out else p.strip()
        if len(cand) > ceiling and out:
            break
        out = cand
        if len(out) >= target:
            break
    if len(out) > ceiling:                          # last-ditch hard trim
        cut = out.rfind('. ', 0, ceiling)
        if cut > MIN_LEN:
            out = out[:cut + 1]
        else:
            sp = out.rfind(' ', 0, ceiling)
            out = (out[:sp] if sp > MIN_LEN else out[:ceiling]).rstrip(' ,;:') + '\u2026'
    out = out.replace(_SENT, '.').strip()
    # never end on a dangling abbreviation (e.g. "... of St.")
    out = re.sub(r'\s+(?:SS|Sts|St|Mr|Mrs|Dr|Rev|Ven|Bl|Bd)\.?$', '', out).strip()
    if out and out[-1] not in '.!?\u2026"\u201d':
        out += '.'
    return out


CATEGORY_WORDS = ["martyr", "virgin", "bishop", "pope", "abbot", "abbess",
                  "confessor", "doctor", "king", "queen", "empress", "widow",
                  "hermit", "anchoret", "apostle", "evangelist", "deacon",
                  "priest", "monk", "nun", "prophet"]


def slugify(t):
    t = clean_text(t).lower()
    t = re.sub(r'[^a-z0-9]+', '-', t).strip('-')
    return re.sub(r'-+', '-', t)[:48]


# ---- per-day extraction ------------------------------------------------------
def split_paragraphs(block_lines):
    paras, cur = [], []
    for ln in block_lines:
        if ln.strip():
            cur.append(ln.strip())
        elif cur:
            paras.append(cur); cur = []
    if cur:
        paras.append(cur)
    return paras


def is_cite_note(p):
    """A bibliographic source note, not the life. Notes carry Butler's apparatus:
    a From/See opener, a page/volume citation, or an editor's name. We only ever
    skip ONE such paragraph, so a life that later mentions a citation is safe."""
    if re.match(r'^(From|See|This account|These acts|Her acts|His acts'
                r'|The following|Written by|Compiled|Abridged|Chiefly|Collected)\b', p):
        return True
    if re.search(r'\b[tlpc]\.\s*\d', p):                      # t. 1 / p. 486
        return True
    if re.search(r'\b(Bolland|Bollandist|Tillemont|Surius|Henschen|Pinius'
                 r'|Rosweide|Papebro|Ruinart|Mabillon|Ceillier|Baronius|Pagi'
                 r'|Bulteau|Cuper|Sollier)', p):
        return True
    return len(CITE_PAT.findall(p)) >= 2


def extract_day(block_lines):
    """Return (raw_title, body) for the principal entry in one day's block."""
    paras = [' '.join(p) for p in split_paragraphs(block_lines)]
    # drop asterisk dividers and bare page-marker paragraphs
    paras = [p for p in paras
             if not re.fullmatch(r'[\*\s]+', p)
             and not re.fullmatch(r'\{\d*\}', p.strip())]
    if not paras:
        return None
    # Title = leading run of all-caps paragraphs (heading may wrap to a 2nd).
    idx, title_parts = 0, []
    while idx < len(paras) and is_allcaps(paras[idx]) and not DATE_PAT.match(paras[idx]):
        title_parts.append(paras[idx]); idx += 1
    if not title_parts:
        return None
    title_raw = ', '.join(s.strip().rstrip('.,') for s in title_parts)
    # Skip metadata: any date/all-caps lines freely, plus AT MOST ONE citation
    # note. The next paragraph after that is the life, even if it happens to
    # carry a stray citation token.
    note_skipped = False
    while idx < len(paras):
        p = paras[idx]
        if DATE_PAT.match(p) or is_allcaps(p):
            idx += 1; continue
        if not note_skipped and is_cite_note(p):
            note_skipped = True; idx += 1; continue
        break
    if idx >= len(paras):
        return None
    body_text = paras[idx]
    if len(clean_text(body_text)) < MIN_LEN and idx + 1 < len(paras):
        body_text += ' ' + paras[idx + 1]
    body = first_sentences(body_text)
    if len(body) < MIN_LEN:
        return None
    more = first_sentences(' '.join(paras[idx:idx + 8]), target=1100, ceiling=1500)
    life = first_sentences(' '.join(paras[idx:idx + 16]), target=3200, ceiling=3900)
    return title_raw, body, more, life


def parse_volume(cfg, taken_feasts, sanctoral_feasts):
    path = os.path.join(RAW, cfg["file"])
    text = open(path, encoding=cfg["encoding"]).read().replace('\r\n', '\n')
    # stop before the Gutenberg footnote table / end matter
    end = text.find('*** END OF')
    if end != -1:
        text = text[:end]
    lines = text.split('\n')
    heads = [(i, m.group(1), m.group(2))
             for i, l in enumerate(lines) if (m := cfg["header"].match(l))]
    cards, lives = [], {}
    for k, (li, mon, daytok) in enumerate(heads):
        if mon not in cfg["months"]:
            continue
        mm = MONTHS[mon]
        dd = roman_to_int(daytok)
        if not (1 <= dd <= DAYS_IN[mm]):
            continue
        feast = f"{mm:02d}-{dd:02d}"
        if feast in sanctoral_feasts or feast in taken_feasts:
            continue
        nxt = heads[k + 1][0] if k + 1 < len(heads) else len(lines)
        res = extract_day(lines[li + 1:nxt])
        if not res:
            continue
        title_raw, body, more, life = res
        title = normalize_title(title_raw)
        if len(title) < 3:
            continue
        cats = [c for c in CATEGORY_WORDS if re.search(r'\b' + c + r'\b', title.lower())]
        tags = ["saint", "butler"] + cats[:3]
        card = {
            "id": f"saint-butler-{mm:02d}{dd:02d}-{slugify(title_raw)}",
            "type": "saint",
            "title": title,
            "feast": feast,
            "body": body,
            "ref": f"Feast: {MONTH_NAME[mm]} {dd}",
            "source": "Alban Butler, Lives of the Saints (PD)",
            "tags": tags,
            "verified": False,
        }
        if more and len(more) > len(body) + 40:
            card["more"] = more
        if life and len(life) > len(card.get("more", body)) + 40:
            lives[card["id"]] = life
        cards.append(card)
        taken_feasts.add(feast)
    return cards, lives


def main():
    sanctoral_feasts = {c.get("feast") for c in json.load(open(SANCTORAL))
                        if c.get("feast")}
    taken, all_cards, all_lives = set(), [], {}
    for cfg in VOLUMES:
        got, got_lives = parse_volume(cfg, taken, sanctoral_feasts)
        print(f"  {cfg['file']:42} -> {len(got):3} cards")
        all_cards += got
        all_lives.update(got_lives)
    all_cards.sort(key=lambda c: c["feast"])
    json.dump(all_cards, open(OUT, "w", encoding="utf-8"),
              ensure_ascii=False, indent=1)
    json.dump(all_lives, open(os.path.join(HERE, "butler_lives.json"), "w",
              encoding="utf-8"), ensure_ascii=False)
    print(f"\nwrote {len(all_cards)} Butler saint cards -> {OUT}")
    print(f"wrote {len(all_lives)} full lives -> butler_lives.json")
    # coverage by month
    from collections import Counter
    bym = Counter(int(c["feast"][:2]) for c in all_cards)
    print("by month:", {MONTH_NAME[m]: n for m, n in sorted(bym.items())})


if __name__ == "__main__":
    main()
