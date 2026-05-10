"use client";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface Props {
  totalSeconds?: number;
  onComplete?: () => void;
  className?: string;
}

type Phase = "inhala" | "sosten" | "exhala";

const PHASE_DURATIONS: Record<Phase, number> = {
  inhala: 4,
  sosten: 7,
  exhala: 8,
};

const PHASE_ORDER: Phase[] = ["inhala", "sosten", "exhala"];

const PHASE_LABEL: Record<Phase, string> = {
  inhala: "Inhala",
  sosten: "Sostén",
  exhala: "Exhala",
};

/**
 * Círculo animado para urge surfing — patrón 4-7-8.
 * Escala 1.0 → 1.5 (inhala 4s) → mantiene (sosten 7s) → 1.5 → 1.0 (exhala 8s).
 * Cuando el contador total llega a 0 dispara onComplete.
 */
export function BreathingCircle({
  totalSeconds = 60,
  onComplete,
  className,
}: Props) {
  const [remaining, setRemaining] = useState(totalSeconds);
  const [phaseIdx, setPhaseIdx] = useState(0);
  const [phaseElapsed, setPhaseElapsed] = useState(0);

  useEffect(() => {
    if (remaining <= 0) {
      onComplete?.();
      return;
    }
    const id = window.setInterval(() => {
      setRemaining((r) => Math.max(0, r - 1));
      setPhaseElapsed((e) => {
        const phase = PHASE_ORDER[phaseIdx];
        const next = e + 1;
        if (next >= PHASE_DURATIONS[phase]) {
          setPhaseIdx((i) => (i + 1) % PHASE_ORDER.length);
          return 0;
        }
        return next;
      });
    }, 1000);
    return () => window.clearInterval(id);
  }, [remaining, phaseIdx, onComplete]);

  const phase = PHASE_ORDER[phaseIdx];
  const phaseDuration = PHASE_DURATIONS[phase];

  // map phase → target scale
  let scale = 1;
  if (phase === "inhala") scale = 1.5;
  if (phase === "sosten") scale = 1.5;
  if (phase === "exhala") scale = 1;

  const transitionMs =
    phase === "sosten" ? 0 : phaseDuration * 1000;

  return (
    <div
      className={cn(
        "relative flex flex-col items-center justify-center gap-6",
        className
      )}
    >
      <div className="relative flex h-72 w-72 items-center justify-center">
        <div
          aria-hidden
          className="absolute inset-0 rounded-full"
          style={{
            background:
              "radial-gradient(circle at 50% 50%, rgba(123,168,136,0.35), rgba(123,168,136,0) 70%)",
            transform: `scale(${scale})`,
            transition: `transform ${transitionMs}ms ease-in-out`,
          }}
        />
        <div
          aria-hidden
          className="absolute h-32 w-32 rounded-full"
          style={{
            background:
              "radial-gradient(circle at 35% 30%, #ffffff 0%, #7BA888 70%)",
            transform: `scale(${scale})`,
            transition: `transform ${transitionMs}ms ease-in-out`,
            boxShadow: "0 12px 40px -12px rgba(123,168,136,0.5)",
          }}
        />
        <div
          className="relative z-10 text-center"
          style={{
            color: "var(--color-ink)",
            mixBlendMode: "luminosity",
          }}
        >
          <div className="font-serif text-2xl font-medium">
            {PHASE_LABEL[phase]}
          </div>
        </div>
      </div>
      <div className="text-sm text-[var(--color-ink-3)]" aria-live="polite">
        {remaining > 0 ? `${remaining}s restantes` : "Listo."}
      </div>
    </div>
  );
}
