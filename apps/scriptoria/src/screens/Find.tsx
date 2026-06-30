import { useState } from 'react';
import { useStore } from '../state/store';
import { useNav } from '../state/nav';
import { Eyebrow, Button } from '../components/ui';
import { PRAYERS } from '../lib/prayers';
import {
  PARISHES,
  HOME_LOCATION,
  DAY_NAMES,
  distanceToParish,
  driveMinutes,
  getUpcomingSlots,
  getUpcomingSlotsForParish,
  isAdorationNow,
  isPerpetualAdoration,
  type Parish,
} from '../data/parishes';

export function FindScreen() {
  const nav = useNav();
  if (nav.route === 'detail') return <ParishDetail />;
  return <FindList />;
}

type Filter = 'all' | 'today' | 'saturday' | 'nearest';

/* ---------- E1 · Find list ---------- */
function FindList() {
  const { state, patch } = useStore();
  const nav = useNav();
  const now = new Date();
  const origin = state.location ?? HOME_LOCATION;
  const [filter, setFilter] = useState<Filter>('all');

  const today = DAY_NAMES[now.getDay()];

  // Soonest confession across all parishes → drives the banner + card emphasis.
  const upcoming = getUpcomingSlots(PARISHES, now);
  const nextSlot = upcoming[0];
  const soonestId = nextSlot?.parish.id;

  function selectFilter(f: Filter) {
    setFilter(f);
    if (f === 'nearest' && typeof navigator !== 'undefined' && navigator.geolocation) {
      try {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            try {
              patch({ location: { label: 'Your location', lat: pos.coords.latitude, lng: pos.coords.longitude } });
            } catch {
              /* ignore */
            }
          },
          () => {
            /* denied / unavailable — ignore gracefully */
          },
        );
      } catch {
        /* ignore */
      }
    }
  }

  // Build the working list per filter.
  let list = PARISHES.filter((p) => {
    if (filter === 'today') return p.confession.some((s) => s.day === today);
    if (filter === 'saturday') return p.confession.some((s) => s.day === 'Saturday');
    return true;
  });

  const milesOf = (p: Parish) => distanceToParish(p, { lat: origin.lat, lng: origin.lng });

  if (filter === 'nearest') {
    list = [...list].sort((a, b) => milesOf(a) - milesOf(b));
  } else if (filter === 'all') {
    // Soonest-confession parish floats up; otherwise by distance.
    list = [...list].sort((a, b) => {
      if (a.id === soonestId) return -1;
      if (b.id === soonestId) return 1;
      return milesOf(a) - milesOf(b);
    });
  } else {
    list = [...list].sort((a, b) => milesOf(a) - milesOf(b));
  }

  const chips: { key: Filter; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'today', label: 'Today' },
    { key: 'saturday', label: 'Saturday' },
    { key: 'nearest', label: 'Nearest' },
  ];

  return (
    <div className="screen-pad anim-rise">
      <div style={{ textAlign: 'center', marginBottom: 4 }}>
        <Eyebrow style={{ fontSize: '0.6rem' }}>Confiteor</Eyebrow>
        <div className="scriptoria-title" style={{ fontSize: '1.05rem', marginTop: 5 }}>Near {state.location?.label ?? HOME_LOCATION.label}</div>
      </div>

      {/* Next Opportunity banner */}
      {nextSlot && (
        <div style={{ border: '1px solid rgba(91,58,114,.35)', borderLeft: '4px solid var(--amethyst)', background: 'rgba(91,58,114,.06)', borderRadius: 'var(--r-leaf)', padding: '12px 14px', margin: '12px 0 6px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--amethyst)' }} />
            <Eyebrow tone="amethyst">Next Opportunity</Eyebrow>
          </div>
          <div style={{ fontFamily: 'var(--font-body)', fontSize: 15.5, color: 'var(--ink)', marginTop: 6 }}>
            <strong style={{ color: 'var(--amethyst)' }}>{nextSlot.parish.name}</strong> — {nextSlot.whenLabel}
          </div>
        </div>
      )}

      {/* Filter chips */}
      <div style={{ display: 'flex', gap: 7, margin: '12px 0 14px', flexWrap: 'wrap' }}>
        {chips.map((c) => {
          const active = filter === c.key;
          return (
            <button
              key={c.key}
              onClick={() => selectFilter(c.key)}
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 10,
                textTransform: 'uppercase',
                letterSpacing: '.1em',
                padding: '7px 14px',
                borderRadius: 'var(--r-pill)',
                cursor: 'pointer',
                background: active ? 'var(--lapis)' : 'transparent',
                color: active ? 'var(--parchment)' : 'var(--ink-soft)',
                border: active ? '1px solid var(--lapis)' : '1px solid var(--gold-30)',
              }}
            >
              {c.label}
            </button>
          );
        })}
      </div>

      {/* Parish cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {list.map((p) => {
          const isSoonest = p.id === soonestId;
          const miles = milesOf(p);
          const driveMin = p.driveMin ?? driveMinutes(miles);
          const slots = getUpcomingSlotsForParish(p, now).slice(0, 2);
          const adorationNow = isAdorationNow(p, now);
          const perpetual = isPerpetualAdoration(p);

          return (
            <div
              key={p.id}
              className="pressable"
              onClick={() => nav.open('detail', { id: p.id })}
              style={{
                border: isSoonest ? '1px solid var(--gold)' : '1px solid var(--gold-20)',
                background: 'var(--leaf-50)',
                boxShadow: isSoonest ? '0 0 0 3px var(--gold-12), var(--sh-soft)' : 'none',
                borderRadius: 'var(--r-leaf)',
                padding: '14px 15px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 10 }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 7, flexWrap: 'wrap' }}>
                    <span style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 600, color: 'var(--ink)' }}>{p.name}</span>
                    {isSoonest && (
                      <span style={{ fontFamily: 'var(--font-display)', fontSize: 8, background: 'var(--gold)', color: 'var(--lapis)', padding: '2px 6px', borderRadius: 2, letterSpacing: '.08em' }}>SOONEST</span>
                    )}
                  </div>
                  <div style={{ fontFamily: 'var(--font-body)', fontStyle: 'italic', fontSize: 14, color: 'var(--ink-soft)', marginTop: 2 }}>
                    {p.city}
                    {adorationNow ? <> · <span style={{ color: 'var(--emerald)' }}>Adoration now</span></> : perpetual ? <> · <span style={{ color: 'var(--emerald)' }}>Perpetual Adoration</span></> : null}
                  </div>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: 10, color: 'var(--gold-dark)', letterSpacing: '.04em' }}>{miles.toFixed(1)} MI</div>
                  <div style={{ fontFamily: 'var(--font-ui)', fontSize: 9, color: 'var(--ink-faint)', marginTop: 2 }}>~{driveMin} MIN</div>
                </div>
              </div>

              {/* Time chips */}
              {slots.length > 0 && (
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 11 }}>
                  {slots.map((s, i) => {
                    const goldChip = isSoonest && i === 0;
                    return (
                      <span
                        key={i}
                        style={{
                          fontFamily: 'var(--font-body)',
                          fontSize: 14,
                          padding: '2px 9px',
                          borderRadius: 3,
                          background: goldChip ? 'var(--gold)' : 'var(--gold-12)',
                          color: goldChip ? 'var(--lapis)' : 'var(--ink-soft)',
                          border: goldChip ? '1px solid var(--gold-dark)' : '1px solid var(--gold-30)',
                          fontWeight: goldChip ? 600 : 400,
                        }}
                      >
                        {shortLabel(s.whenLabel)}
                      </span>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/** Shorten a whenLabel's day token, e.g. "Saturday · 9:30 AM" → "Sat · 9:30 AM". */
function shortLabel(label: string): string {
  const map: Record<string, string> = {
    Sunday: 'Sun', Monday: 'Mon', Tuesday: 'Tue', Wednesday: 'Wed',
    Thursday: 'Thu', Friday: 'Fri', Saturday: 'Sat',
  };
  const [head, ...rest] = label.split(' · ');
  return [map[head] ?? head, ...rest].join(' · ');
}

/* ---------- E2 · Parish detail ---------- */
function ParishDetail() {
  const { state } = useStore();
  const nav = useNav();
  const now = new Date();
  const origin = state.location ?? HOME_LOCATION;
  const p = PARISHES.find((x) => x.id === nav.params.id) ?? PARISHES[0];
  const miles = distanceToParish(p, { lat: origin.lat, lng: origin.lng });
  const adorationNow = isAdorationNow(p, now);
  const perpetual = isPerpetualAdoration(p);

  return (
    <div className="screen-pad anim-rise" style={{ padding: 0 }}>
      {/* Lapis header — full-bleed */}
      <div style={{ background: 'linear-gradient(180deg, var(--lapis), var(--lapis-deep))', padding: '18px 20px 20px', textAlign: 'center', position: 'relative', color: 'var(--parchment)' }}>
        <button className="back-btn" style={{ position: 'absolute', left: 18, top: 16, color: 'var(--gold-light)', fontSize: 22 }} onClick={() => nav.home()} aria-label="Back">←</button>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 9.5, letterSpacing: '0.22em', color: 'var(--gold-light)', textTransform: 'uppercase' }}>{p.city} · {miles.toFixed(1)} mi</div>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 19, fontWeight: 600, color: 'var(--parchment)', letterSpacing: '0.03em', marginTop: 5 }}>{p.name}</div>
      </div>

      <div style={{ padding: '16px 18px calc(20px + env(safe-area-inset-bottom))' }}>
        {/* Confession */}
        <Eyebrow tone="amethyst" style={{ marginBottom: 9 }}>Confession</Eyebrow>
        <div style={{ marginBottom: 18 }}>
          {p.confession.map((s, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'baseline',
                padding: '9px 0',
                borderBottom: i < p.confession.length - 1 ? '1px dotted var(--gold-20)' : 'none',
              }}
            >
              <span style={{ fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: 16, color: 'var(--ink)' }}>{s.day}</span>
              <span style={{ fontFamily: 'var(--font-body)', fontSize: 15.5, color: 'var(--ink-soft)' }}>
                {to12h(s.start)}{s.end ? ` – ${to12h(s.end)}` : ''}{s.note ? ` · ${s.note}` : ''}
              </span>
            </div>
          ))}
        </div>

        {/* Adoration */}
        {p.adoration && p.adoration.length > 0 && (
          <div style={{ marginBottom: 18 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 7 }}>
              <Eyebrow tone="emerald">Adoration</Eyebrow>
              {adorationNow && (
                <span style={{ fontFamily: 'var(--font-display)', fontSize: 8, background: 'var(--emerald)', color: 'var(--vellum)', padding: '1px 6px', borderRadius: 2, letterSpacing: '.08em' }}>NOW</span>
              )}
            </div>
            <p style={{ fontFamily: 'var(--font-body)', fontStyle: 'italic', fontSize: 15, lineHeight: 1.5, color: 'var(--ink-soft)', margin: 0 }}>
              {perpetual ? 'Perpetual Adoration in the chapel.' : adorationSentence(p)}
            </p>
          </div>
        )}

        {/* Actions */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 18 }}>
          <ActionButton variant="amethyst" onClick={() => window.open('https://maps.google.com/?q=' + encodeURIComponent(p.name + ' ' + p.address))}>Directions</ActionButton>
          {p.phone && <ActionButton variant="outline" onClick={() => { window.location.href = 'tel:' + p.phone; }}>Call</ActionButton>}
          {p.website && <ActionButton variant="outline" onClick={() => window.open(p.website)}>Website</ActionButton>}
        </div>

        {/* Act of Contrition */}
        <div className="keyline-gold">
          <Eyebrow style={{ marginBottom: 7 }}>An Act of Contrition</Eyebrow>
          <p style={{ fontFamily: 'var(--font-body)', fontStyle: 'italic', fontSize: 15.5, lineHeight: 1.6, color: 'var(--ink)', margin: 0 }}>
            {PRAYERS.actOfContrition.en}
          </p>
        </div>
      </div>
    </div>
  );
}

