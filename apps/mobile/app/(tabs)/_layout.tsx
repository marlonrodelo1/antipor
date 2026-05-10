import * as React from 'react';
import { Tabs } from 'expo-router';
import { useColorScheme } from 'react-native';
import { Icon, type IconName } from '../../components/icon';
import { useAppStore } from '../../lib/store';
import { registerForPushNotifications } from '../../lib/push';

export default function TabsLayout() {
  const dark = useColorScheme() === 'dark';
  const inactive = dark ? '#A6ADB7' : '#6B7280';
  const active = '#3B6EA8';

  const notificationsEnabled = useAppStore((s) => s.settings.notifications);
  const registered = React.useRef(false);

  React.useEffect(() => {
    if (registered.current) return;
    if (!notificationsEnabled) return;
    registered.current = true;
    registerForPushNotifications().catch(() => {
      // fallar en silencio: el usuario puede reintentar en Ajustes
      registered.current = false;
    });
  }, [notificationsEnabled]);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: active,
        tabBarInactiveTintColor: inactive,
        tabBarLabelStyle: { fontSize: 10, fontWeight: '600', letterSpacing: 0.1 },
        tabBarStyle: {
          backgroundColor: dark ? 'rgba(15,20,25,0.95)' : 'rgba(255,255,255,0.95)',
          borderTopColor: dark ? 'rgba(255,255,255,0.08)' : 'rgba(28,33,40,0.08)',
          height: 76,
          paddingTop: 8,
          paddingBottom: 22,
        },
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'Hoy', tabBarIcon: tabIcon('House') }} />
      <Tabs.Screen name="diario" options={{ title: 'Diario', tabBarIcon: tabIcon('BookOpen') }} />
      <Tabs.Screen name="aliado" options={{ title: 'Aliado', tabBarIcon: tabIcon('MessageCircle') }} />
      <Tabs.Screen name="ajustes" options={{ title: 'Ajustes', tabBarIcon: tabIcon('Settings') }} />
    </Tabs>
  );
}

function tabIcon(name: IconName) {
  return ({ color, size }: { color: string; size: number }) => (
    <Icon name={name} size={size} color={color} strokeWidth={1.6} />
  );
}
