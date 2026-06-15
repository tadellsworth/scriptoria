/* Re-skins the standalone "Lingua Latina" course (vendor/) to the Scriptoria
   design system and writes it to public/lingua/index.html, where it is served
   same-origin and embedded inside the Learn tab.
   Run: node scripts/build-lingua.mjs */
import { readFileSync, writeFileSync } from 'node:fs';

const SRC = new URL('../vendor/lingua-latina.source.html', import.meta.url).pathname;
const OUT = new URL('../public/lingua/index.html', import.meta.url).pathname;

let html = readFileSync(SRC, 'utf8');

// Injected into <head>, AFTER the source's own <style> (so :root overrides win)
// and BEFORE the body app script (so the theme is seeded before it boots).
const INJECT = `
<!-- Scriptoria mesh: theme sync + design-system re-skin -->
<script>(function(){try{var t=new URLSearchParams(location.search).get('theme');if(!t)return;var k='latina_state';var s={};try{s=JSON.parse(localStorage.getItem(k))||{};}catch(e){}s.darkMode=(t==='dark');localStorage.setItem(k,JSON.stringify(s));}catch(e){}})();</script>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600;700&family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Outfit:wght@400;500;600&display=swap" rel="stylesheet">
<style id="scriptoria-skin">
  :root{
    --parchment:#f4ecd8;--gold:#c9a32f;--gold-light:#e6c558;
    --brown-dark:#2a1f15;--brown-mid:#6a574a;--brown-soft:#6a574a;--brown-muted:#9b8a7a;--brown-faint:#9b8a7a;
    --green:#2d7a4f;--red:#c41e1e;--amber:#8a6f15;
    --gold-border:rgba(201,163,47,0.20);--gold-border-strong:rgba(201,163,47,0.30);--gold-border-bright:rgba(201,163,47,0.40);
    --card-bg:rgba(255,255,255,0.50);--card-bg-hover:rgba(255,255,255,0.60);--input-bg:rgba(255,255,255,0.72);
  }
  [data-theme="dark"]{
    --parchment:#161320;--gold:#d8b75a;--gold-light:#ecd07e;
    --brown-dark:#ece2cf;--brown-mid:#c4b69e;--brown-soft:#c4b69e;--brown-muted:#8a7e6a;--brown-faint:#8a7e6a;
    --green:#62b07a;--red:#e87a6a;--amber:#b08a3e;
    --gold-border:rgba(216,183,90,0.20);--gold-border-strong:rgba(216,183,90,0.30);--gold-border-bright:rgba(216,183,90,0.40);
    --card-bg:rgba(255,255,255,0.06);--card-bg-hover:rgba(255,255,255,0.09);--input-bg:rgba(255,255,255,0.10);
  }
  /* Scriptoria typography */
  .app, .app input, .app button, .app textarea, .word-panel, #word-popup-container, #word-panel { font-family:'Cormorant Garamond',Georgia,serif !important; }
  #main-nav, .section-title, .nav-btn, .quick-card .qc-latin { font-family:'Cinzel',Georgia,serif !important; letter-spacing:0.03em; }
  /* Scriptoria provides the frame, back header, and theme control — hide the
     course's standalone chrome. */
  .theme-toggle, .header-ornament, .title, .subtitle, .header-rule, .tagline, footer { display:none !important; }
  body{ background:var(--parchment); }
  .app{ max-width:none !important; margin:0 !important; padding:4px 14px 28px !important; }
  /* Sticky in-course section nav so it stays reachable while scrolling. */
  #main-nav{ position:sticky; top:0; z-index:5; background:var(--parchment); padding-top:6px; }
</style>
`;

if (!html.includes('</head>')) throw new Error('no </head> found in source');
html = html.replace('</head>', INJECT + '\n</head>');

writeFileSync(OUT, html);
console.log('public/lingua/index.html written (' + html.length + ' bytes)');
