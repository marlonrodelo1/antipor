import Link from "next/link";
import { Wordmark } from "@/components/landing/wordmark";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-[var(--color-bg)]">
      <header className="container-page py-6">
        <Wordmark />
      </header>
      <main className="flex flex-1 items-center justify-center px-6 py-10">
        <div className="w-full max-w-[420px]">{children}</div>
      </main>
      <footer className="container-page py-6 text-center text-xs text-[var(--color-ink-3)]">
        <Link href="/" className="hover:text-[var(--foreground)]">
          ← Volver al inicio
        </Link>
      </footer>
    </div>
  );
}
