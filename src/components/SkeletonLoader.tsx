import React, { useEffect, useRef } from 'react';
import { StyleSheet, View, Animated } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { spacing } from '../theme/spacing';
import { radius } from '../theme/radius';

export const SkeletonLoader: React.FC = () => {
  const { colors } = useTheme();
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0.7,
          duration: 650,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.3,
          duration: 650,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [opacity]);

  return (
    <Animated.View style={[styles.card, { opacity, backgroundColor: colors.surface, borderColor: colors.outlineVariant }]}>
      <View style={[styles.imagePlaceholder, { backgroundColor: colors.surfaceVariant }]} />
      <View style={styles.contentPlaceholder}>
        <View style={[styles.titlePlaceholder, { backgroundColor: colors.surfaceVariant }]} />
        <View style={[styles.subtitlePlaceholder, { backgroundColor: colors.surfaceVariant }]} />
        <View style={styles.metaRowPlaceholder}>
          <View style={[styles.smallPlaceholder, { backgroundColor: colors.surfaceVariant }]} />
          <View style={[styles.smallPlaceholder, { backgroundColor: colors.surfaceVariant }]} />
        </View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: radius.md,
    padding: spacing.sm,
    marginBottom: spacing.sm,
    borderWidth: 1,
    height: 90,
  },
  imagePlaceholder: {
    width: 64,
    height: 64,
    borderRadius: radius.sm,
    marginRight: spacing.sm,
  },
  contentPlaceholder: {
    flex: 1,
    gap: 8,
  },
  titlePlaceholder: {
    height: 14,
    width: '80%',
    borderRadius: 4,
  },
  subtitlePlaceholder: {
    height: 10,
    width: '50%',
    borderRadius: 4,
  },
  metaRowPlaceholder: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 4,
  },
  smallPlaceholder: {
    height: 8,
    width: 60,
    borderRadius: 4,
  },
});

export default SkeletonLoader;
