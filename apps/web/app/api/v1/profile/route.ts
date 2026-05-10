import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

const HHMM = /^([01]\d|2[0-3]):[0-5]\d$/;

const WorkScheduleSchema = z.object({
  start: z.string().regex(HHMM, "Formato HH:MM requerido"),
  end: z.string().regex(HHMM, "Formato HH:MM requerido"),
  days: z.array(z.number().int().min(0).max(6)).min(1).max(7),
});

const MotivationEnum = z.enum([
  "salud",
  "familia",
  "pareja",
  "fe",
  "autoestima",
  "otro",
]);

const ProfilePatchSchema = z
  .object({
    displayName: z.string().trim().max(60).nullable().optional(),
    avatarId: z.string().regex(/^avatar-[1-6]$/).nullable().optional(),
    hobbies: z.array(z.string().trim().min(1).max(40)).max(30).optional(),
    workSchedule: WorkScheduleSchema.nullable().optional(),
    riskHours: z
      .array(z.number().int().min(0).max(23))
      .max(24)
      .optional(),
    motivation: MotivationEnum.nullable().optional(),
    motivationOther: z.string().trim().max(120).nullable().optional(),
    spiritualLayer: z.boolean().optional(),
    spiritualTradition: z.string().trim().max(40).nullable().optional(),
    aliadoName: z.string().trim().min(1).max(40).optional(),
    tone: z.enum(["cercano", "formal"]).optional(),
    onboarded: z.boolean().optional(),
    language: z.string().trim().max(8).optional(),
  })
  .strict();

function toDbRow(input: z.infer<typeof ProfilePatchSchema>) {
  const row: Record<string, unknown> = {};
  if (input.displayName !== undefined) row.display_name = input.displayName;
  if (input.avatarId !== undefined) row.avatar_id = input.avatarId;
  if (input.hobbies !== undefined) row.hobbies = input.hobbies;
  if (input.workSchedule !== undefined) row.work_schedule = input.workSchedule;
  if (input.riskHours !== undefined) row.risk_hours = input.riskHours;
  if (input.motivation !== undefined) row.motivation = input.motivation;
  if (input.motivationOther !== undefined)
    row.motivation_other = input.motivationOther;
  if (input.spiritualLayer !== undefined)
    row.spiritual_layer = input.spiritualLayer;
  if (input.spiritualTradition !== undefined)
    row.spiritual_tradition = input.spiritualTradition;
  if (input.aliadoName !== undefined) row.aliado_name = input.aliadoName;
  if (input.tone !== undefined) row.tone = input.tone;
  if (input.onboarded !== undefined) row.onboarded = input.onboarded;
  if (input.language !== undefined) row.language = input.language;
  return row;
}

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "No autenticado." }, { status: 401 });
  }

  const [{ data: profile, error: pErr }, { data: streak }] = await Promise.all([
    supabase.from("user_profile").select("*").eq("user_id", user.id).maybeSingle(),
    supabase
      .from("streaks")
      .select("current_streak, longest_streak, last_clean_day")
      .eq("user_id", user.id)
      .maybeSingle(),
  ]);

  if (pErr) {
    return NextResponse.json({ error: pErr.message }, { status: 500 });
  }

  return NextResponse.json({
    profile: profile ?? null,
    streak: streak ?? {
      current_streak: 0,
      longest_streak: 0,
      last_clean_day: null,
    },
  });
}

export async function POST(req: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "No autenticado." }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "JSON invalido." }, { status: 400 });
  }

  const parsed = ProfilePatchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Datos invalidos", issues: parsed.error.flatten() },
      { status: 422 }
    );
  }

  // Validacion semantica: motivation_other solo tiene sentido si motivation = otro
  if (
    parsed.data.motivation &&
    parsed.data.motivation !== "otro" &&
    parsed.data.motivationOther
  ) {
    return NextResponse.json(
      { error: "motivationOther solo aplica cuando motivation = otro." },
      { status: 422 }
    );
  }

  const row = { user_id: user.id, ...toDbRow(parsed.data) };

  const { data, error } = await supabase
    .from("user_profile")
    .upsert(row, { onConflict: "user_id" })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ profile: data });
}
