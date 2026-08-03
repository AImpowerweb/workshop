import { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';

// ─────────────────────────────────────────────────────────────────────────────
//  Figma-matched rebuild of "Add feedback plugin for stutters" (696:1513,
//  1171×769). Left: meeting with 4 camera-off tiles + live captions that keep
//  stutters verbatim. Right: "AI caption filter" plugin panel — master toggle,
//  4 filter switches, strength level (低/中/高) and caption colour swatches.
//  Bilingual (EN/中文). Filters actually transform the caption text.
// ─────────────────────────────────────────────────────────────────────────────

const TILES = [
  { initial: '王', name: { en: 'Wang Fang (you)', zh: '王芳(您)' } },
  { initial: '李', name: { en: 'Li Ming', zh: '李明' } },
  { initial: '张', name: { en: 'Zhang Wei', zh: '张伟' } },
  { initial: '陈', name: { en: 'Chen Jing', zh: '陈静' } },
];

const CAPTIONS = [
  { initial: '陈', who: { en: 'Chen Jing', zh: '陈静' }, time: '10:07 PM', me: false, text: { en: 'I-I think, um, yes, I also agree — we should unify the style.', zh: '我，我觉得，呃，是的，我也这么认为，要统一风格。' } },
  { initial: '王', who: { en: 'Wang Fang (you)', zh: '王芳（您）' }, time: '10:08 PM', me: true, text: { en: 'So, um, I think we should, uh, like, this, this — we can start from the component library.', zh: '所以，嗯，我觉得我们应该，呃，这个，这个，就是，我们可以从组件库开始做起。' } },
  { initial: '李', who: { en: 'Li Ming', zh: '李明' }, time: '10:09 PM', me: false, text: { en: 'Right, right, that makes sense. Um, we can, uh, you know, start from-from the component library.', zh: '对，对，有道理。嗯，我们可以，呃，你知道，从，从组件库开始。' } },
  { initial: '张', who: { en: 'Zhang Wei', zh: '张伟' }, time: '10:09 PM', me: false, text: { en: 'I-I agree. Like, we need to, um, define the design tokens first, you know?', zh: '我，我同意。就是，我们需要，要，呃，先定义设计令牌，你明白吗？' } },
];

// Figma swatches (709:227-235)
const COLORS = ['#fffc9c', '#52a3ff', '#5ef5a6', '#ff7dba', '#ffb366', '#c77dff', '#ffffff'];

const FILTERS = [
  { id: 'filler', label: { en: 'Filter filler words', zh: '过滤语气词' }, desc: { en: 'Removes “um”, “uh”, “like”…', zh: '移除"嗯"、"呃"、"就是"等语气词' } },
  { id: 'repeat', label: { en: 'Filter repeated words', zh: '过滤重复词' }, desc: { en: 'Removes “right, right”, “I-I”…', zh: '移除"对，对"、"我，我"等重复词汇' } },
  { id: 'pause', label: { en: 'Filter pause words', zh: '过滤停顿词' }, desc: { en: 'Removes “that”, “this”, “so”…', zh: '移除"那个"、"这个"、"然后"等停顿词' } },
  { id: 'join', label: { en: 'Join sentence pauses', zh: '连接句词停顿' }, desc: { en: 'Smooths gaps between words so lines read fluently.', zh: '消除句子与词语间的停顿间隔，使语句更连贯流畅' } },
];

const LEVELS = [
  { id: 'low', label: { en: 'Low', zh: '低' }, desc: { en: 'Light filtering — keeps most of the original.', zh: '轻度过滤，保留大部分原始内容' } },
  { id: 'mid', label: { en: 'Mid', zh: '中' }, desc: { en: 'Balanced filtering — fluent but faithful.', zh: '中度过滤，兼顾流畅与真实' } },
  { id: 'high', label: { en: 'High', zh: '高' }, desc: { en: 'Deep filtering — the most concise sentence.', zh: '深度过滤，输出最精炼的语句' } },
];

function applyFilters(text, lang, on, level) {
  let s = text;
  const aggressive = level !== 'low';
  if (lang === 'en') {
    if (on.filler) s = s.replace(/\b(um|uh|er|ah|hmm)\b[,，]?\s*/gi, '');
    if (on.repeat) s = s.replace(/\b(\w+)(?:-\1)+\b/gi, '$1').replace(/\b(\w+)(,?\s+)\1\b/gi, '$1');
    if (on.pause) s = s.replace(/\b(like|you know|i mean|so)\b,?\s*/gi, aggressive ? '' : '$&');
    if (on.pause && aggressive) s = s.replace(/\b(this|that),?\s+(?=this|that)/gi, '');
    if (on.join) s = s.replace(/\s*,\s*,/g, ',').replace(/\s{2,}/g, ' ').replace(/\s+([,.?!—])/g, '$1');
    return s.replace(/^[,\s—]+/, '').replace(/^\w/, (m) => m.toUpperCase()).trim();
  }
  if (on.filler) s = s.replace(/[呃嗯啊哦]+，?/g, '');
  if (on.repeat) s = s.replace(/([一-鿿]{1,2})，\1/g, '$1');
  if (on.pause) s = s.replace(/(你明白吗|你知道|就是|这个|那个|然后)，?/g, aggressive ? '' : '$&');
  if (on.join) s = s.replace(/，{2,}/g, '，').replace(/，(?=[。？！])/g, '');
  return s.replace(/^，+/, '');
}

/* Figma-style pill toggle: 44×24 track (#145cfc on / #6b7382 off), 16px knob */
function Toggle({ on, onChange, small }) {
  const trackCls = small ? 'h-5 w-9' : 'h-6 w-11';
  const knobCls = small ? 'h-3 w-3' : 'h-4 w-4';
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      onClick={() => onChange(!on)}
      className={`relative ${trackCls} shrink-0 rounded-full transition ${on ? 'bg-[#145cfc]' : 'bg-[#6b7382]'}`}
    >
      <span
        className={`absolute top-1/2 -translate-y-1/2 rounded-full bg-white transition-all ${knobCls}`}
        style={{ left: on ? 'calc(100% - 4px)' : '4px', transform: `translateY(-50%) ${on ? 'translateX(-100%)' : ''}` }}
      />
    </button>
  );
}

