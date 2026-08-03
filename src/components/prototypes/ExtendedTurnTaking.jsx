import { useEffect, useRef, useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';

// ─────────────────────────────────────────────────────────────────────────────
//  Figma-matched rebuild of concept 12 — "AI provides extended turn-taking time
//  and does not interrupt the user". Two desktops, switchable:
//  · 王芳的桌面 - 参与者视图 (Figma 111:1515, blue #145cfc title bar)
//  · 陈明的桌面 - 发言者视图 (Figma 157:915, orange #cf6100 title bar) — default.
//    启用AI助手协调发言顺序 is OFF by default; the orange notification strip
//    (384:2706, #eb590d) explains when AI prompts appear. Turning the toggle on
//    shows the in-tile banner (157:969, #ff8a05).
//  Assets: /assets/meeting/*.png (exported from Figma).
// ─────────────────────────────────────────────────────────────────────────────

const IMG = `${import.meta.env.BASE_URL}assets/meeting/`;

/* ── icons (lucide-style, stroke 1.33–1.67 like Figma) ───────────────────── */
const S = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.67, strokeLinecap: 'round', strokeLinejoin: 'round' };
const Ic = ({ d, size = 'h-5 w-5', sw, children }) => (
  <svg className={size} viewBox="0 0 24 24" {...S} strokeWidth={sw || S.strokeWidth}>{d ? <path d={d} /> : children}</svg>
);
const IcMic = ({ off, size = 'h-5 w-5' }) => (
  <svg className={size} viewBox="0 0 24 24" {...S}><rect x="9" y="2" width="6" height="12" rx="3" /><path d="M5 10a7 7 0 0 0 14 0M12 19v3" />{off && <path d="M3 3l18 18" />}</svg>
);
const IcVideo = ({ off }) => (
  <svg className="h-5 w-5" viewBox="0 0 24 24" {...S}><path d="M2 6a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2z" /><path d="M15 10l6-4v12l-6-4" />{off && <path d="M2 2l20 20" />}</svg>
);
const IcScreen = () => <Ic><rect x="2" y="3" width="20" height="14" rx="2" /><path d="M8 21h8M12 17v4" /></Ic>;
const IcUsers = ({ size = 'h-5 w-5' }) => <Ic size={size}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8" /></Ic>;
const IcChat = () => <Ic d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />;
const IcSmile = () => <Ic><circle cx="12" cy="12" r="10" /><path d="M8 14s1.5 2 4 2 4-2 4-2M9 9h.01M15 9h.01" /></Ic>;
const IcDots = () => <Ic><circle cx="12" cy="5" r="1" /><circle cx="12" cy="12" r="1" /><circle cx="12" cy="19" r="1" /></Ic>;
const IcChevron = () => <Ic size="h-4 w-4" sw={1.33} d="M6 9l6 6 6-6" />;
const IcGrid = () => <Ic size="h-4 w-4" sw={1.33}><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /></Ic>;
const IcClose = () => <Ic size="h-4 w-4" sw={1.33} d="M6 6l12 12M18 6L6 18" />;
const IcGear = () => (
  <svg className="h-4 w-4" viewBox="0 0 24 24" {...S} strokeWidth={1.33}><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" /><circle cx="12" cy="12" r="3" /></svg>
);

/* ── control-bar button: 78×64, icon 20 + 12px label, radius 10 (Figma) ──── */
function ControlBtn({ icon, text, onClick, narrow }) {
  return (
    <button type="button" onClick={onClick}
      className={`flex h-16 ${narrow ? 'w-[70px]' : 'w-[78px]'} flex-col items-center justify-center gap-1 rounded-[10px] text-xs font-medium text-white transition hover:bg-white/10`}>
      {icon}
      {text}
    </button>
  );
}

