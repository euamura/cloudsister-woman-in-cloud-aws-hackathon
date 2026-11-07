import { useState } from 'react';
import { Pressable, StyleSheet, TextInput, View, type TextInputProps } from 'react-native';

import { colors, CONTROL_HEIGHT, fontFamily, MAX_FONT_SCALE, radius, spacing, TOUCH_MIN } from '@/theme';

import { AppText } from './AppText';

interface TextFieldProps extends Omit<TextInputProps, 'style'> {
  label: string;
  erro?: string;
  opcional?: boolean;
}

export function TextField({ label, erro, opcional, secureTextEntry, ...rest }: TextFieldProps) {
  const [focado, setFocado] = useState(false);
  const [oculta, setOculta] = useState(true);
  const ehSenha = !!secureTextEntry;

  return (
    <View style={styles.wrapper}>
      <AppText variant="rotulo" color="textMuted">
        {label}
        {opcional ? ' (opcional)' : ''}
      </AppText>
      <View
        style={[
          styles.campo,
          focado && styles.campoFocado,
          !!erro && styles.campoErro,
        ]}
      >
        <TextInput
          {...rest}
          secureTextEntry={ehSenha && oculta}
          onFocus={(e) => {
            setFocado(true);
            rest.onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocado(false);
            rest.onBlur?.(e);
          }}
          accessibilityLabel={label}
          accessibilityHint={erro}
          maxFontSizeMultiplier={MAX_FONT_SCALE}
          placeholderTextColor={colors.textMuted}
          style={styles.input}
        />
        {ehSenha && (
          <Pressable
            onPress={() => setOculta((o) => !o)}
            accessibilityRole="button"
            accessibilityLabel={oculta ? 'Mostrar senha' : 'Ocultar senha'}
            style={styles.olho}
            hitSlop={8}
          >
            <AppText variant="rotulo" color="primaryDark">
              {oculta ? 'Mostrar' : 'Ocultar'}
            </AppText>
          </Pressable>
        )}
      </View>
      {!!erro && (
        <AppText variant="legenda" color="errorText" accessibilityLiveRegion="polite">
          {erro}
        </AppText>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { gap: spacing.xs },
  campo: {
    minHeight: CONTROL_HEIGHT,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.bg,
    borderWidth: 2,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.lg,
  },
  campoFocado: { borderColor: colors.primaryDark },
  campoErro: { borderColor: colors.errorText },
  input: {
    flex: 1,
    minHeight: CONTROL_HEIGHT - 4,
    fontFamily: fontFamily.semibold,
    fontSize: 16,
    color: colors.text,
  },
  olho: { minHeight: TOUCH_MIN, minWidth: TOUCH_MIN, justifyContent: 'center', alignItems: 'flex-end' },
});
