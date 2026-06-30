/**
 * Confiteor — parish dataset + core scheduling logic.
 *
 * Ported faithfully from the standalone "Confiteor" design handoff app
 * (source_apps/confession-times.html). Data verified from parish websites
 * 2025/2026. Schedules are pre-populated reference data — always confirm
 * with the parish bulletin or website, especially during Advent, Lent, and
 * Holy Week.
 *
 * In the source, weekly schedules are keyed by JS day-of-week number
 * (0 = Sunday ... 6 = Saturday). Here we use full day names; the helpers
 * below map between the two so the original algorithms port directly.
 */

export type DayName =
  | 'Sunday'
  | 'Monday'
  | 'Tuesday'
  | 'Wednesday'
  | 'Thursday'
  | 'Friday'
  | 'Saturday';

export const DAY_NAMES: DayName[] = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

export const DAY_SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

/** Day index for a DayName, matching JS Date.getDay() (0 = Sunday). */
export function dayIndex(day: DayName): number {
  return DAY_NAMES.indexOf(day);
}

/**
 * A confession or adoration window on a given weekday.
 * Times are 24-hour "HH:MM" strings. For adoration, a full-day window is
 * encoded as start "00:00" / end "23:59".
 */
export interface ScheduleSlot {
  day: DayName;
  start: string; // "HH:MM"
  end?: string; // "HH:MM" — present for confession & adoration windows
  note?: string;
}

/** A Mass time: point-in-time, single start (no end window). */
export interface MassSlot {
  day: DayName;
  start: string; // "HH:MM"
  note?: string;
}

export interface Parish {
  id: string;
  name: string;
  city: string;
  address: string;
  lat: number;
  lng: number;
  phone?: string;
  website?: string;
  /** Source-precomputed estimated drive time from Canton center, in minutes. */
  driveMin?: number;
  confession: ScheduleSlot[];
  adoration?: ScheduleSlot[];
  adorationNote?: string;
  mass?: MassSlot[];
  massNote?: string;
  notes?: string;
}

/** Default / home location — downtown Canton, GA (source: CANTON_CENTER). */
export const HOME_LOCATION = { label: 'Canton, GA', lat: 34.2368, lng: -84.4907 };

