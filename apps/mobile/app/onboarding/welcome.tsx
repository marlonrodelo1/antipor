import * as React from 'react';
import { View, Text, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { WelcomeIllustration } from '../../components/welcome-illustration';

export default function Welcome() {
  return (
    <SafeAreaView className="flex-1 bg-bg dark:bg-dk-bg">
      <View className="flex-1 items-center justify-center px-7">
        <WelcomeIllustration size={220} />
        <Text
          className="mt-8 text-center text-4xl leading-tight text-ink dark:text-dk-ink"
          style={{ fontFamily: 'Fraunces_500Medium' }}
        >
          No estás solo.{'\n'}
          <Text style={{ fontStyle: 'italic' }}>Vamos paso a paso.</Text>
        </Text>
        <Text className="mt-5 text-center text-base leading-relaxed text-ink-2 dark:text-dk-ink2">
          Sin juicio, sin registro, sin coger tus datos.{'\n'}Solo tú y tu camino.
        </Text>
      </View>
      <View className="px-7 pb-8 gap-3">
        <Pressable
          onPress={() => router.push('/onboarding/nombre')}
          className="h-14 items-center justify-center rounded-full bg-primary"
        >
          <Text className="text-base font-semibold text-white">Empezar</Text>
        </Pressable>
        <Text className="text-center text-xs text-ink-3">
          Antiport es gratis y vive de donaciones.
        </Text>
      </View>
    </SafeAreaView>
  );
}
