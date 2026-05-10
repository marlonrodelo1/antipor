import Link from "next/link";
import { Wordmark } from "./wordmark";

export function LandingFooter() {
  return (
    <footer className="bg-[var(--color-ink)] px-6 py-12 text-[#A6ADB7] md:px-14 md:py-16">
      <div className="mx-auto flex max-w-[1180px] flex-col justify-between gap-8 md:flex-row">
        <div>
          <Wordmark dark />
          <p className="mt-4 max-w-[320px] text-[13px] leading-relaxed">
            Antiport te acompaña con IA cuando llega el impulso. Privado,
            gratis, sin juicio.
          </p>
        </div>
        <div className="flex flex-wrap gap-12 text-[13px]">
          <div className="flex flex-col gap-2.5">
            <div className="mb-1 font-semibold text-white">Producto</div>
            <span>Descargar</span>
            <span>Cómo funciona</span>
            <span>FAQ</span>
          </div>
          <div className="flex flex-col gap-2.5">
            <div className="mb-1 font-semibold text-white">Legal</div>
            <span>Privacidad</span>
            <span>Términos</span>
            <span>Contacto</span>
          </div>
          <div className="flex flex-col gap-2.5">
            <div className="mb-1 font-semibold text-white">Comunidad</div>
            <Link href="/apoyar" className="hover:text-white">
              Apoya el proyecto
            </Link>
            <span>Newsletter</span>
          </div>
        </div>
      </div>
      <div className="mx-auto mt-10 max-w-[1180px] border-t border-white/10 pt-6 text-[12px] text-[#6B7280]">
        © 2026 Antiport · Hecho con cuidado, no con prisa.
      </div>
    </footer>
  );
}
