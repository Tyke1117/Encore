import React, { useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, RefreshControl, Pressable } from 'react-native';
import { Chip } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import { useQuery } from '@tanstack/react-query';

import { colors } from '../../theme/colors';
import { typography } from '../../theme/fonts';
import { radius } from '../../theme/radius';
import { spacing } from '../../theme/spacing';
import { shadows } from '../../theme/shadows';
import { EventItem } from '../../types/events';
import { getEvents } from '../../data/mockEvents';

interface EventCardProps {
  item: EventItem;
  onPress: () => void;
}

const getMonthAndDay = (dateStr: string) => {
  const parts = dateStr.split('-');
  if (parts.length < 3) return { month: 'EVT', day: '00' };
  const date = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
  const month = date.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();
  const day = parts[2];
  return { month, day };
};

export function EventCard({ item, onPress }: EventCardProps) {
  const { month, day } = getMonthAndDay(item.date);

  const getStatusStyles = (status: 'open' | 'filling_fast' | 'closed') => {
    switch (status) {
      case 'open':
        return {
          bg: '#e8f5e9',
          text: '#2e7d32',
          label: 'Open',
        };
      case 'filling_fast':
        return {
          bg: '#fff3e0',
          text: '#e65100',
          label: 'Filling Fast',
        };
      case 'closed':
        return {
          bg: colors.slate[200],
          text: colors.slate[600],
          label: 'Closed',
        };
    }
  };

  const statusInfo = getStatusStyles(item.status);

  return (
    <Pressable style={styles.card} onPress={onPress}>
      <View style={styles.cardContent}>
        {/* Left: Date Box */}
        <View style={styles.dateBox}>
          <Text style={styles.dateMonth}>{month}</Text>
          <Text style={styles.dateDay}>{day}</Text>
        </View>

        {/* Right: Info */}
        <View style={styles.infoContainer}>
          <View style={styles.topMetaRow}>
            <Text style={styles.categoryText}>{item.category}</Text>
            <Chip
              compact
              style={[styles.statusChip, { backgroundColor: statusInfo.bg }]}
              textStyle={[styles.statusChipText, { color: statusInfo.text }]}
            >
              {statusInfo.label}
            </Chip>
          </View>

          <Text style={styles.cardTitle}>{item.title}</Text>
          <Text style={styles.clubText}>{item.club}</Text>

          <View style={styles.bottomMetaRow}>
            <View style={styles.metaIconLabel}>
              <Icon name="clock-outline" size={14} color={colors.onSurfaceVariant} />
              <Text style={styles.metaText}>{item.time}</Text>
            </View>
            <View style={[styles.metaIconLabel, { marginLeft: spacing.md, flex: 1 }]}>
              <Icon name="map-marker-outline" size={14} color={colors.onSurfaceVariant} />
              <Text style={styles.metaText} numberOfLines={1}>{item.location}</Text>
            </View>
          </View>

          {item.status !== 'closed' && (
            <View style={styles.seatsRow}>
              <Icon name="account-group-outline" size={14} color={colors.primary} />
              <Text style={styles.seatsText}>
                {item.seatsLeft} seats left / {item.totalSeats} total
              </Text>
            </View>
          )}
        </View>
      </View>
    </Pressable>
  );
}

export default function EventsListing() {
  const navigation = useNavigation<any>();

  const { data: events = [], isLoading, refetch, isRefetching } = useQuery({
    queryKey: ['events'],
    queryFn: getEvents,
  });

  const onRefresh = useCallback(() => {
    refetch();
  }, [refetch]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Campus Events</Text>
        <Text style={styles.headerSubtitle}>Discover and register for upcoming activities</Text>
      </View>

      <FlatList
        data={events}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={isRefetching} onRefresh={onRefresh} colors={[colors.primary]} />
        }
        renderItem={({ item }: { item: EventItem }) => (
          <EventCard
            item={item}
            onPress={() => navigation.navigate('EventDetails', { eventId: item.id })}
          />
        )}
        ListEmptyComponent={
          !isLoading ? (
            <View style={styles.centered}>
              <Text style={styles.emptyText}>No events available.</Text>
            </View>
          ) : null
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
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
  cardContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  dateBox: {
    width: 60,
    backgroundColor: colors.surfaceContainer,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.sm,
  },
  dateMonth: {
    fontFamily: typography.labelSm.fontFamily,
    fontSize: 11,
    color: colors.primary,
    fontWeight: '700',
  },
  dateDay: {
    fontFamily: typography.headlineMd.fontFamily,
    fontSize: 22,
    color: colors.onSurface,
    fontWeight: '700',
    marginTop: 2,
  },
  infoContainer: {
    flex: 1,
    marginLeft: spacing.md,
  },
  topMetaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  categoryText: {
    fontFamily: typography.labelMd.fontFamily,
    fontSize: 11,
    color: colors.secondary,
    textTransform: 'uppercase',
    fontWeight: '600',
  },
  statusChip: {
    height: 22,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.chip,
  },
  statusChipText: {
    fontFamily: typography.labelSm.fontFamily,
    fontSize: 10,
    fontWeight: '600',
    marginHorizontal: 0,
    marginVertical: 0,
    paddingHorizontal: spacing.xs,
  },
  cardTitle: {
    fontFamily: typography.headlineMd.fontFamily,
    fontSize: 17,
    fontWeight: typography.headlineMd.fontWeight,
    color: colors.onSurface,
    marginTop: spacing.xs,
  },
  clubText: {
    fontFamily: typography.bodyMd.fontFamily,
    fontSize: 13,
    color: colors.onSurfaceVariant,
    marginTop: 2,
  },
  bottomMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.md,
  },
  metaIconLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontFamily: typography.bodyMd.fontFamily,
    fontSize: 12,
    color: colors.onSurfaceVariant,
  },
  seatsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: spacing.sm,
    paddingTop: spacing.xs,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.outlineVariant,
  },
  seatsText: {
    fontFamily: typography.labelMd.fontFamily,
    fontSize: 11,
    color: colors.primary,
    fontWeight: '500',
  },
  centered: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: spacing.xl,
  },
  emptyText: {
    fontFamily: typography.bodyLg.fontFamily,
    fontSize: typography.bodyLg.fontSize,
    color: colors.onSurfaceVariant,
  },
});
