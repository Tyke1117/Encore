export const lightColors = {
  // Brand & Core Colors
  primary: '#FF5E1A', // Warm modern orange
  onPrimary: '#ffffff',
  primaryContainer: '#FFEDE6',
  onPrimaryContainer: '#8B2900',
  inversePrimary: '#FFB899',

  secondary: '#7B2CBF', // Warm modern purple
  onSecondary: '#ffffff',
  secondaryContainer: '#F1E4FF',
  onSecondaryContainer: '#3D0070',

  tertiary: '#FF007F', // Warm modern pink
  onTertiary: '#ffffff',
  tertiaryContainer: '#FFEBF2',
  onTertiaryContainer: '#61002A',

  // Surfaces & Backgrounds
  background: '#FAF9FB', // Soft off-white with purple undertones
  onBackground: '#1A161F',
  surface: '#ffffff',
  onSurface: '#1A161F',
  surfaceDim: '#F4F2F7',
  surfaceBright: '#ffffff',
  surfaceVariant: '#EBE7F0',
  onSurfaceVariant: '#6F687A',
  inverseSurface: '#312E36',
  inverseOnSurface: '#F7F2FA',
  surfaceTint: '#FF5E1A',

  // Surface Containers
  surfaceContainerLowest: '#ffffff',
  surfaceContainerLow: '#F8F6FA',
  surfaceContainer: '#F3F0F6',
  surfaceContainerHigh: '#EDEAF0',
  surfaceContainerHighest: '#E5E0EA',

  // Outlines & Borders
  outline: '#8C8494',
  outlineVariant: '#D5CFDE',

  // Error States
  error: '#ba1a1a',
  onError: '#ffffff',
  errorContainer: '#ffdad6',
  onErrorContainer: '#93000a',

  // Fixed Roles
  primaryFixed: '#FFEDE6',
  primaryFixedDim: '#FFB899',
  onPrimaryFixed: '#8B2900',
  onPrimaryFixedVariant: '#FF5E1A',

  secondaryFixed: '#F1E4FF',
  secondaryFixedDim: '#D2BBFF',
  onSecondaryFixed: '#3D0070',
  onSecondaryFixedVariant: '#7B2CBF',

  tertiaryFixed: '#FFEBF2',
  tertiaryFixedDim: '#FFB2D4',
  onTertiaryFixed: '#61002A',
  onTertiaryFixedVariant: '#FF007F',

  // Slate-based neutrals
  slate: {
    50: '#f8fafc',
    100: '#f1f5f9',
    200: '#e2e8f0',
    300: '#cbd5e1',
    400: '#94a3b8',
    500: '#64748b',
    600: '#475569',
    700: '#334155',
    800: '#1e293b',
    900: '#0f172a',
    950: '#020617',
  },

  // Aliases for kebab-case styling compatibility
  'surface-dim': '#F4F2F7',
  'surface-bright': '#ffffff',
  'surface-container-lowest': '#ffffff',
  'surface-container-low': '#F8F6FA',
  'surface-container': '#F3F0F6',
  'surface-container-high': '#EDEAF0',
  'surface-container-highest': '#E5E0EA',
  'on-surface': '#1A161F',
  'on-surface-variant': '#6F687A',
  'inverse-surface': '#312E36',
  'inverse-on-surface': '#F7F2FA',
  'outline-variant': '#D5CFDE',
  'surface-tint': '#FF5E1A',
  'on-primary': '#ffffff',
  'primary-container': '#FFEDE6',
  'on-primary-container': '#8B2900',
  'inverse-primary': '#FFB899',
  'on-secondary': '#ffffff',
  'secondary-container': '#F1E4FF',
  'on-secondary-container': '#3D0070',
  'on-tertiary': '#ffffff',
  'tertiary-container': '#FFEBF2',
  'on-tertiary-container': '#61002A',
  'on-error': '#ffffff',
  'error-container': '#ffdad6',
  'on-error-container': '#93000a',
  'primary-fixed': '#FFEDE6',
  'primary-fixed-dim': '#FFB899',
  'on-primary-fixed': '#8B2900',
  'on-primary-fixed-variant': '#FF5E1A',
  'secondary-fixed': '#F1E4FF',
  'secondary-fixed-dim': '#D2BBFF',
  'on-secondary-fixed': '#3D0070',
  'on-secondary-fixed-variant': '#7B2CBF',
  'tertiary-fixed': '#FFEBF2',
  'tertiary-fixed-dim': '#FFB2D4',
  'on-tertiary-fixed': '#61002A',
  'on-tertiary-fixed-variant': '#FF007F',
  'on-background': '#1A161F',
  'surface-variant': '#EBE7F0',
} as const;

