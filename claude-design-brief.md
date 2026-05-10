# Antiport — Brief de diseño para claude.ai/design

## Contexto del producto

Antiport es una app móvil **gratuita** (iOS y Android) para personas que quieren dejar de consumir pornografía. Su feature estrella es una **intervención conversacional con IA en el momento exacto del impulso**: cuando el usuario intenta abrir una página porno en su móvil, Antiport intercepta el intento, bloquea la página y abre una conversación empática con un agente IA llamado "Aliado" que le ayuda a redirigir esa energía hacia una alternativa concreta (caminar, llamar a alguien, respirar, leer un versículo si tiene la capa espiritual activa). La app incluye también diario de progreso, urge surfing guiado, anclas personales (fotos/audios/frases del propio usuario), recordatorios inteligentes en franjas de riesgo y una **capa cristiana opcional** (off por defecto, opt-in en onboarding) con versículos y reflexiones bíblicas. Sin comunidad ni foros en v1. Privacidad radical: el historial de URLs nunca sale del dispositivo. Público objetivo: hombres y mujeres adultos hispanohablantes, con presencia significativa de público cristiano (católico y evangélico) en España y LATAM, pero la app funciona perfectamente para usuarios sin fe.

## Identidad visual sugerida

- **Paleta**:
  - Primario `#3B6EA8` (azul sereno tipo cielo de mañana — calma, claridad, confianza, evita rojo/morado por sus connotaciones)
  - Secundario `#7BA888` (verde salvia — naturaleza, crecimiento, esperanza)
  - Acento cálido `#E8B96A` (ámbar suave — usado solo en CTAs positivos como "He resistido", logros)
  - Alerta suave `#D97757` (terracota, no rojo agresivo — el momento de intervención debe sentirse como un amigo deteniéndote, no como una alarma)
  - Neutros: `#F7F5F2` fondo claro, `#1C2128` texto, `#3F4854` texto secundario
  - Modo oscuro: fondo `#0F1419`, superficie `#1C2128`, texto `#E8E6E3`
- **Tipografía**:
  - Titulares: **Fraunces** (serif moderna, transmite humanidad y peso emocional sin ser anticuada)
  - Texto: **Inter** (legibilidad pura)
  - Solo dos familias en toda la app
- **Tono visual**: cercano, sereno, humano. Referencias: **Calm**, **Headspace**, **Dwell** (Bible app), **Finch**. Nunca aesthetic "AI SaaS" (gradientes morados, blobs, estrellas). Nunca aesthetic clínico-frío. Nunca aesthetic religioso anticuado.
- **Iconografía**: Lucide icons exclusivamente, stroke 1.5, redondeados.
- **Personaje del agente**: Nombre por defecto **Aliado** (configurable: Aliada, Compañero, Hermano/a, o nombre custom). Avatar abstracto: una forma orgánica suave (gota / hoja / círculo con respiración animada), nunca una cara humana fotorrealista — evita uncanny valley y deja que el usuario proyecte. Tono de voz: **directo pero cálido, sin juzgar, segunda persona, frases cortas**. Frase de bienvenida: *"Hola. Estoy aquí cuando lo necesites. Sin juicio, sin presión. Vamos paso a paso."*

## Pantallas a diseñar (TODO de golpe — móvil primero, después adapta web donde diga)

### A. Landing pública (antiport.app — desktop + mobile)
- **Hero**: titular *"Cuando el impulso llegue, no estarás solo."* Subtítulo: *"Antiport intercepta el momento exacto y te acompaña con IA. Gratis, privado, sin juicio."* CTA principal: "Descargar gratis" (botones App Store + Google Play). CTA secundario: "Cómo funciona" (scroll a vídeo de 30 s).
- **Bloque "El momento del impulso"**: mockup del móvil mostrando la pantalla de intervención. Texto explicando que la IA conversa contigo en lugar de solo bloquear.
- **3 bloques de beneficios** con iconos:
  1. *Intervención en el momento* — "No es un bloqueo frío. Es una conversación."
  2. *Tu diario, tu progreso* — "Patrones, rachas, triggers. Conocerlos es la mitad del camino."
  3. *Privado de verdad* — "Lo que pasa en tu móvil, se queda en tu móvil. Cero historial en nuestros servidores."
- **Sección "Para quién"**: 4 testimonios cortos (placeholders): hombre 28, mujer 35, joven 19, persona de fe. Mostrar que es para todos.
- **Sección "Capa espiritual opcional"**: pequeña, con tono inclusivo. *"Si tu fe es parte de tu camino, Antiport puede acompañarte con versículos y reflexión bíblica. Si no, también está hecha para ti — la capa se desactiva en un toque."*
- **FAQ** plegable: privacidad, qué pasa si lo borro, ¿es realmente gratis?, ¿cómo funciona el bloqueo en iOS/Android?
- **Footer**: enlaces a privacidad, términos, contacto, "Apoya el proyecto" (donaciones), redes.

