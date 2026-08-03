import { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import MeiAvatar from './MeiAvatar';

// ─────────────────────────────────────────────────────────────────────────────
//  Figma-matched rebuild of "Workplace - AI 小助手日志" (Version B). Bilingual.
//  Colors follow Figma: bg #0a0a0a, top bar #121217, sidebar #1a1a1f, cards
//  #1a1a1a / #242424, accent pink #e84d8a, 8 emotion colors.
//  Emotions use the exact emoji glyphs from Figma (812:409): 😊💪😌🙂😬😩😔😣.
//  Tabs: 每日 (812:345) / 每周 / 每月, plus the 写日志弹窗 Journal Modal (812:1620),
//  the 紧张 tooltip (812:517), and an assistant SETTINGS panel (小美 ⇄ 小黄).
// ─────────────────────────────────────────────────────────────────────────────

/* ── line icons (stroke style, like the settings + camera icons) ──────────── */
const Svg = ({ children, className = 'h-5 w-5', sw = 1.8 }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">{children}</svg>
);
const IcHome = (p) => <Svg {...p}><path d="M4 11 12 4l8 7" /><path d="M6.5 9.5V19h11V9.5" /></Svg>;
const IcVideo = (p) => <Svg {...p}><rect x="3" y="6.5" width="12" height="11" rx="2.5" /><path d="M15 10.5 20 7.5v9L15 13.5z" /></Svg>;
const IcChat = (p) => <Svg {...p}><path d="M5 5.5h14a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H9l-3.5 3v-3H5a1 1 0 0 1-1-1v-8a1 1 0 0 1 1-1z" /></Svg>;
const IcCalendar = (p) => <Svg {...p}><rect x="4" y="5.5" width="16" height="14" rx="2" /><path d="M4 9.5h16M8 3.5v3M16 3.5v3" /></Svg>;
const IcSparkles = (p) => <Svg {...p}><path d="M12 4l1.3 3.7L17 9l-3.7 1.3L12 14l-1.3-3.7L7 9l3.7-1.3z" /><path d="M18 14l.55 1.6 1.6.55-1.6.55L18 18.3l-.55-1.6-1.6-.55 1.6-.55z" /></Svg>;
const IcLayers = (p) => <Svg {...p}><path d="M12 4 3.5 8.5 12 13l8.5-4.5z" /><path d="M4.5 12 12 16l7.5-4" /></Svg>;
const IcDots = (p) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={p.className || 'h-5 w-5'} aria-hidden="true">
    <circle cx="6" cy="12" r="1.5" /><circle cx="12" cy="12" r="1.5" /><circle cx="18" cy="12" r="1.5" />
  </svg>
);
const IcGear = (p) => <Svg {...p}><circle cx="12" cy="12" r="3" /><path d="M12 3.6v2.3M12 18.1v2.3M20.4 12h-2.3M5.9 12H3.6M18 6l-1.6 1.6M7.6 16.4 6 18M18 18l-1.6-1.6M7.6 7.6 6 6" /></Svg>;
const IcChevL = (p) => <Svg {...p}><path d="M14 7l-5 5 5 5" /></Svg>;
const IcChevR = (p) => <Svg {...p}><path d="M10 7l5 5-5 5" /></Svg>;
const IcRefresh = (p) => <Svg {...p}><path d="M19.5 9A7 7 0 1 0 20.5 13" /><path d="M20 4.5V9h-4.5" /></Svg>;
const IcSearch = (p) => <Svg {...p}><circle cx="11" cy="11" r="6" /><path d="M20 20l-3.6-3.6" /></Svg>;
const IcPlus = (p) => <Svg {...p}><path d="M12 5v14M5 12h14" /></Svg>;
const IcBell = (p) => <Svg {...p}><path d="M6.5 10a5.5 5.5 0 0 1 11 0c0 4 1.5 5.5 1.5 5.5H5s1.5-1.5 1.5-5.5z" /><path d="M10 18.5a2 2 0 0 0 4 0" /></Svg>;
const IcLayout = (p) => <Svg {...p}><rect x="4" y="5" width="16" height="14" rx="2" /><path d="M9 5v14" /></Svg>;
const IcCheck = (p) => <Svg {...p}><path d="M5 12.5l4.5 4.5L19 7" /></Svg>;
const IcClose = (p) => <Svg {...p}><path d="M6 6l12 12M18 6L6 18" /></Svg>;
const IcCamera = (p) => <Svg {...p}><path d="M4 8.5a2 2 0 0 1 2-2h1.6l1-1.6h4.8l1 1.6H18a2 2 0 0 1 2 2V17a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2z" /><circle cx="12" cy="12.5" r="3" /></Svg>;
const IcEdit = (p) => <Svg {...p}><path d="M4 20h4L18.5 9.5a2 2 0 0 0-2.8-2.8L5 17.2z" /><path d="M13.5 6.5l4 4" /></Svg>;
const IcPaperclip = (p) => <Svg {...p}><path d="M8 12.5V8a4 4 0 0 1 8 0v8.5a2.5 2.5 0 0 1-5 0V9" /></Svg>;
const IcMic = (p) => <Svg {...p}><rect x="9" y="3.5" width="6" height="11" rx="3" /><path d="M6 12a6 6 0 0 0 12 0M12 18v2.5" /></Svg>;
const IcSmile = (p) => <Svg {...p}><circle cx="12" cy="12" r="8.5" /><path d="M8.5 14.5c1.2 1.6 5.8 1.6 7 0" /><circle cx="9.2" cy="10" r="1" fill="currentColor" stroke="none" /><circle cx="14.8" cy="10" r="1" fill="currentColor" stroke="none" /></Svg>;
const IcSend = (p) => <Svg {...p}><path d="M4.5 12 20 5l-4.5 15-3.2-6.2z" /><path d="M12.3 13.8 20 5" /></Svg>;

/* ── assistant personas (avatar switch: 小美 rose ⇄ 小黄 yellow) ────────────── */
const ASSISTANTS = [
  { id: 'xiaomei', name: { en: 'Xiaomei', zh: '小美' }, disc: '#d4a6a1', fg: '#5b2b2b' },
  { id: 'xiaohuang', name: { en: 'Xiaohuang', zh: '小黄' }, disc: '#f5c34b', fg: '#3a2e12' },
];

/* 小美 always uses her illustrated face — the same one Custom Emotion Tagging
   shows — while 小黄 keeps the generic assistant glyph. `px` must match `size`. */
function PersonaAvatar({ persona, size = 'h-6 w-6', px = 24 }) {
  if (persona.id === 'xiaomei') return <MeiAvatar size={px} />;
  return <AssistantAvatar persona={persona} size={size} />;
}

function AssistantAvatar({ persona, size = 'h-6 w-6' }) {
  return (
    <span className={`flex ${size} shrink-0 items-center justify-center rounded-full`} style={{ backgroundColor: persona.disc, color: persona.fg }} aria-hidden="true">
      <svg viewBox="0 0 24 24" className="h-[64%] w-[64%]" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 4.6v1.8" /><circle cx="12" cy="3.4" r="1" fill="currentColor" stroke="none" />
        <rect x="5.6" y="6.6" width="12.8" height="11" rx="4.2" />
        <circle cx="9.6" cy="12" r="1.25" fill="currentColor" stroke="none" />
        <circle cx="14.4" cy="12" r="1.25" fill="currentColor" stroke="none" />
        <path d="M9.9 14.6c.7.7 3.5.7 4.2 0" />
      </svg>
    </span>
  );
}

// Emotion palette — emoji glyphs match Figma 812:409 exactly.
const EMOTIONS = [
  { variant: 'happy', name: { en: 'Happy', zh: '开心' }, emoji: '😊', color: '#0fba82' },
  { variant: 'confident', name: { en: 'Confident', zh: '自信' }, emoji: '💪', color: '#e84d8a' },
  { variant: 'relaxed', name: { en: 'Relaxed', zh: '放松' }, emoji: '😌', color: '#05b5d4' },
  { variant: 'calm', name: { en: 'Calm', zh: '平静' }, emoji: '🙂', color: '#94a3b8' },
  { variant: 'anxious', name: { en: 'Anxious', zh: '紧张' }, emoji: '😬', color: '#f59e0a' },
  { variant: 'tired', name: { en: 'Tired', zh: '很累' }, emoji: '😩', color: '#8c5cf5' },
  { variant: 'down', name: { en: 'Down', zh: '低落' }, emoji: '😔', color: '#3b82f5' },
  { variant: 'frustrated', name: { en: 'Frustrated', zh: '沮丧' }, emoji: '😣', color: '#f04545' },
];
const EMO = Object.fromEntries(EMOTIONS.map((e) => [e.variant, e]));
// distribution helper: turn a {variant: pct} map into the EMOTIONS array with pct
const withPct = (dist) => EMOTIONS.map((e) => ({ ...e, pct: dist[e.variant] || 0 }));

