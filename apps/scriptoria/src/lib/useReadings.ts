import { useEffect, useState } from 'react';
import { fetchDayReadings, fetchReadingText, type DayReadings, type LiturgicalColor } from '../data/readings';
import { isoDate } from './dates';

const cache = new Map<string, DayReadings>();

export interface ReadingsResult {
  data: DayReadings | null;
  loading: boolean;
  offline: boolean;
}

/** Fetch a day's readings (live, with offline fallback), cached per ISO date. */
export function useReadings(date: Date): ReadingsResult {
  const key = isoDate(date);
  const [data, setData] = useState<DayReadings | null>(cache.get(key) ?? null);
  const [loading, setLoading] = useState(!cache.has(key));
  const [offline, setOffline] = useState(false);

  useEffect(() => {
    let alive = true;
    if (cache.has(key)) {
      setData(cache.get(key)!);
      setLoading(false);
      return;
    }
    setLoading(true);
    fetchDayReadings(date)
      .then((d) => {
        if (!alive) return;
        cache.set(key, d);
        setData(d);
        setOffline(typeof navigator !== 'undefined' && !navigator.onLine);
      })
      .catch(() => alive && setOffline(true))
      .finally(() => alive && setLoading(false));
    return () => { alive = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  return { data, loading, offline };
}

/** Ensure a specific reading's full text is loaded (on-demand accordion). */
export function useReadingText(reference: string | null, initial: string): string {
  const [text, setText] = useState(initial);
  useEffect(() => {
    setText(initial);
    if (!reference || initial) return;
    let alive = true;
    fetchReadingText(reference).then((t) => { if (alive && t) setText(t); });
    return () => { alive = false; };
  }, [reference, initial]);
  return text;
}

export const COLOR_MAP: Record<LiturgicalColor, { fg: string; label: string }> = {
  green: { fg: 'var(--emerald)', label: 'Ordinary Time · Green' },
  violet: { fg: 'var(--amethyst)', label: 'Violet' },
  white: { fg: 'var(--gold-dark)', label: 'White' },
  gold: { fg: 'var(--gold-dark)', label: 'Gold' },
  red: { fg: 'var(--vermillion)', label: 'Red' },
  rose: { fg: '#b5547a', label: 'Rose' },
};
