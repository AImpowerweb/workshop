import { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';

// ─────────────────────────────────────────────────────────────────────────────
//  Figma-matched rebuild of "AI Interview Meeting Screen" (253:4477) — concept
//  35, facial recognition to determine whether the user intends to continue
//  speaking. Bilingual. Speaker / Participant switcher kept from the original
//  interactive version; visuals (colors, layout, right panel) follow Figma:
//  bg #0f1729, panels #1f2938, chips #364054, blue banner #2b80ff, green
//  #05de73 states, red #e8000a leave/camera-off.
// ─────────────────────────────────────────────────────────────────────────────

// The facial-recognition panel shows *your own* camera, so each perspective
// gets a different face: 陈威 in the speaker view, 李娜 in the participant view.
const FACE = `${import.meta.env.BASE_URL}assets/facial/face.png`;
const FACE_PARTICIPANT = `${import.meta.env.BASE_URL}assets/facial/face-participant.png`;

const P = {
  chenwei: { zh: '陈威', en: 'Chen Wei' },
  lina: { zh: '李娜', en: 'Li Na' },
  zhangming: { zh: '张明', en: 'Zhang Ming' },
  wangfang: { zh: '王芳', en: 'Wang Fang' },
};

const VIEWS = {
  speaker: { you: 'chenwei', speaker: 'chenwei', tiles: ['chenwei', 'lina', 'zhangming', 'wangfang'] },
  participant: { you: 'lina', speaker: 'chenwei', tiles: ['lina', 'chenwei', 'zhangming', 'wangfang'] },
};

/* ── icons (Figma vector sets, redrawn) ──────────────────────────────────── */
const Mic = ({ cls = 'h-4 w-4' }) => (
  <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="2" width="6" height="12" rx="3" /><path d="M5 10a7 7 0 0 0 14 0M12 19v3" /></svg>
);
const MicOff = ({ cls = 'h-4 w-4' }) => (
  <svg className={cls} viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path stroke="currentColor" d="M9 5a3 3 0 0 1 6 0v6a3 3 0 0 1-.5 1.7M9 9v2a3 3 0 0 0 4.6 2.5" /><path stroke="currentColor" d="M5 10a7 7 0 0 0 11.6 5.3M18.6 13.4A7 7 0 0 0 19 10M12 19v3" /><path stroke="#e8000a" strokeWidth="2.1" d="M3 3l18 18" /></svg>
);
const CamOff = ({ cls = 'h-4 w-4' }) => (
  <svg className={cls} viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path stroke="currentColor" d="M2 6a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2z" /><path stroke="currentColor" d="M15 10l6-4v12l-6-4" /><path stroke="#e8000a" strokeWidth="2.1" d="M2 2l20 20" /></svg>
);
const Screen = ({ cls = 'h-4 w-4' }) => (
  <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" /><path d="M8 21h8M12 17v4" /></svg>
);
const Phone = ({ cls = 'h-5 w-5' }) => (
  <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 8v-.5A2.5 2.5 0 0 0 18.5 5h-13A2.5 2.5 0 0 0 3 7.5v.7c0 .5.3 1 .8 1.2a19 19 0 0 0 16.4 0c.5-.2.8-.7.8-1.2z" transform="translate(0 4)" /></svg>
);
const Users = ({ cls = 'h-4 w-4' }) => (
  <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8M23 21v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8" /></svg>
);
const Gear = ({ cls = 'h-4 w-4' }) => (
  <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.9 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.6-1 1.7 1.7 0 0 0-.3-1.9l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.9.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.9-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.9V9c.3.6.9 1 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z" /></svg>
);
const Face = ({ cls = 'h-4 w-4' }) => (
  <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9" /><circle cx="9" cy="10" r="0.6" fill="currentColor" /><circle cx="15" cy="10" r="0.6" fill="currentColor" /><path d="M9.5 15a3.5 3.5 0 0 0 5 0" /></svg>
);
const Sparkle = ({ cls = 'h-5 w-5' }) => (
  <svg className={cls} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9z" /><path d="M18 4v2M17 5h2" /><circle cx="12" cy="20" r="0.6" fill="currentColor" /></svg>
);

/* Figma 253:4582 — pill toggle, #05de73 when on */
function Toggle({ on, onChange, label }) {
  return (
    <button type="button" role="switch" aria-checked={on} aria-label={label} onClick={() => onChange(!on)}
      className={`relative h-6 w-11 shrink-0 rounded-full transition ${on ? 'bg-[#05de73]' : 'bg-[#364054]'}`}>
      <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-all ${on ? 'left-[22px]' : 'left-0.5'}`} />
    </button>
  );
}

/* Figma 253:4584-4599 — camera feed + landmark overlay */
function FaceMesh({ t, src = FACE }) {
  return (
    <div className="relative h-[220px] shrink-0 overflow-hidden rounded-[10px] border border-[#364054] bg-[#0f1729]">
      <img src={src} alt="" className="h-full w-full object-cover opacity-60" />
      <svg viewBox="0 0 334 278" preserveAspectRatio="xMidYMid meet" className="absolute inset-0 h-full w-full">
        <ellipse cx="153" cy="100" rx="76" ry="89" fill="none" stroke="#3b82f5" strokeWidth="2.8" className="animate-pulse" />
        <circle cx="128" cy="87" r="4.5" fill="#0fba82" />
        <circle cx="179" cy="87" r="4.5" fill="#0fba82" />
        <circle cx="153" cy="105" r="3" fill="#0fba82" />
        <circle cx="134" cy="128" r="4.5" fill="#f59e0a" />
        <circle cx="172" cy="128" r="4.5" fill="#f59e0a" />
        <circle cx="115" cy="93" r="3" fill="#6366f2" />
        <circle cx="191" cy="93" r="3" fill="#6366f2" />
        <circle cx="121" cy="117" r="3" fill="#6366f2" />
        <circle cx="184" cy="117" r="3" fill="#6366f2" />
        <line x1="128" y1="87" x2="179" y2="87" stroke="#3b82f5" strokeWidth="1.4" opacity="0.3" />
        <line x1="134" y1="129" x2="172" y2="129" stroke="#f59e0a" strokeWidth="1.4" opacity="0.3" />
      </svg>
      <span className="absolute bottom-1.5 left-2 rounded bg-black/60 px-1.5 py-0.5 text-[10px] text-[#05de73]">
        ● {t({ en: 'Live analysis', zh: '实时分析中' })}
      </span>
    </div>
  );
}

export default function FacialTurnTaking() {
  const { t, lang } = useLanguage();
  const [view, setView] = useState('speaker');
  const [faceRec, setFaceRec] = useState(false);
  const [muted, setMuted] = useState(false);
  const [dismissed, setDismissed] = useState({ speaker: false, participant: false });

  const v = VIEWS[view];
  const nameOf = (key) => t(P[key]);
  // Compact avatar label: English initials (Chen Wei → CW), Chinese surname (陈威 → 陈).
  const avatarLabel = (key) =>
    lang === 'zh'
      ? P[key].zh.charAt(0)
      : P[key].en.split(' ').map((w) => w.charAt(0)).join('').toUpperCase();
  const switchView = (nv) => setView(nv);
  const dismiss = (k) => setDismissed((d) => ({ ...d, [k]: true }));

  const showSpeakerNotice = view === 'speaker' && !faceRec && !dismissed.speaker;
  const showParticipantNotice = view === 'participant' && !dismissed.participant;

  return (
    <div className="flex h-full w-full flex-col bg-[#0f1729] text-white">
      {/* perspective switcher — outside the meeting screen */}
      <div className="flex shrink-0 items-center gap-3 border-b border-[#364054] bg-[#0f1729] px-4 py-2">
        <span className="text-xs text-[#99a1b0]">{t({ en: 'View as', zh: '视角' })}</span>
        <div className="inline-flex rounded-full bg-[#1f2938] p-0.5">
          {[['speaker', { en: 'Speaker', zh: '发言者' }], ['participant', { en: 'Participant', zh: '参会者' }]].map(([k, label]) => (
            <button key={k} type="button" onClick={() => switchView(k)} aria-pressed={view === k}
              className={`rounded-full px-4 py-1 text-xs font-medium transition ${view === k ? 'bg-[#2b80ff] text-white' : 'text-[#99a1b0] hover:text-white'}`}>
              {t(label)}
            </button>
          ))}
        </div>
      </div>

      <div className="flex min-h-0 flex-1">
        {/* ── main meeting area (Figma 253:4478) ── */}
        <div className="flex min-w-0 flex-1 flex-col">
          {/* header — 253:4479 */}
          <div className="flex h-[52px] shrink-0 items-center justify-between bg-[#1f2938]/50 px-6">
            <span className="flex items-center gap-3 text-base font-medium">
              <span className="h-2 w-2 rounded-full bg-[#fa2b36] opacity-80" />
              {t({ en: 'Team Meeting', zh: '团队会议' })}
              <span className="text-sm font-normal text-[#99a1b0]">· 32:23</span>
            </span>
            <div className="flex items-center gap-2">
              <button type="button" aria-label={t({ en: 'Participants', zh: '参会者' })} className="flex h-9 w-9 items-center justify-center rounded-[10px] text-white/80 hover:bg-white/10"><Users /></button>
              <button type="button" aria-label={t({ en: 'Settings', zh: '设置' })} className="flex h-9 w-9 items-center justify-center rounded-[10px] text-white/80 hover:bg-white/10"><Gear /></button>
            </div>
          </div>

          {/* speaker banner — full-width blue band below header (screenshot 1) */}
          {showSpeakerNotice && (
            <div className="shrink-0 bg-[#2b80ff] px-5 py-3 animate-msg-in">
              <div className="flex items-start justify-between gap-4">
                <p className="text-sm leading-relaxed text-white">
                  {t({ en: 'The AI assistant noticed you may need more time to speak today. Would you like the AI assistant to help coordinate turn-taking?', zh: 'AI助手注意到您今天发言也许需要更多时间，是否要AI助手辅助协调发言顺序？' })}
                </p>
                <button type="button" aria-label={t({ en: 'Dismiss', zh: '关闭' })} onClick={() => dismiss('speaker')}
                  className="flex h-6 w-6 shrink-0 items-center justify-center rounded text-white hover:bg-white/15">
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"><path d="M6 6l12 12M18 6L6 18" /></svg>
                </button>
              </div>
              <button type="button" onClick={() => { setFaceRec(true); dismiss('speaker'); }}
                className="mt-2.5 rounded-lg bg-white px-4 py-2 text-sm font-medium text-[#2b80ff] hover:bg-white/90">
                {t({ en: 'Enable AI turn-taking assistance', zh: '启用AI助手协调发言顺序' })}
              </button>
            </div>
          )}

          {/* 2×2 grid — 253:4497 */}
          <div className="relative grid min-h-0 flex-1 grid-cols-2 grid-rows-2 gap-4 p-6">
            {/* participant reminder — floating blue card, top-center (screenshot 2) */}
            {showParticipantNotice && (
              <div className="absolute left-1/2 top-10 z-10 flex -translate-x-1/2 items-center gap-3.5 rounded-[10px] bg-[#2b80ff] px-5 py-3.5 shadow-2xl animate-msg-in">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/20 text-white">
                  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M18 11V6a2 2 0 0 0-4 0v5" /><path d="M14 10V4a2 2 0 0 0-4 0v6" /><path d="M10 10.5V6a2 2 0 0 0-4 0v8" /><path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15" /></svg>
                </span>
                <div className="whitespace-nowrap text-sm leading-relaxed text-white">
                  <p className="font-semibold">{t({ en: 'AI assistant reminder:', zh: 'AI助手提醒您：' })}</p>
                  <p>{t({ en: 'Chen Wei is still speaking and may need more time — please listen patiently.', zh: '陈威正在发言中，可能需要更多时间，请耐心倾听。' })}</p>
                </div>
              </div>
            )}
            {v.tiles.map((key) => {
              const you = key === v.you;
              return (
                <div key={key} className={`relative rounded-[10px] bg-[#1f2938] ${you ? 'border border-white' : ''}`}>
                  <div className="flex h-full w-full items-center justify-center">
                    <span className="flex h-20 w-20 items-center justify-center rounded-full bg-[#364054] text-lg font-semibold">{avatarLabel(key)}</span>
                  </div>
                  <span className="absolute bottom-3 left-3 flex items-center gap-1.5 rounded-[10px] bg-black/60 px-3 py-1 text-sm">
                    {nameOf(key)}{you && `（${t({ en: 'you', zh: '你' })}）`}
                    {key !== 'chenwei' && <MicOff cls="h-3.5 w-3.5" />}
                  </span>
                  <span className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-[10px] bg-[#364054] text-white"><CamOff cls="h-5 w-5" /></span>
                </div>
              );
            })}
          </div>

          {/* control bar — 253:4542 */}
          <div className="flex h-[68px] shrink-0 items-center justify-center gap-3 bg-[#1f2938]/50">
            <button type="button" onClick={() => setMuted((m) => !m)} title={t({ en: 'Mic', zh: '麦克风' })}
              className={`flex h-12 w-12 items-center justify-center rounded-full ${muted ? 'bg-[#e8000a]' : 'bg-[#364054]'} text-white`}><Mic /></button>
            <button type="button" title={t({ en: 'Camera', zh: '摄像头' })} className="flex h-12 w-12 items-center justify-center rounded-full bg-[#364054] text-white"><CamOff cls="h-5 w-5" /></button>
            <button type="button" title={t({ en: 'Share screen', zh: '共享屏幕' })} className="flex h-12 w-12 items-center justify-center rounded-full bg-[#364054] text-white"><Screen /></button>
            <button type="button" title={t({ en: 'Leave', zh: '结束通话' })} className="flex h-12 w-12 items-center justify-center rounded-full bg-[#e8000a] text-white"><Phone /></button>
          </div>
        </div>

        {/* ── right panel (Figma 253:4564) ── */}
        <aside className="flex w-96 shrink-0 flex-col border-l border-[#364054] bg-[#1f2938]">
          {/* top: banner + facial recognition — 253:4565 */}
          <div className="flex flex-col gap-4 border-b border-[#364054] p-4">
            {/* AI banner — 253:4566 — speaker view only, only while facial recognition is on */}
            {view === 'speaker' && faceRec && (
              <div className="flex items-start gap-2.5 rounded-[10px] border border-[#2b80ff]/30 bg-[#2b80ff] p-3">
                <span className="mt-0.5 shrink-0 text-white"><Sparkle /></span>
                <p className="text-sm leading-relaxed text-white">
                  {t({ en: 'The AI has reminded other participants to focus on what you are saying, giving you more time to speak.', zh: 'AI助手已提醒其他参与者专注您的发言内容，给您更多发言时间。' })}
                </p>
              </div>
            )}

            {/* AI facial recognition — 253:4573 */}
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2.5 text-lg font-medium"><Face /> {t({ en: 'AI Facial Recognition', zh: 'AI面部识别' })}</span>
              <Toggle on={faceRec} onChange={setFaceRec} label={t({ en: 'AI facial recognition', zh: 'AI面部识别' })} />
            </div>

            {faceRec ? (
              <FaceMesh t={t} src={view === 'participant' ? FACE_PARTICIPANT : FACE} />
            ) : (
              <div className="flex h-[220px] shrink-0 flex-col items-center justify-center rounded-[10px] border border-[#364054] bg-[#0f1729] px-4 text-center text-xs text-[#99a1b0]">
                <span className="mb-2 text-[#364054]"><Face cls="h-8 w-8" /></span>
                {t({ en: 'Turn on AI facial recognition to see your camera and live analysis', zh: '开启 AI 面部识别以查看您的摄像头和实时分析' })}
              </div>
            )}
          </div>

          {/* bottom: speaking intent — 253:4600 — only while facial recognition is on */}
          {faceRec && (
          <div className="flex flex-col gap-3 p-4">
            <span className="flex items-center gap-2.5 text-lg font-medium"><Mic /> {t({ en: 'Speaking intent', zh: '发言意图' })}</span>
            {faceRec ? (
              <div className="flex flex-col gap-2 rounded-[10px] border border-[#05de73]/30 bg-[#05de73]/15 px-[18px] pb-3 pt-2.5">
                <p className="text-[11px] tracking-wide text-[#99a1b0]">{t({ en: 'Conversation judgement', zh: '会话判断' })}</p>
                <div className="flex items-center gap-3">
                  <span className="flex h-12 w-12 items-center justify-center rounded-full border border-[#05de73] bg-[#0f1729]/60">
                    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="#05de73" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12l5 5L20 7" /></svg>
                  </span>
                  <div className="flex flex-col gap-0.5">
                    <p className="text-base font-semibold text-[#05de73]">{t({ en: 'Speaking now', zh: '正在發言' })}</p>
                    <p className="flex items-center gap-1.5 text-xs text-[#99a1b0]">
                      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#05de73]/60" /> {t({ en: 'Real-time analysis running', zh: '实时分析进行中' })}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="rounded-[10px] border border-[#364054] bg-[#0f1729] px-[18px] py-4 text-xs text-[#99a1b0]">
                {t({ en: 'Enable facial recognition to detect speaking intent.', zh: '开启面部识别后可判断发言意图。' })}
              </div>
            )}
          </div>
          )}
        </aside>
      </div>
    </div>
  );
}
