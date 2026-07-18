import { TextStyle } from 'react-native';

export const fonts = {
  sizes: {
    displayLarge: 57,
    displayMedium: 45,
    displaySmall: 36,
    headlineLarge: 32,
    headlineMedium: 28,
    headlineSmall: 24,
    titleLarge: 22,
    titleMedium: 16,
    titleSmall: 14,
    bodyLarge: 16,
    bodyMedium: 14,
    bodySmall: 12,
    labelLarge: 14,
    labelMedium: 12,
    labelSmall: 11,
  },
  weights: {
    thin: '100' as TextStyle['fontWeight'],
    light: '300' as TextStyle['fontWeight'],
    regular: '400' as TextStyle['fontWeight'],
    medium: '500' as TextStyle['fontWeight'],
    semibold: '600' as TextStyle['fontWeight'],
    bold: '700' as TextStyle['fontWeight'],
    black: '900' as TextStyle['fontWeight'],
  },
};

export type FontsType = typeof fonts;
