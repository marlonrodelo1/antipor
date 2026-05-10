# Antiport — Web

Landing pública, panel del usuario y API HTTP de Antiport.

Stack: Next.js 16 (App Router) + TypeScript + React 19 + Tailwind 4 + shadcn-style UI + Supabase SSR + Drizzle + Zod.

## Requisitos

- Node 20+ (recomendado 22)
- pnpm o npm

## Primer arranque

```bash
cd apps/web
cp .env.example .env.local
# Rellena las variables (al menos NEXT_PUBLIC_SUPABASE_URL y NEXT_PUBLIC_SUPABASE_ANON_KEY)
npm install
npm run dev
```

Abre http://localhost:3000.

## Variables de entorno

| Variable | Para qué sirve |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | URL del proyecto Supabase. |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Key anónima (cliente y SSR). |
| `SUPABASE_SERVICE_ROLE_KEY` | Solo servidor. Bypass de RLS para tareas administrativas. |
| `N8N_INTERVENE_WEBHOOK` | Webhook de n8n que genera la intervención IA. |
| `RESEND_API_KEY` | Envío de emails transaccionales. |
| `SENTRY_DSN` | Observabilidad. |
| `POSTHOG_KEY` | Producto/analytics (EU). |

Si `N8N_INTERVENE_WEBHOOK` no está configurado, `/api/v1/intervene` devuelve una respuesta segura de fallback. La intervención nunca debe fallar al usuario durante un impulso.

## Estructura

```
app/
  page.tsx               Landing pública
  (auth)/                login, signup, recuperar
  panel/                 área autenticada (Hoy, Diario, Anclas, Ajustes)
  api/
    health
    v1/intervene         POST  → reenvía a n8n
    v1/checkin           POST  → registra check-in anónimo
    v1/blocklist         GET   → versión firmada de la lista
components/
  landing/               secciones de la landing
  ui/                    primitivos shadcn-style hechos a mano
  aliado-avatar.tsx      avatar abstracto del agente IA
data/
  blocklist.json         lista placeholder con dominios .invalid
lib/
  supabase/              clientes server / browser / admin
  auth.ts                requireUser()
middleware.ts            refresco de cookies SSR + protección de /panel/*
```

## Privacidad

- `/api/v1/checkin` registra sólo mood, hora, día de la semana e intensidad. Nunca URLs.
- `/api/v1/blocklist` sirve un JSON cacheable; las URLs visitadas por el usuario nunca llegan al servidor.

## Despliegue

Pensado para Dokploy en VPS. `next start` detrás del reverse proxy. Variables de entorno en el panel de Dokploy.
