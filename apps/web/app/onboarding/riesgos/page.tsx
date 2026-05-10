"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { RiskHoursClock } from "@/components/risk-hours-clock";
import { patchProfile } from "@/lib/profile";

export default function RiesgosPage() {
  const router = useRouter();
  const [hours, setHours] = useState<number[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleNext() {
    setSaving(true);
    setError(null);
    try {
      await patchProfile({ risk_hours: hours });
      router.push("/onboarding/espiritual");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Algo falló al guardar.");
      setSaving(false);
    }
  }

  return (
    <div className="flex flex-1 flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="font-serif text-[26px] leading-tight sm:text-[30px]">
          ¿Qué horas son las más difíciles para ti?
        </h1>
        <p className="text-[15px] leading-relaxed text-[var(--color-ink-2)]">
          La mayoría de personas reportan las horas de la noche. Marca las
          tuyas. Si no estás seguro, sáltalo.
        </p>
      </div>

      <RiskHoursClock value={hours} onChange={setHours} />

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
          {saving
            ? "Guardando..."
            : hours.length === 0
            ? "Continuar sin marcar"
            : "Continuar"}
        </Button>
      </div>
    </div>
  );
}
