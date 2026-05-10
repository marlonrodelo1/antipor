import Link from "next/link";
import { Anchor, BookText, Home, Lock, Settings } from "lucide-react";
import { Wordmark } from "@/components/landing/wordmark";

const navItems = [
  { href: "/panel", icon: Home, label: "Hoy" },
  { href: "/panel/diario", icon: BookText, label: "Diario" },
  { href: "/panel/anclas", icon: Anchor, label: "Anclas" },
  { href: "/panel/ajustes", icon: Settings, label: "Ajustes" },
];

export default function PanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-[var(--color-bg)] text-[var(--foreground)]">
      <aside className="hidden w-60 shrink-0 flex-col border-r border-[var(--color-hairline)] bg-white p-4 md:flex">
        <div className="px-3 py-3">
          <Wordmark />
        </div>
        <nav className="mt-4 flex flex-col gap-1">
          {navItems.map((it) => (
            <Link
              key={it.href}
              href={it.href}
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-[var(--color-ink-2)] transition-colors hover:bg-[var(--color-bg)] hover:text-[var(--foreground)]"
            >
              <it.icon size={18} />
              {it.label}
            </Link>
          ))}
        </nav>
        <div className="mt-auto rounded-2xl bg-[var(--color-bg)] p-4 text-xs text-[var(--color-ink-2)]">
          <div className="mb-1.5 flex items-center gap-2">
            <Lock size={14} className="text-[var(--color-secondary)]" />
            <strong className="text-[var(--foreground)]">Privado</strong>
          </div>
          Cero URLs en el servidor.
        </div>
      </aside>

      <div className="flex flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-[var(--color-hairline)] bg-white px-6 py-4 md:px-10">
          <div className="md:hidden">
            <Wordmark />
          </div>
          <div className="hidden text-sm text-[var(--color-ink-3)] md:block">
            Tu espacio privado
          </div>
          <div className="flex items-center gap-2">
            <div
              className="h-8 w-8 rounded-full"
              style={{ background: "var(--color-primary-soft)" }}
              aria-label="Avatar"
            />
          </div>
        </header>
        <main className="flex-1 overflow-auto px-6 py-8 md:px-10 md:py-10">
          {children}
        </main>
        {/* Mobile bottom nav */}
        <nav className="grid grid-cols-4 border-t border-[var(--color-hairline)] bg-white md:hidden">
          {navItems.map((it) => (
            <Link
              key={it.href}
              href={it.href}
              className="flex flex-col items-center gap-1 py-3 text-[11px] text-[var(--color-ink-2)]"
            >
              <it.icon size={20} />
              {it.label}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
}
