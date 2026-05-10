"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  HeartPulse,
  Users,
  HeartHandshake,
  Sparkles,
  Smile,
  Asterisk,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MotivationCard } from "@/components/motivation-card";
import { patchProfile, type Motivation } from "@/lib/profile";

const OPTIONS: {
  value: Motivation;
  label: string;
  icon: typeof HeartPulse;
}[] = [
  { value: "salud", label: "Salud mental", icon: HeartPulse },
  { value: "familia", label: "Familia", icon: Users },
  { value: "pareja", label: "Pareja", icon: HeartHandshake },
  { value: "fe", label: "Fe", icon: Sparkles },
  { value: "autoestima", label: "Autoestima", icon: Smile },
  { value: "otro", label: "Otro", icon: Asterisk },
];

export default function MotivacionPage() {
  const router = useRouter();
  const [selected, setSelected] = useState<Motivation | null>(null);
  const [other, setOther] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const otherInvalid =
    selected === "otro" && other.trim().length === 0;

  async function handleNext() {
    if (!selected) return;
    if (otherInvalid) {
      setError("Cuéntanos qué te trae aquí.");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      await patchProfile({
        motivation: selected,
        motivation_other: selected === "otro" ? other.trim() : null,
      });
      router.push("/onboarding/hobbies");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Algo falló al guardar.");
      setSaving(false);
    }
  }

  return (
    <div className="flex flex-1 flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="font-serif text-[26px] leading-tight sm:text-[30px]">
          ¿Qué te trae aquí?
        </h1>
        <p className="text-[15px] leading-relaxed text-[var(--color-ink-2)]">
          Tu razón principal. Aliado la tendrá presente.
        </p>
      </div>

      <div
        role="radiogroup"
        aria-label="Tu motivación principal"
        className="grid grid-cols-1 gap-3 sm:grid-cols-2"
      >
        {OPTIONS.map((o) => (
          <MotivationCard
            key={o.value}
            icon={o.icon}
            label={o.label}
            value={o.value}
            selected={selected === o.value}
            onSelect={(v) => setSelected(v as Motivation)}
          />
        ))}
      </div>

      {selected === "otro" ? (
        <div className="flex flex-col gap-2">
          <Label htmlFor="motivation-other">Cuéntanos en una frase</Label>
          <Input
            id="motivation-other"
            maxLength={120}
            value={other}
            onChange={(e) => setOther(e.target.value)}
            placeholder="Por ejemplo: quiero recuperar concentración..."
          />
        </div>
      ) : null}

      {error ? (
        <p className="text-sm text-[var(--color-warm)]">{error}</p>
      ) : null}

      <div className="mt-auto flex flex-col gap-3 pt-4">
        <Button
          size="lg"
          variant="primary"
          disabled={!selected || otherInvalid || saving}
          onClick={handleNext}
        >
          {saving ? "Guardando..." : "Continuar"}
        </Button>
      </div>
    </div>
  );
}
