import { ActivityIndicator, Pressable, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { colors, CONTROL_HEIGHT, radius, SHADOW_3D, spacing } from '@/theme';

import { AppText } from './AppText';

type Variant = 'primary' | 'secondary' | 'ghost';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: Variant;
  loading?: boolean;
  disabled?: boolean;
  accessibilityHint?: string;
  style?: StyleProp<ViewStyle>;
}

const VARIANTS = {
  primary: { face: colors.primaryDark, shadow: colors.primaryShadow, border: colors.primaryDark, text: 'white' },
  secondary: { face: colors.bg, shadow: colors.border, border: colors.border, text: 'primaryDark' },
  ghost: { face: 'transparent', shadow: 'transparent', border: 'transparent', text: 'primaryDark' },
} as const;

// Botão grande com "sombra 3D" que afunda ao toque (layout não muda ao pressionar).
export function Button({
  title,
  onPress,
  variant = 'primary',
  loading = false,
  disabled = false,
  accessibilityHint,
  style,
}: ButtonProps) {
  const v = VARIANTS[variant];
  const inativo = disabled || loading;
  const sombra = variant === 'ghost' ? 0 : SHADOW_3D;

  return (
    <View style={[{ paddingBottom: sombra }, inativo && styles.inativo, style]}>
      {sombra > 0 && (
        <View
          pointerEvents="none"
          style={[StyleSheet.absoluteFill, styles.sombra, { top: sombra, backgroundColor: v.shadow }]}
        />
      )}
      <Pressable
        onPress={onPress}
        disabled={inativo}
        accessibilityRole="button"
        accessibilityLabel={title}
        accessibilityHint={accessibilityHint}
        accessibilityState={{ disabled: inativo, busy: loading }}
        style={({ pressed }) => [
          styles.face,
          { backgroundColor: v.face, borderColor: v.border },
          pressed && sombra > 0 && { transform: [{ translateY: sombra }] },
          pressed && sombra === 0 && { opacity: 0.6 },
        ]}
      >
        {loading ? (
          <ActivityIndicator color={variant === 'primary' ? colors.white : colors.primaryDark} />
        ) : (
          <AppText variant="botao" color={v.text} align="center">
            {title}
          </AppText>
        )}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  face: {
    minHeight: CONTROL_HEIGHT,
    borderRadius: radius.md,
    borderWidth: 2,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sombra: { borderRadius: radius.md },
  inativo: { opacity: 0.5 },
});