### B. Onboarding (5–7 pantallas, móvil)
1. **Pantalla bienvenida**: logo, frase del agente, "Empezar" / "Soy invitado anónimo".
2. **¿Cómo te llamas?** (opcional) — "Solo para que Aliado te hable por tu nombre. Puedes saltar."
3. **¿Qué te trae aquí?** — pills seleccionables múltiples: salud mental, mi pareja, mi familia, mi fe, lo intenté antes y no pude, curiosidad. Sin juicio en la copy.
4. **Test breve (3 preguntas)**: frecuencia actual, hora típica, emoción más común antes (cansancio / soledad / aburrimiento / estrés / otro). Visual amable, no clínico.
5. **¿Quieres acompañamiento espiritual cristiano?** — Opt-in claro: dos botones grandes "Sí, inclúyelo" / "No, gracias". Texto explicativo: *"Si dices sí, Aliado podrá compartirte un versículo o una reflexión cuando encaje. Si dices no, la app es 100% secular. Puedes cambiarlo cuando quieras."*
6. **Configura a Aliado**: nombre, género (hombre/mujer/neutro), tono (cercano / formal). Preview de cómo te hablaría.
7. **Permisos**: pantalla explicando con honestidad por qué la app necesita Screen Time (iOS) o Accessibility/VPN (Android). Botón "Activar protección" + "Más tarde".

### C. Pantalla de intervención (LA PANTALLA MÁS CRÍTICA — móvil)

Es la pantalla que se abre cuando el usuario intenta acceder a un dominio de la lista. **Tiene que sentirse como un amigo poniéndote la mano en el hombro, no como una alarma.**

- Toma toda la pantalla, full-screen modal, fondo color terracota `#D97757` muy desaturado (no rojo).
- Animación suave de "respiración" del avatar de Aliado (3 s in / 3 s out).
- **Mensaje IA generado en tiempo real**, en burbuja grande:
  > *"Marlon, espera un segundo. Llevas 14 días. ¿Qué ha pasado hoy? ¿Estás cansado, te has aburrido, ha sido la peli?"*
- Tres botones grandes verticales:
  1. *Hablar con Aliado* (input voz/texto que abre conversación)
  2. *Hacer una respiración 60 s* (urge surfing rápido)
  3. *Ver mis anclas* (fotos/audios que el usuario subió)
- Botón pequeño abajo, descolorido pero visible: *"Quiero entrar igual"* — al pulsarlo, la siguiente pantalla pide al usuario **escribir a mano** una frase de compromiso ("voy a entrar a una web que sé que me hace daño"). Esto añade fricción real sin bloquear de forma autoritaria.
- Sin contadores agresivos, sin "¡PERDISTE!". Si finalmente entra: *"Está bien. Mañana volvemos a empezar. Sin culpa."*

### D. Conversación con Aliado (móvil)
- Chat estilo iMessage muy limpio. Burbujas del agente a la izquierda con su avatar respirando, usuario a la derecha.
- Botón de micrófono grande para hablar con voz; texto siempre disponible.
- Quick-replies sugeridas debajo: "Estoy cansado", "Me siento solo", "No sé por qué", "Llévame fuera".
- Aliado puede sugerir acciones que se ejecutan con un tap: "Te abro Spotify", "Te pongo un timer de 10 min para caminar", "Te mando un versículo" (solo si capa espiritual on).

### E. Home / "Hoy" (móvil — pantalla principal después de login)
- Saludo: *"Buenos días, Marlon."* + frase variable según patrón del usuario.
- **Card grande superior**: streak actual con visual orgánico (no número frío — una planta que crece, o un círculo que se llena). Tap → detalle.
- **Card "Cómo te sientes ahora"**: 5 emojis grandes (calmado / inquieto / triste / cansado / fuerte). Un tap registra el check-in.
- **Botón rojo grande siempre visible** (sticky bottom): *"Tengo un impulso ahora"*. Lleva directo a urge surfing.
- **Card inferior**: "Reflexión del día" (versículo si capa espiritual on, o frase de mindfulness si off).
- Tab bar inferior: Hoy / Diario / Aliado / Ajustes.

### F. Diario / Progreso (móvil)
- Vista calendario mensual: días verdes (limpio), ámbar (impulso resistido), rojo suave (recaída — sin estigma visual).
- Gráfica de patrones: hora del día / día de la semana donde más se activa.
- Lista de triggers detectados: *"Sueles tener impulsos los domingos por la noche cuando registras 'aburrimiento'."*
- Botón "Añadir entrada manual".

### G. Mis anclas (móvil)
- Grid 2 columnas con fotos, audios, frases que el usuario sube.
- Cada ancla tiene una etiqueta (familia, salud, fe, futuro).
- Botón flotante "Añadir ancla" → cámara / galería / grabar audio / escribir frase.
- En la pantalla de intervención, Aliado puede invocar el ancla más relevante.

