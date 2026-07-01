# BLOOM — Recorded-Audio Cues · Handoff for Claude Code

Hand this to a fresh Claude Code session on the repo. It captures everything needed to
**finalize the pre-recorded voice feature** once the audio clips exist. The playback
engine is already built and shipping; the only remaining work is encoding a folder of
recorded clips and wiring them in.

---

## TL;DR — where things stand

- BLOOM is a single-file HTML PWA (strength-progression daily workout, a personal gift —
  **no Precision Custom Home Builders branding, kept entirely separate from work**).
- Her iPhone won't expose Apple's premium voices to the Web Speech API (confirmed Apple/
  WebKit limitation), so the app was rebuilt to **play pre-recorded clips** and fall back
  to the live device voice only when a clip is missing.
- **DONE:** the full audio-playback engine, iOS gesture-unlock, per-line routing, settings
  UI, and a `build.py` audio-injection path. It's safe in production right now — with no
  clips present it behaves exactly as before.
- **PENDING:** produce 34 short voice clips (see routes below), then encode + embed/cache
  them and rebuild. That's the job this handoff sets up.

---

## Repo file map

Source files (edit these) → `build.py` assembles → deploy artifacts (commit/deploy these):

| File | Role |
|---|---|
| `shell.html` | HTML+CSS shell. Contains `/*__APP_JS__*/` placeholder (exactly once). Design tokens in `:root`. |
| `app.js` | Standalone IIFE. Placeholders each appear exactly once: `"__ICON_B64__"`, `"__TILES_JSON__"`, `"__AUDIO_JSON__"`. localStorage key `bloom.v1`. |
| `build.py` | Asserts each placeholder == 1, injects icon + tiles + audio, validates with `node --check`, inlines app.js into shell, writes `index.html`. Output dir = `./dist` (override with `BLOOM_OUT=/path`). |
| `tiles_b64.json` | `{tileId: dataURI}` — 24 WebP exercise illustrations, injected into `"__TILES_JSON__"`. |
| `icon.b64` | App icon, injected into `"__ICON_B64__"`. |
| `audio_b64.json` | **Optional / to be created.** `{cueId: url}`. If absent, build injects `{}`. This is the whole finalization deliverable. |
| `sw.js` | Service worker. **Hand-edited, not produced by build.py.** Lives next to `index.html` in the deploy dir. Cache constant currently `bloom-v4`. |

Final deploy = `index.html` + `sw.js` (+ an `audio/` folder only if you choose the folder
route below). Hosted on Netlify at onefaithdelivered.org.

> Note: this session built in a sandbox that wrote to `/mnt/user-data/outputs`. On the repo,
> `build.py` now defaults to `./dist`. Make sure `sw.js` ends up in the same folder the site
> is served from, next to `index.html`.

---

## What was done this session

1. **Audio engine** added to `app.js` (right after `say()` / `stopSpeak()`):
   - `var AUDIO = "__AUDIO_JSON__";` — the injected `{cueId: url}` map (empty `{}` until clips exist).
   - `SILENCE` — a tiny silent-MP3 data URI used to unlock audio on iOS.
   - `hasAudio()`, `audioEl()` (one reusable `Audio` element), `unlockAudio()`, `playClip(url)`.
   - **`voice(id, text)`** — the single router every spoken line now goes through: plays
     `AUDIO[id]` if present, else calls `say(text)` (live device voice).
2. **`stopSpeak()`** augmented to also `pause()` the audio element (covers every stop path:
   pause, advance, teardown, mute).
3. **iOS unlock**: `unlockAudio()` is called inside `startSession()` — i.e. within the
   "Begin" tap gesture — so later timer-driven `playClip()` calls are permitted by iOS.
