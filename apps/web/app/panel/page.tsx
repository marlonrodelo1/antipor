import Link from "next/link";
import { Flame } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StreakCircle } from "@/components/streak-circle";
import { MoodCheckin } from "@/components/mood-checkin";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

function greetingForHour(hour: number): string {
  if (hour < 6) return "Buenas noches";
  if (hour < 13) return "Buenos días";
  if (hour < 21) return "Buenas tardes";
  return "Buenas noches";
}

function reflectionFor(spiritualLayer: boolean): {
  text: string;
  source: string;
} {
  // Texto propio en español, sin reproducir versículos copyright.
  if (spiritualLayer) {
    return {
      text:
        "Hoy no se trata de no caer nunca, sino de levantarte cada vez. Lo que decidas en este minuto cuenta — aunque no se vea.",
      source: "Reflexión del día · Capa espiritual on",
    };
  }
  return {
    text:
      "Respira. Lo que sientes ahora no es lo que vas a sentir dentro de una hora. Tu yo de mañana te lo agradecerá.",
    source: "Reflexión del día",
  };
}

interface ProfileLite {
  display_name: string | null;
  spiritual_layer: boolean | null;
  aliado_name: string | null;
}

interface StreakLite {
  current_streak: number | null;
  best_streak: number | null;
}

export default async function PanelHomePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let profile: ProfileLite | null = null;
  let streak: StreakLite | null = null;

  if (user) {
    const { data: p } = await supabase
      .from("user_profile")
      .select("display_name, spiritual_layer, aliado_name")
      .eq("user_id", user.id)
      .maybeSingle();
    profile = p as ProfileLite | null;

    const { data: s } = await supabase
      .from("streaks")
      .select("current_streak, best_streak")
      .eq("user_id", user.id)
      .maybeSingle();
    streak = s as StreakLite | null;
  }

  const now = new Date();
  const hour = now.getHours();
  const greeting = greetingForHour(hour);
  const displayName = profile?.display_name ?? null;
  const aliadoName = profile?.aliado_name ?? "Aliado";
  const currentStreak = streak?.current_streak ?? 0;
  const bestStreak = streak?.best_streak ?? 0;
  const spiritual = profile?.spiritual_layer === true;
  const reflection = reflectionFor(spiritual);

  const subhead =
    currentStreak > 0
      ? `Llevas ${currentStreak} ${currentStreak === 1 ? "día" : "días"} contigo.`
      : "Hoy es un buen día para empezar.";

  return (
    <div className="mx-auto flex max-w-[1100px] flex-col gap-5 pb-28 md:pb-5">
      {/* Saludo */}
      <header className="flex flex-col gap-1">
        <div className="text-[13px] font-semibold text-[var(--color-ink-3)]">
          {greeting}
          {displayName ? `, ${displayName}` : ""}
        </div>
        <h1 className="font-serif text-[32px] leading-[1.1] md:text-[42px]">
          {displayName ? (
            <>
              {displayName},{" "}
              <em className="italic text-[var(--color-secondary)]">
                {subhead.toLowerCase()}
              </em>
            </>
          ) : (
            <em className="italic text-[var(--color-secondary)]">{subhead}</em>
          )}
        </h1>
      </header>

      {/* Racha + reflexión */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="flex flex-col items-center justify-center gap-3 p-6 md:col-span-1">
          <div className="relative flex items-center justify-center">
            <StreakCircle days={currentStreak} max={Math.max(30, bestStreak || 30)} size={180} />
            <div className="absolute flex flex-col items-center">
              <span className="font-serif text-[44px] leading-none text-[var(--color-secondary)]">
                {currentStreak}
              </span>
              <span className="mt-1 text-xs text-[var(--color-ink-3)]">
                {currentStreak === 1 ? "día" : "días"}
              </span>
            </div>
          </div>
          {bestStreak > 0 && (
            <div className="text-xs text-[var(--color-ink-3)]">
              Mejor racha: <strong>{bestStreak}</strong>
            </div>
          )}
        </Card>

        <Card
          className="border-l-[3px] p-6 md:col-span-2"
          style={{
            background: "var(--color-primary-soft)",
            borderLeftColor: "var(--color-primary)",
          }}
        >
          <blockquote className="font-serif text-[18px] italic leading-relaxed text-[var(--color-ink)] md:text-[20px]">
            {reflection.text}
          </blockquote>
          <div className="mt-3 text-xs text-[var(--color-ink-3)]">
            {reflection.source}
          </div>
        </Card>
      </div>

      {/* Mood check-in */}
      <Card className="p-6">
        <h2 className="font-serif text-lg font-medium">¿Cómo estás ahora?</h2>
        <p className="mt-1 text-sm text-[var(--color-ink-3)]">
          Tu check-in diario, en privado. Sin presión.
        </p>
        <div className="mt-5">
          <MoodCheckin hour={hour} dayOfWeek={now.getDay()} />
        </div>
      </Card>

      {/* CTA chat */}
      <Card className="flex flex-col items-start gap-3 p-6 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="font-serif text-lg font-medium">
            {aliadoName} está aquí
          </div>
          <p className="mt-0.5 text-sm text-[var(--color-ink-3)]">
            Habla cuando quieras. No hace falta motivo.
          </p>
        </div>
        <Link href="/panel/chat">
          <Button variant="primary" size="md">
            Abrir chat
          </Button>
        </Link>
      </Card>

      {/* Botón ROJO sticky bottom */}
      <div className="pointer-events-none fixed inset-x-0 bottom-0 z-30 flex justify-center px-4 pb-4 md:static md:px-0 md:pt-2">
        <Link
          href="/panel/impulso"
          className="pointer-events-auto w-full max-w-md md:max-w-none"
        >
          <Button
            variant="warm"
            size="lg"
            leftIcon={<Flame size={20} />}
            className="w-full shadow-[0_18px_40px_-12px_rgba(217,119,87,0.55)] md:w-auto md:px-10"
          >
            Tengo un impulso ahora
          </Button>
        </Link>
      </div>
    </div>
  );
}
