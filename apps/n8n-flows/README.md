# Antiport — n8n workflows

Cuatro workflows para importar en una instancia n8n self-hosted (Easypanel/Dokploy).

| Archivo | Trigger | Que hace |
|---|---|---|
| `generate-intervention.json` | Webhook `POST /webhook/antiport/intervene` | Genera mensaje del Aliado: detecta crisis, llama DeepSeek, fallback a Gemini si 5xx, aplica guardrails, devuelve JSON. |
| `daily-encouragement.json` | Cron diario 09:00 | Lee usuarios opt-in, personaliza mensaje (secular o espiritual segun perfil), envia push (Expo) y email (Resend). |
| `blocklist-update.json` | Cron semanal lunes 04:00 | Descarga `StevenBlack/hosts` lista porn, parsea, upsert en `blocklist_domains` via Supabase REST. |
| `weekly-report.json` | Cron domingo 20:00 | Para cada usuario opt-in: agrega `intervention_log` de 7 dias, renderiza email HTML+texto, envia via Resend. |

## Importar

En el panel de n8n:

1. **Workflows -> Import from File** -> selecciona el `.json`.
2. Repite para los cuatro.
3. Crea las credenciales que cada workflow pide (ver tabla abajo).
4. Ajusta variables de entorno de la instancia n8n.
5. Activa el workflow.

## Credenciales necesarias

| Credencial | Tipo | Workflows que la usan |
|---|---|---|
| **DeepSeek API Key** | HTTP Header Auth: `Authorization: Bearer <key>` | `generate-intervention` |
| **Gemini API Key** | HTTP Header Auth: `Authorization: Bearer <key>` (OpenAI-compat endpoint) | `generate-intervention` |
| **Supabase Service Role** | HTTP Header Auth (cabeceras `apikey` + `Authorization` ya estan inline en cada nodo HTTP) | `daily-encouragement`, `blocklist-update`, `weekly-report` |
| **Resend SMTP** | SMTP estandar (`smtp.resend.com:465`, user `resend`, pass = API key) | `daily-encouragement` |
| **Resend HTTP** | API key vía variable `RESEND_API_KEY` | `weekly-report` |
| **Expo Push** | Sin credencial (placeholder); ver TODO abajo | `daily-encouragement` |

## Variables de entorno

Configura en n8n (Settings > Environment Variables) o en el `.env` del contenedor:

```
SUPABASE_URL=https://<ref>.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...
DEEPSEEK_API_KEY=sk-...
GEMINI_API_KEY=AIza...
RESEND_API_KEY=re_...
EXPO_PUSH_TOKEN_PLACEHOLDER=ExponentPushToken[xxxxxxxx]
```

## TODOs

- `daily-encouragement`: el nodo Expo Push usa un token placeholder. Reemplazar por lookup en una tabla `push_tokens` (TODO crear) que mapee `user_id -> expo_push_token`.
- `weekly-report`: el email del usuario se debe leer de `auth.users` (no esta en `user_profile`); ajustar query a un view que joinee.
- Health check externo (UptimeRobot) sobre el webhook `/webhook/antiport/intervene` con payload de prueba.
- Panel n8n: configurar retencion de ejecuciones a 7 dias para no acumular logs sensibles.
- Latencia: medir P95 del webhook `intervene` y crear alerta en PostHog si >3s.
