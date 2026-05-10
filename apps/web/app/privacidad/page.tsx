import Link from "next/link";
import { LandingFooter } from "@/components/landing/footer";
import { Wordmark } from "@/components/landing/wordmark";

export const metadata = {
  title: "Privacidad · Antiport",
  description:
    "Cómo trata Antiport tus datos: anónimo por defecto, cero URLs en servidor, borrado total en un toque.",
};

const LAST_UPDATED = "10 de mayo de 2026";

export default function PrivacidadPage() {
  return (
    <main className="bg-[var(--color-bg)] text-[var(--foreground)]">
      <header className="border-b border-[var(--color-hairline)] bg-white">
        <div className="mx-auto flex max-w-[820px] items-center justify-between px-6 py-5">
          <Link href="/">
            <Wordmark />
          </Link>
          <Link
            href="/onboarding/welcome"
            className="text-sm font-medium text-[var(--color-primary)]"
          >
            Empezar
          </Link>
        </div>
      </header>

      <article className="mx-auto max-w-[760px] px-6 py-12 md:py-16">
        <div className="text-[12px] font-semibold uppercase tracking-wider text-[var(--color-ink-3)]">
          Política de privacidad
        </div>
        <h1 className="mt-2 font-serif text-[36px] leading-tight md:text-[46px]">
          Lo que sabemos de ti es lo que tú decides contarnos.
        </h1>
        <p className="mt-3 text-sm text-[var(--color-ink-3)]">
          Última actualización: {LAST_UPDATED}.
        </p>

        <Section title="Resumen rápido">
          <ul className="list-disc pl-5">
            <li>Sin email, sin contraseña, anónimo por defecto.</li>
            <li>
              Cero URLs visitadas en servidor. Cero contenido pornográfico.
              Cero datos biométricos.
            </li>
            <li>Almacenamiento en Supabase Cloud (eu-west-1), cifrado en reposo.</li>
            <li>Puedes borrar todo lo tuyo en un toque desde Ajustes.</li>
          </ul>
        </Section>

        <Section title="Quiénes somos">
          <p>
            Antiport es un proyecto desarrollado por Rogotech (Tenerife,
            España). Nuestra finalidad es acompañarte cuando llega el impulso
            de consumir pornografía, sin juzgarte.
          </p>
          <p>
            Para cualquier consulta sobre privacidad, escríbenos a{" "}
            <a
              href="mailto:rodelomarlon1@gmail.com"
              className="text-[var(--color-primary)] underline underline-offset-2"
            >
              rodelomarlon1@gmail.com
            </a>
            .
          </p>
        </Section>

        <Section title="Cuenta anónima por defecto">
          <p>
            Cuando entras por primera vez creamos un identificador interno (UUID)
            asociado a tu navegador. No te pedimos email ni contraseña. Si
            quieres usar Antiport en otro dispositivo, puedes generar un código
            de respaldo de 6 palabras desde Ajustes — ese código solo lo ves tú,
            nosotros guardamos un hash que no sirve para reconstruirlo.
          </p>
        </Section>

        <Section title="Qué guardamos">
          <ul className="list-disc pl-5">
            <li>
              <strong>Tu perfil:</strong> avatar elegido, nombre con el que
              quieres que te llamemos (opcional), hobbies, horario laboral
              aproximado, horas de riesgo, motivación para usar Antiport, si
              activas la capa espiritual.
            </li>
            <li>
              <strong>Historial de chat con Aliado:</strong> los mensajes que
              intercambias para que la conversación tenga continuidad.
            </li>
            <li>
              <strong>Registro de intervenciones:</strong> cuándo pulsaste
              &ldquo;Tengo un impulso&rdquo;, qué hiciste después (respiraste,
              hablaste, dejaste pasar) y el resultado. Anónimo y agregado, sin
              detalles externos.
            </li>
            <li>
              <strong>Check-ins de mood:</strong> cómo te sientes y a qué hora.
            </li>
          </ul>
        </Section>

        <Section title="Qué NO guardamos">
          <ul className="list-disc pl-5">
            <li>
              <strong>NUNCA</strong> URLs visitadas, dominios, ni historial de
              navegación.
            </li>
            <li>
              <strong>NUNCA</strong> contenido pornográfico, capturas, ni
              metadatos de archivos.
            </li>
            <li>
              <strong>NUNCA</strong> datos biométricos (cara, huella, voz),
              ni geolocalización precisa.
            </li>
            <li>Tampoco tu nombre real, dirección, DNI, teléfono ni email.</li>
          </ul>
        </Section>

        <Section title="Dónde y cómo se almacena">
          <p>
            Toda la información se guarda en Supabase Cloud, región
            <strong> eu-west-1</strong> (Irlanda). Las tablas usan Row Level
            Security para que cada cuenta solo pueda leer y escribir sus
            propios datos. La base de datos está cifrada en reposo y el
            tráfico va por TLS.
          </p>
          <p>
            Para generar las respuestas de Aliado enviamos al modelo de
            lenguaje (DeepSeek o Gemini) tu mensaje y un resumen del perfil
            necesario para personalizar. No enviamos tu identificador de cuenta
            al modelo.
          </p>
        </Section>

        <Section title="Tus derechos">
          <ul className="list-disc pl-5">
            <li>
              <strong>Borrado total:</strong> Ajustes → Privacidad →
              &ldquo;Borrar mi progreso&rdquo;. Inmediato, sin trámites.
            </li>
            <li>
              <strong>Acceso:</strong> puedes solicitarnos por email una copia
              de los datos asociados a tu identificador.
            </li>
            <li>
              <strong>Exportación:</strong> próximamente directamente desde
              Ajustes.
            </li>
            <li>
              <strong>Reclamación:</strong> puedes presentarla ante la Agencia
              Española de Protección de Datos.
            </li>
          </ul>
        </Section>

        <Section title="Cookies y telemetría">
          <p>
            Usamos solo las cookies necesarias para mantener tu sesión
            anónima activa. Para entender cómo se usa la app utilizamos
            PostHog en modo EU, sin identificadores que permitan asociar la
            actividad a una persona concreta.
          </p>
        </Section>

        <Section title="Cambios en esta política">
          <p>
            Si modificamos esta política te avisaremos en la propia app antes
            de que los cambios entren en vigor. La fecha de última
            actualización aparece arriba de este documento.
          </p>
        </Section>
      </article>

      <LandingFooter />
    </main>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-10">
      <h2 className="font-serif text-[22px] leading-tight md:text-[26px]">
        {title}
      </h2>
      <div className="mt-3 flex flex-col gap-3 text-[15px] leading-relaxed text-[var(--color-ink-2)]">
        {children}
      </div>
    </section>
  );
}
