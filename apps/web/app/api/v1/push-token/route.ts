import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

const PushTokenSchema = z.object({
  token: z.string().min(8).max(2048),
  platform: z.enum(["ios", "android", "web"]),
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

  const parsed = PushTokenSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Datos no válidos", issues: parsed.error.flatten() },
      { status: 422 }
    );
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "No autenticado." }, { status: 401 });
  }

  const { token, platform } = parsed.data;

  const { error } = await supabase
    .from("push_tokens")
    .upsert(
      {
        user_id: user.id,
        token,
        platform,
      },
      { onConflict: "token" }
    );

  if (error) {
    return NextResponse.json(
      { error: "No pudimos registrar el token." },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true });
}