/* filled control icons (bottom pill, Figma 699:2770-2784) */
const F = { fill: 'currentColor', stroke: 'none' };
const IcMicF = () => <svg className="h-[18px] w-[18px]" viewBox="0 0 24 24" {...F}><path d="M12 15a4 4 0 0 0 4-4V6a4 4 0 1 0-8 0v5a4 4 0 0 0 4 4zm6-4a6 6 0 0 1-12 0H4a8 8 0 0 0 7 7.94V22h2v-3.06A8 8 0 0 0 20 11z" /></svg>;
const IcCamF = () => <svg className="h-[18px] w-[18px]" viewBox="0 0 24 24" {...F}><path d="M4 5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2v-3.5l5 3.5V7l-5 3.5V7a2 2 0 0 0-2-2z" /></svg>;
const IcScreenF = () => <svg className="h-[18px] w-[18px]" viewBox="0 0 24 24" {...F}><path d="M3 4a1 1 0 0 0-1 1v11a1 1 0 0 0 1 1h7v2H7v2h10v-2h-3v-2h7a1 1 0 0 0 1-1V5a1 1 0 0 0-1-1z" /></svg>;
const IcChatF = () => <svg className="h-[18px] w-[18px]" viewBox="0 0 24 24" {...F}><path d="M4 3h16a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H8l-5 4V5a2 2 0 0 1 1-2z" /></svg>;
const IcCamOff = () => (
  <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M2.3 2.3 1 3.6l4 4H4a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h11c.4 0 .8-.1 1.1-.3l4.3 4.3 1.3-1.3zM17 10.5V9a2 2 0 0 0-2-2H9.8l12.9 12.9c.2-.3.3-.6.3-.9V7z" /></svg>
);
const IcCheck = () => <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="#12141a" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5" /></svg>;

