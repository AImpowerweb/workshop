import { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';

// ─────────────────────────────────────────────────────────────────────────────
//  Figma-matched rebuild of "Interview Screen with AI Notification" (417:175,
//  1143×769, concept 16). Bilingual. Wired: "语言模式提示" cleans the transcript,
//  "向其他参与者显示口吃模式提示" shows/hides the AI notice, mic/cam toggles.
//  Perspective switch (应聘者视角 / 面试官视角) recolours the notice amber↔blue and
//  moves the "我的画面" tile. The notice is expandable with micro-motion; the ⓘ on
//  the candidate toggle opens a tips popover.
//  Assets: /assets/interview/{interviewer.png,candidate.jpg} (from Figma).
// ─────────────────────────────────────────────────────────────────

const IMG = `${import.meta.env.BASE_URL}assets/interview/`;

const RAW_ANSWER = {
  en: 'Um, I-I worked on a-a complex micro-microservices project. We needed to... to migrate from-from a monolith. This-this was really chal-challenging, because we had to...',
  zh: '嗯，我...我参-参与了一个...一个复杂的微-微服务架构项目，我们需要... 需要从单体系统迁-迁移。这个...这个很具有挑-挑战性，因为我们需要...',
};

function cleanTranscript(s, on, lang) {
  if (!on) return s;
  if (lang === 'en') {
    return s
      .replace(/\b(um|uh|er|ah)\b,?\s*/gi, '')
      .replace(/\b([a-z])-\1\b/gi, '$1')
      .replace(/\b([a-z]{2,})-\1([a-z]*)/gi, '$1$2')
      .replace(/\b(\w+)\.\.\.\s*\1\b/gi, '$1')
      .replace(/\s{2,}/g, ' ')
      .replace(/\s+([,.?!])/g, '$1')
      .replace(/^[,\s]+/, '')
      .trim();
  }
  return s
    .replace(/嗯，/g, '')
    .replace(/([一-鿿])-\1/g, '$1')
    .replace(/([一-鿿]{1,3})\.\.\.\s*\1/g, '$1')
    .replace(/\.\.\.\s*/g, '')
    .replace(/，+/g, '，')
    .replace(/^，/, '');
}

/* ── icons ───────────────────────────────────────────────────────────────── */
const S = (w = 1.33) => ({ fill: 'none', stroke: 'currentColor', strokeWidth: w, strokeLinecap: 'round', strokeLinejoin: 'round' });
const IcBot = ({ size = 'h-6 w-6' }) => (
  <svg className={size} viewBox="0 0 24 24" {...S(2)}><rect x="4" y="8" width="16" height="12" rx="2" /><path d="M12 8V4M8 4h.01M16 4h-.01" /><path d="M2 14h2M20 14h2M9 13v2M15 13v2" /></svg>
);
const IcSparkles = () => (
  <svg className="h-4 w-4" viewBox="0 0 24 24" {...S()}><path d="M12 3l1.9 5.8a2 2 0 0 0 1.3 1.3L21 12l-5.8 1.9a2 2 0 0 0-1.3 1.3L12 21l-1.9-5.8a2 2 0 0 0-1.3-1.3L3 12l5.8-1.9a2 2 0 0 0 1.3-1.3z" /><path d="M19 3v4M21 5h-4" /></svg>
);
const IcMic = ({ off, size = 'h-4 w-4', w }) => (
  <svg className={size} viewBox="0 0 24 24" {...S(w || 1.33)}><rect x="9" y="2" width="6" height="12" rx="3" /><path d="M5 10a7 7 0 0 0 14 0M12 19v3" />{off && <path d="M3 3l18 18" />}</svg>
);
const IcVideo = ({ off }) => (
  <svg className="h-6 w-6" viewBox="0 0 24 24" {...S(2)}><path d="M2 6a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2z" /><path d="M15 10l6-4v12l-6-4" />{off && <path d="M2 2l20 20" />}</svg>
);
const IcInfo = ({ size = 'h-6 w-6' }) => (
  <svg className={size} viewBox="0 0 24 24" fill="currentColor"><path d="M11 9h2V7h-2m1 13c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8m0-18A10 10 0 0 0 2 12a10 10 0 0 0 10 10 10 10 0 0 0 10-10A10 10 0 0 0 12 2m-1 15h2v-6h-2v6z" /></svg>
);
const IcChevronDown = ({ open }) => (
  <svg className="h-4 w-4" viewBox="0 0 24 24" {...S(2)} style={{ transition: 'transform .2s', transform: open ? 'rotate(180deg)' : 'none' }}><path d="M6 9l6 6 6-6" /></svg>
);
const IcPhoneOff = () => (
  <svg className="h-6 w-6" viewBox="0 0 24 24" {...S(2)}><path d="M10.68 13.31a16 16 0 0 0 3.41 2.6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.42 19.42 0 0 1-3.33-2.67m-2.67-3.34a19.79 19.79 0 0 1-3.07-8.63A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91" /><path d="M22 2L2 22" /></svg>
);
const IcGear = () => (
  <svg className="h-6 w-6" viewBox="0 0 24 24" {...S(2)}><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" /><circle cx="12" cy="12" r="3" /></svg>
);

/* Figma toggle: 44×24, on colours #990ffa / #145cfc */
function Toggle({ on, onChange, color }) {
  return (
    <button type="button" role="switch" aria-checked={on} onClick={() => onChange(!on)}
      className={`relative h-6 w-11 shrink-0 rounded-full transition ${on ? '' : 'bg-[#45546b]'}`}
      style={on ? { backgroundColor: color } : undefined}>
      <span className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow transition-all ${on ? 'left-[24px]' : 'left-1'}`} />
    </button>
  );
}

export default function InterviewNotification() {
  const { t, lang } = useLanguage();
  const [view, setView] = useState('candidate'); // 应聘者视角 / 面试官视角
  const [cleanMode, setCleanMode] = useState(true); // 语言模式提示
  const [showHint, setShowHint] = useState(true); // 向其他参与者显示口吃模式提示
  const [bannerOpen, setBannerOpen] = useState(false); // expandable 检测到语言模式 notice
  const [tipOpen, setTipOpen] = useState(false); // ⓘ tips popover
  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(true);

  const isCand = view === 'candidate';

  // The notice recolours + reframes by perspective: amber (what the candidate
  // sees) vs blue (the reminder the interviewer receives).
  const banner = isCand
    ? {
        grad: 'linear-gradient(90deg, #ff9900 0%, #ff6900 50%, #ff9900 100%)',
        border: 'rgba(255,186,0,0.5)',
        title: { en: 'Speech pattern detected', zh: '检测到语言模式' },
        body: { en: 'The AI has reminded the interviewer to focus on your content and give you more time to speak.', zh: 'AI助手已提醒面试官专注您的发言内容，给您更多发言时间。' },
        detail: [
          { en: 'Detected repetitions and pauses — smoothed in your live transcript.', zh: '检测到重复与停顿，已在实时转录中平滑处理。' },
          { en: 'Suggested the interviewer allow ~20% more time to answer.', zh: '已建议面试官延长约 20% 的作答时间。' },
          { en: 'This note is visible only to you and the interviewer.', zh: '该提示仅你与面试官可见。' },
        ],
      }
    : {
        grad: 'linear-gradient(90deg, #145cfc 0%, #2b80ff 50%, #145cfc 100%)',
        border: 'rgba(82,163,255,0.5)',
        title: { en: 'Candidate is using speech assistance', zh: '候选人已启用语言辅助' },
        body: { en: 'Wang Jing may stutter — unrelated to ability or honesty. Please focus on the content of the answers, avoid interrupting, and allow extra time to respond.', zh: '王静可能有口吃——这与能力或诚信无关。请专注于回答内容，避免打断，并给予更多作答时间。' },
        detail: [
          { en: 'Focus on the substance of the answer, not the delivery.', zh: '请关注回答的内容，而非表达方式。' },
          { en: 'Avoid finishing sentences or interrupting; allow pauses.', zh: '避免替其接话或打断，允许适当停顿。' },
          { en: 'Speech assistance is candidate-controlled and private.', zh: '语言辅助由候选人开启，且为私密设置。' },
        ],
      };

  return (
    <div className="flex h-full w-full flex-col bg-[#1c293d] text-white">
      <style>{`@keyframes in-bnr{from{opacity:0;transform:translateY(-6px)}to{opacity:1;transform:none}}@keyframes in-dtl{from{opacity:0;transform:translateY(-4px)}to{opacity:1;transform:none}}@keyframes in-shm{0%{transform:translateX(-140%)}60%,100%{transform:translateX(280%)}}@keyframes in-pop{from{opacity:0;transform:translateY(-4px) scale(.98)}to{opacity:1;transform:none}}`}</style>

      {/* header — Figma: 81px, #1c293d/80, gradient bot icon, pill toggles */}
      <div className="flex min-h-[81px] shrink-0 flex-wrap items-center gap-x-6 gap-y-3 border-b border-[#304059]/50 bg-[#1c293d]/80 px-6 py-3 shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1)]">
        <div className="flex shrink-0 items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-[10px] shadow-lg" style={{ backgroundImage: 'linear-gradient(135deg, #ad45ff 0%, #145cfc 100%)' }}><IcBot /></span>
          <div>
            <p className="text-lg font-semibold leading-7 whitespace-nowrap">{t({ en: 'Interview Communication Assistant', zh: '面试沟通辅助系统' })}</p>
            <p className="text-sm text-[#8fa1ba]">{t({ en: 'Senior Developer role', zh: '高级开发工程师岗位' })}</p>
          </div>
        </div>

        {/* perspective switch — 应聘者视角 / 面试官视角 */}
        <div className="flex shrink-0 items-center rounded-full border border-[#45546b]/50 bg-[#304059]/40 p-1 text-sm font-medium">
          <button type="button" onClick={() => setView('candidate')} className={`rounded-full px-3.5 py-1.5 transition ${isCand ? 'text-white' : 'text-[#8fa1ba] hover:text-[#c9d6e3]'}`} style={isCand ? { backgroundColor: '#990ffa' } : undefined}>
            {t({ en: 'Candidate', zh: '应聘者视角' })}
          </button>
          <button type="button" onClick={() => setView('interviewer')} className={`rounded-full px-3.5 py-1.5 transition ${!isCand ? 'text-white' : 'text-[#8fa1ba] hover:text-[#c9d6e3]'}`} style={!isCand ? { backgroundColor: '#145cfc' } : undefined}>
            {t({ en: 'Interviewer', zh: '面试官视角' })}
          </button>
        </div>

        <div className="ml-auto flex flex-wrap items-center gap-4">
          <span className="flex h-[46px] shrink-0 items-center gap-3 whitespace-nowrap rounded-full border border-[#45546b]/50 bg-[#304059]/50 px-[17px] text-sm font-medium text-[#c9d6e3]">
            <span className="text-[#c27aff]"><IcSparkles /></span>
            {t({ en: 'Speech-pattern hint', zh: '语言模式提示' })}
            <Toggle on={cleanMode} onChange={setCleanMode} color="#990ffa" />
          </span>

          {isCand ? (
            <span className="relative flex h-[46px] shrink-0 items-center gap-3 whitespace-nowrap rounded-full border border-[#45546b]/50 bg-[#304059]/50 px-[17px] text-sm font-medium text-[#c9d6e3]">
              <span className="text-[#52a3ff]"><IcMic /></span>
              {t({ en: 'Show stutter hint to others', zh: '向其他参与者显示口吃模式提示' })}
              <Toggle on={showHint} onChange={setShowHint} color="#145cfc" />
              <button type="button" onClick={() => setTipOpen((v) => !v)} aria-label={t({ en: 'More info', zh: '更多信息' })} className={`transition ${tipOpen ? 'text-white' : 'text-white/70 hover:text-white'}`}>
                <IcInfo size="h-[18px] w-[18px]" />
              </button>
              {tipOpen && (
                <>
                  <span className="fixed inset-0 z-40" onClick={() => setTipOpen(false)} />
                  {/* whitespace-normal resets the pill's `whitespace-nowrap`,
                      which would otherwise stop the bullets wrapping and push
                      the text outside this 318px card. */}
                  <div className="absolute right-0 top-[56px] z-50 w-[318px] whitespace-normal rounded-2xl border border-[#45546b] bg-[#22314a] p-4 text-left shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)]" style={{ animation: 'in-pop .18s ease-out' }}>
                    <span className="absolute -top-1.5 right-8 h-3 w-3 rotate-45 border-l border-t border-[#45546b] bg-[#22314a]" />
                    <p className="flex items-center gap-2 text-sm font-semibold text-white">
                      <span className="text-[#52a3ff]"><IcInfo size="h-4 w-4" /></span>
                      {t({ en: 'About the stutter-mode hint', zh: '关于口吃模式提示' })}
                    </p>
                    <ul className="mt-2.5 space-y-2 text-[13px] leading-[19px] text-[#c9d6e3]">
                      {[
                        { en: 'When on, a brief, neutral note is shown to the interviewer so they know you may need a little more time to speak.', zh: '开启后，会向面试官显示一条简短中立的说明，让对方知道你可能需要更多表达时间。' },
                        { en: 'It helps prevent misread pauses — stuttering is unrelated to ability or honesty.', zh: '有助于避免停顿被误解——口吃与能力或诚信无关。' },
                        { en: 'No medical details are shared, and you can turn it off anytime.', zh: '不会透露任何医疗信息，你可以随时关闭。' },
                      ].map((tip, i) => (
                        <li key={i} className="flex gap-2">
                          <span className="mt-[6px] h-1.5 w-1.5 shrink-0 rounded-full bg-[#52a3ff]" />
                          <span>{t(tip)}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </>
              )}
            </span>
          ) : (
            <span className={`flex h-[46px] shrink-0 items-center gap-2 whitespace-nowrap rounded-full border px-[17px] text-sm font-medium ${showHint ? 'border-[#145cfc]/50 bg-[#145cfc]/20 text-[#8fc4ff]' : 'border-[#45546b]/50 bg-[#304059]/50 text-[#8fa1ba]'}`}>
              <span className={showHint ? 'text-[#52a3ff]' : 'text-[#8fa1ba]'}><IcMic /></span>
              {showHint ? t({ en: 'Speech assistance active', zh: '候选人已启用语言辅助' }) : t({ en: 'No speech assistance', zh: '未启用语言辅助' })}
            </span>
          )}

          <span className="flex h-[38px] shrink-0 items-center gap-2 whitespace-nowrap rounded-full border border-[#fa2b36]/30 bg-[#fa2b36]/20 px-4 text-sm font-medium text-[#ff6366]">
            <span className="h-[9px] w-[9px] animate-pulse rounded-full bg-[#fa2b36] opacity-75 shadow-[0_0_10px_rgba(250,43,54,0.5)]" /> {t({ en: 'Recording', zh: '录制中' })}
          </span>
          <span className="shrink-0 rounded-[10px] bg-[#304059]/50 px-3 py-2 font-mono text-sm text-[#c9d6e3]">15:32</span>
        </div>
      </div>

      {/* body */}
      <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto p-6">
        {/* video tiles — Figma: 540×253, r16 */}
        <div className="grid shrink-0 grid-cols-2 gap-4">
          {/* 李明 — interviewer. Whoever is viewing sees their own tile on the
              left, so the pair swaps sides between the two perspectives. */}
          <div className={`relative h-[253px] overflow-hidden rounded-2xl border bg-[#1c293d] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)] ${isCand ? 'order-2 border-[#304059]/50' : 'order-1 border-[#145cfc]/50'}`}>
            <img src={IMG + 'interviewer.png'} alt="" className="h-full w-full object-cover" />
            {!isCand && (
              <span className="absolute right-[19px] top-[18px] rounded-[10px] border border-[#52a3ff]/50 bg-[#145cfc]/90 px-[13px] py-[11px] text-xs font-semibold leading-none">{t({ en: 'My video', zh: '我的画面' })}</span>
            )}
            <span className="absolute bottom-4 left-4 flex items-center gap-2 rounded-[14px] border border-white/10 bg-black/60 px-[17px] py-[11px] text-sm font-semibold">
              <IcMic /> {t({ en: 'Li Ming', zh: '李明' })} <span className="text-xs font-normal text-[#c9d6e3]">({isCand ? t({ en: 'Interviewer', zh: '面试官' }) : t({ en: 'me', zh: '我' })})</span>
            </span>
          </div>
          {/* 王静 — candidate */}
          <div className={`relative h-[253px] overflow-hidden rounded-2xl border bg-[#1c293d] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)] ${isCand ? 'order-1 border-[#ad45ff]/50' : 'order-2 border-[#304059]/50'}`}>
            <img src={IMG + 'candidate.jpg'} alt="" className="h-full w-full object-cover object-[center_20%]" />
            {isCand && (
              <span className="absolute right-[19px] top-[18px] rounded-[10px] border border-[#c27aff]/50 bg-[#990ffa]/90 px-[13px] py-[11px] text-xs font-semibold leading-none">{t({ en: 'My video', zh: '我的画面' })}</span>
            )}
            <span className="absolute bottom-4 left-4 flex items-center gap-2 rounded-[14px] border border-white/10 bg-black/60 px-[17px] py-[11px] text-sm font-semibold">
              <IcMic /> {t({ en: 'Wang Jing', zh: '王静' })} <span className="text-xs font-normal text-[#c9d6e3]">({isCand ? t({ en: 'me', zh: '我' }) : t({ en: 'Candidate', zh: '应聘者' })})</span>
            </span>
          </div>
        </div>

        {/* AI notification — amber (candidate) / blue (interviewer), expandable */}
        {showHint && (
          <div className="relative shrink-0 overflow-hidden rounded-2xl border p-[22px] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)]" style={{ backgroundImage: banner.grad, borderColor: banner.border, animation: 'in-bnr .4s ease-out' }}>
            <span aria-hidden="true" className="pointer-events-none absolute inset-y-0 left-0 w-1/3" style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.22), transparent)', animation: 'in-shm 3.4s ease-in-out infinite' }} />
            <div className="relative flex items-start gap-4">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[14px] bg-white/30 shadow-lg"><IcBot /></span>
              <div className="min-w-0 flex-1">
                <button type="button" onClick={() => setBannerOpen((v) => !v)} className="flex w-full items-center gap-2 text-left" aria-expanded={bannerOpen}>
                  <span className="relative flex h-[9px] w-[9px] shrink-0">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-60" />
                    <span className="relative inline-flex h-[9px] w-[9px] rounded-full bg-white opacity-90 shadow-[0_0_10px_rgba(255,255,255,0.5)]" />
                  </span>
                  <span className="flex-1 text-base font-bold drop-shadow">{t(banner.title)}</span>
                  <span className="shrink-0 text-white/90"><IcChevronDown open={bannerOpen} /></span>
                </button>
                <p className="mt-2 text-sm leading-[23px] text-white/95 drop-shadow">{t(banner.body)}</p>
                {bannerOpen && (
                  <ul className="mt-3 space-y-2 border-t border-white/25 pt-3 text-sm leading-[21px] text-white/95" style={{ animation: 'in-dtl .28s ease-out' }}>
                    {banner.detail.map((d, i) => (
                      <li key={i} className="flex gap-2 drop-shadow">
                        <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-white/90" />
                        <span>{t(d)}</span>
                      </li>
                    ))}
                  </ul>
                )}
                <p className="mt-2 text-xs font-medium text-white/80">{t({ en: 'just now', zh: '刚刚' })}</p>
              </div>
            </div>
          </div>
        )}

        {/* live transcript — Figma: #1c293d/50, r16, pad 25 */}
        <div className="shrink-0 rounded-2xl border border-[#304059]/50 bg-[#1c293d]/50 p-[25px] shadow-[0_20px_25px_-5px_rgba(0,0,0,0.1)]">
          <h3 className="flex items-center gap-2 text-lg font-semibold">
            <span className="h-[9px] w-[9px] rounded-full bg-[#fa2b36] shadow-[0_0_10px_rgba(250,43,54,0.5)]" /> {t({ en: 'Live transcript', zh: '实时转录' })}
          </h3>
          <div className="mt-4 space-y-4 text-sm leading-[23px]">
            <p className="flex gap-3">
              <span className="shrink-0 font-semibold text-[#52a3ff]">{t({ en: 'Li Ming:', zh: '李明:' })}</span>
              <span className="text-[#c9d6e3]">{t({ en: 'Can you tell me about a challenging project you recently worked on?', zh: '能介绍一下你最近参与的一个具有挑战性的项目吗？' })}</span>
            </p>
            <p className="flex gap-3">
              <span className="shrink-0 font-semibold text-[#c27aff]">{t({ en: 'Me:', zh: '我:' })}</span>
              <span className="text-white">
                {cleanTranscript(t(RAW_ANSWER), cleanMode, lang)}
                <span className="ml-1 inline-block h-4 w-2 animate-pulse bg-white/50 align-middle" />
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* call controls — Figma: 97px bar, 56px buttons #304059 border #45546b */}
      <div className="flex h-[97px] shrink-0 items-center justify-center gap-4 border-t border-[#304059]/50 bg-[#1c293d] shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1)]">
        <button type="button" onClick={() => setMicOn((v) => !v)}
          className={`flex h-14 w-14 items-center justify-center rounded-full border shadow-lg transition ${micOn ? 'border-[#45546b] bg-[#304059] hover:bg-[#3c4d68]' : 'border-[#fa2b36] bg-[#fa2b36]'}`}>
          <IcMic off={!micOn} size="h-6 w-6" w={2} />
        </button>
        <button type="button" onClick={() => setCamOn((v) => !v)}
          className={`flex h-14 w-14 items-center justify-center rounded-full border shadow-lg transition ${camOn ? 'border-[#45546b] bg-[#304059] hover:bg-[#3c4d68]' : 'border-[#fa2b36] bg-[#fa2b36]'}`}>
          <IcVideo off={!camOn} />
        </button>
        <button type="button" className="flex h-14 w-14 items-center justify-center rounded-full bg-[#e8000a] shadow-[0_10px_15px_-3px_rgba(232,0,10,0.3)]"><IcPhoneOff /></button>
        <button type="button" className="flex h-14 w-14 items-center justify-center rounded-full border border-[#45546b] bg-[#304059] shadow-lg hover:bg-[#3c4d68]"><IcGear /></button>
      </div>
    </div>
  );
}
