/* Thin classical line icons — the one drawn-icon exception in an otherwise
   typographic/Unicode system, used only for the tab bar's functional needs.
   Plus the status-bar signal/wifi/battery glyphs. */

const stroke = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.7,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
};

export function SunIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" {...stroke}>
      <circle cx="12" cy="12" r="4" />
      <line x1="12" y1="2.5" x2="12" y2="5" /><line x1="12" y1="19" x2="12" y2="21.5" />
      <line x1="2.5" y1="12" x2="5" y2="12" /><line x1="19" y1="12" x2="21.5" y2="12" />
      <line x1="5.4" y1="5.4" x2="7.1" y2="7.1" /><line x1="16.9" y1="16.9" x2="18.6" y2="18.6" />
      <line x1="18.6" y1="5.4" x2="16.9" y2="7.1" /><line x1="7.1" y1="16.9" x2="5.4" y2="18.6" />
    </svg>
  );
}
export function FlameIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" {...stroke}>
      <path d="M12 3c.6 2.8 2 4.2 3 5.6 1 1.4 1.5 2.7 1.5 4.4a4.5 4.5 0 0 1-9 0c0-1.2.4-2.2 1-3" />
      <path d="M12 21a2.5 2.5 0 0 0 2.5-2.5c0-1.4-1-2.2-2.5-4-1.5 1.8-2.5 2.6-2.5 4A2.5 2.5 0 0 0 12 21z" />
    </svg>
  );
}
export function BookIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" {...stroke}>
      <path d="M12 6.5C10.5 5 8 4.4 5 5v13c3-.6 5.5 0 7 1.5 1.5-1.5 4-2.1 7-1.5V5c-3-.6-5.5 0-7 1.5z" />
      <line x1="12" y1="6.5" x2="12" y2="20" />
    </svg>
  );
}
export function PinIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" {...stroke}>
      <path d="M12 21s-6-5.1-6-10a6 6 0 0 1 12 0c0 4.9-6 10-6 10z" />
      <circle cx="12" cy="11" r="2.3" />
    </svg>
  );
}
export function UserIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" {...stroke}>
      <circle cx="12" cy="8" r="3.4" />
      <path d="M5.5 20a6.5 6.5 0 0 1 13 0" />
    </svg>
  );
}

export function StatusIcons() {
  return (
    <>
      <svg width="17" height="11" viewBox="0 0 17 11" fill="currentColor">
        <rect x="0" y="7" width="3" height="4" rx="1" /><rect x="4.7" y="5" width="3" height="6" rx="1" />
        <rect x="9.3" y="2.5" width="3" height="8.5" rx="1" /><rect x="14" y="0" width="3" height="11" rx="1" />
      </svg>
      <svg width="16" height="12" viewBox="0 0 16 12" fill="currentColor">
        <path d="M8 2.4c2.4 0 4.6 1 6.2 2.5l-1.5 1.5A6.6 6.6 0 0 0 8 5.7 6.6 6.6 0 0 0 3.3 6.4L1.8 4.9A8.7 8.7 0 0 1 8 2.4zm0 3.7c1.4 0 2.7.6 3.6 1.5l-1.6 1.6c-.5-.5-1.2-.8-2-.8s-1.5.3-2 .8L4.4 7.6A5 5 0 0 1 8 6.1zm0 3.6 1.6 1.6L8 12 6.4 11.3 8 9.7z" />
      </svg>
      <svg width="25" height="12" viewBox="0 0 25 12" fill="none">
        <rect x="0.5" y="0.5" width="21" height="11" rx="3" stroke="currentColor" opacity="0.4" />
        <rect x="2" y="2" width="16" height="8" rx="1.6" fill="currentColor" />
        <rect x="23" y="3.5" width="1.5" height="5" rx="0.75" fill="currentColor" opacity="0.5" />
      </svg>
    </>
  );
}
