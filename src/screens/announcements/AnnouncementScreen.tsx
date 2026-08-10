import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { radius } from '../../theme/radius';
import { typography } from '../../theme/fonts';
import { shadows } from '../../theme/shadows';

// --- DATA STRUCTURES & MOCK DATA ---

interface Announcement {
  id: string;
  title: string;
  datetime: string;
  content: string;
  type: 'important' | 'update' | 'reminder' | 'success' | 'new';
  isPinned?: boolean;
}

const EVENT_DETAILS = {
  title: 'Symphony of Lights Music Festival',
  organizer: 'Encore Productions',
  organizerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200',
  bannerImage: 'https://images.unsplash.com/photo-1506157786151-b8491531f063?q=80&w=800',
};

const MOCK_ANNOUNCEMENTS: Announcement[] = [
  {
    id: 'ann-0',
    title: 'URGENT: Entrance gate C is closed',
    datetime: '2 hours ago',
    content: 'Due to road construction near Gate C, all attendees must enter via Gates A and B. Scanning begins at 17:00. Please arrive early to avoid lines.',
    type: 'important',
    isPinned: true,
  },
  {
    id: 'ann-1',
    title: 'Set Times & Stage Schedule Released',
    datetime: 'Oct 22 • 10:00 AM',
    content: 'The official schedule is now live! Main stage starts at 18:30 with support acts. Headliner performance begins at 21:00 sharp. Check details in your app.',
    type: 'new',
  },
  {
    id: 'ann-2',
    title: 'Cashless Venue Policy Reminder',
    datetime: 'Oct 19 • 02:30 PM',
    content: 'Please note that Grand Arena is a fully cashless venue. Food, beverages, and merchandise stands will only accept credit/debit cards, Apple Pay, and Google Pay.',
    type: 'reminder',
  },
  {
    id: 'ann-3',
    title: 'Registration Verification Success',
    datetime: 'Oct 15 • 09:00 AM',
    content: 'Your digital festival pass has been verified and securely loaded onto your profile. Have your barcode ready on your mobile screen for contact-free scan at entry.',
    type: 'success',
  },
];