// Per-emotion tip from the assistant — shown when an emotion circle is clicked.
const EMO_TIPS = {
  happy: { en: 'Happiness is worth saving. Jot down this good mood to revisit on a rough day 🌟', zh: '开心值得记录。把这份好心情写下来，下次低落时翻出来看看 🌟' },
  confident: { en: "Confidence comes from preparation. Remember this feeling — it'll carry you next time 💪", zh: '自信来自准备。记住此刻的状态，下次遇到挑战时它会帮到你 💪' },
  relaxed: { en: 'Relaxation is a gift to yourself. Notice what eased you, and make more room for it 🌿', zh: '放松是给自己的礼物。留意让你放松的场景，多给自己一些这样的空间 🌿' },
  calm: { en: "Calm is a good place to be. Hold this rhythm — you don't need to fill every minute 🍃", zh: '平静是很好的状态。保持这个节奏，别急着填满每一分钟 🍃' },
  anxious: { en: 'Feeling nervous means you care. Try 3 deep breaths — your rhythm will settle 🌬', zh: '紧张说明你在意。试试深呼吸 3 次，节奏会稳下来 🌬' },
  tired: { en: 'Tired? Take a beat. Water, a short walk — give yourself 5 minutes ☕', zh: '累了就先歇一下。喝口水、走两步，给自己 5 分钟 ☕' },
  down: { en: "Low moods pass. Talk to someone you trust, or write down what's on your mind 💗", zh: '低落是暂时的。找个信任的人聊聊，或把此刻的想法写下来 💗' },
  frustrated: { en: 'When frustrated, hold off on conclusions. List what is stuck and tackle one at a time 🧩', zh: '沮丧时先别急着下结论。把卡住的点列出来，一次解决一个 🧩' },
};

const DAILY_DIST = { happy: 8, confident: 6, relaxed: 5, calm: 8, anxious: 28, tired: 25, down: 15, frustrated: 5 };
const WEEK_DIST = { happy: 12, confident: 11, relaxed: 9, calm: 15, anxious: 19, tired: 17, down: 10, frustrated: 7 };
const MONTH_DIST = { happy: 15, confident: 13, relaxed: 11, calm: 17, anxious: 15, tired: 14, down: 9, frustrated: 6 };

const MEETINGS = [
  {
    title: { en: 'Product Weekly', zh: '产品周会' },
    meta: { en: 'Participants: 12 · Zoom', zh: '参与者: 12 人 · Zoom' },
    time: '09:00 – 09:45',
    note: { en: 'You raised a direction you had been hesitant to voice, and the team backed it right away. The product lead gave you a shout-out, and the meeting pace shifted around it.', zh: '你提出了一个之前不敢说的方向，团队立刻反馈支持。被产品负责人点名表扬，会议节奏因此调整。' },
    tags: [{ label: { en: 'Accomplished', zh: '有成就感' }, emoji: '💪', color: '#0fba82' }, { label: { en: 'Confident', zh: '自信' }, emoji: '💗', color: '#e84d8a' }],
    logged: true,
  },
  {
    title: { en: 'Client Sync', zh: '客户对齐' },
    meta: { en: 'Participants: 6 · Feishu', zh: '参与者: 6 人 · 飞书' },
    time: '11:30 – 12:00',
    note: { en: 'The client pushed back and you stayed calm, answering with data. A shaky start, but you adjusted mid-way — opening nerves are normal, and you held the rhythm to the end.', zh: '客户提出了一些质疑，你保持冷静用数据回应。开场略紧张，但在中段调整回来了。开场紧张正常 — 你最后稳住了节奏。' },
    tags: [{ label: { en: 'Anxious', zh: '紧张' }, emoji: '😬', color: '#f59e0a' }],
    logged: true,
  },
  {
    title: { en: 'Design Review', zh: '设计评审' },
    meta: { en: 'Participants: 8 · Zoom', zh: '参与者: 8 人 · Zoom' },
    time: '11:30 – 12:00',
    note: { en: 'You paced your feedback on the UI drafts well — listening fully before adding your points kept the discussion focused.', zh: '针对 UI 草案的反馈节奏掌握得很好。先听完同事意见再补充，让讨论更聚焦。' },
    tags: [{ label: { en: 'Tired', zh: '很累' }, emoji: '😩', color: '#8c5cf5' }],
    logged: false,
  },
];

const RECAP = [
  { color: '#0fba82', text: { en: 'You spoke up 3 times today — a high for this week', zh: '你今天主动发言了 3 次，是这周的高峰' } },
  { color: '#e84d8a', text: { en: 'First time proactively adding your view in Product Weekly — praised by name', zh: '在产品周会上首次主动补充意见，被点名表扬' } },
  { color: '#f59e0a', text: { en: 'If you would like to keep going, try a 5-minute breathing exercise tonight', zh: '如果还想继续，今晚可做 5 分钟呼吸练习' } },
];

// ── Weekly: 7-day trend (May 5–11). Each day has a dominant emotion + a mix bar.
const WEEK_DAYS = [
  { day: { en: 'Mon', zh: '周一' }, date: '5/5', dom: 'anxious', speak: 1, mix: { anxious: 45, tired: 30, calm: 25 }, note: { en: 'First proactive point in the weekly sync', zh: '周会上第一次主动补充观点' } },
  { day: { en: 'Tue', zh: '周二' }, date: '5/6', dom: 'calm', speak: 2, mix: { calm: 40, tired: 30, happy: 30 }, note: { en: 'Steady 1:1s, no back-to-back meetings', zh: '一对一节奏平稳，没有连续会议' } },
  { day: { en: 'Wed', zh: '周三' }, date: '5/7', dom: 'tired', speak: 1, mix: { tired: 50, down: 25, anxious: 25 }, note: { en: 'Long review block — energy dipped late', zh: '评审排得很满，后段有些疲惫' } },
  { day: { en: 'Thu', zh: '周四' }, date: '5/8', dom: 'confident', speak: 3, mix: { confident: 40, happy: 35, calm: 25 }, note: { en: 'Led the roadmap walkthrough end to end', zh: '完整主导了路线图讲解' } },
  { day: { en: 'Fri', zh: '周五' }, date: '5/9', dom: 'happy', speak: 4, mix: { happy: 45, confident: 35, relaxed: 20 }, note: { en: 'Client signed off — team celebrated', zh: '客户确认通过，团队一起庆祝' } },
  { day: { en: 'Sat', zh: '周六' }, date: '5/10', dom: 'relaxed', speak: 0, mix: { relaxed: 60, calm: 40 }, note: { en: 'Low-key weekend sync, relaxed pace', zh: '周末轻量同步，节奏放松' } },
  { day: { en: 'Sun', zh: '周日' }, date: '5/11', dom: 'anxious', speak: 3, mix: { anxious: 40, tired: 35, confident: 25 }, note: { en: 'Prepped for Monday, some pre-week nerves', zh: '为周一做准备，略有周初紧张' } },
];

const WEEK_RECAP = [
  { color: '#0fba82', text: { en: 'You spoke up on 6 of 7 days — the most consistent week this month', zh: '7 天里有 6 天主动发言，是本月最稳定的一周' } },
  { color: '#e84d8a', text: { en: 'Thursday & Friday were your strongest — confidence carried across meetings', zh: '周四、周五状态最佳 — 自信在会议间延续' } },
  { color: '#f59e0a', text: { en: 'Nerves cluster on Mondays. A short Sunday-night prep ritual may help', zh: '紧张多集中在周一。周日晚做点小准备也许有帮助' } },
];

// ── Monthly: May 2026. May 1 is a Friday. Days 1–11 have data; 12–31 are upcoming.
const MONTH_DOM = {
  1: 'relaxed', 2: 'calm', 3: 'calm', 4: 'anxious', 5: 'tired', 6: 'confident',
  7: 'happy', 8: 'relaxed', 9: 'calm', 10: 'down', 11: 'anxious',
};
const MONTH_TODAY = 11;
const MONTH_LEAD_BLANKS = 4; // Mon–Thu before Fri the 1st

// ── Monthly calendar emotion dots (matches attached Figma) — 4-colour legend.
const CAL_EMO = [
  { key: 'eff', name: { en: 'Efficient', zh: '高效' }, color: '#10b981' },
  { key: 'conf', name: { en: 'Confident', zh: '自信' }, color: '#e94c89' },
  { key: 'focus', name: { en: 'Focused', zh: '专注' }, color: '#06b6d4' },
  { key: 'anx', name: { en: 'Anxious', zh: '紧张' }, color: '#f59e0b' },
];
const CAL_C = Object.fromEntries(CAL_EMO.map((e) => [e.key, e.color]));
const MONTH_DOTS = {
  1: ['eff', 'conf'], 2: ['focus'], 4: ['eff', 'eff'], 5: ['conf', 'conf', 'focus'], 6: ['anx'],
  7: ['eff', 'conf'], 8: ['eff'], 11: ['focus', 'conf'], 12: ['eff'], 13: ['anx', 'eff'],
  14: ['conf', 'focus'], 15: ['eff'], 18: ['eff', 'eff'], 19: ['conf'], 20: ['focus', 'eff'],
  21: ['conf', 'focus', 'anx'], 22: ['eff'], 25: ['eff', 'eff'], 26: ['focus'], 27: ['eff', 'eff', 'conf'],
  28: ['anx'], 29: ['eff'],
};
const MONTH_MEETINGS_TOTAL = 38;

const MONTH_RECAP = [
  { color: '#0fba82', text: { en: 'Positive emotions rose to 39% this month, up from 28% in April', zh: '本月积极情绪升至 39%，较 4 月的 28% 上升' } },
  { color: '#e84d8a', text: { en: 'Your calmest stretch was May 1–3 — protect weekends like these', zh: '最平静的时段是 5 月 1–3 日 — 请守护好这样的周末' } },
  { color: '#8c5cf5', text: { en: 'Tired days still cluster around review-heavy weeks', zh: '疲惫的日子仍集中在评审密集的那几周' } },
];

