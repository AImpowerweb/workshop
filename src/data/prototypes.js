// ─────────────────────────────────────────────────────────────────────────────
//  PROTOTYPE LIST  —  the ONE file you maintain to add/edit prototypes.
//
//  Each card opens a coded, interactive React component (see
//  src/components/prototypes/registry.js). The screens come from the Figma file
//  "Speech AI_Design Ideas". Cards are organized by the "Organize by" control:
//  Use scenario (default) → Meeting / Interview / On the Go / Workplace Wellbeing,
//  or Platform. `fig(node)` records the source Figma node (provenance only).
// ─────────────────────────────────────────────────────────────────────────────

const FIGMA_FILE = 'Yc0ARbMGnjdWamEKABIoBQ';
const FIGMA_NAME = 'Speech-AI_Design-Ideas';

const fig = (node) => ({
  embedUrl: `https://embed.figma.com/design/${FIGMA_FILE}/${FIGMA_NAME}?node-id=${node}&embed-host=aimpower`,
  openUrl: `https://www.figma.com/design/${FIGMA_FILE}/${FIGMA_NAME}?node-id=${node}`,
});

// Reusable facet values — edit a label here and every prototype using it updates.
const SCENARIO = {
  meeting: { key: 'meeting', en: 'Meeting', zh: '会议' },
  interview: { key: 'interview', en: 'Interview', zh: '面试' },
  onthego: { key: 'onthego', en: 'On the Go', zh: '移动场景' },
  workplace: { key: 'workplace', en: 'Emotional Support', zh: '情感支持' },
};

const DEVICE = {
  desktop: { key: 'desktop', en: 'Desktop / Web', zh: '桌面 / 网页' },
  mobile: { key: 'mobile', en: 'Mobile', zh: '手机' },
  wearable: { key: 'wearable', en: 'Wearable', zh: '可穿戴设备' },
  automotive: { key: 'automotive', en: 'Automotive', zh: '车载' },
};

// The dimensions offered in the "Organize by" control. First one is the default.
export const groupings = [
  { id: 'scenario', label: { en: 'Use scenario', zh: '使用场景' } },
  { id: 'device', label: { en: 'Platform', zh: '平台' } },
];

// Tag labels — functional tags: what the AI actually does for you. These stay
// distinct from the scenario/platform facets used by the "Organize by" control.
// The `tags` arrays below use the English string as a stable filter key.
const TAG_LABELS = {
  'More speaking time': { en: 'More speaking time', zh: '更多发言时间' },
  'Prompts listeners': { en: 'Prompts listeners', zh: '提示聆听者' },
  'Speech clean-up': { en: 'Speech clean-up', zh: '语音优化' },
  'Non-speech input': { en: 'Non-speech input', zh: '非语音输入' },
  'Encouragement': { en: 'Encouragement', zh: '鼓励' },
  'Emotion tracking': { en: 'Emotion tracking', zh: '情绪记录' },
};

// Bilingual { en, zh } label for a tag key (falls back to the raw string).
export const tagLabel = (tag) => TAG_LABELS[tag] || { en: tag, zh: tag };

