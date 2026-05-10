import * as React from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { Icon, type IconName } from '../../components/icon';
import { StreakPlant } from '../../components/streak-plant';
import { useAppStore } from '../../lib/store';

type Mood = 'cansado' | 'solo' | 'aburrido' | 'estresado' | 'tranquilo';

interface MoodOpt {
  id: Mood;
  icon: IconName;
  label: string;
}

const MOODS: MoodOpt[] = [
  { id: 'cansado', icon: 'Moon', label: 'Cansado' },
  { id: 'solo', icon: 'User', label: 'Solo' },
  { id: 'aburrido', icon: 'CloudOff', label: 'Aburrido' },
  { id: 'estresado', icon: 'Zap', label: 'Estresado' },
  { id: 'tranquilo', icon: 'Leaf', label: 'Tranquilo' },
];

export default function Hoy() {
  const profile = useAppStore((s) => s.profile);
  const streak = useAppStore((s) => s.streak);
  const [mood, setMood] = React.useState<Mood | null>(null);

  const greeting = greet(profile.name);

  const onUrge = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push('/urge-surfing');
  };

  return (
    <SafeAreaView className="flex-1 bg-bg dark:bg-dk-bg" edges={['top']}>
      <ScrollView contentContainerStyle={{ paddingBottom: 120 }} showsVerticalScrollIndicator={false}>
        <View className="px-6 pt-4">
          <Text className="text-sm text-ink-3">Hoy</Text>
          <Text
            className="mt-1 text-3xl leading-tight text-ink dark:text-dk-ink"
            style={{ fontFamily: 'Fraunces_500Medium' }}
          >
            {greeting}
          </Text>
        </View>

        {/* Streak orgánico — sin número grande */}
        <View className="mt-6 items-center">
          <StreakPlant days={streak.days} size={200} />
          <Text className="mt-2 text-sm text-ink-2">
            {streak.days === 0
              ? 'Primer día. Tu planta está empezando.'
              : `${streak.days} ${streak.days === 1 ? 'día creciendo' : 'días creciendo'}.`}
          </Text>
        </View>

        {/* Mood check-in */}
        <View className="mx-6 mt-8">
          <Text className="mb-3 text-xs font-semibold uppercase tracking-wider text-ink-3">
            ¿Cómo estás ahora?
          </Text>
          <View className="flex-row justify-between">
            {MOODS.map((m) => {
              const on = mood === m.id;
              return (
                <Pressable
                  key={m.id}
                  onPress={() => {
                    setMood(m.id);
                    Haptics.selectionAsync();
                  }}
                  className={`items-center gap-1.5 rounded-2xl border px-3 py-3 ${
                    on ? 'border-primary bg-primary/10' : 'border-hairline bg-surface'
                  }`}
                  style={{ width: '18.5%' }}
                >
                  <Icon name={m.icon} size={22} color={on ? '#3B6EA8' : '#3F4854'} />
                  <Text className={`text-[10px] ${on ? 'text-primary' : 'text-ink-2'}`}>{m.label}</Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* Reflection card */}
        <View className="mx-6 mt-6 rounded-3xl border border-hairline bg-surface p-5 dark:bg-dk-surface">
          <Text className="text-xs font-semibold uppercase tracking-wider text-warm">Reflexión</Text>
          <Text
            className="mt-2 text-lg leading-snug text-ink dark:text-dk-ink"
            style={{ fontFamily: 'Fraunces_500Medium' }}
          >
            "El que es lento para la ira es mejor que el guerrero, y el que domina su espíritu, mejor que quien conquista una ciudad."
          </Text>
          <Text className="mt-3 text-xs text-ink-3">Proverbios 16:32 · capa espiritual opcional</Text>
        </View>
      </ScrollView>

      {/* Sticky bottom red button */}
      <View className="absolute bottom-[88px] left-0 right-0 px-6">
        <Pressable
          onPress={onUrge}
          className="h-14 flex-row items-center justify-center gap-2 rounded-full bg-warm shadow-lg"
        >
          <Icon name="Wind" size={20} color="#fff" />
          <Text className="text-base font-semibold text-white">Tengo un impulso ahora</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

function greet(name: string): string {
  const h = new Date().getHours();
  const part = h < 12 ? 'Buenos días' : h < 20 ? 'Buenas tardes' : 'Buenas noches';
  return name ? `${part}, ${name}.` : `${part}.`;
}
