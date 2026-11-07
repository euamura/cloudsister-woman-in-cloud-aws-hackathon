import { StyleSheet, View } from 'react-native';

import { colors, radius } from '@/theme';

interface ProgressBarProps {
  valor: number; // 0..1
  cor?: string;
  rotulo: string;
}

export function ProgressBar({ valor, cor = colors.primaryDark, rotulo }: ProgressBarProps) {
  const pct = Math.max(0, Math.min(1, valor)) * 100;
  return (
    <View
      accessibilityRole="progressbar"
      accessibilityLabel={rotulo}
      accessibilityValue={{ min: 0, max: 100, now: Math.round(pct) }}
      style={styles.trilho}
    >
      <View style={[styles.barra, { width: `${pct}%`, backgroundColor: cor }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  trilho: {
    height: 14,
    borderRadius: radius.pill,
    backgroundColor: colors.border,
    overflow: 'hidden',
  },
  barra: { height: '100%', borderRadius: radius.pill },
});
