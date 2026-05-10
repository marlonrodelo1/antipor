import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Wordmark } from "./wordmark";

export function LandingNav() {
  return (
    <nav className="container-page flex items-center justify-between py-6 md:py-7">
      <Wordmark />
      <div className="hidden items-center gap-9 text-sm text-[var(--color-ink-2)] md:flex">
        <Link href="#como-funciona" className="hover:text-[var(--foreground)]">
          Cómo funciona
        </Link>
        <Link href="#para-quien" className="hover:text-[var(--foreground)]">
          Para quién
        </Link>
        <Link href="#privacidad" className="hover:text-[var(--foreground)]">
          Privacidad
        </Link>
        <Link href="#faq" className="hover:text-[var(--foreground)]">
          FAQ
        </Link>
        <Button size="sm">Descargar</Button>
      </div>
      <Link
        href="/login"
        className="text-sm font-medium text-[var(--color-ink-2)] md:hidden"
      >
        Entrar
      </Link>
    </nav>
  );
}
