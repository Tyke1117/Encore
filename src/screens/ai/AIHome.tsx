import React, { useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, RefreshControl } from 'react-native';
import { Avatar, Chip } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import { useQuery } from '@tanstack/react-query';

import { colors } from '../../theme/colors';
import { typography } from '../../theme/fonts';
import { radius } from '../../theme/radius';
import { spacing } from '../../theme/spacing';
import { shadows } from '../../theme/shadows';
import { RecommendedEvent } from '../../types/ai';
import { getRecommendedEvents } from '../../data/mockRecommendations';
import AIInsightCard from './AIInsightCard';

export default function AIHome() {
  const navigation = useNavigation<any>();

  const { data: events = [], isLoading, refetch, isRefetching } = useQuery({
    queryKey: ['recommendedEvents'],
    queryFn: () => getRecommendedEvents(),
  });

  const onRefresh = useCallback(() => {
    refetch();
  }, [refetch]);

  const topPick = events[0];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Recommended For You</Text>
        <Text style={styles.headerSubtitle}>Based on your clubs and past events</Text>
      </View>

      {topPick && (
        <View style={styles.insightWrap}>
          <AIInsightCard
            text={`AI predicts "${topPick.title}" is your best match this week, based on your club activity.`}
          />
        </View>
      )}

      <FlatList
        data={events}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={isRefetching} onRefresh={onRefresh} colors={[colors.primary]} />
        }
        renderItem={({ item }: { item: RecommendedEvent }) => (
          <View
            style={styles.card}
            onTouchEnd={() => navigation.navigate('RecommendationDetail', { eventId: item.id })}
          >
            <View style={styles.cardTop}>
              <Avatar.Icon
                size={40}
                icon={() => <Icon name="calendar-star" size={20} color={colors.primary} />}
                style={styles.avatarIcon}
                color={colors.primary}
              />
              <View style={styles.cardTopText}>
                <Text style={styles.cardTitle}>{item.title}</Text>
                <Text style={styles.cardMeta}>
                  {item.club} · {item.category}
                </Text>
              </View>
              <Chip
                compact
                style={styles.scoreChip}
                textStyle={styles.scoreChipText}
              >
                {item.matchScore}%
              </Chip>
            </View>

            <View style={styles.metaRow}>
              <Icon name="calendar-blank-outline" size={14} color={colors.onSurfaceVariant} />
              <Text style={styles.cardMeta}>{item.date}</Text>
              <Icon name="map-marker-outline" size={14} color={colors.onSurfaceVariant} style={{ marginLeft: spacing.sm }} />
              <Text style={styles.cardMeta}>{item.location}</Text>
            </View>

            {item.reasons[0] && (
              <View style={styles.reasonRow}>
                <Icon name="creation" size={13} color={colors.secondary} />
                <Text style={styles.reasonText}>{item.reasons[0].label}</Text>
              </View>
            )}
          </View>
        )}
        ListEmptyComponent={
          !isLoading ? (
            <View style={styles.centered}>
              <Text style={styles.emptyText}>No recommendations yet.</Text>
            </View>
          ) : null
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  centered: { alignItems: 'center', justifyContent: 'center', paddingTop: spacing.xl },
  header: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.sm,
  },
  headerTitle: {
    fontFamily: typography.headlineLg.fontFamily,
    fontSize: typography.headlineLgMobile.fontSize,
    fontWeight: typography.headlineLg.fontWeight,
    color: colors.onBackground,
  },
  headerSubtitle: {
    fontFamily: typography.bodyMd.fontFamily,
    fontSize: typography.bodyMd.fontSize,
    color: colors.onSurfaceVariant,
    marginTop: spacing.xs,
  },
  insightWrap: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
  },
  listContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
  },
  card: {
    backgroundColor: colors.surfaceContainerLow,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    padding: spacing.md,
    marginBottom: spacing.md,
    ...shadows.level1,
  },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarIcon: {
    backgroundColor: colors.primaryContainer,
  },
  cardTopText: {
    flex: 1,
    marginLeft: spacing.sm,
  },
  cardTitle: {
    fontFamily: typography.headlineMd.fontFamily,
    fontSize: 16,
    fontWeight: typography.headlineMd.fontWeight,
    color: colors.onSurface,
  },
  cardMeta: {
    fontFamily: typography.bodyMd.fontFamily,
    fontSize: 12,
    color: colors.onSurfaceVariant,
  },
  scoreChip: {
    backgroundColor: colors.primaryContainer,
  },
  scoreChipText: {
    fontFamily: typography.labelSm.fontFamily,
    fontSize: 11,
    color: colors.onPrimaryContainer,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: spacing.sm,
  },
  reasonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: spacing.sm,
  },
  reasonText: {
    fontFamily: typography.labelMd.fontFamily,
    fontSize: 12,
    color: colors.secondary,
    fontWeight: '500' as const,
  },
  emptyText: {
    fontFamily: typography.bodyLg.fontFamily,
    fontSize: typography.bodyLg.fontSize,
    color: colors.onSurfaceVariant,
  },
});
