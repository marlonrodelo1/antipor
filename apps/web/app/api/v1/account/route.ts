import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

export async function DELETE() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "No autenticado." }, { status: 401 });
  }

  try {
    const admin = createAdminClient();
    const { error } = await admin.auth.admin.deleteUser(user.id);
    if (error) throw error;

    // Cerramos sesión local para que las cookies dejen de apuntar a un
    // usuario que ya no existe.
    await supabase.auth.signOut();

    return new NextResponse(null, { status: 204 });
  } catch (err) {
    return NextResponse.json(
      {
        error:
          err instanceof Error
            ? err.message
            : "No pudimos borrar la cuenta. Inténtalo de nuevo.",
      },
      { status: 500 }
    );
  }
}
