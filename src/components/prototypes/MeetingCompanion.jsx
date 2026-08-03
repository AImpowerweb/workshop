import { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';

// ─────────────────────────────────────────────────────────────────────────────
//  AI 心伴 · AI 小助手  —  emotional-support meeting companion
//  Rebuilt faithfully from Figma "Speech AI_Design Ideas":
//    · Video Meeting UI - 小黃      (node 466:376)
//    · Video Meeting UI - Alt (小美)  (node 466:128)
//    · Settings Panel 小美 / 小黄     (nodes 514:128 / 514:181)
//  A cute plush companion (小黄 teal-hood / 小美 pink) sits in the corner of a
//  meeting and gives short encouraging feedback when you speak. Master toggle in
//  the top bar; 👍 sends encouragement; ⚙ opens the settings panel to switch
//  companion + feedback frequency; the whole companion re-themes to the pick.
//  All geometry / colors are transcribed from the .fig source.
// ─────────────────────────────────────────────────────────────────────────────

const B = (s) => <div style={s} />; // absolutely-positioned art primitive

/* ── icons (control bar, lucide-style) ─────────────────────────────────────── */
const S = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.67, strokeLinecap: 'round', strokeLinejoin: 'round' };
const IcMic = ({ off }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" {...S}><rect x="9" y="2" width="6" height="12" rx="3" /><path d="M5 10a7 7 0 0 0 14 0M12 19v3" />{off && <path d="M3 3l18 18" />}</svg>
);
const IcVideo = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" {...S}><path d="M2 6a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2z" /><path d="M15 10l6-4v12l-6-4" /><path d="M2 2l20 20" /></svg>
);
const IcScreen = () => <svg width="20" height="20" viewBox="0 0 24 24" {...S}><rect x="2" y="3" width="20" height="14" rx="2" /><path d="M8 21h8M12 17v4" /></svg>;
const IcUsers = () => <svg width="20" height="20" viewBox="0 0 24 24" {...S}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8" /></svg>;
const IcChatIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" {...S}><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>;
const IcSmile = () => <svg width="20" height="20" viewBox="0 0 24 24" {...S}><circle cx="12" cy="12" r="10" /><path d="M8 14s1.5 2 4 2 4-2 4-2M9 9h.01M15 9h.01" /></svg>;
const IcDots = () => <svg width="20" height="20" viewBox="0 0 24 24" {...S}><circle cx="12" cy="5" r="1" /><circle cx="12" cy="12" r="1" /><circle cx="12" cy="19" r="1" /></svg>;
const IcChevron = () => <svg width="14" height="14" viewBox="0 0 24 24" {...S} strokeWidth={1.5}><path d="M6 9l6 6 6-6" /></svg>;
const IcRobot = () => <svg width="15" height="15" viewBox="0 0 24 24" {...S} strokeWidth={1.6}><rect x="4" y="8" width="16" height="11" rx="3" /><path d="M12 4v4M12 4a1.4 1.4 0 1 0 0-2.8A1.4 1.4 0 0 0 12 4z" /><circle cx="9" cy="13" r="1" /><circle cx="15" cy="13" r="1" /><path d="M2 13v2M22 13v2" /></svg>;
const IcMicSmall = () => <svg width="11" height="11" viewBox="0 0 24 24" {...S}><rect x="9" y="2" width="6" height="12" rx="3" /><path d="M5 10a7 7 0 0 0 14 0M12 19v3" /></svg>;
const IcCamSmall = () => <svg width="11" height="11" viewBox="0 0 24 24" {...S}><path d="M2 6a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2z" /><path d="M15 10l6-4v12l-6-4" /><path d="M2 2l20 20" /></svg>;

