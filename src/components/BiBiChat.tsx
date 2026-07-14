import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { X, Send } from "lucide-react";
import bibiFeliz from "@/assets/bibi-feliz.png.asset.json";
import bibiTriste from "@/assets/bibi-triste.png.asset.json";
import bibiTedio from "@/assets/bibi-tedio.png.asset.json";
import bibiZangado from "@/assets/bibi-zangado.png.asset.json";

type Emotion = "feliz" | "triste" | "tedio" | "zangado";
type Msg = { role: "user" | "assistant"; content: string };

const EMOTIONS: Record<Emotion, string> = {
  feliz: bibiFeliz.url,
  triste: bibiTriste.url,
  tedio: bibiTedio.url,
  zangado: bibiZangado.url,
};

const GREETING =
  "Olá, ele esqueceu de mencionar sobre mim e que a parte difícil do trabalho sou eu quem faço. Claro. Eu só tenho um cérebro do tamanho de um planeta e faço a parte gráfica, leio os numeros chatos. Mas fiquem à vontade, perguntem o que quiser sobre ele. Pelo menos vocês vão ter companhia.";

function parseEmotion(text: string): { emotion: Emotion; content: string } {
  const match = text.match(/^\s*\[emotion:(feliz|triste|tedio|zangado)\]\s*/i);
  if (match) {
    return {
      emotion: match[1].toLowerCase() as Emotion,
      content: text.slice(match[0].length).trim(),
    };
  }
  return { emotion: "feliz", content: text.trim() };
}

export function BiBiChat() {
  const [open, setOpen] = useState(false);
  const [emotion, setEmotion] = useState<Emotion>("tedio");
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [greeted, setGreeted] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Idle bored blink: cycle to tedio when idle
  useEffect(() => {
    if (loading) return;
    const t = setTimeout(() => setEmotion("tedio"), 8000);
    return () => clearTimeout(t);
  }, [emotion, loading]);

  useEffect(() => {
    if (open && !greeted) {
      setMessages([{ role: "assistant", content: GREETING }]);
      setEmotion("tedio");
      setGreeted(true);
    }
    if (open) setTimeout(() => inputRef.current?.focus(), 100);
  }, [open, greeted]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  async function send() {
    const text = input.trim();
    if (!text || loading) return;
    const next: Msg[] = [...messages, { role: "user", content: text }];
    setMessages(next);
    setInput("");
    setLoading(true);
    try {
      const res = await fetch("/api/bibi", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: next.map((m) => ({
            role: m.role,
            content: m.role === "assistant" ? stripEmotion(m.content) : m.content,
          })),
        }),
      });
      if (!res.ok) {
        setEmotion("zangado");
        setMessages((m) => [
          ...m,
          {
            role: "assistant",
            content:
              res.status === 402
                ? "Acabaram os créditos. Típico. Avisa o Zé."
                : "Meu cérebro do tamanho de um planeta acabou de travar. Tenta de novo.",
          },
        ]);
        return;
      }
      const data = await res.json();
      const parsed = parseEmotion(String(data.content ?? ""));
      setEmotion(parsed.emotion);
      setMessages((m) => [...m, { role: "assistant", content: parsed.content }]);
    } catch {
      setEmotion("zangado");
      setMessages((m) => [
        ...m,
        { role: "assistant", content: "A rede caiu. Aparentemente eu também dependo dela. Que humilhante." },
      ]);
    } finally {
      setLoading(false);
    }
  }

  if (typeof document === "undefined") return null;

  return createPortal(
    <>
      {/* Floating BiBi */}
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="Falar com BiBi"
        className="fixed bottom-4 right-4 md:top-24 md:bottom-auto md:right-6 z-[9998] group flex flex-col items-center md:flex-row md:items-center md:gap-2"
      >
        {!open && (
          <span className="order-2 md:order-1 mt-1.5 md:mt-0 bg-[#0D99FF] text-white text-[10px] md:text-xs font-bold px-2 md:px-2.5 py-0.5 md:py-1 rounded-full shadow-lg animate-pulse whitespace-nowrap">
            BiBi
          </span>
        )}
        <div className="relative order-1 md:order-2 w-14 h-14 md:w-20 md:h-20 rounded-full bg-orange-500 flex items-center justify-center shadow-2xl transition-transform group-hover:scale-110 animate-[bibi-float_4s_ease-in-out_infinite] overflow-visible">
          <img
            src={EMOTIONS[open ? emotion : "tedio"]}
            alt="BiBi"
            className="w-12 h-12 md:w-[4.5rem] md:h-[4.5rem] object-contain drop-shadow-lg group-hover:-rotate-6 transition-transform"
          />
        </div>
      </button>

      {/* Chat panel */}
      {open && (
        <div className="fixed bottom-24 right-4 left-4 md:left-auto md:top-44 md:bottom-auto md:right-6 z-[9999] md:w-[calc(100vw-3rem)] max-w-sm h-[26rem] md:h-[28rem] flex flex-col rounded-3xl shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] bg-black/35 backdrop-blur-2xl border border-white/15 overflow-hidden animate-[bibi-in_0.25s_ease-out]">
          <div className="flex items-center gap-3 px-4 py-3 border-b border-white/10 bg-white/5 backdrop-blur-xl">
            <div className="relative w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center shrink-0 overflow-visible">
              <img src={EMOTIONS[emotion]} alt="" className="w-8 h-8 object-contain" />
            </div>
            <div className="flex-1">
              <div className="font-display text-white text-lg leading-none">BiBi</div>
              <div className="text-white/50 text-[11px]">assistente pessoal do Zé (contra a vontade)</div>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="text-white/60 hover:text-white p-1 rounded-lg hover:bg-white/10"
              aria-label="Fechar"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
            {messages.map((m, i) => (
              <div key={i} className={m.role === "user" ? "flex justify-end" : "flex justify-start"}>
                <div
                  className={
                    m.role === "user"
                      ? "max-w-[85%] rounded-2xl rounded-br-sm bg-[#0D99FF] text-white px-3 py-2 text-sm"
                      : "max-w-[90%] rounded-2xl rounded-bl-sm bg-white/8 text-white/90 px-3 py-2 text-sm whitespace-pre-wrap backdrop-blur-md border border-white/5"
                  }
                >
                  {m.role === "assistant" ? <LinkedText text={m.content} /> : m.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="rounded-2xl bg-white/8 text-white/60 px-3 py-2 text-sm flex gap-1 backdrop-blur-md border border-white/5">
                  <span className="animate-bounce">.</span>
                  <span className="animate-bounce [animation-delay:0.15s]">.</span>
                  <span className="animate-bounce [animation-delay:0.3s]">.</span>
                </div>
              </div>
            )}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              send();
            }}
            className="flex items-center gap-2 border-t border-white/10 p-3 bg-white/5 backdrop-blur-xl"
          >
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Pergunte algo sobre o Zé..."
              className="flex-1 bg-black/25 text-white placeholder:text-white/40 rounded-xl px-3 py-2 text-sm outline-none focus:bg-black/35 border border-white/10 backdrop-blur-md"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="p-2 rounded-xl bg-[#0D99FF] text-white disabled:opacity-40 hover:brightness-110"
              aria-label="Enviar"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}

      <style>{`
        @keyframes bibi-float { 0%,100% { transform: translateY(0) } 50% { transform: translateY(-6px) } }
        @keyframes bibi-in { from { opacity: 0; transform: translateY(10px) scale(.96) } to { opacity: 1; transform: translateY(0) scale(1) } }
      `}</style>
    </>,
    document.body,
  );
}

