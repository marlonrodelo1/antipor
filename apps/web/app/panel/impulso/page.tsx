"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Anchor, ArrowUp, Wind } from "lucide-react";
import { AliadoAvatar } from "@/components/aliado-avatar";
import { BreathingCircle } from "@/components/breathing-circle";
import { Button } from "@/components/ui/button";

type Mode = "loading" | "menu" | "chat" | "breathing" | "done";

interface ChatTurn {
  id: string;
  role: "user" | "assistant";
  content: string;
}

const FRICTION_PHRASE = "voy a ver algo que sé que me hace daño";

export default function ImpulsoPage() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("loading");
  const [aiMessage, setAiMessage] = useState<string>("");
  const [interventionLogId, setInterventionLogId] = useState<string | null>(
    null
  );
  const [aliadoName, setAliadoName] = useState("Aliado");
  const [chatTurns, setChatTurns] = useState<ChatTurn[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [chatSending, setChatSending] = useState(false);
  const [showFriction, setShowFriction] = useState(false);
  const [frictionInput, setFrictionInput] = useState("");
  const outcomeReportedRef = useRef(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const hour = new Date().getHours();
        const res = await fetch("/api/v1/intervene", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ hour }),
          credentials: "same-origin",
        });
        const data = await res.json().catch(() => ({}));
        if (cancelled) return;
        setAiMessage(
          data.content ??
            "Estoy aquí. Respira un segundo conmigo. No tienes que decidir nada todavía."
        );
        if (data.interventionLogId) {
          setInterventionLogId(data.interventionLogId);
        }
        if (data.aliadoName) setAliadoName(data.aliadoName);
        setMode("menu");
      } catch {
        if (cancelled) return;
        setAiMessage(
          "Estoy aquí contigo. Antes de decidir nada, respira conmigo un momento."
        );
        setMode("menu");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  async function reportOutcome(
    outcome: "resisted" | "contacted" | "dismissed" | "relapsed"
  ) {
    if (outcomeReportedRef.current) return;
    outcomeReportedRef.current = true;
    if (!interventionLogId) return;
    try {
      await fetch("/api/v1/intervene/outcome", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ interventionLogId, outcome }),
        credentials: "same-origin",
      });
    } catch {
      // ignore — best effort
    }
  }

  async function sendChat() {
    const text = chatInput.trim();
    if (!text || chatSending) return;
    const userTurn: ChatTurn = {
      id: `u-${Date.now()}`,
      role: "user",
      content: text,
    };
    setChatTurns((t) => [...t, userTurn]);
    setChatInput("");
    setChatSending(true);
    try {
      const res = await fetch("/api/v1/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: text,
          context: { source: "impulso", interventionLogId },
        }),
        credentials: "same-origin",
      });
      const data = await res.json().catch(() => ({}));
      const reply: ChatTurn = {
        id: data.id ?? `a-${Date.now()}`,
        role: "assistant",
        content:
          data.content ??
          "Estoy aquí. Cuéntame un poco más de lo que está pasando.",
      };
      setChatTurns((t) => {
        const next = [...t, reply];
        const userCount = next.filter((m) => m.role === "user").length;
        if (userCount >= 3) {
          void reportOutcome("contacted");
        }
        return next;
      });
    } catch {
      // ignore
    } finally {
      setChatSending(false);
    }
  }

  function handleBreathingComplete() {
    void reportOutcome("resisted");
    setMode("done");
  }

  async function dismissFriction() {
    if (frictionInput.trim().toLowerCase() !== FRICTION_PHRASE) return;
    await reportOutcome("dismissed");
    router.push("/panel");
  }

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto"
      style={{ background: "var(--color-warm-bg)" }}
    >
      <div className="mx-auto flex min-h-dvh max-w-xl flex-col px-5 py-8 sm:px-6">
        <div className="flex items-center justify-between">
          <Link
            href="/panel"
            className="text-sm font-medium text-[var(--color-ink-3)] hover:text-[var(--color-ink)]"
          >
            ← Volver
          </Link>
          <span className="text-[11px] font-semibold uppercase tracking-wider text-[var(--color-warm)]">
            Impulso · Estoy aquí
          </span>
        </div>

        {mode === "loading" && (
          <div className="flex flex-1 flex-col items-center justify-center gap-4">
            <AliadoAvatar size={120} state="hablando" tone="warm" />
            <p className="text-sm text-[var(--color-ink-3)]">
              {aliadoName} está pensando contigo…
            </p>
          </div>
        )}

        {mode === "menu" && (
          <div className="flex flex-1 flex-col items-center justify-center gap-8 py-10">
            <AliadoAvatar size={140} state="hablando" tone="warm" />
            <div className="rounded-3xl bg-white p-6 shadow-[0_10px_30px_-10px_rgba(217,119,87,0.25)]">
              <p className="text-center font-serif text-[20px] leading-snug text-[var(--color-ink)]">
                {aiMessage}
              </p>
            </div>
            <div className="flex w-full flex-col gap-3">
              <Button
                variant="warm"
                size="lg"
                className="w-full"
                onClick={() => setMode("chat")}
              >
                Hablar con {aliadoName}
              </Button>
              <Button
                variant="primary"
                size="lg"
                className="w-full"
                leftIcon={<Wind size={18} />}
                onClick={() => setMode("breathing")}
              >
                Hacer una respiración (60 s)
              </Button>
              <Link href="/panel/anclas" className="w-full">
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full"
                  leftIcon={<Anchor size={18} />}
                >
                  Ver mis anclas
                </Button>
              </Link>
            </div>
            <button
              type="button"
              onClick={() => setShowFriction(true)}
              className="mt-4 text-xs text-[var(--color-ink-3)] underline underline-offset-2 hover:text-[var(--color-ink-2)]"
            >
              Quiero entrar igual
            </button>
          </div>
        )}

        {mode === "chat" && (
          <div className="flex flex-1 flex-col gap-4 py-6">
            <div className="flex items-center gap-3">
              <AliadoAvatar size={48} state="reposo" tone="warm" />
              <div className="text-sm font-semibold">{aliadoName}</div>
            </div>
            <div className="flex flex-1 flex-col gap-3 overflow-y-auto rounded-2xl bg-white p-4">
              <div className="flex items-end gap-2">
                <AliadoAvatar size={24} state="reposo" tone="warm" />
                <div className="max-w-[78%] rounded-2xl rounded-bl-sm bg-[var(--color-warm-bg)] px-4 py-2.5 text-sm text-[var(--color-ink)]">
                  {aiMessage}
                </div>
              </div>
              {chatTurns.map((m) =>
                m.role === "user" ? (
                  <div key={m.id} className="flex justify-end">
                    <div className="max-w-[78%] rounded-2xl rounded-br-sm bg-[var(--color-warm)] px-4 py-2.5 text-sm text-white">
                      {m.content}
                    </div>
                  </div>
                ) : (
                  <div key={m.id} className="flex items-end gap-2">
                    <AliadoAvatar size={24} state="reposo" tone="warm" />
                    <div className="max-w-[78%] rounded-2xl rounded-bl-sm bg-[var(--color-warm-bg)] px-4 py-2.5 text-sm text-[var(--color-ink)]">
                      {m.content}
                    </div>
                  </div>
                )
              )}
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                void sendChat();
              }}
              className="flex items-center gap-2"
            >
              <input
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Escribe…"
                className="h-11 flex-1 rounded-full border border-[var(--color-hairline)] bg-white px-4 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-warm)]"
                disabled={chatSending}
              />
              <button
                type="submit"
                disabled={!chatInput.trim() || chatSending}
                aria-label="Enviar"
                className="flex h-11 w-11 items-center justify-center rounded-full bg-[var(--color-warm)] text-white disabled:opacity-40"
              >
                <ArrowUp size={18} />
              </button>
            </form>
          </div>
        )}

        {mode === "breathing" && (
          <div className="flex flex-1 flex-col items-center justify-center gap-6 py-10">
            <BreathingCircle
              totalSeconds={60}
              onComplete={handleBreathingComplete}
            />
            <button
              type="button"
              onClick={() => setMode("menu")}
              className="text-xs text-[var(--color-ink-3)] underline underline-offset-2"
            >
              Volver al menú
            </button>
          </div>
        )}

        {mode === "done" && (
          <div className="flex flex-1 flex-col items-center justify-center gap-6 py-10 text-center">
            <AliadoAvatar size={120} state="reposo" tone="secondary" />
            <h2 className="font-serif text-2xl">Lo hiciste.</h2>
            <p className="max-w-sm text-sm text-[var(--color-ink-2)]">
              Esto suma. La próxima vez será un poco más fácil.
            </p>
            <Link href="/panel">
              <Button variant="primary" size="md">
                Volver al panel
              </Button>
            </Link>
          </div>
        )}
      </div>

      {showFriction && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 px-4"
          role="dialog"
          aria-modal
        >
          <div className="w-full max-w-md rounded-3xl bg-white p-6">
            <h3 className="font-serif text-xl">Espera un segundo.</h3>
            <p className="mt-2 text-sm text-[var(--color-ink-2)]">
              Para seguir adelante, escribe esta frase tal cual. No es castigo —
              es un espejo.
            </p>
            <p className="mt-3 rounded-xl bg-[var(--color-bg)] px-4 py-3 text-sm italic text-[var(--color-ink)]">
              {FRICTION_PHRASE}
            </p>
            <textarea
              value={frictionInput}
              onChange={(e) => setFrictionInput(e.target.value)}
              rows={2}
              className="mt-3 w-full rounded-xl border border-[var(--color-hairline)] bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-warm)]"
              placeholder="Escribe la frase…"
            />
            <div className="mt-4 flex justify-between gap-2">
              <Button
                variant="ghost"
                size="md"
                onClick={() => {
                  setShowFriction(false);
                  setFrictionInput("");
                }}
              >
                Mejor no
              </Button>
              <Button
                variant="warm"
                size="md"
                disabled={
                  frictionInput.trim().toLowerCase() !== FRICTION_PHRASE
                }
                onClick={() => void dismissFriction()}
              >
                Continuar igual
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
