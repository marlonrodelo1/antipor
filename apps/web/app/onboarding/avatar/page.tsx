"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { AvatarPicker } from "@/components/avatar-picker";
import { patchProfile } from "@/lib/profile";

export default function AvatarPage() {
  const router = useRouter();
  const [selected, setSelected] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleNext() {
    if (!selected) return;
    setSaving(true);
    setError(null);
    try {
      await patchProfile({ avatar_id: selected });
      router.push("/onboarding/nombre");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Algo falló al guardar.");
      setSaving(false);
    }
  }

  return (
    <div className="flex flex-1 flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="font-serif text-[26px] leading-tight sm:text-[30px]">
          Elige tu avatar
        </h1>
        <p className="text-[15px] leading-relaxed text-[var(--color-ink-2)]">
          Es solo visual y privado. Lo verás en tu panel.
        </p>
      </div>

      <AvatarPicker selected={selected} onChange={setSelected} />

      {error ? (
        <p className="text-sm text-[var(--color-warm)]">{error}</p>
      ) : null}

      <div className="mt-auto flex flex-col gap-3 pt-4">
        <Button
          size="lg"
          variant="primary"
          disabled={!selected || saving}
          onClick={handleNext}
        >
          {saving ? "Guardando..." : "Continuar"}
        </Button>
      </div>
    </div>
  );
}
