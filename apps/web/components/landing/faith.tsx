import { BookOpen } from "lucide-react";

export function LandingFaith() {
  return (
    <section
      className="px-6 py-16 md:px-14 md:py-24"
      style={{ background: "rgba(59,110,168,0.06)" }}
    >
      <div className="mx-auto flex max-w-[880px] flex-col items-start gap-8 md:flex-row md:items-center">
        <div className="flex h-[72px] w-[72px] shrink-0 items-center justify-center rounded-[22px] bg-white">
          <BookOpen size={32} className="text-[var(--color-primary)]" />
        </div>
        <div>
          <h3 className="font-serif text-[24px] font-medium leading-tight md:text-[30px]">
            Capa espiritual cristiana, opcional.
          </h3>
          <p className="mt-3 text-[15px] leading-relaxed text-[var(--color-ink-2)]">
            Si tu fe es parte de tu camino, Antiport puede acompañarte con
            versículos y reflexión bíblica. Si no, también está hecha para ti —
            la capa se desactiva en un toque.
          </p>
        </div>
      </div>
    </section>
  );
}
