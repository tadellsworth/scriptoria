# BLOOM — recording the spoken cues

The app is now built to play **pre-recorded clips** instead of the phone's robotic
voice. It already works as-is: until clips exist, it quietly falls back to the live
device voice, exactly like before. Add the clips and it upgrades automatically — and
sounds identical on every phone, including her iPhone.

There are **34 short clips** to make (29 exercise cues + 5 short system lines). The
exact wording for each is in **`bloom_audio_manifest.json`**. Each clip's filename is
its **id** (the key in that file), e.g. `ex_squat`, `rest`, `finish`.

Pick whichever route below is easiest for you. **Send me back the folder of audio
files and I'll do all the trimming, leveling, and wiring** — you don't need ffmpeg or
anything technical on your end.

---

## Route 1 — Mac `say` (recommended if you have any Mac)

This uses Apple's own **premium voices** — the same Ava / Zoe / Allison family you
downloaded on the iPhone — and generates all 34 clips in one go, free and offline.

1. Install a premium voice once:
   **System Settings ▸ Accessibility ▸ Spoken Content ▸ System Voice ▸ Manage Voices…**
   and download e.g. **Zoe (Premium)**, **Ava (Premium)**, or **Allison (Premium)**.
2. Open **`generate_mac.command`** in a text editor and set `VOICE="…"` to the exact
   name you installed (default is `Zoe (Premium)`).
3. Double-click `generate_mac.command` (or run `bash generate_mac.command`).
   It writes clips into a `bloom_audio` folder and compresses them.
4. Zip `bloom_audio` and send it back.

*(If macOS blocks the double-click, right-click ▸ Open the first time, or run the
`bash …` line in Terminal.)*

---

## Route 2 — ElevenLabs free tier (best quality, works on any computer)

Highest-quality option and cross-platform. The free tier's monthly character
allowance comfortably covers all 34 short lines.

1. Sign up at elevenlabs.io, pick a warm female voice you like.
2. For each entry in `bloom_audio_manifest.json`, paste the `text`, generate, and
   **download the mp3 named after its id** (e.g. `ex_squat.mp3`).
3. Zip the folder of mp3s and send it back.

It's 34 pastes — a bit repetitive, but each line is one sentence and the result is
excellent. (If ElevenLabs offers any batch/CSV import on your plan, the manifest's
text fields are ready to paste in bulk.)

---

## Route 3 — Google AI Studio TTS (you have Gemini Pro)

aistudio.google.com has speech-generation models. Generate each manifest line, save
each file by its id, zip, and send back. Quality is very good and it's cross-platform.

---

## What I need back

A folder (zipped) of 34 audio files named by id — any common format is fine
(`.m4a`, `.mp3`, `.aiff`, `.wav`). Missing a few is OK; any clip you don't send just
falls back to the live voice for that one line.

Once you send them I'll normalize the volume, trim the silence, encode them to an
iOS-friendly format, wire them into the app, bump the service worker, and hand back
the final `index.html` + `sw.js`.
