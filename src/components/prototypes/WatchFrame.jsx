// Reusable smartwatch device frame — matched to the Figma watch (442:4783):
// 384×444 black body, radius 48, #1f2938 border, 64×32 strap stubs, page #0f1729.
// `children` render as the 320×380 (r40) watch screen content.
export default function WatchFrame({ children }) {
  return (
    <div className="flex h-full w-full items-center justify-center bg-[#0f1729] p-6">
      <div className="relative">
        {/* strap stubs */}
        <div className="absolute left-1/2 top-0 h-8 w-16 -translate-x-1/2 -translate-y-full rounded-t-[10px] bg-[#1f2938]" />
        <div className="absolute bottom-0 left-1/2 h-8 w-16 -translate-x-1/2 translate-y-full rounded-b-[10px] bg-[#1f2938]" />
        {/* watch body */}
        <div className="relative flex h-[444px] w-[384px] max-w-full items-center justify-center rounded-[48px] border border-[#1f2938] bg-black shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)]">
          <div className="h-[380px] w-[320px] overflow-hidden rounded-[40px]">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
