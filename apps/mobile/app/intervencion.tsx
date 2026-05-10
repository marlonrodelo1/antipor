import * as React from 'react';
import { View, Text, Pressable, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { Icon, type IconName } from './../components/icon';
import { AliadoAvatar } from './../components/aliado-avatar';
import { useAppStore } from './../lib/store';
import { requestIntervention, type InterventionResponse } from './../lib/intervention';

/**
 * LA pantalla crítica. Se muestra como modal full-screen cuando el módulo
 * nativo intercepta un intento de abrir un dominio bloqueado.
 *
 * Reglas de diseño:
 *  - Fondo terracota desaturado (transmite calma, no alarma).
 *  - Avatar de Aliado animado (estado "hablando").
 *  - Mensaje generado por IA en burbuja grande (con fallback estático).
 *  - 3 botones verticales: Hablar / Respirar / Anclas.
 *  - Link "Quiero entrar igual" descolorido — lleva a fricción.
 */
export default function Intervencion() {
  const profile = useAppStore((s) => s.profile);
  const settings = useAppStore((s) => s.settings);
  const streak = useAppStore((s) => s.streak);
  const [resp, setResp] = React.useState<InterventionResponse | null>(null);

  React.useEffect(() => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning).catch(() => {});
    requestIntervention({
      category: 'porn_site',
      hour: new Date().getHours(),
      streakDays: streak.days,
      spiritualLayer: settings.spiritualLayer,
      tone: settings.aliadoTone,
      aliadoName: settings.aliadoName,
      userName: profile.name || undefined,
    })
      .then(setResp)
      .catch(() => {
        // requestIntervention ya tiene fallback interno, esto no debería
        // ocurrir; pero por si acaso, marcamos algo legible.
        setResp({
          message: 'Espera un segundo. Estoy aquí.',
          alternatives: [],
          scripture: null,
        });
      });
  }, [profile.name, settings, streak.days]);

  const now = new Date();
  const time = now.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
  const day = now.toLocaleDateString('es-ES', { weekday: 'long' });

  return (
    <View className="flex-1 bg-warm-bg">
      <View className="absolute inset-0">
        {/* Blobs orgánicos descolocados — sin gradientes "AI SaaS" */}
        <View
          className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-warm/15"
          style={{ opacity: 0.6 }}
        />
        <View
          className="absolute -bottom-24 -left-16 h-72 w-72 rounded-full bg-accent/15"
          style={{ opacity: 0.5 }}
        />
      </View>

      <SafeAreaView className="flex-1">
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, padding: 24 }}
          showsVerticalScrollIndicator={false}
        >
          {/* Header meta */}
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center gap-2">
              <Icon name="Shield" size={16} color="#D97757" />
              <Text className="text-xs font-semibold uppercase tracking-wider text-warm">Antiport</Text>
            </View>
            <Text className="text-xs text-ink-2 opacity-70">
              {time} · {day}
            </Text>
          </View>

          {/* Avatar */}
          <View className="mt-7 items-center">
            <AliadoAvatar size={96} state="hablando" tone="warm" />
          </View>

          {/* Mensaje */}
          <View className="mt-7">
            <Text className="text-xs font-semibold uppercase tracking-wider text-warm">
              {settings.aliadoName}
            </Text>
            <Text
              className="mt-2 text-2xl leading-snug text-ink"
              style={{ fontFamily: 'Fraunces_500Medium' }}
            >
              {resp?.message ?? 'Espera un segundo conmigo.'}
            </Text>
            {resp?.scripture && settings.spiritualLayer ? (
              <View className="mt-4 rounded-2xl border border-warm/20 bg-white/60 p-4">
                <Text className="text-sm italic leading-relaxed text-ink">
                  "{resp.scripture.text}"
                </Text>
                <Text className="mt-2 text-xs text-ink-3">{resp.scripture.reference}</Text>
              </View>
            ) : null}
          </View>

          {/* Acciones */}
          <View className="mt-auto pt-8 gap-2.5">
            <ActionButton
              icon="MessageCircle"
              label={`Hablar con ${settings.aliadoName}`}
              onPress={() => router.replace('/(tabs)/aliado')}
              dark
            />
            <ActionButton
              icon="Wind"
              label="Hacer una respiración 60s"
              onPress={() => router.replace('/urge-surfing')}
              iconColor="#3B6EA8"
            />
            <ActionButton
              icon="Heart"
              label="Ver mis anclas"
              onPress={() => router.replace('/anclas')}
              iconColor="#7BA888"
            />

            <Pressable
              onPress={() => router.push('/intervencion-friccion')}
              className="mt-4 items-center"
            >
              <Text
                className="text-sm text-ink-2 underline opacity-60"
                style={{ textDecorationLine: 'underline' }}
              >
                Quiero entrar igual
              </Text>
            </Pressable>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

function ActionButton({
  icon,
  label,
  onPress,
  dark,
  iconColor,
}: {
  icon: IconName;
  label: string;
  onPress: () => void;
  dark?: boolean;
  iconColor?: string;
}) {
  return (
    <Pressable
      onPress={onPress}
      className={`flex-row items-center justify-between rounded-2xl px-5 py-4 ${
        dark ? 'bg-ink' : 'border border-ink/5 bg-white'
      }`}
    >
      <View className="flex-row items-center gap-3">
        <Icon name={icon} size={20} color={dark ? '#fff' : iconColor ?? '#1C2128'} />
        <Text className={`text-base font-semibold ${dark ? 'text-white' : 'text-ink'}`}>{label}</Text>
      </View>
      <Icon name="ArrowRight" size={18} color={dark ? '#fff' : '#9CA3AF'} />
    </Pressable>
  );
}
