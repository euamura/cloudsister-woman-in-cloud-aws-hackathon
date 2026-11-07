import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';

import { AppText, Button, Mascot, Screen } from '@/components';
import { useAuthStore } from '@/store/useAuthStore';
import { colors, radius, spacing } from '@/theme';

// 2. Modo convidada OU cadastro
export default function EscolhaAcesso() {
  const router = useRouter();
  const continueAsGuest = useAuthStore((s) => s.continueAsGuest);

  const entrarComoConvidada = () => {
    continueAsGuest();
    router.replace('/pergunta-chave');
  };

  return (
    <Screen>
      <View style={styles.topo}>
        <Mascot mood="feliz" size={120} />
        <AppText variant="titulo" align="center" accessibilityRole="header">
          Como você quer entrar?
        </AppText>
      </View>

      <View style={styles.card}>
        <AppText variant="subtitulo">Criar minha conta</AppText>
        <AppText color="textMuted">
          Salve seu progresso, mantenha sua ofensiva e desbloqueie recompensas.
        </AppText>
        <Button title="Criar conta" onPress={() => router.push('/cadastro')} />
      </View>

      <View style={styles.card}>
        <AppText variant="subtitulo">Explorar como convidada</AppText>
        <AppText color="textMuted">
          Faça o questionário e a primeira pílula sem cadastro. Depois, é só criar a conta para
          guardar tudo.
        </AppText>
        <Button
          title="Continuar como convidada"
          variant="secondary"
          onPress={entrarComoConvidada}
        />
      </View>

      <Pressable
        onPress={() => router.push('/login')}
        accessibilityRole="link"
        accessibilityLabel="Já tenho conta, entrar"
        style={styles.link}
      >
        <AppText variant="corpoBold" color="primaryDark">
          Já tenho conta
        </AppText>
      </Pressable>
    </Screen>
  );
}

const styles = StyleSheet.create({
  topo: { alignItems: 'center', gap: spacing.md },
  card: {
    gap: spacing.md,
    padding: spacing.xl,
    backgroundColor: colors.bg,
    borderRadius: radius.lg,
    borderWidth: 2,
    borderColor: colors.border,
  },
  link: { minHeight: 44, alignItems: 'center', justifyContent: 'center' },
});
