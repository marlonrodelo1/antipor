"use client";
import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/browser";

export default function RecuperarPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/panel/ajustes`,
      });
      if (error) throw error;
      setDone(true);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "No pudimos enviar el correo de recuperación."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-3xl border border-[var(--color-hairline)] bg-white p-8">
      <h1 className="font-serif text-[26px] leading-tight">
        Recupera tu acceso
      </h1>
      <p className="mt-2 text-sm text-[var(--color-ink-2)]">
        Te enviaremos un enlace para crear una contraseña nueva.
      </p>

      {done ? (
        <p className="mt-6 rounded-2xl bg-[var(--color-bg)] p-4 text-sm text-[var(--color-ink-2)]">
          Si esa dirección está registrada, recibirás un correo en breve.
        </p>
      ) : (
        <form onSubmit={onSubmit} className="mt-6 flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          {error && (
            <p className="text-sm text-[var(--color-warm)]" role="alert">
              {error}
            </p>
          )}
          <Button type="submit" size="lg" disabled={loading}>
            {loading ? "Enviando…" : "Enviar enlace"}
          </Button>
        </form>
      )}

      <div className="mt-6 text-center text-sm text-[var(--color-ink-3)]">
        <Link
          href="/login"
          className="font-medium text-[var(--color-primary)] hover:underline"
        >
          Volver a entrar
        </Link>
      </div>
    </div>
  );
}
