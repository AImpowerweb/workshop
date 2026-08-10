// ─────────────────────────────────────────────────────────────────────────────
//  PAGE COPY  —  edit this file to change all wording on the site.
//  Every entry is { en: 'English', zh: '简体中文' }.
//  The text below is PLACEHOLDER copy — replace it with your final wording.
// ─────────────────────────────────────────────────────────────────────────────

export const content = {
  brand: { en: 'AIMpower', zh: 'AIMpower' },

  nav: {
    about: { en: 'About', zh: '关于' },
    prototypes: { en: 'Prototypes', zh: '原型' },
    team: { en: 'About Team', zh: '关于团队' },
    workshop: { en: 'About Workshop', zh: '关于工作坊' },
  },

  hero: {
    eyebrow: { en: 'Research Showcase', zh: '研究展示' },
    title: {
      en: 'Designing for Everyone, Together',
      zh: '与所有人一起，共创设计',
    },
    subtitle: {
      en: 'A collection of interactive prototypes exploring how thoughtful interface design can be more inclusive, accessible, and human.',
      zh: '一系列互动原型，探索如何通过用心的界面设计，让产品更具包容性、无障碍性与人性化。',
    },
    body: [
      {
        en: 'This is placeholder text for the research introduction. Replace it with a short paragraph describing the goal of the study, the questions it explores, and who it is for. You can keep it to two or three sentences.',
        zh: '这是研究介绍的占位文字。请替换为简短的段落，说明本研究的目标、所探讨的问题以及面向的对象。两到三句话即可。',
      },
      {
        en: 'Each prototype below is a fully coded, interactive concept — click any card to open it right here and try it yourself.',
        zh: '下方的每个原型都是完整编码、可交互的概念——点击任意卡片即可在本页打开并亲自体验。',
      },
    ],
    note: {
      en: '✱ Placeholder text — final copy coming soon.',
      zh: '✱ 占位文字 —— 最终内容即将更新。',
    },
  },

  prototypes: {
    sectionTitle: { en: 'Prototypes', zh: '原型展示' },
    sectionSubtitle: {
      en: 'Interactive concepts across four scenarios. Click a card to open its page and try the live prototype.',
      zh: '涵盖四种场景的互动概念。点击卡片即可打开对应页面并体验在线原型。',
    },
    openLabel: { en: 'Open prototype', zh: '打开原型' },
    comingSoon: { en: 'Coming soon', zh: '敬请期待' },
    // Controls
    organizeBy: { en: 'Organize by', zh: '组织方式' },
    ungrouped: { en: 'All', zh: '全部' },
    filterByTag: { en: 'Filter by function', zh: '按功能筛选' },
    allTags: { en: 'All', zh: '全部' },
    countLabel: { en: 'designs', zh: '个设计' },
    emptyState: {
      en: 'No prototypes match this filter.',
      zh: '没有符合该筛选条件的原型。',
    },
    // Card
    quotesLabel: { en: 'What participants said', zh: '参与者反馈' },
    // Modal
    openInFigma: { en: 'Open in Figma', zh: '在 Figma 打开' },
    close: { en: 'Close', zh: '关闭' },
  },

  // Dedicated prototype pages (#/prototype/<id>)
  page: {
    back: { en: 'All prototypes', zh: '全部原型' },
    about: { en: 'About this concept', zh: '关于这个概念' },
    tryIt: { en: 'Try the prototype', zh: '体验原型' },
    tryItMulti: { en: 'Try the prototypes', zh: '体验原型' },
    tryItHint: {
      en: 'Fully interactive — click around.',
      zh: '完全可交互——点击试试。',
    },
    // Mobile affordances: these prototypes are desktop-sized, so on a phone they
    // are scaled well below a readable size. Say so, and offer a bigger view.
    mobileNotice: {
      en: 'Desktop-sized interface, scaled down to fit.',
      zh: '桌面端界面，已按屏幕缩小显示。',
    },
    tapToOpen: {
      en: 'Tap it to open fullscreen.',
      zh: '点击即可全屏查看。',
    },
    mobileNoticeRotate: {
      en: 'Rotate for a closer look.',
      zh: '横屏可看得更清楚。',
    },
    openFullscreen: { en: 'Open fullscreen', zh: '全屏查看' },
    closeFullscreen: { en: 'Close', zh: '关闭' },
    fullscreenHint: {
      en: 'Pinch to zoom · scroll to pan · rotate for a wider view',
      zh: '双指缩放 · 滑动查看 · 横屏可看到更多',
    },
    moreInfo: { en: 'Further information', zh: '更多信息' },
    scenario: { en: 'Use scenario', zh: '使用场景' },
    platform: { en: 'Platform', zh: '平台' },
    status: { en: 'Status', zh: '状态' },
    statusValue: { en: 'Research concept', zh: '研究概念' },
    disclaimer: {
      en: '✱ This is a coded research prototype — responses are scripted for demonstration; no real AI runs behind it.',
      zh: '✱ 这是一个编码研究原型——反馈为演示脚本，背后并未运行真实 AI。',
    },
    notFound: {
      en: 'Prototype not found.',
      zh: '未找到该原型。',
    },
  },

  // Home-page sections after the prototypes — PLACEHOLDER copy, replace later.
  team: {
    title: { en: 'Our Team', zh: '我们的团队' },
    body: {
      en: 'This is placeholder text introducing the team. Replace it with a short paragraph about who you are — the researchers, designers, and collaborators behind this project — and what brings you together around inclusive, stutter-friendly design.',
      zh: '这是介绍团队的占位文字。请替换为简短的段落，说明你们是谁——本项目背后的研究者、设计师与合作伙伴——以及是什么让你们因包容、对口吃者友好的设计而走到一起。',
    },
    // Names and affiliations are proper nouns — only the role labels translate.
    //
    // Researchers are grouped by institution. Add a `photo` to any member to
    // show their portrait instead of the initials placeholder, e.g.
    //   { name: 'Shaomei Wu', photo: 'assets/team/shaomei-wu.jpg' }
    // Paths are relative to `public/` and resolved against the site base URL.
    groups: [
      {
        label: { en: 'Research Team', zh: '研究团队' },
        orgs: [
          {
            org: 'AImpower.org',
            members: [{ name: 'Jingjin Li' }, { name: 'Shaomei Wu' }],
          },
          {
            org: 'University of California, Santa Cruz',
            members: [{ name: 'Peiyao Liu' }, { name: 'Rebecca Lietz' }, { name: 'Norman Makoto Su' }],
          },
          {
            org: 'Stanford University',
            members: [{ name: 'Jennifer Chien' }],
          },
        ],
      },
      {
        label: { en: 'Designer', zh: '设计师' },
        members: [{ name: 'Chia-Ying Tsai' }],
      },
      {
        label: { en: 'Partner', zh: '合作伙伴' },
        // Set `logo` to show the partner's mark instead of a lettermark, e.g.
        //   logo: 'assets/team/gcsa-logo.png'
        members: [
          {
            name: 'The Global Chinese Stuttering Association',
            lettermark: 'GCSA',
            note: { en: 'formerly StammerTalk 口吃说', zh: '前身为 StammerTalk 口吃说' },
          },
        ],
      },
    ],
  },

  workshop: {
    title: { en: 'About Workshop', zh: '关于工作坊' },
    body: {
      en: 'This is placeholder text introducing the workshop. Replace it with a short paragraph about the workshop — its goals, who takes part, and how these prototypes grew out of sessions with people who stutter and the people around them.',
      zh: '这是介绍工作坊的占位文字。请替换为简短的段落，说明工作坊的目标、参与的人群，以及这些原型如何在与口吃者及其身边人的共创中逐步成形。',
    },
    cta: {
      label: { en: 'Read the workshop story', zh: '阅读工作坊故事' },
      href: '#/workshop',
    },
  },

  // ── Dedicated workshop page (route: #/workshop) ──────────────────────────
  workshopPage: {
    back: { en: 'Home', zh: '首页' },
    eyebrow: { en: 'About workshop', zh: '关于工作坊' },
    title: {
      en: 'Designing Beyond Fluency: What If Speech Technology Didn’t Assume You Speak “Perfectly”?',
      zh: '超越流利的设计：如果语音技术不再假设你“说得完美”？',
    },
    intro: [
      {
        en: 'Speech AI is everywhere. It is the voice assistant on your phone, the automated line you call about a bill, the tool that turns a meeting into a transcript. But these systems work best for a certain kind of voice. Pause too long, and they cut you off. Repeat a word, and they mishear you. For people who stutter, about 1% of adults worldwide, these are not occasional glitches but daily barriers.',
        zh: '语音 AI 无处不在——手机里的语音助手、查询账单时的自动语音电话、把会议变成文字记录的工具。但这些系统只对某一种声音最有效。停顿久一点，它就打断你；重复一个词，它就听错你。对全球约 1% 的成年口吃者来说，这些不是偶发的小故障，而是日常的障碍。',
      },
      {
        en: 'Most speech technologies are designed and optimized around an unstated expectation that users will speak fluently, continuously, and within the system’s time limits. Our research asks a different question. Instead of asking how to fix stuttered speech for technology, we asked people who stutter to imagine speech technology for themselves. What do they actually want, and what shapes what they are able to imagine? To find out, we partnered with the stuttering community in China. We surveyed 53 people who stutter and invited 13 of them into a series of co-design workshops.',
        zh: '大多数语音技术在设计与优化时，都隐含一个未言明的预设：用户会流利、连续地说话，并且在系统的时间限制之内完成。我们的研究提出了另一个问题：与其追问如何为技术「修正」口吃语音，我们邀请口吃者自己来想象属于他们的语音技术。他们真正想要什么？又是什么塑造了他们所能想象的边界？为此，我们与中国的口吃社群合作，调研了 53 位口吃者，并邀请其中 13 位参与了一系列共创设计工作坊。',
      },
    ],
    sections: [
      {
        heading: {
          en: 'The problem is not stuttered speech. It’s how systems treat it.',
          zh: '问题不在于口吃本身，而在于系统如何对待它',
        },
        paragraphs: [
          {
            en: 'Our survey showed that speech AI is already part of daily life for people who stutter. Over 90% had used at least one speech AI product. But using them came at a cost. Two thirds reported transcription errors, and more than half had their speech go unrecognized or get cut off mid-sentence.',
            zh: '调研显示，语音 AI 已是口吃者日常生活的一部分：超过 90% 的人至少使用过一种语音 AI 产品。但使用是有代价的——三分之二的人遇到过转写错误，超过半数的人经历过语音无法被识别，或在话说到一半时被打断。',
          },
          {
            en: 'A clearer pattern sat underneath these numbers. The hardest situations were the ones with time pressure. Nearly 9 in 10 participants stuttered noticeably when speaking in front of a group, and 3 in 4 when speaking on the phone. These are exactly the situations where systems and audiences expect fast, smooth answers. The toll is real. Around 70% of survey respondents said they frequently avoid speaking situations altogether, and nearly half reported strong stress, anxiety, or physical tension when speaking.',
            zh: '数字背后是一个更清晰的模式：最困难的场景，都是有时间压力的场景。近九成参与者在当众发言时会明显口吃，四分之三的人在打电话时如此。而这恰恰是系统与听者都期待快速、流畅回应的场合。代价是真实的：约 70% 的受访者表示会经常回避需要开口的场合，近半数在说话时感到强烈的压力、焦虑或身体紧绷。',
          },
        ],
      },
      {
        heading: {
          en: 'What people designed for today: fitting in',
          zh: '面向当下设计时，人们想的是「融入」',
        },
        paragraphs: [
          {
            en: 'In the workshops, participants named independence, acceptance, and well-being as their core values. Yet when they designed technologies for their current lives, something striking happened. People who valued independence designed tools that spoke for them. People who valued acceptance designed tools that made them sound fluent. When the fluent world is taken as fixed, even the most creative designs help people fit into it rather than change it.',
            zh: '在工作坊中，参与者将独立、被接纳与身心健康列为核心价值。但当他们为当下的生活设计技术时，出现了一个耐人寻味的现象：重视独立的人，设计出替他们说话的工具；重视被接纳的人，设计出让自己听起来更流利的工具。当「流利的世界」被视为不可撼动的前提，即便最有创造力的设计，也只是在帮助人们融入它，而不是改变它。',
          },
        ],
      },
      {
        heading: {
          en: 'Then we visited the Stuttering Planet',
          zh: '于是，我们造访了「口吃星球」',
        },
        paragraphs: [
          {
            en: 'So we changed the question. We invited participants on an imaginary journey to the “Stuttering Planet,” a world where everyone stutters, and stuttered speech is simply how people talk. Repetitions, pauses, and stretched syllables are part of everyday conversation. Then we asked: what does technology look like here?',
            zh: '所以我们换了一个问题。我们邀请参与者踏上一场想象之旅，前往「口吃星球」——在那里人人都口吃，口吃就是人们说话的方式，重复、停顿与拉长的音节都是日常对话的一部分。然后我们问：在这里，技术会是什么样子？',
          },
        ],
        // The scenario text participants were shown (rendered as real text, not an image).
        scenario: {
          caption: {
            en: 'The “Stuttering Planet” scenario shown to participants',
            zh: '向参与者展示的「口吃星球」情境设定',
          },
          text: {
            en: 'After years of space exploration, a mysterious planet has sent us an invitation. You, as a key member of the interstellar exploration team, have landed on this never-before-seen planet, alongside your teammates. We’ve traveled through the vastness of space, and now we are about to uncover the secrets of this extraordinary world. This little-known planet is home to a society made up entirely of people who stutter. Their world is nothing like the one you’re familiar with. Everyone speaks with a unique rhythm. They do not aim for fluent or complete sentences. Instead, repeated words, rhythmic pauses, and extended syllables are part of everyday conversation.',
            zh: '经过多年的太空探索，一颗神秘星球向我们发出了邀请。作为星际探索队的核心成员，你与队友一同降落在这颗从未有人见过的星球上。我们穿越了浩瀚的宇宙，如今即将揭开这个非凡世界的秘密。这颗鲜为人知的星球上，生活着一个完全由口吃者组成的社会。他们的世界与你所熟悉的截然不同：每个人说话都有自己独特的节奏，他们并不追求流利或完整的句子；相反，重复的词语、有韵律的停顿与被拉长的音节，都是日常对话的一部分。',
          },
        },
        afterScenario: [
          {
            en: 'Everything changed. Participants imagined a world where fluent speakers were the outsiders, some even adding disfluencies to their speech to fit in. Job interviews allotted more time, and pauses and repetitions became expressive rather than embarrassing. Even the AI stuttered, because it was trained on stuttered speech. As one participant put it, the harm of stuttering had always come from being seen as different, and on this planet that harm simply wouldn’t exist.',
            zh: '一切都变了。参与者想象出一个流利者反而成为「异类」的世界，有人甚至会在说话时刻意加入不流畅，以便融入。面试会分配更充裕的时间，停顿与重复不再令人尴尬，而成为一种表达。就连 AI 也会口吃，因为它是用口吃语音训练出来的。正如一位参与者所说：口吃带来的伤害，一直源于被视为「与众不同」；而在这颗星球上，这种伤害根本不会存在。',
          },
        ],
        figure: {
          src: `${import.meta.env.BASE_URL}assets/workshop/stuttering-planet-notes.jpg`,
          caption: {
            en: 'What participants imagined on the Stuttering Planet',
            zh: '参与者在「口吃星球」上想象出的图景',
          },
          alt: {
            en: 'Workshop sticky notes from participants P10 and P13 describing the Stuttering Planet — including “I enjoy interacting with them”, “communication takes more time”, “I wonder whether fluent people are the outsiders here”, and “There is AI there too. Stuttering might also show up in their writing.”',
            zh: '工作坊便利贴，来自参与者 P10 与 P13 对「口吃星球」的描述，包括「我很享受与他们交流」「沟通需要更多时间」「我在想，流利的人在这里是不是反而成了异类」以及「这里也有 AI，口吃甚至可能出现在他们的书写中」。',
          },
        },
        closing: [
          {
            en: 'What changed wasn’t participants’ creativity. It was what the design task allowed them to question. And that, we argue, holds a lesson for accessibility research and for anyone building speech technology today.',
            zh: '改变的并不是参与者的创造力，而是设计任务允许他们去质疑的东西。我们认为，这一点对无障碍研究、以及今天所有构建语音技术的人，都是一个启示。',
          },
        ],
      },
      {
        heading: { en: 'What we learned', zh: '我们学到了什么' },
        paragraphs: [
          {
            en: 'Stigma can limit what people imagine. Our participants openly critiqued fluency norms, yet still designed within them, which means inviting marginalized communities to the table is not enough on its own. What unlocked their imagination was changing the design task itself, so that fluency was no longer treated as a given. And once it wasn’t, their designs pointed to a clear conclusion. Speech accessibility is a matter of time, not just recognition. What people who stutter need is not a slower world but flexible pacing, fast where a situation demands it and unhurried where it doesn’t.',
            zh: '污名会限制人们的想象。我们的参与者公开质疑「流利至上」的规范，却仍在这套规范之内进行设计——这意味着，仅仅邀请边缘社群参与是不够的。真正释放他们想象力的，是改变设计任务本身，让「流利」不再被当作理所当然的前提。而一旦如此，他们的设计指向了一个清晰的结论：语音无障碍关乎时间，而不只是识别。口吃者需要的不是一个更慢的世界，而是有弹性的节奏——在需要快的场合可以快，在不需要的场合则不必着急。',
          },
        ],
      },
    ],
    paper: {
      heading: { en: 'Read the paper', zh: '阅读论文' },
      body: {
        en: 'This work will be published at ASSETS ’26. Read the full paper here:',
        zh: '本研究将发表于 ASSETS ’26。点击下方链接阅读全文：',
      },
      linkLabel: { en: 'Read the full paper', zh: '阅读论文全文' },
      url: 'https://drive.google.com/file/d/1pZE1X_YQxvJ8JslZTbOIOhTNvU7WNZs2/view?usp=sharing',
      citation:
        'Peiyao Liu, Jingjin Li, Rebecca Lietz, Shaomei Wu, and Norman Makoto Su. 2026. Designing Beyond Fluency: Imagining Speech Technology through Speculative Design with People Who Stutter. In The 28th International ACM SIGACCESS Conference on Computers and Accessibility (ASSETS ’26).',
    },
  },

  footer: {
    tagline: {
      en: 'Inclusive design research.',
      zh: '包容性设计研究。',
    },
    rights: {
      en: '© 2026 AIMpower. All rights reserved.',
      zh: '© 2026 AIMpower. 保留所有权利。',
    },
  },
};
