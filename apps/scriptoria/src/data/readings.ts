/**
 * Lectionary readings client — extracted from the "Laudate" daily missal source app.
 *
 * ───────────────────────────────────────────────────────────────────────────
 * OBSERVED API CONTRACT (ported verbatim from source_apps/daily-missal.html)
 * ───────────────────────────────────────────────────────────────────────────
 *
 * The source uses TWO endpoints on the same static (GitHub Pages) host, plus a
 * third third-party API for full reading text loaded on demand.
 *
 * Base:  READINGS_API = 'https://cpbjr.github.io/catholic-readings-api'
 *
 * 1) READINGS (references + season + USCCB link)
 *      GET `${READINGS_API}/readings/${YYYY}/${MM-DD}.json`
 *      e.g. https://cpbjr.github.io/catholic-readings-api/readings/2026/06-15.json
 *    Note the URL parts: a 4-digit year directory, then a zero-padded
 *    `MM-DD.json` file (NOT the dashed ISO date). The source builds this with:
 *      year = d.getFullYear()
 *      mmdd = `${MM}-${DD}`  (both zero-padded, LOCAL time)
 *    Response shape the source reads:
 *      {
 *        "season":   string,        // e.g. "Ordinary Time"  (optional)
 *        "usccbLink": string,       // optional; source falls back to a built URL
 *        "readings": {
 *          "firstReading":  string, // scripture reference, e.g. "1 Kings 21:1-16"
 *          "psalm":         string, // e.g. "Psalm 5:2-3, 5-6, 7"
 *          "secondReading": string, // optional (Sundays/solemnities)
 *          "gospel":        string  // e.g. "Matthew 5:38-42"
 *        }
 *      }
 *    Each `readings.*` value is just a REFERENCE string — not the full text.
 *
 * 2) LITURGICAL CALENDAR (season/week + celebration / saint-of-the-day)
 *      GET `${READINGS_API}/liturgical-calendar/${YYYY}/${MM-DD}.json`
 *    Response shape the source reads:
 *      {
 *        "season": string,          // e.g. "Ordinary Time" (shown as season-label)
 *        "celebration": {           // optional; this IS the saint-of-the-day data
 *          "name":        string,   // e.g. "St. Germaine Cousin"
 *          "type":        string,   // "SOLEMNITY" | "FEAST" | "MEMORIAL" | ...
 *          "description": string,   // optional prose
 *          "quote":       string,   // optional
 *          "image":       string    // optional image URL
 *        }
 *      }
 *    The source has NO hardcoded saints table — the saint-of-the-day comes
 *    entirely from `calendar.celebration`. The "11th Week in Ordinary Time"
 *    style liturgical-day label is whatever the API supplies via `season` /
 *    `celebration.name`; the source does not compute the week number itself.
 *
 * 3) FULL READING TEXT (on-demand, when an accordion card is expanded)
 *      GET `https://bible-api.com/${encodeURIComponent(ref)}?translation=dra`
 *    (Douay-Rheims, a Catholic translation; CORS-enabled, free.)
 *    Fallback on failure: same URL WITHOUT the `?translation=dra` query (WEB).
 *    The reference is "cleaned" first: trailing verse-letter suffixes are
 *    stripped, e.g. "Wisdom 9:13-18b" -> "Wisdom 9:13-18", via
 *    /(\d+)[a-d]\b/g -> "$1".
 *    Response shape read by the source: { "text": string }.
 *
 * SEASON → COLOR (ported from seasonClass + celebrationSeasonClass):
 *   - If a celebration `type` is present it WINS over the plain season:
 *       SOLEMNITY | FEAST            -> white  (feast)
 *       MEMORIAL                     -> red    (martyr / memorial styling)
 *       (anything else)              -> green
 *   - Otherwise, by season string (case-insensitive substring):
 *       contains "lent"  | "advent"     -> violet
 *       contains "christmas" | "easter" -> white
 *       (default / Ordinary Time)       -> green
 *   NOTE: the source's CSS palette also defines `rose` (Gaudete/Laetare) for
 *   completeness, but its JS never selects it; `seasonColor` below adds the
 *   liturgically-correct rose detection for "gaudete"/"laetare" while keeping
 *   the source's exact behavior for every case the source handled. `gold` is
 *   treated as a feast color alongside white.
 * ───────────────────────────────────────────────────────────────────────────
 */

