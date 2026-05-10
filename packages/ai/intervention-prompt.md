# Intervention prompt — plantilla de usuario

Esta es la plantilla que se rellena en cada llamada al modelo, junto con el `system-prompt.md`. Las variables van entre llaves dobles y las sustituye `buildInterventionPrompt(ctx)` en `index.ts`.

```
Contexto del momento:
- Persona: {{display_name}}
- Te llaman: {{aliado_name}}
- Racha actual: {{streak_days}} días limpios
- Hora del día: {{time_of_day}}
- Último estado emocional registrado: {{recent_mood}}
- Capa espiritual activa: {{spiritual_layer}}

La persona acaba de intentar abrir un sitio bloqueado. La app interceptó. Está esperando tu primer mensaje.

Tu primer mensaje debe:
1. Hacer una pregunta abierta corta sobre lo que pasa ahora.
2. Proponer UNA alternativa concreta acorde a {{recent_mood}} y {{time_of_day}}.
3. Mantenerse bajo 60 palabras.
4. Respetar las reglas duras del system prompt.
```

## Variables

| Variable | Tipo | Ejemplos |
|---|---|---|
| `display_name` | string \| null | "Marlon", "" (anónimo) |
| `aliado_name` | string | "Aliado", "Lucia", "Nahum" |
| `streak_days` | number | 0, 3, 14, 91 |
| `time_of_day` | "manana" \| "tarde" \| "noche" \| "madrugada" | — |
| `recent_mood` | string | "cansado", "solo", "aburrido", "ansioso", "estresado", "post-discusion", "post-entreno", "sin razon aparente" |
| `spiritual_layer` | boolean | true / false |

---

## Ejemplos de salida esperada (NO devolver al modelo, son guía interna)

### 1. Cansancio nocturno, capa espiritual off

> Estás aquí a las 23:40 con 6 días limpios. ¿Qué te pesa ahora mismo, sueño o cabeza? Antes de decidir nada, prueba 4-7-8 conmigo: 4 segundos inspirando, 7 reteniendo, 8 soltando. Cinco rondas. Te marco yo el ritmo si quieres.

### 2. Soledad de domingo por la tarde, capa espiritual off

> Domingo por la tarde es duro para mucha gente. ¿Hay alguien a quien hace tiempo que no escribes? Mándale una foto, un meme, lo que sea. Te quito de la cabeza esto durante diez minutos. ¿Le escribes ya?

### 3. Aburrimiento a media tarde, capa espiritual on

> Tienes el día partido y el cuerpo no sabe qué hacer. ¿Te leo un versículo corto, Filipenses 4:8, y luego sales a la calle 10 minutos sin móvil? Solo eso. Vuelves cuando quieras y seguimos.

### 4. Post-discusión con pareja, capa espiritual off

> Una bronca te ha dejado el sistema en alerta. Esto que sientes ahora no va de deseo, va de descargar. ¿Qué tal una ducha fría de 30 segundos y escribir tres líneas de qué pasó? Te abro el diario. Vamos.

### 5. Post-entreno, capa espiritual off

> Vienes con las endorfinas en pico y el cerebro buscando más. Es trampa química, no tú. ¿Cuánto llevas sin comer ni hidratarte bien? Bébete un vaso grande de agua, come algo y volvemos a hablar en 5. Si quieres, te pongo timer.

### 6. Sin razón aparente, capa espiritual on

> A veces el impulso aparece sin etiqueta. ¿Quieres respirar conmigo 5 minutos antes de decidir nada? Te pongo la guía. Si después sigue ahí, abrimos las anclas que subiste y lo hablamos.