/* shared bottom control bar — Figma: 89px, border-t #1f2938, pad 13/24 */
function ControlBar({ t, muted, onMic }) {
  return (
    <div className="flex h-[89px] shrink-0 items-center justify-between border-t border-[#1f2938] px-6">
      <div className="flex items-center gap-0.5">
        <div className="flex items-center">
          <ControlBtn
            icon={muted ? <span className="text-[#fa2b36]"><IcMic off /></span> : <IcMic />}
            text={t(muted ? { en: 'Unmute', zh: '取消静音' } : { en: 'Mute', zh: '静音' })}
            onClick={onMic}
          />
          <button type="button" className="flex h-8 w-8 items-center justify-center rounded-[10px] hover:bg-white/10"><IcChevron /></button>
        </div>
        <div className="flex items-center">
          <ControlBtn icon={<IcVideo off />} text={t({ en: 'Stop video', zh: '停止视频' })} />
          <button type="button" className="flex h-8 w-8 items-center justify-center rounded-[10px] hover:bg-white/10"><IcChevron /></button>
        </div>
        <ControlBtn icon={<IcScreen />} text={t({ en: 'Share screen', zh: '共享屏幕' })} />
      </div>
      <div className="flex items-center gap-0.5">
        <ControlBtn narrow icon={<IcUsers />} text={t({ en: 'Participants', zh: '参与者' })} />
        <ControlBtn narrow icon={<IcChat />} text={t({ en: 'Chat', zh: '聊天' })} />
        <ControlBtn narrow icon={<IcSmile />} text={t({ en: 'Reactions', zh: '反应' })} />
        <ControlBtn narrow icon={<IcDots />} text={t({ en: 'More', zh: '更多' })} />
      </div>
      <button type="button" className="h-10 w-[75px] rounded-[10px] bg-[#fa2b36] text-sm font-medium">
        {t({ en: 'End', zh: '结束' })}
      </button>
    </div>
  );
}

/* Figma 157:942 — small pill toggle, #ff6900 when on */
function OrangeToggle({ on, onChange, label }) {
  return (
    <button type="button" role="switch" aria-checked={on} aria-label={label} onClick={() => onChange(!on)}
      className={`relative h-[18px] w-8 shrink-0 rounded-full transition ${on ? 'bg-[#ff6900]' : 'bg-[#364054]'}`}>
      <span className={`absolute top-px h-4 w-4 rounded-full bg-white transition-all ${on ? 'left-[15px]' : 'left-px'}`} />
    </button>
  );
}

/* ── live meeting simulation ──────────────────────────────────────────────────
   Chen Ming holds the floor. He speaks a phrase, then pauses mid-thought — the
   exact moment this concept is about. On every pause the AI grants extra
   seconds and holds his turn instead of handing it to someone else. After the
   last phrase the turn ends, then the loop restarts so the meeting always
   feels live. `phase`: speaking → pause → … → finished → speaking.          */
const SPEECH = [
  { en: 'So — about the launch timeline…', zh: '那个 —— 关于发布的时间安排……' },
  { en: 'I think we should move the design review to Thursday', zh: '我觉得……我们应该把设计评审挪到周四' },
  { en: 'because the handoff isn’t finished yet.', zh: '因为设计交付还没有完成。' },
];
const HOLD_SECONDS = 5; // extra time the AI grants on each pause
const TICK = 200;

const fmt = (s) =>
  `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(Math.floor(s % 60)).padStart(2, '0')}`;

function useLiveMeeting() {
  const [s, setS] = useState({
    elapsed: 0, idx: 0, phase: 'speaking', progress: 0, hold: 0, level: 0.4, turn: 1, endsAt: 0,
  });

  useEffect(() => {
    const id = setInterval(() => {
      setS((p) => {
        const n = { ...p, elapsed: p.elapsed + TICK / 1000 };
        n.level = p.phase === 'speaking' ? 0.3 + Math.random() * 0.7 : 0.04 + Math.random() * 0.06;

        if (p.phase === 'speaking') {
          n.progress = Math.min(1, p.progress + 0.08);
          if (n.progress >= 1) { n.phase = 'pause'; n.hold = HOLD_SECONDS; }
        } else if (p.phase === 'pause') {
          n.hold = Math.max(0, p.hold - TICK / 1000);
          if (n.hold <= 0) {
            if (p.idx < SPEECH.length - 1) { n.idx = p.idx + 1; n.progress = 0; n.phase = 'speaking'; }
            else { n.phase = 'finished'; n.endsAt = n.elapsed + 6; }
          }
        } else if (n.elapsed >= p.endsAt) {
          n.phase = 'speaking'; n.idx = 0; n.progress = 0; n.turn = p.turn + 1;
        }
        return n;
      });
    }, TICK);
    return () => clearInterval(id);
  }, []);

  return s;
}

