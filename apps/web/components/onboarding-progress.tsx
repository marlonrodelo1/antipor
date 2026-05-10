import { cn } from "@/lib/utils";

interface Props {
  current: number; // 0-based step index
  total: number; // total number of steps (excluding "listo" if you wish)
  className?: string;
}

/**
 * Barra de progreso superior del onboarding.
 * Muestra "Paso X de Y" + línea de progreso animada.
 */
export function OnboardingProgress({ current, total, className }: Props) {
  const safeTotal = Math.max(total, 1);
  const safeCurrent = Math.min(Math.max(current, 0), safeTotal);
  const pct = (safeCurrent / safeTotal) * 100;

  return (
    <div className={cn("w-full", className)}>
      <div className="mb-2 flex items-center justify-between text-[11px] font-semibold uppercase tracking-wider text-[var(--color-ink-3)]">
        <span>
          Paso {Math.min(safeCurrent + 1, safeTotal)} de {safeTotal}
        </span>
        <span className="text-[var(--color-primary)]">
          {Math.round(pct)}%
        </span>
      </div>
      <div
        className="h-1.5 w-full overflow-hidden rounded-full bg-[var(--color-hairline)]"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={safeTotal}
        aria-valuenow={safeCurrent}
      >
        <div
          className="h-full rounded-full bg-[var(--color-primary)] transition-[width] duration-500 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
