import type { ReactNode } from 'react';
import { useNav, type Tab } from '../state/nav';
import { StatusIcons, SunIcon, FlameIcon, BookIcon, PinIcon, UserIcon } from './icons';

const TABS: { tab: Tab; label: string; Icon: () => ReactNode }[] = [
  { tab: 'today', label: 'Today', Icon: SunIcon },
  { tab: 'pray', label: 'Pray', Icon: FlameIcon },
  { tab: 'learn', label: 'Learn', Icon: BookIcon },
  { tab: 'find', label: 'Find', Icon: PinIcon },
  { tab: 'me', label: 'Me', Icon: UserIcon },
];

function StatusBar() {
  return (
    <div className="status-bar">
      <span className="sb-time">9:41</span>
      <span className="sb-icons"><StatusIcons /></span>
    </div>
  );
}

function TabBar() {
  const nav = useNav();
  return (
    <nav className="tab-bar" aria-label="Primary">
      <div className="tabs">
        {TABS.map(({ tab, label, Icon }) => (
          <button key={tab} className={`tab${nav.tab === tab ? ' on' : ''}`} onClick={() => nav.go(tab)} aria-current={nav.tab === tab}>
            <Icon />
            <span>{label}</span>
          </button>
        ))}
      </div>
      <div className="home-ind" />
    </nav>
  );
}

/** Full chrome: status bar + scrolling content + tab bar. */
export function AppShell({ children, hideTabBar }: { children: ReactNode; hideTabBar?: boolean }) {
  return (
    <div className="app-shell">
      <StatusBar />
      <div className="screen-scroll">{children}</div>
      {!hideTabBar && <TabBar />}
    </div>
  );
}

/** Bare chrome (status bar only) — for onboarding. */
export function BareShell({ children }: { children: ReactNode }) {
  return (
    <div className="app-shell">
      <StatusBar />
      <div className="screen-scroll">{children}</div>
    </div>
  );
}
