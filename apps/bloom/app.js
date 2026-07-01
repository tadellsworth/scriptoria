/* BLOOM — real bodyweight strength and HIIT, in short sessions
   No equipment, no gym, no wasted time. Real intensity from the first session:
   full push-ups, jump squats, burpees, plank variations — each move still has
   harder steps to earn as you get stronger, and intervals tighten as you stay
   consistent. Single-file PWA logic. No frameworks. localStorage key: bloom.v1 */
(function () {
  "use strict";

  var ICON_B64 = "__ICON_B64__"; // injected at build time
  var IMG = "__TILES_JSON__";    // { tileId: dataURI } injected at build time
  var KEY = "bloom.v1";

  /* ---------- state ---------- */
  var DEFAULT = {
    tier: "strength",
    minutes: 15,
    voice: true,
    voiceURI: null,
    name: "",
    streak: 0, best: 0, lastDate: null,
    totalSessions: 0, totalMinutes: 0,
    history: [],
    seenIntro: false,
    // ---- progression engine ----
    levels: {},          // ladderId -> rung index she's unlocked (0-based)
    xp: {},              // ladderId -> sessions that move has appeared in
    week: 1,             // training week; intervals grow as this climbs
    weekKey: null, weekCount: 0, weekBumped: false,
    tierCounts: {},      // tier -> sessions completed at that tier
    tierNudged: {},      // tier -> already offered the step-up
    pr: { longestHold: 0, longestSession: 0 },
    milestones: {}       // milestoneId -> date earned
  };
  var state = load();

  function load() {
    try {
      var raw = localStorage.getItem(KEY);
      if (!raw) return clone(DEFAULT);
      var s = JSON.parse(raw);
      for (var k in DEFAULT) if (!(k in s)) s[k] = clone(DEFAULT[k]);
      // ensure nested progression objects are present
      ["levels", "xp", "tierCounts", "tierNudged", "milestones", "pr"].forEach(function (key) {
        if (!s[key] || typeof s[key] !== "object") s[key] = clone(DEFAULT[key]);
      });
      if (typeof s.pr.longestHold !== "number") s.pr.longestHold = 0;
      if (typeof s.pr.longestSession !== "number") s.pr.longestSession = 0;
      return s;
    } catch (e) { return clone(DEFAULT); }
  }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) {} }
  function clone(o) { return JSON.parse(JSON.stringify(o)); }

  /* ---------- date helpers ---------- */
  function ymd(d) {
    d = d || new Date();
    return d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate());
  }
  function pad(n) { return (n < 10 ? "0" : "") + n; }
  function daysBetween(a, b) {
    var pa = a.split("-").map(Number), pb = b.split("-").map(Number);
    var da = new Date(pa[0], pa[1] - 1, pa[2]), db = new Date(pb[0], pb[1] - 1, pb[2]);
    return Math.round((db - da) / 86400000);
  }
  function weekKeyOf(dateStr) {
    // ISO-week style key, e.g. "2026-W26"
    var p = dateStr.split("-").map(Number);
    var d = new Date(p[0], p[1] - 1, p[2]);
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() + 3 - ((d.getDay() + 6) % 7)); // nearest Thursday
    var week1 = new Date(d.getFullYear(), 0, 4);
    var wk = 1 + Math.round(((d - week1) / 86400000 - 3 + ((week1.getDay() + 6) % 7)) / 7);
    return d.getFullYear() + "-W" + pad(wk);
  }

  /* ---------- exercises ----------
     type: 'timed' (do for duration) | 'hold' (still hold) ; perSide:true => "switch halfway"
     demo: key into SVG_DEMOS ; cue: spoken/short coaching */
  var EX = {
    /* ---- warm-up / cool-down ---- */
    breathing:   { name: "Core breaths",        demo: "breathing", type: "hold",
      cue: "Inhale wide through the nose, exhale hard through the mouth. Get your breath ready to work." },
    catcow:      { name: "Cat–cow",             demo: "catcow", type: "timed",
      cue: "Round and arch through your spine — wake up your core before you load it." },
    march:       { name: "Standing marches",    demo: "march", type: "timed",
      cue: "Quick, controlled knee drives. Get your heart rate moving." },
    kneehug:     { name: "Knee hugs",           demo: "kneehug", type: "hold", perSide: true,
      cue: "Draw one knee to your chest, control the release. Let your legs recover." },
    childpose:   { name: "Child's pose",        demo: "childpose", type: "hold",
      cue: "Sink your hips back, breathe deep, let your heart rate settle." },

    /* ---- legs (squat → split squat → jump lunge) ---- */
    squat:       { name: "Bodyweight squats",   demo: "squat", type: "timed",
      cue: "Sit back and down, chest up, drive through your heels to stand. Full range, every rep." },
    splitsquat:  { name: "Split squats",        demo: "lunge", type: "timed", perSide: true,
      cue: "Front foot planted, back knee taps the floor, drive up through the front heel. Fast and controlled." },
    jumplunge:   { name: "Jump lunges",         demo: "jump-lunge", type: "timed", perSide: true, impact: true,
      cue: "Explode up and switch legs in the air. Land soft, absorb through the hips, go again." },

    /* ---- push (full push-up → explosive push-up) ---- */
    pushup:      { name: "Full push-ups",       demo: "pushup-full", type: "timed",
      cue: "Full range — chest to the floor, press away hard. Keep your core tight the whole time." },
    plyopushup:  { name: "Explosive push-ups",  demo: "plyo-pushup", type: "timed", impact: true,
      cue: "Lower with control, then press explosively — hands leave the floor if you've got it. Reset and go again." },

    /* ---- plank (forearm plank → plank jacks) ---- */
    plankfull:   { name: "Forearm plank",       demo: "plank-full", type: "hold",
      cue: "Long line from head to heels. Brace your core like you're about to get punched." },
    plankjacks:  { name: "Plank jacks",         demo: "plank-jacks", type: "timed", impact: true,
      cue: "Hold the plank, jump your feet wide and back. Keep your hips still — don't let them bounce." },

    /* ---- bridge (glute bridge → bridge march → single-leg bridge) ---- */
    glutebridge: { name: "Glute bridges",       demo: "bridge", type: "timed",
      cue: "Squeeze at the top like you're cracking a walnut with your glutes. Full lockout, every rep." },
    bridgemarch: { name: "Bridge marches",      demo: "bridge", type: "timed",
      cue: "Hold the bridge, drive one knee up, then the other — don't let your hips drop." },
    singlebridge:{ name: "Single-leg bridges",  demo: "bridge-single", type: "timed", perSide: true,
      cue: "One foot planted, one leg long. Drive the hips up and hold the squeeze at the top." },

    /* ---- cardio (high knees → squat jumps → burpees) ---- */
    highknees:   { name: "High knees",          demo: "march", type: "timed", impact: true,
      cue: "Drive your knees up fast, pump your arms. Stay light on your feet — this is your engine builder." },
    squatjump:   { name: "Squat jumps",         demo: "squat-jump", type: "timed", impact: true,
      cue: "Load deep, then explode straight up. Land soft and go right back down — no resting at the top." },
    burpees:     { name: "Burpees",             demo: "burpee", type: "timed", impact: true,
      cue: "Drop to a plank, chest to the floor, jump your feet in, explode up. All-out, full body." },

    /* ---- standalone core / conditioning ---- */
    deadbug:     { name: "Dead bug",            demo: "deadbug", type: "timed",
      cue: "Lower opposite arm and leg without letting your back arch off the floor. Slow and controlled." },
    calfraise:   { name: "Calf raises",         demo: "calf", type: "timed",
      cue: "Drive up onto your toes fast, control the lower. Feel it burn by the last few reps." },
    standoblique:{ name: "Standing oblique twists", demo: "oblique", type: "timed", perSide: true,
      cue: "Reach and crunch to the side hard — drive through your obliques, not your arms." },
    birddog:     { name: "Bird dog",            demo: "birddog", type: "timed", perSide: true,
      cue: "Reach opposite arm and leg long, pause, squeeze your core, then switch. Control beats speed." },
    mountainclimbers: { name: "Mountain climbers", demo: "mountain-climbers", type: "timed", impact: true,
      cue: "Drive your knees to your chest fast, keep your hips low and core braced. Sprint it." },
    bicyclecrunch: { name: "Bicycle crunches",  demo: "bicycle-crunch", type: "timed",
      cue: "Elbow to opposite knee, full rotation, no momentum from your neck. Make your abs do the work." },
    skater:      { name: "Skater jumps",        demo: "skater", type: "timed", perSide: true, impact: true,
      cue: "Push off hard side to side, land soft on one leg, control the balance. Feel it in your outer hips." }
  };

  /* ---------- move ladders (easiest → hardest) ----------
     A pool slot named by a ladder id resolves to the rung she's unlocked.
     Anything not listed here is a single-rung move used as-is. */
  var LADDERS = {
    legs:   ["squat", "splitsquat", "jumplunge"],
    push:   ["pushup", "plyopushup"],
    plank:  ["plankfull", "plankjacks"],
    bridge: ["glutebridge", "bridgemarch", "singlebridge"],
    cardio: ["highknees", "squatjump", "burpees"]
  };
  var LADDER_TITLES = { legs: "Squats & Lunges", push: "Push-ups", plank: "Planks", bridge: "Bridges", cardio: "Cardio" };
  var LADDER_OF = {};
  Object.keys(LADDERS).forEach(function (id) {
    LADDERS[id].forEach(function (ex, i) { LADDER_OF[ex] = { id: id, idx: i }; });
  });
  function tiersWithMove(exId) {
    var info = LADDER_OF[exId], out = [];
    TIER_ORDER.forEach(function (tk) {
      var inPool = TIERS[tk].pool.some(function (slot) {
        return slot === exId || (info && slot === info.id);
      });
      if (inPool) out.push(TIERS[tk].label);
    });
    return out;
  }

  function ladderRung(id) {
    var L = LADDERS[id]; if (!L) return 0;
    var lvl = state.levels[id] || 0;
    return Math.max(0, Math.min(lvl, L.length - 1));
  }
  function resolveSlot(id) {
    // ladder id -> current exId ; plain exId -> itself
    if (LADDERS[id]) return LADDERS[id][ladderRung(id)];
    return id;
  }
  function ladderReady() {
    // ladders where the next rung is earned but not yet taken
    var out = [];
    Object.keys(LADDERS).forEach(function (id) {
      var L = LADDERS[id], lvl = state.levels[id] || 0;
      if (lvl < L.length - 1 && (state.xp[id] || 0) >= 4 * (lvl + 1)) {
        out.push({ id: id, fromName: EX[L[lvl]].name, toName: EX[L[lvl + 1]].name });
      }
    });
    return out;
  }
  function levelUp(id) {
    var L = LADDERS[id]; if (!L) return;
    var lvl = state.levels[id] || 0;
    if (lvl < L.length - 1) { state.levels[id] = lvl + 1; save(); }
  }

  /* ---------- strength milestones (the proof it's working) ---------- */
  var MILESTONES = [
    { id: "first",    name: "First bloom",        desc: "You did your first session.",
      test: function () { return state.totalSessions >= 1; } },
    { id: "week7",    name: "A full week",        desc: "Seven days in a row.",
      test: function () { return state.best >= 7; } },
    { id: "moves3",   name: "Climbing",           desc: "Leveled up three different moves.",
      test: function () { return leveledCount() >= 3; } },
    { id: "tw4",      name: "Four weeks strong",  desc: "Reached training week 4.",
      test: function () { return (state.week || 1) >= 4; } },
    { id: "plank45",  name: "Steady plank",       desc: "Held a plank 45 seconds or more.",
      test: function () { return (state.pr.longestHold || 0) >= 45; } },
    { id: "plyopush", name: "Explosive power",    desc: "Earned explosive push-ups.",
      test: function () { return (state.levels.push || 0) >= 1; } },
    { id: "single",   name: "Single-leg strong",  desc: "Earned single-leg bridges or split squats.",
      test: function () { return (state.levels.bridge || 0) >= 2 || (state.levels.legs || 0) >= 1; } },
    { id: "s20",      name: "Twenty sessions",    desc: "Twenty sessions in the books.",
      test: function () { return state.totalSessions >= 20; } },
    { id: "burpee",   name: "All-out",            desc: "Earned burpees — the hardest move in the circuit.",
      test: function () { return (state.levels.cardio || 0) >= 2; } }
  ];
  function leveledCount() {
    var n = 0; Object.keys(LADDERS).forEach(function (id) { if ((state.levels[id] || 0) >= 1) n++; });
    return n;
  }
  function evaluateMilestones() {
    // returns array of milestones newly earned this call
    var gained = [];
    MILESTONES.forEach(function (m) {
      if (!state.milestones[m.id] && m.test()) {
        state.milestones[m.id] = ymd();
        gained.push(m);
      }
    });
    if (gained.length) save();
    return gained;
  }

  /* ---------- tiers (set the flavor + the pace; ladders climb on top) ----------
     pool entries are ladder ids (legs/push/plank/bridge/cardio) or plain moves.
     Four training styles, all real intensity — no gentle on-ramp, no gating. */
  var TIERS = {
    strength: {
      label: "Strength", tag: "Build real power",
      blurb: "Squats, push-ups, planks, and bridges — bodyweight strength with real intensity. Short rest, full effort.",
      work: 35, rest: 12,
      pool: ["legs", "push", "plank", "bridge", "deadbug", "standoblique", "calfraise"]
    },
    hiit: {
      label: "HIIT", tag: "Cardio meets strength",
      blurb: "Jump squats, burpees, mountain climbers, and high knees, mixed with strength work. Your heart rate stays up the whole time.",
      work: 35, rest: 10,
      pool: ["cardio", "legs", "push", "mountainclimbers", "skater", "plank"]
    },
    core: {
      label: "Core Burn", tag: "Deep core, no mercy",
      blurb: "Planks, bicycle crunches, mountain climbers, and bird dogs — a real core finisher.",
      work: 30, rest: 8,
      pool: ["plank", "bicyclecrunch", "deadbug", "birddog", "mountainclimbers", "standoblique"]
    },
    allout: {
      label: "All Out", tag: "Everything, max effort",
      blurb: "The whole circuit — strength, cardio, and core — at your hardest pace. Leave it all on the floor.",
      work: 40, rest: 8,
      pool: ["cardio", "legs", "push", "plank", "bicyclecrunch", "mountainclimbers", "skater"]
    }
  };
  var TIER_ORDER = ["strength", "hiit", "core", "allout"];

  var WARMUP = [ ["breathing", 40], ["catcow", 30], ["march", 30] ];
  var COOLDOWN = [ ["kneehug", 36], ["childpose", 34], ["breathing", 44] ];
  var WARMUP_Q = [ ["breathing", 30], ["march", 24] ];
  var COOLDOWN_Q = [ ["childpose", 30], ["breathing", 30] ];

  /* intervals grow with training week: longer work, a touch less rest */
  function volBonus() {
    var w = (state.week || 1) - 1;
    return { work: Math.min(w * 2, 12), rest: -Math.min(w, 6) };
  }

  /* ---------- build a session ---------- */
  function buildSession(tier, minutes) {
    var T = TIERS[tier];
    var quick = minutes <= 5;
    var warm = quick ? WARMUP_Q : WARMUP;
    var cool = quick ? COOLDOWN_Q : COOLDOWN;
    var vb = volBonus();
    var work = T.work + vb.work;
    var rest = Math.max(8, T.rest + vb.rest);
    var steps = [];
    var i;

    // warmup
    steps.push({ kind: "phase", label: "Warm-up" });
    for (i = 0; i < warm.length; i++)
      steps.push(workStep(warm[i][0], warm[i][1], "warmup"));

    // main circuit — resolve each pool slot to the rung she's earned
    steps.push({ kind: "phase", label: "Movement" });
    var warmSecs = warm.reduce(function (a, w2) { return a + w2[1]; }, 0) + warm.length * 8;
    var coolSecs = cool.reduce(function (a, w2) { return a + w2[1]; }, 0) + cool.length * 4;
    var mainSecs = minutes * 60 - warmSecs - coolSecs;
    var per = work + rest;
    var n = Math.max(quick ? 4 : 6, Math.round(mainSecs / per));
    for (i = 0; i < n; i++) {
      var ex = resolveSlot(T.pool[i % T.pool.length]);
      steps.push(workStep(ex, work, "main"));
      if (i < n - 1) {
        var nextEx = resolveSlot(T.pool[(i + 1) % T.pool.length]);
        steps.push({ kind: "rest", label: "Rest", seconds: rest, next: EX[nextEx].name });
      }
    }

    // cooldown
    steps.push({ kind: "phase", label: "Cool-down" });
    for (i = 0; i < cool.length; i++)
      steps.push(workStep(cool[i][0], cool[i][1], "cooldown"));

    steps.push({ kind: "done", label: "Done" });
    return steps;
  }
  function workStep(exId, seconds, phase) {
    var e = EX[exId];
    return { kind: "work", exId: exId, name: e.name, cue: e.cue, demo: e.demo,
      seconds: seconds, perSide: !!e.perSide, hold: e.type === "hold", phase: phase };
  }

  /* ===========================================================
     SVG demos — stylized, gently looping figures.
     Animated groups use transform-box:view-box so transform-origin
     is in viewBox coordinates (pivot at a real joint).
     =========================================================== */
  var VB = 'viewBox="0 0 220 170" xmlns="http://www.w3.org/2000/svg" class="demo-svg" preserveAspectRatio="xMidYMid meet"';
  function floor(y) { return '<line class="floor" x1="18" y1="' + y + '" x2="202" y2="' + y + '"/>'; }
  function head(cx, cy, r) { return '<circle class="skin" cx="' + cx + '" cy="' + cy + '" r="' + (r || 12) + '"/>'; }
  function org(x, y) { return 'style="transform-box:view-box;transform-origin:' + x + 'px ' + y + 'px"'; }

  var SVG_DEMOS = {
    breathing: function () {
      return '<svg ' + VB + '>' + floor(150) +
        head(110, 60, 13) +
        '<path class="fig" d="M110 73 V120"/>' +
        '<ellipse class="belly a-breathe" ' + org(110, 100) + ' cx="110" cy="100" rx="16" ry="13"/>' +
        '<path class="fig" d="M110 120 L92 150 M110 120 L128 150"/>' +
        '<path class="fig accent" d="M110 84 L86 100 M110 84 L134 100"/>' +
        '</svg>';
    },
    catcow: function () {
      return '<svg ' + VB + '>' + floor(150) +
        '<g class="a-catcow" ' + org(120, 105) + '>' +
        '<path class="fig" d="M70 110 Q120 96 168 110"/>' +
        head(176, 108, 11) +
        '<path class="fig" d="M78 110 V150 M150 110 V150"/>' +
        '<path class="fig" d="M96 110 V150 M132 110 V150"/>' +
        '</g></svg>';
    },
    march: function () {
      return '<svg ' + VB + '>' + floor(150) +
        head(110, 44, 12) +
        '<path class="fig" d="M110 57 V108"/>' +
        '<path class="fig accent a-swingA" ' + org(110, 70) + ' d="M110 70 L86 96"/>' +
        '<path class="fig accent a-swingB" ' + org(110, 70) + ' d="M110 70 L134 96"/>' +
        '<path class="fig a-marchL" ' + org(110, 108) + ' d="M110 108 L96 150"/>' +
        '<path class="fig a-marchR" ' + org(110, 108) + ' d="M110 108 L124 150"/>' +
        '</svg>';
    },
    pelvictilt: function () {
      return '<svg ' + VB + '>' + floor(150) +
        head(46, 120, 12) +
        '<g class="a-tilt" ' + org(120, 132) + '>' +
        '<path class="fig" d="M58 132 H150"/>' +
        '<path class="fig accent" d="M150 132 L150 150"/>' +
        '</g>' +
        '<path class="fig" d="M150 132 L168 110 L150 150"/>' +
        '</svg>';
    },
    bridge: function () {
      return '<svg ' + VB + '>' + floor(150) +
        head(48, 118, 12) +
        '<path class="fig" d="M60 130 H96"/>' +
        '<g class="a-hip" ' + org(120, 120) + '>' +
        '<path class="fig accent" d="M96 130 Q120 96 140 132"/>' +
        '</g>' +
        '<path class="fig" d="M140 132 L150 150 M140 132 L150 150"/>' +
        '<path class="fig" d="M140 134 L138 150"/>' +
        '</svg>';
    },
    birddog: function () {
      return '<svg ' + VB + '>' + floor(150) +
        '<path class="fig" d="M74 112 H150"/>' +
        head(160, 110, 10) +
        '<path class="fig" d="M150 112 V150 M150 112 V150"/>' +
        '<path class="fig" d="M88 112 V150"/>' +
        '<path class="fig accent a-armlift" ' + org(150, 112) + ' d="M150 112 L186 92"/>' +
        '<path class="fig accent a-leglift" ' + org(74, 112) + ' d="M74 112 L36 96"/>' +
        '</svg>';
    },
    sidelying: function () {
      return '<svg ' + VB + '>' + floor(150) +
        head(56, 120, 12) +
        '<path class="fig" d="M68 126 H150"/>' +
        '<path class="fig" d="M150 126 L168 150"/>' +
        '<path class="fig accent a-leglift" ' + org(150, 126) + ' d="M150 126 L184 144"/>' +
        '<path class="fig" d="M74 126 L60 150"/>' +
        '</svg>';
    },
    wallpush: function () {
      return '<svg ' + VB + '>' + floor(150) +
        '<line class="floor" x1="40" y1="20" x2="40" y2="150"/>' +
        '<g class="a-push-x" ' + org(110, 100) + '>' +
        head(120, 64, 12) +
        '<path class="fig" d="M120 76 L150 150"/>' +
        '<path class="fig accent" d="M120 86 L52 78 M120 96 L52 96"/>' +
        '</g></svg>';
    },
    pushup: function () {
      return '<svg ' + VB + '>' + floor(150) +
        '<g class="a-push-y" ' + org(110, 120) + '>' +
        head(58, 112, 11) +
        '<path class="fig" d="M70 116 L150 132"/>' +
        '<path class="fig accent" d="M84 118 V150 M104 122 V150"/>' +
        '<path class="fig" d="M150 132 L150 150"/>' +
        '</g></svg>';
    },
    squat: function () {
      return '<svg ' + VB + '>' + floor(150) +
        '<g class="a-squat" ' + org(110, 150) + '>' +
        head(110, 40, 12) +
        '<path class="fig" d="M110 53 V96"/>' +
        '<path class="fig accent" d="M110 64 L84 78 M110 64 L136 78"/>' +
        '<path class="fig" d="M110 96 L88 116 L92 150"/>' +
        '<path class="fig" d="M110 96 L132 116 L128 150"/>' +
        '</g></svg>';
    },
    lunge: function () {
      return '<svg ' + VB + '>' + floor(150) +
        '<g class="a-lunge" ' + org(108, 150) + '>' +
        head(108, 44, 12) +
        '<path class="fig" d="M108 57 V100"/>' +
        '<path class="fig accent" d="M108 68 L130 84"/>' +
        '<path class="fig" d="M108 100 L84 124 L84 150"/>' +
        '<path class="fig" d="M108 100 L138 128 L150 150"/>' +
        '</g></svg>';
    },
    deadbug: function () {
      return '<svg ' + VB + '>' + floor(150) +
        '<path class="fig" d="M64 132 H150"/>' + head(52, 132, 12) +
        '<path class="fig accent a-db-arm" ' + org(120, 132) + ' d="M120 132 L150 108"/>' +
        '<path class="fig a-db-arm2" ' + org(120, 132) + ' d="M120 132 L120 104"/>' +
        '<path class="fig accent a-db-leg" ' + org(96, 132) + ' d="M96 132 L120 150"/>' +
        '<path class="fig a-db-leg2" ' + org(96, 132) + ' d="M96 132 L96 104"/>' +
        '</svg>';
    },
    calf: function () {
      return '<svg ' + VB + '>' + floor(150) +
        '<g class="a-calf" ' + org(110, 120) + '>' +
        head(110, 40, 12) +
        '<path class="fig" d="M110 53 V96"/>' +
        '<path class="fig accent" d="M110 64 L88 80 M110 64 L132 80"/>' +
        '<path class="fig" d="M110 96 L100 150 M110 96 L120 150"/>' +
        '</g>' +
        '<path class="fig accent" d="M98 150 L96 144 M120 150 L122 144"/>' +
        '</svg>';
    },
    oblique: function () {
      return '<svg ' + VB + '>' + floor(150) +
        '<g class="a-bend" ' + org(110, 110) + '>' +
        head(110, 42, 12) +
        '<path class="fig" d="M110 55 V110"/>' +
        '<path class="fig accent" d="M110 60 L132 38"/>' +
        '<path class="fig" d="M110 64 L92 96"/>' +
        '</g>' +
        '<path class="fig" d="M110 110 L98 150 M110 110 L122 150"/>' +
        '</svg>';
    },
    plank: function () {
      return '<svg ' + VB + '>' + floor(150) +
        '<g class="a-plank" ' + org(110, 130) + '>' +
        head(48, 118, 11) +
        '<path class="fig accent" d="M58 122 Q108 116 150 138"/>' +
        '<path class="fig" d="M62 124 L62 150 L86 150"/>' +
        '<path class="fig" d="M150 138 L150 150"/>' +
        '<path class="fig" d="M132 134 L132 150"/>' +
        '</g></svg>';
    },
    kneehug: function () {
      return '<svg ' + VB + '>' + floor(150) +
        head(54, 122, 12) +
        '<path class="fig" d="M66 128 H132"/>' +
        '<path class="fig" d="M132 128 L150 150"/>' +
        '<g class="a-knee" ' + org(132, 128) + '>' +
        '<path class="fig accent" d="M132 128 L116 104 L96 116"/>' +
        '</g></svg>';
    },
    childpose: function () {
      return '<svg ' + VB + '>' + floor(150) +
        '<g class="a-child" ' + org(120, 130) + '>' +
        '<path class="fig accent" d="M150 150 Q150 124 120 124 Q92 124 70 132"/>' +
        head(60, 132, 11) +
        '<path class="fig" d="M70 132 L40 124"/>' +
        '<path class="fig" d="M150 150 L150 132"/>' +
        '</g></svg>';
    }
  };
  function demoSVG(key) { return (SVG_DEMOS[key] || SVG_DEMOS.breathing)(); }
  function demoImg(key) {
    var src = IMG && IMG[key];
    if (src) return '<img class="demo-img" src="' + src + '" alt="" draggable="false">';
    return demoSVG(key); // fallback to inline SVG if a tile is missing
  }

  /* ---------- voice ---------- */
  var canSpeak = "speechSynthesis" in window;
  var VOICES = [];
  var chosenVoice = null;

  function refreshVoices() {
    if (!canSpeak) return;
    try { VOICES = window.speechSynthesis.getVoices() || []; } catch (e) { VOICES = []; }
    pickVoice();
  }
  function englishVoices() {
    return VOICES.filter(function (v) { return /^en([-_]|$)/i.test(v.lang || ""); });
  }
  var NICE_NAMES = ["ava", "samantha", "allison", "susan", "zoe", "serena", "karen",
    "moira", "tessa", "fiona", "google us english", "google uk english female", "jenny", "aria"];
  function voiceScore(v) {
    var s = 0;
    var tag = ((v.name || "") + " " + (v.voiceURI || "")).toLowerCase();
    if (/enhanced|premium|natural|neural/.test(tag)) s += 60;   // the big quality jump
    if (v.localService) s += 20;                                // offline + no lag
    for (var i = 0; i < NICE_NAMES.length; i++) if (tag.indexOf(NICE_NAMES[i]) >= 0) { s += 34 - i; break; }
    if (/en[-_]us/i.test(v.lang || "")) s += 6;
    if (/compact|eloquence|espeak/.test(tag)) s -= 50;          // the robotic ones
    return s;
  }
  function pickVoice() {
    var list = englishVoices();
    if (!list.length) { chosenVoice = null; return; }
    if (state.voiceURI) {
      for (var i = 0; i < list.length; i++)
        if (list[i].voiceURI === state.voiceURI) { chosenVoice = list[i]; return; }
    }
    var best = list[0], bestScore = -1e9;
    list.forEach(function (v) { var sc = voiceScore(v); if (sc > bestScore) { bestScore = sc; best = v; } });
    chosenVoice = best;
  }
  function hasEnhancedVoice() {
    return englishVoices().some(function (v) {
      return /enhanced|premium|natural|neural/i.test((v.name || "") + " " + (v.voiceURI || ""));
    });
  }
  function say(text) {
    if (!state.voice || !canSpeak) return;
    try {
      var u = new SpeechSynthesisUtterance(text);
      if (chosenVoice) u.voice = chosenVoice;
      u.rate = 0.9; u.pitch = 1.02; u.volume = 1;   // a touch slower + warmer
      window.speechSynthesis.speak(u);
    } catch (e) {}
  }
  function stopSpeak() {
    try { if (canSpeak) window.speechSynthesis.cancel(); } catch (e) {}
    if (_aud) { try { _aud.pause(); } catch (e) {} }
  }

  /* ---------- recorded-audio cues (premium voice, plays instead of live speech) ---------- */
  var AUDIO = "__AUDIO_JSON__";          // { cueId: url }  — injected at build (empty until clips exist)
  var _aud = null, _audUnlocked = false;
  var SILENCE = "data:audio/mpeg;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjYwLjE2LjEwMAAAAAAAAAAAAAAA//NwwAAAAAAAAAAAAEluZm8AAAAPAAAABAAAAR4Aurq6urq6urq6urq6urq6urq6urq6urq60dHR0dHR0dHR0dHR0dHR0dHR0dHR0dHR0ejo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Ojo6Oj/////////////////////////////////AAAAAExhdmM2MC4zMQAAAAAAAAAAAAAAACQCcQAAAAAAAAEeqyLcVwAAAAAAAAAAAAAAAAD/8xDEAAAAA0gAAAAATEFNRTMuMTAwVVVVVf/zEMQNAAADSAAAAABVVVVVVVVVVVVVVVVV//MQxBoAAANIAAAAAFVVVVVVVVVVVVVVVVX/8xDEJwAAA0gAAAAAVVVVVVVVVVVVVVVVVQ==";
  function hasAudio() { return AUDIO && typeof AUDIO === "object" && Object.keys(AUDIO).length > 0; }
  function audioEl() {
    if (!_aud) { _aud = new Audio(); _aud.preload = "auto"; }
    return _aud;
  }
  function unlockAudio() {                 // call inside a user gesture (session start) so iOS lets us play later
    if (_audUnlocked || !hasAudio()) return;
    try {
      var a = audioEl(); a.src = SILENCE;
      var p = a.play(); if (p && p.catch) p.catch(function () {});
      _audUnlocked = true;
    } catch (e) {}
  }
  function playClip(url) {
    try {
      var a = audioEl();
      a.pause(); a.src = url; a.currentTime = 0;
      var p = a.play(); if (p && p.catch) p.catch(function () {});
      return true;
    } catch (e) { return false; }
  }
  // one router for every spoken line: play the recorded clip if we have it, else fall back to the live device voice
  function voice(id, text) {
    if (!state.voice) return;
    if (hasAudio() && AUDIO[id]) { playClip(AUDIO[id]); return; }
    say(text);
  }
  function prettyVoiceName(v) {
    var n = v.name || v.voiceURI || "Voice";
    n = n.replace(/\s*\((English.*?)\)\s*/i, " ");           // drop "(English (United States))"
    var enh = /enhanced|premium|natural|neural/i.test((v.name || "") + " " + (v.voiceURI || ""));
    var region = /en[-_]gb/i.test(v.lang || "") ? " · UK" : /en[-_]au/i.test(v.lang || "") ? " · AU" : "";
    return n.trim() + region + (enh ? " ✦" : "");
  }
  function isIOS() {
    return /iPad|iPhone|iPod/.test(navigator.userAgent || "") ||
      (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  }
  if (canSpeak) {
    refreshVoices();
    try { window.speechSynthesis.onvoiceschanged = refreshVoices; } catch (e) {}
  }

  /* ---------- tiny DOM helpers ---------- */
  function el(tag, cls, html) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (html != null) n.innerHTML = html;
    return n;
  }
  function $(sel, root) { return (root || document).querySelector(sel); }
  function $$(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }

  var app = $("#app");
  var currentTab = "today";

  /* ======================= SCREENS ======================= */
  function greeting() {
    var h = new Date().getHours();
    var g = h < 12 ? "Good morning" : h < 18 ? "Good afternoon" : "Good evening";
    return state.name ? g + ", " + state.name : g;
  }

  function renderToday() {
    var done = state.lastDate === ymd();
    var t = TIERS[state.tier];
    var c = el("div", "screen");
    c.appendChild(el("div", "eyebrow", greeting().toUpperCase()));
    c.appendChild(el("h1", "today-h", done ? "You got stronger today." : "A little stronger today."));

    var sub = el("p", "today-sub",
      done
        ? "That's logged. Come back tomorrow — steady is how strength comes back."
        : "Your " + state.minutes + "-minute " + t.label.toLowerCase() + " session is ready. It nudges up a little as you stay consistent.");
    c.appendChild(sub);

    // streak chip
    var chip = el("div", "streak-chip");
    chip.innerHTML = '<span class="streak-num">' + state.streak + '</span>' +
      '<span class="streak-lbl">day' + (state.streak === 1 ? "" : "s") + '<br>blooming</span>' +
      '<span class="streak-petal">' + petalMark(Math.min(state.streak, 7)) + '</span>';
    c.appendChild(chip);

    // start card
    var card = el("div", "start-card");
    card.innerHTML =
      '<div class="start-meta"><span class="start-tier">' + t.label + '</span>' +
      '<span class="start-dot">·</span><span>' + state.minutes + ' min</span>' +
      '<span class="start-dot">·</span><span>no equipment</span></div>' +
      '<div class="start-blurb">' + t.tag + '</div>';
    var btn = el("button", "btn-primary big", done ? "Move again" : "Begin today's session");
    btn.addEventListener("click", startSession);
    card.appendChild(btn);
    c.appendChild(card);

    // mix-it-up nudge: consistent enough to rotate to a new training style
    var ti = TIER_ORDER.indexOf(state.tier);
    var nextTier = (ti >= 0 && ti < TIER_ORDER.length - 1) ? TIER_ORDER[ti + 1] : null;
    if (nextTier && (state.tierCounts[state.tier] || 0) >= 6 && (state.week || 1) >= 2 && !state.tierNudged[state.tier]) {
      var cur = state.tier;
      var nu = el("div", "nudge");
      nu.innerHTML = '<div class="nudge-k">MIX IT UP</div>' +
        '<div class="nudge-t">You\'ve been steady on ' + t.label + '. Want to try <b>' + TIERS[nextTier].label + '</b>?</div>';
      var nrow = el("div", "nudge-row");
      var yes = el("button", "btn-soft", "Try it");
      yes.addEventListener("click", function () { state.tierNudged[cur] = true; state.tier = nextTier; save(); renderToday(); });
      var no = el("button", "link-quiet", "Not yet");
      no.addEventListener("click", function () { state.tierNudged[cur] = true; save(); renderToday(); });
      nrow.appendChild(yes); nrow.appendChild(no);
      nu.appendChild(nrow);
      c.appendChild(nu);
    }

    // level-up available
    var ready = ladderReady();
    if (ready.length) {
      var lc = el("div", "nudge alt");
      lc.innerHTML = '<div class="nudge-k">NEW LEVEL EARNED</div>' +
        '<div class="nudge-t">You\'ve earned ' +
          (ready.length === 1 ? "a harder " + ready[0].toName.toLowerCase() : ready.length + " harder moves") +
          '. Level up whenever you want.</div>';
      var seek = el("button", "btn-soft", "See your levels");
      seek.addEventListener("click", function () { go("progress"); });
      lc.appendChild(seek);
      c.appendChild(lc);
    }

    var tweak = el("button", "link-quiet", "Change length or intensity");
    tweak.addEventListener("click", function () { go("about"); });
    c.appendChild(tweak);

    setScreen(c);
  }

  function petalMark(n) {
    var s = '<svg viewBox="0 0 ' + (n * 14 + 6) + ' 24" width="' + (n * 14 + 6) + '" height="24">';
    for (var i = 0; i < n; i++) {
      s += '<ellipse cx="' + (10 + i * 14) + '" cy="12" rx="5.4" ry="9" fill="var(--rose)" opacity="' + (0.5 + 0.5 * ((i + 1) / Math.max(n,1))) + '" transform="rotate(' + (i % 2 ? 12 : -12) + ' ' + (10 + i * 14) + ' 12)"/>';
    }
    return s + '</svg>';
  }

  function renderMoves() {
    var c = el("div", "screen");
    c.appendChild(el("div", "eyebrow", "MOVE LIBRARY"));
    c.appendChild(el("h2", "scr-h", "Every move, and where it leads"));
    c.appendChild(el("p", "scr-sub", "Tap any move to see how it flows. Faded ones are harder versions you'll unlock as you go."));
    var grid = el("div", "move-grid");
    var seen = {};
    var ids = [];
    function add(exId) { if (!seen[exId] && EX[exId]) { seen[exId] = true; ids.push(exId); } }
    TIER_ORDER.forEach(function (tk) {
      TIERS[tk].pool.forEach(function (slot) {
        if (LADDERS[slot]) LADDERS[slot].forEach(add); else add(slot);
      });
    });
    ids.forEach(function (id) {
      var e = EX[id];
      var info = LADDER_OF[id];
      var locked = info && info.idx > ladderRung(info.id);
      var card = el("button", "move-card" + (locked ? " locked" : ""));
      var tag = info && info.idx > 0
        ? '<span class="move-lvl">Lv ' + (info.idx + 1) + '</span>' : '';
      card.innerHTML = '<div class="move-thumb">' + demoImg(e.demo) + tag + '</div>' +
        '<div class="move-name">' + e.name + '</div>';
      card.addEventListener("click", function () { openMoveSheet(id); });
      grid.appendChild(card);
    });
    c.appendChild(grid);
    setScreen(c);
  }

  function openMoveSheet(id) {
    var e = EX[id];
    var info = LADDER_OF[id];
    var locked = info && info.idx > ladderRung(info.id);
    var tiersWith = tiersWithMove(id);
    var sheet = el("div", "sheet");
    sheet.innerHTML =
      '<div class="sheet-grip"></div>' +
      '<div class="sheet-demo">' + demoImg(e.demo) + '</div>' +
      '<h3 class="sheet-name">' + e.name + '</h3>' +
      (e.perSide ? '<div class="pill">Both sides — switch halfway</div>' : '') +
      (e.impact ? '<div class="pill warm">Light impact</div>' : '') +
      (locked ? '<div class="pill warm">Unlocks as you level up ' + (LADDER_TITLES[info.id] || "") + '</div>' : '') +
      '<p class="sheet-cue">' + e.cue + '</p>' +
      (tiersWith.length ? '<div class="sheet-tiers">In: ' + tiersWith.join(" · ") + '</div>' : '');
    var close = el("button", "btn-soft", "Close");
    close.addEventListener("click", closeSheet);
    sheet.appendChild(close);
    showSheet(sheet);
  }

  function renderProgress() {
    var c = el("div", "screen");
    c.appendChild(el("div", "eyebrow", "PROGRESS"));
    c.appendChild(el("h2", "scr-h", "Look how you're showing up"));

    var stats = el("div", "stat-row");
    stats.innerHTML =
      stat(state.streak, "day streak") +
      stat(state.totalSessions, "sessions") +
      stat(state.totalMinutes, "minutes");
    c.appendChild(stats);

    // training week + interval growth
    var vb = volBonus();
    var wk = el("div", "weekbar");
    wk.innerHTML =
      '<div class="weekbar-l"><span class="weekbar-n">Training week ' + (state.week || 1) + '</span>' +
      '<span class="weekbar-s">' + (vb.work > 0 ? "work intervals +" + vb.work + "s longer" : "building your base") + '</span></div>' +
      '<div class="weekbar-track">' + weekPips(state.week || 1) + '</div>';
    c.appendChild(wk);

    // last 14 days
    c.appendChild(el("div", "mini-h", "Last 14 days"));
    var dots = el("div", "dot-row");
    var set = {}; state.history.forEach(function (h) { set[h.date] = true; });
    for (var i = 13; i >= 0; i--) {
      var d = new Date(); d.setDate(d.getDate() - i);
      var key = ymd(d);
      var dot = el("div", "day-dot" + (set[key] ? " on" : ""));
      dot.title = key;
      dots.appendChild(dot);
    }
    c.appendChild(dots);

    // best
    c.appendChild(el("p", "best-line", state.best > 0
      ? "Longest streak so far: " + state.best + " day" + (state.best === 1 ? "" : "s") + ". Rest days are part of getting stronger too."
      : "Your first session is the whole goal today."));

    // your levels — current rung per ladder, with inline level-up
    c.appendChild(el("div", "mini-h", "Your levels"));
    var levWrap = el("div", "levels");
    Object.keys(LADDERS).forEach(function (id) {
      var L = LADDERS[id], rung = ladderRung(id);
      var earned = (state.levels[id] || 0) < L.length - 1 && (state.xp[id] || 0) >= 4 * ((state.levels[id] || 0) + 1);
      var row = el("div", "lev-row" + (earned ? " ready" : ""));
      row.innerHTML =
        '<div class="lev-main"><div class="lev-title">' + LADDER_TITLES[id] + '</div>' +
        '<div class="lev-now">' + EX[L[rung]].name + '</div></div>' +
        '<div class="lev-dots">' + rungDots(L.length, rung) + '</div>';
      if (earned) {
        var up = el("button", "lev-up", "Level up ›");
        up.addEventListener("click", function () { levelUp(id); renderProgress(); });
        row.appendChild(up);
      }
      levWrap.appendChild(row);
    });
    c.appendChild(levWrap);

    // strength milestones
    c.appendChild(el("div", "mini-h", "Strength milestones"));
    var mg = el("div", "mile-grid");
    MILESTONES.forEach(function (m) {
      var got = !!state.milestones[m.id];
      var card = el("div", "mile-card" + (got ? " got" : ""));
      card.innerHTML = '<div class="mile-ic">' + (got ? "✦" : "○") + '</div>' +
        '<div class="mile-tx"><div class="mile-n">' + m.name + '</div>' +
        '<div class="mile-d">' + m.desc + '</div></div>';
      mg.appendChild(card);
    });
    c.appendChild(mg);

    // recent
    if (state.history.length) {
      c.appendChild(el("div", "mini-h", "Recent sessions"));
      var list = el("div", "hist");
      state.history.slice(-8).reverse().forEach(function (h) {
        var row = el("div", "hist-row");
        row.innerHTML = '<span class="hist-d">' + prettyDate(h.date) + '</span>' +
          '<span class="hist-t">' + (TIERS[h.tier] ? TIERS[h.tier].label : h.tier) + '</span>' +
          '<span class="hist-m">' + h.minutes + ' min</span>';
        list.appendChild(row);
      });
      c.appendChild(list);
    }
    setScreen(c);
  }
  function stat(n, lbl) { return '<div class="stat"><div class="stat-n">' + n + '</div><div class="stat-l">' + lbl + '</div></div>'; }
  function weekPips(n) {
    var s = "";
    for (var i = 1; i <= 8; i++) s += '<span class="wpip' + (i <= n ? " on" : "") + '"></span>';
    return s;
  }
  function rungDots(total, rung) {
    var s = "";
    for (var i = 0; i < total; i++) s += '<span class="rdot' + (i <= rung ? " on" : "") + '"></span>';
    return s;
  }
  function prettyDate(s) {
    var p = s.split("-").map(Number);
    var d = new Date(p[0], p[1] - 1, p[2]);
    return d.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" });
  }

  function selectTier(tk) {
    state.tier = tk; save(); renderAbout();
  }

  function renderAbout() {
    var c = el("div", "screen");
    c.appendChild(el("div", "eyebrow", "YOUR SESSION"));
    c.appendChild(el("h2", "scr-h", "Set it up your way"));

    // tier cards
    c.appendChild(el("div", "mini-h", "Style"));
    var tg = el("div", "tier-group");
    TIER_ORDER.forEach(function (tk) {
      var t = TIERS[tk];
      var b = el("button", "tier-card" + (state.tier === tk ? " sel" : ""));
      b.innerHTML = '<div class="tier-top"><span class="tier-name">' + t.label + '</span>' +
        '<span class="tier-tag">' + t.tag + '</span></div>' +
        '<div class="tier-blurb">' + t.blurb + '</div>';
      b.addEventListener("click", function () { selectTier(tk); });
      tg.appendChild(b);
    });
    c.appendChild(tg);

    // duration
    c.appendChild(el("div", "mini-h", "Length"));
    var dur = el("div", "seg");
    [[5, "Quick 5"], [15, "15 min"], [20, "20 min"]].forEach(function (pair) {
      var m = pair[0];
      var b = el("button", "seg-btn" + (state.minutes === m ? " sel" : ""), pair[1]);
      b.addEventListener("click", function () { state.minutes = m; save(); renderAbout(); });
      dur.appendChild(b);
    });
    c.appendChild(dur);
    c.appendChild(el("p", "seg-note", "Short on time or running on no sleep? Quick 5 still counts and keeps your streak."));

    // voice + name
    c.appendChild(el("div", "mini-h", "Coaching"));
    var voiceRow = el("div", "row-between");
    voiceRow.innerHTML = '<span>Spoken cues</span>';
    var vt = el("button", "toggle" + (state.voice ? " on" : ""));
    vt.setAttribute("aria-label", "Toggle spoken cues");
    vt.innerHTML = '<span class="knob"></span>';
    vt.addEventListener("click", function () {
      state.voice = !state.voice; save();
      vt.className = "toggle" + (state.voice ? " on" : "");
      if (state.voice) voice("cues_on", "Spoken cues on.");
    });
    voiceRow.appendChild(vt);
    c.appendChild(voiceRow);

    // voice UI: recorded premium clips take priority; otherwise the live device picker
    if (hasAudio()) {
      var recWrap = el("div", "field voice-field");
      recWrap.style.display = state.voice ? "block" : "none";
      recWrap.innerHTML = '<label>Voice</label>';
      var recRow = el("div", "voice-row");
      var recNote = el("div", "rec-note");
      recNote.innerHTML = '<b>Recorded voice</b> \u2014 warm and natural, and it sounds the same on every phone.';
      var prev2 = el("button", "voice-prev", "\u25b6");
      prev2.setAttribute("aria-label", "Preview voice");
      prev2.addEventListener("click", function () { voice("preview", "Nice and steady. Let's get a little stronger today."); });
      recRow.appendChild(recNote); recRow.appendChild(prev2);
      recWrap.appendChild(recRow);
      c.appendChild(recWrap);
      vt.addEventListener("click", function () { recWrap.style.display = state.voice ? "block" : "none"; });
    } else if (canSpeak) {
      var voiceWrap = el("div", "field voice-field");
      voiceWrap.style.display = state.voice ? "block" : "none";
      voiceWrap.innerHTML = '<label>Voice</label>';
      var list = englishVoices();
      if (list.length) {
        var row = el("div", "voice-row");
        var sel = el("select", "voice-sel");
        list.forEach(function (v) {
          var opt = document.createElement("option");
          opt.value = v.voiceURI;
          opt.textContent = prettyVoiceName(v);
          if (chosenVoice && v.voiceURI === chosenVoice.voiceURI) opt.selected = true;
          sel.appendChild(opt);
        });
        sel.addEventListener("change", function () {
          state.voiceURI = sel.value; save(); pickVoice();
          say("Hi — this is how I'll sound.");
        });
        var prev = el("button", "voice-prev", "▶");
        prev.setAttribute("aria-label", "Preview voice");
        prev.addEventListener("click", function () { voice("preview", "Nice and steady. Let's get a little stronger today."); });
        row.appendChild(sel); row.appendChild(prev);
        voiceWrap.appendChild(row);
      }
      if (!hasEnhancedVoice()) {
        var tip = el("div", "voice-tip");
        tip.innerHTML = isIOS()
          ? "Want a warmer, more natural voice? On your iPhone, open <b>Settings → Accessibility → Spoken Content → Voices → English</b> and download one of the <b>Enhanced</b> or <b>Premium</b> voices (Ava, Samantha, or Zoe are lovely). It'll show up here automatically."
          : "For a more natural voice, install a higher-quality English voice in your device or browser's speech settings — it'll appear in this list automatically.";
        voiceWrap.appendChild(tip);
      }
      c.appendChild(voiceWrap);
      // keep the picker in sync when the toggle flips
      vt.addEventListener("click", function () { voiceWrap.style.display = state.voice ? "block" : "none"; });

      // voice diagnostics — shows exactly what this device exposes to the app
      var diag = el("div", "diag");
      var dhead = el("button", "diag-head", '<span>Voice details</span><span class="chev">\u203a</span>');
      var dbody = el("div", "diag-body");
      dbody.style.display = "none";
      function fillDiag() {
        dbody.innerHTML = "";
        refreshVoices();
        var standalone = (window.matchMedia && window.matchMedia("(display-mode: standalone)").matches) || navigator.standalone === true;
        var eng = englishVoices();
        var sum = el("div", "diag-sum");
        [
          ["Running as", standalone ? "Installed app (home screen)" : "Browser tab"],
          ["Speech supported", canSpeak ? "yes" : "no"],
          ["Now using", chosenVoice ? prettyVoiceName(chosenVoice).replace(/ \u2726$/, "") + " (" + chosenVoice.lang + ")" : "system default"],
          ["Voices found", VOICES.length + " total \u00b7 " + eng.length + " English"]
        ].forEach(function (p) {
          var r = el("div", "diag-row");
          var k = el("span", "diag-k"); k.textContent = p[0];
          var v = el("span", "diag-v"); v.textContent = p[1];
          r.appendChild(k); r.appendChild(v); sum.appendChild(r);
        });
        dbody.appendChild(sum);
        if (eng.length) {
          var lh = el("div", "diag-lh"); lh.textContent = "English voices this device exposes";
          dbody.appendChild(lh);
          var list = el("div", "diag-list");
          eng.forEach(function (v) {
            var enh = /enhanced|premium|natural|neural/i.test((v.name || "") + " " + (v.voiceURI || ""));
            var it = el("div", "diag-item" + (chosenVoice && v.voiceURI === chosenVoice.voiceURI ? " on" : ""));
            var nm = el("span", "diag-nm"); nm.textContent = v.name + " \u00b7 " + v.lang;
            var fl = el("span", "diag-fl");
            fl.textContent = (v.localService ? "offline" : "online") + (enh ? " \u00b7 enhanced" : "");
            it.appendChild(nm); it.appendChild(fl); list.appendChild(it);
          });
          dbody.appendChild(list);
        }
        var re = el("button", "btn-soft", "Re-check voices");
        re.addEventListener("click", fillDiag);
        dbody.appendChild(re);
      }
      dhead.addEventListener("click", function () {
        var open = dbody.style.display === "none";
        dbody.style.display = open ? "block" : "none";
        dhead.classList.toggle("open", open);
        if (open) fillDiag();
      });
      diag.appendChild(dhead); diag.appendChild(dbody);
      c.appendChild(diag);
    }

    var nameWrap = el("div", "field");
    nameWrap.innerHTML = '<label>Name on your home screen (optional)</label>';
    var inp = el("input", "text-in");
    inp.type = "text"; inp.value = state.name; inp.placeholder = "e.g. your first name";
    inp.maxLength = 24;
    inp.addEventListener("input", function () { state.name = inp.value.trim(); save(); });
    nameWrap.appendChild(inp);
    c.appendChild(nameWrap);

    // safety
    c.appendChild(safetyBlock());

    // reset
    var reset = el("button", "link-danger", "Reset all data");
    reset.addEventListener("click", function () {
      if (confirm("Clear your streak, history and settings?")) {
        state = clone(DEFAULT); state.seenIntro = true; save(); go("today");
      }
    });
    c.appendChild(reset);

    c.appendChild(el("div", "footer-note", "BLOOM keeps everything on this device. Nothing is sent anywhere."));
    setScreen(c);
  }

  function safetyBlock() {
    var wrap = el("div", "safety");
    var head = el("button", "safety-head", '<span>A note on training hard</span><span class="chev">›</span>');
    var body = el("div", "safety-body");
    body.innerHTML =
      '<p>Warm up before you go all-out, and stop if you feel sharp pain, dizziness, or anything that feels wrong — push hard, but push smart.</p>' +
      '<p>Keep water close and eat enough. This is about getting <b>stronger</b>, not eating less — under-fueling will tank your energy and your recovery.</p>' +
      '<p>Some days a Quick 5 is the right call instead of skipping entirely. That still counts.</p>';
    body.style.display = "none";
    head.addEventListener("click", function () {
      var open = body.style.display === "none";
      body.style.display = open ? "block" : "none";
      head.classList.toggle("open", open);
    });
    wrap.appendChild(head); wrap.appendChild(body);
    return wrap;
  }

  /* ======================= SESSION PLAYER ======================= */
  var session = null;

  function startSession() {
    var steps = buildSession(state.tier, state.minutes);
    session = { steps: steps, idx: -1, timer: null, remaining: 0, paused: false, half: false, holdMax: 0 };
    // wake voice engine on user gesture
    if (state.voice && canSpeak) { try { window.speechSynthesis.resume(); } catch (e) {} }
    if (state.voice) unlockAudio();   // iOS: prime the audio element inside the tap so cues can play later
    openPlayer();
    nextStep();
  }

  function openPlayer() {
    var p = el("div", "player");
    p.id = "player";
    p.innerHTML =
      '<div class="player-top">' +
      '<button class="p-quit" aria-label="End session">✕</button>' +
      '<div class="p-phase" id="pPhase"></div>' +
      '<button class="p-mute" id="pMute" aria-label="Toggle sound">' + (state.voice ? soundOn() : soundOff()) + '</button>' +
      '</div>' +
      '<div class="p-stage" id="pStage"></div>' +
      '<div class="p-controls">' +
      '<button class="p-skip back" id="pBack" aria-label="Previous">‹</button>' +
      '<button class="p-pause" id="pPause">Pause</button>' +
      '<button class="p-skip" id="pNext" aria-label="Skip">›</button>' +
      '</div>';
    document.body.appendChild(p);
    requestAnimationFrame(function () { p.classList.add("in"); });
    $("#player .p-quit").addEventListener("click", quitSession);
    $("#pPause").addEventListener("click", togglePause);
    $("#pNext").addEventListener("click", function () { advance(1); });
    $("#pBack").addEventListener("click", function () { advance(-1); });
    $("#pMute").addEventListener("click", function () {
      state.voice = !state.voice; save();
      $("#pMute").innerHTML = state.voice ? soundOn() : soundOff();
      if (!state.voice) stopSpeak();
    });
  }
  function soundOn() { return '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 9v6h4l5 4V5L8 9H4z"/><path d="M16 8a5 5 0 0 1 0 8"/></svg>'; }
  function soundOff() { return '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 9v6h4l5 4V5L8 9H4z"/><path d="M22 9l-6 6M16 9l6 6"/></svg>'; }

  function clearTimer() { if (session && session.timer) { clearInterval(session.timer); session.timer = null; } }

  function nextStep() { advance(1, true); }

  function advance(dir, first) {
    if (!session) return;
    clearTimer(); stopSpeak();
    var i = session.idx;
    // move to next non-phase index in the given direction
    do { i += dir; } while (session.steps[i] && session.steps[i].kind === "phase");
    if (i < 0) i = 0;
    if (i >= session.steps.length) { return finishSession(); }
    session.idx = i;
    var step = session.steps[i];
    if (step.kind === "done") return finishSession();
    renderStep(step);
  }

  function currentPhaseLabel(idx) {
    for (var i = idx; i >= 0; i--) if (session.steps[i].kind === "phase") return session.steps[i].label;
    return "";
  }
  function stepNumberInfo(idx) {
    var works = 0, pos = 0;
    for (var i = 0; i < session.steps.length; i++) {
      if (session.steps[i].kind === "work") { works++; if (i <= idx) pos = works; }
    }
    return pos + " / " + works;
  }

  function renderStep(step) {
    var stage = $("#pStage");
    var phase = currentPhaseLabel(session.idx);
    $("#pPhase").textContent = phase + "  ·  " + stepNumberInfo(session.idx);
    session.half = false;

    if (step.kind === "rest") {
      stage.innerHTML =
        '<div class="rest-wrap">' +
        ringSVG() +
        '<div class="ring-center"><div class="rest-word">Rest</div>' +
        '<div class="count" id="pCount">' + step.seconds + '</div></div>' +
        '<div class="next-up">Next: <b>' + step.next + '</b></div>' +
        '</div>';
      voice("rest", "Rest. Next, " + step.next);
      runTimer(step.seconds, function () { advance(1); });
    } else {
      var sideTag = step.perSide ? '<span class="side-tag">both sides</span>' : '';
      stage.innerHTML =
        '<div class="work-wrap">' +
        '<div class="work-demo">' + demoImg(step.demo) + '</div>' +
        '<div class="ring-line">' + ringSVG() +
        '<div class="ring-center"><div class="count" id="pCount">' + step.seconds + '</div>' +
        '<div class="count-lbl">' + (step.hold ? "hold" : "seconds") + '</div></div></div>' +
        '<h2 class="work-name">' + step.name + ' ' + sideTag + '</h2>' +
        '<p class="work-cue">' + step.cue + '</p>' +
        '</div>';
      voice("ex_" + step.exId, step.name + ". " + step.cue);
      runTimer(step.seconds, function () { advance(1); }, step);
    }
  }

  function ringSVG() {
    // r=52, circumference ~326.7
    return '<svg class="ring" viewBox="0 0 120 120">' +
      '<circle class="ring-bg" cx="60" cy="60" r="52"/>' +
      '<circle class="ring-fg" id="pRing" cx="60" cy="60" r="52" ' +
      'stroke-dasharray="326.7" stroke-dashoffset="0" transform="rotate(-90 60 60)"/>' +
      '</svg>';
  }

  function runTimer(total, onDone, step) {
    session.remaining = total;
    var ring = $("#pRing"), count = $("#pCount");
    var C = 326.7;
    function paint() {
      if (count) count.textContent = session.remaining;
      if (ring) ring.setAttribute("stroke-dashoffset", (C * (1 - session.remaining / total)).toFixed(1));
    }
    paint();
    session.timer = setInterval(function () {
      if (session.paused) return;
      session.remaining--;
      // mid-point side switch cue
      if (step && step.perSide && !session.half && session.remaining === Math.floor(total / 2)) {
        session.half = true; voice("switch", "Switch sides"); flashHint("Switch sides");
      }
      if (session.remaining <= 3 && session.remaining > 0) tick();
      paint();
      if (session.remaining <= 0) {
        clearTimer();
        if (step && step.hold) session.holdMax = Math.max(session.holdMax || 0, total);
        onDone();
      }
    }, 1000);
  }
  function tick() { /* subtle haptic if available */ if (navigator.vibrate) try { navigator.vibrate(8); } catch (e) {} }

  function flashHint(txt) {
    var f = el("div", "flash", txt);
    var stage = $("#pStage"); if (!stage) return;
    stage.appendChild(f);
    setTimeout(function () { f.classList.add("show"); }, 10);
    setTimeout(function () { f.classList.remove("show"); setTimeout(function () { f.remove(); }, 300); }, 1400);
  }

  function togglePause() {
    if (!session) return;
    session.paused = !session.paused;
    $("#pPause").textContent = session.paused ? "Resume" : "Pause";
    document.getElementById("player").classList.toggle("paused", session.paused);
    if (session.paused) stopSpeak();
  }

  function quitSession() {
    if (!session) return;
    if (!confirm("End this session? Your streak only updates when you finish.")) return;
    teardownPlayer();
  }
  function teardownPlayer() {
    clearTimer(); stopSpeak();
    var p = document.getElementById("player");
    if (p) { p.classList.remove("in"); setTimeout(function () { if (p.parentNode) p.remove(); }, 320); }
    session = null;
  }

  function finishSession() {
    clearTimer(); stopSpeak();
    var sum = recordCompletion();
    voice("finish", "Beautiful. You got stronger today.");
    if (navigator.vibrate) try { navigator.vibrate([10, 60, 10]); } catch (e) {}
    var stage = $("#pStage");
    if (stage) {
      $("#pPhase").textContent = "Complete";

      var mileHTML = "";
      if (sum.gained && sum.gained.length) {
        mileHTML = '<div class="done-mile">' +
          sum.gained.map(function (m) {
            return '<div class="mile-pop"><span class="mile-star">✦</span> New milestone: <b>' + m.name + '</b></div>';
          }).join("") + '</div>';
      }
      var ready = sum.ready || [];
      var levelHTML = ready.length
        ? '<div class="done-level">You\'ve earned a harder version of ' +
            (ready.length === 1 ? "<b>" + ready[0].toName + "</b>" : ready.length + " moves") +
            '. Step it up whenever you\'re ready.</div>'
        : "";

      stage.innerHTML =
        '<div class="done-wrap">' +
        '<div class="bloom-open">' + bloomSVG() + '</div>' +
        '<h1 class="done-h">Stronger than yesterday.</h1>' +
        '<p class="done-sub">' + doneLine() + '</p>' +
        mileHTML + levelHTML +
        '<div class="done-stats">' +
        '<div><b>' + state.streak + '</b><span>day streak</span></div>' +
        '<div><b>wk ' + (state.week || 1) + '</b><span>training</span></div>' +
        '<div><b>' + state.totalSessions + '</b><span>sessions</span></div>' +
        '</div>' +
        '<div class="done-hydrate">💧 Grab some water and a real snack — fuel keeps your strength and your supply up.</div>' +
        '</div>';

      var controls = document.querySelector("#player .p-controls");
      if (controls) {
        controls.innerHTML = "";
        if (ready.length) {
          var lvl = el("button", "btn-soft wide", "Level up a move ›");
          lvl.addEventListener("click", function () { teardownPlayer(); go("progress"); });
          controls.appendChild(lvl);
        }
        var d = el("button", "btn-primary big", "Done");
        d.addEventListener("click", function () { teardownPlayer(); go("today"); });
        controls.appendChild(d);
      }
    }
  }
  function doneLine() {
    var lines = [
      "Showing up on a hard day is the whole thing. Well done.",
      "Strength is built one ordinary session at a time.",
      "That's a deposit in the strong-mom bank. Nice work.",
      "Consistency over intensity — you're doing it exactly right."
    ];
    return lines[state.totalSessions % lines.length];
  }

  function recordCompletion() {
    var today = ymd();
    // streak
    if (state.lastDate === today) {
      // already counted today's streak; still log the extra session
    } else {
      if (state.lastDate && daysBetween(state.lastDate, today) === 1) state.streak += 1;
      else state.streak = 1;
      state.lastDate = today;
    }
    if (state.streak > state.best) state.best = state.streak;

    // totals
    state.totalSessions += 1;
    state.totalMinutes += state.minutes;

    // per-tier count (drives the step-up nudge)
    state.tierCounts[state.tier] = (state.tierCounts[state.tier] || 0) + 1;

    // ladder XP — credit every laddered move in this tier's pool
    var seen = {};
    TIERS[state.tier].pool.forEach(function (id) {
      if (LADDERS[id] && !seen[id]) { seen[id] = true; state.xp[id] = (state.xp[id] || 0) + 1; }
    });

    // training-week progression: 3 sessions in a calendar week bumps the week
    var wk = weekKeyOf(today);
    if (state.weekKey !== wk) { state.weekKey = wk; state.weekCount = 0; state.weekBumped = false; }
    state.weekCount += 1;
    if (!state.weekBumped && state.weekCount >= 3 && (state.week || 1) < 8) {
      state.week = (state.week || 1) + 1; state.weekBumped = true;
    }

    // personal records
    if (session && session.holdMax > (state.pr.longestHold || 0)) state.pr.longestHold = session.holdMax;
    if (state.minutes > (state.pr.longestSession || 0)) state.pr.longestSession = state.minutes;

    // history
    state.history.push({ date: today, tier: state.tier, minutes: state.minutes });
    if (state.history.length > 90) state.history = state.history.slice(-90);
    save();

    return { gained: evaluateMilestones(), ready: ladderReady() };
  }

  function bloomSVG() {
    var s = '<svg viewBox="0 0 200 200" width="150" height="150">';
    var cx = 100, cy = 100;
    for (var ring = 0; ring < 2; ring++) {
      var petals = 6, rot = ring === 0 ? 0 : 30, len = ring === 0 ? 58 : 50;
      var op = ring === 0 ? 0.55 : 1;
      for (var i = 0; i < petals; i++) {
        var ang = rot + i * (360 / petals);
        s += '<g class="petal-pop" style="animation-delay:' + (ring * 60 + i * 50) + 'ms">' +
          '<ellipse cx="' + cx + '" cy="' + (cy - len * 0.5) + '" rx="13" ry="' + (len * 0.5) + '" ' +
          'fill="var(--rose)" opacity="' + op + '" transform="rotate(' + ang + ' ' + cx + ' ' + cy + ')"/></g>';
      }
    }
    s += '<circle cx="100" cy="100" r="16" fill="var(--honey)"/><circle cx="100" cy="100" r="9" fill="#f5d696"/>';
    return s + '</svg>';
  }

  /* ======================= NAV ======================= */
  function setScreen(node) {
    app.innerHTML = "";
    node.classList.add("enter");
    app.appendChild(node);
    requestAnimationFrame(function () { node.classList.add("in"); });
  }
  function go(tab) {
    currentTab = tab;
    $$(".tabbar .tab").forEach(function (t) {
      t.classList.toggle("active", t.getAttribute("data-tab") === tab);
    });
    if (tab === "today") renderToday();
    else if (tab === "moves") renderMoves();
    else if (tab === "progress") renderProgress();
    else renderAbout();
    window.scrollTo(0, 0);
  }

  /* ======================= SHEETS ======================= */
  function showSheet(node) {
    var ov = el("div", "overlay"); ov.id = "overlay";
    ov.appendChild(node);
    document.body.appendChild(ov);
    requestAnimationFrame(function () { ov.classList.add("in"); });
    ov.addEventListener("click", function (e) { if (e.target === ov) closeSheet(); });
  }
  function closeSheet() {
    var ov = document.getElementById("overlay");
    if (ov) { ov.classList.remove("in"); setTimeout(function () { if (ov.parentNode) ov.remove(); }, 300); }
  }

  /* ======================= INTRO ======================= */
  function showIntro() {
    var ov = el("div", "intro");
    ov.id = "intro";
    ov.innerHTML =
      '<div class="intro-card">' +
      '<div class="intro-bloom">' + bloomSVG() + '</div>' +
      '<h1 class="intro-h">Welcome to BLOOM</h1>' +
      '<p class="intro-p">Real bodyweight strength and HIIT, no equipment, no gym, no wasted time. Squeeze in a full session or a Quick 5 whenever you\'ve got a window — it still counts, and it climbs with you as you get stronger.</p>' +
      '<div class="intro-note">Warm up first, push hard, and stop if anything feels wrong. Otherwise — go all-out.</div>' +
      '</div>';
    var b = el("button", "btn-primary big", "Let's begin");
    b.addEventListener("click", function () {
      state.seenIntro = true; save();
      ov.classList.remove("in");
      setTimeout(function () { if (ov.parentNode) ov.remove(); }, 350);
    });
    $(".intro-card", ov).appendChild(b);
    document.body.appendChild(ov);
    requestAnimationFrame(function () { ov.classList.add("in"); });
  }

  /* ======================= PWA WIRING ======================= */
  function setupPWA() {
    var dataURI = "data:image/png;base64," + ICON_B64;
    // apple touch icon (iOS Add to Home Screen)
    var at = document.createElement("link");
    at.rel = "apple-touch-icon"; at.href = dataURI;
    document.head.appendChild(at);
    var fav = document.createElement("link");
    fav.rel = "icon"; fav.href = dataURI;
    document.head.appendChild(fav);
    // manifest (Android / Chrome)
    try {
      var manifest = {
        name: "BLOOM", short_name: "BLOOM",
        start_url: ".", scope: ".", display: "standalone",
        background_color: "#FBF3EC", theme_color: "#FBF3EC",
        icons: [
          { src: dataURI, sizes: "192x192", type: "image/png", purpose: "any" },
          { src: dataURI, sizes: "512x512", type: "image/png", purpose: "any maskable" }
        ]
      };
      var blob = new Blob([JSON.stringify(manifest)], { type: "application/manifest+json" });
      var mlink = document.createElement("link");
      mlink.rel = "manifest"; mlink.href = URL.createObjectURL(blob);
      document.head.appendChild(mlink);
    } catch (e) {}
    // service worker (only over http/https)
    if ("serviceWorker" in navigator && location.protocol.indexOf("http") === 0) {
      navigator.serviceWorker.register("./sw.js").catch(function () {});
    }
  }

  /* ======================= SPLASH + BOOT ======================= */
  function boot() {
    setupPWA();
    // build tabbar
    var tabs = [
      ["today", "Today", iToday()],
      ["moves", "Moves", iMoves()],
      ["progress", "Progress", iProgress()],
      ["about", "Session", iAbout()]
    ];
    var bar = $(".tabbar");
    tabs.forEach(function (t) {
      var b = el("button", "tab", '<span class="tab-i">' + t[2] + '</span><span class="tab-l">' + t[1] + '</span>');
      b.setAttribute("data-tab", t[0]);
      b.addEventListener("click", function () { go(t[0]); });
      bar.appendChild(b);
    });

    go("today");
    var splash = document.getElementById("splash");
    setTimeout(function () { splash.classList.add("gone"); }, 1500);
    setTimeout(function () { if (splash.parentNode) splash.remove(); if (!state.seenIntro) showIntro(); }, 2100);
  }

  function iToday() { return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M12 21c-4-3-7-6-7-10a4 4 0 0 1 7-2 4 4 0 0 1 7 2c0 4-3 7-7 10z"/></svg>'; }
  function iMoves() { return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="6" r="2.4"/><path d="M12 9v6M12 12l-5 3M12 12l5 3M9 21l3-4 3 4"/></svg>'; }
  function iProgress() { return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19V5M4 19h16M8 16v-4M12 16V8M16 16v-7"/></svg>'; }
  function iAbout() { return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M18.4 5.6 17 7M7 17l-1.4 1.4"/></svg>'; }

  if (document.readyState === "loading")
    document.addEventListener("DOMContentLoaded", boot);
  else boot();

  // expose icon for manifest builder in shell
  window.__BLOOM_ICON__ = ICON_B64;
})();
