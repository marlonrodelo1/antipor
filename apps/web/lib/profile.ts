/**
 * Cliente para el endpoint de perfil. El backend acepta partial updates vía POST.
 * Se llama desde componentes "use client" del onboarding y el panel.
 */

export type AliadoTone = "cercano" | "formal";
export type AliadoGender = "neutro" | "masculino" | "femenino";
export type Motivation =
  | "salud"
  | "familia"
  | "pareja"
  | "fe"
  | "autoestima"
  | "otro";

export interface WorkSchedule {
  start: string; // "HH:MM"
  end: string; // "HH:MM"
  days: number[]; // 1=L ... 7=D
}

export interface Profile {
  display_name: string | null;
  language: string | null;
  tone: AliadoTone | null;
  aliado_name: string | null;
  aliado_gender: AliadoGender | null;
  spiritual_layer: boolean | null;
  spiritual_tradition: string | null;
  anonymous: boolean | null;
  avatar_id: string | null;
  hobbies: string[] | null;
  work_schedule: WorkSchedule | null;
  risk_hours: number[] | null;
  motivation: Motivation | null;
  motivation_other: string | null;
  recovery_code_hash: string | null;
  onboarded: boolean | null;
}

export type ProfilePatch = Partial<Profile>;

const ENDPOINT = "/api/v1/profile";

export async function patchProfile(slice: ProfilePatch): Promise<void> {
  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(slice),
    credentials: "same-origin",
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(
      `patchProfile failed: ${res.status} ${res.statusText}${
        text ? ` — ${text}` : ""
      }`
    );
  }
}

export async function getProfile(): Promise<Profile | null> {
  const res = await fetch(ENDPOINT, {
    method: "GET",
    credentials: "same-origin",
    cache: "no-store",
  });
  if (res.status === 404) return null;
  if (!res.ok) {
    throw new Error(`getProfile failed: ${res.status} ${res.statusText}`);
  }
  const data = (await res.json()) as { profile?: Profile } | Profile;
  if (data && typeof data === "object" && "profile" in data) {
    return (data as { profile: Profile }).profile ?? null;
  }
  return data as Profile;
}