/* An action button matching the requested flex/centered styling. */
function ActionButton({ variant, onClick, children }: { variant: 'amethyst' | 'outline'; onClick: () => void; children: string }) {
  return (
    <Button
      variant={variant}
      onClick={onClick}
      style={{ flex: 1, textAlign: 'center', justifyContent: 'center', padding: '11px', borderRadius: 'var(--r-leaf)', fontFamily: 'var(--font-display)', fontSize: 11, textTransform: 'uppercase', letterSpacing: '.1em' }}
    >
      {children}
    </Button>
  );
}

/** Format "17:00" → "5:00 PM". */
function to12h(hhmm: string): string {
  const [h, m] = hhmm.split(':').map(Number);
  const period = h >= 12 ? 'PM' : 'AM';
  const hr = h % 12 === 0 ? 12 : h % 12;
  return `${hr}:${String(m).padStart(2, '0')} ${period}`;
}

/** Describe a parish's adoration from its slots / note. */
function adorationSentence(p: Parish): string {
  if (p.adorationNote) return p.adorationNote;
  if (p.adoration && p.adoration.length > 0) {
    return p.adoration
      .map((s) => `${s.day} ${to12h(s.start)}${s.end ? `–${to12h(s.end)}` : ''}`)
      .join(', ') + '.';
  }
  return '';
}
