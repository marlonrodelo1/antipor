export function LandingMoment() {
  return (
    <section
      id="como-funciona"
      className="border-y border-[var(--color-hairline)] bg-white px-6 py-16 md:py-28"
    >
      <div className="mx-auto max-w-[1100px] text-center">
        <div className="mb-4 text-[12px] font-semibold uppercase tracking-[0.18em] text-[var(--color-warm)]">
          El momento del impulso
        </div>
        <h2 className="font-serif text-[32px] leading-[1.1] md:text-[56px]">
          No es un bloqueo frío.
          <br />
          <em className="italic text-[var(--color-warm)]">
            Es una conversación.
          </em>
        </h2>
        <p className="mx-auto mt-6 max-w-[620px] text-base leading-relaxed text-[var(--color-ink-2)] md:text-lg">
          Cuando llega el impulso, pulsas un botón y Aliado aparece. Te pregunta
          qué pasó hoy. Te ofrece tres salidas concretas. Sin pared, sin
          sermón.
        </p>
      </div>
    </section>
  );
}
