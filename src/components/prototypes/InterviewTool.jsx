import { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';

// ─────────────────────────────────────────────────────────────────────────────
//  Figma-matched rebuild of "AI-Powered Interview Tool (Copy)" (857:5356,
//  1171×876). AI-interviewer variant: master AI语音过滤 switch lives in the
//  header (filter panel disappears when off); left = AI question card + orb +
//  interviewee tile; right = filter panel + AI voice samples; bottom call bar.
// ─────────────────────────────────────────────────────────────────────────────

const IMG = `${import.meta.env.BASE_URL}assets/interview/`;

/* ── lucide-style stroke icons ───────────────────────────────────────────── */
const S = (w = 1.17) => ({ fill: 'none', stroke: 'currentColor', strokeWidth: w, strokeLinecap: 'round', strokeLinejoin: 'round' });
const IcSparkles = ({ size = 'h-3.5 w-3.5', w = 2 }) => (
  <svg className={size} viewBox="0 0 24 24" {...S(w)}><path d="M12 3l1.9 5.8a2 2 0 0 0 1.3 1.3L21 12l-5.8 1.9a2 2 0 0 0-1.3 1.3L12 21l-1.9-5.8a2 2 0 0 0-1.3-1.3L3 12l5.8-1.9a2 2 0 0 0 1.3-1.3z" /><path d="M19 3v4M21 5h-4M5 17v2M6 18H4" /></svg>
);
const IcZap = ({ size = 'h-3.5 w-3.5', w }) => (
  <svg className={size} viewBox="0 0 24 24" {...S(w || 1.17)}><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" /></svg>
);
const IcMic = ({ size = 'h-3.5 w-3.5', w, color }) => (
  <svg className={size} viewBox="0 0 24 24" {...S(w || 1.17)} style={color ? { color } : undefined}><rect x="9" y="2" width="6" height="12" rx="3" /><path d="M5 10a7 7 0 0 0 14 0M12 19v3" /></svg>
);
const IcWind = () => (
  <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" {...S(1.17)}><path d="M17.7 7.7A2.5 2.5 0 1 1 19.5 12H2M9.6 4.6A2 2 0 1 1 11 8H2M12.6 19.4A2 2 0 1 0 14 16H2" /></svg>
);
const IcWaves = () => (
  <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" {...S(1.17)}><path d="M2 6c.6.5 1.2 1 2.5 1C7 7 7 5 9.5 5c2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1M2 12c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1M2 18c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1" /></svg>
);
const IcMonitor = ({ size = 'h-[18px] w-[18px]' }) => (
  <svg className={size} viewBox="0 0 24 24" {...S(1.67)}><rect x="2" y="3" width="20" height="14" rx="2" /><path d="M8 21h8M12 17v4" /></svg>
);
const IcPhoneOff = ({ size = 'h-4 w-4' }) => (
  <svg className={size} viewBox="0 0 24 24" {...S(1.67)}><path d="M10.68 13.31a16 16 0 0 0 3.41 2.6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.42 19.42 0 0 1-3.33-2.67m-2.67-3.34a19.79 19.79 0 0 1-3.07-8.63A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91" /><path d="M22 2L2 22" /></svg>
);
const IcGear = () => (
  <svg className="h-[18px] w-[18px]" viewBox="0 0 24 24" {...S(1.67)}><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" /><circle cx="12" cy="12" r="3" /></svg>
);
const IcVolume = () => (
  <svg className="h-4 w-4" viewBox="0 0 24 24" {...S(1.33)}><path d="M11 5L6 9H2v6h4l5 4V5z" /><path d="M15.54 8.46a5 5 0 0 1 0 7.07M19.07 4.93a10 10 0 0 1 0 14.14" /></svg>
);
const IcMaximize = () => (
  <svg className="h-4 w-4" viewBox="0 0 24 24" {...S(1.33)}><path d="M8 3H5a2 2 0 0 0-2 2v3M21 8V5a2 2 0 0 0-2-2h-3M3 16v3a2 2 0 0 0 2 2h3M16 21h3a2 2 0 0 0 2-2v-3" /></svg>
);
const IcPlus = ({ size = 'h-2.5 w-2.5', w = 1.67 }) => (
  <svg className={size} viewBox="0 0 24 24" {...S(w)}><path d="M12 5v14M5 12h14" /></svg>
);
const IcChevron = ({ up, size = 'h-3.5 w-3.5' }) => (
  <svg className={`${size} transition-transform ${up ? '' : 'rotate-180'}`} viewBox="0 0 24 24" {...S(1.17)}><path d="M18 15l-6-6-6 6" /></svg>
);

/* ── Figma filter rows: row 1 purple, rest indigo; grey when off ─────────── */
const SCHEMES = {
  purple: { bg: 'rgba(89,22,139,0.3)', border: 'rgba(130,0,219,0.5)', icon: '#ad46ff', label: '#dab2ff' },
  indigo: { bg: 'rgba(49,44,133,0.3)', border: 'rgba(79,57,246,0.5)', icon: '#615fff', label: '#a3b3ff' },
  off: { bg: 'rgba(38,38,41,0.4)', border: 'rgba(64,64,71,0.4)', icon: '#404047', label: '#70707a' },
};

const FILTERS = [
  { scheme: 'purple', Icon: IcZap, label: { en: 'Reduce repeats', zh: '减少重复词' }, desc: { en: 'Detect and remove repeated words and phrases', zh: '检测并移除重复的单词和短语' } },
  { scheme: 'indigo', Icon: IcMic, label: { en: 'Remove fillers', zh: '去除填充词' }, desc: { en: 'Strip "um", "ah" and other fillers', zh: '移除"嗯"、"啊"等口头禅' } },
  { scheme: 'indigo', Icon: IcWind, label: { en: 'Noise reduction', zh: '降噪' }, desc: { en: 'Remove background and ambient noise', zh: '消除背景噪音和环境噪声' } },
  { scheme: 'indigo', Icon: IcWaves, label: { en: 'Echo cancel', zh: '回声消除' }, desc: { en: 'Remove room echo and reverb', zh: '消除房间回声和混响' } },
  { scheme: 'indigo', Icon: IcMic, label: { en: 'Breath suppress', zh: '呼吸声抑制' }, desc: { en: 'Remove audible breathing', zh: '消除可听见的呼吸声' } },
];

const SAMPLES = [
  { en: 'One moment please...', zh: '请稍等一下......' },
  { en: "I'm a bit stuck — please give me more time.", zh: '我现在有点卡壳，请给我多一点时间。' },
  { en: "I'm thinking about this", zh: '我正在思考这个' },
  { en: 'Allow me to elaborate...', zh: '请允许我详细说明......' },
];

/* Figma switch: 32×18 (24×14 small); on = #ededf0 track / #1f1f24 thumb */
function Switch({ on, onChange, sm }) {
  return (
    <button type="button" role="switch" aria-checked={on} onClick={() => onChange(!on)}
      className={`relative shrink-0 rounded-full transition ${sm ? 'h-3.5 w-6' : 'h-[18px] w-8'} ${on ? 'bg-[#ededf0]' : 'bg-[#45454f]'}`}>
      <span className={`absolute rounded-full bg-[#1f1f24] transition-all ${sm ? 'top-px h-3 w-3' : 'top-px h-4 w-4'} ${on ? (sm ? 'left-[11px]' : 'left-[15px]') : 'left-px'}`} />
    </button>
  );
}

/* green voice-level bars (Figma heights 6/10/8/12/6/10/8, #00d492) */
const BAR_H = [6, 10, 8, 12, 6, 10, 8];
function VoiceBars({ live }) {
  return (
    <span className="flex h-4 items-center gap-0.5">
      {BAR_H.map((h, i) => (
        <span key={i} className="w-0.5 rounded-full bg-[#00d492] opacity-80"
          style={live ? { animation: `itool-bar 0.9s ease-in-out ${i * 0.12}s infinite alternate`, height: h } : { height: h }} />
      ))}
    </span>
  );
}

export default function InterviewTool() {
  const { t } = useLanguage();
  const [enabled, setEnabled] = useState(true);
  const [expanded, setExpanded] = useState(true);
  const [on, setOn] = useState([true, true, true, true, true]);
  const [pills, setPills] = useState(SAMPLES);
  const [draft, setDraft] = useState('');
  const [toast, setToast] = useState(null);
  const count = on.filter(Boolean).length;

  const addPill = () => { const v = draft.trim(); if (!v) return; setPills((p) => [...p, v]); setDraft(''); };
  const ping = (text) => { setToast(text); clearTimeout(ping._t); ping._t = setTimeout(() => setToast(null), 2400); };

  return (
    <div className="flex h-full w-full flex-col bg-[#17171b] text-white">
      {/* header — Figma: 72px, #1f1f24, gradient sparkles logo + 540px master pill */}
      <div className="flex h-[72px] shrink-0 items-center justify-between gap-6 border-b border-white/[0.07] bg-[#1f1f24] px-6 shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1),0_4px_6px_-4px_rgba(0,0,0,0.1)]">
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] text-white" style={{ backgroundImage: 'linear-gradient(135deg, #2563eb 0%, #9333ea 100%)' }}><IcSparkles size="h-5 w-5" w={1.67} /></span>
          <div>
            <p className="whitespace-nowrap text-lg font-medium leading-[27px] tracking-[-0.44px] text-[#ededf0]">{t({ en: 'AI Interview · Product Manager', zh: 'AI 面试 · 产品经理' })}</p>
            <p className="text-xs text-[#71717b]">{t({ en: 'Real-time voice filtering & enhancement', zh: '实时语音过滤与增强' })}</p>
          </div>
        </div>
        {/* master AI voice-filter pill (540×48, gradient + purple border) */}
        <div className="flex h-12 w-[540px] shrink-0 items-center gap-3 rounded-2xl border border-[#8200db]/40 px-3" style={{ backgroundImage: 'linear-gradient(90deg, rgba(89,22,139,0.3) 0%, rgba(49,44,133,0.3) 100%)' }}>
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-[10px] text-white" style={{ backgroundImage: 'linear-gradient(135deg, #ad46ff 0%, #e60076 100%)' }}><IcMic /></span>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium leading-[17px] tracking-[-0.15px] text-[#dab2ff]">{t({ en: 'AI Voice Filter', zh: 'AI语音过滤' })}</p>
            <p className="text-xs font-medium leading-4 text-[#cbcbcc]">{enabled ? t({ en: 'All filters active', zh: '所有过滤器已激活' }) : t({ en: 'Filtering off', zh: '过滤已关闭' })}</p>
          </div>
          <span className="text-[#dab2ff]"><IcChevron up={false} size="h-4 w-4" /></span>
          <Switch on={enabled} onChange={setEnabled} />
        </div>
      </div>

      <div className="flex min-h-0 flex-1 gap-6 p-6">
        {/* left: AI question card + orb + interviewee tile */}
        <div className="relative min-w-0 flex-1">
          <div className="mx-6 mt-8 rounded-2xl bg-[#2a2a30] px-6 py-5 shadow-[0_20px_25px_-5px_rgba(0,0,0,0.1),0_8px_10px_-6px_rgba(0,0,0,0.1)]">
            <p className="text-base leading-[26px] tracking-[-0.31px] text-[#ededf0]">{t({ en: "Thank you for sharing. Let's move on to product management. Could you walk me through a recent product you led, from insight to launch? I'm especially interested in how you balanced user value, business goals and engineering resources.", zh: '感谢您的分享。让我们继续聊聊产品管理方面的话题。 能否描述一下您最近主导的一款产品，从需求洞察到上线的完整过程？ 我特别想了解您如何平衡用户价值、商业目标与工程资源之间的取舍。' })}</p>
          </div>
          <div className="mx-auto mt-1 h-1 w-12 rounded-full bg-white/20" />
          {/* AI interviewer orb — soft concentric glows + gradient sphere (Figma 247/206/165) */}
          <div className="absolute left-1/2 top-[59%]" style={{ transform: 'translate(-50%,-50%)', animation: 'itool-orb 4s ease-in-out infinite' }}>
            <div className="flex h-[247px] w-[247px] items-center justify-center rounded-full" style={{ background: 'radial-gradient(circle at 50% 50%, rgba(43,127,255,0.35) 0%, rgba(43,127,255,0.12) 52%, rgba(43,127,255,0) 72%)' }}>
              <div className="flex h-[206px] w-[206px] items-center justify-center rounded-full" style={{ background: 'radial-gradient(circle at 50% 50%, rgba(173,70,255,0.3) 0%, rgba(173,70,255,0.1) 56%, rgba(173,70,255,0) 74%)' }}>
                <div className="relative h-[165px] w-[165px] overflow-hidden rounded-full" style={{ background: 'radial-gradient(circle 158px at 35% 30%, #c7d2fe 0%, #a5b4fc 14%, #6366f1 42%, #4338ca 72%, #1e1b4b 100%)', boxShadow: '0 0 82px 0 rgba(99,102,241,0.6), inset -10px -21px 41px 0 rgba(0,0,0,0.4)' }}>
                  <span className="absolute left-[26px] top-[28px] h-[34px] w-[52px] rounded-full bg-white/50" style={{ transform: 'rotate(-20deg)', filter: 'blur(9px)' }} />
                </div>
              </div>
            </div>
          </div>
          {/* sample-phrase toast */}
          {toast && (
            <div className="absolute left-1/2 top-[216px] z-10 flex max-w-[90%] items-center gap-2 rounded-full px-4 py-2 text-xs font-medium text-white shadow-lg" style={{ transform: 'translateX(-50%)', backgroundColor: 'rgba(152,16,250,0.9)', animation: 'itool-in 0.25s ease-out' }}>
              <IcSparkles size="h-3 w-3" /> <span className="truncate">{toast}</span>
            </div>
          )}
          {/* interviewee tile — 260×195 bottom-left */}
          <div className="absolute bottom-0 left-4 h-[195px] w-[260px] overflow-hidden rounded-2xl bg-[#18181b] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)]">
            <img src={IMG + 'linwei.png'} alt="" className="h-full w-full object-cover" />
            <div className="absolute inset-0" style={{ background: 'linear-gradient(0deg, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.1) 50%, rgba(0,0,0,0) 100%)' }} />
            {enabled && (
              <span className="absolute right-3 top-3 flex h-6 items-center gap-2 rounded-full px-2.5 text-xs font-medium" style={{ backgroundColor: 'rgba(152,16,250,0.8)' }}>
                <span className="h-1.5 w-1.5 rounded-full bg-[#e9d4ff]" /> {t({ en: 'AI voice filtering', zh: 'AI语音过滤中' })}
              </span>
            )}
            <div className="absolute inset-x-3 bottom-3 flex items-end justify-between">
              <div className="drop-shadow">
                <p className="text-lg font-semibold leading-[22px]">{t({ en: 'Lin Wei', zh: '林 薇' })}</p>
                <p className="text-sm leading-5 text-white/65">{t({ en: 'Senior Product Manager', zh: '高级产品经理' })}</p>
              </div>
              <span className="flex h-7 items-center gap-2 rounded-full bg-black/50 px-3">
                <IcMic color="#00d492" />
                <VoiceBars live />
              </span>
            </div>
          </div>
        </div>

        {/* right: filter panel + AI voice samples (540px) */}
        <div className="flex w-[540px] shrink-0 flex-col gap-4">
          {/* filter panel — disappears entirely when the master switch is off */}
          {enabled && (
            <div className="flex min-h-0 flex-1 flex-col gap-3 rounded-2xl border border-white/[0.07] bg-[#1f1f24] p-[17px] pb-1">
              <button type="button" onClick={() => setExpanded((v) => !v)} className="flex w-full shrink-0 items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="flex h-8 w-8 items-center justify-center rounded-[10px]" style={{ backgroundImage: 'linear-gradient(135deg, #2b7fff 0%, #4f39f6 100%)' }}><IcZap size="h-4 w-4" w={1.33} /></span>
                  <div className="text-left">
                    <p className="text-sm font-medium leading-5 tracking-[-0.15px] text-[#ededf0]">{t({ en: 'Voice filters', zh: '语音过滤' })}</p>
                    <p className="text-xs text-[#cbcbcc]">{t({ en: 'Real-time audio pipeline', zh: '实时音频处理管道' })}</p>
                  </div>
                </div>
                <span className="flex items-center gap-1.5">
                  <span className="rounded-[10px] border px-[9px] py-1 text-xs" style={{ backgroundColor: 'rgba(28,57,142,0.5)', borderColor: 'rgba(20,71,230,0.4)', color: '#51a2ff' }}>{t({ en: `${count} on`, zh: `${count} 已开启` })}</span>
                  <span className="text-[#71717b]"><IcChevron up={!expanded} /></span>
                </span>
              </button>
              {expanded && (
                <div className="min-h-0 flex-1 space-y-2 overflow-y-auto pb-3">
                  {FILTERS.map((f, i) => {
                    const sc = on[i] ? SCHEMES[f.scheme] : SCHEMES.off;
                    const IconCmp = f.Icon;
                    return (
                      <div key={f.label.en} className="flex items-start gap-2.5 rounded-2xl border p-2.5" style={{ backgroundColor: sc.bg, borderColor: sc.border }}>
                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-[10px]" style={{ backgroundColor: sc.icon, color: on[i] ? '#ffffff' : '#70707a' }}>
                          <IconCmp />
                        </span>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-2">
                            <p className="truncate text-xs font-medium" style={{ color: sc.label }}>{t(f.label)}</p>
                            <Switch sm on={on[i]} onChange={(v) => setOn((p) => p.map((x, idx) => (idx === i ? v : x)))} />
                          </div>
                          <p className="mt-1 truncate text-xs text-[#9f9fa9]">{t(f.desc)}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* AI voice samples */}
          <div className="flex shrink-0 flex-col gap-3 rounded-2xl border border-[#8200db]/40 bg-[#1f1f24] p-[17px]">
            <div>
              <p className="text-sm font-medium leading-5 tracking-[-0.15px] text-[#ededf0]">{t({ en: 'AI voice samples', zh: 'AI 语音样本' })}</p>
              <p className="mt-0.5 text-[10px] leading-[15px] text-white">{t({ en: 'Click a phrase — AI shows an instant notice', zh: '点击短语，AI 将即时显示讯息通知' })}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {pills.map((p, i) => (
                <button key={i} type="button" onClick={() => ping(t(p))} className="flex h-[30px] items-center gap-2 rounded-full border border-[#71717b] px-[11px] transition-colors hover:border-[#a684ff]" style={{ backgroundColor: 'rgba(39,39,42,0.6)' }}>
                  <span className="text-white/70"><IcSparkles size="h-2.5 w-2.5" w={1.5} /></span>
                  <span className="text-xs font-medium text-[#d4d4d8]">{t(p)}</span>
                  <span className="text-white/80"><IcPlus /></span>
                </button>
              ))}
            </div>
            <div className="rounded-[10px] border p-[13px]" style={{ backgroundColor: 'rgba(39,39,42,0.4)', borderColor: 'rgba(63,63,71,0.5)' }}>
              <p className="flex items-center gap-1.5 text-xs font-medium text-[#dab2ff]"><IcPlus size="h-3.5 w-3.5" /> {t({ en: 'Add custom sample phrase', zh: '添加自定义样本词' })}</p>
              <div className="mt-2 flex h-[34px] gap-2">
                <input value={draft} onChange={(e) => setDraft(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && addPill()} placeholder={t({ en: 'Type your custom phrase...', zh: '输入您的自定义短语...' })} className="h-full min-w-0 flex-1 rounded-[10px] border border-[#3f3f47] bg-[#17171b] px-3 text-xs text-[#ededf0] outline-none placeholder:text-[#71717b] focus:border-[#8200db]" />
                <button type="button" onClick={addPill} className="h-full w-[47px] rounded-[10px] text-xs font-medium text-white opacity-90 hover:opacity-100" style={{ backgroundImage: 'linear-gradient(90deg, #9810fa 0%, #e60076 100%)' }}>{t({ en: 'Add', zh: '添加' })}</button>
              </div>
              <p className="mt-2 text-xs text-[#9f9fa9]">{t({ en: 'Press Enter or click "Add" to save your sample', zh: '按 Enter 或点击"添加"按钮保存自定义样本' })}</p>
            </div>
          </div>
        </div>
      </div>

      {/* bottom call bar — Figma: 64px, #0f0f12 */}
      <div className="flex h-16 shrink-0 items-center justify-between border-t border-white/[0.07] bg-[#0f0f12] px-6">
        <span className="w-24 text-sm tracking-[-0.15px] text-[#9f9fa9]">11:32 / 13:00</span>
        <div className="flex items-center gap-3">
          <button type="button" className="flex h-10 w-10 items-center justify-center rounded-full bg-[#2a2a30] text-[#d4d4d8] hover:bg-[#3a3a42]"><IcMonitor /></button>
          <button type="button" className="flex h-10 items-center gap-2 rounded-full bg-[#e7000b] px-5 text-sm font-medium tracking-[-0.15px] text-white hover:bg-[#c50009]"><IcPhoneOff /> {t({ en: 'End call', zh: '结束通话' })}</button>
          <button type="button" className="flex h-10 w-10 items-center justify-center rounded-full bg-[#2a2a30] text-[#d4d4d8] hover:bg-[#3a3a42]"><IcGear /></button>
        </div>
        <div className="flex w-24 items-center justify-end gap-3">
          <span className="text-[#9f9fa9]"><IcVolume /></span>
          <button type="button" className="flex h-9 w-9 items-center justify-center rounded bg-[#2a2a30] text-[#9f9fa9] hover:text-white"><IcMaximize /></button>
        </div>
      </div>
      <style>{'@keyframes itool-orb{0%,100%{transform:translate(-50%,-50%) scale(0.97)}50%{transform:translate(-50%,-50%) scale(1.03)}}@keyframes itool-bar{from{transform:scaleY(0.4)}to{transform:scaleY(1.4)}}@keyframes itool-in{from{opacity:0;transform:translate(-50%,6px)}to{opacity:1;transform:translateX(-50%)}}'}</style>
    </div>
  );
}