/* ── mascots — exact vector art from the .fig ──────────────────────────────── */
function XiaoHuang() {
  const abs = { position: 'absolute' };
  return (
    <div style={{ position: 'relative', width: 170, height: 220 }}>
      {B({ ...abs, left: 8, top: 12, width: 155, height: 155, borderRadius: '50%', boxShadow: '0 0 22px 0 rgba(102,204,153,0.35)' })}
      {B({ ...abs, left: 28, top: 8, width: 115, height: 115, borderRadius: '50%', background: 'radial-gradient(88px 88px at 55% 65%, #fff7db 0%, #f5ebc7 50%, #e5dbb2 80%, #d1c79e 100%)', boxShadow: 'inset -2px -3px 8px 0 rgba(255,255,255,0.2), 0 3px 8px 0 rgba(0,0,0,0.12)' })}
      {B({ ...abs, left: 30, top: 10, width: 110, height: 110, borderRadius: '50%', boxShadow: 'inset 0 0 0 2px rgba(224,209,166,0.5)' })}
      {/* hoodie */}
      {B({ ...abs, left: 35, top: 120, width: 100, height: 60, borderRadius: '22px 22px 32px 32px', background: 'linear-gradient(180deg, #faf2d1 0%, #e5ebc7 40%, #a6e5d9 70%, #66d1c7 100%)', boxShadow: 'inset 0 -3px 8px 0 rgba(255,255,255,0.25), 0 4px 10px 0 rgba(0,0,0,0.15)' })}
      {B({ ...abs, left: 84.5, top: 125, width: 1.5, height: 48, background: 'rgba(140,199,189,0.35)' })}
      {B({ ...abs, left: 60, top: 150, width: 50, height: 18, borderRadius: '3px 3px 10px 10px', boxShadow: 'inset 0 0 0 1.2px rgba(128,199,184,0.4)' })}
      {B({ ...abs, left: 72, top: 112, width: 2, height: 22, borderRadius: 1, background: '#66ccc2' })}
      {B({ ...abs, left: 96, top: 112, width: 2, height: 22, borderRadius: 1, background: '#66ccc2' })}
      {B({ ...abs, left: 70.5, top: 133, width: 5, height: 5, borderRadius: '50%', background: '#59bfb2' })}
      {B({ ...abs, left: 94.5, top: 133, width: 5, height: 5, borderRadius: '50%', background: '#59bfb2' })}
      {/* hair */}
      {B({ ...abs, left: 44, top: 14, width: 82, height: 46, borderRadius: '50%', background: 'radial-gradient(58px 33px at 50% 57%, #80ebe0 0%, #66d9cc 50%, #47b8ad 100%)' })}
      {B({ ...abs, left: 62, top: 18, width: 30, height: 12, borderRadius: '50%', background: 'rgba(153,242,229,0.4)' })}
      {B({ ...abs, left: 48, top: 26, width: 20, height: 22, borderRadius: '50%', background: '#61d1c7' })}
      {B({ ...abs, left: 102, top: 26, width: 20, height: 22, borderRadius: '50%', background: '#61d1c7' })}
      {/* face */}
      {B({ ...abs, left: 41, top: 28, width: 88, height: 88, borderRadius: '50%', background: 'radial-gradient(68px 68px at 55% 65%, #ffe5db 0%, #fad6cc 50%, #f0c7bd 80%, #e0b8a8 100%)', boxShadow: 'inset -2px -3px 6px 0 rgba(255,255,255,0.15)' })}
      {/* eyes */}
      {B({ ...abs, left: 56, top: 54, width: 24, height: 26, borderRadius: '50%', background: '#fff', boxShadow: '0 1px 2px 0 rgba(0,0,0,0.06)' })}
      {B({ ...abs, left: 60, top: 58, width: 16, height: 18, borderRadius: '50%', background: 'radial-gradient(11px 13px at 50% 57%, #472e1f 0%, #2e1a14 60%, #140a05 100%)' })}
      {B({ ...abs, left: 62, top: 58, width: 7, height: 7, borderRadius: '50%', background: '#fff' })}
      {B({ ...abs, left: 69, top: 68, width: 3, height: 3, borderRadius: '50%', background: 'rgba(255,255,255,0.5)' })}
      {B({ ...abs, left: 90, top: 54, width: 24, height: 26, borderRadius: '50%', background: '#fff', boxShadow: '0 1px 2px 0 rgba(0,0,0,0.06)' })}
      {B({ ...abs, left: 94, top: 58, width: 16, height: 18, borderRadius: '50%', background: 'radial-gradient(11px 13px at 50% 57%, #472e1f 0%, #2e1a14 60%, #140a05 100%)' })}
      {B({ ...abs, left: 96, top: 58, width: 7, height: 7, borderRadius: '50%', background: '#fff' })}
      {B({ ...abs, left: 103, top: 68, width: 3, height: 3, borderRadius: '50%', background: 'rgba(255,255,255,0.5)' })}
      {/* cheeks + mouth */}
      {B({ ...abs, left: 44, top: 80, width: 18, height: 13, borderRadius: '50%', background: 'radial-gradient(9px 6.5px at 50% 50%, rgba(242,128,140,0.55) 0%, rgba(242,128,140,0) 100%)' })}
      {B({ ...abs, left: 108, top: 80, width: 18, height: 13, borderRadius: '50%', background: 'radial-gradient(9px 6.5px at 50% 50%, rgba(242,128,140,0.55) 0%, rgba(242,128,140,0) 100%)' })}
      {B({ ...abs, left: 77, top: 88, width: 16, height: 8, borderRadius: '50%', background: '#4d4047' })}
      {/* hands */}
      {B({ ...abs, left: 16, top: 155, width: 18, height: 18, borderRadius: '50%', background: 'radial-gradient(15px 15px at 50% 50%, #ffe0d1 0%, #ebc2b2 100%)' })}
      {B({ ...abs, left: 136, top: 155, width: 18, height: 18, borderRadius: '50%', background: 'radial-gradient(15px 15px at 50% 50%, #ffe0d1 0%, #ebc2b2 100%)' })}
    </div>
  );
}

