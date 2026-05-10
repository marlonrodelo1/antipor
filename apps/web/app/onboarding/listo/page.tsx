"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getProfile, patchProfile, type Profile } from "@/lib/profile";

export default function ListoPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [entering, setEntering] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const p = await getProfile();
        if (!cancelled) setProfile(p);
      } catch (e) {
        if (!cancelled) {
          setError(
            e instanceof Error ? e.message : "No pudimos cargar tu perfil."
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  async function handleEnter() {
    setEntering(true);
    setError(null);
    try {
      await patchProfile({ onboarded: true });
      router.push("/panel");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Algo falló al guardar.");
      setEntering(false);
    }
  }

  return (
    <div className="flex flex-1 flex-col gap-6">
      <div className="flex flex-col items-center gap-3 text-center">
        <span className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-[var(--color-secondary)] text-white">
          <CheckCircle2 size={32} />
        </span>
        <h1 className="font-serif text-[28px] leading-tight sm:text-[32px]">
          Listo. {profile?.aliado_name ?? "Aliado"} ya te conoce.
        </h1>
        <p className="text-[15px] leading-relaxed text-[var(--color-ink-2)]">
          Esto es lo que ha quedado guardado. Puedes cambiarlo en ajustes
          cuando quieras.
        </p>
      </div>

      <Card className="flex flex-col gap-4 p-5">
        {loading ? (
          <p className="text-sm text-[var(--color-ink-3)]">Cargando...</p>
        ) : profile ? (
          <ProfileSummary profile={profile} />
        ) : (
          <p className="text-sm text-[var(--color-ink-3)]">
            No pudimos cargar el resumen, pero todo se guardó.
          </p>
        )}
      </Card>

      {error ? (
        <p className="text-sm text-[var(--color-warm)]">{error}</p>
      ) : null}

      <div className="mt-auto flex flex-col gap-3 pt-4">
        <Button
          size="lg"
          variant="primary"
          disabled={entering}
          onClick={handleEnter}
        >
          {entering ? "Entrando..." : "Entrar"}
        </Button>
      </div>
    </div>
  );
}

function ProfileSummary({ profile }: { profile: Profile }) {
  const rows: { label: string; value: string }[] = [];
  if (profile.display_name) rows.push({ label: "Nombre", value: profile.display_name });
  if (profile.motivation) {
    const map: Record<string, string> = {
      salud: "Salud mental",
      familia: "Familia",
      pareja: "Pareja",
      fe: "Fe",
      autoestima: "Autoestima",
      otro: profile.motivation_other ?? "Otro",
    };
    rows.push({ label: "Motivación", value: map[profile.motivation] ?? profile.motivation });
  }
  if (profile.hobbies && profile.hobbies.length > 0) {
    rows.push({ label: "Hobbies", value: profile.hobbies.join(", ") });
  }
  if (profile.work_schedule) {
    rows.push({
      label: "Horario",
      value: `${profile.work_schedule.start} – ${profile.work_schedule.end}`,
    });
  }
  if (profile.risk_hours && profile.risk_hours.length > 0) {
    rows.push({
      label: "Horas difíciles",
      value: profile.risk_hours
        .map((h) => `${h.toString().padStart(2, "0")}:00`)
        .join(", "),
    });
  }
  if (profile.spiritual_layer) {
    rows.push({
      label: "Capa espiritual",
      value: profile.spiritual_tradition ?? "Activada",
    });
  }
  if (profile.aliado_name) {
    rows.push({
      label: "Aliado",
      value: `${profile.aliado_name}${
        profile.tone ? ` · tono ${profile.tone}` : ""
      }`,
    });
  }

  return (
    <div className="flex flex-col gap-3">
      {profile.avatar_id ? (
        <div className="flex items-center gap-3">
          <Image
            src={`/avatars/${profile.avatar_id}.svg`}
            alt="Tu avatar"
            width={56}
            height={56}
            unoptimized
            className="rounded-full"
          />
          <span className="text-sm text-[var(--color-ink-2)]">
            Tu avatar
          </span>
        </div>
      ) : null}
      <dl className="grid grid-cols-1 gap-2 text-sm">
        {rows.map((r) => (
          <div
            key={r.label}
            className="flex flex-col border-b border-[var(--border)] py-2 last:border-b-0"
          >
            <dt className="text-[11px] font-semibold uppercase tracking-wider text-[var(--color-ink-3)]">
              {r.label}
            </dt>
            <dd className="mt-0.5 text-[15px] text-[var(--foreground)]">
              {r.value}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
