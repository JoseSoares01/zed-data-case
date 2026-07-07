import { useEffect, useMemo, useRef, useState } from "react";
import { Play, Pause, Volume2, VolumeX, SkipForward } from "lucide-react";
import track1 from "@/assets/soundsurfer-luxury-hotel.mp3.asset.json";
import track2 from "@/assets/poradovskyi-hotel-cafe-restaurant.mp3.asset.json";

type Track = { url: string; title: string };

const TRACKS: Track[] = [
  { url: track1.url, title: "Luxury Hotel" },
  { url: track2.url, title: "Hotel Café" },
];

const LAST_KEY = "zdd_last_track_idx";

function pickInitialIndex(): number {
  if (TRACKS.length <= 1) return 0;
  let last = -1;
  try {
    const v = sessionStorage.getItem(LAST_KEY) ?? localStorage.getItem(LAST_KEY);
    if (v !== null) last = parseInt(v, 10);
  } catch {}
  // pick a random index different from the last one
  const pool = TRACKS.map((_, i) => i).filter((i) => i !== last);
  const idx = pool[Math.floor(Math.random() * pool.length)];
  try {
    sessionStorage.setItem(LAST_KEY, String(idx));
    localStorage.setItem(LAST_KEY, String(idx));
  } catch {}
  return idx;
}

export function MusicPlayer({ autoStart = true }: { autoStart?: boolean }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [index, setIndex] = useState<number>(() => pickInitialIndex());
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(0.4);
  const [muted, setMuted] = useState(true);

  const current = useMemo(() => TRACKS[index], [index]);

  // Advance to the next track (sequential from current), wrapping around.
  const nextIndex = (from: number) => (from + 1) % TRACKS.length;

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.loop = false;
    audio.muted = true;
    audio.volume = volume;
  }, []);

  // When the current track ends, play the next one.
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const onEnded = () => setIndex((i) => nextIndex(i));
    audio.addEventListener("ended", onEnded);
    return () => audio.removeEventListener("ended", onEnded);
  }, []);

  // Whenever the track index changes, load & try to play (muted).
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.src = current.url;
    audio.load();
    audio.muted = muted;
    audio
      .play()
      .then(() => setPlaying(true))
      .catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current.url]);

  // Unmute on the first user gesture anywhere on the page.
  useEffect(() => {
    if (!autoStart) return;
    const audio = audioRef.current;
    if (!audio) return;

    // Retry muted play once the intro clears (in case first attempt was too early).
    audio.muted = true;
    audio
      .play()
      .then(() => setPlaying(true))
      .catch(() => {});

    const unmuteOnGesture = async () => {
      const a = audioRef.current;
      if (!a) return;
      a.muted = false;
      a.volume = volume;
      setMuted(false);
      try {
        if (a.paused) {
          await a.play();
          setPlaying(true);
        }
      } catch {}
      window.removeEventListener("pointerdown", unmuteOnGesture);
      window.removeEventListener("touchstart", unmuteOnGesture);
      window.removeEventListener("keydown", unmuteOnGesture);
    };
    window.addEventListener("pointerdown", unmuteOnGesture, { once: true });
    window.addEventListener("touchstart", unmuteOnGesture, { once: true });
    window.addEventListener("keydown", unmuteOnGesture, { once: true });

    return () => {
      window.removeEventListener("pointerdown", unmuteOnGesture);
      window.removeEventListener("touchstart", unmuteOnGesture);
      window.removeEventListener("keydown", unmuteOnGesture);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoStart]);

  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;
    a.muted = muted;
    a.volume = volume;
  }, [volume, muted]);

  const toggle = async () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      audio.pause();
      setPlaying(false);
    } else {
      try {
        audio.muted = muted;
        await audio.play();
        setPlaying(true);
      } catch {}
    }
  };

  const skip = () => setIndex((i) => nextIndex(i));

  return (
    <div className="fixed top-4 right-4 z-50 flex items-center gap-2 rounded-full border border-ink/15 bg-cream/90 backdrop-blur-md px-3 py-2 shadow-lg">
      <audio ref={audioRef} preload="auto" playsInline />
      <button
        onClick={toggle}
        aria-label={playing ? "Pausar música" : "Tocar música"}
        className="flex h-8 w-8 items-center justify-center rounded-full bg-ink text-cream hover:bg-accent transition-colors"
      >
        {playing ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
      </button>
      <button
        onClick={skip}
        aria-label="Próxima música"
        className="text-ink/70 hover:text-accent transition-colors"
      >
        <SkipForward className="w-4 h-4" />
      </button>
      <button
        onClick={() => setMuted((m) => !m)}
        aria-label={muted ? "Ativar som" : "Silenciar"}
        className="text-ink/70 hover:text-accent transition-colors"
      >
        {muted || volume === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
      </button>
      <input
        type="range"
        min={0}
        max={1}
        step={0.01}
        value={muted ? 0 : volume}
        onChange={(e) => {
          setVolume(parseFloat(e.target.value));
          if (muted) setMuted(false);
        }}
        aria-label="Volume"
        className="hidden sm:block w-20 accent-ink"
      />
      <span className="hidden md:inline text-xs text-ink/60 pr-1">{current.title}</span>
    </div>
  );
}
