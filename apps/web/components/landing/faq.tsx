"use client";
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  {
    q: "¿Es realmente gratis?",
    a: "Sí, gratis y sin anuncios. La app se sostiene por donaciones voluntarias.",
  },
  {
    q: "¿Qué datos guardáis sobre mí?",
    a: "El historial de URLs nunca sale del dispositivo. En el servidor solo guardamos tu email y configuración.",
  },
  {
    q: "¿Cómo funciona el bloqueo en iOS / Android?",
    a: "En iOS usamos Screen Time. En Android, un servicio de accesibilidad o VPN local. Sin enviar tráfico fuera.",
  },
  {
    q: "¿Puedo desinstalarla cuando quiera?",
    a: "Sí. La fricción de 24h es opcional, opt-in en onboarding, y siempre puedes confirmarla por email.",
  },
];

export function LandingFAQ() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id="faq" className="bg-[var(--color-bg)] px-6 py-16 md:px-14 md:py-28">
      <div className="mx-auto max-w-[760px]">
        <h2 className="text-center font-serif text-[30px] md:text-[44px]">
          Preguntas frecuentes
        </h2>
        <div className="mt-8 flex flex-col gap-2.5">
          {items.map((it, i) => {
            const isOpen = open === i;
            return (
              <div
                key={i}
                className="rounded-2xl border border-[var(--color-hairline)] bg-white px-6 py-5"
              >
                <button
                  type="button"
                  className="flex w-full items-center justify-between gap-4 text-left"
                  onClick={() => setOpen(isOpen ? null : i)}
                  aria-expanded={isOpen}
                >
                  <span className="text-base font-semibold">{it.q}</span>
                  <ChevronDown
                    size={18}
                    className={cn(
                      "shrink-0 text-[var(--color-ink-3)] transition-transform",
                      isOpen && "rotate-180"
                    )}
                  />
                </button>
                {isOpen && (
                  <p className="mt-3 text-[15px] leading-relaxed text-[var(--color-ink-2)]">
                    {it.a}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
