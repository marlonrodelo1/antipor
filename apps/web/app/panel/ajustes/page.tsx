"use client";
import { useEffect, useState } from "react";
import {
  BookOpen,
  Copy,
  HeartHandshake,
  KeyRound,
  Lock,
  Sparkles,
  User,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { getProfile, patchProfile } from "@/lib/profile";

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
    description: "Tu nombre y avatar.",
  },
  {
    id: "aliado",
    Icon: Sparkles,
    title: "Aliado",
    description: "Personalidad de tu acompañante IA.",
  },
  {
    id: "espiritual",
    Icon: BookOpen,
    title: "Capa espiritual",
    description: "Activa o desactiva la capa cristiana opcional.",
  },
  {
    id: "privacidad",
    Icon: Lock,
    title: "Privacidad",
    description: "Código de respaldo y borrado total.",
  },
  {
    id: "apoyar",
    Icon: HeartHandshake,
    title: "Apoyar el proyecto",
    description: "Antiport es gratis. Vive de donaciones voluntarias.",
  },
];

export default function AjustesPage() {
  const [loading, setLoading] = useState(true);
  const [displayName, setDisplayName] = useState("");
  const [aliadoName, setAliadoName] = useState("Aliado");
  const [faith, setFaith] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savedNote, setSavedNote] = useState<string | null>(null);

  // recovery modal
  const [showRecovery, setShowRecovery] = useState(false);
  const [recoveryCode, setRecoveryCode] = useState<string | null>(null);
  const [generatingCode, setGeneratingCode] = useState(false);
  const [copyOk, setCopyOk] = useState(false);

  // delete confirm
  const [showDelete, setShowDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const p = await getProfile();
        if (cancelled || !p) return;
        setDisplayName(p.display_name ?? "");
        setAliadoName(p.aliado_name ?? "Aliado");
        setFaith(p.spiritual_layer === true);
      } catch {
        // ignore
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  async function saveProfile() {
    setSavingProfile(true);
    setSavedNote(null);
    try {
      await patchProfile({
        display_name: displayName.trim() || null,
        aliado_name: aliadoName.trim() || "Aliado",
      });
      setSavedNote("Guardado.");
    } catch (e) {
      setSavedNote(e instanceof Error ? e.message : "Error al guardar.");
    } finally {
      setSavingProfile(false);
      setTimeout(() => setSavedNote(null), 2500);
    }
  }

  async function toggleFaith(next: boolean) {
    setFaith(next);
    try {
      await patchProfile({ spiritual_layer: next });
    } catch {
      setFaith(!next);
    }
  }

  async function generateRecoveryCode() {
    setGeneratingCode(true);
    setRecoveryCode(null);
    setCopyOk(false);
    try {
      const res = await fetch("/api/v1/account/recovery-code", {
        method: "POST",
        credentials: "same-origin",
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.code) {
        setRecoveryCode(data.code);
      } else {
        setRecoveryCode(null);
        alert(data.error ?? "No se pudo generar el código.");
      }
    } catch {
      alert("Error de red al generar el código.");
    } finally {
      setGeneratingCode(false);
    }
  }

  async function copyCode() {
    if (!recoveryCode) return;
    try {
      await navigator.clipboard.writeText(recoveryCode);
      setCopyOk(true);
      setTimeout(() => setCopyOk(false), 1500);
    } catch {
      // ignore
    }
  }

  async function confirmDelete() {
    setDeleting(true);
    try {
      const res = await fetch("/api/v1/account", {
        method: "DELETE",
        credentials: "same-origin",
      });
      if (res.ok) {
        window.location.href = "/";
      } else {
        const data = await res.json().catch(() => ({}));
        alert(data.error ?? "No se pudo borrar la cuenta.");
      }
    } catch {
      alert("Error de red al borrar la cuenta.");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="mx-auto flex max-w-[840px] flex-col gap-6 pb-20">
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
            <Label htmlFor="nombre">Cómo quieres que te llamemos</Label>
            <Input
              id="nombre"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="(opcional)"
              disabled={loading}
            />
          </div>
        </div>
      </Card>

      <Card className="p-6" id="aliado">
        <SectionHeader section={sections[1]} />
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="aliado">Nombre de tu Aliado</Label>
            <Input
              id="aliado"
              value={aliadoName}
              onChange={(e) => setAliadoName(e.target.value)}
              disabled={loading}
            />
          </div>
        </div>
        <div className="mt-4 flex items-center gap-3">
          <Button
            variant="primary"
            size="md"
            onClick={saveProfile}
            disabled={savingProfile || loading}
          >
            {savingProfile ? "Guardando…" : "Guardar perfil y aliado"}
          </Button>
          {savedNote && (
            <span className="text-xs text-[var(--color-ink-3)]">
              {savedNote}
            </span>
          )}
        </div>
      </Card>

      <Card className="p-6" id="espiritual">
        <div className="flex items-start justify-between gap-4">
          <SectionHeader section={sections[2]} />
          <Switch
            checked={faith}
            onCheckedChange={toggleFaith}
            aria-label="Capa espiritual"
            disabled={loading}
          />
        </div>
        <p className="mt-3 text-sm text-[var(--color-ink-2)]">
          Cuando está activa, Aliado puede ofrecer reflexión espiritual y
          referencias a la Biblia si tú lo invitas. Puedes apagarla cuando
          quieras.
        </p>
      </Card>

      <Card className="p-6" id="privacidad">
        <SectionHeader section={sections[3]} />
        <div className="mt-5 flex flex-col gap-4">
          <div className="rounded-2xl bg-[var(--color-bg)] p-4">
            <div className="flex items-start gap-3">
              <KeyRound
                size={18}
                className="mt-0.5 shrink-0 text-[var(--color-primary)]"
              />
              <div className="flex-1">
                <div className="text-sm font-semibold">
                  Generar código de respaldo
                </div>
                <p className="mt-0.5 text-xs text-[var(--color-ink-3)]">
                  6 palabras para recuperar tu cuenta en otro dispositivo.
                  Solo lo verás una vez. Apúntalo en papel.
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setShowRecovery(true);
                  setRecoveryCode(null);
                }}
              >
                Generar
              </Button>
            </div>
          </div>

          <div className="rounded-2xl bg-[var(--color-bg)] p-4">
            <div className="flex items-start gap-3">
              <Lock
                size={18}
                className="mt-0.5 shrink-0 text-[var(--color-warm)]"
              />
              <div className="flex-1">
                <div className="text-sm font-semibold">Borrar mi progreso</div>
                <p className="mt-0.5 text-xs text-[var(--color-ink-3)]">
                  Elimina tu cuenta, perfil, historial de chat y registros.
                  Inmediato e irreversible.
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="text-[var(--color-warm)]"
                onClick={() => setShowDelete(true)}
              >
                Borrar
              </Button>
            </div>
          </div>
        </div>
        <p className="mt-3 text-xs text-[var(--color-ink-3)]">
          Más detalles en nuestra{" "}
          <a
            href="/privacidad"
            className="underline underline-offset-2 hover:text-[var(--color-ink-2)]"
          >
            política de privacidad
          </a>
          .
        </p>
      </Card>

      <Card className="p-6" id="apoyar">
        <SectionHeader section={sections[4]} />
        <div className="mt-4">
          <a href="/apoyar">
            <Button variant="primary" size="md">
              Hacer una donación
            </Button>
          </a>
        </div>
      </Card>

      {showRecovery && (
        <RecoveryModal
          code={recoveryCode}
          generating={generatingCode}
          onGenerate={generateRecoveryCode}
          onCopy={copyCode}
          copyOk={copyOk}
          onClose={() => {
            setShowRecovery(false);
            setRecoveryCode(null);
          }}
        />
      )}

      {showDelete && (
        <ConfirmDeleteModal
          deleting={deleting}
          onCancel={() => setShowDelete(false)}
          onConfirm={confirmDelete}
        />
      )}
    </div>
  );
}

