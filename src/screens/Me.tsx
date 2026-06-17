import { useEffect, useRef, useState } from 'react';
import { useStore, daysSinceConfession, masteredCount } from '../state/store';
import { useNav } from '../state/nav';
import { GiltRule, Eyebrow, Coin, BackHeader, Button } from '../components/ui';
import { isoDate, softDate, shortStamp } from '../lib/dates';

export function MeScreen() {
  const nav = useNav();
  if (nav.route === 'journal') return <Journal />;
  if (nav.route === 'confession') return <Confession />;
  if (nav.route === 'settings') return <Settings />;
  return <MeHome />;
}

/* shared row style for tracker / settings rows */
const trackerRow = {
  display: 'flex',
  alignItems: 'center',
  gap: 13,
  padding: '13px 15px',
  border: '1px solid var(--gold-20)',
  borderRadius: 'var(--r-leaf)',
  background: 'var(--leaf-50)',
  cursor: 'pointer',
} as const;

/* ---------- Parchment / Candlelight pill toggle ---------- */
function ThemeToggle() {
  const { state, patch } = useStore();
  const segBase = {
    fontFamily: 'var(--font-ui)',
    fontSize: 11,
    padding: '6px 14px',
    cursor: 'pointer',
  } as const;
  const active = { background: 'var(--lapis)', color: 'var(--parchment)' };
  const inactive = { color: 'var(--ink-soft)' };
  return (
    <div style={{ display: 'flex', border: '1px solid var(--gold-30)', borderRadius: 'var(--r-pill)', overflow: 'hidden' }}>
      <span style={{ ...segBase, ...(state.theme === 'light' ? active : inactive) }} onClick={() => patch({ theme: 'light' })}>Parchment</span>
      <span style={{ ...segBase, ...(state.theme === 'dark' ? active : inactive) }} onClick={() => patch({ theme: 'dark' })}>Candlelight</span>
    </div>
  );
}

/* ---------- F1 · Me home ---------- */
function MeHome() {
  const { state } = useStore();
  const nav = useNav();
  const { profile, streak, confessions, journal, credoCompleted } = state;

  const since = daysSinceConfession(state);
  const lastConfDate = confessions.length
    ? confessions.map((c) => c.date).sort().reverse()[0]
    : null;
  const lastJournalDate = journal.length
    ? journal.map((j) => j.date).sort().reverse()[0]
    : null;

  return (
    <div className="screen-pad anim-rise">
      {/* Profile head */}
      <div style={{ textAlign: 'center', marginBottom: 18 }}>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <Coin size={84}>{profile.initials}</Coin>
        </div>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 21, fontWeight: 700, color: 'var(--lapis)', letterSpacing: '0.03em', marginTop: 12 }}>{profile.name}</div>
        <div style={{ fontFamily: 'var(--font-body)', fontStyle: 'italic', fontSize: 15, color: 'var(--ink-soft)', marginTop: 3 }}>{profile.since}</div>
      </div>

      {/* Quiet streak panel */}
      <div className="lapis-panel" style={{ marginBottom: 14 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 9, color: 'var(--gold-light)', textTransform: 'uppercase', letterSpacing: '0.2em' }}>A quiet streak</div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginTop: 6 }}>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: 34, fontWeight: 700, color: 'var(--parchment)' }}>{streak}</span>
              <span style={{ fontFamily: 'var(--font-body)', fontStyle: 'italic', fontSize: 16, color: 'rgba(244,236,216,0.8)' }}>days kept</span>
            </div>
          </div>
          <span style={{ color: 'var(--gold-light)', fontSize: 30, lineHeight: 1 }}>✦</span>
        </div>
        <div style={{ display: 'flex', gap: 7, marginTop: 14 }}>
          {Array.from({ length: 7 }).map((_, i) => (
            <span key={i} style={{ flex: 1, height: 7, borderRadius: 'var(--r-pill)', background: i < 5 ? 'var(--gold)' : 'rgba(244,236,216,0.25)' }} />
          ))}
        </div>
      </div>

      {/* Tracker rows */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={trackerRow} onClick={() => nav.open('confession')}>
          <span style={{ fontFamily: 'var(--font-display)', color: 'var(--amethyst)', fontSize: 19, width: 24, textAlign: 'center' }}>†</span>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 14.5, fontWeight: 600, color: 'var(--ink)' }}>Confession</div>
            <div style={{ fontFamily: 'var(--font-body)', fontStyle: 'italic', fontSize: 14, color: 'var(--ink-soft)' }}>
              {since ?? '—'} days since{lastConfDate ? ` · last on ${softDate(new Date(lastConfDate))}` : ''}
            </div>
          </div>
          <span style={{ color: 'var(--ink-faint)' }}>›</span>
        </div>

        <div style={trackerRow} onClick={() => nav.open('journal')}>
          <span style={{ fontFamily: 'var(--font-display)', color: 'var(--gold-dark)', fontSize: 19, width: 24, textAlign: 'center' }}>❦</span>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 14.5, fontWeight: 600, color: 'var(--ink)' }}>My Journal</div>
            <div style={{ fontFamily: 'var(--font-body)', fontStyle: 'italic', fontSize: 14, color: 'var(--ink-soft)' }}>
              {journal.length} reflections{lastJournalDate ? ` · last ${softDate(new Date(lastJournalDate))}` : ''}
            </div>
          </div>
          <span style={{ color: 'var(--ink-faint)' }}>›</span>
        </div>

        <div style={trackerRow} onClick={() => nav.go('learn')}>
          <span style={{ fontFamily: 'var(--font-display)', color: 'var(--emerald)', fontSize: 19, width: 24, textAlign: 'center' }}>☧</span>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 14.5, fontWeight: 600, color: 'var(--ink)' }}>Learning</div>
            <div style={{ fontFamily: 'var(--font-body)', fontStyle: 'italic', fontSize: 14, color: 'var(--ink-soft)' }}>
              {credoCompleted.length} lessons · {masteredCount(state)} Latin words mastered
            </div>
          </div>
          <span style={{ color: 'var(--ink-faint)' }}>›</span>
        </div>
      </div>

      {/* Theme toggle row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '13px 15px', border: '1px solid var(--gold-20)', borderRadius: 'var(--r-leaf)', background: 'var(--gold-04)', marginTop: 14 }}>
        <span style={{ fontFamily: 'var(--font-display)', fontSize: 13, fontWeight: 600, color: 'var(--ink)' }}>Theme</span>
        <ThemeToggle />
      </div>

      {/* Settings row */}
      <div className="row" style={{ marginTop: 8 }} onClick={() => nav.open('settings')}>
        <span style={{ fontFamily: 'var(--font-display)', fontSize: 13, fontWeight: 600, color: 'var(--ink)' }}>Settings</span>
        <span style={{ color: 'var(--ink-faint)' }}>›</span>
      </div>
    </div>
  );
}

