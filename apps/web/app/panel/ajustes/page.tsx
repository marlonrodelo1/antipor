"use client";
import { useState } from "react";
import {
  Bell,
  BookOpen,
  HeartHandshake,
  Lock,
  ShieldCheck,
  Sparkles,
  User,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

interface Section {
  id: string;
  Icon: typeof User;
  title: string;
  description: string;
}

const sections: Section[] = [
  {
    id: "perfil",
    Icon: User,
    title: "Perfil",
    description: "Tu nombre, email y foto.",
  },
  {
    id: "aliado",
    Icon: Sparkles,
    title: "Aliado",
    description: "Personalidad, tono y voz de tu acompañante IA.",
  },
  {
    id: "espiritual",
    Icon: BookOpen,
    title: "Capa espiritual",
    description: "Activa o desactiva la capa cristiana opcional.",
  },
  {
    id: "proteccion",
    Icon: ShieldCheck,
    title: "Protección",
    description: "Lista de bloqueo, fricción de desinstalación, intercepción.",
  },
  {
    id: "notificaciones",
    Icon: Bell,
    title: "Notificaciones",
    description: "Recordatorios proactivos en tus franjas de riesgo.",
  },
  {
    id: "privacidad",
    Icon: Lock,
    title: "Privacidad",
    description: "Datos almacenados, exportar y borrar cuenta.",
  },
  {
    id: "apoyar",
    Icon: HeartHandshake,
    title: "Apoyar el proyecto",
    description: "Antiport es gratis. Vive de donaciones voluntarias.",
  },
];

export default function AjustesPage() {
  const [faith, setFaith] = useState(false);
  const [push, setPush] = useState(true);
  const [friction, setFriction] = useState(false);

  return (
    <div className="mx-auto flex max-w-[840px] flex-col gap-6">
      <header>
        <div className="text-[13px] font-semibold text-[var(--color-ink-3)]">
          Ajustes
        </div>
        <h1 className="mt-1 font-serif text-[32px] leading-tight md:text-[38px]">
          Tu Antiport, a tu medida.
        </h1>
      </header>

      <Card className="p-6" id="perfil">
        <SectionHeader section={sections[0]} />
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="nombre">Nombre</Label>
            <Input id="nombre" defaultValue="Marlon" />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" defaultValue="" placeholder="—" />
          </div>
        </div>
      </Card>

      <Card className="p-6" id="aliado">
        <SectionHeader section={sections[1]} />
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <Label>Tono</Label>
            <select className="h-11 rounded-xl border border-[var(--border)] bg-white px-3 text-sm">
              <option>Cercano</option>
              <option>Formal</option>
              <option>Directo</option>
            </select>
          </div>
          <div className="flex flex-col gap-1.5">
            <Label>Voz</Label>
            <select className="h-11 rounded-xl border border-[var(--border)] bg-white px-3 text-sm">
              <option>Femenina cálida</option>
              <option>Masculina cálida</option>
              <option>Sin voz, solo texto</option>
            </select>
          </div>
        </div>
      </Card>

      <Card className="p-6" id="espiritual">
        <div className="flex items-start justify-between gap-4">
          <SectionHeader section={sections[2]} />
          <Switch
            checked={faith}
            onCheckedChange={setFaith}
            aria-label="Capa espiritual"
          />
        </div>
        <p className="mt-3 text-sm text-[var(--color-ink-2)]">
          Cuando está activa, Aliado puede compartir versículos y reflexión
          bíblica si tú lo invitas. Puedes apagarla cuando quieras.
        </p>
      </Card>

      <Card className="p-6" id="proteccion">
        <SectionHeader section={sections[3]} />
        <div className="mt-5 flex items-center justify-between gap-4 rounded-xl bg-[var(--color-bg)] p-4">
          <div>
            <div className="text-sm font-medium">
              Fricción al desinstalar (24h)
            </div>
            <p className="mt-0.5 text-xs text-[var(--color-ink-3)]">
              Te pedimos confirmar por email antes de quitar la app.
            </p>
          </div>
          <Switch
            checked={friction}
            onCheckedChange={setFriction}
            aria-label="Fricción al desinstalar"
          />
        </div>
      </Card>

      <Card className="p-6" id="notificaciones">
        <div className="flex items-start justify-between gap-4">
          <SectionHeader section={sections[4]} />
          <Switch
            checked={push}
            onCheckedChange={setPush}
            aria-label="Notificaciones"
          />
        </div>
      </Card>

      <Card className="p-6" id="privacidad">
        <SectionHeader section={sections[5]} />
        <div className="mt-5 flex flex-wrap gap-3">
          <Button variant="outline" size="md">
            Exportar mis datos
          </Button>
          <Button variant="ghost" size="md" className="text-[var(--color-warm)]">
            Borrar mi cuenta
          </Button>
        </div>
        <p className="mt-3 text-xs text-[var(--color-ink-3)]">
          El historial de URLs nunca sale de tu móvil. En el servidor solo
          guardamos email y configuración.
        </p>
      </Card>

      <Card className="p-6" id="apoyar">
        <SectionHeader section={sections[6]} />
        <div className="mt-4">
          <Button variant="primary" size="md">
            Hacer una donación
          </Button>
        </div>
      </Card>
    </div>
  );
}

function SectionHeader({ section }: { section: Section }) {
  return (
    <div className="flex items-start gap-3">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--color-primary-soft)]">
        <section.Icon size={18} className="text-[var(--color-primary)]" />
      </div>
      <div>
        <h2 className="font-serif text-lg font-medium leading-tight">
          {section.title}
        </h2>
        <p className="mt-0.5 text-sm text-[var(--color-ink-3)]">
          {section.description}
        </p>
      </div>
    </div>
  );
}
