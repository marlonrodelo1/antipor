import * as React from 'react';
import { View, Text, Pressable, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { OBHeader } from './_header';
import { Icon } from '../../components/icon';

interface Q {
  id: string;
  text: string;
  options: string[];
}

const QUESTIONS: Q[] = [
  {
    id: 'frecuencia',
    text: '¿Con qué frecuencia consumes pornografía?',
    options: ['Casi nunca', 'Alguna vez al mes', 'Cada semana', 'Casi cada día', 'Varias veces al día'],
  },
  {
    id: 'horario',
    text: '¿Cuándo suele ocurrir?',
    options: ['Mañana', 'Tarde', 'Noche', 'Madrugada', 'Variable'],
  },
  {
    id: 'gatillo',
    text: 'Cuando ocurre, ¿cómo te sientes antes?',
    options: ['Cansado', 'Solo', 'Aburrido', 'Estresado', 'Tranquilo'],
  },
];

export default function Test() {
  const [answers, setAnswers] = React.useState<Record<string, string>>({});
  const allDone = QUESTIONS.every((q) => answers[q.id]);

  return (
    <SafeAreaView className="flex-1 bg-bg dark:bg-dk-bg">
      <OBHeader step={4} />
      <ScrollView className="flex-1" contentContainerStyle={{ padding: 28, paddingBottom: 24 }}>
        <Text className="text-3xl leading-tight text-ink dark:text-dk-ink" style={{ fontFamily: 'Fraunces_500Medium' }}>
          Cuéntame un <Text style={{ fontStyle: 'italic' }}>poco más.</Text>
        </Text>
        <Text className="mt-2 text-sm text-ink-2 dark:text-dk-ink2">
          No es un diagnóstico. Solo me ayuda a entenderte. Todo se queda en tu móvil.
        </Text>

        <View className="mt-8 gap-7">
          {QUESTIONS.map((q) => (
            <View key={q.id}>
              <Text className="mb-3 text-base font-medium text-ink dark:text-dk-ink">{q.text}</Text>
              <View className="gap-2">
                {q.options.map((o) => {
                  const on = answers[q.id] === o;
                  return (
                    <Pressable
                      key={o}
                      onPress={() => setAnswers((a) => ({ ...a, [q.id]: o }))}
                      className={`flex-row items-center justify-between rounded-2xl border px-4 py-3.5 ${
                        on ? 'border-primary bg-primary/5' : 'border-hairline bg-surface'
                      }`}
                    >
                      <Text className={`text-base ${on ? 'text-primary' : 'text-ink'}`}>{o}</Text>
                      {on ? <Icon name="Check" size={18} color="#3B6EA8" /> : null}
                    </Pressable>
                  );
                })}
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      <View className="px-7 pb-6">
        <Pressable
          onPress={() => router.push('/onboarding/espiritual')}
          disabled={!allDone}
          className={`h-14 flex-row items-center justify-center gap-2 rounded-full ${
            allDone ? 'bg-primary' : 'bg-hairlineStrong'
          }`}
        >
          <Text className="text-base font-semibold text-white">Continuar</Text>
          <Icon name="ArrowRight" size={18} color="#fff" />
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
