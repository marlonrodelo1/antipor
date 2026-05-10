import * as React from 'react';
import {
  View,
  Text,
  Pressable,
  TextInput,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system';
import { Icon, type IconName } from '../../components/icon';
import { supabase } from '../../lib/supabase';

type Kind = 'foto' | 'audio' | 'frase' | null;

interface Option {
  id: Exclude<Kind, null>;
  icon: IconName;
  title: string;
  desc: string;
}

const OPTIONS: Option[] = [
  { id: 'foto', icon: 'Camera', title: 'Foto', desc: 'Algo que te recuerde quien eres.' },
  { id: 'audio', icon: 'Mic', title: 'Audio', desc: 'La voz de alguien que te importa.' },
  { id: 'frase', icon: 'PenTool', title: 'Frase', desc: 'Tu propio recordatorio.' },
];

const MAX_AUDIO_SEC = 60;
const STORAGE_BUCKET = 'anchors';

function uuid(): string {
  // RFC4122 v4 ligero, sin dependencias.
  const hex = '0123456789abcdef';
  let s = '';
  for (let i = 0; i < 32; i++) {
    let r = (Math.random() * 16) | 0;
    if (i === 12) r = 4;
    if (i === 16) r = (r & 0x3) | 0x8;
    s += hex[r];
    if (i === 7 || i === 11 || i === 15 || i === 19) s += '-';
  }
  return s;
}

export default function NuevaAncla() {
  const [kind, setKind] = React.useState<Kind>(null);
  const [text, setText] = React.useState('');
  const [busy, setBusy] = React.useState(false);
  const [status, setStatus] = React.useState<string | null>(null);

  // Audio
  const recordingRef = React.useRef<Audio.Recording | null>(null);
  const [isRecording, setIsRecording] = React.useState(false);
  const [recordedUri, setRecordedUri] = React.useState<string | null>(null);
  const [seconds, setSeconds] = React.useState(0);
  const tickRef = React.useRef<ReturnType<typeof setInterval> | null>(null);

  // Photo
  const [photoUri, setPhotoUri] = React.useState<string | null>(null);

  React.useEffect(() => {
    return () => {
      if (tickRef.current) clearInterval(tickRef.current);
      recordingRef.current?.stopAndUnloadAsync().catch(() => {});
    };
  }, []);

  // ------------------------------------------------------------------
  // Helpers comunes
  // ------------------------------------------------------------------

  async function getUserId(): Promise<string | null> {
    const { data } = await supabase.auth.getUser();
    return data.user?.id ?? null;
  }

  async function uploadFile(
    localUri: string,
    storagePath: string,
    contentType: string
  ): Promise<string> {
    // Leer como base64 y convertir a ArrayBuffer para el cliente JS de Supabase.
    const base64 = await FileSystem.readAsStringAsync(localUri, {
      encoding: FileSystem.EncodingType.Base64,
    });
    const bytes = decodeBase64(base64);

    const { error } = await supabase.storage
      .from(STORAGE_BUCKET)
      .upload(storagePath, bytes, {
        contentType,
        upsert: false,
      });
    if (error) throw error;
    return storagePath;
  }

  async function insertAnchorRow(payload: {
    kind: 'photo' | 'audio' | 'text';
    contentUrl?: string | null;
    contentText?: string | null;
  }): Promise<void> {
    const uid = await getUserId();
    if (!uid) throw new Error('Sin sesion. Vuelve a entrar.');
    const { error } = await supabase.from('anchors').insert({
      user_id: uid,
      kind: payload.kind,
      content_url: payload.contentUrl ?? null,
      content_text: payload.contentText ?? null,
    });
    if (error) throw error;
  }

  function fail(msg: string) {
    setBusy(false);
    setStatus(null);
    Alert.alert('No se pudo guardar', msg);
  }

  // ------------------------------------------------------------------
  // Foto
  // ------------------------------------------------------------------

  async function pickPhoto(source: 'camera' | 'library') {
    try {
      const perm =
        source === 'camera'
          ? await ImagePicker.requestCameraPermissionsAsync()
          : await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!perm.granted) {
        Alert.alert(
          'Permiso necesario',
          source === 'camera'
            ? 'Activa el permiso de camara desde los ajustes del telefono.'
            : 'Activa el permiso de galeria desde los ajustes del telefono.'
        );
        return;
      }
      const result =
        source === 'camera'
          ? await ImagePicker.launchCameraAsync({
              quality: 0.8,
              allowsEditing: false,
              mediaTypes: ImagePicker.MediaTypeOptions.Images,
            })
          : await ImagePicker.launchImageLibraryAsync({
              quality: 0.8,
              allowsEditing: false,
              mediaTypes: ImagePicker.MediaTypeOptions.Images,
            });
      if (result.canceled) return;
      const asset = result.assets?.[0];
      if (!asset?.uri) return;
      setPhotoUri(asset.uri);
    } catch (e) {
      Alert.alert('Algo fallo', 'No pude abrir la camara o la galeria. Intenta de nuevo.');
    }
  }

  async function savePhoto() {
    if (!photoUri) return;
    setBusy(true);
    setStatus('Subiendo foto...');
    try {
      const uid = await getUserId();
      if (!uid) {
        fail('Sin sesion. Vuelve a entrar.');
        return;
      }
      const path = `${uid}/${uuid()}.jpg`;
      const stored = await uploadFile(photoUri, path, 'image/jpeg');
      await insertAnchorRow({ kind: 'photo', contentUrl: stored });
      setBusy(false);
      router.back();
    } catch (e) {
      fail(e instanceof Error ? e.message : 'Error al subir la foto.');
    }
  }

  // ------------------------------------------------------------------
  // Audio
  // ------------------------------------------------------------------

  async function startRecording() {
    try {
      const perm = await Audio.requestPermissionsAsync();
      if (!perm.granted) {
        Alert.alert(
          'Permiso necesario',
          'Activa el permiso de microfono desde los ajustes del telefono.'
        );
        return;
      }
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });
      const rec = new Audio.Recording();
      await rec.prepareToRecordAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY);
      await rec.startAsync();
      recordingRef.current = rec;
      setIsRecording(true);
      setSeconds(0);
      setRecordedUri(null);
      tickRef.current = setInterval(() => {
        setSeconds((s) => {
          const next = s + 1;
          if (next >= MAX_AUDIO_SEC) {
            stopRecording().catch(() => {});
          }
          return next;
        });
      }, 1000);
    } catch (e) {
      Alert.alert('No pude grabar', 'Hubo un problema con el microfono. Intenta de nuevo.');
    }
  }

  async function stopRecording() {
    const rec = recordingRef.current;
    if (!rec) return;
    if (tickRef.current) {
      clearInterval(tickRef.current);
      tickRef.current = null;
    }
    setIsRecording(false);
    try {
      await rec.stopAndUnloadAsync();
      const uri = rec.getURI();
      recordingRef.current = null;
      if (uri) setRecordedUri(uri);
    } catch {
      // ya parado
    }
  }

  async function saveAudio() {
    if (!recordedUri) return;
    setBusy(true);
    setStatus('Subiendo audio...');
    try {
      const uid = await getUserId();
      if (!uid) {
        fail('Sin sesion. Vuelve a entrar.');
        return;
      }
      const ext = recordedUri.endsWith('.m4a') ? 'm4a' : 'caf';
      const path = `${uid}/${uuid()}.${ext}`;
      const contentType = ext === 'm4a' ? 'audio/m4a' : 'audio/x-caf';
      const stored = await uploadFile(recordedUri, path, contentType);
      await insertAnchorRow({ kind: 'audio', contentUrl: stored });
      setBusy(false);
      router.back();
    } catch (e) {
      fail(e instanceof Error ? e.message : 'Error al subir el audio.');
    }
  }

  // ------------------------------------------------------------------
  // Texto
  // ------------------------------------------------------------------

  async function saveText() {
    const trimmed = text.trim();
    if (!trimmed) return;
    setBusy(true);
    setStatus('Guardando...');
    try {
      await insertAnchorRow({ kind: 'text', contentText: trimmed });
      setBusy(false);
      router.back();
    } catch (e) {
      fail(e instanceof Error ? e.message : 'No pude guardar tu frase.');
    }
  }

  // ------------------------------------------------------------------
  // Render
  // ------------------------------------------------------------------

  return (
    <SafeAreaView className="flex-1 bg-bg dark:bg-dk-bg" edges={['top']}>
      <View className="flex-row items-center justify-between px-6 py-3">
        <Pressable onPress={() => router.back()} className="h-10 w-10 items-center justify-center">
          <Icon name="X" size={22} color="#3F4854" />
        </Pressable>
        <Text className="text-base font-semibold text-ink dark:text-dk-ink">Nueva ancla</Text>
        <View className="w-10" />
      </View>

      <View className="flex-1 px-6 pt-2">
        {kind === null ? (
          <>
            <Text
              className="text-3xl leading-tight text-ink dark:text-dk-ink"
              style={{ fontFamily: 'Fraunces_500Medium' }}
            >
              Que tipo de <Text style={{ fontStyle: 'italic' }}>ancla?</Text>
            </Text>
            <Text className="mt-2 text-sm text-ink-2">
              Elige como quieres guardar este recordatorio.
            </Text>
            <View className="mt-6 gap-3">
              {OPTIONS.map((o) => (
                <Pressable
                  key={o.id}
                  onPress={() => setKind(o.id)}
                  className="flex-row items-center gap-4 rounded-3xl border border-hairline bg-surface p-5 dark:bg-dk-surface"
                >
                  <View className="h-12 w-12 items-center justify-center rounded-2xl bg-primary/10">
                    <Icon name={o.icon} size={22} color="#3B6EA8" />
                  </View>
                  <View className="flex-1">
                    <Text className="text-base font-semibold text-ink dark:text-dk-ink">{o.title}</Text>
                    <Text className="mt-0.5 text-xs text-ink-3">{o.desc}</Text>
                  </View>
                  <Icon name="ChevronRight" size={18} color="#9CA3AF" />
                </Pressable>
              ))}
            </View>
          </>
        ) : kind === 'frase' ? (
          <>
            <Text
              className="text-2xl text-ink dark:text-dk-ink"
              style={{ fontFamily: 'Fraunces_500Medium' }}
            >
              Escribe tu frase
            </Text>
            <TextInput
              value={text}
              onChangeText={setText}
              multiline
              editable={!busy}
              placeholder="Algo que necesites oir cuando flaquees..."
              placeholderTextColor="#9CA3AF"
              className="mt-4 min-h-[160px] rounded-2xl border border-hairlineStrong bg-surface p-4 text-base text-ink dark:bg-dk-surface dark:text-dk-ink"
              textAlignVertical="top"
            />
            <View className="mt-auto pb-6">
              <Pressable
                onPress={saveText}
                disabled={busy || text.trim().length === 0}
                className={`h-14 flex-row items-center justify-center gap-2 rounded-full ${
                  text.trim().length > 0 && !busy ? 'bg-primary' : 'bg-hairlineStrong'
                }`}
              >
                {busy ? <ActivityIndicator color="#fff" /> : null}
                <Text className="text-base font-semibold text-white">
                  {busy ? status ?? 'Guardando...' : 'Guardar'}
                </Text>
              </Pressable>
            </View>
          </>
        ) : kind === 'foto' ? (
          <>
            <Text
              className="text-2xl text-ink dark:text-dk-ink"
              style={{ fontFamily: 'Fraunces_500Medium' }}
            >
              {photoUri ? 'Lista para guardar' : 'Elige una foto'}
            </Text>
            <Text className="mt-2 text-sm text-ink-2">
              Una imagen que te ate a lo que importa.
            </Text>

            {photoUri ? (
              <View className="mt-6 items-center">
                <View className="h-56 w-56 items-center justify-center overflow-hidden rounded-3xl border border-hairline bg-surface dark:bg-dk-surface">
                  <Icon name="Image" size={48} color="#3B6EA8" />
                </View>
                <Text className="mt-3 text-xs text-ink-3">Vista previa lista</Text>
                <Pressable
                  onPress={() => setPhotoUri(null)}
                  className="mt-2 px-3 py-2"
                  disabled={busy}
                >
                  <Text className="text-sm text-ink-2">Elegir otra</Text>
                </Pressable>
              </View>
            ) : (
              <View className="mt-6 gap-3">
                <Pressable
                  onPress={() => pickPhoto('camera')}
                  disabled={busy}
                  className="flex-row items-center gap-3 rounded-2xl border border-hairline bg-surface p-4 dark:bg-dk-surface"
                >
                  <View className="h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                    <Icon name="Camera" size={20} color="#3B6EA8" />
                  </View>
                  <Text className="text-base text-ink dark:text-dk-ink">Tomar foto ahora</Text>
                </Pressable>
                <Pressable
                  onPress={() => pickPhoto('library')}
                  disabled={busy}
                  className="flex-row items-center gap-3 rounded-2xl border border-hairline bg-surface p-4 dark:bg-dk-surface"
                >
                  <View className="h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                    <Icon name="Image" size={20} color="#3B6EA8" />
                  </View>
                  <Text className="text-base text-ink dark:text-dk-ink">Elegir de la galeria</Text>
                </Pressable>
              </View>
            )}

            <View className="mt-auto pb-6">
              <Pressable
                onPress={savePhoto}
                disabled={!photoUri || busy}
                className={`h-14 flex-row items-center justify-center gap-2 rounded-full ${
                  photoUri && !busy ? 'bg-primary' : 'bg-hairlineStrong'
                }`}
              >
                {busy ? <ActivityIndicator color="#fff" /> : null}
                <Text className="text-base font-semibold text-white">
                  {busy ? status ?? 'Subiendo...' : 'Guardar'}
                </Text>
              </Pressable>
            </View>
          </>
        ) : (
          // audio
          <>
            <Text
              className="text-2xl text-ink dark:text-dk-ink"
              style={{ fontFamily: 'Fraunces_500Medium' }}
            >
              {recordedUri ? 'Audio listo' : isRecording ? 'Grabando...' : 'Graba un audio'}
            </Text>
            <Text className="mt-2 text-sm text-ink-2">
              Maximo {MAX_AUDIO_SEC} segundos. Algo breve que te recuerde por que.
            </Text>

            <View className="mt-10 items-center">
              <View
                className={`h-32 w-32 items-center justify-center rounded-full ${
                  isRecording ? 'bg-warm/15' : 'bg-primary/10'
                }`}
              >
                <Icon
                  name="Mic"
                  size={48}
                  color={isRecording ? '#D97757' : '#3B6EA8'}
                />
              </View>
              <Text
                className="mt-4 text-3xl text-ink dark:text-dk-ink"
                style={{ fontFamily: 'Fraunces_500Medium' }}
              >
                {String(Math.floor(seconds / 60)).padStart(2, '0')}:
                {String(seconds % 60).padStart(2, '0')}
              </Text>
              {!recordedUri ? (
                <Pressable
                  onPress={isRecording ? stopRecording : startRecording}
                  disabled={busy}
                  className={`mt-6 rounded-full px-6 py-3 ${
                    isRecording ? 'bg-warm' : 'bg-primary'
                  }`}
                >
                  <Text className="text-sm font-semibold text-white">
                    {isRecording ? 'Detener' : 'Empezar a grabar'}
                  </Text>
                </Pressable>
              ) : (
                <Pressable
                  onPress={() => {
                    setRecordedUri(null);
                    setSeconds(0);
                  }}
                  disabled={busy}
                  className="mt-6 rounded-full border border-hairline px-6 py-3"
                >
                  <Text className="text-sm text-ink-2">Grabar de nuevo</Text>
                </Pressable>
              )}
            </View>

            <View className="mt-auto pb-6">
              <Pressable
                onPress={saveAudio}
                disabled={!recordedUri || busy}
                className={`h-14 flex-row items-center justify-center gap-2 rounded-full ${
                  recordedUri && !busy ? 'bg-primary' : 'bg-hairlineStrong'
                }`}
              >
                {busy ? <ActivityIndicator color="#fff" /> : null}
                <Text className="text-base font-semibold text-white">
                  {busy ? status ?? 'Subiendo...' : 'Guardar'}
                </Text>
              </Pressable>
            </View>
          </>
        )}
      </View>
    </SafeAreaView>
  );
}

// ---------------------------------------------------------------------
// base64 -> Uint8Array sin dependencias.
// ---------------------------------------------------------------------
function decodeBase64(b64: string): Uint8Array {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
  const lookup = new Uint8Array(256);
  for (let i = 0; i < chars.length; i++) lookup[chars.charCodeAt(i)] = i;

  let bufferLength = (b64.length * 3) / 4;
  if (b64.endsWith('==')) bufferLength -= 2;
  else if (b64.endsWith('=')) bufferLength -= 1;

  const bytes = new Uint8Array(bufferLength);
  let p = 0;
  for (let i = 0; i < b64.length; i += 4) {
    const e1 = lookup[b64.charCodeAt(i)] ?? 0;
    const e2 = lookup[b64.charCodeAt(i + 1)] ?? 0;
    const e3 = lookup[b64.charCodeAt(i + 2)] ?? 0;
    const e4 = lookup[b64.charCodeAt(i + 3)] ?? 0;
    bytes[p++] = (e1 << 2) | (e2 >> 4);
    if (p < bufferLength) bytes[p++] = ((e2 & 15) << 4) | (e3 >> 2);
    if (p < bufferLength) bytes[p++] = ((e3 & 3) << 6) | (e4 & 63);
  }
  return bytes;
}
