import { NextResponse } from "next/server";
import { z } from "zod";
import { verifyRecoveryCode } from "@antiport/ai";
import { createAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

const RecoverSchema = z.object({
  code: z.string().trim().min(3).max(200),
});

// Rate limit en memoria (best-effort: util en single-instance dev/staging).
// En produccion conviene moverlo a Redis/Upstash.
const ATTEMPT_WINDOW_MS = 5 * 60 * 1000;
const MAX_ATTEMPTS_PER_IP = 8;
const attempts = new Map<string, { count: number; resetAt: number }>();

function rateLimit(ip: string): boolean {
  const now = Date.now();
  const rec = attempts.get(ip);
  if (!rec || rec.resetAt < now) {
    attempts.set(ip, { count: 1, resetAt: now + ATTEMPT_WINDOW_MS });
    return true;
  }
  rec.count += 1;
  if (rec.count > MAX_ATTEMPTS_PER_IP) return false;
  return true;
}

function getClientIp(req: Request): string {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0]!.trim();
  return req.headers.get("x-real-ip") ?? "unknown";
}

export async function POST(req: Request) {
  const ip = getClientIp(req);
  if (!rateLimit(ip)) {
    return NextResponse.json(
      { error: "Demasiados intentos. Espera unos minutos." },
      { status: 429 }
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "JSON invalido." }, { status: 400 });
  }
  const parsed = RecoverSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Datos invalidos", issues: parsed.error.flatten() },
      { status: 422 }
    );
  }
  const codeInput = parsed.data.code;

  const admin = createAdminClient();

  // Iteramos perfiles con recovery_code_hash no nulo y comparamos.
  // En produccion conviene paginar; aqui aplicamos un limite defensivo.
  const { data: rows, error } = await admin
    .from("user_profile")
    .select("user_id, recovery_code_hash")
    .not("recovery_code_hash", "is", null)
    .limit(2000);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  let matchUserId: string | null = null;
  for (const row of rows ?? []) {
    const ok = await verifyRecoveryCode(
      codeInput,
      row.recovery_code_hash as string
    );
    if (ok) {
      matchUserId = row.user_id as string;
      break;
    }
  }

  if (!matchUserId) {
    return NextResponse.json(
      { error: "Codigo no valido." },
      { status: 401 }
    );
  }

  // Issue de sesion: estrategia magic-link sobre email sintetico.
  // Anonymous users no tienen email; le asignamos uno determinista interno
  // si aun no lo tienen, y generamos un magic link.
  const syntheticEmail = `${matchUserId}@anon.antiport.local`;

  // Aseguramos email en el user (idempotente).
  const { data: userResp, error: getErr } = await admin.auth.admin.getUserById(
    matchUserId
  );
  if (getErr || !userResp?.user) {
    return NextResponse.json(
      { error: "No pudimos recuperar la cuenta." },
      { status: 500 }
    );
  }

  if (!userResp.user.email) {
    const { error: updErr } = await admin.auth.admin.updateUserById(
      matchUserId,
      { email: syntheticEmail, email_confirm: true }
    );
    if (updErr) {
      return NextResponse.json(
        { error: "No pudimos preparar la recuperacion." },
        { status: 500 }
      );
    }
  }

  const targetEmail = userResp.user.email ?? syntheticEmail;

  const { data: link, error: linkErr } =
    await admin.auth.admin.generateLink({
      type: "magiclink",
      email: targetEmail,
    });

  if (linkErr || !link?.properties) {
    return NextResponse.json(
      { error: "No pudimos generar la sesion." },
      { status: 500 }
    );
  }

  return NextResponse.json({
    ok: true,
    actionLink: link.properties.action_link,
    hashedToken: link.properties.hashed_token,
    redirectTo: link.properties.redirect_to ?? null,
  });
}
