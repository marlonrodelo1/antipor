import 'react-native-url-polyfill/auto';
import { createClient, type SupabaseClientOptions } from '@supabase/supabase-js';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL ?? '';
const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? '';

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  // eslint-disable-next-line no-console
  console.warn('[supabase] EXPO_PUBLIC_SUPABASE_URL / KEY no configurados.');
}

/**
 * Adaptador SecureStore -> Storage de Supabase. La sesión se cifra
 * con Keychain (iOS) / Keystore (Android), nunca toca AsyncStorage en claro.
 *
 * SecureStore tiene un límite de ~2 KB por entrada. La sesión típica de
 * Supabase cabe sin problema, pero si crece (ej. metadata grande) hay que
 * trocear; de momento no es necesario.
 */
// Detectamos web sin depender del modulo Platform por si tree-shaking lo elimina.
const hasLocalStorage = typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
const isWeb = Platform.OS === 'web' || hasLocalStorage;

const SecureStoreAdapter = {
  getItem: async (key: string) => {
    if (isWeb) return hasLocalStorage ? window.localStorage.getItem(key) : null;
    return await SecureStore.getItemAsync(key);
  },
  setItem: async (key: string, value: string) => {
    if (isWeb) { if (hasLocalStorage) window.localStorage.setItem(key, value); return; }
    await SecureStore.setItemAsync(key, value);
  },
  removeItem: async (key: string) => {
    if (isWeb) { if (hasLocalStorage) window.localStorage.removeItem(key); return; }
    await SecureStore.deleteItemAsync(key);
  },
};

const options: SupabaseClientOptions<'public'> = {
  auth: {
    storage: SecureStoreAdapter,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
};

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, options);

export async function signInAnonymous(): Promise<void> {
  // Modo invitado: usa la API de anonymous sign-in de Supabase.
  await supabase.auth.signInAnonymously();
}

export async function signOut(): Promise<void> {
  await supabase.auth.signOut();
}
