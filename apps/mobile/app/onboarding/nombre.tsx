import * as React from 'react';
import { View, Text, TextInput, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { OBHeader } from './_header';
import { Icon } from '../../components/icon';
import { useAppStore } from '../../lib/store';

export default function Nombre() {
  const profile = useAppStore((s) => s.profile);
  const setProfile = useAppStore((s) => s.setProfile);
  const [name, setName] = React.useState(profile.name);

  const onContinue = () => {
    setProfile({ name: name.trim() });
    router.push('/onboarding/motivacion');
  };

  return (
    <SafeAreaView className="flex-1 bg-bg dark:bg-dk-bg">
      <OBHeader step={2} />
      <View className="flex-1 px-7 pt-8">
        <Text className="text-3xl leading-tight text-ink dark:text-dk-ink" style={{ fontFamily: 'Fraunces_500Medium' }}>
          ¿Cómo te <Text style={{ fontStyle: 'italic' }}>llamas?</Text>
        </Text>
        <Text className="mt-2 text-base text-ink-2 dark:text-dk-ink2">
          Solo para que Aliado te hable por tu nombre. Puedes saltar.
        </Text>

        <View className="mt-8">
          <View className="relative">
            <TextInput
              value={name}
              onChangeText={setName}
              autoFocus
              placeholder="Tu nombre"
              placeholderTextColor="#9CA3AF"
              className="h-16 rounded-2xl border-2 border-primary bg-surface px-5 text-lg text-ink dark:bg-dk-surface dark:text-dk-ink"
            />
            {name.trim().length > 0 ? (
              <View className="absolute right-5 top-0 h-16 justify-center">
                <Icon name="Check" size={20} color="#7BA888" />
              </View>
            ) : null}
          </View>
          {name.trim().length > 0 ? (
            <Text className="mt-3 text-sm text-ink-3">Aliado te llamará "{name.trim()}".</Text>
          ) : null}
        </View>

        <View className="mt-auto gap-2 pb-6">
          <Pressable
            onPress={onContinue}
            className="h-14 flex-row items-center justify-center gap-2 rounded-full bg-primary"
          >
            <Text className="text-base font-semibold text-white">Continuar</Text>
            <Icon name="ArrowRight" size={18} color="#fff" />
          </Pressable>
          <Pressable
            onPress={() => router.push('/onboarding/motivacion')}
            className="h-12 items-center justify-center"
          >
            <Text className="text-sm text-ink-2">Saltar</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}
