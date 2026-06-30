/* Post-build smoke test: load the built bundle in jsdom, mount the React app,
   and drive through every tab + sub-screen, asserting no runtime errors. */
import { readFileSync, readdirSync } from 'node:fs';
import { JSDOM, VirtualConsole } from '/tmp/node_modules/jsdom/lib/api.js';

const DIST = new URL('../dist/', import.meta.url).pathname;
const html = readFileSync(DIST + 'index.html', 'utf8');

const errors = [];
const vc = new VirtualConsole();
vc.on('jsdomError', (e) => errors.push('jsdomError: ' + (e.detail?.message || e.message)));

const dom = new JSDOM(html, {
  runScripts: 'outside-only',
  pretendToBeVisual: true,
  url: 'http://localhost/',
  virtualConsole: vc,
});
const { window } = dom;
const { document } = window;

// Shims (jsdom provides localStorage/requestAnimationFrame natively when url is set)
const def = (name, value) => Object.defineProperty(window, name, { value, configurable: true, writable: true });
if (!window.matchMedia) def('matchMedia', () => ({ matches: false, addEventListener() {}, removeEventListener() {}, addListener() {}, removeListener() {} }));
def('scrollTo', () => {});
def('fetch', () => Promise.reject(new Error('offline-in-test'))); // force offline fallback
Object.defineProperty(window.navigator, 'geolocation', { value: { getCurrentPosition: (ok) => ok({ coords: { latitude: 34.2, longitude: -84.5 } }) }, configurable: true });
const origErr = window.console.error.bind(window.console);
window.console.error = (...a) => { errors.push('console.error: ' + a.map(String).join(' ')); origErr(...a); };
window.HTMLElement.prototype.scrollTo = () => {};

// Load the built JS bundle(s) in order.
const assets = readdirSync(DIST + 'assets').filter((f) => f.endsWith('.js'));
// entry chunk last
assets.sort((a, b) => (a.includes('index') ? 1 : 0) - (b.includes('index') ? 1 : 0));
for (const a of assets) {
  const code = readFileSync(DIST + 'assets/' + a, 'utf8');
  const s = document.createElement('script');
  s.textContent = code;
  document.body.appendChild(s);
}

const settle = (ms = 60) => new Promise((r) => setTimeout(r, ms));
function clickText(txt) {
  const els = [...document.querySelectorAll('button,div,span,a')].filter((e) => (e.textContent || '').replace(/\s+/g, ' ').trim().includes(txt));
  if (!els.length) return false;
  els.sort((a, b) => a.textContent.length - b.textContent.length);
  els[0].dispatchEvent(new window.Event('click', { bubbles: true, cancelable: true }));
  return true;
}
const vis = () => (document.body.textContent || '').replace(/\s+/g, ' ').trim();

(async () => {
  await settle(120);
  const report = [];
  const snap = (label) => report.push(`\n=== ${label} ===\n` + vis().slice(0, 200));

  snap('Onboarding');
  clickText('Begin'); await settle();
  snap('Today');
  for (const t of ['Pray', 'Learn', 'Find', 'Me', 'Today']) { clickText(t); await settle(); snap('Tab ' + t); }

  // sub-flows
  clickText('Pray'); await settle(); clickText('Begin ✠'); await settle(); snap('Rosary');
  clickText('Next →'); await settle(); clickText('Next →'); await settle(); snap('Rosary +2');
  clickText('✕'); await settle();
  clickText('Liturgy of the Hours'); await settle(); snap('Hours');
  clickText('Learn'); await settle(); clickText('Continue lesson'); await settle(); snap('Credo');
  clickText('Learn'); await settle(); clickText('Review flashcards'); await settle(); snap('Flashcard');
  clickText('Find'); await settle(); snap('Find list');
  clickText('Me'); await settle(); clickText('Candlelight'); await settle();
  report.push('\ntheme=' + document.documentElement.getAttribute('data-theme'));
  clickText('My Journal'); await settle(); snap('Journal');

  console.log(report.join('\n'));
  console.log('\n########## RUNTIME ERRORS ##########');
  console.log(errors.length ? errors.join('\n') : 'NONE');
  process.exit(errors.length ? 1 : 0);
})();
