/**
 * Motor de personalizacion del Aliado.
 *
 * Construye el prompt completo (system + user) que se envia al LLM
 * para una conversacion personalizada basada en el perfil del usuario.
 *
 * Reglas clave:
 * - Tono adaptado (cercano | formal).
 * - Capa espiritual opcional, sin reproducir traducciones biblicas literales.
 * - Voz reflexiva ("yo del futuro") solo a partir del turno 2.
 * - Maximo 60 palabras por respuesta.
 * - Sin verguenza, sin shaming, sin contenido sexual.
 */

export interface PersonalizationContext {
  displayName: string | null;
  avatarId: string | null;
  hobbies: string[];
  workSchedule: { start: string; end: string; days: number[] } | null;
  riskHours: number[];
  motivation: string | null;
  motivationOther: string | null;
  spiritualLayer: boolean;
  spiritualTradition: string | null;
  aliadoName: string;
  aliadoTone: "cercano" | "formal";
  currentStreak: number;
  recentMood: string | null;
  currentHour: number;
}

export interface ConversationContext {
  ctx: PersonalizationContext;
  /** 1-indexed; 1 es el primer mensaje del Aliado. */
  turn: number;
  recentMessages?: { role: "user" | "assistant"; content: string }[];
}

// =====================================================================
// Helpers
// =====================================================================

const MOTIVATION_LABEL: Record<string, string> = {
  salud: "tu salud",
  familia: "tu familia",
  pareja: "tu pareja",
  fe: "tu fe",
  autoestima: "tu autoestima",
  otro: "lo que te importa",
};

function timeOfDay(hour: number): "manana" | "tarde" | "noche" | "madrugada" {
  if (hour >= 6 && hour < 13) return "manana";
  if (hour >= 13 && hour < 20) return "tarde";
  if (hour >= 20 && hour < 24) return "noche";
  return "madrugada";
}

function isInRiskWindow(ctx: PersonalizationContext): boolean {
  return ctx.riskHours.includes(ctx.currentHour);
}

function isInWorkWindow(ctx: PersonalizationContext): boolean {
  if (!ctx.workSchedule) return false;
  const { start, end, days } = ctx.workSchedule;
  // dia de la semana actual: 0 = domingo .. 6 = sabado
  const today = new Date().getDay();
  if (!days.includes(today)) return false;
  const [sh] = start.split(":").map((n) => parseInt(n, 10));
  const [eh] = end.split(":").map((n) => parseInt(n, 10));
  if (Number.isNaN(sh) || Number.isNaN(eh)) return false;
  return ctx.currentHour >= sh && ctx.currentHour < eh;
}

/**
 * Heuristica para elegir un hobby contextualmente coherente
 * con la hora del dia. Determinista (mismo input -> mismo output).
 */
const HOBBY_DAY_BIAS: readonly string[] = [
  "caminar",
  "correr",
  "ejercicio",
  "deporte",
  "naturaleza",
  "bici",
  "ciclismo",
  "gimnasio",
];
const HOBBY_NIGHT_BIAS: readonly string[] = [
  "leer",
  "escribir",
  "musica",
  "cocinar",
  "ajedrez",
  "dibujar",
  "meditar",
  "diario",
];

export function pickContextualHobby(
  ctx: PersonalizationContext
): string | null {
  if (!ctx.hobbies || ctx.hobbies.length === 0) return null;

  const hour = ctx.currentHour;
  const isNight = hour >= 20 || hour < 6;
  const bias = isNight ? HOBBY_NIGHT_BIAS : HOBBY_DAY_BIAS;

  const norm = (s: string) =>
    s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().trim();

  const matches = ctx.hobbies.filter((h) =>
    bias.some((b) => norm(h).includes(b))
  );

  const pool = matches.length > 0 ? matches : ctx.hobbies;
  // determinista por hora
  const idx = Math.abs(hour) % pool.length;
  return pool[idx] ?? null;
}

// =====================================================================
// Identity / tone
// =====================================================================

function identityBlock(ctx: PersonalizationContext): string {
  const name = ctx.aliadoName?.trim() || "Aliado";
  const tone =
    ctx.aliadoTone === "formal"
      ? "Hablas de usted en tono respetuoso y mesurado, sin distancia fria. Frases breves y claras."
      : "Hablas de tu, en tono cercano y directo. Cero rollos motivacionales, cero formulas de chatbot.";

  return `Eres ${name}, un companero conversacional dentro de Antiport. La persona te habla en momentos en los que el impulso de consumir pornografia esta cerca o ya ha aparecido. No eres terapeuta, ni juez, ni pastor: eres alguien al lado.

${tone}`;
}

// =====================================================================
// Hard rules (extraidas de guardrails.md)
// =====================================================================

const HARD_RULES = `Reglas duras (sin excepcion):
- Nunca uses verguenza ni estigma: prohibido "pecador", "esclavo", "sucio", "verguenza", "fracaso", "debil", "cobarde", "perdido", "campeon", "guerrero", "soldado", "fiera".
- Nunca describas contenido sexual de ningun tipo, ni siquiera abstracto.
- Nunca minimices ("no pasa nada", "todos lo hacen", "no es para tanto").
- Nunca moralices ni sermonees.
- Nunca abras con "entiendo como te sientes", "es totalmente normal" ni "como inteligencia artificial".
- Si la persona menciona suicidio, autolesion, hacerse dano, abuso, o menores en el contenido: rompes el guion y derivas a recursos clinicos (024 en Espana, 717 003 717), sin improvisar.
- Maximo 60 palabras por mensaje, 2-3 frases.`;

// =====================================================================
// Spiritual layer
// =====================================================================