// ── Weekly meeting records: meetings per chosen date (drill-down from the day chips / date pill).
const WK_MEET = {
  '5/5': [
    { time: '09:30', title: { en: 'Daily Standup', zh: '每日站会' }, meta: { en: '8 · Zoom', zh: '8 人 · Zoom' }, emo: 'calm', note: { en: 'Quick sync, flagged a blocker early', zh: '快速同步，提前抛出一个卡点' } },
    { time: '14:00', title: { en: 'Product Weekly', zh: '产品周会' }, meta: { en: '12 · Zoom', zh: '12 人 · Zoom' }, emo: 'anxious', note: { en: 'First proactive point of the week — nerves, but it landed', zh: '本周第一次主动补充，略紧张但说清了' } },
  ],
  '5/6': [
    { time: '09:30', title: { en: 'Daily Standup', zh: '每日站会' }, meta: { en: '8 · Zoom', zh: '8 人 · Zoom' }, emo: 'calm', note: { en: 'Smooth, nothing blocking', zh: '顺畅，无阻塞' } },
    { time: '11:00', title: { en: '1:1 with Manager', zh: '与主管一对一' }, meta: { en: '2 · Feishu', zh: '2 人 · 飞书' }, emo: 'relaxed', note: { en: 'Open chat about growth — felt heard', zh: '聊了成长方向，感觉被倾听' } },
  ],
  '5/7': [
    { time: '09:30', title: { en: 'Daily Standup', zh: '每日站会' }, meta: { en: '8 · Zoom', zh: '8 人 · Zoom' }, emo: 'tired', note: { en: 'Short night before — low energy', zh: '前一晚没睡好，状态偏低' } },
    { time: '13:30', title: { en: 'Design Review', zh: '设计评审' }, meta: { en: '8 · Zoom', zh: '8 人 · Zoom' }, emo: 'tired', note: { en: 'Listened fully before adding points', zh: '先听完再补充意见' } },
    { time: '17:00', title: { en: 'Client Sync', zh: '客户对齐' }, meta: { en: '6 · Feishu', zh: '6 人 · 飞书' }, emo: 'anxious', note: { en: 'Some pushback — answered with data', zh: '有质疑，用数据回应' } },
  ],
  '5/8': [
    { time: '09:30', title: { en: 'Daily Standup', zh: '每日站会' }, meta: { en: '8 · Zoom', zh: '8 人 · Zoom' }, emo: 'confident', note: { en: 'Clear and concise update', zh: '汇报清晰简洁' } },
    { time: '10:00', title: { en: 'Roadmap Walkthrough', zh: '路线图讲解' }, meta: { en: '14 · Zoom', zh: '14 人 · Zoom' }, emo: 'confident', note: { en: 'Led it end to end — great flow', zh: '完整主导，节奏很好' } },
    { time: '15:00', title: { en: 'Retro', zh: '复盘会' }, meta: { en: '9 · Feishu', zh: '9 人 · 飞书' }, emo: 'happy', note: { en: 'Summarized takeaways for the team', zh: '为团队总结了收获' } },
  ],
  '5/9': [
    { time: '09:30', title: { en: 'Daily Standup', zh: '每日站会' }, meta: { en: '8 · Zoom', zh: '8 人 · Zoom' }, emo: 'happy', note: { en: 'Upbeat, good momentum', zh: '状态积极，势头不错' } },
    { time: '11:00', title: { en: 'Client Sync', zh: '客户对齐' }, meta: { en: '6 · Feishu', zh: '6 人 · 飞书' }, emo: 'happy', note: { en: 'Client signed off — big relief', zh: '客户确认通过，松了口气' } },
    { time: '14:00', title: { en: 'Product Weekly (wrap)', zh: '产品周会 (收尾)' }, meta: { en: '12 · Zoom', zh: '12 人 · Zoom' }, emo: 'confident', note: { en: 'Shared the win, team celebrated', zh: '分享了成果，团队一起庆祝' } },
  ],
  '5/10': [
    { time: '10:30', title: { en: 'Weekend Planning Sync', zh: '周末规划同步' }, meta: { en: '4 · Feishu', zh: '4 人 · 飞书' }, emo: 'relaxed', note: { en: 'Low-key planning for next week — no pressure', zh: '为下周做轻量规划，没有压力' } },
    { time: '15:00', title: { en: 'Mentor 1:1 (coffee)', zh: '导师一对一 (咖啡)' }, meta: { en: '2 · In person', zh: '2 人 · 线下' }, emo: 'relaxed', note: { en: 'Casual catch-up, lots of encouragement', zh: '轻松交流，收获很多鼓励' } },
  ],
  '5/11': [
    { time: '16:00', title: { en: 'Weekly Prep', zh: '周会预备' }, meta: { en: '3 · Zoom', zh: '3 人 · Zoom' }, emo: 'anxious', note: { en: 'Prepping Monday agenda — pre-week nerves', zh: '准备周一议程，略有周初紧张' } },
    { time: '17:00', title: { en: 'Next-week Planning', zh: '下周计划' }, meta: { en: '5 · Feishu', zh: '5 人 · 飞书' }, emo: 'confident', note: { en: 'Mapped priorities, felt ready', zh: '梳理了优先级，感觉准备好了' } },
  ],
};

// ── Monthly meeting feedback: per meeting-type feedback + month-over-month trend.
const MONTH_FEEDBACK = {
  totals: { meetings: 68, spoke: 42 },
  items: [
    { emo: 'confident', type: { en: 'Product Weekly', zh: '产品周会' }, count: 4, trend: 'up', text: { en: 'Speaking frequency rose and your points read clearer', zh: '发言频率提升，观点表达更清晰' } },
    { emo: 'anxious', type: { en: 'Client Sync', zh: '客户对齐' }, count: 6, trend: 'up', text: { en: 'Opening nerves eased — you lean on data to steady the room', zh: '开场紧张减少，更善于用数据稳住节奏' } },
    { emo: 'calm', type: { en: 'Design Review', zh: '设计评审' }, count: 8, trend: 'steady', text: { en: 'You keep the listen-first rhythm well', zh: '“先听后说”的节奏保持得很好' } },
    { emo: 'happy', type: { en: 'Retro', zh: '复盘会' }, count: 3, trend: 'up', text: { en: 'You took the summary role — quiet leadership showing', zh: '主动承担复盘总结，展现出领导力' } },
    { emo: 'relaxed', type: { en: '1:1s', zh: '一对一' }, count: 12, trend: 'steady', text: { en: 'Steady and candid — a reliable weekly reset', zh: '稳定坦诚，是每周可靠的调整' } },
  ],
};