/* live mic level — four bars that follow the speaker's voice */
function AudioBars({ level, active }) {
  const mult = [0.55, 1, 0.7, 0.85];
  return (
    <span className="flex h-4 shrink-0 items-end gap-[3px]" aria-hidden="true">
      {mult.map((m, i) => (
        <span
          key={i}
          style={{ height: `${Math.max(3, (active ? level : 0.05) * 16 * m)}px` }}
          className={`w-[3px] rounded-full transition-[height] duration-150 ${active ? 'bg-[#05de73]' : 'bg-[#6b7382]'}`}
        />
      ))}
    </span>
  );
}

/* what Chen Ming is saying right now, revealed as he speaks */
function Caption({ t, live }) {
  const full = t(SPEECH[live.idx]);
  const shown = live.phase === 'speaking' ? full.slice(0, Math.ceil(full.length * live.progress)) : full;
  return (
    <p className="text-sm leading-snug text-white">
      {shown}
      {live.phase === 'speaking' && (
        <span className="ml-0.5 inline-block h-[0.95em] w-[2px] animate-pulse bg-white/80 align-middle" />
      )}
      {live.phase === 'pause' && <span className="ml-1 font-semibold text-[#ffb86b]">…</span>}
    </p>
  );
}

/* captions bar that sits above the control bar in both desktops */
function CaptionBar({ t, live, speakerName, holdAccent, showHold }) {
  return (
    <div className="shrink-0 border-t border-[#1f2938] px-4 py-2.5">
      <div className="mb-1 flex items-center gap-2">
        <AudioBars level={live.level} active={live.phase === 'speaking'} />
        <span className="text-[11px] font-medium text-[#99a1b0]">{speakerName}</span>
        <span className="text-[11px] text-[#6b7382]">
          {live.phase === 'speaking' && t({ en: 'speaking', zh: '正在发言' })}
          {live.phase === 'pause' && t({ en: 'paused — still thinking', zh: '停顿中 · 正在组织语言' })}
          {live.phase === 'finished' && t({ en: 'turn ended', zh: '发言结束' })}
        </span>
        {showHold && live.phase === 'pause' && (
          <span className={`ml-auto rounded-full px-2 py-0.5 text-[11px] font-semibold tabular-nums text-white ${holdAccent}`}>
            {t({ en: 'AI holding turn', zh: 'AI 正在保留发言权' })} +{Math.ceil(live.hold)}s
          </span>
        )}
      </div>
      <Caption t={t} live={live} />
    </div>
  );
}

