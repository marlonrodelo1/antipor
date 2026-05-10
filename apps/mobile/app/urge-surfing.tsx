import * as React from 'react';
import { View, Text, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { Icon } from './../components/icon';
import { BreathingCircle } from './../components/breathing-circle';

const TOTAL_SECONDS = 5 * 60;

export default function UrgeSurfing() {
  const [seconds, setSeconds] = React.useState(TOTAL_SECONDS);
  const [running, setRunning] = React.useState(true);

  React.useEffect(() => {
    if (!running) return;
    const t = setInterval(() => {
      setSeconds((s) => {
        if (s <= 1) {
          clearInterval(t);
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [running]);

  const mm = String(Math.floor(seconds / 60)).padStart(2, '0');
  const ss = String(seconds % 60).padStart(2, '0');
  const done = seconds === 0;

  return (
    <View className="flex-1 bg-warm-bg">
      <SafeAreaView className="flex-1">
        <View className="flex-row justify-end px-6 py-2">
          <Pressable
            onPress={() => router.back()}
            className="h-10 w-10 items-center justify-center rounded-full bg-white/60"
          >
            <Icon name="X" size={20} color="#1C2128" />
          </Pressable>
        </View>

        <View className="flex-1 items-center justify-center gap-10">
          <Text className="text-xs font-semibold uppercase tracking-widest text-warm">Respira</Text>
          <BreathingCircle size={280} running={running && !done} />
          <View className="items-center gap-2">
            <Text
              className="text-5xl tabular-nums text-ink"
              style={{ fontFamily: 'Fraunces_500Medium' }}
            >
              {mm}:{ss}
            </Text>
            <Text className="px-10 text-center text-sm leading-relaxed text-ink-2">
              No tienes que hacer nada. Solo respira conmigo. Inhala 4 · mantén 7 · exhala 8.
            </Text>
          </View>
        </View>

        <View className="px-6 pb-8 gap-3">
          {done ? (
            <Pressable
              onPress={() => router.back()}
              className="h-14 items-center justify-center rounded-full bg-primary"
            >
              <Text className="text-base font-semibold text-white">Has surfeado la ola</Text>
            </Pressable>
          ) : (
            <>
              <Pressable
                onPress={() => setRunning((r) => !r)}
                className="h-12 items-center justify-center rounded-full border border-ink/10 bg-white/70"
              >
                <Text className="text-sm font-medium text-ink">{running ? 'Pausar' : 'Continuar'}</Text>
              </Pressable>
              <Pressable
                onPress={() => router.back()}
                className="h-12 items-center justify-center"
              >
                <Text className="text-sm text-ink-2">Salir</Text>
              </Pressable>
            </>
          )}
        </View>
      </SafeAreaView>
    </View>
  );
}
