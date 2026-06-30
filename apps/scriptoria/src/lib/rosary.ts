import { PRAYERS } from './prayers';

export type MysteryKey = 'joyful' | 'sorrowful' | 'glorious' | 'luminous';

export interface MysterySet {
  key: MysteryKey;
  name: string;
  days: string;
  list: string[];
}

export const MYSTERIES: Record<MysteryKey, MysterySet> = {
  joyful: {
    key: 'joyful', name: 'The Joyful Mysteries', days: 'Monday & Saturday',
    list: ['The Annunciation', 'The Visitation', 'The Nativity', 'The Presentation in the Temple', 'The Finding in the Temple'],
  },
  sorrowful: {
    key: 'sorrowful', name: 'The Sorrowful Mysteries', days: 'Tuesday & Friday',
    list: ['The Agony in the Garden', 'The Scourging at the Pillar', 'The Crowning with Thorns', 'The Carrying of the Cross', 'The Crucifixion and Death'],
  },
  glorious: {
    key: 'glorious', name: 'The Glorious Mysteries', days: 'Wednesday & Sunday',
    list: ['The Resurrection', 'The Ascension', 'The Descent of the Holy Spirit', 'The Assumption of Mary', 'The Coronation of Mary'],
  },
  luminous: {
    key: 'luminous', name: 'The Luminous Mysteries', days: 'Thursday',
    list: ['The Baptism of Jesus', 'The Wedding at Cana', 'The Proclamation of the Kingdom', 'The Transfiguration', 'The Institution of the Eucharist'],
  },
};

/** Mystery set traditionally prayed on a given weekday. */
export function mysteryForDay(date: Date): MysteryKey {
  const d = date.getDay(); // 0 = Sunday
  if (d === 1 || d === 6) return 'joyful';
  if (d === 2 || d === 5) return 'sorrowful';
  if (d === 3 || d === 0) return 'glorious';
  return 'luminous';
}

export interface RosaryStep {
  name: string;
  prayerKey: string;
  en: string;
  la: string;
  /** True for the 59 physical beads; false for spacer prayers (Creed, Glory Be, Fátima). */
  bead: boolean;
  mystery?: string;
}

/**
 * The complete guided Rosary: Apostles' Creed → Our Father → 3 Hail Marys →
 * Glory Be → five decades (Our Father, ten Hail Marys, Glory Be, Fátima prayer).
 * Glory Be / Fátima / Creed advance the prayer but are not counted among the
 * 59 physical beads (they are prayed on the chain / crucifix).
 */
export function buildRosary(mysteryKey: MysteryKey): RosaryStep[] {
  const m = MYSTERIES[mysteryKey];
  const steps: RosaryStep[] = [];
  const p = (key: string, name: string, bead: boolean, mystery?: string): RosaryStep => ({
    name, prayerKey: key, en: PRAYERS[key].en, la: PRAYERS[key].la, bead, mystery,
  });

  steps.push(p('apostlesCreed', "Apostles' Creed", false));
  steps.push(p('paterNoster', 'Our Father', true));
  steps.push(p('aveMaria', 'Hail Mary — for Faith', true));
  steps.push(p('aveMaria', 'Hail Mary — for Hope', true));
  steps.push(p('aveMaria', 'Hail Mary — for Charity', true));
  steps.push(p('gloriaPatri', 'Glory Be', false));

  for (let i = 0; i < 5; i++) {
    steps.push(p('paterNoster', `Our Father — ${m.list[i]}`, true, m.list[i]));
    for (let j = 0; j < 10; j++) steps.push(p('aveMaria', 'Hail Mary', true, m.list[i]));
    steps.push(p('gloriaPatri', 'Glory Be', false, m.list[i]));
    steps.push(p('fatima', 'Fátima Prayer', false, m.list[i]));
  }
  return steps;
}

export const ROSARY_BEAD_COUNT = 59;

/** 1-based physical-bead index of the step (for "Bead X of 59"). */
export function beadNumber(steps: RosaryStep[], index: number): number {
  let n = 0;
  for (let i = 0; i <= index && i < steps.length; i++) if (steps[i].bead) n++;
  return n;
}
