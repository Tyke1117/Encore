import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { colors } from '../../theme/colors';
import { typography } from '../../theme/fonts';
import { radius } from '../../theme/radius';
import { spacing } from '../../theme/spacing';

// Reused across the AI module wherever an "AI-generated" insight is shown,
// matching the existing purple sparkle card pattern from the organizer dashboard.
interface AIInsightCardProps {
  text: string;
}

export default function AIInsightCard({ text }: AIInsightCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.iconWrap}>
        <Icon name="creation" size={18} color="#ffffff" />
      </View>
      <Text style={styles.text}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: colors.secondary, // matches dashboard's purple insight card
    borderRadius: radius.card,
    padding: spacing.md,
    gap: spacing.sm,
  },
  iconWrap: {
    width: 32,
    height: 32,
    borderRadius: radius.full,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    flex: 1,
    fontFamily: typography.bodyMd.fontFamily,
    fontSize: typography.bodyMd.fontSize,
    color: colors.onSecondary,
    lineHeight: 20,
  },
});
