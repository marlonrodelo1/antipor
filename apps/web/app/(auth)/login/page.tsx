"use client";
import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Apple } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/browser";

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}

function LoginForm() {
  const router = useRouter();
  const search = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      const next = search.get("next") ?? "/panel";
      router.push(next);
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "No pudimos iniciar sesión."
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

  return (
    <div className="rounded-3xl border border-[var(--color-hairline)] bg-white p-8">
      <h1 className="font-serif text-[28px] leading-tight">
        Bienvenido de nuevo
      </h1>
      <p className="mt-2 text-sm text-[var(--color-ink-2)]">
        Aliado te ha estado esperando.
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
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Contraseña</Label>
            <Link
              href="/recuperar"
              className="text-xs text-[var(--color-primary)] hover:underline"
            >
              ¿Olvidaste?
            </Link>
          </div>
          <Input
            id="password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        {error && (
          <p className="text-sm text-[var(--color-warm)]" role="alert">
            {error}
          </p>
        )}
        <Button type="submit" size="lg" disabled={loading}>
          {loading ? "Entrando…" : "Entrar"}
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
          ¿Aún no tienes cuenta?{" "}
          <Link
            href="/signup"
            className="font-medium text-[var(--color-primary)] hover:underline"
          >
            Crear cuenta
          </Link>
        </p>
      </div>
    </div>
  );
}
