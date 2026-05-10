import * as React from 'react';
import { View, Text, TextInput, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, Link } from 'expo-router';
import { z } from 'zod';
import { supabase } from '../../lib/supabase';
import { useAppStore } from '../../lib/store';

const Schema = z.object({
  email: z.string().email('Email no válido'),
  password: z.string().min(8, 'Mínimo 8 caracteres'),
});

export default function Signup() {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [err, setErr] = React.useState<string | null>(null);
  const setProfile = useAppStore((s) => s.setProfile);

  const onSubmit = async () => {
    setErr(null);
    const parsed = Schema.safeParse({ email, password });
    if (!parsed.success) {
      setErr(parsed.error.issues[0]?.message ?? 'Datos no válidos');
      return;
    }
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) throw error;
      setProfile({ id: data.user?.id ?? null, guest: false });
      router.replace('/onboarding/welcome');
    } catch (e: unknown) {
      setErr(e instanceof Error ? e.message : 'Error al registrarte');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-bg dark:bg-dk-bg">
      <View className="flex-1 px-7 pt-10">
        <Text className="text-3xl text-ink dark:text-dk-ink" style={{ fontFamily: 'Fraunces_500Medium' }}>
          Crear cuenta
        </Text>
        <Text className="mt-2 text-base text-ink-2 dark:text-dk-ink2">
          Empieza gratis. Sin tarjeta. Sin compromiso.
        </Text>

        <View className="mt-8 gap-3">
          <Text className="mb-1 text-xs font-semibold uppercase tracking-wider text-ink-3">Email</Text>
          <TextInput
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            className="h-14 rounded-2xl border border-hairlineStrong bg-surface px-4 text-base text-ink dark:bg-dk-surface dark:text-dk-ink"
          />
          <Text className="mb-1 mt-3 text-xs font-semibold uppercase tracking-wider text-ink-3">Contraseña</Text>
          <TextInput
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            className="h-14 rounded-2xl border border-hairlineStrong bg-surface px-4 text-base text-ink dark:bg-dk-surface dark:text-dk-ink"
          />
          <Text className="mt-1 text-xs text-ink-3">Mínimo 8 caracteres.</Text>
        </View>

        {err ? <Text className="mt-3 text-sm text-warm">{err}</Text> : null}

        <Pressable
          onPress={onSubmit}
          disabled={loading}
          className="mt-6 h-14 items-center justify-center rounded-full bg-primary"
        >
          <Text className="text-base font-semibold text-white">{loading ? 'Creando…' : 'Crear cuenta'}</Text>
        </Pressable>

        <Text className="mt-4 text-center text-xs leading-5 text-ink-3">
          Al continuar aceptas la política de privacidad. Tus URLs nunca salen del móvil.
        </Text>

        <View className="mt-auto pb-4">
          <Link href="/(auth)/login" asChild>
            <Pressable className="items-center">
              <Text className="text-sm text-ink-2">
                ¿Ya tienes cuenta? <Text className="font-semibold text-primary">Entra</Text>
              </Text>
            </Pressable>
          </Link>
        </View>
      </View>
    </SafeAreaView>
  );
}
