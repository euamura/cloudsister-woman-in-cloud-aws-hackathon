// Tokens de cor do CloudSister.
// Obs. de acessibilidade (AA): texto branco só sobre `primaryDark`; textos de
// erro/sucesso sobre fundo claro usam as variantes `*Text` (mais escuras).
export const colors = {
  primary: '#A78BFA', // lilás primário (decorativo, realces)
  primaryDark: '#6D28D9', // roxo profundo (botões, links, títulos)
  primaryShadow: '#4C1D95', // "sombra 3D" dos botões primários
  pink: '#F472B6',
  pinkLight: '#FCE7F3',
  pinkDark: '#BE185D',

  bg: '#FFFFFF',
  bgSoft: '#FAF5FF',
  border: '#E9D5FF',
  borderStrong: '#C4B5FD',

  text: '#1F1235',
  textMuted: '#5B4B7A',
  white: '#FFFFFF',

  success: '#22C55E',
  successText: '#15803D',
  successLight: '#DCFCE7',
  error: '#F43F5E',
  errorText: '#BE123C',
  errorLight: '#FFE4E6',
  streak: '#FB923C',
  streakLight: '#FFEDD5',

  mascot: '#C4B5FD',
  mascotDark: '#2E1065',
} as const;

export type ColorToken = keyof typeof colors;
