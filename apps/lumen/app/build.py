#!/usr/bin/env python3
"""build.py — assemble the split-architecture PWA.
  1. validate content.json (hard gate; --strict blocks unverified items)
  2. node --check app.js (source)
  3. inline app.js -> shell.html (replace /*__APP_JS__*/)
  4. inject icon base64 (replace __ICON_B64__)
  5. write index.html + sw.js + content.json to outputs
  6. extract <script> from index.html and node --check it
Content ships as a separate, service-worker-cached file (not inlined).
Run from app/:  python3 build.py [--strict]

Output dir resolution (first match wins):
  1. --out <dir> argument
  2. LUMEN_OUT environment variable
  3. <repo>/apps/lumen/dist  (default — the four deployable files land here)
The GitHub Pages workflow sets LUMEN_OUT to the published site's /lumen folder.
"""
import os, re, subprocess, sys

HERE    = os.path.dirname(os.path.abspath(__file__))
ROOT    = os.path.dirname(HERE)


def resolve_out():
    if "--out" in sys.argv:
        return sys.argv[sys.argv.index("--out") + 1]
    return os.environ.get("LUMEN_OUT") or os.path.join(ROOT, "dist")


OUT     = resolve_out()
SHELL   = os.path.join(HERE, "shell.html")
APPJS   = os.path.join(HERE, "app.js")
SWJS    = os.path.join(HERE, "sw.js")
ICONB64 = os.path.join(HERE, "icon.b64")
CONTENT = os.path.join(ROOT, "content.json")
DEPTH = os.path.join(ROOT, "depth.json")
VALIDATE = os.path.join(ROOT, "validate_content.py")

APPJS_MARKER = '/*__APP_JS__*/'
ICON_MARKER  = '__ICON_B64__'


def die(msg):
    print("BUILD FAILED:", msg); sys.exit(1)


def node_check(code, label):
    p = subprocess.run(["node", "--check", "-"], input=code, capture_output=True, text=True)
    if p.returncode != 0:
        die("node --check failed (%s):\n%s" % (label, p.stderr.strip()))
    print("  node --check OK  (%s)" % label)


def main():
    strict = "--strict" in sys.argv
    args = [sys.executable, VALIDATE, CONTENT] + (["--strict"] if strict else [])
    r = subprocess.run(args, capture_output=True, text=True)
    print(r.stdout.strip())
    if r.returncode != 0:
        die("content validation failed")

    shell = open(SHELL, encoding="utf-8").read()
    appjs = open(APPJS, encoding="utf-8").read()
    swjs  = open(SWJS, encoding="utf-8").read()
    icon  = open(ICONB64, encoding="utf-8").read().strip()
    content = open(CONTENT, encoding="utf-8").read()

    node_check(appjs, "app.js source")

    if shell.count(APPJS_MARKER) != 1:
        die("APP_JS marker must appear exactly once (found %d)" % shell.count(APPJS_MARKER))
    if "</script" in appjs.lower():
        appjs = appjs.replace("</script", "<\\/script")
    html = shell.replace(APPJS_MARKER, appjs)

    if html.count(ICON_MARKER) < 1:
        die("ICON marker not found")
    html = html.replace(ICON_MARKER, icon)

    os.makedirs(OUT, exist_ok=True)
    out_html    = os.path.join(OUT, "index.html")
    out_sw      = os.path.join(OUT, "sw.js")
    out_content = os.path.join(OUT, "content.json")
    open(out_html, "w", encoding="utf-8").write(html)
    open(out_sw,   "w", encoding="utf-8").write(swjs)
    open(out_content, "w", encoding="utf-8").write(content)

    out_depth = None
    if os.path.exists(DEPTH):
        out_depth = os.path.join(OUT, "depth.json")
        open(out_depth, "w", encoding="utf-8").write(open(DEPTH, encoding="utf-8").read())

    m = re.search(r"<script>(.*)</script>", html, re.S)
    if not m:
        die("could not re-extract <script> from assembled HTML")
    node_check(m.group(1).replace("<\\/script", "</script"), "assembled <script>")

    kb = lambda p: os.path.getsize(p) / 1024
    print("\nWROTE (deploy all four files to the same site root):")
    print("  %s  (%.1f KB)" % (out_html, kb(out_html)))
    print("  %s  (%.0f KB)" % (out_content, kb(out_content)))
    if out_depth:
        print("  %s  (%.0f KB, lazy-loaded)" % (out_depth, kb(out_depth)))
    print("  %s  (%.1f KB)" % (out_sw, kb(out_sw)))
    print("OK")


if __name__ == "__main__":
    main()
