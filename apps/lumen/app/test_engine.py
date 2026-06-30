#!/usr/bin/env python3
"""Extract pure engine functions from app.js (brace/comment/string-aware) and
exercise them in Node against the real content pool + synthetic payloads."""
import json, os, re, subprocess, sys, tempfile

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
APPJS = os.path.join(HERE, "app.js")
CONTENT = os.path.join(ROOT, "content.json")

FUNCS = ["hashSeed", "mulberry32", "seededShuffle", "isoDate",
         "dayIndex", "bucketOf", "composeOffice", "streakAfterOpen",
         "ymd", "dow", "sundayOnOrBefore", "firstAdvent",
         "lastSundayOfOctober", "computusEaster", "pad2", "assign",
         "liturgicalDay", "seasonWeights"]
VARS = ["DAY", "WEEKDAY", "ORD", "FIXED_FEASTS", "SEASON_PROFILE"]


def match_braces(src, open_index):
    depth, i, n, state = 0, open_index, len(src), None
    while i < n:
        c = src[i]; nx = src[i + 1] if i + 1 < n else ""
        if state == "line":
            if c == "\n": state = None
        elif state == "block":
            if c == "*" and nx == "/": state = None; i += 1
        elif state in ("sq", "dq", "tpl"):
            if c == "\\": i += 1
            elif (state == "sq" and c == "'") or (state == "dq" and c == '"') or (state == "tpl" and c == "`"):
                state = None
        else:
            if c == "/" and nx == "/": state = "line"; i += 1
            elif c == "/" and nx == "*": state = "block"; i += 1
            elif c == "'": state = "sq"
            elif c == '"': state = "dq"
            elif c == "`": state = "tpl"
            elif c == "{": depth += 1
            elif c == "}":
                depth -= 1
                if depth == 0: return i
        i += 1
    raise ValueError("unbalanced braces")


def extract(src, name):
    m = re.search(r"function\s+" + re.escape(name) + r"\s*\(", src)
    if not m:
        raise ValueError("function not found: " + name)
    brace = src.index("{", m.end())
    return src[m.start():match_braces(src, brace) + 1]


def extract_decl(src, name):
    """Extract a top-level `var NAME = <expr>;` declaration (bracket/comment-aware)."""
    m = re.search(r"\bvar\s+" + re.escape(name) + r"\s*=", src)
    if not m:
        raise ValueError("var not found: " + name)
    i, n, depth, state = m.end(), len(src), 0, None
    while i < n:
        c = src[i]; nx = src[i + 1] if i + 1 < n else ""
        if state == "line":
            if c == "\n": state = None
        elif state == "block":
            if c == "*" and nx == "/": state = None; i += 1
        elif state in ("sq", "dq", "tpl"):
            if c == "\\": i += 1
            elif (state == "sq" and c == "'") or (state == "dq" and c == '"') or (state == "tpl" and c == "`"):
                state = None
        else:
            if c == "/" and nx == "/": state = "line"; i += 1
            elif c == "/" and nx == "*": state = "block"; i += 1
            elif c == "'": state = "sq"
            elif c == '"': state = "dq"
            elif c == "`": state = "tpl"
            elif c in "[{(": depth += 1
            elif c in "]})": depth -= 1
            elif c == ";" and depth == 0:
                return src[m.start():i + 1]
        i += 1
    raise ValueError("declaration end not found: " + name)