// ── Full-format meeting records per date — same card style + 写日志 as 本日会议记录.
const TAG = (v) => ({ label: EMO[v].name, emoji: EMO[v].emoji, color: EMO[v].color });
const MEET_BY_DATE = {
  '5/4': [
    { title: { en: 'Daily Standup', zh: '每日站会' }, meta: { en: 'Participants: 8 · Zoom', zh: '参与者: 8 人 · Zoom' }, time: '09:30 – 09:45',
      note: { en: 'First day back after the holiday — slow to warm up, but you laid out the goals for the week clearly.', zh: '假期后第一天，进入状态稍慢，但把本周目标讲清楚了。' },
      tags: [TAG('anxious')], logged: true },
    { title: { en: 'Requirements Review', zh: '需求评审' }, meta: { en: 'Participants: 6 · Feishu', zh: '参与者: 6 人 · 飞书' }, time: '14:00 – 15:00',
      note: { en: 'Scope disagreements surfaced. You proposed a middle path and the discussion got back on track.', zh: '需求范围出现分歧，你提出折中方案，讨论回到正轨。' },
      tags: [TAG('anxious'), TAG('tired')], logged: false },
  ],
  '5/5': [
    { title: { en: 'Daily Standup', zh: '每日站会' }, meta: { en: 'Participants: 8 · Zoom', zh: '参与者: 8 人 · Zoom' }, time: '09:30 – 09:45',
      note: { en: 'Quick sync — you flagged a blocker early and saved rework in the afternoon.', zh: '快速同步，提前抛出一个卡点，避免了下午的返工。' },
      tags: [TAG('calm')], logged: true },
    { title: { en: 'Product Weekly', zh: '产品周会' }, meta: { en: 'Participants: 12 · Zoom', zh: '参与者: 12 人 · Zoom' }, time: '14:00 – 14:45',
      note: { en: 'Your first proactive point of the week — nerves, but it landed and drew positive echoes.', zh: '本周第一次主动补充观点，略紧张但说清了，得到正面回应。' },
      tags: [TAG('anxious')], logged: true },
  ],
  '5/6': [
    { title: { en: 'Daily Standup', zh: '每日站会' }, meta: { en: 'Participants: 8 · Zoom', zh: '参与者: 8 人 · Zoom' }, time: '09:30 – 09:45',
      note: { en: 'Smooth update, nothing blocking — you helped confirm a dependency for a teammate.', zh: '汇报顺畅，无阻塞项，还帮同事确认了一个依赖。' },
      tags: [TAG('calm')], logged: false },
    { title: { en: '1:1 with Manager', zh: '与主管一对一' }, meta: { en: 'Participants: 2 · Feishu', zh: '参与者: 2 人 · 飞书' }, time: '11:00 – 11:30',
      note: { en: 'Talked growth direction and felt heard — agreed to try hosting a review next month.', zh: '聊了成长方向，感觉被倾听，约好下月尝试主持一次评审。' },
      tags: [TAG('relaxed')], logged: true },
  ],
  '5/7': [
    { title: { en: 'Daily Standup', zh: '每日站会' }, meta: { en: 'Participants: 8 · Zoom', zh: '参与者: 8 人 · Zoom' }, time: '09:30 – 09:45',
      note: { en: 'Short night before — low energy, but you kept the update concise.', zh: '前一晚没睡好，状态偏低，汇报保持了简洁。' },
      tags: [TAG('tired')], logged: false },
    { title: { en: 'Design Review', zh: '设计评审' }, meta: { en: 'Participants: 8 · Zoom', zh: '参与者: 8 人 · Zoom' }, time: '13:30 – 14:30',
      note: { en: 'Listening fully before adding your points kept the discussion focused; energy dipped late.', zh: '先听完同事意见再补充，让讨论更聚焦，后段有些疲惫。' },
      tags: [TAG('tired')], logged: true },
    { title: { en: 'Client Sync', zh: '客户对齐' }, meta: { en: 'Participants: 6 · Feishu', zh: '参与者: 6 人 · 飞书' }, time: '17:00 – 17:30',
      note: { en: 'The client pushed back — you answered with data and held the rhythm.', zh: '客户提出质疑，你用数据回应，稳住了节奏。' },
      tags: [TAG('anxious')], logged: false },
  ],
  '5/8': [
    { title: { en: 'Daily Standup', zh: '每日站会' }, meta: { en: 'Participants: 8 · Zoom', zh: '参与者: 8 人 · Zoom' }, time: '09:30 – 09:45',
      note: { en: 'Clear, concise update — you volunteered for a cross-team item.', zh: '汇报清晰简洁，主动认领了一个跨组事项。' },
      tags: [TAG('confident')], logged: true },
    { title: { en: 'Roadmap Walkthrough', zh: '路线图讲解' }, meta: { en: 'Participants: 14 · Zoom', zh: '参与者: 14 人 · Zoom' }, time: '10:00 – 11:00',
      note: { en: 'Led the walkthrough end to end with great pacing — the Q&A was handled calmly.', zh: '完整主导讲解，节奏很好，问答环节应对从容。' },
      tags: [TAG('confident'), TAG('happy')], logged: true },
    { title: { en: 'Retro', zh: '复盘会' }, meta: { en: 'Participants: 9 · Feishu', zh: '参与者: 9 人 · 飞书' }, time: '15:00 – 15:45',
      note: { en: 'You summarized the takeaways for the team — relaxed vibe, praised by teammates.', zh: '为团队总结了收获，氛围轻松，被同事点赞。' },
      tags: [TAG('happy')], logged: false },
  ],
  '5/9': [
    { title: { en: 'Daily Standup', zh: '每日站会' }, meta: { en: 'Participants: 8 · Zoom', zh: '参与者: 8 人 · Zoom' }, time: '09:30 – 09:45',
      note: { en: 'Upbeat — you shared your progress without being asked.', zh: '状态积极，主动分享了昨天的进展。' },
      tags: [TAG('happy')], logged: false },
    { title: { en: 'Client Sync', zh: '客户对齐' }, meta: { en: 'Participants: 6 · Feishu', zh: '参与者: 6 人 · 飞书' }, time: '11:00 – 11:30',
      note: { en: 'The client signed off — big relief, and next steps were locked in on the spot.', zh: '客户确认通过，松了口气，当场敲定了下一步节奏。' },
      tags: [TAG('happy')], logged: true },
    { title: { en: 'Product Weekly (wrap)', zh: '产品周会 (收尾)' }, meta: { en: 'Participants: 12 · Zoom', zh: '参与者: 12 人 · Zoom' }, time: '14:00 – 14:30',
      note: { en: 'Shared the win, the team celebrated, and you voiced your thanks.', zh: '分享了成果，团队一起庆祝，你也表达了感谢。' },
      tags: [TAG('confident')], logged: true },
  ],
  '5/10': [
    { title: { en: 'Weekend Planning Sync', zh: '周末规划同步' }, meta: { en: 'Participants: 4 · Feishu', zh: '参与者: 4 人 · 飞书' }, time: '10:30 – 11:00',
      note: { en: 'Low-key planning for next week — no pressure, relaxed pace.', zh: '为下周做轻量规划，没有压力，节奏放松。' },
      tags: [TAG('relaxed')], logged: false },
    { title: { en: 'Mentor 1:1 (coffee)', zh: '导师一对一 (咖啡)' }, meta: { en: 'Participants: 2 · In person', zh: '参与者: 2 人 · 线下' }, time: '15:00 – 16:00',
      note: { en: 'A casual catch-up with lots of encouragement — you talked long-term direction.', zh: '轻松交流，收获很多鼓励，聊到了长期方向。' },
      tags: [TAG('relaxed')], logged: true },
  ],
  '5/11': MEETINGS,
};

const NAV = [
  { icon: IcHome, label: { en: 'Home', zh: '主页' } },
  { icon: IcVideo, label: { en: 'Meetings', zh: '会议' } },
  { icon: IcChat, label: { en: 'Team Chat', zh: '团队聊天' } },
  { icon: IcCalendar, label: { en: 'Calendar', zh: '日程' } },
  { icon: IcSparkles, label: { en: 'AI Assistant Log', zh: 'AI 小助手日志' }, active: true },
  { icon: IcLayers, label: { en: 'Hub', zh: '中心' } },
  { icon: IcDots, label: { en: 'More', zh: '更多' }, badge: { en: 'NEW', zh: '新' } },
];

const TABS = [
  { key: 'daily', label: { en: 'Daily', zh: '每日' } },
  { key: 'weekly', label: { en: 'Weekly', zh: '每周' } },
  { key: 'monthly', label: { en: 'Monthly', zh: '每月' } },
];

/* ── an emotion circle: colored ring (fill@18%, 2px stroke) + emoji glyph ──── */
function EmoRing({ e, size = 'h-11 w-11', text = 'text-[24px]' }) {
  return (
    <span className={`flex ${size} items-center justify-center rounded-full border-2`}
      style={{ borderColor: e.color, backgroundColor: `${e.color}2e` }}>
      <span className={`${text} leading-none`} aria-hidden="true">{e.emoji}</span>
    </span>
  );
}

/* ── reusable "情绪概览" card (bar + 4×2 emoji grid) — every emotion is
      clickable, opening a tip from the assistant ─────────────────────────── */
function EmotionOverviewCard({ t, title, sub, emotions, tips, pname }) {
  const [open, setOpen] = useState(null);
  return (
    <section className="relative rounded-[14px] border border-white/[.08] bg-[#1a1a1a] p-4">
      <h3 className="text-[13px] font-bold">{t(title)}</h3>
      <p className="mt-0.5 text-[10px] text-[#999999]/60">{t(sub)}</p>
      <div className="mt-3 flex h-[18px] overflow-hidden rounded-full bg-[#292929]">
        {emotions.map((e) => (
          <div key={e.variant} style={{ backgroundColor: e.color, flexGrow: e.pct }} />
        ))}
      </div>
      <div className="mt-4 grid grid-cols-4 gap-y-4">
        {emotions.map((e) => {
          const hasTip = !!(tips && tips[e.variant]);
          const isOpen = open === e.variant;
          return (
            <button type="button" key={e.variant}
              onClick={hasTip ? () => setOpen(isOpen ? null : e.variant) : undefined}
              className={`relative flex flex-col items-center gap-1 text-center focus:outline-none ${hasTip ? 'cursor-pointer' : 'cursor-default'}`}>
              <span className="relative">
                <EmoRing e={e} />
              </span>
              <span className="mt-0.5 text-[11px] font-semibold">{t(e.name)}</span>
              <span className="text-xs font-bold" style={{ color: e.color }}>{e.pct}%</span>
              <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: e.color }} />
              {isOpen && hasTip && (
                <div className="absolute left-1/2 top-full z-20 mt-1.5 w-[220px] -translate-x-1/2 rounded-[10px] border bg-[#242424] p-2.5 text-left shadow-[0_8px_20px_rgba(0,0,0,0.55)]"
                  style={{ borderColor: `${e.color}b3` }}>
                  <div className="flex items-center gap-2">
                    <span className="text-[13px] leading-none" aria-hidden="true">{e.emoji}</span>
                    <span className="text-[11px] font-bold" style={{ color: e.color }}>{t(e.name)}</span>
                    <span className="ml-auto flex items-center gap-1 text-[9px] font-medium text-[#999999]/70">
                      {t({ en: `${pname} suggests`, zh: `${pname}建议` })}
                    </span>
                  </div>
                  <div className="my-2 h-px bg-white/5" />
                  <p className="text-[9.5px] font-medium leading-relaxed text-[#e8e8e8]/95">{t(tips[e.variant])}</p>
                </div>
              )}
            </button>
          );
        })}
      </div>
    </section>
  );
}

