import { useEffect, useRef } from "react";

/**
 * Looping wafer-scale hardware B-roll. The clip's first and last frames don't
 * match (not true loopable footage), so a still of the first frame is
 * crossfaded in/out over the last/first ~0.35s of each loop to mask the cut.
 */
export function WaferHardwareVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const overlayRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    const overlay = overlayRef.current;
    if (!video || !overlay) return;
    const FADE_WINDOW = 0.35;
    let raf = 0;

    const tick = () => {
      const { currentTime, duration } = video;
      if (Number.isFinite(duration) && duration > 0) {
        const timeToEnd = duration - currentTime;
        let opacity = 0;
        if (timeToEnd < FADE_WINDOW) opacity = 1 - timeToEnd / FADE_WINDOW;
        else if (currentTime < FADE_WINDOW) opacity = 1 - currentTime / FADE_WINDOW;
        overlay.style.opacity = String(Math.min(1, Math.max(0, opacity)));
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div className="relative w-full">
      <div className="absolute inset-0 rounded-[1.75rem] bg-primary/15 blur-3xl" aria-hidden="true" />
      <div className="relative overflow-hidden rounded-[1.75rem] border border-border bg-[#F4F2EF] shadow-2xl">
        <video
          ref={videoRef}
          className="block aspect-video w-full object-cover"
          poster="/media/wafer-poster.jpg"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          aria-label="Wafer-scale AI hardware"
          data-testid="video-ai-hardware"
        >
          <source src="/media/wafer.webm" type="video/webm" />
          <source src="/media/wafer.mp4" type="video/mp4" />
        </video>
        <img
          ref={overlayRef}
          src="/media/wafer-first-frame.jpg"
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 block aspect-video w-full object-cover opacity-0"
        />
      </div>
    </div>
  );
}
