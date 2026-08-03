# Handoff: Communication & Accessibility Prototypes

## Overview
A set of **12 interactive UI prototypes** exploring speech, meeting, and emotional‑wellbeing features (turn‑taking assists, stutter‑aware interviews, an emotion journal curated by an AI companion "小美 / Xiaomei", a voice assistant, etc.). They are bilingual (Chinese default, English toggle) and dark‑themed.

The prototype the team iterated on most is **情绪日志 / Workplace Emotion Log (`WorkplaceLog.jsx`)** — this README documents it in depth and summarizes the rest.

## About the Design Files
The files in this bundle are **design references authored in React + Tailwind (JSX)** — prototypes that demonstrate the intended look, copy, and interaction. They are **not a drop‑in production module**.

Your task in Claude Code is to **recreate these designs inside your own codebase**, using its established patterns, component library, i18n layer, routing, and styling conventions. If your project already uses React + Tailwind you can adapt the JSX directly; if it uses a different stack (Vue, SwiftUI, native, plain CSS…), treat the JSX as the precise spec and rebuild it there. If the project has no UI environment yet, React + Tailwind (as written here) is a reasonable choice.

## Fidelity
**High‑fidelity.** Final colors, spacing, type sizes, copy, and interactions are all encoded in the JSX. Recreate the UI pixel‑for‑pixel, but route styling through your codebase's design system where one exists (e.g. map the pink accent to your brand token rather than hard‑coding `#e84d8a`).

---

## Shared Architecture (read first)
Every prototype follows the same three conventions:

1. **`useLanguage()` / `t()` for all copy.** Import from `src/context/LanguageContext`. Copy is written as `{ en, zh }` objects and rendered with `t(obj)`. A runnable reference `LanguageContext.jsx` is included — replace it with your app's i18n on integration, keeping a `t()` that accepts `{en,zh}` (or a string).
2. **Tailwind utility classes** for all layout/styling. Arbitrary values are used deliberately (e.g. `text-[13px]`, `rounded-[14px]`, `bg-[#1a1a1a]`) — **do not round them to a spacing/type scale**; the exact values are the design.
3. **Self‑contained SVG icons** declared at the top of each file as small stroke components (lucide‑style, `stroke-width` 1.6–1.8). No icon library is required, though you may swap them for your own.

**Each prototype is a single default‑export component** meant to render inside a fixed stage (roughly **1171 × 769** for desktop screens). Two device‑frame wrappers are shared:
- `WatchFrame.jsx` — 384×444 watch body → used by `SmartwatchFeedback`.
- `PhoneFrame.jsx` — phone body → used by `EmergencyReport` (mobile).

**Assets** are referenced by site‑absolute path `'/assets/…'`. They live in `public/assets/` here; serve that folder at `/assets` in your app (Vite/CRA/Next `public/` handles this automatically).

---

## Screens / Views

### ⭐ 情绪日志 · Workplace Emotion Log — `WorkplaceLog.jsx` (primary)
**Purpose.** A dark analytics surface inside a "Meeting Workspace" desktop app where an AI companion (小美 / Xiaomei) summarizes the user's emotions from meetings and helps them journal. Three tabs: **每日 Daily / 每周 Weekly / 每月 Monthly**.

**Overall layout.** Top bar (h‑11, `#121217`, traffic‑lights + search) → left icon sidebar (w‑24, `#1a1a1f`) → scrollable main column (px‑5). Main column: page title row → tab bar → tab content.
- Title row: **情绪日志** (22px bold) + **由 小美 整理** with Xiaomei's face avatar + a gear that opens an **assistant‑settings popover** (switch avatar 小美 rose ⇄ 小黄 yellow).
- Tab underline is the pink accent (`#e84d8a`), 3px, 40px wide.

**Daily tab.** Two‑column grid `grid-cols-[475fr_661fr]`:
- Left: **今日情绪概览** card (emotion‑overview) + **小美的今日回顾** recap card.
- Right: **本日会议记录** — a list of `MeetingCard`s (3 meetings) each with a note, feeling tags, a logged badge, and a **写日志** button.

**Weekly tab.** Same left column (**本周情绪概览** + **小美的本周回顾**). Right: **本周会议记录** with a 7‑day chip selector; picking a day shows that day's meetings (`MeetingCard`s + 写日志).

