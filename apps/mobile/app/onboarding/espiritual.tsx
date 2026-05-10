import * as React from 'react';
import { View, Text, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { OBHeader } from './_header';
import { Icon } from '../../components/icon';
import { useAppStore } from '../../lib/store';

export default function Espiritual() {
  const setSettings = useAppStore((s) => s.setSettings);

  const choose = (on: boolean) => {
    setSettings({ spiritualLayer: on });
    router.push('/onboarding/aliado');
  };

  return (
    <SafeAreaView className="flex-1 bg-bg dark:bg-dk-bg">
      <OBHeader step={5} />
      <View className="flex-1 px-7 pt-8">
        <View className="h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
          <Icon name="BookOpen" size={32} color="#3B6EA8" />
        </View>

        <Text className="mt-5 text-3xl leading-tight text-ink dark:text-dk-ink" style={{ fontFamily: 'Fraunces_500Medium' }}>
          ¿Quieres acompañamiento{' '}
          <Text style={{ fontStyle: 'italic' }}>espiritual cristiano?</Text>
        </Text>
        <Text className="mt-3 text-base leading-relaxed text-ink-2 dark:text-dk-ink2">
          Si dices sí, Aliado podrá compartirte un versículo o una reflexión cuando encaje. Si dices no, la app es 100% secular.{' '}
          <Text className="font-medium text-ink dark:text-dk-ink">Puedes cambiarlo cuando quieras.</Text>
        </Text>

        <View className="mt-7 gap-3">
          <Pressable
            onPress={() => choose(true)}
            className="flex-row items-center justify-between rounded-2xl border-2 border-primary bg-surface p-5 dark:bg-dk-surface"
          >
            <View>
              <Text className="text-base font-semibold text-ink dark:text-dk-ink">Sí, inclúyelo</Text>
              <Text className="mt-0.5 text-xs text-ink-3">Católico · evangélico · general</Text>
            </View>
            <Icon name="ChevronRight" size={18} color="#3B6EA8" />
          </Pressable>
          <Pressable
            onPress={() => choose(false)}
            className="flex-row items-center justify-between rounded-2xl border border-hairline bg-surface p-5 dark:bg-dk-surface"
          >
            <View>
              <Text className="text-base font-semibold text-ink dark:text-dk-ink">No, gracias</Text>
              <Text className="mt-0.5 text-xs text-ink-3">App 100% secular</Text>
            </View>
            <Icon name="ChevronRight" size={18} color="#6B7280" />
          </Pressable>
        </View>

        <View className="mt-auto pb-6">
          <Text className="text-center text-xs leading-relaxed text-ink-3">
            Esto no afecta la efectividad de la app.{'\n'}Antiport funciona igual para cualquier persona.
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}
