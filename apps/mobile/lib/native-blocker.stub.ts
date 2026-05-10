import type { NativeBlocker } from './native-blocker';

/**
 * Stub. NO bloquea nada. Solo registra en consola.
 * Reemplazar por módulos nativos reales antes de v1.0.
 */
export const stubBlocker: NativeBlocker = {
  async requestPermissions() {
    // eslint-disable-next-line no-console
    console.log('[native-blocker:stub] requestPermissions()');
    return true;
  },
  async isProtected() {
    // eslint-disable-next-line no-console
    console.log('[native-blocker:stub] isProtected() -> false');
    return false;
  },
  async syncBlocklist(domains: string[]) {
    // eslint-disable-next-line no-console
    console.log(`[native-blocker:stub] syncBlocklist(${domains.length} dominios)`);
  },
};
