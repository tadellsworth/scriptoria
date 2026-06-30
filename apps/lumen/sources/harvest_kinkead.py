#!/usr/bin/env python3
"""Attach Fr. Thomas L. Kinkead's explanations (An Explanation of the Baltimore
Catechism / Baltimore Catechism No. 4, 1891, public domain -- Gutenberg #14554)
to the Baltimore Catechism Q&A cards. Kinkead's edition diverges in numbering and
wording from this app's question set, so we match by normalized question text
(with an answer-text guard) and only attach where the match is confident -- the
core doctrinal questions. -> kinkead_expl.json {cardId: [paragraph, ...]}"""
import re, os, json, difflib

HERE = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.join(HERE, "raw_kinkead", "14554.txt")
OUT = os.path.join(HERE, "kinkead_expl.json")
CONTENT = os.path.join(HERE, os.pardir, "content.json")
MAX_CHARS = 3000

def norm(s):
    return re.sub(r"\s+", " ", re.sub(r"[^a-z0-9 ]", " ", s.lower())).strip()

def clean_par(p):
    p = re.sub(r"\s+", " ", p.replace("\n", " ")).strip()
    p = re.sub(r"_([^_]+)_", r"\1", p)                 # gutenberg italics
    return p

def parse_kinkead():
    txt = open(SRC, encoding="utf-8", errors="replace").read()
    m = re.search(r"\*\*\* START OF.*?\*\*\*(.*?)\*\*\* END OF", txt, re.S)
    body = (m.group(1) if m else txt).replace("\r\n", "\n")
    parts = re.split(r"(?m)^\*?(\d+) Q\.\s", body)
    out = []
    for i in range(1, len(parts), 2):
        block = parts[i + 1]
        am = re.search(r"(?m)^A\.\s", block)
        if not am:
            continue
        q = block[:am.start()].strip().replace("\n", " ")
        rest = block[am.end():]
        ab = re.split(r"\n\s*\n", rest, maxsplit=1)
        ans = ab[0].strip().replace("\n", " ")
        expl = ab[1].strip() if len(ab) > 1 else ""
        out.append((q, ans, expl))
    return out

def explto_paras(expl):
    paras, total = [], 0
    for raw in re.split(r"\n\s*\n", expl):
        p = clean_par(raw)
        if len(p) < 25:
            continue
        if total + len(p) > MAX_CHARS and paras:
            break
        paras.append(p); total += len(p)
    return paras

def main():
    K = parse_kinkead()
    Kx = [(norm(q), norm(a), e) for q, a, e in K if len(e) > 80]
    items = json.load(open(CONTENT))["items"]
    cards = [c for c in items if c.get("type") == "catechism" and c.get("title")]

    out, samples = {}, []
    for c in cards:
        nq, na = norm(c["title"]), norm(c.get("body", ""))
        best_i, best = -1, 0.0
        for i, (kq, ka, e) in enumerate(Kx):
            sq = difflib.SequenceMatcher(None, nq, kq).ratio()
            if sq < 0.74:
                continue
            sa = difflib.SequenceMatcher(None, na, ka).ratio()
            ok = (sq >= 0.88) or (sq >= 0.80 and sa >= 0.86)
            if ok and sq > best:
                best, best_i = sq, i
        if best_i >= 0:
            paras = explto_paras(Kx[best_i][2])
            if paras:
                out[c["id"]] = paras
                if len(samples) < 6:
                    samples.append((c["title"][:46], round(best, 2)))
    json.dump(out, open(OUT, "w"), ensure_ascii=False, separators=(",", ":"))
    print(f"catechism cards          : {len(cards)}")
    print(f"  with Kinkead explanation: {len(out)}  ({round(100*len(out)/len(cards))}%)")
    print(f"  output size             : {os.path.getsize(OUT)/1e3:.0f} KB")
    print("  sample matches:", samples)

if __name__ == "__main__":
    main()
