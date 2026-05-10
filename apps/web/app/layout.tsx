import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";
import "./globals.css";
import { PostHogProvider } from "@/components/posthog-provider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
  axes: ["SOFT", "WONK", "opsz"],
});

export const metadata: Metadata = {
  title: "Antiport — Cuando el impulso llegue, no estarás solo",
  description:
    "Antiport intercepta el momento exacto y te acompaña con IA. Una conversación, no un bloqueo. Gratis, privado, sin juicio.",
  metadataBase: new URL("https://antiport.app"),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={`${inter.variable} ${fraunces.variable}`}>
      <body className="min-h-screen bg-[var(--background)] text-[var(--foreground)] antialiased">
        <PostHogProvider>{children}</PostHogProvider>
      </body>
    </html>
  );
}
