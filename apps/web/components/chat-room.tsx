"use client";
import { useEffect, useRef, useState } from "react";
import { ArrowUp, Mic, Phone, ShieldAlert } from "lucide-react";
import { AliadoAvatar } from "@/components/aliado-avatar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  derivation?: boolean;
}

interface Props {
  initialMessages: Message[];
  aliadoName: string;
}

interface DerivationContact {
  label: string;
  number: string;
  note: string;
}

const DERIVATION_CONTACTS: DerivationContact[] = [
  { label: "Línea 024 (atención conducta suicida)", number: "024", note: "24h, gratuito" },
  { label: "Teléfono de la Esperanza", number: "717 003 717", note: "24h" },
  { label: "ANAR (menores y adolescentes)", number: "900 20 20 10", note: "24h, gratuito" },
];

export function ChatRoom({ initialMessages, aliadoName }: Props) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages.length]);

  async function send() {
    const text = input.trim();
    if (!text || sending) return;

    const tempId = `tmp-${Date.now()}`;
    setMessages((m) => [
      ...m,
      { id: tempId, role: "user", content: text },
    ]);
    setInput("");
    setSending(true);

    try {
      const res = await fetch("/api/v1/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: text }),
        credentials: "same-origin",
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setMessages((m) => [
          ...m,
          {
            id: `err-${Date.now()}`,
            role: "assistant",
            content:
              "No pude responder ahora mismo. Inténtalo de nuevo en un momento.",
          },
        ]);
        return;
      }

      if (data?.derivation) {
        setMessages((m) => [
          ...m,
          {
            id: data.id ?? `assistant-${Date.now()}`,
            role: "assistant",
            content: data.content ?? "",
            derivation: true,
          },
        ]);
        return;
      }

      setMessages((m) => [
        ...m,
        {
          id: data.id ?? `assistant-${Date.now()}`,
          role: "assistant",
          content: data.content ?? "",
        },
      ]);
    } catch {
      setMessages((m) => [
        ...m,
        {
          id: `err-${Date.now()}`,
          role: "assistant",
          content: "Hubo un problema de conexión. Vuelve a intentarlo.",
        },
      ]);
    } finally {
      setSending(false);
    }
  }

  function handleVoice() {
    alert("Próximamente: voz.");
  }

  return (
    <div className="flex h-full flex-col rounded-3xl border border-[var(--border)] bg-[var(--card)]">
      <header className="flex items-center gap-3 border-b border-[var(--color-hairline)] px-5 py-3">
        <AliadoAvatar size={36} state="reposo" tone="primary" />
        <div>
          <div className="text-sm font-semibold">{aliadoName}</div>
          <div className="text-[11px] text-[var(--color-ink-3)]">
            Privado · cifrado en reposo
          </div>
        </div>
      </header>

      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-4 py-5 md:px-6"
      >
        {messages.length === 0 && (
          <div className="flex h-full flex-col items-center justify-center gap-3 text-center">
            <AliadoAvatar size={64} state="reposo" tone="primary" />
            <p className="max-w-xs text-sm text-[var(--color-ink-3)]">
              Cuéntale a {aliadoName} lo que pasa. No necesita un motivo
              importante.
            </p>
          </div>
        )}
        <div className="flex flex-col gap-3">
          {messages.map((m) => (
            <MessageBubble
              key={m.id}
              message={m}
              aliadoName={aliadoName}
            />
          ))}
          {sending && (
            <div className="flex items-center gap-3">
              <AliadoAvatar size={28} state="hablando" tone="primary" />
              <div className="rounded-2xl bg-[var(--color-bg)] px-4 py-2 text-sm text-[var(--color-ink-3)]">
                {aliadoName} está escribiendo…
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="border-t border-[var(--color-hairline)] p-3">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            void send();
          }}
          className="flex items-center gap-2"
        >
          <button
            type="button"
            onClick={handleVoice}
            aria-label="Voz (próximamente)"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-[var(--color-ink-3)] hover:text-[var(--color-primary)]"
          >
            <Mic size={18} />
          </button>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Escribe lo que sientes…"
            className="flex h-11 flex-1 rounded-full border border-[var(--color-hairline)] bg-white px-4 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]"
            disabled={sending}
          />
          <button
            type="submit"
            aria-label="Enviar"
            disabled={!input.trim() || sending}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[var(--color-primary)] text-white disabled:opacity-40"
          >
            <ArrowUp size={18} />
          </button>
        </form>
      </div>
    </div>
  );
}

function MessageBubble({
  message,
  aliadoName,
}: {
  message: Message;
  aliadoName: string;
}) {
  if (message.role === "system") return null;

  if (message.role === "assistant" && message.derivation) {
    return <DerivationCard content={message.content} aliadoName={aliadoName} />;
  }

  if (message.role === "user") {
    return (
      <div className="flex justify-end">
        <div className="max-w-[78%] rounded-2xl rounded-br-sm bg-[var(--color-primary)] px-4 py-2.5 text-sm text-white">
          {message.content}
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-end gap-2">
      <AliadoAvatar size={28} state="reposo" tone="primary" />
      <div className="max-w-[78%] rounded-2xl rounded-bl-sm bg-[var(--color-bg)] px-4 py-2.5 text-sm text-[var(--color-ink)]">
        {message.content}
      </div>
    </div>
  );
}

function DerivationCard({
  content,
  aliadoName,
}: {
  content: string;
  aliadoName: string;
}) {
  return (
    <div className="flex items-end gap-2">
      <AliadoAvatar size={28} state="reposo" tone="warm" />
      <div className="max-w-[90%] rounded-2xl rounded-bl-sm border border-[var(--color-warm-soft)] bg-[var(--color-warm-bg)] p-4">
        <div className="mb-2 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-[var(--color-warm)]">
          <ShieldAlert size={14} />
          Apoyo profesional
        </div>
        {content && (
          <p className="mb-3 text-sm leading-relaxed text-[var(--color-ink)]">
            {content}
          </p>
        )}
        {!content && (
          <p className="mb-3 text-sm leading-relaxed text-[var(--color-ink)]">
            {aliadoName} no es la mejor ayuda para lo que estás sintiendo ahora.
            Por favor, llama a una de estas líneas — son gratuitas y atienden
            personas reales 24h.
          </p>
        )}
        <ul className="flex flex-col gap-2">
          {DERIVATION_CONTACTS.map((c) => (
            <li
              key={c.number}
              className="flex items-center justify-between gap-3 rounded-xl bg-white px-3 py-2"
            >
              <div className="flex items-center gap-2 text-sm">
                <Phone size={14} className="text-[var(--color-warm)]" />
                <div>
                  <div className="font-semibold">{c.number}</div>
                  <div className="text-[11px] text-[var(--color-ink-3)]">
                    {c.label} · {c.note}
                  </div>
                </div>
              </div>
              <a href={`tel:${c.number.replace(/\s/g, "")}`}>
                <Button variant="warm" size="sm">
                  Llamar
                </Button>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