def main():
    src = open(APPJS, encoding="utf-8").read()
    extracted = ("\n".join(extract_decl(src, v) for v in VARS) + "\n\n"
                 + "\n\n".join(extract(src, f) for f in FUNCS))
    items = [{"id": it["id"], "type": it["type"], "genre": it.get("genre")}
             for it in json.load(open(CONTENT))["items"]]

    harness = extracted + """

var WEIGHTS = { psalm:4, gospel:5, wisdom:3, epistle:3, meditation:4, catechism:2, saint:1, father:1, prayer:1, summa:1 };
const items = %s;
let pass = 0, fail = 0; const fails = [];
function check(name, cond){ if(cond) pass++; else { fail++; fails.push(name); } }
const ids = a => a.map(x => x.id);
const eq  = (a,b) => JSON.stringify(a) === JSON.stringify(b);

const SIZE = 25;
const d0 = composeOffice(items, 0, SIZE, WEIGHTS);
const d0b = composeOffice(items, 0, SIZE, WEIGHTS);
const d1 = composeOffice(items, 1, SIZE, WEIGHTS);

check('office deterministic (same day)', eq(ids(d0), ids(d0b)));
check('office length = SIZE',            d0.length === SIZE);
check('office day0 != day1',            !eq(ids(d0), ids(d1)));
check('office no dup within a day',      new Set(ids(d0)).size === d0.length);
check('office has scripture',            d0.some(x => x.type === 'scripture'));
check('office has non-scripture',        d0.some(x => x.type !== 'scripture'));

// all four scripture genres present in a day
const genres = new Set(d0.filter(x=>x.type==='scripture').map(x=>x.genre));
check('office spans psalm/gospel/wisdom/epistle',
      ['psalm','gospel','wisdom','epistle'].every(g => genres.has(g)));

// no bucket appears 3+ times consecutively (round-robin spread)
const bucket = x => x.type === 'scripture' ? x.genre : x.type;
let run = 1, runOk = true;
for (let i = 1; i < d0.length; i++){
  if (bucket(d0[i]) === bucket(d0[i-1])){ run++; if (run > 2) runOk = false; } else run = 1;
}
check('office: no bucket >2 in a row', runOk);

// office is maximally fresh: distinct draws over 10 days == sum of min(quota*days, available)
let all = [];
for (let day = 0; day < 10; day++) all = all.concat(ids(composeOffice(items, day, SIZE, WEIGHTS)));
const avail = {}; items.forEach(x => { const b = bucket(x); avail[b] = (avail[b]||0)+1; });
const q0 = {}; d0.forEach(x => { const b = bucket(x); q0[b] = (q0[b]||0)+1; });
let expected = 0; Object.keys(q0).forEach(b => { expected += Math.min(q0[b]*10, avail[b]); });
check('office maximally fresh over 10 days (no avoidable repeats)', new Set(all).size === expected);

// gospel bucket walks without repeat until exhausted (large bucket)
let g = [];
for (let day = 0; day < 8; day++)
  g = g.concat(composeOffice(items, day, SIZE, WEIGHTS).filter(x => x.genre === 'gospel').map(x=>x.id));
check('gospel: no repeat across 8 days', new Set(g).size === g.length);

// --- dayIndex / bucketOf ---
check('dayIndex epoch=0',      dayIndex('2025-01-01') === 0);
check('dayIndex +1 day',       dayIndex('2025-01-02') === 1);
check('dayIndex +31 days',     dayIndex('2025-02-01') === 31);
check('bucketOf scripture->genre', bucketOf({type:'scripture',genre:'psalm'}) === 'psalm');
check('bucketOf other->type',      bucketOf({type:'prayer'}) === 'prayer');

// --- seededShuffle / isoDate ---
check('shuffle permutation', eq(ids(seededShuffle(items,5)).slice().sort(), ids(items).slice().sort()));
check('shuffle deterministic', eq(seededShuffle(items,9), seededShuffle(items,9)));
check('isoDate pads', isoDate(new Date(2026,0,5)) === '2026-01-05');

// --- streakAfterOpen ---
check('streak first->1',   streakAfterOpen({streak:0,lastOpenedISO:null},'2026-06-28').streak === 1);
check('streak same day',   streakAfterOpen({streak:5,lastOpenedISO:'2026-06-28'},'2026-06-28').streak === 5);
check('streak consecutive',streakAfterOpen({streak:5,lastOpenedISO:'2026-06-27'},'2026-06-28').streak === 6);
check('streak gap resets', streakAfterOpen({streak:5,lastOpenedISO:'2026-06-25'},'2026-06-28').streak === 1);
check('streak month cross',streakAfterOpen({streak:3,lastOpenedISO:'2026-05-31'},'2026-06-01').streak === 4);

// --- liturgical calendar ---
const easterOf = y => { const t = computusEaster(y); const d = new Date(t); return (d.getUTCMonth()+1)+'-'+d.getUTCDate(); };
check('computus 2024', easterOf(2024) === '3-31');
check('computus 2025', easterOf(2025) === '4-20');
check('computus 2026', easterOf(2026) === '4-5');
check('computus 2027', easterOf(2027) === '3-28');
check('computus 2000', easterOf(2000) === '4-23');
check('computus 2038', easterOf(2038) === '4-25');
const lit = (y,m,d) => liturgicalDay(new Date(y, m-1, d));
check('Easter Sunday label',  lit(2025,4,20).label === 'Easter Sunday' && lit(2025,4,20).color === 'white');
check('Ash Wednesday',        lit(2025,3,5).label === 'Ash Wednesday' && lit(2025,3,5).key === 'lent');
check('Pentecost red',        lit(2025,6,8).label === 'Pentecost' && lit(2025,6,8).color === 'red');
check('Nativity fixed feast', lit(2025,12,25).label === 'The Nativity of the Lord' && lit(2025,12,25).color === 'white');
check('Advent violet',        lit(2025,12,7).key === 'advent' && lit(2025,12,7).color === 'violet');
check('Gaudete is rose',      lit(2025,12,14).rose === true && lit(2025,12,14).color === 'rose');
check('Lent is penitential',  lit(2025,3,12).key === 'lent' && lit(2025,3,12).color === 'violet');
check('green after Pentecost',lit(2025,7,15).key === 'afterPent' && lit(2025,7,15).color === 'green');
check('mmdd present',         lit(2025,8,15).mmdd === '08-15');
// season weighting renormalises to the daily portion and biases the season
const lentW = seasonWeights(WEIGHTS, 'lent', 25);
check('seasonWeights sums to portion', Object.values(lentW).reduce((a,b)=>a+b,0) === 25);
check('Lent boosts meditation over base', lentW.meditation >= WEIGHTS.meditation);
check('Lent trims the Gospel',            lentW.gospel <= WEIGHTS.gospel);
const baseW = seasonWeights(WEIGHTS, 'afterPent', 25);
check('ordinary season ~ base',           baseW.gospel === WEIGHTS.gospel || Math.abs(baseW.gospel-WEIGHTS.gospel) <= 1);

const spread = d0.reduce((m,x)=>{const b=bucket(x);m[b]=(m[b]||0)+1;return m;},{});
console.log('office bucket spread (day 0):', spread);
fails.forEach(f => console.log('  FAIL:', f));
console.log(`\\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
""" % json.dumps(items)

    with tempfile.NamedTemporaryFile("w", suffix=".js", delete=False) as fh:
        fh.write(harness); path = fh.name
    try:
        r = subprocess.run(["node", path], capture_output=True, text=True)
        print(r.stdout.strip())
        if r.stderr.strip(): print(r.stderr.strip())
        sys.exit(r.returncode)
    finally:
        os.unlink(path)


if __name__ == "__main__":
    main()
