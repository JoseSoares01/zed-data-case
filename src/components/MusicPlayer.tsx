import { useEffect, useRef, useState } from "react";
import { Play, Pause, Volume2, VolumeX } from "lucide-react";
import track from "@/assets/soundsurfer-luxury-hotel.mp3.asset.json";

export function MusicPlayer({ autoStart = true }: { autoStart?: boolean }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(0.4);
  const [muted, setMuted] = useState(true); // start muted so mobile autoplay works

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.loop = true;
    audio.muted = true;
    audio.volume = volume;
  }, []);

  useEffect(() => {
    if (!autoStart) return;
    const audio = audioRef.current;
    if (!audio) return;

    // Start muted — allowed by all browsers, including mobile.
    audio.muted = true;
    audio
      .play()
      .then(() => setPlaying(true))
      .catch(() => {});

    // On the first user gesture anywhere, unmute so the user hears the track.
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

  return (
    <div className="fixed top-4 right-4 z-50 flex items-center gap-2 rounded-full border border-ink/15 bg-cream/90 backdrop-blur-md px-3 py-2 shadow-lg">
      <audio ref={audioRef} src={track.url} preload="auto" playsInline />
      <button
        onClick={toggle}
        aria-label={playing ? "Pausar música" : "Tocar música"}
        className="flex h-8 w-8 items-center justify-center rounded-full bg-ink text-cream hover:bg-accent transition-colors"
      >
        {playing ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
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
      <span className="hidden md:inline text-xs text-ink/60 pr-1">Luxury Hotel</span>
    </div>
  );
}
