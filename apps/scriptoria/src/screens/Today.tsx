import { useState } from 'react';
import { useStore } from '../state/store';
import { useNav } from '../state/nav';
import { useReadings, useReadingText, COLOR_MAP } from '../lib/useReadings';
import { getDevotion } from '../data/devotions';
import { liturgicalDateLine, longDate, weekday, addDays } from '../lib/dates';
import { GiltRule, Eyebrow } from '../components/ui';
import type { DayReadings, Reading } from '../data/readings';

export function TodayScreen() {
  const nav = useNav();
  if (nav.route === 'readings') return <ReadingsView />;
  return <LeafView />;
}

/* ---------- A1 · The Leaf ---------- */
function LeafView() {
  const { state } = useStore();
  const nav = useNav();
  const today = new Date();
  const { data, loading } = useReadings(today);
  const devotion = getDevotion(today);

  const gospel = data?.readings.find((r) => /gospel/i.test(r.label));
  const gospelText = useReadingText(gospel?.reference ?? null, gospel?.text ?? '');

  return (
    <div className="screen-pad anim-rise">
      <div style={{ textAlign: 'center', paddingTop: 6 }}>
        <div style={{ fontFamily: 'var(--font-display)', color: 'var(--gold)', fontSize: 34, lineHeight: 1 }}>☧</div>
        <div className="scriptoria-title" style={{ fontSize: '0.95rem', marginTop: 8 }}>Scriptoria</div>
        <div style={{ fontFamily: 'var(--font-body)', fontStyle: 'italic', color: 'var(--ink-soft)', fontSize: '1.0625rem', marginTop: 6 }}>{liturgicalDateLine(today)}</div>
        <Eyebrow style={{ marginTop: 7, fontSize: '0.6rem' }}>{data?.liturgicalDay ?? devotion.liturgicalDay}</Eyebrow>
      </div>

      <GiltRule ornament="❦" style={{ margin: '12px 0 14px' }} />

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, marginBottom: 16 }}>
        <span style={{ color: 'var(--gold)', fontSize: 13 }}>✦</span>
        <span style={{ fontFamily: 'var(--font-ui)', fontSize: 12, letterSpacing: '0.06em', color: 'var(--ink-soft)' }}>
          {state.streak} {state.streak === 1 ? 'day' : 'days'} kept · a quiet streak
        </span>
      </div>

      {/* Gospel card → tap to open the full readings */}
      <div className="vellum pressable" style={{ marginBottom: 14 }} onClick={() => nav.open('readings')}>
        <Eyebrow tone="gold" style={{ textAlign: 'center', marginBottom: 3 }}>Gospel · {gospel?.reference ?? devotion.gospelReference}</Eyebrow>
        <div className="hairline" />
        <p className="dropcap" style={{ fontFamily: 'var(--font-body)', fontSize: 18, lineHeight: 1.6, color: 'var(--ink)', margin: 0 }}>
          {gospelText || (loading ? 'Gathering today’s Gospel…' : '“You have heard it said, ‘An eye for an eye.’ But I say to you, offer no resistance to one who is evil. When someone strikes you on the cheek, turn the other to him as well.”')}
        </p>
      </div>

      {/* A thought to carry */}
      <div className="vellum" style={{ marginBottom: 14, textAlign: 'center' }}>
        <Eyebrow style={{ marginBottom: 9 }}>A thought to carry</Eyebrow>
        <p style={{ fontFamily: 'var(--font-body)', fontStyle: 'italic', fontSize: 17, lineHeight: 1.5, color: 'var(--lapis)', margin: 0 }}>
          {devotion.question || devotion.thought}
        </p>
      </div>

      {/* Let us pray */}
      <div className="keyline-gold">
        <Eyebrow style={{ marginBottom: 7 }}>Let us pray</Eyebrow>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: 16.5, lineHeight: 1.6, color: 'var(--ink)', margin: 0 }}>
          {devotion.prayer}
          <span style={{ display: 'block', marginTop: 8, fontFamily: 'var(--font-display)', fontSize: 11, letterSpacing: '0.28em', color: 'var(--vermillion)' }}>AMEN ✠</span>
        </p>
        {state.showLatin && devotion.prayerLatin && (
          <div style={{ marginTop: 12, paddingTop: 11, borderTop: '1px solid var(--gold-20)' }}>
            <span style={{ fontFamily: 'var(--font-body)', fontStyle: 'italic', color: 'var(--ink-soft)', fontSize: 15, borderBottom: '1px dotted var(--gold-dark)' }}>{devotion.prayerLatin}</span>
            {devotion.prayerLatinGloss && <span style={{ fontFamily: 'var(--font-body)', fontSize: 14.5, color: 'var(--ink-faint)', marginLeft: 8 }}>— {devotion.prayerLatinGloss}</span>}
          </div>
        )}
      </div>
    </div>
  );
}

