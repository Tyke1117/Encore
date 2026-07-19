export const typography = {
  display: {
    fontFamily: 'Inter',
    fontSize: 48,
    fontWeight: '700' as const,
    lineHeight: 52.8, // 48 * 1.1
    letterSpacing: -0.96, // 48 * -0.02
  },
  headlineLg: {
    fontFamily: 'Inter',
    fontSize: 32,
    fontWeight: '600' as const,
    lineHeight: 38.4, // 32 * 1.2
    letterSpacing: -0.64, // 32 * -0.02
  },
  'headline-lg': {
    fontFamily: 'Inter',
    fontSize: 32,
    fontWeight: '600' as const,
    lineHeight: 38.4,
    letterSpacing: -0.64,
  },
  headlineLgMobile: {
    fontFamily: 'Inter',
    fontSize: 24,
    fontWeight: '600' as const,
    lineHeight: 28.8, // 24 * 1.2
    letterSpacing: -0.24, // 24 * -0.01
  },
  'headline-lg-mobile': {
    fontFamily: 'Inter',
    fontSize: 24,
    fontWeight: '600' as const,
    lineHeight: 28.8,
    letterSpacing: -0.24,
  },
  headlineMd: {
    fontFamily: 'Inter',
    fontSize: 20,
    fontWeight: '600' as const,
    lineHeight: 28, // 20 * 1.4
    letterSpacing: -0.2, // 20 * -0.01
  },
  'headline-md': {
    fontFamily: 'Inter',
    fontSize: 20,
    fontWeight: '600' as const,
    lineHeight: 28,
    letterSpacing: -0.2,
  },
  bodyLg: {
    fontFamily: 'Inter',
    fontSize: 16,
    fontWeight: '400' as const,
    lineHeight: 25.6, // 16 * 1.6
    letterSpacing: 0,
  },
  'body-lg': {
    fontFamily: 'Inter',
    fontSize: 16,
    fontWeight: '400' as const,
    lineHeight: 25.6,
    letterSpacing: 0,
  },
  bodyMd: {
    fontFamily: 'Inter',
    fontSize: 14,
    fontWeight: '400' as const,
    lineHeight: 21, // 14 * 1.5
    letterSpacing: 0,
  },
  'body-md': {
    fontFamily: 'Inter',
    fontSize: 14,
    fontWeight: '400' as const,
    lineHeight: 21,
    letterSpacing: 0,
  },
  labelMd: {
    fontFamily: 'Inter',
    fontSize: 12,
    fontWeight: '500' as const,
    lineHeight: 12, // 12 * 1
    letterSpacing: 0.12, // 12 * 0.01
  },
  'label-md': {
    fontFamily: 'Inter',
    fontSize: 12,
    fontWeight: '500' as const,
    lineHeight: 12,
    letterSpacing: 0.12,
  },
  labelSm: {
    fontFamily: 'Inter',
    fontSize: 11,
    fontWeight: '600' as const,
    lineHeight: 11, // 11 * 1
    letterSpacing: 0.33, // 11 * 0.03
  },
  'label-sm': {
    fontFamily: 'Inter',
    fontSize: 11,
    fontWeight: '600' as const,
    lineHeight: 11,
    letterSpacing: 0.33,
  },
} as const;

export type TypographyType = typeof typography;
export type TypographyStyle = typeof typography[keyof typeof typography];
