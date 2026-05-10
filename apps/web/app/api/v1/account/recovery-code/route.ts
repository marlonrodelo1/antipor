import { NextResponse } from "next/server";
import {
  generateRecoveryCode,
  hashRecoveryCode,
} from "@antiport/ai";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

/**
 * Genera un codigo de recuperacion de 6 palabras y guarda solo el bcrypt hash
 * en user_profile.recovery_code_hash.
 *
 * El codigo en claro se devuelve UNA SOLA VEZ. Si el usuario lo pierde,
 * tendra que generar uno nuevo (esto invalida el anterior).
 */
export async function POST() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "No autenticado." }, { status: 401 });
  }

  const { code, words } = generateRecoveryCode();
  const hash = await hashRecoveryCode(code);

  const { error } = await supabase
    .from("user_profile")
    .upsert(
      { user_id: user.id, recovery_code_hash: hash },
      { onConflict: "user_id" }
    );

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    code,
    words,
    note: "Guarda este codigo. No lo volveremos a mostrar. Si lo pierdes, genera uno nuevo (el anterior dejara de funcionar).",
  });
}
