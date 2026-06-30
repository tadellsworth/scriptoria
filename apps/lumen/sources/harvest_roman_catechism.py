#!/usr/bin/env python3
"""Attach the Roman Catechism of the Council of Trent (the "Catechism of the
Council of Trent," compiled per decree of the Council and issued under St.
Pius V, 1566 -- public domain) to the Baltimore Catechism Q&A cards.

The Roman Catechism is topical prose organized into four Parts (Creed,
Sacraments, Commandments, Lord's Prayer), each with an introduction and a set
of numbered Articles -- it is not itself Q&A, so unlike harvest_kinkead.py
(which matches question text to question text) this harvester routes each
Baltimore card to a Part by keyword, then scores every Article (plus a
synthetic "Introduction" candidate) in that Part by shared-vocabulary overlap
with the card's title+body. -> roman_catechism_expl.json {cardId: [paragraph, ...]}"""
import json, os, random
from collections import Counter

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
SRC = os.path.join(HERE, "raw_roman_catechism", "catechism.json")
OUT = os.path.join(HERE, "roman_catechism_expl.json")
CONTENT = os.path.join(ROOT, "content.json")

MAX_PARAS = 4
MAX_CHARS = 1200
MIN_SCORE = 2

STOPWORDS = {
    "that", "this", "with", "from", "have", "which", "what", "shall", "they",
    "there", "their", "were", "been", "being", "into", "upon", "unto", "such",
    "only", "also", "when", "then", "than", "some", "more", "most", "very",
    "does", "each",
}

# Part-routing keyword sets, checked in this exact priority order.
SACRAMENT_WORDS = [
    "sacrament", "baptis", "confirmation", "eucharist", "communion", "penance",
    "confession", "absolution", "extreme unction", "anointing", "holy orders",
    "priesthood", "matrimony", "marriage",
]
DECALOGUE_WORDS = ["commandment", "thou shalt", "precept of the church"]
PRAYER_WORDS = ["our father", "lord's prayer", "hail mary", "petition"]


def words(text):
    """Distinct significant words: lowercase-alphabetic, >=4 letters, not a stopword."""
    out = set()
    cur = []
    for ch in text.lower():
        if ch.isalpha():
            cur.append(ch)
        else:
            if cur:
                w = "".join(cur)
                if len(w) >= 4 and w not in STOPWORDS:
                    out.add(w)
                cur = []
    if cur:
        w = "".join(cur)
        if len(w) >= 4 and w not in STOPWORDS:
            out.add(w)
    return out


def route_part(text):
    """Priority-ordered keyword routing: Sacraments > Decalogue > Lord's Prayer > Creed."""
    t = text.lower()
    if any(k in t for k in SACRAMENT_WORDS):
        return 2
    if any(k in t for k in DECALOGUE_WORDS):
        return 3
    if any(k in t for k in PRAYER_WORDS):
        return 4
    return 1


def build_candidates(part):
    """Every real Article in the Part, plus one synthetic Introduction candidate."""
    cands = []
    intro_text = "Introduction " + part["title"]
    cands.append({
        "title": "Introduction",
        "match_text": intro_text,
        "sections": part["introduction"]["sections"],
    })
    for a in part["articles"]:
        match_text = (a.get("title") or "") + " " + (a.get("heading") or "")
        cands.append({
            "title": a.get("title") or f"Article {a.get('articleNumber')}",
            "match_text": match_text,
            "sections": a.get("sections") or [],
        })
    return cands


def collect_paragraphs(sections):
    """Paragraphs from the first section, in order; pull from the second section too
    if the first has fewer than two paragraphs. Stop at MAX_PARAS or ~MAX_CHARS."""
    if not sections:
        return []
    paras = []
    secs = sections[:1]
    if len(sections[0].get("paragraphs") or []) < 2 and len(sections) > 1:
        secs = sections[:2]
    total = 0
    for s in secs:
        for p in s.get("paragraphs") or []:
            text = (p.get("text") or "").strip()
            if not text:
                continue
            paras.append(text)
            total += len(text)
            if len(paras) >= MAX_PARAS or total >= MAX_CHARS:
                return paras
    return paras


def main():
    parts = json.load(open(SRC, encoding="utf-8"))
    parts_by_num = {p["partNumber"]: p for p in parts}

    content = json.load(open(CONTENT, encoding="utf-8"))
    items = content["items"]
    cards = [c for c in items if c.get("type") == "catechism" and c.get("title")]

    # Precompute candidate word-sets per part (lazy cache).
    cand_cache = {}

    def candidates_for(part_num):
        if part_num not in cand_cache:
            part = parts_by_num[part_num]
            cands = build_candidates(part)
            for c in cands:
                c["wordset"] = words(c["match_text"])
            cand_cache[part_num] = (part, cands)
        return cand_cache[part_num]

    out = {}
    part_counts = Counter()
    matches_for_sample = []  # (card_id, question, part_title, article_title)

    for c in cards:
        full_text = (c.get("title") or "") + " " + (c.get("body") or "")
        part_num = route_part(full_text)
        card_words = words(full_text)
        part, cands = candidates_for(part_num)

        best_score, best_cand = 0, None
        for cand in cands:
            score = len(card_words & cand["wordset"])
            if score > best_score:
                best_score, best_cand = score, cand

        if best_cand is None or best_score < MIN_SCORE:
            continue

        paras = collect_paragraphs(best_cand["sections"])
        if not paras:
            continue

        out[c["id"]] = paras
        part_counts[part_num] += 1
        matches_for_sample.append((c["id"], c["title"], part["title"], best_cand["title"]))

    json.dump(out, open(OUT, "w", encoding="utf-8"), ensure_ascii=False, separators=(",", ":"))

    total = len(cards)
    matched = len(out)
    print(f"catechism cards                : {total}")
    print(f"  with Roman Catechism passage  : {matched}  ({round(100 * matched / total)}%)")
    print(f"  output size                   : {os.path.getsize(OUT) / 1e3:.0f} KB")
    print()
    print("  matches by routed Part:")
    part_titles = {p["partNumber"]: p["title"] for p in parts}
    for pn in sorted(part_counts):
        print(f"    Part {pn} ({part_titles[pn]}): {part_counts[pn]}")
    print()

    print("  sample matches (20 random):")
    random.seed(42)
    sample = random.sample(matches_for_sample, min(20, len(matches_for_sample)))
    for cid, q, part_title, art_title in sample:
        qq = q if len(q) <= 80 else q[:77] + "..."
        print(f"    {cid:18s} {qq:84s} -> {part_title} / {art_title}")


if __name__ == "__main__":
    main()
