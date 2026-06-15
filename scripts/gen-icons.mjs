/* Generates the Scriptoria app icons from a vector Chi-Rho master.
   Run: NODE_PATH=/tmp/node_modules node scripts/gen-icons.mjs
   (resvg is a build-time-only tool; the committed PNGs are what ship.) */
import { writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
// resvg is a build-time-only tool installed in /tmp; resolve it from there.
const require = createRequire('/tmp/node_modules/');
const { Resvg } = require('@resvg/resvg-js');

const PUB = new URL('../public/', import.meta.url).pathname;

// The Chi-Rho (☧) monogram drawn as vectors so it rasterizes without a font.
// A gilt Rho stem + loop crossed by the Chi, on a deep-lapis seal with a
// faint gold ring — the Scriptoria "gilt coin" mark.
function master({ bleed }) {
  // bleed=true → full square (maskable / apple-touch, iOS rounds corners itself)
  // bleed=false → rounded square (favicon / in-app)
  const radius = bleed ? 0 : 96;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="0.3" y2="1">
      <stop offset="0" stop-color="#274a73"/>
      <stop offset="1" stop-color="#11233a"/>
    </linearGradient>
    <linearGradient id="gold" x1="0" y1="100" x2="0" y2="412" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#f3dd8d"/>
      <stop offset="0.5" stop-color="#e6c558"/>
      <stop offset="1" stop-color="#c79f2c"/>
    </linearGradient>
  </defs>
  <rect width="512" height="512" rx="${radius}" fill="url(#bg)"/>
  <circle cx="256" cy="256" r="224" fill="none" stroke="#e6c558" stroke-opacity="0.40" stroke-width="3"/>
  <circle cx="256" cy="256" r="214" fill="none" stroke="#e6c558" stroke-opacity="0.14" stroke-width="1.5"/>
  <g fill="none" stroke="url(#gold)" stroke-linecap="round" stroke-linejoin="round">
    <!-- Chi (X) — crosses the stem, kept a touch lighter so the Rho leads -->
    <path d="M168 224 L344 360" stroke-width="26"/>
    <path d="M344 224 L168 360" stroke-width="26"/>
    <!-- Rho stem — the dominant vertical, with a clear tail below the Chi -->
    <path d="M256 104 L256 404" stroke-width="32"/>
    <!-- Rho loop — a closed 'P' bowl on the stem -->
    <path d="M256 108 C 332 108 346 150 346 168 C 346 200 318 224 256 224" stroke-width="30"/>
  </g>
</svg>`;
}

const bleedSvg = master({ bleed: true });
const roundSvg = master({ bleed: false });

// Standalone SVGs (favicon + manifest vector entry)
writeFileSync(PUB + 'icon.svg', roundSvg);
writeFileSync(PUB + 'icon-maskable.svg', bleedSvg);

function png(svg, size) {
  return new Resvg(svg, { fitTo: { mode: 'width', value: size } }).render().asPng();
}

// iOS home-screen icon — full-bleed, opaque, 180px (iOS rounds corners).
writeFileSync(PUB + 'apple-touch-icon.png', png(bleedSvg, 180));
// PWA / Android maskable + any
writeFileSync(PUB + 'pwa-192x192.png', png(bleedSvg, 192));
writeFileSync(PUB + 'pwa-512x512.png', png(bleedSvg, 512));
writeFileSync(PUB + 'maskable-512x512.png', png(bleedSvg, 512));
// A larger preview for visual review
writeFileSync('/tmp/logo-preview.png', png(roundSvg, 512));

// ---------- iOS launch (splash) screens ----------
// A centered gilt seal on the lapis launch ground, per device resolution.
import { mkdirSync } from 'node:fs';
mkdirSync(PUB + 'splash', { recursive: true });

function splashSvg(w, h) {
  const s = Math.round(Math.min(w, h) * 0.36); // logo size
  const x = Math.round((w - s) / 2);
  const y = Math.round((h - s) / 2);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <defs><linearGradient id="lg" x1="0" y1="0" x2="0.3" y2="1">
    <stop offset="0" stop-color="#1b3553"/><stop offset="1" stop-color="#0e1d31"/>
  </linearGradient></defs>
  <rect width="${w}" height="${h}" fill="url(#lg)"/>
  <g transform="translate(${x} ${y}) scale(${s / 512})">${roundSvg.replace(/^<svg[^>]*>/, '').replace(/<\/svg>$/, '')}</g>
</svg>`;
}

// device px (w,h) + the CSS media-query dims (cssW,cssH,dpr)
const DEVICES = [
  [1290, 2796, 430, 932, 3], [1179, 2556, 393, 852, 3], [1284, 2778, 428, 926, 3],
  [1170, 2532, 390, 844, 3], [1125, 2436, 375, 812, 3], [1080, 2340, 360, 780, 3],
  [1242, 2688, 414, 896, 3], [828, 1792, 414, 896, 2], [750, 1334, 375, 667, 2],
];
const links = [];
for (const [w, h, cw, ch, dpr] of DEVICES) {
  writeFileSync(`${PUB}splash/splash-${w}x${h}.png`, png(splashSvg(w, h), w));
  links.push(
    `<link rel="apple-touch-startup-image" media="(device-width: ${cw}px) and (device-height: ${ch}px) and (-webkit-device-pixel-ratio: ${dpr}) and (orientation: portrait)" href="/splash/splash-${w}x${h}.png" />`,
  );
}
writeFileSync('/tmp/splash-links.html', links.join('\n'));

console.log('icons written to public/:');
console.log('  icon.svg, icon-maskable.svg');
console.log('  apple-touch-icon.png (180), pwa-192x192.png, pwa-512x512.png, maskable-512x512.png');
console.log(`  splash/ — ${DEVICES.length} iOS launch screens`);
console.log('  /tmp/splash-links.html — <link> tags for index.html');
