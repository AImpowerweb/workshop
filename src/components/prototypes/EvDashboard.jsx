import { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';

// ─────────────────────────────────────────────────────────────────────────────
//  Figma-matched rebuild of "EV Dashboard Screen Design" (555:3898, 1171×769) —
//  in-car voice assistant that understands stuttered commands. Bilingual.
//  Wired: confirming a destination (click an option) completes the request and
//  updates the destination card + assistant reply.
// ─────────────────────────────────────────────────────────────────────────────

const OPTIONS = [
  { en: 'Disneytown Shopping Area', zh: '迪士尼小镇购物区' },
  { en: 'Disneyland Entrance', zh: '迪士尼乐园入口' },
  { en: 'Disney Hotel', zh: '迪士尼酒店' },
];

/* ── icons ───────────────────────────────────────────────────────────────── */
const S = (w = 1.67) => ({ fill: 'none', stroke: 'currentColor', strokeWidth: w, strokeLinecap: 'round', strokeLinejoin: 'round' });
const IcBattery = ({ size = 'h-5 w-5' }) => (
  <svg className={size} viewBox="0 0 24 24" {...S()}><rect x="2" y="7" width="16" height="10" rx="2" /><path d="M22 11v2" /><path d="M6 11v2M10 11v2" /></svg>
);
const IcThermo = () => (
  <svg className="h-5 w-5" viewBox="0 0 24 24" {...S()}><path d="M14 4v10.54a4 4 0 1 1-4 0V4a2 2 0 0 1 4 0z" /></svg>
);
const IcNav = () => (
  <svg className="h-5 w-5" viewBox="0 0 24 24" {...S()}><path d="M3 11l19-9-9 19-2-8-8-2z" /></svg>
);
const IcClock = ({ color }) => (
  <svg className="h-5 w-5" viewBox="0 0 24 24" {...S()} style={{ color }}><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>
);
const IcGauge = () => (
  <svg className="h-5 w-5" viewBox="0 0 24 24" {...S()}><path d="M12 14l3.5-3.5" /><path d="M20.3 17a9 9 0 1 0-16.6 0" /></svg>
);
const IcMap = () => (
  <svg className="h-5 w-5" viewBox="0 0 24 24" {...S()}><path d="M9 6.6L3 4v13.4L9 20l6-2.6 6 2.6V6.6L15 4 9 6.6z" /><path d="M9 6.6V20M15 4v13.4" /></svg>
);
const IcAlert = () => (
  <svg className="h-5 w-5" viewBox="0 0 24 24" {...S()}><circle cx="12" cy="12" r="9" /><path d="M12 7.5v5M12 16h.01" /></svg>
);
const IcCheckCircle = () => (
  <svg className="h-5 w-5" viewBox="0 0 24 24" {...S()}><path d="M22 11.1V12a10 10 0 1 1-5.9-9.1" /><path d="M22 4L12 14l-3-3" /></svg>
);
const IcXCircle = () => (
  <svg className="h-5 w-5" viewBox="0 0 24 24" {...S()}><circle cx="12" cy="12" r="9" /><path d="M15 9l-6 6M9 9l6 6" /></svg>
);
const IcXSm = () => (
  <svg className="h-4 w-4" viewBox="0 0 24 24" {...S(1.5)}><path d="M6 6l12 12M18 6L6 18" /></svg>
);
const IcMicSm = () => (
  <svg className="h-4 w-4" viewBox="0 0 24 24" {...S(1.33)}><rect x="9" y="2" width="6" height="12" rx="3" /><path d="M5 10a7 7 0 0 0 14 0" /></svg>
);
const IcSound = () => (
  <svg className="h-4 w-4" viewBox="0 0 24 24" {...S(1.33)}><path d="M11 5L6 9H2v6h4l5 4V5z" /><path d="M15.5 8.5a5 5 0 0 1 0 7M19 5a9 9 0 0 1 0 14" /></svg>
);
const IcRoad = () => (
  <svg className="h-3 w-3" viewBox="0 0 24 24" {...S(1.5)}><path d="M2 12c3-3 6-3 9 0s6 3 9 0" /></svg>
);
const IcBolt = () => (
  <svg className="h-3 w-3" viewBox="0 0 24 24" {...S(1.5)}><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" /></svg>
);

/* isometric 3D city blocks (matches attachment: dark cubes, lit top face,
   two shaded side faces — palette #232c3b top / #171e28 right / #11151e left) */
/* route polyline (viewBox 0 0 569 557) — buildings are carved away from it */
const ROUTE_PTS = [[330, 528], [377, 513], [346, 453], [285, 398], [339, 323], [264, 249], [403, 198], [538, 59]];
const distToSeg = (px, py, [ax, ay], [bx, by]) => {
  const dx = bx - ax, dy = by - ay;
  const len2 = dx * dx + dy * dy || 1;
  let tt = ((px - ax) * dx + (py - ay) * dy) / len2;
  tt = Math.max(0, Math.min(1, tt));
  return Math.hypot(px - (ax + tt * dx), py - (ay + tt * dy));
};
const onRoute = (px, py, clear) => {
  for (let k = 0; k < ROUTE_PTS.length - 1; k += 1) {
    if (distToSeg(px, py, ROUTE_PTS[k], ROUTE_PTS[k + 1]) < clear) return true;
  }
  return false;
};

/* rounded-corner path through the route points (arc at every vertex) */
const roundedPath = (pts, r) => {
  let d = `M ${pts[0][0]} ${pts[0][1]}`;
  for (let k = 1; k < pts.length - 1; k += 1) {
    const [px, py] = pts[k - 1], [cx, cy] = pts[k], [nx, ny] = pts[k + 1];
    const l1 = Math.hypot(cx - px, cy - py), l2 = Math.hypot(nx - cx, ny - cy);
    const r1 = Math.min(r, l1 / 2), r2 = Math.min(r, l2 / 2);
    const a = [cx - ((cx - px) / l1) * r1, cy - ((cy - py) / l1) * r1];
    const b = [cx + ((nx - cx) / l2) * r2, cy + ((ny - cy) / l2) * r2];
    d += ` L ${a[0].toFixed(1)} ${a[1].toFixed(1)} Q ${cx} ${cy} ${b[0].toFixed(1)} ${b[1].toFixed(1)}`;
  }
  const last = pts[pts.length - 1];
  d += ` L ${last[0]} ${last[1]}`;
  return d;
};
const ROUTE_D = roundedPath(ROUTE_PTS, 22);

/* waypoint dots at segment midpoints — always sit exactly on the line */
const WAYPOINTS = [
  [361.5, 483, '#00eaff'], [315.5, 425.5, '#00eaff'], [312, 360.5, '#5b6bee'],
  [301.5, 286, '#6e4aee'], [333.5, 223.5, '#6e4aee'], [470.5, 128.5, '#69fe97'],
];

/* iso-cube city — moderate density, road corridor kept clear. */
const BUILDINGS = (() => {
  const out = [];
  let i = 0;
  for (let row = 0; row < 10; row += 1) {
    const y = -28 + row * 60;
    const offset = row % 2 ? 32 : 0;
    for (let col = 0; col < 10; col += 1) {
      i += 1;
      if ((i * 31) % 9 === 0) continue; // gaps
      const x = -20 + offset + col * 62 + (((i * 7919) % 19) - 9);
      const jy = y + (((i * 104729) % 15) - 7);
      const w = 22 + ((i * 13) % 15);
      const d = 20 + ((i * 17) % 12);
      const h = 18 + ((i * 29) % 40);
      // keep the road clear: skip if the cube footprint is near the route
      if (onRoute(x + (w - d) / 2, jy + (w + d) / 2, 32 + w * 0.5)) continue;
      out.push([x, jy, w, d, h]);
    }
  }
  return out;
})();

const IsoBox = ({ cx, cy, w, d, h }) => {
  const p0 = [cx, cy];                       // back corner of top face
  const p1 = [cx + w, cy + w * 0.5];         // right corner
  const p2 = [cx + w - d, cy + w * 0.5 + d * 0.5]; // front corner
  const p3 = [cx - d, cy + d * 0.5];         // left corner
  const pts = (arr) => arr.map((p) => p.join(',')).join(' ');
  return (
    <g>
      <polygon points={pts([p1, p2, [p2[0], p2[1] + h], [p1[0], p1[1] + h]])} fill="#171e28" />
      <polygon points={pts([p3, p2, [p2[0], p2[1] + h], [p3[0], p3[1] + h]])} fill="#11151e" />
      <polygon points={pts([p0, p1, p2, p3])} fill="#232c3b" />
    </g>
  );
};

export default function EvDashboard() {
  const { t } = useLanguage();
  const [confirmed, setConfirmed] = useState(null);
  const isConfirmed = typeof confirmed === 'number';
  const isCancelled = confirmed === 'cancelled';
  const isPending = confirmed == null;

  const item1 = isConfirmed
    ? { icon: <IcCheckCircle />, ring: 'border-[#00c94f]/30 bg-[#00c94f]/20 text-[#05de73]', text: 'text-[#05de73]', label: t({ en: 'Completed', zh: '已完成' }) }
    : isCancelled
      ? { icon: <IcXCircle />, ring: 'border-white/20 bg-white/10 text-[#c2c7cf]', text: 'text-[#c2c7cf]', label: t({ en: 'Cancelled', zh: '已取消' }) }
      : { icon: <IcAlert />, ring: 'border-[#ff6900]/30 bg-[#ff6900]/20 text-[#ff8a05]', text: 'text-[#ff8a05]', label: t({ en: 'Needs confirmation', zh: '需要确认' }) };

  const destination = isConfirmed ? t(OPTIONS[confirmed]) : t({ en: 'Disneytown', zh: '迪士尼小镇' });

  return (
    <div className="flex h-full w-full flex-col text-white" style={{ backgroundImage: 'linear-gradient(135deg, #172457 0%, #1f1a4d 50%, #3d0366 100%)' }}>
      {/* status bar — Figma: 84px, black/30 */}
      <div className="flex h-[72px] shrink-0 items-center justify-between bg-black/30 px-12">
        <div className="flex items-center gap-6">
          <span className="text-3xl font-light tracking-[0.4px]">19:49</span>
          <span className="text-lg">{t({ en: 'Fri, Mar 27', zh: '3月27日星期五' })}</span>
        </div>
        <div className="flex items-center gap-6 text-sm">
          <span className="flex items-center gap-2 text-[#05de73]"><IcBattery /> 87%</span>
          <span className="flex items-center gap-2 text-[#d1d6db]"><IcThermo /> 22°C</span>
        </div>
      </div>

      <div className="flex min-h-0 flex-1 gap-6 px-12 py-4">
        {/* ── navigation screen (Figma 555:3919) ─────────────────────────── */}
        <div className="flex min-w-0 flex-[1.2] flex-col overflow-hidden rounded-3xl border border-white/10 bg-white/5">
          {/* map */}
          <div className="relative min-h-0 flex-1 overflow-hidden rounded-t-3xl bg-[#000418]">
            <svg viewBox="0 0 569 557" className="h-full w-full" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
              <defs>
                <linearGradient id="ev-route" x1="0" y1="1" x2="0" y2="0">
                  <stop offset="0" stopColor="#00ebff" /><stop offset="0.5" stopColor="#6e4aed" /><stop offset="1" stopColor="#69ff96" />
                </linearGradient>
                <linearGradient id="ev-pin" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stopColor="#69ff96" /><stop offset="1" stopColor="#08bdcf" />
                </linearGradient>
                <filter id="ev-blur"><feGaussianBlur stdDeviation="8" /></filter>
              </defs>
              {/* isometric city blocks */}
              {BUILDINGS.map(([cx, cy, w, d, h], i) => (
                <IsoBox key={i} cx={cx} cy={cy} w={w} d={d} h={h} />
              ))}
              {/* route — rounded-corner zigzag polyline: glow + gradient + dashed white */}
              <path d={ROUTE_D} fill="none" stroke="#6e4aee" strokeWidth="14" opacity="0.18" strokeLinecap="round" strokeLinejoin="round" filter="url(#ev-blur)" />
              <path d={ROUTE_D} fill="none" stroke="#6e4aee" strokeWidth="7.9" opacity="0.15" strokeLinecap="round" strokeLinejoin="round" />
              <path d={ROUTE_D} fill="none" stroke="url(#ev-route)" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" />
              <path d={ROUTE_D} fill="none" stroke="#ffffff" strokeWidth="1.8" strokeDasharray="6 6" opacity="0.35" strokeLinecap="round" strokeLinejoin="round" />
              {/* waypoint dots — sit exactly on the rounded line (segment midpoints) */}
              {WAYPOINTS.map(([cx, cy, fill], i) => (
                <circle key={i} cx={cx} cy={cy} r="3.2" fill={fill} opacity="0.85" />
              ))}
              {/* destination marker — green→cyan gradient dot with glow */}
              <g>
                <circle cx="538" cy="59" r="14" fill="#69ff96" opacity="0.2" filter="url(#ev-blur)" />
                <circle cx="538" cy="59" r="9" fill="url(#ev-pin)" />
                <circle cx="538" cy="59" r="3.4" fill="#000418" />
              </g>
              {/* car at start — teal body, cyan cabin stroke, green lights + glow, green parking outline */}
              <g transform="translate(300, 505)">
                <ellipse cx="30" cy="34" rx="30" ry="10" fill="#69ff96" opacity="0.25" filter="url(#ev-blur)" />
                <rect x="12" y="20" width="36" height="20" rx="4" fill="none" stroke="#69ff97" strokeWidth="1.5" opacity="0.9" />
                <rect x="18" y="23" width="24" height="14" rx="3" fill="#0cadbd" />
                <rect x="14" y="27" width="32" height="9" rx="3" fill="#0a8a9a" />
                <rect x="21" y="16" width="18" height="8" rx="2" fill="#1a3a5c" stroke="#00eaff" strokeWidth="0.6" />
                <rect x="14" y="28" width="3.5" height="3.5" fill="#69fe97" opacity="0.9" />
                <rect x="42.5" y="28" width="3.5" height="3.5" fill="#69fe97" opacity="0.9" />
                <rect x="6" y="27" width="10" height="5" fill="#69fe97" opacity="0.15" />
                <rect x="44" y="27" width="10" height="5" fill="#69fe97" opacity="0.15" />
              </g>
            </svg>

            {/* destination card (Figma 555:4221) */}
            <div className="absolute inset-x-6 top-6 rounded-2xl border border-[#2b80ff]/30 bg-black/85 p-[22px] shadow-2xl">
              <div className="flex items-start justify-between">
                <div className="flex gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#2b80ff] shadow-lg"><IcNav /></span>
                  <div>
                    <p className="text-xs text-white/70">{t({ en: 'Destination', zh: '前往目的地' })}</p>
                    <p className="mt-0.5 text-xl font-semibold leading-tight">{destination}</p>
                    <p className="mt-1 text-xs text-[#bfdbff]">{t({ en: '753 Shendi N Rd, Pudong, Shanghai', zh: '上海市浦东新区申迪北路753号' })}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="flex items-center justify-end gap-1 text-[#05de73]"><IcClock color="#05de73" /><span className="text-xl font-bold">25</span><span className="text-sm">{t({ en: 'min', zh: '分钟' })}</span></p>
                  <p className="mt-1 text-base font-medium">18.5 {t({ en: 'km', zh: '公里' })}</p>
                  <p className="mt-1 text-[11px] text-[#99a1b0]">{t({ en: 'ETA 20:14', zh: '预计 20:14 到达' })}</p>
                </div>
              </div>
              <div className="mt-3 flex items-center gap-4 border-t border-white/15 pt-3 text-[11px]">
                <span className="flex items-center gap-1 text-[#05de73]"><IcRoad /> {t({ en: 'Traffic is good', zh: '路况良好' })}</span>
                <span className="h-3 w-px bg-white/30" />
                <span className="text-[#99a1b0]">{t({ en: 'Via Yan’an Elevated Rd → Middle Ring', zh: '经延安高架路 → 中环路' })}</span>
                <span className="h-3 w-px bg-white/30" />
                <span className="flex items-center gap-1 text-[#2b80ff]"><IcBolt /> {t({ en: 'Est. 15% battery use', zh: '预计消耗 15% 电量' })}</span>
              </div>
            </div>

            {/* 目的地 chip (Figma 555:4204) */}
            <div className="absolute right-6 top-[200px] flex items-center gap-3 rounded-2xl border border-[#69ff96]/30 px-4 py-3 shadow-2xl" style={{ backgroundImage: 'linear-gradient(180deg, #171717 0%, #121212 50%, #0f0f0f 100%)' }}>
              <span className="relative flex h-8 w-8 items-center justify-center">
                <span className="absolute h-7 w-7 rounded-full border-[3px] border-[#69ff96]" />
                <span className="h-3 w-3 rounded-full bg-[#69ff96]" />
              </span>
              <div>
                <p className="text-base font-semibold leading-tight">{t({ en: 'Destination', zh: '目的地' })}</p>
                <p className="text-sm text-white/70">{destination}</p>
              </div>
            </div>

            {/* route pill (Figma 555:4215) */}
            <div className="absolute left-1/2 top-[290px] flex -translate-x-1/2 items-center gap-2 rounded-full border border-[#6e4aed] px-4 py-2 opacity-90" style={{ backgroundImage: 'linear-gradient(180deg, #171717 0%, #121212 50%, #0f0f0f 100%)' }}>
              <span className="text-sm font-medium">18.5 {t({ en: 'km', zh: '公里' })}</span>
              <span className="h-1 w-1 rounded-full bg-white/70" />
              <span className="bg-gradient-to-r from-[#59faa3] to-[#12e8ed] bg-clip-text text-sm font-medium text-transparent">25 {t({ en: 'min', zh: '分钟' })}</span>
            </div>

            {/* 当前位置 chip (Figma 555:4192) */}
            <div className="absolute bottom-6 left-5 flex items-center gap-3 rounded-2xl border border-[#69ff96]/30 px-4 py-3 shadow-2xl" style={{ backgroundImage: 'linear-gradient(180deg, #171717 0%, #121212 50%, #0f0f0f 100%)' }}>
              <span className="relative flex h-8 w-8 items-center justify-center">
                <span className="absolute h-8 w-8 rounded-full bg-[#08bdcf]/60" />
                <span className="absolute h-5 w-5 rounded-full bg-[#69ff96]" />
                <span className="relative h-3 w-3 rounded-full bg-[#5469e3]" />
              </span>
              <div>
                <p className="text-base font-semibold leading-tight">{t({ en: 'Current location', zh: '当前位置' })}</p>
                <p className="text-sm text-white/70">{t({ en: 'People’s Square', zh: '人民广场' })}</p>
              </div>
            </div>
          </div>

          {/* stats footer (Figma 555:4266) */}
          <div className="flex shrink-0 items-center gap-11 border-t border-white/10 bg-white/5 px-6 py-6">
            {[
              { Icon: IcGauge, color: '#2b80ff', label: t({ en: 'Speed', zh: '当前速度' }), value: '65 km/h' },
              { Icon: IcBattery, color: '#05de73', label: t({ en: 'Battery', zh: '剩余电量' }), value: '87%' },
              { Icon: IcMap, color: '#ff8a05', label: t({ en: 'Range', zh: '剩余距离' }), value: '18.5 km' },
            ].map(({ Icon, color, label, value }) => (
              <div key={label} className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-full" style={{ backgroundColor: `${color}33`, color }}><Icon /></span>
                <div>
                  <p className="text-xs text-[#99a1b0]">{label}</p>
                  <p className="text-base font-semibold">{value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── conversation history (Figma 555:4298) ──────────────────────── */}
        <div className="flex min-w-0 flex-1 flex-col gap-4">
          <div className="flex shrink-0 items-center justify-between">
            <h3 className="text-2xl font-semibold">{t({ en: 'Conversation', zh: '对话历史' })}</h3>
            <span className="rounded-full border border-[#00c94f]/30 bg-[#00c94f]/20 px-4 py-2 text-sm font-medium text-[#05de73]">{t({ en: 'Accessibility active', zh: '辅助功能已激活' })}</span>
          </div>

          <div className="min-h-0 flex-1 space-y-4 overflow-y-auto pr-1">
            {/* item 1 — needs confirmation / confirmed */}
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <span className={`flex h-10 w-10 items-center justify-center rounded-full border ${item1.ring}`}>
                  {item1.icon}
                </span>
                <div>
                  <p className={`text-lg font-semibold ${item1.text}`}>
                    {item1.label}
                  </p>
                  <p className="text-sm text-[#99a1b0]">19:48:12</p>
                </div>
              </div>
              <div className="rounded-[14px] bg-black/40 p-4">
                <p className="flex items-center gap-2 text-xs text-[#99a1b0]"><IcMicSm /> {t({ en: 'You said:', zh: '您说的是：' })}</p>
                <p className="mt-2 text-sm text-[#d1d6db]">{t({ en: '"N-navigate to Sh-Shanghai Dis-Disneytown"', zh: '"导-导航到上-上海的迪-迪士尼小-小镇"' })}</p>
              </div>
              <div className="rounded-[14px] p-4" style={{ backgroundImage: 'linear-gradient(90deg, rgba(43,128,255,0.1) 0%, rgba(0,184,219,0.1) 100%)' }}>
                <p className="flex items-center gap-2 text-xs font-medium"><IcSound /> {t({ en: 'Assistant:', zh: '智能助手回复：' })}</p>
                <p className="mt-2 text-sm">
                  {isConfirmed
                    ? t({ en: `OK — navigating to ${t(OPTIONS[confirmed])}.`, zh: `好的，正在为您导航至「${t(OPTIONS[confirmed])}」。` })
                    : isCancelled
                      ? t({ en: 'OK — I’ve cancelled this navigation request.', zh: '好的，已为您取消本次导航请求。' })
                      : t({ en: 'I heard you want to navigate to Shanghai Disneytown. Please confirm the destination:', zh: '我听到您想导航到上海的迪士尼小镇。请确认具体目的地：' })}
                </p>
                {isPending && (
                  <>
                    <p className="mt-3 text-sm">{t({ en: 'Say the number or tap an option', zh: '您可以直接说出数字或是点击相對應的选项' })}</p>
                    <div className="mt-3 space-y-2">
                      {OPTIONS.map((opt, i) => (
                        <button key={opt.en} type="button" onClick={() => setConfirmed(i)}
                          className="flex h-12 w-full items-center gap-3 rounded-[10px] bg-[#cc6e00] px-5 text-left text-sm font-medium text-white transition hover:bg-[#b96300]">
                          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white text-xs font-bold text-[#ff8a05]">{i + 1}</span>
                          {t(opt)}
                        </button>
                      ))}
                    </div>
                    <button type="button" onClick={() => setConfirmed('cancelled')}
                      className="mt-2 flex h-11 w-full items-center justify-center gap-2 rounded-[10px] border border-white/20 bg-white/5 text-sm font-medium text-[#d1d6db] transition hover:bg-white/10">
                      <IcXSm /> {t({ en: 'Cancel request', zh: '取消请求' })}
                    </button>
                  </>
                )}
                {isConfirmed && (
                  <button type="button" onClick={() => setConfirmed('cancelled')}
                    className="mt-3 flex h-11 w-full items-center justify-center gap-2 rounded-[10px] border border-[#ff6b6b]/40 bg-[#ff6b6b]/10 text-sm font-medium text-[#ff9d9d] transition hover:bg-[#ff6b6b]/20">
                    <IcXSm /> {t({ en: 'Cancel navigation', zh: '取消导航' })}
                  </button>
                )}
                {isCancelled && (
                  <button type="button" onClick={() => setConfirmed(null)}
                    className="mt-3 flex h-11 w-full items-center justify-center rounded-[10px] bg-[#2b80ff] text-sm font-medium text-white transition hover:bg-[#2170e0]">
                    {t({ en: 'Start over', zh: '重新开始' })}
                  </button>
                )}
              </div>
            </div>

            {/* item 2 — completed */}
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-full border border-[#00c94f]/30 bg-[#00c94f]/20 text-[#05de73]"><IcCheckCircle /></span>
                <div>
                  <p className="text-lg font-semibold text-[#05de73]">{t({ en: 'Completed', zh: '已完成' })}</p>
                  <p className="text-sm text-[#99a1b0]">19:45:23</p>
                </div>
              </div>
              <div className="rounded-[14px] bg-black/40 p-4">
                <p className="flex items-center gap-2 text-xs text-[#99a1b0]"><IcMicSm /> {t({ en: 'You said:', zh: '您说的是：' })}</p>
                <p className="mt-2 text-sm text-[#d1d6db]">{t({ en: '"S-set the temp-temperature to tw-twenty degrees"', zh: '"把温-温度调-调到二-二十度"' })}</p>
              </div>
              <div className="rounded-[14px] p-4" style={{ backgroundImage: 'linear-gradient(90deg, rgba(43,128,255,0.1) 0%, rgba(0,184,219,0.1) 100%)' }}>
                <p className="flex items-center gap-2 text-xs font-medium"><IcSound /> {t({ en: 'Assistant:', zh: '智能助手回复：' })}</p>
                <p className="mt-2 text-sm">{t({ en: 'OK — cabin temperature set to 20°C.', zh: '好的，已将车内温度设置为20度。' })}</p>
              </div>
            </div>

            {/* item 3 — completed */}
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-full border border-[#00c94f]/30 bg-[#00c94f]/20 text-[#05de73]"><IcCheckCircle /></span>
                <div>
                  <p className="text-lg font-semibold text-[#05de73]">{t({ en: 'Completed', zh: '已完成' })}</p>
                  <p className="text-sm text-[#99a1b0]">19:43:15</p>
                </div>
              </div>
              <div className="rounded-[14px] bg-black/40 p-4">
                <p className="flex items-center gap-2 text-xs text-[#99a1b0]"><IcMicSm /> {t({ en: 'You said:', zh: '您说的是：' })}</p>
                <p className="mt-2 text-sm text-[#d1d6db]">{t({ en: '"T-turn on the amb-ambient lights"', zh: '"打-打开车-车内氛-氛围灯"' })}</p>
              </div>
              <div className="rounded-[14px] p-4" style={{ backgroundImage: 'linear-gradient(90deg, rgba(43,128,255,0.1) 0%, rgba(0,184,219,0.1) 100%)' }}>
                <p className="flex items-center gap-2 text-xs font-medium"><IcSound /> {t({ en: 'Assistant:', zh: '智能助手回复：' })}</p>
                <p className="mt-2 text-sm">{t({ en: 'OK — ambient lights are on.', zh: '好的，已为您打开车内氛围灯。' })}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