export const PARISHES: Parish[] = [
  {
    id: 'lasalette-canton',
    name: 'Our Lady of La Salette',
    city: 'Canton',
    address: '2941 Sam Nelson Rd, Canton, GA 30114',
    lat: 34.2044,
    lng: -84.4703,
    phone: '770-479-8923',
    website: 'https://www.ollcanton.com/',
    driveMin: 8,
    confession: [
      { day: 'Wednesday', start: '17:00', end: '18:15' },
      { day: 'Saturday', start: '16:00', end: '16:45' },
    ],
    adoration: [
      { day: 'Wednesday', start: '08:30', end: '18:45' },
      { day: 'Thursday', start: '19:00', end: '20:00' },
    ],
    adorationNote: 'First Friday of the month: 9:30 AM until 6:00 AM Saturday.',
    mass: [
      { day: 'Sunday', start: '07:00', note: 'Español' },
      { day: 'Sunday', start: '09:00' },
      { day: 'Sunday', start: '12:00', note: 'Español' },
      { day: 'Sunday', start: '15:00', note: 'Bilingual' },
      { day: 'Wednesday', start: '09:00' },
      { day: 'Wednesday', start: '18:30', note: 'Español' },
      { day: 'Thursday', start: '09:00' },
      { day: 'Friday', start: '09:00' },
      { day: 'Saturday', start: '17:00', note: 'Vigil' },
    ],
    notes: 'Other times by appointment. Verify during Lent & Advent.',
  },
  {
    id: 'st-michael-woodstock',
    name: 'St. Michael the Archangel',
    city: 'Woodstock',
    address: '490 Arnold Mill Rd, Woodstock, GA 30188',
    lat: 34.1014,
    lng: -84.4422,
    phone: '770-516-0009',
    website: 'https://saintmichaelcc.org/',
    driveMin: 18,
    confession: [
      { day: 'Wednesday', start: '17:00', end: '18:00' },
      { day: 'Saturday', start: '09:30', end: '10:30' },
    ],
    // Near-perpetual: Tue 9:30am through Sat 9:00am in chapel
    adoration: [
      { day: 'Tuesday', start: '09:30', end: '23:59' },
      { day: 'Wednesday', start: '00:00', end: '23:59' },
      { day: 'Thursday', start: '00:00', end: '23:59' },
      { day: 'Friday', start: '00:00', end: '23:59' },
      { day: 'Saturday', start: '00:00', end: '09:00' },
    ],
    adorationNote:
      'Chapel — near-perpetual Tuesday 9:30 AM through Saturday 9:00 AM. Pauses during Thanksgiving & Christmas weeks.',
    mass: [
      { day: 'Sunday', start: '07:30' },
      { day: 'Sunday', start: '09:00' },
      { day: 'Sunday', start: '11:00' },
      { day: 'Sunday', start: '12:45' },
      { day: 'Sunday', start: '14:30', note: 'Español' },
      { day: 'Sunday', start: '17:30', note: 'Life Teen' },
      { day: 'Monday', start: '06:30' },
      { day: 'Monday', start: '09:00' },
      { day: 'Tuesday', start: '09:00' },
      { day: 'Wednesday', start: '06:30' },
      { day: 'Wednesday', start: '09:00' },
      { day: 'Thursday', start: '09:00' },
      { day: 'Friday', start: '06:30' },
      { day: 'Friday', start: '09:00' },
      { day: 'Saturday', start: '09:00' },
      { day: 'Saturday', start: '17:00', note: 'Vigil' },
    ],
    notes: 'Confession generally continues until the last person is heard.',
  },
  {
    id: 'olm-jasper',
    name: 'Our Lady of the Mountains',
    city: 'Jasper',
    address: '1908 Waleska Hwy 108, Jasper, GA 30143',
    lat: 34.4707,
    lng: -84.421,
    phone: '706-253-3078',
    website: 'https://www.olmjasper.org/',
    driveMin: 26,
    confession: [
      { day: 'Friday', start: '10:00', end: '11:00' },
      { day: 'Saturday', start: '15:00', end: '15:45' },
      { day: 'Saturday', start: '17:30', end: '17:45', note: 'Spanish' },
    ],
    adoration: [
      { day: 'Wednesday', start: '18:30', end: '19:30' },
      { day: 'Friday', start: '10:00', end: '11:00' },
    ],
    adorationNote: 'First Friday of the month: 10:00 AM – 8:00 PM.',
    mass: [
      { day: 'Sunday', start: '08:30' },
      { day: 'Sunday', start: '11:00' },
      { day: 'Monday', start: '09:30' },
      { day: 'Tuesday', start: '09:30', note: 'Communion Service' },
      { day: 'Wednesday', start: '18:00' },
      { day: 'Thursday', start: '09:30' },
      { day: 'Friday', start: '09:30' },
      { day: 'Saturday', start: '16:00', note: 'Vigil' },
      { day: 'Saturday', start: '18:00', note: 'Español' },
    ],
  },
  {
    id: 'st-catherine-kennesaw',
    name: 'St. Catherine of Siena',
    city: 'Kennesaw',
    address: '1618 Ben King Rd NW, Kennesaw, GA 30144',
    lat: 34.0274,
    lng: -84.6146,
    phone: '770-428-7139',
    website: 'https://www.stcatherinercc.org/reconciliation',
    driveMin: 25,
    confession: [
      { day: 'Wednesday', start: '18:00', end: '19:00', note: 'Or by appointment' },
      { day: 'Saturday', start: '09:00', end: '10:00' },
      { day: 'Saturday', start: '15:00', end: '16:00' },
    ],
    // Perpetual adoration chapel — 24/7
    adoration: [
      { day: 'Sunday', start: '00:00', end: '23:59' },
      { day: 'Monday', start: '00:00', end: '23:59' },
      { day: 'Tuesday', start: '00:00', end: '23:59' },
      { day: 'Wednesday', start: '00:00', end: '23:59' },
      { day: 'Thursday', start: '00:00', end: '23:59' },
      { day: 'Friday', start: '00:00', end: '23:59' },
      { day: 'Saturday', start: '00:00', end: '23:59' },
    ],
    adorationNote:
      'Perpetual Adoration Chapel — 24 hours a day, 7 days a week. Holy Hour in church on Wednesdays 6–7 PM.',
    mass: [
      { day: 'Sunday', start: '07:30' },
      { day: 'Sunday', start: '10:00' },
      { day: 'Sunday', start: '12:15' },
      { day: 'Sunday', start: '14:00', note: 'Español' },
      { day: 'Sunday', start: '16:30' },
      { day: 'Monday', start: '06:45' },
      { day: 'Monday', start: '09:00' },
      { day: 'Tuesday', start: '06:45' },
      { day: 'Tuesday', start: '09:00' },
      { day: 'Wednesday', start: '06:45' },
      { day: 'Wednesday', start: '09:00' },
      { day: 'Thursday', start: '06:45' },
      { day: 'Thursday', start: '09:00' },
      { day: 'Friday', start: '06:45' },
      { day: 'Friday', start: '09:00' },
      { day: 'Saturday', start: '08:30' },
      { day: 'Saturday', start: '16:30', note: 'Vigil' },
    ],
    massNote:
      'The 6:45 AM weekday Mass is suspended during June & July and on civic holidays.',
  },
  {
    id: 'transfiguration-marietta',
    name: 'Church of the Transfiguration',
    city: 'Marietta',
    address: '1815 Blackwell Rd NE, Marietta, GA 30066',
    lat: 34.0223,
    lng: -84.5102,
    phone: '770-977-1442',
    website: 'https://transfiguration.com/',
    driveMin: 28,
    confession: [
      { day: 'Wednesday', start: '17:30', end: '18:30' },
      { day: 'Saturday', start: '09:15', end: '10:15' },
      { day: 'Saturday', start: '15:30', end: '16:15' },
    ],
    adoration: [
      { day: 'Sunday', start: '18:00', end: '22:00' },
      { day: 'Monday', start: '09:00', end: '22:00' },
      { day: 'Tuesday', start: '09:00', end: '22:00' },
      { day: 'Wednesday', start: '09:00', end: '22:00' },
      { day: 'Thursday', start: '09:00', end: '22:00' },
      { day: 'Friday', start: '09:00', end: '22:00' },
    ],
    adorationNote: 'Adoration chapel — Mon–Fri 9 AM–10 PM, Sun 6–10 PM.',
    mass: [
      { day: 'Sunday', start: '07:45' },
      { day: 'Sunday', start: '09:30' },
      { day: 'Sunday', start: '11:30' },
      { day: 'Sunday', start: '14:00', note: 'Español' },
      { day: 'Sunday', start: '17:00' },
      { day: 'Monday', start: '09:00' },
      { day: 'Tuesday', start: '09:00' },
      { day: 'Tuesday', start: '18:30', note: 'Español' },
      { day: 'Wednesday', start: '09:00' },
      { day: 'Wednesday', start: '18:30' },
      { day: 'Thursday', start: '09:00' },
      { day: 'Thursday', start: '18:30' },
      { day: 'Friday', start: '09:00' },
      { day: 'Saturday', start: '07:30', note: 'First Sat only' },
      { day: 'Saturday', start: '17:00', note: 'Vigil' },
    ],
    notes: 'Verify with parish — schedule may vary by season.',
  },
  {
    id: 'st-francis-cartersville',
    name: 'St. Francis of Assisi',
    city: 'Cartersville',
    address: '850 Douthit Ferry Rd, Cartersville, GA 30120',
    lat: 34.1974,
    lng: -84.8233,
    phone: '770-382-1661',
    website: 'https://stfac.org/reconciliation',
    driveMin: 28,
    confession: [{ day: 'Saturday', start: '15:30', end: '16:30' }],
    adoration: [
      { day: 'Thursday', start: '09:30', end: '19:00' },
      { day: 'Friday', start: '09:30', end: '19:00' },
    ],
    mass: [
      { day: 'Sunday', start: '08:00' },
      { day: 'Sunday', start: '10:00' },
      { day: 'Sunday', start: '12:00', note: 'Español' },
      { day: 'Sunday', start: '14:00', note: 'Bilingual' },
      { day: 'Sunday', start: '16:00', note: 'Kenyan, 3rd Sun' },
      { day: 'Monday', start: '09:00' },
      { day: 'Tuesday', start: '09:00' },
      { day: 'Wednesday', start: '09:00' },
      { day: 'Thursday', start: '09:00', note: 'Communion Service' },
      { day: 'Friday', start: '09:00' },
      { day: 'Saturday', start: '17:00', note: 'Vigil' },
    ],
    massNote: 'Rosary preceeds weekday Mass at 8:20 AM, Mon–Fri.',
    notes: 'Saturday afternoon confessions. Call rectory for appointments.',
  },
  {
    id: 'st-peter-chanel-roswell',
    name: 'St. Peter Chanel',
    city: 'Roswell',
    address: '11330 Woodstock Rd, Roswell, GA 30075',
    lat: 34.061,
    lng: -84.3533,
    phone: '770-645-0036',
    website: 'https://www.stpeterchanel.org/',
    driveMin: 30,
    confession: [
      { day: 'Monday', start: '18:00', end: '18:30' },
      { day: 'Wednesday', start: '07:15', end: '07:45' },
      { day: 'Saturday', start: '09:00', end: '10:00' },
    ],
    // Perpetual except Sat 8:30am-5:30pm and Sun 7am-6pm
    adoration: [
      { day: 'Sunday', start: '00:00', end: '07:00' },
      { day: 'Sunday', start: '18:00', end: '23:59' },
      { day: 'Monday', start: '00:00', end: '23:59' },
      { day: 'Tuesday', start: '00:00', end: '23:59' },
      { day: 'Wednesday', start: '00:00', end: '23:59' },
      { day: 'Thursday', start: '00:00', end: '23:59' },
      { day: 'Friday', start: '00:00', end: '23:59' },
      { day: 'Saturday', start: '00:00', end: '08:30' },
      { day: 'Saturday', start: '17:30', end: '23:59' },
    ],
    adorationNote:
      'Perpetual Adoration Chapel. Pauses Saturday 8:30 AM – 5:30 PM and Sunday 7:00 AM – 6:00 PM.',
    mass: [
      { day: 'Sunday', start: '07:30' },
      { day: 'Sunday', start: '09:00' },
      { day: 'Sunday', start: '10:45' },
      { day: 'Sunday', start: '12:30' },
      { day: 'Sunday', start: '17:00' },
      { day: 'Monday', start: '06:45' },
      { day: 'Monday', start: '08:30' },
      { day: 'Tuesday', start: '06:45' },
      { day: 'Tuesday', start: '08:30' },
      { day: 'Wednesday', start: '06:45' },
      { day: 'Wednesday', start: '08:30' },
      { day: 'Thursday', start: '06:45' },
      { day: 'Thursday', start: '08:30' },
      { day: 'Friday', start: '06:45' },
      { day: 'Friday', start: '08:30' },
      { day: 'Friday', start: '12:00' },
      { day: 'Saturday', start: '08:30' },
      { day: 'Saturday', start: '16:30', note: 'Vigil' },
    ],
  },
  {
    id: 'good-shepherd-cumming',
    name: 'Good Shepherd Catholic Church',
    city: 'Cumming',
    address: '3740 Holtzclaw Rd, Cumming, GA 30041',
    lat: 34.1773,
    lng: -84.1149,
    phone: '770-887-9861',
    website: 'https://gsrcc.net/',
    driveMin: 30,
    confession: [{ day: 'Saturday', start: '15:30', end: '16:30' }],
    adoration: [
      { day: 'Tuesday', start: '17:00', end: '17:45' },
      { day: 'Wednesday', start: '08:15', end: '09:00' },
      { day: 'Thursday', start: '08:15', end: '09:00' },
      { day: 'Friday', start: '08:15', end: '09:00' },
      { day: 'Saturday', start: '08:00', end: '09:30' },
    ],
    adorationNote:
      'Additional silent prayer available in Parish Center Chapel during office hours (Mon–Thu 8 AM – 4 PM, Fri 8 AM – noon).',
    mass: [
      { day: 'Sunday', start: '07:00', note: 'Español (Gym)' },
      { day: 'Sunday', start: '09:00' },
      { day: 'Sunday', start: '11:00' },
      { day: 'Sunday', start: '13:00', note: 'Español' },
      { day: 'Sunday', start: '17:30' },
      { day: 'Monday', start: '09:00' },
      { day: 'Tuesday', start: '09:00' },
      { day: 'Wednesday', start: '09:00' },
      { day: 'Wednesday', start: '19:00', note: 'Español' },
      { day: 'Thursday', start: '09:00' },
      { day: 'Friday', start: '09:00' },
      { day: 'Saturday', start: '09:00' },
      { day: 'Saturday', start: '17:00', note: 'Vigil' },
    ],
    notes: 'Verify schedule — confession times can shift seasonally.',
  },
];

