import * as React from 'react';
import { View, Text, TextInput, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { OBHeader } from './_header';
import { Icon } from '../../components/icon';
import { AliadoAvatar } from '../../components/aliado-avatar';
import { useAppStore, type AliadoTone, type AliadoGender } from '../../lib/store';

export default function AliadoSetup() {
  const settings = useAppStore((s) => s.settings);
  const setSettings = useAppStore((s) => s.setSettings);
  const [name, setName] = React.useState(settings.aliadoName);
  const [tone, setTone] = React.useState<AliadoTone>(settings.aliadoTone);
  const [gender, setGender] = React.useState<AliadoGender>(settings.aliadoGender);

  const onContinue = () => {
    setSettings({ aliadoName: name.trim() || 'Aliado', aliadoTone: tone, aliadoGender: gender });
    router.push('/onboarding/permisos');
  };

  return (
    <SafeAreaView className="flex-1 bg-bg dark:bg-dk-bg">
      <OBHeader step={6} />
      <View className="flex-1 px-7 pt-8">
        <View className="items-center">
          <AliadoAvatar size={96} state="reposo" tone="warm" />
        </View>

        <Text className="mt-6 text-3xl leading-tight text-ink dark:text-dk-ink" style={{ fontFamily: 'Fraunces_500Medium' }}>
          Conoce a tu <Text style={{ fontStyle: 'italic' }}>Aliado.</Text>
        </Text>
        <Text className="mt-2 text-sm text-ink-2 dark:text-dk-ink2">
          Le puedes poner nombre y elegir cómo te habla.
        </Text>

        <Text className="mb-1.5 mt-6 text-xs font-semibold uppercase tracking-wider text-ink-3">Nombre</Text>
        <TextInput
          value={name}
          onChangeText={setName}
          placeholder="Aliado"
          placeholderTextColor="#9CA3AF"
          className="h-12 rounded-2xl border border-hairlineStrong bg-surface px-4 text-base text-ink dark:bg-dk-surface dark:text-dk-ink"
        />

        <Text className="mb-2 mt-5 text-xs font-semibold uppercase tracking-wider text-ink-3">Tono</Text>
        <View className="flex-row gap-2">
          <Chip on={tone === 'cercano'} onPress={() => setTone('cercano')} label="Cercano" />
          <Chip on={tone === 'formal'} onPress={() => setTone('formal')} label="Formal" />
        </View>

        <Text className="mb-2 mt-5 text-xs font-semibold uppercase tracking-wider text-ink-3">Voz percibida</Text>
        <View className="flex-row gap-2">
          <Chip on={gender === 'neutro'} onPress={() => setGender('neutro')} label="Neutra" />
          <Chip on={gender === 'masculino'} onPress={() => setGender('masculino')} label="Masculina" />
          <Chip on={gender === 'femenino'} onPress={() => setGender('femenino')} label="Femenina" />
        </View>

        <View className="mt-auto pb-6">
          <Pressable
            onPress={onContinue}
            className="h-14 flex-row items-center justify-center gap-2 rounded-full bg-primary"
          >
            <Text className="text-base font-semibold text-white">Continuar</Text>
            <Icon name="ArrowRight" size={18} color="#fff" />
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

function Chip({ on, onPress, label }: { on: boolean; onPress: () => void; label: string }) {
  return (
    <Pressable
      onPress={onPress}
      className={`rounded-full border px-4 py-2.5 ${
        on ? 'border-primary bg-primary/10' : 'border-hairline bg-surface'
      }`}
    >
      <Text className={`text-sm ${on ? 'text-primary' : 'text-ink'}`}>{label}</Text>
    </Pressable>
  );
}
