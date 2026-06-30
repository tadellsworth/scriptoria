/* Lumen — a daily florilegium. Single-file PWA shell.
   Content is loaded at runtime from content.json (service-worker cached), so the
   app shell stays small and content updates independently of the code.
   Pure engine functions (hashSeed, mulberry32, seededShuffle, isoDate, dayIndex,
   bucketOf, composeOffice, streakAfterOpen) are self-contained and extracted by
   test_engine.py — keep them free of outer-scope dependencies. */
(function () {
  'use strict';

  var CONTENT = null;
  var ITEMS = [];

  var APP_NAME      = 'Lumen';               // display name — change in one place
  var STORE_KEY     = 'lumen.v1.state';      // stable; do not rename across updates
  var SYNC_NS       = 'lumen';
  var DAILY_PORTION = 25;
  var FIREBASE = 'https://languageapps-da8a8-default-rtdb.firebaseio.com';

  // Composition of a day's office (target counts per bucket; scripture buckets
  // are psalm/gospel/wisdom/epistle). Counts clamp to what's available and any
  // deficit flows to the largest pools, so the office is scripture-forward now
  // and diversifies automatically as the Fathers/saints pools grow.
  var DEFAULT_WEIGHTS = { psalm: 4, gospel: 5, wisdom: 3, epistle: 3,
                          meditation: 4, catechism: 2, saint: 1, father: 1,
                          prayer: 1, summa: 1 };

  /* ===================== pure engine (extractable) ===================== */

  function hashSeed(str) {
    var h = 2166136261 >>> 0;                 // FNV-1a 32-bit
    for (var i = 0; i < str.length; i++) {
      h ^= str.charCodeAt(i);
      h = Math.imul(h, 16777619) >>> 0;
    }
    return h >>> 0;
  }

  function mulberry32(a) {
    return function () {
      a |= 0; a = (a + 0x6D2B79F5) | 0;
      var t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function seededShuffle(arr, seed) {
    var a = arr.slice();
    var rnd = mulberry32(seed >>> 0);
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(rnd() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }

  function isoDate(d) {
    var y = d.getFullYear();
    var m = String(d.getMonth() + 1).padStart(2, '0');
    var day = String(d.getDate()).padStart(2, '0');
    return y + '-' + m + '-' + day;
  }

  // whole days since a fixed epoch, in UTC so it never drifts with timezones
  function dayIndex(iso) {
    var EPOCH = Date.parse('2025-01-01T00:00:00Z');
    return Math.round((Date.parse(iso + 'T00:00:00Z') - EPOCH) / 86400000);
  }

  /* ===================== liturgical calendar (pure, traditional cal.) =====================
     Deterministic, offline, no data files. Computes the season, the liturgical
     colour, and a human label for any date. Leans on the traditional (pre-1970)
     Roman calendar — Septuagesima, Passiontide, Time after Pentecost, Christ the
     King on the last Sunday of October — to match Lumen's sources. */
  var DAY = 86400000;
  function ymd(y, m, d) { return Date.UTC(y, m - 1, d); }        // m is 1-based
  function dow(ts) { return new Date(ts).getUTCDay(); }          // 0 = Sunday
  function sundayOnOrBefore(ts) { return ts - dow(ts) * DAY; }
  var WEEKDAY = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  var ORD = ['', 'First', 'Second', 'Third', 'Fourth', 'Fifth', 'Sixth', 'Seventh',
             'Eighth', 'Ninth', 'Tenth', 'Eleventh', 'Twelfth', 'Thirteenth',
             'Fourteenth', 'Fifteenth', 'Sixteenth', 'Seventeenth', 'Eighteenth',
             'Nineteenth', 'Twentieth', 'Twenty-first', 'Twenty-second',
             'Twenty-third', 'Twenty-fourth', 'Twenty-fifth', 'Twenty-sixth',
             'Twenty-seventh'];

  // Gregorian Easter (Anonymous/Meeus algorithm) -> UTC timestamp of Easter Sunday
  function computusEaster(year) {
    var a = year % 19, b = Math.floor(year / 100), c = year % 100,
        d = Math.floor(b / 4), e = b % 4, f = Math.floor((b + 8) / 25),
        g = Math.floor((b - f + 1) / 3),
        h = (19 * a + b - d - g + 15) % 30,
        i = Math.floor(c / 4), k = c % 4,
        l = (32 + 2 * e + 2 * i - h - k) % 7,
        m = Math.floor((a + 11 * h + 22 * l) / 451),
        month = Math.floor((h + l - 7 * m + 114) / 31),
        day = ((h + l - 7 * m + 114) % 31) + 1;
    return ymd(year, month, day);
  }

  function firstAdvent(year) {                    // 4th Sunday before Christmas
    return sundayOnOrBefore(ymd(year, 12, 24)) - 21 * DAY;
  }
  function lastSundayOfOctober(year) {
    return sundayOnOrBefore(ymd(year, 10, 31));
  }

  // Fixed feasts that override the season label/colour (a curated principal set).
  var FIXED_FEASTS = {
    '01-01': ['The Octave of the Nativity', 'white'],
    '01-06': ['The Epiphany of the Lord', 'white'],
    '02-02': ['The Purification of Our Lady (Candlemas)', 'white'],
    '03-19': ['Saint Joseph', 'white'],
    '03-25': ['The Annunciation of Our Lady', 'white'],
    '06-24': ['The Nativity of St John the Baptist', 'white'],
    '06-29': ['Saints Peter and Paul', 'red'],
    '08-06': ['The Transfiguration of the Lord', 'white'],
    '08-15': ['The Assumption of Our Lady', 'white'],
    '09-14': ['The Exaltation of the Holy Cross', 'red'],
    '09-29': ['Saint Michael and All Angels', 'white'],
    '11-01': ['All Saints', 'white'],
    '11-02': ['All Souls', 'black'],
    '12-08': ['The Immaculate Conception', 'white'],
    '12-25': ['The Nativity of the Lord', 'white']
  };

  function pad2(n) { return (n < 10 ? '0' : '') + n; }

  /* liturgicalDay(date) -> { key, season, color, rose, label, sunday(bool), mmdd }
     key is a coarse season id used for office weighting. */
  function liturgicalDay(date) {
    var y = date.getFullYear(), mo = date.getMonth() + 1, da = date.getDate();
    var today = ymd(y, mo, da), wd = dow(today), mmdd = pad2(mo) + '-' + pad2(da);
    var sunCtrl = sundayOnOrBefore(today);

    var easter = computusEaster(y);
    var ashWed = easter - 46 * DAY, septua = easter - 63 * DAY,
        lent1 = easter - 42 * DAY, passionSun = easter - 14 * DAY,
        palmSun = easter - 7 * DAY, holyThu = easter - 3 * DAY,
        goodFri = easter - 2 * DAY, holySat = easter - 1 * DAY,
        ascension = easter + 39 * DAY, pentecost = easter + 49 * DAY,
        trinity = easter + 56 * DAY, corpus = easter + 60 * DAY,
        sacredHeart = easter + 68 * DAY,
        christKing = lastSundayOfOctober(y),
        adventY = firstAdvent(y), christmas = ymd(y, 12, 25),
        epiphany = ymd(y, 1, 6);

    function nameForSunday(season) {
      switch (season) {
        case 'advent':  return ORD[Math.round((sunCtrl - adventY) / (7 * DAY)) + 1] + ' Sunday of Advent';
        case 'epiph':   return ORD[Math.round((sunCtrl - sundayOnOrBefore(epiphany) - 7 * DAY) / (7 * DAY)) + 1] + ' Sunday after Epiphany';
        case 'lent':    return ORD[Math.round((sunCtrl - lent1) / (7 * DAY)) + 1] + ' Sunday of Lent';
        case 'easter':  return ORD[Math.round((sunCtrl - easter) / (7 * DAY)) + 1] + ' Sunday after Easter';
        case 'afterPent': return ORD[Math.round((sunCtrl - pentecost) / (7 * DAY))] + ' Sunday after Pentecost';
      }
      return '';
    }
    function feria(label) {
      return wd === 0 ? label : WEEKDAY[wd] + ' \u2014 ' + label;
    }

    var out = { mmdd: mmdd, sunday: wd === 0 };

    // explicit day overrides (movable) first
    if (today === easter) return assign(out, 'easter', 'white', 'Easter Sunday');
    if (today === ashWed) return assign(out, 'lent', 'violet', 'Ash Wednesday');
    if (today === palmSun) return assign(out, 'passion', 'red', 'Palm Sunday');
    if (today === holyThu) return assign(out, 'triduum', 'white', 'Maundy Thursday');
    if (today === goodFri) return assign(out, 'triduum', 'black', 'Good Friday');
    if (today === holySat) return assign(out, 'triduum', 'violet', 'Holy Saturday');
    if (today === ascension) return assign(out, 'easter', 'white', 'The Ascension of the Lord');
    if (today === pentecost) return assign(out, 'easter', 'red', 'Pentecost');
    if (today === trinity) return assign(out, 'afterPent', 'white', 'Trinity Sunday');
    if (today === corpus) return assign(out, 'afterPent', 'white', 'Corpus Christi');
    if (today === sacredHeart) return assign(out, 'afterPent', 'white', 'The Sacred Heart');
    if (today === christKing) return assign(out, 'afterPent', 'white', 'Christ the King');
    if (today === passionSun) return assign(out, 'passion', 'violet', 'Passion Sunday');

    // fixed feasts (only when not already a high movable feast)
    if (FIXED_FEASTS[mmdd]) {
      var ff = FIXED_FEASTS[mmdd];
      var fseason = (mmdd >= '12-25' || mmdd <= '01-05') ? 'christmas' : 'sanct';
      return assign(out, fseason, ff[1], ff[0]);
    }

    // seasonal cascade
    if (today >= adventY && today <= ymd(y, 12, 24)) {
      var advN = Math.round((sunCtrl - adventY) / (7 * DAY)) + 1;
      var rose = (wd === 0 && advN === 3);                 // Gaudete
      return assign(out, 'advent', rose ? 'rose' : 'violet',
        wd === 0 ? nameForSunday('advent') : feria('Advent'), rose);
    }
    if ((mo === 12 && da >= 25) || (mo === 1 && da <= 5))
      return assign(out, 'christmas', 'white', feria('Christmastide'));
    if (today > epiphany && today < septua)
      return assign(out, 'epiph', 'green', wd === 0 ? nameForSunday('epiph') : feria('Time after Epiphany'));
    if (today >= septua && today < ashWed) {
      var sN = Math.round((sunCtrl - septua) / (7 * DAY));
      var sName = ['Septuagesima', 'Sexagesima', 'Quinquagesima'][sN] || 'Pre-Lent';
      return assign(out, 'septua', 'violet', wd === 0 ? sName + ' Sunday' : feria('Septuagesima'));
    }
    if (today > ashWed && today < passionSun) {
      var lN = Math.round((sunCtrl - lent1) / (7 * DAY)) + 1;
      var laetare = (wd === 0 && lN === 4);                // Laetare
      return assign(out, 'lent', laetare ? 'rose' : 'violet',
        wd === 0 ? nameForSunday('lent') : feria('Lent'), laetare);
    }
    if (today >= passionSun && today < easter)
      return assign(out, 'passion', 'violet', feria('Passiontide'));
    if (today > easter && today <= pentecost + 6 * DAY)
      return assign(out, 'easter', today > pentecost ? 'red' : 'white',
        wd === 0 ? nameForSunday('easter') : feria('Eastertide'));

    return assign(out, 'afterPent', 'green',
      wd === 0 ? nameForSunday('afterPent') : feria('Time after Pentecost'));
  }
  function assign(o, key, color, label, rose) {
    o.key = key; o.color = color; o.label = label; o.rose = !!rose; return o;
  }

  // Season weight profiles: multiply the base office weights, then renormalise to
  // the daily portion so the office leans with the season (Lent -> penitential,
  // Eastertide -> the Gospel, Advent -> the prophets and the psalms).
  var SEASON_PROFILE = {
    advent:    { wisdom: 1.6, psalm: 1.3, meditation: 1.2, gospel: 0.8, saint: 0.6 },
    christmas: { gospel: 1.5, meditation: 1.2, psalm: 1.1, saint: 0.8 },
    epiph:     {},
    septua:    { meditation: 1.3, catechism: 1.3, psalm: 1.2, gospel: 0.85 },
    lent:      { meditation: 1.5, catechism: 1.4, psalm: 1.4, gospel: 0.7, saint: 0.5 },
    passion:   { meditation: 1.5, psalm: 1.4, catechism: 1.2, gospel: 1.0, saint: 0.4 },
    triduum:   { meditation: 1.6, psalm: 1.5, gospel: 1.1, saint: 0.3, catechism: 1.1 },
    easter:    { gospel: 1.6, epistle: 1.3, psalm: 1.1, meditation: 1.0, saint: 0.9 },
    afterPent: {},
    sanct:     {}
  };
  function seasonWeights(base, key, size) {
    var mult = SEASON_PROFILE[key] || {}, raw = {}, sum = 0, b;
    for (b in base) { raw[b] = base[b] * (mult[b] != null ? mult[b] : 1); sum += raw[b]; }
    if (sum <= 0) return base;
    var out = {}, acc = 0, keys = Object.keys(raw);
    for (var j = 0; j < keys.length; j++) {
      out[keys[j]] = Math.round(raw[keys[j]] * size / sum);
      acc += out[keys[j]];
    }
    // fix rounding drift onto the largest bucket so the office totals `size`
    var big = keys.sort(function (a, c) { return raw[c] - raw[a]; })[0];
    out[big] += size - acc;
    if (out[big] < 0) out[big] = 0;
    return out;
  }

  function bucketOf(item) {
    return item.type === 'scripture' ? (item.genre || 'scripture') : item.type;
  }

  /* Compose one day's office: deterministic per day, balanced by bucket, and
     each bucket walks its own fixed permutation (advancing its quota per day) so
     no card repeats until that whole bucket has been seen. */
  function composeOffice(items, dayIdx, size, weights) {
    var groups = {};
    for (var i = 0; i < items.length; i++) {
      var bk = bucketOf(items[i]);
      (groups[bk] || (groups[bk] = [])).push(items[i]);
    }
    var buckets = Object.keys(groups).sort();
    var perms = {};
    for (var bi = 0; bi < buckets.length; bi++) {
      perms[buckets[bi]] = seededShuffle(groups[buckets[bi]], hashSeed('lumen:' + buckets[bi]));
    }

    var quota = {}, total = 0;
    for (var qi = 0; qi < buckets.length; qi++) {
      var b = buckets[qi];
      quota[b] = Math.min((weights && weights[b]) || 0, perms[b].length);
      total += quota[b];
    }
    // distribute any deficit to the largest pools first (scripture)
    var bySize = buckets.slice().sort(function (a, c) { return perms[c].length - perms[a].length; });
    var guard = 0;
    while (total < size && guard++ < 100000) {
      var advanced = false;
      for (var fi = 0; fi < bySize.length; fi++) {
        var fb = bySize[fi];
        if (quota[fb] < perms[fb].length) { quota[fb]++; total++; advanced = true; if (total >= size) break; }
      }
      if (!advanced) break;
    }

    var slices = {};
    for (var si = 0; si < buckets.length; si++) {
      var sb = buckets[si], q = quota[sb];
      if (!q) continue;
      var p = perms[sb], n = p.length, start = ((dayIdx * q) % n + n) % n, slice = [];
      for (var k = 0; k < q; k++) slice.push(p[(start + k) % n]);
      slices[sb] = slice;
    }

    // round-robin merge in a fixed order so genres are spread, not clustered
    var ORDER = ['psalm', 'gospel', 'father', 'wisdom', 'meditation', 'saint', 'epistle', 'catechism', 'prayer', 'summa'];
    for (var oi = 0; oi < buckets.length; oi++) if (ORDER.indexOf(buckets[oi]) === -1) ORDER.push(buckets[oi]);
    var result = [], pos = {}, anyLeft = true;
    while (result.length < size && anyLeft) {
      anyLeft = false;
      for (var ri = 0; ri < ORDER.length; ri++) {
        var rb = ORDER[ri], sl = slices[rb];
        if (!sl) continue;
        var idx = pos[rb] || 0;
        if (idx < sl.length) { result.push(sl[idx]); pos[rb] = idx + 1; anyLeft = true; if (result.length >= size) break; }
      }
    }
    return result;
  }

  /* Streak: same day = unchanged, consecutive day = +1, any gap = reset to 1. */
  function streakAfterOpen(state, todayISO) {
    var last = state.lastOpenedISO;
    var streak = state.streak || 0;
    if (last !== todayISO) {
      var prev = new Date(todayISO + 'T00:00:00');
      prev.setDate(prev.getDate() - 1);
      streak = (last === isoDate(prev)) ? streak + 1 : 1;
    }
    return { streak: streak, lastOpenedISO: todayISO };
  }

  /* ===================== state ===================== */

  function defaultState() {
    return { v: 1, lastOpenedISO: null, streak: 0, savedIds: [], pin: null };
  }

  function loadState() {
    var s = null;
    try { s = JSON.parse(localStorage.getItem(STORE_KEY)); } catch (e) { s = null; }
    if (!s || typeof s !== 'object') s = defaultState();
    var d = defaultState();
    for (var k in d) if (!(k in s)) s[k] = d[k];          // backfill new fields
    if (!Array.isArray(s.savedIds)) s.savedIds = [];
    return s;
  }

  function persist() { try { localStorage.setItem(STORE_KEY, JSON.stringify(state)); } catch (e) {} }

  var state = (typeof localStorage !== 'undefined') ? loadState() : defaultState();

  /* ===================== view helpers ===================== */

  var TYPE_META = {
    scripture: { label: 'Scripture',      accent: 'gold',    versal: true  },
    catechism: { label: 'Catechism',      accent: 'lapis',   versal: false },
    meditation:{ label: 'Meditation',     accent: 'crimson', versal: false },
    father:    { label: 'Church Fathers', accent: 'crimson', versal: false },
    summa:     { label: 'Aquinas',        accent: 'lapis',   versal: false },
    saint:     { label: 'Saint',          accent: 'gold',    versal: false },
    prayer:    { label: 'Prayer',         accent: 'crimson', versal: true  }
  };
  var GENRE_LABEL = { psalm: 'Psalm', gospel: 'Gospel', wisdom: 'Wisdom', epistle: 'Epistle' };

  function el(tag, cls, txt) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (txt != null) n.textContent = txt;
    return n;
  }

  function svg(markup) {                    // safe: innerHTML set once on a fresh node
    var s = document.createElement('span');
    s.className = 'ic';
    s.setAttribute('aria-hidden', 'true');
    s.innerHTML = markup;
    return s;
  }

  var IC_RIBBON = '<svg viewBox="0 0 24 24" width="20" height="20"><path d="M6 3h12a1 1 0 0 1 1 1v17l-7-4-7 4V4a1 1 0 0 1 1-1z" fill="var(--fill,none)" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/></svg>';
  var IC_FLAME  = '<svg viewBox="0 0 24 24" width="15" height="15"><path d="M12 2c.8 2.7-1 3.9-1 5.8 0 1 .8 1.8 1.7 1.8.5 0 1-.3 1.3-.8 1.6 1.6 2.7 3.4 2.7 6.2a6.4 6.4 0 1 1-12.8 0c0-3.4 2.3-5.2 3.4-7.8.7 1.5 1.6 2.3 1.6 2.3S8.9 6 12 2z" fill="currentColor"/></svg>';
  var IC_BOOK   = '<svg viewBox="0 0 24 24" width="22" height="22"><path d="M4 5a2 2 0 0 1 2-2h5v16H6a2 2 0 0 0-2 1.2V5zm16 0v13.2A2 2 0 0 0 18 17h-5V3h5a2 2 0 0 1 2 2z" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/></svg>';
  var IC_MORE   = '<svg viewBox="0 0 24 24" width="22" height="22"><circle cx="5" cy="12" r="1.6" fill="currentColor"/><circle cx="12" cy="12" r="1.6" fill="currentColor"/><circle cx="19" cy="12" r="1.6" fill="currentColor"/></svg>';
  var CHI_RHO   = '<svg viewBox="0 0 48 48" width="34" height="34" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><line x1="24" y1="7" x2="24" y2="41"/><path d="M24 9 h3 a6.5 6.5 0 0 1 0 13 h-3"/><line x1="13" y1="24" x2="35" y2="41"/><line x1="35" y1="24" x2="13" y2="41"/></svg>';
  var IC_LEFT   = '<svg viewBox="0 0 24 24" width="18" height="18"><path d="M15 5l-7 7 7 7" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  var IC_UNDO   = '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 7 4 12 9 17"/><path d="M4 12h9a5 5 0 0 1 0 10h-3"/></svg>';
  var IC_BROWSE = '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><line x1="4" y1="7" x2="20" y2="7"/><line x1="4" y1="12" x2="20" y2="12"/><line x1="4" y1="17" x2="20" y2="17"/></svg>';
  var IC_STACK  = '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"><rect x="7" y="4" width="12" height="15" rx="2"/><path d="M4 8v9a3 3 0 0 0 3 3h9"/></svg>';

  function cardLabel(item) {
    if (item.type === 'scripture') return GENRE_LABEL[item.genre] || 'Scripture';
    return (TYPE_META[item.type] || {}).label || item.type;
  }

  function bodyWithVersal(text, useVersal, kind) {
    var frag = document.createDocumentFragment();
    if (useVersal && text) {
      frag.appendChild(el('span', 'versal versal-' + (kind || 'gold'), text.charAt(0)));
      frag.appendChild(document.createTextNode(text.slice(1)));
    } else {
      frag.appendChild(document.createTextNode(text || ''));
    }
    return frag;
  }

  function isSaved(id) { return state.savedIds.indexOf(id) !== -1; }

  function toggleSave(id, btn) {
    var i = state.savedIds.indexOf(id);
    if (i === -1) state.savedIds.push(id); else state.savedIds.splice(i, 1);
    persist();
    var on = isSaved(id);
    btn.setAttribute('aria-pressed', on ? 'true' : 'false');
    btn.classList.toggle('on', on);
    btn.querySelector('.lbl').textContent = on ? 'Saved' : 'Save';
  }

  function renderCard(item, opts) {
    opts = opts || {};
    var meta = TYPE_META[item.type] || { accent: 'lapis', versal: false };
    var card = el('article', 'card card-' + item.type + (opts.heroClass ? ' ' + opts.heroClass : ''));

    var accent = opts.rubricAccent || meta.accent;
    card.appendChild(el('div', 'rubric rubric-' + accent, opts.rubricLabel || cardLabel(item)));
    if (opts.eyebrow) card.appendChild(el('div', 'eyebrow', opts.eyebrow));
    if (item.title) card.appendChild(el('h2', 'card-title', item.title));

    var body = el('p', 'body');
    body.appendChild(bodyWithVersal(item.body, meta.versal, item.type === 'prayer' ? 'crimson' : 'gold'));
    card.appendChild(body);

    if (item.quote) {
      var q = el('blockquote', 'quote');
      q.appendChild(document.createTextNode('\u201C' + item.quote + '\u201D'));
      card.appendChild(q);
    }

    var foot = el('div', 'foot');
    foot.appendChild(el('cite', 'ref', item.ref));

    var btn = el('button', 'save');
    btn.type = 'button';
    btn.setAttribute('aria-pressed', isSaved(item.id) ? 'true' : 'false');
    if (isSaved(item.id)) btn.classList.add('on');
    btn.appendChild(svg(IC_RIBBON));
    btn.appendChild(el('span', 'lbl', isSaved(item.id) ? 'Saved' : 'Save'));
    btn.addEventListener('click', function () { toggleSave(item.id, btn); });
    foot.appendChild(btn);

    card.appendChild(foot);
    return card;
  }

  function renderColophon(count) {
    var c = el('article', 'card colophon');
    c.appendChild(svg(CHI_RHO));
    c.appendChild(el('h2', 'colophon-h', "Today's portion is complete."));
    c.appendChild(el('p', 'colophon-p',
      'You\u2019ve read ' + count + ' reflection' + (count === 1 ? '' : 's') +
      '. The next gathering opens tomorrow.'));
    if (state.streak > 0)
      c.appendChild(el('p', 'colophon-streak',
        'Current streak: ' + state.streak + ' day' + (state.streak === 1 ? '' : 's') + '.'));
    return c;
  }

  function infoCard(title, msg) {
    var c = el('article', 'card colophon');
    c.appendChild(el('h2', 'colophon-h', title));
    c.appendChild(el('p', 'colophon-p', msg));
    return c;
  }

  /* ===================== views ===================== */

  var feedEl, savedEl, moreEl, todayPortion = [];

  function clear(node) { node.textContent = ''; }      // safe reset (not innerHTML +=)

  var MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July',
                'August', 'September', 'October', 'November', 'December'];

  function renderLitHeader(l) {
    var h = el('section', 'lit lit-' + l.color);
    h.appendChild(el('span', 'lit-mark'));
    var t = el('div', 'lit-txt');
    t.appendChild(el('div', 'lit-day', l.label));
    var now = new Date();
    t.appendChild(el('div', 'lit-sub',
      WEEKDAY[now.getDay()] + ', ' + MONTHS[now.getMonth()] + ' ' + now.getDate()));
    h.appendChild(t);
    return h;
  }

  function pickSaintOfDay(mmdd) {
    var s = ITEMS.filter(function (i) { return i.type === 'saint' && i.feast === mmdd; });
    return s.length ? s[0] : null;
  }

  /* ===================== detail sheet (deep read) ===================== */

  var detailRoot = null, detailOpen = false, detailLastFocus = null;

  function appendParas(node, text) {
    (text || '').split(/\n\n+/).forEach(function (p) {
      p = p.trim();
      if (!p) return;
      var isRef = /^Reflection[.\u2014:-]/.test(p);
      var pe = el('p', 'detail-p' + (isRef ? ' reflection' : ''));
      pe.appendChild(document.createTextNode(p));
      node.appendChild(pe);
    });
  }

  var DEPTH = null, DEPTH_META = null, depthPromise = null;

  function loadDepth() {
    if (depthPromise) return depthPromise;
    depthPromise = fetch('./depth.json')
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (j) {
        DEPTH = (j && j.items) || {};
        DEPTH_META = (j && j.meta) || {};
        return DEPTH;
      })
      .catch(function () { DEPTH = {}; return DEPTH; });
    return depthPromise;
  }

  function isGospelCard(item) {
    return item && item.type === 'scripture' && item.genre === 'gospel';
  }

  function depthSection(title) {
    var sec = el('section', 'depth');
    var head = el('div', 'fathers-head');
    head.appendChild(el('span', 'fathers-rule'));
    head.appendChild(el('span', 'fathers-title', title));
    head.appendChild(el('span', 'fathers-rule'));
    sec.appendChild(head);
    return sec;
  }

  function buildGlossSection(glosses, src) {
    var sec = depthSection('The Fathers');
    glosses.forEach(function (g) {
      var blk = el('div', 'gloss');
      blk.appendChild(el('div', 'gloss-father', g.f));
      var p = el('p', 'gloss-text');
      p.appendChild(document.createTextNode(g.t));
      blk.appendChild(p);
      sec.appendChild(blk);
    });
    if (src) sec.appendChild(el('div', 'fathers-src', src));
    return sec;
  }

  function buildParaSection(title, paras, src) {
    var sec = depthSection(title);
    paras.forEach(function (t) {
      var p = el('p', 'expl-text');
      p.appendChild(document.createTextNode(t));
      sec.appendChild(p);
    });
    if (src) sec.appendChild(el('div', 'fathers-src', src));
    return sec;
  }

  function renderDepth(scrollNode, item, bodyWrap) {
    var holder = el('div', 'depth-holder');
    scrollNode.appendChild(holder);
    function rm() { if (holder.parentNode) holder.parentNode.removeChild(holder); }
    function fill() {
      var d = DEPTH && DEPTH[item.id];
      if (!d) { rm(); return; }
      if (d.k === 'life') {
        rm();
        if (d.p && d.p.length) { clear(bodyWrap); appendParas(bodyWrap, d.p.join('\n\n')); }
        return;
      }
      var sec = null;
      if (d.k === 'fathers') sec = buildGlossSection(d.g, DEPTH_META && DEPTH_META.fathers);
      else if (d.k === 'expl') sec = buildParaSection('The Explanation', d.p, DEPTH_META && DEPTH_META.expl);
      if (!sec) { rm(); return; }
      clear(holder); holder.appendChild(sec);
    }
    if (DEPTH) { fill(); return; }
    if (isGospelCard(item))
      holder.appendChild(el('div', 'fathers-loading', 'Gathering the Fathers\u2026'));
    else if (item.type === 'catechism')
      holder.appendChild(el('div', 'fathers-loading', 'Gathering the explanation\u2026'));
    loadDepth().then(function () {
      if (detailOpen && detailRoot && detailRoot.currentId === item.id) fill();
    });
  }

  function buildDetailRoot() {
    if (detailRoot) return;
    var scrim = el('div', 'detail-scrim');
    var sheet = el('section', 'detail');
    sheet.setAttribute('role', 'dialog');
    sheet.setAttribute('aria-modal', 'true');
    sheet.setAttribute('aria-label', 'Reading');
    sheet.appendChild(el('div', 'detail-grip'));
    var scroll = el('div', 'detail-scroll');
    var actions = el('div', 'detail-actions');
    sheet.appendChild(scroll);
    sheet.appendChild(actions);
    document.body.appendChild(scrim);
    document.body.appendChild(sheet);
    scrim.addEventListener('click', closeDetail);
    detailRoot = { scrim: scrim, sheet: sheet, scroll: scroll, actions: actions };
  }

  function openDetail(item) {
    buildDetailRoot();
    var s = detailRoot.scroll;
    clear(s);
    detailRoot.currentId = item.id;
    var meta = TYPE_META[item.type] || { accent: 'lapis' };
    s.appendChild(el('div', 'rubric rubric-' + meta.accent, cardLabel(item)));
    if (item.title) s.appendChild(el('h2', 'detail-title', item.title));
    var bodyWrap = el('div', 'detail-body');
    appendParas(bodyWrap, item.more || item.body);
    s.appendChild(bodyWrap);
    var m = el('div', 'detail-meta');
    if (item.ref) m.appendChild(el('div', 'detail-ref', item.ref));
    if (item.source) m.appendChild(el('div', 'detail-src', item.source));
    if (item.tags && item.tags.length) {
      var tg = el('div', 'tags');
      item.tags.forEach(function (t) { tg.appendChild(el('span', 'tag', t)); });
      m.appendChild(tg);
    }
    s.appendChild(m);

    renderDepth(s, item, bodyWrap);

    var a = detailRoot.actions;
    clear(a);
    var save = el('button', 'save');
    save.type = 'button';
    if (isSaved(item.id)) save.classList.add('on');
    save.setAttribute('aria-pressed', isSaved(item.id) ? 'true' : 'false');
    save.appendChild(svg(IC_RIBBON));
    save.appendChild(el('span', 'lbl', isSaved(item.id) ? 'Saved' : 'Save'));
    save.addEventListener('click', function () { toggleSave(item.id, save); });
    var close = el('button', 'btn close', 'Close');
    close.type = 'button';
    close.addEventListener('click', closeDetail);
    a.appendChild(save);
    a.appendChild(close);

    detailLastFocus = document.activeElement;
    s.scrollTop = 0;
    detailRoot.scrim.classList.add('open');
    requestAnimationFrame(function () { detailRoot.sheet.classList.add('open'); });
    document.body.style.overflow = 'hidden';
    detailOpen = true;
    try { close.focus(); } catch (e) {}
  }

  function closeDetail() {
    if (!detailRoot || !detailOpen) return;
    detailRoot.sheet.classList.remove('open');
    detailRoot.scrim.classList.remove('open');
    document.body.style.overflow = '';
    detailOpen = false;
    if (detailLastFocus && detailLastFocus.focus) { try { detailLastFocus.focus(); } catch (e) {} }
  }

  /* ===================== today: swipe deck ===================== */

  var deckState = null;

  function buildDeckCard(item, opts) {
    var card = renderCard(item, opts);
    card.classList.add('stackcard');
    var keep = el('div', 'aff aff-keep', 'Keep');
    var pass = el('div', 'aff aff-pass', 'Pass');
    card.appendChild(keep);
    card.appendChild(pass);
    return { el: card, item: item, keep: keep, pass: pass };
  }

  function layoutDeck() {
    var ds = deckState;
    if (!ds) return;
    var n = ds.cards.length;
    for (var i = 0; i < n; i++) {
      var c = ds.cards[i].el, depth = i - ds.top;
      if (depth < 0 || depth > 2) { c.style.display = 'none'; c.classList.remove('is-top'); continue; }
      c.style.display = '';
      c.style.transition = reduceMotion ? 'none' : 'transform .38s cubic-bezier(.22,.61,.36,1), opacity .3s ease';
      if (depth === 0) {
        c.classList.add('is-top');
        c.style.transform = '';
        c.style.opacity = '1';
        c.style.zIndex = '50';
        c.setAttribute('tabindex', '0');
      } else {
        c.classList.remove('is-top');
        c.style.transform = 'translateY(' + (depth * 14) + 'px) scale(' + (1 - depth * 0.04) + ')';
        c.style.opacity = depth === 1 ? '1' : '0.5';
        c.style.zIndex = String(50 - depth);
        c.removeAttribute('tabindex');
      }
    }
    ds.prog.textContent = ds.top >= n ? '' :
      (n - ds.top) + (n - ds.top === 1 ? ' reading left' : ' readings left');
    updateUndo();
    if (ds.top >= n) deckDone();
  }

  function resetCard(co) {
    co.el.style.transition = reduceMotion ? 'none' : 'transform .45s cubic-bezier(.34,1.4,.64,1)';
    co.el.style.transform = '';
    co.keep.style.opacity = 0;
    co.pass.style.opacity = 0;
  }

  function attachGestures(co) {
    var card = co.el, start = null, dragging = false, moved = false;
    card.addEventListener('pointerdown', function (e) {
      if (!deckState || deckState.busy || deckState.mode === 'browse') return;
      if (deckState.cards[deckState.top] !== co) return;
      if (e.target.closest('.save')) return;
      start = { x: e.clientX, y: e.clientY, t: Date.now() };
      dragging = true; moved = false;
      card.style.transition = 'none';
      try { card.setPointerCapture(e.pointerId); } catch (_) {}
    });
    card.addEventListener('pointermove', function (e) {
      if (!dragging) return;
      var dx = e.clientX - start.x, dy = e.clientY - start.y;
      if (Math.abs(dx) > 6 || Math.abs(dy) > 6) moved = true;
      var rot = reduceMotion ? 0 : dx / 18;
      card.style.transform = 'translate(' + dx + 'px,' + (dy * 0.25) + 'px) rotate(' + rot + 'deg)';
      co.keep.style.opacity = Math.max(0, Math.min(1, dx / 90));
      co.pass.style.opacity = Math.max(0, Math.min(1, -dx / 90));
    });
    function end(e) {
      if (!dragging) return;
      dragging = false;
      var dx = e.clientX - start.x, dy = e.clientY - start.y, dt = Date.now() - start.t;
      try { card.releasePointerCapture(e.pointerId); } catch (_) {}
      if (!moved && Math.hypot(dx, dy) < 8 && dt < 400) { resetCard(co); openDetail(co.item); return; }
      if (Math.abs(dx) > 92 || (Math.abs(dx) > 46 && dt < 260)) flyTop(dx < 0 ? -1 : 1);
      else resetCard(co);
    }
    card.addEventListener('pointerup', end);
    card.addEventListener('pointercancel', function () { if (dragging) { dragging = false; resetCard(co); } });
    card.addEventListener('click', function (e) {
      if (deckState && deckState.mode === 'browse' && !e.target.closest('.save')) bringToTop(co);
    });
    card.addEventListener('keydown', function (e) {
      if (!deckState) return;
      if (deckState.mode === 'browse') {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); bringToTop(co); }
        return;
      }
      if (deckState.cards[deckState.top] !== co) return;
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openDetail(co.item); }
      else if (e.key === 'ArrowLeft') { e.preventDefault(); flyTop(-1); }
      else if (e.key === 'ArrowRight') { e.preventDefault(); flyTop(1); }
    });
  }

  function flyTop(dir) {
    var ds = deckState;
    if (!ds || ds.busy || ds.top >= ds.cards.length) return;
    var co = ds.cards[ds.top];
    ds.busy = true;
    var added = false;
    if (dir > 0 && !isSaved(co.item.id)) { state.savedIds.push(co.item.id); persist(); added = true; }
    ds.history.push({ added: added });
    co.keep.style.opacity = dir > 0 ? 1 : 0;
    co.pass.style.opacity = dir < 0 ? 1 : 0;
    var done = false;
    function finish() {
      if (done) return;
      done = true;
      co.el.style.display = 'none';
      ds.top++; ds.busy = false;
      layoutDeck();
    }
    if (reduceMotion) { finish(); return; }
    co.el.style.transition = 'transform .4s cubic-bezier(.4,0,.6,1), opacity .34s ease';
    co.el.style.transform = 'translate(' + (dir * 135) + '%,' + (dir * 4) + '%) rotate(' + (dir * 16) + 'deg)';
    co.el.style.opacity = '0';
    co.el.addEventListener('transitionend', finish, { once: true });
    setTimeout(finish, 460);
  }

  function updateUndo() {
    var ds = deckState;
    if (ds && ds.undoBtn) ds.undoBtn.hidden = ds.top <= 0;
  }

  function undo() {
    var ds = deckState;
    if (!ds || ds.busy || ds.top <= 0) return;
    ds.top--;
    var rec = ds.history.pop();
    var co = ds.cards[ds.top];
    if (rec && rec.added) {                       // reverse an accidental keep
      var i = state.savedIds.indexOf(co.item.id);
      if (i !== -1) { state.savedIds.splice(i, 1); persist(); }
    }
    co.keep.style.opacity = 0;
    co.pass.style.opacity = 0;
    if (ds.doneShown) {                            // came back from the finished state
      ds.doneShown = false;
      if (ds.colophon && ds.colophon.parentNode) ds.colophon.parentNode.removeChild(ds.colophon);
      ds.colophon = null;
      ds.deck.style.display = '';
      ds.actions.style.display = '';
      ds.prog.style.display = '';
      if (ds.browseBar) ds.browseBar.hidden = false;
    }
    layoutDeck();
  }

  function deckDone() {
    var ds = deckState;
    if (ds.doneShown) return;
    ds.doneShown = true;
    ds.deck.style.display = 'none';
    ds.actions.style.display = 'none';
    ds.prog.style.display = 'none';
    if (ds.browseBar) ds.browseBar.hidden = true;
    var col = renderColophon(ds.cards.length);
    ds.colophon = col;
    ds.wrap.appendChild(col);
    if (!reduceMotion) {
      col.classList.add('reveal');
      requestAnimationFrame(function () { col.classList.add('in'); });
    }
  }

  function layoutBrowse() {
    var ds = deckState;
    for (var i = 0; i < ds.cards.length; i++) {
      var co = ds.cards[i];
      co.el.style.display = i < ds.top ? 'none' : '';
      co.el.classList.remove('is-top');
      co.keep.style.opacity = 0;
      co.pass.style.opacity = 0;
      if (i < ds.top) co.el.removeAttribute('tabindex');
      else co.el.setAttribute('tabindex', '0');
    }
  }

  function enterBrowse() {
    var ds = deckState;
    if (!ds || ds.busy || ds.doneShown || ds.top >= ds.cards.length) return;
    ds.mode = 'browse';
    ds.deck.classList.add('browse');
    layoutBrowse();
    ds.actions.style.display = 'none';
    ds.prog.style.display = 'none';
    if (ds.undoBtn) ds.undoBtn.hidden = true;
    updateBrowseBtn();
    window.scrollTo(0, 0);
  }

  function exitBrowse() {
    var ds = deckState;
    if (!ds) return;
    ds.mode = 'stack';
    ds.deck.classList.remove('browse');
    ds.actions.style.display = '';
    ds.prog.style.display = '';
    layoutDeck();
    updateBrowseBtn();
    window.scrollTo(0, 0);
  }

  function bringToTop(co) {
    var ds = deckState;
    if (!ds) return;
    var idx = ds.cards.indexOf(co);
    if (idx < 0 || idx < ds.top) return;
    if (idx > ds.top) {                 // pull this card to the front of the remaining stack
      ds.cards.splice(idx, 1);
      ds.cards.splice(ds.top, 0, co);
    }
    exitBrowse();
  }

  function updateBrowseBtn() {
    var ds = deckState;
    if (!ds || !ds.browseBtn) return;
    var browsing = ds.mode === 'browse';
    clear(ds.browseBtn);
    ds.browseBtn.appendChild(svg(browsing ? IC_STACK : IC_BROWSE));
    ds.browseBtn.appendChild(el('span', null, browsing ? 'Stack' : 'Browse'));
    ds.browseBtn.setAttribute('aria-pressed', browsing ? 'true' : 'false');
  }

  function renderToday() {
    clear(feedEl);
    deckState = null;
    if (!ITEMS.length) {
      feedEl.appendChild(infoCard('Couldn\u2019t load the readings',
        'Check your connection and reopen ' + APP_NAME + '.'));
      return;
    }
    var lit = liturgicalDay(new Date());
    feedEl.appendChild(renderLitHeader(lit));

    var weights = seasonWeights(DEFAULT_WEIGHTS, lit.key, DAILY_PORTION);
    todayPortion = composeOffice(ITEMS, dayIndex(isoDate(new Date())), DAILY_PORTION, weights);

    var entries = [];
    var hero = pickSaintOfDay(lit.mmdd);
    if (hero) {
      todayPortion = todayPortion.filter(function (x) { return x.id !== hero.id; });
      entries.push(buildDeckCard(hero, {
        rubricLabel: 'Saint of the Day', rubricAccent: 'gold', heroClass: 'saint-hero'
      }));
    }
    todayPortion.forEach(function (item) { entries.push(buildDeckCard(item, {})); });

    var wrap = el('div', 'deck-wrap');
    var bar = el('div', 'deck-bar');
    var browseBtn = el('button', 'deck-browse'); browseBtn.type = 'button';
    bar.appendChild(browseBtn);
    wrap.appendChild(bar);
    var deck = el('div', 'deck');
    entries.forEach(function (co) { deck.appendChild(co.el); });
    wrap.appendChild(deck);

    var actions = el('div', 'deck-actions');
    var passBtn = el('button', 'deck-btn pass'); passBtn.type = 'button';
    passBtn.appendChild(svg(IC_LEFT)); passBtn.appendChild(el('span', null, 'Pass'));
    var keepBtn = el('button', 'deck-btn keep'); keepBtn.type = 'button';
    keepBtn.appendChild(svg(IC_RIBBON)); keepBtn.appendChild(el('span', null, 'Keep'));
    actions.appendChild(passBtn); actions.appendChild(keepBtn);
    wrap.appendChild(actions);

    var prog = el('div', 'deck-progress');
    wrap.appendChild(prog);

    var undoBtn = el('button', 'deck-undo');
    undoBtn.type = 'button';
    undoBtn.hidden = true;
    undoBtn.appendChild(svg(IC_UNDO));
    undoBtn.appendChild(el('span', null, 'Undo last swipe'));
    wrap.appendChild(undoBtn);

    feedEl.appendChild(wrap);

    deckState = { cards: entries, top: 0, busy: false, doneShown: false, history: [],
                  mode: 'stack', deck: deck, wrap: wrap, actions: actions, prog: prog,
                  undoBtn: undoBtn, browseBtn: browseBtn, browseBar: bar, colophon: null };
    entries.forEach(function (co) { attachGestures(co); });
    passBtn.addEventListener('click', function () { flyTop(-1); });
    keepBtn.addEventListener('click', function () { flyTop(1); });
    undoBtn.addEventListener('click', undo);
    browseBtn.addEventListener('click', function () {
      if (deckState.mode === 'browse') exitBrowse(); else enterBrowse();
    });
    updateBrowseBtn();
    layoutDeck();
  }

  function renderSaved() {
    clear(savedEl);
    var byId = {};
    ITEMS.forEach(function (it) { byId[it.id] = it; });
    var saved = state.savedIds.map(function (id) { return byId[id]; })
                              .filter(Boolean).reverse();
    if (!saved.length) {
      var empty = el('div', 'empty');
      empty.appendChild(el('p', 'empty-h', 'Nothing kept yet.'));
      empty.appendChild(el('p', 'empty-p', 'Tap the ribbon on any card to save it here for later.'));
      savedEl.appendChild(empty);
      return;
    }
    saved.forEach(function (item) {
      var card = renderCard(item);
      card.style.cursor = 'pointer';
      card.addEventListener('click', function (e) {
        if (e.target.closest('.save')) return;
        openDetail(item);
      });
      savedEl.appendChild(card);
    });
    observeReveal(savedEl);
  }

  function syncStatus(msg, kind) {
    var s = document.getElementById('syncStatus');
    if (!s) return;
    s.textContent = msg || '';
    s.className = 'sync-status' + (kind ? ' ' + kind : '');
  }

  function renderMore() {
    clear(moreEl);

    var streakCard = el('section', 'panel');
    var sh = el('div', 'streak-big');
    sh.appendChild(svg(IC_FLAME));
    sh.appendChild(el('span', 'streak-n', String(state.streak)));
    streakCard.appendChild(sh);
    streakCard.appendChild(el('p', 'streak-cap', state.streak === 1 ? 'day in a row' : 'days in a row'));
    moreEl.appendChild(streakCard);

    var sync = el('section', 'panel');
    sync.appendChild(el('h3', 'panel-h', 'Sync across devices'));
    sync.appendChild(el('p', 'panel-p',
      'Set a private code to carry your saved cards and streak to another device. Pull to bring them in, push to send them up.'));
    var row = el('div', 'sync-row');
    var input = el('input', 'pin-input');
    input.type = 'text'; input.inputMode = 'numeric'; input.autocomplete = 'off';
    input.placeholder = 'code'; input.value = state.pin || '';
    input.setAttribute('aria-label', 'Sync code');
    var pull = el('button', 'btn'); pull.type = 'button'; pull.textContent = 'Pull';
    var push = el('button', 'btn btn-gold'); push.type = 'button'; push.textContent = 'Push';
    row.appendChild(input); row.appendChild(pull); row.appendChild(push);
    sync.appendChild(row);
    sync.appendChild(el('p', 'sync-status', '')).id = 'syncStatus';

    function pin() { return (input.value || '').trim(); }
    function remember() { state.pin = pin() || null; persist(); }

    pull.addEventListener('click', function () {
      if (!pin()) { syncStatus('Enter a code first.', 'warn'); return; }
      remember(); syncStatus('Pulling\u2026');
      syncPull(pin()).then(function (n) {
        syncStatus(n === null ? 'No saved data for that code yet.' : 'Pulled. ' + state.savedIds.length + ' cards saved.', 'ok');
        renderSaved();
      }).catch(function () { syncStatus('Could not reach sync. Check your connection.', 'warn'); });
    });
    push.addEventListener('click', function () {
      if (!pin()) { syncStatus('Enter a code first.', 'warn'); return; }
      remember(); syncStatus('Pushing\u2026');
      syncPush(pin()).then(function () {
        syncStatus('Pushed. This device is up to date.', 'ok');
      }).catch(function () { syncStatus('Could not reach sync. Check your connection.', 'warn'); });
    });
    moreEl.appendChild(sync);

    var about = el('section', 'panel');
    about.appendChild(el('h3', 'panel-h', 'About ' + APP_NAME));
    about.appendChild(el('p', 'panel-p',
      APP_NAME + ' is a daily florilegium \u2014 a gathering of Scripture, the Church Fathers, the Catechism, the saints, and the prayers of the Church, a measured portion each day, to read slowly instead of scrolling endlessly.'));
    about.appendChild(el('p', 'panel-p note',
      'Scripture is the Douay-Rheims (public domain). Catechism excerpts are kept brief and used within the Church\u2019s fair-use allowance.'));
    if (CONTENT && CONTENT.count)
      about.appendChild(el('p', 'panel-p note', CONTENT.count + ' readings in the collection.'));
    moreEl.appendChild(about);
  }

  /* ===================== sync (Firebase REST, optional) ===================== */

  function syncUrl(pin) { return FIREBASE + '/' + SYNC_NS + '/' + encodeURIComponent(pin) + '.json'; }

  function syncPush(pin) {
    var payload = {
      streak: state.streak, lastOpenedISO: state.lastOpenedISO,
      savedIds: state.savedIds, updated: Date.now()
    };
    return fetch(syncUrl(pin), { method: 'PUT', body: JSON.stringify(payload) })
      .then(function (r) { if (!r.ok) throw new Error('push'); });
  }

  function syncPull(pin) {
    return fetch(syncUrl(pin)).then(function (r) {
      if (!r.ok) throw new Error('pull');
      return r.json();
    }).then(function (data) {
      if (!data) return null;
      var set = {};
      state.savedIds.forEach(function (id) { set[id] = true; });
      (data.savedIds || []).forEach(function (id) { set[id] = true; });
      state.savedIds = Object.keys(set);
      if ((data.streak || 0) > state.streak) state.streak = data.streak;
      if (data.lastOpenedISO && (!state.lastOpenedISO || data.lastOpenedISO > state.lastOpenedISO))
        state.lastOpenedISO = data.lastOpenedISO;
      persist();
      updateStreakChip();
      return data;
    });
  }

  /* ===================== motion (restrained, opt-out) ===================== */

  var reduceMotion = typeof matchMedia !== 'undefined' &&
                     matchMedia('(prefers-reduced-motion: reduce)').matches;
  var io = null;
  function observeReveal(container) {
    if (reduceMotion || typeof IntersectionObserver === 'undefined') return;
    if (!io) {
      io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
        });
      }, { rootMargin: '0px 0px -8% 0px' });
    }
    container.querySelectorAll('.card:not(.in)').forEach(function (c) {
      c.classList.add('reveal'); io.observe(c);
    });
  }

  /* ===================== nav + boot ===================== */

  function updateStreakChip() {
    var n = document.getElementById('streakN');
    if (n) n.textContent = String(state.streak);
  }

  function setView(name) {
    ['today', 'saved', 'more'].forEach(function (v) {
      document.getElementById('view-' + v).hidden = (v !== name);
      var tab = document.getElementById('tab-' + v);
      if (tab) {
        tab.classList.toggle('active', v === name);
        tab.setAttribute('aria-current', v === name ? 'page' : 'false');
      }
    });
    if (name === 'saved') renderSaved();
    if (name === 'more') renderMore();
    window.scrollTo(0, 0);
    var shown = document.getElementById('view-' + name);
    if (shown && !reduceMotion) {
      shown.classList.remove('view-in');
      void shown.offsetWidth;            // reflow so the animation restarts
      shown.classList.add('view-in');
    }
  }

  function setupShell() {
    feedEl  = document.getElementById('feed');
    savedEl = document.getElementById('savedList');
    moreEl  = document.getElementById('moreList');

    document.getElementById('wordmark').textContent = APP_NAME;

    var today = isoDate(new Date());
    var r = streakAfterOpen(state, today);
    state.streak = r.streak; state.lastOpenedISO = r.lastOpenedISO; persist();
    updateStreakChip();

    document.getElementById('tab-today').addEventListener('click', function () { setView('today'); });
    document.getElementById('tab-saved').addEventListener('click', function () { setView('saved'); });
    document.getElementById('tab-more').addEventListener('click', function () { setView('more'); });
    var tT = document.getElementById('tab-today');
    var tS = document.getElementById('tab-saved');
    var tM = document.getElementById('tab-more');
    tT.insertBefore(svg(IC_BOOK), tT.firstChild);
    tS.insertBefore(svg(IC_RIBBON), tS.firstChild);
    tM.insertBefore(svg(IC_MORE), tM.firstChild);
    document.getElementById('streakIcon').appendChild(svg(IC_FLAME));

    var bar = document.getElementById('bar');
    window.addEventListener('scroll', function () {
      bar.classList.toggle('scrolled', window.scrollY > 4);
    }, { passive: true });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeDetail();
    });

    try {
      var iconHref = document.querySelector('link[rel="apple-touch-icon"]').href;
      var manifest = {
        name: APP_NAME, short_name: APP_NAME, start_url: './', scope: './',
        display: 'standalone', background_color: '#EFE6D2', theme_color: '#18285C',
        icons: [{ src: iconHref, sizes: '512x512', type: 'image/png', purpose: 'any maskable' }]
      };
      var ml = document.createElement('link');
      ml.rel = 'manifest';
      ml.href = URL.createObjectURL(new Blob([JSON.stringify(manifest)], { type: 'application/json' }));
      document.head.appendChild(ml);
    } catch (e) {}

    if ('serviceWorker' in navigator) {
      window.addEventListener('load', function () {
        navigator.serviceWorker.register('sw.js').catch(function () {});
      });
    }
  }

  function boot() {
    setupShell();
    clear(feedEl);
    feedEl.appendChild(infoCard('Gathering today\u2019s readings\u2026', 'One moment.'));
    fetch('content.json').then(function (r) {
      if (!r.ok) throw new Error('http ' + r.status);
      return r.json();
    }).then(function (data) {
      CONTENT = data; ITEMS = (data && data.items) || [];
      renderToday(); setView('today');
      loadDepth();          // warm the Fathers / explanations / lives in the background
    }).catch(function () {
      clear(feedEl);
      feedEl.appendChild(infoCard('Couldn\u2019t load the readings',
        'Check your connection and reopen ' + APP_NAME + '.'));
    });
  }

  if (typeof document !== 'undefined') {
    if (document.readyState === 'loading')
      document.addEventListener('DOMContentLoaded', boot);
    else boot();
  }
})();