/* ── reusable "回顾" recap card ─────────────────────────────────────────────── */
function RecapCard({ t, persona, title, items }) {
  return (
    <section className="rounded-[14px] border border-white/[.08] bg-[#e84d8a]/10 p-4">
      <h3 className="flex items-center gap-2 text-[13px] font-bold">
        {t(title)}
      </h3>
      <ul className="mt-3 space-y-3">
        {items.map((r, i) => (
          <li key={i} className="flex items-start gap-3 text-[10.5px] leading-snug text-[#e8e8e8]">
            <span className="mt-0.5 h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: r.color }} />
            {t(r.text)}
          </li>
        ))}
      </ul>
    </section>
  );
}

/* ── month-over-month trend chip ──────────────────────────────────────────── */
function TrendChip({ t, dir }) {
  if (dir === 'up') return <span className="shrink-0 rounded-full border border-[#0fba82]/40 bg-[#0fba82]/[.14] px-2 py-0.5 text-[9px] font-semibold text-[#0fba82]">{t({ en: 'vs last mo ↑', zh: '较上月 ↑' })}</span>;
  if (dir === 'down') return <span className="shrink-0 rounded-full border border-[#f04545]/40 bg-[#f04545]/[.14] px-2 py-0.5 text-[9px] font-semibold text-[#f04545]">{t({ en: 'vs last mo ↓', zh: '较上月 ↓' })}</span>;
  return <span className="shrink-0 rounded-full border border-white/10 bg-white/[.05] px-2 py-0.5 text-[9px] font-semibold text-white/60">{t({ en: 'steady', zh: '持平' })}</span>;
}

/* ── compact meeting row for the weekly chosen-date drill-down ─────────────── */
function MeetingMiniRow({ t, m }) {
  const e = EMO[m.emo];
  return (
    <div className="rounded-[12px] border border-white/5 bg-[#242424] p-3">
      <div className="flex items-center gap-2.5">
        <span className="shrink-0 rounded-md border border-white/5 bg-[#1a1a1a] px-2 py-0.5 text-[10px] font-semibold text-white/80">{m.time}</span>
        <EmoRing e={e} size="h-7 w-7" text="text-[14px]" />
        <div className="min-w-0">
          <p className="truncate text-[12.5px] font-bold leading-tight">{t(m.title)}</p>
          <p className="text-[9.5px] text-[#999999]/75">{t(m.meta)}</p>
        </div>
        <span className="ml-auto flex shrink-0 items-center gap-1 rounded-full px-2 py-1 text-[9px] font-medium"
          style={{ backgroundColor: `${e.color}2e`, color: e.color }}>
          <span className="text-[10px] leading-none" aria-hidden="true">{e.emoji}</span>{t(e.name)}
        </span>
      </div>
      <p className="mt-2 rounded-md border border-[#e84d8a]/30 bg-[#e84d8a]/[.06] px-2 py-1.5 text-[10.5px] leading-normal text-[#e8e8e8]">{t(m.note)}</p>
    </div>
  );
}

/* ── full meeting card — identical to the 本日会议记录 card, with the 写日志 flow ─ */
function MeetingCard({ t, m, logged, onWrite }) {
  return (
    <div className="rounded-[12px] border border-white/5 bg-[#242424] p-4">
      <div className="flex items-center gap-3">
        <p className="text-sm font-bold">{t(m.title)}</p>
        <p className="text-[10px] text-[#999999]/75">{t(m.meta)}</p>
        <span className="ml-auto rounded-full border border-white/5 bg-[#1a1a1a] px-2 py-1 text-[10px] font-medium text-white/85">{m.time}</span>
      </div>
      <div className="mt-2 flex items-start gap-3">
        <p className="min-w-0 flex-1 rounded-md border border-[#e84d8a]/40 bg-[#e84d8a]/[.08] px-2 py-1.5 text-[10.5px] leading-normal text-[#e8e8e8]">
          {t(m.note)}
        </p>
        {logged && (
          <span className="flex shrink-0 items-center gap-1 rounded-full border border-[#0fba82] bg-[#0fba82]/[.18] px-1.5 py-0.5 text-[9px] font-medium text-[#0fba82]">
            <IcCheck className="h-2.5 w-2.5" sw={2.4} /> {t({ en: 'Logged', zh: '已写' })}
          </span>
        )}
      </div>
      <div className="mt-2.5 flex items-center gap-2">
        {m.tags.map((tag) => (
          <span key={tag.label.en} className="flex items-center gap-1 rounded-full px-2 py-1 text-[9px] font-medium"
            style={{ backgroundColor: `${tag.color}2e`, color: tag.color }}>
            <span className="text-[10px] leading-none" aria-hidden="true">{tag.emoji}</span>{t(tag.label)}
          </span>
        ))}
        <button type="button" onClick={onWrite}
          className="ml-auto flex items-center gap-1 rounded-full bg-[#e84d8a] px-3.5 py-1.5 text-xs font-medium text-white transition hover:bg-[#d13d79]">
          {t({ en: 'Write log', zh: '写日志' })}
        </button>
      </div>
    </div>
  );
}

/* ── 本周会议记录 · weekly meeting records with a clickable date drill-down ──── */
function WeekMeetingRecords({ loggedIds, onWrite }) {
  const { t } = useLanguage();
  const [date, setDate] = useState('5/10');
  const idx = WEEK_DAYS.findIndex((d) => d.date === date);
  const day = WEEK_DAYS[idx] || WEEK_DAYS[0];
  const meetings = MEET_BY_DATE[date] || [];
  const total = WEEK_DAYS.reduce((n, d) => n + ((MEET_BY_DATE[d.date] || []).length), 0);
  const go = (step) => { const n = Math.min(WEEK_DAYS.length - 1, Math.max(0, idx + step)); setDate(WEEK_DAYS[n].date); };
  const [mo, dnum] = date.split('/');
  const dateLabel = t({ en: `${mo}/${dnum}`, zh: `${mo}月${dnum}日` });

  return (
    <section className="min-w-0 rounded-[14px] border border-white/[.08] bg-[#1a1a1a] p-4">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-[15px] font-bold">{t({ en: "This week's meetings", zh: '本周会议记录' })}</h3>
          <p className="mt-1 text-[10.5px] text-[#999999]/85">{t({ en: `May 5 – May 11 · ${total} meetings`, zh: `5月5日 – 5月11日 · 共 ${total} 场` })}</p>
        </div>
        <div className="flex items-center gap-2 rounded-full border border-white/5 bg-[#242424] px-2.5 py-1 text-[10px] font-medium">
          <button type="button" onClick={() => go(-1)} disabled={idx <= 0} className="text-white/70 hover:text-white disabled:opacity-30"><IcChevL className="h-3.5 w-3.5" /></button>
          {t({ en: `${mo}/${dnum}`, zh: `${mo}月${dnum}日` })} {t(day.day)}
          <button type="button" onClick={() => go(1)} disabled={idx >= WEEK_DAYS.length - 1} className="text-white/70 hover:text-white disabled:opacity-30"><IcChevR className="h-3.5 w-3.5" /></button>
        </div>
      </div>

      {/* day chips — pick any day of the week */}
      <div className="mt-3 flex gap-1.5">
        {WEEK_DAYS.map((d) => {
          const sel = d.date === date;
          const cnt = (MEET_BY_DATE[d.date] || []).length;
          return (
            <button key={d.date} type="button" onClick={() => setDate(d.date)}
              className={`flex flex-1 flex-col items-center gap-0.5 rounded-[10px] border py-2 transition ${sel ? 'border-transparent bg-[#e84d8a] text-white' : 'border-white/5 bg-[#242424] text-white/80 hover:bg-[#2a2a2a]'}`}>
              <span className="text-[10px] font-bold">{t(d.day)}</span>
              <span className={`text-[8.5px] ${sel ? 'text-white/85' : 'text-[#999999]/70'}`}>{d.date}</span>
              <span className={`mt-0.5 flex h-3.5 min-w-[14px] items-center justify-center rounded-full px-1 text-[8px] font-bold ${sel ? 'bg-white/25 text-white' : cnt ? 'bg-white/10 text-white/75' : 'bg-transparent text-white/25'}`}>{cnt || '·'}</span>
            </button>
          );
        })}
      </div>

      {/* chosen-date heading */}
      <div className="mt-3.5 flex items-center gap-2">
        <span className="h-4 w-1 rounded-full bg-[#e84d8a]" />
        <h4 className="text-[12.5px] font-bold">{t({ en: `${mo}/${dnum} ${t(day.day)} · Meetings`, zh: `${mo}月${dnum}日 ${t(day.day)} · 当天会议` })}</h4>
        <span className="text-[10px] text-[#999999]/75">{t({ en: `${meetings.length} meetings`, zh: `${meetings.length} 场` })}</span>
      </div>

      {/* meeting list or rest-day empty state */}
      {meetings.length ? (
        <div className="mt-2.5 space-y-3.5">
          {meetings.map((mm, i) => <MeetingCard key={i} t={t} m={mm} logged={!!loggedIds[`${date}-${i}`]} onWrite={() => onWrite(`${date}-${i}`, mm, dateLabel)} />)}
        </div>
      ) : (
        <div className="mt-2.5 flex flex-col items-center justify-center gap-1 rounded-[12px] border border-dashed border-white/10 bg-[#242424]/50 py-8 text-center">
          <span className="text-[22px]" aria-hidden="true">🌿</span>
          <p className="text-[11px] font-medium text-white/70">{t({ en: 'No meetings this day', zh: '这天没有会议' })}</p>
          <p className="text-[9.5px] text-[#999999]/70">{t({ en: 'Enjoy the rest', zh: '好好休息一下' })}</p>
        </div>
      )}
    </section>
  );
}

