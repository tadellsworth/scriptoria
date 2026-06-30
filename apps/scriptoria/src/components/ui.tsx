import type { CSSProperties, ReactNode } from 'react';

/* ---------- Gilt rule ---------- */
export function GiltRule({ ornament = '❦', style }: { ornament?: string; style?: CSSProperties }) {
  return (
    <div className="gilt-rule" style={style}>
      <span /><span className="ornament">{ornament}</span><span />
    </div>
  );
}

/* ---------- Eyebrow ---------- */
export function Eyebrow({ children, tone, style }: { children: ReactNode; tone?: 'gold' | 'vermillion' | 'amethyst' | 'emerald'; style?: CSSProperties }) {
  const cls = tone ? `eyebrow eyebrow-${tone}` : 'eyebrow';
  return <div className={cls} style={style}>{children}</div>;
}

/* ---------- Gilt coin ---------- */
export function Coin({ children, size = 50, lapis = false, style }: { children: ReactNode; size?: number; lapis?: boolean; style?: CSSProperties }) {
  return (
    <div className={lapis ? 'coin coin-lapis' : 'coin'} style={{ width: size, height: size, fontSize: size * 0.4, ...style }}>
      {children}
    </div>
  );
}

/* ---------- Masthead (centered: coin/mark, title, sub, eyebrow) ---------- */
export function Masthead({ mark, title, sub, eyebrow }: { mark?: ReactNode; title: string; sub?: string; eyebrow?: string }) {
  return (
    <div style={{ textAlign: 'center', paddingTop: 6 }}>
      {mark}
      <div className="scriptoria-title" style={{ fontSize: '0.95rem', marginTop: mark ? 8 : 0 }}>{title}</div>
      {sub && <div style={{ fontFamily: 'var(--font-body)', fontStyle: 'italic', color: 'var(--ink-soft)', fontSize: '1.0625rem', marginTop: 6 }}>{sub}</div>}
      {eyebrow && <Eyebrow style={{ marginTop: 7, fontSize: '0.6rem' }}>{eyebrow}</Eyebrow>}
    </div>
  );
}

/* ---------- Back header ---------- */
export function BackHeader({ onBack, eyebrow, title }: { onBack: () => void; eyebrow?: string; title: string }) {
  return (
    <div className="back-header">
      <button className="back-btn" onClick={onBack} aria-label="Back">←</button>
      <div>
        {eyebrow && <Eyebrow style={{ fontSize: '0.56rem' }}>{eyebrow}</Eyebrow>}
        <div className="scriptoria-title" style={{ fontSize: '1.0625rem', color: 'var(--lapis)' }}>{title}</div>
      </div>
    </div>
  );
}

/* ---------- Button ---------- */
type Variant = 'gold' | 'lapis' | 'amethyst' | 'outline';
export function Button({ variant = 'gold', block, onClick, children, style }: { variant?: Variant; block?: boolean; onClick?: () => void; children: ReactNode; style?: CSSProperties }) {
  return (
    <button className={`btn btn-${variant}${block ? ' btn-block' : ''}`} onClick={onClick} style={style}>
      {children}
    </button>
  );
}

/* ---------- Progress bar ---------- */
export function ProgressBar({ pct }: { pct: number }) {
  return (
    <div style={{ height: 6, background: 'var(--gold-20)', borderRadius: 'var(--r-pill)', overflow: 'hidden' }}>
      <div style={{ width: `${Math.max(0, Math.min(100, pct))}%`, height: '100%', background: 'linear-gradient(90deg, var(--gold-light), var(--gold))', borderRadius: 'var(--r-pill)' }} />
    </div>
  );
}
