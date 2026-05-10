"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { patchProfile } from "@/lib/profile";

const DAYS = [
  { num: 1, label: "L" },
  { num: 2, label: "M" },
  { num: 3, label: "X" },
  { num: 4, label: "J" },
  { num: 5, label: "V" },
  { num: 6, label: "S" },
  { num: 7, label: "D" },
];

const TIME_RE = /^\d{2}:\d{2}$/;

export default function HorarioPage() {
  const router = useRouter();
  const [noFixed, setNoFixed] = useState(false);
  const [start, setStart] = useState("09:00");
  const [end, setEnd] = useState("18:00");
  const [days, setDays] = useState<number[]>([1, 2, 3, 4, 5]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function toggleDay(d: number) {
    setDays((prev) =>
      prev.includes(d)
        ? prev.filter((x) => x !== d)
        : [...prev, d].sort((a, b) => a - b)
    );
  }

  async function handleNext() {
    setSaving(true);
    setError(null);
    try {
      if (noFixed) {
        await patchProfile({ work_schedule: null });
      } else {
        if (!TIME_RE.test(start) || !TIME_RE.test(end)) {
          setError("Formato de hora no válido.");
          setSaving(false);
          return;
        }
        if (days.length === 0) {
          setError("Marca al menos un día.");
          setSaving(false);
          return;
        }
        await patchProfile({
          work_schedule: { start, end, days },
        });
      }
      router.push("/onboarding/riesgos");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Algo falló al guardar.");
      setSaving(false);
    }
  }

  return (
    <div className="flex flex-1 flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="font-serif text-[26px] leading-tight sm:text-[30px]">
          ¿Tienes horario de trabajo o estudio?
        </h1>
        <p className="text-[15px] leading-relaxed text-[var(--color-ink-2)]">
          Aliado lo usará para no molestarte cuando estés ocupado.
        </p>
      </div>

      <div className="flex items-center justify-between rounded-2xl border border-[var(--border)] bg-[var(--card)] px-4 py-3">
        <div>
          <Label htmlFor="no-fixed">No tengo un horario fijo</Label>
          <p className="text-xs text-[var(--color-ink-3)]">
            Saltamos este paso.
          </p>
        </div>
        <Switch
          id="no-fixed"
          checked={noFixed}
          onCheckedChange={setNoFixed}
        />
      </div>

      <div
        className={cn(
          "flex flex-col gap-5 transition-opacity",
          noFixed && "pointer-events-none opacity-40"
        )}
      >
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-2">
            <Label htmlFor="start">Empieza</Label>
            <Input
              id="start"
              type="time"
              value={start}
              onChange={(e) => setStart(e.target.value)}
              disabled={noFixed}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="end">Termina</Label>
            <Input
              id="end"
              type="time"
              value={end}
              onChange={(e) => setEnd(e.target.value)}
              disabled={noFixed}
            />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <Label>Días</Label>
          <div className="grid grid-cols-7 gap-2">
            {DAYS.map((d) => {
              const on = days.includes(d.num);
              return (
                <button
                  key={d.num}
                  type="button"
                  disabled={noFixed}
                  onClick={() => toggleDay(d.num)}
                  className={cn(
                    "flex h-11 items-center justify-center rounded-full border text-sm font-semibold transition-colors",
                    on
                      ? "border-[var(--color-primary)] bg-[var(--color-primary)] text-white"
                      : "border-[var(--color-hairline)] bg-[var(--card)] text-[var(--color-ink-2)] hover:border-[var(--color-primary)]"
                  )}
                  aria-pressed={on}
                  aria-label={`Día ${d.label}`}
                >
                  {d.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {error ? (
        <p className="text-sm text-[var(--color-warm)]">{error}</p>
      ) : null}

      <div className="mt-auto flex flex-col gap-3 pt-4">
        <Button
          size="lg"
          variant="primary"
          disabled={saving}
          onClick={handleNext}
        >
          {saving ? "Guardando..." : "Continuar"}
        </Button>
      </div>
    </div>
  );
}