export default function FeedbackPlugin() {
  const { t, lang } = useLanguage();
  const [enabled, setEnabled] = useState(false); // master 启用过滤 — off in Figma
  const [showCaptions, setShowCaptions] = useState(true);
  const [on, setOn] = useState({ filler: false, repeat: false, pause: false, join: false });
  const [level, setLevel] = useState('low');
  const [color, setColor] = useState('#fffc9c');

  const anyOn = enabled && Object.values(on).some(Boolean);
  const allOn = Object.values(on).every(Boolean);
  const setFilter = (id, v) => setOn((o) => ({ ...o, [id]: v }));

  return (
    <div className="flex h-full w-full bg-[#12141a] text-white">
      {/* ── meeting column ─────────────────────────────────────────────── */}
      <div className="flex min-w-0 flex-1 flex-col border-r border-[#364054]">
        {/* header — Figma: 60px, 录制中 / 设计系统会议 / 01:20:45 */}
        <div className="flex h-[60px] shrink-0 items-center justify-between border-b border-[#364054] px-6">
          <span className="flex items-center gap-2 text-xs text-[#99a1b0]">
            <span className="h-2 w-2 animate-pulse rounded-full bg-[#fa2b36]" /> {t({ en: 'Recording', zh: '录制中' })}
          </span>
          <span className="text-lg font-medium text-[#e6e8eb]">{t({ en: 'Design System Meeting', zh: '设计系统会议' })}</span>
          <span className="text-xs text-[#6b7382]">01:20:45</span>
        </div>

        {/* tiles — Figma: 2×2, 383×161, gradient, r14, all cameras off */}
        <div className="grid shrink-0 grid-cols-2 gap-4 px-6 py-5">
          {TILES.map((tile) => (
            <div key={tile.initial} className="flex h-[161px] flex-col items-center justify-center gap-2 rounded-[14px] bg-gradient-to-b from-[#4a5466] to-[#364054]">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20 text-lg font-semibold">{tile.initial}</span>
              <div className="text-center">
                <p className="text-sm font-medium">{t(tile.name)}</p>
                <p className="mt-0.5 flex items-center justify-center gap-1.5 text-xs text-white/70">
                  <IcCamOff /> {t({ en: 'Camera off', zh: '摄像头关闭' })}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* captions header — 实时字幕 / 显示字幕 toggle (on, #145cfc) */}
        <div className="flex h-10 shrink-0 items-center justify-between px-6">
          <h3 className="text-base font-semibold">{t({ en: 'Live captions', zh: '实时字幕' })}</h3>
          <label className="flex items-center gap-2 text-xs text-[#99a1b0]">
            {t({ en: 'Show captions', zh: '显示字幕' })} <Toggle small on={showCaptions} onChange={setShowCaptions} />
          </label>
        </div>

        {/* caption rows — avatar 32 gradient, name 13/#e6e8eb, time 11/#6b7382, text 15/#d1d6db */}
        <div className="min-h-0 flex-1 space-y-3 overflow-y-auto px-6 py-4">
          {showCaptions ? (
            CAPTIONS.map((c, i) => (
              <div key={i} className="flex gap-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-b from-[#52a3ff] to-[#145cfc] text-xs">{c.initial}</span>
                <div className="flex w-20 shrink-0 flex-col gap-0.5">
                  <span className={`text-[13px] leading-[18px] ${c.me ? 'text-white' : 'text-[#e6e8eb]'}`}>{t(c.who)}</span>
                  <span className="text-[11px] text-[#6b7382]">{c.time}</span>
                </div>
                {/* The filter only ever processes *your own* speech, so only
                    Wang Fang's line is cleaned and tinted with the chosen
                    caption colour. Everyone else stays white and verbatim. */}
                <p className="min-w-0 flex-1 text-[15px] leading-[22px]" style={{ color: c.me && anyOn ? color : '#ffffff' }}>
                  {c.me && anyOn ? applyFilters(t(c.text), lang, on, level) : t(c.text)}
                </p>
              </div>
            ))
          ) : (
            <p className="text-sm text-[#6b7382]">{t({ en: 'Captions hidden', zh: '字幕已隐藏' })}</p>
          )}
        </div>

        {/* bottom control pill — Figma: 782×58 #1f2126 r14, 36px round buttons */}
        <div className="flex h-[91px] shrink-0 items-center border-t border-[#364054] px-6">
          <div className="flex h-[58px] w-full items-center justify-center rounded-[14px] border border-[#364054] bg-[#1f2126] shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1)]">
            <div className="flex items-center gap-1.5">
              <button type="button" className="flex h-9 w-9 items-center justify-center rounded-full bg-[#364054] text-[#e6e8eb] hover:bg-[#4a5466]"><IcMicF /></button>
              <button type="button" className="flex h-9 w-9 items-center justify-center rounded-full bg-[#364054] text-[#e6e8eb] hover:bg-[#4a5466]"><IcCamF /></button>
              <button type="button" className="flex h-9 w-9 items-center justify-center rounded-full bg-[#364054] text-[#e6e8eb] hover:bg-[#4a5466]"><IcScreenF /></button>
              <button type="button" className="relative flex h-9 w-9 items-center justify-center rounded-full bg-[#2b80ff] text-white">
                <IcChatF />
                <span className="absolute -right-1 -top-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-[#fa2b36] text-[9px] font-medium">3</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── AI caption-filter panel (Figma 709:155, 340px) ─────────────── */}
      <aside className="flex w-[340px] shrink-0 flex-col">
        <div className="flex h-[60px] shrink-0 items-center justify-between border-b border-[#364054] px-6">
          <h3 className="text-base font-semibold">{t({ en: 'AI Caption Filter', zh: 'AI字幕过滤' })}</h3>
          <label className="flex items-center gap-2 text-sm text-[#99a1b0]">
            {t({ en: 'Enable', zh: '启用过滤' })} <Toggle small on={enabled} onChange={setEnabled} />
          </label>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto bg-gradient-to-b from-[#12141a] to-[#0f1214] px-6 py-6">
          {/* filter card — #1c388f/20%, border #1447e6/50%, r10 */}
          <div className="rounded-[10px] border border-[#1447e6]/50 bg-[#1c388f]/20 p-3">
            <p className="flex items-center gap-2 text-xs font-semibold text-[#8fc4ff]">
              {anyOn
                ? t({ en: 'Filters active', zh: '过滤器已启用' })
                : t({ en: 'Filters not enabled yet', zh: '过滤器尚未启用' })}
            </p>

            <div className="mt-3 space-y-2">
              {FILTERS.map((f) => (
                <div key={f.id} className="flex items-start justify-between gap-2 rounded-lg bg-[#1f2938]/50 px-2.5 py-2">
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-[#e6e8eb]">{t(f.label)}</p>
                    <p className="mt-0.5 text-[11px] leading-[16.5px] text-[#99a1b0]">{t(f.desc)}</p>
                  </div>
                  <Toggle small on={on[f.id]} onChange={(v) => setFilter(f.id, v)} />
                </div>
              ))}
            </div>

            {/* strength level — segmented 低/中/高 */}
            <div className="mt-3 border-t border-[#1447e6]/50 pt-3">
              <p className="text-xs font-medium text-[#e6e8eb]">{t({ en: 'Filter strength', zh: '过滤强度级别' })}</p>
              <div className="mt-2 flex gap-0.5 rounded-lg bg-[#1f2938]/50 p-[3px]">
                {LEVELS.map((l) => (
                  <button
                    key={l.id}
                    type="button"
                    onClick={() => setLevel(l.id)}
                    className={`h-9 flex-1 rounded-md text-xs font-medium transition ${level === l.id ? 'bg-[#145cfc] text-white' : 'text-[#99a1b0] hover:text-white'}`}
                  >
                    {t(l.label)}
                  </button>
                ))}
              </div>
              <p className="mt-2 text-[10px] text-[#99a1b0]">{t(LEVELS.find((l) => l.id === level).desc)}</p>
              <div className="mt-3 rounded border border-[#1447e6]/50 px-2 py-2">
                <p className="text-[11px] text-[#8fc4ff]">
                  {anyOn
                    ? `${t(allOn ? { en: 'All filters on', zh: '所有过滤器已启用' } : { en: 'Some filters on', zh: '部分过滤器已启用' })} · ${t({ en: 'Level:', zh: '过滤级别:' })} ${t(LEVELS.find((l) => l.id === level).label)}`
                    : t({ en: 'Captions keep the speaker’s words exactly as spoken.', zh: '字幕将完整保留发言者的原话。' })}
                </p>
              </div>
            </div>
          </div>

          {/* caption colour — 字幕颜色自定义 */}
          <div className="mt-4">
            <p className="text-xs font-semibold">{t({ en: 'Caption colour', zh: '字幕颜色自定义' })}</p>
            <div className="mt-2 rounded-[10px] border border-[#1447e6]/50 bg-[#1c388f]/20 px-3.5 py-2.5">
              <div className="flex items-center gap-1.5">
                {COLORS.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setColor(c)}
                    aria-label={`${t({ en: 'Caption colour', zh: '字幕颜色' })} ${c}`}
                    style={{ backgroundColor: c }}
                    className={`flex h-6 w-6 items-center justify-center rounded-full transition ${color === c ? 'ring-2 ring-white ring-offset-2 ring-offset-[#12141a]' : ''}`}
                  >
                    {color === c && <IcCheck />}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}
