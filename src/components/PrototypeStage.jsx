import { useEffect, useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { content } from '../data/content';
import { useIsPhone, useIsPortrait } from '../hooks/useMediaQuery';
import ScaledPrototype from './ScaledPrototype';

// ─────────────────────────────────────────────────────────────────────────────
//  Hosts one prototype and adapts it to the viewport.
//
//  Most of these prototypes are desktop UIs on a 1024px canvas. Inside a phone's
//  ~330px content column they scale to about a third, which pushes 16px UI text
//  down to ~5px — visible, but not readable or reliably tappable. Two things
//  help, and neither changes the prototypes themselves:
//
//    1. Say so. A short notice sets expectations instead of leaving people
//       pinching at something that looks broken.
//    2. Offer a fullscreen view. It drops the page margins and, in landscape,
//       roughly doubles the scale (0.32 → ~0.79 on a 375×812 phone), which is
//       the difference between illegible and usable.
//
//  Only one copy of the prototype is mounted at a time — opening fullscreen
//  moves it rather than duplicating it, so timers and demo state don't run twice.
//  Device-sized prototypes (phone/watch canvases) already fit and are left alone.
// ─────────────────────────────────────────────────────────────────────────────

const PHONE_CANVAS_MAX = 600;

function Icon({ path, className = 'h-4 w-4' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {path}
    </svg>
  );
}
const ExpandIcon = ({ className }) => <Icon className={className} path={<><path d="M15 3h6v6" /><path d="M9 21H3v-6" /><path d="M21 3l-7 7" /><path d="M3 21l7-7" /></>} />;
const CloseIcon = () => <Icon path={<><path d="M18 6L6 18" /><path d="M6 6l12 12" /></>} className="h-5 w-5" />;

export default function PrototypeStage({ prototype, children }) {
  const { t } = useLanguage();
  const page = content.page;
  const isPhone = useIsPhone();
  const isPortrait = useIsPortrait();
  const [fullscreen, setFullscreen] = useState(false);

  // A device-sized canvas (phone, watch) already fits a phone screen.
  const isDeviceSized = (prototype.canvas?.w ?? 1024) < PHONE_CANVAS_MAX;
  const needsHelp = isPhone && !isDeviceSized;

  // Leaving the phone breakpoint (rotate to a tablet width, resize) should not
  // strand the user in an overlay built for small screens.
  useEffect(() => {
    if (!isPhone && fullscreen) setFullscreen(false);
  }, [isPhone, fullscreen]);

  // Lock background scrolling while the overlay is up, and allow Esc to exit.
  useEffect(() => {
    if (!fullscreen) return undefined;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e) => e.key === 'Escape' && setFullscreen(false);
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
    };
  }, [fullscreen]);

  const stage = (
    <ScaledPrototype
      designWidth={prototype.canvas?.w}
      designHeight={prototype.canvas?.h}
      fit={prototype.fit}
      fillHeight={fullscreen ? 'auto' : '78vh'}
      fillMinHeight={fullscreen ? 0 : 540}
    >
      {children}
    </ScaledPrototype>
  );

  if (fullscreen) {
    return (
      <>
        {/* Placeholder keeps the page from jumping while the prototype is lifted out. */}
        <div className="flex h-40 items-center justify-center rounded-2xl border border-slate-200 bg-slate-100 text-sm text-slate-500">
          {t(page.openFullscreen)}…
        </div>

        <div className="fixed inset-0 z-[100] flex flex-col bg-[#0d1420]" role="dialog" aria-modal="true"
          aria-label={t(prototype.title)}>
          <div className="flex shrink-0 items-center gap-3 border-b border-white/10 px-3 py-2">
            <p className="min-w-0 flex-1 truncate text-sm font-semibold text-white">{t(prototype.title)}</p>
            <button type="button" onClick={() => setFullscreen(false)}
              className="flex h-11 min-w-[44px] items-center gap-1.5 rounded-full bg-white/10 px-4 text-sm font-semibold text-white transition hover:bg-white/20">
              <CloseIcon /> {t(page.closeFullscreen)}
            </button>
          </div>

          {isPortrait && (
            <p className="shrink-0 bg-white/5 px-4 py-2 text-center text-xs text-white/70">
              {t(page.fullscreenHint)}
            </p>
          )}

          {/* Fit to width and let the page scroll vertically: filling the width
              keeps the scale as high as possible, which matters more than
              seeing the whole canvas at once. */}
          <div className="min-h-0 flex-1 overflow-auto">{stage}</div>
        </div>
      </>
    );
  }

  return (
    <>
      {/* The border sits on this outer wrapper, not on the clipping box below.
          `overflow-hidden` clips to the padding box, so a border here would put
          a 1px ring outside the overlay's reach and swallow taps on the rim. */}
      <div className="rounded-2xl border border-slate-200 shadow-sm">
        <div className="relative overflow-hidden rounded-[15px] bg-slate-100">
          {/* At phone scale the controls are a few pixels tall, so tapping them
              does nothing useful. Suppress input on the shrunken copy and let the
              whole frame act as one target that opens the readable view instead. */}
          <div className={needsHelp ? 'pointer-events-none select-none' : undefined}>{stage}</div>

          {needsHelp && (
            <button
              type="button"
              onClick={() => setFullscreen(true)}
              aria-label={`${t(page.openFullscreen)} — ${t(prototype.title)}`}
              className="absolute inset-0 flex items-end justify-center pb-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand-500"
            >
              <span className="flex items-center gap-1.5 rounded-full bg-black/65 px-3 py-1.5 text-[11px] font-medium text-white shadow-sm backdrop-blur-sm">
                <ExpandIcon className="h-3.5 w-3.5" /> {t(page.openFullscreen)}
              </span>
            </button>
          )}
        </div>
      </div>

      {/* A quiet footnote — explains the small scale without competing with the
          thing it is describing. */}
      {needsHelp && (
        <p className="mt-2 px-0.5 text-[11.5px] leading-relaxed text-slate-400">
          {t(page.mobileNotice)} {t(page.tapToOpen)}{' '}
          {/* Only suggest rotating when they aren't already in landscape. */}
          {isPortrait && <span>{t(page.mobileNoticeRotate)}</span>}
        </p>
      )}
    </>
  );
}
