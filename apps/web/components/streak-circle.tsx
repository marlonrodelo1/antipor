import { cn } from "@/lib/utils";

interface Props {
  days: number;
  max?: number;
  size?: number;
  className?: string;
}

/**
 * Círculo orgánico que se "llena" con la racha actual.
 * El trazo es de color secondary (#7BA888). Sin texto numérico dentro
 * (el número se renderiza por fuera para tipografía consistente).
 */
export function StreakCircle({
  days,
  max = 30,
  size = 160,
  className,
}: Props) {
  const ratio = Math.max(0, Math.min(1, days / max));
  const radius = 64;
  const circumference = 2 * Math.PI * radius;
  const dash = circumference * ratio;
  const gap = circumference - dash;

  return (
    <svg
      viewBox="0 0 160 160"
      width={size}
      height={size}
      className={cn("block", className)}
      aria-hidden
    >
      <defs>
        <radialGradient id="streak-bg" cx="50%" cy="45%" r="55%">
          <stop offset="0%" stopColor="#7BA888" stopOpacity="0.08" />
          <stop offset="100%" stopColor="#7BA888" stopOpacity="0.02" />
        </radialGradient>
      </defs>
      {/* fondo orgánico */}
      <path
        d="M80 12 C118 12 148 38 148 78 C148 118 118 148 80 148 C42 148 12 118 12 80 C12 40 42 12 80 12 Z"
        fill="url(#streak-bg)"
      />
      {/* trazo base */}
      <circle
        cx="80"
        cy="80"
        r={radius}
        fill="none"
        stroke="#ECE7DF"
        strokeWidth="6"
      />
      {/* trazo activo */}
      <circle
        cx="80"
        cy="80"
        r={radius}
        fill="none"
        stroke="#7BA888"
        strokeWidth="6"
        strokeLinecap="round"
        strokeDasharray={`${dash} ${gap}`}
        strokeDashoffset={circumference / 4}
        transform="rotate(-90 80 80)"
        style={{ transition: "stroke-dasharray 600ms ease-out" }}
      />
    </svg>
  );
}
