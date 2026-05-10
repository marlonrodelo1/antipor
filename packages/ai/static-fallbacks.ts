/**
 * 12 mensajes estaticos de intervencion en espanol.
 * Se usan cuando el LLM esta inalcanzable, devuelve error, o falla guardrails.
 * Rotativos: el cliente elige por (timestamp % length) o aleatorio.
 *
 * Restricciones:
 * - Cada uno < 60 palabras.
 * - Nunca menciona Dios / Biblia (compatible con spiritual_layer = false).
 * - Cada uno propone UNA alternativa concreta.
 * - Tono directo, calido, sin juzgar.
 */
export const fallbackScripts: readonly string[] = [
  "Estoy aqui. Antes de decidir nada, respira conmigo cinco veces: 4 segundos dentro, 7 reteniendo, 8 fuera. Cuando termines, decides tu. Sin prisa.",

  "Para un segundo. Pon los dos pies en el suelo y describe en voz alta tres cosas que ves ahora mismo. Solo eso. Cuando acabes, hablamos.",

  "Sal del cuarto. Vete a la cocina, bebe un vaso de agua entero y vuelve. Te espero. No es escapar, es darle tres minutos al cuerpo.",

  "Mira las anclas que subiste cuando estabas mas tranquilo. Las pusiste ahi tu, por algo. Abrelas antes de hacer nada mas.",

  "Esto que sientes va a bajar en 10 minutos hagas lo que hagas. Pon un timer, sal a la calle, vuelve y vemos si sigue ahi. Probamos?",

  "Escribe tres lineas: que ha pasado hoy, que sentiste antes de abrir esto, que te pedia el cuerpo. Te abro el diario.",

  "Una ducha fria de 30 segundos. Solo 30. Te corta el ciclo de craving en seco. Cuando salgas, seguimos hablando si quieres.",

  "Hay alguien en tu telefono a quien hace tiempo que no escribes? Mandale algo absurdo: un meme, una foto. Sacate de aqui durante diez minutos.",

  "No tienes que hacerlo bien, solo tienes que esperar. Cinco minutos. Pon el cronometro. Cuando suene, hablamos.",

  "Esto no eres tu, es un circuito que se enciende solo. Levantate, camina por el pasillo veinte veces ida y vuelta, y vuelve. Te espero.",

  "Tu cuerpo lleva horas sin comer o sin dormir bien? Atiende eso primero. Come algo, bebe agua, tumbate cinco minutos. Despues decides.",

  "Has llegado hasta aqui en lugar de cerrar la app. Eso ya es mucho. Pon una alarma a 5 minutos y respira. Si despues sigues queriendo, lo hablamos.",
] as const;
