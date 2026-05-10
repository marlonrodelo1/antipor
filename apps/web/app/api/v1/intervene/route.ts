import { NextResponse } from "next/server";
import { z } from "zod";
import {
  buildPersonalizedPrompt,
  pickContextualHobby,
  containsCrisisKeyword,
  CRISIS_DERIVATION_MESSAGE,
} from "@antiport/ai";
import { createClient } from "@/lib/supabase/server";
import { loadPersonalizationContext } from "@/lib/ai/context";
import { callDeepseek } from "@/lib/ai/deepseek";

export const dynamic = "force-dynamic";

const InterveneSchema = z.object({
  context: z
    .object({
      mood: z.string().trim().max(40).optional(),
      source: z.string().trim().max(60).optional(),
      note: z.string().trim().max(500).optional(),
    })
    .default({}),
});

export async function POST(req: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "No autenticado." }, { status: 401 });
  }

  let body: unknown = {};
  try {
    body = await req.json();
  } catch {
    // body opcional
    body = {};
  }
  const parsed = InterveneSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Datos invalidos", issues: parsed.error.flatten() },
      { status: 422 }
    );
  }
  const inputCtx = parsed.data.context;

  // Crisis keyword en la nota opcional (si la persona ya escribio algo)
  const note = inputCtx.note ?? "";
  if (note && containsCrisisKeyword(note)) {
    const { data: log } = await supabase
      .from("intervention_log")
      .insert({
        user_id: user.id,
        category: inputCtx.source ?? "manual",
        mood: inputCtx.mood ?? null,
        suggested_action: "derivation_crisis",
      })
      .select("id")
      .single();

    return NextResponse.json({
      message: CRISIS_DERIVATION_MESSAGE,
      source: "crisis",
      interventionLogId: log?.id ?? null,
    });
  }

  // Cargamos contexto y construimos prompt de intervencion (turn 1, acogida)
  const ctx = await loadPersonalizationContext(supabase, user.id);
  if (inputCtx.mood) ctx.recentMood = inputCtx.mood;

  const prompt = buildPersonalizedPrompt({
    ctx,
    turn: 1,
    recentMessages: note
      ? [{ role: "user", content: note }]
      : undefined,
  });

  const result = await callDeepseek(prompt, { temperature: 0.55 });
  const suggestedHobby = pickContextualHobby(ctx);

  // Logueamos la intervencion sin URL ni PII
  const { data: log, error: logErr } = await supabase
    .from("intervention_log")
    .insert({
      user_id: user.id,
      category: inputCtx.source ?? "manual",
      mood: ctx.recentMood ?? inputCtx.mood ?? null,
      suggested_action: suggestedHobby,
      hobby_used: suggestedHobby,
    })
    .select("id")
    .single();

  if (logErr) {
    // No bloqueamos al usuario por un fallo de log
  }

  return NextResponse.json({
    message: result.text,
    source: result.source,
    suggestedHobby,
    interventionLogId: log?.id ?? null,
  });
}
