import { useEffect, useRef, useState } from "react";

const INTRO_DURATION_MS = 1800;
const INTRO_FADE_DELAY_MS = 250;
const INTRO_FADE_MS = 700;

export function IntroLoader({ onComplete }: { onComplete: () => void }) {
  const [count, setCount] = useState(0);
  const [fadeOut, setFadeOut] = useState(false);
  const [hidden, setHidden] = useState(false);
  const doneRef = useRef(false);
  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    const start = Date.now();
    const previousOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    const tick = () => {
      if (doneRef.current) return;
      const now = Date.now();
      const progress = Math.min(1, (now - start) / INTRO_DURATION_MS);
      setCount(Math.round(progress * 100));
      if (progress >= 1) {
        doneRef.current = true;
        clearInterval(timer);
        window.setTimeout(() => setFadeOut(true), INTRO_FADE_DELAY_MS);
        window.setTimeout(() => {
          setHidden(true);
          onCompleteRef.current();
        }, INTRO_FADE_DELAY_MS + INTRO_FADE_MS);
      }
    };

    const timer = window.setInterval(tick, 18);
    tick();
    return () => {
      clearInterval(timer);
      document.documentElement.style.overflow = previousOverflow;
    };
  }, []);

  if (hidden) return null;

  return (
    <div
      aria-hidden
      className="fixed inset-0 z-[10000] bg-[#0d0d0d] flex items-center justify-center overflow-hidden"
      style={{
        position: "fixed",
        inset: 0,
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        zIndex: 10000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: "100vw",
        height: "100dvh",
        minWidth: "100vw",
        minHeight: "100dvh",
        margin: 0,
        backgroundColor: "#0d0d0d",
        overflow: "hidden",
        opacity: fadeOut ? 0 : 1,
        transition: `opacity ${INTRO_FADE_MS}ms ease-out`,
        pointerEvents: fadeOut ? "none" : "auto",
        transform: "translateZ(0)",
        contain: "layout paint size",
      }}
    >
      <div className="flex flex-col items-center" style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <span
          className="font-display text-white text-[22vw] md:text-[13rem] leading-none font-bold tabular-nums tracking-tight select-none"
          style={{
            color: "#ffffff",
            fontFamily: '"Archivo Black", system-ui, sans-serif',
            fontSize: "22vw",
            lineHeight: 1,
            fontWeight: 900,
            fontVariantNumeric: "tabular-nums",
            userSelect: "none",
          }}
        >
          {count}
        </span>
        <div
          className="mt-6 h-px bg-[#c9a96a] transition-all duration-200 ease-out"
          style={{
            width: `${Math.min(count * 3.2, 320)}px`,
            height: 1,
            marginTop: 24,
            backgroundColor: "#c9a96a",
            transition: "width 200ms ease-out",
          }}
        />
      </div>
    </div>
  );
}