/* ---------- B1 · Full readings (date nav + accordion + saint) ---------- */
function ReadingsView() {
  const nav = useNav();
  const [offset, setOffset] = useState(0);
  const date = addDays(new Date(), offset);
  const { data, loading } = useReadings(date);

  return (
    <div className="screen-pad anim-rise">
      <div className="back-header">
        <button className="back-btn" onClick={() => nav.home()} aria-label="Back">←</button>
        <div className="scriptoria-title" style={{ fontSize: '1rem' }}>The Day’s Readings</div>
      </div>

      {/* date nav */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 18, margin: '4px 0 14px' }}>
        <button className="back-btn" style={{ width: 34, height: 34, borderRadius: '50%', border: '1px solid var(--gold-30)', justifyContent: 'center', fontSize: 18 }} onClick={() => setOffset((o) => o - 1)} aria-label="Previous day">‹</button>
        <div style={{ textAlign: 'center' }}>
          <Eyebrow style={{ fontSize: '0.56rem' }}>{weekday(date)}</Eyebrow>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 17, color: 'var(--ink)', letterSpacing: '0.03em', marginTop: 2 }}>{longDate(date)}</div>
        </div>
        <button className="back-btn" style={{ width: 34, height: 34, borderRadius: '50%', border: '1px solid var(--gold-30)', justifyContent: 'center', fontSize: 18 }} onClick={() => setOffset((o) => o + 1)} aria-label="Next day">›</button>
      </div>

      {data && <LiturgicalBanner data={data} />}

      {loading && !data && <p style={{ textAlign: 'center', fontFamily: 'var(--font-body)', fontStyle: 'italic', color: 'var(--ink-faint)' }}>Gathering the day’s readings…</p>}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
        {data?.readings.map((r, i) => <ReadingAccordion key={r.label + i} reading={r} startOpen={/gospel/i.test(r.label)} />)}
      </div>

      {data?.saint && (
        <div style={{ display: 'flex', gap: 13, alignItems: 'center', marginTop: 14, padding: '13px 15px', border: '1px solid var(--gold-20)', borderRadius: 'var(--r-leaf)', background: 'var(--gold-04)' }}>
          <div className="coin" style={{ width: 52, height: 52, fontSize: 22 }}>✦</div>
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 15, fontWeight: 600, color: 'var(--lapis)', letterSpacing: '0.02em' }}>{data.saint.name}</div>
            {data.saint.description && <div style={{ fontFamily: 'var(--font-body)', fontStyle: 'italic', fontSize: 14.5, color: 'var(--ink-soft)' }}>{data.saint.description}</div>}
          </div>
        </div>
      )}
    </div>
  );
}

function LiturgicalBanner({ data }: { data: DayReadings }) {
  const c = COLOR_MAP[data.color];
  return (
    <div style={{ textAlign: 'center', padding: '13px 16px', borderRadius: 'var(--r-leaf)', border: `1px solid color-mix(in srgb, ${c.fg} 30%, transparent)`, background: `color-mix(in srgb, ${c.fg} 7%, transparent)`, marginBottom: 14 }}>
      <div style={{ fontFamily: 'var(--font-display)', fontSize: 9, letterSpacing: '0.24em', textTransform: 'uppercase', color: c.fg, opacity: 0.85 }}>{data.season}</div>
      <div style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 600, color: c.fg, letterSpacing: '0.04em', marginTop: 4 }}>{data.liturgicalDay}</div>
    </div>
  );
}

function ReadingAccordion({ reading, startOpen }: { reading: Reading; startOpen: boolean }) {
  const [open, setOpen] = useState(startOpen);
  const text = useReadingText(open ? reading.reference : null, reading.text);
  return (
    <div style={{ border: `1px solid ${open ? 'var(--gold)' : 'var(--gold-20)'}`, borderRadius: 'var(--r-leaf)', background: open ? 'linear-gradient(180deg, var(--vellum), var(--parchment))' : 'var(--leaf-50)', boxShadow: open ? 'var(--sh-vellum)' : 'none', padding: '13px 15px' }}>
      <div className="pressable" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }} onClick={() => setOpen((o) => !o)}>
        <div>
          <Eyebrow tone="vermillion" style={{ fontSize: '0.56rem' }}>{reading.label}</Eyebrow>
          <div style={{ fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 17, color: 'var(--ink)', marginTop: 1 }}>{reading.reference}</div>
        </div>
        <span style={{ color: open ? 'var(--gold-dark)' : 'var(--ink-faint)', fontSize: 16, transform: open ? 'rotate(180deg)' : 'none' }}>⌄</span>
      </div>
      {open && (
        <>
          <div style={{ height: 1, background: 'var(--gold-20)', margin: '12px 0' }} />
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 16.5, lineHeight: 1.62, color: 'var(--ink)', margin: 0, textAlign: 'justify' }}>
            {text || 'Loading the text…'}
          </p>
        </>
      )}
    </div>
  );
}
