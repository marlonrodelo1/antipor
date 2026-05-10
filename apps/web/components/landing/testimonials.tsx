const items = [
  {
    quote:
      "No sentí que me bloqueara. Sentí que alguien me preguntó cómo estaba. Es muy distinto.",
    name: "Marlon, 28",
  },
  {
    quote:
      "Llevaba años intentándolo con apps que solo prohíben. Esto es lo primero que entiende por qué.",
    name: "Lucía, 35",
  },
  {
    quote:
      "Lo descargué con miedo a que fuera muy religioso. La capa de fe es opcional. Funciona perfecto sin ella.",
    name: "D., 19",
  },
  {
    quote:
      "La opción de versículo cuando lo necesito me ayuda mucho. Y respeta cuando no quiero.",
    name: "Anónimo",
  },
];

export function LandingTestimonials() {
  return (
    <section id="para-quien" className="bg-white px-6 py-16 md:px-14 md:py-28">
      <div className="mx-auto max-w-[1100px]">
        <h2 className="text-center font-serif text-[30px] leading-[1.1] md:text-[48px]">
          Para <em className="italic text-[var(--color-primary)]">cualquiera</em>{" "}
          que esté listo.
        </h2>
        <div className="mt-10 grid gap-4 md:grid-cols-2">
          {items.map((it, i) => (
            <figure
              key={i}
              className="rounded-2xl border border-[var(--color-hairline)] bg-[var(--color-bg)] p-7"
            >
              <blockquote className="font-serif text-lg italic leading-relaxed text-[var(--color-ink)]">
                &ldquo;{it.quote}&rdquo;
              </blockquote>
              <figcaption className="mt-3 text-[13px] font-medium text-[var(--color-ink-3)]">
                — {it.name}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
