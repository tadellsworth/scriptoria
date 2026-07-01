#!/usr/bin/env python3
"""
VIGOR build — assembles the single-file PWA.

Pipeline:
  1. read  src/app_template.html            (app source, with __ICON*__ placeholders)
  2. extract the inline <script>, write a temp check.js, run `node --check`
  3. inject the base64 icons from src/icons_b64.py into the placeholders
  4. write dist/index.html  (named index.html for root hosting / Netlify)
  5. copy  src/sw.js -> dist/sw.js

Output dir can be overridden:  VIGOR_OUT=/path/to/deploy python3 build.py

Deploy:  drop dist/index.html + dist/sw.js in their OWN folder on an HTTPS host.
"""
import os, re, sys, shutil, subprocess, pathlib

ROOT = pathlib.Path(__file__).parent.resolve()
SRC  = ROOT / "src"
OUT  = pathlib.Path(os.environ.get("VIGOR_OUT", ROOT / "dist"))

sys.path.insert(0, str(SRC))
import icons_b64  # noqa: E402  (ICONS = {"180":..., "192":..., "512":...})


def check_js(html: str) -> None:
    """Extract inline JS and run `node --check` (skipped if node is absent)."""
    scripts = re.findall(r"<script>(.*?)</script>", html, re.S)
    js = "\n".join(scripts)
    tmp = ROOT / ".check.js"
    tmp.write_text(js, encoding="utf-8")
    if shutil.which("node"):
        r = subprocess.run(["node", "--check", str(tmp)], capture_output=True, text=True)
        if r.returncode != 0:
            tmp.unlink(missing_ok=True)
            raise SystemExit("JS SYNTAX ERROR:\n" + r.stderr)
        print(f"  node --check OK  ({len(js):,} chars of JS)")
    else:
        print("  (node not found — skipping JS syntax check)")
    tmp.unlink(missing_ok=True)


def main() -> None:
    tmpl = (SRC / "app_template.html").read_text(encoding="utf-8")

    print("VIGOR build")
    check_js(tmpl)

    for key in ("180", "192", "512"):
        tmpl = tmpl.replace(f"__ICON{key}__", icons_b64.ICONS[key])
    if "__ICON" in tmpl:
        raise SystemExit("ERROR: an __ICON*__ placeholder was left uninjected.")

    OUT.mkdir(parents=True, exist_ok=True)
    (OUT / "index.html").write_text(tmpl, encoding="utf-8")
    shutil.copyfile(SRC / "sw.js", OUT / "sw.js")

    kb = round(len((OUT / "index.html").read_bytes()) / 1024)
    print(f"  wrote {OUT/'index.html'}  ({kb} KB)")
    print(f"  wrote {OUT/'sw.js'}")
    print("done.")


if __name__ == "__main__":
    main()
