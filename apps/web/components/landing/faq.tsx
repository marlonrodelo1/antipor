"use client";
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  {
    q: "¿Es realmente gratis?",
    a: "Sí, gratis y sin anuncios. Antiport se sostiene con donaciones voluntarias.",
  },
  {
    q: "¿Necesito registrarme con email?",
    a: "No. Sin email, sin contraseña, anónimo por defecto. Al entrar creamos un identificador interno y nada más. Si quieres usar Antiport en otro dispositivo, en ajustes puedes generar un código de respaldo de 6 palabras y recuperar tu cuenta donde quieras.",
  },
  {
    q: "¿Qué datos guardáis sobre mí?",
    a: "Solo lo que tú eliges contarnos en el onboarding (avatar, hobbies, horario, motivación), tu historial de chat con Aliado y el registro anónimo de tus intervenciones. Nunca guardamos URLs visitadas, ni contenido de páginas, ni datos biométricos.",
  },
  {
    q: "¿Y si quiero borrar todo?",
    a: "En ajustes hay un botón de borrado total. Tu identificador y todo lo asociado desaparece de nuestros servidores. Sin formularios, sin fricción.",
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
