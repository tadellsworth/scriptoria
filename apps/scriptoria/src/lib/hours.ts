/* The Liturgy of the Hours — the canonical day. */
export interface CanonicalHour {
  key: string;
  name: string;
  label: string;       // e.g. "Morning"
  hour: number;        // 24h clock, for current-hour detection
  timeLabel: string;   // e.g. "6:30 AM"
  openingLa: string;
  openingEn: string;
}

export const HOURS: CanonicalHour[] = [
  { key: 'lauds', name: 'Lauds', label: 'Morning', hour: 6.5, timeLabel: '6:30 AM',
    openingLa: 'Deus, in adiutórium meum inténde.', openingEn: 'O God, come to my assistance.' },
  { key: 'terce', name: 'Terce', label: 'Mid-morning', hour: 9, timeLabel: '9:00 AM',
    openingLa: 'Deus, in adiutórium meum inténde.', openingEn: 'O God, come to my assistance.' },
  { key: 'sext', name: 'Sext', label: 'Midday', hour: 12, timeLabel: '12:00 PM',
    openingLa: 'Deus, in adiutórium meum inténde.', openingEn: 'O God, come to my assistance.' },
  { key: 'none', name: 'None', label: 'Mid-afternoon', hour: 15, timeLabel: '3:00 PM',
    openingLa: 'Deus, in adiutórium meum inténde.', openingEn: 'O God, come to my assistance.' },
  { key: 'vespers', name: 'Vespers', label: 'Evening', hour: 18, timeLabel: '6:00 PM',
    openingLa: 'Deus, in adiutórium meum inténde.', openingEn: 'O God, come to my assistance.' },
  { key: 'compline', name: 'Compline', label: 'Night', hour: 21, timeLabel: '9:00 PM',
    openingLa: 'Iube, Dómine, benedícere.', openingEn: 'Grant, O Lord, a quiet night.' },
];

export type HourStatus = 'done' | 'current' | 'upcoming';

/** The index of the "current" hour for a given time (the latest hour reached). */
export function currentHourIndex(date: Date): number {
  const t = date.getHours() + date.getMinutes() / 60;
  let idx = 0;
  for (let i = 0; i < HOURS.length; i++) if (t >= HOURS[i].hour) idx = i;
  return idx;
}

export function hourStatus(index: number, date: Date): HourStatus {
  const cur = currentHourIndex(date);
  if (index < cur) return 'done';
  if (index === cur) return 'current';
  return 'upcoming';
}

/** The five steps of the Ignatian Daily Examen. */
export interface ExamenStep {
  numeral: string;
  title: string;
  prompt: string;
  field: boolean; // whether this step has a reflection field
}
export const EXAMEN_STEPS: ExamenStep[] = [
  { numeral: 'I', title: 'Gratitude', prompt: 'Give thanks for the gifts of the day.', field: true },
  { numeral: 'II', title: 'Petition', prompt: 'Ask the Spirit to show you your day clearly.', field: false },
  { numeral: 'III', title: 'Review', prompt: 'Walk through the hours. Where was God?', field: true },
  { numeral: 'IV', title: 'Respond', prompt: 'Speak to the Lord about what you find.', field: false },
  { numeral: 'V', title: 'Resolve', prompt: 'Look to tomorrow with hope.', field: false },
];