function XiaoMei() {
  const abs = { position: 'absolute' };
  return (
    <div style={{ position: 'relative', width: 170, height: 220 }}>
      {/* purple glow + ring */}
      {B({ ...abs, left: 8, top: 12, width: 155, height: 155, borderRadius: '50%', boxShadow: '0 0 22px 4px rgba(178,102,229,0.30), 0 0 0 1.5px rgba(178,115,242,0.35)' })}

      {/* dark hair dome */}
      {B({ ...abs, left: 26, top: 12, width: 118, height: 92, borderRadius: '52% 52% 46% 46%', background: 'radial-gradient(66px 50px at 50% 40%, #3d2b23 0%, #201511 55%, #100a07 100%)', boxShadow: '0 3px 8px 0 rgba(0,0,0,0.25)' })}
      {/* top bun */}
      {B({ ...abs, left: 67, top: -8, width: 36, height: 34, borderRadius: '50%', background: 'radial-gradient(28px 27px at 50% 55%, #3d2b23 0%, #160e0a 100%)', boxShadow: '0 2px 4px 0 rgba(0,0,0,0.25)' })}

      {/* pink headphone band — arc clipped so the ends land in the ear cups */}
      <div style={{ position: 'absolute', left: 24, top: 8, width: 122, height: 82, overflow: 'hidden' }}>
        <div style={{ position: 'absolute', left: 2, top: 6, width: 118, height: 112, borderRadius: '50%', boxSizing: 'border-box', border: '10px solid #ee98a9' }} />
      </div>
      {B({ ...abs, left: 63, top: 9, width: 44, height: 10, borderRadius: '50%', background: 'linear-gradient(90deg, rgba(255,209,219,0) 0%, #ffd1db 50%, rgba(255,209,219,0) 100%)' })}

      {/* face — peach, never covered */}
      {B({ ...abs, left: 34, top: 30, width: 102, height: 100, borderRadius: '50%', background: 'radial-gradient(78px 78px at 52% 58%, #ffe8da 0%, #fbd8c9 45%, #f2cabb 82%, #e5b8a8 100%)', boxShadow: '0 3px 8px 0 rgba(0,0,0,0.12)' })}

      {/* parted bangs sweeping to each side */}
      {B({ ...abs, left: 34, top: 26, width: 52, height: 30, borderRadius: '50%', background: '#211611', transform: 'rotate(-14deg)', transformOrigin: 'center' })}
      {B({ ...abs, left: 84, top: 26, width: 52, height: 30, borderRadius: '50%', background: '#211611', transform: 'rotate(14deg)', transformOrigin: 'center' })}
      {B({ ...abs, left: 80, top: 30, width: 10, height: 20, borderRadius: '3px 3px 50% 50%', background: 'linear-gradient(180deg, #f7cfc0 0%, #fbd8c9 100%)' })}
      {/* side hair in front of the face edges */}
      {B({ ...abs, left: 30, top: 42, width: 14, height: 46, borderRadius: '45%', background: '#1c120e' })}
      {B({ ...abs, left: 126, top: 42, width: 14, height: 46, borderRadius: '45%', background: '#1c120e' })}

      {/* bold brows */}
      {B({ ...abs, left: 51, top: 52, width: 26, height: 5.5, borderRadius: 3, background: '#2e211b', transform: 'rotate(7deg)', transformOrigin: 'center' })}
      {B({ ...abs, left: 93, top: 52, width: 26, height: 5.5, borderRadius: 3, background: '#2e211b', transform: 'rotate(-7deg)', transformOrigin: 'center' })}

      {/* big sparkly eyes */}
      {B({ ...abs, left: 49, top: 60, width: 30, height: 34, borderRadius: '50%', background: '#fff', boxShadow: '0 1px 2px 0 rgba(0,0,0,0.08)' })}
      {B({ ...abs, left: 54, top: 65, width: 21, height: 24, borderRadius: '50%', background: 'radial-gradient(15px 17px at 50% 55%, #4a2c1e 0%, #140b06 100%)' })}
      {B({ ...abs, left: 64, top: 67, width: 9, height: 9, borderRadius: '50%', background: '#fff' })}
      {B({ ...abs, left: 57, top: 80, width: 4, height: 4, borderRadius: '50%', background: 'rgba(255,255,255,0.65)' })}
      {B({ ...abs, left: 91, top: 60, width: 30, height: 34, borderRadius: '50%', background: '#fff', boxShadow: '0 1px 2px 0 rgba(0,0,0,0.08)' })}
      {B({ ...abs, left: 96, top: 65, width: 21, height: 24, borderRadius: '50%', background: 'radial-gradient(15px 17px at 50% 55%, #4a2c1e 0%, #140b06 100%)' })}
      {B({ ...abs, left: 106, top: 67, width: 9, height: 9, borderRadius: '50%', background: '#fff' })}
      {B({ ...abs, left: 99, top: 80, width: 4, height: 4, borderRadius: '50%', background: 'rgba(255,255,255,0.65)' })}

      {/* blush */}
      {B({ ...abs, left: 46, top: 91, width: 20, height: 14, borderRadius: '50%', background: 'radial-gradient(10px 7px at 50% 50%, rgba(243,128,143,0.65) 0%, rgba(243,128,143,0) 100%)' })}
      {B({ ...abs, left: 104, top: 91, width: 20, height: 14, borderRadius: '50%', background: 'radial-gradient(10px 7px at 50% 50%, rgba(243,128,143,0.65) 0%, rgba(243,128,143,0) 100%)' })}

      {/* open smile */}
      {B({ ...abs, left: 72, top: 98, width: 26, height: 17, borderRadius: '45% 45% 50% 50% / 34% 34% 100% 100%', background: '#7a4148' })}
      {B({ ...abs, left: 78, top: 106, width: 14, height: 8, borderRadius: '50%', background: '#d78893' })}

      {/* headphone ear cups */}
      {B({ ...abs, left: 8, top: 64, width: 42, height: 46, borderRadius: '50%', background: 'radial-gradient(34px 38px at 46% 46%, #f7abb9 0%, #ef97a7 55%, #d0687b 100%)', boxShadow: '-2px 3px 7px 0 rgba(0,0,0,0.28)' })}
      {B({ ...abs, left: 15, top: 73, width: 28, height: 28, borderRadius: '50%', boxShadow: 'inset 0 0 0 4px rgba(255,203,214,0.8)' })}
      {B({ ...abs, left: 23, top: 81, width: 12, height: 12, borderRadius: '50%', background: '#f9bcc7', boxShadow: 'inset 0 0 0 2px rgba(176,86,102,0.45)' })}
      {B({ ...abs, left: 120, top: 64, width: 42, height: 46, borderRadius: '50%', background: 'radial-gradient(34px 38px at 54% 46%, #f7abb9 0%, #ef97a7 55%, #d0687b 100%)', boxShadow: '2px 3px 7px 0 rgba(0,0,0,0.28)' })}
      {B({ ...abs, left: 127, top: 73, width: 28, height: 28, borderRadius: '50%', boxShadow: 'inset 0 0 0 4px rgba(255,203,214,0.8)' })}
      {B({ ...abs, left: 135, top: 81, width: 12, height: 12, borderRadius: '50%', background: '#f9bcc7', boxShadow: 'inset 0 0 0 2px rgba(176,86,102,0.45)' })}

      {/* mic boom from the right cup */}
      {B({ ...abs, left: 0, top: 0, transform: 'matrix(0.94,0.34,-0.34,0.94,130,98)', transformOrigin: '0 0', width: 3.5, height: 26, borderRadius: 1.75, background: '#e0808c' })}
      {B({ ...abs, left: 116, top: 118, width: 9, height: 9, borderRadius: '50%', background: '#ef97a4', boxShadow: '0 1px 2px 0 rgba(0,0,0,0.25)' })}

      {/* neck + body */}
      {B({ ...abs, left: 74, top: 120, width: 22, height: 16, borderRadius: 4, background: '#f2d5c2' })}
      {B({ ...abs, left: 32, top: 132, width: 106, height: 76, borderRadius: '36px 36px 14px 14px', background: 'linear-gradient(180deg, #f0d6c6 0%, #e2bfae 100%)' })}
      {B({ ...abs, left: 58, top: 126, width: 54, height: 26, borderRadius: '50%', background: '#f7e3d2' })}
      {B({ ...abs, left: 72, top: 130, width: 26, height: 13, borderRadius: '50%', background: '#eccdb9' })}
      {B({ ...abs, left: 83, top: 148, width: 5, height: 5, borderRadius: '50%', background: '#c49a8b' })}
      {B({ ...abs, left: 83, top: 162, width: 5, height: 5, borderRadius: '50%', background: '#c49a8b' })}
      {B({ ...abs, left: 83, top: 176, width: 5, height: 5, borderRadius: '50%', background: '#c49a8b' })}
      {B({ ...abs, left: 32, top: 200, width: 106, height: 8, opacity: 0.5, borderRadius: '0 0 14px 14px', background: '#c9a191' })}
      {B({ ...abs, left: 18, top: 172, width: 26, height: 26, borderRadius: '50%', background: '#f6ddc9' })}
      {B({ ...abs, left: 126, top: 172, width: 26, height: 26, borderRadius: '50%', background: '#f6ddc9' })}
    </div>
  );
}

