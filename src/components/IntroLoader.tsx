import { useEffect, useRef, useState } from "react";

export function IntroLoader({ onComplete }: { onComplete: () => void }) {
  const [count, setCount] = useState(0);
  const [fadeOut, setFadeOut] = useState(false);
  const [hidden, setHidden] = useState(false);
  const doneRef = useRef(false);

  // Count 0 -> 100
  useEffect(() => {
    if (count >= 100) return;
    const t = setTimeout(() => setCount((c) => Math.min(100, c + 1)), 18);
    return () => clearTimeout(t);
  }, [count]);

  // Trigger fade + unmount once
  useEffect(() => {
    if (count < 100 || doneRef.current) return;
    doneRef.current = true;
    const t1 = setTimeout(() => setFadeOut(true), 250);
    const t2 = setTimeout(() => {
      setHidden(true);
      onComplete();
    }, 250 + 700);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [count, onComplete]);

  if (hidden) return null;

  return (
    <div
      aria-hidden
      className="fixed inset-0 z-[100] bg-[#0d0d0d] flex items-center justify-center"
      style={{
        width: "100vw",
        height: "100dvh",
        opacity: fadeOut ? 0 : 1,
        transition: "opacity 700ms ease-out",
        pointerEvents: fadeOut ? "none" : "auto",
      }}
    >
      <div className="flex flex-col items-center">
        <span className="font-display text-white text-[22vw] md:text-[13rem] leading-none font-bold tabular-nums tracking-tight select-none">
          {count}
        </span>
        <div
          className="mt-6 h-px bg-[#c9a96a] transition-all duration-200 ease-out"
          style={{ width: `${Math.min(count * 3.2, 320)}px` }}
        />
      </div>
    </div>
  );
}
