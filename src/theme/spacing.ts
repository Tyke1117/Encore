export const spacing = {
  base: 4,
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  '2xl': 48,
  xxl: 48,
  '3xl': 64,
  xxxl: 64,
  gutter: 24,
  margin: 24,
  maxWidth: 1280,
  max_width: 1280,
} as const;

export type SpacingType = typeof spacing;
