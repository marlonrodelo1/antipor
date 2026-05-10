import * as React from 'react';
import { View, Text, TextInput, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link, router } from 'expo-router';
import { supabase, signInAnonymous } from '../../lib/supabase';
import { useAppStore } from '../../lib/store';

export default function Login() {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [err, setErr] = React.useState<string | null>(null);
  const setProfile = useAppStore((s) => s.setProfile);

  const onSubmit = async () => {
    setErr(null);
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      setProfile({ id: data.user?.id ?? null, guest: false });
      router.replace('/(tabs)');
    } catch (e: unknown) {
      setErr(e instanceof Error ? e.message : 'Error al entrar');
    } finally {
      setLoading(false);
    }
  };

  const onGuest = async () => {
    setLoading(true);
    try {
      await signInAnonymous();
      setProfile({ guest: true });
      router.replace('/onboarding/welcome');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-bg dark:bg-dk-bg">
      <View className="flex-1 px-7 pt-10">
        <Text className="text-3xl text-ink dark:text-dk-ink" style={{ fontFamily: 'Fraunces_500Medium' }}>
          Hola de nuevo.
        </Text>
        <Text className="mt-2 text-base text-ink-2 dark:text-dk-ink2">
          Entra para seguir donde lo dejaste.
        </Text>

        <View className="mt-8 gap-3">
          <Field label="Email" value={email} onChange={setEmail} keyboard="email-address" />
          <Field label="Contraseña" value={password} onChange={setPassword} secure />
        </View>

        {err ? (
          <Text className="mt-3 text-sm text-warm">{err}</Text>
        ) : null}

        <Pressable
          onPress={onSubmit}
          disabled={loading}
          className="mt-6 h-14 items-center justify-center rounded-full bg-primary"
        >
          <Text className="text-base font-semibold text-white">{loading ? 'Entrando…' : 'Entrar'}</Text>
        </Pressable>

        <Link href="/(auth)/recuperar" asChild>
          <Pressable className="mt-4 items-center">
            <Text className="text-sm text-ink-2 underline">¿Olvidaste la contraseña?</Text>
          </Pressable>
        </Link>

        <View className="mt-auto mb-4 gap-3">
          <View className="flex-row items-center gap-3">
            <View className="h-px flex-1 bg-hairline" />
            <Text className="text-xs text-ink-3">o</Text>
            <View className="h-px flex-1 bg-hairline" />
          </View>

          <Pressable
            onPress={onGuest}
            className="h-14 items-center justify-center rounded-full border border-hairlineStrong bg-surface dark:bg-dk-surface"
          >
            <Text className="text-base font-medium text-ink dark:text-dk-ink">Continuar como invitado anónimo</Text>
          </Pressable>

          <Link href="/(auth)/signup" asChild>
            <Pressable className="items-center pt-2">
              <Text className="text-sm text-ink-2">
                ¿Sin cuenta? <Text className="font-semibold text-primary">Crea una</Text>
              </Text>
            </Pressable>
          </Link>
        </View>
      </View>
    </SafeAreaView>
  );
}

function Field({
  label,
  value,
  onChange,
  secure,
  keyboard,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  secure?: boolean;
  keyboard?: 'default' | 'email-address';
}) {
  return (
    <View>
      <Text className="mb-1.5 text-xs font-semibold uppercase tracking-wider text-ink-3">{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChange}
        secureTextEntry={secure}
        keyboardType={keyboard ?? 'default'}
        autoCapitalize="none"
        className="h-14 rounded-2xl border border-hairlineStrong bg-surface px-4 text-base text-ink dark:bg-dk-surface dark:text-dk-ink"
      />
    </View>
  );
}
