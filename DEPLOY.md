# Antiport — Despliegue

## Que se despliega y donde

| Componente | Dónde | Cómo |
|---|---|---|
| `apps/web/` (Next.js) | **Dokploy** (VPS propio) | Dockerfile multi-stage |
| `apps/mobile/` (Expo) | **App Store / Play Store** | EAS Build + EAS Submit |
| `apps/n8n-flows/` | **n8n self-hosted** (mismo VPS) | Importar JSON manualmente |
| Base de datos | **Supabase Cloud** (`antiport-dev`, eu-west-1) | Ya creada |

---

## 1. Web (Dokploy)

### Configuración en Dokploy

1. **Create Application** → tipo `Application`.
2. **Source**: GitHub → repo `marlonrodelo1/antipor` → branch `main`.
3. **Build Type**: `Dockerfile`.
4. **Build Context**: `/` (raíz del repo, no `apps/web`).
5. **Dockerfile Path**: `apps/web/Dockerfile`.
6. **Port**: `3000`.

### Variables de entorno

Pega esto en `Environment Variables` de Dokploy:

```
NEXT_PUBLIC_SUPABASE_URL=https://ttiigvalqyqgzmgfvywy.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_-leCRokkNKbqYduAMrS6vQ_FxkpXp8-
SUPABASE_SERVICE_ROLE_KEY=<copialo desde Supabase Settings -> API Keys>
N8N_INTERVENE_WEBHOOK=https://tu-n8n.dominio.com/webhook/intervene
RESEND_API_KEY=
SENTRY_DSN=
POSTHOG_KEY=
NEXT_TELEMETRY_DISABLED=1
```

### Dominio

En Dokploy → `Domains` → añade tu dominio (`antiport.app` cuando lo registres) y activa Let's Encrypt automatico.

### Deploy

Cada push a `main` dispara un rebuild si tienes el webhook activado en Dokploy.

---

## 2. Mobile (Expo / EAS)

NO se despliega por Dokploy. Va por EAS:

```bash
cd apps/mobile
npx eas-cli login
npx eas-cli build:configure       # crea eas.json
npx eas-cli build --profile preview --platform all   # primer build de prueba
npx eas-cli submit --platform ios
npx eas-cli submit --platform android
```

Requisitos:
- **Apple Developer Program** activo (99 €/año).
- **Google Play Console** activo (25 € pago único).

---

## 3. n8n (mismo VPS, fuera de Dokploy o como app aparte)

Levanta n8n via Docker en tu VPS:

```bash
docker run -d \
  --name n8n \
  --restart unless-stopped \
  -p 5678:5678 \
  -v n8n_data:/home/node/.n8n \
  -e N8N_HOST=n8n.tudominio.com \
  -e WEBHOOK_URL=https://n8n.tudominio.com/ \
  -e DB_TYPE=postgresdb \
  -e DB_POSTGRESDB_HOST=db.ttiigvalqyqgzmgfvywy.supabase.co \
  -e DB_POSTGRESDB_USER=postgres \
  -e DB_POSTGRESDB_PASSWORD=<password> \
  n8nio/n8n
```

Luego importa los 4 JSON de `apps/n8n-flows/` desde la UI.

---

## 4. Supabase

Ya está montada en `antiport-dev`. Solo hay que:
1. Activar **Email/Password** en Auth Providers (Dashboard → Authentication → Providers).
2. Crear el `service_role` key y pegarlo en Dokploy (env var arriba).

---

## Checklist antes del primer deploy

- [ ] `SUPABASE_SERVICE_ROLE_KEY` copiado a Dokploy.
- [ ] Auth Email/Password activado en Supabase.
- [ ] Dominio apuntado al VPS de Dokploy.
- [ ] Webhook de GitHub → Dokploy activado.
- [ ] n8n levantado y `N8N_INTERVENE_WEBHOOK` actualizado.
- [ ] Stripe conectado solo cuando haya donaciones.
