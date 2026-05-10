import { z } from 'zod';

const API_URL = process.env.EXPO_PUBLIC_API_URL ?? '';

/**
 * Categoría del trigger detectado. NUNCA enviamos el dominio en claro:
 * el módulo nativo lo clasifica localmente y solo manda la categoría.
 */
export const TriggerCategory = z.enum([
  'porn_site',
  'social_late_night',
  'image_search',
  'unknown',
]);
export type TriggerCategory = z.infer<typeof TriggerCategory>;

export const InterventionContext = z.object({
  category: TriggerCategory,
  hour: z.number().int().min(0).max(23),
  streakDays: z.number().int().min(0),
  spiritualLayer: z.boolean(),
  tone: z.enum(['cercano', 'formal']),
  aliadoName: z.string().min(1).max(40),
  userName: z.string().max(40).optional(),
  mood: z.enum(['cansado', 'solo', 'aburrido', 'estresado', 'tranquilo']).optional(),
});
export type InterventionContext = z.infer<typeof InterventionContext>;

export const InterventionResponse = z.object({
  message: z.string(),
  alternatives: z.array(z.string()).max(3),
  scripture: z
    .object({ reference: z.string(), text: z.string() })
    .nullable()
    .optional(),
});
export type InterventionResponse = z.infer<typeof InterventionResponse>;

/**
 * Llama al backend para generar la intervención. Si falla, devuelve un
 * fallback estático: la pantalla NUNCA puede quedarse en blanco en el
 * momento del impulso.
 */
export async function requestIntervention(
  context: InterventionContext
): Promise<InterventionResponse> {
  const parsed = InterventionContext.parse(context);

  if (!API_URL) {
    return staticFallback(parsed);
  }

  try {
    const res = await fetch(`${API_URL}/api/v1/intervene`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(parsed),
    });
    if (!res.ok) throw new Error(`status ${res.status}`);
    const data = await res.json();
    return InterventionResponse.parse(data);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.warn('[intervention] fallback', err);
    return staticFallback(parsed);
  }
}

function staticFallback(ctx: InterventionContext): InterventionResponse {
  const name = ctx.userName ? `${ctx.userName}, ` : '';
  const streakLine =
    ctx.streakDays > 0
      ? `Llevas ${ctx.streakDays} ${ctx.streakDays === 1 ? 'día' : 'días'}.`
      : 'Estás aquí. Eso ya cuenta.';
  return {
    message: `${name}espera un segundo. ${streakLine} ¿Qué ha pasado hoy? ¿Estás cansado, solo, aburrido?`,
    alternatives: [
      'Respira 60 segundos conmigo',
      'Hablar conmigo',
      'Mira tus anclas',
    ],
    scripture: null,
  };
}