export const prototypes = [
  // ── Meeting ────────────────────────────────────────────────────────────────
  {
    id: 'extended-turntaking',
    page: true,
    title: { en: 'Meeting Speaking Support', zh: '会议发言辅助系统' },
    description: {
      en: 'In video meetings, the AI helps sense whether a speaker has finished and reminds other participants not to interrupt — giving the speaker more time to express themselves.',
      zh: '在视频会议中，AI 协助判断发言者是否已完成发言，并提醒其他参会者不要打断，让用户有更充足的时间来表达。',
    },
    thumbnail: 'thumbnails/extended-turntaking.png',
    ...fig('111-1515'),
    scenario: SCENARIO.meeting,
    device: DEVICE.desktop,
    tags: ['More speaking time', 'Prompts listeners'],
  },
  {
    id: 'facial-turntaking',
    page: true,
    title: { en: 'Speaking-Status Support', zh: '发言状态辅助' },
    description: {
      en: 'During a meeting, AI reads the speaker’s facial expression and speaking status to sense whether they are still talking, and reminds other participants to wait patiently rather than interrupt.',
      zh: '在会议中通过 AI 识别发言者的表情和发言状态，判断其是否仍在表达，并提醒其他参会者耐心等待，避免打断。',
    },
    thumbnail: 'thumbnails/facial-turntaking.png',
    ...fig('253-4477'),
    scenario: SCENARIO.meeting,
    device: DEVICE.desktop,
    tags: ['More speaking time', 'Prompts listeners'],
  },
  {
    id: 'feedback-plugin',
    page: true,
    title: { en: 'Live Caption Support', zh: '实时字幕辅助系统' },
    description: {
      en: 'Provides real-time captions during meetings or calls, with AI that can refine the caption text — for example, removing repeated words and filler pauses.',
      zh: '在会议或通话中提供实时字幕，并可通过 AI 优化字幕内容，例如去除重复词和停顿词。',
    },
    thumbnail: 'thumbnails/feedback-plugin.png',
    ...fig('696-1513'),
    scenario: SCENARIO.meeting,
    device: DEVICE.desktop,
    tags: ['Speech clean-up'],
  },

  // ── Interview ────────────────────────────────────────────────────────────────
  {
    id: 'interview-tool',
    page: true,
    title: { en: 'AI Interview Assistant', zh: 'AI面试助手' },
    description: {
      en: 'In an AI-led interview (where an AI interviews the user), the product processes the user’s speech in real time — for example, reducing repeated words, stripping filler words, and cancelling background noise and room echo. Users can also set up and tap quick phrases (like “Give me a moment” or “I’m thinking about that”), which the product reads aloud in the user’s own voice as transitions, helping them come across more fluently and clearly in the AI interview.',
      zh: '在AI面试场景中（即由 AI 对用户进行面试时），该产品对用户的语音进行实时处理，例如辅助减少重复词、去除填充词、消除环境噪声和房间回声。用户还可以设置并点击快捷词汇（如“请稍等一下”、“我正在思考这个”），该产品使用用户的声音朗读这些词汇或过渡语句，帮助用户在 AI 面试中表达更加流畅清晰。',
    },
    thumbnail: 'thumbnails/interview-tool.png',
    ...fig('303-3573'),
    scenario: SCENARIO.interview,
    device: DEVICE.desktop,
    tags: ['Speech clean-up', 'Non-speech input'],
  },
  {
    id: 'interview-notification',
    page: true,
    title: { en: 'Interview Communication Support', zh: '面试沟通辅助系统' },
    description: {
      en: 'In online interviews, the AI recognises stuttering speech patterns and prompts the interviewer to focus on the content — giving candidates more patience and time to finish speaking.',
      zh: '在在线面试中，AI识别口吃语音模式并提示面试官专注于内容表达，给予求职者更多耐心和时间来完成发言。',
    },
    thumbnail: 'thumbnails/interview-notification.png',
    ...fig('417-175'),
    scenario: SCENARIO.interview,
    device: DEVICE.desktop,
    tags: ['More speaking time', 'Prompts listeners'],
  },

  // ── On the Go ────────────────────────────────────────────────────────────────
  {
    id: 'ev-dashboard',
    page: true,
    title: { en: 'Voice Assistant Confirmation Aid', zh: '语音助手确认辅助系统' },
    description: {
      en: 'When a voice assistant can’t accurately recognise a command, the system confirms it through options or prompts — helping people who stutter complete voice actions more smoothly.',
      zh: '当语音助手无法准确识别指令时，系统会通过选项或提示进行确认，帮助口吃者更顺利地完成语音操作。',
    },
    thumbnail: 'thumbnails/ev-dashboard.png',
    ...fig('555-3898'),
    scenario: SCENARIO.onthego,
    device: DEVICE.automotive,
    tags: ['Non-speech input'],
  },
  {
    id: 'emergency-report',
    page: true,
    title: { en: 'Accessible Phone Service', zh: '无障碍电话服务系统' },
    description: {
      en: 'An accessible communication-support service for people who stutter when making emergency calls (police, ambulance). It offers extended wait times and patient voice guidance from operators trained in communication, so callers can express themselves smoothly in an emergency. Beyond voice calls, users can file a silent text report, share their precise location, upload video or photos as evidence, and track the case status.',
      zh: '为口吃者在拨打紧急电话（如报警、急救）时设计的无障碍沟通支持服务。系统提供延长等待时间和耐心的语音引导，由接受过沟通培训的客服人员对接，确保口吃者在紧急情况下能够顺畅表达。除了语音呼叫外，用户还可以选择紧急文字报警（发送静默紧急消息）、共享精确位置、上传视频或照片作为证据，并跟踪案件状态。',
    },
    thumbnail: 'thumbnails/emergency-report.png',
    ...fig('389-958'),
    scenario: SCENARIO.onthego,
    device: DEVICE.mobile,
    tags: ['More speaking time', 'Non-speech input'],
    // Fixed-size phone device (iPhone-Pro frame + backdrop padding); shown at
    // natural size on desktop, scaled down to fit width on mobile.
    canvas: { w: 462, h: 934 },
    fit: true,
  },
  {
    id: 'voice-assistant',
    page: true,
    title: { en: 'AI Assistant', zh: 'AI助手' },
    description: {
      en: 'During voice interactions, it offers text options and tappable buttons, so people who stutter can communicate with the AI by speaking, typing, or simply tapping.',
      zh: '在语音交互过程中提供文字选项和可点击按钮，让口吃者可以通过语音、文字或直接点击的方式与AI进行交流。',
    },
    thumbnail: 'thumbnails/speech-ai.png',
    ...fig('801-128'),
    scenario: SCENARIO.onthego,
    device: DEVICE.desktop,
    tags: ['Non-speech input'],
  },

  // ── Wellbeing ────────────────────────────────────────────────────────────────
  {
    id: 'meeting-companion',
    title: { en: 'AI Meeting Companion (AI 心伴)', zh: 'AI 心伴 · 会议小助手' },
    description: {
      en: 'During a meeting, whenever someone who stutters gets an idea across, finishes speaking, or actively joins the conversation, the AI companion offers positive, encouraging feedback — affirming what they said, thanking them for sharing, or sending a personalised note of encouragement.',
      zh: '在会议过程中，当口吃者成功表达想法、完成发言或主动参与对话时，AI 小助手可以提供积极和鼓励性的反馈，例如肯定用户表达的内容、感谢他们的分享，或提供个性化的鼓励信息。',
    },
    thumbnail: 'thumbnails/meeting-companion.png',
    ...fig('466-376'),
    scenario: SCENARIO.workplace,
    device: DEVICE.desktop,
    tags: ['Encouragement'],
    // Opens a dedicated page (#/prototype/meeting-companion) instead of the modal.
    page: true,
    discussion: [
      {
        en: 'For many people who stutter, meetings are the most stressful part of the workday: the pressure to speak fluently in front of colleagues can weigh more than the content itself. This concept asks whether a small, deliberately cute companion — rather than a clinical tool — can lower that pressure in the moment.',
        zh: '对许多口吃者来说，会议是一天中压力最大的时刻：在同事面前"说得流利"的压力，往往比发言内容本身更沉重。这个概念探讨的是——一位刻意设计得可爱、而非临床工具感的小伙伴，能否在当下减轻这种压力。',
      },
      {
        en: 'The companion never measures or corrects speech. It simply notices that you spoke and responds with warm encouragement, framed around what you said rather than how you said it — "you bravely spoke your mind", never "you stuttered less today". There are no scores, streaks, or fluency metrics anywhere in the design.',
        zh: '心伴从不测量或纠正言语。它只是注意到你发言了，并给予温暖的鼓励——关注你"说了什么"，而不是"说得怎么样"："你勇敢地说出了想法"，而绝不是"今天口吃少了"。整个设计中没有任何评分、打卡或流利度指标。',
      },
    ],
    howToTry: [
      {
        en: 'Toggle "AI Companion" in the top bar to turn the companion on or off.',
        zh: '点击顶栏的"AI 小助手"开关，可开启或关闭心伴。',
      },
      {
        en: 'Press the 👍 button beside the companion to send yourself encouragement.',
        zh: '点击心伴旁的 👍 按钮，为自己送出一句鼓励。',
      },
      {
        en: 'Open ⚙ settings to switch between 小黄 and 小美, and choose how often feedback appears.',
        zh: '打开 ⚙ 设置，可在小黄与小美之间切换，并选择鼓励出现的频率。',
      },
      {
        en: 'Switch between the People and Chat tabs to explore the meeting panel.',
        zh: '在"成员"与"聊天"标签间切换，浏览会议面板。',
      },
    ],
    furtherInfo: [
      {
        en: 'The two companions, 小黄 (a teal-hooded plush) and 小美 (a pink plush), were designed to feel like a desk toy a colleague might keep beside their monitor — familiar, non-judgmental, and private. Encouragement appears only in your own corner of the meeting; other participants never see it.',
        zh: '两位心伴——小黄（青绿色连帽绒偶）与小美（粉色绒偶）——的设计灵感来自同事摆在显示器旁的桌面玩偶：亲切、不评判、且完全私密。鼓励只出现在你自己的会议角落，其他参会者不会看到。',
      },
      {
        en: 'Feedback frequency is user-controlled (at intervals, after each time you speak, or when the meeting starts) because participants in earlier concepts told us that unprompted AI messages can themselves become a source of pressure.',
        zh: '鼓励频率完全由用户控制（按时间间隔、每次发言后、或会议开始时）——因为在早期概念测试中，参与者告诉我们：不受控的 AI 消息本身也可能成为新的压力来源。',
      },
    ],
  },
  {
    id: 'workplace-log',
    page: true,
    // This page also embeds Custom Emotion Tagging as a second prototype.
    extraPrototypes: ['emotion-popup'],
    title: { en: 'Emotion Journal', zh: '情绪日志' },
    description: {
      en: 'After each meeting, the AI companion helps the user capture and organise how the meeting felt (happy, confident, nervous, frustrated, and so on). Users can write a log for every meeting, noting how their communication felt and the specific situation.',
      zh: '在每次会议结束后，AI 小助手还会协助用户记录和整理本场会议的情绪体验（如开心、自信、紧张、沮丧等），用户可以为每场会议撰写日志，记下自己的表达感受和具体情境。',
    },
    thumbnail: 'thumbnails/workplace-log.png',
    ...fig('812-1789'),
    scenario: SCENARIO.workplace,
    device: DEVICE.desktop,
    tags: ['Emotion tracking'],
  },
  {
    id: 'smartwatch-feedback',
    page: true,
    title: { en: 'Heart-Rate Breathing Guide', zh: '心率感知呼吸调节系统' },
    description: {
      en: 'Uses wearables such as a smartwatch to monitor heart-rate changes and detect tension, then combines haptic feedback with a moving visual guide to help people who stutter pace their breathing and ease anxiety.',
      zh: '通过智能手表等可穿戴设备监测用户心率变化识别紧张状态，并结合振动反馈与动态视觉引导，帮助口吃者调整呼吸节奏，缓解焦虑。',
    },
    thumbnail: 'thumbnails/smartwatch-feedback.png',
    ...fig('442-4779'),
    scenario: SCENARIO.workplace,
    device: DEVICE.wearable,
    tags: ['Encouragement'],
    // Natural size of the watch-framed prototype (used to scale-to-fit on mobile).
    canvas: { w: 440, h: 580 },
  },
  {
    id: 'emotion-popup',
    // Not shown as its own card — embedded inside the Emotion Journal page.
    hidden: true,
    title: { en: 'Custom Emotion Tagging', zh: '自定义情绪标记' },
    description: {
      en: 'A quick popup for tagging nuanced emotions in your own words, so feelings aren’t lost to a fixed list.',
      zh: '一个快捷弹窗，可用自己的话标记细腻情绪，避免感受被固定选项所局限。',
    },
    thumbnail: 'thumbnails/emotion-popup.png',
    ...fig('812-1270'),
    scenario: SCENARIO.workplace,
    device: DEVICE.desktop,
    tags: ['Emotion tracking'],
  },
];