export default function AnnouncementScreen() {
  const insets = useSafeAreaInsets();
  const [showEmptyState, setShowEmptyState] = useState(false);
  const [pinnedDismissed, setPinnedDismissed] = useState(false);

  // --- ACTIONS ---
  const handleBackPress = () => {
    Alert.alert('Navigation', 'Back button pressed (Visual Only).');
  };

  const handleSettingsPress = () => {
    Alert.alert('Settings', 'Notification preferences for this event.');
  };

  const toggleSimulateEmpty = () => {
    setShowEmptyState((prev) => !prev);
  };

  // Get active announcements excluding/including pinned
  const activeAnnouncements = showEmptyState ? [] : MOCK_ANNOUNCEMENTS;
  const pinnedAnnouncement = activeAnnouncements.find((a) => a.isPinned) && !pinnedDismissed ? activeAnnouncements.find((a) => a.isPinned) : null;
  const timelineAnnouncements = activeAnnouncements.filter((a) => !a.isPinned || (a.isPinned && pinnedDismissed));

  // Helper for priority badges
  const getBadgeStyle = (type: Announcement['type']) => {
    switch (type) {
      case 'important':
        return {
          bg: colors.errorContainer,
          text: colors.error,
          label: 'IMPORTANT',
        };
      case 'new':
        return {
          bg: colors.primaryContainer + '20',
          text: colors.primary,
          label: 'NEW',
        };
      case 'reminder':
        return {
          bg: colors.secondaryContainer + '20',
          text: colors.secondary,
          label: 'REMINDER',
        };
      case 'success':
        return {
          bg: colors.tertiaryContainer + '20',
          text: colors.tertiary,
          label: 'VERIFIED',
        };
      default:
        return {
          bg: colors.slate[100],
          text: colors.slate[600],
          label: 'UPDATE',
        };
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + spacing.sm }]}>
        <TouchableOpacity style={styles.backButton} onPress={handleBackPress}>
          <Feather name="arrow-left" size={24} color={colors.onBackground} />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>Updates & Alerts</Text>
        <TouchableOpacity style={styles.actionButton} onPress={handleSettingsPress}>
          <Feather name="settings" size={20} color={colors.onBackground} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Simulation Toggle Widget */}
        <View style={styles.simulationWidget}>
          <Text style={styles.simulationText}>Simulate Empty State:</Text>
          <TouchableOpacity
            style={[styles.simToggle, showEmptyState && styles.simToggleActive]}
            onPress={toggleSimulateEmpty}
          >
            <Text style={[styles.simToggleText, showEmptyState && styles.simToggleTextActive]}>
              {showEmptyState ? 'Empty ON' : 'Empty OFF'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Event Banner card */}
        <View style={styles.eventBannerCard}>
          <Image source={{ uri: EVENT_DETAILS.bannerImage }} style={styles.eventImage} />
          <View style={styles.bannerGradient} />
          <View style={styles.eventDetailsRow}>
            <Image source={{ uri: EVENT_DETAILS.organizerAvatar }} style={styles.organizerAvatar} />
            <View style={styles.eventTextContainer}>
              <Text style={styles.eventTitle} numberOfLines={1}>
                {EVENT_DETAILS.title}
              </Text>
              <Text style={styles.eventOrganizer}>
                Organized by {EVENT_DETAILS.organizer}
              </Text>
            </View>
          </View>
        </View>

        {/* Upcoming Reminder Box */}
        {!showEmptyState && (
          <View style={styles.reminderBanner}>
            <View style={styles.reminderIconCircle}>
              <Feather name="bell" size={16} color={colors.primary} />
            </View>
            <View style={styles.reminderTextContainer}>
              <Text style={styles.reminderTitle}>Quick Reminder</Text>
              <Text style={styles.reminderContent}>
                Gates open tomorrow at 17:00. Make sure to download your ticket barcode.
              </Text>
            </View>
          </View>
        )}

        {/* Empty State vs List */}
        {activeAnnouncements.length === 0 ? (
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIconCircle}>
              <Feather name="check-circle" size={44} color={colors.primary} />
            </View>
            <Text style={styles.emptyTitle}>You're all caught up</Text>
            <Text style={styles.emptySubtext}>
              When organizers post set schedule updates, parking alerts, or gate announcements, they will appear here.
            </Text>
          </View>
        ) : (
          <View style={styles.announcementsBody}>
            {/* Pinned Announcement Card */}
            {pinnedAnnouncement && (
              <View style={styles.pinnedSection}>
                <View style={styles.sectionHeaderRow}>
                  <Text style={styles.sectionTitle}>Pinned Notice</Text>
                  <TouchableOpacity onPress={() => setPinnedDismissed(true)}>
                    <Text style={styles.dismissText}>Dismiss</Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.pinnedCard}>
                  <View style={styles.pinnedHeader}>
                    <View style={styles.pinnedIconRow}>
                      <Ionicons name="pin" size={16} color={colors.error} style={styles.pinIcon} />
                      <Text style={styles.pinnedLabel}>CRITICAL UPDATE</Text>
                    </View>
                    <Text style={styles.pinnedTime}>{pinnedAnnouncement.datetime}</Text>
                  </View>
                  <Text style={styles.pinnedTitle}>{pinnedAnnouncement.title}</Text>
                  <Text style={styles.pinnedContent}>{pinnedAnnouncement.content}</Text>
                </View>
              </View>
            )}

            {/* Latest Updates Section / Timeline */}
            <View style={styles.timelineSection}>
              <Text style={styles.sectionTitle}>Latest Timeline Updates</Text>

              <View style={styles.timelineContainer}>
                {/* Timeline vertical bar */}
                <View style={styles.verticalBar} />

                {timelineAnnouncements.map((ann, index) => {
                  const badge = getBadgeStyle(ann.type);
                  return (
                    <View key={ann.id} style={styles.timelineItem}>
                      {/* Left timeline indicator circle */}
                      <View style={[styles.timelineDotCircle, index === 0 && styles.timelineDotCircleActive]}>
                        <View style={[styles.timelineDotInner, index === 0 && styles.timelineDotInnerActive]} />
                      </View>

                      {/* Content block */}
                      <View style={styles.timelineCard}>
                        <View style={styles.cardHeaderRow}>
                          <View style={[styles.priorityBadge, { backgroundColor: badge.bg }]}>
                            <Text style={[styles.priorityBadgeText, { color: badge.text }]}>
                              {badge.label}
                            </Text>
                          </View>
                          <Text style={styles.annTime}>{ann.datetime}</Text>
                        </View>

                        <Text style={styles.annTitle}>{ann.title}</Text>
                        <Text style={styles.annContent}>{ann.content}</Text>
                      </View>
                    </View>
                  );
                })}
              </View>
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