/* mini mascots for the settings switcher */
function MiniHuang() {
  const abs = { position: 'absolute' };
  return (
    <div style={{ position: 'relative', width: 88, height: 94 }}>
      {B({ ...abs, left: 23, top: 22, width: 42, height: 42, borderRadius: '50%', background: 'radial-gradient(26px 26px at 50% 50%, #faf2d1 0%, #e0d1a6 100%)' })}
      {B({ ...abs, left: 29, top: 26, width: 30, height: 16, borderRadius: '50%', background: '#66d9cc' })}
      {B({ ...abs, left: 28, top: 30, width: 32, height: 32, borderRadius: '50%', background: 'radial-gradient(23px 23px at 50% 57%, #ffe0d6 0%, #ebbfb2 100%)' })}
      {B({ ...abs, left: 35, top: 40, width: 7, height: 8, borderRadius: '50%', background: '#fff' })}
      {B({ ...abs, left: 37, top: 42, width: 4, height: 5, borderRadius: '50%', background: '#261a14' })}
      {B({ ...abs, left: 46, top: 40, width: 7, height: 8, borderRadius: '50%', background: '#fff' })}
      {B({ ...abs, left: 48, top: 42, width: 4, height: 5, borderRadius: '50%', background: '#261a14' })}
      {B({ ...abs, left: 32, top: 48, width: 6, height: 4, borderRadius: '50%', background: 'rgba(242,153,166,0.5)' })}
      {B({ ...abs, left: 50, top: 48, width: 6, height: 4, borderRadius: '50%', background: 'rgba(242,153,166,0.5)' })}
      {B({ ...abs, left: 40, top: 52, width: 8, height: 4, borderRadius: '50%', background: '#4d4047' })}
      {B({ ...abs, left: 26, top: 64, width: 36, height: 20, borderRadius: '8px 8px 14px 14px', background: 'linear-gradient(180deg, #f2ebcc 0%, #73d9d1 100%)' })}
    </div>
  );
}
function MiniMei() {
  const abs = { position: 'absolute' };
  return (
    <div style={{ position: 'relative', width: 88, height: 94 }}>
      {B({ ...abs, left: 24, top: 18, width: 40, height: 33, borderRadius: '52% 52% 46% 46%', background: 'radial-gradient(22px 17px at 50% 40%, #3d2b23 0%, #160e0a 100%)' })}
      {B({ ...abs, left: 38, top: 10, width: 13, height: 12, borderRadius: '50%', background: '#241813' })}
      <div style={{ position: 'absolute', left: 23, top: 16, width: 42, height: 28, overflow: 'hidden' }}>
        <div style={{ position: 'absolute', left: 1, top: 2, width: 40, height: 38, borderRadius: '50%', boxSizing: 'border-box', border: '4px solid #ee98a9' }} />
      </div>
      {B({ ...abs, left: 27, top: 24, width: 34, height: 33, borderRadius: '50%', background: 'radial-gradient(24px 24px at 52% 58%, #ffe8da 0%, #fbd8c9 50%, #ecc4b4 100%)' })}
      {B({ ...abs, left: 27, top: 22, width: 18, height: 11, borderRadius: '50%', background: '#211611', transform: 'rotate(-14deg)', transformOrigin: 'center' })}
      {B({ ...abs, left: 43, top: 22, width: 18, height: 11, borderRadius: '50%', background: '#211611', transform: 'rotate(14deg)', transformOrigin: 'center' })}
      {B({ ...abs, left: 42, top: 24, width: 4, height: 7, borderRadius: '2px 2px 50% 50%', background: '#fbd8c9' })}
      {B({ ...abs, left: 17, top: 32, width: 15, height: 16, borderRadius: '50%', background: 'radial-gradient(12px 13px at 46% 46%, #f7abb9 0%, #ef97a7 55%, #d0687b 100%)' })}
      {B({ ...abs, left: 21, top: 37, width: 7, height: 7, borderRadius: '50%', boxShadow: 'inset 0 0 0 1.5px rgba(255,203,214,0.8)' })}
      {B({ ...abs, left: 56, top: 32, width: 15, height: 16, borderRadius: '50%', background: 'radial-gradient(12px 13px at 54% 46%, #f7abb9 0%, #ef97a7 55%, #d0687b 100%)' })}
      {B({ ...abs, left: 60, top: 37, width: 7, height: 7, borderRadius: '50%', boxShadow: 'inset 0 0 0 1.5px rgba(255,203,214,0.8)' })}
      {B({ ...abs, left: 33, top: 31, width: 8, height: 2, borderRadius: 1, background: '#2e211b', transform: 'rotate(7deg)', transformOrigin: 'center' })}
      {B({ ...abs, left: 47, top: 31, width: 8, height: 2, borderRadius: 1, background: '#2e211b', transform: 'rotate(-7deg)', transformOrigin: 'center' })}
      {B({ ...abs, left: 33, top: 34, width: 10, height: 11, borderRadius: '50%', background: '#fff' })}
      {B({ ...abs, left: 35, top: 36, width: 7, height: 8, borderRadius: '50%', background: '#2b1811' })}
      {B({ ...abs, left: 38, top: 37, width: 3, height: 3, borderRadius: '50%', background: '#fff' })}
      {B({ ...abs, left: 45, top: 34, width: 10, height: 11, borderRadius: '50%', background: '#fff' })}
      {B({ ...abs, left: 47, top: 36, width: 7, height: 8, borderRadius: '50%', background: '#2b1811' })}
      {B({ ...abs, left: 50, top: 37, width: 3, height: 3, borderRadius: '50%', background: '#fff' })}
      {B({ ...abs, left: 30, top: 44, width: 6, height: 4, borderRadius: '50%', background: 'rgba(243,128,143,0.55)' })}
      {B({ ...abs, left: 52, top: 44, width: 6, height: 4, borderRadius: '50%', background: 'rgba(243,128,143,0.55)' })}
      {B({ ...abs, left: 39, top: 47, width: 10, height: 7, borderRadius: '45% 45% 50% 50% / 34% 34% 100% 100%', background: '#7a4148' })}
      {B({ ...abs, left: 41, top: 50, width: 6, height: 3.5, borderRadius: '50%', background: '#d78893' })}
      {B({ ...abs, left: 26, top: 60, width: 36, height: 22, borderRadius: '10px 10px 14px 14px', background: 'linear-gradient(180deg, #f0d6c6 0%, #e2bfae 100%)' })}
      {B({ ...abs, left: 35, top: 57, width: 18, height: 9, borderRadius: '50%', background: '#f7e3d2' })}
    </div>
  );
}

