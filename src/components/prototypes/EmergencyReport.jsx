import { useEffect, useRef, useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import PhoneFrame from './PhoneFrame';

// ─────────────────────────────────────────────────────────────────────────────
//  Figma-matched rebuild of "Emergency Report Mobile Page" (389:958),
//  shown in a phone frame. Bilingual: all on-screen text follows the EN/中文 toggle.
//  Behaviour (place/end call, quick-action toasts) is added here — nothing real
//  is dialled or sent.
// ─────────────────────────────────────────────────────────────────────────────

const ICON = `${import.meta.env.BASE_URL}assets/emergency/`;

const QUICK = [
  { icon: 'qa-location.svg', title: { en: 'Share Location', zh: '共享位置' }, sub: { en: 'Send precise GPS coordinates', zh: '发送精确GPS坐标' }, toast: { en: 'Your precise location has been shared', zh: '已共享您的精确位置' }, from: '#364054', to: '#4a5466' },
  { icon: 'qa-report.svg', title: { en: 'Report Case', zh: '报告案件' }, sub: { en: 'Submit an incident report', zh: '提交事件报告' }, toast: { en: 'Incident report submitted', zh: '已提交事件报告' }, from: '#4a5466', to: '#6b7382' },
  { icon: 'qa-video.svg', title: { en: 'Video Evidence', zh: '视频证据' }, sub: { en: 'Upload video / photos', zh: '上传视频/照片' }, toast: { en: 'Video evidence uploaded', zh: '已上传视频证据' }, from: '#364054', to: '#4a5466' },
  { icon: 'qa-status.svg', title: { en: 'Case Status', zh: '案件状态' }, sub: { en: 'Track your report', zh: '跟踪您的报告' }, toast: { en: 'Checking case status…', zh: '正在查询案件状态…' }, from: '#4a5466', to: '#6b7382' },
];

const TIPS = [
  { en: 'Stay calm and find a safe place', zh: '保持冷静并找到安全位置' },
  { en: 'Give a clear description of the situation', zh: '提供清晰的情况说明' },
  { en: 'Keep your phone charged and reachable', zh: '保持手机充电和可用' },
  { en: "Follow the responders' instructions", zh: '遵循紧急响应人员的指示' },
];

const fmt = (s) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

/* ── shared icons (stroke SVG, matches Figma vectors) ── */
const PhoneIcon = ({ cls = 'h-5 w-5' }) => (
  <svg viewBox="0 0 24 24" className={cls} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 2 .7 2.8a2 2 0 0 1-.4 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.9.6 2.8.7a2 2 0 0 1 1.7 2z" />
  </svg>
);
const BackIcon = () => (
  <svg viewBox="0 0 20 20" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M10 4.2 4.2 10 10 15.8M4.2 10h11.6" /></svg>
);
const MsgIcon = ({ cls = 'h-5 w-5' }) => (
  <svg viewBox="0 0 20 20" className={cls} fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M17.5 12.5a1.7 1.7 0 0 1-1.7 1.7H5.8L2.5 17.5V4.2a1.7 1.7 0 0 1 1.7-1.7h11.6a1.7 1.7 0 0 1 1.7 1.7z" /></svg>
);
const MicIcon = () => (
  <svg viewBox="0 0 20 20" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="7.5" y="1.7" width="5" height="10.8" rx="2.5" /><path d="M4.2 8.3a5.8 5.8 0 0 0 11.6 0M10 15.8v2.5" /></svg>
);
const SpeakerIcon = () => (
  <svg viewBox="0 0 20 20" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M9.2 3.3 5.4 6.7H1.7v6.6h3.7l3.8 3.4zM13.3 7.5a3.6 3.6 0 0 1 0 5M16.1 4.7a7.5 7.5 0 0 1 0 10.6" /></svg>
);
const SendIcon = () => (
  <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M18.3 1.7 9.2 10.8M18.3 1.7l-5.8 16.6-3.3-7.5-7.5-3.3z" /></svg>
);
const PinIcon = () => (
  <svg viewBox="0 0 12 12" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M10 5c0 3-4 6-4 6S2 8 2 5a4 4 0 1 1 8 0z" /><circle cx="6" cy="5" r="1.5" /></svg>
);

/* ── call header — Figma 920:175 / 920:176 top bar ── */
function CallHeader({ t, secs, onBack }) {
  return (
    <div className="shrink-0 border-b border-[#1e2939] bg-[#030712]">
      {/* Status bar. Besides matching the home screen, it reserves the space the
          Dynamic Island overlays (the top 47px), which the contact name and call
          timer would otherwise run underneath. */}
      <div className="flex items-center justify-between px-6 pb-1 pt-4 text-sm">
        <span className="font-medium">9:41</span>
        <img src={ICON + 'status.svg'} alt="" className="h-4 w-4 opacity-90" />
      </div>

      <div className="flex h-[65px] items-center gap-2 px-2">
        <button type="button" onClick={onBack} aria-label={t({ en: 'Back', zh: '返回' })}
          className="flex h-9 w-9 items-center justify-center rounded-lg text-[#d1d5dc] transition hover:bg-white/10">
          <BackIcon />
        </button>
        <div className="relative h-10 w-10 shrink-0">
          <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[#364153] text-[#e5e7eb]"
            style={{ background: 'linear-gradient(135deg, rgb(54,65,83) 0%, rgb(30,41,57) 100%)' }}>
            <svg viewBox="0 0 20 20" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M10 1.7 3.3 4.2v4.1c0 4.2 2.9 8.1 6.7 9.2 3.8-1.1 6.7-5 6.7-9.2V4.2z" /></svg>
          </div>
          <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-[#101828] bg-[#00c950]" />
        </div>
        <div className="min-w-0">
          <p className="truncate text-base font-semibold leading-6" style={{ letterSpacing: '-0.313px' }}>
            {t({ en: 'Police Dispatch · Officer Li', zh: '警务调度中心 · 李警官' })}
          </p>
          <p className="flex items-center gap-1.5 text-xs text-[#99a1af]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#fb2c36]" />
            {t({ en: 'On call', zh: '通话中' })}
            <span className="font-mono tabular-nums">{fmt(secs)}</span>
          </p>
        </div>
      </div>
    </div>
  );
}

/* ── call footer controls — Figma bottom bar (静音 / 扬声器 / 结束通话) ── */
function CallControls({ t, muted, onMute, speaker, onSpeaker, onEnd }) {
  return (
    <div className="flex shrink-0 flex-col gap-3 border-t border-[#1e2939] bg-[#030712] px-5 py-4">
      <div className="flex items-center justify-center gap-20">
        <button type="button" onClick={onMute} className="flex w-11 flex-col items-center gap-1">
          <span className={`flex h-11 w-11 items-center justify-center rounded-full border transition ${muted ? 'border-white bg-[#e5e7eb] text-[#101828]' : 'border-[#364153] bg-[#1e2939] text-[#e5e7eb] hover:bg-[#2a3648]'}`}>
            <MicIcon />
          </span>
          <span className="text-xs font-medium text-[#99a1af]">{t({ en: 'Mute', zh: '静音' })}</span>
        </button>
        <button type="button" onClick={onSpeaker} className="flex w-11 flex-col items-center gap-1">
          <span className={`flex h-11 w-11 items-center justify-center rounded-full border transition ${speaker ? 'border-white bg-[#e5e7eb] text-[#101828]' : 'border-[#364153] bg-[#1e2939] text-[#e5e7eb] hover:bg-[#2a3648]'}`}>
            <SpeakerIcon />
          </span>
          <span className="text-xs font-medium text-[#99a1af]">{t({ en: 'Speaker', zh: '扬声器' })}</span>
        </button>
      </div>
      <button type="button" onClick={onEnd}
        className="flex h-10 w-full items-center justify-center gap-2 rounded-[14px] bg-[#c10007] text-sm font-bold text-white shadow-lg transition hover:bg-[#a50006]">
        <span className="rotate-[135deg]"><PhoneIcon cls="h-4 w-4" /></span>
        {t({ en: 'End call', zh: '结束通话' })}
      </button>
    </div>
  );
}


export default function EmergencyReport() {
  const { t } = useLanguage();
  const [call, setCall] = useState('idle'); // idle | connecting | active
  const [screen, setScreen] = useState('home'); // home | call | chat
  const [secs, setSecs] = useState(0);
  const [muted, setMuted] = useState(false);
  const [speaker, setSpeaker] = useState(false);
  const [msgs, setMsgs] = useState([]);
  const [draft, setDraft] = useState('');
  const [toast, setToast] = useState(null); // { en, zh } | null
  const timers = useRef({});
  const chatEnd = useRef(null);

  const showToast = (msg) => {
    setToast(msg);
    clearTimeout(timers.current.toast);
    timers.current.toast = setTimeout(() => setToast(null), 2200);
  };

  const startCall = () => {
    setCall('connecting');
    timers.current.connect = setTimeout(() => {
      setSecs(0);
      setMuted(false);
      setSpeaker(false);
      setMsgs([
        { from: 'officer', at: 3, text: { en: 'Hello, this is police dispatch — Officer Li speaking. Are you safe right now?', zh: '您好，这里是警务调度中心，我是接线员李警官。请问您现在是否安全？' } },
        { from: 'me', at: 9, text: { en: '📍 My current location: Room 1203, Building 6, 27 Zhongguancun St, Haidian, Beijing', zh: '📍 我的当前位置：北京市海淀区中关村大街27号6号楼1203室' } },
        { from: 'officer', at: 11, text: { en: 'Is there anything else you can tell me?', zh: '请问还有什么信息可以提供？' } },
      ]);
      setCall('active');
      setScreen('call');
    }, 1600);
  };
  const endCall = () => {
    setCall('idle');
    setScreen('home');
  };

  const sendMsg = (text) => {
    const clean = (typeof text === 'string' ? text : t(text)).trim();
    if (!clean) return;
    setMsgs((m) => [...m, { from: 'me', at: secs, text: { en: clean, zh: clean } }]);
    setDraft('');
  };

  useEffect(() => {
    if (call !== 'active') return undefined;
    const id = setInterval(() => setSecs((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, [call]);

  useEffect(() => () => Object.values(timers.current).forEach(clearTimeout), []);

  useEffect(() => {
    if (screen === 'chat' && chatEnd.current) chatEnd.current.scrollTop = chatEnd.current.scrollHeight;
  }, [screen, msgs, secs]);

  /* ── calling page — Figma Frame 11 (920:175) ── */
  if (screen === 'call') {
    return (
      <PhoneFrame>
        <div className="flex h-full w-full flex-col text-white" style={{ background: 'linear-gradient(180deg, rgb(16,24,40) 0%, rgb(3,7,18) 100%)' }}>
          <CallHeader t={t} secs={secs} onBack={() => setScreen('home')} />

          <div className="flex min-h-0 flex-1 flex-col items-center justify-center gap-4 px-6">
            <div className="relative">
              <span className="absolute inset-0 animate-ping rounded-full bg-[#364153]/40" style={{ animationDuration: '2.4s' }} />
              <div className="relative flex h-32 w-32 items-center justify-center rounded-full border-4 border-[#364153] shadow-2xl"
                style={{ background: 'linear-gradient(135deg, rgb(54,65,83) 0%, rgb(30,41,57) 100%)' }}>
                <svg viewBox="0 0 64 64" className="h-16 w-16" fill="none" stroke="#e5e7eb" strokeWidth="2.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M32 5.3 10.7 13.3v13.4c0 13.3 9.1 25.6 21.3 29 12.2-3.4 21.3-15.7 21.3-29V13.3z" /><path d="M23 32l6 6 12-12" /></svg>
              </div>
            </div>
            <div className="text-center">
              <h2 className="text-xl font-bold">{t({ en: 'Emergency call connected', zh: '紧急通话已接通' })}</h2>
              <p className="mt-1 text-sm text-[#99a1af]">{t({ en: 'Police Dispatch · Operator #4892', zh: '警务调度中心 · 调度员 #4892' })}</p>
              <p className="mt-2 font-mono text-3xl font-light tabular-nums">{fmt(secs)}</p>
            </div>
            <div className="flex items-center gap-2 rounded-full border border-[#1e2939] bg-[#101828] px-3 py-1">
              <span className="h-1.5 w-1.5 rounded-full bg-[#00c950]" />
              <span className="text-xs text-[#d1d5dc]">{t({ en: 'Connection stable', zh: '通话连接稳定' })}</span>
            </div>
          </div>

          {/* message during call — Figma 通话中发送消息 button */}
          <div className="flex shrink-0 flex-col gap-2 px-5 py-2">
            <button type="button" onClick={() => setScreen('chat')}
              className="flex h-14 w-full items-center justify-center gap-2 rounded-[14px] bg-[#171e28] text-base font-semibold shadow-lg transition hover:bg-[#1f2938]">
              <MsgIcon />
              {t({ en: 'Send messages during call', zh: '通话中发送消息' })}
              <span className="flex h-5 min-w-6 items-center justify-center rounded-full bg-white px-1.5 text-xs font-bold text-[#c10007]">{msgs.filter((m) => m.at <= secs).length}</span>
            </button>
            <p className="text-center text-xs text-[#6a7282]">{t({ en: 'Send your address, photos or a description to Officer Li', zh: '可向李警官同步发送地址、照片或文字描述' })}</p>
          </div>

          <CallControls t={t} muted={muted} onMute={() => setMuted((v) => !v)} speaker={speaker} onSpeaker={() => setSpeaker((v) => !v)} onEnd={endCall} />
        </div>
      </PhoneFrame>
    );
  }

  /* ── in-call messaging page — Figma Frame 12 (920:176) ── */
  if (screen === 'chat') {
    const chips = [
      { icon: <PinIcon />, label: { en: 'Send location', zh: '发送位置' }, msg: { en: '📍 My current location: Room 1203, Building 6, 27 Zhongguancun St, Haidian, Beijing', zh: '📍 我的当前位置：北京市海淀区中关村大街27号6号楼1203室' } },
      { label: { en: "Can't talk", zh: '无法说话' }, msg: { en: "I can't talk right now, please communicate by text.", zh: '我现在无法说话，请用文字沟通。' } },
      { label: { en: "I'm safe", zh: '我已安全' }, msg: { en: 'I am currently safe.', zh: '我目前已经安全。' } },
    ];
    return (
      <PhoneFrame>
        <div className="flex h-full w-full flex-col text-white" style={{ background: 'linear-gradient(180deg, rgb(16,24,40) 0%, rgb(3,7,18) 100%)' }}>
          <CallHeader t={t} secs={secs} onBack={() => setScreen('call')} />

          {/* chat area */}
          <div ref={chatEnd} className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto bg-[#030712]/50 px-4 py-3">
            <div className="flex justify-center">
              <span className="rounded-full border border-[#1e2939] bg-[#101828] px-3 py-1 text-xs text-[#6a7282]">{t({ en: 'Messages sent during the call', zh: '通话中同步发送信息' })}</span>
            </div>
            {msgs.filter((m) => m.at <= secs).map((m, i) => (
              <div key={i} className={`animate-msg-in flex ${m.from === 'me' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] px-3 py-2 ${m.from === 'me'
                  ? 'rounded-[16px_16px_6px_16px] bg-[#c10007]/50'
                  : 'rounded-[16px_16px_16px_6px] border border-[#364153] bg-[#1e2939]'}`}>
                  {m.from === 'officer' && <p className="text-xs font-medium text-[#99a1af]">{t({ en: 'Officer Li', zh: '李警官' })}</p>}
                  <p className="text-sm leading-relaxed" style={{ letterSpacing: '-0.15px' }}>{t(m.text)}</p>
                  <p className={`mt-0.5 font-mono text-xs ${m.from === 'me' ? 'text-[#ffc9c9]' : 'text-[#6a7282]'}`}>{fmt(m.at)}</p>
                </div>
              </div>
            ))}
          </div>

          {/* quick chips — 发送位置 / 无法说话 / 我已安全 */}
          <div className="flex shrink-0 gap-2 border-t border-[#1e2939] px-4 py-2">
            {chips.map((c) => (
              <button key={c.label.en} type="button" onClick={() => sendMsg(c.msg)}
                className="flex h-[30px] items-center gap-1.5 rounded-full border border-[#364153] bg-[#1e2939] px-3 text-xs font-medium text-[#e5e7eb] transition hover:bg-[#2a3648]">
                {c.icon}{t(c.label)}
              </button>
            ))}
          </div>

          {/* input row */}
          <div className="flex shrink-0 items-center gap-2 border-t border-[#1e2939] bg-[#101828] px-3 py-2">
            <input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') sendMsg(draft); }}
              placeholder={t({ en: 'Send an address or description to Officer Li…', zh: '发送地址或描述给李警官…' })}
              className="h-9 min-w-0 flex-1 rounded-full border border-[#364153] bg-[#1e2939] px-3 text-sm text-white placeholder-[#6a7282] outline-none focus:border-[#6b7382]"
            />
            <button type="button" onClick={() => sendMsg(draft)} aria-label={t({ en: 'Send', zh: '发送' })}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#c10007] text-white transition hover:bg-[#a50006]">
              <SendIcon />
            </button>
          </div>

          <CallControls t={t} muted={muted} onMute={() => setMuted((v) => !v)} speaker={speaker} onSpeaker={() => setSpeaker((v) => !v)} onEnd={endCall} />
        </div>
      </PhoneFrame>
    );
  }

  return (
    <PhoneFrame>
      <div
        className="relative flex h-full w-full flex-col overflow-hidden text-white"
        style={{ backgroundImage: 'linear-gradient(108deg, #0f1729 0%, #1f2938 50%, #364054 100%)' }}
      >
        <div className="min-h-0 flex-1 overflow-y-auto">
          {/* Status bar */}
          <div className="flex items-center justify-between px-6 pb-1 pt-3.5 text-sm">
            <span className="font-medium">9:41</span>
            <img src={ICON + 'status.svg'} alt="" className="h-4 w-4 opacity-90" />
          </div>

          {/* Header */}
          <div className="flex items-center gap-3 px-6 pb-4 pt-1">
            <div className="flex h-14 w-14 items-center justify-center rounded-[14px] bg-[#364054]/50">
              <img src={ICON + 'shield.svg'} alt="" className="h-8 w-8" />
            </div>
            <div>
              <h2 className="text-2xl font-bold leading-tight">{t({ en: 'Emergency Police', zh: '紧急警务' })}</h2>
              <p className="text-sm text-[#d1d6db]">{t({ en: 'Instant Response System', zh: '即时响应系统' })}</p>
            </div>
          </div>

          <div className="flex flex-col gap-4 px-4 pb-4">
            {/* Emergency call card */}
            <div
              className="rounded-2xl border border-[#c20008] p-[25px] shadow-lg"
              style={{ backgroundImage: 'linear-gradient(133deg, #82171a 0%, #9e0812 100%)' }}
            >
              <div className="flex gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[14px] bg-[#45080a]/50">
                  <img src={ICON + 'phone.svg'} alt="" className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold">{t({ en: 'Emergency Hotline', zh: '紧急呼叫热线' })}</h3>
                  <p className="text-sm text-[#ffc9c9]">{t({ en: 'Connects directly to police dispatch. 24/7 emergency service.', zh: '直接连接警务调度中心。全天候24小时紧急服务。' })}</p>
                </div>
              </div>

              {/* Accessibility box */}
              <div className="mt-4 rounded-[14px] bg-[#45080a]/30 p-4">
                <h4 className="text-lg font-semibold text-[#ffe3e3]">{t({ en: 'Accessible Call System', zh: '无障碍电话系统' })}</h4>
                <p className="text-xs text-[#ffc9c9]">{t({ en: 'Supports accessible calling', zh: '支援无障碍系统拨打' })}</p>
                <div className="mt-3 space-y-3">
                  <div className="flex gap-2">
                    <span className="text-[#ffa3a3]">-</span>
                    <div>
                      <p className="text-sm font-medium text-[#ffe3e3]">{t({ en: 'Patient voice guidance', zh: '耐心语音引导' })}</p>
                      <p className="text-xs text-[#ffc9c9]">{t({ en: 'Trained operators offer calm, friendly support', zh: '专业客服接受过沟通培训，提供友好支持' })}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <span className="text-[#ffa3a3]">-</span>
                    <div>
                      <p className="text-sm font-medium text-[#ffe3e3]">{t({ en: 'Privacy protected', zh: '隐私保护' })}</p>
                      <p className="text-xs text-[#ffc9c9]">{t({ en: 'Your call details stay fully confidential and secure', zh: '您的通话信息完全保密，安全可靠' })}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Call button / live call state */}
              {call === 'idle' && (
                <button
                  type="button"
                  onClick={startCall}
                  className="mt-4 flex w-full items-center justify-center gap-2 rounded-[14px] bg-white py-2.5 text-lg font-bold text-[#82171a] shadow transition hover:bg-red-50"
                >
                  <img src={ICON + 'phone-dark.svg'} alt="" className="h-4 w-4" />
                  {t({ en: 'Call Emergency Police Now', zh: '立即呼叫紧急警务' })}
                </button>
              )}
              {call === 'connecting' && (
                <div className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-white/90 py-3 font-bold text-[#82171a]">
                  <span className="h-3 w-3 animate-ping rounded-full bg-[#82171a]" />
                  {t({ en: 'Connecting to emergency police…', zh: '正在连接紧急警务…' })}
                </div>
              )}
              {call === 'active' && (
                <div className="mt-4 rounded-xl bg-black/30 p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="relative flex h-3 w-3">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
                        <span className="relative inline-flex h-3 w-3 rounded-full bg-green-400" />
                      </span>
                      <span className="text-sm font-semibold text-[#ffe3e3]">{t({ en: 'Connected · sharing location', zh: '已接通 · 正在共享位置' })}</span>
                    </div>
                    <span className="font-mono text-sm tabular-nums">{fmt(secs)}</span>
                  </div>
                  <div className="mt-3 flex gap-2">
                    <button
                      type="button"
                      onClick={() => setScreen('call')}
                      className="w-full rounded-lg bg-white py-2 text-sm font-bold text-[#0f1729]"
                    >
                      {t({ en: 'Back to call', zh: '返回通话' })}
                    </button>
                    <button
                      type="button"
                      onClick={endCall}
                      className="w-full rounded-lg bg-white py-2 text-sm font-bold text-[#82171a]"
                    >
                      {t({ en: 'End call', zh: '结束通话' })}
                    </button>
                  </div>
                </div>
              )}

              <div className="mt-3 flex items-center gap-2">
                <img src={ICON + 'pin-sm.svg'} alt="" className="h-4 w-4" />
                <span className="text-xs text-[#ffc9c9]">{t({ en: 'Your location is shared automatically', zh: '您的位置将自动共享' })}</span>
              </div>
            </div>

            {/* Text report */}
            <button
              type="button"
              onClick={() => showToast({ en: 'Text report opened', zh: '已开启文字报警' })}
              className="flex items-center justify-between rounded-2xl border border-[#6b7382] p-[21px] text-left shadow transition hover:brightness-110"
              style={{ backgroundImage: 'linear-gradient(90deg, #364054 0%, #4a5466 100%)' }}
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#1f2938]/50">
                  <img src={ICON + 'message.svg'} alt="" className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold">{t({ en: 'Text Report', zh: '紧急文字报警' })}</h3>
                  <p className="text-sm text-[#d1d6db]">{t({ en: 'Send an emergency message', zh: '发送紧急消息' })}</p>
                </div>
              </div>
              <span className="text-lg text-white/80">›</span>
            </button>

            {/* Quick actions */}
            <div>
              <h2 className="mb-3 text-lg font-bold">{t({ en: 'Quick Actions', zh: '快速操作' })}</h2>
              <div className="grid grid-cols-2 gap-3">
                {QUICK.map((q) => (
                  <button
                    key={q.title.en}
                    type="button"
                    onClick={() => showToast(q.toast)}
                    className="flex min-h-[125px] flex-col items-start rounded-[14px] border border-[#6b7382]/50 p-4 text-left transition hover:brightness-110"
                    style={{ backgroundImage: `linear-gradient(146deg, ${q.from} 0%, ${q.to} 100%)` }}
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-[10px] bg-[#1f2938]/50">
                      <img src={ICON + q.icon} alt="" className="h-5 w-5" />
                    </div>
                    <div className="mt-auto pt-3">
                      <p className="text-sm font-semibold">{t(q.title)}</p>
                      <p className="text-xs text-[#d1d6db]">{t(q.sub)}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Safety tips */}
            <div className="rounded-[14px] border border-[#364054]/50 bg-[#1f2938]/30 p-4">
              <div className="mb-3 flex items-center gap-2">
                <img src={ICON + 'tips.svg'} alt="" className="h-5 w-5" />
                <h3 className="text-lg font-semibold">{t({ en: 'Safety Tips', zh: '安全指南' })}</h3>
              </div>
              <ul className="space-y-2">
                {TIPS.map((tip) => (
                  <li key={tip.en} className="flex gap-2 text-sm text-[#d1d6db]">
                    <span className="text-[#6b7382]">•</span>
                    {t(tip)}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-[#1f2938] bg-[#030812] px-6 py-3 text-center">
            <p className="text-xs font-semibold text-[#99a1b0]">{t({ en: 'Emergency system active', zh: '紧急系统已激活' })}</p>
            <p className="text-xs text-[#6b7382]">{t({ en: 'Your safety is our top priority', zh: '您的安全是我们的首要任务' })}</p>
          </div>
        </div>

        {/* Toast */}
        {toast && (
          <div className="pointer-events-none absolute inset-x-0 bottom-16 flex justify-center px-6">
            <div className="animate-msg-in rounded-full bg-white/95 px-4 py-2 text-sm font-medium text-slate-900 shadow-lg">
              {t(toast)}
            </div>
          </div>
        )}
      </div>
    </PhoneFrame>
  );
}
