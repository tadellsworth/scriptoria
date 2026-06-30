#!/usr/bin/env python3
"""
validate_content.py  -  schema + integrity gate for the formation-feed content.

Run before any build (parallel to `node --check app.js`):

    python3 validate_content.py content.json [--strict]

Exit code 0 = OK to build. Non-zero = hard errors found.
--strict also fails the build if any item has "verified": false
(use it for a public/shared release; omit it for personal builds).
"""
import json, sys
from collections import Counter

TYPES = {"scripture", "catechism", "meditation", "father", "summa", "saint", "prayer"}

# required fields shared by every item
COMMON = ["id", "type", "body", "ref", "source", "tags", "verified"]
# extra required fields per type
EXTRA = {
    "saint":  ["title"],
    "prayer": ["title"],
}


def validate(path, strict=False):
    errors, warnings = [], []
    data = json.load(open(path, encoding="utf-8"))

    if "items" not in data or not isinstance(data["items"], list):
        errors.append("top-level 'items' array missing")
        return errors, warnings, data
    items = data["items"]

    seen_ids = set()
    for n, it in enumerate(items):
        tag = it.get("id", f"<index {n}>")

        for f in COMMON:
            if f not in it:
                errors.append(f"{tag}: missing required field '{f}'")

        t = it.get("type")
        if t not in TYPES:
            errors.append(f"{tag}: invalid type '{t}' (allowed: {sorted(TYPES)})")
        else:
            for f in EXTRA.get(t, []):
                if not it.get(f):
                    errors.append(f"{tag}: type '{t}' requires non-empty '{f}'")

        iid = it.get("id")
        if iid in seen_ids:
            errors.append(f"duplicate id '{iid}'")        # stable-id rule
        seen_ids.add(iid)

        if not isinstance(it.get("tags"), list) or not it.get("tags"):
            warnings.append(f"{tag}: 'tags' should be a non-empty list")
        if t == "scripture" and not it.get("genre"):
            warnings.append(f"{tag}: scripture item missing 'genre' (office composer needs it)")
        for f in ("body", "ref", "source"):
            if isinstance(it.get(f), str) and not it[f].strip():
                errors.append(f"{tag}: '{f}' is empty")

        if strict and it.get("verified") is False:
            errors.append(f"{tag}: verified=false (blocked under --strict)")

    return errors, warnings, data


def report(path, strict):
    errors, warnings, data = validate(path, strict)
    items = data.get("items", [])

    by_type   = Counter(i.get("type") for i in items)
    by_source = Counter(i.get("source") for i in items)
    unverified = [i.get("id") for i in items if i.get("verified") is False]

    print(f"file        : {path}")
    print(f"items       : {len(items)}")
    print(f"by type     : {dict(by_type)}")
    print(f"by source   : {dict(by_source)}")
    print(f"verified    : {len(items) - len(unverified)}/{len(items)}")
    if unverified:
        print(f"to verify   : {', '.join(unverified)}")
    for w in warnings:
        print("WARN  " + w)
    for e in errors:
        print("ERROR " + e)

    if errors:
        print(f"\nFAIL ({len(errors)} error(s))")
        return 1
    print("\nOK")
    return 0


if __name__ == "__main__":
    args = [a for a in sys.argv[1:] if not a.startswith("-")]
    strict = "--strict" in sys.argv
    path = args[0] if args else "content.json"
    sys.exit(report(path, strict))
