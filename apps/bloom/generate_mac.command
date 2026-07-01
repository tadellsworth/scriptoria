#!/bin/bash
# BLOOM voice generator — makes one short audio clip per spoken cue using a
# premium Apple voice, entirely on your Mac. Double-click to run, or:  bash generate_mac.command
#
# 1) First install a premium voice (once):
#      System Settings ▸ Accessibility ▸ Spoken Content ▸ System Voice ▸ Manage Voices…
#      download e.g. Zoe (Premium), Ava (Premium), or Allison (Premium).
# 2) Set VOICE below to match the exact name shown there.
# 3) Run this. It writes clips into ./bloom_audio, then zip that folder and send it back.

VOICE="Zoe (Premium)"    # <-- change to the premium voice you installed

cd "$(dirname "$0")"
mkdir -p bloom_audio
echo "Generating with voice: $VOICE"

say -v "$VOICE" -o "bloom_audio/ex_breathing.aiff" "Core breaths. Inhale wide, then exhale and gently draw your belly toward your spine."
say -v "$VOICE" -o "bloom_audio/ex_catcow.aiff" "Cat–cow. Round and arch slowly, following your breath."
say -v "$VOICE" -o "bloom_audio/ex_march.aiff" "Standing marches. Lift each knee with control. Stay tall and easy."
say -v "$VOICE" -o "bloom_audio/ex_pelvictilt.aiff" "Pelvic tilts. Tip your pelvis, flattening your low back, then release."
say -v "$VOICE" -o "bloom_audio/ex_glutebridge.aiff" "Glute bridges. Press through your heels, lift the hips, squeeze, lower slowly."
say -v "$VOICE" -o "bloom_audio/ex_bridgemarch.aiff" "Bridge marches. Hold the bridge tall and lift one foot, then the other."
say -v "$VOICE" -o "bloom_audio/ex_birddog.aiff" "Bird dog. Reach opposite arm and leg long. Keep your hips level."
say -v "$VOICE" -o "bloom_audio/ex_glutekick.aiff" "Glute kickbacks. On all fours, press one heel toward the ceiling."
say -v "$VOICE" -o "bloom_audio/ex_clamshell.aiff" "Clamshells. Side-lying, open the top knee like a clam. Keep feet together."
say -v "$VOICE" -o "bloom_audio/ex_sideleg.aiff" "Side leg lifts. Lift the top leg with control, then lower without dropping."
say -v "$VOICE" -o "bloom_audio/ex_wallpush.aiff" "Wall push-ups. Hands on the wall, bend the elbows, press back tall."
say -v "$VOICE" -o "bloom_audio/ex_kneepush.aiff" "Knee push-ups. From your knees, lower with control and press up."
say -v "$VOICE" -o "bloom_audio/ex_squat.aiff" "Bodyweight squats. Sit back like reaching for a chair. Stand tall and breathe out."
say -v "$VOICE" -o "bloom_audio/ex_supportsquat.aiff" "Supported squats. Hold a counter for balance and sit back gently."
say -v "$VOICE" -o "bloom_audio/ex_reverselunge.aiff" "Reverse lunges. Step back and lower, then drive through the front heel."
say -v "$VOICE" -o "bloom_audio/ex_stepback.aiff" "Step-back reach. Step back into a gentle lunge and reach tall."
say -v "$VOICE" -o "bloom_audio/ex_deadbug.aiff" "Dead bug. Lower opposite arm and leg slowly. Keep your back quiet."
say -v "$VOICE" -o "bloom_audio/ex_calfraise.aiff" "Calf raises. Rise onto your toes, pause, lower slowly."
say -v "$VOICE" -o "bloom_audio/ex_standoblique.aiff" "Standing side reach. Reach overhead and bend gently to the side."
say -v "$VOICE" -o "bloom_audio/ex_forearmhold.aiff" "Forearm hold. Hold a steady line from your knees. Breathe — don't bear down."
say -v "$VOICE" -o "bloom_audio/ex_kneehug.aiff" "Knee hugs. Draw one knee toward your chest and soften."
say -v "$VOICE" -o "bloom_audio/ex_childpose.aiff" "Child's pose. Sink your hips back and let everything settle."
say -v "$VOICE" -o "bloom_audio/ex_splitsquat.aiff" "Split squats. Front foot forward, back knee dips toward the floor. Drive up through the front heel."
say -v "$VOICE" -o "bloom_audio/ex_pushup.aiff" "Full push-ups. On your toes now. Lower with control and press the floor away. Drop to knees anytime."
say -v "$VOICE" -o "bloom_audio/ex_singlebridge.aiff" "Single-leg bridges. One foot planted, the other leg long. Lift the hips level and lower slow."
say -v "$VOICE" -o "bloom_audio/ex_plankfull.aiff" "Forearm plank. Full plank on your toes — long line from head to heels, ribs down, keep breathing."
say -v "$VOICE" -o "bloom_audio/ex_squatjump.aiff" "Squat jumps. Sit back, then spring up and land soft and quiet through the whole foot."
say -v "$VOICE" -o "bloom_audio/ex_highknees.aiff" "High-knee jog. Light, quick feet in place. Stay tall and land softly."
say -v "$VOICE" -o "bloom_audio/ex_skater.aiff" "Skater steps. Glide side to side like a skater, soft knees, control the landing."
say -v "$VOICE" -o "bloom_audio/rest.aiff" "Rest. Take a breath — the next move is coming up."
say -v "$VOICE" -o "bloom_audio/switch.aiff" "Switch sides."
say -v "$VOICE" -o "bloom_audio/finish.aiff" "Beautiful. You got stronger today."
say -v "$VOICE" -o "bloom_audio/cues_on.aiff" "Spoken cues on."
say -v "$VOICE" -o "bloom_audio/preview.aiff" "Nice and steady. Let's get a little stronger today."

if command -v afconvert >/dev/null 2>&1; then
  echo "Compressing to .m4a…"
  for f in bloom_audio/*.aiff; do
    afconvert "$f" "${f%.aiff}.m4a" -d aac -f m4af -b 64000 && rm "$f"
  done
fi
echo "Done → ./bloom_audio  (zip this folder and send it back)"