**Monthly tab.** Same two‑column grid:
- Left: **本月情绪概览** + **小美的本月回顾**.
- Right: a single merged card — **本月情绪日历** (compact calendar, ~30px flattened cells, weekday header 一…日, up to 3 emotion dots per day, selectable) with **5月N日 · 当天会议** meeting records rendered **directly underneath the calendar in the same card**, separated by a hairline divider.

**Key reusable components inside the file.**
- `EmotionOverviewCard` — title + subtitle, a proportional stacked color bar, and a 4‑col grid of emotion circles (`EmoRing`). **Every emotion circle is clickable**: clicking toggles a small popover tip "…小美建议 / Xiaomei suggests" for that emotion (see `EMO_TIPS`). Only one tip open at a time.
- `EmoRing` — colored ring (2px border in the emotion color, fill at `${color}2e` ≈ 18% alpha) around the emoji glyph.
- `RecapCard` — pink‑tinted card (`bg-[#e84d8a]/10`) with a bulleted list; each bullet has a colored dot. **No avatar** next to the title (removed by request).
- `MeetingCard` — meeting title/meta/time, a note in a pink‑bordered box, optional green **已写 / Logged** status pill, feeling tags, and a **写日志** action button. The button is **always the solid pink 写日志** (`#e84d8a`); logged state is shown only by the green status pill, not by changing the button.
- `JournalModal` — the 写日志 modal: assistant header, editable feeling chips, a chat thread with prompt chips, and an input bar. Sending marks that meeting logged.
- `AssistantAvatar` — generic robot avatar used for the non‑Xiaomei persona (小黄).
- **Xiaomei face avatar** — built inline as layered `<div>`s in the `MEI_SVG` string (pink hair, skin face, eyes, blush, smile), rendered by `MeiFace({size})` which scales a 28px artwork. Used in the title row when the active persona is Xiaomei. (This replaced an earlier avatar whose face was hidden behind the hair.)

**Assistant personas** (`ASSISTANTS`): `小美 Xiaomei` (disc `#d4a6a1`) and `小黄 Xiaohuang` (disc `#f5c34b`). The active persona drives the sidebar active‑icon tint and the recap/journal avatars.

### The other 11 prototypes (concise)
Each is a single default export; open the file for exact copy and values. All share the conventions above.

| File | Name | Purpose |
|---|---|---|
| `MeetingCompanion.jsx` | AI 心伴 · Meeting Companion | In‑meeting AI assistant / 会议小助手 sidebar. |
| `FacialTurnTaking.jsx` | Facial Recognition Turn‑Taking | Camera view (`/assets/facial/face.png`) that detects who should speak next. |
| `EmotionTagging.jsx` | Custom Emotion Tagging | UI for defining custom emotion tags / 自定义感受. |
| `ExtendedTurnTaking.jsx` | Extended Turn‑Taking | Meeting grid with AI turn prompts; assets `/assets/meeting/*.png`. |
| `FeedbackPlugin.jsx` | Auto Caption / AI 字幕过滤 | Live‑caption filtering plugin panel. |
| `InterviewTool.jsx` | AI‑Powered Interview Tool | Interviewer console; assets `/assets/interview/`. |
| `InterviewNotification.jsx` | Stutter‑Aware Interview | Video interview with a stutter‑mode AI notice + transcript cleaning. |
| `EvDashboard.jsx` | EV Dashboard Voice Control | In‑car dashboard controlled by voice. |
| `EmergencyReport.jsx` | Emergency Report (Mobile) | Phone flow (`PhoneFrame`) for an emergency call/report; assets `/assets/emergency/`. |
| `VoiceAssistant.jsx` | AI Voice Assistant | Voice assistant screen; assets `/assets/speech-ai/`. |
| `SmartwatchFeedback.jsx` | Smartwatch Positive Feedback | Watch face (`WatchFrame`) giving positive nudges. |

---

