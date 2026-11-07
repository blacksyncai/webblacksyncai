import { useEffect, useRef, useState } from "react";
import { Pause, Play, ArrowRight } from "lucide-react";
import { SectionHeading, Reveal } from "@/components/ui/section";
import { LiveOrb } from "@/components/ui/live-orb";
import { REGISTER_URL } from "@/lib/register";

// Served by the BlackSync app: each voice says one fixed preview line (generated once, cached).
const SAMPLE_BASE = "https://blacksync.si/api/public/voice-samples";

type Voice = {
  key: string;
  name: string;
  desc: string;
  /** Overrides SAMPLE_BASE, e.g. for a sample not yet cached on the backend. */
  url?: string;
  comingSoon?: boolean;
  /** Per-voice accent, echoing the orb's colorful "character" feel. */
  color: string;
};

const voices: Voice[] = [
  { key: "marissa", name: "Marissa", desc: "Warm and upbeat", color: "#F97316" },
  // Not cached on the blacksync.si backend yet, so served from a local
  // copy instead of SAMPLE_BASE until it lands there too.
  { key: "zain", name: "Zain", desc: "Smooth and persuasive", url: "/audio/zain-sample.wav", color: "#6366F1" },
  { key: "lauren", name: "Lauren", desc: "Friendly and professional", color: "#EC4899" },
  { key: "macco", name: "Macco", desc: "Deep and confident", color: "#10B981" },
  { key: "kate", name: "Kate", desc: "Clear and easygoing", color: "#F59E0B" },
];

function hexToRgba(hex: string, alpha: number): string {
  const n = Number.parseInt(hex.replace("#", ""), 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${alpha})`;
}

export function VoiceSamplesSection() {
  const audio = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState<string | null>(null);
  const [loading, setLoading] = useState<string | null>(null);
  const [failed, setFailed] = useState<string | null>(null);

  useEffect(() => () => audio.current?.pause(), []);

  function toggle(key: string, url?: string) {
    setFailed(null);
    if (playing === key) {
      audio.current?.pause();
      setPlaying(null);
      return;
    }
    audio.current?.pause();
    const a = new Audio(url ?? `${SAMPLE_BASE}/${key}.wav`);
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
        <div aria-hidden="true">
          <Reveal className="flex justify-center mb-2">
            <LiveOrb size={104} variant="custom" color="#F97316" eyeColor="#FFFFFF" />
          </Reveal>
        </div>
        <SectionHeading
          eyebrow="Hear it for yourself"
          title={<>Voices that sound <span className="text-accent-grad">human</span></>}
          lead="Click a voice to hear how your AI agent sounds on a real call."
        />
        <div className="mt-12 grid grid-cols-2 md:grid-cols-5 gap-3 sm:gap-4 [&>*:nth-child(5)]:col-span-2 md:[&>*:nth-child(5)]:col-span-1">
          {voices.map((v, i) => {
            const active = playing === v.key;
            const disabled = v.comingSoon === true;
            return (
              <Reveal key={v.key} delay={i * 0.06}>
                <button
                  type="button"
                  onClick={() => !disabled && toggle(v.key, v.url)}
                  disabled={disabled}
                  aria-pressed={disabled ? undefined : active}
                  aria-label={disabled ? `${v.name} — coming soon` : `${active ? "Pause" : "Play"} ${v.name}`}
                  data-testid={`voice-sample-${v.key}`}
                  className={`group w-full h-full text-left rounded-xl border bg-card p-4 shadow-sm transition ${
                    disabled ? "opacity-60 cursor-not-allowed border-card-border" : "hover:shadow-md hover:-translate-y-0.5"
                  }`}
                  style={
                    disabled
                      ? undefined
                      : {
                          borderColor: active ? v.color : hexToRgba(v.color, 0.22),
                          boxShadow: active ? `0 0 0 2px ${hexToRgba(v.color, 0.18)}` : undefined,
                        }
                  }
                >
                  <span
                    className={`flex items-center justify-center w-9 h-9 rounded-full transition ${disabled ? "bg-muted text-muted-foreground" : ""}`}
                    style={
                      disabled
                        ? undefined
                        : { backgroundColor: active ? v.color : hexToRgba(v.color, 0.14), color: active ? "#fff" : v.color }
                    }
                  >
                    {loading === v.key ? (
                      <span className="w-3.5 h-3.5 rounded-full border-2 border-current border-t-transparent animate-spin" />
                    ) : active ? (
                      <Pause className="w-4 h-4" />
                    ) : (
                      <Play className="w-4 h-4 translate-x-px" />
                    )}
                  </span>
                  <span className="mt-3 block font-display text-base font-semibold tracking-tight text-foreground">{v.name}</span>
                  <span className="mt-0.5 block text-xs text-muted-foreground">
                    {disabled ? "Coming soon" : failed === v.key ? "Couldn't play — try again" : active ? "Playing…" : v.desc}
                  </span>
                  <span className="mt-2.5 flex items-end gap-0.5 h-3.5" aria-hidden>
                    {[3, 6, 10, 7, 12, 5, 9, 4, 8, 6].map((h, j) => (
                      <span
                        key={j}
                        className={`w-1 rounded-full ${active ? "animate-pulse" : ""} ${disabled ? "bg-muted-foreground/25" : ""}`}
                        style={{
                          height: `${h + 2}px`,
                          animationDelay: `${j * 80}ms`,
                          backgroundColor: disabled ? undefined : active ? v.color : hexToRgba(v.color, 0.25),
                        }}
                      />
                    ))}
                  </span>
                </button>
              </Reveal>
            );
          })}
        </div>

        <Reveal delay={0.2} className="mt-10 flex flex-col items-center gap-2 text-center">
          <p className="text-sm text-muted-foreground">
            These are 5 of 50+ voices in our library. Clone your own voice too.
          </p>
          <a
            href={REGISTER_URL}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline underline-offset-4"
            data-testid="link-voices-cta"
          >
            Browse the full library
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </Reveal>
      </div>
    </section>
  );
}
