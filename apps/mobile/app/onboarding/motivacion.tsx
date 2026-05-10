import * as React from 'react';
import { View, Text, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { OBHeader } from './_header';
import { Icon } from '../../components/icon';

const OPTS = [
  'Salud mental',
  'Mi pareja',
  'Mi familia',
  'Mi fe',
  'Lo intenté antes',
  'Curiosidad',
  'Mi futuro',
  'Concentración',
] as const;

export default function Motivacion() {
  const [selected, setSelected] = React.useState<Set<string>>(new Set());

  const toggle = (o: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(o)) next.delete(o);
      else next.add(o);
      return next;
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-bg dark:bg-dk-bg">
      <OBHeader step={3} />
      <View className="flex-1 px-7 pt-8">
        <Text className="text-3xl leading-tight text-ink dark:text-dk-ink" style={{ fontFamily: 'Fraunces_500Medium' }}>
          ¿Qué te trae <Text style={{ fontStyle: 'italic' }}>hoy aquí?</Text>
        </Text>
        <Text className="mt-2 text-sm text-ink-2 dark:text-dk-ink2">
          Elige las que sientas. Sin juicio.
        </Text>

        <View className="mt-7 flex-row flex-wrap gap-2">
          {OPTS.map((o) => {
            const on = selected.has(o);
            return (
              <Pressable
                key={o}
                onPress={() => toggle(o)}
                className={`rounded-full border px-4 py-2.5 ${
                  on ? 'border-primary bg-primary/10' : 'border-hairline bg-surface'
                }`}
              >
                <Text className={`text-sm ${on ? 'text-primary' : 'text-ink'}`}>{o}</Text>
              </Pressable>
            );
          })}
        </View>

        <View className="mt-auto pb-6">
          <Pressable
            onPress={() => router.push('/onboarding/test')}
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
