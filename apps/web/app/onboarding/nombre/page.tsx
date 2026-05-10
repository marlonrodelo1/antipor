"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { patchProfile } from "@/lib/profile";

const nameSchema = z
  .string()
  .trim()
  .min(1)
  .max(40, "Máximo 40 caracteres.");

export default function NombrePage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function persistAndGo(displayName: string | null) {
    setSaving(true);
    setError(null);
    try {
      await patchProfile({
        display_name: displayName,
      });
      router.push("/onboarding/motivacion");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Algo falló al guardar.");
      setSaving(false);
    }
  }

  async function handleContinue() {
    const trimmed = name.trim();
    if (!trimmed) {
      await persistAndGo(null);
      return;
    }
    const parsed = nameSchema.safeParse(trimmed);
    if (!parsed.success) {
      setError(parsed.error.errors[0]?.message ?? "Nombre no válido.");
      return;
    }
    await persistAndGo(parsed.data);
  }

  async function handleSkip() {
    await persistAndGo(null);
  }

  return (
    <div className="flex flex-1 flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="font-serif text-[26px] leading-tight sm:text-[30px]">
          ¿Cómo te llamamos?
        </h1>
        <p className="text-[15px] leading-relaxed text-[var(--color-ink-2)]">
          Solo se queda en tu cuenta. Puedes saltarlo.
        </p>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="display-name">Tu nombre o apodo</Label>
        <Input
          id="display-name"
          autoComplete="off"
          maxLength={40}
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Marlon, Capitán, M..."
        />
        <p className="text-xs text-[var(--color-ink-3)]">
          Aliado lo usará para hablarte de tú a tú. Si lo dejas en blanco, te
          tratará en neutro.
        </p>
      </div>

      {error ? (
        <p className="text-sm text-[var(--color-warm)]">{error}</p>
      ) : null}

      <div className="mt-auto flex flex-col gap-3 pt-4 sm:flex-row sm:justify-end">
        <Button
          size="lg"
          variant="ghost"
          disabled={saving}
          onClick={handleSkip}
        >
          Saltar
        </Button>
        <Button
          size="lg"
          variant="primary"
          disabled={saving}
          onClick={handleContinue}
        >
          {saving ? "Guardando..." : "Continuar"}
        </Button>
      </div>
    </div>
  );
}
