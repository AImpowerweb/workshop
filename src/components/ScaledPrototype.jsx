import { useEffect, useRef, useState } from 'react';

// ─────────────────────────────────────────────────────────────────────────────
//  Scale-to-fit wrapper for the coded prototypes (mobile friendliness).
//
//  The prototypes are desktop UIs. On containers narrower than their design
//  canvas we render them at full canvas size and CSS-scale them down to fit,
//  so the whole interface stays visible AND fully interactive on a phone
//  (pinch-zoom still works for a closer look). On wide containers we keep the
//  original fill behaviour untouched.
//
//  Per-prototype canvas sizes live in src/data/prototypes.js as
//  `canvas: { w, h }` (defaults below suit the desktop-style screens).
//
//  `fit` mode is for fixed-size devices (phone, watch): the content is shown at
//  its natural size on wide containers and scaled DOWN to fit width on narrow
//  ones (never upscaled, never stretched to fill height), centered horizontally.
// ─────────────────────────────────────────────────────────────────────────────
export default function ScaledPrototype({
  designWidth = 1024,
  designHeight = 700,
  fillHeight = '100%',
  fillMinHeight = 0,
  fit = false,
  children,
}) {
  const ref = useRef(null);
  const [width, setWidth] = useState(0);

  // Track the container's width (rotation, window resize, sidebar changes…).
  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const measure = () => setWidth(el.clientWidth);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Fixed-size device: scale down to fit width (cap at 1), size box to content.
  if (fit) {
    const s = width > 0 ? Math.min(1, width / designWidth) : 1;
    return (
      <div ref={ref} className="prototype-root flex w-full justify-center">
        <div
          className="overflow-hidden"
          style={{ width: Math.round(designWidth * s), height: Math.round(designHeight * s) }}
        >
          <div
            style={{
              width: designWidth,
              height: designHeight,
              transform: `scale(${s})`,
              transformOrigin: 'top left',
            }}
          >
            {children}
          </div>
        </div>
      </div>
    );
  }

  const scale = width > 0 ? width / designWidth : 1;
  const scaled = width > 0 && scale < 1;

  return (
    <div ref={ref} className="prototype-root h-full w-full">
      {scaled ? (
        <div className="overflow-hidden" style={{ height: Math.round(designHeight * scale) }}>
          <div
            className="overflow-hidden"
            style={{
              width: designWidth,
              height: designHeight,
              transform: `scale(${scale})`,
              transformOrigin: 'top left',
            }}
          >
            {children}
          </div>
        </div>
      ) : (
        <div className="overflow-auto" style={{ height: fillHeight, minHeight: fillMinHeight }}>
          {children}
        </div>
      )}
    </div>
  );
}
