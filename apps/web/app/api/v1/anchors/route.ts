import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

const KindSchema = z.enum(["photo", "audio", "text"]);

const MAX_FILE_BYTES = 10 * 1024 * 1024; // 10 MB

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "No autenticado." }, { status: 401 });
  }

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return NextResponse.json(
      { error: "Formato de petición inválido." },
      { status: 400 }
    );
  }

  const parsed = z
    .object({
      kind: KindSchema,
      label: z.string().min(1).max(120),
      textContent: z.string().max(1200).optional(),
    })
    .safeParse({
      kind: form.get("kind"),
      label: form.get("label"),
      textContent: form.get("textContent") ?? undefined,
    });

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Datos no válidos", issues: parsed.error.flatten() },
      { status: 422 }
    );
  }

  const { kind, label, textContent } = parsed.data;

  let storagePath: string | null = null;
  let resolvedTextContent: string | null = null;

  if (kind === "text") {
    if (!textContent || textContent.trim().length === 0) {
      return NextResponse.json(
        { error: "La frase no puede estar vacía." },
        { status: 422 }
      );
    }
    resolvedTextContent = textContent.trim();
  } else {
    const file = form.get("file");
    if (!(file instanceof File) || file.size === 0) {
      return NextResponse.json(
        { error: "Falta el archivo." },
        { status: 422 }
      );
    }
    if (file.size > MAX_FILE_BYTES) {
      return NextResponse.json(
        { error: "Archivo demasiado grande (máx. 10 MB)." },
        { status: 413 }
      );
    }

    const ext = file.name.includes(".")
      ? file.name.split(".").pop()!.toLowerCase().slice(0, 8)
      : kind === "photo"
        ? "jpg"
        : "m4a";
    const path = `${user.id}/${Date.now()}-${crypto.randomUUID()}.${ext}`;

    // TODO: ensure the `anchors` Supabase Storage bucket exists (private).
    // Until the bucket is provisioned this upload will fail and we surface
    // the error to the user.
    const { error: uploadError } = await supabase.storage
      .from("anchors")
      .upload(path, file, {
        contentType: file.type || undefined,
        upsert: false,
      });

    if (uploadError) {
      return NextResponse.json(
        {
          error:
            "No pudimos guardar el archivo. Es posible que el almacenamiento aún no esté listo.",
        },
        { status: 500 }
      );
    }
    storagePath = path;
  }

  const { error: insertError } = await supabase.from("anchors").insert({
    user_id: user.id,
    kind,
    label,
    storage_path: storagePath,
    text_content: resolvedTextContent,
  });

  if (insertError) {
    return NextResponse.json(
      { error: "No pudimos guardar el ancla." },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true });
}
