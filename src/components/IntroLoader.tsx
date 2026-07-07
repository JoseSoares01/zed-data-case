import { useEffect, useState } from "react";

export function IntroLoader({ onComplete }: { onComplete: () => void }) {
  const [count, setCount] = useState(0);
  const [opening, setOpening] = useState(false);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    if (count >= 100) {
      const t1 = setTimeout(() => setOpening(true), 250);
      const t2 = setTimeout(() => {
        setHidden(true);
        onComplete();
      }, 1550);
      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
      };
    }
    const step = setTimeout(() => setCount((c) => Math.min(100, c + 1)), 22);
    return () => clearTimeout(step);
  }, [count, onComplete]);

  if (hidden) return null;

  return (
    <div className="fixed inset-0 z-[100] pointer-events-none">
      {/* Left curtain */}
      <div
        className="absolute top-0 left-0 h-full w-1/2 bg-[#0d0d0d] flex items-center justify-end pr-[2px] transition-transform duration-[1200ms] ease-[cubic-bezier(0.77,0,0.175,1)]"
        style={{ transform: opening ? "translateX(-100%)" : "translateX(0)" }}
      >
        <div className="flex items-center">
          <span className="font-display text-white text-[18vw] md:text-[12rem] leading-none font-bold tabular-nums tracking-tight">
            {String(count).padStart(1, "0").slice(0, Math.ceil(String(count).length / 2)) || "0"}
          </span>
        </div>
      </div>
      {/* Right curtain */}
      <div
        className="absolute top-0 right-0 h-full w-1/2 bg-[#0d0d0d] flex items-center justify-start pl-[2px] transition-transform duration-[1200ms] ease-[cubic-bezier(0.77,0,0.175,1)]"
        style={{ transform: opening ? "translateX(100%)" : "translateX(0)" }}
      >
        <div className="flex items-center">
          <span className="font-display text-white text-[18vw] md:text-[12rem] leading-none font-bold tabular-nums tracking-tight">
            {String(count).slice(Math.ceil(String(count).length / 2)) || ""}
          </span>
        </div>
      </div>
      {/* Underline accent centered */}
      <div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 mt-24 md:mt-32 h-px bg-[#c9a96a] transition-all duration-[800ms] ease-out"
        style={{
          width: opening ? "0px" : `${Math.min(count * 3.6, 360)}px`,
          opacity: opening ? 0 : 1,
        }}
      />
    </div>
  );
}
