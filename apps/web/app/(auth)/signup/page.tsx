"use client";
import { useState } from "react";
import Link from "next/link";
import { Apple } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/browser";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/panel`,
        },
      });
      if (error) throw error;
      setDone(true);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "No pudimos crear la cuenta."
      );
    } finally {
      setLoading(false);
    }
  }

  async function oauth(provider: "apple" | "google") {
    try {
      const supabase = createClient();
      await supabase.auth.signInWithOAuth({
        provider,
        options: { redirectTo: `${window.location.origin}/panel` },
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error con el proveedor.");
    }
  }

  if (done) {
    return (
      <div className="rounded-3xl border border-[var(--color-hairline)] bg-white p-8 text-center">
        <h1 className="font-serif text-[26px] leading-tight">
          Revisa tu email
        </h1>
        <p className="mt-3 text-sm text-[var(--color-ink-2)]">
          Te hemos enviado un enlace para confirmar tu cuenta. Cuando lo abras,
          Aliado estará listo para acompañarte.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-[var(--color-hairline)] bg-white p-8">
      <h1 className="font-serif text-[28px] leading-tight">
        Da el primer paso.
      </h1>
      <p className="mt-2 text-sm text-[var(--color-ink-2)]">
        Sin juicios. Sin pagos. Solo acompañamiento.
      </p>

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
            placeholder="tucorreo@ejemplo.com"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="password">Contraseña</Label>
          <Input
            id="password"
            type="password"
            autoComplete="new-password"
            required
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <p className="text-[11px] text-[var(--color-ink-3)]">
            Mínimo 8 caracteres.
          </p>
        </div>
        {error && (
          <p className="text-sm text-[var(--color-warm)]" role="alert">
            {error}
          </p>
        )}
        <Button type="submit" size="lg" disabled={loading}>
          {loading ? "Creando…" : "Crear cuenta"}
        </Button>
      </form>

      <div className="my-6 flex items-center gap-3">
        <div className="h-px flex-1 bg-[var(--color-hairline)]" />
        <span className="text-xs text-[var(--color-ink-3)]">o</span>
        <div className="h-px flex-1 bg-[var(--color-hairline)]" />
      </div>

      <div className="flex flex-col gap-2.5">
        <Button
          variant="dark"
          size="md"
          leftIcon={<Apple size={16} />}
          onClick={() => oauth("apple")}
          type="button"
        >
          Continuar con Apple
        </Button>
        <Button
          variant="outline"
          size="md"
          onClick={() => oauth("google")}
          type="button"
        >
          Continuar con Google
        </Button>
      </div>

      <div className="mt-6 flex flex-col items-center gap-2 text-sm">
        <Link
          href="/panel?guest=1"
          className="text-[var(--color-ink-2)] underline-offset-4 hover:underline"
        >
          Modo invitado anónimo
        </Link>
        <p className="text-[var(--color-ink-3)]">
          ¿Ya tienes cuenta?{" "}
          <Link
            href="/login"
            className="font-medium text-[var(--color-primary)] hover:underline"
          >
            Entrar
          </Link>
        </p>
      </div>
    </div>
  );
}
