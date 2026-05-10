import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

const OutcomeSchema = z.object({
  interventionLogId: z.string().uuid(),
  outcome: z.enum([
    "resisted",
    "breathed",
    "contacted",
    "relapsed",
    "dismissed",
  ]),
  durationSeconds: z.number().int().min(0).max(60 * 60).optional(),
});

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

  const parsed = OutcomeSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Datos invalidos", issues: parsed.error.flatten() },
      { status: 422 }
    );
  }

  const { interventionLogId, outcome, durationSeconds } = parsed.data;

  const update: Record<string, unknown> = { outcome };
  if (durationSeconds !== undefined) update.duration_seconds = durationSeconds;

  const { data, error } = await supabase
    .from("intervention_log")
    .update(update)
    .eq("id", interventionLogId)
    .eq("user_id", user.id)
    .select("id, outcome, duration_seconds")
    .maybeSingle();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  if (!data) {
    return NextResponse.json(
      { error: "Intervencion no encontrada." },
      { status: 404 }
    );
  }

  return NextResponse.json({ ok: true, log: data });
}
