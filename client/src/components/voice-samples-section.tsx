import { useEffect, useRef, useState } from "react";
import { Pause, Play } from "lucide-react";
import { SectionHeading, Reveal } from "@/components/ui/section";

// Served by the BlackSync app: each voice says one fixed preview line (generated once, cached).
const SAMPLE_BASE = "https://blacksync.si/api/public/voice-samples";

const voices = [
  { key: "marissa", name: "Marissa", desc: "Warm and upbeat" },
  { key: "macco", name: "Macco", desc: "Deep and confident" },
  { key: "lauren", name: "Lauren", desc: "Friendly and professional" },
  { key: "kate", name: "Kate", desc: "Clear and easygoing" },
];

export function VoiceSamplesSection() {
  const audio = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState<string | null>(null);
  const [loading, setLoading] = useState<string | null>(null);
  const [failed, setFailed] = useState<string | null>(null);

  useEffect(() => () => audio.current?.pause(), []);

  function toggle(key: string) {
    setFailed(null);
    if (playing === key) {
      audio.current?.pause();
      setPlaying(null);
      return;
    }
    audio.current?.pause();
    const a = new Audio(`${SAMPLE_BASE}/${key}.wav`);
    audio.current = a;
    setLoading(key);
    a.onplaying = () => {
      setLoading(null);
      setPlaying(key);
    };
    a.onended = () => setPlaying((p) => (p === key ? null : p));
    a.onerror = () => {
      setLoading(null);
      setPlaying(null);
      setFailed(key);
    };
    a.play().catch(() => {
      setLoading(null);
      setFailed(key);
    });
  }

  return (
    <section id="voices" data-testid="section-voices" className="py-20 md:py-28 relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Hear it for yourself"
          title={<>Voices that sound <span className="text-accent-grad">human</span></>}
          lead="Click a voice to hear how your AI agent sounds on a real call."
        />
        <div className="mt-12 grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {voices.map((v, i) => {
            const active = playing === v.key;
            return (
              <Reveal key={v.key} delay={i * 0.06}>
                <button
                  type="button"
                  onClick={() => toggle(v.key)}
                  aria-pressed={active}
                  aria-label={`${active ? "Pause" : "Play"} ${v.name}`}
                  data-testid={`voice-sample-${v.key}`}
                  className={`group w-full h-full text-left rounded-2xl border bg-card p-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition ${
                    active ? "border-primary ring-2 ring-primary/20" : "border-card-border"
                  }`}
                >
                  <span
                    className={`flex items-center justify-center w-11 h-11 rounded-full transition ${
                      active ? "bg-primary text-primary-foreground" : "bg-primary/10 text-primary group-hover:bg-primary/15"
                    }`}
                  >
                    {loading === v.key ? (
                      <span className="w-4 h-4 rounded-full border-2 border-current border-t-transparent animate-spin" />
                    ) : active ? (
                      <Pause className="w-5 h-5" />
                    ) : (
                      <Play className="w-5 h-5 translate-x-px" />
                    )}
                  </span>
                  <span className="mt-4 block font-display text-lg font-semibold tracking-tight text-foreground">{v.name}</span>
                  <span className="mt-0.5 block text-sm text-muted-foreground">
                    {failed === v.key ? "Couldn't play — try again" : active ? "Playing…" : v.desc}
                  </span>
                  <span className="mt-3 flex items-end gap-0.5 h-4" aria-hidden>
                    {[3, 6, 10, 7, 12, 5, 9, 4, 8, 6].map((h, j) => (
                      <span
                        key={j}
                        className={`w-1 rounded-full ${active ? "bg-primary animate-pulse" : "bg-muted-foreground/25"}`}
                        style={{ height: `${h + 2}px`, animationDelay: `${j * 80}ms` }}
                      />
                    ))}
                  </span>
                </button>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