/* ── 陈明的桌面 - 发言者视图 (Figma 157:915) ───────────────────────────────── */
function SpeakerDesk({ t, live }) {
  const [coordination, setCoordination] = useState(false); // 启用AI助手协调发言顺序 — off by default
  const [notifOpen, setNotifOpen] = useState(true); // strip shown when coordination is on
  const [offerOpen, setOfferOpen] = useState(true); // in-tile offer shown when coordination is off
  const [muted, setMuted] = useState(false);

  const setCoord = (v) => {
    setCoordination(v);
    setNotifOpen(true);
    setOfferOpen(true);
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col bg-[#030812] text-white">
      {/* window title bar — 157:916, #cf6100 */}
      <div className="flex h-[52px] shrink-0 items-center justify-between bg-[#cf6100] px-6">
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5">
            <span className="h-3 w-3 rounded-full bg-[#ff6366]" />
            <span className="h-3 w-3 rounded-full bg-[#fcc700]" />
            <span className="h-3 w-3 rounded-full bg-[#05de73]" />
          </div>
          <span className="text-base font-semibold">{t({ en: 'Chen Ming’s desktop — speaker view', zh: '陈明的桌面 - 发言者视图' })}</span>
        </div>
        <span className="rounded-full bg-[#965203] px-3 py-1 text-sm text-white">
          {coordination ? t({ en: 'AI extended speaking time on', zh: 'AI延长发言时间启用' }) : t({ en: 'AI extended speaking time not yet enabled', zh: 'AI延长发言时间尚未启用' })}
        </span>
      </div>

      {/* meeting sub-bar — 157:928 */}
      <div className="flex h-[49px] shrink-0 items-center justify-between border-b border-[#1f2938] px-4">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-2 text-sm">
            <span className="h-2 w-2 rounded-full bg-[#00c94f]" /> {t({ en: 'Team Meeting', zh: '团队会议' })}
          </span>
          <span className="h-4 w-px bg-[#364054]" />
          <span className="text-xs tabular-nums text-[#99a1b0]">{fmt(live.elapsed)}</span>
          <span className="h-4 w-px bg-[#364054]" />
          <span className="flex items-center gap-2 text-sm font-medium">
            {t({ en: 'Enable AI turn-coordination', zh: '启用AI助手协调发言顺序' })}
            <OrangeToggle on={coordination} onChange={setCoord} label={t({ en: 'Enable AI turn-coordination', zh: '启用AI助手协调发言顺序' })} />
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button type="button" className="flex h-8 items-center gap-2 rounded px-3 text-sm hover:bg-white/10">
            <IcUsers size="h-4 w-4" /> 3
          </button>
          <button type="button" className="flex h-7 w-7 items-center justify-center rounded hover:bg-white/10"><IcGrid /></button>
          <button type="button" className="flex h-7 w-7 items-center justify-center rounded hover:bg-white/10"><IcGear /></button>
        </div>
      </div>

      {/* orange notification strip — 384:2706, #eb590d — shown when coordination is on */}
      {coordination && notifOpen && (
        <div className="flex shrink-0 items-center justify-between gap-4 bg-[#eb590d] px-4 py-3 shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1)]">
          <p className="text-xs leading-relaxed text-white">
            {t({ en: 'The AI assistant only shows a prompt when you pause noticeably and others might mistake it for the end of your turn.', zh: 'AI助手只会在您有明显停顿，让对方可能会误解您完成发言时才会显示提示。' })}
          </p>
          <button type="button" onClick={() => setNotifOpen(false)} aria-label={t({ en: 'Dismiss', zh: '关闭' })}
            className="flex h-6 w-6 shrink-0 items-center justify-center rounded text-white/90 hover:bg-white/15"><IcClose /></button>
        </div>
      )}

      {/* video area — 157:966 */}
      <div className="grid min-h-0 flex-1 grid-cols-2 gap-4 p-4">
        {/* 陈明 (you) — big left tile, white 2px ring */}
        <div className="relative overflow-hidden rounded-[10px] border-2 border-white bg-[#1f2938]">
          <img src={`${IMG}chen-ming-large.png`} alt="" className="h-full w-full object-cover" />
          {/* in-tile AI offer — shown when coordination is OFF (screenshot) */}
          {!coordination && offerOpen && (
            <div className="absolute left-4 right-4 top-3 rounded-[10px] bg-[#eb590d] px-5 py-4 shadow-[0_10px_15px_-3px_rgba(0,0,0,0.2)]">
              <div className="flex items-start justify-between gap-3">
                <p className="text-sm leading-relaxed text-white">
                  {t({ en: 'The AI noticed you may need more time to speak today. Enable the AI assistant to help coordinate the speaking order?', zh: 'AI助手注意到您今天发言也许需要更多时间，是否要AI助手辅助协调发言顺序？' })}
                </p>
                <button type="button" onClick={() => setOfferOpen(false)} aria-label={t({ en: 'Dismiss', zh: '关闭' })}
                  className="flex h-6 w-6 shrink-0 items-center justify-center rounded text-white/90 hover:bg-white/15"><IcClose /></button>
              </div>
              <button type="button" onClick={() => setCoord(true)}
                className="mt-3 rounded-md bg-white px-4 py-2 text-sm font-medium text-[#eb590d] hover:bg-white/90">
                {t({ en: 'Enable AI turn-coordination', zh: '启用AI助手协调发言顺序' })}
              </button>
            </div>
          )}
          {/* in-tile AI banner — 157:969, #ff8a05, shown when coordination is on */}
          {coordination && (
            <div className="absolute left-4 right-4 top-3 flex items-center justify-between rounded-[10px] bg-[#ff8a05] px-4 py-3 shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1)]">
              <p className="text-sm font-semibold text-white">{t({ en: 'The AI will remind other participants not to interrupt you', zh: 'AI助手会提醒其他参会者不要打断您' })}</p>
              <span className="relative flex h-3 w-3 shrink-0">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75" />
                <span className="relative inline-flex h-3 w-3 rounded-full bg-white" />
              </span>
            </div>
          )}
          <div className="absolute bottom-3 left-3 flex h-11 items-center gap-2 rounded-[10px] bg-black/60 px-3">
            <AudioBars level={live.level} active={live.phase === 'speaking' && !muted} />
            <span className="text-base font-medium">{t({ en: 'Chen Ming (you)', zh: '陈明 (您)' })}</span>
            {muted ? <span className="text-[#fa2b36]"><IcMic off size="h-4 w-4" /></span> : <IcMic size="h-4 w-4" />}
          </div>
        </div>

        {/* right column — 王芳 / 李娜, muted */}
        <div className="grid min-h-0 grid-rows-2 gap-4">
          <div className="relative overflow-hidden rounded-[10px] bg-[#1f2938]">
            <img src={`${IMG}wang-fang-small.png`} alt="" className="h-full w-full object-cover" />
            <div className="absolute bottom-3 left-3 flex h-8 items-center gap-2 rounded bg-black/60 px-2">
              <span className="text-sm">{t({ en: 'Wang Fang', zh: '王芳' })}</span>
              <span className="text-[#fa2b36]"><IcMic off size="h-3 w-3" /></span>
            </div>
          </div>
          <div className="relative overflow-hidden rounded-[10px] bg-[#1f2938]">
            <img src={`${IMG}li-na-small.png`} alt="" className="h-full w-full object-cover" />
            <div className="absolute bottom-3 left-3 flex h-8 items-center gap-2 rounded bg-black/60 px-2">
              <span className="text-sm">{t({ en: 'Li Na', zh: '李娜' })}</span>
              <span className="text-[#fa2b36]"><IcMic off size="h-3 w-3" /></span>
            </div>
          </div>
        </div>
      </div>

      <CaptionBar
        t={t}
        live={live}
        speakerName={t({ en: 'You', zh: '您' })}
        showHold={coordination}
        holdAccent="bg-[#ff8a05]"
      />
      <ControlBar t={t} muted={muted} onMic={() => setMuted((m) => !m)} />
    </div>
  );
}

/* ── 王芳的桌面 - 参与者视图 (Figma 111:1515) ──────────────────────────────── */
function ParticipantDesk({ t, live }) {
  const [coordination, setCoordination] = useState(true);
  const [muted, setMuted] = useState(true);
  const [queued, setQueued] = useState(false);
  const [toast, setToast] = useState(null);

  const speaking = live.phase !== 'finished'; // 陈明 still holds the floor
  const prevPhase = useRef(live.phase);
  const timer = useRef();

  const flash = (msg) => {
    setToast(msg);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setToast(null), 2400);
  };
  useEffect(() => () => clearTimeout(timer.current), []);

  // The moment Chen Ming's turn ends, a queued participant is handed the floor.
  useEffect(() => {
    if (prevPhase.current !== 'finished' && live.phase === 'finished' && queued) {
      setMuted(false);
      flash(t({ en: 'It’s your turn — go ahead.', zh: '轮到您发言了，请安心开始。' }));
    }
    prevPhase.current = live.phase;
  }, [live.phase, queued]); // eslint-disable-line react-hooks/exhaustive-deps

  // A fresh turn starts — put Wang Fang back to waiting.
  useEffect(() => {
    setQueued(false);
    setMuted(true);
  }, [live.turn]);

  const tryUnmute = () => {
    if (speaking && coordination) {
      setQueued(true);
      flash(t({ en: 'Please wait — the speaker hasn’t finished. The AI has queued you.', zh: '请稍候，发言者尚未结束 —— AI 已为您排队。' }));
      return;
    }
    setMuted((m) => !m);
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col bg-[#030812] text-white">
      {/* window title bar — Figma: #145cfc, 52px */}
      <div className="flex h-[52px] shrink-0 items-center justify-between bg-[#145cfc] px-6">
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5">
            <span className="h-3 w-3 rounded-full bg-[#ff6366]" />
            <span className="h-3 w-3 rounded-full bg-[#fcc700]" />
            <span className="h-3 w-3 rounded-full bg-[#05de73]" />
          </div>
          <span className="text-base font-semibold">{t({ en: 'Wang Fang’s desktop — participant view', zh: '王芳的桌面 - 参与者视图' })}</span>
        </div>
        <button type="button" onClick={() => setCoordination((v) => !v)}
          className={`rounded-full px-3 py-1 text-sm transition ${coordination ? 'bg-[#0f172b] text-white' : 'bg-[#0f172b]/50 text-slate-400'}`}>
          {coordination ? t({ en: 'AI notices on', zh: 'AI通知启用' }) : t({ en: 'AI notices off', zh: 'AI通知关闭' })}
        </button>
      </div>

      {/* meeting sub-bar */}
      <div className="flex h-[49px] shrink-0 items-center justify-between border-b border-[#1f2938] px-4">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-2 text-sm">
            <span className="h-2 w-2 rounded-full bg-[#00c94f]" /> {t({ en: 'Team Meeting', zh: '团队会议' })}
          </span>
          <span className="h-4 w-px bg-[#364054]" />
          <span className="text-xs tabular-nums text-[#99a1b0]">{fmt(live.elapsed)}</span>
        </div>
        <div className="flex items-center gap-2">
          <button type="button" className="flex h-8 items-center gap-2 rounded px-3 text-sm hover:bg-white/10">
            <IcUsers size="h-4 w-4" /> 3
          </button>
          <button type="button" className="flex h-7 w-7 items-center justify-center rounded hover:bg-white/10"><IcGrid /></button>
          <button type="button" className="flex h-7 w-7 items-center justify-center rounded hover:bg-white/10"><IcGear /></button>
        </div>
      </div>

      {/* video area */}
      <div className="relative grid min-h-0 flex-1 grid-cols-2 gap-4 p-4">
        {/* 王芳 (you) — big left tile */}
        <div className="relative overflow-hidden rounded-[10px] bg-[#1f2938]">
          <img src={`${IMG}wang-fang.png`} alt="" className="h-full w-full object-cover" />
          <div className="absolute bottom-3 left-3 flex h-11 items-center gap-2 rounded-[10px] bg-black/60 px-3">
            <span className={`h-2 w-2 rounded-full ${queued ? 'bg-amber-400' : 'bg-[#99a1b0]'}`} />
            <span className="text-base font-medium">{t({ en: 'Wang Fang (you)', zh: '王芳 (您)' })}</span>
            <span className="text-[#fa2b36]">{muted ? <IcMic off size="h-4 w-4" /> : <span className="text-white"><IcMic size="h-4 w-4" /></span>}</span>
          </div>
          {queued && (
            <span className="absolute right-3 top-3 rounded-full bg-amber-400/20 px-2 py-0.5 text-[11px] text-amber-300">
              {t({ en: 'Hand raised · queued', zh: '已举手 · 排队中' })}
            </span>
          )}
        </div>

        {/* right column */}
        <div className="grid min-h-0 grid-rows-2 gap-4">
          {/* 陈明 — active speaker, white 2px ring (Figma) */}
          <div className={`relative overflow-hidden rounded-[10px] bg-[#1f2938] ${speaking ? 'ring-2 ring-white' : ''}`}>
            <img src={`${IMG}chen-ming.png`} alt="" className="h-full w-full object-cover" />
            <div className="absolute bottom-3 left-3 flex h-8 items-center gap-2 rounded bg-black/60 px-2">
              <AudioBars level={live.level} active={live.phase === 'speaking'} />
              <span className="text-sm">{t({ en: 'Chen Ming', zh: '陈明' })}</span>
              {speaking ? <IcMic size="h-3 w-3" /> : <span className="text-[#fa2b36]"><IcMic off size="h-3 w-3" /></span>}
            </div>
          </div>
          {/* 李娜 — muted */}
          <div className="relative overflow-hidden rounded-[10px] bg-[#1f2938]">
            <img src={`${IMG}li-na.png`} alt="" className="h-full w-full object-cover" />
            <div className="absolute bottom-3 left-3 flex h-8 items-center gap-2 rounded bg-black/60 px-2">
              <span className="text-sm">{t({ en: 'Li Na', zh: '李娜' })}</span>
              <span className="text-[#fa2b36]"><IcMic off size="h-3 w-3" /></span>
            </div>
          </div>
        </div>

        {/* AI banner — Figma: 540×64, #2663eb, r10, white 36px icon circle.
            Only while the speaker still holds the floor; nothing once it ends. */}
        {coordination && speaking && (
          <div className="absolute left-1/2 top-16 w-[min(92%,540px)] -translate-x-1/2">
            <div className="flex items-center gap-3 rounded-[10px] bg-[#2663eb] py-3 pl-6 pr-4 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)]">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-[#145cfc]">
                <IcMic />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold">{t({ en: 'AI Assistant — please wait', zh: 'AI助手 - 请稍候' })}</p>
                <p className="text-sm text-white/90">{t({ en: 'Don’t interrupt the speaker. They haven’t finished — please hold on.', zh: '请勿打断发言者。该人员尚未完成发言，请稍候。' })}</p>
              </div>
            </div>
          </div>
        )}

        {/* toast */}
        {toast && (
          <div className="pointer-events-none absolute bottom-4 left-1/2 z-10 -translate-x-1/2 rounded-full bg-black/80 px-4 py-2 text-sm">
            {toast}
          </div>
        )}
      </div>

      <CaptionBar
        t={t}
        live={live}
        speakerName={t({ en: 'Chen Ming', zh: '陈明' })}
        showHold={false}
        holdAccent="bg-[#2663eb]"
      />
      <ControlBar t={t} muted={muted} onMic={tryUnmute} />
    </div>
  );
}

export default function ExtendedTurnTaking() {
  const { t } = useLanguage();
  const [desk, setDesk] = useState('speaker');
  const live = useLiveMeeting(); // one meeting, shared by both desktops

  return (
    <div className="flex h-full w-full flex-col overflow-hidden bg-[#030812] text-white">
      {/* desktop switcher — outside the meeting screens */}
      <div className="flex shrink-0 items-center gap-3 border-b border-[#1f2938] px-4 py-2">
        <span className="text-xs text-[#99a1b0]">{t({ en: 'Desktop', zh: '桌面' })}</span>
        <div className="inline-flex rounded-full bg-[#1f2938] p-0.5">
          {[
            ['speaker', { en: 'Speaker view', zh: '发言者视图' }],
            ['participant', { en: 'Participant view', zh: '参与者视图' }],
          ].map(([k, label]) => (
            <button key={k} type="button" onClick={() => setDesk(k)} aria-pressed={desk === k}
              className={`rounded-full px-4 py-1 text-xs font-medium transition ${desk === k ? (k === 'speaker' ? 'bg-[#cf6100] text-white' : 'bg-[#145cfc] text-white') : 'text-[#99a1b0] hover:text-white'}`}>
              {t(label)}
            </button>
          ))}
        </div>
      </div>
      {desk === 'speaker' ? <SpeakerDesk t={t} live={live} /> : <ParticipantDesk t={t} live={live} />}
    </div>
  );
}
