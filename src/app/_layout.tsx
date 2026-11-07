import { useFonts } from '@expo-google-fonts/nunito/useFonts';
import { Nunito_400Regular } from '@expo-google-fonts/nunito/400Regular';
import { Nunito_600SemiBold } from '@expo-google-fonts/nunito/600SemiBold';
import { Nunito_700Bold } from '@expo-google-fonts/nunito/700Bold';
import { Nunito_800ExtraBold } from '@expo-google-fonts/nunito/800ExtraBold';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { useAuthStore } from '@/store/useAuthStore';
import { useAuthHydrated } from '@/store/useHydrated';
import { colors, fontFamily } from '@/theme';

void SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontesCarregadas] = useFonts({
    Nunito_400Regular,
    Nunito_600SemiBold,
    Nunito_700Bold,
    Nunito_800ExtraBold,
  });
  const hidratado = useAuthHydrated();
  const seedUsers = useAuthStore((s) => s.seedUsers);

  useEffect(() => {
    if (hidratado) void seedUsers();
  }, [hidratado, seedUsers]);

  const pronto = fontesCarregadas && hidratado;

  useEffect(() => {
    if (pronto) void SplashScreen.hideAsync();
  }, [pronto]);

  if (!pronto) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: colors.bgSoft },
          headerShadowVisible: false,
          headerTintColor: colors.primaryDark,
          headerTitleStyle: { fontFamily: fontFamily.extrabold, color: colors.text },
          headerBackButtonDisplayMode: 'minimal',
          contentStyle: { backgroundColor: colors.bgSoft },
        }}
      >
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="escolha-acesso" options={{ title: 'Vamos começar' }} />
        <Stack.Screen name="cadastro" options={{ title: 'Criar conta' }} />
        <Stack.Screen name="login" options={{ title: 'Entrar' }} />
        <Stack.Screen name="perfil-identificado" options={{ headerShown: false, gestureEnabled: false }} />
        <Stack.Screen name="escolha-trilha" options={{ title: 'Escolha sua trilha' }} />
        <Stack.Screen name="questionario" options={{ title: 'Descubra sua trilha' }} />
        <Stack.Screen name="resultado" options={{ headerShown: false }} />
        <Stack.Screen name="home" options={{ headerShown: false, gestureEnabled: false }} />
        <Stack.Screen name="pilula/[id]" options={{ title: 'Pílula' }} />
        <Stack.Screen name="resultado-pilula" options={{ headerShown: false, gestureEnabled: false }} />
        <Stack.Screen
          name="pergunta-chave"
          options={{ headerShown: false, gestureEnabled: false }}
        />
      </Stack>
    </GestureHandlerRootView>
  );
}
