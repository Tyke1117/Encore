export const radius = {
  // Numeric rounded scales (assuming 1rem = 16px)
  sm: 4,      // 0.25rem
  default: 8, // 0.5rem
  DEFAULT: 8,
  md: 12,     // 0.75rem
  lg: 16,     // 1rem
  xl: 24,     // 1.5rem
  full: 9999, // 9999px

  // Component-specific radius definitions
  card: 22,       // strictly 22px as per Apple-esque container specification
  button: 18,     // 18px-20px range for interactive elements
  input: 18,      // 18px-20px range for inputs
  chip: 6,        // 6px-8px range for small components
  tag: 6,
  checkbox: 6,
} as const;

export type RadiusType = typeof radius;
