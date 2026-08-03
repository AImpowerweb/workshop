import { useEffect, useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import WatchFrame from './WatchFrame';

// ─────────────────────────────────────────────────────────────────────────────
//  Figma-matched rebuild — 3-screen flow (913:130 → 442:4779 → 913:132):
//  notification (健康中心 card + 110 BPM) → breathing practice → celebration.
//  Colors from Figma: cyan #64d2ff, watch gradient #0a1628→#050d1a, red
//  #fb2c36 elevated pill, gold celebration circle #ffd93d→#ff9f43.
// ─────────────────────────────────────────────────────────────────────────────

const PHASES = [
  { key: 'inhale', label: { en: 'Inhale', zh: '吸气' }, ms: 4000, scale: 1.25 },
  { key: 'hold', label: { en: 'Hold', zh: '屏住' }, ms: 2000, scale: 1.25 },
  { key: 'exhale', label: { en: 'Exhale', zh: '呼气' }, ms: 4000, scale: 0.7 },
];

// 7 petals in a ring (Figma 442:4787-4793), centres ~19px from the middle.
const PETALS = Array.from({ length: 7 }, (_, i) => {
  const a = (i / 7) * Math.PI * 2 - Math.PI / 2;
  return { x: 90 + 19 * Math.cos(a) - 36, y: 90 + 19 * Math.sin(a) - 36, bright: i % 2 === 0 };
});

const Heart = ({ cls = 'h-4 w-4' }) => (
  <svg viewBox="0 0 20 20" className={cls} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M10 17l-1.2-1.1C4.5 12 2 9.7 2 6.9 2 4.7 3.7 3 5.9 3c1.2 0 2.4.6 3.1 1.5C9.7 3.6 10.9 3 12.1 3 14.3 3 16 4.7 16 6.9c0 2.8-2.5 5.1-6.8 9z" />
  </svg>
);

function StatusBar() {
  return (
    <div className="flex h-10 shrink-0 items-center justify-between px-6 text-[#99a1af]">
      <svg viewBox="0 0 16 12" className="h-3.5 w-4" fill="currentColor" aria-hidden="true">
        <path d="M8 9.5a1.2 1.2 0 100 2.4 1.2 1.2 0 000-2.4zM3.2 6.4a6.8 6.8 0 019.6 0l-1.3 1.3a5 5 0 00-7 0L3.2 6.4zM.8 4a10.2 10.2 0 0114.4 0l-1.3 1.3a8.4 8.4 0 00-11.8 0L.8 4z" />
      </svg>
      <div className="flex items-center gap-2 text-xs">
        <svg viewBox="0 0 24 12" className="h-3 w-4" fill="none" stroke="currentColor" aria-hidden="true">
          <rect x="1" y="1.5" width="18" height="9" rx="2.5" />
          <rect x="3" y="3.5" width="12" height="5" rx="1" fill="currentColor" stroke="none" />
          <path d="M21.5 4.5v3" strokeLinecap="round" />
        </svg>
        87%
      </div>
    </div>
  );
}

/* ── screen 1: notification (Figma 913:130) ─────────────────────────────── */
function NotificationScreen({ t, onStart }) {
  return (
    <>
      <StatusBar />
      {/* clock — Figma: 48px Inter Light, letter-spacing 2.752px */}
      <div className="mt-1 flex shrink-0 flex-col items-center gap-1">
        <span className="text-5xl font-light tracking-[2.752px] text-white" style={{ lineHeight: '48px' }}>19:24</span>
        <span className="text-sm text-[#6a7282]" style={{ letterSpacing: '-0.5px' }}>{t({ en: 'Tuesday, Mar 17', zh: 'Tuesday, Mar 17' })}</span>
      </div>

      {/* notification card — Figma: r24, cyan gradient 15%→10%, border #64d2ff/30 */}
      <div className="mx-6 mt-3 flex flex-col items-center rounded-3xl px-6 pb-5 pt-6"
        style={{
          background: 'linear-gradient(126deg, rgba(50,180,220,0.15) 0%, rgba(100,210,255,0.1) 100%)',
          border: '1px solid rgba(100,210,255,0.3)',
        }}>
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-full text-white"
            style={{ background: 'linear-gradient(90deg, rgb(58,180,220) 0%, rgb(100,210,255) 100%)' }}>
            <Heart cls="h-4 w-4" />
          </span>
          <span className="text-sm font-semibold text-[#64d2ff]" style={{ letterSpacing: '-0.15px' }}>{t({ en: 'Health Center', zh: '健康中心' })}</span>
        </div>
        <p className="mt-3 text-center text-sm text-[#e5e7eb]" style={{ lineHeight: '22.75px', letterSpacing: '-0.15px' }}>
          {t({ en: 'We noticed your heart rate is elevated — here is a breathing exercise to support you.', zh: '注意到你的心率偏高，这里有呼吸练习来支持你。' })}
        </p>
        <button type="button" onClick={onStart}
          className="mt-4 flex h-[34px] items-center gap-1.5 rounded-full border border-[#64d2ff]/40 bg-[#64d2ff]/20 px-4 text-xs font-medium text-[#64d2ff] transition hover:bg-[#64d2ff]/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#64d2ff]">
          <svg viewBox="0 0 14 14" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M2.3 3.5h9.4M3.5 7h7M5.7 10.5h2.6" />
          </svg>
          {t({ en: 'Start practice', zh: '开始练习' })}
        </button>
      </div>

      {/* heart-rate pill — Figma: r16, bg rgba(231,0,11,0.2), border #fb2c36/30 */}
      <div className="mx-6 mt-3 flex h-[38px] shrink-0 items-center justify-between rounded-2xl px-4"
        style={{ backgroundColor: 'rgba(231,0,11,0.2)', border: '1px solid rgba(251,44,54,0.3)' }}>
        <span className="flex items-center gap-2">
          <span className="text-[#fb2c36]"><Heart cls="h-5 w-5" /></span>
          <span className="text-sm font-semibold text-white" style={{ letterSpacing: '-0.15px' }}>110 BPM</span>
        </span>
        <span className="text-xs text-[#99a1af]">{t({ en: 'Elevated', zh: 'Elevated' })}</span>
      </div>
    </>
  );
}

/* ── screen 3: celebration (Figma 913:132) ──────────────────────────────── */
function CelebrationScreen({ t, onDone }) {
  return (
    <>
      <StatusBar />
      <div className="relative flex min-h-0 flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
        {/* sparkles (Figma decorative star components, approximated) */}
        {[
          { l: '10%', t2: '14%', s: 10, c: '#64d2ff', d: '0s' },
          { l: '82%', t2: '24%', s: 12, c: '#ffd93d', d: '0.4s' },
          { l: '16%', t2: '68%', s: 8, c: '#ffd93d', d: '0.8s' },
          { l: '78%', t2: '72%', s: 9, c: '#64d2ff', d: '1.2s' },
        ].map((sp, i) => (
          <span key={i} className="absolute" style={{ left: sp.l, top: sp.t2, animation: `sw-tw 1.8s ease-in-out ${sp.d} infinite` }}>
            <svg viewBox="0 0 24 24" width={sp.s * 2} height={sp.s * 2} fill={sp.c} aria-hidden="true">
              <path d="M12 2l2.2 7.8L22 12l-7.8 2.2L12 22l-2.2-7.8L2 12l7.8-2.2z" />
            </svg>
          </span>
        ))}
        <style>{'@keyframes sw-tw{0%,100%{opacity:.25;transform:scale(.7)}50%{opacity:1;transform:scale(1.1)}}'}</style>

        {/* gold trophy circle — Figma: 64px, #ffd93d→#ff9f43 */}
        <span className="flex h-16 w-16 items-center justify-center rounded-full"
          style={{ background: 'linear-gradient(135deg, rgb(255,217,61) 0%, rgb(255,159,67) 100%)', boxShadow: '0px 10px 15px -3px rgba(0,0,0,0.1), 0px 4px 6px -4px rgba(0,0,0,0.1)' }}>
          <svg viewBox="0 0 32 32" className="h-8 w-8" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M10 6h12v7a6 6 0 0 1-12 0z" />
            <path d="M10 8H6a4 4 0 0 0 4 6M22 8h4a4 4 0 0 1-4 6M16 19v4M11.5 27h9M13 23h6" />
          </svg>
        </span>

        <p className="text-xl font-medium text-white" style={{ letterSpacing: '-0.449px', lineHeight: '28px' }}>
          {t({ en: 'You did it!', zh: '你做到了！' })}
        </p>
        <div className="flex flex-col gap-1 text-sm text-[#e5e7eb]">
          <p>{t({ en: 'You can say what you want to say!', zh: '你可以说出你想说的话！' })}</p>
          <p>{t({ en: 'Breathing practice done today 🎉', zh: '今天完成呼吸练习了 🎉' })}</p>
        </div>

        <button type="button" onClick={onDone}
          className="mt-1 h-9 rounded-full border border-[#64d2ff]/40 bg-[#64d2ff]/20 px-5 text-sm font-medium text-[#64d2ff] transition hover:bg-[#64d2ff]/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#64d2ff]">
          {t({ en: 'Done', zh: '完成' })}
        </button>
      </div>
    </>
  );
}

export default function SmartwatchFeedback() {
  const { t } = useLanguage();
  const [screen, setScreen] = useState('notification'); // notification | practice | celebration
  const [idx, setIdx] = useState(0);
  const [cycles, setCycles] = useState(0);

  const running = screen === 'practice';

  useEffect(() => {
    if (!running) return undefined;
    const tm = setTimeout(() => {
      setIdx((i) => {
        const next = (i + 1) % PHASES.length;
        if (next === 0) setCycles((c) => c + 1);
        return next;
      });
    }, PHASES[idx].ms);
    return () => clearTimeout(tm);
  }, [running, idx]);

  // 3 full breaths → celebration
  useEffect(() => {
    if (running && cycles >= 3) setScreen('celebration');
  }, [running, cycles]);

  const start = () => { setCycles(0); setIdx(0); setScreen('practice'); };
  const finish = () => setScreen('celebration');
  const done = () => { setScreen('notification'); setCycles(0); setIdx(0); };

  const phase = running ? PHASES[idx] : null;
  const orbScale = phase ? phase.scale : 1;
  const orbDuration = phase ? phase.ms : 600;

  return (
    <WatchFrame>
      <div
        className="flex h-full w-full flex-col text-white"
        style={{ backgroundImage: 'linear-gradient(180deg, #0a1628 0%, #081221 50%, #050d1a 100%)' }}
      >
        {screen === 'notification' && <NotificationScreen t={t} onStart={start} />}
        {screen === 'celebration' && <CelebrationScreen t={t} onDone={done} />}

        {screen === 'practice' && (
          <>
            <StatusBar />
            {/* title — heart icon + 呼吸练习, #64d2ff */}
            <div className="mt-2 flex shrink-0 items-center justify-center gap-2 text-[#64d2ff]">
              <Heart />
              <span className="text-base font-medium">{t({ en: 'Breathing', zh: '呼吸练习' })}</span>
            </div>

            {/* flower orb — Figma 442:4786 */}
            <div className="flex min-h-0 flex-1 flex-col items-center justify-center">
              <div
                className="relative h-[180px] w-[180px]"
                style={{ transform: `scale(${orbScale})`, transition: `transform ${orbDuration}ms ease-in-out` }}
              >
                <div className="absolute inset-0" style={{ animation: 'sw-spin 24s linear infinite' }}>
                  {PETALS.map((p, i) => (
                    <span
                      key={i}
                      className="absolute h-[72px] w-[72px] rounded-full"
                      style={{
                        left: p.x,
                        top: p.y,
                        opacity: 0.63,
                        backgroundImage: `radial-gradient(circle, ${p.bright ? 'rgba(100,210,255,0.6)' : 'rgba(90,200,250,0.4)'} 0%, rgba(50,180,220,0.15) 70%, rgba(0,0,0,0) 100%)`,
                      }}
                    />
                  ))}
                </div>
                <span className="absolute left-1/2 top-1/2 h-[21px] w-[21px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#64d2ff]/90" />
                <style>{'@keyframes sw-spin{from{transform:rotate(0)}to{transform:rotate(360deg)}}'}</style>
              </div>

              <p className="mt-4 text-center text-lg leading-7">{phase ? t(phase.label) : ''}</p>
              <p className="mt-0.5 text-xs text-[#99a1af]">{t({ en: `Breath ${cycles + 1} / 3`, zh: `第 ${cycles + 1} / 3 次呼吸` })}</p>

              <button
                type="button"
                onClick={finish}
                className="mb-6 mt-4 h-12 w-[120px] rounded-full border border-rose-400/40 bg-rose-400/20 text-base font-medium text-rose-200 transition hover:bg-rose-400/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#64d2ff]"
              >
                {t({ en: 'Finish', zh: '结束练习' })}
              </button>
            </div>
          </>
        )}
      </div>
    </WatchFrame>
  );
}
