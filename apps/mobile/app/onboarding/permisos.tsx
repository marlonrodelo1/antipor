import * as React from 'react';
import { View, Text, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { OBHeader } from './_header';
import { Icon, type IconName } from '../../components/icon';
import { nativeBlocker } from '../../lib/native-blocker';

interface Item {
  icon: IconName;
  title: string;
  desc: string;
  required: boolean;
}

const ITEMS: Item[] = [
  { icon: 'Shield', title: 'Protección activa', desc: 'iOS Screen Time / Android Accessibility. La página se bloquea antes de cargar.', required: true },
  { icon: 'Lock', title: 'Sin tracking', desc: 'Las URLs nunca salen de tu móvil. Solo categorías agregadas.', required: true },
  { icon: 'Bell', title: 'Notificaciones', desc: 'Recordatorios suaves en franjas de riesgo. Opcional.', required: false },
];

export default function Permisos() {
  const [toggles, setToggles] = React.useState<boolean[]>(ITEMS.map((it) => it.required));
  const [loading, setLoading] = React.useState(false);

  const onActivate = async () => {
    setLoading(true);
    try {
      // En v0 esto solo loguea (stub). En v1 dispara los flujos nativos reales.
      await nativeBlocker.requestPermissions();
      router.replace('/(tabs)');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-bg dark:bg-dk-bg">
      <OBHeader step={7} />
      <View className="flex-1 px-7 pt-8">
        <Text className="text-3xl leading-tight text-ink dark:text-dk-ink" style={{ fontFamily: 'Fraunces_500Medium' }}>
          Activa la <Text style={{ fontStyle: 'italic' }}>protección.</Text>
        </Text>
        <Text className="mt-2 text-sm leading-relaxed text-ink-2 dark:text-dk-ink2">
          Te explico honestamente qué hace cada permiso. Puedes desactivar cualquiera más tarde.
        </Text>

        <View className="mt-6 gap-2.5">
          {ITEMS.map((it, i) => {
            const on = toggles[i] ?? false;
            return (
              <View
                key={it.title}
                className="flex-row items-center gap-3.5 rounded-2xl border border-hairline bg-surface p-4 dark:bg-dk-surface"
              >
                <View className={`h-11 w-11 items-center justify-center rounded-xl ${on ? 'bg-primary/10' : 'bg-bg'}`}>
                  <Icon name={it.icon} size={22} color={on ? '#3B6EA8' : '#6B7280'} />
                </View>
                <View className="flex-1">
                  <Text className="text-[15px] font-semibold text-ink dark:text-dk-ink">{it.title}</Text>
                  <Text className="mt-0.5 text-xs leading-snug text-ink-3">{it.desc}</Text>
                </View>
                <Pressable
                  onPress={() => {
                    if (it.required) return;
                    setToggles((t) => t.map((v, idx) => (idx === i ? !v : v)));
                  }}
                  disabled={it.required}
                  className={`h-7 w-11 justify-center rounded-full px-0.5 ${on ? 'bg-primary' : 'bg-hairlineStrong'}`}
                >
                  <View
                    className="h-6 w-6 rounded-full bg-white shadow"
                    style={{ marginLeft: on ? 16 : 0 }}
                  />
                </Pressable>
              </View>
            );
          })}
        </View>

        <View className="mt-auto gap-2 pb-6">
          <Pressable
            onPress={onActivate}
            disabled={loading}
            className="h-14 items-center justify-center rounded-full bg-primary"
          >
            <Text className="text-base font-semibold text-white">{loading ? 'Activando…' : 'Activar protección'}</Text>
          </Pressable>
          <Pressable
            onPress={() => router.replace('/(tabs)')}
            className="h-12 items-center justify-center"
          >
            <Text className="text-sm text-ink-2">Más tarde</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}
