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

const PostSchema = z.object({
  content: z.string().trim().min(1).max(2000),
});

interface ChatMessageRow {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  created_at: string;
}

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "No autenticado." }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("chat_messages")
    .select("id, role, content, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(50);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const messages = (data ?? []).slice().reverse();
  return NextResponse.json({ messages });
}

export async function DELETE() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "No autenticado." }, { status: 401 });
  }

  const { error } = await supabase
    .from("chat_messages")
    .delete()
    .eq("user_id", user.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return new NextResponse(null, { status: 204 });
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

  const parsed = PostSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Datos invalidos", issues: parsed.error.flatten() },
      { status: 422 }
    );
  }
  const userContent = parsed.data.content;

  // 1. Persistimos mensaje del usuario (no PII en logs)
  const { error: insertUserErr } = await supabase
    .from("chat_messages")
    .insert({ user_id: user.id, role: "user", content: userContent });
  if (insertUserErr) {
    return NextResponse.json(
      { error: insertUserErr.message },
      { status: 500 }
    );
  }

  // 2. Crisis check ANTES de llamar al LLM
  if (containsCrisisKeyword(userContent)) {
    const { data: assistantRow } = await supabase
      .from("chat_messages")
      .insert({
        user_id: user.id,
        role: "assistant",
        content: CRISIS_DERIVATION_MESSAGE,
        context_snapshot: { crisis: true },
      })
      .select("id, content, created_at")
      .single();

    return NextResponse.json({
      assistant: {
        id: assistantRow?.id ?? null,
        content: CRISIS_DERIVATION_MESSAGE,
        createdAt: assistantRow?.created_at ?? new Date().toISOString(),
      },
      source: "crisis",
    });
  }

  // 3. Cargamos contexto + ultimos 10 mensajes
  const ctx = await loadPersonalizationContext(supabase, user.id);

  const { data: history } = await supabase
    .from("chat_messages")
    .select("role, content, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(10);

  const recentMessages = (history ?? [])
    .slice()
    .reverse()
    .filter(
      (m): m is ChatMessageRow & { role: "user" | "assistant" } =>
        m.role === "user" || m.role === "assistant"
    )
    .map((m) => ({ role: m.role, content: m.content }));

  // turn = numero de mensajes assistant ya enviados + 1 (este es el siguiente)
  const assistantCount = (history ?? []).filter(
    (m) => m.role === "assistant"
  ).length;
  const turn = assistantCount + 1;

  // 4. Construimos prompt y llamamos a DeepSeek (con fallback)
  const prompt = buildPersonalizedPrompt({ ctx, turn, recentMessages });
  const result = await callDeepseek(prompt, { temperature: 0.6 });
  const suggestedHobby = pickContextualHobby(ctx);

  // 5. Persistimos respuesta del assistant
  const { data: assistantRow, error: insertAssistantErr } = await supabase
    .from("chat_messages")
    .insert({
      user_id: user.id,
      role: "assistant",
      content: result.text,
      context_snapshot: {
        hour: ctx.currentHour,
        streak: ctx.currentStreak,
        mood: ctx.recentMood,
        suggestedHobby,
        source: result.source,
        turn,
      },
    })
    .select("id, content, created_at")
    .single();

  if (insertAssistantErr) {
    return NextResponse.json(
      { error: insertAssistantErr.message },
      { status: 500 }
    );
  }

  return NextResponse.json({
    assistant: {
      id: assistantRow?.id,
      content: assistantRow?.content,
      createdAt: assistantRow?.created_at,
    },
    suggestedHobby,
    source: result.source,
  });
}
