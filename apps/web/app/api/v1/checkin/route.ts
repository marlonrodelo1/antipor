import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

const CheckinSchema = z.object({
  userId: z.string().min(1),
  mood: z.enum(["bien", "tranquilo", "cansado", "inquieto", "vacio"]),
  hour: z.number().int().min(0).max(23),
  dayOfWeek: z.number().int().min(0).max(6),
  intensity: z.number().int().min(0).max(10),
});

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { error: "JSON inválido en el cuerpo." },
      { status: 400 }
    );
  }

  const parsed = CheckinSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Datos no válidos", issues: parsed.error.flatten() },
      { status: 422 }
    );
  }

  // Anonymized: we store mood/hour/dayOfWeek/intensity, never URLs.
  const { userId, mood, hour, dayOfWeek, intensity } = parsed.data;

  try {
    const supabase = await createClient();
    const { error } = await supabase.from("daily_checkins").insert({
      user_id: userId,
      mood,
      hour,
      day_of_week: dayOfWeek,
      intensity,
    });
    if (error) throw error;
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json(
      {
        error:
          err instanceof Error
            ? err.message
            : "No se pudo registrar el check-in.",
      },
      { status: 500 }
    );
  }
}
