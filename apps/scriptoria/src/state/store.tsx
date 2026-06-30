import { createContext, useContext, useEffect, useMemo, useReducer, type ReactNode } from 'react';
import { isoDate, addDays, daysBetween } from '../lib/dates';
import { ALL_CARDS } from '../data/lingua';
import { CURRICULUM } from '../data/credo';

/* ============================================================
   PERSISTED STATE
   ============================================================ */
export interface JournalEntry {
  date: string;        // ISO
  label?: string;      // pre-rendered stamp, e.g. "SAT · 13 JUN · Luke 7:36–8:3"
  gospel?: string;
  text: string;
}
export interface ConfessionRecord {
  date: string;        // ISO of the confession
  penance?: string;
  recordedAt: string;  // ISO timestamp
}

export interface AppState {
  onboarded: boolean;
  theme: 'light' | 'dark';
  showLatin: boolean;
  streak: number;
  lastCheckIn: string | null;
  journal: JournalEntry[];
  confessions: ConfessionRecord[];
  /** Credo lesson ids the user has completed. */
  credoCompleted: string[];
  /** Leitner box (0–4) per Lingua card id; absent = not yet started. */
  linguaBoxes: Record<string, number>;
  profile: { name: string; initials: string; since: string };
  /** Optional saved location for the confession finder; null = use GPS / default. */
  location: { label: string; lat: number; lng: number } | null;
  reminderTime: string;
  readingCycle: string;
}

const STORAGE_KEY = 'scriptoria_v2';

/** Build a believable first-run profile anchored to the real current date so
 *  the app looks alive (like the design) yet every value is real and editable. */
function seedState(): AppState {
  const today = new Date();
  // 48 cards mastered, 12 in active review — matches the design's Unit III stats.
  const boxes: Record<string, number> = {};
  ALL_CARDS.slice(0, 48).forEach((c) => { boxes[c.id] = 4; });
  ALL_CARDS.slice(48, 60).forEach((c) => { boxes[c.id] = 1; });

  return {
    onboarded: false,
    theme: 'light',
    showLatin: true,
    streak: 12,
    lastCheckIn: null,
    journal: [
      {
        date: isoDate(addDays(today, -2)),
        label: 'Luke 7:36–8:3',
        gospel: 'Luke 7:36–8:3',
        text: 'Her many sins are forgiven, for she has loved much. I want to love like that — without counting the cost, without holding back for fear of how it looks.',
      },
      {
        date: isoDate(addDays(today, -3)),
        label: 'The Sacred Heart',
        gospel: 'The Sacred Heart',
        text: 'He leaves the ninety-nine to come and find me. I am not a number to him. The thought steadies me on a restless day.',
      },
    ],
    confessions: [
      { date: isoDate(addDays(today, -21)), penance: 'Three Hail Marys', recordedAt: addDays(today, -21).toISOString() },
    ],
    // A believable head start: the Prologue done and into Part Two (7 lessons).
    credoCompleted: CURRICULUM.flatMap((u) => u.lessons).slice(0, 7).map((l) => l.id),
    linguaBoxes: boxes,
    profile: { name: 'John Mary', initials: 'JM', since: 'Walking with Scriptoria since Lent' },
    location: null,
    reminderTime: '7:00 AM',
    readingCycle: 'Year II · Weekday',
  };
}

function load(): AppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const saved = JSON.parse(raw) as Partial<AppState>;
      return { ...seedState(), ...saved };
    }
  } catch {
    /* fall through to seed */
  }
  return seedState();
}

/* ============================================================
   REDUCER
   ============================================================ */
type Action =
  | { type: 'patch'; patch: Partial<AppState> }
  | { type: 'checkIn' }
  | { type: 'saveJournal'; date: string; text: string; gospel?: string }
  | { type: 'recordConfession'; date: string; penance?: string }
  | { type: 'completeCredoLesson'; id: string }
  | { type: 'reviewCard'; id: string; knewIt: boolean };

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'patch':
      return { ...state, ...action.patch };

    case 'checkIn': {
      const today = isoDate(new Date());
      if (state.lastCheckIn === today) return state;
      let streak = state.streak;
      if (state.lastCheckIn) {
        const diff = daysBetween(new Date(state.lastCheckIn), new Date(today));
        if (diff === 1) streak += 1;
        else if (diff > 1) streak = 1;
      } else if (!streak) {
        streak = 1;
      }
      return { ...state, streak, lastCheckIn: today };
    }

    case 'saveJournal': {
      const existing = state.journal.findIndex((j) => j.date === action.date);
      const entry: JournalEntry = { date: action.date, text: action.text, gospel: action.gospel };
      const journal = existing >= 0
        ? state.journal.map((j, i) => (i === existing ? { ...j, ...entry } : j))
        : [entry, ...state.journal];
      return { ...state, journal };
    }

    case 'recordConfession': {
      const rec: ConfessionRecord = { date: action.date, penance: action.penance, recordedAt: new Date().toISOString() };
      return { ...state, confessions: [rec, ...state.confessions] };
    }

    case 'completeCredoLesson':
      return state.credoCompleted.includes(action.id)
        ? state
        : { ...state, credoCompleted: [...state.credoCompleted, action.id] };

    case 'reviewCard': {
      const box = state.linguaBoxes[action.id] ?? 0;
      const next = action.knewIt ? Math.min(4, box + 1) : Math.max(0, box - 1);
      return { ...state, linguaBoxes: { ...state.linguaBoxes, [action.id]: next } };
    }

    default:
      return state;
  }
}

/* ============================================================
   CONTEXT
   ============================================================ */
interface Store {
  state: AppState;
  dispatch: React.Dispatch<Action>;
  patch: (patch: Partial<AppState>) => void;
}
const StoreContext = createContext<Store | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, load);

  // Persist on every change.
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* ignore quota / private-mode errors */
    }
  }, [state]);

  // Apply theme to the document.
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', state.theme);
  }, [state.theme]);

  // Daily streak check-in once onboarded.
  useEffect(() => {
    if (state.onboarded) dispatch({ type: 'checkIn' });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.onboarded]);

  const value = useMemo<Store>(
    () => ({ state, dispatch, patch: (patch) => dispatch({ type: 'patch', patch }) }),
    [state],
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore(): Store {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used within StoreProvider');
  return ctx;
}

/* ============================================================
   DERIVED SELECTORS
   ============================================================ */
export function masteredCount(state: AppState): number {
  return Object.values(state.linguaBoxes).filter((b) => b >= 4).length;
}
export function reviewCount(state: AppState): number {
  return Object.values(state.linguaBoxes).filter((b) => b > 0 && b < 4).length;
}
export function daysSinceConfession(state: AppState): number | null {
  if (!state.confessions.length) return null;
  const last = state.confessions
    .map((c) => c.date)
    .sort()
    .reverse()[0];
  return daysBetween(new Date(last), new Date());
}