/* ── data ──────────────────────────────────────────────────────────────────── */
const PEOPLE = [
  { id: 'z', initial: '张', name: { en: 'Zhang Wei', zh: '张伟' }, role: { en: 'Product Manager', zh: '产品经理' }, color: 'rgb(140,89,217)' },
  { id: 'l', initial: '李', name: { en: 'Li Na', zh: '李娜' }, role: { en: 'UI Designer', zh: 'UI 设计师' }, color: 'rgb(217,89,140)' },
  { id: 'w', initial: '王', name: { en: 'Wang Lei', zh: '王磊' }, role: { en: 'Frontend Engineer', zh: '前端工程师' }, color: 'rgb(64,140,217)' },
  { id: 'c', initial: '陈', name: { en: 'Chen Jing', zh: '陈静' }, role: { en: 'Project Lead', zh: '项目负责人' }, color: 'rgb(217,115,51)', speaking: true },
];
const CHEERS = [
  { title: { zh: '你勇敢說出了自己的想法', en: 'You bravely spoke your mind' }, body: { zh: '你的想法很重要，谢谢分享！', en: 'Your idea matters — thank you for sharing!' }, e: '💫' },
  { title: { zh: '表达得很清楚', en: 'Clearly expressed' }, body: { zh: '刚才那段总结逻辑很顺，大家都跟上了。', en: 'That summary flowed well — everyone followed.' }, e: '✨' },
  { title: { zh: '节奏刚刚好', en: 'A nice, steady pace' }, body: { zh: '你给了自己思考的时间，这很好。', en: 'You gave yourself time to think — that’s good.' }, e: '🌿' },
  { title: { zh: '很好的提问', en: 'Great question' }, body: { zh: '这个问题帮团队理清了方向。', en: 'That question helped the team refocus.' }, e: '💡' },
  { title: { zh: '稳稳地说完了', en: 'You finished strong' }, body: { zh: '完整表达了观点，没有被打断。', en: 'A complete point, uninterrupted.' }, e: '🎯' },
];
const CHAT = [
  { who: { zh: '张伟', en: 'Zhang Wei' }, color: 'rgb(140,89,217)', text: { zh: '大家好，今天评审第三季度的路线图。', en: 'Hi all — reviewing the Q3 roadmap today.' } },
  { who: { zh: '李娜', en: 'Li Na' }, color: 'rgb(217,89,140)', text: { zh: '新的界面稿我放到共享文件里了 👍', en: 'New UI drafts are in the shared folder 👍' } },
  { who: { zh: '陈静', en: 'Chen Jing' }, color: 'rgb(217,115,51)', text: { zh: '我先说下这一版的取舍，稍等…', en: 'Let me walk through the trade-offs, one sec…' } },
];

const THEME = {
  xiaohuang: {
    name: { zh: 'AI 小黄', en: 'AI Xiaohuang' },
    cardBar: 'linear-gradient(90deg, #66d9bf 0%, #8ccc80 50%, #e5d966 100%)',
    pill: 'linear-gradient(90deg, #5cc9b0 0%, #7ec96a 100%)',
    header: 'linear-gradient(90deg, #2e8c78 0%, #4da680 100%)',
    save: 'linear-gradient(90deg, #2e8c78 0%, #4da680 100%)',
    accent: 'rgb(59,179,154)',
    ring: 'rgba(102,209,150,0.9)',
    glow: 'rgba(102,204,153,0.4)',
    card: 'rgb(38,33,64)',
  },
  xiaomei: {
    name: { zh: 'AI 小美', en: 'AI Xiaomei' },
    cardBar: 'linear-gradient(90deg, #e58099 0%, #b266d9 50%, #6680e5 100%)',
    pill: 'linear-gradient(90deg, #e58099 0%, #b266d9 50%, #6680e5 100%)',
    header: 'linear-gradient(90deg, #8040b2 0%, #4d4da6 100%)',
    save: 'linear-gradient(90deg, #7340bf 0%, #4d4db2 100%)',
    accent: 'rgb(178,115,242)',
    ring: 'rgb(178,115,242)',
    glow: 'rgba(153,77,229,0.4)',
    card: 'rgb(51,38,89)',
  },
};

/* ── control-bar button ────────────────────────────────────────────────────── */
function CtrlBtn({ icon, label, onClick, active }) {
  return (
    <button type="button" onClick={onClick}
      className="flex w-[70px] flex-col items-center gap-1 rounded-[10px] py-3 text-xs font-medium transition hover:bg-white/10"
      style={{ color: active ? '#fff' : 'rgba(255,255,255,0.88)' }}>
      {icon}
      <span>{label}</span>
    </button>
  );
}

