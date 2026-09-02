import React, { useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { cleanupExpiredEvents } from '../../services/eventService';
import { ColorsType } from '../../theme/colors';
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

function initialsOf(name: string): string {
  return name
    .split(' ')
    .map((part) => part.charAt(0))
    .join('')
    .slice(0, 2)
    .toUpperCase();
}

function WelcomeHeader({ navigation }: { navigation: any }) {
  const { colors } = useTheme();
  const { user } = useAuth();
  const styles = getStyles(colors);

  const displayName = user?.name || 'Organizer';
  const initials = initialsOf(displayName);

  return (
    <View style={styles.headerRow}>
      <TouchableOpacity 
        style={styles.headerLeft} 
        onPress={() => navigation.openDrawer()}
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={[colors.secondary, colors.tertiary, colors.primary]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.avatarCircle}
        >
          <Text style={styles.avatarText}>{initials}</Text>
        </LinearGradient>
        <View>
          <Text style={styles.greetingText}>Good afternoon,</Text>
          <Text style={styles.nameText}>{displayName}</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity 
        style={styles.notificationButton}
        onPress={() => navigation.navigate('Notifications')}
        activeOpacity={0.8}
      >
        <Ionicons name="notifications-outline" size={22} color={colors.onSurface} />
        <View style={styles.notificationDot} />
      </TouchableOpacity>
    </View>
  );
}

function StatCard({ item }: { item: StatCardData }) {
  const { colors } = useTheme();
  const styles = getStyles(colors);

  return (
    <View style={styles.statCard}>
      <View style={[styles.statIconChip, { backgroundColor: `${item.tint}12` }]}>
        <Ionicons name={item.icon} size={18} color={item.tint} />
      </View>
      <Text style={styles.statValue}>{item.value}</Text>
      <Text style={styles.statLabel}>{item.label}</Text>
    </View>
  );
}

function FeaturedEventCard() {
  const { colors } = useTheme();
  const styles = getStyles(colors);
  const progress = 0.72;

  return (
    <View style={styles.featuredCard}>
      <LinearGradient
        colors={[colors.secondary, colors.tertiary, colors.primary]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.featuredBanner}
      >
        <Ionicons name="trophy-outline" size={30} color="#ffffff" />
        <View style={styles.featuredBadge}>
          <Text style={styles.featuredBadgeText}>Live</Text>
        </View>
      </LinearGradient>
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

function QuickActionButton({ item, navigation }: { item: QuickAction; navigation: any }) {
  const { colors } = useTheme();
  const styles = getStyles(colors);

  const handlePress = () => {
    if (item.label === 'Create Event') {
      navigation.navigate('CreateEventDetails');
    } else if (item.label === 'Announcements' || item.label === 'Participants') {
      navigation.navigate('Notifications');
    } else if (item.label === 'Analytics' || item.label === 'Manage Events') {
      navigation.navigate('Settings');
    }
  };

  return (
    <Pressable style={styles.quickAction} onPress={handlePress}>
      <View style={styles.quickActionIconWrap}>
        <Ionicons name={item.icon} size={20} color={colors.secondary} />
      </View>
      <Text style={styles.quickActionLabel}>{item.label}</Text>
    </Pressable>
  );
}

function RegistrationCard({ item }: { item: RegistrationItem }) {
  const { colors } = useTheme();
  const styles = getStyles(colors);

  const registrationStatusColor = (status: RegistrationItem['status']): string => {
    if (status === 'Confirmed') return colors.secondary;
    if (status === 'Pending') return colors.primary;
    return colors.error;
  };

  const chipColor = registrationStatusColor(item.status);
  return (
    <View style={styles.registrationCard}>
      <View style={[styles.registrationAvatar, { backgroundColor: `${colors.secondary}12` }]}>
        <Text style={styles.registrationAvatarText}>{initialsOf(item.studentName)}</Text>
      </View>
      <View style={styles.registrationInfo}>
        <Text style={styles.registrationName}>{item.studentName}</Text>
        <Text style={styles.registrationEvent}>{item.eventName}</Text>
        <Text style={styles.registrationTime}>{item.time}</Text>
      </View>
      <View style={[styles.statusChip, { backgroundColor: `${chipColor}12` }]}>
        <Text style={[styles.statusChipText, { color: chipColor }]}>{item.status}</Text>
      </View>
    </View>
  );
}

function UpcomingEventCard({ item }: { item: UpcomingEventItem }) {
  const { colors } = useTheme();
  const styles = getStyles(colors);

  const eventStatusColor = (status: UpcomingEventItem['status']): string => {
    if (status === 'Open') return colors.secondary;
    if (status === 'Filling Fast') return colors.primary;
    return colors.error;
  };

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
      <View style={[styles.statusChip, { backgroundColor: `${chipColor}12` }]}>
        <Text style={[styles.statusChipText, { color: chipColor }]}>{item.status}</Text>
      </View>
    </View>
  );
}

function AIInsightCard() {
  const { colors } = useTheme();
  const styles = getStyles(colors);

  return (
    <View style={styles.aiCard}>
      <LinearGradient
        colors={[colors.secondary, colors.tertiary]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.aiIconWrap}
      >
        <Ionicons name="sparkles-outline" size={20} color="#ffffff" />
      </LinearGradient>
      <Text style={styles.aiText}>
        AI predicts a high turnout for your upcoming Hackathon based on current registration pace.
      </Text>
    </View>
  );
}

export default function OrganizerDashboard({ navigation }: { navigation: any }) {
  const { colors, isDark } = useTheme();
  const styles = getStyles(colors);

  useEffect(() => {
    // Automatically purge expired events older than 2 days
    cleanupExpiredEvents();
  }, []);

  const stats: StatCardData[] = [
    { id: '1', label: 'Total Events', value: '18', icon: 'calendar-outline', tint: colors.primary },
    { id: '2', label: 'Active Events', value: '5', icon: 'flash-outline', tint: colors.tertiary },
    { id: '3', label: 'Registrations', value: '742', icon: 'people-outline', tint: colors.secondary },
    { id: '4', label: 'Revenue', value: '₹28.4K', icon: 'wallet-outline', tint: colors.primary },
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

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <WelcomeHeader navigation={navigation} />

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
            <QuickActionButton key={item.id} item={item} navigation={navigation} />
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

      <TouchableOpacity 
        style={[styles.fabContainer, styles.fab, { backgroundColor: colors.secondary }]} 
        onPress={() => navigation.navigate('CreateEventDetails')}
        activeOpacity={0.8}
      >
        <Ionicons name="add" size={26} color="#ffffff" />
      </TouchableOpacity>
    </View>
  );
}

const getStyles = (colors: ColorsType) => StyleSheet.create({
  screen: {
    flex: 1,
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
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
  greetingText: {
    ...typography.bodyMd,
    color: colors.onSurfaceVariant,
  },
  nameText: {
    ...typography.headlineMd,
    fontWeight: '700',
    color: colors.onSurface,
  },
  notificationButton: {
    width: 44,
    height: 44,
    borderRadius: radius.full,
    backgroundColor: colors.surfaceContainerLow,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.outlineVariant,
  },
  notificationDot: {
    position: 'absolute',
    top: 10,
    right: 11,
    width: 8,
    height: 8,
    borderRadius: radius.full,
    backgroundColor: colors.tertiary,
  },

  // Section title
  sectionTitle: {
    ...typography.headlineMd,
    fontWeight: '700',
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
    backgroundColor: colors.surface,
    borderRadius: radius.card,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    ...shadows.level1,
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
    ...typography.headlineLgMobile,
    fontWeight: '700',
    color: colors.onSurface,
  },
  statLabel: {
    ...typography.bodyMd,
    color: colors.onSurfaceVariant,
    marginTop: 2,
  },

  // Featured event
  featuredCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.card,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    ...shadows.level1,
  },
  featuredBanner: {
    height: 120,
    alignItems: 'center',
    justifyContent: 'center',
  },
  featuredBadge: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: radius.chip,
    borderWidth: 1,
    borderColor: '#ffffff',
  },
  featuredBadgeText: {
    ...typography.labelSm,
    fontWeight: '700',
    color: '#ffffff',
  },
  featuredBody: {
    padding: spacing.md,
  },
  featuredTitle: {
    ...typography.headlineMd,
    fontWeight: '700',
    color: colors.onSurface,
    marginBottom: spacing.xs,
  },
  featuredMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  featuredMetaText: {
    ...typography.bodyMd,
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
    backgroundColor: colors.secondary,
    borderRadius: radius.full,
  },
  progressLabel: {
    ...typography.labelMd,
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
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    alignItems: 'center',
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
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
    ...typography.labelMd,
    color: colors.onSurface,
    textAlign: 'center',
  },

  // Registration cards
  registrationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.sm,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    ...shadows.level1,
  },
  registrationAvatar: {
    width: 40,
    height: 40,
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  registrationAvatarText: {
    ...typography.labelMd,
    fontWeight: '700',
  },
  registrationInfo: {
    flex: 1,
  },
  registrationName: {
    ...typography.bodyMd,
    fontWeight: '700',
    color: colors.onSurface,
  },
  registrationEvent: {
    ...typography.labelMd,
    color: colors.onSurfaceVariant,
  },
  registrationTime: {
    ...typography.labelSm,
    color: colors.onSurfaceVariant,
    marginTop: 2,
  },

  // Upcoming events
  upcomingCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.sm,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    ...shadows.level1,
  },
  upcomingDateBlock: {
    width: 48,
    height: 48,
    borderRadius: radius.sm,
    backgroundColor: colors.surfaceContainerLow,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
  },
  upcomingDateDay: {
    ...typography.labelMd,
    fontWeight: '700',
  },
  upcomingDateMonth: {
    ...typography.labelSm,
    fontSize: 10,
    color: colors.onSurfaceVariant,
  },
  upcomingInfo: {
    flex: 1,
  },
  upcomingName: {
    ...typography.bodyMd,
    fontWeight: '700',
    color: colors.onSurface,
  },
  upcomingMeta: {
    ...typography.labelMd,
    color: colors.onSurfaceVariant,
  },
  upcomingSeats: {
    ...typography.labelSm,
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
    ...typography.labelSm,
    fontWeight: '700',
  },

  // AI insight
  aiCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.secondaryContainer,
    borderRadius: radius.card,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: `${colors.secondary}1a`,
    ...shadows.level1,
  },
  aiIconWrap: {
    width: 40,
    height: 40,
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  aiText: {
    flex: 1,
    ...typography.bodyMd,
    color: colors.onSecondaryContainer,
    lineHeight: 18,
  },

  // FAB
  fabContainer: {
    position: 'absolute',
    bottom: spacing.lg,
    right: spacing.lg,
    width: 56,
    height: 56,
    borderRadius: radius.full,
    ...shadows.interactive,
  },
  fab: {
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
});