## Interactions & Behavior (WorkplaceLog)
- **Tabs** swap the whole content region via a `tab` state (`daily | weekly | monthly`).
- **Emotion circles** — click to open/close a per‑emotion tip popover (`open` state holds the active variant or `null`; clicking the open one closes it, clicking another switches).
- **Meeting 写日志** — opens `JournalModal` for that meeting; **Send** adds the meeting id to `loggedIds` and closes the modal (the green 已写 pill then shows).
- **Weekly day chips / monthly calendar days** — clicking sets the selected date and re‑renders that date's meeting list.
- **Assistant settings gear** — toggles a popover to switch persona (小美 ⇄ 小黄) or "upload a custom avatar" (visual only).
- **Language** — everything renders through `t()`; a host toggle flips `lang` between `zh`/`en`.
- Transitions are simple Tailwind `transition` hovers; the modal fades/pops (see the preview harness's `.animate-msg-in` keyframes if you want the entrance animation).

## State Management (WorkplaceLog)
Local React state in the root component:
- `tab` — active tab.
- `loggedIds` — map of `"<date>-<index>" → true` for meetings that have been journaled (seeded from each meeting's `logged` flag).
- `open` (inside `EmotionOverviewCard`) — which emotion's tip is showing.
- `settingsOpen`, `personaId` — assistant‑settings popover + chosen persona.
- `journal` — `{ id, meeting, dateLabel }` or `null` to drive `JournalModal`.
- `monthDay` — selected day on the monthly calendar.
No data fetching — all content is static arrays at the top of the file (`DAILY_DIST`, `WEEK_DIST`, `MONTH_DIST`, `MEET_BY_DATE`, `RECAP`, `WEEK_RECAP`, `MONTH_RECAP`, `MONTH_DOTS`, `EMO_TIPS`, …). Wire these to real APIs during integration.

## Design Tokens (WorkplaceLog dark theme)
**Surfaces:** page `#0a0a0a` · top bar `#121217` · sidebar `#1a1a1f` · cards `#1a1a1a` / raised `#242424` / bar track `#292929` · active nav tile `#3b1f2e`.
**Text:** primary `#ffffff` · secondary `#e8e8e8` · muted `#999999` (often at 60–85% opacity) · hairlines `rgba(255,255,255,0.05–0.08)`.
**Accent (pink):** `#e84d8a` (calendar variant `#e94c89`); hover `#d13d79`.
**8 emotion colors:** happy `#0fba82` · confident `#e84d8a` · relaxed `#05b5d4` · calm `#94a3b8` · anxious `#f59e0a` · tired `#8c5cf5` · down `#3b82f5` · frustrated `#f04545`. Rings fill at ~18% (`${color}2e`).
**Calendar legend colors:** efficient `#10b981` · confident `#e94c89` · focused `#06b6d4` · anxious `#f59e0b`.
**Persona discs:** 小美 `#d4a6a1` · 小黄 `#f5c34b`.
**Radii:** cards `14px` · inner cards/chips `10–12px` · pills/rings full.
**Type:** family Inter / system‑ui; sizes range `8.5px`→`22px` (note the many arbitrary sizes — keep them). Weights 400/500/600/700.
**Emotion emoji glyphs:** 😊 💪 😌 🙂 😬 😩 😔 😣.

## Assets
Bundled under `public/assets/` (serve at `/assets`):
- `facial/face.png`
- `meeting/*.png` (chen-ming, li-na, wang-fang — large/small)
- `interview/{candidate.jpg, interviewer.png, linwei.png, zhanghao.png}`
- `emergency/*.svg` (phone, shield, status, tips, qa-*, message, pin)
- `speech-ai/*.svg` (mic, send, settings, user, volume2, x, zap, message-square)

`WorkplaceLog` uses **no external image assets** — the Xiaomei avatar and all icons are inline. Emoji are system emoji.

## Files
```
design_handoff_prototypes/
├─ README.md                         ← this file
├─ src/
│  ├─ context/LanguageContext.jsx    ← shared i18n (reference impl; swap for yours)
│  └─ prototypes/
│     ├─ WorkplaceLog.jsx            ← ⭐ primary (情绪日志)
│     ├─ WatchFrame.jsx  PhoneFrame.jsx   ← device frames
│     ├─ MeetingCompanion.jsx  FacialTurnTaking.jsx  EmotionTagging.jsx
│     ├─ ExtendedTurnTaking.jsx  FeedbackPlugin.jsx  InterviewTool.jsx
│     ├─ InterviewNotification.jsx  EvDashboard.jsx  EmergencyReport.jsx
│     └─ VoiceAssistant.jsx  SmartwatchFeedback.jsx
└─ public/assets/                    ← images/SVGs, serve at /assets
```

## Running / sanity‑checking the JSX
The prototypes are standard React 18 function components + Tailwind. To view one in isolation:
1. Drop the folder into a React + Tailwind app (Vite recommended).
2. Wrap your root in `<LanguageProvider>` from `src/context/LanguageContext.jsx`.
3. Render a prototype inside a fixed 1171×769 box: `<div style={{width:1171,height:769}}><WorkplaceLog/></div>`.
4. Ensure `public/assets` is served (Vite does this automatically).

For a stack other than React, use each component as the exact visual/interaction spec and rebuild with your framework.
