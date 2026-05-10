"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/browser";

const Schema = z.object({
  code: z
    .string()
    .trim()
    .min(11, "Faltan palabras del código.")
    .refine(
      (s) => s.split(/\s+/).filter(Boolean).length === 6,
      "El código debe tener 6 palabras separadas por espacios."
    ),
});

export default function RecuperarCodigoPage() {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const parsed = Schema.safeParse({ code });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Código no válido.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/v1/account/recover", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: parsed.data.code }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error ?? "Código no válido.");
        return;
      }

      // Si el endpoint devuelve { access_token, refresh_token } montamos sesión.
      if (data.access_token && data.refresh_token) {
        const supabase = createClient();
        const { error: sessionErr } = await supabase.auth.setSession({
          access_token: data.access_token,
          refresh_token: data.refresh_token,
        });
        if (sessionErr) {
          setError(sessionErr.message);
          return;
        }
      }
      router.push("/panel");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error de red.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="min-h-dvh bg-[var(--color-bg)]">
      <div className="mx-auto flex min-h-dvh max-w-md flex-col px-5 py-10">
        <Link
          href="/"
          className="mb-6 text-sm text-[var(--color-ink-3)] hover:text-[var(--color-ink)]"
        >
          ← Volver
        </Link>
        <h1 className="font-serif text-[28px] leading-tight md:text-[34px]">
          Recuperar tu cuenta
        </h1>
        <p className="mt-2 text-sm text-[var(--color-ink-2)]">
          Introduce las 6 palabras de tu código de respaldo. Si no tienes uno,
          puedes generarlo desde el dispositivo donde ya entraste a Antiport.
        </p>

        <Card className="mt-6 p-6">
          <form onSubmit={onSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="code">Tu código de 6 palabras</Label>
              <textarea
                id="code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                rows={3}
                placeholder="palabra-uno palabra-dos palabra-tres palabra-cuatro palabra-cinco palabra-seis"
                className="rounded-xl border border-[var(--border)] bg-white px-4 py-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
                disabled={submitting}
                autoComplete="off"
                autoCorrect="off"
                spellCheck={false}
              />
            </div>
            {error && (
              <p className="text-sm text-[var(--color-warm)]">{error}</p>
            )}
            <Button
              type="submit"
              variant="primary"
              size="lg"
              disabled={submitting}
            >
              {submitting ? "Comprobando…" : "Recuperar"}
            </Button>
          </form>
        </Card>

        <p className="mt-6 text-xs text-[var(--color-ink-3)]">
          Si pierdes el código, no podemos recuperarlo por ti — está pensado
          para que solo tú puedas usarlo.
        </p>
      </div>
    </main>
  );
}