### H. Urge surfing (móvil)
- Pantalla limpia, fondo gradiente sereno.
- Círculo respirador animado centrado, escala con la respiración (4-7-8).
- Voz del agente susurrando opcional: *"Inhala… Sostén… Exhala…"*.
- Timer de 5 min con cuenta regresiva sutil.
- Al terminar: *"Lo lograste. Has surfeado la ola."* + opción de registrar cómo te sientes.

### I. Ajustes (móvil)
Secciones agrupadas:
- **Perfil**: nombre, idioma, eliminar cuenta (botón claramente visible — privacidad radical).
- **Aliado**: nombre, género, tono, frase de bienvenida.
- **Capa espiritual**: toggle on/off + tradición (católica / evangélica / general). Tap aclara qué cambia.
- **Protección**: estado de permisos (Screen Time, Accessibility, VPN), gestionar lista de dominios, whitelist, modo viaje.
- **Notificaciones**: franjas horarias, frecuencia, modo silencioso.
- **Privacidad**: enlace a política, exportar mis datos, borrar cuenta. Texto explícito: *"Cero URLs viajan a nuestros servidores."*
- **Apoyar el proyecto**: donaciones (botón discreto, no agresivo).

### J. Auth (móvil + web)
- Login con email/Apple/Google.
- Signup mínimo (email + password, o un tap con Apple/Google).
- Recuperar password.
- Modo invitado anónimo claramente accesible desde login.

### K. Emails transaccionales (Resend — diseño en HTML simple, mobile-friendly)
1. **Bienvenida** — *"Has dado el primer paso. Estamos aquí."* + tip para activar protección.
2. **Aviso de inactividad 7 días** — sin culpar: *"Hace una semana que no nos vemos. ¿Cómo va?"*
3. **Resumen semanal privado** — opt-in: streak, patrones, una reflexión.
4. **Cambios importantes de privacidad** (legal).
5. **Recuperación de password**.

### L. Web — Panel de usuario (desktop + mobile)
Versión ligera para gestionar lo que es engorroso en móvil:
- Dashboard idéntico al "Hoy" móvil pero con más espacio para gráficas.
- Diario completo con filtros.
- Gestión de anclas con drag-drop para subir.
- Configuración avanzada de protección (whitelist por tiempo, programación de modo intenso).
- Exportar mis datos en JSON.

## Restricciones técnicas

- Stack: **React Native + Expo + NativeWind (Tailwind 4 para RN)** en móvil; **Next.js 16 App Router + Tailwind 4 + shadcn/ui** en web.
- Mobile-first absoluto: el 95% del uso es móvil.
- Modo claro y modo oscuro obligatorios.
- Componentes reutilizables: la pantalla de intervención y el chat con Aliado deben compartir componentes con el resto.
- Animaciones suaves pero ligeras (Reanimated 3 / Lottie solo donde sume — respiración, transiciones de streak).
- Accesibilidad: contraste WCAG AA, tamaños tipográficos escalables, soporte VoiceOver/TalkBack.
- Cero librerías pesadas innecesarias.

## Lo que NO quiero

- **Aesthetic "AI SaaS"**: gradientes morados/azules eléctricos, blobs, estrellas brillantes, "sparkle" icons. Cero.
- **Aesthetic religioso anticuado**: madera, pergamino, fuentes blackletter, cruces enormes, símbolos cargados. La capa espiritual debe sentirse moderna y opcional.
- **Aesthetic clínico-frío**: blanco quirófano, azul corporativo de hospital. Antiport es un amigo, no un hospital.
- **Imágenes sugerentes** de cualquier tipo. Cero siluetas, cero piel, cero "antes/después" insinuante.
- **Gamificación agresiva**: nada de medallas con explosiones, números de XP, leaderboards. Solo progreso orgánico privado.
- **Lenguaje de culpa o moralizante**: nada de "pecador", "esclavo", "peligro", "vergüenza". Tono: directo, cálido, sin juicio.
- **Más de 2 fuentes** distintas.
- **Iconografía mezclada** (todo Lucide, nada de Heroicons o emojis usados como icons).
- **Ilustraciones tipo undraw.co** o stock genérico de "persona meditando".
- **Pop-ups intrusivos** de donación, valoración o redes sociales.
- **Dark patterns** para evitar desinstalación. La fricción de 24 h para desinstalar (con confirmación por email de respaldo) debe ser **honesta y opt-in en onboarding**, nunca oculta.

## Notas finales para el diseñador

- La pantalla **C (intervención)** es donde se gana o se pierde el producto. Diseña 3 variantes y márcalas claramente: (1) intervención corta con un solo mensaje + 3 botones; (2) intervención conversacional larga; (3) intervención silenciosa con solo respiración. El usuario podrá elegir su modo por defecto en ajustes.
- El avatar de **Aliado** necesita 3 estados: en reposo (respira), escuchando (ondulando), hablando (pulso). Diseña los 3.
- En la **landing**, el héroe debe transmitir en 3 segundos que esto **no es un bloqueador frío más**. La diferencia es la conversación. Si el héroe no comunica eso, fallamos.
