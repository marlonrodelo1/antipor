import * as React from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Icon } from '../../components/icon';
import { AliadoAvatar } from '../../components/aliado-avatar';
import { useAppStore } from '../../lib/store';
import {
  containsCrisisKeyword,
  CRISIS_RESOURCES,
  CRISIS_LEAD_TEXT,
} from '../../lib/crisis';

interface Msg {
  id: string;
  from: 'aliado' | 'me';
  text: string;
}

const QUICK = ['Estoy cansado', 'Tuve un mal dia', 'Me siento solo', 'Solo quiero hablar'];

export default function AliadoChat() {
  const settings = useAppStore((s) => s.settings);
  const profile = useAppStore((s) => s.profile);
  const [draft, setDraft] = React.useState('');
  const [crisis, setCrisis] = React.useState(false);
  const [msgs, setMsgs] = React.useState<Msg[]>([
    {
      id: '1',
      from: 'aliado',
      text: profile.name
        ? `Hola, ${profile.name}. Como va el dia?`
        : 'Hola. Como va el dia?',
    },
  ]);

  const send = () => {
    const t = draft.trim();
    if (!t) return;
    const myMsg: Msg = { id: String(Date.now()), from: 'me', text: t };
    setMsgs((m) => [...m, myMsg]);
    setDraft('');

    if (containsCrisisKeyword(t)) {
      setCrisis(true);
      return;
    }

    setTimeout(() => {
      setMsgs((m) => [
        ...m,
        {
          id: String(Date.now() + 1),
          from: 'aliado',
          text: 'Te escucho. Cuentame que ha pasado, sin filtros.',
        },
      ]);
    }, 600);
  };

  const callPhone = (phone: string) => {
    const clean = phone.replace(/\s+/g, '');
    Linking.openURL(`tel:${clean}`).catch(() => {});
  };

  return (
    <SafeAreaView className="flex-1 bg-bg dark:bg-dk-bg" edges={['top']}>
      <View className="flex-row items-center gap-3 border-b border-hairline px-6 py-3">
        <AliadoAvatar size={40} state="reposo" tone="warm" />
        <View className="flex-1">
          <Text className="text-base font-semibold text-ink dark:text-dk-ink">{settings.aliadoName}</Text>
          <Text className="text-xs text-ink-3">Aqui, sin juicio</Text>
        </View>
        <Pressable className="h-9 w-9 items-center justify-center rounded-full border border-hairline">
          <Icon name="Phone" size={16} color="#3F4854" />
        </Pressable>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 88 : 0}
        className="flex-1"
      >
        <ScrollView
          contentContainerStyle={{ padding: 20, gap: 10 }}
          showsVerticalScrollIndicator={false}
        >
          {msgs.map((m) => (
            <View
              key={m.id}
              className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                m.from === 'me'
                  ? 'self-end bg-primary'
                  : 'self-start border border-hairline bg-surface dark:bg-dk-surface'
              }`}
            >
              <Text
                className={
                  m.from === 'me'
                    ? 'text-base text-white'
                    : 'text-base text-ink dark:text-dk-ink'
                }
              >
                {m.text}
              </Text>
            </View>
          ))}

          {crisis ? (
            <View className="mt-2 rounded-3xl border border-warm/30 bg-warm/5 p-5">
              <View className="flex-row items-center gap-2">
                <Icon name="LifeBuoy" size={20} color="#D97757" />
                <Text
                  className="text-base text-ink dark:text-dk-ink"
                  style={{ fontFamily: 'Fraunces_500Medium' }}
                >
                  Esto es mas grande que un chat
                </Text>
              </View>
              <Text className="mt-2 text-sm leading-relaxed text-ink-2">
                {CRISIS_LEAD_TEXT}
              </Text>
              <View className="mt-4 gap-2">
                {CRISIS_RESOURCES.map((r) => (
                  <Pressable
                    key={r.phone}
                    onPress={() => callPhone(r.phone)}
                    className="flex-row items-center gap-3 rounded-2xl border border-hairline bg-surface p-3 dark:bg-dk-surface"
                  >
                    <View className="h-10 w-10 items-center justify-center rounded-xl bg-warm/10">
                      <Icon name="Phone" size={18} color="#D97757" />
                    </View>
                    <View className="flex-1">
                      <Text className="text-sm font-semibold text-ink dark:text-dk-ink">
                        {r.name}
                      </Text>
                      <Text className="text-xs text-ink-3">{r.detail}</Text>
                    </View>
                    <Text className="text-base font-semibold text-primary">{r.phone}</Text>
                  </Pressable>
                ))}
              </View>
              <Pressable
                onPress={() => setCrisis(false)}
                className="mt-4 self-start rounded-full border border-hairline px-4 py-2"
              >
                <Text className="text-xs text-ink-2">Sigo aqui, dame un minuto</Text>
              </Pressable>
            </View>
          ) : null}
        </ScrollView>

        {/* Quick replies */}
        {!crisis ? (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 16, gap: 8, paddingBottom: 8 }}
          >
            {QUICK.map((q) => (
              <Pressable
                key={q}
                onPress={() => setDraft(q)}
                className="rounded-full border border-hairline bg-surface px-4 py-2 dark:bg-dk-surface"
              >
                <Text className="text-sm text-ink dark:text-dk-ink">{q}</Text>
              </Pressable>
            ))}
          </ScrollView>
        ) : null}

        {/* Input */}
        <View className="flex-row items-center gap-2 border-t border-hairline px-4 py-3">
          <Pressable className="h-11 w-11 items-center justify-center rounded-full bg-bg">
            <Icon name="Mic" size={20} color="#3F4854" />
          </Pressable>
          <TextInput
            value={draft}
            onChangeText={setDraft}
            placeholder="Escribe a tu aliado..."
            placeholderTextColor="#9CA3AF"
            multiline
            className="flex-1 rounded-2xl bg-bg px-4 py-3 text-base text-ink"
          />
          <Pressable
            onPress={send}
            className="h-11 w-11 items-center justify-center rounded-full bg-primary"
          >
            <Icon name="ArrowUp" size={20} color="#fff" />
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
