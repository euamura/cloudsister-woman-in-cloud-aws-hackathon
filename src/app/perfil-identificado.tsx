import { Redirect, useRouter } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { AppText, Avatar, Button, Mascot, Screen } from '@/components';
import { TEXTOS_PERFIL } from '@/lib/perfil';
import { useUsuariaAtual } from '@/store/useAuthStore';
import { colors, radius, spacing } from '@/theme';

// Depois do cadastro: mostra o perfil identificado e o que muda na experiência.
export default function PerfilIdentificado() {
  const router = useRouter();
  const usuaria = useUsuariaAtual();

  if (!usuaria) return <Redirect href="/" />;
  const textos = TEXTOS_PERFIL[usuaria.perfil];
  const competencias = usuaria.competenciasTransferiveis ?? [];
  const mostrarCompetencias = usuaria.perfil === 'transicao' && competencias.length > 0;

  return (
    <Screen semHeader>
      <View style={styles.topo}>
        <View style={styles.linha}>
          <Avatar avatarId={usuaria.avatarId} size={56} />
          <Mascot mood="animado" size={100} />
        </View>
        <AppText variant="rotulo" color="textMuted">
          Conta criada, {usuaria.nome}! Seu perfil é
        </AppText>
        <AppText variant="titulo" color="primaryDark" align="center" accessibilityRole="header">
          {textos.nome}
        </AppText>
      </View>

      <View style={styles.card}>
        <AppText>{textos.descricao}</AppText>
      </View>

      {mostrarCompetencias && (
        <View style={[styles.card, styles.cardRosa]}>
          <AppText variant="subtitulo">Você já traz para cloud</AppText>
          {competencias.map((c) => (
            <AppText key={c} variant="corpoBold">✓ {c}</AppText>
          ))}
        </View>
      )}

      <View style={styles.card}>
        <AppText variant="corpoBold">O que muda para você</AppText>
        <AppText color="textMuted">{textos.oQueMuda}</AppText>
      </View>

      <Button title="Continuar" onPress={() => router.replace('/pergunta-chave')} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  topo: { alignItems: 'center', gap: spacing.sm },
  linha: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  card: {
    gap: spacing.sm,
    padding: spacing.xl,
    backgroundColor: colors.bg,
    borderRadius: radius.lg,
    borderWidth: 2,
    borderColor: colors.border,
  },
  cardRosa: { backgroundColor: colors.pinkLight, borderColor: colors.pinkLight },
});
