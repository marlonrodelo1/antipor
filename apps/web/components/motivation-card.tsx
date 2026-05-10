"use client";

import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  icon: LucideIcon;
  label: string;
  value: string;
  selected: boolean;
  onSelect: (value: string) => void;
}

/**
 * Card seleccionable para motivaciones (radio-like).
 */
export function MotivationCard({
  icon: Icon,
  label,
  value,
  selected,
  onSelect,
}: Props) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      onClick={() => onSelect(value)}
      className={cn(
        "flex items-center gap-3 rounded-2xl border bg-[var(--card)] px-4 py-4 text-left transition-all",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-1 focus-visible:ring-offset-[var(--background)]",
        selected
          ? "border-[var(--color-primary)] bg-[var(--color-primary-soft)] shadow-sm"
          : "border-[var(--border)] hover:border-[var(--color-primary)]"
      )}
    >
      <span
        className={cn(
          "inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full",
          selected
            ? "bg-[var(--color-primary)] text-white"
            : "bg-[var(--color-hairline)] text-[var(--color-ink-2)]"
        )}
      >
        <Icon size={18} />
      </span>
      <span className="text-[15px] font-medium text-[var(--foreground)]">
        {label}
      </span>
    </button>
  );
}
