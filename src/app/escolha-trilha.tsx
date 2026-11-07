import { useRouter } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { AppText, Button, Screen } from '@/components';
import { CARREIRAS, ORDEM_TRILHAS } from '@/lib/carreiras';
import type { TrilhaId } from '@/lib/recommendation';
import { useJornadaStore } from '@/store/useJornadaStore';
import { colors, radius, spacing } from '@/theme';

// 3. "Sim, já sei": escolha direta da carreira.
export default function EscolhaTrilha() {
  const router = useRouter();
  const escolherTrilha = useJornadaStore((s) => s.escolherTrilha);

  const escolher = (id: TrilhaId) => {
    escolherTrilha(id);
    router.replace('/resultado');
  };

  return (
    <Screen>
      <AppText variant="titulo" accessibilityRole="header">
        Qual carreira te chama mais?
      </AppText>
      {ORDEM_TRILHAS.map((id) => {
        const c = CARREIRAS[id];
        return (
          <View key={id} style={styles.card}>
            <AppText variant="subtitulo">{c.titulo}</AppText>
            <AppText color="textMuted">{c.rotina}</AppText>
            <AppText variant="rotulo">Salário médio: {c.salario}</AppText>
            <AppText variant="rotulo" color="textMuted">
              Habilidades: {c.habilidades.join(', ')}
            </AppText>
            <Button title="Escolher" onPress={() => escolher(id)} />
          </View>
        );
      })}
    </Screen>
  );
}

const styles = StyleSheet.create({
  card: {
    gap: spacing.sm,
    padding: spacing.xl,
    backgroundColor: colors.bg,
    borderRadius: radius.lg,
    borderWidth: 2,
    borderColor: colors.border,
  },
});
