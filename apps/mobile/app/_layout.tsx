import '../global.css';
import * as React from 'react';
import { Stack } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts } from 'expo-font';
import {
  Fraunces_400Regular,
  Fraunces_500Medium,
  Fraunces_600SemiBold,
} from '@expo-google-fonts/fraunces';
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
} from '@expo-google-fonts/inter';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme, View } from 'react-native';
import { useAppStore } from '../lib/store';

SplashScreen.preventAutoHideAsync().catch(() => {});

export default function RootLayout() {
  const scheme = useColorScheme();
  const markHydrated = useAppStore((s) => s.markHydrated);

  const [loaded, fontError] = useFonts({
    Fraunces_400Regular,
    Fraunces_500Medium,
    Fraunces_600SemiBold,
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  React.useEffect(() => {
    if (loaded || fontError) {
      markHydrated();
      SplashScreen.hideAsync().catch(() => {});
    }
  }, [loaded, fontError, markHydrated]);

  if (!loaded && !fontError) return null;

  const dark = scheme === 'dark';

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={{ flex: 1, backgroundColor: dark ? '#0F1419' : '#F7F5F2' }}>
        <StatusBar style={dark ? 'light' : 'dark'} />
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: dark ? '#0F1419' : '#F7F5F2' },
            animation: 'fade',
          }}
        >
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="onboarding" />
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="anclas" />
          <Stack.Screen
            name="intervencion"
            options={{ presentation: 'fullScreenModal', animation: 'fade' }}
          />
          <Stack.Screen
            name="intervencion-friccion"
            options={{ presentation: 'card' }}
          />
          <Stack.Screen
            name="urge-surfing"
            options={{ presentation: 'fullScreenModal', animation: 'fade' }}
          />
        </Stack>
      </View>
    </GestureHandlerRootView>
  );
}
