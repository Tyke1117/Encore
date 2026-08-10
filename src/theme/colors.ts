export const colors = {
  // Brand & Core Colors
  primary: '#9d4300',
  onPrimary: '#ffffff',
  primaryContainer: '#f97316',
  onPrimaryContainer: '#582200',
  inversePrimary: '#ffb690',

  secondary: '#712ae2',
  onSecondary: '#ffffff',
  secondaryContainer: '#8a4cfc',
  onSecondaryContainer: '#fffbff',

  tertiary: '#006591',
  onTertiary: '#ffffff',
  tertiaryContainer: '#09a4e8',
  onTertiaryContainer: '#003650',

  // Surfaces & Backgrounds
  background: '#fff8f6',
  onBackground: '#251913',
  surface: '#fff8f6',
  onSurface: '#251913',
  surfaceDim: '#edd5cb',
  surfaceBright: '#fff8f6',
  surfaceVariant: '#f6ded3',
  onSurfaceVariant: '#584237',
  inverseSurface: '#3c2d26',
  inverseOnSurface: '#ffede6',
  surfaceTint: '#9d4300',

  // Surface Containers
  surfaceContainerLowest: '#ffffff',
  surfaceContainerLow: '#fff1eb',
  surfaceContainer: '#ffeae0',
  surfaceContainerHigh: '#fce3d9',
  surfaceContainerHighest: '#f6ded3',

  // Outlines & Borders
  outline: '#8c7164',
  outlineVariant: '#e0c0b1',

  // Error States
  error: '#ba1a1a',
  onError: '#ffffff',
  errorContainer: '#ffdad6',
  onErrorContainer: '#93000a',

  // Fixed Roles
  primaryFixed: '#ffdbca',
  primaryFixedDim: '#ffb690',
  onPrimaryFixed: '#341100',
  onPrimaryFixedVariant: '#783200',

  secondaryFixed: '#eaddff',
  secondaryFixedDim: '#d2bbff',
  onSecondaryFixed: '#25005a',
  onSecondaryFixedVariant: '#5a00c6',

  tertiaryFixed: '#c9e6ff',
  tertiaryFixedDim: '#89ceff',
  onTertiaryFixed: '#001e2f',
  onTertiaryFixedVariant: '#004c6e',

  // Slate-based neutrals for borders, layout grouping, and components (e.g. secondary buttons)
  slate: {
    50: '#f8fafc',
    100: '#f1f5f9',
    200: '#e2e8f0', // Standard Level 1 border
    300: '#cbd5e1',
    400: '#94a3b8',
    500: '#64748b',
    600: '#475569',
    700: '#334155',
    800: '#1e293b',
    900: '#0f172a', // Standard secondary button text
    950: '#020617',
  },

  // Aliases for kebab-case styling compatibility
  'surface-dim': '#edd5cb',
  'surface-bright': '#fff8f6',
  'surface-container-lowest': '#ffffff',
  'surface-container-low': '#fff1eb',
  'surface-container': '#ffeae0',
  'surface-container-high': '#fce3d9',
  'surface-container-highest': '#f6ded3',
  'on-surface': '#251913',
  'on-surface-variant': '#584237',
  'inverse-surface': '#3c2d26',
  'inverse-on-surface': '#ffede6',
  'outline-variant': '#e0c0b1',
  'surface-tint': '#9d4300',
  'on-primary': '#ffffff',
  'primary-container': '#f97316',
  'on-primary-container': '#582200',
  'inverse-primary': '#ffb690',
  'on-secondary': '#ffffff',
  'secondary-container': '#8a4cfc',
  'on-secondary-container': '#fffbff',
  'on-tertiary': '#ffffff',
  'tertiary-container': '#09a4e8',
  'on-tertiary-container': '#003650',
  'on-error': '#ffffff',
  'error-container': '#ffdad6',
  'on-error-container': '#93000a',
  'primary-fixed': '#ffdbca',
  'primary-fixed-dim': '#ffb690',
  'on-primary-fixed': '#341100',
  'on-primary-fixed-variant': '#783200',
  'secondary-fixed': '#eaddff',
  'secondary-fixed-dim': '#d2bbff',
  'on-secondary-fixed': '#25005a',
  'on-secondary-fixed-variant': '#5a00c6',
  'tertiary-fixed': '#c9e6ff',
  'tertiary-fixed-dim': '#89ceff',
  'on-tertiary-fixed': '#001e2f',
  'on-tertiary-fixed-variant': '#004c6e',
  'on-background': '#251913',
  'surface-variant': '#f6ded3',
} as const;

export type ColorsType = typeof colors;
