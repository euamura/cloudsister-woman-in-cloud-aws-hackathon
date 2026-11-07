import { Text, type TextProps } from 'react-native';

import { colors, MAX_FONT_SCALE, textStyles, type ColorToken, type TextVariant } from '@/theme';

interface AppTextProps extends TextProps {
  variant?: TextVariant;
  color?: ColorToken;
  align?: 'left' | 'center' | 'right';
}

export function AppText({
  variant = 'corpo',
  color = 'text',
  align,
  style,
  ...rest
}: AppTextProps) {
  return (
    <Text
      maxFontSizeMultiplier={MAX_FONT_SCALE}
      {...rest}
      style={[textStyles[variant], { color: colors[color] }, align && { textAlign: align }, style]}
    />
  );
}