export type LiturgicalColor = 'green' | 'violet' | 'white' | 'gold' | 'red' | 'rose';

export interface Reading {
  label: string; // e.g. "First Reading", "Responsorial Psalm", "Second Reading", "Gospel"
  reference: string; // scripture reference, e.g. "1 Kings 21:1-16"
  text: string; // full reading text (may be empty until loaded on demand)
}

export interface DayReadings {
  dateISO: string; // "2026-06-15"
  liturgicalDay: string; // "Monday, 11th Week in Ordinary Time"
  season: string; // "Ordinary Time"
  color: LiturgicalColor;
  saint?: { name: string; description?: string };
  readings: Reading[]; // first reading, psalm, (second), gospel
}

/** Raw shape of `${READINGS_API}/readings/${YYYY}/${MM-DD}.json`. */
interface RawReadingsResponse {
  season?: string;
  usccbLink?: string;
  readings?: {
    firstReading?: string;
    psalm?: string;
    secondReading?: string;
    gospel?: string;
  };
}

/** Raw shape of `${READINGS_API}/liturgical-calendar/${YYYY}/${MM-DD}.json`. */
interface RawCalendarResponse {
  season?: string;
  celebration?: {
    name?: string;
    type?: string;
    description?: string;
    quote?: string;
    image?: string;
  };
}

/** Raw shape of the bible-api.com full-text response. */
interface RawBibleApiResponse {
  text?: string;
}

export const READINGS_API = 'https://cpbjr.github.io/catholic-readings-api';

/** bible-api.com base used for on-demand full reading text (Douay-Rheims). */
export const BIBLE_API = 'https://bible-api.com';

// ─── Date helpers (ported from dateKey / apiDateKey, LOCAL time) ───

function pad2(n: number): string {
  return String(n).padStart(2, '0');
}

/** ISO-ish local date key, e.g. "2026-06-15". */
export function dateKey(date: Date): string {
  return `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}`;
}

/** "MM-DD" key used in the API path (local time, matching the source). */
function apiDateKey(date: Date): string {
  return `${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}`;
}

/**
 * Build the readings request URL for a given date (ports the source's
 * `${READINGS_API}/readings/${year}/${mmdd}.json` construction).
 */
export function readingsUrl(date: Date): string {
  return `${READINGS_API}/readings/${date.getFullYear()}/${apiDateKey(date)}.json`;
}

/**
 * Build the liturgical-calendar request URL for a given date (ports
 * `${READINGS_API}/liturgical-calendar/${year}/${mmdd}.json`).
 */
export function calendarUrl(date: Date): string {
  return `${READINGS_API}/liturgical-calendar/${date.getFullYear()}/${apiDateKey(date)}.json`;
}

/**
 * Build the USCCB.org daily-readings fallback link for a given date, matching
 * the source's `MMDDYY.cfm` pattern.
 */
export function usccbUrl(date: Date): string {
  const mm = pad2(date.getMonth() + 1);
  const dd = pad2(date.getDate());
  const yy = String(date.getFullYear()).slice(-2);
  return `https://bible.usccb.org/bible/readings/${mm}${dd}${yy}.cfm`;
}

/**
 * Clean a scripture reference for the full-text API: strip trailing verse-letter
 * suffixes such as "18b" -> "18" (ported from the source's `cleanReference`).
 */
export function cleanReference(ref: string): string {
  return ref.replace(/(\d+)[a-d]\b/g, '$1');
}

/** Build the on-demand full-text URL for a reference (Douay-Rheims). */
export function readingTextUrl(reference: string): string {
  return `${BIBLE_API}/${encodeURIComponent(cleanReference(reference))}?translation=dra`;
}

// ─── Season → color ───

/**
 * Map a liturgical season/day to a color. Ports the source's `seasonClass`
 * and `celebrationSeasonClass` logic, with the celebration type taking
 * precedence over the plain season when supplied via `day`.
 *
 * @param season the season string, e.g. "Ordinary Time", "Lent", "Easter".
 * @param day    optional celebration type/name hint, e.g. "SOLEMNITY",
 *               "MEMORIAL", "Feast", or a free-text day label.
 */
