import { useState } from 'react';
import { useStore } from '../state/store';
import { useNav } from '../state/nav';
import { GiltRule, Eyebrow, BackHeader, Button } from '../components/ui';
import { PRAYERS, PRAYER_LIBRARY } from '../lib/prayers';
import { MYSTERIES, mysteryForDay, buildRosary, beadNumber, ROSARY_BEAD_COUNT } from '../lib/rosary';
import { HOURS, hourStatus, EXAMEN_STEPS } from '../lib/hours';
import { isoDate } from '../lib/dates';

export function PrayScreen() {
  const nav = useNav();
  switch (nav.route) {
    case 'rosary': return <RosaryView />;
    case 'hours': return <HoursView />;
    case 'examen': return <ExamenView />;
    case 'prayer': return <PrayerTextView />;
    default: return <PrayHome />;
  }
}

/* ---------- C1 · Pray home ---------- */
function PrayHome() {
  const nav = useNav();
  const mk = mysteryForDay(new Date());
  const myst = MYSTERIES[mk];
  return (
    <div className="screen-pad anim-rise">
      <div style={{ textAlign: 'center', marginBottom: 4 }}>
        <Eyebrow style={{ fontSize: '0.6rem' }}>Oremus</Eyebrow>
        <div className="scriptoria-title" style={{ fontSize: '1.15rem', marginTop: 5 }}>Prayer</div>
      </div>
      <GiltRule ornament="❧" style={{ margin: '9px 0 15px' }} />

      <div className="lapis-panel pressable" onClick={() => nav.open('rosary')}>
        <div style={{ position: 'absolute', right: 14, top: 14, display: 'flex', gap: 4 }}>
          {[0, 1, 2].map((i) => <span key={i} style={{ width: 7, height: 7, borderRadius: '50%', background: i === 0 ? 'var(--gold)' : 'var(--gold-30)' }} />)}
        </div>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 9.5, letterSpacing: '0.22em', color: 'var(--gold-light)', textTransform: 'uppercase' }}>Today · {['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'][new Date().getDay()]}</div>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 21, letterSpacing: '0.03em', margin: '6px 0 3px' }}>The Holy Rosary</div>
        <div style={{ fontFamily: 'var(--font-body)', fontStyle: 'italic', fontSize: 16, opacity: 0.85 }}>{myst.name}</div>
        <div style={{ marginTop: 14, display: 'inline-flex' }}>
          <span className="btn btn-gold" style={{ padding: '9px 18px', fontSize: '0.75rem' }}>Begin ✠</span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 11, margin: '14px 0' }}>
        <div className="vellum pressable" onClick={() => nav.open('hours')}>
          <div style={{ fontFamily: 'var(--font-display)', color: 'var(--gold)', fontSize: 20, lineHeight: 1 }}>☩</div>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 14.5, color: 'var(--lapis)', letterSpacing: '0.04em', marginTop: 8 }}>Liturgy of the Hours</div>
          <div style={{ fontFamily: 'var(--font-body)', fontStyle: 'italic', fontSize: 13.5, color: 'var(--ink-soft)' }}>The canonical day</div>
        </div>
        <div className="vellum pressable" onClick={() => nav.open('examen')}>
          <div style={{ fontFamily: 'var(--font-display)', color: 'var(--gold)', fontSize: 20, lineHeight: 1 }}>✦</div>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 14.5, color: 'var(--lapis)', letterSpacing: '0.04em', marginTop: 8 }}>Daily Examen</div>
          <div style={{ fontFamily: 'var(--font-body)', fontStyle: 'italic', fontSize: 13.5, color: 'var(--ink-soft)' }}>Five steps · this evening</div>
        </div>
      </div>

      <Eyebrow style={{ margin: '4px 2px 8px' }}>The Prayer Library</Eyebrow>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {PRAYER_LIBRARY.map((key) => (
          <div key={key} className="row" onClick={() => nav.open('prayer', { key })}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
              <span style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 16.5, color: 'var(--ink)' }}>{PRAYERS[key].latinTitle}</span>
              <span style={{ fontFamily: 'var(--font-body)', fontStyle: 'italic', fontSize: 14, color: 'var(--ink-faint)' }}>{PRAYERS[key].title}</span>
            </div>
            <span style={{ color: 'var(--ink-faint)' }}>›</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------- C2 · Rosary player ---------- */
function RosaryView() {
  const { state } = useStore();
  const nav = useNav();
  const mk = mysteryForDay(new Date());
  const myst = MYSTERIES[mk];
  const steps = buildRosary(mk);
  const [i, setI] = useState(0);
  const cur = steps[i];
  const num = beadNumber(steps, i);
  const mysteryIdx = i >= 6 ? Math.min(Math.floor((i - 6) / 13), 4) : -1;
  const activeDot = Math.max(0, num - 1);

  return (
    <div className="app-rosary" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ background: 'linear-gradient(180deg, var(--lapis), var(--lapis-deep))', padding: '16px 20px 18px', textAlign: 'center', position: 'relative', color: 'var(--parchment)' }}>
        <button className="back-btn" style={{ position: 'absolute', left: 18, top: 16, color: 'var(--gold-light)', fontSize: 22 }} onClick={() => nav.home()} aria-label="Close">✕</button>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 16, letterSpacing: '0.14em', color: 'var(--gold-light)', textTransform: 'uppercase' }}>{myst.name}</div>
        <div style={{ fontFamily: 'var(--font-body)', fontStyle: 'italic', fontSize: 14.5, color: 'rgba(244,236,216,0.75)', marginTop: 3 }}>
          {mysteryIdx >= 0 ? `${myst.list[mysteryIdx]} · Mystery ${mysteryIdx + 1}` : 'Opening Prayers'}
        </div>
        <div style={{ display: 'flex', gap: 3, justifyContent: 'center', alignItems: 'center', marginTop: 12, flexWrap: 'wrap', maxWidth: 280, marginInline: 'auto' }}>
          {Array.from({ length: ROSARY_BEAD_COUNT }).map((_, d) => (
            <span key={d} style={{ width: d === activeDot ? 9 : 5, height: d === activeDot ? 9 : 5, borderRadius: '50%', background: d === activeDot ? 'var(--gold)' : 'var(--gold-30)' }} />
          ))}
        </div>
        <div style={{ fontFamily: 'var(--font-ui)', fontSize: 11, letterSpacing: '0.1em', color: 'rgba(244,236,216,0.6)', marginTop: 8 }}>
          {cur.bead ? `BEAD ${num} OF ${ROSARY_BEAD_COUNT}` : cur.name.toUpperCase()}
        </div>
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '20px 28px', overflowY: 'auto' }}>
        <Eyebrow tone="vermillion" style={{ marginBottom: 14 }}>{PRAYERS[cur.prayerKey].title}</Eyebrow>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: 20, lineHeight: 1.6, color: 'var(--ink)', margin: 0 }}>{cur.en}</p>
        {state.showLatin && (
          <>
            <div style={{ width: 40, height: 1, background: 'var(--gold-30)', margin: '18px 0' }} />
            <p style={{ fontFamily: 'var(--font-body)', fontStyle: 'italic', fontSize: 17, lineHeight: 1.55, color: 'var(--ink-soft)', margin: 0 }}>{cur.la}</p>
          </>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 20px calc(14px + env(safe-area-inset-bottom))', borderTop: '1px solid var(--gold-20)', background: 'var(--gold-04)' }}>
        <button className="btn btn-outline" disabled={i === 0} style={{ opacity: i === 0 ? 0.4 : 1 }} onClick={() => setI((v) => Math.max(0, v - 1))}>← Back</button>
        <button className="btn btn-gold" disabled={i >= steps.length - 1} style={{ opacity: i >= steps.length - 1 ? 0.4 : 1 }} onClick={() => setI((v) => Math.min(steps.length - 1, v + 1))}>Next →</button>
      </div>
    </div>
  );
}

