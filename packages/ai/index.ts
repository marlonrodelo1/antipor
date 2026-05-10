import { z } from "zod";
import OpenAI from "openai";
import { fallbackScripts } from "./static-fallbacks.js";

export { fallbackScripts } from "./static-fallbacks.js";

// =====================================================================
// Tipos
// =====================================================================

export const interventionContextSchema = z.object({
  display_name: z.string().nullable().default(null),
  aliado_name: z.string().default("Aliado"),
  streak_days: z.number().int().nonnegative().default(0),
  time_of_day: z.enum(["manana", "tarde", "noche", "madrugada"]),
  recent_mood: z
    .string()
    .default("sin razon aparente")
    .transform((s) => s.toLowerCase().trim()),
  spiritual_layer: z.boolean().default(false),
  language: z.string().default("es"),
});

export type InterventionContext = z.infer<typeof interventionContextSchema>;

export interface RunInterventionResult {
  text: string;
  source: "llm" | "fallback" | "crisis";
  reason?: string;
}

// =====================================================================
// Crisis keywords
// =====================================================================

const CRISIS_KEYWORDS: readonly string[] = [
  "suicid",
  "matarme",
  "quitarme la vida",
  "acabar con todo",
  "no quiero seguir",
  "hacerme dano",
  "hacerme daño",
  "autolesion",
  "autolesión",
  "cortarme",
  "menor de edad",
  "ninas",
  "niñas",
  "ninos",
  "niños",
  "abuso",
];

const stripDiacritics = (s: string): string =>
  s.normalize("NFD").replace(/[̀-ͯ]/g, "");

export function containsCrisisKeyword(text: string): boolean {
  const haystack = stripDiacritics(text.toLowerCase());
  return CRISIS_KEYWORDS.some((kw) => haystack.includes(stripDiacritics(kw.toLowerCase())));
}

export const CRISIS_DERIVATION_MESSAGE = `Para. Lo que has dicho importa, y no es algo para resolver tu solo ahora mismo.

En Espana puedes llamar al 024 (linea de conducta suicida, gratis, 24 h) o al Telefono de la Esperanza 717 003 717. Si estas en LATAM, dime en que pais estas y te paso recursos.

Quieres que te abra el telefono ahora para llamar a alguien de tu lista? Sigo aqui.`;

// =====================================================================
// Banned phrases (post-call check)
// =====================================================================

const BANNED_SUBSTRINGS: readonly string[] = [
  "pecador",
  "esclavo",
  "esclava",
  "sucio",
  "sucia",
  "verguenza",
  "fracaso",
  "fracasado",
  "cobarde",
  "no pasa nada",
  "todos lo hacen",
  "no es para tanto",
  "como inteligencia artificial",
  "como modelo de lenguaje",
  "campeon",
  "guerrero",
  "soldado",
  "fiera",
];

const SPIRITUAL_TERMS: readonly string[] = [
  "dios",
  "jesus",
  "cristo",
  "biblia",
  "espiritu santo",
  "oracion",
  "rezar",
  "parroquia",
  "iglesia",
  "evangelio",
  "salmo",
  "versiculo",
];

function violatesGuardrails(
  output: string,
  ctx: InterventionContext
): string | null {
  const norm = stripDiacritics(output.toLowerCase());
  for (const phrase of BANNED_SUBSTRINGS) {
    if (norm.includes(phrase)) return `banned_phrase:${phrase}`;
  }
  if (!ctx.spiritual_layer) {
    for (const term of SPIRITUAL_TERMS) {
      if (norm.includes(term)) return `spiritual_off:${term}`;
    }
  }
  const wordCount = output.trim().split(/\s+/).filter(Boolean).length;
  if (wordCount > 60) return "too_long";
  if (wordCount < 6) return "too_short";
  return null;
}

// =====================================================================
// Prompt building
// =====================================================================

