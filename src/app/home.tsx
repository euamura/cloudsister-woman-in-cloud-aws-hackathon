import { Redirect, useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { AppText, Avatar, Button, Mascot, ProgressBar, Screen } from '@/components';
import { convidadaPrecisaCriarConta } from '@/lib/convidada';
import { montarMapa, type ItemMapa } from '@/lib/mapa';
import { TRILHAS } from '@/lib/trilhas';
import { useAuthStore, useUsuariaAtual } from '@/store/useAuthStore';
import { useJornadaStore } from '@/store/useJornadaStore';
import { useProgressoStore } from '@/store/useProgressoStore';
import { colors, radius, spacing } from '@/theme';

// Deslocamento horizontal de cada nó: forma o caminho em zigue-zague.
const ZIGUEZAGUE = [0, 64, 0, -64];
const SEM_CONCLUIDAS: string[] = [];

// 6. Dashboard: trilha ativa, streak, XP, meta do dia e mapa da trilha.
export default function Home() {
  const router = useRouter();
  const usuaria = useUsuariaAtual();
  const logout = useAuthStore((s) => s.logout);
  const pedirConta = useAuthStore((s) => s.isGuest && convidadaPrecisaCriarConta(s.progressoConvidada));
  const trilhaId = useJornadaStore((s) => s.trilhaAtiva);
  const { xp, streak } = useProgressoStore();
  const concluidas = useProgressoStore((s) =>
    trilhaId ? (s.concluidas[trilhaId] ?? SEM_CONCLUIDAS) : SEM_CONCLUIDAS,
  );
  const [aviso, setAviso] = useState<string | undefined>();

  if (!trilhaId) return <Redirect href="/pergunta-chave" />;

  const trilha = TRILHAS[trilhaId];
  const ids = trilha.pilulas.map((p) => p.id);
  const mapa = montarMapa(ids, concluidas);
  const feitas = concluidas.length;
  const metaCumprida = feitas > 0;

  const tocarPilula = (item: Extract<ItemMapa, { tipo: 'pilula' }>) => {
    if (item.estado === 'bloqueada') {
      setAviso('🔒 Conclua a pílula anterior para liberar esta.');
      return;
    }
    // Convidada faz só a 1ª pílula; depois disso, pedimos a conta.
    if (pedirConta) {
      setAviso('💜 Crie sua conta para salvar seu progresso e continuar a trilha.');
      router.push('/cadastro');
      return;
    }
    setAviso(undefined);
    router.push(`/pilula/${item.id}`);
  };

  const sair = () => {
    logout();
    router.replace('/');
  };

  return (
    <Screen semHeader>
      {/* Cabeçalho: quem está estudando + streak + XP */}
      <View style={styles.cabecalho}>
        <View style={styles.linha}>
          {usuaria && <Avatar avatarId={usuaria.avatarId} size={44} />}
          <AppText variant="subtitulo" accessibilityRole="header">
            Oi, {usuaria?.nome ?? 'convidada'}!
          </AppText>
        </View>
        <View style={styles.linha}>
          <View style={[styles.chip, styles.chipStreak]} accessibilityLabel={`Ofensiva de ${streak} dias`}>
            <AppText variant="rotulo">🔥 {streak}</AppText>
          </View>
          <View style={styles.chip} accessibilityLabel={`${xp} pontos de experiência`}>
            <AppText variant="rotulo">⭐ {xp} XP</AppText>
          </View>
        </View>
      </View>

      {/* Trilha ativa + progresso */}
      <View style={styles.card}>
        <AppText variant="rotulo" color="textMuted">Sua trilha</AppText>
        <AppText variant="subtitulo">{trilha.titulo}</AppText>
        <ProgressBar
          valor={feitas / ids.length}
          cor={colors.success}
          rotulo={`${feitas} de ${ids.length} pílulas concluídas`}
        />
        <AppText variant="legenda" color="textMuted">
          {feitas} de {ids.length} pílulas concluídas
        </AppText>
      </View>

      {/* Meta do dia: pequena de propósito */}
      <View style={[styles.card, styles.meta]}>
        <AppText variant="corpoBold">
          {metaCumprida ? '✅ Meta de hoje cumprida!' : '🎯 Meta de hoje: 1 pílula'}
        </AppText>
        <AppText variant="legenda" color="textMuted">
          Poucos minutos por dia já fazem diferença.
        </AppText>
      </View>

      {/* Mapa da trilha em caminho vertical */}
      <View style={styles.mapa}>
        <Mascot mood="feliz" size={80} />
        {mapa.map((item, i) => {
          const deslocamento = { transform: [{ translateX: ZIGUEZAGUE[i % ZIGUEZAGUE.length] }] };

          if (item.tipo === 'bau') {
            return (
              <View
                key={item.id}
                style={[styles.bau, deslocamento]}
                accessible
                accessibilityLabel={item.aberto ? 'Baú de recompensa aberto' : 'Baú de recompensa, conclua as pílulas anteriores'}
              >
                <Text style={styles.emoji}>{item.aberto ? '🎉' : '🎁'}</Text>
              </View>
            );
          }

          const pilula = trilha.pilulas[item.indice];
          const simbolo =
            item.estado === 'concluida' ? '✓' : item.estado === 'bloqueada' ? '🔒' : String(item.indice + 1);
          const situacao =
            item.estado === 'concluida' ? 'concluída' : item.estado === 'bloqueada' ? 'bloqueada' : 'liberada';

          return (
            <View key={item.id} style={[styles.no, deslocamento]}>
              <View style={[styles.sombraNo, styles[`sombra_${item.estado}`]]}>
                <Pressable
                  onPress={() => tocarPilula(item)}
                  accessibilityRole="button"
                  accessibilityLabel={`Pílula ${item.indice + 1}: ${pilula.titulo}, ${situacao}`}
                  style={({ pressed }) => [
                    styles.circulo,
                    styles[`circulo_${item.estado}`],
                    pressed && item.estado !== 'bloqueada' && styles.pressionado,
                  ]}
                >
                  <Text style={[styles.simbolo, item.estado === 'bloqueada' && styles.simboloBloqueado]}>
                    {simbolo}
                  </Text>
                </Pressable>
              </View>
              <AppText variant="legenda" align="center" style={styles.rotuloNo}>
                {pilula.titulo}
              </AppText>
            </View>
          );
        })}
      </View>

      {!!aviso && (
        <View style={styles.aviso} accessibilityLiveRegion="polite">
          <AppText variant="rotulo">{aviso}</AppText>
        </View>
      )}

      <Button title="Trocar de trilha" variant="secondary" onPress={() => router.push('/pergunta-chave')} />
      <Button title={usuaria ? 'Sair da conta' : 'Voltar ao início'} variant="ghost" onPress={sair} />
    </Screen>
  );
}

const TAMANHO_NO = 76;

const styles = StyleSheet.create({
  cabecalho: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: spacing.sm },
  linha: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  chip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.pill,
    borderWidth: 2,
    borderColor: colors.border,
    backgroundColor: colors.bg,
  },
  chipStreak: { backgroundColor: colors.streakLight, borderColor: colors.streak },
  card: {
    gap: spacing.sm,
    padding: spacing.lg,
    backgroundColor: colors.bg,
    borderRadius: radius.lg,
    borderWidth: 2,
    borderColor: colors.border,
  },
  meta: { backgroundColor: colors.pinkLight, borderColor: colors.pinkLight },
  mapa: { alignItems: 'center', gap: spacing.xl, paddingVertical: spacing.lg },
  no: { alignItems: 'center', gap: spacing.sm, width: 160 },
  // A "sombra 3D" é um fundo mais escuro 6px abaixo do círculo.
  sombraNo: { width: TAMANHO_NO, height: TAMANHO_NO + 6, borderRadius: TAMANHO_NO / 2 },
  sombra_desbloqueada: { backgroundColor: colors.primaryShadow },
  sombra_concluida: { backgroundColor: colors.successText },
  sombra_bloqueada: { backgroundColor: '#D1D5DB' },
  circulo: {
    width: TAMANHO_NO,
    height: TAMANHO_NO,
    borderRadius: TAMANHO_NO / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  circulo_desbloqueada: { backgroundColor: colors.primaryDark },
  circulo_concluida: { backgroundColor: colors.success },
  circulo_bloqueada: { backgroundColor: '#E5E7EB' },
  pressionado: { transform: [{ translateY: 6 }] },
  simbolo: { fontSize: 28, fontWeight: '800', color: colors.white },
  simboloBloqueado: { color: '#4B5563' },
  rotuloNo: { maxWidth: 160 },
  bau: {
    width: 56,
    height: 56,
    borderRadius: radius.md,
    backgroundColor: colors.streakLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emoji: { fontSize: 28 },
  aviso: { padding: spacing.lg, backgroundColor: colors.pinkLight, borderRadius: radius.md },
});
