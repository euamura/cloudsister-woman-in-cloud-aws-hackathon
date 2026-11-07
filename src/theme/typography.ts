import type { TextStyle } from 'react-native';

export const fontFamily = {
  regular: 'Nunito_400Regular',
  semibold: 'Nunito_600SemiBold',
  bold: 'Nunito_700Bold',
  extrabold: 'Nunito_800ExtraBold',
} as const;

// Limite de ampliação de fonte do sistema: respeita fonte grande sem quebrar layout.
export const MAX_FONT_SCALE = 1.5;

export type TextVariant =
  | 'display'
  | 'titulo'
  | 'subtitulo'
  | 'corpo'
  | 'corpoBold'
  | 'rotulo'
  | 'legenda'
  | 'botao';

export const textStyles: Record<TextVariant, TextStyle> = {
  display: { fontFamily: fontFamily.extrabold, fontSize: 36, lineHeight: 44 },
  titulo: { fontFamily: fontFamily.extrabold, fontSize: 26, lineHeight: 34 },
  subtitulo: { fontFamily: fontFamily.bold, fontSize: 19, lineHeight: 26 },
  corpo: { fontFamily: fontFamily.regular, fontSize: 16, lineHeight: 24 },
  corpoBold: { fontFamily: fontFamily.bold, fontSize: 16, lineHeight: 24 },
  rotulo: { fontFamily: fontFamily.bold, fontSize: 14, lineHeight: 20 },
  legenda: { fontFamily: fontFamily.semibold, fontSize: 13, lineHeight: 18 },
  botao: {
    fontFamily: fontFamily.extrabold,
    fontSize: 16,
    lineHeight: 22,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
};
