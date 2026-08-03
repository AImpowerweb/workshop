import { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import WorkplaceLog from './WorkplaceLog';
import MeiAvatar from './MeiAvatar';

// ─────────────────────────────────────────────────────────────────────────────
//  Custom Emotion Tagging (自定义感受) — now an interactive 3-step flow:
//    1. Meeting in progress (会议进行中)  → press 结束会议
//    2. Meeting ended recap (本次会议已结束) → press 创建感受 CTA
//    3. Custom Emotion modal (自定义感受) → build + create your own tag
//  A created emotion returns to the recap screen as a selected chip.
//  Figma-matched: modal #1a1a1a r-24, tiles #242424, accent pink #e84d8a,
//  10-colour palette, dark #0a0a0a / #141414 canvas. Bilingual throughout.
// ─────────────────────────────────────────────────────────────────────────────

const EMOJIS = ['🥰', '😢', '😡', '🤔', '😴', '🥺', '😎', '🤗', '🙄', '🤯', '🎉', '💗'];
const COLORS = ['#0fba82', '#e84d8a', '#05b5d4', '#94a3b8', '#f59e0a', '#8c5cf5', '#3b82f5', '#f04545', '#ebb308', '#14b8a6'];

const PEOPLE = [
  { id: 'z', initial: '张', name: { en: 'Zhang Wei', zh: '张伟' }, color: '#8c5cf5' },
  { id: 'l', initial: '李', name: { en: 'Li Na', zh: '李娜' }, color: '#05b5d4' },
  { id: 'w', initial: '王', name: { en: 'Wang Lei', zh: '王磊' }, color: '#f59e0a' },
  { id: 'c', initial: '陈', name: { en: 'Chen Jing', zh: '陈静' }, color: '#e84d8a', speaking: true },
];

/* ── control-bar icons ─────────────────────────────────────────────────────── */
const IS = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.7, strokeLinecap: 'round', strokeLinejoin: 'round' };
const IcMic = ({ off }) => (<svg width="19" height="19" viewBox="0 0 24 24" {...IS}><rect x="9" y="2" width="6" height="12" rx="3" /><path d="M5 10a7 7 0 0 0 14 0M12 19v3" />{off && <path d="M3 3l18 18" />}</svg>);
const IcVideo = () => (<svg width="19" height="19" viewBox="0 0 24 24" {...IS}><path d="M2 6a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2z" /><path d="M15 10l6-4v12l-6-4" /><path d="M2 2l20 20" /></svg>);
const IcScreen = () => (<svg width="19" height="19" viewBox="0 0 24 24" {...IS}><rect x="2" y="3" width="20" height="14" rx="2" /><path d="M8 21h8M12 17v4" /></svg>);
const IcUsers = () => (<svg width="19" height="19" viewBox="0 0 24 24" {...IS}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8" /></svg>);
const IcSmile = () => (<svg width="19" height="19" viewBox="0 0 24 24" {...IS}><circle cx="12" cy="12" r="10" /><path d="M8 14s1.5 2 4 2 4-2 4-2M9 9h.01M15 9h.01" /></svg>);
const IcHangup = () => (<svg width="19" height="19" viewBox="0 0 24 24" fill="currentColor"><path d="M12 9c-1.6 0-3.15.25-4.6.72v3.1c0 .39-.23.74-.56.9-.98.49-1.87 1.12-2.66 1.85a.99.99 0 0 1-1.41-.03L.29 13.08a.99.99 0 0 1 .03-1.42C3.34 8.78 7.46 7 12 7s8.66 1.78 11.68 4.66c.4.38.41 1.01.03 1.42l-2.48 2.48a.99.99 0 0 1-1.41.03 11.7 11.7 0 0 0-2.66-1.85.998.998 0 0 1-.56-.9v-3.1A15.6 15.6 0 0 0 12 9z" /></svg>);

function StepBadge({ n }) {
  return (
    <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#e84d8a] text-[10px] font-bold leading-none text-white">{n}</span>
  );
}

function CtrlBtn({ icon, label, onClick, danger }) {
  return (
    <button type="button" onClick={onClick}
      className={`flex w-[62px] flex-col items-center gap-1 rounded-[10px] py-2 text-[11px] font-medium transition hover:bg-white/10 ${danger ? 'text-[#f04545]' : 'text-white/85'}`}>
      {icon}
      <span className="whitespace-nowrap">{label}</span>
    </button>
  );
}

/* ── Screen 1 — meeting in progress ────────────────────────────────────────── */
function MeetingScreen({ onEnd }) {
  const { t } = useLanguage();
  const [muted, setMuted] = useState(false);
  const [secs, setSecs] = useState(41 * 60 + 48);
  useEffect(() => {
    const id = setInterval(() => setSecs((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, []);
  const clock = [Math.floor(secs / 3600), Math.floor((secs % 3600) / 60), secs % 60].map((n) => String(n).padStart(2, '0')).join(':');

  return (
    <div className="flex h-full w-full flex-col bg-[#0a0a0a] text-white">
      {/* top bar */}
      <div className="flex h-12 shrink-0 items-center gap-3 border-b border-white/5 bg-[#141414] px-5">
        <span className="whitespace-nowrap text-sm font-semibold">{t({ en: 'Q3 Product Review', zh: '产品季度评审会议' })}</span>
        <span className="whitespace-nowrap rounded-full bg-white/5 px-2.5 py-1 text-[10px] text-white/55">{t({ en: 'ID 893-271-456', zh: '会议号 893-271-456' })}</span>
        <span className="flex items-center gap-1.5 whitespace-nowrap rounded-full bg-[#e84d8a]/15 px-2.5 py-1 text-[10px] font-medium text-[#e84d8a]">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#e84d8a]" /> {t({ en: 'Recording', zh: '录制中' })}
        </span>
        <div className="ml-auto flex items-center gap-4 whitespace-nowrap text-[11px] text-white/60">
          <span className="tabular-nums">{clock}</span>
          <span>🔒 {t({ en: 'Encrypted', zh: '加密连接' })}</span>
        </div>
      </div>

      {/* video grid */}
      <div className="grid min-h-0 flex-1 grid-cols-2 grid-rows-2 gap-3 p-3">
        {PEOPLE.map((p) => (
          <div key={p.id} className="relative flex flex-col items-center justify-center overflow-hidden rounded-xl bg-[#161616]"
            style={{ boxShadow: p.speaking ? 'inset 0 0 0 2px #e84d8a' : 'inset 0 0 0 1px rgba(255,255,255,0.04)' }}>
            <div className="flex items-center justify-center rounded-full text-[28px] font-semibold text-white" style={{ width: 76, height: 76, background: p.color }}>{p.initial}</div>
            <p className="mt-3.5 whitespace-nowrap text-sm font-bold">{t(p.name)}</p>
            {p.speaking ? (
              <p className="mt-1 flex items-center gap-1.5 whitespace-nowrap text-[11px] text-[#e84d8a]">
                <span className="relative flex h-1.5 w-1.5"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#e84d8a] opacity-75" /><span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#e84d8a]" /></span>
                {t({ en: 'Speaking…', zh: '发言中…' })}
              </p>
            ) : <p className="mt-1 whitespace-nowrap text-[11px] text-white/40">{t({ en: 'Camera off', zh: '摄像头已关闭' })}</p>}
            <span className="absolute bottom-2.5 left-2.5 flex items-center gap-1 whitespace-nowrap rounded bg-black/40 px-2 py-1 text-[10px] text-white/75">
              {p.speaking ? <IcMic /> : <IcMic off />} {t(p.name)}
            </span>
          </div>
        ))}
      </div>

      {/* control bar */}
      <div className="flex h-[76px] shrink-0 items-center justify-between border-t border-white/5 bg-[#0c0c0c] px-6">
        <div className="flex items-center gap-1">
          <CtrlBtn icon={muted ? <span className="text-[#f04545]"><IcMic off /></span> : <IcMic />} label={t(muted ? { en: 'Unmute', zh: '解除静音' } : { en: 'Mute', zh: '静音' })} onClick={() => setMuted((m) => !m)} />
          <CtrlBtn icon={<IcVideo />} label={t({ en: 'Stop video', zh: '停止视频' })} />
          <CtrlBtn icon={<IcScreen />} label={t({ en: 'Share', zh: '共享屏幕' })} />
        </div>
        <div className="flex items-center gap-1">
          <CtrlBtn icon={<IcUsers />} label={t({ en: 'People', zh: '参与者' })} />
          <CtrlBtn icon={<IcSmile />} label={t({ en: 'React', zh: '反应' })} />
        </div>
        <button type="button" onClick={onEnd}
          className="flex items-center gap-2 whitespace-nowrap rounded-[20px] bg-[#c62828] px-6 py-2.5 text-[13px] font-semibold text-white shadow-[0_6px_16px_rgba(198,40,40,0.35)] transition hover:bg-[#b71c1c]">
          <IcHangup /> {t({ en: 'End meeting', zh: '结束会议' })}
        </button>
      </div>
    </div>
  );
}

/* ── Screen 2 — meeting ended recap (Figma 857:3806 "Meeting Ending Screen - Version B (Custom)") ── */
const PRESETS = [
  { emoji: '😊', name: { en: 'Happy', zh: '开心' }, color: '#10b981' },
  { emoji: '😎', name: { en: 'Confident', zh: '自信' }, color: '#e94c89' },
  { emoji: '😰', name: { en: 'Nervous', zh: '紧张' }, color: '#f59e0b' },
  { emoji: '😩', name: { en: 'Tired', zh: '很累' }, color: '#8b5cf6' },
];
const RATE = [
  { l: { zh: '很差', en: 'Poor' }, c: { zh: '很差 — 今天辛苦了，抱抱你', en: 'Poor — a tough one, sending a hug' } },
  { l: { zh: '一般', en: 'Fair' }, c: { zh: '一般 — 平平淡淡也是一种积累', en: 'Fair — steady days count too' } },
  { l: { zh: '还行', en: 'Okay' }, c: { zh: '还行 — 稳稳地完成了这次会议', en: 'Okay — you carried it through' } },
  { l: { zh: '不错', en: 'Good' }, c: { zh: '不错 — 这是一次有收获的会议', en: 'Good — a rewarding meeting' } },
  { l: { zh: '非常好', en: 'Great' }, c: { zh: '非常好 — 为今天的自己鼓掌！', en: 'Great — a round of applause for you!' } },
];

/* 121×72 feeling chip — selected style from Figma node 857:3878 */
function FeelChip({ emoji, label, color, active, onClick }) {
  return (
    <button type="button" onClick={onClick} aria-pressed={active}
      className="flex h-[72px] w-full flex-col items-center rounded-xl transition hover:brightness-125"
      style={{ backgroundColor: color + (active ? '16' : '0d'), boxShadow: 'inset 0 0 0 1px ' + color + (active ? '66' : '3d') }}>
      <span className="mt-1.5 flex h-10 w-10 items-center justify-center rounded-full text-[22px] leading-none"
        style={active ? { backgroundColor: color + '38', boxShadow: 'inset 0 0 0 2px ' + color } : { boxShadow: 'inset 0 0 0 1.5px ' + color + '99' }}>{emoji}</span>
      <span className="mt-1 whitespace-nowrap text-[11px] font-bold leading-none" style={{ color: color, opacity: active ? 1 : 0.9 }}>{label}</span>
    </button>
  );
}

function CustomChip({ onClick, label }) {
  return (
    <button type="button" onClick={onClick}
      className="flex h-[72px] w-full flex-col items-center rounded-xl border border-dashed border-white/20 transition hover:border-[#e94c89]/60 hover:bg-[#e94c89]/[.06]">
      <span className="mt-1.5 flex h-10 w-10 items-center justify-center rounded-full text-lg leading-none text-white/55" style={{ boxShadow: 'inset 0 0 0 1.5px rgba(255,255,255,0.25)' }}>+</span>
      <span className="mt-1 whitespace-nowrap text-[11px] font-medium leading-none text-white/45">{label}</span>
    </button>
  );
}

function EndedScreen({ customs, selectedId, onSelect, onCustomize, dim, onLeave, onSave }) {
  const { t } = useLanguage();
  const [rating, setRating] = useState(4);
  const [note, setNote] = useState('');
  return (
    <div className={'flex h-full w-full flex-col bg-[#0a0a0a] text-white transition-all duration-300' + (dim ? ' scale-[0.99] opacity-40 blur-[1px]' : '')}>
      {/* top bar */}
      <div className="flex h-12 shrink-0 items-center border-b border-white/[.06] bg-[#141414] px-5">
        <span className="whitespace-nowrap text-sm font-medium">{t({ en: 'Meeting ended', zh: '会议已结束' })}</span>
        <span className="ml-[60px] h-2 w-2 shrink-0 rounded-full bg-[#e94c89]" />
        <span className="ml-1.5 whitespace-nowrap text-[11px] text-white/75">{t({ en: 'Saved to log', zh: '已记录到日志' })}</span>
        <span className="ml-auto whitespace-nowrap text-xs text-white/60">{t({ en: 'Duration 42 min · 4 participants', zh: '会议时长 42 分钟 · 4 位参会者' })}</span>
      </div>

      <div className="min-h-0 flex-1 overflow-auto pb-2">
        <p className="mt-[38px] whitespace-nowrap text-center text-[28px] font-bold leading-none">{t({ en: 'This meeting has ended', zh: '本次会议已结束' })}</p>
        <p className="mt-2.5 whitespace-nowrap text-center text-sm font-medium text-white/70">{t({ en: "A little pause to note today's growth ✨", zh: '记录今日成长的小停顿 ✨' })}</p>

        {/* Reflection Card — 560 wide, r24 */}
        <div className="mx-auto mt-[25px] w-[560px] max-w-[94%] overflow-hidden rounded-[24px] bg-[#1a1a1a] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08),0_12px_40px_rgba(0,0,0,0.5)]">
          <div className="flex h-16 items-center border-b border-white/[.06] bg-white/[.04] px-6">
            <MeiAvatar size={28} />
            <div className="ml-2">
              <p className="whitespace-nowrap text-sm font-medium leading-none">{t({ en: 'Xiaomei', zh: '小美' })}</p>
              <p className="mt-1.5 whitespace-nowrap text-[11px] font-medium leading-none text-[#9a9a9a]/85">{t({ en: 'AI companion · Journey recap', zh: 'AI 小助手 · 旅程回顾' })}</p>
            </div>
            <button type="button" onClick={onLeave} aria-label={t({ en: 'Close', zh: '关闭' })}
              className="ml-auto flex h-7 w-7 items-center justify-center rounded-full bg-white/[.06] text-base font-bold text-white/80 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)] hover:text-white">×</button>
          </div>

          <div className="px-5 pb-5">
            <p className="mt-[18px] whitespace-nowrap text-center text-[10px] font-medium text-[#9a9a9a]/60">{t({ en: 'Today · meeting ended', zh: '今天 · 会议结束' })}</p>
            <div className="mt-3 flex h-[52px] items-center rounded-[14px] bg-[#242424] px-[18px] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)]">
              <p className="whitespace-nowrap text-[13px] font-medium text-[#f0f0f0]">{t({ en: 'You brought up a new idea — you spoke your mind bravely ✨', zh: '你说出了新的想法，你勇敢说出了您的想法 ✨' })}</p>
            </div>
            <div className="mt-3 flex h-[52px] items-center rounded-[14px] bg-[#242424] px-[18px] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)]">
              <p className="whitespace-nowrap text-[13px] font-medium text-[#f0f0f0]">{t({ en: 'What would you like to note for yourself today? 💛', zh: '今天你想为自己记录些什么呢？ 💛' })}</p>
            </div>

            <div className="mt-5 flex items-baseline gap-3.5">
              <span className="whitespace-nowrap text-[11px] font-medium text-white/85">{t({ en: 'Pick how you feel', zh: '选择你的感受' })}</span>
              <span className="whitespace-nowrap text-[9.5px] text-white/55">💡 {t({ en: 'or create your own', zh: '或是自定义你的专属感受' })}</span>
            </div>
            <div className="mt-[15px] grid grid-cols-4 gap-x-3 gap-y-2">
              {PRESETS.map((p, i) => (
                <FeelChip key={p.color} emoji={p.emoji} label={t(p.name)} color={p.color} active={selectedId === 'p' + i} onClick={() => onSelect('p' + i)} />
              ))}
              {[0, 1, 2, 3].map((i) => customs[i] ? (
                <FeelChip key={'c' + i} emoji={customs[i].emoji} label={customs[i].name} color={customs[i].color} active={selectedId === 'c' + i} onClick={() => onSelect('c' + i)} />
              ) : (
                <CustomChip key={'c' + i} onClick={onCustomize} label={t({ en: 'Custom', zh: '自定义' })} />
              ))}
            </div>

            <div className="mt-2 h-px bg-white/[.06]" />

            <div className="mt-3.5 flex items-start">
              <div>
                <p className="whitespace-nowrap text-[13px] font-medium text-white/95">{t({ en: 'Meeting experience', zh: '本次会议体验' })}</p>
                <p className="mt-1.5 whitespace-nowrap text-[10.5px] text-[#9a9a9a]/70">{t({ en: "Rate today's meeting", zh: '为今天的会议打个分' })}</p>
                <div className="mt-2 flex gap-2.5">
                  {RATE.map((r, i) => (
                    <button key={i} type="button" onClick={() => setRating(i + 1)} className="flex w-10 flex-col items-center gap-1">
                      <span className="text-[26px] leading-none transition" style={{ color: i < rating ? '#f5a623' : '#3a3a3a' }}>★</span>
                      <span className="whitespace-nowrap text-[10px] leading-none" style={{ color: i < rating ? 'rgba(255,255,255,0.75)' : 'rgba(255,255,255,0.4)' }}>{t(r.l)}</span>
                    </button>
                  ))}
                </div>
              </div>
              <div className="ml-auto mt-[38px] text-right">
                <p className="whitespace-nowrap text-sm font-bold leading-none text-[#e94c89]">{t({ en: 'Selected', zh: '已选' })} {rating} / 5</p>
                <p className="mt-2 whitespace-nowrap text-[11px] leading-none text-white/60">{t(RATE[rating - 1].c)}</p>
              </div>
            </div>

            <div className="mt-4 flex h-14 items-center gap-2.5 rounded-[14px] bg-[#2a2a2a] px-4 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)]">
              <input value={note} onChange={(e) => setNote(e.target.value)}
                placeholder={t({ en: 'Tell Xiaomei how you feel…', zh: '输入文字告诉小美你的感受…' })}
                className="min-w-0 flex-1 bg-transparent text-xs text-white outline-none placeholder:text-[#9a9a9a]/55" />
              <button type="button" className="text-base leading-none opacity-70 transition hover:opacity-100">😊</button>
              <button type="button" className="text-base leading-none opacity-70 transition hover:opacity-100">📎</button>
              <button type="button" className="text-base leading-none opacity-70 transition hover:opacity-100">🎤</button>
              <button type="button" onClick={() => setNote('')} aria-label={t({ en: 'Send', zh: '发送' })}
                className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-[#e94c89] text-sm font-bold text-white transition hover:bg-[#d13d79]">→</button>
            </div>
          </div>
        </div>

        <p className="mt-3.5 whitespace-nowrap text-center text-[11px] text-[#9a9a9a]/65">{t({ en: "Leave today's feelings for your future self · it helps Xiaomei understand you better ✨", zh: '把今天的感受留给未来的自己 · 帮助小美越来越懂你 ✨' })}</p>
        <div className="mt-3 flex justify-center gap-[60px] pb-8">
          <button type="button" onClick={onLeave}
            className="h-12 w-[180px] whitespace-nowrap rounded-xl bg-white/[.06] text-sm font-medium text-white/85 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.12)] transition hover:bg-white/10">{t({ en: 'Skip journaling', zh: '跳过日誌記錄' })}</button>
          <button type="button" onClick={onSave}
            className="h-12 w-[220px] whitespace-nowrap rounded-xl bg-[#e94c89] text-sm font-bold text-white shadow-[0_8px_24px_rgba(233,76,137,0.35)] transition hover:bg-[#d13d79]">{t({ en: 'Save to log & leave', zh: '记录到日志并离开' })}</button>
        </div>
      </div>
    </div>
  );
}

/* ── Screen 3 — custom emotion modal ───────────────────────────────────────── */
function EmotionModal({ onClose, onCreate }) {
  const { t, lang } = useLanguage();
  const defaultName = lang === 'zh' ? '幸福' : 'Bliss';
  const maxLen = lang === 'zh' ? 4 : 12;
  const [emoji, setEmoji] = useState('🥰');
  const [name, setName] = useState(defaultName);
  const [color, setColor] = useState('#e84d8a');
  const [created, setCreated] = useState(false);

  const handleCreate = () => {
    setCreated(true);
    setTimeout(() => onCreate({ emoji, name: name || (lang === 'zh' ? '新感受' : 'New emotion'), color }), 620);
  };

  return (
    <div className="absolute inset-0 z-30 flex items-center justify-center overflow-auto bg-black/55 py-4" style={{ animation: 'etFade .28s ease-out' }}>
      <div className="relative w-[560px] max-w-[92%] rounded-[24px] border border-white/10 bg-[#1a1a1a] shadow-[0_20px_50px_rgba(0,0,0,0.6)]" style={{ animation: 'etRise .3s ease-out' }}>
        {/* header */}
        <div className="rounded-t-[24px] border-b border-white/5 bg-white/[.04] px-5 pb-4 pt-3">
          <div className="flex items-start justify-between">
            <button type="button" onClick={onClose} className="flex items-center gap-2 py-1 text-[11px] font-medium text-[#e84d8a] hover:opacity-80">
              ← {t({ en: 'Back to journey recap', zh: '返回旅程回顾' })}
            </button>
            <button type="button" onClick={onClose} aria-label={t({ en: 'Close', zh: '关闭' })}
              className="mt-1 flex h-7 w-7 items-center justify-center rounded-full border border-white/[.08] bg-white/5 text-white/80 hover:text-white">×</button>
          </div>
          <h3 className="mt-2 text-base font-bold text-white">{t({ en: 'Custom Emotion', zh: '自定义感受' })}</h3>
          <p className="mt-1 text-[11px] font-medium text-[#999999]/85">{t({ en: 'Create your own emotion tag ✨', zh: '创建你的专属情绪标签 ✨' })}</p>
        </div>

        <div className="px-5 pb-3 pt-3.5">
          {/* step 1 — emoji */}
          <div className="flex items-center gap-2">
            <StepBadge n={1} />
            <span className="text-[11.5px] font-medium text-white">{t({ en: 'Pick an emoji', zh: '选择一个表情符号' })}</span>
          </div>
          <div className="mt-2.5 grid grid-cols-6 gap-2">
            {EMOJIS.map((e) => (
              <button key={e} type="button" onClick={() => setEmoji(e)} aria-pressed={emoji === e}
                className={`flex aspect-square items-center justify-center rounded-[10px] border text-[26px] transition ${emoji === e ? 'border-[#e84d8a] bg-[#e84d8a]/[.18]' : 'border-white/5 bg-[#242424] hover:bg-[#2c2c2c]'}`}>
                {e}
              </button>
            ))}
          </div>
          <button type="button" className="mt-2 w-full rounded-lg border border-white/[.18] bg-white/[.04] py-1.5 text-[11px] font-medium text-white/70 hover:bg-white/10">
            + {t({ en: 'More emojis', zh: '查看更多表情' })}
          </button>

          {/* step 2 — name */}
          <div className="mt-3.5 flex items-center gap-2">
            <StepBadge n={2} />
            <span className="text-[11.5px] font-medium text-white">{t({ en: 'Give it a name', zh: '给它起个名字' })}</span>
          </div>
          <div className="mt-2 flex items-center rounded-[10px] border border-white/10 bg-[#292929] px-3.5">
            <input value={name} maxLength={maxLen} onChange={(e) => setName(e.target.value)}
              className="min-w-0 flex-1 bg-transparent py-2.5 text-[13px] font-medium text-white outline-none placeholder:text-[#999999]/60"
              placeholder={t({ en: 'Enter a name', zh: '输入名称' })} />
            <span className="text-[10px] text-[#999999]/55">{name.length} / {maxLen}</span>
          </div>

          {/* step 3 — color */}
          <div className="mt-3.5 flex items-center gap-2">
            <StepBadge n={3} />
            <span className="text-[11.5px] font-medium text-white">{t({ en: 'Pick a colour', zh: '选择一个颜色' })}</span>
          </div>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            {COLORS.map((c) => (
              <button key={c} type="button" onClick={() => setColor(c)} aria-label={`${t({ en: 'Colour', zh: '颜色' })} ${c}`}
                className={`h-10 w-10 rounded-full transition ${color === c ? 'ring-2 ring-offset-[3px] ring-offset-[#1a1a1a]' : ''}`}
                style={{ backgroundColor: c, '--tw-ring-color': c }} />
            ))}
            <button type="button" aria-label={t({ en: 'Custom colour', zh: '自定义颜色' })}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/[.22] bg-white/5 text-[22px] leading-none text-white/70">+</button>
          </div>

          {/* preview */}
          <div className="mt-3.5 border-t border-white/5 pt-2.5">
            <p className="text-[9.5px] font-medium text-[#999999]/60">{t({ en: 'Preview', zh: '预览' })}</p>
            <div className="mt-1.5 flex items-center gap-3 rounded-[10px] border px-3 py-2.5" style={{ backgroundColor: `${color}1a`, borderColor: `${color}66` }}>
              <span className="flex h-9 w-9 items-center justify-center rounded-full border-2 text-[22px] leading-none" style={{ borderColor: color, backgroundColor: `${color}38` }}>{emoji}</span>
              <div>
                <p className="text-[15px] font-bold" style={{ color }}>{name || t({ en: 'New emotion', zh: '新感受' })}</p>
                <p className="mt-0.5 text-[10px] font-medium text-[#999999]/75">{t({ en: 'New emotion · created by you', zh: '新感受 · 由你创建' })}</p>
              </div>
            </div>
          </div>
        </div>

        {/* footer */}
        <div className="flex gap-3 border-t border-white/5 px-5 pb-4 pt-3">
          <button type="button" onClick={onClose}
            className="flex-1 rounded-[10px] border border-white/[.12] bg-white/5 py-2 text-xs font-medium text-white/85 hover:bg-white/10">
            {t({ en: 'Cancel', zh: '取消' })}
          </button>
          <button type="button" onClick={handleCreate} disabled={created}
            className="flex-1 rounded-[10px] bg-[#e84d8a] py-2 text-xs font-bold text-white shadow-[0_6px_16px_rgba(232,77,138,0.35)] transition hover:bg-[#d13d79]">
            {created ? t({ en: '✓ Emotion created', zh: '✓ 已创建感受' }) : t({ en: '+ Create emotion', zh: '+ 创建感受' })}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── flow controller ───────────────────────────────────────────────────────── */
export default function EmotionTagging() {
  const { t } = useLanguage();
  const [stage, setStage] = useState('ended'); // 'meeting' | 'ended' | 'log'
  const [modalOpen, setModalOpen] = useState(false);
  const [customs, setCustoms] = useState([]);
  const [selectedId, setSelectedId] = useState('p0');

  const restart = () => { setStage('meeting'); setModalOpen(false); setCustoms([]); setSelectedId('p0'); };

  return (
    <div className="relative h-full w-full overflow-hidden">
      <style>{`
        @keyframes etFade { from { opacity:0 } to { opacity:1 } }
        @keyframes etRise { from { opacity:0; transform: translateY(10px) scale(.985) } to { opacity:1; transform:none } }
      `}</style>

      {stage === 'meeting' && (
        <div key="meeting" style={{ animation: 'etFade .3s ease-out', height: '100%' }}>
          <MeetingScreen onEnd={() => setStage('ended')} />
        </div>
      )}

      {stage === 'ended' && (
        <div key="ended" style={{ animation: 'etFade .35s ease-out', height: '100%' }}>
          <EndedScreen customs={customs} selectedId={selectedId} onSelect={setSelectedId} onCustomize={() => setModalOpen(true)} dim={modalOpen} onLeave={restart} onSave={() => setStage('log')} />
          {modalOpen && (
            <EmotionModal
              onClose={() => setModalOpen(false)}
              onCreate={(em) => { setCustoms((c) => [...c, em]); setSelectedId('c' + customs.length); setModalOpen(false); }}
            />
          )}
        </div>
      )}

      {stage === 'log' && (
        <div key="log" style={{ animation: 'etFade .35s ease-out', height: '100%' }}>
          <WorkplaceLog />
        </div>
      )}

      {/* step indicator + restart — orients the reviewer through the flow */}
      <div className={`absolute left-1/2 z-40 flex -translate-x-1/2 items-center gap-2 text-[10px] font-medium text-white/70 ${stage === 'log' ? 'bottom-3 rounded-full bg-black/70 px-3 py-1.5 ring-1 ring-white/15 backdrop-blur' : 'top-3'}`}>
        {[
          { k: 'meeting', l: { en: 'Meeting', zh: '会议中' } },
          { k: 'ended', l: { en: 'Ended', zh: '已结束' } },
          { k: 'emotion', l: { en: 'Emotion', zh: '感受' } },
          { k: 'log', l: { en: 'Log', zh: '日志' } },
        ].map((s, i) => {
          const active = (s.k === 'meeting' && stage === 'meeting') || (s.k === 'ended' && stage === 'ended' && !modalOpen) || (s.k === 'emotion' && modalOpen) || (s.k === 'log' && stage === 'log');
          return (
            <div key={s.k} className="flex items-center gap-2">
              {i > 0 && <span className="text-white/25">›</span>}
              <span className={`whitespace-nowrap rounded-full px-2 py-0.5 ${active ? 'bg-[#e84d8a] text-white' : 'bg-white/8 text-white/45'}`}>{t(s.l)}</span>
            </div>
          );
        })}
        {stage !== 'meeting' && (
          <button type="button" onClick={restart} className="ml-1 whitespace-nowrap rounded-full bg-white/8 px-2 py-0.5 text-white/60 hover:bg-white/15">↺ {t({ en: 'Restart', zh: '重新演示' })}</button>
        )}
      </div>
    </div>
  );
}
