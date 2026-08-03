// Reusable mobile device frame — fixed iPhone-Pro proportions (screen 402×874,
// matching iPhone 16/17 Pro logical points). `children` fill the screen (h-full
// w-full) and scroll internally. The frame is a fixed-size block; ScaledPrototype
// (with `fit`) shows it at natural size on desktop and scales it down on mobile.
export default function PhoneFrame({ children }) {
  return (
    <div className="flex items-center justify-center p-4">
      {/* Titanium bezel */}
      <div
        className="relative shrink-0 rounded-[56px] bg-[#0b0b0f] p-[14px] shadow-2xl ring-1 ring-black/40"
        style={{ width: 430, height: 902 }}
      >
        <div className="relative h-full w-full overflow-hidden rounded-[44px] bg-black">
          {/* Dynamic Island */}
          <div className="pointer-events-none absolute left-1/2 top-[13px] z-30 h-[34px] w-[118px] -translate-x-1/2 rounded-full bg-black" />
          {children}
        </div>
      </div>
    </div>
  );
}
