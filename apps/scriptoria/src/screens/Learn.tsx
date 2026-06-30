import { useState } from 'react';
import { useStore, masteredCount, reviewCount } from '../state/store';
import { useNav } from '../state/nav';
import { GiltRule, Eyebrow, Coin, ProgressBar, Button } from '../components/ui';
import { CURRICULUM, type CredoLesson as CredoLessonData, type CredoQuestion } from '../data/credo';
import { VOCAB_UNITS, ALL_CARDS } from '../data/lingua';

export function LearnScreen() {
  const nav = useNav();
  if (nav.route === 'credo') return <CredoLesson />;
  if (nav.route === 'flashcard') return <Flashcard />;
  if (nav.route === 'lingua') return <LinguaCourse />;
  return <LearnHome />;
}

/* ---------- Lingua Latina — the full course (embedded, Scriptoria-skinned) ---------- */
function LinguaCourse() {
  const nav = useNav();
  const { state } = useStore();
  return (
    <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', background: 'var(--parchment)' }}>
      <div className="back-header" style={{ padding: '6px 16px 8px', margin: 0, borderBottom: '1px solid var(--gold-20)', flex: '0 0 auto' }}>
        <button className="back-btn" onClick={() => nav.home()} aria-label="Back to Learn">←</button>
        <div className="scriptoria-title" style={{ fontSize: '1rem', color: 'var(--lapis)' }}>Lingua Latina</div>
      </div>
      <iframe
        title="Lingua Latina — the Latin course"
        // Theme via hash (not query) so the precached lingua/index.html matches
        // exactly and the course works offline; read client-side on load.
        // BASE_URL keeps this correct under the app's deploy base (e.g. /scriptoria/).
        src={`${import.meta.env.BASE_URL}lingua/index.html#theme=${state.theme}`}
        style={{ flex: '1 1 auto', width: '100%', border: 'none', display: 'block' }}
      />
    </div>
  );
}

/* ---------- D1 · Learn home ---------- */
function LearnHome() {
  const { state } = useStore();
  const nav = useNav();

  // Show the unit currently in progress (the one holding the next lesson).
  const firstUnit = CURRICULUM.find((u) => u.lessons.some((l) => !state.credoCompleted.includes(l.id))) ?? CURRICULUM[CURRICULUM.length - 1];
  const allLessons = firstUnit.lessons;
  const total = allLessons.length;
  const completed = allLessons.filter((l) => state.credoCompleted.includes(l.id)).length;
  const nextLesson = allLessons.find((l) => !state.credoCompleted.includes(l.id)) ?? allLessons[allLessons.length - 1];
  const pct = total ? (completed / total) * 100 : 0;

  const review = reviewCount(state);
  const mastered = masteredCount(state);

  return (
    <div className="screen-pad anim-rise">
      <div style={{ textAlign: 'center', marginBottom: 4 }}>
        <Eyebrow style={{ fontSize: '0.6rem' }}>Disce · Study</Eyebrow>
        <div className="scriptoria-title" style={{ fontSize: '1.15rem', marginTop: 5 }}>Learn</div>
      </div>
      <GiltRule ornament="❦" style={{ margin: '9px 0 15px' }} />

      {/* Credo card */}
      <div className="vellum" style={{ marginBottom: 14 }}>
        <div style={{ display: 'flex', gap: 13, alignItems: 'flex-start' }}>
          <Coin size={50}>☧</Coin>
          <div style={{ flex: 1 }}>
            <Eyebrow tone="gold">Credo · Catechism</Eyebrow>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 16, color: 'var(--lapis)', letterSpacing: '0.03em', marginTop: 2 }}>
              {firstUnit.label || firstUnit.title}
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', margin: '14px 0 6px' }}>
          <span style={{ fontFamily: 'var(--font-body)', fontStyle: 'italic', fontSize: 15, color: 'var(--ink-soft)' }}>{nextLesson.title}</span>
          <span style={{ fontFamily: 'var(--font-ui)', fontSize: 11, letterSpacing: '0.06em', color: 'var(--gold-dark)' }}>{completed}/{total}</span>
        </div>
        <ProgressBar pct={pct} />
        <Button variant="gold" block style={{ marginTop: 14 }} onClick={() => nav.open('credo')}>Continue lesson</Button>
      </div>

      {/* Lingua card — entry to the full Latin course */}
      <div className="vellum">
        <div style={{ display: 'flex', gap: 13, alignItems: 'flex-start' }}>
          <Coin size={50} lapis>Λ</Coin>
          <div style={{ flex: 1 }}>
            <Eyebrow>Lingua Latina</Eyebrow>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 16, color: 'var(--lapis)', letterSpacing: '0.03em', marginTop: 2 }}>
              The Latin course
            </div>
          </div>
        </div>
        <p style={{ fontFamily: 'var(--font-body)', fontStyle: 'italic', fontSize: 14.5, color: 'var(--ink-soft)', lineHeight: 1.45, margin: '10px 0 0' }}>
          Vocabulary, prayers, grammar, the Mass, hymns, Scripture &amp; stories — every word tappable, at your own pace.
        </p>
        <div style={{ display: 'flex', gap: 8, margin: '14px 0 0' }}>
          <StatCell value={review} label="to review" color="var(--gold-dark)" />
          <StatCell value={mastered} label="mastered" color="var(--emerald)" />
        </div>
        <Button variant="gold" block style={{ marginTop: 14 }} onClick={() => nav.open('lingua')}>Enter the course →</Button>
        <Button variant="outline" block style={{ marginTop: 8 }} onClick={() => nav.open('flashcard')}>Quick flashcards</Button>
      </div>
    </div>
  );
}

