# @antiport/ai

Prompts del agente Aliado y motor de intervencion.

## Contenido

| Archivo | Que es |
|---|---|
| `system-prompt.md` | System prompt completo (referencia humana). |
| `intervention-prompt.md` | Plantilla de user prompt + ejemplos. |
| `guardrails.md` | Reglas de seguridad pre/post LLM. |
| `derivation.md` | Recursos clinicos para crisis. |
| `static-fallbacks.ts` | 12 mensajes estaticos rotativos. |
| `index.ts` | API publica. |

## API

```ts
import OpenAI from "openai";
import { runIntervention, containsCrisisKeyword } from "@antiport/ai";

const client = new OpenAI({
  apiKey: process.env.DEEPSEEK_API_KEY!,
  baseURL: "https://api.deepseek.com/v1",
});

const result = await runIntervention(
  {
    display_name: "Marlon",
    aliado_name: "Aliado",
    streak_days: 14,
    time_of_day: "noche",
    recent_mood: "cansado",
    spiritual_layer: false,
    language: "es",
  },
  { client, model: "deepseek-chat", userMessage: "no puedo mas" }
);

console.log(result.source); // 'llm' | 'fallback' | 'crisis'
console.log(result.text);
```

## Decisiones

- DeepSeek V3 como primario (coste / latencia). Gemini 2.5 Flash como fallback (configurable en n8n).
- Temperatura 0.5 por defecto: no queremos respuestas demasiado creativas en crisis.
- Timeout total 8 s, 200 tokens max. Si excede o incumple guardrails -> fallback estatico.
- Crisis keywords se detectan **antes** de la llamada al modelo. Coste cero y respuesta inmediata.
