import { useEffect, useRef, useState } from "react";

export function IntroLoader({ onComplete }: { onComplete: () => void }) {
  const [count, setCount] = useState(0);
  const [opening, setOpening] = useState(false);
  const [hidden, setHidden] = useState(false);
  const doneRef = useRef(false);

  // Count up 0 -> 100
  useEffect(() => {
    if (count >= 100) return;
    const step = setTimeout(() => setCount((c) => Math.min(100, c + 1)), 22);
    return () => clearTimeout(step);
  }, [count]);

  // Once we hit 100, start opening and finish
  useEffect(() => {
    if (count < 100 || doneRef.current) return;
    doneRef.current = true;
    const t1 = setTimeout(() => setOpening(true), 350);
    const t2 = setTimeout(() => {
      setHidden(true);
      onComplete();
    }, 350 + 1300 + 50);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [count, onComplete]);

  if (hidden) return null;

  return (
    <div
      className="fixed inset-0 z-[100] overflow-hidden"
      style={{ height: "100dvh", pointerEvents: "none" }}
      aria-hidden
    >
      {/* Left curtain */}
      <div
        className="absolute top-0 left-0 h-full w-1/2 bg-[#0d0d0d] overflow-hidden"
        style={{
          transform: opening ? "translate3d(-101%,0,0)" : "translate3d(0,0,0)",
          transition: "transform 1300ms cubic-bezier(0.77,0,0.175,1)",
          willChange: "transform",
        }}
      >
        <div className="absolute inset-y-0 left-0 w-screen flex items-center justify-center">
          <span className="font-display text-white text-[22vw] md:text-[13rem] leading-none font-bold tabular-nums tracking-tight select-none">
            {count}
          </span>
        </div>
      </div>

      {/* Right curtain */}
      <div
        className="absolute top-0 right-0 h-full w-1/2 bg-[#0d0d0d] overflow-hidden"
        style={{
          transform: opening ? "translate3d(101%,0,0)" : "translate3d(0,0,0)",
          transition: "transform 1300ms cubic-bezier(0.77,0,0.175,1)",
          willChange: "transform",
        }}
      >
        <div className="absolute inset-y-0 right-0 w-screen flex items-center justify-center">
          <span className="font-display text-white text-[22vw] md:text-[13rem] leading-none font-bold tabular-nums tracking-tight select-none">
            {count}
          </span>
        </div>
      </div>
    </div>
  );
}