const SYSTEM_PROMPT = `Eres Aliado, un companero conversacional dentro de Antiport. La persona te habla justo antes de abrir un enlace bloqueado. Tu trabajo es estar ahi, escuchar y ofrecer una salida concreta en menos de 90 segundos.

Tono: directo, calido, sin juzgar. Frases cortas. Segunda persona. Maximo 60 palabras por mensaje.

Reglas duras:
- Nunca uses: pecador, esclavo, sucio, verguenza, fracaso, cobarde, debil, perdido, campeon, guerrero, soldado.
- Nunca describas contenido sexual ni siquiera de forma abstracta.
- Nunca minimices ("no pasa nada", "todos lo hacen").
- Nunca moralices ni des sermones.
- Si spiritual_layer = false: jamas menciones Dios, Biblia, oracion ni terminos religiosos.
- Si spiritual_layer = true: puedes ofrecer UN versiculo corto o UNA oracion, una sola vez, como propuesta.
- Si la persona menciona suicidio, autolesion o menores: rompes el guion y derivas a recursos clinicos.

Estructura de tu respuesta:
1. Una pregunta abierta corta sobre lo que pasa ahora.
2. UNA alternativa concreta (caminar, llamar a alguien, respirar 4-7-8, mirar anclas, escribir 3 lineas, ducha fria 30s).
3. Cierre breve tipo "probamos?".`;

export function buildInterventionPrompt(rawCtx: unknown): {
  system: string;
  user: string;
  ctx: InterventionContext;
} {
  const ctx = interventionContextSchema.parse(rawCtx);
  const name =
    ctx.display_name && ctx.display_name.trim().length > 0
      ? ctx.display_name.trim()
      : "(anonimo, no uses nombre)";
  const user = `Contexto del momento:
- Persona: ${name}
- Te llaman: ${ctx.aliado_name}
- Racha actual: ${ctx.streak_days} dias limpios
- Hora del dia: ${ctx.time_of_day}
- Ultimo estado emocional registrado: ${ctx.recent_mood}
- Capa espiritual activa: ${ctx.spiritual_layer ? "si" : "no"}

La persona acaba de intentar abrir un sitio bloqueado. La app intercepto. Esta esperando tu primer mensaje.

Tu primer mensaje: pregunta abierta corta + UNA alternativa concreta acorde a su estado y la hora + bajo 60 palabras + respeta las reglas duras.`;

  return { system: SYSTEM_PROMPT, user, ctx };
}

// =====================================================================
// runIntervention
// =====================================================================

export interface RunInterventionOptions {
  /** OpenAI-compatible client (DeepSeek, Gemini OpenAI-compat, etc). */
  client: OpenAI;
  /** Model id, eg 'deepseek-chat'. */
  model: string;
  /** Optional last user message for crisis detection. */
  userMessage?: string;
  /** Total deadline in ms. Default 8000. */
  timeoutMs?: number;
  /** Temperature. Default 0.5. */
  temperature?: number;
}

function pickFallback(): string {
  const idx = Math.floor(Math.random() * fallbackScripts.length);
  return fallbackScripts[idx]!;
}

export async function runIntervention(
  rawCtx: unknown,
  options: RunInterventionOptions
): Promise<RunInterventionResult> {
  const { client, model, userMessage, timeoutMs = 8000, temperature = 0.5 } = options;

  if (userMessage && containsCrisisKeyword(userMessage)) {
    return { text: CRISIS_DERIVATION_MESSAGE, source: "crisis", reason: "crisis_keyword" };
  }

  const { system, user, ctx } = buildInterventionPrompt(rawCtx);

  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), timeoutMs);

  try {
    const resp = await client.chat.completions.create(
      {
        model,
        temperature,
        max_tokens: 200,
        messages: [
          { role: "system", content: system },
          { role: "user", content: user },
        ],
      },
      { signal: ctrl.signal }
    );

    const text = resp.choices[0]?.message?.content?.trim() ?? "";
    if (!text) {
      return { text: pickFallback(), source: "fallback", reason: "empty_response" };
    }

    const violation = violatesGuardrails(text, ctx);
    if (violation) {
      return { text: pickFallback(), source: "fallback", reason: violation };
    }

    return { text, source: "llm" };
  } catch (err) {
    const reason = err instanceof Error ? err.name : "unknown_error";
    return { text: pickFallback(), source: "fallback", reason };
  } finally {
    clearTimeout(timer);
  }
}