/* ---------- F2 · Journal ---------- */
function Journal() {
  const { state, dispatch } = useStore();
  const nav = useNav();
  const today = isoDate(new Date());
  const todayEntry = state.journal.find((j) => j.date === today);
  const [text, setText] = useState(todayEntry?.text ?? '');
  const [saved, setSaved] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const fadeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
    if (fadeTimer.current) clearTimeout(fadeTimer.current);
  }, []);

  function onChange(value: string) {
    setText(value);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      dispatch({ type: 'saveJournal', date: today, text: value, gospel: 'today' });
      setSaved(true);
      if (fadeTimer.current) clearTimeout(fadeTimer.current);
      fadeTimer.current = setTimeout(() => setSaved(false), 1800);
    }, 300);
  }

  const past = state.journal.filter((j) => j.date !== today).slice(0, 5);

  return (
    <div className="screen-pad anim-rise">
      <BackHeader onBack={nav.home} eyebrow={shortStamp(new Date())} title="My Journal" />
      <GiltRule ornament="❦" />
      <p style={{ fontFamily: 'var(--font-body)', fontStyle: 'italic', fontSize: 16, color: 'var(--ink-soft)', textAlign: 'center', marginBottom: 12 }}>
        What in today’s Gospel spoke to your heart?
      </p>
      <textarea
        value={text}
        onChange={(e) => onChange(e.target.value)}
        style={{ width: '100%', border: '1px solid var(--gold-30)', borderRadius: 'var(--r-md)', background: 'var(--leaf-70)', padding: '15px 16px', minHeight: 150, fontFamily: 'var(--font-body)', fontSize: 17, lineHeight: 1.7, color: 'var(--ink)', resize: 'vertical' }}
      />
      <div style={{ textAlign: 'right', fontFamily: 'var(--font-body)', fontStyle: 'italic', fontSize: 13, color: 'var(--ink-faint)', opacity: saved ? 1 : 0, transition: 'opacity 0.3s var(--ease)', minHeight: 18, marginTop: 4 }}>
        Saved just now ✦
      </div>

      <Eyebrow style={{ margin: '10px 2px 8px' }}>Past reflections</Eyebrow>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {past.map((j) => (
          <div key={j.date} style={{ border: '1px solid var(--gold-20)', borderRadius: 'var(--r-leaf)', background: 'var(--leaf-50)', padding: '11px 14px' }}>
            <div style={{ fontFamily: 'var(--font-ui)', fontSize: 11, color: 'var(--ink-faint)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              {j.label ? `${shortStamp(new Date(j.date))} · ${j.label}` : shortStamp(new Date(j.date))}
            </div>
            <div style={{ fontFamily: 'var(--font-body)', fontSize: 15.5, color: 'var(--ink-soft)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', marginTop: 3 }}>
              {j.text}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------- G4 · Confession tracker ---------- */
function Confession() {
  const { state, dispatch } = useStore();
  const nav = useNav();
  const [modalOpen, setModalOpen] = useState(false);
  const [penance, setPenance] = useState('');

  const since = daysSinceConfession(state) ?? 0;
  const lastDate = state.confessions.length
    ? state.confessions.map((c) => c.date).sort().reverse()[0]
    : null;

  function save() {
    dispatch({ type: 'recordConfession', date: isoDate(new Date()), penance });
    setModalOpen(false);
  }

  return (
    <div className="screen-pad anim-rise">
      <div style={{ filter: modalOpen ? 'brightness(0.96)' : 'none' }}>
        <BackHeader onBack={nav.home} title="Confession" />

        <div style={{ textAlign: 'center', padding: '14px 0' }}>
          <Eyebrow tone="amethyst">Days since absolution</Eyebrow>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 64, fontWeight: 700, color: 'var(--amethyst)', lineHeight: 1 }}>{since}</div>
          <div style={{ fontFamily: 'var(--font-body)', fontStyle: 'italic', fontSize: 15, color: 'var(--ink-soft)' }}>
            {lastDate ? `Last on ${softDate(new Date(lastDate))}` : 'No confession recorded yet'}
          </div>
        </div>

        <div className="keyline-amethyst">
          <p style={{ fontFamily: 'var(--font-body)', fontStyle: 'italic', fontSize: 16, color: 'var(--ink)', margin: 0 }}>
            “If we confess our sins, he is faithful and just, and will forgive us.”
          </p>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 10, letterSpacing: '0.16em', color: 'var(--ink-faint)', textTransform: 'uppercase', marginTop: 8 }}>1 John 1:9</div>
        </div>

        <Button variant="amethyst" block style={{ marginTop: 14 }} onClick={() => setModalOpen(true)}>Record a Confession</Button>
      </div>

      {modalOpen && (
        <div style={{ position: 'absolute', inset: 0, zIndex: 10 }}>
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(20,15,9,0.5)' }} onClick={() => setModalOpen(false)} />
          <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, width: '100%', background: 'var(--overlay)', borderRadius: '22px 22px 0 0', borderTop: '1px solid var(--gold-30)', padding: '14px 18px 22px', boxShadow: '0 -10px 30px rgba(0,0,0,0.3)' }}>
            <div style={{ width: 38, height: 4, background: 'var(--gold-30)', borderRadius: 'var(--r-pill)', margin: '0 auto 14px' }} />
            <div style={{ textAlign: 'center', marginBottom: 14 }}>
              <div style={{ color: 'var(--amethyst)', fontFamily: 'var(--font-display)', fontSize: 22, lineHeight: 1 }}>†</div>
              <div className="scriptoria-title" style={{ fontSize: 15, marginTop: 4 }}>Record a Confession</div>
            </div>

            <Eyebrow style={{ marginBottom: 6 }}>Date</Eyebrow>
            <div style={{ border: '1px solid var(--gold-30)', borderRadius: 'var(--r-sm)', background: 'var(--leaf-70)', padding: '11px 13px', fontFamily: 'var(--font-body)', fontSize: 15, color: 'var(--ink)', marginBottom: 14 }}>
              {softDate(new Date()).replace(/^the /, 'Today, the ')}
            </div>

            <Eyebrow style={{ marginBottom: 6 }}>Penance assigned</Eyebrow>
            <textarea
              value={penance}
              onChange={(e) => setPenance(e.target.value)}
              placeholder="Three Hail Marys, a kindness to my brother…"
              style={{ width: '100%', border: '1px solid var(--gold-30)', borderRadius: 'var(--r-sm)', background: 'var(--leaf-70)', padding: '11px 13px', minHeight: 64, fontFamily: 'var(--font-body)', fontSize: 15, color: 'var(--ink)', resize: 'vertical', marginBottom: 14 }}
            />

            <div style={{ display: 'flex', gap: 10 }}>
              <Button variant="outline" block onClick={() => setModalOpen(false)}>Cancel</Button>
              <Button variant="amethyst" block onClick={save}>Save ✠</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------- G5 · Settings ---------- */
const REMINDERS = ['6:30 AM', '7:00 AM', '8:00 AM', '12:00 PM', '9:00 PM', 'Off'];
const CYCLES = ['Year I · Weekday', 'Year II · Weekday', 'Sunday · Year A', 'Sunday · Year B', 'Sunday · Year C'];
const cycle = (list: string[], cur: string) => list[(list.indexOf(cur) + 1) % list.length];

function Settings() {
  const { state, patch } = useStore();
  const nav = useNav();

  function renameProfile() {
    const name = window.prompt('Your name', state.profile.name);
    if (!name || !name.trim()) return;
    const initials = name.trim().split(/\s+/).slice(0, 2).map((w) => w[0]!.toUpperCase()).join('');
    patch({ profile: { ...state.profile, name: name.trim(), initials } });
  }

  return (
    <div className="screen-pad anim-rise">
      <BackHeader onBack={nav.home} title="Settings" />

      <Eyebrow style={{ margin: '4px 2px 8px' }}>Appearance</Eyebrow>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={{ ...trackerRow, cursor: 'default', justifyContent: 'space-between' }}>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: 13, fontWeight: 600, color: 'var(--ink)' }}>Theme</span>
          <ThemeToggle />
        </div>
        <div style={{ ...trackerRow, cursor: 'default', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 13, fontWeight: 600, color: 'var(--ink)' }}>Show Latin</div>
            <div style={{ fontFamily: 'var(--font-body)', fontStyle: 'italic', fontSize: 14, color: 'var(--ink-soft)' }}>Beneath prayers &amp; verses</div>
          </div>
          <div
            onClick={() => patch({ showLatin: !state.showLatin })}
            role="switch"
            aria-checked={state.showLatin}
            style={{ width: 44, height: 26, borderRadius: 'var(--r-pill)', background: state.showLatin ? 'var(--gold)' : 'var(--gold-20)', position: 'relative', cursor: 'pointer', transition: 'background 0.2s var(--ease)', flex: '0 0 auto' }}
          >
            <span style={{ position: 'absolute', top: 3, left: state.showLatin ? 21 : 3, width: 20, height: 20, borderRadius: '50%', background: '#fff', transition: 'left 0.2s var(--ease)', boxShadow: '0 1px 3px rgba(0,0,0,0.25)' }} />
          </div>
        </div>
      </div>

      <Eyebrow style={{ margin: '16px 2px 8px' }}>Rhythm</Eyebrow>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <SettingRow label="Daily reminder" value={state.reminderTime} onClick={() => patch({ reminderTime: cycle(REMINDERS, state.reminderTime) })} />
        <SettingRow label="Reading cycle" value={state.readingCycle} onClick={() => patch({ readingCycle: cycle(CYCLES, state.readingCycle) })} />
        <SettingRow label="Confession finder" value={state.location?.label ?? 'Canton, GA'} onClick={() => nav.go('find')} />
      </div>

      <Eyebrow style={{ margin: '16px 2px 8px' }}>Account</Eyebrow>
      <div style={trackerRow} onClick={renameProfile}>
        <span style={{ flex: 1, fontFamily: 'var(--font-display)', fontSize: 13, fontWeight: 600, color: 'var(--ink)' }}>{state.profile.name}</span>
        <span style={{ fontFamily: 'var(--font-body)', fontStyle: 'italic', fontSize: 14, color: 'var(--ink-soft)' }}>Manage ›</span>
      </div>
    </div>
  );
}

function SettingRow({ label, value, onClick }: { label: string; value: string; onClick?: () => void }) {
  return (
    <div style={{ ...trackerRow, cursor: onClick ? 'pointer' : 'default', justifyContent: 'space-between' }} onClick={onClick}>
      <span style={{ fontFamily: 'var(--font-display)', fontSize: 13, fontWeight: 600, color: 'var(--ink)' }}>{label}</span>
      <span style={{ fontFamily: 'var(--font-body)', fontSize: 15, color: 'var(--ink-soft)' }}>{value} ›</span>
    </div>
  );
}
