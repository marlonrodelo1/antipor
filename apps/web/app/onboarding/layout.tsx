import type { ReactNode } from "react";
import { headers } from "next/headers";
import { OnboardingProgress } from "@/components/onboarding-progress";

const STEP_ORDER = [
  "welcome",
  "avatar",
  "nombre",
  "motivacion",
  "hobbies",
  "horario",
  "riesgos",
  "espiritual",
  "aliado",
  "listo",
];
const TOTAL = STEP_ORDER.length; // 10 (welcome 0/10 ... listo 9/10)

function deriveStep(pathname: string | null): number {
  if (!pathname) return 0;
  const segments = pathname.split("/").filter(Boolean);
  const last = segments[segments.length - 1] ?? "welcome";
  const idx = STEP_ORDER.indexOf(last);
  return idx === -1 ? 0 : idx;
}

export default async function OnboardingLayout({
  children,
}: {
  children: ReactNode;
}) {
  const h = await headers();
  // Next.js exposes the current path through middleware-set headers in some setups;
  // fall back to a fresh URL via x-invoke-path / x-pathname / referer.
  const pathname =
    h.get("x-invoke-path") ??
    h.get("x-pathname") ??
    h.get("next-url") ??
    h.get("x-url") ??
    null;
  const current = deriveStep(pathname);

  return (
    <div className="min-h-dvh bg-[var(--background)]">
      <div className="mx-auto flex min-h-dvh w-full max-w-xl flex-col px-5 py-6 sm:px-6 sm:py-10">
        <header className="mb-6 sm:mb-8">
          <div className="mb-4 flex items-center justify-between">
            <span className="font-serif text-lg font-medium text-[var(--color-primary)]">
              Antiport
            </span>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[var(--color-ink-3)]">
              Onboarding
            </span>
          </div>
          <OnboardingProgress current={current} total={TOTAL - 1} />
        </header>

        <main className="flex flex-1 flex-col">
          <div className="flex flex-1 flex-col rounded-3xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm sm:p-8">
            {children}
          </div>
        </main>

        <footer className="mt-6 text-center text-[11px] text-[var(--color-ink-3)]">
          Tus respuestas se quedan en tu cuenta. Sin emails, sin nombres reales.
        </footer>
      </div>
    </div>
  );
}