export function seasonColor(season: string, day?: string): LiturgicalColor {
  // Celebration type wins (mirrors celebrationSeasonClass), tolerant of either
  // a raw type token or a free-text day label containing the keyword.
  if (day) {
    const t = day.toLowerCase();
    if (t.includes('solemnity') || t.includes('feast')) return 'white';
    if (t.includes('memorial') || t.includes('martyr') || t.includes('passion')) return 'red';
  }

  if (!season) return 'green';
  const s = season.toLowerCase();

  // Gaudete (3rd Advent) / Laetare (4th Lent) Sundays are rose. Not selected by
  // the source's JS, but liturgically correct and supported by its CSS palette.
  if (s.includes('gaudete') || s.includes('laetare')) return 'rose';

  if (s.includes('lent') || s.includes('advent')) return 'violet';
  if (s.includes('christmas') || s.includes('easter')) return 'white';

  return 'green';
}

// ─── In-memory caches (mirror readingsCache / calendarCache) ───

const readingsCache: Record<string, DayReadings> = {};

function timeoutFetch(url: string, ms = 8000): Promise<Response> {
  // global fetch with an abort-based timeout so offline/hung requests fall back.
  if (typeof AbortController === 'undefined') {
    return fetch(url);
  }
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), ms);
  return fetch(url, { signal: controller.signal }).finally(() => clearTimeout(timer));
}

/**
 * Fetch the day's full reading text on demand (used by the accordion when a
 * card is expanded). Tries Douay-Rheims, then the default (WEB) translation,
 * then returns null. Ports the source's `fetchReadingText`.
 */
export async function fetchReadingText(reference: string): Promise<string | null> {
  if (!reference) return null;
  const cleanRef = cleanReference(reference);
  try {
    const res = await timeoutFetch(`${BIBLE_API}/${encodeURIComponent(cleanRef)}?translation=dra`);
    if (!res.ok) throw new Error(`API returned ${res.status}`);
    const data = (await res.json()) as RawBibleApiResponse;
    if (data.text) return data.text.trim();
    return null;
  } catch {
    // Fallback translation (more forgiving with references).
    try {
      const res2 = await timeoutFetch(`${BIBLE_API}/${encodeURIComponent(cleanRef)}`);
      if (!res2.ok) throw new Error('Fallback also failed');
      const data2 = (await res2.json()) as RawBibleApiResponse;
      if (data2.text) return data2.text.trim();
    } catch {
      /* swallow — caller shows a USCCB fallback link */
    }
    return null;
  }
}

/**
 * Map the two raw API responses into a normalized `DayReadings`. Either input
 * may be null; the result is best-effort. Reading `text` is left empty here —
 * load it on demand via `fetchReadingText` (the accordion behavior).
 */
function mapToDayReadings(
  date: Date,
  readings: RawReadingsResponse | null,
  calendar: RawCalendarResponse | null,
): DayReadings | null {
  if (!readings && !calendar) return null;

  const r = readings?.readings ?? {};
  const list: Reading[] = [];
  if (r.firstReading) list.push({ label: 'First Reading', reference: r.firstReading, text: '' });
  if (r.psalm) list.push({ label: 'Responsorial Psalm', reference: r.psalm, text: '' });
  if (r.secondReading) list.push({ label: 'Second Reading', reference: r.secondReading, text: '' });
  if (r.gospel) list.push({ label: 'Gospel', reference: r.gospel, text: '' });

  const cel = calendar?.celebration;
  const season = calendar?.season || readings?.season || 'Ordinary Time';

  // liturgicalDay: prefer the celebration name, else "<Weekday>, <Season>".
  const weekday = WEEKDAYS[date.getDay()];
  const liturgicalDay = cel?.name ? cel.name : `${weekday}, ${season}`;

  return {
    dateISO: dateKey(date),
    liturgicalDay,
    season,
    color: seasonColor(season, cel?.type),
    saint: cel?.name ? { name: cel.name, description: cel.description } : undefined,
    readings: list,
  };
}

const WEEKDAYS = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
] as const;

/**
 * Fetch the day's readings live (references + calendar in parallel, ported from
 * `renderReadings`). On any failure (offline/error/empty) returns the matching
 * offline fallback from `FALLBACK_READINGS`, or a generated minimal default so
 * the app still works offline.
 */
