"use client";
import { useEffect } from "react";

const POSTHOG_KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY;
const POSTHOG_HOST =
  process.env.NEXT_PUBLIC_POSTHOG_HOST ?? "https://eu.i.posthog.com";

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (!POSTHOG_KEY) return;
    let cancelled = false;
    (async () => {
      try {
        const posthogModule = await import("posthog-js");
        if (cancelled) return;
        const posthog = posthogModule.default;
        if (!posthog.__loaded) {
          posthog.init(POSTHOG_KEY, {
            api_host: POSTHOG_HOST,
            capture_pageview: true,
            persistence: "localStorage",
            // Privacidad por defecto: nada de URLs sensibles.
            mask_all_text: false,
            disable_session_recording: true,
          });
        }
      } catch {
        // Dependencia no instalada o bloqueada: ignoramos.
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return <>{children}</>;
}