function StatCell({ value, label, color }: { value: number; label: string; color: string }) {
  return (
    <div style={{ flex: 1, border: '1px solid var(--gold-20)', borderRadius: 'var(--r-leaf)', background: 'var(--gold-04)', padding: '11px 8px', textAlign: 'center' }}>
      <div style={{ fontFamily: 'var(--font-display)', fontSize: 19, fontWeight: 700, color }}>{value}</div>
      <div style={{ fontFamily: 'var(--font-ui)', fontSize: 10, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--ink-soft)', marginTop: 3 }}>{label}</div>
    </div>
  );
}

/* ---------- D2 · Credo lesson (de-gamified) ---------- */
const TYPE_LABELS: Record<CredoQuestion['type'], string> = {
  multipleChoice: 'Multiple choice',
  trueFalse: 'True or false',
  match: 'Matching',
  fillBlank: 'Fill the blank',
  tapOrder: 'Tap in order',
};

function CredoLesson() {
  const { state, dispatch } = useStore();
  const nav = useNav();

  const allLessons = CURRICULUM.flatMap((u) => u.lessons);
  const lesson: CredoLessonData = allLessons.find((l) => !state.credoCompleted.includes(l.id)) ?? allLessons[0];
  const questions = lesson.questions;

  const [qIdx, setQIdx] = useState(0);
  const [answered, setAnswered] = useState<number | string | null>(null);

  const question = questions[qIdx];

  function advance() {
    if (qIdx >= questions.length - 1) {
      dispatch({ type: 'completeCredoLesson', id: lesson.id });
      nav.home();
    } else {
      setQIdx((i) => i + 1);
      setAnswered(null);
    }
  }

  return (
    <div className="screen-pad anim-rise">
      {/* Topbar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 22 }}>
        <button className="back-btn" onClick={() => nav.home()} aria-label="Quit" style={{ fontSize: 20 }}>✕</button>
        <div style={{ flex: 1 }}>
          <ProgressBar pct={(qIdx / questions.length) * 100} />
        </div>
        <span style={{ fontFamily: 'var(--font-ui)', fontSize: 12, fontWeight: 700, color: 'var(--ink-soft)' }}>{qIdx + 1}/{questions.length}</span>
      </div>

      <Eyebrow style={{ fontSize: '0.56rem', color: 'var(--ink-faint)' }}>
        {(question.cccRef ?? lesson.cccRef ?? 'CCC')} · {TYPE_LABELS[question.type]}
      </Eyebrow>
      <p style={{ fontFamily: 'var(--font-body)', fontSize: 22, fontWeight: 500, color: 'var(--ink)', margin: '8px 0 22px', lineHeight: 1.4 }}>{question.prompt}</p>

      <QuestionBody question={question} answered={answered} setAnswered={setAnswered} />

      {answered !== null && (
        <div className="keyline-gold" style={{ background: 'rgba(45,122,79,0.08)', borderLeft: '3px solid var(--emerald)', marginTop: 20 }}>
          <Eyebrow tone="emerald" style={{ marginBottom: 7 }}>Deo gratias</Eyebrow>
          {question.explanation && (
            <p style={{ fontFamily: 'var(--font-body)', fontSize: 15.5, lineHeight: 1.55, color: 'var(--ink-soft)', margin: 0 }}>{question.explanation}</p>
          )}
          <Button variant="lapis" block style={{ marginTop: 14 }} onClick={advance}>Continue →</Button>
        </div>
      )}
    </div>
  );
}

function QuestionBody({ question, answered, setAnswered }: {
  question: CredoQuestion;
  answered: number | string | null;
  setAnswered: (v: number | string) => void;
}) {
  const locked = answered !== null;

  /* ---- multipleChoice ---- */
  if (question.type === 'multipleChoice' && question.options) {
    const correctIdx = question.correct as number;
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
        {question.options.map((opt, i) => (
          <OptionRow
            key={i}
            letter={String.fromCharCode(65 + i)}
            text={opt}
            state={optionState(i, correctIdx, answered as number | null, locked)}
            onClick={() => !locked && setAnswered(i)}
          />
        ))}
      </div>
    );
  }

  /* ---- trueFalse ---- */
  if (question.type === 'trueFalse') {
    const correctIdx = (question.correct as boolean) ? 0 : 1;
    const labels = ['True', 'False'];
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
        {labels.map((opt, i) => (
          <OptionRow
            key={i}
            letter={String.fromCharCode(65 + i)}
            text={opt}
            state={optionState(i, correctIdx, answered as number | null, locked)}
            onClick={() => !locked && setAnswered(i)}
          />
        ))}
      </div>
    );
  }

  /* ---- fillBlank ---- */
  if (question.type === 'fillBlank' && question.options) {
    const correctStr = question.correct as string;
    const sentence = (question.sentenceParts ?? []).map((p) => (p === '___' ? (typeof answered === 'string' ? answered : '____') : p)).join('');
    return (
      <div>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: 18, lineHeight: 1.6, color: 'var(--ink)', margin: '0 0 16px' }}>{sentence}</p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {question.options.map((opt, i) => {
            const isChosen = answered === opt;
            const isCorrect = opt === correctStr;
            let border = '1.5px solid var(--gold-30)';
            let bg = 'var(--leaf-70)';
            let color = 'var(--ink)';
            if (locked && isCorrect) { border = '1.5px solid var(--emerald)'; bg = 'rgba(45,122,79,0.1)'; color = 'var(--emerald)'; }
            else if (locked && isChosen) { border = '1.5px solid var(--vermillion)'; color = 'var(--vermillion)'; }
            return (
              <button
                key={i}
                className="pressable"
                onClick={() => !locked && setAnswered(opt)}
                style={{ border, background: bg, color, borderRadius: 'var(--r-pill)', padding: '8px 16px', fontFamily: 'var(--font-body)', fontSize: 16, cursor: locked ? 'default' : 'pointer' }}
              >
                {opt}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  /* ---- match ---- */
  if (question.type === 'match' && question.pairs) {
    return (
      <div>
        <Eyebrow style={{ marginBottom: 9 }}>Study the pairings</Eyebrow>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
          {question.pairs.map(([left, right], i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, border: '1px solid var(--gold-20)', borderRadius: 'var(--r-leaf)', background: 'var(--gold-04)', padding: '11px 13px' }}>
              <span style={{ flex: 1, fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 14, color: 'var(--lapis)', letterSpacing: '0.02em' }}>{left}</span>
              <span style={{ color: 'var(--gold-dark)' }}>→</span>
              <span style={{ flex: 1, fontFamily: 'var(--font-body)', fontStyle: 'italic', fontSize: 15, color: 'var(--ink-soft)' }}>{right}</span>
            </div>
          ))}
        </div>
        {!locked && <Button variant="outline" block style={{ marginTop: 14 }} onClick={() => setAnswered(0)}>Got it</Button>}
      </div>
    );
  }

  /* ---- tapOrder ---- */
  if (question.type === 'tapOrder' && question.options) {
    return (
      <div>
        {!locked ? (
          <>
            <Eyebrow style={{ marginBottom: 9 }}>Tap in order</Eyebrow>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {question.options.map((tok, i) => (
                <button
                  key={i}
                  className="pressable"
                  onClick={() => setAnswered(0)}
                  style={{ border: '1.5px solid var(--gold-30)', background: 'var(--leaf-70)', color: 'var(--ink)', borderRadius: 'var(--r-pill)', padding: '8px 16px', fontFamily: 'var(--font-body)', fontSize: 16, cursor: 'pointer' }}
                >
                  {tok}
                </button>
              ))}
            </div>
          </>
        ) : (
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 20, fontStyle: 'italic', color: 'var(--lapis)', margin: 0, lineHeight: 1.5 }}>{question.options.join(' ')}</p>
        )}
      </div>
    );
  }

  /* ---- fallback ---- */
  return (
    <div>{!locked && <Button variant="outline" block onClick={() => setAnswered(0)}>Continue</Button>}</div>
  );
}

function optionState(i: number, correctIdx: number, answered: number | null, locked: boolean): 'idle' | 'correct' | 'wrong' {
  if (!locked) return 'idle';
  if (i === correctIdx) return 'correct';
  if (i === answered) return 'wrong';
  return 'idle';
}

function OptionRow({ letter, text, state, onClick }: { letter: string; text: string; state: 'idle' | 'correct' | 'wrong'; onClick: () => void }) {
  let border = '1.5px solid var(--gold-30)';
  let bg = 'var(--leaf-70)';
  let textColor = 'var(--ink)';
  let chipBg = 'var(--gold-04)';
  let chipColor = 'var(--gold-dark)';
  let mark = '';
  if (state === 'correct') {
    border = '1.5px solid var(--emerald)';
    bg = 'rgba(45,122,79,0.1)';
    chipColor = 'var(--emerald)';
    mark = '✓';
  } else if (state === 'wrong') {
    border = '1.5px solid var(--vermillion)';
    textColor = 'var(--vermillion)';
    chipColor = 'var(--vermillion)';
  }
  return (
    <div
      className="pressable"
      onClick={onClick}
      style={{ display: 'flex', alignItems: 'center', gap: 12, border, background: bg, borderRadius: 'var(--r-leaf)', padding: '12px 14px' }}
    >
      <span style={{ width: 26, height: 26, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 6, background: chipBg, fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 13, color: chipColor }}>{letter}</span>
      <span style={{ flex: 1, fontFamily: 'var(--font-body)', fontSize: 17, color: textColor }}>{text}</span>
      {mark && <span style={{ color: 'var(--emerald)', fontSize: 16 }}>{mark}</span>}
    </div>
  );
}

/* ---------- D3 · Flashcard ---------- */
function Flashcard() {
  const { state, dispatch } = useStore();
  const nav = useNav();

  const [deck] = useState(() =>
    [...ALL_CARDS]
      .sort((a, b) => (state.linguaBoxes[a.id] ?? 0) - (state.linguaBoxes[b.id] ?? 0))
      .slice(0, 12),
  );
  const [idx, setIdx] = useState(0);
  const [revealed, setRevealed] = useState(false);

  const unitTitle = (id: string) => VOCAB_UNITS.find((u) => u.id === id)?.title ?? 'Vocabulary';

  if (idx >= deck.length) {
    return (
      <div className="screen-pad anim-rise" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', minHeight: '60vh' }}>
        <div style={{ fontFamily: 'var(--font-display)', color: 'var(--gold)', fontSize: 30 }}>✦</div>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 18, color: 'var(--lapis)', letterSpacing: '0.04em', margin: '12px 0 18px' }}>Session complete ✦</div>
        <Button variant="gold" onClick={() => nav.home()}>Done</Button>
      </div>
    );
  }

  const card = deck[idx];

  function recall(knewIt: boolean) {
    dispatch({ type: 'reviewCard', id: card.id, knewIt });
    setRevealed(false);
    setIdx((i) => i + 1);
  }

  return (
    <div className="screen-pad anim-rise">
      {/* Top row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
        <button className="back-btn" onClick={() => nav.home()} aria-label="Close" style={{ fontSize: 20 }}>✕</button>
        <div style={{ flex: 1, display: 'flex', gap: 4 }}>
          {deck.map((_, i) => (
            <span key={i} style={{ flex: 1, height: 5, borderRadius: 'var(--r-pill)', background: i < idx ? 'var(--emerald)' : i === idx ? 'var(--gold)' : 'var(--gold-20)' }} />
          ))}
        </div>
        <span style={{ fontFamily: 'var(--font-ui)', fontSize: 12, color: 'var(--ink-soft)' }}>{idx + 1}/{deck.length}</span>
      </div>

      {/* Flip card */}
      <div
        className={revealed ? 'vellum' : 'vellum pressable'}
        onClick={() => !revealed && setRevealed(true)}
        style={{ padding: '30px 24px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: 320, justifyContent: 'center' }}
      >
        <div style={{ fontFamily: 'var(--font-display)', color: 'var(--gold)', fontSize: 20, lineHeight: 1, marginBottom: 14 }}>☧</div>
        {!revealed ? (
          <>
            <Eyebrow tone="gold" style={{ marginBottom: 18 }}>Latin · {unitTitle(card.unitId)}</Eyebrow>
            <div style={{ fontFamily: 'var(--font-body)', fontStyle: 'italic', fontSize: 22, color: 'var(--ink-faint)' }}>Tap to reveal</div>
          </>
        ) : (
          <>
            <Eyebrow style={{ fontSize: '0.56rem', marginBottom: 14 }}>{card.grammar ?? 'Vocabulary'}</Eyebrow>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 38, fontWeight: 700, color: 'var(--lapis)', letterSpacing: '0.04em', lineHeight: 1.1 }}>{card.latin}</div>
            <div style={{ width: 44, height: 1, background: 'var(--gold)', opacity: 0.6, margin: '16px 0' }} />
            <div style={{ fontFamily: 'var(--font-body)', fontStyle: 'italic', fontSize: 24, color: 'var(--ink)' }}>{card.english}</div>
            {card.example && (
              <div style={{ width: '100%', marginTop: 20, paddingTop: 16, borderTop: '1px dashed var(--gold-30)' }}>
                <Eyebrow style={{ marginBottom: 8 }}>In a phrase</Eyebrow>
                <div style={{ fontFamily: 'var(--font-body)', fontSize: 19, color: 'var(--ink)', borderBottom: '1px dotted var(--gold-dark)', display: 'inline-block' }}>{card.example}</div>
                {card.exampleEn && (
                  <div style={{ fontFamily: 'var(--font-body)', fontStyle: 'italic', fontSize: 16, color: 'var(--ink-faint)', marginTop: 6 }}>{card.exampleEn}</div>
                )}
              </div>
            )}
          </>
        )}
      </div>

      {/* Recall buttons */}
      {revealed && (
        <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
          <Button variant="outline" block style={{ color: 'var(--vermillion-deep)' }} onClick={() => recall(false)}>Again</Button>
          <Button variant="gold" block onClick={() => recall(true)}>Knew it</Button>
        </div>
      )}
    </div>
  );
}