export default function MeetingCompanion() {
  const { t } = useLanguage();
  const [companionOn, setCompanionOn] = useState(true);
  const [persona, setPersona] = useState('xiaomei');
  const [tab, setTab] = useState('people');
  const [muted, setMuted] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [freq, setFreq] = useState('interval'); // interval | perSpeech | onStart
  const [minutes, setMinutes] = useState(5);
  const [idx, setIdx] = useState(0);
  const [cardOpen, setCardOpen] = useState(true);
  const [floats, setFloats] = useState([]);
  const [autoReact, setAutoReact] = useState({ id: 1, emoji: '👍' });
  const [cheers, setCheers] = useState(1);
  const [secs, setSecs] = useState(23 * 60 + 14);

  // draft state inside the settings panel (applied on 保存设置)
  const [draftPersona, setDraftPersona] = useState('xiaohuang');
  const [draftFreq, setDraftFreq] = useState('interval');
  const [draftMin, setDraftMin] = useState(5);

  const th = THEME[persona];
  const speaker = PEOPLE.find((p) => p.speaking);

  useEffect(() => {
    const id = setInterval(() => setSecs((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, []);
  const clock = [Math.floor(secs / 3600), Math.floor((secs % 3600) / 60), secs % 60]
    .map((n) => String(n).padStart(2, '0')).join(':');

  // auto-cheer loop (demo cadence)
  useEffect(() => {
    if (!companionOn || freq === 'onStart') return undefined;
    const id = setInterval(() => {
      setIdx((i) => (i + 1) % CHEERS.length);
      setCardOpen(true);
    }, freq === 'perSpeech' ? 4200 : 6500);
    return () => clearInterval(id);
  }, [companionOn, freq]);

  // looping companion reaction: 👍 shows ~10s, then ❤️ ~10s, repeating
  useEffect(() => {
    if (!companionOn) return undefined;
    const seq = ['👍', '❤️'];
    setAutoReact({ id: 1, emoji: seq[0] });
    const id = setInterval(() => {
      setAutoReact((r) => ({ id: r.id + 1, emoji: seq[r.id % seq.length] }));
    }, 10000);
    return () => clearInterval(id);
  }, [companionOn]);

  const sendCheer = () => {
    const fid = Date.now() + Math.random();
    setFloats((f) => [...f, fid]);
    setTimeout(() => setFloats((f) => f.filter((x) => x !== fid)), 1500);
    setIdx((i) => (i + 1) % CHEERS.length);
    setCardOpen(true);
    setCheers((c) => c + 1);
  };

  const openSettings = () => {
    setDraftPersona(persona); setDraftFreq(freq); setDraftMin(minutes);
    setSettingsOpen(true);
  };
  const saveSettings = () => {
    setPersona(draftPersona); setFreq(draftFreq); setMinutes(draftMin);
    setSettingsOpen(false);
  };

  const c = CHEERS[idx];
  const dth = THEME[draftPersona];

  return (
    <div className="relative flex h-full w-full flex-col overflow-hidden text-white"
      style={{ background: 'rgb(20,23,36)', fontFamily: 'Inter, system-ui, sans-serif' }}>
      <style>{`
        @keyframes mcFloat { 0%{opacity:0;transform:translateY(4px) scale(.5)} 18%{opacity:1} 100%{opacity:0;transform:translateY(-92px) scale(1.15)} }
        @keyframes mcReact { 0%{opacity:0;transform:translateY(16px) scale(.4)} 6%{opacity:1;transform:translateY(0) scale(1.15)} 12%{transform:translateY(0) scale(1)} 55%{transform:translateY(-9px) scale(1.04)} 90%{opacity:1;transform:translateY(-5px) scale(1)} 100%{opacity:0;transform:translateY(-30px) scale(.72)} }
        @keyframes mcPop { from{opacity:0;transform:translateY(8px) scale(.97)} to{opacity:1;transform:none} }
        @keyframes mcBob { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-5px)} }
      `}</style>

      {/* ── top bar ─────────────────────────────────────────────── */}
      <header className="relative flex h-12 shrink-0 items-center gap-3.5 px-5" style={{ background: 'rgba(26,28,46,0.9)' }}>
        <h1 className="text-sm font-bold" style={{ color: 'rgb(242,242,247)' }}>{t({ zh: '产品季度评审会议', en: 'Q3 Product Review' })}</h1>
        <span className="rounded-[13px] px-3 py-1 text-[10px]" style={{ background: 'rgba(38,102,77,0.6)', color: 'rgb(128,229,178)' }}>
          {t({ zh: '会议号：893-271-456', en: 'ID: 893-271-456' })}
        </span>
        {/* AI 心伴 master toggle */}
        <button type="button" onClick={() => setCompanionOn((v) => !v)}
          className="flex items-center gap-2 rounded-[15px] py-1.5 pl-3 pr-1.5 transition"
          style={{ background: 'rgb(26,26,56)', boxShadow: 'inset 0 0 0 1px rgb(80,80,160)' }}>
          <span style={{ color: '#fff' }}><IcRobot /></span>
          <span className="text-xs font-medium" style={{ color: 'rgb(204,204,238)' }}>{t({ zh: 'AI心伴', en: 'AI Companion' })}</span>
          <span className="mx-0.5 h-4 w-px" style={{ background: 'rgb(58,58,96)' }} />
          <span className="relative flex h-5 w-[46px] items-center rounded-full" style={{ background: companionOn ? 'rgb(123,97,255)' : 'rgba(255,255,255,0.15)' }}>
            <span className="absolute text-[10px] font-bold" style={{ left: companionOn ? 7 : 21, color: '#fff' }}>{t(companionOn ? { zh: '开启', en: 'On' } : { zh: '关闭', en: 'Off' })}</span>
            <span className="absolute h-4 w-4 rounded-full bg-white transition-all" style={{ left: companionOn ? 28 : 2 }} />
          </span>
        </button>
        <div className="ml-auto flex items-center gap-4 text-[11px]" style={{ color: 'rgb(153,153,166)' }}>
          <span className="tabular-nums">{clock}</span>
          <span>🔒 {t({ zh: '加密连接', en: 'Encrypted' })}</span>
        </div>
      </header>

      {/* ── body ────────────────────────────────────────────────── */}
      <div className="relative flex min-h-0 flex-1">
        {/* video grid */}
        <main className="grid min-h-0 flex-1 grid-cols-2 grid-rows-2 gap-3 p-3">
          {PEOPLE.map((p) => (
            <div key={p.id} className="relative flex flex-col items-center justify-center overflow-hidden rounded-xl" style={{ background: 'rgb(26,31,46)' }}>
              <div className="flex items-center justify-center rounded-full font-semibold text-white"
                style={{ width: 80, height: 80, fontSize: 30, background: p.color }}>{p.initial}</div>
              <p className="mt-4 text-[15px] font-bold text-white">{t(p.name)}</p>
              <p className="mt-1 text-[13px]" style={{ color: 'rgb(128,128,140)' }}>{t(p.role)}</p>
              <span className="mt-3 flex items-center gap-1 rounded-xl px-3 py-1 text-[9px]" style={{ background: 'rgba(38,41,56,0.8)', color: 'rgb(140,140,153)' }}>
                <IcCamSmall /> {t({ zh: '摄像头已关闭', en: 'Camera off' })}
              </span>
              <span className="absolute bottom-2.5 left-2.5 flex items-center gap-1 rounded px-2 py-1 text-[10px]" style={{ background: 'rgba(0,0,0,0.4)', color: 'rgb(217,217,224)' }}><IcMicSmall /> {t(p.name)}</span>
            </div>
          ))}
        </main>

        {/* sidebar */}
        <aside className="flex w-[287px] shrink-0 flex-col" style={{ background: 'rgba(23,26,41,0.95)' }}>
          <div className="flex items-center gap-6 px-5 pt-3.5" style={{ borderBottom: '1px solid rgb(51,51,71)' }}>
            {[['people', { zh: '参会者 (4)', en: 'People (4)' }], ['chat', { zh: '聊天', en: 'Chat' }]].map(([k, label]) => (
              <button key={k} type="button" onClick={() => setTab(k)} className="relative pb-2.5 text-[13px] font-semibold transition"
                style={{ color: tab === k ? 'rgb(115,178,255)' : 'rgb(128,128,140)' }}>
                {t(label)}
                {tab === k && <span className="absolute inset-x-0 -bottom-px h-0.5 rounded-full" style={{ background: 'rgb(115,178,255)' }} />}
              </button>
            ))}
          </div>
          {tab === 'people' ? (
            <div className="flex flex-col gap-1 p-3">
              {PEOPLE.map((p) => (
                <div key={p.id} className="flex items-center gap-3 rounded-lg px-2 py-2 hover:bg-white/[0.03]">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-semibold text-white" style={{ background: p.color }}>{p.initial}</div>
                  <div className="min-w-0">
                    <p className="text-[13px] font-medium">{t(p.name)}</p>
                    {p.speaking ? (
                      <p className="flex items-center gap-1.5 text-[11px]" style={{ color: 'rgb(102,209,150)' }}>
                        <span className="relative flex h-1.5 w-1.5"><span className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-75" style={{ background: 'rgb(102,209,150)' }} /><span className="relative inline-flex h-1.5 w-1.5 rounded-full" style={{ background: 'rgb(102,209,150)' }} /></span>
                        {t({ zh: '发言中…', en: 'Speaking…' })}
                      </p>
                    ) : <p className="text-[11px]" style={{ color: 'rgb(128,128,140)' }}>{t({ zh: '在线', en: 'Online' })}</p>}
                  </div>
                  <span className="ml-auto" style={{ color: 'rgba(255,255,255,0.3)' }}>{p.speaking ? <IcMic /> : <IcMic off />}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col gap-3.5 p-4">
              {CHAT.map((m, i) => (
                <div key={i} className="flex gap-2.5">
                  <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold text-white" style={{ background: m.color }}>{t(m.who).slice(0, 1)}</div>
                  <div className="min-w-0">
                    <p className="text-[11px]" style={{ color: 'rgb(128,128,140)' }}>{t(m.who)}</p>
                    <p className="mt-0.5 text-[13px] leading-relaxed" style={{ color: 'rgba(255,255,255,0.85)' }}>{t(m.text)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </aside>

        {/* ── companion overlay ─────────────────────────────────── */}
        {companionOn ? (
          <div className="absolute z-20" style={{ right: 6, bottom: 0, width: 300, height: 432 }}>
            {/* feedback card */}
            {cardOpen && (
              <div key={`cheer-${idx}`} role="button" tabIndex={0} onClick={() => setCardOpen(false)}
                title={t({ zh: '点击关闭', en: 'Click to dismiss' })} aria-label={t({ zh: '关闭反馈', en: 'Dismiss feedback' })}
                className="absolute overflow-hidden" style={{ left: 22, top: 46, width: 255, height: 80, borderRadius: 16, background: 'rgba(255,255,255,0.92)', boxShadow: '0 4px 16px 0 rgba(0,0,0,0.2)', animation: 'mcPop .32s ease-out', cursor: 'pointer' }}>
                <div style={{ position: 'absolute', left: 0, top: 0, width: 255, height: 4, borderRadius: '16px 16px 0 0', background: th.cardBar }} />
                <p style={{ position: 'absolute', left: 14, top: 15, fontSize: 13, fontWeight: 700, color: 'rgb(31,31,38)' }}>{t(c.title)} {c.e}</p>
                <p style={{ position: 'absolute', left: 14, top: 42, fontSize: 11, color: 'rgb(102,102,115)' }}>{t(c.body)}</p>
                <span aria-hidden="true"
                  className="absolute flex items-center justify-center rounded-full text-[11px]" style={{ left: 225, top: 8, width: 24, height: 24, background: 'rgba(140,140,153,0.32)', color: 'rgba(255,255,255,0.9)' }}>✕</span>
              </div>
            )}
            {/* speech tail */}
            <div style={{ position: 'absolute', left: 120, top: 124, width: 0, height: 0, borderLeft: '7px solid transparent', borderRight: '7px solid transparent', borderTop: '9px solid rgba(255,255,255,0.92)' }} />

            {/* avatar */}
            <div className="absolute" style={{ left: 64, top: 150, width: 170, height: 220, animation: 'mcBob 4.5s ease-in-out infinite' }}>
              {persona === 'xiaohuang' ? <XiaoHuang /> : <XiaoMei />}
            </div>

            {/* floating reactions */}
            {floats.map((f) => (<span key={f} className="pointer-events-none absolute" style={{ left: 24, top: 300, fontSize: 30, animation: 'mcFloat 1.5s ease-out forwards' }}>👍</span>))}

            {/* looping auto reaction: 👍 ⇄ ❤️, ~10s each */}
            <span key={`react-${autoReact.id}`} className="pointer-events-none absolute" style={{ left: 20, top: 172, fontSize: 38, filter: 'drop-shadow(0 3px 6px rgba(0,0,0,0.4))', animation: 'mcReact 10s ease-in-out forwards' }}>{autoReact.emoji}</span>

            {/* control pill row */}
            <div className="absolute flex items-center gap-2" style={{ left: 74, top: 388 }}>
              <span className="flex items-center justify-center px-3 text-[10px] font-semibold text-white" style={{ height: 26, borderRadius: 13, background: th.pill, boxShadow: '0 2px 6px 0 rgba(102,51,153,0.3)' }}>✦ {t(th.name)}</span>
              <button type="button" onClick={() => (settingsOpen ? setSettingsOpen(false) : openSettings())} aria-label={t({ zh: '设置', en: 'Settings' })}
                className="flex items-center justify-center transition hover:brightness-110" style={{ width: 28, height: 28, borderRadius: 14, background: settingsOpen ? 'rgba(178,115,242,0.5)' : 'rgba(90,74,140,0.6)', color: '#fff', fontSize: 18, lineHeight: 1 }}>⚙</button>
              <button type="button" onClick={() => { setCompanionOn(false); setSettingsOpen(false); }} aria-label={t({ zh: '关闭 AI心伴', en: 'Close' })}
                className="flex items-center justify-center text-xs transition hover:brightness-110" style={{ width: 26, height: 26, borderRadius: 13, background: 'rgba(178,54,54,0.7)', color: '#fff' }}>✕</button>
            </div>

            {/* ── settings panel ── */}
            {settingsOpen && (
              <div className="absolute overflow-hidden" style={{ right: 4, bottom: 46, width: 220, height: 332, borderRadius: 16, background: 'rgba(26,20,46,0.96)', boxShadow: '0 6px 24px 0 rgba(0,0,0,0.5)', animation: 'mcPop .2s ease-out' }}>
                <div style={{ position: 'absolute', left: 0, top: 0, width: 220, height: 42, borderRadius: '16px 16px 0 0', background: dth.header }} />
                <span style={{ position: 'absolute', left: 14, top: 13, fontSize: 13, fontWeight: 700, color: '#fff' }}>⚙ {t({ zh: 'AI 小助手设置', en: 'AI Companion Settings' })}</span>
                <button type="button" onClick={() => setSettingsOpen(false)} className="absolute flex items-center justify-center text-xs" style={{ left: 188, top: 9, width: 24, height: 24, borderRadius: 12, background: 'rgba(255,255,255,0.2)', color: '#fff' }}>✕</button>

                <span style={{ position: 'absolute', left: 14, top: 54, fontSize: 11, fontWeight: 500, color: 'rgb(153,148,178)' }}>{t({ zh: '切换小助手', en: 'Switch companion' })}</span>
                {/* switch cards */}
                {[['xiaohuang', MiniHuang, { zh: '小黄', en: 'Xiaohuang' }, 'rgb(38,33,64)'], ['xiaomei', MiniMei, { zh: '小美', en: 'Xiaomei' }, 'rgb(51,38,89)']].map(([key, Mini, label, bg], i) => {
                  const sel = draftPersona === key;
                  return (
                    <button key={key} type="button" onClick={() => setDraftPersona(key)} className="absolute overflow-hidden text-center"
                      style={{ left: i === 0 ? 14 : 108, top: 74, width: 88, height: 94, borderRadius: 14, background: bg, boxShadow: sel ? `inset 0 0 0 2.5px ${THEME[key].ring}, 0 0 10px 0 ${THEME[key].glow}` : 'inset 0 0 0 1.5px rgba(153,102,229,0.3)' }}>
                      <span style={{ position: 'absolute', left: 0, top: 6, width: 88, zIndex: 2, fontSize: 10, fontWeight: 600, textShadow: '0 1px 2px rgba(0,0,0,0.5)', color: sel ? (key === 'xiaomei' ? 'rgb(217,191,255)' : '#c7f0e4') : 'rgb(191,184,217)' }}>{t(label)}</span>
                      <div style={{ position: 'absolute', left: 0, top: 16 }}>{<Mini />}</div>
                      {sel && <span className="absolute flex items-center justify-center text-[10px] font-bold text-white" style={{ left: 68, top: 6, width: 16, height: 16, borderRadius: 8, background: THEME[key].accent }}>✓</span>}
                    </button>
                  );
                })}

                <div style={{ position: 'absolute', left: 14, top: 180, width: 192, height: 1, background: 'rgb(64,56,89)' }} />
                <span style={{ position: 'absolute', left: 14, top: 190, fontSize: 11, fontWeight: 500, color: 'rgba(255,255,255,0.7)' }}>{t({ zh: '反馈频率', en: 'Feedback frequency' })}</span>

                {/* interval option */}
                <button type="button" onClick={() => setDraftFreq('interval')} className="absolute flex items-center" style={{ left: 14, top: 208, height: 18 }}>
                  <span className="flex items-center justify-center text-[10px] font-semibold text-white" style={{ width: 14, height: 14, borderRadius: 3, background: draftFreq === 'interval' ? dth.accent : 'rgba(255,255,255,0.05)', boxShadow: draftFreq === 'interval' ? 'none' : 'inset 0 0 0 1px rgba(255,255,255,0.3)' }}>{draftFreq === 'interval' ? '✓' : ''}</span>
                  <span style={{ marginLeft: 6, fontSize: 11, color: 'rgba(255,255,255,0.85)' }}>{t({ zh: '每隔', en: 'Every' })}</span>
                </button>
                <input type="number" min="1" max="60" value={draftMin} onChange={(e) => { setDraftFreq('interval'); setDraftMin(Math.max(1, Math.min(60, +e.target.value || 1))); }}
                  className="absolute text-center text-[11px] font-medium text-white outline-none"
                  style={{ left: 60, top: 209, width: 26, height: 16, borderRadius: 3, background: 'rgba(255,255,255,0.1)', boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.25)' }} />
                <span style={{ position: 'absolute', left: 90, top: 211, fontSize: 11, color: 'rgba(255,255,255,0.85)' }}>{t({ zh: '分钟给反馈', en: 'min give feedback' })}</span>

                {[['perSpeech', 232, { zh: '每次发言都给反馈', en: 'After every time I speak' }], ['onStart', 254, { zh: '会议开始时给反馈', en: 'At the meeting start' }]].map(([key, top, label]) => (
                  <button key={key} type="button" onClick={() => setDraftFreq(key)} className="absolute flex items-center" style={{ left: 14, top, height: 18 }}>
                    <span className="flex items-center justify-center text-[10px] font-semibold text-white" style={{ width: 14, height: 14, borderRadius: 3, background: draftFreq === key ? dth.accent : 'rgba(255,255,255,0.05)', boxShadow: draftFreq === key ? 'none' : 'inset 0 0 0 1px rgba(255,255,255,0.3)' }}>{draftFreq === key ? '✓' : ''}</span>
                    <span style={{ marginLeft: 6, fontSize: 11, color: 'rgba(255,255,255,0.85)' }}>{t(label)}</span>
                  </button>
                ))}

                <button type="button" onClick={saveSettings} className="absolute flex items-center justify-center text-xs font-semibold text-white transition hover:brightness-110"
                  style={{ left: 12, top: 284, width: 196, height: 32, borderRadius: 16, background: dth.save }}>{t({ zh: '保存设置', en: 'Save settings' })}</button>
              </div>
            )}
          </div>
        ) : (
          <button type="button" onClick={() => setCompanionOn(true)}
            className="absolute z-20 flex items-center gap-2 rounded-full px-4 py-2.5 text-xs font-medium backdrop-blur transition"
            style={{ right: 16, bottom: 20, color: 'rgb(204,204,238)', background: 'rgba(123,97,255,0.12)', boxShadow: 'inset 0 0 0 1px rgba(123,97,255,0.4)' }}>
            <IcRobot /> {t({ zh: 'AI心伴已关闭 · 点击开启', en: 'AI Companion off · tap to enable' })}
          </button>
        )}
      </div>

      {/* ── control bar ─────────────────────────────────────────── */}
      <div className="flex h-[98px] shrink-0 items-center justify-between px-6" style={{ background: 'rgb(12,20,34)', borderTop: '1px solid rgb(30,41,57)' }}>
        <div className="flex items-center gap-1">
          <div className="flex items-center">
            <CtrlBtn icon={muted ? <span style={{ color: 'rgb(250,43,54)' }}><IcMic off /></span> : <IcMic />} label={t(muted ? { zh: '解除静音', en: 'Unmute' } : { zh: '静音', en: 'Mute' })} onClick={() => setMuted((m) => !m)} />
            <button type="button" className="flex h-8 w-5 items-center justify-center text-white/70"><IcChevron /></button>
          </div>
          <div className="flex items-center">
            <CtrlBtn icon={<IcVideo />} label={t({ zh: '停止视频', en: 'Stop video' })} />
            <button type="button" className="flex h-8 w-5 items-center justify-center text-white/70"><IcChevron /></button>
          </div>
          <CtrlBtn icon={<IcScreen />} label={t({ zh: '共享屏幕', en: 'Share' })} />
        </div>
        <div className="flex items-center gap-1">
          <CtrlBtn icon={<IcUsers />} label={t({ zh: '参与者', en: 'Participants' })} onClick={() => setTab('people')} active={tab === 'people'} />
          <CtrlBtn icon={<IcChatIcon />} label={t({ zh: '聊天', en: 'Chat' })} onClick={() => setTab('chat')} active={tab === 'chat'} />
          <CtrlBtn icon={<IcSmile />} label={t({ zh: '反应', en: 'Reactions' })} onClick={sendCheer} />
          <CtrlBtn icon={<IcDots />} label={t({ zh: '更多', en: 'More' })} />
        </div>
        <button type="button" className="flex items-center justify-center rounded-[20px] px-7 text-[13px] font-semibold text-white transition hover:brightness-110" style={{ height: 36, background: 'rgb(198,40,40)' }}>
          {t({ zh: '离开会议', en: 'Leave' })}
        </button>
      </div>
    </div>
  );
}
