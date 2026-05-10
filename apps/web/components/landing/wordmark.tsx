import Link from "next/link";
import { cn } from "@/lib/utils";

interface Props {
  dark?: boolean;
  className?: string;
}

export function Wordmark({ dark = false, className }: Props) {
  return (
    <Link
      href="/"
      className={cn(
        "inline-flex items-center gap-2 font-serif text-[22px] tracking-tight",
        dark ? "text-white" : "text-[var(--foreground)]",
        className
      )}
    >
      <span
        className="inline-block h-2.5 w-2.5 rounded-full"
        style={{ background: "var(--color-primary)" }}
        aria-hidden
      />
      Antiport
    </Link>
  );
}