export async function fetchDayReadings(date: Date): Promise<DayReadings> {
  const key = dateKey(date);
  if (readingsCache[key]) return readingsCache[key];

  let readings: RawReadingsResponse | null = null;
  let calendar: RawCalendarResponse | null = null;

  try {
    const [rRes, cRes] = await Promise.all([
      timeoutFetch(readingsUrl(date)).catch(() => null),
      timeoutFetch(calendarUrl(date)).catch(() => null),
    ]);
    if (rRes && rRes.ok) readings = (await rRes.json().catch(() => null)) as RawReadingsResponse | null;
    if (cRes && cRes.ok) calendar = (await cRes.json().catch(() => null)) as RawCalendarResponse | null;
  } catch {
    /* fall through to fallback */
  }

  const mapped = mapToDayReadings(date, readings, calendar);
  if (mapped && mapped.readings.length > 0) {
    readingsCache[key] = mapped;
    return mapped;
  }

  // Offline / error path.
  const fallback = FALLBACK_READINGS[key] ?? generateDefault(date);
  readingsCache[key] = fallback;
  return fallback;
}

/** Minimal generated fallback when no sample exists for the requested date. */
function generateDefault(date: Date): DayReadings {
  const weekday = WEEKDAYS[date.getDay()];
  return {
    dateISO: dateKey(date),
    liturgicalDay: `${weekday}, Ordinary Time`,
    season: 'Ordinary Time',
    color: 'green',
    readings: [],
  };
}

/**
 * Offline fallback samples, keyed by ISO date. Includes the canonical
 * 2026-06-15 sample plus a couple of additional days for offline coverage.
 */
export const FALLBACK_READINGS: Record<string, DayReadings> = {
  '2026-06-15': {
    dateISO: '2026-06-15',
    liturgicalDay: 'Monday, 11th Week in Ordinary Time',
    season: 'Ordinary Time',
    color: 'green',
    saint: {
      name: 'St. Germaine Cousin',
      description:
        'A French shepherdess (1579-1601) who bore lifelong illness, deformity, and cruel mistreatment with serene patience and deep prayer. Patron of the abused, the sick, and shepherdesses.',
    },
    readings: [
      {
        label: 'First Reading',
        reference: '1 Kings 21:1-16',
        text: '',
      },
      {
        label: 'Responsorial Psalm',
        reference: 'Psalm 5:2-3, 5-6, 7',
        text: '',
      },
      {
        label: 'Gospel',
        reference: 'Matthew 5:38-42',
        text:
          'Jesus said to his disciples: "You have heard that it was said, An eye for an eye and a tooth for a tooth. But I say to you, offer no resistance to one who is evil. When someone strikes you on your right cheek, turn the other one to him as well. If anyone wants to go to law with you over your tunic, hand him your cloak as well. Should anyone press you into service for one mile, go with him for two miles. Give to the one who asks of you, and do not turn your back on one who wants to borrow."',
      },
    ],
  },

  '2026-06-16': {
    dateISO: '2026-06-16',
    liturgicalDay: 'Tuesday, 11th Week in Ordinary Time',
    season: 'Ordinary Time',
    color: 'green',
    readings: [
      { label: 'First Reading', reference: '1 Kings 21:17-29', text: '' },
      { label: 'Responsorial Psalm', reference: 'Psalm 51:3-4, 5-6, 11, 16', text: '' },
      { label: 'Gospel', reference: 'Matthew 5:43-48', text: '' },
    ],
  },

  '2026-06-29': {
    dateISO: '2026-06-29',
    liturgicalDay: 'Saints Peter and Paul, Apostles',
    season: 'Ordinary Time',
    color: 'red',
    saint: {
      name: 'Saints Peter and Paul, Apostles',
      description:
        'Solemnity of the two great apostles and pillars of the Church, martyred in Rome. Red is worn for the witness of their martyrdom.',
    },
    readings: [
      { label: 'First Reading', reference: 'Acts 12:1-11', text: '' },
      { label: 'Responsorial Psalm', reference: 'Psalm 34:2-3, 4-5, 6-7, 8-9', text: '' },
      { label: 'Second Reading', reference: '2 Timothy 4:6-8, 17-18', text: '' },
      { label: 'Gospel', reference: 'Matthew 16:13-19', text: '' },
    ],
  },
};
