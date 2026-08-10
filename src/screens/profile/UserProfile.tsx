import React from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { Avatar, Chip } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useQuery } from '@tanstack/react-query';

import { colors } from '../../theme/colors';
import { typography } from '../../theme/fonts';
import { radius } from '../../theme/radius';
import { spacing } from '../../theme/spacing';
import { shadows } from '../../theme/shadows';
import { getUserProfile } from '../../data/mockEvents';

interface ProfileStatProps {
  label: string;
  value: number | string;
  icon: string;
}

function ProfileStat({ label, value, icon }: ProfileStatProps) {
  return (
    <View style={styles.statCard}>
      <View style={styles.statIconCircle}>
        <Icon name={icon} size={20} color={colors.primary} />
      </View>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

export default function UserProfile() {
  const { data: profile, isLoading } = useQuery({
    queryKey: ['userProfile'],
    queryFn: getUserProfile,
  });

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!profile) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>Failed to load profile</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      {/* Profile Header Cards */}
      <View style={styles.profileHeader}>
        <Avatar.Text
          size={84}
          label={profile.initials}
          style={styles.avatar}
          labelStyle={styles.avatarLabel}
        />
        <Text style={styles.name}>{profile.name}</Text>
        <Text style={styles.details}>
          {profile.branch} · {profile.year}
        </Text>
      </View>

      {/* Stats Row */}
      <View style={styles.statsRow}>
        <ProfileStat
          label="Events Attended"
          value={profile.eventsAttended}
          icon="calendar-check"
        />
        <ProfileStat
          label="Clubs Followed"
          value={profile.clubsFollowed.length}
          icon="bookmark-multiple"
        />
      </View>

      {/* Clubs Followed Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Clubs Followed</Text>
        <View style={styles.clubsWrap}>
          {profile.clubsFollowed.map((club) => (
            <Chip
              key={club}
              style={styles.clubChip}
              textStyle={styles.clubChipText}
              icon={() => <Icon name="check-decagram" size={14} color={colors.onPrimaryFixedVariant} />}
            >
              {club}
            </Chip>
          ))}
        </View>
      </View>

      {/* Past Events Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Past Events</Text>
        <View style={styles.pastEventsList}>
          {profile.pastEvents.map((evt) => (
            <View key={evt.id} style={styles.pastEventRow}>
              <View style={styles.checkCircle}>
                <Icon name="check" size={16} color="#2e7d32" />
              </View>
              <View style={styles.pastEventInfo}>
                <Text style={styles.pastEventTitle}>{evt.title}</Text>
                <Text style={styles.pastEventDate}>
                  {new Date(evt.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                </Text>
              </View>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    padding: spacing.lg,
    paddingBottom: spacing.xl,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
    padding: spacing.lg,
  },
  profileHeader: {
    alignItems: 'center',
    marginTop: spacing.md,
    marginBottom: spacing.lg,
  },
  avatar: {
    backgroundColor: colors.primary,
    ...shadows.level2,
  },
  avatarLabel: {
    fontFamily: typography.headlineLg.fontFamily,
    fontSize: 32,
    fontWeight: '700',
    color: colors.onPrimary,
  },
  name: {
    fontFamily: typography.headlineLg.fontFamily,
    fontSize: 24,
    fontWeight: '700',
    color: colors.onBackground,
    marginTop: spacing.md,
  },
  details: {
    fontFamily: typography.bodyMd.fontFamily,
    fontSize: 14,
    color: colors.onSurfaceVariant,
    marginTop: 4,
  },
  statsRow: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.surfaceContainerLow,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    borderRadius: radius.card,
    padding: spacing.md,
    alignItems: 'center',
    ...shadows.level1,
  },
  statIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primaryFixed,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  statValue: {
    fontFamily: typography.headlineMd.fontFamily,
    fontSize: 20,
    fontWeight: '700',
    color: colors.onSurface,
  },
  statLabel: {
    fontFamily: typography.labelSm.fontFamily,
    fontSize: 11,
    color: colors.onSurfaceVariant,
    textAlign: 'center',
    marginTop: 2,
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontFamily: typography.headlineMd.fontFamily,
    fontSize: 18,
    fontWeight: '600',
    color: colors.onSurface,
    marginBottom: spacing.md,
  },
  clubsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  clubChip: {
    backgroundColor: colors.primaryFixed,
    borderRadius: radius.chip,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
  },
  clubChipText: {
    fontFamily: typography.labelMd.fontFamily,
    fontSize: 12,
    color: colors.onPrimaryFixedVariant,
    fontWeight: '500',
  },
  pastEventsList: {
    backgroundColor: colors.surfaceContainerLow,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    paddingHorizontal: spacing.md,
    ...shadows.level1,
  },
  pastEventRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.outlineVariant,
  },
  checkCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#e8f5e9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pastEventInfo: {
    marginLeft: spacing.md,
    flex: 1,
  },
  pastEventTitle: {
    fontFamily: typography.bodyLg.fontFamily,
    fontSize: 14,
    fontWeight: '600',
    color: colors.onSurface,
  },
  pastEventDate: {
    fontFamily: typography.bodyMd.fontFamily,
    fontSize: 12,
    color: colors.onSurfaceVariant,
    marginTop: 2,
  },
  errorText: {
    fontFamily: typography.bodyLg.fontFamily,
    fontSize: 16,
    color: colors.error,
  },
});