// --- STYLE SHEET CREATION ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.margin,
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
    borderColor: colors.outlineVariant,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: radius.full,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  headerTitle: {
    ...typography.headlineMd,
    fontWeight: '700',
    color: colors.onBackground,
    flex: 1,
    textAlign: 'center',
  },
  actionButton: {
    width: 44,
    height: 44,
    borderRadius: radius.full,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  scrollContainer: {
    paddingHorizontal: spacing.margin,
    paddingTop: spacing.md,
    paddingBottom: spacing.xxl,
  },
  simulationWidget: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surfaceContainerLowest,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
  },
  simulationText: {
    ...typography.labelMd,
    color: colors.onSurface,
    fontWeight: '600',
  },
  simToggle: {
    backgroundColor: colors.slate[200],
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    borderRadius: radius.chip * 2,
  },
  simToggleActive: {
    backgroundColor: colors.primaryContainer,
  },
  simToggleText: {
    ...typography.labelSm,
    color: colors.slate[700],
    fontWeight: '700',
  },
  simToggleTextActive: {
    color: colors.onPrimaryContainer,
  },
  eventBannerCard: {
    height: 120,
    borderRadius: radius.card,
    overflow: 'hidden',
    backgroundColor: colors.surfaceContainerLow,
    marginBottom: spacing.md,
    ...shadows.level1,
  },
  eventImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  bannerGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
  },
  eventDetailsRow: {
    position: 'absolute',
    bottom: spacing.md,
    left: spacing.md,
    right: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
  },
  organizerAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: colors.surfaceContainerLowest,
    marginRight: spacing.sm,
  },
  eventTextContainer: {
    flex: 1,
  },
  eventTitle: {
    ...typography.labelMd,
    fontSize: 15,
    fontWeight: '700',
    color: colors.surfaceContainerLowest,
    marginBottom: 2,
  },
  eventOrganizer: {
    ...typography.labelSm,
    color: colors.slate[300],
    fontSize: 10,
  },
  reminderBanner: {
    flexDirection: 'row',
    backgroundColor: colors.primaryContainer + '10',
    borderWidth: 1,
    borderColor: colors.primaryContainer + '30',
    borderRadius: radius.card - 4,
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  reminderIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primaryContainer + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  reminderTextContainer: {
    flex: 1,
  },
  reminderTitle: {
    ...typography.labelMd,
    color: colors.primary,
    fontWeight: '700',
    marginBottom: 2,
  },
  reminderContent: {
    ...typography.bodyMd,
    fontSize: 12,
    color: colors.onSurfaceVariant,
    lineHeight: 16,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xxl,
    paddingHorizontal: spacing.lg,
  },
  emptyIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primaryContainer + '15',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  emptyTitle: {
    ...typography.headlineMd,
    fontSize: 18,
    color: colors.onSurface,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  emptySubtext: {
    ...typography.bodyMd,
    color: colors.onSurfaceVariant,
    textAlign: 'center',
    lineHeight: 20,
  },
  announcementsBody: {
    gap: spacing.lg,
  },
  pinnedSection: {
    marginBottom: spacing.sm,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  sectionTitle: {
    ...typography.headlineMd,
    fontSize: 16,
    color: colors.onSurface,
    fontWeight: '700',
  },
  dismissText: {
    ...typography.labelMd,
    color: colors.onSurfaceVariant,
    fontWeight: '600',
  },
  pinnedCard: {
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: radius.card - 2,
    borderWidth: 1.5,
    borderColor: colors.primaryContainer,
    padding: spacing.md,
    ...shadows.level2,
  },
  pinnedHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  pinnedIconRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pinIcon: {
    marginRight: 4,
  },
  pinnedLabel: {
    ...typography.labelSm,
    color: colors.error,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  pinnedTime: {
    ...typography.labelSm,
    fontSize: 10,
    color: colors.onSurfaceVariant,
  },
  pinnedTitle: {
    ...typography.headlineMd,
    fontSize: 15,
    color: colors.onSurface,
    fontWeight: '700',
    marginBottom: spacing.xs,
  },
  pinnedContent: {
    ...typography.bodyMd,
    color: colors.onSurfaceVariant,
    lineHeight: 20,
  },
  timelineSection: {
    position: 'relative',
  },
  timelineContainer: {
    position: 'relative',
    marginTop: spacing.md,
  },
  verticalBar: {
    position: 'absolute',
    left: 8,
    top: 10,
    bottom: 20,
    width: 2,
    backgroundColor: colors.outlineVariant,
  },
  timelineItem: {
    flexDirection: 'row',
    marginBottom: spacing.lg,
  },
  timelineDotCircle: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: colors.background,
    borderWidth: 2,
    borderColor: colors.outline,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
    marginTop: 12,
  },
  timelineDotCircleActive: {
    borderColor: colors.primary,
  },
  timelineDotInner: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.outline,
  },
  timelineDotInnerActive: {
    backgroundColor: colors.primary,
  },
  timelineCard: {
    flex: 1,
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: radius.card - 4,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    padding: spacing.md,
    marginLeft: spacing.md,
    ...shadows.level1,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  priorityBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radius.tag,
  },
  priorityBadgeText: {
    ...typography.labelSm,
    fontSize: 9,
    fontWeight: '700',
  },
  annTime: {
    ...typography.labelSm,
    fontSize: 10,
    color: colors.onSurfaceVariant,
  },
  annTitle: {
    ...typography.headlineMd,
    fontSize: 15,
    color: colors.onSurface,
    fontWeight: '700',
    marginBottom: 4,
  },
  annContent: {
    ...typography.bodyMd,
    fontSize: 13,
    color: colors.onSurfaceVariant,
    lineHeight: 18,
  },
});
