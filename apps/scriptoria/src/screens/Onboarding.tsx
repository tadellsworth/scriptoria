import { useStore } from '../state/store';
import { GiltRule } from '../components/ui';

export function Onboarding() {
  const { patch } = useStore();
  return (
    <div className="screen-pad anim-rise" style={{ minHeight: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '32px 34px' }}>
      <div className="coin" style={{ width: 128, height: 128, fontSize: 68, marginBottom: 30 }}>☧</div>
      <div className="scriptoria-display" style={{ fontSize: 40, letterSpacing: '0.06em' }}>Scriptoria</div>
      <p style={{ fontFamily: 'var(--font-body)', fontStyle: 'italic', fontSize: 19, color: 'var(--ink-soft)', margin: '12px 0 0', lineHeight: 1.45 }}>
        Your whole life of prayer,<br />gathered into one quiet manuscript.
      </p>
      <GiltRule ornament="❦" style={{ margin: '26px 0', width: '100%' }} />
      <p style={{ fontFamily: 'var(--font-body)', fontSize: 16.5, color: 'var(--ink)', margin: '0 0 32px', lineHeight: 1.55 }}>
        Daily readings, prayer and the Rosary, the Catechism and Latin, confession near you — and a gentle record of the days you keep.
      </p>
      <button
        className="btn btn-lapis btn-block glow"
        style={{ padding: 15, borderRadius: 'var(--r-lg)', fontSize: 14, letterSpacing: '0.14em' }}
        onClick={() => patch({ onboarded: true })}
      >
        Begin ✠
      </button>
      <button className="back-btn" style={{ marginTop: 16, fontFamily: 'var(--font-ui)', fontSize: 13, color: 'var(--ink-soft)', letterSpacing: '0.02em' }} onClick={() => patch({ onboarded: true })}>
        I already have an account
      </button>
    </div>
  );
}
