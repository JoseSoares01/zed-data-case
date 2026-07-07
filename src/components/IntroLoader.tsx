import { useEffect, useState } from "react";

export function IntroLoader({ onComplete }: { onComplete: () => void }) {
  const [count, setCount] = useState(0);
  const [opening, setOpening] = useState(false);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    if (count >= 100) {
      const t1 = setTimeout(() => setOpening(true), 350);
      const t2 = setTimeout(() => {
        setHidden(true);
        onComplete();
      }, 1700);
      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
      };
    }
    const step = setTimeout(() => setCount((c) => Math.min(100, c + 1)), 22);
    return () => clearTimeout(step);
  }, [count, onComplete]);

  if (hidden) return null;

  const Inner = () => (
    <div className="absolute inset-0 flex flex-col items-center justify-center">
      <span className="font-display text-white text-[22vw] md:text-[13rem] leading-none font-bold tabular-nums tracking-tight select-none">
        {count}
      </span>
      <div
        className="mt-6 h-px bg-[#c9a96a] transition-all duration-300 ease-out"
        style={{ width: `${Math.min(count * 3.2, 320)}px` }}
      />
    </div>
  );

  return (
    <div className="fixed inset-0 z-[100] overflow-hidden pointer-events-none">
      {/* Left curtain */}
      <div
        className="absolute top-0 left-0 h-full w-1/2 bg-[#0d0d0d] overflow-hidden transition-transform duration-[1300ms] ease-[cubic-bezier(0.77,0,0.175,1)]"
        style={{ transform: opening ? "translateX(-100%)" : "translateX(0)" }}
      >
        <div className="absolute inset-y-0 left-0 w-[200vw]">
          <Inner />
        </div>
      </div>
      {/* Right curtain */}
      <div
        className="absolute top-0 right-0 h-full w-1/2 bg-[#0d0d0d] overflow-hidden transition-transform duration-[1300ms] ease-[cubic-bezier(0.77,0,0.175,1)]"
        style={{ transform: opening ? "translateX(100%)" : "translateX(0)" }}
      >
        <div className="absolute inset-y-0 right-0 w-[200vw]">
          <Inner />
        </div>
      </div>
    </div>
  );
}
