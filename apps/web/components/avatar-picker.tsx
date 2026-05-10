"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";

const AVATARS: { id: string; label: string }[] = [
  { id: "avatar-1", label: "Avatar 1" },
  { id: "avatar-2", label: "Avatar 2" },
  { id: "avatar-3", label: "Avatar 3" },
  { id: "avatar-4", label: "Avatar 4" },
  { id: "avatar-5", label: "Avatar 5" },
  { id: "avatar-6", label: "Avatar 6" },
];

interface Props {
  selected: string | null;
  onChange: (id: string) => void;
}

/**
 * Galería de 6 avatares. Tap-to-select. El seleccionado tiene un anillo accent.
 * Mobile: 2x3, desktop: 3x2.
 */
export function AvatarPicker({ selected, onChange }: Props) {
  return (
    <div
      className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4"
      role="radiogroup"
      aria-label="Elige un avatar"
    >
      {AVATARS.map((a) => {
        const isSelected = selected === a.id;
        return (
          <button
            key={a.id}
            type="button"
            role="radio"
            aria-checked={isSelected}
            aria-label={a.label}
            onClick={() => onChange(a.id)}
            className={cn(
              "group relative flex aspect-square items-center justify-center rounded-2xl border bg-[var(--card)] p-3 transition-all",
              "hover:border-[var(--color-primary)] hover:shadow-sm",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]",
              isSelected
                ? "border-[var(--color-accent)] ring-2 ring-[var(--color-accent)] shadow-sm"
                : "border-[var(--border)]"
            )}
          >
            <Image
              src={`/avatars/${a.id}.svg`}
              alt={a.label}
              width={128}
              height={128}
              className="h-full w-full object-contain"
              unoptimized
            />
            {isSelected ? (
              <span className="absolute right-2 top-2 inline-flex h-5 w-5 items-center justify-center rounded-full bg-[var(--color-accent)] text-[10px] font-bold text-white shadow">
                ✓
              </span>
            ) : null}
          </button>
        );
      })}
    </div>
  );
}

export const AVATAR_IDS = AVATARS.map((a) => a.id);
