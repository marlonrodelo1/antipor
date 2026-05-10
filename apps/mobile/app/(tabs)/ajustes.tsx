import * as React from 'react';
import { View, Text, ScrollView, Pressable, Switch, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Icon, type IconName } from '../../components/icon';
import { useAppStore } from '../../lib/store';

export default function Ajustes() {
  const profile = useAppStore((s) => s.profile);
  const settings = useAppStore((s) => s.settings);
  const setSettings = useAppStore((s) => s.setSettings);
  const resetAll = useAppStore((s) => s.resetAll);

  const [deleting, setDeleting] = React.useState(false);

  const onDelete = () => {
    Alert.alert(
      'Borrar mi progreso',
      'Esta accion no se puede deshacer. Se borraran racha, anclas, diario y ajustes solo de este dispositivo.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Borrar todo',
          style: 'destructive',
          onPress: () => {
            setDeleting(true);
            try {
              resetAll();
              router.replace('/onboarding/welcome');
            } finally {
              setDeleting(false);
            }
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-bg dark:bg-dk-bg" edges={['top']}>
      <ScrollView contentContainerStyle={{ padding: 24, paddingBottom: 100 }}>
        <Text
          className="text-3xl text-ink dark:text-dk-ink"
          style={{ fontFamily: 'Fraunces_500Medium' }}
        >
          Ajustes
        </Text>

        <Section title="Perfil">
          <Row icon="User" label={profile.name || 'Anónimo'} hint="Solo en este dispositivo" />
        </Section>

        <Section title="Aliado">
          <Row icon="Sparkles" label="Nombre" hint={settings.aliadoName} />
          <Row icon="MessageCircle" label="Tono" hint={settings.aliadoTone === 'cercano' ? 'Cercano' : 'Formal'} />
          <Row icon="Volume2" label="Voz percibida" hint={capitalize(settings.aliadoGender)} />
        </Section>

        <Section title="Capa espiritual">
          <ToggleRow
            icon="BookOpen"
            label="Acompañamiento cristiano"
            hint="Versículos y reflexiones cuando encajen"
            value={settings.spiritualLayer}
            onValueChange={(v) => setSettings({ spiritualLayer: v })}
          />
        </Section>

        <Section title="Protección">
          <Row icon="Shield" label="Estado" hint="Activa (stub)" />
          <Row icon="Lock" label="Privacidad URLs" hint="Solo local. No salen del móvil." />
        </Section>

        <Section title="Notificaciones">
          <ToggleRow
            icon="Bell"
            label="Recordatorios suaves"
            hint="Solo en franjas de riesgo"
            value={settings.notifications}
            onValueChange={(v) => setSettings({ notifications: v })}
          />
        </Section>

        <Section title="Privacidad">
          <Pressable
            onPress={onDelete}
            disabled={deleting}
            className="flex-row items-center gap-3 rounded-2xl border border-warm/30 bg-warm/5 p-4"
          >
            <View className="h-10 w-10 items-center justify-center rounded-xl bg-warm/10">
              <Icon name="Trash2" size={20} color="#D97757" />
            </View>
            <View className="flex-1">
              <Text className="text-[15px] font-semibold text-warm">
                {deleting ? 'Borrando...' : 'Borrar mi progreso'}
              </Text>
              <Text className="text-xs text-ink-3">
                Limpia este dispositivo. Nada sale al servidor — porque nada hay alli.
              </Text>
            </View>
          </Pressable>
        </Section>

        <Section title="Apoyar">
          <Row icon="Heart" label="Donar" hint="Antiport es gratis y vive de donaciones." />
          <Row icon="Share2" label="Compartir con alguien" hint="Si crees que le puede ayudar." />
        </Section>

        <Text className="mt-8 text-center text-xs text-ink-3">Antiport · v0.1 · Hecho con cariño</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View className="mt-7">
      <Text className="mb-2 px-1 text-xs font-semibold uppercase tracking-wider text-ink-3">{title}</Text>
      <View className="overflow-hidden rounded-2xl border border-hairline bg-surface dark:bg-dk-surface">
        {children}
      </View>
    </View>
  );
}

function Row({ icon, label, hint }: { icon: IconName; label: string; hint?: string }) {
  return (
    <View className="flex-row items-center gap-3 border-b border-hairline p-4 last:border-0">
      <View className="h-10 w-10 items-center justify-center rounded-xl bg-bg">
        <Icon name={icon} size={20} color="#3F4854" />
      </View>
      <View className="flex-1">
        <Text className="text-[15px] text-ink dark:text-dk-ink">{label}</Text>
        {hint ? <Text className="text-xs text-ink-3">{hint}</Text> : null}
      </View>
      <Icon name="ChevronRight" size={18} color="#9CA3AF" />
    </View>
  );
}

function ToggleRow({
  icon,
  label,
  hint,
  value,
  onValueChange,
}: {
  icon: IconName;
  label: string;
  hint?: string;
  value: boolean;
  onValueChange: (v: boolean) => void;
}) {
  return (
    <View className="flex-row items-center gap-3 p-4">
      <View className="h-10 w-10 items-center justify-center rounded-xl bg-bg">
        <Icon name={icon} size={20} color="#3F4854" />
      </View>
      <View className="flex-1">
        <Text className="text-[15px] text-ink dark:text-dk-ink">{label}</Text>
        {hint ? <Text className="text-xs text-ink-3">{hint}</Text> : null}
      </View>
      <Switch value={value} onValueChange={onValueChange} />
    </View>
  );
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
