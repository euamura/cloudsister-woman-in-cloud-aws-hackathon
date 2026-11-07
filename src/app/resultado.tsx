import { Redirect, useRouter } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { AppText, Button, Mascot, ProgressBar, Screen } from '@/components';
import { CARREIRAS, outraTrilha, ORDEM_TRILHAS } from '@/lib/carreiras';
import { useJornadaStore } from '@/store/useJornadaStore';
import { colors, radius, spacing } from '@/theme';

// 4. Resultado: trilha, afinidade, dia típico e 3 primeiros passos.
export default function Resultado() {
  const { trilhaAtiva, resultado, escolherTrilha, confirmarTrilha } = useJornadaStore();
  const router = useRouter();

  const comecar = () => {
    confirmarTrilha();
    router.replace('/home');
  };

  if (!trilhaAtiva) return <Redirect href="/pergunta-chave" />;
  const carreira = CARREIRAS[trilhaAtiva];

  return (
    <Screen semHeader>
      <View style={styles.topo}>
        <Mascot mood="animado" size={110} />
        <AppText variant="rotulo" color="textMuted">
          {resultado ? 'Sua trilha recomendada' : 'Sua trilha escolhida'}
        </AppText>
        <AppText variant="titulo" color="primaryDark" align="center" accessibilityRole="header">
          {carreira.titulo}
        </AppText>
      </View>

      {resultado && (
        <View style={styles.card}>
          <AppText variant="subtitulo">Sua afinidade</AppText>
          {ORDEM_TRILHAS.map((id) => {
            const pct = id === 'cloud-architect' ? resultado.afinidade.architect : resultado.afinidade.security;
            return (
              <View key={id} style={styles.afinidade}>
                <AppText variant="rotulo">
                  {CARREIRAS[id].titulo}: {pct}%
                </AppText>
                <ProgressBar
                  valor={pct / 100}
                  rotulo={`Afinidade com ${CARREIRAS[id].titulo}: ${pct}%`}
                  cor={id === trilhaAtiva ? colors.primaryDark : colors.borderStrong}
                />
              </View>
            );
          })}
          {resultado.competenciasTransferiveis.length > 0 && (
            <AppText color="textMuted">
              Você já traz: {resultado.competenciasTransferiveis.join(', ')}.
            </AppText>
          )}
        </View>
      )}

      <View style={styles.card}>
        <AppText variant="subtitulo">Um dia típico</AppText>
        <AppText>{carreira.diaTipico}</AppText>
      </View>

      <View style={styles.card}>
        <AppText variant="subtitulo">Seus 3 primeiros passos</AppText>
        {carreira.primeirosPassos.map((p, i) => (
          <AppText key={p}>
            {i + 1}. {p}
          </AppText>
        ))}
      </View>

      <Button title="Começar esta trilha" onPress={comecar} />
      <Button
        title="Prefiro a outra"
        variant="secondary"
        onPress={() => escolherTrilha(outraTrilha(trilhaAtiva))}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  topo: { alignItems: 'center', gap: spacing.sm },
  card: {
    gap: spacing.sm,
    padding: spacing.xl,
    backgroundColor: colors.bg,
    borderRadius: radius.lg,
    borderWidth: 2,
    borderColor: colors.border,
  },
  afinidade: { gap: spacing.xs },
});
