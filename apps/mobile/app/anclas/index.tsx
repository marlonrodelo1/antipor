import * as React from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Icon, type IconName } from '../../components/icon';

interface Anchor {
  id: string;
  type: 'foto' | 'audio' | 'frase';
  title: string;
  preview?: string;
}

const PLACEHOLDER: Anchor[] = [
  { id: '1', type: 'frase', title: 'Mi por qué', preview: 'Mis hijos me necesitan despierto.' },
  { id: '2', type: 'foto', title: 'Familia', preview: undefined },
  { id: '3', type: 'audio', title: 'Mi madre', preview: '0:42' },
  { id: '4', type: 'frase', title: 'Recordatorio', preview: 'Soy más que mis impulsos.' },
];

export default function AnclasIndex() {
  return (
    <SafeAreaView className="flex-1 bg-bg dark:bg-dk-bg" edges={['top']}>
      <View className="flex-row items-center justify-between px-6 py-3">
        <Pressable onPress={() => router.back()} className="h-10 w-10 items-center justify-center">
          <Icon name="ChevronLeft" size={22} color="#3F4854" />
        </Pressable>
        <Text className="text-base font-semibold text-ink dark:text-dk-ink">Anclas</Text>
        <View className="w-10" />
      </View>

      <ScrollView contentContainerStyle={{ padding: 24, paddingBottom: 120 }}>
        <Text
          className="text-3xl leading-tight text-ink dark:text-dk-ink"
          style={{ fontFamily: 'Fraunces_500Medium' }}
        >
          Lo que te <Text style={{ fontStyle: 'italic' }}>importa.</Text>
        </Text>
        <Text className="mt-2 text-sm leading-relaxed text-ink-2">
          Fotos, audios, frases tuyas. Aliado las usa cuando lo necesitas.
        </Text>

        <View className="mt-6 flex-row flex-wrap gap-3">
          {PLACEHOLDER.map((a) => (
            <View
              key={a.id}
              style={{ width: '47%', aspectRatio: 1 }}
              className="rounded-3xl border border-hairline bg-surface p-4 dark:bg-dk-surface"
            >
              <View
                className={`h-10 w-10 items-center justify-center rounded-xl ${typeBg(a.type)}`}
              >
                <Icon name={typeIcon(a.type)} size={20} color={typeColor(a.type)} />
              </View>
              <Text className="mt-auto text-xs uppercase tracking-wider text-ink-3">{a.type}</Text>
              <Text
                className="mt-1 text-base font-medium leading-snug text-ink dark:text-dk-ink"
                numberOfLines={2}
              >
                {a.title}
              </Text>
              {a.preview ? (
                <Text className="mt-1 text-xs text-ink-3" numberOfLines={1}>
                  {a.preview}
                </Text>
              ) : null}
            </View>
          ))}
        </View>
      </ScrollView>

      <Pressable
        onPress={() => router.push('/anclas/nueva')}
        className="absolute bottom-8 right-6 h-14 flex-row items-center gap-2 rounded-full bg-primary px-5 shadow-lg"
      >
        <Icon name="Plus" size={20} color="#fff" />
        <Text className="text-base font-semibold text-white">Añadir ancla</Text>
      </Pressable>
    </SafeAreaView>
  );
}

function typeIcon(t: Anchor['type']): IconName {
  if (t === 'foto') return 'Image';
  if (t === 'audio') return 'Mic';
  return 'Quote';
}

function typeBg(t: Anchor['type']): string {
  if (t === 'foto') return 'bg-primary/10';
  if (t === 'audio') return 'bg-warm/10';
  return 'bg-secondary/15';
}

function typeColor(t: Anchor['type']): string {
  if (t === 'foto') return '#3B6EA8';
  if (t === 'audio') return '#D97757';
  return '#7BA888';
}
