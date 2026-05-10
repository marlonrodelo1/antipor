import Link from "next/link";
import { Button } from "@/components/ui/button";

/**
 * Paso 0/9 — bienvenida del onboarding.
 * Server component. No persiste nada todavía: solo presenta y mueve a /onboarding/avatar.
 */
export default function WelcomePage() {
  return (
    <div className="flex flex-1 flex-col items-center justify-between gap-8 text-center">
      <div className="flex flex-col items-center gap-6">
        <LighthouseIllustration />
        <div className="flex flex-col gap-3">
          <h1 className="font-serif text-[28px] leading-[1.15] sm:text-[34px]">
            No estás solo.
            <br />
            <em className="italic text-[var(--color-primary)]">
              Vamos paso a paso.
            </em>
          </h1>
          <p className="mx-auto max-w-md text-[15px] leading-relaxed text-[var(--color-ink-2)]">
            Sin juicio, sin registro de email, sin coger tus datos. Solo tú y tu
            camino.
          </p>
        </div>
      </div>

      <div className="flex w-full flex-col items-center gap-3">
        <Link href="/onboarding/avatar" className="w-full sm:w-auto">
          <Button size="lg" variant="primary" className="w-full sm:w-auto">
            Empezar
          </Button>
        </Link>
        <p className="text-xs text-[var(--color-ink-3)]">
          Tardarás unos 3 minutos.
        </p>
      </div>
    </div>
  );
}

function LighthouseIllustration() {
  return (
    <svg
      viewBox="0 0 240 240"
      width={200}
      height={200}
      className="text-[var(--color-primary)]"
      aria-hidden
    >
      <defs>
        <radialGradient id="lh-glow" cx="50%" cy="32%" r="55%">
          <stop offset="0%" stopColor="#E8B96A" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#E8B96A" stopOpacity="0" />
        </radialGradient>
      </defs>
      {/* Soft glow */}
      <circle cx="120" cy="80" r="80" fill="url(#lh-glow)" />
      {/* Sea base */}
      <path
        d="M0 200 Q60 188 120 200 T240 200 L240 240 L0 240 Z"
        fill="#3B6EA8"
        opacity="0.18"
      />
      {/* Lighthouse body */}
      <rect
        x="106"
        y="100"
        width="28"
        height="100"
        rx="4"
        fill="#F7F5F2"
        stroke="#3B6EA8"
        strokeWidth="3"
      />
      {/* Stripes */}
      <rect x="106" y="120" width="28" height="10" fill="#D97757" />
      <rect x="106" y="160" width="28" height="10" fill="#D97757" />
      {/* Lantern */}
      <rect
        x="100"
        y="80"
        width="40"
        height="22"
        rx="3"
        fill="#3B6EA8"
      />
      {/* Light beam */}
      <path
        d="M120 90 L60 50 L60 70 Z"
        fill="#E8B96A"
        opacity="0.55"
      />
      <path
        d="M120 90 L180 50 L180 70 Z"
        fill="#E8B96A"
        opacity="0.55"
      />
      {/* Top */}
      <path d="M104 80 L120 64 L136 80 Z" fill="#1C2128" />
    </svg>
  );
}