export const darkColors = {
  // Brand & Core Colors
  primary: '#FF7B40', // Brighter warm orange for dark mode readability
  onPrimary: '#ffffff',
  primaryContainer: '#5C1D00',
  onPrimaryContainer: '#FFEDE6',
  inversePrimary: '#FF5E1A',

  secondary: '#9D4EDD', // Brighter purple for readability
  onSecondary: '#ffffff',
  secondaryContainer: '#3D0070',
  onSecondaryContainer: '#F1E4FF',

  tertiary: '#FF3399', // Brighter pink
  onTertiary: '#ffffff',
  tertiaryContainer: '#61002A',
  onTertiaryContainer: '#FFEBF2',

  // Surfaces & Backgrounds
  background: '#0E0B12', // Deep dark slate background with purple hint
  onBackground: '#EDEAF0',
  surface: '#16131A', // Dark container surfaces
  onSurface: '#EDEAF0',
  surfaceDim: '#0F0C14',
  surfaceBright: '#201B26',
  surfaceVariant: '#2D2833',
  onSurfaceVariant: '#A69FB0',
  inverseSurface: '#F7F2FA',
  inverseOnSurface: '#1A161F',
  surfaceTint: '#FF7B40',

  // Surface Containers
  surfaceContainerLowest: '#120E16',
  surfaceContainerLow: '#1A1622',
  surfaceContainer: '#201C29',
  surfaceContainerHigh: '#272230',
  surfaceContainerHighest: '#322D3D',

  // Outlines & Borders
  outline: '#8C8494',
  outlineVariant: '#484450',

  // Error States
  error: '#ffb4ab',
  onError: '#690005',
  errorContainer: '#93000a',
  onErrorContainer: '#ffdad6',

  // Fixed Roles
  primaryFixed: '#5C1D00',
  primaryFixedDim: '#FFB899',
  onPrimaryFixed: '#FFEDE6',
  onPrimaryFixedVariant: '#FF7B40',

  secondaryFixed: '#3D0070',
  secondaryFixedDim: '#D2BBFF',
  onSecondaryFixed: '#F1E4FF',
  onSecondaryFixedVariant: '#9D4EDD',

  tertiaryFixed: '#61002A',
  tertiaryFixedDim: '#FFB2D4',
  onTertiaryFixed: '#FFEBF2',
  onTertiaryFixedVariant: '#FF3399',

  // Slate-based neutrals (dark mode counterparts)
  slate: {
    50: '#020617',
    100: '#0f172a',
    200: '#1e293b',
    300: '#334155',
    400: '#475569',
    500: '#64748b',
    600: '#94a3b8',
    700: '#cbd5e1',
    800: '#e2e8f0',
    900: '#f1f5f9',
    950: '#f8fafc',
  },

  // Aliases for kebab-case styling compatibility
  'surface-dim': '#0F0C14',
  'surface-bright': '#201B26',
  'surface-container-lowest': '#120E16',
  'surface-container-low': '#1A1622',
  'surface-container': '#201C29',
  'surface-container-high': '#272230',
  'surface-container-highest': '#322D3D',
  'on-surface': '#EDEAF0',
  'on-surface-variant': '#A69FB0',
  'inverse-surface': '#F7F2FA',
  'inverse-on-surface': '#1A161F',
  'outline-variant': '#484450',
  'surface-tint': '#FF7B40',
  'on-primary': '#ffffff',
  'primary-container': '#5C1D00',
  'on-primary-container': '#FFEDE6',
  'inverse-primary': '#FF5E1A',
  'on-secondary': '#ffffff',
  'secondary-container': '#3D0070',
  'on-secondary-container': '#F1E4FF',
  'on-tertiary': '#ffffff',
  'tertiary-container': '#61002A',
  'on-tertiary-container': '#FFEBF2',
  'on-error': '#690005',
  'error-container': '#93000a',
  'on-error-container': '#ffdad6',
  'primary-fixed': '#5C1D00',
  'primary-fixed-dim': '#FFB899',
  'on-primary-fixed': '#FFEDE6',
  'on-primary-fixed-variant': '#FF7B40',
  'secondary-fixed': '#3D0070',
  'secondary-fixed-dim': '#D2BBFF',
  'on-secondary-fixed': '#F1E4FF',
  'on-secondary-fixed-variant': '#9D4EDD',
  'tertiary-fixed': '#61002A',
  'tertiary-fixed-dim': '#FFB2D4',
  'on-tertiary-fixed': '#FFEBF2',
  'on-tertiary-fixed-variant': '#FF3399',
  'on-background': '#EDEAF0',
  'surface-variant': '#2D2833',
} as const;

export const colors = lightColors;
export type ColorsType = typeof lightColors;
