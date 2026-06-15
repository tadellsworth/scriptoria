import { useStore } from './state/store';
import { useNav } from './state/nav';
import { AppShell, BareShell } from './components/AppShell';
import { Onboarding } from './screens/Onboarding';
import { TodayScreen } from './screens/Today';
import { PrayScreen } from './screens/Pray';
import { LearnScreen } from './screens/Learn';
import { FindScreen } from './screens/Find';
import { MeScreen } from './screens/Me';

export function App() {
  const { state } = useStore();
  const nav = useNav();

  if (!state.onboarded) {
    return (
      <div className="stage">
        <div className="phone-frame">
          <BareShell>
            <Onboarding />
          </BareShell>
        </div>
      </div>
    );
  }

  return (
    <div className="stage">
      <div className="phone-frame">
        <AppShell>
          {nav.tab === 'today' && <TodayScreen />}
          {nav.tab === 'pray' && <PrayScreen />}
          {nav.tab === 'learn' && <LearnScreen />}
          {nav.tab === 'find' && <FindScreen />}
          {nav.tab === 'me' && <MeScreen />}
        </AppShell>
      </div>
    </div>
  );
}
