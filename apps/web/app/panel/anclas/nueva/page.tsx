"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ImageIcon, Music, Quote } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type AnchorKind = "photo" | "audio" | "text";

const kinds: { id: AnchorKind; label: string; Icon: typeof ImageIcon; hint: string }[] = [
  { id: "photo", label: "Foto", Icon: ImageIcon, hint: "Una imagen que te recuerde por qué." },
  { id: "audio", label: "Audio", Icon: Music, hint: "Tu propia voz, una canción, un mensaje." },
  { id: "text", label: "Frase", Icon: Quote, hint: "Una idea corta que quieras leer cuando flaquees." },
];

export default function NuevaAnclaPage() {
  const router = useRouter();
  const [kind, setKind] = useState<AnchorKind>("photo");
  const [label, setLabel] = useState("");
  const [textContent, setTextContent] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const form = new FormData();
      form.append("kind", kind);
      form.append("label", label);
      if (kind === "text") {
        form.append("textContent", textContent);
      } else if (file) {
        form.append("file", file);
      }

      const res = await fetch("/api/v1/anchors", {
        method: "POST",
        body: form,
      });

      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j.error ?? "No pudimos guardar el ancla.");
      }

      router.push("/panel/anclas");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error inesperado.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto flex max-w-[680px] flex-col gap-6">
      <Link
        href="/panel/anclas"
        className="inline-flex items-center gap-1.5 text-sm text-[var(--color-ink-2)] hover:text-[var(--foreground)]"
      >
        <ArrowLeft size={16} />
        Volver
      </Link>

      <header>
        <div className="text-[13px] font-semibold text-[var(--color-ink-3)]">
          Nueva ancla
        </div>
        <h1 className="mt-1 font-serif text-[32px] leading-tight md:text-[36px]">
          Algo que te sostenga.
        </h1>
        <p className="mt-2 text-sm text-[var(--color-ink-2)]">
          Solo tú verás esto. Lo guardamos cifrado y nunca se comparte.
        </p>
      </header>

      <Card className="p-6">
        <form onSubmit={onSubmit} className="flex flex-col gap-5">
          <div>
            <Label>Tipo de ancla</Label>
            <div className="mt-2 grid grid-cols-3 gap-2">
              {kinds.map((k) => {
                const active = kind === k.id;
                return (
                  <button
                    key={k.id}
                    type="button"
                    onClick={() => setKind(k.id)}
                    className={`flex flex-col items-center gap-1.5 rounded-xl border px-3 py-3 text-xs font-medium transition-colors ${
                      active
                        ? "border-[var(--color-primary)] bg-[var(--color-primary-soft)] text-[var(--color-primary)]"
                        : "border-[var(--color-hairline)] bg-white text-[var(--color-ink-2)] hover:border-[var(--color-primary)]"
                    }`}
                  >
                    <k.Icon size={18} />
                    {k.label}
                  </button>
                );
              })}
            </div>
            <p className="mt-2 text-xs text-[var(--color-ink-3)]">
              {kinds.find((k) => k.id === kind)?.hint}
            </p>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="label">Título</Label>
            <Input
              id="label"
              required
              maxLength={120}
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="Ej. Mi hija jugando en la playa"
            />
          </div>

          {kind === "text" ? (
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="textContent">Frase</Label>
              <textarea
                id="textContent"
                required
                maxLength={1200}
                rows={5}
                value={textContent}
                onChange={(e) => setTextContent(e.target.value)}
                className="w-full rounded-xl border border-[var(--border)] bg-[var(--card)] px-4 py-3 text-sm text-[var(--foreground)] placeholder:text-[var(--color-ink-3)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
                placeholder="Escribe lo que necesites recordar."
              />
            </div>
          ) : (
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="file">
                {kind === "photo" ? "Imagen" : "Audio"}
              </Label>
              <Input
                id="file"
                type="file"
                required
                accept={kind === "photo" ? "image/*" : "audio/*"}
                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              />
              <p className="text-xs text-[var(--color-ink-3)]">
                Máximo 10 MB. Solo tú podrás verlo.
              </p>
            </div>
          )}

          {error && (
            <p className="text-sm text-[var(--color-warm)]" role="alert">
              {error}
            </p>
          )}

          <div className="flex flex-wrap gap-3">
            <Button type="submit" size="md" disabled={loading}>
              {loading ? "Guardando…" : "Guardar ancla"}
            </Button>
            <Link href="/panel/anclas">
              <Button type="button" variant="ghost" size="md">
                Cancelar
              </Button>
            </Link>
          </div>
        </form>
      </Card>
    </div>
  );
}
