/* Runtime smoke test: mount the REAL React source (via tsx) into a jsdom
   document with browser shims, then drive through every screen and assert
   no runtime errors. Run: node --import /tmp/node_modules/tsx scripts/smoke2.mjs */
import { JSDOM, VirtualConsole } from '/tmp/node_modules/jsdom/lib/api.js';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);

const errors = [];
const vc = new VirtualConsole();
vc.on('jsdomError', (e) => errors.push('jsdomError: ' + (e.detail?.message || e.message)));

const dom = new JSDOM('<!doctype html><html><body><div id="root"></div></body></html>', {
  url: 'http://localhost/', pretendToBeVisual: true, virtualConsole: vc,
});
const { window } = dom;

// Wire jsdom into Node globals so React DOM uses it.
const setGlobal = (name, value) => Object.defineProperty(globalThis, name, { value, configurable: true, writable: true });
setGlobal('window', window);
setGlobal('document', window.document);
setGlobal('navigator', window.navigator);
setGlobal('HTMLElement', window.HTMLElement);
setGlobal('Node', window.Node);
setGlobal('Event', window.Event);
setGlobal('getComputedStyle', window.getComputedStyle.bind(window));
window.matchMedia = () => ({ matches: false, addEventListener() {}, removeEventListener() {}, addListener() {}, removeListener() {} });
window.scrollTo = () => {};
window.HTMLElement.prototype.scrollTo = () => {};
globalThis.requestAnimationFrame = (cb) => setTimeout(() => cb(Date.now()), 0);
globalThis.cancelAnimationFrame = (id) => clearTimeout(id);
globalThis.fetch = () => Promise.reject(new Error('offline-in-test')); // exercise offline fallback
Object.defineProperty(window.navigator, 'geolocation', { value: { getCurrentPosition: (ok) => ok({ coords: { latitude: 34.2, longitude: -84.5 } }) }, configurable: true });
const realErr = console.error;
console.error = (...a) => { const s = a.map(String).join(' '); if (!/not wrapped in act/i.test(s)) errors.push('console.error: ' + s); realErr(...a); };

const React = require('react');
const { createRoot } = require('react-dom/client');
const { StoreProvider } = await import('../src/state/store.tsx');
const { NavProvider } = await import('../src/state/nav.tsx');
const { App } = await import('../src/App.tsx');

const root = createRoot(document.getElementById('root'));
const settle = (ms = 70) => new Promise((r) => setTimeout(r, ms));

function clickText(txt) {
  const els = [...document.querySelectorAll('button,div,span,a')].filter((e) => (e.textContent || '').replace(/\s+/g, ' ').trim().includes(txt));
  if (!els.length) return false;
  els.sort((a, b) => a.textContent.length - b.textContent.length);
  els[0].dispatchEvent(new window.Event('click', { bubbles: true, cancelable: true }));
  return true;
}
const vis = () => (document.getElementById('root').textContent || '').replace(/\s+/g, ' ').trim();

root.render(React.createElement(StoreProvider, null, React.createElement(NavProvider, null, React.createElement(App))));
await settle(150);

const report = [];
const snap = (label) => report.push(`[${label}] ` + vis().slice(0, 150));

snap('Onboarding');
clickText('Begin'); await settle();
snap('Today');
for (const t of ['Pray', 'Learn', 'Find', 'Me', 'Today']) { clickText(t); await settle(); snap(t); }

clickText('Pray'); await settle(); clickText('Begin ✠'); await settle(); snap('Rosary');
clickText('Next →'); await settle(); clickText('Next →'); await settle(); snap('Rosary+2');
clickText('✕'); await settle();
clickText('Liturgy of the Hours'); await settle(); snap('Hours');
clickText('Pray'); await settle(); clickText('Daily Examen'); await settle(); snap('Examen');
clickText('Pray'); await settle(); clickText('Pater Noster'); await settle(); snap('PrayerText');
clickText('Learn'); await settle(); clickText('Continue lesson'); await settle(); snap('Credo');
clickText('Learn'); await settle(); clickText('Review flashcards'); await settle(); snap('Flashcard-front');
clickText('Tap to reveal'); await settle(); snap('Flashcard-revealed');
clickText('Find'); await settle(); snap('Find');
clickText('Saturday'); await settle(); snap('Find-Sat');
clickText('All'); await settle(); clickText('St. Michael'); await settle(); snap('Parish');
clickText('Me'); await settle(); clickText('Candlelight'); await settle();
report.push('theme=' + document.documentElement.getAttribute('data-theme'));
clickText('My Journal'); await settle(); snap('Journal');
clickText('Me'); await settle(); clickText('Confession'); await settle(); clickText('Record a Confession'); await settle(); snap('ConfModal');

console.log(report.join('\n'));
console.log('\n########## RUNTIME ERRORS ##########');
console.log(errors.length ? [...new Set(errors)].join('\n') : 'NONE');
process.exit(errors.length ? 1 : 0);
