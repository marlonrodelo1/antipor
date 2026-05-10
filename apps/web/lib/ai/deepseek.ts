import "server-only";
import OpenAI from "openai";
import { fallbackScripts } from "@antiport/ai";

let cachedClient: OpenAI | null = null;

function getClient(): OpenAI | null {
  const apiKey = process.env.DEEPSEEK_API_KEY;
  if (!apiKey) return null;
  if (cachedClient) return cachedClient;
  const baseURL =
    process.env.DEEPSEEK_BASE_URL?.trim() || "https://api.deepseek.com";
  cachedClient = new OpenAI({ apiKey, baseURL });
  return cachedClient;
}

function pickFallback(): string {
  const idx = Math.floor(Math.random() * fallbackScripts.length);
  return fallbackScripts[idx]!;
}

export interface DeepseekResult {
  text: string;
  source: "llm" | "fallback";
  reason?: string;
}

/**
 * Llama a DeepSeek con un prompt completo (single-message).
 * Si la API key no esta configurada, devuelve fallback estatico.
 * Si la llamada falla por cualquier motivo, devuelve fallback estatico.
 * NUNCA lanza excepcion — el caller siempre recibe un texto valido.
 */
export async function callDeepseek(
  prompt: string,
  opts: { timeoutMs?: number; temperature?: number; maxTokens?: number } = {}
): Promise<DeepseekResult> {
  const client = getClient();
  if (!client) {
    return { text: pickFallback(), source: "fallback", reason: "no_api_key" };
  }

  const { timeoutMs = 8000, temperature = 0.5, maxTokens = 240 } = opts;
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), timeoutMs);

  try {
    const resp = await client.chat.completions.create(
      {
        model: "deepseek-chat",
        temperature,
        max_tokens: maxTokens,
        messages: [{ role: "system", content: prompt }],
      },
      { signal: ctrl.signal }
    );
    const text = resp.choices[0]?.message?.content?.trim() ?? "";
    if (!text) {
      return { text: pickFallback(), source: "fallback", reason: "empty" };
    }
    return { text, source: "llm" };
  } catch (err) {
    const reason = err instanceof Error ? err.name : "unknown";
    return { text: pickFallback(), source: "fallback", reason };
  } finally {
    clearTimeout(timer);
  }
}
