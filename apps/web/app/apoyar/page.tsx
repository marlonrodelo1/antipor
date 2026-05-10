import Link from "next/link";
import type { Metadata } from "next";
import { ArrowLeft, HeartHandshake, Server, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { LandingFooter } from "@/components/landing/footer";
import { LandingNav } from "@/components/landing/nav";

export const metadata: Metadata = {
  title: "Apoyar el proyecto · Antiport",
  description:
    "Antiport es gratis y vive de donaciones voluntarias. Si te ayuda, puedes ayudarnos a mantenerlo gratis para quien venga después.",
};

const usos = [
  {
    Icon: Server,
    title: "Servidores e IA",
    text: "Cada conversación con Aliado tiene un coste real. Tus donaciones cubren los modelos, la base de datos y el alojamiento.",
  },
  {
    Icon: Sparkles,
    title: "Mantener Antiport gratis",
    text: "No queremos cobrar en el momento más vulnerable. Tu aporte sostiene el acceso libre para quien lo necesite.",
  },
  {
    Icon: HeartHandshake,
    title: "Crecer con calma",
    text: "Sin inversores, sin publicidad. Sólo lo necesario para seguir mejorando la app a tu ritmo y al nuestro.",
  },
];

export default function ApoyarPage() {
  return (
    <main className="bg-[var(--color-bg)] text-[var(--foreground)]">
      <LandingNav />

      <section className="px-6 py-16 md:px-14 md:py-24">
        <div className="mx-auto max-w-[820px]">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm text-[var(--color-ink-2)] hover:text-[var(--foreground)]"
          >
            <ArrowLeft size={16} />
            Volver
          </Link>

          <header className="mt-6">
            <div className="text-[13px] font-semibold text-[var(--color-ink-3)]">
              Apoyar el proyecto
            </div>
            <h1 className="mt-2 font-serif text-[40px] leading-[1.1] md:text-[52px]">
              Antiport es gratis. Y queremos que siga así.
            </h1>
            <p className="mt-5 max-w-[640px] text-[16px] leading-relaxed text-[var(--color-ink-2)]">
              No vendemos tus datos, no mostramos anuncios y no cobramos por
              ayudar a alguien justo cuando llega un impulso. Si Antiport te ha
              servido y puedes aportar, nos das margen para mantenerlo abierto
              para la siguiente persona.
            </p>
          </header>

          <Card
            className="mt-10 p-8 md:p-10"
            style={{
              background: "var(--color-primary-soft)",
              borderColor: "var(--color-primary)",
            }}
          >
            <h2 className="font-serif text-[24px] leading-tight">
              Donar una vez o cada mes
            </h2>
            <p className="mt-2 text-sm text-[var(--color-ink-2)]">
              Elige el importe y la frecuencia que te resulten cómodos. No hay
              cantidad mínima ni compromiso.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              {/* TODO: enlazar con la pasarela real (Stripe Checkout o GoCardless) */}
              <a href="https://donate.stripe.com/" target="_blank" rel="noopener noreferrer">
                <Button variant="primary" size="lg">
                  Donar con tarjeta
                </Button>
              </a>
              <a
                href="https://gocardless.com/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="outline" size="lg">
                  Donación recurrente
                </Button>
              </a>
            </div>
            <p className="mt-4 text-xs text-[var(--color-ink-3)]">
              Procesado de forma segura. Puedes cancelar cuando quieras.
            </p>
          </Card>

          <div className="mt-12 grid gap-4 md:grid-cols-3">
            {usos.map((u) => (
              <Card key={u.title} className="p-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--color-primary-soft)]">
                  <u.Icon size={18} className="text-[var(--color-primary)]" />
                </div>
                <h3 className="mt-3 font-serif text-lg font-medium">
                  {u.title}
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-[var(--color-ink-2)]">
                  {u.text}
                </p>
              </Card>
            ))}
          </div>

          <Card className="mt-10 p-8">
            <h2 className="font-serif text-xl">Otras formas de ayudar</h2>
            <ul className="mt-4 flex flex-col gap-3 text-sm text-[var(--color-ink-2)]">
              <li>
                Compártelo con alguien a quien creas que puede servirle.
              </li>
              <li>
                Cuéntanos qué te ha funcionado y qué no. Tu feedback moldea la
                app.
              </li>
              <li>
                Si trabajas en salud, terapia o pastoral, escríbenos. Buscamos
                aliados.
              </li>
            </ul>
          </Card>

          <p className="mt-10 text-center text-sm text-[var(--color-ink-3)]">
            Gracias por estar aquí. Sin prisa, sin culpa.
          </p>
        </div>
      </section>

      <LandingFooter />
    </main>
  );
}
