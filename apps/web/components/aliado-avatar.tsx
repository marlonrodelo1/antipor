import { cn } from "@/lib/utils";

type AliadoState = "reposo" | "escuchando" | "hablando";
type AliadoTone = "primary" | "warm" | "secondary";

interface Props {
  state?: AliadoState;
  tone?: AliadoTone;
  size?: number;
  className?: string;
}

const toneMap: Record<AliadoTone, { core: string; halo: string }> = {
  primary: { core: "#3B6EA8", halo: "rgba(59,110,168,0.18)" },
  warm: { core: "#D97757", halo: "rgba(217,119,87,0.20)" },
  secondary: { core: "#7BA888", halo: "rgba(123,168,136,0.20)" },
};

/**
 * Aliado avatar — abstract organic shape (NEVER a human face).
 * Three states animated via pure CSS:
 *   - reposo: gentle breathing scale
 *   - escuchando: rippling concentric halos
 *   - hablando: tighter pulse
 */
export function AliadoAvatar({
  state = "reposo",
  tone = "primary",
  size = 96,
  className,
}: Props) {
  const { core, halo } = toneMap[tone];
  const id = `aliado-${tone}`;

  return (
    <div
      className={cn("relative inline-flex items-center justify-center", className)}
      style={{ width: size, height: size }}
      aria-hidden
    >
      {/* halos */}
      <span
        className={cn(
          "absolute inset-0 rounded-full",
          state === "escuchando" && "aliado-ring-listen",
          state === "hablando" && "aliado-ring-talk"
        )}
        style={{ background: halo }}
      />
      <span
        className={cn(
          "absolute inset-2 rounded-full",
          state === "escuchando" && "aliado-ring-listen-2",
          state === "hablando" && "aliado-ring-talk-2"
        )}
        style={{ background: halo }}
      />
      {/* core blob */}
      <svg
        viewBox="0 0 100 100"
        className={cn(
          "relative drop-shadow-sm",
          state === "reposo" && "aliado-breathe",
          state === "hablando" && "aliado-pulse"
        )}
        style={{ width: size * 0.72, height: size * 0.72 }}
      >
        <defs>
          <radialGradient id={id} cx="35%" cy="30%" r="80%">
            <stop offset="0%" stopColor="#fff" stopOpacity="0.6" />
            <stop offset="40%" stopColor={core} stopOpacity="0.95" />
            <stop offset="100%" stopColor={core} stopOpacity="1" />
          </radialGradient>
        </defs>
        <path
          d="M50 6 C72 6 94 22 94 48 C94 70 78 94 50 94 C26 94 6 76 6 52 C6 26 28 6 50 6 Z"
          fill={`url(#${id})`}
        />
      </svg>

      <style>{`
        .aliado-breathe { animation: aliado-breathe 4.5s ease-in-out infinite; }
        .aliado-pulse { animation: aliado-pulse 1.1s ease-in-out infinite; }
        .aliado-ring-listen { animation: aliado-ring 2.4s ease-out infinite; }
        .aliado-ring-listen-2 { animation: aliado-ring 2.4s ease-out infinite 0.8s; }
        .aliado-ring-talk { animation: aliado-ring-fast 1.2s ease-out infinite; }
        .aliado-ring-talk-2 { animation: aliado-ring-fast 1.2s ease-out infinite 0.4s; }
        @keyframes aliado-breathe {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.04); opacity: 0.95; }
        }
        @keyframes aliado-pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.06); }
        }
        @keyframes aliado-ring {
          0% { transform: scale(0.85); opacity: 0.7; }
          100% { transform: scale(1.18); opacity: 0; }
        }
        @keyframes aliado-ring-fast {
          0% { transform: scale(0.9); opacity: 0.85; }
          100% { transform: scale(1.22); opacity: 0; }
        }
      `}</style>
    </div>
  );
}