function RecoveryModal({
  code,
  generating,
  onGenerate,
  onCopy,
  copyOk,
  onClose,
}: {
  code: string | null;
  generating: boolean;
  onGenerate: () => void;
  onCopy: () => void;
  copyOk: boolean;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="w-full max-w-md rounded-3xl bg-white p-6">
        <h3 className="font-serif text-xl">Código de respaldo</h3>
        <p className="mt-2 text-sm text-[var(--color-ink-2)]">
          Esto te permite recuperar tu cuenta en otro dispositivo. Solo se
          muestra una vez. Cópialo o escríbelo en papel.
        </p>
        {!code ? (
          <div className="mt-5 flex justify-end gap-2">
            <Button variant="ghost" size="md" onClick={onClose}>
              Cerrar
            </Button>
            <Button
              variant="primary"
              size="md"
              onClick={onGenerate}
              disabled={generating}
            >
              {generating ? "Generando…" : "Generar ahora"}
            </Button>
          </div>
        ) : (
          <>
            <pre className="mt-4 rounded-xl bg-[var(--color-bg)] px-4 py-3 text-base font-medium tracking-wide text-[var(--color-ink)]">
              {code}
            </pre>
            <div className="mt-4 flex justify-between gap-2">
              <Button
                variant="outline"
                size="md"
                leftIcon={<Copy size={16} />}
                onClick={onCopy}
              >
                {copyOk ? "Copiado" : "Copiar"}
              </Button>
              <Button variant="primary" size="md" onClick={onClose}>
                Listo, lo apunté
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function ConfirmDeleteModal({
  deleting,
  onCancel,
  onConfirm,
}: {
  deleting: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="w-full max-w-md rounded-3xl bg-white p-6">
        <h3 className="font-serif text-xl">¿Borrar todo tu progreso?</h3>
        <p className="mt-2 text-sm text-[var(--color-ink-2)]">
          Tu cuenta, perfil, historial de chat y registros desaparecen al
          instante. No hay vuelta atrás.
        </p>
        <div className="mt-5 flex justify-end gap-2">
          <Button variant="ghost" size="md" onClick={onCancel}>
            Cancelar
          </Button>
          <Button
            variant="warm"
            size="md"
            onClick={onConfirm}
            disabled={deleting}
          >
            {deleting ? "Borrando…" : "Sí, borrar todo"}
          </Button>
        </div>
      </div>
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
