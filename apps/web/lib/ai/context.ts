import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { PersonalizationContext } from "@antiport/ai";

/**
 * Carga el contexto de personalizacion para un usuario:
 * - Perfil extendido (avatar, hobbies, horarios, motivacion, capa espiritual...)
 * - Racha actual (current_streak)
 * - Mood reciente (ultimo daily_checkin)
 *
 * Devuelve una estructura completa lista para `buildPersonalizedPrompt`.
 * Si faltan datos, rellena con defaults seguros.
 */
export async function loadPersonalizationContext(
  supabase: SupabaseClient,
  userId: string
): Promise<PersonalizationContext> {
  const [{ data: profile }, { data: streak }, { data: lastCheckin }] =
    await Promise.all([
      supabase
        .from("user_profile")
        .select(
          "display_name, avatar_id, hobbies, work_schedule, risk_hours, motivation, motivation_other, spiritual_layer, spiritual_tradition, aliado_name, tone"
        )
        .eq("user_id", userId)
        .maybeSingle(),
      supabase
        .from("streaks")
        .select("current_streak")
        .eq("user_id", userId)
        .maybeSingle(),
      supabase
        .from("daily_checkins")
        .select("mood, day")
        .eq("user_id", userId)
        .order("day", { ascending: false })
        .limit(1)
        .maybeSingle(),
    ]);

  const tone = (profile?.tone === "formal" ? "formal" : "cercano") as
    | "cercano"
    | "formal";

  const work = profile?.work_schedule as
    | { start: string; end: string; days: number[] }
    | null
    | undefined;

  return {
    displayName: profile?.display_name ?? null,
    avatarId: profile?.avatar_id ?? null,
    hobbies: Array.isArray(profile?.hobbies) ? profile!.hobbies : [],
    workSchedule:
      work && typeof work === "object" && "start" in work && "end" in work
        ? {
            start: String(work.start),
            end: String(work.end),
            days: Array.isArray(work.days) ? work.days : [1, 2, 3, 4, 5],
          }
        : null,
    riskHours: Array.isArray(profile?.risk_hours) ? profile!.risk_hours : [],
    motivation: profile?.motivation ?? null,
    motivationOther: profile?.motivation_other ?? null,
    spiritualLayer: Boolean(profile?.spiritual_layer),
    spiritualTradition: profile?.spiritual_tradition ?? null,
    aliadoName: profile?.aliado_name?.trim() || "Aliado",
    aliadoTone: tone,
    currentStreak: streak?.current_streak ?? 0,
    recentMood: lastCheckin?.mood ?? null,
    currentHour: new Date().getHours(),
  };
}
