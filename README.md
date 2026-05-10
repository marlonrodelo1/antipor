# Antiport

App movil **gratuita** que ayuda a frenar el consumo de pornografia con intervencion conversacional IA en el momento exacto del impulso. Capa cristiana opcional. Proyecto misional, no comercial.

Lectura previa: [`.claude/plans/quiero-crear-una-aplicaci-n-glowing-storm.md`](./.claude/plans/quiero-crear-una-aplicaci-n-glowing-storm.md).

## Estructura del monorepo

```
antiport/
├── apps/
│   ├── mobile/         # React Native + Expo Dev Client (iOS + Android, modulos nativos)
│   ├── web/            # Next.js 16 (landing, panel usuario, API)
│   └── n8n-flows/      # Workflows JSON exportables (DeepSeek, Resend, blocklist update)
├── packages/
│   ├── db/             # Drizzle schema + migraciones + RLS para Supabase Postgres
│   └── ai/             # System prompt, guardrails, motor de intervencion
└── web/                # Prototipo de diseno HTML/JSX (Claude Design output)
```

> **Nota**: el directorio `web/` en la raiz es el prototipo de diseno generado por Claude Design (lo sirve Claude Preview en `localhost:5173`). El **panel y landing reales** viven en `apps/web/`. No mezclar.

## Bring it up (desarrollo)

### 1. Requisitos

- Node.js 20+ (recomendado 22 LTS)
- pnpm 9+ (`npm i -g pnpm`)
- Cuenta Supabase (proyecto EU, region `eu-west-1`)
- Cuenta Resend (envio email)
- API key DeepSeek y Gemini (fallback)
- n8n self-hosted (Easypanel/Dokploy)

### 2. Instalar dependencias

```bash
pnpm install
```

(Workspaces: `apps/*` y `packages/*`. Si prefieres npm workspaces, borra `pnpm-workspace.yaml` y usa `npm install`.)

### 3. Variables de entorno

Cada app tiene su `.env.example`. Copia y rellena:

```bash
cp apps/web/.env.example apps/web/.env.local        # TODO: crear .env.example
cp apps/mobile/.env.example apps/mobile/.env        # TODO
```

Variables minimas:

```
SUPABASE_URL=
SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
DEEPSEEK_API_KEY=
GEMINI_API_KEY=
RESEND_API_KEY=
N8N_WEBHOOK_URL=https://n8n.example.com/webhook/antiport/intervene
```

### 4. Aplicar migraciones a Supabase

Ver [`packages/db/README.md`](./packages/db/README.md). Resumen:

```bash
psql "$SUPABASE_DB_URL" -f packages/db/migrations/0001_init.sql
psql "$SUPABASE_DB_URL" -f packages/db/migrations/0002_rls.sql
psql "$SUPABASE_DB_URL" -f packages/db/seed.sql
```

O via Supabase MCP `apply_migration` desde Claude Code.

### 5. Importar workflows n8n

Ver [`apps/n8n-flows/README.md`](./apps/n8n-flows/README.md). Importa los 4 JSON, configura credenciales (DeepSeek, Gemini, Supabase Service, Resend), activa cuando esten testeados.

### 6. Levantar dev

```bash
pnpm --filter @antiport/web dev          # Next 16 en :3000
pnpm --filter @antiport/mobile start     # Expo Dev Client
```

## Privacidad (no negociable)

- Cero historial de URLs visitadas en servidor.
- `intervention_log` solo guarda categoria, mood y outcome — nunca el dominio.
- Borrado de cuenta = 1 tap, propaga a Supabase con RLS + cascade.
- Politica RGPD ligera revisada antes de submit a App Store / Play Store.

## Estado

v0.1 — validacion. Prototipo de diseno listo. Schema y prompts scaffolded. Modulos nativos iOS/Android pendientes.

## Licencia

TBD (probablemente MIT con clausula no-comercial para uso del nombre).
