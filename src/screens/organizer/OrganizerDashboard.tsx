import React from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { radius } from '../../theme/radius';
import { typography } from '../../theme/fonts';
import { shadows } from '../../theme/shadows';

type IoniconName = React.ComponentProps<typeof Ionicons>['name'];

interface StatCardData {
  id: string;
  label: string;
  value: string;
  icon: IoniconName;
  tint: string;
}

interface RegistrationItem {
  id: string;
  studentName: string;
  eventName: string;
  time: string;
  status: 'Confirmed' | 'Pending' | 'Cancelled';
}

interface UpcomingEventItem {
  id: string;
  name: string;
  date: string;
  time: string;
  venue: string;
  seatsLeft: number;
  status: 'Open' | 'Filling Fast' | 'Closed';
}

interface QuickAction {
  id: string;
  label: string;
  icon: IoniconName;
}

const stats: StatCardData[] = [
  { id: '1', label: 'Total Events', value: '18', icon: 'calendar-outline', tint: colors.primary },
  { id: '2', label: 'Active Events', value: '5', icon: 'flash-outline', tint: colors.tertiary },
  { id: '3', label: 'Registrations', value: '742', icon: 'people-outline', tint: colors.secondary },
  { id: '4', label: 'Revenue', value: '₹28.4K', icon: 'wallet-outline', tint: colors.primaryContainer },
];

const quickActions: QuickAction[] = [
  { id: '1', label: 'Create Event', icon: 'add-circle-outline' },
  { id: '2', label: 'Manage Events', icon: 'file-tray-full-outline' },
  { id: '3', label: 'Participants', icon: 'people-outline' },
  { id: '4', label: 'Analytics', icon: 'bar-chart-outline' },
  { id: '5', label: 'Certificates', icon: 'ribbon-outline' },
  { id: '6', label: 'Announcements', icon: 'megaphone-outline' },
];

const recentRegistrations: RegistrationItem[] = [
  { id: '1', studentName: 'Aarav Mehta', eventName: 'Encore Hackathon 2026', time: '5 min ago', status: 'Confirmed' },
  { id: '2', studentName: 'Bhavika Patel', eventName: 'Cultural Night', time: '22 min ago', status: 'Pending' },
  { id: '3', studentName: 'Rohan Iyer', eventName: 'AI/ML Workshop', time: '1 hr ago', status: 'Confirmed' },
  { id: '4', studentName: 'Diya Shah', eventName: 'Cultural Night', time: '2 hr ago', status: 'Cancelled' },
];

const upcomingEvents: UpcomingEventItem[] = [
  { id: '1', name: 'Cultural Night', date: '22 Jul', time: '6:00 PM', venue: 'Open Air Theatre', seatsLeft: 40, status: 'Filling Fast' },
  { id: '2', name: 'AI/ML Workshop', date: '25 Jul', time: '10:00 AM', venue: 'Seminar Hall B', seatsLeft: 104, status: 'Open' },
  { id: '3', name: 'Sports Meet', date: '02 Aug', time: '8:00 AM', venue: 'Ground', seatsLeft: 0, status: 'Closed' },
];

