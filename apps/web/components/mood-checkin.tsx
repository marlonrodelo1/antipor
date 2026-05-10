"use client";
import { useState } from "react";
import { CloudRain, Frown, Heart, Meh, Smile } from "lucide-react";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/browser";

type Mood = "bien" | "tranquilo" | "cansado" | "inquieto" | "vacio";

const OPTIONS: {
  id: Mood;
  label: string;
  Icon: typeof Heart;
  color: string;
}[] = [
  { id: "bien", label: "Bien", Icon: Heart, color: "var(--color-secondary)" },
  {
    id: "tranquilo",
    label: "Tranquilo",
    Icon: Smile,
    color: "var(--color-primary)",
  },
  { id: "cansado", label: "Cansado", Icon: Meh, color: "var(--color-ink-3)" },
  {
    id: "inquieto",
    label: "Inquieto",
    Icon: Frown,
    color: "var(--color-warm)",
  },
  { id: "vacio", label: "Vacío", Icon: CloudRain, color: "var(--color-accent)" },
];

interface Props {
  hour: number;
  dayOfWeek: number;
}

export function MoodCheckin({ hour, dayOfWeek }: Props) {
  const [selected, setSelected] = useState<Mood | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function pick(mood: Mood) {
    setSelected(mood);
    setSaving(true);
    setError(null);
    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        setError("Sin sesión.");
        return;
      }
      const intensity =
        mood === "bien" || mood === "tranquilo" ? 2 : mood === "cansado" ? 5 : 7;
      const res = await fetch("/api/v1/checkin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          mood,
          hour,
          dayOfWeek,
          intensity,
        }),
      });
      if (!res.ok) {
        const text = await res.text().catch(() => "");
        setError(text || "No se pudo registrar.");
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error de red.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="grid grid-cols-5 gap-2">
        {OPTIONS.map((opt) => {
          const isActive = selected === opt.id;
          return (
            <button
              key={opt.id}
              type="button"
              disabled={saving}
              onClick={() => pick(opt.id)}
              aria-label={opt.label}
              aria-pressed={isActive}
              className={cn(
                "flex flex-col items-center gap-1.5 rounded-2xl border bg-white px-2 py-3 text-[11px] font-medium transition-all",
                isActive
                  ? "border-[var(--color-primary)] shadow-sm"
                  : "border-[var(--color-hairline)] hover:border-[var(--color-primary)]"
              )}
              style={{
                color: isActive ? opt.color : "var(--color-ink-2)",
              }}
            >
              <opt.Icon size={22} style={{ color: opt.color }} />
              {opt.label}
            </button>
          );
        })}
      </div>
      {selected && !error && !saving && (
        <p className="text-xs text-[var(--color-ink-3)]">
          Anotado. Gracias por contártelo.
        </p>
      )}
      {error && (
        <p className="text-xs text-[var(--color-warm)]">{error}</p>
      )}
    </div>
  );
}