/* ---------- G2 · Liturgy of the Hours ---------- */
function HoursView() {
  const nav = useNav();
  const now = new Date();
  return (
    <div className="screen-pad anim-rise">
      <BackHeader onBack={() => nav.home()} eyebrow="Liturgia Horarum" title="Liturgy of the Hours" />
      <div style={{ position: 'relative', paddingLeft: 28, marginTop: 6 }}>
        <div style={{ position: 'absolute', left: 8, top: 10, bottom: 16, width: 2, background: 'linear-gradient(180deg, var(--gold-30), var(--gold), var(--gold-30))' }} />
        {HOURS.map((h, idx) => {
          const st = hourStatus(idx, now);
          if (st === 'current') {
            return (
              <div key={h.key} style={{ position: 'relative', marginBottom: 11 }}>
                <div className="glow" style={{ position: 'absolute', left: -29, top: 1, width: 18, height: 18, borderRadius: '50%', background: 'radial-gradient(circle at 30% 30%, var(--gold-light), var(--gold) 70%, var(--gold-dark))', border: '2px solid var(--parchment)' }} />
                <div className="vellum" style={{ borderColor: 'var(--gold)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                    <span style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 600, color: 'var(--lapis)', letterSpacing: '0.03em' }}>{h.name} <span style={{ fontFamily: 'var(--font-body)', fontStyle: 'italic', fontWeight: 400, color: 'var(--ink-soft)', fontSize: 15 }}>{h.label}</span></span>
                    <span style={{ fontFamily: 'var(--font-ui)', fontSize: 11, color: 'var(--gold-dark)', letterSpacing: '0.06em' }}>NOW · {h.timeLabel}</span>
                  </div>
                  <p style={{ fontFamily: 'var(--font-body)', fontStyle: 'italic', fontSize: 15, color: 'var(--ink-soft)', margin: '7px 0 0' }}>{h.openingLa}</p>
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--ink-faint)', margin: '2px 0 0' }}>{h.openingEn}</p>
                </div>
              </div>
            );
          }
          const done = st === 'done';
          return (
            <div key={h.key} style={{ position: 'relative', marginBottom: 11 }}>
              <div style={{ position: 'absolute', left: done ? -27 : -26, top: 3, width: done ? 14 : 11, height: done ? 14 : 11, borderRadius: '50%', background: done ? 'var(--emerald)' : 'var(--parchment-3)', border: done ? '2px solid var(--parchment)' : 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--vellum)', fontSize: 8, fontFamily: 'var(--font-ui)', fontWeight: 700 }}>{done ? '✓' : ''}</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <span style={{ fontFamily: 'var(--font-display)', fontSize: 14, fontWeight: 600, color: done ? 'var(--ink-soft)' : 'var(--ink)', letterSpacing: '0.04em' }}>{h.name} <span style={{ fontFamily: 'var(--font-body)', fontStyle: 'italic', fontWeight: 400, color: 'var(--ink-faint)' }}>{h.label}</span></span>
                <span style={{ fontFamily: 'var(--font-ui)', fontSize: 11, color: 'var(--ink-faint)' }}>{h.timeLabel}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ---------- G3 · Daily Examen ---------- */
function ExamenView() {
  const nav = useNav();
  const { dispatch } = useStore();
  const [fields, setFields] = useState<Record<string, string>>({});

  function save() {
    const parts = EXAMEN_STEPS.filter((s) => s.field && fields[s.numeral]).map((s) => `${s.title}: ${fields[s.numeral]}`);
    if (parts.length) dispatch({ type: 'saveJournal', date: isoDate(new Date()), text: `Examen — ${parts.join(' · ')}`, gospel: 'Daily Examen' });
    nav.home();
  }

  return (
    <div className="screen-pad anim-rise">
      <BackHeader onBack={() => nav.home()} eyebrow="Ignatian · this evening" title="The Daily Examen" />
      <GiltRule ornament="✠" style={{ margin: '4px 0 14px' }} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {EXAMEN_STEPS.map((s) => (
          <div key={s.numeral} className="vellum" style={{ padding: '12px 14px' }}>
            <div style={{ display: 'flex', gap: 11, alignItems: 'flex-start' }}>
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15, color: 'var(--gold-dark)', width: 22 }}>{s.numeral}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 14.5, color: 'var(--lapis)', letterSpacing: '0.03em' }}>{s.title}</div>
                <div style={{ fontFamily: 'var(--font-body)', fontStyle: 'italic', fontSize: 14.5, color: 'var(--ink-soft)', lineHeight: 1.4 }}>{s.prompt}</div>
              </div>
            </div>
            {s.field && (
              <textarea
                value={fields[s.numeral] ?? ''}
                onChange={(e) => setFields((f) => ({ ...f, [s.numeral]: e.target.value }))}
                placeholder="Write a few words…"
                style={{ marginTop: 9, width: '100%', border: '1px solid var(--gold-20)', borderRadius: 'var(--r-sm)', background: 'var(--leaf-70)', padding: '9px 11px', fontFamily: 'var(--font-body)', fontSize: 15, color: 'var(--ink)', resize: 'vertical', minHeight: 48 }}
              />
            )}
          </div>
        ))}
      </div>
      <Button variant="gold" block style={{ marginTop: 14 }} onClick={save}>Save to journal</Button>
    </div>
  );
}

/* ---------- Prayer text ---------- */
function PrayerTextView() {
  const { state } = useStore();
  const nav = useNav();
  const prayer = PRAYERS[nav.params.key] ?? PRAYERS.paterNoster;
  return (
    <div className="screen-pad anim-rise">
      <BackHeader onBack={() => nav.home()} eyebrow={prayer.title} title={prayer.latinTitle} />
      <GiltRule ornament="✠" style={{ margin: '4px 0 16px' }} />
      <p style={{ fontFamily: 'var(--font-body)', fontSize: 19, lineHeight: 1.7, color: 'var(--ink)', margin: 0 }}>{prayer.en}</p>
      {state.showLatin && (
        <>
          <div style={{ width: 44, height: 1, background: 'var(--gold)', opacity: 0.5, margin: '20px 0' }} />
          <p style={{ fontFamily: 'var(--font-body)', fontStyle: 'italic', fontSize: 18, lineHeight: 1.7, color: 'var(--ink-soft)', margin: 0 }}>{prayer.la}</p>
        </>
      )}
    </div>
  );
}