/**
 * Great-circle distance in miles between two lat/lng points.
 * Ported from source `haversine` (Earth radius 3959 miles).
 */
export function haversineMiles(
  aLat: number,
  aLng: number,
  bLat: number,
  bLng: number,
): number {
  const R = 3959;
  const toRad = (x: number): number => (x * Math.PI) / 180;
  const dLat = toRad(bLat - aLat);
  const dLng = toRad(bLng - aLng);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(aLat)) * Math.cos(toRad(bLat)) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

/**
 * Estimate drive minutes from straight-line distance in miles.
 * The source precomputes `driveMin` per parish; when deriving from distance,
 * use ~2.2 min/mi as a rough surface-street estimate.
 */
export function driveMinutes(miles: number): number {
  return Math.round(miles * 2.2);
}

/** Parse "HH:MM" into minutes since midnight. */
function parseMinutes(hhmm: string): [number, number] {
  const [h, m] = hhmm.split(':').map(Number);
  return [h, m];
}

/** A single resolved upcoming confession occurrence at a parish. */
export interface UpcomingSlot {
  parish: Parish;
  day: DayName;
  start: string; // "HH:MM"
  whenLabel: string; // e.g. "Today · 5:00 PM", "Tomorrow · 9:30 AM", "Sat Jun 21 · 3:00 PM"
  date: Date; // concrete start datetime
  end: Date; // concrete end datetime
  note?: string;
}

