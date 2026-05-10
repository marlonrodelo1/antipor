import type { Config } from "tailwindcss";

// Tailwind 4 mostly reads its config from CSS via @theme. This file is kept
// for tooling (intellisense, prettier-plugin-tailwindcss, etc.) and to opt
// into class-based dark mode.
const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#3B6EA8",
        secondary: "#7BA888",
        accent: "#E8B96A",
        warm: "#D97757",
        bg: "#F7F5F2",
        ink: "#1C2128",
      },
      fontFamily: {
        serif: ["var(--font-fraunces)", "Georgia", "serif"],
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
