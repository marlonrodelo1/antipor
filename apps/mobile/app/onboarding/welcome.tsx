import * as React from 'react';
import { View, Text, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { AliadoAvatar } from '../../components/aliado-avatar';
import { signInAnonymous } from '../../lib/supabase';
import { useAppStore } from '../../lib/store';

export default function Welcome() {
  const setProfile = useAppStore((s) => s.setProfile);

  const onGuest = async () => {
    await signInAnonymous();
    setProfile({ guest: true });
    router.push('/onboarding/nombre');
  };

  return (
    <SafeAreaView className="flex-1 bg-bg dark:bg-dk-bg">
      <View className="flex-1 items-center justify-center px-7">
        <AliadoAvatar size={140} state="reposo" tone="warm" />
        <Text
          className="mt-10 text-center text-4xl leading-tight text-ink dark:text-dk-ink"
          style={{ fontFamily: 'Fraunces_500Medium' }}
        >
          Hola.{'\n'}Estoy aquí cuando{'\n'}
          <Text style={{ fontStyle: 'italic' }}>lo necesites.</Text>
        </Text>
        <Text className="mt-5 text-center text-base leading-relaxed text-ink-2 dark:text-dk-ink2">
          Sin juicio, sin presión.{'\n'}Vamos paso a paso.
        </Text>
      </View>
      <View className="px-7 pb-8 gap-3">
        <Pressable
          onPress={() => router.push('/onboarding/nombre')}
          className="h-14 items-center justify-center rounded-full bg-primary"
        >
          <Text className="text-base font-semibold text-white">Empezar</Text>
        </Pressable>
        <Pressable onPress={onGuest} className="h-12 items-center justify-center">
          <Text className="text-sm text-ink-2 dark:text-dk-ink2">Continuar como invitado</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
