#!/usr/bin/env python3
"""Harvest the Baltimore Catechism (1941) into catechism Q&A cards.

Each card: title = question, body = answer (scripture proof-text removed),
type 'catechism', source 'Baltimore Catechism', ref 'Baltimore Catechism, Q.N'.

Care points:
  - real question numbers (1..499, with letter suffixes like 23a) must be told
    apart from in-answer enumerations (1. 2. 3.) -> validate an increasing seq
  - the scripture proof (a verse ending in a "(Citation)") is dropped
  - lesson/section headers that sit between questions are cut from answers
"""
import re, json, os

TXT = os.path.join(os.path.dirname(__file__), "txt", "baltimore.txt")
OUT = os.path.join(os.path.dirname(__file__), "baltimore.json")

MAXLEN = 700
MINLEN = 12

raw = open(TXT, encoding="utf-8").read()
raw = raw.replace("\x0c", "\n")

# candidate question starts: a number (opt. letter) + ". " at start of a line
cand = list(re.finditer(r"(?m)^(\d{1,3})([a-z]?)\.\s", raw))

# validate the increasing question sequence to reject in-answer enumerations
qs = []
last_int, last_let = 0, None
for m in cand:
    num, let = int(m.group(1)), m.group(2)
    ok = False
    if let:
        if num == last_int:
            ok = True
    else:
        if last_int < num <= last_int + 3:   # allow tiny gaps, reject list "1."
            ok = True
    if ok:
        qs.append((m.group(1) + let, m.start(), m.end()))
        last_int, last_let = num, (let or None)

HEADER = re.compile(r"^\s*Lesson \d+ from the Baltimore Catechism", re.M)
CITE = re.compile(r"\([^)]*\d[^)]*\)")
GIBBERISH = re.compile(r"[a-z;'\[\]\u2019]{18,}")


def cut_headers(text):
    """Remove trailing lesson/section-title header lines from an answer span."""
    m = HEADER.search(text)
    if not m:
        return text
    head = text[:m.start()].rstrip()
    # drop a short title line that precedes the "Lesson N" line
    lines = head.split("\n")
    while lines and (lines[-1].strip() == "" or
                     (len(lines[-1].strip()) <= 60
                      and not re.search(r"[.?!:;]$", lines[-1].strip())
                      and not lines[-1].strip().startswith('"'))):
        lines.pop()
    return "\n".join(lines)


def strip_proof(text):
    """Drop a trailing scripture-proof sentence (the one bearing a citation)."""
    parts = re.split(r"(?<=[.?!\u201d\"])\s+(?=[A-Z\"\u201c])", text.strip())
    while parts and CITE.search(parts[-1]):
        parts.pop()
    return " ".join(parts).strip()


def clean(text):
    text = GIBBERISH.sub("", text)
    text = re.sub(r"(?m)^\s*\d{1,3}\s*$", " ", text)   # bare page numbers
    text = re.sub(r"\s*\n\s*", " ", text)
    text = re.sub(r"[\u25cf\u2022\u25aa]\s*", "", text)  # bullet glyphs
    # pdftotext separates list markers from their items -> drop clustered "1. 2. 3."
    text = re.sub(r"(?:\b\d{1,2}\.\s+){2,}", "", text)
    text = re.sub(r"\s{2,}", " ", text).strip()
    text = re.sub(r'^"\s*', "", text)                  # stray leading quote
    return text.strip()


cards = []
for i, (qid, s, e) in enumerate(qs):
    span = raw[e: qs[i + 1][1] if i + 1 < len(qs) else len(raw)]
    span = cut_headers(span)
    # question = up to the first '?' (handles wrapped questions); else first line
    qm = re.search(r"\?", span)
    if qm and qm.start() < 240:
        question = span[: qm.start() + 1]
        rest = span[qm.start() + 1:]
    else:
        nl = span.find("\n")
        question, rest = (span[:nl], span[nl + 1:]) if nl != -1 else (span, "")
    question = clean(question)
    answer = clean(strip_proof(rest))
    if not question or len(answer) < MINLEN or len(answer) > MAXLEN:
        continue
    cards.append({
        "id": f"baltimore-{qid}",
        "type": "catechism",
        "title": question,
        "body": answer,
        "ref": f"Baltimore Catechism, Q. {qid}",
        "source": "Baltimore Catechism",
        "tags": ["catechism", "baltimore catechism", "doctrine"],
        "verified": True,
    })

json.dump(cards, open(OUT, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
print(f"Baltimore: {len(cards)} cards from {len(qs)} validated questions "
      f"(of {len(cand)} raw candidates)")
lens = [len(c["body"]) for c in cards]
print(f"answer length: min {min(lens)} max {max(lens)} avg {sum(lens)//len(lens)}")
print("\n--- samples (early / wrapped / lettered / enumerated / imperative) ---")
want = {"baltimore-1", "baltimore-3", "baltimore-23a", "baltimore-119",
        "baltimore-191", "baltimore-7", "baltimore-281", "baltimore-388"}
for c in cards:
    if c["id"] in want:
        print(f"\n[{c['ref']}]")
        print(f"  Q: {c['title']}")
        print(f"  A: {c['body']}")
