import { MD3LightTheme, MD3Theme } from 'react-native-paper';
import { colors } from './colors';
import { typography } from './fonts';
import { radius } from './radius';
import { shadows } from './shadows';
import { spacing } from './spacing';

export const EncorePrecisionTheme = {
  name: 'Encore Precision',
  colors,
  typography,
  radius,
  shadows,
  spacing,
} as const;

export const paperTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: colors.primary,
    onPrimary: colors.onPrimary,
    primaryContainer: colors.primaryContainer,
    onPrimaryContainer: colors.onPrimaryContainer,
    inversePrimary: colors.inversePrimary,

    secondary: colors.secondary,
    onSecondary: colors.onSecondary,
    secondaryContainer: colors.secondaryContainer,
    onSecondaryContainer: colors.onSecondaryContainer,

    tertiary: colors.tertiary,
    onTertiary: colors.onTertiary,
    tertiaryContainer: colors.tertiaryContainer,
    onTertiaryContainer: colors.onTertiaryContainer,

    background: colors.background,
    onBackground: colors.onBackground,
    surface: colors.surface,
    onSurface: colors.onSurface,
    surfaceVariant: colors.surfaceVariant,
    onSurfaceVariant: colors.onSurfaceVariant,
    inverseSurface: colors.inverseSurface,
    inverseOnSurface: colors.inverseOnSurface,

    outline: colors.outline,
    outlineVariant: colors.outlineVariant,

    error: colors.error,
    onError: colors.onError,
    errorContainer: colors.errorContainer,
    onErrorContainer: colors.onErrorContainer,

    // Material Design 3 surface containers and dim/bright colors
    surfaceDim: colors.surfaceDim,
    surfaceBright: colors.surfaceBright,
    surfaceContainerLowest: colors.surfaceContainerLowest,
    surfaceContainerLow: colors.surfaceContainerLow,
    surfaceContainer: colors.surfaceContainer,
    surfaceContainerHigh: colors.surfaceContainerHigh,
    surfaceContainerHighest: colors.surfaceContainerHighest,
  } as any, // Cast to any to bypass strict type checking for custom MD3 colors in React Native Paper
  fonts: {
    ...MD3LightTheme.fonts,
    displayLarge: {
      ...MD3LightTheme.fonts.displayLarge,
      fontFamily: typography.display.fontFamily,
      fontSize: typography.display.fontSize,
      fontWeight: typography.display.fontWeight as any,
      lineHeight: typography.display.lineHeight,
      letterSpacing: typography.display.letterSpacing,
    },
    headlineLarge: {
      ...MD3LightTheme.fonts.headlineLarge,
      fontFamily: typography.headlineLg.fontFamily,
      fontSize: typography.headlineLg.fontSize,
      fontWeight: typography.headlineLg.fontWeight as any,
      lineHeight: typography.headlineLg.lineHeight,
      letterSpacing: typography.headlineLg.letterSpacing,
    },
    headlineMedium: {
      ...MD3LightTheme.fonts.headlineMedium,
      fontFamily: typography.headlineMd.fontFamily,
      fontSize: typography.headlineMd.fontSize,
      fontWeight: typography.headlineMd.fontWeight as any,
      lineHeight: typography.headlineMd.lineHeight,
      letterSpacing: typography.headlineMd.letterSpacing,
    },
    bodyLarge: {
      ...MD3LightTheme.fonts.bodyLarge,
      fontFamily: typography.bodyLg.fontFamily,
      fontSize: typography.bodyLg.fontSize,
      fontWeight: typography.bodyLg.fontWeight as any,
      lineHeight: typography.bodyLg.lineHeight,
      letterSpacing: typography.bodyLg.letterSpacing,
    },
    bodyMedium: {
      ...MD3LightTheme.fonts.bodyMedium,
      fontFamily: typography.bodyMd.fontFamily,
      fontSize: typography.bodyMd.fontSize,
      fontWeight: typography.bodyMd.fontWeight as any,
      lineHeight: typography.bodyMd.lineHeight,
      letterSpacing: typography.bodyMd.letterSpacing,
    },
    labelLarge: {
      ...MD3LightTheme.fonts.labelLarge,
      fontFamily: typography.labelMd.fontFamily,
      fontSize: typography.labelMd.fontSize,
      fontWeight: typography.labelMd.fontWeight as any,
      lineHeight: typography.labelMd.lineHeight,
      letterSpacing: typography.labelMd.letterSpacing,
    },
    labelMedium: {
      ...MD3LightTheme.fonts.labelMedium,
      fontFamily: typography.labelSm.fontFamily,
      fontSize: typography.labelSm.fontSize,
      fontWeight: typography.labelSm.fontWeight as any,
      lineHeight: typography.labelSm.lineHeight,
      letterSpacing: typography.labelSm.letterSpacing,
    },
  },
  roundness: radius.default,
} as const;

export default EncorePrecisionTheme;
