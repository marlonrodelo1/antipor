/**
 * Interfaz del módulo nativo de bloqueo / interceptación de URLs.
 *
 * Implementaciones reales (v1.0):
 *  - iOS: Swift con DeviceActivity + ManagedSettings + FamilyControls.
 *  - Android: AccessibilityService + VPN local con DNS sinkhole.
 *
 * En v0.x usamos `native-blocker.stub.ts` (sin efecto real, solo logs)
 * para poder iterar UX sin tocar Xcode/Gradle.
 */
export interface NativeBlocker {
  /** Solicita permisos del SO. Devuelve true si fueron concedidos. */
  requestPermissions(): Promise<boolean>;
  /** Devuelve true si la protección está activa ahora mismo. */
  isProtected(): Promise<boolean>;
  /** Sincroniza la blocklist local. La lista NUNCA va al servidor. */
  syncBlocklist(domains: string[]): Promise<void>;
}

import { stubBlocker } from './native-blocker.stub';

export const nativeBlocker: NativeBlocker = stubBlocker;
