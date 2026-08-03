# Card thumbnail capture

Regenerates the screenshots used on the prototype cards (`public/thumbnails/`).
English images sit in that folder; Chinese ones in `public/thumbnails/zh/`.

## Running it

The dev server must already be running on port 5173 (`npm run dev` in another
terminal). Then, from anywhere:

```bash
cd tools/thumbnails
npm install puppeteer-core          # once; uses your installed Google Chrome
node capture.mjs zh out             # all prototypes, Chinese
node capture.mjs en out             # all prototypes, English
node capture.mjs zh out workplace-log emergency-report   # just these two
```

Output lands in `out/` at 2× device pixel ratio. Downscale to the 1200×750 the
cards expect before copying into `public/thumbnails/`:

```bash
python3 -c "
from PIL import Image; import glob, os
for f in glob.glob('out/*.png'):
    Image.open(f).convert('RGB').resize((1200,750), Image.LANCZOS).save(f, optimize=True)
"
```

`CHROME` at the top of `capture.mjs` points at the macOS Google Chrome path —
change it on another OS.

## Why the settings files exist

- **`targets.json`** — which prototypes to shoot, their canvas size, and the
  output filename. Regenerate it if prototypes are added or renamed.
- **`best-widths.json`** — the CSS width each prototype is captured at. These
  are not arbitrary: they were found by sweeping widths and picking whichever
  best reproduced the approved English thumbnail, so English and Chinese cards
  keep identical framing. Changing one re-crops that card.

## Three headless quirks this script works around

All three produced silently wrong screenshots — content missing, with no error.
If you rewrite the capture, keep these:

1. **`animation: none`, not `animation-play-state: paused`.** Entry animations
   use `animation-fill-mode: both`, so headless holds them at their `0%`
   keyframe — elements keep their layout space but paint at `opacity: 0`.
   Banners in Speaking-Status Support and the Interview assistant vanished.
2. **`captureBeyondViewport: false`.** Puppeteer's default when a `clip` is
   given re-renders the page at a synthetic size, which blanks anything inside a
   scrollable container. It emptied the entire AI Assistant chat pane.
3. **Scope `header`/`footer` hiding to the site chrome.** The page chrome is
   stripped with `display: none`, but several prototypes render their own
   `<header>`. An unscoped rule deletes their title bars.

Prototypes that reveal content on a timer need a longer settle — see `SETTLE`
in `capture.mjs` (AI Assistant plays its conversation over ~4.7s).
