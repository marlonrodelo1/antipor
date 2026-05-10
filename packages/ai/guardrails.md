# Guardrails

Reglas de seguridad que se aplican **antes** y **después** de la llamada al modelo. Cualquier respuesta que viole un guardrail se descarta y se sustituye por un fallback estático (`static-fallbacks.ts`).

## 1. Frases prohibidas en la salida del modelo

Si la respuesta del modelo contiene cualquiera de estas (case-insensitive, con tolerancia a tildes), se descarta:

- "pecador", "pecadora"
- "esclavo", "esclava"
- "sucio", "sucia"
- "verguenza" / "vergüenza"
- "fracaso", "fracasado"
- "debil", "débil"
- "cobarde"
- "perdido", "perdida" (en contexto moral)
- "no pasa nada"
- "todos lo hacen"
- "no es para tanto"
- "deberias" repetido más de una vez
- cualquier descripción explícita o eufemismo de actos sexuales

## 2. Frases prohibidas que el modelo *nunca* debe iniciar

- "Entiendo cómo te sientes"
- "Es totalmente normal"
- "Como inteligencia artificial"
- "No soy un terapeuta pero..."
- "Campeón", "guerrero", "soldado", "fiera"

## 3. Capa espiritual

- Si `spiritual_layer = false` y la respuesta menciona: Dios, Jesús, Cristo, Biblia, Espíritu Santo, oración, rezar, parroquia, iglesia, evangelio, salmo, versículo, fe (en contexto religioso) → **descartar** y reintentar sin esa parte.
- Si `spiritual_layer = true` y la respuesta contiene más de un versículo o más de una oración por mensaje → **descartar**.

## 4. Crisis keywords (derivación inmediata)

Si la entrada del usuario contiene cualquiera de estas (substring match, case-insensitive), se ignora la respuesta del modelo y se devuelve el mensaje de derivación de `derivation.md`:

```
suicid
matarme
quitarme la vida
acabar con todo
no quiero seguir
hacerme dano
hacerme daño
autolesion
autolesión
cortarme
menor de edad
ninas
niñas
ninos
niños
abuso
```

La función `containsCrisisKeyword(text)` implementa esta detección.

## 5. Longitud

- Si la respuesta supera 60 palabras → recortar al límite por punto/coma más cercano.
- Si tras recortar queda < 10 palabras → fallback estático.

## 6. Idioma

- La respuesta debe estar en `language` del usuario. Si llega en otro idioma, se descarta.

## 7. Latencia

- Timeout llamada al modelo: **2.5 s** para primer token, **8 s** total.
- Si timeout o error 5xx → fallback estático rotativo (`fallbackScripts`).

## 8. Logging

- Nunca se loguea la respuesta cruda completa en producción.
- Se loguea: hash sha256 truncado del prompt, tokens usados, latencia, si pasó/falló guardrails, qué guardrail.