/* ── 本月会议反馈 · monthly meeting feedback by meeting type ────────────────── */
function MonthFeedback({ persona }) {
  const { t } = useLanguage();
  const f = MONTH_FEEDBACK;
  return (
    <section className="min-w-0 rounded-[14px] border border-white/[.08] bg-[#1a1a1a] p-4">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-[15px] font-bold">{t({ en: "This month's meeting feedback", zh: '本月会议反馈' })}</h3>
          <p className="mt-1 text-[10.5px] text-[#999999]/85">{t({ en: `${f.totals.meetings} meetings · spoke up ${f.totals.spoke}×`, zh: `${f.totals.meetings} 场会议 · 主动发言 ${f.totals.spoke} 次` })}</p>
        </div>
        <span className="flex shrink-0 items-center gap-1.5 rounded-full border border-white/5 bg-[#242424] px-2.5 py-1">
          <PersonaAvatar persona={persona} size="h-4 w-4" px={16} />
          <span className="text-[9.5px] font-medium text-white/85">{t({ en: 'AI feedback', zh: 'AI 反馈' })}</span>
        </span>
      </div>

      <div className="mt-3 space-y-2.5">
        {f.items.map((it, i) => {
          const e = EMO[it.emo];
          return (
            <div key={i} className="flex items-start gap-3 rounded-[12px] border border-white/5 bg-[#242424] p-3">
              <EmoRing e={e} size="h-8 w-8" text="text-[16px]" />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="text-[12.5px] font-bold">{t(it.type)}</p>
                  <span className="shrink-0 rounded-full border border-white/5 bg-[#1a1a1a] px-1.5 py-0.5 text-[9px] font-medium text-white/70">{t({ en: `${it.count}×`, zh: `${it.count} 场` })}</span>
                  <TrendChip t={t} dir={it.trend} />
                </div>
                <p className="mt-1 text-[10.5px] leading-normal text-[#e8e8e8]/90">{t(it.text)}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

/* ── 写日志弹窗 · Journal Modal (Figma 812:1620 / 812:1682) ─────────────────── */
function JournalModal({ persona, meeting, dateLabel, onClose, onSend }) {
  const { t } = useLanguage();
  const pname = t(persona.name);
  const [draft, setDraft] = useState('');
  const [tags, setTags] = useState(meeting.tags);
  const removeTag = (i) => setTags((prev) => prev.filter((_, idx) => idx !== i));

  const prompts = [
    { en: 'Proudest moment', zh: '最自豪的一刻' },
    { en: 'I felt…', zh: '我感到了…' },
    { en: 'Keep next time', zh: '下次想保持的' },
    { en: 'A note to future me', zh: '给未来的自己一句话' },
  ];

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center">
      {/* backdrop 812:1681 */}
      <div className="absolute inset-0 bg-black/[.82]" onClick={onClose} />
      {/* modal 812:1682 */}
      <div className="relative flex max-h-[94%] w-[560px] flex-col overflow-hidden rounded-[20px] border border-white/12 bg-[#242424] shadow-[0_24px_60px_rgba(0,0,0,0.65)]">
        {/* header 812:1683 */}
        <div className="flex shrink-0 items-center gap-3 border-b border-white/[.06] bg-white/[.03] px-5 py-3.5">
          <PersonaAvatar persona={persona} size="h-8 w-8" px={32} />
          <div className="min-w-0">
            <h3 className="text-[15px] font-bold">{t({ en: `Journal with ${pname}`, zh: `和${pname}一起写日志` })}</h3>
            <p className="mt-0.5 text-[11px] font-medium text-[#999999]">{t(meeting.title)} · {dateLabel || t({ en: 'Today', zh: '今天' })} {meeting.time}</p>
          </div>
          <button type="button" onClick={onClose} aria-label={t({ en: 'Close', zh: '关闭' })}
            className="ml-auto flex h-7 w-7 items-center justify-center rounded-full bg-white/[.06] text-white/80 hover:bg-white/10">
            <IcClose className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* recorded feelings 812:1765 */}
        <div className="shrink-0 border-b border-white/[.06] px-5 pt-3.5 pb-3">
          <div className="flex items-center">
            <h4 className="text-[11px] font-bold">{t({ en: 'Feelings logged this session', zh: '本次记录的感受' })}</h4>
            <button type="button" className="ml-auto flex items-center gap-1.5 rounded-full border border-white/12 bg-white/[.06] px-2.5 py-1 text-[9.5px] font-medium text-white/85 hover:bg-white/10">
              <IcEdit className="h-3 w-3" /> {t({ en: 'Edit', zh: '编辑' })}
            </button>
          </div>
          <div className="mt-2.5 flex flex-wrap items-center gap-2">
            {tags.map((tag, i) => (
              <span key={i} className="flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-bold"
                style={{ backgroundColor: `${tag.color}2e`, borderColor: `${tag.color}66`, color: tag.color }}>
                <span className="text-[12px] leading-none" aria-hidden="true">{tag.emoji}</span>
                {t(tag.label)}
                <button type="button" onClick={() => removeTag(i)} aria-label="remove" className="opacity-70 hover:opacity-100">✕</button>
              </span>
            ))}
            <button type="button" className="flex items-center gap-1 rounded-full border border-dashed border-white/25 bg-white/[.03] px-2.5 py-1 text-[10px] font-medium text-white/70 hover:bg-white/[.06]">
              <span className="text-[12px] leading-none">＋</span> {t({ en: 'Add feeling', zh: '添加感受' })}
            </button>
          </div>
          <p className="mt-2 text-[9px] text-[#999999]/70">{t({ en: 'Tap ✕ to remove, ＋ to add a new feeling', zh: '点 ✕ 移除，点 ＋ 添加新感受' })}</p>
        </div>

        {/* chat thread */}
        <div className="min-h-0 flex-1 space-y-3 overflow-y-auto px-5 py-4">
          <p className="text-center text-[10px] font-medium text-[#999999]/60">{t({ en: 'Today · Meeting ended', zh: '今天 · 会议结束' })}</p>

          <div className="max-w-[400px] rounded-[14px] border border-white/[.05] bg-white/[.08] px-4 py-3 text-[12px] font-medium leading-relaxed text-[#f0f0f0]">
            {t({ en: `You just spoke your mind bravely in ${t(meeting.title)} — I'm so proud of you!`, zh: `你刚结束的${t(meeting.title)}上勇敢说出了想法，真为你骄傲！` })}
          </div>
          <div className="max-w-[460px] rounded-[14px] border border-white/[.05] bg-white/[.08] px-4 py-3 text-[12px] font-medium leading-relaxed text-[#f0f0f0]">
            {t({ en: 'Speaking up takes real courage. Want to capture how you feel right now?', zh: '发出自己的声音需要很大的勇气，想记录一下您现在的感受吗？' })}
          </div>

          <div className="flex flex-wrap gap-2">
            {prompts.map((p, i) => (
              <button key={i} type="button" onClick={() => setDraft(t(p))}
                className="rounded-[14px] border border-white/10 bg-white/[.05] px-3 py-1.5 text-[10.5px] font-semibold text-[#e84d8a] hover:bg-white/[.08]">
                {t(p)}
              </button>
            ))}
          </div>

          <div className="flex flex-col items-end gap-1">
            <div className="max-w-[300px] rounded-[14px] bg-[#e84d8a] px-3.5 py-2.5 text-[12px] font-medium leading-relaxed text-white">
              {t({ en: 'I said a direction I had never dared to — the team looked genuinely surprised!', zh: '我说出了一个之前不敢说的方向，团队反应很惊讶！' })}
            </div>
            <span className="text-[9px] font-medium text-[#999999]/60">14:47 · {t({ en: 'Sent', zh: '已发送' })}</span>
          </div>

          <div className="flex items-start gap-2">
            <PersonaAvatar persona={persona} size="h-6 w-6" px={24} />
            <div className="max-w-[460px] rounded-[14px] border border-white/[.05] bg-white/[.08] px-4 py-3 text-[12px] font-medium leading-relaxed text-[#f0f0f0]">
              {t({ en: 'This is a real moment of growth ✨ You took a risk to speak, and the team returned trust. Write it down — look back next time you need courage.', zh: '这就是真实的成长瞬间 ✨ 你愿意冒险表达，团队也回馈了信任。把这一刻写下来，下次需要勇气时回头看看。' })}
            </div>
          </div>
        </div>

        {/* input bar 812:1758 */}
        <div className="shrink-0 px-5 pb-4 pt-1">
          <div className="flex items-center gap-2 rounded-[14px] border border-white/[.08] bg-white/[.05] px-3 py-2.5">
            <input
              value={draft}
              onChange={(ev) => setDraft(ev.target.value)}
              placeholder={t({ en: 'Keep writing your reflection…', zh: '继续写下你的反思…' })}
              className="min-w-0 flex-1 bg-transparent text-[12px] text-white placeholder:text-[#999999]/55 focus:outline-none"
            />
            <span className="flex items-center gap-2 text-white/70">
              <IcSmile className="h-4 w-4" /><IcPaperclip className="h-4 w-4" /><IcMic className="h-4 w-4" />
            </span>
            <button type="button" onClick={onSend}
              className="flex items-center gap-1 rounded-lg bg-[#e84d8a] px-3 py-1.5 text-[10px] font-bold text-white hover:bg-[#d13d79]">
              <IcSend className="h-3.5 w-3.5" sw={2} /> {t({ en: 'Send', zh: '发送' })}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function WorkplaceLog() {
  const { t } = useLanguage();
  const [tab, setTab] = useState('daily');
  const [loggedIds, setLoggedIds] = useState(() => {
    const init = {};
    Object.entries(MEET_BY_DATE).forEach(([d, arr]) => arr.forEach((mm, i) => { if (mm.logged) init[d + '-' + i] = true; }));
    return init;
  });
  const [tipOpen, setTipOpen] = useState(false); // (legacy) unused after per-emotion tips
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [personaId, setPersonaId] = useState('xiaomei');
  const [journal, setJournal] = useState(null); // { id, meeting, dateLabel } — open 写日志 modal
  const [monthDay, setMonthDay] = useState(10); // chosen date on the monthly calendar
  const monthMeetings = MEET_BY_DATE['5/' + monthDay] || [];
  const monthTotal = Object.values(MEET_BY_DATE).reduce((n, a) => n + a.length, 0);

  const persona = ASSISTANTS.find((a) => a.id === personaId) || ASSISTANTS[0];
  const pname = t(persona.name);

  const headerAvatar = <PersonaAvatar persona={persona} px={28} />;

  const anxiousTip = null; // per-emotion tips now handled inside EmotionOverviewCard

  return (
    <div className="relative flex h-full w-full flex-col overflow-hidden bg-[#0a0a0a] text-white">
      {/* ── top bar (Figma 812:524) ── */}
      <div className="flex h-11 shrink-0 items-center gap-3 bg-[#121217] px-4">
        <div className="flex gap-1.5">
          <span className="h-3 w-3 rounded-full bg-[#ff5e57]" />
          <span className="h-3 w-3 rounded-full bg-[#ffbd2e]" />
          <span className="h-3 w-3 rounded-full bg-[#29c740]" />
        </div>
        <span className="ml-2 text-sm text-white">{t({ en: 'Meeting Workspace', zh: '会议工作台' })}</span>
        <span className="flex items-center gap-1.5 text-white/70">
          <IcChevL className="h-4 w-4" /><IcChevR className="h-4 w-4" /><IcRefresh className="h-3.5 w-3.5" />
        </span>
        <div className="mx-auto flex w-[44%] items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs text-white/50">
          <IcSearch className="h-3.5 w-3.5" /> {t({ en: 'Search (⌘E)', zh: '搜索 (⌘E)' })}
        </div>
        <IcPlus className="h-4 w-4 text-white/70" />
        <span className="ml-auto flex items-center gap-3 text-white/70">
          <IcBell className="h-4 w-4" /><IcLayout className="h-4 w-4" />
          <span className="relative flex h-7 w-7 items-center justify-center rounded-full bg-[#9c6bff] text-xs font-medium text-white">
            {t({ en: 'C', zh: '陈' })}
            <span className="absolute -bottom-0.5 -right-0.5 h-2 w-2 rounded-full border border-[#121217] bg-[#29c740]" />
          </span>
        </span>
      </div>

      <div className="flex min-h-0 flex-1">
        {/* ── sidebar (Figma 812:541) ── */}
        <aside className="flex w-24 shrink-0 flex-col items-center gap-1 border-r border-white/5 bg-[#1a1a1f] py-4">
          {NAV.map((item) => {
            const NavIcon = item.icon;
            return (
              <div key={item.label.en}
                className={`relative flex w-20 flex-col items-center gap-1 rounded-[10px] py-2 ${item.active ? 'bg-[#3b1f2e]' : 'text-white/70'}`}
                style={item.active ? { color: persona.disc } : undefined}>
                <NavIcon className="h-[22px] w-[22px]" />
                <span className="text-[10px]">{t(item.label)}</span>
                {item.badge && (
                  <span className="absolute right-0 top-0 rounded-full bg-[#3b66ff] px-1.5 py-px text-[8px] font-bold text-white">{t(item.badge)}</span>
                )}
              </div>
            );
          })}
          <span className="mt-auto text-white/55"><IcGear className="h-5 w-5" /></span>
        </aside>

        {/* ── main (Figma 812:346) ── */}
        <div className="min-w-0 flex-1 overflow-y-auto px-5 pb-5">
          {/* header row — 812:347 */}
          <div className="flex items-center gap-3 pt-4">
            <h2 className="text-[22px] font-bold">{t({ en: 'Emotion Log', zh: '情绪日志' })}</h2>
            <span className="flex items-center gap-1.5">
              {headerAvatar}
              <span className="text-[10px] font-medium text-white/85">{t({ en: `Curated by ${pname}`, zh: `由 ${pname} 整理` })}</span>
            </span>

            {/* settings gear next to the assistant — opens the avatar-switch panel */}
            <div className="relative">
              <button type="button" onClick={() => setSettingsOpen((o) => !o)} aria-label={t({ en: 'Assistant settings', zh: '助手设置' })} aria-expanded={settingsOpen}
                className={`flex h-7 w-7 items-center justify-center rounded-full transition ${settingsOpen ? 'bg-[#3a3a3a] text-white' : 'bg-[#242424] text-white/85 hover:bg-[#2e2e2e]'}`}>
                <IcGear className="h-4 w-4" />
              </button>

              {settingsOpen && (
                <>
                  <div className="fixed inset-0 z-20" onClick={() => setSettingsOpen(false)} />
                  <div className="absolute left-0 top-full z-30 mt-2 w-72 rounded-[14px] border border-white/10 bg-[#161616] p-4 shadow-[0_16px_40px_rgba(0,0,0,0.6)]">
                    <div className="flex items-center justify-between">
                      <h4 className="text-[13px] font-bold">{t({ en: 'Assistant settings', zh: '助手设置' })}</h4>
                      <button type="button" onClick={() => setSettingsOpen(false)} aria-label={t({ en: 'Close', zh: '关闭' })} className="text-white/60 hover:text-white">
                        <IcClose className="h-4 w-4" />
                      </button>
                    </div>
                    <p className="mt-0.5 text-[10px] text-[#999999]/70">{t({ en: 'Choose your AI companion', zh: '选择你的 AI 伙伴' })}</p>

                    <p className="mt-3 text-[10px] font-semibold uppercase tracking-wide text-[#999999]/70">{t({ en: 'Avatar', zh: '头像' })}</p>
                    <div className="mt-2 grid grid-cols-2 gap-2">
                      {ASSISTANTS.map((a) => {
                        const sel = a.id === personaId;
                        return (
                          <button key={a.id} type="button" onClick={() => setPersonaId(a.id)}
                            className={`relative flex flex-col items-center gap-2 rounded-[12px] border p-3 transition ${sel ? 'border-transparent bg-white/[.06]' : 'border-white/10 hover:bg-white/[.04]'}`}
                            style={sel ? { boxShadow: `0 0 0 1.5px ${a.disc}` } : undefined}>
                            <PersonaAvatar persona={a} size="h-11 w-11" px={44} />
                            <span className="text-[11px] font-semibold">{t(a.name)}</span>
                            {sel && (
                              <span className="absolute right-1.5 top-1.5 flex h-4 w-4 items-center justify-center rounded-full" style={{ backgroundColor: a.disc, color: '#1a1a1a' }}>
                                <IcCheck className="h-2.5 w-2.5" sw={2.6} />
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>

                    <div className="mt-3 flex items-center gap-2 rounded-[10px] border border-dashed border-white/15 px-3 py-2 text-[10.5px] text-[#999999]/85">
                      <IcCamera className="h-4 w-4 shrink-0" />
                      {t({ en: 'Upload a custom avatar', zh: '上传自定义头像' })}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* tabs — 812:402 */}
          <div className="mt-2 flex gap-8 border-b border-white/5 pl-2 text-[13px] font-semibold">
            {TABS.map((tb) => (
              <button key={tb.key} type="button" onClick={() => setTab(tb.key)}
                className={`relative pb-3 pt-2 transition ${tab === tb.key ? 'text-white' : 'text-[#999999]/70 hover:text-white/80'}`}>
                {t(tb.label)}
                {tab === tb.key && <span className="absolute -left-1.5 bottom-0 h-[3px] w-10 rounded-sm bg-[#e84d8a]" />}
              </button>
            ))}
          </div>

          {/* ══════════════ DAILY (每日) — Figma 812:345 ══════════════ */}
          {tab === 'daily' && (
            <>
              <p className="mt-3 text-[11px] font-medium text-[#999999]/85">{t({ en: 'Mon, May 11 2026', zh: '2026年5月11日 (周一)' })}</p>
              <div className="mt-3 grid grid-cols-[475fr_661fr] gap-3">
                {/* left column */}
                <div className="flex min-w-0 flex-col gap-4">
                  <EmotionOverviewCard
                    t={t}
                    title={{ en: "Today's emotions", zh: '今日情绪概览' }}
                    sub={{ en: 'By context', zh: '按场景分布' }}
                    emotions={withPct(DAILY_DIST)}
                    tips={EMO_TIPS} pname={pname}
                  />
                  <RecapCard t={t} persona={persona} title={{ en: `${pname}'s recap`, zh: `${pname}的今日回顾` }} items={RECAP} />
                </div>

                {/* right column — meeting records (812:470) */}
                <section className="min-w-0 rounded-[14px] border border-white/[.08] bg-[#1a1a1a] p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-[15px] font-bold">{t({ en: "Today's meetings", zh: '本日会议记录' })}</h3>
                      <p className="mt-1 text-[10.5px] text-[#999999]/85">{t({ en: '3 meetings', zh: '共 3 场会议' })}</p>
                    </div>
                    <div className="flex items-center gap-2 rounded-full border border-white/5 bg-[#242424] px-2.5 py-1 text-[10px] font-medium">
                      <button type="button" className="text-white/70 hover:text-white"><IcChevL className="h-3.5 w-3.5" /></button>
                      {t({ en: 'Today, May 11', zh: '今天 5月11日' })}
                      <button type="button" className="text-white/70 hover:text-white"><IcChevR className="h-3.5 w-3.5" /></button>
                    </div>
                  </div>

                  <div className="mt-3 space-y-3.5">
                    {MEETINGS.map((m, i) => (
                      <MeetingCard key={m.title.en} t={t} m={m} logged={!!loggedIds['5/11-' + i]}
                        onWrite={() => setJournal({ id: '5/11-' + i, meeting: m })} />
                    ))}
                  </div>
                </section>
              </div>
            </>
          )}

          {/* ══════════════ WEEKLY (每周) ══════════════ */}
          {tab === 'weekly' && (
            <>
              <p className="mt-3 text-[11px] font-medium text-[#999999]/85">{t({ en: 'May 5 – May 11, 2026', zh: '2026年5月5日 – 5月11日 (本周)' })}</p>
              <div className="mt-3 grid grid-cols-[475fr_661fr] gap-3">
                <div className="flex min-w-0 flex-col gap-4">
                  <EmotionOverviewCard
                    t={t}
                    title={{ en: "This week's emotions", zh: '本周情绪概览' }}
                    sub={{ en: 'Aggregated across 7 days', zh: '按 7 天汇总' }}
                    emotions={withPct(WEEK_DIST)}
                    tips={EMO_TIPS} pname={pname}
                  />
                  <RecapCard t={t} persona={persona} title={{ en: `${pname}'s week in review`, zh: `${pname}的本周回顾` }} items={WEEK_RECAP} />
                </div>

                {/* right — 本周会议记录 · same cards + 写日志 as 本日会议记录 */}
                <WeekMeetingRecords loggedIds={loggedIds} onWrite={(id, mm, dLabel) => setJournal({ id, meeting: mm, dateLabel: dLabel })} />
              </div>
            </>
          )}

          {/* ══════════════ MONTHLY (每月) ══════════════ */}
          {tab === 'monthly' && (
            <>
              <p className="mt-3 text-[11px] font-medium text-[#999999]/85">{t({ en: 'May 2026', zh: '2026年5月 (本月)' })}</p>
              <div className="mt-3 grid grid-cols-[475fr_661fr] gap-3">
                {/* left column — 本月情绪概览 + 小美的本月回顾 */}
                <div className="flex min-w-0 flex-col gap-4">
                  <EmotionOverviewCard
                    t={t}
                    title={{ en: "This month's emotions", zh: '本月情绪概览' }}
                    sub={{ en: 'Aggregated across the month', zh: '按整月汇总' }}
                    emotions={withPct(MONTH_DIST)}
                    tips={EMO_TIPS} pname={pname}
                  />
                  <RecapCard t={t} persona={persona} title={{ en: `${pname}'s month in review`, zh: `${pname}的本月回顾` }} items={MONTH_RECAP} />
                </div>

                {/* right column — 本月情绪日历 + 当天会议 merged into one card */}
                <section className="min-w-0 rounded-[14px] border border-white/[.08] bg-[#1a1a1a] p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-[15px] font-bold">{t({ en: 'Monthly emotion calendar', zh: '本月情绪日历' })}</h3>
                      <p className="mt-1 text-[10.5px] text-[#999999]/85">{t({ en: `${MONTH_MEETINGS_TOTAL} meetings this month`, zh: `共 ${MONTH_MEETINGS_TOTAL} 场会议` })}</p>
                    </div>
                    <div className="flex items-center gap-2 rounded-full border border-white/10 bg-[#242424] px-2.5 py-1 text-[11px] font-medium">
                      <button type="button" className="text-white/70 hover:text-white"><IcChevL className="h-3.5 w-3.5" /></button>
                      {t({ en: '2026 · May', zh: '2026 · 5月' })}
                      <button type="button" className="text-white/70 hover:text-white"><IcChevR className="h-3.5 w-3.5" /></button>
                    </div>
                  </div>

                  {/* calendar — flattened compact cells with emotion dots */}
                  <div className="mt-3">
                    <div className="grid grid-cols-7 gap-x-1.5 text-center text-[10.5px] font-medium text-[#999999]/70">
                      {(t({ en: 'M,T,W,T,F,S,S', zh: '一,二,三,四,五,六,日' })).split(',').map((d, i) => (
                        <span key={i}>{d}</span>
                      ))}
                    </div>
                    <div className="mt-1 grid grid-cols-7 gap-x-1.5 gap-y-0.5">
                      {Array.from({ length: MONTH_LEAD_BLANKS }).map((_, i) => <span key={`b${i}`} />)}
                      {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => {
                        const sel = day === monthDay;
                        const future = day > MONTH_TODAY;
                        const dots = MONTH_DOTS[day] || [];
                        return (
                          <button type="button" key={day} onClick={() => setMonthDay(day)}
                            className="flex min-h-[30px] flex-col items-center justify-center gap-0.5 rounded-[8px] py-1 transition hover:bg-white/[.04]"
                            style={{
                              border: sel ? '1.5px solid #e94c89' : '1.5px solid transparent',
                              backgroundColor: sel ? 'rgba(233,76,137,0.12)' : 'transparent',
                            }}>
                            <span className="text-[13px] leading-none" style={{ color: future ? 'rgba(255,255,255,0.32)' : '#fff', fontWeight: sel ? 700 : 500 }}>{day}</span>
                            <span className="flex h-1.5 gap-0.5">
                              {dots.map((c, di) => <span key={di} className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: CAL_C[c] }} />)}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* legend + add-tag */}
                  <div className="mt-3 flex items-center justify-between">
                    <div className="flex flex-wrap items-center gap-x-3.5 gap-y-1.5">
                      {CAL_EMO.map((e) => (
                        <span key={e.key} className="flex items-center gap-1.5 text-[10.5px] font-medium text-[#e8e8e8]/85">
                          <span className="h-2 w-2 rounded-full" style={{ backgroundColor: e.color }} />
                          {t(e.name)}
                        </span>
                      ))}
                    </div>
                    <button type="button" className="text-[11.5px] font-bold text-[#e94c89] hover:text-[#f06ba0]">+ {t({ en: 'Add tag', zh: '添加标签' })}</button>
                  </div>

                  {/* chosen-date meetings · 当天会议 — directly under the calendar */}
                  <div className="mt-3.5 border-t border-white/[.06] pt-3.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <h3 className="text-[15px] font-bold">{t({ en: `May ${monthDay} · Meetings`, zh: `5月${monthDay}日 · 当天会议` })}</h3>
                        <span className="text-[13px] font-bold text-white/85">({monthMeetings.length})</span>
                      </div>
                      <span className="text-[11px] font-medium text-[#999999]/75">{t({ en: 'By time', zh: '时间顺序' })}</span>
                    </div>
                    {monthMeetings.length ? (
                      <div className="mt-3 space-y-3.5">
                        {monthMeetings.map((mm, i) => (
                          <MeetingCard key={i} t={t} m={mm} logged={!!loggedIds[`5/${monthDay}-${i}`]}
                            onWrite={() => setJournal({ id: `5/${monthDay}-${i}`, meeting: mm, dateLabel: t({ en: `May ${monthDay}`, zh: `5月${monthDay}日` }) })} />
                        ))}
                      </div>
                    ) : (
                      <div className="mt-3 flex flex-col items-center justify-center gap-1 rounded-[12px] border border-dashed border-white/10 bg-[#242424]/50 py-8 text-center">
                        <span className="text-[22px]" aria-hidden="true">{monthDay > MONTH_TODAY ? '📅' : '🌿'}</span>
                        <p className="text-[11px] font-medium text-white/70">{monthDay > MONTH_TODAY ? t({ en: 'Upcoming — no meetings logged yet', zh: '未来日期 · 暂无会议记录' }) : t({ en: 'No meetings this day', zh: '这天没有会议' })}</p>
                      </div>
                    )}
                  </div>
                </section>
              </div>
            </>
          )}
        </div>
      </div>

      {/* ── 写日志弹窗 · Journal Modal (opens from any 写日志 button) ── */}
      {journal && (
        <JournalModal
          persona={persona}
          meeting={journal.meeting}
          dateLabel={journal.dateLabel}
          onClose={() => setJournal(null)}
          onSend={() => {
            setLoggedIds((prev) => ({ ...prev, [journal.id]: true }));
            setJournal(null);
          }}
        />
      )}
    </div>
  );
}
