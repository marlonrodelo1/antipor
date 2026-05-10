/**
 * Observabilidad: Sentry + PostHog.
 *
 * Las inicializaciones son no-op si las variables de entorno no están
 * presentes, para que el entorno de desarrollo sin claves no falle.
 */

const SENTRY_DSN = process.env.SENTRY_DSN ?? process.env.NEXT_PUBLIC_SENTRY_DSN;
const POSTHOG_KEY =
  process.env.POSTHOG_KEY ?? process.env.NEXT_PUBLIC_POSTHOG_KEY;
const POSTHOG_HOST =
  process.env.POSTHOG_HOST ??
  process.env.NEXT_PUBLIC_POSTHOG_HOST ??
  "https://eu.i.posthog.com";

export async function initSentryServer() {
  if (!SENTRY_DSN) return;
  try {
    const Sentry = await import("@sentry/nextjs");
    Sentry.init({
      dsn: SENTRY_DSN,
      tracesSampleRate: 0.1,
      environment: process.env.NODE_ENV,
    });
  } catch {
    // Dependencia no instalada todavía: ignoramos.
  }
}

export async function initSentryEdge() {
  if (!SENTRY_DSN) return;
  try {
    const Sentry = await import("@sentry/nextjs");
    Sentry.init({
      dsn: SENTRY_DSN,
      tracesSampleRate: 0.05,
      environment: process.env.NODE_ENV,
    });
  } catch {
    // Ignorar si no está disponible.
  }
}

let serverPosthog: unknown = null;

export async function getServerPosthog() {
  if (!POSTHOG_KEY) return null;
  if (serverPosthog) return serverPosthog;
  try {
    const { PostHog } = await import("posthog-node");
    serverPosthog = new PostHog(POSTHOG_KEY, {
      host: POSTHOG_HOST,
      flushAt: 1,
      flushInterval: 0,
    });
    return serverPosthog;
  } catch {
    return null;
  }
}

export const observabilityConfig = {
  sentryDsn: SENTRY_DSN ?? null,
  posthogKey: POSTHOG_KEY ?? null,
  posthogHost: POSTHOG_HOST,
  enabled: Boolean(SENTRY_DSN || POSTHOG_KEY),
};
