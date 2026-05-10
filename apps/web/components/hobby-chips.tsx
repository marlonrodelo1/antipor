"use client";

import { useMemo, useState } from "react";
import { Plus, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";

const PRESET_HOBBIES = [
  "Caminar",
  "Correr",
  "Leer",
  "Escribir",
  "Música",
  "Cocinar",
  "Dibujar",
  "Naturaleza",
  "Ejercicio",
  "Yoga",
  "Meditar",
  "Ajedrez",
  "Videojuegos",
  "Fotografía",
  "Idiomas",
  "Bailar",
  "Tocar instrumento",
  "Ver pelis",
  "Estudiar",
  "Quedar con amigos",
];

interface Props {
  value: string[];
  onChange: (next: string[]) => void;
}

/**
 * Multi-select de hobbies con búsqueda y chips custom.
 * El valor son strings normalizadas en minúscula sin acentos para que la IA las consuma.
 */
export function HobbyChips({ value, onChange }: Props) {
  const [query, setQuery] = useState("");
  const [custom, setCustom] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return PRESET_HOBBIES;
    return PRESET_HOBBIES.filter((h) => h.toLowerCase().includes(q));
  }, [query]);

  const customChips = useMemo(
    () =>
      value.filter(
        (v) => !PRESET_HOBBIES.some((p) => p.toLowerCase() === v.toLowerCase())
      ),
    [value]
  );

  function toggle(label: string) {
    const exists = value.some((v) => v.toLowerCase() === label.toLowerCase());
    if (exists) {
      onChange(value.filter((v) => v.toLowerCase() !== label.toLowerCase()));
    } else {
      onChange([...value, label]);
    }
  }

  function addCustom() {
    const clean = custom.trim();
    if (!clean) return;
    if (clean.length > 40) return;
    if (value.some((v) => v.toLowerCase() === clean.toLowerCase())) {
      setCustom("");
      return;
    }
    onChange([...value, clean]);
    setCustom("");
  }

  return (
    <div className="flex flex-col gap-4">
      <Input
        type="search"
        placeholder="Buscar..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      <div className="flex flex-wrap gap-2">
        {filtered.map((label) => {
          const isOn = value.some(
            (v) => v.toLowerCase() === label.toLowerCase()
          );
          return (
            <button
              key={label}
              type="button"
              onClick={() => toggle(label)}
              className={cn(
                "rounded-full border px-4 py-2 text-sm transition-colors",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-1 focus-visible:ring-offset-[var(--background)]",
                isOn
                  ? "border-[var(--color-primary)] bg-[var(--color-primary)] text-white"
                  : "border-[var(--color-hairline)] bg-[var(--card)] text-[var(--color-ink-2)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]"
              )}
            >
              {label}
            </button>
          );
        })}
        {filtered.length === 0 ? (
          <p className="text-sm text-[var(--color-ink-3)]">
            No hay coincidencias. Añádelo abajo.
          </p>
        ) : null}
      </div>

      {customChips.length > 0 ? (
        <div className="flex flex-col gap-2">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-[var(--color-ink-3)]">
            Tuyos
          </span>
          <div className="flex flex-wrap gap-2">
            {customChips.map((label) => (
              <span
                key={label}
                className="inline-flex items-center gap-1.5 rounded-full border border-[var(--color-secondary)] bg-[var(--color-secondary)] px-3 py-1.5 text-sm text-white"
              >
                {label}
                <button
                  type="button"
                  onClick={() => toggle(label)}
                  aria-label={`Quitar ${label}`}
                  className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-white/20 hover:bg-white/40"
                >
                  <X size={11} />
                </button>
              </span>
            ))}
          </div>
        </div>
      ) : null}

      <div className="flex items-center gap-2">
        <Input
          placeholder="Añadir otro hobby..."
          value={custom}
          maxLength={40}
          onChange={(e) => setCustom(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              addCustom();
            }
          }}
        />
        <button
          type="button"
          onClick={addCustom}
          disabled={!custom.trim()}
          className="inline-flex h-11 items-center justify-center gap-1 rounded-full border border-[var(--color-hairline-strong)] bg-[var(--card)] px-4 text-sm font-semibold text-[var(--color-ink-2)] transition-colors hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] disabled:opacity-50"
        >
          <Plus size={14} />
          Añadir
        </button>
      </div>
    </div>
  );
}
