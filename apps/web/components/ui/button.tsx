import * as React from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "warm" | "dark" | "ghost" | "outline";
type Size = "sm" | "md" | "lg";

const variants: Record<Variant, string> = {
  primary:
    "bg-[var(--color-primary)] text-white hover:bg-[#345f93] active:bg-[#2c5481]",
  secondary:
    "bg-[var(--color-secondary)] text-white hover:bg-[#6a957a] active:bg-[#5d8569]",
  warm: "bg-[var(--color-warm)] text-white hover:bg-[#c4694b] active:bg-[#b25e44]",
  dark: "bg-[var(--color-ink)] text-white hover:bg-black active:bg-black/90",
  ghost:
    "bg-transparent text-[var(--foreground)] hover:bg-[var(--color-hairline)]",
  outline:
    "bg-transparent border border-[var(--color-hairline-strong)] text-[var(--foreground)] hover:bg-[var(--color-hairline)]",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-3.5 text-sm rounded-full",
  md: "h-11 px-5 text-sm rounded-full",
  lg: "h-12 px-6 text-base rounded-full",
};

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      leftIcon,
      rightIcon,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center gap-2 font-semibold transition-colors disabled:opacity-50 disabled:pointer-events-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]",
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      >
        {leftIcon}
        {children}
        {rightIcon}
      </button>
    );
  }
);
Button.displayName = "Button";
