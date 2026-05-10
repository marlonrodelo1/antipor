"use client";

import { cn } from "@/lib/utils";

interface Props {
  value: number[]; // hours of day 0-23
  onChange: (next: number[]) => void;
}

const HOURS = Array.from({ length: 24 }, (_, i) => i);

function formatHour(h: number): string {
  return `${h.toString().padStart(2, "0")}:00`;
}

/**
 * Selector de horas de riesgo. Grid 6x4 (mobile) / 8x3 (desktop) de 24 horas.
 * Marca/desmarca tap a tap. Acepta cualquier número (0-N seleccionadas).
 */
export function RiskHoursClock({ value, onChange }: Props) {
  const set = new Set(value);

  function toggle(h: number) {
    const next = new Set(set);
    if (next.has(h)) next.delete(h);
    else next.add(h);
    onChange(Array.from(next).sort((a, b) => a - b));
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="grid grid-cols-6 gap-2 sm:grid-cols-8">
        {HOURS.map((h) => {
          const on = set.has(h);
          // Visual hint: nighttime (21-05) gets a subtle warm tone
          const isNight = h >= 21 || h <= 5;
          return (
            <button
              key={h}
              type="button"
              onClick={() => toggle(h)}
              aria-pressed={on}
              className={cn(
                "flex h-12 items-center justify-center rounded-xl border text-sm font-medium transition-all",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-1 focus-visible:ring-offset-[var(--background)]",
                on
                  ? "border-[var(--color-warm)] bg-[var(--color-warm)] text-white shadow-sm"
                  : isNight
                  ? "border-[var(--color-warm-soft)] bg-[var(--color-warm-bg)] text-[var(--color-ink-2)] hover:border-[var(--color-warm)]"
                  : "border-[var(--color-hairline)] bg-[var(--card)] text-[var(--color-ink-2)] hover:border-[var(--color-primary)]"
              )}
            >
              {formatHour(h)}
            </button>
          );
        })}
      </div>
      <p className="text-xs text-[var(--color-ink-3)]">
        {value.length === 0
          ? "Aún no has marcado ninguna hora."
          : value.length === 1
          ? "Has marcado 1 hora."
          : `Has marcado ${value.length} horas.`}
      </p>
    </div>
  );
}
