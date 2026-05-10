import { BookText } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const months = ["Mayo 2026"];
const dayLabels = ["L", "M", "X", "J", "V", "S", "D"];

// Build a 35-day grid (5 weeks). Stub data only.
const calendar = Array.from({ length: 35 }, (_, i) => {
  const day = i + 1;
  let state: "future" | "clean" | "lapse" | "today" | "empty" = "empty";
  if (i < 4) state = "empty";
  else if (i === 8) state = "today";
  else if (i === 14 || i === 22) state = "lapse";
  else if (i > 4 && i < 9) state = "clean";
  return { day, state };
});

const stateStyles: Record<string, string> = {
  future: "bg-transparent text-[var(--color-ink-3)]",
  empty: "bg-[var(--color-hairline)]/40 text-[var(--color-ink-3)]",
  clean: "bg-[var(--color-secondary)]/20 text-[var(--color-secondary)]",
  lapse: "bg-[var(--color-warm)]/20 text-[var(--color-warm)]",
  today:
    "bg-[var(--color-primary)] text-white ring-2 ring-[var(--color-primary)] ring-offset-2 ring-offset-[var(--color-bg)]",
};

export default function DiarioPage() {
  const hasEntries = false;

  return (
    <div className="mx-auto flex max-w-[1100px] flex-col gap-6">
      <header className="flex items-end justify-between">
        <div>
          <div className="text-[13px] font-semibold text-[var(--color-ink-3)]">
            Tu diario
          </div>
          <h1 className="mt-1 font-serif text-[32px] leading-tight md:text-[38px]">
            Conocer el patrón es la mitad.
          </h1>
        </div>
        <Button variant="primary" size="md">
          Nueva entrada
        </Button>
      </header>

      {!hasEntries ? (
        <Card className="flex flex-col items-center gap-4 p-12 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--color-primary-soft)]">
            <BookText size={26} className="text-[var(--color-primary)]" />
          </div>
          <h2 className="font-serif text-xl">Aún no hay entradas</h2>
          <p className="max-w-md text-sm text-[var(--color-ink-2)]">
            Cuando registres tu primer impulso o reflexión, aparecerá aquí. Sin
            culpas, solo datos para entenderte mejor.
          </p>
          <Button size="md">Empezar</Button>
        </Card>
      ) : null}

      <Card className="p-6">
        <div className="flex items-center justify-between">
          <h2 className="font-serif text-lg font-medium">{months[0]}</h2>
          <div className="flex gap-3 text-xs text-[var(--color-ink-3)]">
            <span className="inline-flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-sm bg-[var(--color-secondary)]/40" />
              Día limpio
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-sm bg-[var(--color-warm)]/40" />
              Recaída
            </span>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-7 gap-2 text-center">
          {dayLabels.map((d) => (
            <div
              key={d}
              className="text-[11px] font-semibold uppercase tracking-wider text-[var(--color-ink-3)]"
            >
              {d}
            </div>
          ))}
          {calendar.map((c, i) => (
            <div
              key={i}
              className={`flex aspect-square items-center justify-center rounded-xl text-sm font-medium ${stateStyles[c.state]}`}
            >
              {c.day}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
