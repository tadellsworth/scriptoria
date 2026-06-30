import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';

export type Tab = 'today' | 'pray' | 'learn' | 'find' | 'me';

export interface NavState {
  tab: Tab;
  /** Per-tab sub-route, e.g. 'home' | 'rosary' | 'detail'. */
  route: string;
  /** Free-form params for the current route (parish id, prayer key, etc.). */
  params: Record<string, string>;
}

interface Nav extends NavState {
  go: (tab: Tab, route?: string, params?: Record<string, string>) => void;
  /** Navigate within the current tab. */
  open: (route: string, params?: Record<string, string>) => void;
  /** Return to the current tab's home. */
  home: () => void;
}

const NavContext = createContext<Nav | null>(null);

export function NavProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<NavState>({ tab: 'today', route: 'home', params: {} });

  const go = useCallback((tab: Tab, route = 'home', params: Record<string, string> = {}) => {
    setState({ tab, route, params });
    document.querySelector('.screen-scroll')?.scrollTo({ top: 0 });
  }, []);

  const open = useCallback((route: string, params: Record<string, string> = {}) => {
    setState((s) => ({ ...s, route, params }));
    document.querySelector('.screen-scroll')?.scrollTo({ top: 0 });
  }, []);

  const home = useCallback(() => {
    setState((s) => ({ ...s, route: 'home', params: {} }));
    document.querySelector('.screen-scroll')?.scrollTo({ top: 0 });
  }, []);

  const value = useMemo<Nav>(() => ({ ...state, go, open, home }), [state, go, open, home]);
  return <NavContext.Provider value={value}>{children}</NavContext.Provider>;
}

export function useNav(): Nav {
  const ctx = useContext(NavContext);
  if (!ctx) throw new Error('useNav must be used within NavProvider');
  return ctx;
}
