import Link from "next/link";
import { Lock, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AliadoAvatar } from "@/components/aliado-avatar";

export function LandingHero() {
  return (
    <section className="container-page flex flex-col items-center gap-12 py-10 md:flex-row md:gap-20 md:py-24">
      <div className="flex-1">
        <span className="mb-5 inline-flex items-center gap-2 rounded-full bg-[var(--color-primary-soft)] px-3.5 py-1.5 text-xs font-semibold tracking-wide text-[var(--color-primary)]">
          <ShieldCheck size={14} />
          Privado · Gratis · Anónimo
        </span>
        <h1 className="font-serif text-[44px] leading-[1.05] md:text-[72px]">
          Cuando el impulso llegue,
          <br />
          <em className="italic text-[var(--color-primary)]">no estarás solo.</em>
        </h1>
        <p className="mt-6 max-w-xl text-[17px] leading-relaxed text-[var(--color-ink-2)] md:text-xl">
          Antiport te acompaña con IA en el momento exacto. Una conversación,
          no un muro. Sin email, sin contraseña, anónimo por defecto.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/onboarding/welcome">
            <Button variant="primary" size="lg">
              Empezar (gratis)
            </Button>
          </Link>
          <Link href="/recuperar-codigo">
            <Button variant="outline" size="lg">
              ¿Vienes de otro dispositivo? Recuperar con código
            </Button>
          </Link>
        </div>
        <div className="mt-5 flex items-center gap-4 text-[13px] text-[var(--color-ink-3)]">
          <span>Cómo funciona</span>
          <span className="h-3 w-px bg-[var(--color-hairline-strong)]" />
          <span className="inline-flex items-center gap-1.5">
            <Lock size={12} /> Cero URLs en nuestros servidores
          </span>
        </div>
      </div>

      {/* Phone mock — intervention preview */}
      <div className="relative flex shrink-0 justify-center md:basis-[380px]">
        <div
          className="rounded-[44px] bg-[var(--color-ink)] p-2.5 shadow-[0_40px_80px_-20px_rgba(28,33,40,0.35),0_8px_32px_-8px_rgba(28,33,40,0.2)] md:rotate-2"
          style={{ width: 290, aspectRatio: "9 / 19" }}
        >
          <div className="flex h-full w-full flex-col items-center justify-between rounded-[36px] bg-[var(--color-warm-bg)] p-6">
            <div className="h-6" />
            <div className="flex flex-col items-center gap-4">
              <AliadoAvatar size={88} state="reposo" tone="warm" />
              <div className="px-1 text-center font-serif text-[20px] leading-tight text-[var(--color-ink)]">
                Marlon, espera un segundo. Llevas{" "}
                <em className="italic">14 días</em>.
              </div>
            </div>
            <div className="flex w-full flex-col gap-2">
              <div className="flex h-10 items-center justify-center rounded-full bg-[var(--color-warm)] text-[13px] font-semibold text-white">
                Hablar con Aliado
              </div>
              <div className="flex h-10 items-center justify-center rounded-full bg-white text-[13px] font-medium text-[var(--color-ink-2)]">
                Respirar 60 s
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
