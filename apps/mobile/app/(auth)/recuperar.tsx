import * as React from 'react';
import { View, Text, TextInput, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { supabase } from '../../lib/supabase';

export default function Recuperar() {
  const [email, setEmail] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [sent, setSent] = React.useState(false);
  const [err, setErr] = React.useState<string | null>(null);

  const onSubmit = async () => {
    setErr(null);
    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      if (error) throw error;
      setSent(true);
    } catch (e: unknown) {
      setErr(e instanceof Error ? e.message : 'Error al enviar el correo');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-bg dark:bg-dk-bg">
      <View className="flex-1 px-7 pt-10">
        <Text className="text-3xl text-ink dark:text-dk-ink" style={{ fontFamily: 'Fraunces_500Medium' }}>
          Recuperar acceso
        </Text>
        <Text className="mt-2 text-base text-ink-2 dark:text-dk-ink2">
          Te enviamos un enlace seguro a tu correo.
        </Text>

        {sent ? (
          <View className="mt-10 rounded-2xl border border-secondary/30 bg-secondary/10 p-5">
            <Text className="text-base text-ink dark:text-dk-ink">
              Listo. Revisa tu bandeja de entrada.
            </Text>
            <Pressable onPress={() => router.replace('/(auth)/login')} className="mt-4">
              <Text className="text-sm font-semibold text-primary">Volver a entrar</Text>
            </Pressable>
          </View>
        ) : (
          <>
            <View className="mt-8">
              <Text className="mb-1.5 text-xs font-semibold uppercase tracking-wider text-ink-3">Email</Text>
              <TextInput
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                className="h-14 rounded-2xl border border-hairlineStrong bg-surface px-4 text-base text-ink dark:bg-dk-surface dark:text-dk-ink"
              />
            </View>

            {err ? <Text className="mt-3 text-sm text-warm">{err}</Text> : null}

            <Pressable
              onPress={onSubmit}
              disabled={loading}
              className="mt-6 h-14 items-center justify-center rounded-full bg-primary"
            >
              <Text className="text-base font-semibold text-white">
                {loading ? 'Enviando…' : 'Enviar enlace'}
              </Text>
            </Pressable>
          </>
        )}
      </View>
    </SafeAreaView>
  );
}
