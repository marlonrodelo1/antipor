import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import Constants from 'expo-constants';
import { Platform } from 'react-native';
import { supabase } from './supabase';

const API_URL = process.env.EXPO_PUBLIC_API_URL ?? '';

export interface RegisterResult {
  ok: boolean;
  reason?: string;
  token?: string;
}

/**
 * Pide permisos de notificaciones, obtiene el push token de Expo y lo
 * sube al backend con el JWT del usuario. Solo registra si:
 *  - estamos en un dispositivo fisico
 *  - el usuario ha aceptado permisos
 *  - hay sesion activa de Supabase
 *
 * No lanza: devuelve { ok, reason } y el caller decide.
 */
export async function registerForPushNotifications(): Promise<RegisterResult> {
  if (!Device.isDevice) {
    return { ok: false, reason: 'no_device' };
  }

  try {
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'Recordatorios suaves',
        importance: Notifications.AndroidImportance.DEFAULT,
        vibrationPattern: [0, 120, 80, 120],
        lightColor: '#3B6EA8',
      });
    }

    const existing = await Notifications.getPermissionsAsync();
    let status = existing.status;
    if (status !== 'granted') {
      const ask = await Notifications.requestPermissionsAsync();
      status = ask.status;
    }
    if (status !== 'granted') {
      return { ok: false, reason: 'permission_denied' };
    }

    const projectId =
      (Constants.expoConfig?.extra?.eas as { projectId?: string } | undefined)?.projectId ??
      (Constants as unknown as { easConfig?: { projectId?: string } }).easConfig?.projectId;

    const tokenResp = await Notifications.getExpoPushTokenAsync(
      projectId ? { projectId } : undefined
    );
    const token = tokenResp.data;
    if (!token) return { ok: false, reason: 'no_token' };

    const { data: sessionData } = await supabase.auth.getSession();
    const jwt = sessionData.session?.access_token;
    if (!jwt) return { ok: false, reason: 'no_session', token };

    if (!API_URL) return { ok: false, reason: 'no_api_url', token };

    const res = await fetch(`${API_URL.replace(/\/$/, '')}/api/v1/push-token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwt}`,
      },
      body: JSON.stringify({
        token,
        platform: Platform.OS,
      }),
    });

    if (!res.ok) {
      return { ok: false, reason: `http_${res.status}`, token };
    }
    return { ok: true, token };
  } catch (err) {
    const reason = err instanceof Error ? err.name : 'unknown_error';
    return { ok: false, reason };
  }
}
