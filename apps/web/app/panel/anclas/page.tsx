import Link from "next/link";
import { Anchor, ImageIcon, Music, Plus, Quote } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { requireUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

type AnchorKind = "photo" | "audio" | "text";

interface AnchorRow {
  id: string;
  kind: AnchorKind;
  label: string | null;
  storage_path: string | null;
  text_content: string | null;
  created_at: string;
}

const kindMeta: Record<
  AnchorKind,
  { Icon: typeof ImageIcon; label: string; color: string }
> = {
  photo: { Icon: ImageIcon, label: "Foto", color: "var(--color-primary)" },
  audio: { Icon: Music, label: "Audio", color: "var(--color-secondary)" },
  text: { Icon: Quote, label: "Frase", color: "var(--color-warm)" },
};

export const dynamic = "force-dynamic";

export default async function AnclasPage() {
  const user = await requireUser();
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("anchors")
    .select("id, kind, label, storage_path, text_content, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const anchors: AnchorRow[] = !error && data ? (data as AnchorRow[]) : [];

  // Try to resolve signed URLs for photos/audios. Bucket may not exist yet.
  const resolved = await Promise.all(
    anchors.map(async (a) => {
      if (!a.storage_path || a.kind === "text") return { ...a, signedUrl: null };
      const { data: signed } = await supabase.storage
        .from("anchors")
        .createSignedUrl(a.storage_path, 60 * 60);
      return { ...a, signedUrl: signed?.signedUrl ?? null };
    })
  );

  return (
    <div className="mx-auto flex max-w-[1100px] flex-col gap-6">
      <header className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
        <div>
          <div className="text-[13px] font-semibold text-[var(--color-ink-3)]">
            Tus anclas
          </div>
          <h1 className="mt-1 font-serif text-[32px] leading-tight md:text-[38px]">
            Lo que te recuerda por qué.
          </h1>
        </div>
        <Link href="/panel/anclas/nueva">
          <Button variant="primary" size="md" leftIcon={<Plus size={16} />}>
            Añadir ancla
          </Button>
        </Link>
      </header>

      {resolved.length === 0 ? (
        <Card className="flex flex-col items-center gap-4 p-12 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--color-primary-soft)]">
            <Anchor size={26} className="text-[var(--color-primary)]" />
          </div>
          <h2 className="font-serif text-xl">Aún no tienes anclas</h2>
          <p className="max-w-md text-sm text-[var(--color-ink-2)]">
            Sube fotos, audios o frases que te recuerden por qué luchas.
          </p>
          <Link href="/panel/anclas/nueva">
            <Button size="md">Crear la primera</Button>
          </Link>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {resolved.map((a) => {
            const meta = kindMeta[a.kind];
            return (
              <Card key={a.id} className="overflow-hidden">
                <div
                  className="flex items-center gap-2 px-5 pt-5 text-[11px] font-semibold uppercase tracking-wide"
                  style={{ color: meta.color }}
                >
                  <meta.Icon size={14} />
                  {meta.label}
                </div>
                <div className="px-5 pb-5 pt-2">
                  <div className="font-serif text-base font-medium text-[var(--foreground)]">
                    {a.label ?? "Sin título"}
                  </div>

                  {a.kind === "photo" && a.signedUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={a.signedUrl}
                      alt={a.label ?? "Ancla"}
                      className="mt-3 h-44 w-full rounded-xl object-cover"
                    />
                  ) : null}

                  {a.kind === "audio" && a.signedUrl ? (
                    <audio
                      controls
                      src={a.signedUrl}
                      className="mt-3 w-full"
                    />
                  ) : null}

                  {a.kind === "text" && a.text_content ? (
                    <blockquote className="mt-3 border-l-2 border-[var(--color-warm-soft)] pl-3 font-serif text-[15px] italic leading-relaxed text-[var(--color-ink-2)]">
                      {a.text_content.length > 180
                        ? `${a.text_content.slice(0, 180)}…`
                        : a.text_content}
                    </blockquote>
                  ) : null}

                  {a.kind !== "text" && !a.signedUrl ? (
                    <p className="mt-3 text-xs text-[var(--color-ink-3)]">
                      Archivo no disponible.
                    </p>
                  ) : null}
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
