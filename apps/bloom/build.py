#!/usr/bin/env python3
# Build BLOOM: inject base64 icon into app.js, inline app.js into shell.html,
# emit final index.html. Mirrors the VIGOR/STRIDE build pattern.
import pathlib, subprocess, sys, tempfile, os, json

ROOT = pathlib.Path(__file__).parent
# Output dir: defaults to ./dist next to the source. Override with BLOOM_OUT=/path/to/deploy
OUT = pathlib.Path(os.environ.get("BLOOM_OUT", ROOT / "dist"))
OUT.mkdir(parents=True, exist_ok=True)

shell = (ROOT / "shell.html").read_text(encoding="utf-8")
appjs = (ROOT / "app.js").read_text(encoding="utf-8")
icon_b64 = (ROOT / "icon.b64").read_text(encoding="utf-8").strip()
tiles = json.loads((ROOT / "tiles_b64.json").read_text(encoding="utf-8"))
tiles_literal = json.dumps(tiles, separators=(",", ":"))  # compact, valid JS object literal

# optional recorded-audio cue map {cueId: url}; empty until clips are added
audio_path = ROOT / "audio_b64.json"
audio = json.loads(audio_path.read_text(encoding="utf-8")) if audio_path.exists() else {}
audio_literal = json.dumps(audio, separators=(",", ":"))

# --- sentinel assertions ---
APP_SENT = "/*__APP_JS__*/"
ICON_SENT = '"__ICON_B64__"'
TILES_SENT = '"__TILES_JSON__"'
AUDIO_SENT = '"__AUDIO_JSON__"'
assert shell.count(APP_SENT) == 1, f"shell APP_JS placeholder count != 1 ({shell.count(APP_SENT)})"
assert appjs.count(ICON_SENT) == 1, f"app.js ICON placeholder count != 1 ({appjs.count(ICON_SENT)})"
assert appjs.count(TILES_SENT) == 1, f"app.js TILES placeholder count != 1 ({appjs.count(TILES_SENT)})"
assert appjs.count(AUDIO_SENT) == 1, f"app.js AUDIO placeholder count != 1 ({appjs.count(AUDIO_SENT)})"

# --- inject icon + tiles + audio into app.js ---
appjs_injected = (appjs.replace(ICON_SENT, '"' + icon_b64 + '"')
                       .replace(TILES_SENT, tiles_literal)
                       .replace(AUDIO_SENT, audio_literal))
assert "__ICON_B64__" not in appjs_injected, "icon placeholder still present after inject"
assert "__TILES_JSON__" not in appjs_injected, "tiles placeholder still present after inject"
assert "__AUDIO_JSON__" not in appjs_injected, "audio placeholder still present after inject"
print(f"[ok] injected {len(tiles)} exercise tiles, {len(audio)} audio cues")

# --- validate injected app.js standalone before inlining ---
with tempfile.NamedTemporaryFile("w", suffix=".js", delete=False, encoding="utf-8") as tf:
    tf.write(appjs_injected)
    tmp_js = tf.name
r = subprocess.run(["node", "--check", tmp_js], capture_output=True, text=True)
os.unlink(tmp_js)
if r.returncode != 0:
    print("node --check FAILED on injected app.js:\n", r.stderr); sys.exit(1)
print("[ok] injected app.js passes node --check")

# --- inline into shell ---
# Use a function for replacement to avoid backslash/group interpretation in the JS payload.
final_html = shell.replace(APP_SENT, appjs_injected)
assert APP_SENT not in final_html, "placeholder still present after inline"

(OUT / "index.html").write_text(final_html, encoding="utf-8")
print(f"[ok] wrote {OUT/'index.html'} ({len(final_html):,} bytes)")

# --- extract inlined JS back out and re-validate ---
# Grab the last <script>...</script> block (the app script).
import re
scripts = re.findall(r"<script>(.*?)</script>", final_html, flags=re.S)
assert scripts, "no <script> blocks found in final html"
extracted = scripts[-1]
with tempfile.NamedTemporaryFile("w", suffix=".js", delete=False, encoding="utf-8") as tf:
    tf.write(extracted)
    tmp_js2 = tf.name
r2 = subprocess.run(["node", "--check", tmp_js2], capture_output=True, text=True)
os.unlink(tmp_js2)
if r2.returncode != 0:
    print("node --check FAILED on extracted JS:\n", r2.stderr); sys.exit(1)
print("[ok] extracted post-build JS passes node --check")
print("BUILD COMPLETE")
