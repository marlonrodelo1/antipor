"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { patchProfile, type AliadoTone } from "@/lib/profile";

const nameSchema = z.string().trim().min(1).max(30);

const TONES: {
  value: AliadoTone;
  label: string;
  description: string;
}[] = [
  {
    value: "cercano",
    label: "Cercano",
    description: "Te habla de tú, con calidez. Como un amigo.",
  },
  {
    value: "formal",
    label: "Formal",
    description: "Respetuoso y sereno. Sin coleguismo.",
  },
];

export default function AliadoPage() {
  const router = useRouter();
  const [aliadoName, setAliadoName] = useState("Aliado");
  const [tone, setTone] = useState<AliadoTone>("cercano");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleNext() {
    const parsed = nameSchema.safeParse(aliadoName);
    if (!parsed.success) {
      setError("El nombre tiene que tener entre 1 y 30 caracteres.");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      await patchProfile({
        aliado_name: parsed.data,
        tone,
      });
      router.push("/onboarding/listo");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Algo falló al guardar.");
      setSaving(false);
    }
  }

  return (
    <div className="flex flex-1 flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="font-serif text-[26px] leading-tight sm:text-[30px]">
          ¿Cómo se llamará tu Aliado?
        </h1>
        <p className="text-[15px] leading-relaxed text-[var(--color-ink-2)]">
          Es la voz que te acompañará. Tú decides el nombre y el tono.
        </p>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="aliado-name">Nombre</Label>
        <Input
          id="aliado-name"
          maxLength={30}
          value={aliadoName}
          onChange={(e) => setAliadoName(e.target.value)}
          placeholder="Aliado"
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label>Tono</Label>
        <div
          role="radiogroup"
          aria-label="Tono del aliado"
          className="grid grid-cols-1 gap-3 sm:grid-cols-2"
        >
          {TONES.map((t) => {
            const on = tone === t.value;
            return (
              <button
                key={t.value}
                type="button"
                role="radio"
                aria-checked={on}
                onClick={() => setTone(t.value)}
                className={cn(
                  "flex flex-col gap-1 rounded-2xl border px-4 py-4 text-left transition-colors",
                  on
                    ? "border-[var(--color-primary)] bg-[var(--color-primary-soft)]"
                    : "border-[var(--border)] bg-[var(--card)] hover:border-[var(--color-primary)]"
                )}
              >
                <span className="text-[15px] font-semibold text-[var(--foreground)]">
                  {t.label}
                </span>
                <span className="text-xs leading-relaxed text-[var(--color-ink-3)]">
                  {t.description}
                </span>
              </button>
            );
          })}
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
