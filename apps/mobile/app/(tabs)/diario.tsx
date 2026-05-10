import * as React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Icon } from '../../components/icon';

type DayState = 'limpio' | 'recaida' | 'futuro' | 'sin_dato';

interface Cell {
  day: number;
  state: DayState;
}

function buildMonth(now = new Date()): { cells: Cell[]; label: string } {
  const y = now.getFullYear();
  const m = now.getMonth();
  const days = new Date(y, m + 1, 0).getDate();
  const today = now.getDate();
  const cells: Cell[] = Array.from({ length: days }, (_, i) => {
    const d = i + 1;
    if (d > today) return { day: d, state: 'futuro' };
    // Placeholder: 1 recaída cada 9 días, resto limpio.
    return { day: d, state: d % 9 === 0 ? 'recaida' : 'limpio' };
  });
  const label = now.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });
  return { cells, label };
}

export default function Diario() {
  const { cells, label } = React.useMemo(() => buildMonth(), []);
  const triggers = [
    { hour: '22:00 — 00:00', count: 4, label: 'Noche' },
    { hour: 'Domingo tarde', count: 3, label: 'Día/franja' },
    { hour: 'Después de discutir', count: 2, label: 'Emoción' },
  ];

  return (
    <SafeAreaView className="flex-1 bg-bg dark:bg-dk-bg" edges={['top']}>
      <ScrollView contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 100, paddingTop: 12 }}>
        <Text className="text-sm text-ink-3">Diario</Text>
        <Text
          className="mt-1 text-3xl text-ink dark:text-dk-ink"
          style={{ fontFamily: 'Fraunces_500Medium' }}
        >
          Tu mes, sin juicio.
        </Text>

        {/* Calendar */}
        <View className="mt-6 rounded-3xl border border-hairline bg-surface p-5 dark:bg-dk-surface">
          <Text className="mb-3 text-sm font-medium capitalize text-ink dark:text-dk-ink">{label}</Text>
          <View className="flex-row flex-wrap gap-1.5">
            {cells.map((c) => (
              <View
                key={c.day}
                style={{ width: '12%', aspectRatio: 1 }}
                className={`items-center justify-center rounded-lg ${cellBg(c.state)}`}
              >
                <Text className={`text-[11px] ${cellText(c.state)}`}>{c.day}</Text>
              </View>
            ))}
          </View>
          <View className="mt-4 flex-row gap-4">
            <Legend color="bg-secondary/30" label="Día limpio" />
            <Legend color="bg-warm/30" label="Recaída" />
          </View>
        </View>

        {/* Patrones */}
        <Text className="mb-3 mt-7 text-xs font-semibold uppercase tracking-wider text-ink-3">
          Patrones detectados
        </Text>
        <View className="rounded-3xl border border-hairline bg-surface dark:bg-dk-surface">
          {triggers.map((t, i) => (
            <View
              key={t.hour}
              className={`flex-row items-center gap-3 p-4 ${i > 0 ? 'border-t border-hairline' : ''}`}
            >
              <View className="h-10 w-10 items-center justify-center rounded-xl bg-warm/10">
                <Icon name="TrendingUp" size={20} color="#D97757" />
              </View>
              <View className="flex-1">
                <Text className="text-[15px] font-medium text-ink dark:text-dk-ink">{t.hour}</Text>
                <Text className="text-xs text-ink-3">{t.label}</Text>
              </View>
              <Text className="text-sm text-ink-2">{t.count}×</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function cellBg(state: DayState): string {
  switch (state) {
    case 'limpio':
      return 'bg-secondary/30';
    case 'recaida':
      return 'bg-warm/30';
    case 'futuro':
      return 'bg-bg';
    default:
      return 'bg-hairline';
  }
}

function cellText(state: DayState): string {
  switch (state) {
    case 'limpio':
      return 'text-ink';
    case 'recaida':
      return 'text-warm';
    case 'futuro':
      return 'text-ink-3';
    default:
      return 'text-ink-3';
  }
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <View className="flex-row items-center gap-1.5">
      <View className={`h-3 w-3 rounded ${color}`} />
      <Text className="text-xs text-ink-3">{label}</Text>
    </View>
  );
}
