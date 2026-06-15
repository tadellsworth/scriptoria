/* Date helpers shared across screens. */
const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

export function isoDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function ordinal(n: number): string {
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

/** "Monday, the 15th of June" — the masthead date on Today. */
export function liturgicalDateLine(date: Date): string {
  return `${DAYS[date.getDay()]}, the ${ordinal(date.getDate())} of ${MONTHS[date.getMonth()]}`;
}

/** "June 15, 2026" */
export function longDate(date: Date): string {
  return `${MONTHS[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
}

/** "Monday" */
export function weekday(date: Date): string {
  return DAYS[date.getDay()];
}

/** "MON · 15 JUN" */
export function shortStamp(date: Date): string {
  return `${DAYS[date.getDay()].slice(0, 3).toUpperCase()} · ${date.getDate()} ${MONTHS[date.getMonth()].slice(0, 3).toUpperCase()}`;
}

/** "the 25th of May" */
export function softDate(date: Date): string {
  return `the ${ordinal(date.getDate())} of ${MONTHS[date.getMonth()]}`;
}

export function addDays(date: Date, n: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + n);
  return d;
}

export function daysBetween(a: Date, b: Date): number {
  const ms = new Date(b).setHours(0, 0, 0, 0) - new Date(a).setHours(0, 0, 0, 0);
  return Math.round(ms / 86400000);
}