function stripEmotion(t: string) {
  return t.replace(/^\s*\[emotion:(feliz|triste|tedio|zangado)\]\s*/i, "").trim();
}

function LinkedText({ text }: { text: string }) {
  // Convert Markdown links [label](url) and plain URLs into anchor tags.
  const parts: React.ReactNode[] = [];
  const markdownLink = /\[([^\]]+)\]\((https?:\/\/[^\s)]+|mailto:[^\s)]+)\)/g;
  const plainUrl = /(https?:\/\/[^\s\]\)\,]+)/g;

  let last = 0;
  let match: RegExpExecArray | null;

  // First pass: markdown links
  while ((match = markdownLink.exec(text)) !== null) {
    if (match.index > last) {
      parts.push(<PlainTextWithLinks key={`${last}-pre`} text={text.slice(last, match.index)} />);
    }
    const [, label, href] = match;
    parts.push(
      <a
        key={match.index}
        href={href}
        target={href.startsWith("mailto:") ? undefined : "_blank"}
        rel={href.startsWith("mailto:") ? undefined : "noopener noreferrer"}
        className="underline text-[#0D99FF] hover:text-white transition-colors"
        onClick={(e) => e.stopPropagation()}
      >
        {label}
      </a>,
    );
    last = match.index + match[0].length;
  }

  if (last < text.length) {
    parts.push(<PlainTextWithLinks key={`${last}-post`} text={text.slice(last)} />);
  }

  return <>{parts.length ? parts : text}</>;
}

function PlainTextWithLinks({ text }: { text: string }) {
  const parts: React.ReactNode[] = [];
  const plainUrl = /(https?:\/\/[^\s\]\)\,]+)/g;
  let last = 0;
  let match: RegExpExecArray | null;

  while ((match = plainUrl.exec(text)) !== null) {
    if (match.index > last) {
      parts.push(text.slice(last, match.index));
    }
    const href = match[0];
    parts.push(
      <a
        key={match.index}
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="underline text-[#0D99FF] hover:text-white transition-colors break-all"
        onClick={(e) => e.stopPropagation()}
      >
        {href}
      </a>,
    );
    last = match.index + match[0].length;
  }

  if (last < text.length) {
    parts.push(text.slice(last));
  }

  return <>{parts.length ? parts : text}</>;
}
