"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { HobbyChips } from "@/components/hobby-chips";
import { patchProfile } from "@/lib/profile";

export default function HobbiesPage() {
  const router = useRouter();
  const [hobbies, setHobbies] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleNext() {
    if (hobbies.length === 0) return;
    setSaving(true);
    setError(null);
    try {
      await patchProfile({ hobbies });
      router.push("/onboarding/horario");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Algo falló al guardar.");
      setSaving(false);
    }
  }

  return (
    <div className="flex flex-1 flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="font-serif text-[26px] leading-tight sm:text-[30px]">
          ¿Qué te gusta hacer?
        </h1>
        <p className="text-[15px] leading-relaxed text-[var(--color-ink-2)]">
          Aliado las usará cuando te sugiera alternativas. Marca al menos una.
        </p>
      </div>

      <HobbyChips value={hobbies} onChange={setHobbies} />

      {error ? (
        <p className="text-sm text-[var(--color-warm)]">{error}</p>
      ) : null}

      <div className="mt-auto flex flex-col gap-3 pt-4">
        <Button
          size="lg"
          variant="primary"
          disabled={hobbies.length === 0 || saving}
          onClick={handleNext}
        >
          {saving
            ? "Guardando..."
            : hobbies.length === 0
            ? "Marca al menos una"
            : `Continuar (${hobbies.length})`}
        </Button>
      </div>
    </div>
  );
}
