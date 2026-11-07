import { Pressable, StyleSheet, View } from 'react-native';

import { colors, radius, spacing } from '@/theme';

import { AppText } from './AppText';

interface OptionCardProps {
  titulo: string;
  descricao?: string;
  selecionado: boolean;
  onPress: () => void;
}

// Cartão de seleção única (radio) reutilizável em cadastro, questionário e rotina.
export function OptionCard({ titulo, descricao, selecionado, onPress }: OptionCardProps) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="radio"
      accessibilityLabel={descricao ? `${titulo}. ${descricao}` : titulo}
      accessibilityState={{ selected: selecionado }}
      style={[styles.card, selecionado && styles.ativo]}
    >
      <View style={[styles.marcador, selecionado && styles.marcadorAtivo]}>
        {selecionado && <View style={styles.miolo} />}
      </View>
      <View style={styles.textos}>
        <AppText variant="corpoBold">{titulo}</AppText>
        {!!descricao && (
          <AppText variant="legenda" color="textMuted">
            {descricao}
          </AppText>
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    minHeight: 56,
    padding: spacing.lg,
    backgroundColor: colors.bg,
    borderWidth: 2,
    borderColor: colors.border,
    borderRadius: radius.md,
  },
  ativo: { borderColor: colors.primaryDark, backgroundColor: colors.bgSoft },
  marcador: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.borderStrong,
    alignItems: 'center',
    justifyContent: 'center',
  },
  marcadorAtivo: { borderColor: colors.primaryDark },
  miolo: { width: 12, height: 12, borderRadius: 6, backgroundColor: colors.primaryDark },
  textos: { flex: 1 },
});
