import { Award, Flame, Leaf, MessageCircle, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AliadoAvatar } from "@/components/aliado-avatar";

const stats = [
  {
    label: "Racha actual",
    value: "14",
    unit: "días",
    color: "var(--color-secondary)",
    Icon: Leaf,
  },
  {
    label: "Mejor racha",
    value: "32",
    unit: "días",
    color: "var(--color-accent)",
    Icon: Award,
  },
  {
    label: "Resistidos",
    value: "46",
    unit: "este mes",
    color: "var(--color-primary)",
    Icon: ShieldCheck,
  },
  {
    label: "Con Aliado",
    value: "2h 14m",
    unit: "esta semana",
    color: "var(--color-warm)",
    Icon: MessageCircle,
  },
];

const triggers = [
  { name: "Aburrimiento", pct: 38 },
  { name: "Cansancio", pct: 28 },
  { name: "Soledad", pct: 22 },
  { name: "Estrés", pct: 12 },
];

const moodOptions = ["Bien", "Tranquilo", "Cansado", "Inquieto", "Vacío"];

export default function PanelHomePage() {
  return (
    <div className="mx-auto flex max-w-[1180px] flex-col gap-5">
      <header className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
        <div>
          <div className="text-[13px] font-semibold text-[var(--color-ink-3)]">
            Buenos días
          </div>
          <h1 className="mt-1 font-serif text-[34px] leading-[1.1] md:text-[40px]">
            Llevas{" "}
            <em className="italic text-[var(--color-secondary)]">14 días</em>{" "}
            contigo.
          </h1>
        </div>
        <Button variant="warm" size="md" leftIcon={<Flame size={16} />}>
          Tengo un impulso
        </Button>
      </header>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {stats.map((s) => (
          <Card key={s.label} className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold uppercase tracking-wide text-[var(--color-ink-3)]">
                {s.label}
              </span>
              <s.Icon size={16} style={{ color: s.color }} />
            </div>
            <div
              className="mt-2.5 font-serif text-[32px] font-medium leading-none"
              style={{ color: s.color }}
            >
              {s.value}
            </div>
            <div className="mt-1 text-xs text-[var(--color-ink-3)]">
              {s.unit}
            </div>
          </Card>
        ))}
      </div>

      {/* Mood + Aliado */}
      <div className="grid gap-3 md:grid-cols-3">
        <Card className="md:col-span-2 p-6">
          <h2 className="font-serif text-lg font-medium">¿Cómo estás ahora?</h2>
          <p className="mt-1 text-sm text-[var(--color-ink-3)]">
            Tu check-in diario, en privado. Sin presión.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {moodOptions.map((m) => (
              <button
                key={m}
                type="button"
                className="rounded-full border border-[var(--color-hairline)] bg-white px-4 py-2 text-sm text-[var(--color-ink-2)] transition-colors hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]"
              >
                {m}
              </button>
            ))}
          </div>
        </Card>

        <Card className="flex flex-col items-center justify-center gap-3 p-6 text-center">
          <AliadoAvatar size={88} state="reposo" tone="primary" />
          <div className="font-serif text-base font-medium">
            Aliado está aquí
          </div>
          <p className="text-xs text-[var(--color-ink-3)]">
            Toca cuando lo necesites.
          </p>
          <Button size="sm" variant="primary">
            Hablar
          </Button>
        </Card>
      </div>

      {/* Pattern + reflection */}
      <div className="grid gap-3 md:grid-cols-2">
        <Card
          className="p-6"
          style={{
            background: "var(--color-warm-bg)",
            borderColor: "var(--color-warm-soft)",
          }}
        >
          <div className="text-[11px] font-semibold uppercase tracking-wider text-[var(--color-warm)]">
            Patrón detectado
          </div>
          <p className="mt-2 text-[15px] leading-relaxed text-[var(--color-ink)]">
            Sueles tener impulsos los <strong>domingos por la noche</strong>{" "}
            cuando registras &ldquo;aburrimiento&rdquo;. Esta semana planea algo
            entre las 22 y 24h.
          </p>
        </Card>
        <Card
          className="border-l-[3px] p-6"
          style={{
            background: "var(--color-primary-soft)",
            borderLeftColor: "var(--color-primary)",
          }}
        >
          <blockquote className="font-serif text-[17px] italic leading-relaxed text-[var(--color-ink)]">
            &ldquo;Lo importante no es no caer nunca. Es levantarse cada vez que
            cae uno.&rdquo;
          </blockquote>
          <div className="mt-3 text-xs text-[var(--color-ink-3)]">
            Reflexión del día ·{" "}
            <span className="font-semibold text-[var(--color-primary)]">
              Capa espiritual on
            </span>
          </div>
        </Card>
      </div>

      {/* Triggers */}
      <Card className="p-6">
        <h2 className="font-serif text-lg font-medium">Tus triggers</h2>
        <div className="mt-4 flex flex-col gap-3">
          {triggers.map((t) => (
            <div key={t.name}>
              <div className="mb-1.5 flex justify-between text-sm">
                <span className="font-medium text-[var(--color-ink-2)]">
                  {t.name}
                </span>
                <span className="text-[var(--color-ink-3)]">{t.pct}%</span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-[var(--color-hairline)]">
                <div
                  className="h-full rounded-full bg-[var(--color-primary)]"
                  style={{ width: `${t.pct}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
