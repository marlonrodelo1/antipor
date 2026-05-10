# Antiport — Mobile

App móvil de Antiport (React Native + Expo + NativeWind + expo-router).

## Setup

```bash
cd apps/mobile
npm install
cp .env.example .env  # rellena con tus claves Supabase
npx expo start
```

Para iOS/Android nativo (necesario para los módulos de bloqueo):

```bash
npx expo prebuild
npx expo run:ios
npx expo run:android
```

## Variables de entorno

- `EXPO_PUBLIC_SUPABASE_URL` — URL del proyecto Supabase.
- `EXPO_PUBLIC_SUPABASE_ANON_KEY` — anon key pública.
- `EXPO_PUBLIC_API_URL` — backend Next.js (intervención IA, blocklist).

## Stack

- Expo SDK 52, React Native 0.76, React 18.
- expo-router (file-based, typed routes).
- NativeWind 4 + Tailwind 3.4.
- Reanimated 3 para todas las animaciones.
- lucide-react-native (stroke 1.5).
- Supabase Auth con `expo-secure-store` para sesión.
- Zustand para estado global.
- Fraunces (serif) + Inter (sans) vía expo-font.

## Estructura

```
app/
  _layout.tsx            Root layout (fonts, theme, Stack)
  (auth)/                Login, signup, recuperar
  onboarding/            7 pantallas
  (tabs)/                Hoy, Diario, Aliado, Ajustes
  anclas/                Listado + nueva
  intervencion.tsx       Pantalla crítica de intervención
  intervencion-friccion.tsx
  urge-surfing.tsx       Respiración 4-7-8
components/
  aliado-avatar.tsx      Forma orgánica abstracta (NUNCA cara humana)
  breathing-circle.tsx
  streak-plant.tsx       Planta SVG que crece con el streak
  icon.tsx               Wrapper Lucide (stroke 1.5)
lib/
  supabase.ts
  store.ts               Zustand
  intervention.ts        Llamada a /api/v1/intervene
  native-blocker.ts      Interfaz TS
  native-blocker.stub.ts Implementación stub (logs)
```

## TODO v1.0 (módulos nativos reales)

`lib/native-blocker.stub.ts` es un placeholder. En v1.0 hay que reemplazarlo por:

- **iOS**: módulo Swift con `DeviceActivity` + `ManagedSettings` + `FamilyControls` (Screen Time API). Requiere entitlement de Apple. Vivirá en `ios/AntiportBlocker/`.
- **Android**: `AccessibilityService` + VPN local con DNS sinkhole (estilo Bark / NetGuard). Vivirá en `android/app/src/main/java/app/antiport/blocker/`.
- Bridge a JS vía Expo Modules (`expo-modules-core`) o `TurboModule`.

Mantener exactamente la interfaz `NativeBlocker` para que el resto de la app no necesite cambios.

## Privacidad

Cero historial de URLs en servidor. Todo local. Ver `lib/intervention.ts` — solo se envían categorías agregadas, nunca el dominio en claro.

## Sin emojis, sin imágenes sugerentes

Estricto. Iconos solo desde Lucide. El avatar de Aliado es una forma orgánica (gota / hoja), nunca una cara humana.
