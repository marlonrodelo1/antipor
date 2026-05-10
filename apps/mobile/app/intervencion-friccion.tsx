import * as React from 'react';
import { View, Text, TextInput, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Icon } from './../components/icon';

const PHRASE = 'Voy a entrar a una web que sé que me hace daño.';

/**
 * Fricción: el usuario tiene que escribir a mano la frase de compromiso.
 * NO es para juzgarle — es para que se oiga a sí mismo.
 */
export default function InterventionFriccion() {
  const [typed, setTyped] = React.useState('');
  const matches = normalize(typed) === normalize(PHRASE);

  return (
    <SafeAreaView className="flex-1 bg-bg" edges={['top']}>
      <View className="flex-1 px-6 pt-3">
        <Pressable
          onPress={() => router.back()}
          className="flex-row items-center gap-2 self-start py-2"
        >
          <Icon name="ChevronLeft" size={22} color="#3F4854" />
          <Text className="text-sm text-ink-2">Volver con Aliado</Text>
        </Pressable>

        <Text
          className="mt-4 text-2xl leading-tight text-ink"
          style={{ fontFamily: 'Fraunces_500Medium' }}
        >
          Antes de continuar.
        </Text>
        <Text className="mt-3 text-[15px] leading-relaxed text-ink-2">
          Si quieres entrar igual, escribe la siguiente frase a mano. No es para juzgarte. Es para que tú lo escuches.
        </Text>

        <View className="mt-6 rounded-2xl border border-hairline bg-surface p-5">
          <Text className="text-xs font-semibold uppercase tracking-wider text-ink-3">Frase</Text>
          <Text
            className="mt-2 text-lg italic leading-relaxed text-ink"
            style={{ fontFamily: 'Fraunces_500Medium' }}
          >
            "{PHRASE}"
          </Text>
        </View>

        <View
          className={`mt-3 rounded-2xl border bg-surface p-5 ${
            matches ? 'border-secondary' : 'border-warm'
          }`}
          style={{ minHeight: 160 }}
        >
          <Text
            className={`text-xs font-semibold uppercase tracking-wider ${
              matches ? 'text-secondary' : 'text-warm'
            }`}
          >
            Tu turno · escríbelo
          </Text>
          <TextInput
            value={typed}
            onChangeText={setTyped}
            placeholder="Empieza a escribir…"
            placeholderTextColor="#9CA3AF"
            multiline
            autoFocus
            textAlignVertical="top"
            className="mt-2 min-h-[100px] text-base leading-relaxed text-ink"
          />
        </View>

        <View className="mt-auto gap-2 pb-6">
          <Pressable
            disabled={!matches}
            onPress={() => {
              // Si llega aquí, la app permite seguir. La intercepción nativa
              // levanta el bloqueo en este flujo (lo gestionará el módulo nativo).
              router.replace('/(tabs)');
            }}
            className={`h-14 items-center justify-center rounded-full ${
              matches ? 'bg-warm' : 'bg-hairlineStrong'
            }`}
          >
            <Text className="text-base font-semibold text-white">
              {matches ? 'Continuar' : 'Continuar (incompleto)'}
            </Text>
          </Pressable>
          <Pressable
            onPress={() => router.replace('/(tabs)')}
            className="h-12 items-center justify-center"
          >
            <Text className="text-sm font-medium text-ink-2">No, mejor no</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

function normalize(s: string): string {
  return s
    .trim()
    .toLowerCase()
    .replace(/["'.,;:]/g, '')
    .replace(/\s+/g, ' ');
}
