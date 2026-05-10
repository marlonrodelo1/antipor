import { Lock, MessageCircle, TrendingUp } from "lucide-react";

const items = [
  {
    icon: MessageCircle,
    title: "Intervención en el momento",
    body: "No es un bloqueo frío. Es una conversación con un agente IA empático que te ayuda a redirigir.",
    color: "var(--color-primary)",
  },
  {
    icon: TrendingUp,
    title: "Tu diario, tu progreso",
    body: "Patrones, rachas, triggers. Conocerlos es la mitad del camino.",
    color: "var(--color-secondary)",
  },
  {
    icon: Lock,
    title: "Privado de verdad",
    body: "Lo que pasa en tu móvil, se queda en tu móvil. Cero historial en nuestros servidores.",
    color: "var(--color-accent)",
  },
];

export function LandingBenefits() {
  return (
    <section className="bg-[var(--color-bg)] px-6 py-16 md:px-14 md:py-28">
      <div className="mx-auto grid max-w-[1180px] gap-4 md:grid-cols-3 md:gap-7">
        {items.map((it) => (
          <div
            key={it.title}
            className="rounded-3xl border border-[var(--color-hairline)] bg-white p-8"
          >
            <div
              className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl"
              style={{ background: `${it.color}1A` }}
            >
              <it.icon size={28} style={{ color: it.color }} />
            </div>
            <div className="mb-2 font-serif text-[22px] font-medium">
              {it.title}
            </div>
            <p className="text-[15px] leading-relaxed text-[var(--color-ink-2)]">
              {it.body}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
