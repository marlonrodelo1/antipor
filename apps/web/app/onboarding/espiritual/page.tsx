"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { patchProfile } from "@/lib/profile";

const TRADITIONS = [
  { value: "cristiana", label: "Cristiana general" },
  { value: "catolica", label: "Católica" },
  { value: "evangelica", label: "Evangélica" },
  { value: "otra", label: "Otra" },
];

export default function EspiritualPage() {
  const router = useRouter();
  const [enabled, setEnabled] = useState(false);
  const [tradition, setTradition] = useState<string | null>(null);
  const [otherText, setOtherText] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const traditionInvalid =
    enabled &&
    (!tradition || (tradition === "otra" && otherText.trim().length === 0));

  async function handleNext() {
    if (traditionInvalid) {
      setError("Elige una tradición o desactiva la capa.");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      const value =
        !enabled
          ? null
          : tradition === "otra"
          ? otherText.trim()
          : tradition;
      await patchProfile({
        spiritual_layer: enabled,
        spiritual_tradition: value,
      });
      router.push("/onboarding/aliado");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Algo falló al guardar.");
      setSaving(false);
    }
  }

  return (
    <div className="flex flex-1 flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="font-serif text-[26px] leading-tight sm:text-[30px]">
          Capa espiritual
        </h1>
        <p className="text-[15px] leading-relaxed text-[var(--color-ink-2)]">
          Si la activas, Aliado te puede compartir un versículo o reflexión
          cuando encaje. Si no, la app es 100% secular.
        </p>
      </div>

      <div className="flex items-center justify-between rounded-2xl border border-[var(--border)] bg-[var(--card)] px-4 py-4">
        <div>
          <Label htmlFor="spiritual-toggle">Activar capa espiritual</Label>
          <p className="text-xs text-[var(--color-ink-3)]">
            Puedes cambiarlo cuando quieras.
          </p>
        </div>
        <Switch
          id="spiritual-toggle"
          checked={enabled}
          onCheckedChange={(v) => {
            setEnabled(v);
            if (!v) {
              setTradition(null);
              setOtherText("");
            }
          }}
        />
      </div>

      <div
        className={cn(
          "flex flex-col gap-3 transition-opacity",
          !enabled && "pointer-events-none opacity-40"
        )}
      >
        <Label>Tradición</Label>
        <div
          role="radiogroup"
          aria-label="Tradición espiritual"
          className="grid grid-cols-2 gap-2"
        >
          {TRADITIONS.map((t) => {
            const on = tradition === t.value;
            return (
              <button
                key={t.value}
                type="button"
                role="radio"
                aria-checked={on}
                onClick={() => setTradition(t.value)}
                disabled={!enabled}
                className={cn(
                  "rounded-2xl border px-4 py-3 text-left text-sm font-medium transition-colors",
                  on
                    ? "border-[var(--color-primary)] bg-[var(--color-primary-soft)] text-[var(--color-primary)]"
                    : "border-[var(--border)] bg-[var(--card)] text-[var(--color-ink-2)] hover:border-[var(--color-primary)]"
                )}
              >
                {t.label}
              </button>
            );
          })}
        </div>

        {tradition === "otra" ? (
          <div className="flex flex-col gap-2">
            <Label htmlFor="other-tradition">Cuéntanos cuál</Label>
            <Input
              id="other-tradition"
              maxLength={60}
              value={otherText}
              onChange={(e) => setOtherText(e.target.value)}
              placeholder="Tu tradición..."
              disabled={!enabled}
            />
          </div>
        ) : null}
      </div>

      {error ? (
        <p className="text-sm text-[var(--color-warm)]">{error}</p>
      ) : null}

      <div className="mt-auto flex flex-col gap-3 pt-4">
        <Button
          size="lg"
          variant="primary"
          disabled={saving || (enabled && traditionInvalid)}
          onClick={handleNext}
        >
          {saving ? "Guardando..." : "Continuar"}
        </Button>
      </div>
    </div>
  );
}
