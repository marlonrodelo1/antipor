import { create } from 'zustand';
import { persist, createJSONStorage, type StateStorage } from 'zustand/middleware';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

export type AliadoTone = 'cercano' | 'formal';
export type AliadoGender = 'neutro' | 'masculino' | 'femenino';
export type SpiritualTradition = 'cristiano' | 'islam' | 'judaismo' | 'budista' | 'otro';

export interface UserProfile {
  id: string | null;
  name: string;
  guest: boolean;
}

export interface Settings {
  displayName: string;
  aliadoName: string;
  aliadoTone: AliadoTone;
  aliadoGender: AliadoGender;
  spiritualLayer: boolean;
  spiritualTradition: SpiritualTradition | null;
  language: string;
  notifications: boolean;
  riskHours: number[]; // 0-23
}

export interface Streak {
  days: number;
  startedAt: string | null; // ISO
  lastCheckin: string | null;
}

interface AppState {
  hydrated: boolean;
  profile: UserProfile;
  settings: Settings;
  streak: Streak;
  setProfile: (p: Partial<UserProfile>) => void;
  setSettings: (s: Partial<Settings>) => void;
  setStreak: (s: Partial<Streak>) => void;
  resetAll: () => void;
  markHydrated: () => void;
}

const defaultProfile: UserProfile = {
  id: null,
  name: '',
  guest: true,
};

const defaultSettings: Settings = {
  displayName: '',
  aliadoName: 'Aliado',
  aliadoTone: 'cercano',
  aliadoGender: 'neutro',
  spiritualLayer: false,
  spiritualTradition: null,
  language: 'es',
  notifications: false,
  riskHours: [22, 23, 0],
};

const defaultStreak: Streak = {
  days: 0,
  startedAt: null,
  lastCheckin: null,
};

/**
 * SecureStore-backed storage adapter para Zustand persist.
 * - iOS: Keychain
 * - Android: encrypted Keystore
 *
 * Limite ~2 KB por entrada. El blob persistido (settings + streak) es
 * pequeno, asi que entra sin trocear. Si crece, hay que partirlo.
 *
 * Privacidad radical: jamas persistimos URLs ni historial de
 * intervenciones/conversaciones. Solo lo declarado en `partialize`.
 */
const isWeb = Platform.OS === 'web';

const secureStorage: StateStorage = {
  getItem: async (key: string) => {
    try {
      if (isWeb) return typeof localStorage !== 'undefined' ? localStorage.getItem(key) : null;
      return await SecureStore.getItemAsync(key);
    } catch {
      return null;
    }
  },
  setItem: async (key: string, value: string) => {
    try {
      if (isWeb) { if (typeof localStorage !== 'undefined') localStorage.setItem(key, value); return; }
      await SecureStore.setItemAsync(key, value);
    } catch {
      // si el dispositivo no permite SecureStore, fallamos en silencio
    }
  },
  removeItem: async (key: string) => {
    try {
      if (isWeb) { if (typeof localStorage !== 'undefined') localStorage.removeItem(key); return; }
      await SecureStore.deleteItemAsync(key);
    } catch {
      // idem
    }
  },
};

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      hydrated: false,
      profile: defaultProfile,
      settings: defaultSettings,
      streak: defaultStreak,
      setProfile: (p) => set((s) => ({ profile: { ...s.profile, ...p } })),
      setSettings: (st) => set((s) => ({ settings: { ...s.settings, ...st } })),
      setStreak: (st) => set((s) => ({ streak: { ...s.streak, ...st } })),
      resetAll: () =>
        set({
          profile: defaultProfile,
          settings: defaultSettings,
          streak: defaultStreak,
        }),
      markHydrated: () => set({ hydrated: true }),
    }),
    {
      name: 'antiport-app-state',
      storage: createJSONStorage(() => secureStorage),
      // Solo streak + settings declarados. Nada de URLs ni historial.
      partialize: (state) => ({
        streak: state.streak,
        settings: {
          displayName: state.settings.displayName,
          aliadoName: state.settings.aliadoName,
          aliadoGender: state.settings.aliadoGender,
          aliadoTone: state.settings.aliadoTone,
          spiritualLayer: state.settings.spiritualLayer,
          spiritualTradition: state.settings.spiritualTradition,
          language: state.settings.language,
        },
      }),
      merge: (persisted, current) => {
        const p = (persisted ?? {}) as Partial<AppState>;
        return {
          ...current,
          streak: { ...current.streak, ...(p.streak ?? {}) },
          settings: { ...current.settings, ...(p.settings ?? {}) },
        };
      },
      onRehydrateStorage: () => (state) => {
        state?.markHydrated();
      },
    }
  )
);