4. **All spoken lines routed** through `voice()`:
   - work step → `voice("ex_" + step.exId, step.name + ". " + step.cue)`
   - rest → `voice("rest", "Rest. Next, " + step.next)`
   - switch sides → `voice("switch", "Switch sides")`
   - finish → `voice("finish", "Beautiful. You got stronger today.")`
   - cues toggle on → `voice("cues_on", "Spoken cues on.")`
   - settings preview button → `voice("preview", ...)`
   - (the live voice-picker's own change-preview stays as `say()` — only reachable in live mode)
5. **Settings UI** gated on `hasAudio()`: when clips exist it shows a "Recorded voice" note
   + preview button and hides the live voice picker / diagnostics; otherwise the existing
   live picker + "Voice details" diagnostics panel remain.
6. **`build.py`** reads optional `audio_b64.json` and injects it into `"__AUDIO_JSON__"`
   (empty object if the file is absent). Sentinel assertion added.
7. **`sw.js`** bumped to `bloom-v4`.

Behavior contract: **a missing clip id is not an error** — that one line just uses the live
voice. So partial clip sets are fine, and the app never breaks for lack of audio.

---

## Cue IDs — full coverage (34)

Recording text is the source of truth in **`bloom_audio_manifest.json`** (`{id: {text}}`).
Exercise texts are `"<Name>. <cue>"` pulled verbatim from the `EX` object in `app.js`.

**29 exercise clips** (`ex_<exId>`):
`ex_breathing ex_catcow ex_march ex_pelvictilt ex_glutebridge ex_bridgemarch ex_birddog
ex_glutekick ex_clamshell ex_sideleg ex_wallpush ex_kneepush ex_squat ex_supportsquat
ex_reverselunge ex_stepback ex_deadbug ex_calfraise ex_standoblique ex_forearmhold
ex_kneehug ex_childpose ex_splitsquat ex_pushup ex_singlebridge ex_plankfull ex_squatjump
ex_highknees ex_skater`

**5 system clips:**
`rest switch finish cues_on preview`

If `EX` changes later (moves added/renamed/re-cued), regenerate the manifest from `app.js`
so ids and text stay in sync, then record any new ids.

---

## PENDING — finalize once you have the clips

Input: a folder of 34 files named by id (e.g. `ex_squat.m4a`, `rest.m4a`), any common
format (`.m4a` / `.mp3` / `.aiff` / `.wav`). See "Generating the clips" below.

### 1. Post-process each clip (ffmpeg): trim silence + normalize loudness → mono AAC

```bash
mkdir -p audio_final
for f in bloom_audio/*; do
  id=$(basename "$f"); id="${id%.*}"
  ffmpeg -y -i "$f" -af \
"silenceremove=start_periods=1:start_silence=0.08:start_threshold=-45dB,\
areverse,silenceremove=start_periods=1:start_silence=0.08:start_threshold=-45dB,areverse,\
loudnorm=I=-16:TP=-1.5:LRA=11" \
    -ac 1 -ar 44100 -c:a aac -b:a 64k "audio_final/$id.m4a"
done
```

Use AAC/`.m4a` (or MP3) for iOS reliability. **Avoid Ogg/Opus** — old iOS Safari/WebViews
don't decode it. `.m4a` → mime `audio/mp4`.

### 2. Decide embed vs folder (based on total size)

```bash
du -ch audio_final/*.m4a | tail -1   # rough total
```

- **Embed (preferred — keeps the 2-file deploy)** if total is small (≈ under ~500–600 KB;
  34 one-sentence AAC clips usually land well under this). Build `audio_b64.json` as data URIs:

  ```python
  import base64, json, pathlib
  out = {}
  for p in pathlib.Path("audio_final").glob("*.m4a"):
      b = base64.b64encode(p.read_bytes()).decode()
      out[p.stem] = "data:audio/mp4;base64," + b
  json.dump(out, open("audio_b64.json", "w"))
  ```

- **Folder route** if it's heavier: set `audio_b64.json` to **relative URLs** and drop the
  clips next to `index.html`:

  ```python
  import json, pathlib
  ids = [p.stem for p in pathlib.Path("audio_final").glob("*.m4a")]
  json.dump({i: f"audio/{i}.m4a" for i in ids}, open("audio_b64.json", "w"))
  # then copy audio_final/*.m4a → <deploy>/audio/
  ```
  With the folder route you **must** add every `audio/<id>.m4a` to the `sw.js` precache list
  so it works offline.

`build.py` injects whichever `audio_b64.json` you produce — no app.js edits needed.

### 3. Rebuild + bump the service worker

```bash
python3 build.py                       # writes ./dist/index.html (or BLOOM_OUT)
# bump sw.js: bloom-v4 -> bloom-v5   (and add audio/* to precache if folder route)
```

### 4. Verify

```bash
# every clip id present, no leftover placeholder:
python3 - <<'PY'
import json,re,pathlib
h=pathlib.Path("dist/index.html").read_text(encoding="utf-8")
assert "__AUDIO_JSON__" not in h, "placeholder not injected"
man=json.load(open("bloom_audio_manifest.json"))
missing=[k for k in man if f'"{k}"' not in h.split("var AUDIO =")[1][:200000]]
print("clips in manifest:", len(man))
print("ids not found in AUDIO map:", missing or "none (all present)")
PY
# and node-check the extracted script (build.py already does this internally)
```

Then load it in a browser and, ideally, an iPhone: install to home screen, start a session,
confirm cues play from the recorded voice and that pausing/muting stops them cleanly.

---

## Generating the clips (for reference)

Full instructions live in **`BLOOM-voice-recording-README.md`**. Three routes:

1. **Mac `say`** (recommended) — run **`generate_mac.command`**; it makes all 34 clips with
   an Apple **premium** voice (Zoe/Ava/Allison — the same family she downloaded) and
   compresses to `.m4a`. Set `VOICE="…"` at the top first.
2. **ElevenLabs free tier** — best quality, cross-platform; 34 one-sentence pastes using the
   manifest text; save each file by its id.
3. **Google AI Studio TTS** — cross-platform; save each by id.

Send back / drop in a folder named by id. Missing a few is fine (live-voice fallback).

---

## Constraints & gotchas to respect (project-wide)

- **Single-file ethos:** no CDN, npm, or build tools in the *deployed* output. Assets are
  base64-embedded or inline. (The folder-route audio is the one sanctioned exception, and
  only because clips can be large; still fully offline via SW precache.)
- **iOS:** keep `viewport-fit=cover`; keep `unlockAudio()` inside the start tap; one reusable
  `Audio` element; AAC/MP3 only.
- **Never `innerHTML +=`** on live nodes (destroys listeners) — use DOM methods.
- **Stable ids/keys:** don't rename `exId`s, cue ids, the `bloom.v1` localStorage key, or the
  `"__…__"` placeholders — saved state and the audio map depend on them.
- **`node --check`** app.js before build and the extracted script after (build.py does both).
- **Exact-anchor `str_replace`** over big rewrites; confirm anchor uniqueness first.
- **Use Python, not bash,** for any file work involving unicode / long lines (cues contain
  en-dashes etc.).
- **Bump `sw.js` cache constant** on every asset/content change.
- Firebase (REST-only, shared `languageapps-da8a8` DB) is **not** used by BLOOM yet — deferred
  backup/sync is a separate future item.

---

## Quick command reference

```bash
python3 build.py                    # assemble dist/index.html (BLOOM_OUT=… to redirect)
node --check app.js                 # sanity-check the source IIFE
# regenerate manifest from app.js if EX changed (Node extracts EX, writes ids+text)
```

Deferred, unrelated BLOOM ideas (not part of this task): optional bodyweight trend line
(no calorie targets), rough-night energy scaling, resume-after-interruption, Firebase REST
sync, and gentle idle motion on the exercise images.