function initialsOf(name: string): string {
  return name
    .split(' ')
    .map((part) => part.charAt(0))
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

function registrationStatusColor(status: RegistrationItem['status']): string {
  if (status === 'Confirmed') return colors.tertiary;
  if (status === 'Pending') return colors.primaryContainer;
  return colors.error;
}

function eventStatusColor(status: UpcomingEventItem['status']): string {
  if (status === 'Open') return colors.tertiary;
  if (status === 'Filling Fast') return colors.primaryContainer;
  return colors.error;
}

function WelcomeHeader() {
  return (
    <View style={styles.headerRow}>
      <View style={styles.headerLeft}>
        <View style={styles.avatarCircle}>
          <Text style={styles.avatarText}>SS</Text>
        </View>
        <View>
          <Text style={styles.greetingText}>Good afternoon,</Text>
          <Text style={styles.nameText}>Sil Shah</Text>
        </View>
      </View>
      <Pressable style={styles.notificationButton}>
        <Ionicons name="notifications-outline" size={22} color={colors.onSurface} />
        <View style={styles.notificationDot} />
      </Pressable>
    </View>
  );
}

function StatCard({ item }: { item: StatCardData }) {
  return (
    <View style={styles.statCard}>
      <View style={[styles.statIconChip, { backgroundColor: `${item.tint}1F` }]}>
        <Ionicons name={item.icon} size={18} color={item.tint} />
      </View>
      <Text style={styles.statValue}>{item.value}</Text>
      <Text style={styles.statLabel}>{item.label}</Text>
    </View>
  );
}

function FeaturedEventCard() {
  const progress = 0.72;
  return (
    <View style={styles.featuredCard}>
      <View style={styles.featuredBanner}>
        <Ionicons name="trophy-outline" size={30} color={colors.onPrimary} />
        <View style={styles.featuredBadge}>
          <Text style={styles.featuredBadgeText}>Live</Text>
        </View>
      </View>
      <View style={styles.featuredBody}>
        <Text style={styles.featuredTitle}>Encore Hackathon 2026</Text>
        <View style={styles.featuredMetaRow}>
          <Ionicons name="time-outline" size={14} color={colors.onSurfaceVariant} />
          <Text style={styles.featuredMetaText}>18 Jul 2026</Text>
          <Ionicons
            name="location-outline"
            size={14}
            color={colors.onSurfaceVariant}
            style={styles.featuredMetaIconSpacer}
          />
          <Text style={styles.featuredMetaText}>CL-1 Auditorium</Text>
        </View>
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
        </View>
        <Text style={styles.progressLabel}>214 / 300 registrations</Text>
      </View>
    </View>
  );
}

function QuickActionButton({ item }: { item: QuickAction }) {
  return (
    <Pressable style={styles.quickAction}>
      <View style={styles.quickActionIconWrap}>
        <Ionicons name={item.icon} size={20} color={colors.primary} />
      </View>
      <Text style={styles.quickActionLabel}>{item.label}</Text>
    </Pressable>
  );
}

function RegistrationCard({ item }: { item: RegistrationItem }) {
  const chipColor = registrationStatusColor(item.status);
  return (
    <View style={styles.registrationCard}>
      <View style={styles.registrationAvatar}>
        <Text style={styles.registrationAvatarText}>{initialsOf(item.studentName)}</Text>
      </View>
      <View style={styles.registrationInfo}>
        <Text style={styles.registrationName}>{item.studentName}</Text>
        <Text style={styles.registrationEvent}>{item.eventName}</Text>
        <Text style={styles.registrationTime}>{item.time}</Text>
      </View>
      <View style={[styles.statusChip, { backgroundColor: `${chipColor}1F` }]}>
        <Text style={[styles.statusChipText, { color: chipColor }]}>{item.status}</Text>
      </View>
    </View>
  );
}

function UpcomingEventCard({ item }: { item: UpcomingEventItem }) {
  const chipColor = eventStatusColor(item.status);
  return (
    <View style={styles.upcomingCard}>
      <View style={styles.upcomingDateBlock}>
        <Text style={styles.upcomingDateDay}>{item.date.split(' ')[0]}</Text>
        <Text style={styles.upcomingDateMonth}>{item.date.split(' ')[1]}</Text>
      </View>
      <View style={styles.upcomingInfo}>
        <Text style={styles.upcomingName}>{item.name}</Text>
        <Text style={styles.upcomingMeta}>{item.time} · {item.venue}</Text>
        <Text style={styles.upcomingSeats}>{item.seatsLeft} seats left</Text>
      </View>
      <View style={[styles.statusChip, { backgroundColor: `${chipColor}1F` }]}>
        <Text style={[styles.statusChipText, { color: chipColor }]}>{item.status}</Text>
      </View>
    </View>
  );
}

function AIInsightCard() {
  return (
    <View style={styles.aiCard}>
      <View style={styles.aiIconWrap}>
        <Ionicons name="sparkles-outline" size={20} color={colors.onSecondary} />
      </View>
      <Text style={styles.aiText}>
        AI predicts a high turnout for your upcoming Hackathon based on current registration pace.
      </Text>
    </View>
  );
}

export default function OrganizerDashboard() {
  return (
    <View style={styles.screen}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <WelcomeHeader />

        <View style={styles.statsGrid}>
          {stats.map((item) => (
            <StatCard key={item.id} item={item} />
          ))}
        </View>

        <Text style={styles.sectionTitle}>Featured Event</Text>
        <FeaturedEventCard />

        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.quickActionsGrid}>
          {quickActions.map((item) => (
            <QuickActionButton key={item.id} item={item} />
          ))}
        </View>

        <Text style={styles.sectionTitle}>Recent Registrations</Text>
        {recentRegistrations.map((item) => (
          <RegistrationCard key={item.id} item={item} />
        ))}

        <Text style={styles.sectionTitle}>Upcoming Events</Text>
        {upcomingEvents.map((item) => (
          <UpcomingEventCard key={item.id} item={item} />
        ))}

        <Text style={styles.sectionTitle}>AI Insight</Text>
        <AIInsightCard />
      </ScrollView>

      <Pressable style={styles.fab}>
        <Ionicons name="add" size={26} color={colors.onPrimary} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.lg,
    paddingBottom: 100,
  },

  // Header
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  avatarCircle: {
    width: 48,
    height: 48,
    borderRadius: radius.full,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: colors.onPrimary,
    fontFamily: typography.headlineMd.fontFamily,
    fontWeight: typography.labelMd.fontWeight,
    fontSize: 16,
  },
  greetingText: {
    fontFamily: typography.bodyMd.fontFamily,
    fontSize: typography.bodyMd.fontSize,
    color: colors.onSurfaceVariant,
  },
  nameText: {
    fontFamily: typography.headlineMd.fontFamily,
    fontSize: typography.headlineMd.fontSize,
    fontWeight: typography.headlineMd.fontWeight,
    color: colors.onSurface,
  },
  notificationButton: {
    width: 44,
    height: 44,
    borderRadius: radius.full,
    backgroundColor: colors.surfaceContainerLow,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notificationDot: {
    position: 'absolute',
    top: 10,
    right: 11,
    width: 8,
    height: 8,
    borderRadius: radius.full,
    backgroundColor: colors.error,
  },

  // Section title
  sectionTitle: {
    fontFamily: typography.headlineMd.fontFamily,
    fontSize: typography.headlineMd.fontSize,
    fontWeight: typography.headlineMd.fontWeight,
    color: colors.onSurface,
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },

  // Stats grid
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCard: {
    width: '48%',
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: radius.card,
    padding: spacing.md,
    marginBottom: spacing.sm,
    ...shadows.level2,
  },
  statIconChip: {
    width: 36,
    height: 36,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  statValue: {
    fontFamily: typography.headlineLgMobile.fontFamily,
    fontSize: typography.headlineLgMobile.fontSize,
    fontWeight: typography.headlineLgMobile.fontWeight,
    color: colors.onSurface,
  },
  statLabel: {
    fontFamily: typography.bodyMd.fontFamily,
    fontSize: typography.bodyMd.fontSize,
    color: colors.onSurfaceVariant,
    marginTop: 2,
  },

  // Featured event
  featuredCard: {
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: radius.card,
    overflow: 'hidden',
    ...shadows.level2,
  },
  featuredBanner: {
    height: 120,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  featuredBadge: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
    backgroundColor: colors.onPrimary,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: radius.chip,
  },
  featuredBadgeText: {
    fontFamily: typography.labelSm.fontFamily,
    fontSize: typography.labelSm.fontSize,
    fontWeight: typography.labelSm.fontWeight,
    color: colors.primary,
  },
  featuredBody: {
    padding: spacing.md,
  },
  featuredTitle: {
    fontFamily: typography.headlineMd.fontFamily,
    fontSize: typography.headlineMd.fontSize,
    fontWeight: typography.headlineMd.fontWeight,
    color: colors.onSurface,
    marginBottom: spacing.xs,
  },
  featuredMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  featuredMetaText: {
    fontFamily: typography.bodyMd.fontFamily,
    fontSize: typography.bodyMd.fontSize,
    color: colors.onSurfaceVariant,
    marginLeft: 4,
  },
  featuredMetaIconSpacer: {
    marginLeft: spacing.sm,
  },
  progressTrack: {
    height: 6,
    borderRadius: radius.full,
    backgroundColor: colors.surfaceContainerHigh,
    overflow: 'hidden',
    marginBottom: spacing.xs,
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: radius.full,
  },
  progressLabel: {
    fontFamily: typography.labelMd.fontFamily,
    fontSize: typography.labelMd.fontSize,
    color: colors.onSurfaceVariant,
  },

  // Quick actions
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  quickAction: {
    width: '31%',
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    alignItems: 'center',
    marginBottom: spacing.sm,
    ...shadows.level1,
  },
  quickActionIconWrap: {
    width: 40,
    height: 40,
    borderRadius: radius.full,
    backgroundColor: colors.surfaceContainerLow,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xs,
  },
  quickActionLabel: {
    fontFamily: typography.labelMd.fontFamily,
    fontSize: typography.labelMd.fontSize,
    color: colors.onSurface,
    textAlign: 'center',
  },

  // Registration cards
  registrationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: radius.md,
    padding: spacing.sm,
    marginBottom: spacing.sm,
    ...shadows.level1,
  },
  registrationAvatar: {
    width: 40,
    height: 40,
    borderRadius: radius.full,
    backgroundColor: colors.secondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  registrationAvatarText: {
    color: colors.onSecondary,
    fontFamily: typography.labelMd.fontFamily,
    fontSize: typography.labelMd.fontSize,
    fontWeight: typography.labelMd.fontWeight,
  },
  registrationInfo: {
    flex: 1,
  },
  registrationName: {
    fontFamily: typography.bodyMd.fontFamily,
    fontSize: typography.bodyMd.fontSize,
    fontWeight: '600',
    color: colors.onSurface,
  },
  registrationEvent: {
    fontFamily: typography.labelMd.fontFamily,
    fontSize: typography.labelMd.fontSize,
    color: colors.onSurfaceVariant,
  },
  registrationTime: {
    fontFamily: typography.labelSm.fontFamily,
    fontSize: typography.labelSm.fontSize,
    color: colors.onSurfaceVariant,
    marginTop: 2,
  },

  // Upcoming events
  upcomingCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: radius.md,
    padding: spacing.sm,
    marginBottom: spacing.sm,
    ...shadows.level1,
  },
  upcomingDateBlock: {
    width: 48,
    height: 48,
    borderRadius: radius.sm,
    backgroundColor: colors.surfaceContainerHigh,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  upcomingDateDay: {
    fontFamily: typography.labelMd.fontFamily,
    fontSize: typography.labelMd.fontSize,
    fontWeight: '700',
    color: colors.primary,
  },
  upcomingDateMonth: {
    fontFamily: typography.labelSm.fontFamily,
    fontSize: 10,
    color: colors.onSurfaceVariant,
  },
  upcomingInfo: {
    flex: 1,
  },
  upcomingName: {
    fontFamily: typography.bodyMd.fontFamily,
    fontSize: typography.bodyMd.fontSize,
    fontWeight: '600',
    color: colors.onSurface,
  },
  upcomingMeta: {
    fontFamily: typography.labelMd.fontFamily,
    fontSize: typography.labelMd.fontSize,
    color: colors.onSurfaceVariant,
  },
  upcomingSeats: {
    fontFamily: typography.labelSm.fontFamily,
    fontSize: typography.labelSm.fontSize,
    color: colors.onSurfaceVariant,
    marginTop: 2,
  },

  // Status chip (shared by registrations + upcoming events)
  statusChip: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: radius.chip,
  },
  statusChipText: {
    fontFamily: typography.labelSm.fontFamily,
    fontSize: typography.labelSm.fontSize,
    fontWeight: typography.labelSm.fontWeight,
  },

  // AI insight
  aiCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.secondaryContainer,
    borderRadius: radius.card,
    padding: spacing.md,
    ...shadows.level1,
  },
  aiIconWrap: {
    width: 40,
    height: 40,
    borderRadius: radius.full,
    backgroundColor: colors.secondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  aiText: {
    flex: 1,
    fontFamily: typography.bodyMd.fontFamily,
    fontSize: typography.bodyMd.fontSize,
    color: colors.onSecondaryContainer,
  },

  // FAB
  fab: {
    position: 'absolute',
    bottom: spacing.lg,
    right: spacing.lg,
    width: 56,
    height: 56,
    borderRadius: radius.full,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.interactive,
  },
});