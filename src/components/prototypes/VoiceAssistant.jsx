import { useEffect, useRef, useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';

// ─────────────────────────────────────────────────────────────────────────────
//  Figma-matched rebuild of "AI Voice Assistant with Chat (Eng)"
//  (801:128). Bilingual: labels + the seeded conversation + the scripted replies
//  all follow the EN/中文 toggle. Assistant replies are mocked — no real AI.
// ─────────────────────────────────────────────────────────────────────────────

const ICON = `${import.meta.env.BASE_URL}assets/speech-ai/`;

const NAV = [
  { id: 'chat', label: { en: 'Chat history', zh: '聊天记录' }, icon: 'message-square.svg' },
  { id: 'quick', label: { en: 'Quick actions', zh: '快捷操作' }, icon: 'zap.svg' },
  { id: 'settings', label: { en: 'Settings', zh: '设置' }, icon: 'settings.svg' },
  { id: 'profile', label: { en: 'Profile', zh: '个人资料' }, icon: 'user.svg' },
];

// The conversation captured in the Figma design (seeds the chat). Bilingual.
const SEED = [
  { role: 'user', time: '14:57:24', text: { en: 'I-I-I want to b-b-book a ticket to um... Shanghai', zh: '我-我-我想订一-一张去…上海的票' } },
  {
    role: 'ai', time: '14:57:29',
    text: {
      en: 'I understand you want to book a ticket to Shanghai. I detected some speech patterns and organized your request. Let me help you!',
      zh: '我明白您想订一张去上海的票。我识别了您的语言节奏并整理了您的需求，让我来帮您！',
    },
  },
  { role: 'user', time: '14:57:54', text: { en: 'Th-th-thank you! Can you tell me the p-p-price?', zh: '谢-谢-谢谢！能告诉我价-价格吗？' } },
  {
    role: 'ai', time: '14:57:59',
    text: {
      en: 'Of course! Tickets to Shanghai usually cost between ¥800 and ¥2500, depending on the date. Would you like me to check specific dates?',
      zh: '当然！去上海的票价通常在 ¥800 到 ¥2500 之间，取决于日期。需要我帮您查询具体日期吗？',
    },
  },
  { role: 'user', time: '14:58:24', text: { en: 'Okay, p-p-please check the one for ne..next...next week', zh: '好的，请-请帮我查下-下…下周的' } },
  {
    role: 'ai', time: '14:58:29',
    text: {
      en: 'Do you mean flights next week or the week after next? You can simply reply A or B to tell me which week you mean.',
      zh: '您是指下周还是下下周的航班？您可以直接回复 A 或 B 告诉我。',
    },
    quickReplies: [
      { en: 'A. Next week', zh: 'A. 下周' },
      { en: 'B. The week after next', zh: 'B. 下下周' },
    ],
  },
];

const now = () => new Date().toLocaleTimeString('en-GB', { hour12: false });

// A tiny scripted "assistant" — returns a bilingual reply based on the input.
function scriptedReply(text) {
  const s = (text || '').toLowerCase();
  const has = (...w) => w.some((x) => s.includes(x));
  if (has('a.', 'next week', '下周') && !has('下下周', 'week after'))
    return { en: 'Great — for next week the cheapest is ¥860 on Tuesday morning. Shall I hold it for you?', zh: '好的——下周最便宜的是周二上午的 ¥860，需要我帮您留位吗？' };
  if (has('b.', 'week after', '下下周'))
    return { en: 'Got it — the week after next has seats from ¥920. Take your time deciding, there’s no rush.', zh: '好的——下下周有 ¥920 起的座位。慢慢考虑，不用着急。' };
  if (has('price', 'cost', '¥', '价'))
    return { en: 'Prices range from ¥800 to ¥2500 depending on the date and time. Which day works best for you?', zh: '票价根据日期和时间在 ¥800 到 ¥2500 之间，您哪天方便呢？' };
  if (has('thank', '谢'))
    return { en: 'You’re very welcome! Happy to help whenever you’re ready.', zh: '不客气！随时都可以帮您。' };
  return { en: 'Thanks — I understood you perfectly. Take your time, I’m listening.', zh: '谢谢——我完全听懂了。慢慢来，我在听。' };
}

export default function VoiceAssistant() {
  const { t } = useLanguage();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [activeNav, setActiveNav] = useState('chat');
  const scrollRef = useRef(null);

  // Reveal the seeded conversation one message at a time.
  useEffect(() => {
    const timers = [];
    let delay = 400;
    SEED.forEach((msg) => {
      timers.push(window.setTimeout(() => setMessages((prev) => [...prev, msg]), delay));
      delay += msg.role === 'ai' ? 1100 : 700;
    });
    return () => timers.forEach((tm) => window.clearTimeout(tm));
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages]);

  // display: string (typed) or { en, zh } (quick reply); match: the string to match on.
  const send = (display, match) => {
    if (typeof display === 'string' && !display.trim()) return;
    setInput('');
    setMessages((prev) => [...prev, { role: 'user', text: display, time: now() }]);
    const reply = scriptedReply(match ?? display);
    window.setTimeout(() => {
      setMessages((prev) => [...prev, { role: 'ai', text: reply, time: now() }]);
    }, 650);
  };

  const label = (text) => (typeof text === 'string' ? text : t(text));

  return (
    <div
      className="flex h-full w-full overflow-hidden text-white"
      style={{ backgroundImage: 'linear-gradient(146deg, #1c388f 0%, #005e78 50%, #1a3db8 100%)' }}
    >
      {/* Sidebar */}
      <aside className="hidden w-56 shrink-0 flex-col gap-7 border-r border-[#364054]/50 bg-[#0f1729]/30 p-5 sm:flex">
        <div>
          <p className="text-lg text-white">{t({ en: 'AI Assistant', zh: 'AI 助手' })}</p>
          <p className="text-xs text-[#54ebfc]">{t({ en: 'Your smart partner', zh: '您的智能伙伴' })}</p>
        </div>
        <nav className="flex flex-col gap-1">
          {NAV.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setActiveNav(item.id)}
              aria-pressed={activeNav === item.id}
              className={`flex items-center gap-2 rounded-md px-2 py-2 text-left text-[13px] font-medium transition ${
                activeNav === item.id ? 'bg-white/10 text-white' : 'text-white/80 hover:bg-white/5'
              }`}
            >
              <img src={ICON + item.icon} alt="" className="h-3.5 w-3.5" />
              {t(item.label)}
            </button>
          ))}
        </nav>
      </aside>

      {/* Main column */}
      <div className="relative flex min-h-0 min-w-0 flex-1 flex-col">
        <div className="pointer-events-none absolute left-9 top-16 h-28 w-28 rounded-full bg-[#00d4f2]/10 blur-2xl" />
        <div className="pointer-events-none absolute left-72 top-96 h-21 w-21 rounded-full bg-[#54ebfc]/10 blur-xl" style={{ width: 84, height: 84 }} />
        <header className="flex h-[60px] shrink-0 items-center justify-between px-5">
          <p className="text-lg text-white">{t({ en: 'AI Assistant', zh: 'AI 助手' })}</p>
          <button type="button" aria-label={t({ en: 'Close', zh: '关闭' })} className="flex h-7 w-8 items-center justify-center rounded-md hover:bg-white/10">
            <img src={ICON + 'x.svg'} alt="" className="h-3.5 w-3.5" />
          </button>
        </header>

        <div ref={scrollRef} className="min-h-0 flex-1 space-y-3.5 overflow-y-auto px-5 py-4">
          {messages.map((m, i) =>
            m.role === 'user' ? (
              <div key={i} className="flex animate-msg-in justify-end">
                <div className="max-w-[78%] rounded-[13px] bg-[#0091b8]/90 px-3.5 py-3 shadow-lg">
                  <p className="text-sm leading-relaxed text-white">{label(m.text)}</p>
                  <p className="mt-1 text-[10.5px] text-white/70">{m.time}</p>
                </div>
              </div>
            ) : (
              <div key={i} className="flex animate-msg-in justify-start">
                <div className="max-w-[78%] rounded-[13px] border border-white/20 bg-[#1f2938]/90 px-3.5 py-3 shadow-lg">
                  <div className="flex items-start gap-2">
                    <p className="text-sm leading-relaxed text-white">{label(m.text)}</p>
                    <img src={ICON + 'volume2.svg'} alt="" className="mt-0.5 h-3.5 w-3.5 shrink-0 opacity-80" />
                  </div>
                  {m.quickReplies && (
                    <div className="mt-2.5 flex flex-col gap-1.5">
                      {m.quickReplies.map((qr) => (
                        <button
                          key={qr.en}
                          type="button"
                          onClick={() => send(qr, t(qr))}
                          className="rounded-md border border-[#00d4f2]/50 bg-white/5 px-3.5 py-2 text-left text-xs font-medium text-[#a3f5fc] transition hover:bg-white/10"
                        >
                          {t(qr)}
                        </button>
                      ))}
                    </div>
                  )}
                  <p className="mt-1 text-[10.5px] text-white/70">{m.time}</p>
                </div>
              </div>
            ),
          )}
        </div>

        {/* Composer */}
        <div className="shrink-0 p-4">
          <div className="flex items-center gap-2 rounded-[13px] border border-white/20 bg-white/10 p-2 shadow-lg">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && send(input, input)}
              placeholder={t({ en: 'Type your message...', zh: '输入您的消息…' })}
              aria-label={t({ en: 'Type your message', zh: '输入您的消息' })}
              className="min-w-0 flex-1 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm text-white placeholder-white/60 outline-none focus:border-[#00d4f2]/60"
            />
            <button
              type="button"
              aria-label={t({ en: 'Voice input', zh: '语音输入' })}
              className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-white/10"
            >
              <img src={ICON + 'mic.svg'} alt="" className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              onClick={() => send(input, input)}
              disabled={!input.trim()}
              aria-label={t({ en: 'Send message', zh: '发送消息' })}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#0091b8] shadow transition hover:bg-[#007a9c] disabled:opacity-50"
            >
              <img src={ICON + 'send.svg'} alt="" className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