/**
 * Human-friendly label for an upcoming slot relative to `now`.
 * Ported from source `formatSlotLabel`.
 */
function formatSlotLabel(start: Date, now: Date): string {
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const slotDay = new Date(start.getFullYear(), start.getMonth(), start.getDate());
  const diffDays = Math.round((slotDay.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  const timeStr = start.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  if (diffDays === 0) return `Today · ${timeStr}`;
  if (diffDays === 1) return `Tomorrow · ${timeStr}`;
  if (diffDays < 7) return `${DAY_NAMES[start.getDay()]} · ${timeStr}`;
  return `${DAY_SHORT[start.getDay()]} ${start.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  })} · ${timeStr}`;
}

/**
 * Upcoming confession occurrences for a single parish over the next 14 days,
 * sorted soonest-first. Ported from source `getUpcomingSlots`: a window is
 * included if its end is at or after `now` (so an in-progress slot stays).
 */
export function getUpcomingSlotsForParish(parish: Parish, fromDate: Date): UpcomingSlot[] {
  const slots: UpcomingSlot[] = [];
  for (let dayOffset = 0; dayOffset < 14; dayOffset++) {
    const d = new Date(fromDate);
    d.setDate(d.getDate() + dayOffset);
    const dow = d.getDay();
    const daySlots = parish.confession.filter((s) => dayIndex(s.day) === dow);
    for (const slot of daySlots) {
      const slotStart = new Date(d);
      const [sh, sm] = parseMinutes(slot.start);
      slotStart.setHours(sh, sm, 0, 0);
      const slotEnd = new Date(d);
      const [eh, em] = parseMinutes(slot.end ?? slot.start);
      slotEnd.setHours(eh, em, 0, 0);
      if (slotEnd < fromDate) continue;
      slots.push({
        parish,
        day: slot.day,
        start: slot.start,
        whenLabel: formatSlotLabel(slotStart, fromDate),
        date: slotStart,
        end: slotEnd,
        note: slot.note,
      });
    }
  }
  return slots.sort((a, b) => a.date.getTime() - b.date.getTime());
}

/**
 * Soonest upcoming confession across all parishes, from `now`.
 * Ported from the source live-banner logic: for each parish take its soonest
 * upcoming slot, then order those across parishes by start time. The first
 * entry is the global "Next Opportunity"; entries whose window contains `now`
 * are the "happening now" confessions.
 */
export function getUpcomingSlots(parishes: Parish[], now: Date): UpcomingSlot[] {
  const firsts: UpcomingSlot[] = [];
  for (const parish of parishes) {
    const slots = getUpcomingSlotsForParish(parish, now);
    if (slots.length === 0) continue;
    firsts.push(slots[0]);
  }
  return firsts.sort((a, b) => a.date.getTime() - b.date.getTime());
}

/**
 * Confessions whose window contains `now` (i.e. happening right now).
 * Ported from source `renderLiveBanner` happeningNow detection.
 */
export function getConfessionsHappeningNow(parishes: Parish[], now: Date): UpcomingSlot[] {
  const live: UpcomingSlot[] = [];
  for (const parish of parishes) {
    const slots = getUpcomingSlotsForParish(parish, now);
    if (slots.length === 0) continue;
    const first = slots[0];
    if (first.date <= now && now <= first.end) live.push(first);
  }
  return live;
}

/**
 * Is adoration currently happening at this parish, right now (incl. perpetual)?
 * Ported from source `isAdorationNow`: a full-day "00:00"–"23:59" window for
 * every weekday encodes perpetual adoration, which this returns true for at
 * any time.
 */
export function isAdorationNow(parish: Parish, now: Date): boolean {
  if (!parish.adoration) return false;
  const dow = now.getDay();
  const daySlots = parish.adoration.filter((s) => dayIndex(s.day) === dow);
  if (daySlots.length === 0) return false;
  const nowMinutes = now.getHours() * 60 + now.getMinutes();
  for (const slot of daySlots) {
    const [sh, sm] = parseMinutes(slot.start);
    const [eh, em] = parseMinutes(slot.end ?? slot.start);
    const startMin = sh * 60 + sm;
    const endMin = eh * 60 + em;
    if (nowMinutes >= startMin && nowMinutes <= endMin) return true;
  }
  return false;
}

/**
 * True when a parish exposes the Blessed Sacrament 24/7 — all seven days
 * carry a single full-day "00:00"–"23:59" window. Ported from the source
 * `formatFullSchedule` perpetual detection.
 */
export function isPerpetualAdoration(parish: Parish): boolean {
  if (!parish.adoration) return false;
  return DAY_NAMES.every((day) => {
    const slots = parish.adoration!.filter((s) => s.day === day);
    return slots.length === 1 && slots[0].start === '00:00' && slots[0].end === '23:59';
  });
}

/**
 * Straight-line distance in miles from a location (default: home/Canton)
 * to the parish. Ported from source `getDistance`.
 */
export function distanceToParish(
  parish: Parish,
  from: { lat: number; lng: number } = HOME_LOCATION,
): number {
  return haversineMiles(from.lat, from.lng, parish.lat, parish.lng);
}
