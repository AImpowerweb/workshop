// ─────────────────────────────────────────────────────────────────────────────
//  小美 (Xiaomei) — the AI companion's face, shared by every prototype she
//  appears in (Emotion Journal, Custom Emotion Tagging, …).
//
//  She used to be drawn twice, once per prototype, and the two copies had
//  drifted apart — one had dark hair, the other pink. Keep this the single
//  source of truth so they stay identical.
//
//  The artwork is authored at 28px and scaled from there, so any `size` keeps
//  the proportions of the original Figma vector.
// ─────────────────────────────────────────────────────────────────────────────
const ART = 28;

function Face() {
  const a = { position: 'absolute' };
  return (
    <div style={{ position: 'relative', width: ART, height: ART }}>
      <div style={{ ...a, left: 3, top: 1.5, width: 22, height: 17, borderRadius: '52% 52% 46% 46%', background: 'radial-gradient(11px 8px at 50% 40%, #3d2b23 0%, #160e0a 100%)' }} />
      <div style={{ ...a, left: 10.5, top: -1.5, width: 7, height: 6.5, borderRadius: '50%', background: '#241813' }} />
      <div style={{ ...a, left: 5, top: 6, width: 18, height: 17, borderRadius: '50%', background: 'radial-gradient(13px 13px at 52% 58%, #ffe8da 0%, #fbd8c9 50%, #ecc4b4 100%)' }} />
      <div style={{ ...a, left: 5, top: 4.5, width: 10, height: 5.5, borderRadius: '50%', background: '#211611', transform: 'rotate(-14deg)' }} />
      <div style={{ ...a, left: 13, top: 4.5, width: 10, height: 5.5, borderRadius: '50%', background: '#211611', transform: 'rotate(14deg)' }} />
      <div style={{ ...a, left: 4, top: 2.5, width: 20, height: 6, borderRadius: '50%', background: 'linear-gradient(90deg, #f09ead 0%, #ffd1db 50%, #f09ead 100%)' }} />
      <div style={{ ...a, left: 0.5, top: 9.5, width: 8, height: 9, borderRadius: '50%', background: 'radial-gradient(6px 7px at 46% 46%, #f7abb9 0%, #ef97a7 55%, #d0687b 100%)' }} />
      <div style={{ ...a, left: 19.5, top: 9.5, width: 8, height: 9, borderRadius: '50%', background: 'radial-gradient(6px 7px at 54% 46%, #f7abb9 0%, #ef97a7 55%, #d0687b 100%)' }} />
      <div style={{ ...a, left: 9.5, top: 11.5, width: 3.6, height: 4.2, borderRadius: '50%', background: '#2b1811' }} />
      <div style={{ ...a, left: 15, top: 11.5, width: 3.6, height: 4.2, borderRadius: '50%', background: '#2b1811' }} />
      <div style={{ ...a, left: 10.4, top: 12.2, width: 1.2, height: 1.2, borderRadius: '50%', background: '#fff' }} />
      <div style={{ ...a, left: 15.9, top: 12.2, width: 1.2, height: 1.2, borderRadius: '50%', background: '#fff' }} />
      <div style={{ ...a, left: 7.6, top: 15.6, width: 3, height: 2, borderRadius: '50%', background: 'rgba(243,128,143,0.55)' }} />
      <div style={{ ...a, left: 17.5, top: 15.6, width: 3, height: 2, borderRadius: '50%', background: 'rgba(243,128,143,0.55)' }} />
      <div style={{ ...a, left: 12.2, top: 17, width: 3.8, height: 2.4, borderRadius: '45% 45% 50% 50% / 30% 30% 100% 100%', background: '#7a4148' }} />
    </div>
  );
}

export default function MeiAvatar({ size = ART, className = '' }) {
  return (
    <span
      className={className}
      style={{
        display: 'inline-block',
        width: size,
        height: size,
        flexShrink: 0,
        borderRadius: '50%',
        overflow: 'hidden',
        backgroundColor: '#d4a5a0',
        verticalAlign: 'middle',
      }}
      aria-hidden="true"
    >
      <span style={{ display: 'block', width: ART, height: ART, transform: `scale(${size / ART})`, transformOrigin: 'top left' }}>
        <Face />
      </span>
    </span>
  );
}
