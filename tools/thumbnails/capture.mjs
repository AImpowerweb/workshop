// Capture prototype card thumbnails at a given language.
//   node capture.mjs <lang> <outDir> [id ...]
import puppeteer from 'puppeteer-core';
import { mkdirSync } from 'fs';
import { join } from 'path';

const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const BASE = 'http://localhost:5173';

// Capture width in CSS px per prototype; crop height is always width/1.6 (16:10).
// Desktop UIs are captured at their 1024 design width so the layout matches the
// prototype exactly; the phone/watch screens get a wider stage so the device
// sits centred on its background, matching the existing thumbnails.
// Tuned per prototype by sweeping widths against the existing English
// thumbnails, so the Chinese captures reproduce their framing exactly.
const CAPTURE_WIDTH = JSON.parse(
  await import('fs').then((m) =>
    m.readFileSync(new URL('./best-widths.json', import.meta.url), 'utf8'),
  ),
);
const DEFAULT_WIDTH = 1024;

// Extra settle time (ms) for prototypes that animate into their resting state.
const SETTLE = { 'extended-turntaking': 2200, 'meeting-companion': 1800, 'voice-assistant': 7000 };

const [, , lang = 'zh', outDir = 'out', ...only] = process.argv;
const targets = JSON.parse(
  await import('fs').then((m) => m.readFileSync(new URL('./targets.json', import.meta.url), 'utf8')),
);
const list = only.length ? targets.filter((t) => only.includes(t.id)) : targets;

mkdirSync(outDir, { recursive: true });

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: 'new',
  args: ['--force-device-scale-factor=2', '--hide-scrollbars', '--font-render-hinting=none'],
});

for (const target of list) {
  const cw = Number(process.env.CW) || CAPTURE_WIDTH[target.id] || DEFAULT_WIDTH;
  const ch = Math.round(cw / 1.6);

  const page = await browser.newPage();
  await page.evaluateOnNewDocument((l) => {
    window.localStorage.setItem('aimpower-lang', l);
  }, lang);
  // The prototype stage is sized at 78vh, so viewport height changes the
  // layout; VH is tuned to reproduce the original thumbnail framing.
  const vh = Number(process.env.VH || 900);
  await page.setViewport({ width: cw, height: vh, deviceScaleFactor: 2 });

  await page.goto(`${BASE}/#/prototype/${target.id}`, { waitUntil: 'networkidle0' });
  await page.waitForSelector('.prototype-root', { timeout: 15000 });

  // Strip the page chrome so the prototype occupies the full capture width.
  await page.addStyleTag({
    content: `
      /* Scope to the SITE header/footer — some prototypes render their own
         <header> internally and hiding those silently removes their title bar. */
      header:not(.prototype-root *), footer:not(.prototype-root *),
      section[aria-labelledby="about-heading"],
      section[aria-labelledby="info-heading"] { display: none !important; }
      section[aria-labelledby="try-heading"] > div:first-child { display: none !important; }
      .mx-auto.max-w-5xl { max-width: none !important; padding: 0 !important; margin: 0 !important; }
      section[aria-labelledby="try-heading"] .mt-4 { margin-top: 0 !important; }
      .prototype-root { border-radius: 0 !important; }
      body { overflow: hidden !important; }
    `,
  });
  await page.evaluate(() => {
    const box = document.querySelector('section[aria-labelledby="try-heading"] .rounded-2xl');
    if (box) {
      box.style.border = 'none';
      box.style.borderRadius = '0';
      box.style.boxShadow = 'none';
    }
    window.scrollTo(0, 0);
  });

  await new Promise((r) => setTimeout(r, Number(process.env.SETTLE_MS) || SETTLE[target.id] || 1200));

  // Disable animations rather than pausing them. Headless holds entry
  // animations (animation-fill-mode: both) at their 0% keyframe, which renders
  // banners at opacity 0 while still reserving their layout space; `animation:
  // none` drops back to the element's base styles, so they paint normally.
  await page.addStyleTag({
    content: `*, *::before, *::after {
      animation: none !important;
      transition: none !important;
      caret-color: transparent !important;
    }`,
  });
  // Prototypes that auto-scroll a chat pane to the newest message leave an
  // inner scroller offset, and headless does not paint scrolled overflow into a
  // clipped screenshot. Reset them to the top — which is also the framing the
  // existing thumbnails use.
  await page.evaluate(() => {
    document.querySelectorAll('.prototype-root *').forEach((el) => {
      if (el.scrollTop) el.scrollTop = 0;
    });
  });
  await new Promise((r) => setTimeout(r, 250));

  const root = await page.$('.prototype-root');
  const bb = await root.boundingBox();
  const out = join(outDir, `${target.thumbnail.split('/').pop()}`);
  // captureBeyondViewport (Puppeteer's default with `clip`) re-renders the page
  // at a synthetic size, which blanks content inside scrollable containers —
  // it silently emptied the AI Assistant chat pane. The clip is inside the
  // viewport anyway, so turn it off.
  await page.screenshot({
    path: out,
    captureBeyondViewport: false,
    clip: { x: bb.x, y: bb.y, width: cw, height: ch },
  });
  console.log(`${target.id} → ${out}  (${cw}x${ch} @2x)`);
  await page.close();
}

await browser.close();
