import { useEffect, useRef, useState } from "react";

interface TypewriterTextProps {
  paragraphs: string[];
  className?: string;
  cursorClassName?: string;
  baseSpeed?: number;
  startDelay?: number;
}

export function TypewriterText({
  paragraphs,
  className = "",
  cursorClassName = "text-accent",
  baseSpeed = 42,
  startDelay = 400,
}: TypewriterTextProps) {
  const [displayed, setDisplayed] = useState<string[]>(() => paragraphs.map(() => ""));
  const [currentPara, setCurrentPara] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDone, setIsDone] = useState(false);
  const [mounted, setMounted] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const typeNext = () => {
      if (currentPara >= paragraphs.length) {
        setIsDone(true);
        return;
      }

      const text = paragraphs[currentPara];

      if (currentIndex < text.length) {
        const char = text[currentIndex];
        setDisplayed((prev) => {
          const next = [...prev];
          next[currentPara] = text.slice(0, currentIndex + 1);
          return next;
        });

        const isPunctuation = /[.,;:!?]/.test(char);
        const isSpace = char === " ";
        const variance = Math.random() * 28 - 14;
        const pause = isPunctuation ? 120 : isSpace ? 18 : 0;
        const speed = Math.max(12, baseSpeed + variance + pause);

        timeoutRef.current = setTimeout(() => {
          setCurrentIndex((i) => i + 1);
        }, speed);
      } else {
        timeoutRef.current = setTimeout(() => {
          setCurrentPara((p) => p + 1);
          setCurrentIndex(0);
        }, 650);
      }
    };

    timeoutRef.current = setTimeout(typeNext, currentPara === 0 && currentIndex === 0 ? startDelay : 0);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [mounted, currentPara, currentIndex, paragraphs, baseSpeed, startDelay]);

  if (!mounted) {
    return (
      <div className={className}>
        {paragraphs.map((text, i) => (
          <p key={i} className="mb-4 last:mb-0 break-words">
            {text}
          </p>
        ))}
      </div>
    );
  }

  return (
    <div className={className}>
      {paragraphs.map((fullText, i) => {
        const isActive = i === currentPara && !isDone;
        const showCursor = isActive || (i === currentPara && isDone);
        return (
          <p key={i} className="mb-4 last:mb-0 break-words min-h-[1.5em]">
            {displayed[i]}
            {showCursor && (
              <span
                className={`inline-block w-[2px] h-[1em] align-middle ml-0.5 animate-pulse ${cursorClassName}`}
                aria-hidden="true"
              />
            )}
            <span className="sr-only">{fullText}</span>
          </p>
        );
      })}
    </div>
  );
}
