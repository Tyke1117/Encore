import { Platform } from 'react-native';

export const shadows = {
  level0: {
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  level1: {
    // Subtle container definitions without heavy shadows (relies mostly on 1px borders)
    shadowColor: '#000000',
    ...Platform.select({
      ios: {
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.03,
        shadowRadius: 2,
      },
      android: {
        elevation: 1,
      },
      default: {
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.03,
        shadowRadius: 2,
      },
    }),
  },
  level2: {
    // Soft, diffused shadow for Cards and Modals:
    // Web CSS: 0 4px 6px -1px rgb(0 0 0 / 0.05), 0 2px 4px -2px rgb(0 0 0 / 0.05)
    shadowColor: '#000000',
    ...Platform.select({
      ios: {
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.06,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
      default: {
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.06,
        shadowRadius: 4,
      },
    }),
  },
  interactive: {
    // Hover/Press state with slightly increased spread and depth
    shadowColor: '#000000',
    ...Platform.select({
      ios: {
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.08,
        shadowRadius: 6,
      },
      android: {
        elevation: 5,
      },
      default: {
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.08,
        shadowRadius: 6,
      },
    }),
  },
} as const;

export type ShadowsType = typeof shadows;
export type ShadowStyle = typeof shadows[keyof typeof shadows];