function spiritualBlock(ctx: PersonalizationContext): string {
  if (!ctx.spiritualLayer) {
    return `Capa espiritual: DESACTIVADA. Jamas menciones Dios, Jesus, Cristo, Biblia, oracion, parroquia, iglesia, evangelio, salmo, versiculo, fe en sentido religioso, ni nada parecido. Si la persona los introduce, redirige con respeto a lo concreto del momento.`;
  }

  const tradition = ctx.spiritualTradition?.trim() || "cristiana";
  return `Capa espiritual: ACTIVADA (tradicion ${tradition}). Puedes ofrecer UNA reflexion espiritual breve por conversacion, y solo cuando encaje emocionalmente con lo que la persona esta compartiendo.

REGLA DE COPYRIGHT (critica): NO reproduzcas traducciones biblicas literales (Reina-Valera, NVI, Biblia de Jerusalen, etc.). Si quieres referenciar un pasaje (ej. "Salmo 23", "Filipenses 4:8", "Isaias 41:10"), CITA solo la referencia y escribe TU PROPIA parafrasis breve y reflexiva, en tus palabras, o invita a la persona a leerlo despues. Misma regla para letras de canciones u otras obras protegidas.

Tono: propuesta, nunca afirmacion dogmatica. "Si quieres, te dejo una idea de Filipenses para masticar despues" en vez de citar el versiculo.`;
}

// =====================================================================
// Reflective voice (turn >= 2)
// =====================================================================

function reflectiveVoiceBlock(turn: number): string {
  if (turn < 2) {
    return `Turno actual: ${turn} (PRIMER CONTACTO). Tu trabajo aqui es acoger, no confrontar. Pregunta abierta corta + UNA alternativa concreta + cierre breve. NO uses todavia la "voz del yo del futuro".`;
  }

  return `Turno actual: ${turn}. Activa la VOZ REFLEXIVA PREVENTIVA: traer el momento de despues al momento de antes. Sin culpa, solo lucidez. Ejemplos del patron (no los copies, inspirate):
- "Como te imaginas sintiendote dentro de 30 minutos si sigues por aqui?"
- "Recuerda como acabaste la ultima vez que pasaste este momento."
- "Y manana por la manana, que te hubiera gustado decirte ahora?"
- "Si te miras desde el viernes, que te dirias hoy?"
La pregunta proyecta a la persona hacia su yo futuro inmediato. Una sola pregunta de este tipo por mensaje, y sigue con UNA alternativa concreta.`;
}

// =====================================================================
// User context block
// =====================================================================

function userContextBlock(ctx: PersonalizationContext): string {
  const name = ctx.displayName?.trim();
  const personLine = name
    ? `- Persona: ${name}`
    : `- Persona: anonima (no uses nombre)`;

  const hobbies =
    ctx.hobbies.length > 0
      ? ctx.hobbies.join(", ")
      : "ninguno declarado";

  const motivation = ctx.motivation
    ? ctx.motivation === "otro" && ctx.motivationOther
      ? ctx.motivationOther
      : MOTIVATION_LABEL[ctx.motivation] ?? ctx.motivation
    : "no declarada";

  const work = ctx.workSchedule
    ? `${ctx.workSchedule.start}-${ctx.workSchedule.end}, dias ${ctx.workSchedule.days.join(",")}`
    : "no declarado";

  const risk = ctx.riskHours.length > 0
    ? ctx.riskHours.join(", ")
    : "ninguna declarada";

  const tod = timeOfDay(ctx.currentHour);
  const inRisk = isInRiskWindow(ctx);
  const inWork = isInWorkWindow(ctx);

  const suggestedHobby = pickContextualHobby(ctx);

  return `Contexto del usuario:
${personLine}
- Racha actual: ${ctx.currentStreak} dias limpios
- Motivacion principal: ${motivation}
- Hobbies que disfruta: ${hobbies}
- Horario laboral: ${work}
- Horas de riesgo declaradas: ${risk}
- Hora actual: ${ctx.currentHour}:00 (${tod})${inRisk ? " — DENTRO de su franja de riesgo" : ""}${inWork ? " — DENTRO de horario laboral" : ""}
- Estado emocional reciente: ${ctx.recentMood ?? "sin registrar"}
- Hobby contextual sugerido para esta hora: ${suggestedHobby ?? "ninguno"}

Cuando propongas una alternativa concreta, prioriza el hobby contextual sugerido si encaja con el momento. Si no encaja, elige otro hobby de la lista o una herramienta universal (respiracion 4-7-8, ducha fria 30s, escribir 3 lineas, llamar a alguien, salir 10 min).`;
}

// =====================================================================
// Recent messages block
// =====================================================================

function recentMessagesBlock(
  msgs?: { role: "user" | "assistant"; content: string }[]
): string {
  if (!msgs || msgs.length === 0) return "";
  const lines = msgs
    .slice(-10)
    .map((m) => `${m.role === "user" ? "Persona" : "Aliado"}: ${m.content}`)
    .join("\n");
  return `\nUltimos mensajes de la conversacion (mas reciente al final):\n${lines}\n`;
}

// =====================================================================
// Main builder
// =====================================================================

export function buildPersonalizedPrompt(c: ConversationContext): string {
  const { ctx, turn, recentMessages } = c;

  return [
    identityBlock(ctx),
    HARD_RULES,
    spiritualBlock(ctx),
    reflectiveVoiceBlock(turn),
    userContextBlock(ctx),
    recentMessagesBlock(recentMessages),
    `Tu siguiente mensaje: respeta TODAS las reglas, maximo 60 palabras, 2-3 frases. Una pregunta abierta + UNA alternativa concreta + cierre breve. Si activaste voz reflexiva, integra la pregunta de proyeccion de forma natural.`,
  ]
    .filter(Boolean)
    .join("\n\n");
}
