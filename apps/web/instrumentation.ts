/**
 * Next.js 16 instrumentation hook.
 * Inicializa Sentry para los runtimes de Node y Edge.
 */
import { initSentryEdge, initSentryServer } from "@/lib/observability";

export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    await initSentryServer();
  } else if (process.env.NEXT_RUNTIME === "edge") {
    await initSentryEdge();
  }
}
