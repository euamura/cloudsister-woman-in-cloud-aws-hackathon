import { Redirect, useRouter } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { AppText, Button, Mascot, Screen } from '@/components';
import { useAuthStore } from '@/store/useAuthStore';
import { useJornadaStore } from '@/store/useJornadaStore';
import { spacing } from '@/theme';

// 1. Splash / Boas-vindas
export default function BoasVindas() {
  const router = useRouter();
  const temSessao = useAuthStore((s) => s.currentUserId !== null || s.isGuest);
  const temTrilha = useJornadaStore((s) => s.trilhaConfirmada && s.trilhaAtiva !== null);

  // Quem já tem sessão vai direto para a trilha (ou para a pergunta-chave).
  if (temSessao) return <Redirect href={temTrilha ? '/home' : '/pergunta-chave'} />;

  return (
    <Screen scroll={false} semHeader>
      <View style={styles.topo}>
        <Mascot mood="animado" size={200} />
        <AppText variant="display" color="primaryDark" align="center" accessibilityRole="header">
          CloudSister
        </AppText>
        <AppText variant="subtitulo" color="textMuted" align="center">
          Aprenda cloud em poucos minutos por dia e construa sua carreira na nuvem.
        </AppText>
      </View>

      <View style={styles.acoes}>
        <Button title="Começar" onPress={() => router.push('/escolha-acesso')} />
        <Button title="Já tenho conta" variant="secondary" onPress={() => router.push('/login')} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  topo: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: spacing.lg },
  acoes: { gap: spacing.md },
});
