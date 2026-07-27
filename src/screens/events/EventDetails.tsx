import React from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { Button, Chip } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useQuery } from '@tanstack/react-query';

import { colors } from '../../theme/colors';
import { typography } from '../../theme/fonts';
import { radius } from '../../theme/radius';
import { spacing } from '../../theme/spacing';
import { shadows } from '../../theme/shadows';
import { getEventById } from '../../data/mockEvents';

export default function EventDetails() {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const { eventId } = route.params || {};

  const { data: event, isLoading } = useQuery({
    queryKey: ['event', eventId],
    queryFn: () => getEventById(eventId),
    enabled: !!eventId,
  });

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!event) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>Event not found</Text>
        <Button mode="contained" onPress={() => navigation.goBack()} style={styles.backBtn}>
          Go Back
        </Button>
      </View>
    );
  }

  const isClosed = event.status === 'closed';

  const getStatusLabel = (status: 'open' | 'filling_fast' | 'closed') => {
    switch (status) {
      case 'open':
        return 'Open';
      case 'filling_fast':
        return 'Filling Fast';
      case 'closed':
        return 'Closed';
    }
  };

  const getStatusColor = (status: 'open' | 'filling_fast' | 'closed') => {
    switch (status) {
      case 'open':
        return '#2e7d32';
      case 'filling_fast':
        return '#e65100';
      case 'closed':
        return colors.slate[600];
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Category & Status Row */}
        <View style={styles.tagRow}>
          <Chip compact style={styles.categoryChip} textStyle={styles.categoryChipText}>
            {event.category}
          </Chip>
          <View style={[styles.statusIndicator, { backgroundColor: getStatusColor(event.status) + '15' }]}>
            <View style={[styles.statusDot, { backgroundColor: getStatusColor(event.status) }]} />
            <Text style={[styles.statusLabel, { color: getStatusColor(event.status) }]}>
              {getStatusLabel(event.status)}
            </Text>
          </View>
        </View>

        {/* Title & Organizer */}
        <Text style={styles.title}>{event.title}</Text>
        <Text style={styles.clubSubtitle}>Organized by {event.club}</Text>

        {/* Event Meta Details Grid */}
        <View style={styles.detailsGrid}>
          {/* Date Row */}
          <View style={styles.gridItem}>
            <View style={styles.iconCircle}>
              <Icon name="calendar-month" size={22} color={colors.primary} />
            </View>
            <View style={styles.gridTextContainer}>
              <Text style={styles.gridLabel}>Date</Text>
              <Text style={styles.gridValue}>
                {new Date(event.date).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </Text>
            </View>
          </View>

          {/* Time Row */}
          <View style={styles.gridItem}>
            <View style={styles.iconCircle}>
              <Icon name="clock-time-five-outline" size={22} color={colors.primary} />
            </View>
            <View style={styles.gridTextContainer}>
              <Text style={styles.gridLabel}>Time</Text>
              <Text style={styles.gridValue}>{event.time}</Text>
            </View>
          </View>

          {/* Location Row */}
          <View style={styles.gridItem}>
            <View style={styles.iconCircle}>
              <Icon name="map-marker-radius" size={22} color={colors.primary} />
            </View>
            <View style={styles.gridTextContainer}>
              <Text style={styles.gridLabel}>Location</Text>
              <Text style={styles.gridValue}>{event.location}</Text>
            </View>
          </View>

          {/* Seats Row */}
          {event.status !== 'closed' && (
            <View style={styles.gridItem}>
              <View style={styles.iconCircle}>
                <Icon name="seat-passenger" size={22} color={colors.primary} />
              </View>
              <View style={styles.gridTextContainer}>
                <Text style={styles.gridLabel}>Seats Available</Text>
                <Text style={styles.gridValue}>
                  {event.seatsLeft} left / {event.totalSeats} total
                </Text>
              </View>
            </View>
          )}
        </View>

        {/* Description Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About Event</Text>
          <Text style={styles.descriptionText}>{event.description}</Text>
        </View>
      </ScrollView>

      {/* Register Action Button */}
      <View style={styles.bottomBar}>
        <Button
          mode="contained"
          disabled={isClosed}
          style={[styles.registerBtn, isClosed && styles.disabledBtn]}
          labelStyle={styles.registerBtnLabel}
          onPress={() => console.log('Registered for', event.id)}
        >
          {isClosed ? 'Registration Closed' : 'Register Now'}
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
    padding: spacing.lg,
  },
  scrollContent: {
    padding: spacing.lg,
    paddingBottom: 100, // Safe space for bottom button
  },
  tagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  categoryChip: {
    backgroundColor: colors.secondaryContainer,
    borderRadius: radius.chip,
  },
  categoryChipText: {
    fontFamily: typography.labelSm.fontFamily,
    fontSize: 11,
    color: colors.onSecondaryContainer,
    fontWeight: '600',
  },
  statusIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 4,
    paddingHorizontal: spacing.sm,
    borderRadius: radius.full,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusLabel: {
    fontFamily: typography.labelSm.fontFamily,
    fontSize: 11,
    fontWeight: '600',
  },
  title: {
    fontFamily: typography.headlineLg.fontFamily,
    fontSize: 26,
    fontWeight: '700',
    color: colors.onBackground,
    lineHeight: 32,
  },
  clubSubtitle: {
    fontFamily: typography.bodyLg.fontFamily,
    fontSize: 14,
    color: colors.onSurfaceVariant,
    marginTop: spacing.xs,
    marginBottom: spacing.lg,
  },
  detailsGrid: {
    backgroundColor: colors.surfaceContainerLow,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    padding: spacing.md,
    gap: spacing.md,
    ...shadows.level1,
    marginBottom: spacing.lg,
  },
  gridItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primaryFixed,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gridTextContainer: {
    marginLeft: spacing.md,
    flex: 1,
  },
  gridLabel: {
    fontFamily: typography.labelSm.fontFamily,
    fontSize: 11,
    color: colors.onSurfaceVariant,
    textTransform: 'uppercase',
  },
  gridValue: {
    fontFamily: typography.bodyMd.fontFamily,
    fontSize: 14,
    color: colors.onSurface,
    fontWeight: '500',
    marginTop: 2,
  },
  section: {
    marginTop: spacing.sm,
  },
  sectionTitle: {
    fontFamily: typography.headlineMd.fontFamily,
    fontSize: 18,
    fontWeight: '600',
    color: colors.onSurface,
    marginBottom: spacing.sm,
  },
  descriptionText: {
    fontFamily: typography.bodyLg.fontFamily,
    fontSize: 15,
    color: colors.onSurfaceVariant,
    lineHeight: 22,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.background,
    borderTopWidth: 1,
    borderTopColor: colors.outlineVariant,
    padding: spacing.md,
  },
  registerBtn: {
    backgroundColor: colors.primary,
    borderRadius: radius.button,
    paddingVertical: 6,
  },
  disabledBtn: {
    backgroundColor: colors.slate[300],
  },
  registerBtnLabel: {
    fontFamily: typography.labelMd.fontFamily,
    fontSize: 15,
    fontWeight: '600',
  },
  errorText: {
    fontFamily: typography.bodyLg.fontFamily,
    fontSize: 16,
    color: colors.error,
    marginBottom: spacing.md,
  },
  backBtn: {
    borderRadius: radius.button,
    backgroundColor: colors.primary,
  },
});
